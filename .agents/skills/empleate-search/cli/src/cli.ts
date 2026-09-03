#!/usr/bin/env bun

import { runDetail, type DetailOpts } from "./commands/detail.js"
import { runSearch, type SearchOpts } from "./commands/search.js"

interface Flags {
  _: string[]
  [key: string]: string | boolean | string[]
}

const HELP = `empleate-search-cli — search Spain's public SEPE Empléate listings

USAGE
  bun run src/cli.ts search [flags]
  bun run src/cli.ts detail <id|url> [--format json|plain]

SEARCH FLAGS
  --query, -q <text>      Keywords; Spanish thesis terms are recommended.
  --location, -l <text>   City, province, or autonomous community.
  --jobage <days>         Only offers created within N days.
  --page <n>              1-indexed page; 10 results per page. Default: 1.
  --limit, -n <n>         Client-side cap (0-10).
  --format <format>       json (default) | table | plain.

EXAMPLES
  bun run src/cli.ts search -q "prácticas inteligencia artificial" --format table
  bun run src/cli.ts search -q "TFM machine learning" -l Barcelona --jobage 90
  bun run src/cli.ts detail 1850419565 --format plain

Public search only. Keep request volume low; do not access account or application areas.
`

const VALUE_FLAGS = new Set(["query", "location", "jobage", "page", "limit", "format"])
const ALIASES: Record<string, string> = { q: "query", l: "location", n: "limit", h: "help" }

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (!argument.startsWith("-")) {
      flags._.push(argument)
      continue
    }
    const rawName = argument.replace(/^-+/, "")
    const name = ALIASES[rawName] ?? rawName
    if (name !== "help" && !VALUE_FLAGS.has(name)) {
      throw new Error(`Unknown flag "${argument}"`)
    }
    if (name === "help") {
      flags.help = true
      continue
    }
    const value = argv[index + 1]
    if (value === undefined || value.startsWith("-")) {
      throw new Error(`${argument} requires a value`)
    }
    flags[name] = value
    index++
  }
  return flags
}

function integerFlag(flags: Flags, name: string, fallback?: number): number | undefined {
  const raw = flags[name]
  if (raw === undefined) return fallback
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) throw new Error(`--${name} must be a non-negative integer`)
  return Number(raw)
}

async function main(): Promise<number> {
  let flags: Flags
  try {
    flags = parseFlags(process.argv.slice(2))
  } catch (error) {
    process.stderr.write(JSON.stringify({ error: error instanceof Error ? error.message : String(error), code: "BAD_ARG" }) + "\n")
    return 1
  }

  const command = flags._[0]
  if (!command || flags.help) {
    process.stdout.write(HELP)
    return command ? 0 : 1
  }

  try {
    if (command === "search") {
      const format = typeof flags.format === "string" ? flags.format : "json"
      if (!["json", "table", "plain"].includes(format)) throw new Error("--format must be json, table, or plain")
      const page = integerFlag(flags, "page", 1)!
      const jobage = integerFlag(flags, "jobage")
      const limit = integerFlag(flags, "limit")
      if (page < 1) throw new Error("--page must be at least 1")
      if (jobage !== undefined && jobage < 1) throw new Error("--jobage must be at least 1")
      const opts: SearchOpts = {
        query: typeof flags.query === "string" ? flags.query : undefined,
        location: typeof flags.location === "string" ? flags.location : undefined,
        jobage,
        page,
        limit,
        format: format as SearchOpts["format"],
      }
      return runSearch(opts)
    }

    if (command === "detail") {
      const id = flags._[1]
      if (!id) {
        process.stderr.write(JSON.stringify({ error: "detail requires an <id|url>", code: "NO_ID" }) + "\n")
        return 1
      }
      const format = typeof flags.format === "string" ? flags.format : "json"
      if (!["json", "plain"].includes(format)) throw new Error("detail --format must be json or plain")
      return runDetail({ id, format: format as DetailOpts["format"] })
    }
  } catch (error) {
    process.stderr.write(JSON.stringify({ error: error instanceof Error ? error.message : String(error), code: "BAD_ARG" }) + "\n")
    return 1
  }

  process.stderr.write(JSON.stringify({ error: `Unknown command "${command}"`, code: "BAD_CMD" }) + "\n")
  return 1
}

main().then((code) => process.exit(code)).catch((error) => {
  process.stderr.write(JSON.stringify({ error: error instanceof Error ? error.message : String(error), code: "INTERNAL_ERROR" }) + "\n")
  process.exit(1)
})

