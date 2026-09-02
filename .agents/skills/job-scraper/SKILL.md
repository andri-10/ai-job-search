---
name: scrape
version: 1.0.0
description: >
  Run the AI internship and master's-thesis job scraper. Search enabled portal
  skills, deduplicate postings, and return new matches. Invoke with /scrape,
  /scrape broad, or /scrape health.
context: fork
enabled: true
---

# /scrape

This is the Codex-facing command entrypoint. The canonical workflow is
[`../../../.claude/skills/job-scraper/SKILL.md`](../../../.claude/skills/job-scraper/SKILL.md).

Read and follow that workflow exactly. Do not duplicate or modify its rules here.

Pass through any arguments supplied with `/scrape`, including `broad`, `health`,
and an optional focus area.
