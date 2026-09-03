#!/usr/bin/env bun
import { detail } from "./commands/detail";
import { search } from "./commands/search";
import { fail, parseArgs } from "./helpers";

const parsed = parseArgs(process.argv.slice(2));
const command = parsed.positional[0];

if (command === "search") {
  await search(parsed.flags);
} else if (command === "detail") {
  await detail(parsed.positional[1] ?? "", parsed.flags);
} else {
  fail("use: search --query <text> [flags] or detail <id|url> [--format json|plain]", "BAD_CMD");
}

