import { z } from 'zod'

export const phaseIdSchema = z.enum([
  'workflow-bootstrap',
  'opencode-command-skeleton',
  'backend-foundation',
  'frontend-shell',
  'analyzer-api',
  'run-controls-and-summary',
  'readme-refresh',
  'charts-and-detail-views',
  'local-run-history',
  'comparison-and-warnings',
  'pwa-setup',
  'mobile-pwa-polish',
  'token-tools-path-cleanup',
  'selftest-integration',
])

export const jobStatusSchema = z.enum([
  'queued',
  'planning',
  'ready',
  'generating',
  'validating',
  'repairing',
  'passed',
  'failed',
  'blocked',
  'cancelled',
])

export const validationKindSchema = z.enum([
  'file-presence',
  'typecheck',
  'build',
  'api-health',
  'api-analyze',
  'playwright-desktop',
  'playwright-mobile',
  'pwa-manifest',
  'pwa-sw',
  'history-persistence',
  'comparison-render',
  'selftest',
])

export const failureKindSchema = z.enum([
  'file_missing',
  'type_error',
  'build_error',
  'runtime_backend_error',
  'api_contract_error',
  'ui_render_error',
  'responsive_layout_error',
  'pwa_manifest_error',
  'service_worker_error',
  'path_drift_error',
  'scope_drift_error',
  'unknown',
])

export const mcpNameSchema = z.enum([
  'context7',
  'playwright',
  'github',
])

export const validationCommandSchema = z.object({
  label: z.string(),
  command: z.string(),
})

export const workflowPhaseSchema = z.object({
  id: phaseIdSchema,
  title: z.string(),
  goal: z.string(),
  dependsOn: z.array(phaseIdSchema),
  allowedFiles: z.array(z.string()),
  requiredMcps: z.array(mcpNameSchema),
  validations: z.array(validationCommandSchema),
  acceptanceCriteria: z.array(z.string()),
  outOfScope: z.array(z.string()),
  repairLimit: z.number().int().nonnegative(),
})

export const diagnosticArtifactSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  phaseId: phaseIdSchema,
  kind: z.string(),
  summary: z.string(),
  path: z.string().optional(),
  createdAt: z.string(),
})

export const validationResultSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('passed'),
    kind: validationKindSchema,
    summary: z.string(),
  }),
  z.object({
    status: z.literal('failed'),
    kind: validationKindSchema,
    summary: z.string(),
    failureKind: failureKindSchema,
  }),
])

export const workflowJobSchema = z.object({
  id: z.string(),
  projectRoot: z.string(),
  currentPhaseId: phaseIdSchema,
  status: jobStatusSchema,
  attempts: z.number().int().nonnegative(),
  repairAttempts: z.number().int().nonnegative(),
  requiredMcps: z.array(mcpNameSchema),
  allowedFiles: z.array(z.string()),
  startedAt: z.string(),
  updatedAt: z.string(),
})

export const workflowJobCreateRequestSchema = z.object({
  projectRoot: z.string().min(1),
  phaseId: phaseIdSchema,
})

export type PhaseId = z.infer<typeof phaseIdSchema>
export type JobStatus = z.infer<typeof jobStatusSchema>
export type ValidationKind = z.infer<typeof validationKindSchema>
export type FailureKind = z.infer<typeof failureKindSchema>
export type McpName = z.infer<typeof mcpNameSchema>
export type ValidationCommand = z.infer<typeof validationCommandSchema>
export type WorkflowPhaseDefinition = z.infer<typeof workflowPhaseSchema>
export type DiagnosticArtifact = z.infer<typeof diagnosticArtifactSchema>
export type ValidationResult = z.infer<typeof validationResultSchema>
export type WorkflowJob = z.infer<typeof workflowJobSchema>
export type WorkflowJobCreateRequest = z.infer<typeof workflowJobCreateRequestSchema>
