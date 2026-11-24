// Builds favicon and PWA icons from public/favicon.png.
// The only source mark is 32x32, so integer sizes use nearest-neighbor
// (crisp pixels) and the odd sizes are scaled down from that 512 master.

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, "..", "public")
const sourcePath = path.join(publicDir, "favicon.png")

function icoFromPngs(images) {
  const count = images.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(count, 4)

  const directory = Buffer.alloc(16 * count)
  let offset = 6 + 16 * count
  images.forEach((image, index) => {
    const base = index * 16
    directory.writeUInt8(image.size >= 256 ? 0 : image.size, base)
    directory.writeUInt8(image.size >= 256 ? 0 : image.size, base + 1)
    directory.writeUInt8(0, base + 2)
    directory.writeUInt8(0, base + 3)
    directory.writeUInt16LE(1, base + 4)
    directory.writeUInt16LE(32, base + 6)
    directory.writeUInt32LE(image.buffer.length, base + 8)
    directory.writeUInt32LE(offset, base + 12)
    offset += image.buffer.length
  })

  return Buffer.concat([header, directory, ...images.map((image) => image.buffer)])
}

const master = await sharp(sourcePath)
  .resize(512, 512, { kernel: sharp.kernel.nearest })
  .png()
  .toBuffer()

const { data } = await sharp(sourcePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const background = {
  r: data[0],
  g: data[1],
  b: data[2],
  alpha: 1,
}

async function nearest(size) {
  return sharp(sourcePath)
    .resize(size, size, { kernel: sharp.kernel.nearest })
    .png()
    .toBuffer()
}

// 180 and 48 are not integer multiples of 32. Scale by the largest integer
// that fits, then pad with the source background so the mark stays crisp.
async function paddedNearest(size) {
  const scale = Math.max(1, Math.floor(size / 32))
  const inner = 32 * scale
  const pad = Math.floor((size - inner) / 2)
  const resized = await nearest(inner)
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: resized, left: pad, top: pad }])
    .png()
    .toBuffer()
}

const outputs = [
  ["favicon-16.png", await nearest(16)],
  ["apple-touch-icon.png", await paddedNearest(180)],
  ["icon-192.png", await nearest(192)],
  ["icon-512.png", master],
]

for (const [name, buffer] of outputs) {
  const file = path.join(publicDir, name)
  fs.writeFileSync(file, buffer)
  const meta = await sharp(buffer).metadata()
  if (meta.width !== meta.height) {
    throw new Error(`${name} is not square`)
  }
  console.log(`${name} ${meta.width}x${meta.height}`)
}

const ico = icoFromPngs([
  { size: 16, buffer: outputs[0][1] },
  { size: 32, buffer: fs.readFileSync(sourcePath) },
  { size: 48, buffer: await paddedNearest(48) },
])
fs.writeFileSync(path.join(publicDir, "favicon.ico"), ico)
console.log(`favicon.ico ${ico.length} bytes`)
