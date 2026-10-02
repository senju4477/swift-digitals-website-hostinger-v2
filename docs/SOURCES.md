# Primary sources checked 2026-10-01 UTC

These document supported behaviour; none establish that the user's account deployment has succeeded.

- [Hostinger: creating a Node.js app](https://docs.hostinger.com/node.js/creating-an-app) — Business/Cloud availability, GitHub import, temporary separate deployment workflow, runtime majors.
- [Hostinger: Next.js](https://docs.hostinger.com/node.js/overview-1/next) — server preset, standalone output, `.next`, ignored entry file, TypeScript config object support.
- [Hostinger: build settings](https://docs.hostinger.com/node.js/build-settings) — root, build script, output and per-framework entry interpretation.
- [Hostinger: environment variables](https://docs.hostinger.com/node.js/environment-variables) — build/runtime injection and redeployment on save.
- [Hostinger: MySQL connection for Node.js](https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/) — database creation, separate environment values, dashboard restart.
- [Hostinger: phpMyAdmin import](https://www.hostinger.com/support/1884149-how-to-import-a-database-with-phpmyadmin-in-hostinger/) — database selection, SQL upload/import and permissions.
- [Hostinger: runtime logs](https://docs.hostinger.com/node.js/runtime-logs) — current deployment diagnostics.
- [Next.js: standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) — generated server and required public/static asset copying.
- [Next.js: CLI](https://nextjs.org/docs/app/api-reference/cli/next) — standard build, port/default hostname and route type generation.
- [Node.js releases](https://nodejs.org/en/about/previous-releases) — Node 22 remains LTS; supported hosting majors do not all remain maintained.
- [Next.js security advisory GHSA-vcvr-r3jv-pc5j](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j) — affected Next 16.2.0–16.3.5 and patched 16.3.6+. The site does not use its vulnerable ImageResponse path; v2 nevertheless uses 16.3.8.
- [Cloudflare: Wrangler D1 export](https://developers.cloudflare.com/workers/wrangler/commands/d1/) — separate read-only export command and table/schema options.

Package versions and peer requirements were also checked through the npm registry; exact installed versions/integrity are recorded in `package-lock.json`. User-account dashboard state has not been inferred from these documents.
