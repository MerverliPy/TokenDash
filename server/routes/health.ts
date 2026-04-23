import { Router } from 'express'

import { getWorkflowPaths } from '../workflow/runtimePaths.js'

export const healthRouter = Router()

healthRouter.get('/health', (_req, res) => {
  const paths = getWorkflowPaths()

  res.json({
    status: 'ok',
    projectRoot: paths.projectRoot,
    analyzerPath: paths.analyzerPath,
    analyzerExists: paths.analyzerExists,
    workflowDataRoot: paths.workflowDataRoot,
  })
})
