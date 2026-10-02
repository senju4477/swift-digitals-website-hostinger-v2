import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";

export const trackerSql = `CREATE TABLE IF NOT EXISTS app_schema_migrations (
  id VARCHAR(191) NOT NULL PRIMARY KEY,
  checksum CHAR(64) NOT NULL,
  applied_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin`;

export async function readMigrations() {
  const directory = new URL("../migrations/mysql/", import.meta.url);
  const files = (await readdir(directory)).filter((name) => /^\d{4}_[a-z0-9_]+\.sql$/.test(name)).sort();
  return Promise.all(files.map(async (id) => {
    const content = await readFile(new URL(id, directory), "utf8");
    return { id, checksum: createHash("sha256").update(content).digest("hex"),
      statements: content.split("--> statement-breakpoint").map((part) => part.trim().replace(/;$/, "")).filter(Boolean) };
  }));
}
