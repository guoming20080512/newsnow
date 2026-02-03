import { load } from "cheerio"
import type { NewsItem } from "@shared/types"
import { myFetch } from "#/utils/fetch"

const beincrypto = defineSource(async () => {
  const baseURL = "https://beincrypto.com"
  const html = await myFetch(`${baseURL}/category/`, {
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
  const $ = load(html)
  const news: NewsItem[] = []

  // 解析新闻列表
  const $items = $("a.GridCellContent-sc-bc7d2895-10")
  $items.each((_, el) => {
    const $a = $(el)
    const title = $a.text().trim()
    const url = $a.attr("href")

    if (url && title) {
      news.push({
        url: url.startsWith("http") ? url : `${baseURL}${url}`,
        title,
        id: url,
        extra: {},
      })
    }
  })

  return news
})

export default defineSource({
  beincrypto,
})
