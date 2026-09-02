---
name: scrape
description: >
  Find new, thesis-compatible AI, software, systems, and engineering internships
  for Andri Halili. Use for /scrape, /scrape broad, /scrape health, or a focused
  Master's-thesis placement search across the configured European markets.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(bun --version), Bash(bun run .agents/skills/*/cli/src/cli.ts *), WebFetch, WebSearch
---

# /scrape — Andri's Master-Thesis Search

This is the Codex-facing entrypoint for Andri Halili's degree-integrated
Master-thesis internship search. It deliberately contains no duplicate candidate
profile, country list, language information, or application rules.

Before searching, read these canonical sources:

- [`../../../CLAUDE.md`](../../../CLAUDE.md) — candidate profile and constraints
- [`../../../.claude/skills/job-scraper/SKILL.md`](../../../.claude/skills/job-scraper/SKILL.md) — complete execution, deduplication, health-check, and presentation workflow
- [`../../../.claude/skills/job-scraper/search-queries.md`](../../../.claude/skills/job-scraper/search-queries.md) — active thesis timing, target markets, queries, and screening criteria

Follow the canonical workflow exactly. Search only for technically substantive,
degree-integrated opportunities that can plausibly become Andri's 30-ECTS,
22–26-week Master thesis; surface any language, compensation, or work-authorisation
uncertainty rather than assuming it away.

## Invocation

- `/scrape` — search the default priority categories with recent postings.
- `/scrape broad` — search every configured category and market.
- `/scrape health` — diagnose portal availability only; do not search, deduplicate, or present job matches.
- `/scrape <focus area>` — prioritise a relevant configured area such as `AI`, `machine learning`, `backend`, `systems`, `optimisation`, or `embedded`.

Use each enabled portal skill's documented interface. Run only documented CLIs in
the automated search step; offer browser-assisted sources when their market is
requested and follow their no-automation constraints. For Freehire, invoke its
explicit `--thesis` preset unless the canonical workflow needs a deliberate
override. Keep all portal calls read-only, deduplicate against the repository
state and application tracker, and present only verified direct employer posting
URLs.
