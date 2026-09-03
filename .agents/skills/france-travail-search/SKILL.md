---
name: france-travail-search
description: >
  Manually retrieve French thesis-compatible AI, software, systems, and engineering
  internships through France Travail. Use for opportunities in France when a
  browser-assisted vacancy search is appropriate; do not use its partner API without credentials.
---

# France Travail — France Manual Search

Use the public vacancy search at
[candidat.francetravail.fr](https://candidat.francetravail.fr/offres/recherche)
in a normal browser. France Travail's partner API requires a registered application
and OAuth credentials, so do not use it, undocumented endpoints, `curl`, or automated
pagination/detail-page collection.

Before searching, read the canonical sources:

- [`../../../CLAUDE.md`](../../../CLAUDE.md) for candidate constraints
- [`../../../.claude/skills/job-scraper/search-queries.md`](../../../.claude/skills/job-scraper/search-queries.md) for thesis scope and screening rules

## Manual Search Procedure

1. Open the public offers search and run one focused query at a time. Useful English
   and French queries include:
   - `stage de fin d'études intelligence artificielle`
   - `stage machine learning`
   - `stage ingénieur logiciel`
   - `mémoire de master informatique`
   - `stage systèmes embarqués`
2. Prioritise Paris/Île-de-France, Grenoble, Lyon, Toulouse, Sophia Antipolis, and
   France-wide hybrid roles. Use visible filters for posting date, `stage`, contract,
   and work arrangement where they improve relevance.
3. Open only promising listings. Follow any visible employer/careers application
   link and save that direct employer URL—not a France Travail search URL—in the
   tracker whenever available.
4. Check every role against the canonical paid-placement, English working-language,
   22–26-week, individual-thesis, supervision, and work-authorisation requirements.
   The candidate has French at B1: flag B2/C1/fluent-French requirements clearly;
   French-only postings without evidence of an English working environment are not
   suitable by default.

## Output

For every viable match, provide title, employer, French location, posting date or
deadline, direct employer URL, source `france-travail-search`, and a brief fit signal.
Deduplicate against `job_scraper/seen_jobs.json` and `job_search_tracker.csv` before
presenting it.

## Boundaries

- Use low-volume interactive searches only for Andri's personal job search.
- Do not automate result pages, pagination, or detail-page retrieval.
- France Travail aggregates partner listings; verify the original employer page before
  presenting a role as open or preparing an application.
