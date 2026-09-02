# freehire-cli

CLI for searching [freehire.me](https://freehire.me) for this workspace's
Master-thesis and technical internship opportunities, via its public JSON API.

**Data source**: freehire.me REST API (`/api/v1/agent/jobs/search`, `/api/v1/jobs/facets`, `/api/v1/jobs/{slug}`).
**Authentication**: None required — reads are public (only tracking mutations need a key, and those are out of scope here).
**Dependencies**: None (plain `bun` + `fetch`). `bun install` is optional and only pulls dev type defs.

> **Hosted-service dependency.** This skill talks to freehire.me, a personal
> project maintained on a **best-effort basis with no formal SLA**. If the API is
> unreachable the CLI exits non-zero with a clear error rather than hanging, so an
> outage degrades gracefully instead of breaking the caller. Point `FREEHIRE_API_URL`
> at a self-hosted [freehire](https://github.com/strelov1/freehire) backend to swap
> the source.

## Installation

```bash
cd .agents/skills/freehire-search/cli
bun install   # optional — only installs TypeScript dev types
```

The CLI runs without any install because it has zero runtime dependencies.

## Self-hosting / base URL

The base URL defaults to `https://freehire.me` and is overridable with an env var:

```bash
FREEHIRE_API_URL=http://localhost:8080 bun run src/cli.ts search -q "go"
```

The freehire backend is MIT-licensed and stands up with one command via Docker
Compose (`make up` → API on `:8080`, same `/api/v1/...` paths).

## Commands

| Command | Description |
|---------|-------------|
| `search` | Search jobs by keyword and facet filters |
| `detail` | Fetch full detail for a single job by its slug |

`search` accepts `--format json|table|plain` (default `json`); `detail` accepts `--format json|plain`.
All errors are written to **stderr** as `{ "error": "...", "code": "..." }` with exit code `1`.

`search` hits the API's agent endpoint, so every JSON result already carries the
posting's **full** description (Markdown by default, `--description-format
text|html` to change it). `detail` remains for looking a single posting up by
slug — including a closed one, which search does not return.

## Thesis-search preset

Use `--thesis` for the repository's conservative default search window: the last
14 days, up to 12 results, and `eu,none` as the region filter. The `none` value
retains remote or unresolved-location results for manual location review. It does
not encode the candidate's countries, language, visa status, or role priorities;
those remain in [`../../../CLAUDE.md`](../../../CLAUDE.md) and
[`../../../.claude/skills/job-scraper/search-queries.md`](../../../.claude/skills/job-scraper/search-queries.md).
Explicit `--jobage`, `--limit`, and `--region` flags override the preset.

## Quick examples

```bash
# Applied ML or computer-vision placements in the personal thesis scope
bun run src/cli.ts search --thesis -q "machine learning internship" --category ml_ai --format table

# Software or systems placements in priority markets
bun run src/cli.ts search --thesis -q "software engineering internship" --country AT,DE,CH --format table

# Thesis-compatible embedded systems work
bun run src/cli.ts search --thesis -q "embedded systems internship" --format table

# Full detail for one job (slug from a search result's id)
bun run src/cli.ts detail golang-zensar-2bxu6dxm --format plain
```

See `../SKILL.md` for the full flag reference and the hosted-dependency note.

## Search flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--query` | `-q` | Keywords (title / skill / role). Full-text; optional. |
| `--jobage` | | Posted within N days (`posted_within_days`). |
| `--page` | | 1-indexed page. Default 1. |
| `--limit` | `-n` | Results per page (API limit). Default 25. |
| `--region` | | Macro-region(s), comma = OR (e.g. `eu,us`). |
| `--country` | | ISO-3166 alpha-2 code(s). |
| `--city` | | City name(s). |
| `--seniority` | | Seniority level(s). |
| `--category` | | Role category(ies). |
| `--skill` | | Canonical skill(s). |
| `--company` | | Company slug. |
| `--remote` | | `remote` \| `hybrid` \| `onsite` (`work_mode`). |
| `--facet` | | Any other facet as `key=value` (repeatable). |
| `--format` | | `json` \| `table` \| `plain`. |
| `--description-format` | | `markdown` (default) \| `text` \| `html` — how each result's full description is rendered (`json` output only). |
| `--thesis` | | Apply the workspace thesis defaults unless the corresponding flags are explicitly set. |

Facet values come from Freehire's controlled vocabularies. Discover the live
values (with counts) for a market at
[`/api/v1/jobs/facets`](https://freehire.me/api/v1/jobs/facets), or narrow it,
e.g. `https://freehire.me/api/v1/jobs/facets?q=react`.

Before presenting, tracking, or applying to a result, use the direct employer
ATS/careers URL rather than an aggregator redirect. See [`../SKILL.md`](../SKILL.md)
for the required screening workflow.
