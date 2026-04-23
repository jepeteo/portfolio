import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const files = [
  "src/assets/myProjects.json",
  "src/assets/clientProjects.json",
  "src/assets/personalProjects.json",
]

const issues = []

for (const relativePath of files) {
  const fullPath = path.join(root, relativePath)
  const raw = fs.readFileSync(fullPath, "utf8")
  const data = JSON.parse(raw)

  const seenName = new Set()
  const seenUrl = new Set()

  data.forEach((project, index) => {
    const row = `${relativePath}[${index}]`
    const name = (project.prName || project.title || "").trim()
    const description = (project.prDescription || project.description || "").trim()
    const url = (project.prUrl || project.url || "").trim().toLowerCase()

    if (!name) issues.push(`${row}: missing project name`)
    if (!description) issues.push(`${row}: empty description`)
    if (name && seenName.has(name.toLowerCase()))
      issues.push(`${row}: duplicate name "${name}"`)
    if (url && seenUrl.has(url)) issues.push(`${row}: duplicate url "${url}"`)
    if ((project.prName || "").endsWith(" ") || (project.title || "").endsWith(" "))
      issues.push(`${row}: trailing whitespace in name`)

    if (name) seenName.add(name.toLowerCase())
    if (url) seenUrl.add(url)
  })
}

if (issues.length > 0) {
  console.error("Project data validation failed:\n")
  issues.forEach((issue) => console.error(`- ${issue}`))
  process.exit(1)
}

console.log("Project data validation passed.")
