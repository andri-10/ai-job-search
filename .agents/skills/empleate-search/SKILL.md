---
name: empleate-search
description: Search Spain's official SEPE Empléate portal for thesis-compatible AI, software, systems, and engineering internships. Use for Spanish opportunities, prácticas, prácticas curriculares, becas, TFM, trabajo fin de máster, proyecto fin de máster, or vacancies on empleate.gob.es.
allowed-tools: Bash(bun run .agents/skills/empleate-search/cli/src/cli.ts *)
---

# Empléate Search

Use Spain's official SEPE Empléate aggregator for Spanish internship and thesis-placement
leads. Before searching, read [`../../../CLAUDE.md`](../../../CLAUDE.md) and
[`../../../.claude/skills/job-scraper/search-queries.md`](../../../.claude/skills/job-scraper/search-queries.md)
for the canonical candidate and thesis requirements.

## Commands

```bash
bun run .agents/skills/empleate-search/cli/src/cli.ts search -q "prácticas inteligencia artificial" --format table
bun run .agents/skills/empleate-search/cli/src/cli.ts search -q "TFM machine learning" -l Barcelona --jobage 90
bun run .agents/skills/empleate-search/cli/src/cli.ts search -q "prácticas desarrollo software" -l Madrid --limit 10 --format plain
bun run .agents/skills/empleate-search/cli/src/cli.ts search -q "proyecto fin de máster optimización" -l Bilbao
bun run .agents/skills/empleate-search/cli/src/cli.ts detail 1850419565 --format plain
```

Search accepts `--query`/`-q`, `--location`/`-l`, `--jobage <days>`,
`--page <n>`, `--limit <n>`, and `--format json|table|plain`.
Location matches the city, province, or autonomous-community fields. Detail accepts a
numeric Empléate ID or an Empléate offer URL and `--format json|plain`.

## Search strategy

Run focused queries separately; do not combine every thesis synonym into one query:

- `prácticas inteligencia artificial`, `prácticas machine learning`, `prácticas desarrollo software`
- `TFM inteligencia artificial`, `trabajo fin de máster software`, `proyecto fin de máster optimización`
- `prácticas curriculares informática`, `beca ingeniería informática`
- Barcelona, Madrid, Bilbao, Valencia, Málaga, Seville, and Zaragoza as location passes

Empléate labels internships, but that label alone does not establish thesis compatibility.
Retain only opportunities that can support an individual 22-26 week, 30-ECTS thesis
around March-August/September 2027, with academic/company supervision and an examinable
technical result. Paid and English-speaking opportunities are strongly preferred.

## Output formats

| Format | Best for |
|---|---|
| `json` | Programmatic search and downstream ranking |
| `table` | Quick review of titles, locations, dates, and source portals |
| `plain` | Reading search results or a full posting description |

## Boundaries and caveats

- Use only Empléate's public `open/offersearch/selectBuscador` endpoint. Do not access
  account, profile, application, saved-offer, or recommendation areas.
- The endpoint is public and used by Empléate's own client, but it is not a documented
  public API. Keep request volume low; if its response contract changes, stop and update
  `url-reference.md` and the parser instead of attempting a bypass.
- On Windows workstations where Bun cannot validate an installed corporate certificate,
  the CLI can retry through Windows PowerShell's system certificate store. It does not
  disable TLS verification.
- Empléate aggregates regional and private portals. Prefer the original external URL
  when one is supplied and deduplicate by external URL, then by Empléate ID.
- Employer names are often omitted by the source feed. Keep `company: null`; never
  substitute the source portal name or infer an employer from the description.
- Spanish-language results fail the English-language gate unless the posting or employer
  confirms English is sufficient. Terms such as `prácticas`, `beca`, or `TFM` are search
  signals, not proof of payment, enrolment eligibility, or thesis supervision.
- The candidate is an Albanian citizen planning an Italian student residence permit.
  Verify Spanish internship/work authorisation and any university-agreement requirement
  before tracking a result as application-ready.
