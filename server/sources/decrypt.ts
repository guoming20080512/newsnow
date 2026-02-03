import { load } from "cheerio"
import type { NewsItem } from "@shared/types"
import { myFetch } from "#/utils/fetch"

const decrypt = defineSource(async () => {
  const baseURL = "https://decrypt.co"
  const html = await myFetch("https://decrypt.co/news", {
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
  const $sections = $(".flex.flex-col")
  $sections.each((_, section) => {
    const $section = $(section)
    const $date = $section.prev().find("h4")
    const date = $date.text().trim()

    const $newsItems = $section.find(".linkbox")
    $newsItems.each((_, item) => {
      const $item = $(item)

      // 解析图片
      const $img = $item.find(".flex-none img")
      const image = $img.attr("src")

      // 解析新闻内容
      const $content = $item.find(".grow")
      const $category = $content.find("p:first-child")
      const category = $category.text().trim()

      const $titleA = $content.find("h3 a")
      const $titleSpan = $titleA.find("span.font-medium")
      const title = $titleSpan.first().text().trim()
      const url = $titleA.attr("href")

      const $excerpt = $content.find("p:nth-child(3)")
      const excerpt = $excerpt.text().trim()

      // 解析作者和阅读时间
      const $footer = $content.find("footer")
      const $authorTime = $footer.find("p")
      const authorTime = $authorTime.text().trim()

      if (url && title) {
        // 构建 info 字符串
        const info = []
        if (category) info.push(category)
        if (date) info.push(date)
        if (authorTime) info.push(authorTime)

        news.push({
          url: url.startsWith("http") ? url : `${baseURL}${url}`,
          title,
          id: url,
          extra: {
            icon: image,
            date,
            info: info.length > 0 ? info.join(" | ") : undefined,
            hover: excerpt,
          },
        })
      }
    })
  })

  return news
})

export default defineSource({
  decrypt,
})
