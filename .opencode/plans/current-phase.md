# Current Phase

## Phase
- id: analyzer-api
- status: completed

## Goal
Wire analyzer execution through the backend and expose the parsed result to the frontend.

## In Scope
- reconcile analyzer-api workflow metadata across active workflow sources
- add analyze API contracts and backend spawn logic
- add the backend analyze route and mount it from `server/index.ts`
- wire the frontend API client to call the analyze endpoint
- render the dashboard analyzer flow from `src/App.tsx` and `src/pages/DashboardPage.tsx`
- keep all work bounded to the phase allowlist

## Out Of Scope
- manual run controls and summary cards beyond analyzer wiring
- charts and detail views
- local run history
- comparison and warnings
- PWA setup and mobile PWA polish
- token-tools cleanup and self-test integration

## Allowed Files
- .opencode/backlog/candidates.yaml
- .opencode/plans/current-phase.md
- server/workflow/phaseCatalog.ts
- server/index.ts
- server/lib/*.ts
- server/routes/analyze.ts
- src/App.tsx
- src/lib/*.ts
- src/pages/DashboardPage.tsx

## Required MCPs
- context7

## Acceptance Criteria
- analyzer can be run via API
- parsed JSON is returned

## Validation
```bash
npm run typecheck
npm run build
```

## Repair Constraints
- do not add files outside the allowlist
- do not broaden scope to run controls, charts, history, comparison, or PWA work
- stop if any change would require external repo edits
