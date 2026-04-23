---
description: Validate the active TokenDash phase against scope and evidence rules
agent: validator
---

# /validate-phase

Validate the active phase in `.opencode/plans/current-phase.md`.

## Required behavior

- read the active phase plan
- run required validation commands when possible
- fail on scope drift, missing acceptance, or missing required MCP evidence
- return PASS, PASS WITH NOTES, or FAIL
