import { fixedColumnIds, metadata } from "@shared/metadata"
import { Link } from "@tanstack/react-router"
import { currentColumnIDAtom } from "~/atoms"

export function NavBar() {
  const currentId = useAtomValue(currentColumnIDAtom)
  const { toggle } = useSearchBar()
  return (
    <span className={$([
      "flex p-3 rounded-2xl bg-primary/1 text-sm",
      "shadow shadow-primary/20 hover:shadow-primary/50 transition-shadow-500",
    ])}
    >
      {fixedColumnIds.map(columnId => (
        <Link
          key={columnId}
          to="/c/$column"
          params={{ column: columnId }}
          className={$(
            "px-2 hover:(bg-primary/10 rounded-md) cursor-pointer transition-all",
            currentId === columnId ? "color-primary font-bold" : "op-70 dark:op-90",
          )}
        >
          {metadata[columnId].name}
        </Link>
      ))}
      <button
        type="button"
        onClick={() => toggle(true)}
        className={$(
          "px-2 hover:(bg-primary/10 rounded-md) op-70 dark:op-90",
          "cursor-pointer transition-all",
        )}
      >
        更多
      </button>
      {/* 交易所链接 */}
      <a
        href="https://www.binance.com/zh-CN/join?ref=K2A12GI8"
        target="_blank"
        rel="noopener noreferrer"
        className={$(
          "px-2 hover:(bg-primary/10 rounded-md) op-70 dark:op-90",
          "cursor-pointer transition-all",
        )}
      >
        币安Binance交易所
      </a>
      <a
        href="https://www.firgrouxywebb.com/join/14313340"
        target="_blank"
        rel="noopener noreferrer"
        className={$(
          "px-2 hover:(bg-primary/10 rounded-md) op-70 dark:op-90",
          "cursor-pointer transition-all",
        )}
      >
        欧易OKX交易所
      </a>
    </span>
  )
}
