# AGENTS.md

## Mission

Build TokenDash as a standalone local dashboard and dev-only workflow system for analyzing token-tool output, with mobile PWA support, while keeping all work fully outside `/home/calvin/LabFlowDeck`.

## Source Of Truth

Read these in order when planning or implementing work:

1. `AGENTS.md`
2. `.opencode/AGENTS.md`
3. `.opencode/backlog/candidates.yaml`
4. `.opencode/plans/current-phase.md`

## Hard Boundaries

- TokenDash is a standalone local repo rooted at `/home/calvin/TokenDash`
- Never modify files under `/home/calvin/LabFlowDeck/**`
- Do not treat LabFlowDeck as part of this repo or workflow
- The token analysis dependency currently lives at:
  - `/home/calvin/session-artifacts-2026-04-22/token-tools/agent-workflow-token-consumption.mjs`

## Product Truth

- TokenDash is a local dashboard
- TokenDash includes a dev-only backend workflow and repair loop
- The workflow system is not a normal end-user dashboard feature
- Mobile PWA support is in scope
- Shell-only offline support is in scope
- Fresh analysis still requires the local backend to be reachable

## MCP Priority

Prefer tools in this order:

1. `context7` before framework-sensitive implementation
2. `playwright` after UI and PWA changes
3. local validation commands
4. `github` only if publishing the standalone repo is explicitly requested

## Near-Term Build Order

1. workflow bootstrap
2. opencode command and agent skeleton
3. backend foundation
4. frontend shell
5. analyzer API
6. run controls and summaries
7. charts and detail views
8. history
9. comparison and warnings
10. PWA setup
11. mobile PWA polish
12. optional token-tools path cleanup
13. optional self-test integration

## Engineering Rules

- Prefer the smallest bounded phase
- Validate every phase before advancing
- Do not expand scope during repair
- Keep file allowlists explicit per phase
- Stop rather than guess when workflow state is inconsistent
