import { defineEventHandler, setHeader } from "h3"
import { generateSitemap } from "../sitemap-generator"

export default defineEventHandler(async (event) => {
  const sitemapXml = await generateSitemap()
  setHeader(event, "Content-Type", "application/xml; charset=utf-8")
  return sitemapXml
})
