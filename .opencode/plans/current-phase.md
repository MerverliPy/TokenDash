# Current Phase

## Phase
- id: run-controls-and-summary
- status: completed

## Goal
Add manual run controls, summary cards, and top-level metrics.

## In Scope
- add manual run controls inside the existing dashboard UI
- add summary card components within the phase allowlist
- surface top-level metrics from the existing analyzer response flow
- keep all work bounded to the phase allowlist

## Out Of Scope
- backend analyzer contract changes beyond existing analyzer-api behavior
- charts and detail views
- local run history
- comparison and warnings
- PWA setup and mobile PWA polish
- token-tools cleanup and self-test integration

## Allowed Files
- src/components/*.tsx
- src/pages/DashboardPage.tsx
- src/lib/*.ts

## Required MCPs
- context7
- playwright

## Acceptance Criteria
- manual run works from UI
- summary cards populate

## Validation
```bash
npm run typecheck
npm run build
```

## Repair Constraints
- do not add files outside the allowlist
- do not broaden scope to charts, history, comparison, or PWA work
- stop if any change would require backend route changes or external repo edits
