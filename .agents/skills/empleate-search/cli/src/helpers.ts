export const SEARCH_URL =
  "https://empleate.gob.es/empleate/open/offersearch/selectBuscador"
export const PUBLIC_OFFER_URL = "https://empleate.gob.es/empleo/#/oferta"

const UA = "Mozilla/5.0 (compatible; empleate-search-cli/1.0)"

export interface RawOffer {
  [key: string]: unknown
  id?: string | number
  titulo?: string
  companyContact?: string | { name?: string; nombre?: string } | null
  empresa?: string | null
  nombreEmpresa?: string | null
  ciudadF?: string | null
  provinciaF?: string | null
  paisF?: string | null
  fechaCreacionPortal?: string | null
  fechaCreacion?: string | null
  url?: string | null
  contenido?: string | null
  tipoContrato?: string | null
  origen?: string | null
  categoriaF?: string | null
  subcategoriaF?: string | null
  jornadaF?: string | null
}

export interface OfferCard {
  id: string
  title: string
  company: string | null
  location: string | null
  date: string | null
  url: string
  source: string | null
}

export interface OfferDetail extends OfferCard {
  description: string | null
  employmentType: string | null
  schedule: string | null
  category: string | null
  applyUrl: string | null
}

interface SearchEnvelope {
  response?: {
    numFound?: number
    docs?: RawOffer[]
  }
}

function validateEnvelope(body: SearchEnvelope): SearchEnvelope {
  if (!body.response || !Array.isArray(body.response.docs)) {
    throw new Error("Empléate returned an unexpected response shape")
  }
  return body
}

async function windowsSystemCaFetch(url: string): Promise<SearchEnvelope> {
  const script = [
    "$ProgressPreference = 'SilentlyContinue'",
    "[Console]::OutputEncoding = [Text.UTF8Encoding]::new()",
    "$headers = @{'User-Agent'='Mozilla/5.0 (compatible; WindowsPowerShell/5.1; empleate-search-cli/1.0)'; 'Accept'='application/json'; 'Accept-Language'='es-ES,es;q=0.9,en;q=0.7'}",
    "$response = Invoke-WebRequest -Uri $env:EMPLEATE_REQUEST_URL -UseBasicParsing -TimeoutSec 20 -Headers $headers",
    "[Text.Encoding]::UTF8.GetString($response.RawContentStream.ToArray())",
  ].join("; ")
  const child = Bun.spawn([
    "powershell.exe",
    "-NoProfile",
    "-NonInteractive",
    "-Command",
    script,
  ], {
    stdout: "pipe",
    stderr: "pipe",
    env: { ...process.env, EMPLEATE_REQUEST_URL: url },
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ])
  if (exitCode !== 0) {
    throw new Error(`Windows system-CA fallback failed: ${stderr.trim() || `exit ${exitCode}`}`)
  }
  return validateEnvelope(JSON.parse(stdout) as SearchEnvelope)
}

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

export async function jsonFetch(url: string): Promise<SearchEnvelope | null> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let response: Response
    try {
      response = await fetch(url, {
        headers: {
          "User-Agent": UA,
          Accept: "application/json",
          "Accept-Language": "es-ES,es;q=0.9,en;q=0.7",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (process.platform === "win32" && /certificate|self.signed|unable to verify/i.test(message)) {
        return windowsSystemCaFetch(url)
      }
      throw error
    }
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((resolve) => setTimeout(resolve, delay + jitter))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    if (response.status === 404) return null
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return validateEnvelope((await response.json()) as SearchEnvelope)
  }
  throw new Error("Request failed after max retries")
}

function explicitCompany(raw: RawOffer): string | null {
  if (typeof raw.companyContact === "string" && raw.companyContact.trim()) {
    return raw.companyContact.trim()
  }
  if (raw.companyContact && typeof raw.companyContact === "object") {
    const candidate = raw.companyContact.name ?? raw.companyContact.nombre
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim()
  }
  for (const candidate of [raw.empresa, raw.nombreEmpresa]) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim()
  }
  return null
}

function cleanText(value: unknown): string | null {
  if (typeof value !== "string") return null
  const cleaned = value
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
  return cleaned || null
}

function offerUrl(raw: RawOffer, id: string): string {
  if (typeof raw.url === "string" && /^https?:\/\//i.test(raw.url)) return raw.url
  return `${PUBLIC_OFFER_URL}/${id}`
}

export function mapOffer(raw: RawOffer): OfferDetail | null {
  const id = raw.id === undefined || raw.id === null ? "" : String(raw.id)
  const title = cleanText(raw.titulo)
  if (!id || !title) return null

  const locationParts = [raw.ciudadF, raw.provinciaF, raw.paisF]
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .map((part) => part.trim())
    .filter((part, index, all) => all.findIndex((other) => other.toLowerCase() === part.toLowerCase()) === index)
  const externalUrl = typeof raw.url === "string" && /^https?:\/\//i.test(raw.url) ? raw.url : null
  const categoryParts = [raw.categoriaF, raw.subcategoriaF]
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)

  return {
    id,
    title,
    company: explicitCompany(raw),
    location: locationParts.length ? locationParts.join(", ") : null,
    date: (raw.fechaCreacionPortal ?? raw.fechaCreacion ?? null)?.slice(0, 10) ?? null,
    url: offerUrl(raw, id),
    source: cleanText(raw.origen),
    description: cleanText(raw.contenido),
    employmentType: cleanText(raw.tipoContrato),
    schedule: cleanText(raw.jornadaF),
    category: categoryParts.length ? categoryParts.join(" / ") : null,
    applyUrl: externalUrl,
  }
}

export function asCard(detail: OfferDetail): OfferCard {
  const { id, title, company, location, date, url, source } = detail
  return { id, title, company, location, date, url, source }
}

function solrPhrase(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
}

export interface SearchParams {
  query?: string
  location?: string
  jobage?: number
  page: number
}

export function buildSearchUrl(opts: SearchParams): string {
  const params = new URLSearchParams()
  params.set("q.op", "AND")
  params.set("rows", "10")
  params.set("start", String((opts.page - 1) * 10))
  params.set("q", opts.query?.trim() || "*")
  params.append("fq", "pais:724")
  if (opts.location?.trim()) {
    const place = solrPhrase(opts.location.trim())
    params.append("fq", `(ciudadF:${place} OR provinciaF:${place} OR comunidadF:${place})`)
  }
  if (opts.jobage !== undefined && opts.jobage > 0) {
    params.append("fq", `fechaCreacion:[NOW-${opts.jobage}DAYS TO NOW]`)
  }
  params.set("wt", "json")
  return `${SEARCH_URL}?${params.toString()}`
}

export function buildDetailUrl(id: string): string {
  const params = new URLSearchParams({
    "q.op": "AND",
    rows: "1",
    q: "*",
    fq: `id:${id}`,
    wt: "json",
  })
  return `${SEARCH_URL}?${params.toString()}`
}

export function normalizeId(input: string): string | null {
  const bare = input.match(/^\d{6,}$/)
  if (bare) return input
  const fromUrl = input.match(/(?:oferta\/|[?&]id=)(\d{6,})/i)
  return fromUrl?.[1] ?? null
}
