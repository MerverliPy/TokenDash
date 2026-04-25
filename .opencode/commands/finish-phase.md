---
description: Finish the active TokenDash phase only after validator evidence exists
agent: orchestrator
---

# /finish-phase

Mark the active phase complete only after validator evidence shows it is ready.

## Required behavior

- refuse to finish if validator evidence is missing or failing
- update workflow state authoritatively
- reconcile the active handoff companion file when present so finish output matches the latest validated execution state
- report completion status and next recommended action
