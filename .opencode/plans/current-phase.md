# Current Phase

## Phase
- id: local-run-history
- status: completed

## Goal
Persist runs locally and reopen them later.

## In Scope
- add local persistence support for saved runs
- mount the history route and add supporting server-side storage helpers inside the allowlist
- add UI support to list and reopen saved runs through the existing dashboard page state
- keep the phase limited to local history persistence and retrieval work

## Out Of Scope
- comparison across saved runs
- workflow warnings or path-drift messaging
- PWA setup or mobile PWA polish
- token-tools cleanup and self-test integration
- unrelated backend refactors or new analyzer behavior

## Allowed Files
- server/index.ts
- server/lib/*.ts
- server/routes/history.ts
- src/components/*.tsx
- src/lib/*.ts
- src/pages/DashboardPage.tsx

## Required MCPs
- playwright

## Acceptance Criteria
- runs save locally
- runs reopen from history

## Validation
```bash
npm run typecheck
npm run build
```

## Repair Constraints
- do not edit files outside the allowlist above
- keep the phase limited to local persistence and reopening saved runs
- stop if implementation would require comparison features, warning surfaces, PWA work, or external repo changes
