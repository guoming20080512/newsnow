import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import dayjs from "dayjs/esm"
import { sources } from "../shared/sources"
import { getCacheTable } from "./database/cache"

const BASE_URL = process.env.BASE_URL || "https://newsnow.busiyi.world"

async function generateSitemap() {
  const urls = [
    {
      loc: BASE_URL,
      lastmod: dayjs().format("YYYY-MM-DD"),
      changefreq: "always",
      priority: 1.0,
    },
  ]

  const cache = await getCacheTable()
  if (cache) {
    for (const [sourceKey] of Object.entries(sources)) {
      try {
        const cacheInfo = await cache.get(sourceKey)
        if (cacheInfo && cacheInfo.items.length > 0) {
          urls.push({
            loc: `${BASE_URL}/source/${sourceKey}`,
            lastmod: dayjs(cacheInfo.updatedTime || Date.now()).format("YYYY-MM-DD"),
            changefreq: "hourly",
            priority: 0.9,
          })
        }
      } catch (e) {
        console.warn(`生成${sourceKey}的sitemap失败:`, e)
      }
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
  `,
    )
    .join("")}
</urlset>`

  const outputPath = path.resolve(__dirname, "../public/sitemap.xml")
  fs.writeFileSync(outputPath, sitemapXml, "utf-8")
  console.log(`Sitemap生成成功，共${urls.length}个URL`)
  return sitemapXml
}

export default defineEventHandler(async () => {
  const sitemapXml = await generateSitemap()
  setHeader(event, "Content-Type", "application/xml; charset=utf-8")
  return sitemapXml
})
