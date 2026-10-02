# Source inspection — before compatibility changes

Inspected 2026-10-01 UTC. Source: https://github.com/senju4477/swift-digitals-website1
Default/source branch: `main`. Exact commit: `b93c2bbf1698f284e6c5bc8142caf125b3f2696c`.
This project was extracted from that commit into an independent directory and a new local Git repository with **no remote**. The upstream repository, original deployment, original database, environment and DNS are read-only.

## Verified architecture

- `next` and `eslint-config-next` are pinned to 16.3.4; React is 19.2.6. Dependencies resolve in the source pnpm lockfile. Node engine is >=22.13.0; package manager is pnpm 11.25.0.
- `scripts/run-framework.mjs` chooses Vite/Vinext; development/build use Vinext, while production startup uses local Wrangler and a generated Workers configuration. `.openai/hosting.json` selects D1 binding `DB` and no R2 bucket.
- Vite loads the Sites plugin, Cloudflare plugin and platform environment scripts. Standard `next.config.ts` is only an empty config object.
- Active pages: `/`, `/services`, `/website-development`, `/ndis-website-design`, `/ecommerce-website-design`, `/seo-digital-marketing`, `/ai-automation`, `/our-work`, `/packages`, `/about`, `/contact`, `/privacy`. Unknown slugs call `notFound()`.
- Only active API: `POST /api/enquiries`. It validates with Zod, rejects cross-site and non-JSON requests, limits body size, handles a honeypot, accepts retries by enquiry UUID, and allows five submissions per email in a rolling hour. Successful genuine submissions require a D1 insert. Its existing count-then-insert sequence is vulnerable to concurrent requests; the MySQL replacement will serialize per-email submissions.
- `lib/db.ts` directly returns D1 and is used by the enquiry handler. `db/index.ts` is a separate Drizzle/D1 layer. Both must be replaced. The SQLite schema contains only `enquiries`, with eight fields and the email/creation-time index.
- `examples/d1/` contains an inactive notes API and notes table outside the App Router. They are not production features. `app/chatgpt-auth.ts` has no consumers; there are no active authentication pages, callbacks or protected business features.
- No automatic enquiry email notification, file upload, payment integration, analytics or external API is implemented. The e-commerce and AI pages describe agency services; they are not a store or automation backend.
- Images and favicon are tracked local assets. Fonts are Arial/Helvetica/system sans-serif; no network font download is required. Existing plain image elements are retained to preserve rendering.
- SEO uses titles, descriptions, canonical URLs, Open Graph, Twitter, breadcrumbs, service/business JSON-LD, sitemap and robots. `lib/site.ts` currently uses a ChatGPT-hosted origin. Contact email remains `info@swiftdigitals.com.au`.
- The contact form has a feature-detected WebMCP service-selection enhancement. It only prepares the visible form; it is independent of Sites authentication and is retained.
- The remaining shadcn components and vendor files are shared UI scaffolding. Retain them and their independently required packages; remove only verified platform build/runtime scaffolding.

## Hostinger findings

Official documentation checked on 2026-10-01:

- Business Web Hosting supports Node.js Web Apps with GitHub import. Runtime choices are 18, 20, 22 and 24. Choose maintained Node 22, at least 22.13.0; exact dashboard patch is not yet observed.
- The Next.js preset builds standalone output and starts the bundled server. Output directory is `.next`; entry file is ignored. A Next config object is supported, including `next.config.ts`. This justifies standalone output rather than a custom HTTP server.
- Database schema SQL can be imported with phpMyAdmin without SSH. Schema migrations must stay separate from ordinary builds.
- Node deployments replace their managed files: persist enquiries in MySQL, not the app filesystem.
- Environment variables apply to build and runtime; saving them redeploys according to current documentation. Restart is available for server apps.
- No Hostinger Node.js management connector or signed-in dashboard has been used. Dashboard fields, assigned port, actual runtime patch, database host, deployment and temporary URL still require account-side verification.

See `SOURCES.md` for primary-source links. No compatibility changes had been made when this inspection summary was created.
