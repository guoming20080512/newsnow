interface HotMoviesRes {
  category: string
  tags: []
  items: MovieItem[]
  recommend_tags: []
  total: number
  type: string
}

interface MovieItem {
  rating: {
    count: number
    max: number
    star_count: number
    value: number
  }
  title: string
  pic: {
    large: string
    normal: string
  }
  is_new: boolean
  uri: string
  episodes_info: string
  card_subtitle: string
  type: string
  id: string
}

export default defineSource(async () => {
  const baseURL = "https://m.douban.com/rexxar/api/v2/subject/recent_hot/movie"
  const res: HotMoviesRes = await myFetch(baseURL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Referer": "https://movie.douban.com/",
    },
  })
  return res.items.map(movie => ({
    id: movie.id,
    title: movie.title,
    url: `https://movie.douban.com/subject/${movie.id}`,
    extra: {
      info: movie.card_subtitle.split(" / ").slice(0, 3).join(" / "),
      hover: movie.card_subtitle,
    },
  }))
})
