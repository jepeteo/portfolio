import fs from "node:fs"
import path from "node:path"

const projectRoot = process.cwd()
const swPath = path.join(projectRoot, "public", "sw.js")
const distDir = path.join(projectRoot, "dist")

function readStaticAssets() {
  const swContent = fs.readFileSync(swPath, "utf8")
  const match = swContent.match(/const\s+STATIC_ASSETS\s*=\s*\[([\s\S]*?)\]/)
  if (!match) {
    throw new Error("Could not find STATIC_ASSETS in public/sw.js")
  }

  const assetsBlock = match[1]
  const assets = []
  const regex = /['"]([^'"]+)['"]/g
  let item = regex.exec(assetsBlock)
  while (item) {
    assets.push(item[1])
    item = regex.exec(assetsBlock)
  }
  return assets
}

function toDistPath(asset) {
  if (asset === "/") {
    return path.join(distDir, "index.html")
  }
  return path.join(distDir, asset.replace(/^\//, ""))
}

function verifyAssetsExist() {
  const assets = readStaticAssets()
  const missing = assets.filter((asset) => !fs.existsSync(toDistPath(asset)))

  if (missing.length > 0) {
    console.error("❌ Missing pre-cache asset(s) in dist:")
    missing.forEach((asset) => console.error(` - ${asset}`))
    process.exit(1)
  }

  console.log("✅ All service worker pre-cache assets exist in dist:")
  assets.forEach((asset) => console.log(` - ${asset}`))
}

verifyAssetsExist()
