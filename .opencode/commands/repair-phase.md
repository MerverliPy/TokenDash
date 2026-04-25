---
description: Trigger a bounded repair pass for the active TokenDash phase after validation failure
agent: orchestrator
---

# /repair-phase

Trigger a bounded repair pass for the active phase.

## Required behavior

- repair only within the active phase allowlist
- use the active handoff companion blocker and resume context when present
- do not broaden scope during repair
- stop if the repair target is ambiguous
- report the minimal repair target and retry status
