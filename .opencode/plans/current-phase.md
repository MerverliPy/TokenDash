# Current Phase

## Phase
- id: remote-access-and-basic-auth
- status: completed

## Goal
Add a stable single-port remote access mode over Tailscale with env-backed HTTP Basic Auth and explicit backend host binding.

## In Scope
- update workflow metadata for the new bounded phase
- add explicit HOST-based backend binding
- add env-backed HTTP Basic Auth middleware for dashboard and API routes
- serve the built frontend from Express on the same port as the API when dist/client exists
- reject unsafe cross-origin browser requests in authenticated remote mode
- add a production-style start script and document the Tailscale startup flow

## Out Of Scope
- Vite dev-server remote HMR support
- session-based or form-based login UI
- new dashboard features, charts, history, comparison, warnings, or PWA work
- analyzer feature changes beyond access control and hosting
- token-tools cleanup and self-test integration

## Allowed Files
- .opencode/backlog/candidates.yaml
- .opencode/plans/current-phase.md
- server/workflow/contracts.ts
- server/workflow/phaseCatalog.ts
- server/workflow/mcpPolicy.ts
- server/index.ts
- server/lib/*.ts
- package.json
- README.md

## Required MCPs
- context7
- playwright

## Acceptance Criteria
- backend binds to an explicit HOST value
- built frontend is served by Express on the same port as the API
- unauthenticated requests to / and /api/* return 401 when auth is enabled
- authenticated requests can load the dashboard and health route successfully
- unsafe cross-origin browser requests are rejected
- README documents the Tailscale startup flow and auth env vars

## Validation
```bash
bash scripts/dev/workflow-check.sh
npm run typecheck
npm run build
```

## Repair Constraints
- do not edit files outside the allowlist above
- keep auth v1 limited to env-backed HTTP Basic Auth only
- prefer binding to a specific Tailscale HOST instead of broad interface exposure
- stop if the implementation would require a new frontend login flow or broader remote-dev tooling
