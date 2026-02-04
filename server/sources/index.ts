// 导入所有数据源
import _36kr from "./_36kr"
import baidu from "./baidu"
import beincrypto from "./beincrypto"
import beincrypto_cn from "./beincrypto-cn"
import bilibili from "./bilibili"
import bitcoinmagazine from "./bitcoinmagazine"
import cankaoxiaoxi from "./cankaoxiaoxi"
import chongbuluo from "./chongbuluo"
import cls from "./cls"
import coindesk from "./coindesk"
import coindesk_cn from "./coindesk-cn"
import cointelegraph from "./cointelegraph"
import cointelegraph_cn from "./cointelegraph-cn"
import coolapk from "./coolapk"
import decrypt from "./decrypt"
import decrypt_zh from "./decrypt-zh"
import douban from "./douban"
import douyin from "./douyin"
import elonmusk from "./elonmusk"
import fastbull from "./fastbull"
import freebuf from "./freebuf"
import gelonghui from "./gelonghui"
import ghxi from "./ghxi"
import github from "./github"
import hackernews from "./hackernews"
import hupu from "./hupu"
import ifeng from "./ifeng"
import iqiyi from "./iqiyi"
import ithome from "./ithome"
import jin10 from "./jin10"
import juejin from "./juejin"
import kaopu from "./kaopu"
import kuaishou from "./kuaishou"
import linuxdo from "./linuxdo"
import mktnews from "./mktnews"
import nowcoder from "./nowcoder"
import pcbeta from "./pcbeta"
import producthunt from "./producthunt"
import qqvideo from "./qqvideo"
import smzdm from "./smzdm"
import solidot from "./solidot"
import sputniknewscn from "./sputniknewscn"
import sspai from "./sspai"
import steam from "./steam"
import tencent from "./tencent"
import thepaper from "./thepaper"
import tieba from "./tieba"
import toutiao from "./toutiao"
import v2ex from "./v2ex"
import wallstreetcn from "./wallstreetcn"
import weibo from "./weibo"
import xueqiu from "./xueqiu"
import zaobao from "./zaobao"
import zhihu from "./zhihu"
import type { SourceGetter } from "#/types"

// 数据源映射
const sources: Record<string, SourceGetter> = {
  "36kr": _36kr,
  baidu,
  beincrypto,
  "beincrypto-cn": beincrypto_cn,
  bilibili,
  bitcoinmagazine,
  cankaoxiaoxi,
  chongbuluo,
  cls,
  coindesk,
  "coindesk-cn": coindesk_cn,
  cointelegraph,
  "cointelegraph-cn": cointelegraph_cn,
  coolapk,
  decrypt,
  "decrypt-zh": decrypt_zh,
  douban,
  douyin,
  elonmusk,
  fastbull,
  freebuf,
  gelonghui,
  ghxi,
  github,
  hackernews,
  hupu,
  ifeng,
  iqiyi,
  ithome,
  jin10,
  juejin,
  kaopu,
  kuaishou,
  linuxdo,
  mktnews,
  nowcoder,
  pcbeta,
  producthunt,
  qqvideo,
  smzdm,
  solidot,
  sputniknewscn,
  sspai,
  steam,
  tencent,
  thepaper,
  tieba,
  toutiao,
  v2ex,
  wallstreetcn,
  weibo,
  xueqiu,
  zaobao,
  zhihu,
}

// 获取所有数据源
export function getAllSources() {
  return sources
}

// 根据名称获取数据源
export async function getSourceData(sourceName: string) {
  const source = sources[sourceName]
  if (!source) {
    throw new Error(`Source ${sourceName} not found`)
  }

  // 处理两种情况：函数或对象
  if (typeof source === "function") {
    return await source()
  } else if (typeof source === "object" && source !== null) {
    // 如果是对象，尝试获取第一个函数
    const keys = Object.keys(source)
    if (keys.length > 0) {
      const firstKey = keys[0]
      const firstSource = source[firstKey]
      if (typeof firstSource === "function") {
        return await firstSource()
      }
    }
  }

  throw new Error(`Source ${sourceName} is not a valid function or object`)
}
