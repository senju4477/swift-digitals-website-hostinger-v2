# Swift Digitals — Hostinger v2

Independent copy of `senju4477/swift-digitals-website1` at `b93c2bbf1698f284e6c5bc8142caf125b3f2696c`. The original repository/site/database/DNS are unchanged. Existing design, content and 12 routes are retained.

Next.js 16.3.8, React 19.2.6, npm, Node 22 >=22.13.0, MySQL/mysql2 and Drizzle's MySQL adapter. No Workers/Vinext/Vite/Wrangler runtime or Cloudflare credentials are required.

```bash
npm ci
npm run dev
```

Production:

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

Default port 3000; externally supplied `PORT` is honored, binding `0.0.0.0`. Production starts Next's generated standalone server; the build copies public/static assets. Hostinger's Next preset manages the generated server itself.

Copy `.env.example` to ignored `.env.local` for local configuration. Preview is deliberately non-indexable. Public pages build/run without database access; genuine enquiries require configured MySQL and a successful durable commit. Email notifications are not implemented, matching the source.

On Hostinger, create a new database and import `deploy/schema.mysql.sql` through phpMyAdmin, then set the new app's environment variables. Migrations do not run during installation/build/startup. Local migrations: `npm run db:migrate`. Generate the dashboard schema bundle without connecting: `npm run db:export-sql`.

Configuration checks: `npm test`. Integration verification: provide an **isolated** MySQL-compatible database named `swift_test_...`, set `ALLOW_TEST_WRITES=1`, then run `npm run test:integration`. Its Linux socket-binding check uses `/proc/net/tcp`; the script performs real writes only in the explicitly selected test database.

Read [the full handover](docs/HOSTINGER-HANDOVER.md) for exact Hostinger settings, environment reference, schema setup, D1 transfer, indexing, rollback and remaining manual steps. Read [inspection](docs/INSPECTION.md), [test results](docs/TEST-RESULTS.md) and [primary sources](docs/SOURCES.md). Screenshots are in `docs/previews/`.

This independent project is uploaded to the private repository [senju4477/swift-digitals-website-hostinger-v2](https://github.com/senju4477/swift-digitals-website-hostinger-v2), branch `main`. Hostinger deployment remains pending. Deploy to a **separate** app/temporary URL, verify it there, and obtain a separate explicit instruction before moving `swiftdigitals.au`. Project identifiers are omitted from the source-database audit record uploaded to GitHub.
