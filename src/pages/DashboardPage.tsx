import { useEffect, useMemo, useState } from 'react'

import { runAnalyzer, type AnalyzeReport } from '../lib/analyzerApi.js'

type LoadState = 'loading' | 'success' | 'error'

function formatTimestamp(value: string): string {
  const timestamp = new Date(value)

  if (Number.isNaN(timestamp.getTime())) {
    return value
  }

  return timestamp.toLocaleString()
}

export default function DashboardPage() {
  const [status, setStatus] = useState<LoadState>('loading')
  const [report, setReport] = useState<AnalyzeReport | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadReport() {
      try {
        const nextReport = await runAnalyzer()

        if (!ignore) {
          setReport(nextReport)
          setStatus('success')
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error instanceof Error ? error.message : 'Unknown analyzer error')
          setStatus('error')
        }
      }
    }

    void loadReport()

    return () => {
      ignore = true
    }
  }, [])

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
          <h1>Analyzer API wiring is active for the current repo.</h1>
          <p className="hero__text">
            This bounded phase loads the analyzer report through the backend and exposes the parsed JSON in the dashboard shell.
          </p>

          <ul className="pill-list" aria-label="Analyzer API scope">
            <li className="pill-list__item">Phase: analyzer-api</li>
            <li className="pill-list__item">Route: POST /api/analyze</li>
            <li className="pill-list__item">Output: parsed JSON report</li>
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
              <dt>Repository</dt>
              <dd>{report?.repo.root ?? '/home/calvin/TokenDash'}</dd>
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
            <h2>Analyzer response</h2>
            <p>Minimal bounded frontend wiring for the analyzer-api phase.</p>
          </div>

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
