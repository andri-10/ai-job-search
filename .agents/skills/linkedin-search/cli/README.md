# linkedin-cli

CLI for discovering LinkedIn postings relevant to Andri Halili's paid,
English-speaking, degree-integrated Master's-thesis search across his configured
European markets.

- **Data source:** LinkedIn public `jobs-guest` search and detail endpoints
- **Authentication:** none
- **Runtime dependencies:** none; plain Bun and `fetch`
- **Use:** personal, low-volume discovery only

Automated access is against LinkedIn's Terms of Service. Do not use this CLI for
commercial or bulk collection.

## Installation

```bash
cd .agents/skills/linkedin-search/cli
bun install
```

Installation is optional for runtime use and only installs TypeScript development types.

## Commands

| Command | Description |
|---|---|
| `search` | Search public listings; `--location` is required |
| `detail` | Fetch the complete public detail for one job ID or URL |

## Candidate-focused examples

```bash
# Applied AI thesis placements in Vienna
bun run src/cli.ts search -q '"master thesis" AI' -l "Vienna, Austria" --jobage 30 --format table

# German-language thesis terminology
bun run src/cli.ts search -q "Masterarbeit machine learning" -l "Germany" --jobage 30 --format table

# Software thesis work in Switzerland
bun run src/cli.ts search -q '"master thesis" software engineering' -l "Switzerland" --jobage 30 --format table

# Remote back-end thesis opportunities in Europe
bun run src/cli.ts search -q '"thesis internship" backend' -l "European Union" --remote remote --jobage 30 --format table

# Inspect one complete posting before screening it
bun run src/cli.ts detail 4426311357 --format plain
```

## Search flags

| Flag | Alias | Description |
|---|---|---|
| `--location` | `-l` | **Required.** Configured market/city such as `Vienna, Austria`, `Germany`, `Switzerland`, or `Remote`. |
| `--query` | `-q` | Thesis terminology plus technical focus. |
| `--jobage` | | Posted within N days; 30 is the routine-monitoring default used by the workflow. |
| `--jobage-minutes` | | Sub-day freshness; conflicts with `--jobage`. |
| `--remote` | | `remote`, `hybrid`, or `onsite`. |
| `--page` | | 1-indexed page; 10 results per page. |
| `--limit` | `-n` | Client-side result cap. |
| `--format` | | `json`, `table`, or `plain`. |

Search output is discovery data, not a fit decision. Retrieve the full posting with
`detail`, then apply the thesis, English-language, compensation, timing, supervision,
and destination-country authorisation checks in `../SKILL.md`.

All errors are written to stderr as JSON with exit code `1`. Endpoint and parser
details are maintained in `../url-reference.md`.
