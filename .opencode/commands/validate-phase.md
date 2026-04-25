---
description: Validate the active TokenDash phase against scope and evidence rules
agent: validator
---

# /validate-phase

Validate the active phase in `.opencode/plans/current-phase.md`.

## Required behavior

- read the active phase plan
- read the active handoff companion file when present
- run required validation commands when possible
- fail on product-file scope drift, missing acceptance, or missing required MCP evidence
- do not fail solely because `.opencode/plans/current-phase.md` changed
- do not fail solely because the active `.opencode/plans/*-handoff.md` companion file changed as workflow-only reconciliation
- if only workflow-state reconciliation files changed outside the allowlist, return PASS WITH NOTES and list them explicitly
- return PASS, PASS WITH NOTES, or FAIL
