import { mkdir, writeFile } from "node:fs/promises";
import { readMigrations, trackerSql } from "./migration-files.mjs";

const lines = [
  "-- Import ONLY into the new v2 database using phpMyAdmin. Select that database first.",
  "-- DDL commits implicitly; stop on errors, fix the cause, then rerun this idempotent initial migration.",
  "SET NAMES utf8mb4;", "SET time_zone = '+00:00';",
  "SET SESSION sql_mode = CONCAT(@@SESSION.sql_mode, ',STRICT_ALL_TABLES');", `${trackerSql};`,
];
for (const migration of await readMigrations()) {
  lines.push(`-- ${migration.id} SHA256 ${migration.checksum}`,
    // Strict mode makes a checksum mismatch fail before executing this version.
    `UPDATE app_schema_migrations SET checksum = IF(checksum = '${migration.checksum}', checksum, NULL) WHERE id = '${migration.id}';`,
    ...migration.statements.map((sql) => `${sql};`),
    `INSERT INTO app_schema_migrations (id, checksum) VALUES ('${migration.id}', '${migration.checksum}') ON DUPLICATE KEY UPDATE id = id;`);
}
lines.push("SELECT id, checksum, applied_at FROM app_schema_migrations ORDER BY id;", "");
const output = new URL("../deploy/schema.mysql.sql", import.meta.url);
await mkdir(new URL("../deploy/", import.meta.url), { recursive: true });
await writeFile(output, lines.join("\n"));
console.log("Created deploy/schema.mysql.sql; no database connection was made.");
