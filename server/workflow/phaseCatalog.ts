import type { PhaseId, WorkflowPhaseDefinition } from './contracts.js'

export const PHASE_CATALOG: Record<PhaseId, WorkflowPhaseDefinition> = {
  'workflow-bootstrap': {
    id: 'workflow-bootstrap',
    title: 'Bootstrap workflow metadata and contracts',
    goal: 'Create the initial workflow rules, backlog, current phase, and runtime workflow contract files.',
    dependsOn: [],
    allowedFiles: [
      'AGENTS.md',
      '.opencode/AGENTS.md',
      '.opencode/backlog/candidates.yaml',
      '.opencode/plans/current-phase.md',
      'server/workflow/contracts.ts',
      'server/workflow/phaseCatalog.ts',
      'server/workflow/mcpPolicy.ts',
    ],
    requiredMcps: [],
    validations: [
      { label: 'AGENTS exists', command: 'test -f AGENTS.md' },
      { label: 'Internal AGENTS exists', command: 'test -f .opencode/AGENTS.md' },
      { label: 'Backlog exists', command: 'test -f .opencode/backlog/candidates.yaml' },
      { label: 'Current phase exists', command: 'test -f .opencode/plans/current-phase.md' },
      { label: 'Contracts exists', command: 'test -f server/workflow/contracts.ts' },
      { label: 'Phase catalog exists', command: 'test -f server/workflow/phaseCatalog.ts' },
      { label: 'MCP policy exists', command: 'test -f server/workflow/mcpPolicy.ts' },
    ],
    acceptanceCriteria: [
      'Workflow root and internal rules exist',
      'Backlog candidate list exists',
      'Current phase file exists and targets workflow-bootstrap',
      'Runtime workflow contracts, phase catalog, and MCP policy exist',
    ],
    outOfScope: [
      'Agent markdown files',
      'Command markdown files',
      'Workflow scripts',
      'Backend server routes',
      'Frontend app code',
    ],
    repairLimit: 2,
  },

  'opencode-command-skeleton': {
    id: 'opencode-command-skeleton',
    title: 'Add opencode agents, commands, and scripts',
    goal: 'Create the TokenDash opencode agent, command, and workflow script skeleton.',
    dependsOn: ['workflow-bootstrap'],
    allowedFiles: ['.opencode/agents/*.md', '.opencode/commands/*.md', 'scripts/dev/*'],
    requiredMcps: [],
    validations: [
      { label: 'Workflow check', command: 'bash scripts/dev/workflow-check.sh' },
    ],
    acceptanceCriteria: ['Agent files, command files, and workflow scripts exist'],
    outOfScope: ['Backend runtime routes', 'Frontend app code'],
    repairLimit: 2,
  },

  'backend-foundation': {
    id: 'backend-foundation',
    title: 'Create backend foundation',
    goal: 'Create the backend runtime, health route, and workflow route scaffold.',
    dependsOn: ['opencode-command-skeleton'],
    allowedFiles: ['package.json', 'tsconfig.json', 'server/index.ts', 'server/routes/*.ts', 'server/workflow/*.ts'],
    requiredMcps: ['context7'],
    validations: [
      { label: 'Typecheck', command: 'npm run typecheck' },
      { label: 'Build', command: 'npm run build' },
    ],
    acceptanceCriteria: ['Backend starts', 'Health route exists', 'Workflow route scaffold exists'],
    outOfScope: ['Frontend rendering', 'PWA assets'],
    repairLimit: 3,
  },

  'frontend-shell': {
    id: 'frontend-shell',
    title: 'Create frontend shell',
    goal: 'Create the responsive React shell for TokenDash.',
    dependsOn: ['backend-foundation'],
    allowedFiles: ['package.json', 'package-lock.json', 'tsconfig.json', 'src/**', 'index.html', 'vite.config.ts', 'tailwind.config.ts', 'postcss.config.js'],
    requiredMcps: ['context7', 'playwright'],
    validations: [
      { label: 'Typecheck', command: 'npm run typecheck' },
      { label: 'Build', command: 'npm run build' },
    ],
    acceptanceCriteria: ['Shell renders', 'Mobile layout is usable'],
    outOfScope: ['Run history', 'PWA setup'],
    repairLimit: 3,
  },

  'analyzer-api': {
    id: 'analyzer-api',
    title: 'Wire analyzer API',
    goal: 'Add analyze API contracts, spawn logic, and client API wiring.',
    dependsOn: ['frontend-shell'],
    allowedFiles: [
      '.opencode/backlog/candidates.yaml',
      '.opencode/plans/current-phase.md',
      'server/workflow/phaseCatalog.ts',
      'server/index.ts',
      'server/lib/*.ts',
      'server/routes/analyze.ts',
      'src/App.tsx',
      'src/lib/*.ts',
      'src/pages/DashboardPage.tsx',
    ],
    requiredMcps: ['context7'],
    validations: [
      { label: 'Typecheck', command: 'npm run typecheck' },
      { label: 'Build', command: 'npm run build' },
    ],
    acceptanceCriteria: ['Analyzer runs through API', 'Parsed JSON is returned'],
    outOfScope: ['Charts', 'PWA setup'],
    repairLimit: 3,
  },

  'run-controls-and-summary': {
    id: 'run-controls-and-summary',
    title: 'Add run controls and summary cards',
    goal: 'Add manual run controls and top-level summary metrics.',
    dependsOn: ['analyzer-api'],
    allowedFiles: ['src/components/*.tsx', 'src/pages/DashboardPage.tsx', 'src/lib/*.ts'],
    requiredMcps: ['context7', 'playwright'],
    validations: [
      { label: 'Typecheck', command: 'npm run typecheck' },
      { label: 'Build', command: 'npm run build' },
    ],
    acceptanceCriteria: ['Manual run works', 'Summary cards populate'],
    outOfScope: ['Run history', 'PWA setup'],
    repairLimit: 3,
  },

  'charts-and-detail-views': {
    id: 'charts-and-detail-views',
    title: 'Add charts and detail views',
    goal: 'Add charts, model table, bundle panels, and workflow file views.',
    dependsOn: ['run-controls-and-summary'],
    allowedFiles: ['src/components/*.tsx', 'src/lib/*.ts', 'src/styles.css'],
    requiredMcps: ['context7', 'playwright'],
    validations: [
      { label: 'Typecheck', command: 'npm run typecheck' },
      { label: 'Build', command: 'npm run build' },
    ],
    acceptanceCriteria: ['Charts render', 'Tables remain usable on mobile'],
    outOfScope: ['PWA setup', 'Self-test integration'],
    repairLimit: 3,
  },

  'local-run-history': {
    id: 'local-run-history',
    title: 'Add local run history',
    goal: 'Persist and reopen saved runs locally.',
    dependsOn: ['charts-and-detail-views'],
    allowedFiles: ['server/lib/*.ts', 'server/routes/history.ts', 'src/components/*.tsx', 'src/lib/*.ts'],
    requiredMcps: ['playwright'],
    validations: [
      { label: 'Typecheck', command: 'npm run typecheck' },
      { label: 'Build', command: 'npm run build' },
    ],
    acceptanceCriteria: ['Runs save locally', 'Runs reopen from history'],
    outOfScope: ['PWA setup'],
    repairLimit: 3,
  },

  'comparison-and-warnings': {
    id: 'comparison-and-warnings',
    title: 'Add comparison and warnings',
    goal: 'Compare saved runs and render warning panels.',
    dependsOn: ['local-run-history'],
    allowedFiles: ['server/lib/*.ts', 'src/components/*.tsx', 'src/lib/*.ts'],
    requiredMcps: ['playwright'],
    validations: [
      { label: 'Typecheck', command: 'npm run typecheck' },
      { label: 'Build', command: 'npm run build' },
    ],
    acceptanceCriteria: ['Comparison works', 'Warnings render clearly'],
    outOfScope: ['PWA setup'],
    repairLimit: 3,
  },

  'pwa-setup': {
    id: 'pwa-setup',
    title: 'Add PWA setup',
    goal: 'Add manifest, service worker, and install flows for shell-only offline support.',
    dependsOn: ['comparison-and-warnings'],
    allowedFiles: ['package.json', 'vite.config.ts', 'public/*', 'src/components/*.tsx', 'src/main.tsx', 'src/App.tsx'],
    requiredMcps: ['context7', 'playwright'],
    validations: [
      { label: 'Typecheck', command: 'npm run typecheck' },
      { label: 'Build', command: 'npm run build' },
    ],
    acceptanceCriteria: ['Manifest exists', 'Service worker exists', 'Install flows are wired'],
    outOfScope: ['Self-test integration'],
    repairLimit: 3,
  },

  'mobile-pwa-polish': {
    id: 'mobile-pwa-polish',
    title: 'Polish mobile PWA UX',
    goal: 'Improve the installed mobile PWA layout and touch usability.',
    dependsOn: ['pwa-setup'],
    allowedFiles: ['src/**', 'README.md'],
    requiredMcps: ['playwright'],
    validations: [
      { label: 'Typecheck', command: 'npm run typecheck' },
      { label: 'Build', command: 'npm run build' },
    ],
    acceptanceCriteria: ['Standalone mobile layout is usable', 'No critical overflow issues'],
    outOfScope: ['Token-tools cleanup'],
    repairLimit: 3,
  },

  'token-tools-path-cleanup': {
    id: 'token-tools-path-cleanup',
    title: 'Fix moved token-tools path drift',
    goal: 'Update moved token-tools docs and self-test path references outside TokenDash.',
    dependsOn: ['mobile-pwa-polish'],
    allowedFiles: [
      '/home/calvin/session-artifacts-2026-04-22/token-tools/agent-workflow-token-consumption-explained.md',
      '/home/calvin/session-artifacts-2026-04-22/token-tools/agent-workflow-token-consumption-selftest.mjs',
      '/home/calvin/session-artifacts-2026-04-22/token-tools/agent-workflow-token-consumption-selftest-explained.md',
    ],
    requiredMcps: [],
    validations: [
      { label: 'Moved self-test', command: 'node /home/calvin/session-artifacts-2026-04-22/token-tools/agent-workflow-token-consumption-selftest.mjs' },
    ],
    acceptanceCriteria: ['Moved paths are corrected', 'Self-test points at moved analyzer'],
    outOfScope: ['TokenDash frontend feature work'],
    repairLimit: 2,
  },

  'selftest-integration': {
    id: 'selftest-integration',
    title: 'Add self-test integration',
    goal: 'Add a dev-only self-test route and UI entrypoint.',
    dependsOn: ['token-tools-path-cleanup'],
    allowedFiles: ['server/lib/*.ts', 'server/routes/selftest.ts', 'src/components/*.tsx', 'src/pages/DashboardPage.tsx'],
    requiredMcps: ['playwright'],
    validations: [
      { label: 'Typecheck', command: 'npm run typecheck' },
      { label: 'Build', command: 'npm run build' },
    ],
    acceptanceCriteria: ['Self-test can be triggered from TokenDash'],
    outOfScope: ['Core analyzer views'],
    repairLimit: 3,
  },
}

export function getPhaseDefinition(phaseId: PhaseId): WorkflowPhaseDefinition {
  return PHASE_CATALOG[phaseId]
}

export function getOrderedPhaseIds(): PhaseId[] {
  return Object.keys(PHASE_CATALOG) as PhaseId[]
}
