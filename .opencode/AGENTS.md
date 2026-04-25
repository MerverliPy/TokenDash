# Workflow Rules

## Scope

These instructions apply only to TokenDash internal workflow files, workflow runtime code under `server/workflow/**`, phase state, backlog, and repo-owned dev scripts.

## Workflow Invariants

- `.opencode/plans/current-phase.md` is the authoritative active-phase file
- `.opencode/plans/<phase-id>-handoff.md` is optional companion state for the active phase's execution progress, blockers, and resume context
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
- `.opencode/plans/*-handoff.md` files are workflow companion state and are workflow-only reconciliation artifacts during validation
- when validating a product phase, workflow-only reconciliation changes in `.opencode/backlog/candidates.yaml`, `scripts/dev/phase-status-json.mjs`, and `server/workflow/phaseCatalog.ts` should be reported as notes unless they change product behavior or broaden the active phase implementation scope
- when present, the active handoff companion file for the current phase should be reported as a note instead of scope drift unless it changes product behavior, broadens scope, or conflicts with `current-phase.md`

## Agent Boundaries

- orchestrator selects and advances bounded phases but does not implement product code
- builder implements only the active phase allowlist
- validator validates but does not implement fixes
- reviewer remains read-only
- shipper summarizes only after evidence is present
- `current-phase.md` stays authoritative for phase identity and scope, while the active handoff companion file carries execution-only status and resume context

## Repair Rules

- repair only inside the active phase allowlist
- do not broaden scope during repair
- cap repair attempts per phase
- mark blocked rather than looping indefinitely
