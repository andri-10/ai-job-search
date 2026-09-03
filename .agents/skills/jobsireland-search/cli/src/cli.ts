#!/usr/bin/env bun
export {};

type Flags = Record<string, string | boolean>;
type Job = { id: string; reference: string | null; title: string | null; company: string | null; location: string | null; published: string | null; closing: string | null; vacancyType: string | null; url: string };

const browseUrl = "https://jobsireland.ie/en-US/browse-jobs";
const detailBase = "https://employer.jobsireland.ie/Reports/GetJobsDetail?id=";

function fail(error: string, code: string): never { process.stderr.write(JSON.stringify({ error, code }) + "\n"); process.exit(1); }
function parse(args: string[]) { const positional: string[] = []; const flags: Flags = {}; for (let i = 0; i < args.length; i++) { const value = args[i]; if (!value.startsWith("-")) { positional.push(value); continue; } const raw = value.replace(/^-+/, ""); const key = raw === "q" ? "query" : raw === "l" ? "location" : raw; const next = args[i + 1]; flags[key] = next && !next.startsWith("-") ? (i++, next) : true; } return { positional, flags }; }
function stringFlag(value: string | boolean | undefined) { return typeof value === "string" ? value : undefined; }
function positive(name: string, value: string | boolean | undefined, fallback: number, maximum: number) { if (value === undefined) return fallback; const number = Number(stringFlag(value)); if (!Number.isInteger(number) || number < 1 || number > maximum) fail(`--${name} must be an integer from 1 to ${maximum}`, "BAD_ARG"); return number; }
function decode(value: string | null) { if (!value) return null; return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim() || null; }
function input(block: string, id: string) { return decode(block.match(new RegExp(`<input[^>]+id="${id}"[^>]+value="([^"]*)"`, "i"))?.[1] ?? null); }
function company(block: string) { return decode(block.match(/alt="Logo of\s*([^"]+)"/i)?.[1] ?? block.match(/alt="Default Logo of\s*([^"]+)"/i)?.[1] ?? null); }
function parseJobs(html: string): Job[] {
  const starts = [...html.matchAll(/<div\s+class="job-heading\s+position-box"[^>]*data-vacancyid\s*=\s*"(\d+)"/gi)];
  return starts.map((match, index) => {
    const block = html.slice(match.index, starts[index + 1]?.index);
    const id = match[1];
    return { id, reference: input(block, "JobReference"), title: input(block, "JobTitle"), company: company(block), location: input(block, "Location"), published: input(block, "StartDate"), closing: input(block, "EndDate"), vacancyType: input(block, "VacancyTypeId"), url: detailBase + encodeURIComponent(id) };
  });
}
async function request(url: string) { const response = await fetch(url, { headers: { Accept: "text/html", "User-Agent": "ai-job-search personal vacancy search" }, signal: AbortSignal.timeout(15_000) }); if (response.status === 404) return null; if (!response.ok) fail(`JobsIreland request failed: ${response.status}`, "HTTP_ERROR"); return { contentType: response.headers.get("content-type") ?? "application/octet-stream", bytes: new Uint8Array(await response.arrayBuffer()) }; }
function output(rows: Job[], format: string, meta: Record<string, unknown>) { if (!['json', 'table', 'plain'].includes(format)) fail("--format must be json, table, or plain", "BAD_ARG"); if (format === "json") { console.log(JSON.stringify({ meta: { count: rows.length, ...meta }, results: rows }, null, 2)); return; } for (const job of rows) console.log(format === "plain" ? `${job.title ?? "(untitled)"}\n  ${job.company ?? "—"} · ${job.location ?? "—"}\n  ${job.url}\n` : `${job.id.padEnd(12)} ${(job.title ?? "—").slice(0, 44).padEnd(46)} | ${job.company ?? "—"} | ${job.location ?? "—"}`); }
async function search(flags: Flags) { const query = stringFlag(flags.query); if (!query) fail("search requires --query/-q", "MISSING_REQUIRED"); const thesis = flags.thesis === true; const pageSize = positive("limit", flags.limit, thesis ? 12 : 20, 25); const page = positive("page", flags.page, 1, 1); const params = new URLSearchParams({ CareerlevelId: "-1", ContractTypeId: "", NaceCode: "-1", RemoteOrBlendedJobType: "-1", VacancyTypeId: "-1", keyWord: query, location: stringFlag(flags.location) ?? "", page: String(page), pageSize: String(pageSize), vacancyId: "-1" }); const response = await request(`${browseUrl}?${params}`); if (!response) fail("listing page not found", "NOT_FOUND"); if (!response.contentType.includes("text/html")) fail(`expected listing HTML, received ${response.contentType}`, "UNEXPECTED_RESPONSE"); output(parseJobs(new TextDecoder().decode(response.bytes)), stringFlag(flags.format) ?? "json", { query, location: stringFlag(flags.location) ?? null, page, pageSize }); }
function urls(bytes: Uint8Array) { const source = new TextDecoder("latin1").decode(bytes); return [...new Set(source.match(/https?:\/\/[^\s()<>{}\[\]\\]+/g) ?? [])].map((url) => url.replace(/[.,;'\"]+$/, "")).filter((url) => { try { return !["jobsireland.ie", "w3.org", "purl.org", "aiim.org"].some((domain) => new URL(url).hostname.endsWith(domain)); } catch { return false; } }); }
async function detail(id: string, flags: Flags) { if (!/^\d+$/.test(id)) fail("detail requires a numeric JobsIreland vacancy ID", "MISSING_REQUIRED"); const response = await request(detailBase + encodeURIComponent(id)); if (!response) fail("job not found", "NOT_FOUND"); const url = detailBase + id; const format = stringFlag(flags.format) ?? "json"; if (response.contentType.includes("application/pdf")) { const directUrls = urls(response.bytes); const result = { id, url, contentType: response.contentType, directUrls, note: "JobsIreland serves this detail record as a PDF; open the PDF to read the full description." }; if (format === "json") console.log(JSON.stringify(result, null, 2)); else console.log([result.note, url, ...directUrls].join("\n")); return; } if (!response.contentType.includes("text/html")) fail(`unsupported detail response: ${response.contentType}`, "UNEXPECTED_RESPONSE"); const text = decode(new TextDecoder().decode(response.bytes).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ")); if (format === "json") console.log(JSON.stringify({ id, url, contentType: response.contentType, text }, null, 2)); else console.log(text); }

const parsed = parse(process.argv.slice(2));
if (parsed.positional[0] === "search") await search(parsed.flags);
else if (parsed.positional[0] === "detail") await detail(parsed.positional[1] ?? "", parsed.flags);
else fail("use: search --query <text> [--thesis] or detail <vacancy-id>", "BAD_CMD");
