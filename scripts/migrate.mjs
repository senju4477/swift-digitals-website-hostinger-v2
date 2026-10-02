import { getPool, closePool, DatabaseConfigurationError } from "../db/connection.mjs";
import { readMigrations, trackerSql } from "./migration-files.mjs";

let connection;
try {
  connection = await getPool().getConnection();
  await connection.query("SET time_zone = '+00:00'");
  const [locks] = await connection.query("SELECT GET_LOCK('swift_digitals_v2_migration', 15) AS acquired");
  if (Number(locks[0].acquired) !== 1) throw new Error("Another migration is running.");
  await connection.query(trackerSql);
  for (const migration of await readMigrations()) {
    const [existing] = await connection.execute("SELECT checksum FROM app_schema_migrations WHERE id = ?", [migration.id]);
    if (existing.length) {
      if (existing[0].checksum !== migration.checksum) throw new Error(`Applied migration was changed: ${migration.id}`);
      console.log(`Already applied: ${migration.id}`);
      continue;
    }
    // MySQL DDL commits implicitly. Reviewed migrations must be rerunnable after
    // partial failure; do not claim an all-or-nothing schema transaction.
    for (const statement of migration.statements) await connection.query(statement);
    await connection.execute("INSERT INTO app_schema_migrations (id, checksum) VALUES (?, ?)", [migration.id, migration.checksum]);
    console.log(`Applied: ${migration.id}`);
  }
} catch (error) {
  console.error(error instanceof DatabaseConfigurationError ? error.message
    : typeof error?.message === "string" && /^(Another migration|Applied migration)/.test(error.message) ? error.message
    : `Migration failed (${error?.code ?? "DATABASE_ERROR"}); inspect database permissions/schema. No automatic rollback of DDL.`);
  process.exitCode = 1;
} finally {
  if (connection) {
    await connection.query("SELECT RELEASE_LOCK('swift_digitals_v2_migration')").catch(() => {});
    connection.release();
  }
  await closePool();
}
