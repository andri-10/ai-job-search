export type Flags = Record<string, string | boolean>;

export type Job = {
  id: string;
  title: string | null;
  company: string | null;
  location: string | null;
  date: string | null;
  deadline: string | null;
  url: string | null;
};

export type Detail = Job & {
  description: string | null;
  applyUrl: string | null;
};

const origin = "https://www.academictransfer.com";
const userAgent = "Mozilla/5.0 (compatible; academictransfer-cli/1.0)";

export function fail(error: string, code: string): never {
  process.stderr.write(JSON.stringify({ error, code }) + "\n");
  process.exit(1);
}

export function parseArgs(args: string[]) {
  const positional: string[] = [];
  const flags: Flags = {};
  const aliases: Record<string, string> = { q: "query", l: "location", n: "limit" };
  const booleanFlags = new Set(["thesis"]);
  const allowed = new Set(["query", "location", "jobage", "page", "limit", "format", "thesis"]);

  for (let index = 0; index < args.length; index++) {
    const argument = args[index];
    if (!argument.startsWith("-")) {
      positional.push(argument);
      continue;
    }

    const raw = argument.replace(/^-+/, "");
    const key = aliases[raw] ?? raw;
    if (!allowed.has(key)) fail(`unknown flag: ${argument}`, "BAD_ARG");
    if (booleanFlags.has(key)) {
      flags[key] = true;
      continue;
    }

    const value = args[index + 1];
    if (!value || value.startsWith("-")) fail(`${argument} requires a value`, "MISSING_REQUIRED");
    flags[key] = value;
    index++;
  }

  return { positional, flags };
}

export function stringFlag(value: string | boolean | undefined) {
  return typeof value === "string" ? value : undefined;
}

export function positive(name: string, value: string | boolean | undefined, fallback: number, maximum: number) {
  if (value === undefined) return fallback;
  const number = Number(stringFlag(value));
  if (!Number.isInteger(number) || number < 1 || number > maximum) {
    fail(`--${name} must be an integer from 1 to ${maximum}`, "BAD_ARG");
  }
  return number;
}

export function decodeHtml(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number(decimal)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

export function cleanText(value: string) {
  const withBreaks = value
    .replace(/<(script|style|svg|button)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|li|h[1-6])>/gi, "\n")
    .replace(/<li\b[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, " ");
  return decodeHtml(withBreaks)
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parsePortalDate(value: string | undefined, now = new Date()) {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  const relative = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (normalized === "today") return relative.toISOString().slice(0, 10);
  if (normalized === "yesterday") {
    relative.setUTCDate(relative.getUTCDate() - 1);
    return relative.toISOString().slice(0, 10);
  }
  const match = value.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+[^0-9\s]+(\d{2})$/);
  if (!match) return null;
  const months: Record<string, number> = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  const month = months[match[2].toLowerCase()];
  if (month === undefined) return null;
  return new Date(Date.UTC(2000 + Number(match[3]), month, Number(match[1]))).toISOString().slice(0, 10);
}

export function parseJobCards(html: string, now = new Date()): Job[] {
  const jobs: Job[] = [];
  const cards = html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/gi);
  for (const cardMatch of cards) {
    const card = cardMatch[1];
    const href = card.match(/href="(\/en\/jobs\/(\d+)\/[^"?#]+\/?)"/i);
    if (!href) continue;
    const titleMatch = card.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i);
    const companyMatch = card.match(/<img\b[^>]*\balt="([^"]+)"[^>]*organisation-logo-serp/i)
      ?? card.match(/organisation-logo-serp[^>]*\balt="([^"]+)"/i);
    const title = titleMatch ? cleanText(titleMatch[1]) || null : null;
    const company = companyMatch ? decodeHtml(companyMatch[1]).trim() || null : null;
    const text = cleanText(card);
    const compactText = text.replace(/\s+/g, " ");
    const datePattern = "(?:today|yesterday|\\d{1,2}\\s+[A-Za-z]{3}\\s+[^0-9\\s]+\\d{2})";
    const metadata = compactText.match(new RegExp(`Deadline\\s+(${datePattern})\\s+Published\\s+(${datePattern})\\s+(.+)$`, "i"));
    const rawLocation = metadata?.[3]?.trim() ?? "";
    const companySuffix = company ? new RegExp(`\\s+${escapeRegExp(company)}$`, "i") : null;
    jobs.push({
      id: href[2],
      title,
      company,
      location: rawLocation.replace(companySuffix ?? /$^/, "").trim() || null,
      date: parsePortalDate(metadata?.[2], now),
      deadline: parsePortalDate(metadata?.[1], now),
      url: new URL(href[1], origin).toString(),
    });
  }
  return jobs;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseDetail(html: string, fallbackId: string): Detail {
  const titleMatch = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const canonical = html.match(/href="(\/en\/jobs\/(\d+)\/[^"?#]+\/?)"/i);
  const id = canonical?.[2] ?? html.match(/Vacancy ID\s*(\d+)/i)?.[1] ?? fallbackId;
  const wholeText = cleanText(html);
  const meta = wholeText.match(/Deadline\s+([^\n]+?)\s+Published\s+([^\n]+?)\s+Vacancy ID\s+(\d+)/i);
  const jobSection = html.match(/<h2\b[^>]*>[\s\S]*?Job description[\s\S]*?<\/h2>\s*<div[^>]*>([\s\S]*?)<\/div>\s*<\/section>/i);
  const locationSection = wholeText.match(/(?:Weekly hours[^\n]*\n)?Location\n([^\n]+)/i);
  const companySection = html.match(/<h2\b[^>]*>[\s\S]*?Employer information[\s\S]*?<\/h2>[\s\S]*?<img\b[^>]*\balt="([^"]+)"/i);
  const apply = html.match(/href="([^"]*\/apply\/?)"/i);
  return {
    id,
    title: titleMatch ? cleanText(titleMatch[1]) || null : null,
    company: companySection ? decodeHtml(companySection[1]).trim() || null : null,
    location: locationSection?.[1]?.trim() || null,
    date: parsePortalDate(meta?.[2]),
    deadline: parsePortalDate(meta?.[1]),
    url: canonical ? new URL(canonical[1], origin).toString() : `${origin}/${id}/`,
    description: jobSection ? cleanText(jobSection[1]) || null : null,
    applyUrl: apply ? new URL(decodeHtml(apply[1]), origin).toString() : null,
  };
}

export async function fetchHtml(url: string) {
  let lastStatus = 0;
  for (let attempt = 0; attempt < 6; attempt++) {
    const response = await fetch(url, {
      headers: { Accept: "text/html", "User-Agent": userAgent },
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
    lastStatus = response.status;
    if (response.status === 404) return null;
    if (response.ok) return response.text();
    if (response.status !== 429 && response.status < 500) break;
    await Bun.sleep(Math.min(8_000, 500 * 2 ** attempt + Math.floor(Math.random() * 300)));
  }
  fail(`AcademicTransfer request failed: ${lastStatus}`, "FETCH_ERROR");
}

export function emitSearch(rows: Job[], format: string, meta: Record<string, unknown>) {
  if (!["json", "table", "plain"].includes(format)) fail("--format must be json, table, or plain", "BAD_ARG");
  if (format === "json") {
    console.log(JSON.stringify({ meta: { count: rows.length, ...meta }, results: rows }, null, 2));
    return;
  }
  for (const job of rows) {
    if (format === "plain") {
      console.log(`${job.title ?? "(untitled)"}\n  ${job.company ?? "—"} · ${job.location ?? "—"} · ${job.date ?? "date unknown"}\n  ${job.url ?? "—"}\n`);
    } else {
      console.log(`${job.id.padEnd(8)} ${(job.title ?? "—").slice(0, 54).padEnd(56)} | ${(job.company ?? "—").slice(0, 28).padEnd(30)} | ${job.location ?? "—"}`);
    }
  }
}

export function emitDetail(detail: Detail, format: string) {
  if (!["json", "plain"].includes(format)) fail("detail --format must be json or plain", "BAD_ARG");
  if (format === "json") {
    console.log(JSON.stringify(detail, null, 2));
    return;
  }
  console.log(`${detail.title ?? "(untitled)"}\n${detail.company ?? "—"} · ${detail.location ?? "—"}\nPublished: ${detail.date ?? "unknown"} · Deadline: ${detail.deadline ?? "unknown"}\n${detail.url ?? "—"}\n\n${detail.description ?? "No description found."}\n\nApply: ${detail.applyUrl ?? "not listed"}`);
}
