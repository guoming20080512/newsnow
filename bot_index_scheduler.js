import { exec } from "node:child_process"

// 执行更新脚本的函数
function updateBotIndex() {
  console.log(`[${new Date().toISOString()}] 开始更新bot索引...`)

  // 导出数据库数据
  exec("sqlite3 .data/db.sqlite3 \"SELECT * FROM cache\" > cache_data.txt", (error, _stdout, _stderr) => {
    if (error) {
      console.error(`导出数据库数据时出错: ${error.message}`)
      return
    }

    // 运行生成脚本
    exec("node generate_bot_index_from_txt.js", (error, _stdout, _stderr) => {
      if (error) {
        console.error(`生成索引时出错: ${error.message}`)
        return
      }

      console.log(`[${new Date().toISOString()}] Bot索引更新完成`)
    })
  })
}

// 立即执行一次更新
updateBotIndex()

// 设置每5分钟执行一次
const interval = 5 * 60 * 1000 // 5分钟
setInterval(updateBotIndex, interval)

console.log(`Bot索引调度器已启动，每${interval / 1000 / 60}分钟更新一次`)
console.log(`日志将输出到控制台`)
