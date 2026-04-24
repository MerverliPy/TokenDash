# TokenDash

TokenDash is a local dashboard for running, saving, and inspecting token analysis reports. It combines a React frontend, an Express backend, and a locally installed analyzer script so you can trigger analysis runs, review charts and detailed tables, and reopen saved runs later without rerunning the analyzer.

## What You Can Do

- Run the analyzer for the current repo or an overridden repo root
- View summary cards for models, workflow files, bundles, and roles
- Inspect charts for model status counts and large bundle token estimates
- Browse detailed model, bundle, role, and workflow-file views
- Save completed runs locally and reopen them from history
- Check backend health with `GET /api/health`
- Use the built app remotely over Tailscale through one backend port with optional HTTP Basic Auth

## What TokenDash Is Not

- Not a hosted SaaS product
- Not part of `/home/calvin/LabFlowDeck`
- Not a general end-user workflow platform
- Not yet a comparison, warnings, or PWA/offline install experience

## Quick Start (Local)

1. Install dependencies:

```bash
npm install
```

2. Start the backend in one terminal:

```bash
npm run dev:server
```

3. Start the frontend in a second terminal:

```bash
npm run dev
```

4. Open the local frontend URL printed by Vite. Usually this is:

```text
http://127.0.0.1:5173/
```

5. Use the dashboard to run analysis and inspect results.

## Quick Start (Remote over Tailscale)

Use this mode when you want one stable URL that serves both the dashboard and the API from the backend.

1. Install dependencies:

```bash
npm install
```

2. Find your Tailscale IPv4 address:

```bash
tailscale ip -4
```

3. Build TokenDash:

```bash
npm run build
```

4. Start the built backend bound to your Tailscale IP with HTTP Basic Auth enabled:

```bash
HOST=<your-tailscale-ip> \
PORT=3001 \
TOKENDASH_AUTH_USER=<username> \
TOKENDASH_AUTH_PASSWORD=<password> \
npm run start
```

5. Open TokenDash remotely:

```text
http://<your-tailscale-ip>:3001/
```

6. Sign in with the HTTP Basic Auth credentials you set above.

## Tailscale Guide

### When to use this mode

Use Tailscale mode when you want to open TokenDash from another device on your tailnet and keep the app behind Tailscale plus HTTP Basic Auth.

This is different from local development:

- Local development uses `npm run dev:server` and `npm run dev`
- Remote stable access uses `npm run build` and `npm run start`

### Prerequisites

Before starting remote mode, make sure:

- Tailscale is installed and connected on the machine running TokenDash
- The client device is connected to the same tailnet
- Dependencies are installed with `npm install`
- The analyzer script exists at:

```text
/home/calvin/session-artifacts-2026-04-22/token-tools/agent-workflow-token-consumption.mjs
```

If the analyzer script is missing, the dashboard may load but analysis requests will fail.

### Step 1: Find the correct Tailscale IP

Run:

```bash
tailscale ip -4
```

Use the IPv4 address that other devices on your tailnet can reach.

Example:

```text
100.x.y.z
```

### Step 2: Build the app

Run:

```bash
npm run build
```

Why this matters:

- Remote mode serves the built frontend from Express
- The dashboard and API share the same backend origin and port
- This is the supported stable-access path for Tailscale use

### Step 3: Choose credentials

Set both of these environment variables:

- `TOKENDASH_AUTH_USER`
- `TOKENDASH_AUTH_PASSWORD`

Important:

- If both are unset, Basic Auth is disabled
- If only one is set, TokenDash will fail to start
- When enabled, Basic Auth protects both the dashboard and API routes

### Step 4: Start TokenDash on the Tailscale IP

Run:

```bash
HOST=<your-tailscale-ip> \
PORT=3001 \
TOKENDASH_AUTH_USER=<username> \
TOKENDASH_AUTH_PASSWORD=<password> \
npm run start
```

Recommended settings:

- Keep `PORT=3001` unless you have a reason to change it
- Bind `HOST` to the exact Tailscale IP instead of `0.0.0.0`

Why binding to the Tailscale IP is better:

- It keeps the service scoped to the Tailscale interface
- It avoids exposing the app more broadly than necessary
- It matches the intended private-network access model

### Step 5: Open the dashboard remotely

Open:

```text
http://<your-tailscale-ip>:3001/
```

Expected behavior:

- Your browser should prompt for HTTP Basic Auth credentials
- After authentication, the dashboard should load from the same backend that serves the API

### Step 6: Verify backend health

You can test the backend directly with:

```text
http://<your-tailscale-ip>:3001/api/health
```

Expected response fields include:

- `status`
- `projectRoot`
- `analyzerPath`
- `analyzerExists`
- `workflowDataRoot`

If `analyzerExists` is `false`, analyze requests will not succeed until the analyzer path is fixed.

### Security behavior in remote mode

When Basic Auth is enabled:

- Requests to `/` and `/api/*` require authentication
- Unsafe cross-origin browser requests are rejected
- The backend expects same-origin browser requests for `POST`, `PUT`, `PATCH`, and `DELETE`

This helps prevent accidental or unsafe browser-side cross-origin writes.

### Recommended usage pattern

For normal day-to-day development on the same machine:

```bash
npm run dev:server
npm run dev
```

For stable remote access over Tailscale:

```bash
npm run build
HOST=<your-tailscale-ip> PORT=3001 TOKENDASH_AUTH_USER=<username> TOKENDASH_AUTH_PASSWORD=<password> npm run start
```

Do not treat the Vite dev server as the stable remote-access path.

## Current Capabilities

- Manual analyzer runs from the dashboard
- Repo-root override before a run
- Summary cards for top-level analyzer counts
- Charts for model status counts and large bundle input estimates
- Detailed model, bundle, role, and workflow-file views
- Parsed JSON payload inspection
- Local saved-run history with reopen support
- Dev-only workflow job routes under `/api/workflow/jobs`

## Current Limitations

- Comparison across saved runs is not implemented yet
- Workflow warning surfaces are not implemented yet
- PWA install flow and shell-only offline support are not implemented yet
- Fresh analysis still depends on the local backend and the external analyzer script being available
- This project is still a local/dev tool, not a hosted multi-user service

## Where Saved Runs Live

Saved runs are stored locally under the project data directory used by the backend workflow runtime.

Current path root:

```text
/home/calvin/TokenDash/.local-data/workflow
```

History entries are stored under the history subdirectory beneath that root.

## Commands

```bash
npm run dev
```

Start the Vite frontend dev server.

```bash
npm run dev:server
```

Start the backend in watch mode.

```bash
npm run typecheck
```

Run TypeScript type checking.

```bash
npm run build
```

Build the backend and frontend for production-style use.

```bash
npm run start
```

Run the built backend server from `dist/server/index.js`.

```bash
npm run preview
```

Preview the built frontend bundle.

## Runtime Requirements

- Default backend host: `127.0.0.1`
- Default backend port: `3001`
- Local frontend dev server usually starts on `5173`
- Built remote mode serves frontend and API from the same backend origin and port
- Analyzer path:

```text
/home/calvin/session-artifacts-2026-04-22/token-tools/agent-workflow-token-consumption.mjs
```

## Troubleshooting

### The dashboard loads, but analysis fails

Check health:

```text
http://localhost:3001/api/health
```

In remote mode:

```text
http://<your-tailscale-ip>:3001/api/health
```

Look for:

- `analyzerExists: true`
- the expected `analyzerPath`

If `analyzerExists` is `false`, the backend cannot run new analysis jobs.

### Remote browser shows `401 Authentication required`

Possible causes:

- Wrong username or password
- Browser did not send credentials
- Only one of `TOKENDASH_AUTH_USER` or `TOKENDASH_AUTH_PASSWORD` was set at startup

### Remote request returns `403 Cross-origin unsafe requests are not allowed`

Possible cause:

- The request came from a different browser origin than the TokenDash URL

Fix:

- Open the dashboard from the same exact origin you are using for API access
- Avoid cross-origin browser tooling for unsafe methods in authenticated mode

### Remote page does not load

Check:

- Tailscale is connected on both devices
- You used the correct Tailscale IP
- The TokenDash process is running
- `HOST` is set correctly
- The selected `PORT` is reachable

### Local dev page does not load

Check:

- `npm run dev:server` is running
- `npm run dev` is running
- You opened the URL printed by Vite
- If `5173` was busy, Vite may have selected another port

## Project Boundaries

- TokenDash is a standalone repo rooted at `/home/calvin/TokenDash`
- It must remain separate from `/home/calvin/LabFlowDeck`
- The analyzer dependency currently lives outside this repo

## Contributor Note

If you are working on TokenDash internals, read these first:

1. `AGENTS.md`
2. `.opencode/AGENTS.md`
3. `.opencode/plans/current-phase.md`

Those files define workflow boundaries and active phase state.
