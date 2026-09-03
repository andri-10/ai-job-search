---
name: job-gmail-sync
description: Review Gmail for application-status signals and propose tracker updates. Use only when the user explicitly asks to check or synchronize Gmail application messages.
---

# Gmail application-status sync

Before acting, read:

- [`../../../CLAUDE.md`](../../../CLAUDE.md)
- [`../../../.claude/commands/gmail-sync.md`](../../../.claude/commands/gmail-sync.md)

Follow the canonical review-and-propose workflow. Use an authorized Gmail
connection only when available, do not send, delete, or modify mail, and obtain
confirmation before writing any proposed status change to repository data.

The source document uses Claude command and tool terminology. Apply its intent
with the tools available in the current Codex environment.
