---
name: jobsireland-search
description: Search Ireland's public JobsIreland vacancy listings for Andri Halili's thesis-compatible AI, software, systems, and engineering placements. Use for Irish internships, thesis placements, graduate roles, or jobs on jobsireland.ie.
allowed-tools: Bash(bun run .agents/skills/jobsireland-search/cli/src/cli.ts *)
---

# JobsIreland Search

Use this low-volume public-listing CLI for Ireland. Before searching, read
[`../../../CLAUDE.md`](../../../CLAUDE.md) and
[`../../../.claude/skills/job-scraper/search-queries.md`](../../../.claude/skills/job-scraper/search-queries.md)
for the canonical thesis requirements.

```bash
bun run .agents/skills/jobsireland-search/cli/src/cli.ts search --thesis -q "machine learning" --location Dublin --format table
bun run .agents/skills/jobsireland-search/cli/src/cli.ts search --thesis -q "software engineer" --location Ireland
bun run .agents/skills/jobsireland-search/cli/src/cli.ts detail 2462553
```

`--thesis` keeps output deliberately small. The public results page is a discovery
source—not proof that a role is thesis-compatible. Inspect promising job details,
then prefer a visible employer application URL over a JobsIreland URL before tracking
or applying. Verify compensation, English working language, thesis scope, and Irish
work-authorisation requirements from the full posting.

## Boundaries

- The CLI makes one public result-page request per search or one public detail-page
  request per detail lookup; do not automate pagination or bulk collection.
- It never logs in, creates a profile, or submits an application.
- Listings change quickly. Treat a missing or expired detail page as closed, and
  verify the employer page before presenting a role as open.
