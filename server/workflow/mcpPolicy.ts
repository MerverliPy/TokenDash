import type { McpName, PhaseId } from './contracts.js'

const MCP_REQUIREMENTS: Record<PhaseId, McpName[]> = {
  'workflow-bootstrap': [],
  'opencode-command-skeleton': [],
  'backend-foundation': ['context7'],
  'frontend-shell': ['context7', 'playwright'],
  'analyzer-api': ['context7'],
  'run-controls-and-summary': ['context7', 'playwright'],
  'charts-and-detail-views': ['context7', 'playwright'],
  'local-run-history': ['playwright'],
  'comparison-and-warnings': ['playwright'],
  'pwa-setup': ['context7', 'playwright'],
  'mobile-pwa-polish': ['playwright'],
  'token-tools-path-cleanup': [],
  'selftest-integration': ['playwright'],
}

export function getRequiredMcpsForPhase(phaseId: PhaseId): McpName[] {
  return MCP_REQUIREMENTS[phaseId]
}

export function phaseRequiresContext7(phaseId: PhaseId): boolean {
  return MCP_REQUIREMENTS[phaseId].includes('context7')
}

export function phaseRequiresPlaywright(phaseId: PhaseId): boolean {
  return MCP_REQUIREMENTS[phaseId].includes('playwright')
}

export function phaseAllowsGithub(phaseId: PhaseId): boolean {
  return MCP_REQUIREMENTS[phaseId].includes('github')
}

export function getMcpEvidenceChecklist(phaseId: PhaseId): string[] {
  const checklist: string[] = []

  if (phaseRequiresContext7(phaseId)) {
    checklist.push('Record framework or library docs consulted before implementation.')
  }

  if (phaseRequiresPlaywright(phaseId)) {
    checklist.push('Record desktop or mobile UI verification results after implementation.')
  }

  if (phaseAllowsGithub(phaseId)) {
    checklist.push('Record GitHub interaction reason and result.')
  }

  return checklist
}
