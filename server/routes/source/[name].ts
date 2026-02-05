import { defineEventHandler, getRouterParam, setHeader, setResponseStatus } from "h3"
import { renderSourcePage } from "../../render"

export default defineEventHandler(async (event) => {
  const sourceName = getRouterParam(event, "name")

  if (!sourceName) {
    setResponseStatus(event, 404)
    return "Source not found"
  }

  const html = await renderSourcePage(sourceName)
  setHeader(event, "Content-Type", "text/html; charset=utf-8")
  return html
})
