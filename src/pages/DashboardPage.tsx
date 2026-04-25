import { useEffect, useMemo, useState } from 'react'

import RunHistoryPanel from '../components/RunHistoryPanel.js'
import RunControls from '../components/RunControls.js'
import SummaryCards from '../components/SummaryCards.js'
import { getApiBaseUrl, runAnalyzer, type AnalyzeReport } from '../lib/analyzerApi.js'
import { listHistoryEntries, loadHistoryEntry, saveHistoryEntry, type HistoryEntrySummary } from '../lib/historyApi.js'

type LoadState = 'idle' | 'loading' | 'success' | 'error'

type SelftestResult = {
  scriptPath: string
  success: boolean
  exitCode: number
  stdout: string
  stderr: string
  startedAt: string
  completedAt: string
}

function isSelftestResult(value: unknown): value is SelftestResult {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.scriptPath === 'string' &&
    typeof candidate.success === 'boolean' &&
    typeof candidate.exitCode === 'number' &&
    typeof candidate.stdout === 'string' &&
    typeof candidate.stderr === 'string' &&
    typeof candidate.startedAt === 'string' &&
    typeof candidate.completedAt === 'string'
  )
}

function getResponseErrorMessage(payload: unknown, fallbackMessage: string): string {
  if (!payload || typeof payload !== 'object') {
    return fallbackMessage
  }

  const error = (payload as Record<string, unknown>).error
  return typeof error === 'string' && error.length > 0 ? error : fallbackMessage
}

function formatTimestamp(value: string): string {
  const timestamp = new Date(value)

  if (Number.isNaN(timestamp.getTime())) {
    return value
  }

  return timestamp.toLocaleString()
}

export default function DashboardPage() {
  const [status, setStatus] = useState<LoadState>('idle')
  const [report, setReport] = useState<AnalyzeReport | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selftestStatus, setSelftestStatus] = useState<LoadState>('idle')
  const [selftestResult, setSelftestResult] = useState<SelftestResult | null>(null)
  const [selftestErrorMessage, setSelftestErrorMessage] = useState<string | null>(null)
  const [repoRoot, setRepoRoot] = useState('')
  const [historyEntries, setHistoryEntries] = useState<HistoryEntrySummary[]>([])
  const [historyErrorMessage, setHistoryErrorMessage] = useState<string | null>(null)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [activeHistoryEntryId, setActiveHistoryEntryId] = useState<string | null>(null)

  async function refreshHistoryEntries() {
    setHistoryLoading(true)

    try {
      const nextEntries = await listHistoryEntries()
      setHistoryEntries(nextEntries)
      setHistoryErrorMessage(null)
    } catch (error) {
      setHistoryErrorMessage(error instanceof Error ? error.message : 'Unknown history error')
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    void refreshHistoryEntries()
  }, [])

  async function handleRun() {
    setStatus('loading')
    setErrorMessage(null)

    try {
      const nextReport = await runAnalyzer({ repoRoot: repoRoot.trim() || undefined })
      setReport(nextReport)
      setActiveHistoryEntryId(null)
      setStatus('success')

      const savedEntry = await saveHistoryEntry(nextReport)
      setActiveHistoryEntryId(savedEntry.id)
      await refreshHistoryEntries()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown analyzer error')
      setStatus('error')
    }
  }

  async function handleOpenSavedRun(entryId: string) {
    setErrorMessage(null)

    try {
      const entry = await loadHistoryEntry(entryId)
      setReport(entry.report)
      setRepoRoot(entry.report.repo.root)
      setActiveHistoryEntryId(entry.id)
      setStatus('success')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown history load error')
      setStatus('error')
    }
  }

  async function handleSelftestRun() {
    setSelftestStatus('loading')
    setSelftestErrorMessage(null)
    setSelftestResult(null)

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/selftest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const responseText = await response.text()
      let payload: unknown = {}

      if (responseText) {
        try {
          payload = JSON.parse(responseText) as unknown
        } catch {
          throw new Error('Self-test API returned invalid JSON.')
        }
      }

      const resultCandidate = (payload as Record<string, unknown>).result
      const result = isSelftestResult(resultCandidate) ? resultCandidate : null

      if (result) {
        setSelftestResult(result)
      }

      if (!response.ok) {
        setSelftestErrorMessage(getResponseErrorMessage(payload, `Self-test request failed with status ${response.status}.`))
        setSelftestStatus('error')
        return
      }

      if (!result) {
        throw new Error('Self-test API response did not match the expected result shape.')
      }

      setSelftestStatus(result.success ? 'success' : 'error')

      if (!result.success) {
        setSelftestErrorMessage('Self-test reported a failure result.')
      }
    } catch (error) {
      setSelftestErrorMessage(error instanceof Error ? error.message : 'Unknown self-test error')
      setSelftestStatus('error')
    }
  }

  const statusEntries = useMemo(() => {
    if (!report) {
      return []
    }

    return Object.entries(report.summary.status_counts).sort(([left], [right]) => left.localeCompare(right))
  }, [report])

  const rawJson = useMemo(() => (report ? JSON.stringify(report, null, 2) : ''), [report])

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__copy">
          <p className="eyebrow">TokenDash</p>
          <h1>Analyzer runs, saved history, and installable dashboard views are ready for the current repo.</h1>
          <p className="hero__text">
            The installed shell stays readable on small screens, keeps touch actions easy to reach, and still makes it clear that fresh analysis depends on the local backend.
          </p>

          <ul className="pill-list" aria-label="Run controls and summary scope">
            <li className="pill-list__item">PWA: installable shell</li>
            <li className="pill-list__item">Run API: POST /api/analyze</li>
            <li className="pill-list__item">History API: GET/POST /api/history</li>
          </ul>
        </div>

        <aside className="status-card" aria-label="Current analyzer state">
          <span className="status-card__badge">Backend status</span>
          <dl className="status-list">
            <div>
              <dt>Load state</dt>
              <dd>{status}</dd>
            </div>
            <div>
              <dt>Selected repo root</dt>
              <dd>{repoRoot.trim() || report?.repo.root || '/home/calvin/TokenDash'}</dd>
            </div>
            <div>
              <dt>Last generated</dt>
              <dd>{report ? formatTimestamp(report.generated_at) : 'No run completed yet'}</dd>
            </div>
            <div>
              <dt>Saved runs</dt>
              <dd>{historyEntries.length}</dd>
            </div>
            <div>
              <dt>Reachability</dt>
              <dd>Fresh analysis still depends on the local backend on port 3001.</dd>
            </div>
          </dl>
        </aside>
      </header>

      <main className="content-grid">
        <section className="panel">
          <div className="panel__header">
            <h2>Run status</h2>
            <p>Use the dashboard controls to trigger the bounded analyzer flow manually.</p>
          </div>

          {status === 'idle' ? <p>No run started yet. Submit the form below to request a fresh analyzer report.</p> : null}

          {status === 'loading' ? <p>Loading analyzer report from the backend…</p> : null}

          {status === 'error' ? (
            <p>
              Analyzer request failed: {errorMessage ?? 'Unknown error.'} Refresh the page after the backend is available to try again.
            </p>
          ) : null}

          {status === 'success' && report ? (
            <>
              <ul className="checklist">
                <li>Generated: {formatTimestamp(report.generated_at)}</li>
                <li>Detected repo: {report.repo.detected ? 'yes' : 'no'}</li>
                <li>Workflow files counted: {report.summary.workflow_file_count}</li>
                <li>Bundles counted: {report.summary.bundle_count}</li>
                <li>Models analyzed: {report.summary.model_count}</li>
              </ul>

              {statusEntries.length > 0 ? (
                <div className="status-stack">
                  <p className="eyebrow status-stack__label">
                    Status buckets
                  </p>
                  <ul className="checklist">
                    {statusEntries.map(([label, count]) => (
                      <li key={label}>
                        {label}: {count}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : null}
        </section>

        <RunControls repoRoot={repoRoot} isRunning={status === 'loading'} onRepoRootChange={setRepoRoot} onRun={handleRun} />

        <RunHistoryPanel
          entries={historyEntries}
          isLoading={historyLoading}
          errorMessage={historyErrorMessage}
          activeEntryId={activeHistoryEntryId}
          onOpen={handleOpenSavedRun}
        />

        <section className="panel" aria-label="Dev-only self-test controls">
          <div className="panel__header">
            <h2>Dev-only self-test</h2>
            <p>Run the external workflow self-test script through TokenDash to confirm the local analyzer path still works.</p>
          </div>

          <div className="button-row button-row--stack-mobile">
            <button
              type="button"
              disabled={selftestStatus === 'loading'}
              onClick={handleSelftestRun}
              className="touch-button touch-button--primary"
            >
              {selftestStatus === 'loading' ? 'Running self-test…' : 'Run self-test'}
            </button>

            <p className="helper-text">This calls the dev-only `POST /api/selftest` route.</p>
          </div>

          <ul className="checklist">
            <li>State: {selftestStatus}</li>
            <li>Scope: dev-only backend helper and dashboard trigger</li>
            <li>Dependency: external self-test script stays outside this repo</li>
          </ul>

          {selftestErrorMessage ? <p>Self-test request failed: {selftestErrorMessage}</p> : null}

          {selftestResult ? (
            <div className="status-stack">
              <p className="eyebrow status-stack__label">Latest self-test result</p>
              <ul className="checklist">
                <li>Success: {selftestResult.success ? 'yes' : 'no'}</li>
                <li>Exit code: {selftestResult.exitCode}</li>
                <li>Script path: {selftestResult.scriptPath}</li>
                <li>Started: {formatTimestamp(selftestResult.startedAt)}</li>
                <li>Completed: {formatTimestamp(selftestResult.completedAt)}</li>
              </ul>

              <div className="status-stack">
                <p className="eyebrow status-stack__label">stdout</p>
                <pre className="json-panel">{selftestResult.stdout || 'No stdout captured.'}</pre>
              </div>

              <div className="status-stack">
                <p className="eyebrow status-stack__label">stderr</p>
                <pre className="json-panel">{selftestResult.stderr || 'No stderr captured.'}</pre>
              </div>
            </div>
          ) : null}
        </section>

        <SummaryCards report={report} />

        <section className="panel panel--accent">
          <div className="panel__header">
            <h2>Parsed JSON payload</h2>
            <p>The raw analyzer response is shown directly so later phases can build richer summaries and detail views on top of it.</p>
          </div>

          {status === 'success' && report ? (
            <pre className="json-panel">
              {rawJson}
            </pre>
          ) : (
            <p>{status === 'loading' ? 'Waiting for backend JSON…' : 'No parsed JSON is available yet.'}</p>
          )}
        </section>
      </main>
    </div>
  )
}
