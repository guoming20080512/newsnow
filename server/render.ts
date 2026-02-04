import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { sources } from "../shared/sources"
import { getCacheTable } from "./database/cache"

async function getTemplate() {
  const templatePath = path.resolve(process.cwd(), "dist/index.html")
  return fs.promises.readFile(templatePath, "utf-8")
}

export async function renderSourcePage(sourceName: string) {
  const cache = await getCacheTable()
  let newsData = []

  if (cache) {
    try {
      const cacheInfo = await cache.get(sourceName)
      if (cacheInfo && cacheInfo.items.length > 0) {
        newsData = cacheInfo.items
      }
    } catch (error) {
      console.error("Error fetching from cache:", error instanceof Error ? error.message : String(error))
    }
  }

  const html = await getTemplate()
  const source = sources[sourceName]

  let contentHtml = ""
  if (newsData.length > 0) {
    if (source?.type === "hottest") {
      contentHtml = generateHotListHtml(newsData, sourceName)
    } else {
      contentHtml = generateTimelineHtml(newsData, sourceName)
    }
  } else {
    contentHtml = generateEmptyHtml(sourceName)
  }

  const finalHtml = html.replace("<div id=\"app\"></div>", `<div id="app">${contentHtml}</div>`)
  const finalHtmlWithData = finalHtml.replace("</body>", `<script>window.__INITIAL_DATA__ = ${JSON.stringify(newsData)}</script></body>`)

  return finalHtmlWithData
}

function generateEmptyHtml(sourceName: string) {
  const source = sources[sourceName]
  const color = source?.color || "neutral"

  return `
    <div class="flex justify-center"><div class="w-full max-w-[350px]">
    <div class="flex flex-col h-500px rounded-2xl p-4 bg-${color}-500 bg-op-40">
      <div class="flex justify-between mx-2 mb-2 items-center">
        <div class="flex gap-2 items-center">
          <div class="w-8 h-8 rounded-full bg-cover" style="background-image: url(/icons/${sourceName.split("-")[0]}.png)"></div>
          <span class="flex flex-col">
            <span class="text-xl font-bold">${source?.name || sourceName}</span>
            <span class="text-xs op-70">加载中...</span>
          </span>
        </div>
      </div>
      <div class="h-full p-2 overflow-y-auto rounded-2xl bg-base bg-op-70">
        <div class="text-center py-10 text-gray-500">
          <p>正在获取数据...</p>
          <p class="text-sm mt-2">如果长时间未加载，请稍后刷新页面</p>
        </div>
      </div>
    </div>
    </div></div>
  `
}

function generateHotListHtml(items: any[], sourceName: string) {
  const source = sources[sourceName]
  const color = source?.color || "neutral"

  return `
    <div class="flex justify-center"><div class="w-full max-w-[350px]">
    <div class="flex flex-col h-500px rounded-2xl p-4 bg-${color}-500 bg-op-40">
      <div class="flex justify-between mx-2 mb-2 items-center">
        <div class="flex gap-2 items-center">
          <div class="w-8 h-8 rounded-full bg-cover" style="background-image: url(/icons/${sourceName.split("-")[0]}.png)"></div>
          <span class="flex flex-col">
            <span class="text-xl font-bold">${source?.name || sourceName}</span>
            <span class="text-xs op-70">刚刚更新</span>
          </span>
        </div>
      </div>
      <div class="h-full p-2 overflow-y-auto rounded-2xl bg-base bg-op-70">
        <ol class="flex flex-col gap-2">
          ${items.map((item, index) => `
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" 
               class="flex gap-2 items-center items-stretch relative cursor-pointer hover:bg-neutral-400/10 rounded-md pr-1">
              <span class="bg-neutral-400/10 min-w-6 flex justify-center items-center rounded-md text-sm">
                ${index + 1}
              </span>
              <span class="self-start line-height-none">
                <span class="mr-2 text-base">${item.title}</span>
                ${item.extra?.info ? `<span class="text-xs text-neutral-400/80">${item.extra.info}</span>` : ""}
              </span>
            </a>
          `).join("")}
        </ol>
      </div>
    </div>
    </div></div>
  `
}

function generateTimelineHtml(items: any[], sourceName: string) {
  const source = sources[sourceName]
  const color = source?.color || "neutral"

  return `
    <div class="flex justify-center"><div class="w-full max-w-[350px]">
    <div class="flex flex-col h-500px rounded-2xl p-4 bg-${color}-500 bg-op-40">
      <div class="flex justify-between mx-2 mb-2 items-center">
        <div class="flex gap-2 items-center">
          <div class="w-8 h-8 rounded-full bg-cover" style="background-image: url(/icons/${sourceName.split("-")[0]}.png)"></div>
          <span class="flex flex-col">
            <span class="text-xl font-bold">${source?.name || sourceName}</span>
            <span class="text-xs op-70">刚刚更新</span>
          </span>
        </div>
      </div>
      <div class="h-full p-2 overflow-y-auto rounded-2xl bg-base bg-op-70">
        <ol class="border-s border-neutral-400/50 flex flex-col ml-1">
          ${items.map(item => `
            <li class="flex flex-col">
              <span class="flex items-center gap-1 text-neutral-400/50 ml--1px">
                <span>-</span>
                ${item.extra?.info ? `<span class="text-xs text-neutral-400/80">${item.extra.info}</span>` : ""}
              </span>
              <a class="ml-2 px-1 hover:bg-neutral-400/10 rounded-md cursor-pointer"
                 href="${item.url}" target="_blank" rel="noopener noreferrer" title="${item.extra?.hover || ""}">
                ${item.title}
              </a>
            </li>
          `).join("")}
        </ol>
      </div>
    </div>
    </div></div>
  `
}
