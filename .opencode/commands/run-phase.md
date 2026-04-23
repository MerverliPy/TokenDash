---
description: Implement only the active TokenDash phase
agent: builder
---

# /run-phase

Execute the active phase in `.opencode/plans/current-phase.md`.

## Required behavior

- read the current phase plan
- implement only the in-scope allowlisted files
- report files changed, validation attempted, and blockers
- stop when the bounded phase is complete
