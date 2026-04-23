---
description: Continue the TokenDash workflow deterministically through repo-owned commands
agent: orchestrator
---

# /autoflow

Drive deterministic workflow progress through repo-owned commands.

## Required behavior

- use `bash scripts/dev/autoflow.sh inspect-json` as the workflow source of truth
- continue only through safe next actions
- stop on ambiguity, drift, or blocked state
- summarize the blocker instead of guessing
