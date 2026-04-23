import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

import {
  jobStatusSchema,
  type WorkflowJob,
  type WorkflowJobCreateRequest,
} from './contracts.js'
import { getPhaseDefinition } from './phaseCatalog.js'
import { getWorkflowPaths } from './runtimePaths.js'

function ensureWorkflowDataDirs() {
  const paths = getWorkflowPaths()
  fs.mkdirSync(paths.jobsDir, { recursive: true })
  return paths
}

function getJobFilePath(jobId: string): string {
  const paths = ensureWorkflowDataDirs()
  return path.join(paths.jobsDir, `${jobId}.json`)
}

function writeJob(job: WorkflowJob) {
  fs.writeFileSync(getJobFilePath(job.id), `${JSON.stringify(job, null, 2)}\n`, 'utf8')
}

export function createWorkflowJob(request: WorkflowJobCreateRequest): WorkflowJob {
  const phase = getPhaseDefinition(request.phaseId)
  const now = new Date().toISOString()

  const job: WorkflowJob = {
    id: crypto.randomUUID(),
    projectRoot: request.projectRoot,
    currentPhaseId: request.phaseId,
    status: jobStatusSchema.enum.queued,
    attempts: 0,
    repairAttempts: 0,
    requiredMcps: phase.requiredMcps,
    allowedFiles: phase.allowedFiles,
    startedAt: now,
    updatedAt: now,
  }

  writeJob(job)
  return job
}

export function getWorkflowJob(jobId: string): WorkflowJob | null {
  const jobPath = getJobFilePath(jobId)

  if (!fs.existsSync(jobPath)) {
    return null
  }

  return JSON.parse(fs.readFileSync(jobPath, 'utf8')) as WorkflowJob
}

export function listWorkflowJobs(): WorkflowJob[] {
  const paths = ensureWorkflowDataDirs()

  return fs
    .readdirSync(paths.jobsDir)
    .filter((entry) => entry.endsWith('.json'))
    .map((entry) => JSON.parse(fs.readFileSync(path.join(paths.jobsDir, entry), 'utf8')) as WorkflowJob)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
}
