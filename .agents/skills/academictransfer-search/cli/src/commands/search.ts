import { emitSearch, fail, fetchHtml, parseJobCards, positive, stringFlag, type Flags } from "../helpers";

export async function search(flags: Flags) {
  const query = stringFlag(flags.query);
  if (!query) fail("search requires --query/-q", "MISSING_REQUIRED");
  const page = positive("page", flags.page, 1, 100);
  if (page !== 1) fail("AcademicTransfer public HTML supports page 1 only", "UNSUPPORTED_PAGE");
  const thesis = flags.thesis === true;
  const jobage = positive("jobage", flags.jobage, thesis ? 180 : 365, 3650);
  const limit = positive("limit", flags.limit, thesis ? 10 : 10, 10);
  const location = stringFlag(flags.location);
  const effectiveQuery = [query, location].filter(Boolean).join(" ");
  const url = new URL("/en/jobs/", "https://www.academictransfer.com");
  url.searchParams.set("q", effectiveQuery);
  const html = await fetchHtml(url.toString());
  if (!html) fail("search page not found", "NOT_FOUND");
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - jobage);
  const cutoffIso = cutoff.toISOString().slice(0, 10);
  const jobs = parseJobCards(html).filter((job) => !job.date || job.date >= cutoffIso).slice(0, limit);
  emitSearch(jobs, stringFlag(flags.format) ?? "json", {
    page,
    query,
    location: location ?? null,
    jobage,
    source: "academictransfer-search",
  });
}

