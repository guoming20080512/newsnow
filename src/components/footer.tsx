export function Footer() {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      {/* 网页地图 */}
      <div className="mb-6 w-full max-w-md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
          <a href="/c/realtime" className="text-sm hover:text-primary-500 transition-colors">实时新闻</a>
          <a href="/c/hottest" className="text-sm hover:text-primary-500 transition-colors">热门新闻</a>
          <a href="/c/finance" className="text-sm hover:text-primary-500 transition-colors">财经新闻</a>
          <a href="/c/focus" className="text-sm hover:text-primary-500 transition-colors">关注内容</a>
        </div>
      </div>
    </div>
  )
}
