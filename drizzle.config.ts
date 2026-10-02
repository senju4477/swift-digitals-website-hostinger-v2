import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle/generated-mysql",
  schema: "./db/schema.ts",
  dialect: "mysql",
});
