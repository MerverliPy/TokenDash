---
description: Check TokenDash workflow invariants, required files, and MCP metadata presence
agent: validator
---

# /workflow-check

Check workflow invariants for the repository.

## Required behavior

- verify required workflow files exist
- verify current phase references a backlog candidate
- verify current phase declares allowed files, validation commands, and required MCPs
- stop and report invariant failures clearly
