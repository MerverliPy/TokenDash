import { Router } from 'express'
import { z } from 'zod'

import { analyzeReportSchema } from '../lib/analyzer.js'
import { listRunHistory, readRunHistory, saveRunHistory } from '../lib/runHistory.js'

const saveHistoryRequestSchema = z.object({
  report: analyzeReportSchema,
})

export const historyRouter = Router()

historyRouter.get('/history', async (_req, res) => {
  const entries = await listRunHistory()
  return res.json({ entries })
})

historyRouter.get('/history/:id', async (req, res) => {
  const entry = await readRunHistory(req.params.id)

  if (!entry) {
    return res.status(404).json({ error: 'History entry not found.' })
  }

  return res.json({ entry })
})

historyRouter.post('/history', async (req, res) => {
  const parsedRequest = saveHistoryRequestSchema.safeParse(req.body ?? {})

  if (!parsedRequest.success) {
    return res.status(400).json({
      error: 'Invalid history save request',
      issues: parsedRequest.error.issues,
    })
  }

  const entry = await saveRunHistory(parsedRequest.data.report)
  return res.status(201).json({ entry })
})
