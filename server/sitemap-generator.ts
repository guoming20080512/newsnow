import dayjs from "dayjs"
import { sources } from "../shared/sources"

const BASE_URL = (process.env.BASE_URL || "https://news.abfjwndjwkdbwkjdnej.store").replace(/\/+$/, "")

export async function generateSitemap() {
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

  return sitemapXml
}
