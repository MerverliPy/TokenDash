# Current Phase

## Phase
- id: charts-and-detail-views
- status: in_progress

## Goal
Add responsive charts, model table, bundles, and workflow file views.

## In Scope
- add responsive chart rendering for existing analyzer output
- add detailed model, bundle, and workflow file views using existing frontend data flows
- keep new detail tables and panels readable on mobile layouts
- limit the phase to frontend display and styling work inside the allowlist

## Out Of Scope
- local run history persistence
- comparison and warnings
- PWA setup or mobile PWA polish
- backend API changes
- token-tools cleanup and self-test integration

## Allowed Files
- src/components/*.tsx
- src/lib/*.ts
- src/styles.css

## Required MCPs
- context7
- playwright

## Acceptance Criteria
- charts render
- tables are readable on mobile

## Validation
```bash
npm run typecheck
npm run build
```

## Repair Constraints
- do not edit files outside the allowlist above
- keep the phase limited to charting and detailed read-only views of existing analyzer data
- stop if implementation would require new backend routes, persistence, or future-phase comparison/history behavior
