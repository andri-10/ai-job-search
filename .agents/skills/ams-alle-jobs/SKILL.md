---
name: ams-alle-jobs
description: >
  Manually retrieve Austrian thesis-compatible AI, software, systems, and engineering
  internships through AMS alle jobs. Use for opportunities in Vienna or Austria when
  automated scraping is not permitted.
---

# AMS alle jobs — Austria Manual Search

Use AMS **alle jobs** through its normal browser interface at
[`jobs.ams.at`](https://jobs.ams.at). AMS provides a free, no-registration search
across AMS listings, Austrian company listings, public administration, and some
partner sources, but its terms prohibit automated mechanisms. This skill is
therefore browser-assisted only: do not use `curl`, a CLI scraper, page API, or
bulk extraction against AMS.

Before a search, read the canonical sources:

- [`../../../CLAUDE.md`](../../../CLAUDE.md) for candidate constraints
- [`../../../.claude/skills/job-scraper/search-queries.md`](../../../.claude/skills/job-scraper/search-queries.md) for current thesis scope and screening rules

## Manual Search Procedure

1. Open `https://jobs.ams.at` in the browser.
2. Search one focused query at a time, beginning with Vienna. Useful queries:
   - `Masterarbeit Machine Learning`
   - `Praktikum Softwareentwicklung`
   - `Abschlussarbeit KI`
   - `Praktikum Embedded Systems`
   - `Werkstudent Optimierung`
3. Set the location to `Wien` when appropriate. Use the visible filters for
   recency, education, employment relationship, or working time only when they
   improve relevance; do not treat a missing filter as evidence of eligibility.
4. Read only promising listings in the browser. For externally sourced listings,
   follow the visible **original posting** / employer link and save that direct
   employer URL—not an AMS result URL—in the tracker.
5. Assess every candidate against the canonical English-language, paid-placement,
   22–26-week, individual-thesis, supervision, and Austrian work-authorisation
   checks. Surface uncertainty; do not infer it from a German posting.

## Output

For each viable match, record title, employer, Austrian location, posting date or
deadline, direct employer URL, source `ams-alle-jobs`, and a brief fit signal.
Deduplicate against `job_scraper/seen_jobs.json` and `job_search_tracker.csv`
before presenting it.

## Boundaries

- Use only interactive, low-volume searches for Andri's personal job search.
- Do not automate result collection, pagination, or detail-page retrieval.
- AMS can display external/partner listings; prefer their original employer page
  for evaluation and applications.
