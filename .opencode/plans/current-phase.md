# Current Phase

## Phase
- id: token-tools-path-cleanup
- status: completed

## Goal
Update moved token-tools docs and self-test path references outside TokenDash.

## In Scope
- correct moved token-tools path references in the allowed external files
- update the token-tools self-test to point at the moved analyzer path
- keep the phase limited to the explicit external token-tools allowlist

## Out Of Scope
- TokenDash frontend or backend changes
- self-test integration inside TokenDash
- workflow metadata changes beyond required state tracking
- any changes outside the explicit token-tools allowlist

## Allowed Files
- /home/calvin/session-artifacts-2026-04-22/token-tools/agent-workflow-token-consumption-explained.md
- /home/calvin/session-artifacts-2026-04-22/token-tools/agent-workflow-token-consumption-selftest.mjs
- /home/calvin/session-artifacts-2026-04-22/token-tools/agent-workflow-token-consumption-selftest-explained.md

## Required MCPs
- none

## Acceptance Criteria
- moved paths are corrected
- self-test points to the moved analyzer

## Validation
```bash
node /home/calvin/session-artifacts-2026-04-22/token-tools/agent-workflow-token-consumption-selftest.mjs
```

## Repair Constraints
- do not edit files outside the allowlist above
- keep the phase limited to moved token-tools docs and self-test path repair
- stop if the work would require TokenDash product changes, broader external repo cleanup, or self-test integration work inside TokenDash
