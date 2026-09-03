---
name: job-notion-sync
description: Publish an explicitly requested, one-way Notion view of job-search progress. Use only when the user asks to synchronize the application pipeline with Notion.
---

# Notion pipeline sync

Before acting, read:

- [`../../../CLAUDE.md`](../../../CLAUDE.md)
- [`../../../.claude/commands/notion-sync.md`](../../../.claude/commands/notion-sync.md)

Follow the canonical one-way sync workflow. The repository remains the system
of record: never import Notion content back into it, publish personal document
contents, or create/update a Notion workspace without explicit user approval.

The source document uses Claude command and tool terminology. Apply its intent
with the tools available in the current Codex environment.
