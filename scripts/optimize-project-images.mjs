/**
 * Optimize oversized project screenshots in public/images/projects.
 * - Re-encodes primary .webp at max 1280w
 * - Writes -768 and -480 responsive variants
 * - Leaves originals recoverable via Git history
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.resolve(__dirname, "..", "public/images/projects")
const MAX_PRIMARY = 1280
const VARIANTS = [768, 480]
const QUALITY = 78
const THRESHOLD = 500 * 1024

async function optimizeFile(filePath) {
  const base = path.basename(filePath, ".webp")
  if (/-\d+$/.test(base)) return null

  const before = fs.statSync(filePath).size
  const image = sharp(filePath, { failOn: "none" })
  const meta = await image.metadata()
  const width = meta.width || MAX_PRIMARY

  let after = before
  if (before > THRESHOLD) {
    const primaryBuf = await sharp(filePath, { failOn: "none" })
      .resize({
        width: Math.min(width, MAX_PRIMARY),
        withoutEnlargement: true,
      })
      .webp({ quality: QUALITY, effort: 6 })
      .toBuffer()

    fs.writeFileSync(filePath, primaryBuf)
    after = fs.statSync(filePath).size
  }

  for (const w of VARIANTS) {
    const out = path.join(dir, `${base}-${w}.webp`)
    await sharp(filePath, { failOn: "none" })
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(out)
  }

  if (before <= THRESHOLD && after === before) {
    return { file: path.basename(filePath), before, after, variantsOnly: true }
  }

  return { file: path.basename(filePath), before, after, variantsOnly: false }
}

async function main() {
  const files = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".webp") && !/-\d+\.webp$/.test(name))
    .map((name) => path.join(dir, name))

  const results = []
  for (const file of files) {
    const result = await optimizeFile(file)
    if (result) results.push(result)
  }

  const compressed = results.filter((r) => !r.variantsOnly)
  const beforeTotal = compressed.reduce((sum, r) => sum + r.before, 0)
  const afterTotal = compressed.reduce((sum, r) => sum + r.after, 0)
  console.log(
    JSON.stringify(
      {
        processed: results.length,
        recompressed: compressed.length,
        beforeBytes: beforeTotal,
        afterBytes: afterTotal,
        savedBytes: beforeTotal - afterTotal,
        samples: compressed
          .sort((a, b) => b.before - a.before)
          .slice(0, 12)
          .map((r) => ({
            file: r.file,
            beforeKB: Math.round(r.before / 1024),
            afterKB: Math.round(r.after / 1024),
          })),
      },
      null,
      2
    )
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
