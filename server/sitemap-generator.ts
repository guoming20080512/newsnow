import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import dayjs from "dayjs/esm"
import { getAllSources } from "./sources"

// 项目基础URL（读取环境变量，匹配README中的配置）
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

  // 遍历项目所有数据源（如freebuf、github、cls等）
  const sourceMap = getAllSources()
  for (const [sourceKey, sourceFn] of Object.entries(sourceMap)) {
    // 1. 添加新闻源路由（如/source/freebuf）
    urls.push({
      loc: `${BASE_URL}/source/${sourceKey}`,
      lastmod: dayjs().format("YYYY-MM-DD"),
      changefreq: "hourly",
      priority: 0.9,
    })

    // 2. 添加新闻条目路由（如/source/freebuf/460614）
    try {
      const newsItems = await sourceFn()
      newsItems.forEach((item) => {
        urls.push({
          loc: `${BASE_URL}/source/${sourceKey}/${item.id}`,
          lastmod: dayjs(item.pubDate || Date.now()).format("YYYY-MM-DD"),
          changefreq: "daily",
          priority: 0.8,
        })
      })
    } catch (e) {
      console.warn(`生成${sourceKey}的sitemap失败:`, e)
    }
  }

  // 生成符合规范的sitemap.xml
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

  // 写入public目录（爬虫可直接访问）
  const outputPath = path.resolve(__dirname, "../public/sitemap.xml")
  fs.writeFileSync(outputPath, sitemapXml, "utf-8")
}

// 初始化生成 + 每小时更新（匹配项目的缓存策略）
generateSitemap()
setInterval(generateSitemap, 60 * 60 * 1000)

// 暴露接口，支持手动触发更新
export default defineEventHandler(async () => {
  await generateSitemap()
  return { success: true, message: "Sitemap生成成功" }
})
