import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { randomUUID } from "node:crypto";
import { mkdir, mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { getPool, closePool } from "../db/connection.mjs";
import ts from "typescript";

if (process.env.ALLOW_TEST_WRITES !== "1" || !/^swift_test_[a-z0-9_]+$/.test(process.env.DB_NAME ?? "")) {
  throw new Error("Use an isolated DB_NAME beginning swift_test_ and ALLOW_TEST_WRITES=1. Never use a live database.");
}
const root = fileURLToPath(new URL("../", import.meta.url));
const runId = randomUUID().slice(0, 8);
const email = (label) => `${label}-${runId}@example.test`;
const makeData = (changes = {}) => ({ id: randomUUID(), name: "Synthetic Test", email: email("normal"), phone: "0400000000", website: "https://example.test", service: "Website design", message: "Synthetic integration enquiry.", company_url: "", ...changes });
const servers = [];
const results = [];
async function check(name, execute) {
  try { await execute(); results.push({ name, status: "passed" }); console.log(`PASS ${name}`); }
  catch (error) { results.push({ name, status: "failed", reason: error.message }); throw error; }
}
async function start(port, environment = process.env) {
  const child = spawn(process.execPath, ["scripts/start-standalone.mjs"], { cwd: root, env: { ...environment, PORT: String(port), HOSTNAME: "invalid-container-name" }, stdio: ["ignore", "pipe", "pipe"] });
  let logs = "";
  child.stdout.on("data", (chunk) => { logs += chunk; });
  child.stderr.on("data", (chunk) => { logs += chunk; });
  servers.push(child);
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 80; i++) {
    if (child.exitCode !== null) throw new Error(`Test server exited: ${logs}`);
    try { if ((await fetch(base)).ok) return { base, logs: () => logs }; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Test server did not start in 20 seconds.");
}
async function post(base, data, headers = {}) {
  return fetch(base + "/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: typeof data === "string" ? data : JSON.stringify(data) });
}
async function executeSql(connection, source) {
  // Test fixture SQL has only hex values and simple statements; no semicolons in strings.
  const clean = source.split("\n").filter((line) => !line.trim().startsWith("--")).join("\n");
  const output = [];
  for (const statement of clean.split(";").map((s) => s.trim()).filter(Boolean)) {
    const [rows] = await connection.query(statement);
    output.push(rows);
  }
  return output;
}
const pool = getPool();
let transferDirectory;
try {
  const migrated = spawnSync(process.execPath, ["scripts/migrate.mjs"], { cwd: root, env: process.env, encoding: "utf8" });
  assert.equal(migrated.status, 0, migrated.stdout + migrated.stderr);
  const second = spawnSync(process.execPath, ["scripts/migrate.mjs"], { cwd: root, env: process.env, encoding: "utf8" });
  assert.equal(second.status, 0, second.stdout + second.stderr);
  assert.match(second.stdout, /Already applied/);
  await check("versioned migrations run and rerun safely", async () => {
    const [rows] = await pool.query("SELECT id, checksum FROM app_schema_migrations");
    assert.equal(rows.length, 1); assert.match(rows[0].checksum, /^[a-f0-9]{64}$/);
  });
  await mkdir(root + "/test-results", { recursive: true });
  const port = Number(process.env.TEST_PORT ?? "3180");
  const { base } = await start(port);
  await check("non-default PORT and explicit 0.0.0.0 binding", async () => {
    const processTable = await readFile("/proc/net/tcp", "utf8");
    assert.match(processTable, new RegExp(`00000000:${port.toString(16).toUpperCase().padStart(4, "0")}.*0A`));
  });
  const routes = ["/", "/services", "/website-development", "/ndis-website-design", "/ecommerce-website-design", "/seo-digital-marketing", "/ai-automation", "/our-work", "/packages", "/about", "/contact", "/privacy"];
  await check("all 12 public routes, canonical URLs and JSON-LD", async () => {
    for (const path of routes) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200, path);
      assert.match(response.headers.get("x-robots-tag"), /noindex/);
      const html = await response.text();
      assert.match(html, new RegExp(`rel="canonical" href="https://swiftdigitals.au${path === "/" ? "/?" : path}"`));
      assert.match(html, /application\/ld\+json/); assert.match(html, /info@swiftdigitals\.com\.au/);
      assert.doesNotMatch(html, /walkersaint402\.chatgpt\.site/);
    }
    assert.equal((await fetch(base + "/unknown-test-route")).status, 404);
  });
  await check("static assets, sitemap and preview robots", async () => {
    for (const path of ["/assets/logo-original.png", "/assets/health-concept.webp", "/assets/store-concept.webp", "/assets/care-beyond-expectations-website.png", "/favicon.svg"]) assert.equal((await fetch(base + path)).status, 200, path);
    const sitemap = await (await fetch(base + "/sitemap.xml")).text();
    assert.equal((sitemap.match(/<loc>/g) ?? []).length, 12); assert.match(sitemap, /https:\/\/swiftdigitals.au/);
    assert.match(await (await fetch(base + "/robots.txt")).text(), /Disallow: \//);
  });
  const saved = makeData({ name: "O'Neil 🧡", message: "Unicode enquiry: Soomaali, العربية, café. SELECT 'quotes'; \\ path\nsecond line.", email: email("NORMAL").toUpperCase() });
  await check("genuine enquiries succeed only with durable, parameterized MySQL storage", async () => {
    const response = await post(base, saved); assert.equal(response.status, 201);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const [rows] = await pool.execute("SELECT * FROM enquiries WHERE id = ?", [saved.id]);
    assert.equal(rows.length, 1); assert.equal(rows[0].name, saved.name);
    assert.equal(rows[0].message, saved.message); assert.equal(rows[0].email, saved.email.toLowerCase());
    assert.ok(rows[0].created_at);
  });
  await check("idempotent retries and concurrent duplicate UUIDs", async () => {
    assert.equal((await post(base, saved)).status, 200);
    const duplicate = makeData({ email: email("duplicate") });
    const responses = await Promise.all(Array.from({ length: 10 }, () => post(base, duplicate)));
    assert.equal(responses.filter((r) => r.status === 201).length, 1);
    assert.equal(responses.filter((r) => r.status === 200).length, 9);
    const [rows] = await pool.execute("SELECT COUNT(*) AS total FROM enquiries WHERE id = ?", [duplicate.id]);
    assert.equal(Number(rows[0].total), 1);
  });
  await check("five-per-hour limit is enforced for simultaneous submissions", async () => {
    const address = email("concurrent");
    const responses = await Promise.all(Array.from({ length: 12 }, () => post(base, makeData({ email: address }))));
    assert.equal(responses.filter((r) => r.status === 201).length, 5);
    assert.equal(responses.filter((r) => r.status === 429).length, 7);
    const [rows] = await pool.execute("SELECT COUNT(*) AS total FROM enquiries WHERE email = ?", [address]);
    assert.equal(Number(rows[0].total), 5);
  });
  await check("validation, cross-site rejection, content type, body bytes, HTTP methods and honeypot", async () => {
    assert.equal((await post(base, makeData({ email: "invalid" }))).status, 400);
    assert.equal((await post(base, makeData({ service: "invalid" }))).status, 400);
    assert.equal((await post(base, "{oops")).status, 400);
    assert.equal((await post(base, makeData(), { "Sec-Fetch-Site": "cross-site" })).status, 403);
    assert.equal((await post(base, makeData(), { "Content-Type": "text/plain" })).status, 415);
    assert.equal((await post(base, makeData({ message: "x".repeat(20000) }))).status, 413);
    assert.equal((await post(base, makeData({ message: "🧡".repeat(4500) }))).status, 413);
    assert.equal((await fetch(base + "/api/enquiries")).status, 405);
    const spam = makeData({ company_url: "synthetic honeypot" });
    assert.equal((await post(base, spam)).status, 200);
    const [rows] = await pool.execute("SELECT id FROM enquiries WHERE id = ?", [spam.id]); assert.equal(rows.length, 0);
  });
  await check("public pages stay available without database config; genuine submissions fail clearly", async () => {
    const environment = { ...process.env }; for (const key of ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"]) delete environment[key];
    const server = await start(port + 1, environment);
    assert.equal((await fetch(server.base + "/contact")).status, 200);
    const response = await post(server.base, makeData()); assert.equal(response.status, 503);
    const body = await response.json(); assert.match(body.error, /info@swiftdigitals.com.au/); assert.ok(body.reference);
    assert.doesNotMatch(body.error, /DB_HOST|DB_PASSWORD|SELECT|ECONN/);
    assert.match(server.logs(), /DB_CONFIGURATION/);
  });
  await check("database outage returns 503 without false success or exposed internals", async () => {
    const server = await start(port + 2, { ...process.env, DB_PORT: "1" });
    const response = await post(server.base, makeData()); assert.equal(response.status, 503);
    assert.match((await response.json()).error, /couldn’t save/);
    assert.doesNotMatch(server.logs(), new RegExp(process.env.DB_PASSWORD));
    assert.equal((await fetch(server.base)).status, 200);
  });
  await check("Drizzle MySQL adapter reads and writes using the shared lazy pool", async () => {
    const directory = await mkdtemp(root + "/test-results/drizzle-");
    try {
      const options = { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } };
      const schema = ts.transpileModule(await readFile(root + "/db/schema.ts", "utf8"), options).outputText;
      const index = ts.transpileModule(await readFile(root + "/db/index.ts", "utf8"), options).outputText.replace('"./schema"', '"./schema.mjs"').replace('"./connection.mjs"', '"../../db/connection.mjs"');
      await writeFile(directory + "/schema.mjs", schema); await writeFile(directory + "/index.mjs", index);
      const { getDb } = await import(new URL("file://" + directory + "/index.mjs"));
      const { enquiries } = await import(new URL("file://" + directory + "/schema.mjs"));
      const id = randomUUID(); const db = getDb();
      await db.insert(enquiries).values({ id, name: "Drizzle Synthetic", email: email("drizzle"), service: "Website audit", message: "Drizzle adapter test." });
      const rows = await db.select().from(enquiries);
      assert.equal(rows.find((row) => row.id === id)?.message, "Drizzle adapter test.");
    } finally { await rm(directory, { recursive: true, force: true }); }
  });
  await check("D1 converter preserves Unicode, IDs and timestamps; repeat import is idempotent; conflicts fail", async () => {
    transferDirectory = await mkdtemp(root + "/test-results/transfer-");
    const sourceId = randomUUID(); const data = makeData({ id: sourceId, email: email("transfer"), name: "Unicode 🧡", message: "D1 export \\ quote ' and newline\nالعربية." });
    const source = [data.id, data.name, data.email, data.phone, data.website, data.service, data.message, "2026-09-01 02:03:04.123456"];
    const sqliteValues = source.map((value) => "'" + value.replaceAll("'", "''") + "'").join(",");
    const legacy = await readFile(root + "/docs/legacy/sqlite-migrations/0000_sparkling_betty_brant.sql", "utf8");
    const input = transferDirectory + "/d1.sql", output = transferDirectory + "/mysql.sql";
    await writeFile(input, legacy + `\nINSERT INTO enquiries VALUES (${sqliteValues});\n`);
    const converted = spawnSync("python3", ["scripts/convert-d1.py", "--input", input, "--output", output, "--exported-at", "2026-10-01T15:00:00Z"], { cwd: root, encoding: "utf8" });
    assert.equal(converted.status, 0, converted.stderr);
    const manifest = JSON.parse(await readFile(transferDirectory + "/mysql.manifest.json", "utf8")); assert.equal(manifest.record_count, 1);
    const sql = await readFile(output, "utf8"); const connection = await pool.getConnection();
    try {
      await executeSql(connection, sql); await executeSql(connection, sql);
      const [rows] = await connection.execute("SELECT * FROM enquiries WHERE id = ?", [sourceId]);
      assert.equal(rows.length, 1); assert.equal(rows[0].message, data.message); assert.equal(rows[0].created_at, source[7]);
      await connection.execute("UPDATE enquiries SET message = 'synthetic conflict' WHERE id = ?", [sourceId]);
      await assert.rejects(executeSql(connection, sql), (error) => error.code === "ER_BAD_NULL_ERROR");
      await connection.rollback();
    } finally { connection.release(); }
  });
} catch (error) {
  console.error(error); process.exitCode = 1;
} finally {
  for (const child of servers) { child.kill("SIGTERM"); if (child.exitCode === null) await once(child, "exit"); }
  await closePool();
  await mkdir(root + "/test-results", { recursive: true });
  await writeFile(root + "/test-results/integration.json", JSON.stringify({ tested_at_utc: new Date().toISOString(), node: process.version, database: "Isolated MySQL-compatible database", results }, null, 2) + "\n");
  if (transferDirectory) await rm(transferDirectory, { recursive: true, force: true });
}
