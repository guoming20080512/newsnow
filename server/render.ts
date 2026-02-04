import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { sources } from "../shared/sources"
import { fixedColumnIds, metadata } from "../shared/metadata"
import { getCacheTable } from "./database/cache"

async function getTemplate() {
  const templatePath = path.resolve(process.cwd(), "dist/index.html")
  return fs.promises.readFile(templatePath, "utf-8")
}

function generateNavBarHtml() {
  return `
    <span class="flex p-3 rounded-2xl bg-primary/1 text-sm shadow shadow-primary/20 hover:shadow-primary/50 transition-shadow-500">
      ${fixedColumnIds.map(columnId => `
        <a href="/c/${columnId}" class="px-2 hover:(bg-primary/10 rounded-md) cursor-pointer transition-all op-70 dark:op-90">
          ${metadata[columnId].name}
        </a>
      `).join("")}
      <button type="button" class="px-2 hover:(bg-primary/10 rounded-md) op-70 dark:op-90 cursor-pointer transition-all">
        更多
      </button>
      <a href="https://www.binance.com/zh-CN/join?ref=K2A12GI8" target="_blank" rel="noopener noreferrer" class="px-2 hover:(bg-primary/10 rounded-md) op-70 dark:op-90 cursor-pointer transition-all">
        币安Binance交易所
      </a>
      <a href="https://www.firgrouxywebb.com/join/14313340" target="_blank" rel="noopener noreferrer" class="px-2 hover:(bg-primary/10 rounded-md) op-70 dark:op-90 cursor-pointer transition-all">
        欧易OKX交易所
      </a>
    </span>
  `
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

  const navBarHtml = `<div class="flex justify-center md:hidden mb-6">${generateNavBarHtml()}</div>`
  const finalHtml = html.replace("<div id=\"app\"></div>", `<div id="app">${navBarHtml}${contentHtml}</div>`)
  const finalHtmlWithData = finalHtml.replace("</body>", `<script>window.__INITIAL_DATA__ = ${JSON.stringify(newsData)}</script>
<script>
function showExternalLinkWarning(url) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 2147483647;';
  overlay.onclick = function(e) {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  };
  
  const modal = document.createElement('div');
  modal.className = 'bg-white rounded-2xl shadow-xl max-w-md w-full p-8 mx-4';
  modal.onclick = function(e) {
    e.stopPropagation();
  };
  
  modal.innerHTML = \`
    <div class="text-center mb-6">
      <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">即将离开本站</h1>      
    </div>

    <div class="bg-gray-50 rounded-lg p-4 mb-6">
      <p class="text-sm text-gray-500 mb-2">目标网址：</p>
      <p class="text-sm text-gray-800 break-all font-medium">\${url}</p>
    </div>

    <div class="space-y-3">
      <button id="continueBtn" class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200">
        继续访问
      </button>
      <button id="cancelBtn" class="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200">
        取消
      </button>
    </div>
  \`;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  document.getElementById('continueBtn').onclick = function() {
    window.open(url, '_blank', 'noopener,noreferrer');
    document.body.removeChild(overlay);
  };
  
  document.getElementById('cancelBtn').onclick = function() {
    document.body.removeChild(overlay);
  };
}
</script></body>`)

  return finalHtmlWithData
}

function generateEmptyHtml(sourceName: string) {
  const source = sources[sourceName]
  const color = source?.color || "neutral"

  return `
    <div class="flex justify-center md:hidden mb-6"></div>
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
    <div class="flex justify-center md:hidden mb-6"></div>
    <div class="flex justify-center"><div class="w-full max-w-[350px]">
    <div class="flex flex-col h-500px rounded-2xl p-4 bg-${color}-500 bg-op-40">
      <div class="flex justify-between mx-2 mt-0 mb-2 items-center">
        <div class="flex gap-2 items-center">
          <a class="w-8 h-8 rounded-full bg-cover" target="_blank" href="${source?.home || "#"}" title="${source?.desc || ""}" style="background-image: url(/icons/${sourceName.split("-")[0]}.png)"></a>
          <span class="flex flex-col">
            <span class="flex items-center gap-2">
              <span class="text-xl font-bold" title="${source?.desc || ""}">${source?.name || sourceName}</span>
              ${source?.title ? `<span class="text-sm color-${color} bg-base op-80 bg-op-50! px-1 rounded">${source.title}</span>` : ""}
            </span>
            <span class="text-xs op-70">刚刚更新</span>
          </span>
        </div>
        <div class="flex gap-2 text-lg color-${color}">
          <button type="button" class="btn i-ph:arrow-counter-clockwise-duotone"></button>
          <button type="button" class="btn i-ph:star-duotone"></button>
        </div>
      </div>
      <div class="h-full p-2 overflow-y-auto rounded-2xl bg-base bg-op-70 scrollbar-hidden">
        <div>
        <ol class="flex flex-col gap-2">
          ${items.map((item, index) => `
            <a href="/detail?url=${encodeURIComponent(item.url)}" 
               onclick="event.preventDefault(); showExternalLinkWarning('${item.url.replace(/'/g, "\\'")}')"
               class="flex gap-2 items-center items-stretch relative cursor-pointer hover:bg-neutral-400/10 rounded-md pr-1">
              <span class="bg-neutral-400/10 min-w-6 flex justify-center items-center rounded-md text-sm">
                ${index + 1}
              </span>
              <span class="self-start line-height-none">
                <span class="mr-2 text-base">${item.title}</span>
                ${item.extra?.info ? `<span class="text-xs text-neutral-400/80 truncate align-middle">${item.extra.info}</span>` : ""}
              </span>
            </a>
          `).join("")}
        </ol>
        </div>
      </div>
    </div>
    </div></div>
  `
}

function generateTimelineHtml(items: any[], sourceName: string) {
  const source = sources[sourceName]
  const color = source?.color || "neutral"

  return `
    <div class="flex justify-center md:hidden mb-6"></div>
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
              <a href="/detail?url=${encodeURIComponent(item.url)}"
                 onclick="event.preventDefault(); showExternalLinkWarning('${item.url.replace(/'/g, "\\'")}')"
                 class="ml-2 px-1 hover:bg-neutral-400/10 rounded-md cursor-pointer" title="${item.extra?.hover || ""}">
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
