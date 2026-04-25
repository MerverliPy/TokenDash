import fs from 'node:fs'
import { spawn } from 'node:child_process'

const SELFTEST_SCRIPT_PATH = '/home/calvin/session-artifacts-2026-04-22/token-tools/agent-workflow-token-consumption-selftest.mjs'

export type SelftestExecutionResult = {
  scriptPath: string
  success: boolean
  exitCode: number
  stdout: string
  stderr: string
  startedAt: string
  completedAt: string
}

export class SelftestExecutionError extends Error {
  statusCode: number
  result: SelftestExecutionResult

  constructor(message: string, statusCode: number, result: SelftestExecutionResult) {
    super(message)
    this.name = 'SelftestExecutionError'
    this.statusCode = statusCode
    this.result = result
  }
}

export async function runSelftest(): Promise<SelftestExecutionResult> {
  const startedAt = new Date().toISOString()

  if (!fs.existsSync(SELFTEST_SCRIPT_PATH)) {
    throw new SelftestExecutionError('Self-test script not found.', 500, {
      scriptPath: SELFTEST_SCRIPT_PATH,
      success: false,
      exitCode: -1,
      stdout: '',
      stderr: '',
      startedAt,
      completedAt: new Date().toISOString(),
    })
  }

  return new Promise<SelftestExecutionResult>((resolve, reject) => {
    const child = spawn(process.execPath, [SELFTEST_SCRIPT_PATH], {
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk: Buffer | string) => {
      stdout += chunk.toString()
    })

    child.stderr.on('data', (chunk: Buffer | string) => {
      stderr += chunk.toString()
    })

    child.on('error', (error) => {
      reject(
        new SelftestExecutionError(`Failed to start self-test: ${error.message}`, 500, {
          scriptPath: SELFTEST_SCRIPT_PATH,
          success: false,
          exitCode: -1,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          startedAt,
          completedAt: new Date().toISOString(),
        }),
      )
    })

    child.on('close', (code) => {
      const completedAt = new Date().toISOString()
      const result: SelftestExecutionResult = {
        scriptPath: SELFTEST_SCRIPT_PATH,
        success: code === 0,
        exitCode: code ?? -1,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        startedAt,
        completedAt,
      }

      if (code !== 0) {
        reject(new SelftestExecutionError(result.stderr || `Self-test exited with code ${result.exitCode}.`, 502, result))
        return
      }

      resolve(result)
    })
  })
}
