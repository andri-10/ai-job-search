import { buildDetailUrl, jsonFetch, mapOffer, normalizeId, writeError } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const id = normalizeId(opts.id)
  if (!id) {
    writeError(`Could not parse an Empléate offer ID from "${opts.id}"`, "BAD_ID")
    return 1
  }
  try {
    const body = await jsonFetch(buildDetailUrl(id))
    const detail = mapOffer(body?.response?.docs?.[0] ?? {})
    if (!detail) {
      writeError("Offer not found", "NOT_FOUND")
      return 1
    }

    if (opts.format === "plain") {
      const lines = [
        detail.title,
        `${detail.company ?? "Employer not disclosed"} · ${detail.location ?? "—"}`,
        detail.date ? `Posted: ${detail.date}` : "",
        detail.employmentType ? `Contract: ${detail.employmentType}` : "",
        detail.schedule ? `Schedule: ${detail.schedule}` : "",
        detail.category ? `Category: ${detail.category}` : "",
        detail.source ? `Source: ${detail.source}` : "",
        "",
        detail.description ?? "(no description)",
        "",
        `URL: ${detail.url}`,
        detail.applyUrl ? `Apply: ${detail.applyUrl}` : "",
      ].filter((line) => line !== "")
      process.stdout.write(lines.join("\n") + "\n")
    } else {
      process.stdout.write(JSON.stringify(detail, null, 2) + "\n")
    }
    return 0
  } catch (error) {
    writeError(error instanceof Error ? error.message : String(error), "DETAIL_FAILED")
    return 1
  }
}

