# Current Phase

## Phase
- id: mobile-pwa-polish
- status: completed

## Goal
Improve the installed mobile PWA layout and touch usability.

## In Scope
- improve touch targets for the installed mobile PWA
- refine the standalone mobile layout
- improve small-screen readability
- resolve critical overflow issues in the installed experience

## Out Of Scope
- token-tools cleanup
- self-test integration
- backend changes or analyzer behavior changes
- broader dashboard redesign beyond mobile PWA polish

## Allowed Files
- src/**
- README.md

## Required MCPs
- playwright

## Acceptance Criteria
- standalone mobile layout is usable
- no critical overflow issues

## Validation
```bash
npm run typecheck
npm run build
```

## Repair Constraints
- do not edit files outside the allowlist above
- keep the phase limited to mobile PWA touch usability, standalone layout, and small-screen readability
- stop if the work would require token-tools cleanup, self-test integration, backend changes, or broader product behavior changes
