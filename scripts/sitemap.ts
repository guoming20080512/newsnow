import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import dayjs from "dayjs/esm"
import { config as dotenvConfig } from "dotenv"
import { sources } from "../shared/sources"

dotenvConfig({ path: path.resolve(process.cwd(), ".env.server") })

const BASE_URL = process.env.BASE_URL || "https://newsnow.busiyi.world"

function generateSitemap() {
  const urls = [
    {
      loc: BASE_URL,
      lastmod: dayjs().format("YYYY-MM-DD"),
      changefreq: "always",
      priority: 1.0,
    },
  ]

  for (const sourceKey of Object.keys(sources)) {
    urls.push({
      loc: `${BASE_URL}/source/${sourceKey}`,
      lastmod: dayjs().format("YYYY-MM-DD"),
      changefreq: "hourly",
      priority: 0.9,
    })
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

  const outputPath = path.resolve(process.cwd(), "public/sitemap.xml")
  fs.writeFileSync(outputPath, sitemapXml, "utf-8")
  console.log(`Sitemap生成成功，共${urls.length}个URL`)
}

generateSitemap()
