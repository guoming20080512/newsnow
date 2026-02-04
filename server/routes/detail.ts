export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const targetUrl = query.url as string

  if (!targetUrl) {
    setResponseStatus(event, 400)
    return "缺少目标URL参数"
  }

  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>即将离开本站</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
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
      <p class="text-sm text-gray-800 break-all font-medium">${targetUrl}</p>
    </div>

    <div class="space-y-3">
      <a href="${targetUrl}" target="_blank" rel="noopener noreferrer" 
         class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200">
        继续访问
      </a>
      <button onclick="window.close()" 
              class="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200">
        取消
      </button>
    </div>

    <p class="text-xs text-gray-400 text-center mt-6">
      如果您没有自动跳转，请点击上方按钮继续访问
    </p>
  </div>

  <script>
    setTimeout(() => {
      window.location.href = '${targetUrl}';
    }, 3000);
  </script>
</body>
</html>
  `

  setHeader(event, "Content-Type", "text/html; charset=utf-8")
  return html
})
