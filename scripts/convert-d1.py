#!/usr/bin/env python3
"""Offline: convert a read-only D1 schema+data SQL export to a MySQL import.

Uses only Python's standard library. Never connects to either database.
"""
import argparse
import datetime as dt
import hashlib
import json
from pathlib import Path
import re
import sqlite3

COLUMNS = ["id", "name", "email", "phone", "website", "service", "message", "created_at"]
LIMITS = {"id": 36, "name": 100, "email": 254, "phone": 40, "website": 500, "service": 64, "message": 65535}


def utc_timestamp(value):
    if not isinstance(value, str):
        raise ValueError("created_at must be a timestamp string")
    fraction = re.search(r"\.(\d+)", value)
    if fraction and len(fraction[1]) > 6 and any(char != "0" for char in fraction[1][6:]):
        raise ValueError("timestamp precision exceeds MySQL DATETIME(6); manual review required")
    parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo:
        parsed = parsed.astimezone(dt.timezone.utc).replace(tzinfo=None)
    if parsed.year < 1000:
        raise ValueError("timestamp is outside the supported MySQL range")
    return parsed.isoformat(sep=" ", timespec="microseconds")


def hex_string(value):
    # Handles quotes, backslashes, newlines, emoji and arbitrary UTF-8 safely.
    return "CONVERT(X'" + value.encode("utf-8").hex() + "' USING utf8mb4)"


def run(args):
    exported_at = dt.datetime.fromisoformat(args.exported_at.replace("Z", "+00:00"))
    if exported_at.tzinfo is None:
        raise ValueError("--exported-at must include a UTC offset or Z")
    exported_at = exported_at.astimezone(dt.timezone.utc).isoformat()
    source_path = args.input.resolve()
    output_path = args.output.resolve()
    if source_path == output_path:
        raise ValueError("The output must not overwrite the original export")
    source_bytes = source_path.read_bytes()
    source_hash = hashlib.sha256(source_bytes).hexdigest()
    connection = sqlite3.connect(":memory:")
    connection.enable_load_extension(False)
    # A supplied SQL export cannot attach local files or enable extension loads.
    connection.set_authorizer(lambda action, *_: sqlite3.SQLITE_DENY if action in
                              (sqlite3.SQLITE_ATTACH, sqlite3.SQLITE_DETACH) else sqlite3.SQLITE_OK)
    try:
        connection.executescript(source_bytes.decode("utf-8-sig"))
        rows = connection.execute("SELECT " + ",".join(COLUMNS) + " FROM enquiries ORDER BY id").fetchall()
    finally:
        connection.close()
    converted = []
    ids = set()
    for row in rows:
        record = dict(zip(COLUMNS, row))
        if any(not isinstance(value, str) for value in row):
            raise ValueError("Unexpected NULL/non-text value; manual review required")
        if record["id"] in ids or not record["id"]:
            raise ValueError("Duplicate or empty enquiry ID")
        ids.add(record["id"])
        for key, limit in LIMITS.items():
            if len(record[key]) > limit:
                raise ValueError(f"{key} exceeds the target column limit; no output was written")
        if len(record["message"].encode("utf-8")) > 65535:
            raise ValueError("message exceeds the target TEXT byte limit")
        record["created_at"] = utc_timestamp(record["created_at"])
        converted.append(record)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    backup = output_path.parent / ("d1-source-" + source_hash[:12] + ".sql")
    if backup.exists() and backup.read_bytes() != source_bytes:
        raise ValueError("Backup name already exists with different contents")
    if backup != source_path:
        backup.write_bytes(source_bytes)
    cols = ", ".join(COLUMNS)
    equal = " AND ".join(f"BINARY t.{key} <=> BINARY s.{key}" for key in COLUMNS[:-1]) + " AND t.created_at <=> s.created_at"
    lines = [
        "-- Contains personal information: keep private; never commit or put in public_html.",
        f"-- Read-only D1 export timestamp UTC: {exported_at}",
        f"-- Source SHA256: {source_hash}; exported enquiries: {len(converted)}",
        "-- Select ONLY the new v2 MySQL database in phpMyAdmin before importing.",
        "SET NAMES utf8mb4;", "SET time_zone = '+00:00';",
        "SET SESSION sql_mode = CONCAT(@@SESSION.sql_mode, ',STRICT_ALL_TABLES');",
        "DROP TEMPORARY TABLE IF EXISTS swift_d1_import;",
        "CREATE TEMPORARY TABLE swift_d1_import LIKE enquiries;",
        "DROP TEMPORARY TABLE IF EXISTS swift_d1_guard;",
        "CREATE TEMPORARY TABLE swift_d1_guard (valid TINYINT NOT NULL) ENGINE=InnoDB;",
        "START TRANSACTION;",
    ]
    for record in converted:
        values = ", ".join(hex_string(record[key]) for key in COLUMNS)
        lines.append(f"INSERT INTO swift_d1_import ({cols}) VALUES ({values});")
    lines.extend([
        "-- Reject conflicting existing IDs rather than silently overwriting them.",
        f"INSERT INTO swift_d1_guard (valid) SELECT NULL FROM swift_d1_import s JOIN enquiries t ON t.id=s.id WHERE NOT ({equal});",
        f"INSERT INTO enquiries ({cols}) SELECT " + ", ".join("s." + key for key in COLUMNS) +
        " FROM swift_d1_import s LEFT JOIN enquiries t ON t.id=s.id WHERE t.id IS NULL;",
        "-- Before COMMIT: matching_records must equal the export count; mismatches must be zero.",
        f"SELECT {len(converted)} AS exported_records, COUNT(*) AS matching_records FROM swift_d1_import s JOIN enquiries t ON t.id=s.id WHERE {equal};",
        f"SELECT COUNT(*) AS mismatched_records FROM swift_d1_import s LEFT JOIN enquiries t ON t.id=s.id WHERE t.id IS NULL OR NOT ({equal});",
        "COMMIT;", "DROP TEMPORARY TABLE swift_d1_import;", "DROP TEMPORARY TABLE swift_d1_guard;", "",
    ])
    output_path.write_text("\n".join(lines), encoding="utf-8")
    digest = hashlib.sha256(json.dumps(converted, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
    manifest = {"source_exported_at_utc": exported_at, "converted_at_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
                "source_sha256": source_hash, "converted_records_sha256": digest, "record_count": len(converted),
                "first_id": converted[0]["id"] if converted else None, "last_id": converted[-1]["id"] if converted else None,
                "source_backup": backup.name, "mysql_import": output_path.name,
                "timestamp_policy": "SQLite naive timestamps interpreted as UTC; explicit offsets normalized to UTC, microseconds preserved",
                "merge_policy": "insert missing IDs; reject differing records for existing IDs; do not update or delete"}
    output_path.with_suffix(".manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Converted {len(converted)} enquiries. Export UTC: {exported_at}. Source backup and manifest saved.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True, help="Read-only D1 schema+data SQL export")
    parser.add_argument("--output", type=Path, required=True, help="Private output path, e.g. backups/enquiries.mysql.sql")
    parser.add_argument("--exported-at", required=True, help="Actual export timestamp with offset, e.g. 2026-10-01T15:30:00Z")
    try:
        run(parser.parse_args())
    except (ValueError, OSError, sqlite3.Error) as error:
        raise SystemExit(f"Conversion failed: {error}") from None
