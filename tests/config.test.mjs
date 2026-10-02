import test from "node:test";
import assert from "node:assert/strict";
import { databaseOptions, DatabaseConfigurationError } from "../db/connection.mjs";

const valid = { DB_HOST: "127.0.0.1", DB_USER: "isolated", DB_PASSWORD: "test-only", DB_NAME: "isolated_test" };
test("missing or incomplete database configuration fails without revealing secrets", () => {
  for (const options of [{}, { ...valid, DB_PASSWORD: "" }, { ...valid, DB_NAME: undefined }]) {
    assert.throws(() => databaseOptions(options), DatabaseConfigurationError);
  }
});
test("invalid database ports are rejected before connecting", () => {
  for (const DB_PORT of ["0", "65536", "3306oops", "-1", "", "3306.5"]) {
    assert.throws(() => databaseOptions({ ...valid, DB_PORT }), DatabaseConfigurationError);
  }
  assert.equal(databaseOptions(valid).port, 3306);
});
