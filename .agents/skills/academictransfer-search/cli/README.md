# AcademicTransfer search CLI

Zero-runtime-dependency CLI for low-volume searches of AcademicTransfer's public,
server-rendered Netherlands vacancy pages.

```bash
bun install
bun run typecheck
bun run src/cli.ts search -q "machine learning internship" --thesis --format table
bun run src/cli.ts detail 361933 --format plain
bun run test
```

Set `LIVE_TEST=1` when deliberately running the optional live smoke test. The normal
test suite uses fixtures; live verification is performed during portal onboarding.

The portal exposes at most ten results in permitted public HTML. Pagination beyond
page 1 would require its private API and is intentionally unsupported.

