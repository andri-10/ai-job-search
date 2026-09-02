---
name: job-room-search
description: >
  Manually retrieve Swiss thesis-compatible AI, software, systems, and engineering
  internships through work.swiss Job-Room. Use for opportunities in Switzerland when
  a browser-assisted vacancy search is appropriate; do not use it as an automated API scraper.
---

# work.swiss Job-Room — Switzerland Manual Search

Use the public vacancy search on [work.swiss](https://www.arbeit.swiss/en) / Job-Room
in a normal browser. The documented Job-Room API is an employer job-publication API
that requires organisation credentials; it is not a public candidate-search API.
Treat this source as browser-assisted only: do not use `curl`, an undocumented API,
or automated pagination/detail-page collection.

Before searching, read the canonical sources:

- [`../../../CLAUDE.md`](../../../CLAUDE.md) for candidate constraints
- [`../../../.claude/skills/job-scraper/search-queries.md`](../../../.claude/skills/job-scraper/search-queries.md) for thesis scope and screening rules

## Manual Search Procedure

1. Open [work.swiss](https://www.arbeit.swiss/en) and follow its visible **Job-Room** vacancy-search link.
2. Search a focused query at a time. Start with English terms, then use local terms only when their requirements can be read and checked:
   - `Master thesis machine learning`
   - `thesis internship software engineering`
   - `Praktikum Machine Learning`
   - `Masterarbeit Softwareentwicklung`
   - `Abschlussarbeit Embedded Systems`
3. Prioritise Zurich, Basel, Lausanne, Geneva, and Switzerland-wide / hybrid results. Use visible recency and employment-type filters when available; do not infer eligibility from absent filters.
4. Open only promising listings. Prefer the visible original employer/careers link for evaluation and application. Save that direct posting URL—not a transient Job-Room result URL—in the tracker.
5. Check each role against the canonical paid-placement, English-language, 22–26-week, individual-thesis, supervision, and work-authorisation requirements. German, French, or Italian requirements are exclusions when not supported by the candidate's stated proficiency; make uncertainty explicit.

## Output

For every viable match, provide title, employer, Swiss location, posting date or
deadline, direct employer URL, source `job-room-search`, and a brief fit signal.
Deduplicate against `job_scraper/seen_jobs.json` and `job_search_tracker.csv` before
presenting it.

## Boundaries

- Use low-volume interactive searches only for Andri's personal job search.
- Do not automate results, pagination, or detail-page retrieval.
- Job-Room may aggregate external listings; verify the original employer page before
  presenting a role as open or preparing an application.
