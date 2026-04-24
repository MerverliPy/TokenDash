# Workflow Rules

## Scope

These instructions apply only to TokenDash internal workflow files, workflow runtime code under `server/workflow/**`, phase state, backlog, and repo-owned dev scripts.

## Workflow Invariants

- `.opencode/plans/current-phase.md` is the authoritative active-phase file
- `.opencode/backlog/candidates.yaml` is the durable candidate source of truth
- each phase must declare:
  - allowed files
  - acceptance criteria
  - validation commands
  - required MCPs
- a phase must not be completed without validation evidence
- workflow execution must stop rather than guess when invariants fail

## Hard Boundaries

- never modify `/home/calvin/LabFlowDeck/**`
- do not touch external repos except in the explicit token-tools cleanup phase
- do not expose internal workflow state through the shipped dashboard unless a later phase explicitly allows a dev-only surface

## MCP Rules

- use `context7` before framework-sensitive implementation
- use `playwright` after UI or PWA changes
- do not claim a phase is validated if required MCP evidence is missing
- record MCP evidence in diagnostics

## Validation Exceptions

- `.opencode/plans/current-phase.md` is workflow state and is exempt from product phase scope-drift checks
- when validating a product phase, workflow-only reconciliation changes in `.opencode/backlog/candidates.yaml`, `scripts/dev/phase-status-json.mjs`, and `server/workflow/phaseCatalog.ts` should be reported as notes unless they change product behavior or broaden the active phase implementation scope

## Agent Boundaries

- orchestrator selects and advances bounded phases but does not implement product code
- builder implements only the active phase allowlist
- validator validates but does not implement fixes
- reviewer remains read-only
- shipper summarizes only after evidence is present

## Repair Rules

- repair only inside the active phase allowlist
- do not broaden scope during repair
- cap repair attempts per phase
- mark blocked rather than looping indefinitely
