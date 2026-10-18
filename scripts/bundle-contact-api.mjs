import * as esbuild from "esbuild"
import { mkdir } from "node:fs/promises"

const shared = {
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  packages: "external",
  external: ["resend"],
}

await mkdir("api/contact", { recursive: true })

await esbuild.build({
  ...shared,
  entryPoints: ["lib/contact/submitHandler.ts"],
  outfile: "api/contact/index.js",
})

await esbuild.build({
  ...shared,
  entryPoints: ["lib/contact/csrfHandler.ts"],
  outfile: "api/contact/csrf.js",
})
