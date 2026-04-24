import { z } from 'zod'

import { analyzeReportSchema, getApiBaseUrl } from './analyzerApi.js'

const historyEntrySummarySchema = z.object({
  id: z.string(),
  saved_at: z.string(),
  generated_at: z.string(),
  repo_root: z.string(),
  repo_name: z.string(),
  workflow_file_count: z.number(),
  bundle_count: z.number(),
  model_count: z.number(),
})

const historyEntrySchema = z.object({
  ...historyEntrySummarySchema.shape,
  report: analyzeReportSchema,
})

const historyListResponseSchema = z.object({
  entries: z.array(historyEntrySummarySchema),
})

const historySaveResponseSchema = z.object({
  entry: historyEntrySummarySchema,
})

const historyEntryResponseSchema = z.object({
  entry: historyEntrySchema,
})

export type HistoryEntrySummary = z.infer<typeof historyEntrySummarySchema>
export type HistoryEntry = z.infer<typeof historyEntrySchema>

async function parseJsonResponse(response: Response, fallbackMessage: string): Promise<unknown> {
  const responseText = await response.text()

  if (!responseText) {
    return {}
  }

  try {
    return JSON.parse(responseText) as unknown
  } catch {
    throw new Error(fallbackMessage)
  }
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') {
    return fallback
  }

  const error = (payload as Record<string, unknown>).error
  return typeof error === 'string' && error.length > 0 ? error : fallback
}

export async function listHistoryEntries(): Promise<HistoryEntrySummary[]> {
  const response = await fetch(`${getApiBaseUrl()}/api/history`)
  const payload = await parseJsonResponse(response, 'History API returned invalid JSON.')

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, `History request failed with status ${response.status}.`))
  }

  const parsedResponse = historyListResponseSchema.safeParse(payload)

  if (!parsedResponse.success) {
    throw new Error('History API response did not match the expected list shape.')
  }

  return parsedResponse.data.entries
}

export async function saveHistoryEntry(report: z.infer<typeof analyzeReportSchema>): Promise<HistoryEntrySummary> {
  const response = await fetch(`${getApiBaseUrl()}/api/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ report }),
  })

  const payload = await parseJsonResponse(response, 'History save API returned invalid JSON.')

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, `History save failed with status ${response.status}.`))
  }

  const parsedResponse = historySaveResponseSchema.safeParse(payload)

  if (!parsedResponse.success) {
    throw new Error('History save response did not match the expected entry shape.')
  }

  return parsedResponse.data.entry
}

export async function loadHistoryEntry(id: string): Promise<HistoryEntry> {
  const response = await fetch(`${getApiBaseUrl()}/api/history/${encodeURIComponent(id)}`)
  const payload = await parseJsonResponse(response, 'History entry API returned invalid JSON.')

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, `History entry request failed with status ${response.status}.`))
  }

  const parsedResponse = historyEntryResponseSchema.safeParse(payload)

  if (!parsedResponse.success) {
    throw new Error('History entry response did not match the expected entry shape.')
  }

  return parsedResponse.data.entry
}
