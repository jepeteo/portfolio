import * as esbuild from "esbuild"
import { rm } from "node:fs/promises"

const shared = {
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  packages: "external",
  external: ["resend"],
}

await esbuild.build({
  ...shared,
  entryPoints: ["api/contact/index.ts"],
  outfile: "api/contact/index.js",
})

await esbuild.build({
  ...shared,
  entryPoints: ["api/contact/csrf.ts"],
  outfile: "api/contact/csrf.js",
})

// Vercel keeps the TypeScript entry and does not bundle extensionless imports.
// On Vercel, replace those entries with the self-contained bundles above.
if (process.env.VERCEL) {
  await rm("api/contact/index.ts")
  await rm("api/contact/csrf.ts")
}
