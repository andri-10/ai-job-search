import { afterEach, describe, expect, test } from "bun:test"
import {
  PUBLIC_OFFER_URL,
  buildDetailUrl,
  buildSearchUrl,
  jsonFetch,
  mapOffer,
  normalizeId,
} from "../src/helpers"

const originalFetch = globalThis.fetch
const originalSetTimeout = globalThis.setTimeout

afterEach(() => {
  globalThis.fetch = originalFetch
  globalThis.setTimeout = originalSetTimeout
})

describe("Empléate mappings", () => {
  test("maps explicit fields and preserves an undisclosed employer as null", () => {
    const offer = mapOffer({
      id: 1850419565,
      titulo: "Prácticas inteligencia artificial",
      ciudadF: "Burgos",
      provinciaF: "BURGOS",
      paisF: "ESPAÑA",
      fechaCreacionPortal: "2026-08-14T00:00:00Z",
      contenido: "Trabajo con <b>IA</b><br>y Python",
      tipoContrato: "Prácticas",
      origen: "SNE",
      url: "#",
    })
    expect(offer?.company).toBeNull()
    expect(offer?.description).toBe("Trabajo con IA\ny Python")
    expect(offer?.date).toBe("2026-08-14")
    expect(offer?.url).toBe(`${PUBLIC_OFFER_URL}/1850419565`)
  })

  test("uses only an explicitly supplied company name", () => {
    expect(mapOffer({ id: "123456", titulo: "TFM", nombreEmpresa: "Acme" })?.company).toBe("Acme")
  })
})

describe("Empléate URLs", () => {
  test("builds paging, Spain, location, and freshness filters", () => {
    const url = new URL(buildSearchUrl({ query: "TFM AI", location: "Madrid", jobage: 30, page: 2 }))
    expect(url.searchParams.get("start")).toBe("10")
    expect(url.searchParams.get("q")).toBe("TFM AI")
    expect(url.searchParams.getAll("fq")).toContain("pais:724")
    expect(url.searchParams.getAll("fq").join(" ")).toContain('provinciaF:"Madrid"')
    expect(url.searchParams.getAll("fq")).toContain("fechaCreacion:[NOW-30DAYS TO NOW]")
  })

  test("builds exact-ID detail filtering", () => {
    expect(new URL(buildDetailUrl("1850419565")).searchParams.get("fq")).toBe("id:1850419565")
  })

  test("normalizes bare IDs and public offer URLs", () => {
    expect(normalizeId("1850419565")).toBe("1850419565")
    expect(normalizeId("https://empleate.gob.es/empleo/#/oferta/1850419565")).toBe("1850419565")
    expect(normalizeId("not-an-offer")).toBeNull()
  })
})

describe("request behavior", () => {
  test("returns null on 404", async () => {
    globalThis.fetch = (async () => new Response("", { status: 404 })) as typeof fetch
    expect(await jsonFetch("https://empleate.gob.es/example")).toBeNull()
  })

  test("retries 429 and succeeds", async () => {
    let calls = 0
    globalThis.setTimeout = ((fn: () => void) => originalSetTimeout(fn, 0)) as unknown as typeof setTimeout
    globalThis.fetch = (async () => {
      calls++
      return calls === 1
        ? new Response("", { status: 429 })
        : Response.json({ response: { numFound: 0, docs: [] } })
    }) as typeof fetch
    await jsonFetch("https://empleate.gob.es/example")
    expect(calls).toBe(2)
  })
})

