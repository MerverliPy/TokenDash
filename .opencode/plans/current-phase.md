# Current Phase

## Phase
- id: backend-foundation
- status: in_progress

## Goal
Create the backend runtime, health route, and workflow route scaffold for TokenDash.

## In Scope
- create backend package metadata
- create TypeScript config for backend build/typecheck
- create Express server entrypoint
- create health route
- create dev-only workflow route scaffold
- add supporting workflow runtime files required by the backend foundation phase

## Out Of Scope
- frontend app code
- Vite or PWA setup
- analyzer API route
- run history
- comparison and warnings
- frontend app code
- token-tools cleanup

## Allowed Files
- package.json
- tsconfig.json
- server/index.ts
- server/routes/*.ts
- server/workflow/*.ts

## Required MCPs
- context7

## Acceptance Criteria
- backend starts
- health route works
- workflow routes are mounted

## Validation
```bash
npm run typecheck
npm run build
```

## Repair Constraints
- do not add files outside the allowlist
- do not broaden scope to frontend, analyzer API, or PWA files
- stop if any file would require external repo edits
