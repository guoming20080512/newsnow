import { load } from "cheerio"
import type { NewsItem } from "@shared/types"
import { myFetch } from "#/utils/fetch"

const elonmusk = defineSource(async () => {
  const baseURL = "https://xcancel.com/"
  const profileURL = "https://xcancel.com/elonmusk"
  const html = await myFetch(profileURL, {
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

  // 从新的 HTML 结构中提取推文
  const $timelineItems = $("div.timeline-item")

  $timelineItems.each((_, el) => {
    const $el = $(el)

    // 提取推文链接
    const $tweetLink = $el.find("a.tweet-link")
    const url = $tweetLink.attr("href")

    // 提取推文内容
    const $tweetContent = $el.find("div.tweet-content.media-body")
    const text = $tweetContent.text().trim()

    if (url && text) {
      news.push({
        url: url.startsWith("http") ? url : `${baseURL}${url}`,
        title: text,
        id: url,
        extra: {
          info: "马斯克推特",
        },
      })
      console.log("Added news item:", text, url)
    }
  })

  return news
})

export default defineSource({
  elonmusk,
})
