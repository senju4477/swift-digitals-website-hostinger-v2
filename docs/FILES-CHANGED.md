# Files created, modified, removed or moved

Status compares the independent project against the exact imported source commit. `A` = created, `M` = modified, `D` = removed, `R100` = moved with identical contents. Every public asset and the stylesheet are unchanged.

| Status | Path | Purpose |
|---|---|---|
| A | `.env.example` | Project configuration, npm dependency lock, environment placeholders, supported Node pin or handover entry point. |
| M | `.gitignore` | Project configuration, npm dependency lock, environment placeholders, supported Node pin or handover entry point. |
| A | `.nvmrc` | Project configuration, npm dependency lock, environment placeholders, supported Node pin or handover entry point. |
| D | `.openai/hosting.json` | Obsolete Sites/Vinext/Cloudflare build, install or runtime scaffolding removed after usage inspection. |
| M | `README.md` | Project configuration, npm dependency lock, environment placeholders, supported Node pin or handover entry point. |
| M | `app/[slug]/page.tsx` | Next Link, explicit types and form lifecycle compatibility; visual content/layout retained (layout also adds indexing flag). |
| M | `app/api/enquiries/route.ts` | Node runtime, bounded validated input, MySQL persistence and private failure diagnostics. |
| D | `app/chatgpt-auth.ts` | Unreferenced platform authentication scaffold removed; no active login feature existed. |
| M | `app/layout.tsx` | Next Link, explicit types and form lifecycle compatibility; visual content/layout retained (layout also adds indexing flag). |
| M | `app/page.tsx` | Next Link, explicit types and form lifecycle compatibility; visual content/layout retained (layout also adds indexing flag). |
| M | `app/robots.ts` | New canonical origin and preview/production indexing controls. |
| D | `build/sites-vite-plugin.LICENSE` | Obsolete Sites/Vinext/Cloudflare build, install or runtime scaffolding removed after usage inspection. |
| D | `build/sites-vite-plugin.ts` | Obsolete Sites/Vinext/Cloudflare build, install or runtime scaffolding removed after usage inspection. |
| D | `cloudflare-env.d.ts` | Obsolete Sites/Vinext/Cloudflare build, install or runtime scaffolding removed after usage inspection. |
| M | `components/site/contact-form.tsx` | Next Link, explicit types and form lifecycle compatibility; visual content/layout retained (layout also adds indexing flag). |
| M | `components/site/header.tsx` | Next Link, explicit types and form lifecycle compatibility; visual content/layout retained (layout also adds indexing flag). |
| M | `components/site/pages.tsx` | Next Link, explicit types and form lifecycle compatibility; visual content/layout retained (layout also adds indexing flag). |
| M | `components/site/ui.tsx` | Next Link, explicit types and form lifecycle compatibility; visual content/layout retained (layout also adds indexing flag). |
| A | `db/connection.mjs` | Lazy shared MySQL pool, Drizzle MySQL schema/adapter, durable storage and concurrent submission protection. |
| M | `db/index.ts` | Lazy shared MySQL pool, Drizzle MySQL schema/adapter, durable storage and concurrent submission protection. |
| M | `db/schema.ts` | Lazy shared MySQL pool, Drizzle MySQL schema/adapter, durable storage and concurrent submission protection. |
| A | `deploy/schema.mysql.sql` | Versioned MySQL migrations, dashboard import and separate offline D1 transfer. |
| A | `docs/HOSTINGER-HANDOVER.md` | Inspection, provenance, deployment instructions, verification evidence or previews. |
| A | `docs/INSPECTION.md` | Inspection, provenance, deployment instructions, verification evidence or previews. |
| A | `docs/SOURCE-DATABASE.json` | Inspection, provenance, deployment instructions, verification evidence or previews. |
| A | `docs/SOURCE.json` | Inspection, provenance, deployment instructions, verification evidence or previews. |
| A | `docs/SOURCES.md` | Inspection, provenance, deployment instructions, verification evidence or previews. |
| A | `docs/TEST-RESULTS.md` | Inspection, provenance, deployment instructions, verification evidence or previews. |
| A | `docs/VERIFICATION.json` | Inspection, provenance, deployment instructions, verification evidence or previews. |
| R100 | `drizzle/0000_sparkling_betty_brant.sql → docs/legacy/sqlite-migrations/0000_sparkling_betty_brant.sql` | Original SQLite migration history moved unchanged for reference. |
| R100 | `drizzle/meta/0000_snapshot.json → docs/legacy/sqlite-migrations/meta/0000_snapshot.json` | Original SQLite migration history moved unchanged for reference. |
| R100 | `drizzle/meta/_journal.json → docs/legacy/sqlite-migrations/meta/_journal.json` | Original SQLite migration history moved unchanged for reference. |
| A | `docs/previews/contact-desktop.png` | Inspection, provenance, deployment instructions, verification evidence or previews. |
| A | `docs/previews/contact-mobile.png` | Inspection, provenance, deployment instructions, verification evidence or previews. |
| A | `docs/previews/home-desktop.png` | Inspection, provenance, deployment instructions, verification evidence or previews. |
| A | `docs/previews/home-mobile.png` | Inspection, provenance, deployment instructions, verification evidence or previews. |
| A | `docs/previews/ndis-website-design-desktop.png` | Inspection, provenance, deployment instructions, verification evidence or previews. |
| A | `docs/previews/ndis-website-design-mobile.png` | Inspection, provenance, deployment instructions, verification evidence or previews. |
| M | `drizzle.config.ts` | Versioned MySQL migrations, dashboard import and separate offline D1 transfer. |
| D | `examples/d1/app/api/notes/route.ts` | Inactive notes example removed; no example tables migrated. |
| D | `examples/d1/db/schema.ts` | Inactive notes example removed; no example tables migrated. |
| M | `lib/db.ts` | Lazy shared MySQL pool, Drizzle MySQL schema/adapter, durable storage and concurrent submission protection. |
| A | `lib/enquiries.ts` | Lazy shared MySQL pool, Drizzle MySQL schema/adapter, durable storage and concurrent submission protection. |
| M | `lib/site.ts` | New canonical origin and preview/production indexing controls. |
| A | `migrations/mysql/0001_enquiries.sql` | Versioned MySQL migrations, dashboard import and separate offline D1 transfer. |
| M | `next.config.ts` | Project configuration, npm dependency lock, environment placeholders, supported Node pin or handover entry point. |
| A | `package-lock.json` | Project configuration, npm dependency lock, environment placeholders, supported Node pin or handover entry point. |
| M | `package.json` | Project configuration, npm dependency lock, environment placeholders, supported Node pin or handover entry point. |
| D | `pnpm-lock.yaml` | Replaced by the npm lockfile and standard npm commands. |
| D | `pnpm-workspace.yaml` | Replaced by the npm lockfile and standard npm commands. |
| A | `proxy.ts` | New canonical origin and preview/production indexing controls. |
| D | `scripts/build-verified.sh` | Obsolete Sites/Vinext/Cloudflare build, install or runtime scaffolding removed after usage inspection. |
| A | `scripts/convert-d1.py` | Versioned MySQL migrations, dashboard import and separate offline D1 transfer. |
| D | `scripts/execution-profile.mjs` | Obsolete Sites/Vinext/Cloudflare build, install or runtime scaffolding removed after usage inspection. |
| A | `scripts/export-migrations.mjs` | Versioned MySQL migrations, dashboard import and separate offline D1 transfer. |
| D | `scripts/install-ci.mjs` | Obsolete Sites/Vinext/Cloudflare build, install or runtime scaffolding removed after usage inspection. |
| D | `scripts/install-ci.sh` | Obsolete Sites/Vinext/Cloudflare build, install or runtime scaffolding removed after usage inspection. |
| D | `scripts/install-pnpm.sh` | Obsolete Sites/Vinext/Cloudflare build, install or runtime scaffolding removed after usage inspection. |
| A | `scripts/migrate.mjs` | Versioned MySQL migrations, dashboard import and separate offline D1 transfer. |
| A | `scripts/migration-files.mjs` | Versioned MySQL migrations, dashboard import and separate offline D1 transfer. |
| D | `scripts/npm-install.mjs` | Obsolete Sites/Vinext/Cloudflare build, install or runtime scaffolding removed after usage inspection. |
| D | `scripts/pnpm-install.mjs` | Obsolete Sites/Vinext/Cloudflare build, install or runtime scaffolding removed after usage inspection. |
| A | `scripts/prepare-standalone.mjs` | Prepare required standalone assets and start Next generated server. |
| D | `scripts/run-framework.mjs` | Obsolete Sites/Vinext/Cloudflare build, install or runtime scaffolding removed after usage inspection. |
| D | `scripts/sites-env.mjs` | Obsolete Sites/Vinext/Cloudflare build, install or runtime scaffolding removed after usage inspection. |
| D | `scripts/sites-env.sh` | Obsolete Sites/Vinext/Cloudflare build, install or runtime scaffolding removed after usage inspection. |
| A | `scripts/start-standalone.mjs` | Prepare required standalone assets and start Next generated server. |
| A | `tests/config.test.mjs` | Meaningful configuration, database/API and concurrency verification. |
| A | `tests/integration.mjs` | Meaningful configuration, database/API and concurrency verification. |
| M | `tsconfig.json` | Project configuration, npm dependency lock, environment placeholders, supported Node pin or handover entry point. |
| D | `tsconfig.tsbuildinfo` | Generated cache removed from tracking; not a deployable source file. |
| D | `vite.config.ts` | Obsolete Sites/Vinext/Cloudflare build, install or runtime scaffolding removed after usage inspection. |

The review diff includes all textual source changes and npm/pnpm lockfile replacement. Screenshots are delivered as image files rather than binary diff text. `docs/FILES-CHANGED.md` itself is the final generated inventory.
