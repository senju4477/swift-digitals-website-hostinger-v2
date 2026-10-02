// This loads Next's GENERATED server; it is not a custom HTTP server.
// HOSTNAME can already be a container ID, so set the actual bind address.
process.env.HOSTNAME = "0.0.0.0";
process.env.PORT ??= "3000";
await import(new URL("../.next/standalone/server.js", import.meta.url).href);
