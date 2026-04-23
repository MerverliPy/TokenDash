import express from 'express'

import { healthRouter } from './routes/health.js'
import { workflowRouter } from './routes/workflow.js'

const app = express()
const port = Number(process.env.PORT || 3001)

app.use(express.json())

app.use('/api', healthRouter)
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
