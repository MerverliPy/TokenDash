#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

required_files=(
  "${ROOT_DIR}/AGENTS.md"
  "${ROOT_DIR}/.opencode/AGENTS.md"
  "${ROOT_DIR}/.opencode/backlog/candidates.yaml"
  "${ROOT_DIR}/.opencode/plans/current-phase.md"
)

for file in "${required_files[@]}"; do
  if [ ! -f "${file}" ]; then
    printf 'MISSING:%s\n' "${file}"
    exit 1
  fi
done

if ! grep -q '^candidates:' "${ROOT_DIR}/.opencode/backlog/candidates.yaml"; then
  printf 'INVALID: backlog missing candidates root\n'
  exit 1
fi

if ! grep -q '^- id:' "${ROOT_DIR}/.opencode/plans/current-phase.md"; then
  printf 'INVALID: current phase missing phase id\n'
  exit 1
fi

if ! grep -q '^## Allowed Files' "${ROOT_DIR}/.opencode/plans/current-phase.md"; then
  printf 'INVALID: current phase missing allowed files section\n'
  exit 1
fi

if ! grep -q '^## Validation' "${ROOT_DIR}/.opencode/plans/current-phase.md"; then
  printf 'INVALID: current phase missing validation section\n'
  exit 1
fi

if ! grep -q '^## Required MCPs' "${ROOT_DIR}/.opencode/plans/current-phase.md"; then
  printf 'INVALID: current phase missing required MCPs section\n'
  exit 1
fi

printf 'WORKFLOW_CHECK_OK\n'
