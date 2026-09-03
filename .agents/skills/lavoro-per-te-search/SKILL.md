---
name: lavoro-per-te-search
description: >
  Manually retrieve Northern Italy thesis-compatible AI, software, systems, and
  engineering internships through Emilia-Romagna's Lavoro per Te. Use for opportunities
  in Bologna, Modena, Parma, Reggio Emilia, Ferrara, Ravenna, or Rimini when a
  browser-assisted vacancy search is appropriate.
---

# Lavoro per Te — Northern Italy Manual Search

Use the public job search on Emilia-Romagna's
[Lavoro per Te](https://www.agenzialavoro.emr.it/lavoro-per-te/servizi/per-le-persone/consulta-le-offerte-di-lavoro)
in a normal browser. This is a regional public-employment source, not a public API.
Use it browser-assisted only: do not use `curl`, undocumented endpoints, or automated
result, pagination, or detail-page collection.

Before searching, read the canonical sources:

- [`../../../CLAUDE.md`](../../../CLAUDE.md) for candidate constraints
- [`../../../.claude/skills/job-scraper/search-queries.md`](../../../.claude/skills/job-scraper/search-queries.md) for thesis scope and screening rules

## Manual Search Procedure

1. Open the visible **Cerca lavoro** search. Run one focused query at a time:
   - `stage machine learning`
   - `stage intelligenza artificiale`
   - `tirocinio sviluppo software`
   - `tirocinio sistemi embedded`
   - `tesi magistrale ingegneria`
2. Prioritise Bologna, Modena, Parma, Reggio Emilia, Ferrara, Ravenna, and Rimini.
   Use the visible filters for internship (`tirocinio`), contract, sector, education,
   location, and recency only when they improve relevance.
3. Read only promising listings. When a listing supplies an employer careers or
   application URL, save that direct employer URL—not a Lavoro per Te result URL—in
   the tracker.
4. Check every role against the canonical paid-placement, English working-language,
   22–26-week, individual-thesis, supervision, and work-authorisation requirements.
   The candidate has Italian at A2: Italian-only roles are low priority and must not
   be presented as viable without clear evidence that English is an accepted working
   language. Flag Italian B1/B2/C1 requirements prominently.

## Output

For every viable match, provide title, employer, Italian location, posting date or
deadline, direct employer URL when available, source `lavoro-per-te-search`, and a
brief fit signal. Deduplicate against `job_scraper/seen_jobs.json` and
`job_search_tracker.csv` before presenting it.

## Boundaries

- Use low-volume interactive searches only for Andri's personal job search.
- Do not automate results, pagination, or detail-page retrieval.
- Verify the employer's original posting before presenting a role as open or preparing
  an application.
