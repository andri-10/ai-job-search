---
name: academictransfer-search
description: Search AcademicTransfer for Netherlands-based research internships and Master's-thesis opportunities in AI, software, systems, and engineering. Use for Dutch jobs, stages, afstudeerstages, scriptiestages, onderzoeksstages, or vacancies on academictransfer.com.
allowed-tools: Bash(bun run .agents/skills/academictransfer-search/cli/src/cli.ts *)
---

# AcademicTransfer Search

Use AcademicTransfer as a Netherlands-focused source for university, research-institute,
and research-intensive employer opportunities. Before searching, read
[`../../../CLAUDE.md`](../../../CLAUDE.md) and
[`../../../.claude/skills/job-scraper/search-queries.md`](../../../.claude/skills/job-scraper/search-queries.md)
for the canonical thesis requirements.

## Commands

```bash
bun run .agents/skills/academictransfer-search/cli/src/cli.ts search -q "machine learning internship" --thesis --format table
bun run .agents/skills/academictransfer-search/cli/src/cli.ts search -q "computer science thesis" -l Amsterdam --jobage 180
bun run .agents/skills/academictransfer-search/cli/src/cli.ts search -q "AI afstudeerstage" -l Eindhoven --limit 10 --format plain
bun run .agents/skills/academictransfer-search/cli/src/cli.ts search -q "software engineering onderzoeksstage" -l Delft
bun run .agents/skills/academictransfer-search/cli/src/cli.ts detail 361933 --format plain
```

Search accepts `--query`/`-q`, `--location`/`-l`, `--jobage <days>`,
`--page <n>`, `--limit <n>`, `--format json|table|plain`, and `--thesis`.
AcademicTransfer has no structured location parameter, so `--location` is included
in the keyword query. Only page 1 is available through the permitted public HTML;
the portal's private API must not be used. `--jobage` filters the server-rendered
first page locally.

Detail accepts a numeric vacancy ID or AcademicTransfer job URL and
`--format json|plain`.

## Output formats

| Format | Best for |
|---|---|
| `json` | Programmatic search and downstream ranking |
| `table` | Quick review of titles, employers, and locations |
| `plain` | Reading results or a full vacancy description |

## Screening and boundaries

- Keep requests low-volume and respect AcademicTransfer's published crawl delay.
- Use only public search and detail pages. Do not call `api.academictransfer.com`,
  fetch `/apply/` pages, create accounts, or submit applications.
- AcademicTransfer is research-focused rather than a complete Dutch labour-market
  index. Use it alongside the cross-European sources for commercial internships.
- A result is not automatically thesis-compatible. Verify a 22-26 week window,
  individual thesis scope and supervision, compensation, English working language,
  and work authorisation before tracking or applying.
- Dutch terms worth trying include `stage`, `afstudeerstage`, `scriptiestage`, and
  `onderzoeksstage`. A Dutch-language result still fails the language gate unless
  the employer confirms English is sufficient.
