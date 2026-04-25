---
description: Select the next bounded TokenDash phase from backlog and load it into current-phase
agent: orchestrator
---

# /next-phase

Choose the next eligible phase from `.opencode/backlog/candidates.yaml` and update `.opencode/plans/current-phase.md`.

## Required behavior

- read backlog and current-phase state
- consider the active handoff companion file when summarizing the current execution state
- select the smallest dependency-safe pending phase
- stop rather than guess if metadata is inconsistent
- report the expected companion handoff path for the selected phase
- report the selected phase and why it was chosen
