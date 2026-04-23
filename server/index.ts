import express from 'express'

import { analyzeRouter } from './routes/analyze.js'
import { healthRouter } from './routes/health.js'
import { workflowRouter } from './routes/workflow.js'

const app = express()
const port = Number(process.env.PORT || 3001)

app.use(express.json())

app.use((req, res, next) => {
  const origin = req.headers.origin

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')

  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }

  next()
})

app.use('/api', healthRouter)
app.use('/api', analyzeRouter)
app.use('/api', workflowRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : 'Unknown server error'
  res.status(500).json({ error: message })
})

app.listen(port, () => {
  console.log(`TokenDash backend listening on http://localhost:${port}`)
})
