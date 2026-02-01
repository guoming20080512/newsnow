import { Link } from "@tanstack/react-router"
import { useIsFetching } from "@tanstack/react-query"
import type { SourceID } from "@shared/types"
import { NavBar } from "../navbar"
import { currentSourcesAtom, goToTopAtom } from "~/atoms"

function GoTop() {
  const { ok, fn: goToTop } = useAtomValue(goToTopAtom)
  return (
    <button
      type="button"
      title="Go To Top"
      className={$("i-ph:arrow-fat-up-duotone", ok ? "op-50 btn" : "op-0")}
      onClick={goToTop}
    />
  )
}

function Refresh() {
  const currentSources = useAtomValue(currentSourcesAtom)
  const { refresh } = useRefetch()
  const refreshAll = useCallback(() => refresh(...currentSources), [refresh, currentSources])

  const isFetching = useIsFetching({
    predicate: (query) => {
      const [type, id] = query.queryKey as ["source" | "entire", SourceID]
      return (type === "source" && currentSources.includes(id)) || type === "entire"
    },
  })

  return (
    <button
      type="button"
      title="Refresh"
      className={$("i-ph:arrow-counter-clockwise-duotone btn", isFetching && "animate-spin i-ph:circle-dashed-duotone")}
      onClick={refreshAll}
    />
  )
}

export function Header() {
  return (
    <>
      <div className="flex justify-self-start items-center">
        <Link to="/" className="flex gap-3 items-center">
          <div
            className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl"
            title="logo"
          >
            N
          </div>
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-white">新闻</span>
            <span className="text-primary-500">实时</span>
          </span>
        </Link>
      </div>
      <div className="justify-self-center">
        <div className="hidden md:(inline-block)">
          <NavBar />
        </div>
      </div>
      <div className="justify-self-end flex gap-3 items-center">
        <GoTop />
        <Refresh />
      </div>
    </>
  )
}
