import {
  asCard,
  buildSearchUrl,
  jsonFetch,
  mapOffer,
  writeError,
  type OfferCard,
} from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string
  jobage?: number
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

function renderTable(cards: OfferCard[]): string {
  if (!cards.length) return "No results."
  const header = `${"ID".padEnd(11)} ${"TITLE".padEnd(42)} ${"LOCATION".padEnd(30)} ${"DATE".padEnd(10)} SOURCE`
  const rows = cards.map((card) =>
    `${card.id.padEnd(11)} ${card.title.slice(0, 42).padEnd(42)} ${(card.location ?? "—").slice(0, 30).padEnd(30)} ${(card.date ?? "—").padEnd(10)} ${card.source ?? "—"}`,
  )
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const body = await jsonFetch(buildSearchUrl(opts))
    let cards = (body?.response?.docs ?? [])
      .map(mapOffer)
      .filter((offer) => offer !== null)
      .map(asCard)
    if (opts.limit !== undefined) cards = cards.slice(0, Math.max(0, opts.limit))

    if (opts.format === "table") {
      process.stdout.write(renderTable(cards) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(cards.map((card) =>
        `${card.title}\n  ${card.company ?? "employer not disclosed"} · ${card.location ?? "—"} · ${card.date ?? "—"}\n  source: ${card.source ?? "—"}\n  id: ${card.id}\n  ${card.url}`,
      ).join("\n\n") + "\n")
    } else {
      process.stdout.write(JSON.stringify({ meta: { count: cards.length, page: opts.page }, results: cards }, null, 2) + "\n")
    }
    return 0
  } catch (error) {
    writeError(error instanceof Error ? error.message : String(error), "SEARCH_FAILED")
    return 1
  }
}

