import fs from 'node:fs'
import path from 'node:path'

export function getProjectRoot(): string {
  const candidateRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..')

  if (path.basename(candidateRoot) === 'dist') {
    return path.dirname(candidateRoot)
  }

  return candidateRoot
}

export function getWorkflowPaths() {
  const projectRoot = getProjectRoot()
  const analyzerPath = '/home/calvin/session-artifacts-2026-04-22/token-tools/agent-workflow-token-consumption.mjs'
  const workflowDataRoot = path.join(projectRoot, '.local-data', 'workflow')

  return {
    projectRoot,
    analyzerPath,
    analyzerExists: fs.existsSync(analyzerPath),
    workflowDataRoot,
    jobsDir: path.join(workflowDataRoot, 'jobs'),
  }
}
