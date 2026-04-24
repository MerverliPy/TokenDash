import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

import { z } from 'zod'

import { type AnalyzeReport, analyzeReportSchema } from './analyzer.js'
import { getWorkflowPaths } from '../workflow/runtimePaths.js'

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

const storedHistoryEntrySchema = z.object({
  ...historyEntrySummarySchema.shape,
  report: analyzeReportSchema,
})

export type HistoryEntrySummary = z.infer<typeof historyEntrySummarySchema>
export type StoredHistoryEntry = z.infer<typeof storedHistoryEntrySchema>

function getHistoryDir(): string {
  return path.join(getWorkflowPaths().workflowDataRoot, 'history')
}

function getHistoryEntryPath(id: string): string {
  return path.join(getHistoryDir(), `${id}.json`)
}

async function ensureHistoryDir(): Promise<void> {
  await fs.mkdir(getHistoryDir(), { recursive: true })
}

function createHistoryEntrySummary(id: string, savedAt: string, report: AnalyzeReport): HistoryEntrySummary {
  return {
    id,
    saved_at: savedAt,
    generated_at: report.generated_at,
    repo_root: report.repo.root,
    repo_name: report.repo.name,
    workflow_file_count: report.summary.workflow_file_count,
    bundle_count: report.summary.bundle_count,
    model_count: report.summary.model_count,
  }
}

function createHistoryEntryId(): string {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  return `${timestamp}-${randomUUID().slice(0, 8)}`
}

export async function saveRunHistory(report: AnalyzeReport): Promise<HistoryEntrySummary> {
  await ensureHistoryDir()

  const id = createHistoryEntryId()
  const savedAt = new Date().toISOString()
  const summary = createHistoryEntrySummary(id, savedAt, report)
  const entry: StoredHistoryEntry = {
    ...summary,
    report,
  }

  await fs.writeFile(getHistoryEntryPath(id), JSON.stringify(entry, null, 2))
  return summary
}

export async function listRunHistory(): Promise<HistoryEntrySummary[]> {
  try {
    const fileNames = await fs.readdir(getHistoryDir())
    const entries = await Promise.all(
      fileNames
        .filter((fileName) => fileName.endsWith('.json'))
        .map(async (fileName) => {
          const filePath = path.join(getHistoryDir(), fileName)
          const content = await fs.readFile(filePath, 'utf8')
          const parsed = storedHistoryEntrySchema.parse(JSON.parse(content) as unknown)

          return createHistoryEntrySummary(parsed.id, parsed.saved_at, parsed.report)
        }),
    )

    return entries.sort((left, right) => right.saved_at.localeCompare(left.saved_at))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }

    throw error
  }
}

export async function readRunHistory(id: string): Promise<StoredHistoryEntry | null> {
  try {
    const content = await fs.readFile(getHistoryEntryPath(id), 'utf8')
    return storedHistoryEntrySchema.parse(JSON.parse(content) as unknown)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null
    }

    throw error
  }
}
