---
name: freehire-search
description: >
  Search live, thesis-relevant AI, software, systems, and engineering internships
  for Andri Halili through Freehire's public API. Use for paid, English-speaking,
  degree-integrated opportunities in the candidate's configured European markets,
  or to inspect a specific Freehire posting.
allowed-tools: Bash(bun run .agents/skills/freehire-search/cli/src/cli.ts *)
---

# Freehire Search

Search Freehire's structured job listings with `bun`. Freehire aggregates public
ATS postings and needs no authentication or API key.

## Personal Search Scope

This portal skill is intentionally a thin adapter. Before a personal search, read:

- [`../../../CLAUDE.md`](../../../CLAUDE.md) for Andri's profile and non-negotiables
- [`../../../.claude/skills/job-scraper/search-queries.md`](../../../.claude/skills/job-scraper/search-queries.md) for current role, country, timing, and screening priorities

Use this source for technical opportunities matching that canonical scope:
applied AI/ML, LLMs, computer vision, backend and systems engineering,
optimisation, and embedded or domain-intensive engineering. Prefer internships,
graduate-thesis placements, and thesis-compatible working-student or research
roles.

Default to a 14-day window and a modest limit. For a broad European search, use
`--region eu,none`; `none` preserves remote and European roles whose geography
Freehire could not resolve. Apply `--country` only when narrowing a market.

Screen every promising result against the canonical requirements: English working
language, paid or viable compensation, 22-26-week thesis timing, an individual
technical contribution, and work authorisation. An Italian student residence
permit does not by itself authorise work outside Italy.

## Commands

### Search

```bash
bun run .agents/skills/freehire-search/cli/src/cli.ts search --thesis [-q "<keywords>"] [flags]
```

| Flag | Purpose |
|---|---|
| `--query` / `-q` | Full-text search terms |
| `--jobage <days>` | Posting recency |
| `--limit <n>` | Result cap |
| `--format json\|table\|plain` | Use `json` for screening and automation |
| `--region <codes>` | Macro-region, such as `eu,none` |
| `--country <codes>` | ISO-3166 alpha-2 country codes, such as `AT,DE,CH` |
| `--city <names>` | One or more city names |
| `--seniority <levels>` | Such as `intern`, `junior`, or `middle` |
| `--category <cats>` | Such as `ml_ai`, `backend`, `fullstack`, or `devops` |
| `--skill <names>` | Canonical skill names |
| `--remote <mode>` | `remote`, `hybrid`, or `onsite` |
| `--thesis` | Apply 14-day, 12-result, and `eu,none` defaults unless explicitly overridden |

Search results already include full descriptions. Pre-filter by title, location,
employment type, and thesis viability before reading descriptions closely. Do not
call `detail` for each result from the same search.

### Detail

```bash
bun run .agents/skills/freehire-search/cli/src/cli.ts detail <slug-or-url> --format json
```

Use `detail` for a tracked or shared posting, or when the result is no longer in
a search response.

## Personal Usage Examples

```bash
# Applied ML or computer-vision internships in the configured European scope
bun run .agents/skills/freehire-search/cli/src/cli.ts search --thesis -q "machine learning internship" --category ml_ai --format json

# Backend or systems internships in the primary markets
bun run .agents/skills/freehire-search/cli/src/cli.ts search --thesis -q "software engineering internship" --country AT,DE,CH --format json

# Thesis-compatible embedded or systems work
bun run .agents/skills/freehire-search/cli/src/cli.ts search --thesis -q "embedded systems internship" --format json
```

## Result Quality Rules

- Freehire can return an aggregator URL. Before presenting, tracking, or applying,
  verify that it resolves to the direct employer ATS or careers posting. Find the
  direct employer URL or drop the result; never store an aggregator redirect or a
  listing-page URL.
- Missing region or country means unknown, not out of scope. Use `eu,none` when
  searching broadly and inspect the location text before deciding.
- Freehire is technical-role focused. Do not use it for general job hunting.
- Public search and detail calls are read-only. Do not use Freehire's personal
  apply/save features.
