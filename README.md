# TokenDash

TokenDash is a standalone local dashboard for running and inspecting token-tool analysis output. It combines a React frontend, an Express backend, and a locally installed analyzer script so you can trigger manual runs, review top-level summary metrics, and inspect the parsed JSON payload for the current repo.

## What TokenDash Is

- A local-first dashboard rooted at `/home/calvin/TokenDash`
- A dev-only backend workflow surface for running the analyzer and exposing health/workflow endpoints
- A manual UI for triggering analyzer runs against the current repo or an overridden repo root
- A lightweight summary view for top-level counts returned by the analyzer

## What TokenDash Is Not

- Not a hosted service
- Not part of `/home/calvin/LabFlowDeck`
- Not a general end-user workflow product
- Not yet a full charts, history, comparison, or PWA experience

## Current Capabilities

- Trigger analyzer runs from the dashboard UI
- Optionally override the repo root before running analysis
- View summary cards for models, workflow files, bundles, and roles
- Inspect the raw parsed JSON response from the backend
- Check backend health with `GET /api/health`
- Access dev-only workflow job routes under `/api/workflow/jobs`

## Current Limitations

- Charts and detailed data views are not implemented yet
- Local run history is not implemented yet
- Comparison and warning views are not implemented yet
- PWA install and shell-only offline support are planned, not implemented
- Fresh analysis still depends on the local backend and the external analyzer script being available

## Local Development

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm run dev:server
```

Start the frontend in a second terminal:

```bash
npm run dev
```

Other useful commands:

```bash
npm run typecheck
npm run build
npm run start
```

The backend and frontend are started separately right now.

## Remote Access over Tailscale

TokenDash now supports a stable single-port remote mode for Tailscale access.

Recommended flow:

1. Build the frontend and backend:

```bash
npm run build
```

2. Start the backend bound to your exact Tailscale IP with HTTP Basic Auth enabled:

```bash
HOST=<your-tailscale-ip> \
PORT=3001 \
TOKENDASH_AUTH_USER=<username> \
TOKENDASH_AUTH_PASSWORD=<password> \
npm run start
```

3. Open TokenDash remotely at:

```text
http://<your-tailscale-ip>:3001/
```

Notes:

- Prefer binding `HOST` to the specific Tailscale IP instead of `0.0.0.0`
- When `TOKENDASH_AUTH_USER` and `TOKENDASH_AUTH_PASSWORD` are both set, TokenDash requires HTTP Basic Auth for the dashboard and API routes
- The backend rejects unsafe cross-origin browser requests in authenticated mode
- Remote stable access uses the built Express server, not the Vite dev server

## Runtime Requirements

- Backend default host: `127.0.0.1`
- Backend default port: `3001`
- In built remote mode, the frontend and API are served from the same backend origin and port
- The Vite dev server usually starts on `5173`, but may use the next available port if `5173` is already occupied
- The analyzer script is expected at:
  - `/home/calvin/session-artifacts-2026-04-22/token-tools/agent-workflow-token-consumption.mjs`

If the analyzer script is missing, analyze requests will fail.

## Troubleshooting

- Check backend health at `http://localhost:3001/api/health`
- In remote mode, use `http://<your-tailscale-ip>:3001/api/health`
- Confirm the analyzer path in the health response if analyze requests fail
- Make sure both the frontend and backend dev servers are running
- If Vite selects a different port, open the URL printed by `npm run dev`
- If remote requests return `401`, confirm both Basic Auth env vars are set and your browser/client sent credentials
- If remote requests return `403` on unsafe methods, confirm the request originated from the same TokenDash URL

## Project Boundaries

- TokenDash is a standalone local repo at `/home/calvin/TokenDash`
- It must remain fully separate from `/home/calvin/LabFlowDeck`
- The current analyzer dependency lives outside this repo

## Contributor Note

If you are working on TokenDash internals, read these first:

1. `AGENTS.md`
2. `.opencode/AGENTS.md`
3. `.opencode/plans/current-phase.md`

Those files define the current workflow boundaries and active phase state.
