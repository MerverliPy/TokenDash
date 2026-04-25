# Current Phase

## Phase
- id: workflow-handoff-integration
- status: completed

## Goal
Make active handoff files part of the workflow companion state so validation and automation treat workflow reconciliation correctly.

## In Scope
- classify active handoff files as workflow companion state
- update workflow scripts to expose active handoff metadata
- update workflow instructions so command and agent behavior references the handoff companion flow consistently
- keep all work limited to the explicit workflow allowlist for this phase

## Out Of Scope
- TokenDash product feature implementation
- self-test backend or UI product changes
- token-tools external file cleanup
- any changes outside the explicit workflow allowlist below

## Allowed Files
- .opencode/backlog/candidates.yaml
- .opencode/AGENTS.md
- .opencode/agents/*.md
- .opencode/commands/*.md
- .opencode/plans/current-phase.md
- .opencode/plans/*-handoff.md
- scripts/dev/*
- server/workflow/contracts.ts
- server/workflow/mcpPolicy.ts
- server/workflow/phaseCatalog.ts

## Required MCPs
- none

## Acceptance Criteria
- active handoff files are treated as workflow companion state
- workflow status inspection reports active handoff metadata when present
- workflow validation tolerates handoff reconciliation files as notes instead of scope drift
- command and agent instructions consistently reference the active handoff companion flow

## Validation
```bash
bash scripts/dev/workflow-check.sh
node scripts/dev/phase-status-json.mjs
```

## Repair Constraints
- do not edit files outside the allowlist above
- keep the phase limited to workflow companion-state integration and validation tolerance
- stop if the work would require TokenDash product implementation or broader non-workflow refactors
