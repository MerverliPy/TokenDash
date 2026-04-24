import { useMemo, useState } from 'react'

import RunControls from '../components/RunControls.js'
import SummaryCards from '../components/SummaryCards.js'
import { runAnalyzer, type AnalyzeReport } from '../lib/analyzerApi.js'

type LoadState = 'idle' | 'loading' | 'success' | 'error'

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
  const [repoRoot, setRepoRoot] = useState('')

  async function handleRun() {
    setStatus('loading')
    setErrorMessage(null)

    try {
      const nextReport = await runAnalyzer({ repoRoot: repoRoot.trim() || undefined })
      setReport(nextReport)
      setStatus('success')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown analyzer error')
      setStatus('error')
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
          <h1>Manual analyzer runs and summary cards are active for the current repo.</h1>
          <p className="hero__text">
            This bounded phase adds an on-demand analyzer trigger and surfaces headline metrics from the parsed backend response.
          </p>

          <ul className="pill-list" aria-label="Run controls and summary scope">
            <li className="pill-list__item">Phase: run-controls-and-summary</li>
            <li className="pill-list__item">Route: POST /api/analyze</li>
            <li className="pill-list__item">Output: summary metrics + parsed JSON</li>
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
                <div style={{ marginTop: '1rem' }}>
                  <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>
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

        <SummaryCards report={report} />

        <section className="panel panel--accent">
          <div className="panel__header">
            <h2>Parsed JSON payload</h2>
            <p>The raw analyzer response is shown directly so later phases can build richer summaries and detail views on top of it.</p>
          </div>

          {status === 'success' && report ? (
            <pre
              style={{
                margin: 0,
                padding: '1rem',
                borderRadius: '1rem',
                background: 'rgba(9, 15, 29, 0.92)',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
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
