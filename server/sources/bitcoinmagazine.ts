import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

const bitcoinmagazine = defineSource(async () => {
  const baseURL = "https://bitcoinmagazine.com"
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
  const $items = $(".td_module_flex")
  $items.each((_, el) => {
    const $el = $(el)
    const $moduleContainer = $el.find(".td-module-container")
    const $metaInfo = $moduleContainer.find(".td-module-meta-info")

    // 解析标题和链接
    const $titleA = $metaInfo.find("h3.entry-title a")
    const title = $titleA.text().trim()
    const url = $titleA.attr("href")

    // 解析图片
    const $thumb = $moduleContainer.find(".td-module-thumb")
    const $thumbA = $thumb.find("a")
    const $entryThumb = $thumbA.find("span.entry-thumb")
    const image = $entryThumb.attr("data-img-url")

    // 解析分类
    const $category = $metaInfo.find("a.td-post-category")
    const category = $category.text().trim()

    // 解析作者和日期
    const $authorDate = $metaInfo.find(".td-author-date")
    const author = $authorDate.find(".td-post-author-name a").text().trim()
    const date = $authorDate.find(".td-post-date time").text().trim()

    // 解析摘要
    const $excerpt = $metaInfo.find(".td-excerpt")
    const excerpt = $excerpt.text().trim()

    if (url && title) {
      // 构建 info 字符串，包含分类和作者信息
      const info = []
      if (category) info.push(category)
      if (author) info.push(author)
      if (date) info.push(date)

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

  return news
})

export default defineSource({
  bitcoinmagazine,
})
