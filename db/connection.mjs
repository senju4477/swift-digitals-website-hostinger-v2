import mysql from "mysql2/promise";

export class DatabaseConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseConfigurationError";
    this.code = "DB_CONFIGURATION";
  }
}

export function databaseOptions(environment = process.env) {
  const required = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
  const missing = required.filter((key) => !environment[key]);
  if (missing.length) {
    throw new DatabaseConfigurationError(`Missing database settings: ${missing.join(", ")}`);
  }
  const portText = environment.DB_PORT ?? "3306";
  if (!/^\d+$/.test(portText) || Number(portText) < 1 || Number(portText) > 65535) {
    throw new DatabaseConfigurationError("DB_PORT must be an integer from 1 to 65535.");
  }
  return {
    host: environment.DB_HOST,
    port: Number(portText),
    user: environment.DB_USER,
    password: environment.DB_PASSWORD,
    database: environment.DB_NAME,
    charset: "utf8mb4",
    timezone: "Z",
    dateStrings: true,
    connectionLimit: 5,
    waitForConnections: true,
    queueLimit: 20,
    connectTimeout: 5000,
    enableKeepAlive: true,
  };
}

/** @type {import('mysql2/promise').Pool | undefined} */
let pool;
export function getPool() {
  pool ??= mysql.createPool(databaseOptions());
  return pool;
}
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
