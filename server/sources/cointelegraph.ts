import type { NewsItem } from "@shared/types"
import * as cheerio from "cheerio"
import { myFetch } from "#/utils/fetch"

const cointelegraph = defineSource(async () => {
  const baseURL = "https://cointelegraph.com"
  const html = await myFetch(baseURL, {
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

  // 解析首页新闻
  const $items = $("article")
  $items.each((_: number, el: any) => {
    const $el = $(el)
    const $a = $el.find("a")
    const title = $a.text().trim()
    const url = $a.attr("href")
    const $img = $el.find("img")
    const image = $img.attr("src")

    if (url && title) {
      news.push({
        url: url.startsWith("http") ? url : `${baseURL}${url}`,
        title,
        id: url,
        extra: {
          icon: image,
        },
      })
    }
  })

  return news
})

export default defineSource({
  cointelegraph,
})
