import { cp, access, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = new URL("../", import.meta.url);
const standalone = new URL(".next/standalone/", root);
await access(new URL("server.js", standalone));
// Next's standalone server does not include these assets automatically.
await rm(new URL("public/", standalone), { recursive: true, force: true });
await rm(new URL(".next/static/", standalone), { recursive: true, force: true });
await cp(new URL("public/", root), new URL("public/", standalone), { recursive: true });
await cp(new URL(".next/static/", root), new URL(".next/static/", standalone), { recursive: true });
console.log(`Standalone assets ready: ${fileURLToPath(standalone)}`);
