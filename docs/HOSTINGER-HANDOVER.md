# Swift Digitals — independent Hostinger v2

The new project preserves the existing 12 pages, design, assets, copy, contact details and enquiry form. It replaces Vinext/Vite/Workers/D1 with standard Next.js, a persistent Node.js server and MySQL. The original repository, website, hosting, environment, database and DNS were not modified.

Source: [senju4477/swift-digitals-website1](https://github.com/senju4477/swift-digitals-website1/tree/b93c2bbf1698f284e6c5bc8142caf125b3f2696c), branch `main`, commit `b93c2bbf1698f284e6c5bc8142caf125b3f2696c`. Full original file hashes are in `SOURCE.json`; the pre-change architecture is in `INSPECTION.md`.

## Current delivery status

Implementation, source archive, migration SQL, offline data converter, review diff and local verification are provided. A separate private GitHub repository has been created at [senju4477/swift-digitals-website-hostinger-v2](https://github.com/senju4477/swift-digitals-website-hostinger-v2), with deployment branch `main`. The original repository has not been edited. Project identifiers are omitted from the source-database audit record in this GitHub copy. No Hostinger app, database or temporary URL has been created; Hostinger deployment and domain routing remain unverified.

## Architecture and compatibility choices

- Next.js **16.3.8**, React **19.2.6**, npm **10.9.4**, Node **22.x >=22.13.0**. Verification uses Node 22.23.3. Choose the current maintained 22.x patch offered by hPanel; its exact patch has not been observed.
- Next.js and its ESLint config were patched together from 16.3.4. The dependency audit identified GHSA-vcvr-r3jv-pc5j in the old version. This website does not use the affected `next/og` ImageResponse path, but the new version uses a patched dependency. No major framework upgrade was made.
- Hostinger's documented Next.js preset builds standalone output and starts Next's bundled server. `next.config.ts` exports an object with `output: "standalone"`; no custom HTTP server exists.
- `npm run build` runs `next build` then copies `public/` and `.next/static/` into `.next/standalone/`. `npm start` loads the generated server, honors `PORT`, and binds `0.0.0.0`. hPanel starts the generated server itself rather than requiring an entry file or a custom start-command field.
- Both former database entry points use the same lazy `mysql2` pool. Drizzle uses its MySQL adapter and schema. Builds/public pages do not require a live database or credentials.
- Enquiries commit in MySQL before genuine success. Per-email InnoDB row locks protect the five-per-hour limit across concurrent requests/processes. Retries use the UUID primary key. The auxiliary lock table stores only an email key; it is not an enquiry or a notes table.
- The UUID, eight enquiry fields, creation time and email/time index are preserved. MySQL uses UTC `DATETIME(6)` and `utf8mb4_bin`. SQL parameters protect user input.
- Seven existing plain-image lint warnings remain visible. Errors were fixed through typed data, Next Link navigation and form lifecycle changes; meaningful checks were not disabled. Existing exceptions for untouched vendored UI files were retained.
- No file uploads, filesystem data persistence, active login feature, email notifications, payments or external fonts were present. The WebMCP service-selection enhancement remains feature-detected. Email/telephone contact paths are unchanged.

## Use the separate GitHub repository

Use [senju4477/swift-digitals-website-hostinger-v2](https://github.com/senju4477/swift-digitals-website-hostinger-v2), branch `main`. It is private and independent of `swift-digitals-website1`.

`package.json` and `package-lock.json` are at the repository root. Source files, assets, migration scripts and deployment instructions are included. Credentials, real environment files, customer data exports, `node_modules` and `.next` are excluded. Connect this repository when creating the separate Hostinger app; do not select the original repository.

The previously supplied ZIP remains a portable source backup. Its original audit documentation predates the GitHub upload.

## Exact deployment settings

Create a **separate** Node.js Web App through **Websites → Add Website → Node.js web app → Import Git repository**. Connect the new repository through Hostinger's GitHub app. Use a new temporary domain/app slot while verifying; do not select, remove or repurpose an existing live website or production-domain slot.

| Setting | Value for this implementation |
|---|---|
| Repository | `senju4477/swift-digitals-website-hostinger-v2` after you create/upload it |
| Branch | `main` |
| Root directory | `/`, or blank when hPanel means repository root |
| Framework / application type | Next.js / `next` — server mode |
| Node version | Maintained `22.x`, at least `22.13.0`; actual hPanel patch requires verification |
| Package manager | npm; only `package-lock.json` is present |
| Install command | `npm ci` for clean local/CI verification; hPanel manages installation and may not expose an install-command field |
| Build script | `build`; if hPanel presents a full command, `npm run build` |
| Production start | `npm start` locally; Next preset starts `.next/standalone/server.js` automatically in Hostinger |
| Output directory | `.next` |
| Entry file | Not applicable: ignored for the Next.js preset |
| Start-command field | Not assumed to exist; requires dashboard verification if shown |
| Hostname environment | `HOSTNAME=0.0.0.0` for the generated server |
| Port | Use Hostinger's supplied `PORT`; actual assignment requires dashboard/runtime verification. Local default: 3000 |
| Database migration | Import `deploy/schema.mysql.sql` in the **new database's** phpMyAdmin before form testing |
| Preview URL | Not deployed; copy the actual new app's temporary URL after successful deployment |

Hostinger applies standalone output itself. The project sets it explicitly so local verification matches that documented format. Do not use the static-hosting workflow, `out`, Wrangler, Docker, or a guessed `server.js` entry file.

## Environment reference

Set these on the **new app** during onboarding or in its **Environment variables** screen. Use placeholders only in source control. No `NEXT_PUBLIC_` secrets or email-provider variables are used.

| Variable | Purpose / required feature | Phase | Visibility | Change action |
|---|---|---|---|---|
| `SITE_URL` | Canonical origin; default/intended value `https://swiftdigitals.au` | Build + runtime | Server configuration; resulting URLs are public | Rebuild/redeploy |
| `SITE_INDEXABLE` | `false` throughout preview; `true` only for separately authorized production launch | Build + runtime | Server configuration; crawler metadata is public | Rebuild/redeploy |
| `DB_HOST` | Exact host shown for the **new** Hostinger database; required for working enquiries | Runtime + local migration | Server-only | Restart runtime; hPanel saving environment variables currently redeploys |
| `DB_PORT` | MySQL port, default 3306; use actual database details | Runtime + local migration | Server-only | Restart/redeploy |
| `DB_USER` | New database user; required for enquiries | Runtime + local migration | Server-only | Restart/redeploy |
| `DB_PASSWORD` | New database password; required for enquiries | Runtime + local migration | Secret, server-only | Restart/redeploy |
| `DB_NAME` | New database name, including any Hostinger prefix; required for enquiries | Runtime + local migration | Server-only | Restart/redeploy |
| `PORT` | Hosting-assigned listening port; normally leave platform-managed; default 3000 locally | Runtime | Platform/server-only | Restart; platform field availability not observed |
| `HOSTNAME` | `0.0.0.0`, read by Next's standalone server; local startup explicitly enforces it | Runtime | Server-only | Restart/redeploy |

Only separate database variables are supported. Do not set `DATABASE_URL` expecting it to be used. Missing required settings and invalid ports fail clearly when a database feature is requested; secrets are never logged. Hostinger documentation shows `localhost` as an example, but use the host actually shown for your database rather than copying a guessed value.

Testing-only controls: `ALLOW_TEST_WRITES=1` explicitly enables the integration script, which additionally requires a database name beginning `swift_test_`. Optional `TEST_PORT` selects its first local test-server port (default 3180, plus the next two ports). Neither belongs in Hostinger production settings. Next's generated server sets `NODE_ENV=production` itself.

Current documentation says saving environment variables redeploys the app, so allow the build to complete. A **Running → Restart** action is available for server apps when only a process restart is needed. Build-dependent origin/indexing changes require a rebuild.

## Schema setup without SSH

1. Open the new app's Hostinger dashboard. Go to **Databases → Management** and create a new MySQL database and user. Save its exact host, name, user, password and port privately. Do not reuse the original D1 database or point the new app at an unrelated production MySQL database.
2. Open that new database in **phpMyAdmin**. Select it in the left sidebar and confirm it is the intended empty v2 database.
3. Choose **Import**, select the included `deploy/schema.mysql.sql`, and run the import. It uses ordinary InnoDB DDL; no SSH, SUPER privileges, application HTTP migration endpoint, or deployment-time database connection is required.
4. Confirm three tables: `enquiries`, `enquiry_email_locks`, `app_schema_migrations`. In the tracker, expect one row, `0001_enquiries.sql`, with the checksum shown in the import file. Confirm `idx_enquiries_email_created` and the enquiry primary key in the Structure view.
5. Set the new app's database environment variables and deploy/redeploy. Submit a clearly labelled preview test enquiry and verify the row in phpMyAdmin; then remove only your test row through phpMyAdmin if desired.

The initial migration uses `CREATE TABLE IF NOT EXISTS`, inline indexes and checksum tracking. Rerunning it preserves data. A changed checksum raises an error in strict mode; never edit an applied migration. Only one operator should run phpMyAdmin migrations at a time. Future migrations must be reviewed, versioned and designed for safe retry; regenerate the dashboard import with `npm run db:export-sql` locally.

MySQL DDL commits implicitly. A schema failure can leave some tables created; inspect the error, fix its cause and rerun the initial migration. The tracker is written after the statements. No automatic DDL rollback is promised. Migrations do not run in `npm run build` or startup. If missing/failed, public pages still work but enquiries return 503 until schema/connectivity is fixed.

For a local/CI connection to an **isolated test database**, put real test settings in ignored `.env.local` and run `npm run db:migrate`. Its migration lock and stored checksums prevent duplicate application. Hostinger does not need to offer a shell for this project: phpMyAdmin is the supported dashboard execution path.

`npm run db:generate` only generates Drizzle MySQL **drafts** under `drizzle/generated-mysql`; it does not connect to a database or apply them. Review drafts and place approved rerunnable SQL in a new `migrations/mysql/NNNN_description.sql`, then regenerate the import bundle. The old SQLite migration and its journal/snapshot remain byte-for-byte unchanged under `docs/legacy/sqlite-migrations/`; they are reference history, not executable MySQL migrations.

## Copy existing D1 records separately

The read-only inspection of the repository-linked Sites database found **zero enquiry rows** at the timestamp in `SOURCE-DATABASE.json`. Its complete untruncated empty table result is retained there. No source writes were made. The separate Cloudflare-account database configured in the old Vite setup was **not** accessed; do not infer that it is empty.

For an actual source with records:

1. Identify the currently live D1 account, database name and binding; do not assume the placeholder or a database named in old configuration is the current live source. Record an explicit UTC export timestamp.
2. On your local computer, in a separate export workspace, obtain a **schema + data**, read-only D1 SQL export. If using Wrangler, run its export command outside this application:

   ```bash
   npx --yes wrangler@4.92.0 d1 export ACTUAL_DATABASE_NAME --remote --table=enquiries --output=d1-enquiries.sql --skip-confirmation
   ```

   Supply the Cloudflare account credentials/configuration only in that separate export workspace. This command is an export, not a migration/execute command. Wrangler is not installed or required by the new application. If the source is managed by Sites rather than your own Cloudflare account, obtain a complete table export through its owner database viewer; do not assume your personal Cloudflare credentials can access it.
3. Keep the export private. On your local computer, with Python 3 installed, convert it using the actual export timestamp:

   ```bash
   python3 scripts/convert-d1.py --input d1-enquiries.sql --output backups/enquiries.mysql.sql --exported-at ACTUAL_UTC_TIMESTAMP
   ```

   On Windows, `py -3` can replace `python3`. The converter uses only Python's standard library. It reads the dump in an in-memory SQLite database, exports only enquiries, writes a preserved source backup and a timestamp/checksum/count manifest, and creates MySQL SQL with UTF-8 hex literals. It never connects to either database. It rejects unexpected values, incompatible column lengths and unrepresentable timestamps rather than truncating them.
4. After schema creation, open the **new MySQL database** in phpMyAdmin, make a private SQL export backup of its current contents, and **Import** `backups/enquiries.mysql.sql`. Never directly import the D1 SQL dump into MySQL. The import stages records in temporary tables, inserts only missing IDs and rejects conflicts without overwriting existing records.
5. Check the import's result sets: `matching_records` equals the manifest's `record_count`; `mismatched_records` is zero. An empty new database's enquiry count must equal the export count. On catch-up imports, total count can be higher because the new app may already have enquiries. Verify earliest/latest and several representative IDs/timestamps, accented text, emoji, quotes, multiline messages, service and optional fields in phpMyAdmin; confirm primary/index constraints. Do not paste client details into public issues or logs.
6. If an import reports an error, stop, roll back the active transaction where possible, close that phpMyAdmin connection, inspect the error and use the private pre-import backup if needed. Strict mode rejects mismatched records. The importer does not automatically resolve conflicting IDs or silently update rows.

Creation times from the original SQLite default are UTC. Naive timestamps are interpreted as UTC; explicit offsets are normalized to UTC, with up to six fractional digits preserved. UUIDs and other values are retained; presentation of timestamps changes to MySQL's datetime format. JSON manifest and SHA256 allow checking the backup/conversion chain.

Repeat exports/imports add missing IDs safely. The original site continues receiving enquiries during this task. Before a **separately authorized** cutover, export again, convert and import the catch-up data. Continue checking for late enquiries during DNS propagation or visits to the original URL. No snapshot taken now guarantees there will be no later original-site records; do not pause or change the original to prepare v2.

## Forms, email and failure handling

Successful genuine submissions return 201 only after a durable MySQL commit; a verified existing UUID returns 200 without another insert. Validation returns 400; cross-site requests 403; oversized bodies 413; wrong content type 415; the submission limit 429; database/config/schema failure 503. Responses are not cached. Filled honeypots intentionally receive the existing generic success response and are not stored.

No email provider is introduced: the source had no automatic notifications. Enquiries can be viewed privately in phpMyAdmin. If notifications are added later, keep a server-side adapter separate from storage and define notification retries/failure behaviour; do not mark an unsaved enquiry successful because it was logged or placed in memory. Current failure responses retain `info@swiftdigitals.com.au` and `0469 785 113`. Diagnostics contain a code and random reference, without query text, credentials or enquiry payloads.

## SEO and preview checks

All origin-dependent metadata uses `SITE_URL`, with the default/intended domain `https://swiftdigitals.au`. Existing titles/descriptions, paths and schema content are retained. Preview defaults to `SITE_INDEXABLE=false`, robots disallows crawling and an `X-Robots-Tag` header prevents indexing. Even with production indexing enabled, the proxy adds `noindex` when the request Host differs from the canonical host. Verify those headers at the actual Hostinger URL because Hostinger's forwarded/Host behaviour has not yet been observed.

Only after explicit production cutover authorization should you route the domain to v2 and set `SITE_INDEXABLE=true` before rebuilding. Then check canonical URLs, all 12 sitemap entries, robots (public pages allowed; API disallowed), JSON-LD and social metadata at the intended domain. Existing email addresses remain unchanged.

## Verification and troubleshooting

See `TEST-RESULTS.md` and `VERIFICATION.json` for passed, failed/resolved and not-tested results. Desktop/mobile screenshots are under `previews/`. Local verification does not prove Hostinger deployment, real database credentials, SSL or domain routing.

| Symptom | Check / action |
|---|---|
| npm install/ci fails | Select Node 22 >=22.13.0, npm and the committed npm lockfile; keep dev dependencies available during build. The final lock was regenerated with npm 10.9.4 after an npm 11/10 peer-lock mismatch. Do not force dependencies or restore pnpm settings. |
| Framework/build failure | Verify repository root, Next preset, build script `build`, output `.next`, supported config object and current build log. Type/build errors must be fixed, not disabled. |
| Build succeeds but site fails | Open Runtime Logs; confirm `.next/standalone/server.js`, copied public/static assets, assigned `PORT` and `HOSTNAME=0.0.0.0`. No custom entry file is required for the Next preset. |
| Port/502 failure | Keep the hosting-assigned port; verify process listens on all interfaces. Do not enter a guessed fixed hosting port. Restart/redeploy after correcting environment. |
| Missing images/styles | Confirm `public/`, `.next/static/` and the asset-copy build step ran; inspect requests to `/assets/` and `/_next/static/`. |
| Form returns 503 | Use the logged reference/code. Check exact DB host/user/name/password/port, user permissions, completed schema import, database availability and connection limits. Do not expose driver errors to visitors. |
| Form returns 429 | Five genuine enquiries for that email were received in the previous hour; wait or use telephone/email. UUID retries do not create additional records. |
| Schema import/checksum failure | Select the correct new database, stop on the error, inspect partial DDL and tracker, restore a new-database backup if necessary. Never rewrite an applied migration. |
| 403 after redeployment | Use Hostinger's redeploy workflow to regenerate managed routing; do not hand-edit deployment-managed `.htaccess` or application files. |
| Preview appears indexable | Keep `SITE_INDEXABLE=false`, rebuild and check `X-Robots-Tag`, robots and page metadata at the actual temporary URL. |

## Rollback of the new version

Before new-database imports or later migrations, make a private phpMyAdmin export. For an application regression, revert the change in the **new repository** and redeploy the **new app**, or use an available prior successful deployment after verifying the dashboard option. Do not assume older builds are retained indefinitely.

For database rollback, restore the private v2 backup into a fresh replacement MySQL database using phpMyAdmin, point only the new app's environment to it and redeploy/restart. Code rollback does not reverse schema migrations automatically. Preserve any newer v2 enquiries before restoring. The original D1 database and original website remain the restore reference and are never reset by these procedures.

## Remaining account-side configuration

Create/upload the new repository; create the separate Hostinger app with a temporary URL; confirm actual Node patch/port/Host headers; create the new MySQL database and provide its five connection settings; import schema; deploy and verify pages/form with database read-back. Obtain/catch up any records in the actual live D1 source. Production-domain cutover needs a separate explicit instruction after verification.

All commands above are local-computer commands except the documented hPanel/phpMyAdmin interactions. No Hostinger SSH access is required.
