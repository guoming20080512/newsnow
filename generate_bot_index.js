const fs = require("node:fs")
const sqlite3 = require("sqlite3").verbose()

// 读取数据库
const db = new sqlite3.Database("./.data/db.sqlite3")

// 读取index.html文件
const indexHtml = fs.readFileSync("./index.html", "utf8")

// 获取数据库中的所有新闻数据
db.all("SELECT * FROM cache", (err, rows) => {
  if (err) {
    console.error(err.message)
    return
  }

  // 解析数据
  const newsData = {}
  rows.forEach((row) => {
    try {
      newsData[row.id] = JSON.parse(row.data)
    } catch (e) {
      console.error(`Error parsing data for ${row.id}:`, e)
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
  staticContent += `</div>\n`
  staticContent += `<style>\n`
  staticContent += `.static-news-container { max-width: 1200px; margin: 0 auto; padding: 20px; }\n`
  staticContent += `.news-source { margin-bottom: 30px; }\n`
  staticContent += `.news-source h2 { font-size: 24px; margin-bottom: 15px; color: #333; }\n`
  staticContent += `.news-list { list-style: none; padding: 0; }\n`
  staticContent += `.news-item { margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #eee; }\n`
  staticContent += `.news-item a { text-decoration: none; color: #0066cc; font-size: 16px; }\n`
  staticContent += `.news-item a:hover { text-decoration: underline; }\n`
  staticContent += `.news-info { font-size: 14px; color: #666; margin-left: 10px; }\n`
  staticContent += `</style>`

  // 替换index.html中的对应部分
  const newIndexHtml = indexHtml.replace(
    / {2}<div id="app"><\/div>\n {2}<script type="module" src="\/src\/main\.tsx"><\/script>/,
    staticContent,
  )

  // 保存到botdist文件夹
  fs.writeFileSync("./botdist/index.html", newIndexHtml, "utf8")

  console.log("Generated botdist/index.html successfully!")
  db.close()
})
