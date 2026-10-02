import { drizzle } from "drizzle-orm/mysql2";
import { getPool } from "./connection.mjs";
import * as schema from "./schema";

// No connection or credential validation occurs on module import / page builds.
export function getDb() {
  return drizzle(getPool(), { schema, mode: "default" });
}
