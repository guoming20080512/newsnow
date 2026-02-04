import dayjs from "dayjs"
import { config as dotenvConfig } from "dotenv"
import { sources } from "../shared/sources"
import process from "node:process"
import path from "node:path"

dotenvConfig({ path: path.resolve(process.cwd(), ".env.server") })

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

console.log(`Sitemap生成成功，共${urls.length}个URL`)
