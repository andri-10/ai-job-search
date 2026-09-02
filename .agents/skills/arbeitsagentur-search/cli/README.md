# Arbeitsagentur Search CLI

Zero-dependency Bun CLI for Germany's Federal Employment Agency Jobsuche API.

```bash
bun run src/cli.ts search --thesis -q "machine learning" --location Berlin --format table
bun run src/cli.ts detail 10000-1234567890-S
```

`--thesis` uses a 14-day window, 12 results, and the API's Praktikum/Trainee offer type unless you override a flag.
