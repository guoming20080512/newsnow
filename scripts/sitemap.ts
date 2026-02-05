import process from "node:process"
import path from "node:path"
import fs from "node:fs"
import dayjs from "dayjs"
import { config as dotenvConfig } from "dotenv"
import { sources } from "../shared/sources"

const projectDir = path.resolve(process.cwd())
dotenvConfig({ path: path.resolve(projectDir, ".env.server") })

const BASE_URL = (process.env.BASE_URL || "https://news.abfjwndjwkdbwkjdnej.store").replace(/\/+$/, "")

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

// 同时生成到 public 目录（开发环境）和 dist/output/public 目录（生产环境）
const publicPaths = [
  path.resolve(projectDir, "public", "sitemap.xml"),
  path.resolve(projectDir, "dist", "output", "public", "sitemap.xml"),
]

publicPaths.forEach((outputPath) => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, sitemapXml, "utf-8")
  console.log(`Sitemap生成成功，共${urls.length}个URL，已保存到${outputPath}`)
})
