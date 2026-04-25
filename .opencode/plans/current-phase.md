# Current Phase

## Phase
- id: selftest-integration
- status: completed

## Goal
Add a dev-only self-test route and UI hook.

## In Scope
- add a backend helper to run the external self-test script
- add a dev-only self-test API route and mount it in the backend
- add a dashboard trigger and result view for self-test execution
- keep the phase limited to the explicit product allowlist below

## Out Of Scope
- analyzer feature changes beyond the self-test entrypoint
- workflow metadata changes unrelated to this product phase
- token-tools external file cleanup
- any changes outside the explicit self-test integration allowlist below

## Allowed Files
- server/index.ts
- server/lib/*.ts
- server/routes/selftest.ts
- src/components/*.tsx
- src/pages/DashboardPage.tsx

## Required MCPs
- playwright

## Acceptance Criteria
- self-test can be triggered from TokenDash

## Validation
```bash
npm run typecheck
npm run build
```

## Repair Constraints
- do not edit files outside the allowlist above
- keep the phase limited to dev-only self-test integration
- stop if the work would require broader analyzer, workflow-engine, or non-allowlisted product changes
