import { spawn } from 'node:child_process'
import path from 'node:path'

import { z } from 'zod'

import { getProjectRoot, getWorkflowPaths } from '../workflow/runtimePaths.js'

export const analyzeRequestSchema = z.object({
  repoRoot: z.string().min(1).optional(),
})

const analyzeBundleSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    file_count: z.number(),
    estimated_input_tokens: z.number(),
    estimated_output_tokens: z.number(),
  })
  .passthrough()

const analyzeModelSchema = z
  .object({
    model: z.string(),
    status: z.string(),
    pricing_found: z.boolean(),
    token_basis: z.string(),
    cost_usd: z.number().nullable(),
    notes: z.array(z.string()),
    assigned_bundle_id: z.string().nullable(),
  })
  .passthrough()

export const analyzeReportSchema = z
  .object({
    generated_at: z.string(),
    read_only_by_default: z.boolean(),
    repo: z
      .object({
        root: z.string(),
        detected: z.boolean(),
        name: z.string(),
      })
      .passthrough(),
    summary: z
      .object({
        workflow_file_count: z.number(),
        bundle_count: z.number(),
        role_count: z.number(),
        model_count: z.number(),
        status_counts: z.record(z.string(), z.number()),
      })
      .passthrough(),
    bundles: z.array(analyzeBundleSchema),
    models: z.array(analyzeModelSchema),
  })
  .passthrough()

export const analyzeResponseSchema = z.object({
  report: analyzeReportSchema,
})

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>
export type AnalyzeReport = z.infer<typeof analyzeReportSchema>
export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>

export class AnalyzerExecutionError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 500) {
    super(message)
    this.name = 'AnalyzerExecutionError'
    this.statusCode = statusCode
  }
}

function resolveRepoRoot(repoRoot?: string): string {
  return repoRoot ? path.resolve(repoRoot) : getProjectRoot()
}

export async function runAnalyzer(request: AnalyzeRequest = {}): Promise<AnalyzeReport> {
  const { analyzerPath, analyzerExists } = getWorkflowPaths()

  if (!analyzerExists) {
    throw new AnalyzerExecutionError(`Analyzer script not found at ${analyzerPath}`, 500)
  }

  const repoRoot = resolveRepoRoot(request.repoRoot)

  return new Promise<AnalyzeReport>((resolve, reject) => {
    const child = spawn(process.execPath, [analyzerPath, repoRoot, '--format', 'json'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk: Buffer | string) => {
      stdout += chunk.toString()
    })

    child.stderr.on('data', (chunk: Buffer | string) => {
      stderr += chunk.toString()
    })

    child.on('error', (error) => {
      reject(new AnalyzerExecutionError(`Failed to start analyzer: ${error.message}`, 500))
    })

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new AnalyzerExecutionError(stderr.trim() || `Analyzer exited with code ${code}`, 502))
        return
      }

      let parsedJson: unknown

      try {
        parsedJson = JSON.parse(stdout)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown parse error'
        reject(new AnalyzerExecutionError(`Analyzer returned invalid JSON: ${message}`, 502))
        return
      }

      const parsedReport = analyzeReportSchema.safeParse(parsedJson)

      if (!parsedReport.success) {
        reject(new AnalyzerExecutionError('Analyzer JSON did not match the expected report shape', 502))
        return
      }

      resolve(parsedReport.data)
    })
  })
}
