import { z } from 'zod'

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

const analyzeResponseSchema = z.object({
  report: analyzeReportSchema,
})

export type AnalyzeReport = z.infer<typeof analyzeReportSchema>
export type AnalyzeRequest = {
  repoRoot?: string
}

function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  const { protocol, hostname, port } = window.location

  if (!port || port === '3001') {
    return ''
  }

  return `${protocol}//${hostname}:3001`
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') {
    return fallback
  }

  const error = (payload as Record<string, unknown>).error
  return typeof error === 'string' && error.length > 0 ? error : fallback
}

export async function runAnalyzer(request: AnalyzeRequest = {}): Promise<AnalyzeReport> {
  const response = await fetch(`${getApiBaseUrl()}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  const responseText = await response.text()

  let payload: unknown = {}

  if (responseText) {
    try {
      payload = JSON.parse(responseText) as unknown
    } catch {
      throw new Error('Analyze API returned invalid JSON.')
    }
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, `Analyze request failed with status ${response.status}.`))
  }

  const parsedResponse = analyzeResponseSchema.safeParse(payload)

  if (!parsedResponse.success) {
    throw new Error('Analyze API response did not match the expected report shape.')
  }

  return parsedResponse.data.report
}
