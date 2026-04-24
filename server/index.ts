import fs from 'node:fs'
import path from 'node:path'

import express from 'express'

import { createBasicAuthMiddleware, getBasicAuthConfig } from './lib/basicAuth.js'
import { createDevCorsMiddleware, createRequestSecurityMiddleware } from './lib/requestSecurity.js'
import { analyzeRouter } from './routes/analyze.js'
import { healthRouter } from './routes/health.js'
import { historyRouter } from './routes/history.js'
import { workflowRouter } from './routes/workflow.js'
import { getProjectRoot } from './workflow/runtimePaths.js'

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = Number(process.env.PORT || 3001)
const authConfig = getBasicAuthConfig()
const projectRoot = getProjectRoot()
const clientDistRoot = path.join(projectRoot, 'dist', 'client')
const clientIndexPath = path.join(clientDistRoot, 'index.html')
const hasBuiltClient = fs.existsSync(clientIndexPath)

app.use(express.json())
app.use(createRequestSecurityMiddleware({ enforceSameOrigin: authConfig.enabled }))
app.use(createDevCorsMiddleware(!authConfig.enabled))
app.use(createBasicAuthMiddleware(authConfig))

app.use('/api', healthRouter)
app.use('/api', analyzeRouter)
app.use('/api', historyRouter)
app.use('/api', workflowRouter)

if (hasBuiltClient) {
  app.use(express.static(clientDistRoot))

  app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
    res.sendFile(clientIndexPath)
  })
}

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : 'Unknown server error'
  res.status(500).json({ error: message })
})

app.listen(port, host, () => {
  const bindUrl = `http://${host}:${port}`
  const authStatus = authConfig.enabled ? 'enabled' : 'disabled'
  const uiStatus = hasBuiltClient ? 'built frontend served by Express' : 'API-only mode (dist/client missing)'

  console.log(`TokenDash backend listening on ${bindUrl}`)
  console.log(`HTTP Basic Auth: ${authStatus}`)
  console.log(`Frontend mode: ${uiStatus}`)
})
