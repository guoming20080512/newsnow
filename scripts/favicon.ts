import fs from "node:fs"

import { fileURLToPath } from "node:url"
import { join } from "node:path"
import { Buffer } from "node:buffer"
import { consola } from "consola"
import { originSources } from "../shared/pre-sources"

const projectDir = fileURLToPath(new URL("..", import.meta.url))
const iconsDir = join(projectDir, "public", "icons")
async function downloadImage(url: string, outputPath: string, id: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`${id}: could not fetch ${url}, status: ${response.status}`)
    }

    const image = await (await fetch(url)).arrayBuffer()
    fs.writeFileSync(outputPath, Buffer.from(image))
    consola.success(`${id}: downloaded successfully.`)
  } catch (error) {
    consola.error(`${id}: error downloading the image. `, error)
  }
}

async function main() {
  await Promise.all(
    Object.entries(originSources).map(async ([id, source]) => {
      try {
        // 检查多种扩展名的图标文件
        const extensions = [".png", ".jpg", ".jpeg"]
        let iconExists = false

        // 检查与数据源 ID 完全匹配的图标文件
        for (const ext of extensions) {
          const iconPath = join(iconsDir, `${id}${ext}`)
          if (fs.existsSync(iconPath)) {
            // consola.info(`${id}: icon exists. skip.`)
            iconExists = true
            break
          }
        }

        // 如果不存在，检查是否是中文版本的数据源，如果是，检查对应的英文版本图标文件
        if (!iconExists) {
          // 检查是否是中文版本的数据源 (xxx-cn 或 xxx-zh)
          const isChineseVersion = id.includes("-cn") || id.includes("-zh")
          if (isChineseVersion) {
            // 获取对应的英文版本数据源 ID
            const englishId = id.replace("-cn", "").replace("-zh", "")

            // 检查英文版本的图标文件
            for (const ext of extensions) {
              const iconPath = join(iconsDir, `${englishId}${ext}`)
              if (fs.existsSync(iconPath)) {
                // consola.info(`${id}: using icon from ${englishId}. skip.`)
                iconExists = true
                break
              }
            }
          }
        }

        if (iconExists) {
          return
        }

        if (!source.home) return
        await downloadImage(`https://icons.duckduckgo.com/ip3/${source.home.replace(/^https?:\/\//, "").replace(/\/$/, "")}.ico`, join(iconsDir, `${id}.png`), id)
      } catch (e) {
        consola.error(id, "\n", e)
      }
    }),
  )
}

main()
