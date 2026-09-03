---
name: arbetsformedlingen-search
description: Search Sweden's public Arbetsförmedlingen JobSearch listings for Andri Halili's thesis-compatible AI, software, systems, and engineering placements. Use for Swedish internships, thesis placements, graduate roles, or jobs on Platsbanken.
allowed-tools: Bash(bun run .agents/skills/arbetsformedlingen-search/cli/src/cli.ts *)
---

# Arbetsförmedlingen JobSearch

Sweden-focused public API source. Before searching, read
[`../../../CLAUDE.md`](../../../CLAUDE.md) and
[`../../../.claude/skills/job-scraper/search-queries.md`](../../../.claude/skills/job-scraper/search-queries.md)
for the canonical thesis requirements.

```bash
bun run .agents/skills/arbetsformedlingen-search/cli/src/cli.ts search --thesis -q "machine learning" --location Stockholm --format table
bun run .agents/skills/arbetsformedlingen-search/cli/src/cli.ts search --thesis -q "software engineer" --location Gothenburg
bun run .agents/skills/arbetsformedlingen-search/cli/src/cli.ts detail 31343756
```

`--thesis` applies a recent, small-result default. Verify English working language,
compensation, thesis scope, and work authorisation from the full posting. Prefer a
direct employer application URL included in the result before tracking or applying.
