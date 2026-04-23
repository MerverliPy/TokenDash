# TokenDash

TokenDash is a standalone local dashboard and dev-only workflow system for analyzing token-tool output.

## Boundaries

- Root path: `/home/calvin/TokenDash`
- This project must remain fully separate from `/home/calvin/LabFlowDeck`
- The token analysis dependency currently lives at:
  - `/home/calvin/session-artifacts-2026-04-22/token-tools/agent-workflow-token-consumption.mjs`

## Current Status

This repo is in workflow bootstrap state.

- opencode workflow files are being established first
- backend and frontend runtime code will be added in bounded phases
- Git initialization should happen after the required root files are in place

## Planned Scope

- standalone local dashboard
- dev-only backend workflow and repair loop
- mobile PWA support
- shell-only offline support

## Out Of Scope For Bootstrap

- frontend runtime code
- backend dashboard API routes
- token-tools cleanup
- self-test integration
