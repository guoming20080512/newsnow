import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

const coindeskCn = defineSource(async () => {
  const baseURL = "https://www.coindesk.com"
  const html = await myFetch(`${baseURL}/zh/latest-crypto-news`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
    },
  })
  const $ = cheerio.load(html)
  const news: NewsItem[] = []

  // 解析新闻列表
  const $items = $("a.content-card-title")
  $items.each((_, el) => {
    const $el = $(el)
    const $h2 = $el.find("h2.font-headline-xs.font-normal")
    const title = $h2.text().trim()
    const url = $el.attr("href")

    if (url && title) {
      news.push({
        url: url.startsWith("http") ? url : `${baseURL}${url}`,
        title,
        id: url,
        extra: {
          icon: undefined,
        },
      })
    }
  })

  return news
})

export default defineSource({
  "coindesk-cn": coindeskCn,
})
