# Current Phase

## Phase
- id: frontend-shell
- status: completed

## Goal
Create the mobile-first frontend shell for TokenDash.

## In Scope
- create the base React shell
- create a responsive dashboard layout
- establish the frontend entrypoint and app structure needed for the shell
- keep the initial mobile-first shell bounded to the phase allowlist

## Out Of Scope
- backend analyzer execution
- run controls and summaries
- charts and detail views
- run history
- comparison and warnings
- PWA setup
- token-tools cleanup

## Allowed Files
- package.json
- package-lock.json
- tsconfig.json
- src/**
- index.html
- vite.config.ts
- tailwind.config.ts
- postcss.config.js

## Required MCPs
- context7
- playwright

## Acceptance Criteria
- dashboard shell renders
- mobile layout is usable

## Validation
```bash
npm run typecheck
npm run build
```

## Repair Constraints
- do not add files outside the allowlist
- do not broaden scope to analyzer API, history, charts, or PWA files
- stop if any file would require external repo edits
