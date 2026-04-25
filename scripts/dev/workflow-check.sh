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

phase_id="$(grep '^- id:' "${ROOT_DIR}/.opencode/plans/current-phase.md" | cut -d: -f2- | xargs)"

if [ -n "${phase_id}" ]; then
  active_handoff_path="${ROOT_DIR}/.opencode/plans/${phase_id}-handoff.md"

  if [ -f "${active_handoff_path}" ]; then
    required_handoff_sections=(
      '^## Snapshot$'
      '^## Execution Checklist$'
      '^## Session Log$'
      '^## Resume Here$'
    )

    for section_pattern in "${required_handoff_sections[@]}"; do
      if ! grep -q "${section_pattern}" "${active_handoff_path}"; then
        printf 'INVALID: active handoff missing required section in %s\n' "${active_handoff_path}"
        exit 1
      fi
    done

    required_snapshot_fields=(
      '^- phase:'
      '^- phase status:'
      '^- handoff status:'
      '^- current blocker:'
      '^- next action:'
      '^- last updated:'
    )

    for field_pattern in "${required_snapshot_fields[@]}"; do
      if ! grep -q "${field_pattern}" "${active_handoff_path}"; then
        printf 'INVALID: active handoff missing snapshot field in %s\n' "${active_handoff_path}"
        exit 1
      fi
    done

    handoff_phase="$(grep -m1 '^- phase:' "${active_handoff_path}" | cut -d: -f2- | xargs)"
    handoff_phase="${handoff_phase//\`/}"

    if [ "${handoff_phase}" != "${phase_id}" ]; then
      printf 'INVALID: active handoff phase mismatch in %s\n' "${active_handoff_path}"
      exit 1
    fi
  fi
fi

printf 'WORKFLOW_CHECK_OK\n'
