---
description: Implement only the active TokenDash phase
agent: builder
---

# /run-phase

Execute the active phase in `.opencode/plans/current-phase.md`.

## Required behavior

- read the current phase plan
- read the active handoff companion file when present for execution context
- implement only the in-scope allowlisted files
- treat `current-phase.md` as scope authority and the handoff file as companion execution state
- report files changed, validation attempted, and blockers
- stop when the bounded phase is complete
