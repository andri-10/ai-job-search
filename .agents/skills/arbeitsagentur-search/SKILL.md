---
name: arbeitsagentur-search
description: Search Germany's Federal Employment Agency Jobsuche listings for Andri Halili's thesis-compatible AI, software, systems, and engineering placements. Use for German internships, Praktikum, Abschlussarbeit, Werkstudent, or jobs on arbeitsagentur.de.
allowed-tools: Bash(bun run .agents/skills/arbeitsagentur-search/cli/src/cli.ts *)
---

# Arbeitsagentur Jobsuche

Germany-focused public API source. Before searching, read [`../../../CLAUDE.md`](../../../CLAUDE.md) and [`../../../.claude/skills/job-scraper/search-queries.md`](../../../.claude/skills/job-scraper/search-queries.md) for the canonical thesis requirements.

```bash
bun run .agents/skills/arbeitsagentur-search/cli/src/cli.ts search --thesis -q "machine learning" --location Berlin --format table
bun run .agents/skills/arbeitsagentur-search/cli/src/cli.ts search --thesis -q "software engineering" --location Munich
bun run .agents/skills/arbeitsagentur-search/cli/src/cli.ts detail <reference-number>
```

`--thesis` applies recent Praktikum/Trainee defaults. Verify English working language, compensation, thesis scope, and work authorisation from the full posting. Prefer the direct employer URL from the result before tracking or applying.
