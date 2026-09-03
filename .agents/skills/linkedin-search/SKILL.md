---
name: linkedin-search
description: >
  Search LinkedIn's public listings for Andri Halili's paid, English-speaking,
  degree-integrated Master's-thesis placements in AI, LLMs, machine learning,
  software/back-end engineering, system design, optimisation, automotive, and
  aviation across his configured European markets. Use for LinkedIn jobs,
  thesis internships, Masterarbeit, Abschlussarbeit, stage de fin d'études,
  afstudeerstage, TFM, graduate thesis, or inspecting a LinkedIn posting.
allowed-tools: Bash(bun run .agents/skills/linkedin-search/cli/src/cli.ts *)
---

# LinkedIn Thesis Search

Use LinkedIn as a cross-market discovery source for Andri's Master's-thesis search.
Before searching, read [`../../../CLAUDE.md`](../../../CLAUDE.md) and
[`../../../.claude/skills/job-scraper/search-queries.md`](../../../.claude/skills/job-scraper/search-queries.md).
Those files are authoritative for the candidate profile, locations, timing, and screening
constraints; do not duplicate or silently override them here.

The CLI uses LinkedIn's public `jobs-guest` pages with no authentication or API key and
has zero runtime dependencies beyond Bun. The endpoint is global, but searches must stay
within the locations and opportunity types configured in the canonical profile.

## ⚠️ Personal use only

This uses LinkedIn's public job pages; automated access is against LinkedIn's Terms of
Service, so **keep volume low and do not use it commercially or for bulk collection.**
Run it on your own responsibility.

## Search workflow

1. Run narrow query/location combinations from the canonical search-query file. Prefer
   `--jobage 30` for routine monitoring and page 1 before requesting more pages.
2. Search English thesis terms and the relevant local synonym in separate passes. Useful
   synonyms include `Masterarbeit`, `Abschlussarbeit`, `stage de fin d'études`,
   `afstudeerstage`, `diplomityö`, `opinnäytetyö`, and `TFM`.
3. Retrieve `detail` for every plausible result before judging fit. Search cards do not
   establish thesis scope, language, compensation, dates, or work-authorisation viability.
4. Apply every hard gate from the canonical profile: degree-integrated individual thesis
   scope, required duration and timing, English working language, compensation viability,
   supervision, and destination-country authorisation. Do not call a role application-ready
   when one of these remains contradicted or unknown.
5. Prioritise AI/LLMs, applied machine learning, software/back-end engineering, system
   design, and optimisation, especially in automotive and aviation. Do not reject another
   rigorous technical sector solely because it is outside those preferred industries.
6. Deduplicate by LinkedIn job ID and canonical job URL before handing results to ranking.

## Commands

### Search job listings

```bash
bun run .agents/skills/linkedin-search/cli/src/cli.ts search --location "<place>" [flags]
```

Key flags:

- `--location <text>` / `-l <text>` — **required.** Use a configured market, such as `"Vienna, Austria"`, `"Germany"`, `"Switzerland"`, `"Netherlands"`, or `"Remote"`.
- `--query <text>` / `-q <text>` — thesis terminology plus technical focus. Recommended.
- `--jobage <days>` — posted within N days. Prefer `30` for routine monitoring.
- `--jobage-minutes <n>` — sub-day precision. Conflicts with `--jobage`.
- `--remote <mode>` — `remote`, `hybrid`, or `onsite`.
- `--page <n>` — 1-indexed page; LinkedIn returns 10 results per page.
- `--limit <n>` / `-n <n>` — client-side result cap.
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/linkedin-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

Accept a numeric LinkedIn job ID, full `jobs/view/...` URL, or
`urn:li:jobPosting:...` URN. Detail returns the description, seniority, employment
type, job function, industries, and apply link.

## Candidate-focused examples

```bash
# Highest-priority market: applied AI thesis work in Vienna
bun run .agents/skills/linkedin-search/cli/src/cli.ts search -q '"master thesis" AI' -l "Vienna, Austria" --jobage 30 --format table

# German local terminology for machine-learning thesis placements
bun run .agents/skills/linkedin-search/cli/src/cli.ts search -q "Masterarbeit machine learning" -l "Germany" --jobage 30 --format table

# Software and systems thesis opportunities in Switzerland
bun run .agents/skills/linkedin-search/cli/src/cli.ts search -q '"master thesis" software engineering' -l "Switzerland" --jobage 30 --format table

# Thesis-compatible back-end work across remote Europe
bun run .agents/skills/linkedin-search/cli/src/cli.ts search -q '"thesis internship" backend' -l "European Union" --remote remote --jobage 30 --format table

# Inspect the complete posting before applying the thesis and language gates
bun run .agents/skills/linkedin-search/cli/src/cli.ts detail 4426311357 --format plain
```

## Output formats

| Format | Best for |
|---|---|
| `json` | Programmatic use, deduplication, and downstream ranking |
| `table` | Quick review of search cards |
| `plain` | Reading search results or a full posting |

All errors go to **stderr** as `{ "error": "...", "code": "..." }` with exit code `1`.

## Notes

- LinkedIn is a discovery source, not evidence that a posting is thesis-compatible. Never
  infer compensation, working language, supervision, academic approval, or immigration
  eligibility when the full posting does not state it.
- A generic internship, working-student role, research-assistant role, or graduate job is
  retained only when its scope and timing could credibly become the required thesis placement.
- LinkedIn keyword matching is fuzzy and may return ordinary full-time roles that do not
  contain the thesis term. Treat these as false positives unless detail proves compatibility.
- Page size is fixed at 10. The CLI retries 429/5xx responses with exponential backoff.
- Use the numeric job ID from search results with `detail`.
