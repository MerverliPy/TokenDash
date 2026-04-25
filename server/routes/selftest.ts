import { Router } from 'express'

import { runSelftest, SelftestExecutionError } from '../lib/selftest.js'

export const selftestRouter = Router()

selftestRouter.post('/selftest', async (_req, res) => {
  try {
    const result = await runSelftest()
    return res.json({ result })
  } catch (error) {
    if (error instanceof SelftestExecutionError) {
      return res.status(error.statusCode).json({
        error: error.message,
        result: error.result,
      })
    }

    const message = error instanceof Error ? error.message : 'Unknown self-test error'
    return res.status(500).json({ error: message })
  }
})
