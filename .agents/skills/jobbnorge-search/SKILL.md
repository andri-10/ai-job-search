---
name: jobbnorge-search
description: Search Norway's public Jobbnorge listings for Andri Halili's thesis-compatible AI, software, systems, and engineering placements. Use for Norwegian university, research, public-sector, internship, or graduate roles on jobbnorge.no.
allowed-tools: Bash(bun run .agents/skills/jobbnorge-search/cli/src/cli.ts *)
---

# Jobbnorge Search

Norway-focused public API source, particularly useful for universities, research
organisations, and public employers. Before searching, read
[`../../../CLAUDE.md`](../../../CLAUDE.md) and
[`../../../.claude/skills/job-scraper/search-queries.md`](../../../.claude/skills/job-scraper/search-queries.md)
for the canonical thesis requirements.

```bash
bun run .agents/skills/jobbnorge-search/cli/src/cli.ts search --thesis -q "machine learning" --location Oslo --format table
bun run .agents/skills/jobbnorge-search/cli/src/cli.ts search --thesis -q "software engineer" --location Trondheim
```

`--thesis` limits discovery to recent listings; it does not establish that an
opportunity is a thesis placement. Verify English working language, compensation,
thesis scope, and Norwegian work authorisation in the linked posting in a browser.
Jobbnorge renders the full detail page client-side, so the CLI intentionally returns
the API summary and direct posting URL only. Use the visible employer application route
before tracking or applying.
