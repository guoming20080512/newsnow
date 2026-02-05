import process from "node:process"
import path from "node:path"
import fs from "node:fs"
import dayjs from "dayjs"
import { config as dotenvConfig } from "dotenv"
import { sources } from "../shared/sources"

// 获取项目根目录
const projectDir = path.resolve(process.cwd())

// 加载环境变量（忽略错误）
try {
  dotenvConfig({ path: path.resolve(projectDir, ".env.server") })
} catch {
  console.log("未找到 .env.server 文件，使用默认 BASE_URL")
}

// 基础 URL
const BASE_URL = (process.env.BASE_URL || "https://news.abfjwndjwkdbwkjdnej.store").replace(/\/+$/, "")

// 生成 URL 列表
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

// 生成 sitemap XML
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

// 生成路径（考虑不同环境）
const publicPaths = [
  // 开发环境
  path.resolve(projectDir, "public", "sitemap.xml"),
  // 生产环境（Nitro 默认输出目录）
  path.resolve(projectDir, "dist", "output", "public", "sitemap.xml"),
  // 备用路径（考虑可能的不同配置）
  path.resolve(projectDir, "dist", "public", "sitemap.xml"),
]

// 写入文件
publicPaths.forEach((outputPath) => {
  try {
    // 确保目录存在
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    // 写入文件
    fs.writeFileSync(outputPath, sitemapXml, "utf-8")
    console.log(`✅ Sitemap生成成功，共${urls.length}个URL，已保存到${outputPath}`)
  } catch (error) {
    console.error(`❌ 无法写入到${outputPath}:`, error instanceof Error ? error.message : String(error))
  }
})

// 额外：直接输出到当前目录作为备用
const fallbackPath = path.resolve(projectDir, "sitemap.xml")
try {
  fs.writeFileSync(fallbackPath, sitemapXml, "utf-8")
  console.log(`✅ Sitemap生成成功，共${urls.length}个URL，已保存到${fallbackPath}`)
} catch (error) {
  console.error(`❌ 无法写入到${fallbackPath}:`, error instanceof Error ? error.message : String(error))
}

console.log(`\n📊 Sitemap生成完成，共${urls.length}个URL`)
console.log(`🌐 基础URL: ${BASE_URL}`)
console.log(`📅 生成时间: ${new Date().toLocaleString()}`)
