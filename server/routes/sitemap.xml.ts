import { readFileSync } from "node:fs"
import { join } from "node:path"
import process from "node:process"

export default defineEventHandler((event) => {
  const sitemapPath = join(process.cwd(), "public/sitemap.xml")
  try {
    const sitemapContent = readFileSync(sitemapPath, "utf-8")
    setHeader(event, "Content-Type", "application/xml; charset=utf-8")
    return sitemapContent
  } catch {
    setResponseStatus(event, 404)
    return "Sitemap not found"
  }
})
