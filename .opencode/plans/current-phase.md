# Current Phase

## Phase
- id: readme-refresh
- status: completed

## Goal
Update the README so it accurately describes TokenDash as a standalone local dashboard and local development entrypoint.

## In Scope
- rewrite README.md for people running TokenDash locally
- describe current capabilities and current limitations only
- document current startup commands and runtime dependencies
- keep all work bounded to README.md

## Out Of Scope
- frontend feature changes
- backend API changes
- charts and detail views
- local run history
- comparison and warnings
- PWA setup and mobile PWA polish
- token-tools cleanup and self-test integration

## Allowed Files
- README.md

## Required MCPs
- none

## Acceptance Criteria
- README describes current TokenDash behavior accurately
- local startup instructions match package.json
- current limitations are explicit
- project boundaries remain clear

## Validation
```bash
bash scripts/dev/workflow-check.sh
npm run typecheck
npm run build
```

## Repair Constraints
- do not edit files outside README.md
- do not broaden scope to feature work or workflow runtime changes
- stop if accuracy would require product code changes instead of documentation changes
