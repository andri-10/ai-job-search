import { describe, expect, test } from "bun:test"
import { join } from "path"

const cli = join(import.meta.dir, "../src/cli.ts")

async function run(args: string[]) {
  const proc = Bun.spawn(["bun", "run", cli, ...args], { stdout: "pipe", stderr: "pipe" })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ])
  return { stdout, stderr, exitCode }
}

describe("CLI validation", () => {
  test("rejects an unknown flag as JSON on stderr", async () => {
    const result = await run(["search", "--bogus", "value"])
    expect(result.exitCode).toBe(1)
    expect(JSON.parse(result.stderr).code).toBe("BAD_ARG")
  })

  test("requires a detail ID", async () => {
    const result = await run(["detail"])
    expect(result.exitCode).toBe(1)
    expect(JSON.parse(result.stderr).code).toBe("NO_ID")
  })

  test("rejects page zero", async () => {
    const result = await run(["search", "--page", "0"])
    expect(result.exitCode).toBe(1)
    expect(JSON.parse(result.stderr).code).toBe("BAD_ARG")
  })
})

