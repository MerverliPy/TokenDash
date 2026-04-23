import { Router } from 'express'

import { createWorkflowJob, getWorkflowJob, listWorkflowJobs } from '../workflow/jobStore.js'
import { workflowJobCreateRequestSchema } from '../workflow/contracts.js'

export const workflowRouter = Router()

workflowRouter.get('/workflow/jobs', (_req, res) => {
  res.json({ jobs: listWorkflowJobs() })
})

workflowRouter.post('/workflow/jobs', (req, res) => {
  const parsed = workflowJobCreateRequestSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid workflow job request',
      issues: parsed.error.issues,
    })
  }

  const job = createWorkflowJob(parsed.data)
  return res.status(201).json({ job })
})

workflowRouter.get('/workflow/jobs/:jobId', (req, res) => {
  const job = getWorkflowJob(req.params.jobId)

  if (!job) {
    return res.status(404).json({ error: 'Workflow job not found' })
  }

  return res.json({ job })
})
