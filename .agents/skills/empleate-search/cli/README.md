# empleate-search-cli

Zero-runtime-dependency CLI for Spain's official SEPE Empléate job aggregator.

- **Data source:** public `open/offersearch/selectBuscador` JSON endpoint
- **Authentication:** none
- **Scope:** public search and offer details only
- **Runtime:** Bun; `bun install` only installs development types

The endpoint is public and used by Empléate's web client, but it is undocumented.
Keep requests low-volume and do not use private account or application routes.
On Windows workstations where Bun cannot read an installed corporate certificate chain,
the CLI retries certificate-verification failures through Windows PowerShell's native
certificate store. It never disables TLS verification.

## Installation

```bash
cd .agents/skills/empleate-search/cli
bun install
```

## Commands

```bash
bun run src/cli.ts search -q "prácticas inteligencia artificial" --format table
bun run src/cli.ts search -q "TFM machine learning" -l Barcelona --jobage 90
bun run src/cli.ts detail 1850419565 --format plain
```

Search flags: `--query`/`-q`, `--location`/`-l`, `--jobage`, `--page`,
`--limit`/`-n`, and `--format json|table|plain`. Detail accepts an Empléate ID or
offer URL and `--format json|plain`.

All errors are JSON on stderr with exit code `1`. See `../url-reference.md` for
endpoint details and `../SKILL.md` for thesis-screening rules.
