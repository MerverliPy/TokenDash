# Selftest Integration Handoff

## Snapshot
- phase: `selftest-integration`
- phase status: `completed`
- handoff status: `completed`
- current blocker: `none`
- next action: no pending backlog phase remains; prepare final summary or repo handoff
- last updated: `2026-04-24 23:53 CDT`

## Goal
Add a dev-only self-test route and UI hook.

## Scope Guardrails
- allowed files: `server/index.ts`
- allowed files: `server/lib/*.ts`
- allowed files: `server/routes/selftest.ts`
- allowed files: `src/components/*.tsx`
- allowed files: `src/pages/DashboardPage.tsx`
- required MCPs: `playwright`
- do not touch: external token-tools files
- do not touch: `/home/calvin/LabFlowDeck/**`

## Status Legend
- `[ ]` not started
- `[-]` in progress
- `[x]` completed
- `[!]` blocked

## Execution Checklist

### 1. Reconcile Phase Metadata
- status: `[x]`
- files: `.opencode/backlog/candidates.yaml`, `server/workflow/phaseCatalog.ts`, `.opencode/plans/current-phase.md`
- task: add `server/index.ts` to the `selftest-integration` allowlist only
- done when: the phase can legally mount `server/routes/selftest.ts`
- notes: allowlist updated consistently across workflow state and catalog

### 2. Add Backend Self-Test Helper
- status: `[x]`
- files: `server/lib/selftest.ts`
- task: spawn the existing external self-test script and capture `stdout`, `stderr`, and exit status
- done when: helper returns structured success output and throws typed failures

### 3. Add Dev-Only Self-Test Route
- status: `[x]`
- files: `server/routes/selftest.ts`
- task: add `POST /api/selftest`
- done when: route returns structured success output and clear error responses

### 4. Mount The Route
- status: `[x]`
- files: `server/index.ts`
- task: import and mount `selftestRouter`
- done when: `POST /api/selftest` is reachable

### 5. Add Dashboard Self-Test State
- status: `[x]`
- files: `src/pages/DashboardPage.tsx`
- task: add local state for request status, result, and error
- done when: page can track idle/loading/success/error for self-test execution

### 6. Add Dashboard Trigger UI
- status: `[x]`
- files: `src/pages/DashboardPage.tsx`
- task: add a self-test button and dev-only explanatory copy
- done when: the dashboard can trigger the backend self-test

### 7. Render Self-Test Result
- status: `[x]`
- files: `src/pages/DashboardPage.tsx`
- task: show script path, success/failure state, and stdout/stderr when available
- done when: the result is visible and understandable from the dashboard

### 8. Validate TypeScript And Build
- status: `[x]`
- files: none
- task: run `npm run typecheck` and `npm run build`
- done when: both commands pass

### 9. Capture Playwright Evidence
- status: `[x]`
- files: none
- task: trigger self-test from the UI and verify the request and rendered result
- done when: required UI evidence exists for the phase

## Decisions
- API route: `POST /api/selftest`
- backend execution model: use `spawn(process.execPath, [scriptPath])`
- client fetch location: keep fetch logic in `src/pages/DashboardPage.tsx` unless extraction becomes necessary
- response shape: return structured JSON, not raw text

## Risks
- the external self-test script path may drift again
- auth-enabled environments may require login before Playwright validation
- self-test output may be noisy and should be displayed carefully

## Validation Evidence
- `npm run typecheck`: passed
- `npm run build`: passed
- `playwright`: passed

## Session Log
- `2026-04-24 20:54 CDT` identified phase metadata blocker: `server/index.ts` missing from allowlist
- `2026-04-24 20:54 CDT` produced implementation checklist and created handoff file
- `2026-04-24 20:55 CDT` reconciled phase metadata to include `server/index.ts` and cleared the blocker
- `2026-04-24 21:29 CDT` paused product work behind a new `workflow-handoff-integration` workflow phase
- `2026-04-24 22:04 CDT` kept this handoff blocked until workflow companion-state reconciliation is validated
- `2026-04-24 22:18 CDT` cleared the blocker after `workflow-handoff-integration` passed validation and was marked complete
- `2026-04-24 23:52 CDT` implemented the backend helper, API route, backend mount, and dashboard self-test UI
- `2026-04-24 23:53 CDT` validated the phase with typecheck, build, direct API verification, and Playwright UI evidence, then marked the phase complete

## Resume Here
No pending backlog phase remains. Prepare a final workflow summary or repo handoff.
