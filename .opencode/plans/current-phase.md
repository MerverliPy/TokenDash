# Current Phase

## Phase
- id: pwa-setup
- status: completed

## Goal
Make TokenDash installable with shell-only offline support.

## In Scope
- add a bounded PWA manifest for the local dashboard
- add a service worker and precache wiring for shell-only offline support
- wire an install flow and offline-ready/update prompts in the existing app shell
- keep the phase limited to installability and offline shell support

## Out Of Scope
- mobile PWA polish beyond basic installability
- token-tools cleanup and self-test integration
- unrelated backend refactors, analyzer behavior changes, or broader UI redesign

## Allowed Files
- package.json
- vite.config.ts
- public/*
- src/components/*.tsx
- src/main.tsx
- src/App.tsx

## Required MCPs
- context7
- playwright

## Acceptance Criteria
- manifest exists
- service worker exists
- install prompt is wired

## Validation
```bash
npm run typecheck
npm run build
```

## Repair Constraints
- do not edit files outside the allowlist above
- keep the phase limited to manifest, service worker, and install-flow wiring
- stop if implementation would require mobile polish, external repo changes, or broader product behavior changes
