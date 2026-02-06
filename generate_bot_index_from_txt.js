import fs from "node:fs"

// 读取index.html文件
const indexHtml = fs.readFileSync("./index.html", "utf8")

// 读取缓存数据文件
const cacheData = fs.readFileSync("./cache_data.txt", "utf8")

// 解析数据
const newsData = {}
const lines = cacheData.split("\n")

lines.forEach((line) => {
  if (line.trim()) {
    try {
      // 找到第一个|分隔符的位置
      const firstSeparatorIndex = line.indexOf("|")
      if (firstSeparatorIndex !== -1) {
        const source = line.substring(0, firstSeparatorIndex).trim()

        // 找到第二个|分隔符的位置（timestamp之后）
        const secondSeparatorIndex = line.indexOf("|", firstSeparatorIndex + 1)
        if (secondSeparatorIndex !== -1) {
          const dataStr = line.substring(secondSeparatorIndex + 1).trim()

          if (source && dataStr) {
            newsData[source] = JSON.parse(dataStr)
          }
        }
      }
    } catch (e) {
      console.error(`Error parsing line:`, e)
    }
  }
})

// 生成静态HTML内容
let staticContent = "<div id=\"app\">\n"
staticContent += "<div class=\"static-news-container\">\n"

// 为每个来源生成新闻列表
Object.entries(newsData).forEach(([source, news]) => {
  staticContent += `<div class="news-source">\n`
  staticContent += `<h2>${source}</h2>\n`
  staticContent += `<ul class="news-list">\n`

  news.forEach((item) => {
    staticContent += `<li class="news-item">\n`
    staticContent += `<a href="${item.url}" target="_blank">${item.title}</a>\n`
    if (item.extra && item.extra.info) {
      staticContent += `<span class="news-info">${item.extra.info}</span>\n`
    }
    staticContent += `</li>\n`
  })

  staticContent += `</ul>\n`
  staticContent += `</div>\n`
})

staticContent += `</div>\n`
staticContent += `</div>`

// 替换index.html中的对应部分
const newIndexHtml = indexHtml.replace(
  / {2}<div id="app"><\/div>\n {2}<script type="module" src="\/src\/main\.tsx"><\/script>/,
  staticContent,
)

// 保存到botdist文件夹
fs.writeFileSync("./botdist/index.html", newIndexHtml, "utf8")

console.log("Generated botdist/index.html successfully!")
console.log(`Processed ${Object.keys(newsData).length} news sources.`)
