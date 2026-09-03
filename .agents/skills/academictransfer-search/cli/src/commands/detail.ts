import { emitDetail, fail, fetchHtml, parseDetail, stringFlag, type Flags } from "../helpers";

export async function detail(reference: string, flags: Flags) {
  const match = reference.match(/(?:academictransfer\.com\/(?:en\/jobs\/)?|^)(\d+)/i);
  if (!match) fail("detail requires an AcademicTransfer vacancy ID or job URL", "MISSING_REQUIRED");
  const id = match[1];
  const html = await fetchHtml(`https://www.academictransfer.com/${encodeURIComponent(id)}/`);
  if (!html) fail("vacancy not found", "NOT_FOUND");
  emitDetail(parseDetail(html, id), stringFlag(flags.format) ?? "json");
}

