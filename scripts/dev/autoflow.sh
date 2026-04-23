#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
STATUS_SCRIPT="${ROOT_DIR}/scripts/dev/phase-status-json.mjs"

subcommand="${1-}"

case "${subcommand}" in
  inspect-json)
    node "${STATUS_SCRIPT}"
    ;;
  run)
    printf 'AUTOFLOW_NEXT:/run-phase\n'
    ;;
  validate)
    printf 'AUTOFLOW_NEXT:/validate-phase\n'
    ;;
  repair)
    printf 'AUTOFLOW_NEXT:/repair-phase\n'
    ;;
  finish)
    printf 'AUTOFLOW_NEXT:/finish-phase\n'
    ;;
  *)
    printf 'Usage: %s {inspect-json|run|validate|repair|finish}\n' "$0"
    exit 2
    ;;
esac
