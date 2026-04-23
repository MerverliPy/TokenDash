import { Router } from 'express'

import { AnalyzerExecutionError, analyzeRequestSchema, runAnalyzer } from '../lib/analyzer.js'

export const analyzeRouter = Router()

analyzeRouter.post('/analyze', async (req, res) => {
  const parsedRequest = analyzeRequestSchema.safeParse(req.body ?? {})

  if (!parsedRequest.success) {
    return res.status(400).json({
      error: 'Invalid analyze request',
      issues: parsedRequest.error.issues,
    })
  }

  try {
    const report = await runAnalyzer(parsedRequest.data)
    return res.json({ report })
  } catch (error) {
    if (error instanceof AnalyzerExecutionError) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    const message = error instanceof Error ? error.message : 'Unknown analyzer error'
    return res.status(500).json({ error: message })
  }
})
