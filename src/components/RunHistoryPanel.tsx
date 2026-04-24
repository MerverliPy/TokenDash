import type { HistoryEntrySummary } from '../lib/historyApi.js'

type RunHistoryPanelProps = {
  entries: HistoryEntrySummary[]
  isLoading: boolean
  errorMessage: string | null
  activeEntryId: string | null
  onOpen: (entryId: string) => void
}

function formatTimestamp(value: string): string {
  const timestamp = new Date(value)

  if (Number.isNaN(timestamp.getTime())) {
    return value
  }

  return timestamp.toLocaleString()
}

export default function RunHistoryPanel({ entries, isLoading, errorMessage, activeEntryId, onOpen }: RunHistoryPanelProps) {
  return (
    <section className="panel" aria-label="Saved run history">
      <div className="panel__header">
        <h2>Saved run history</h2>
        <p>Completed runs are stored locally so you can reopen them without triggering a fresh analyzer execution.</p>
      </div>

      {isLoading ? <p>Loading saved runs…</p> : null}
      {!isLoading && errorMessage ? <p>History request failed: {errorMessage}</p> : null}
      {!isLoading && !errorMessage && entries.length === 0 ? <p>No saved runs yet. Complete one analyzer run to create local history.</p> : null}

      {!isLoading && !errorMessage && entries.length > 0 ? (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {entries.map((entry) => {
            const isActive = activeEntryId === entry.id

            return (
              <article
                key={entry.id}
                style={{
                  border: isActive ? '1px solid rgba(139, 180, 255, 0.45)' : '1px solid rgba(139, 180, 255, 0.18)',
                  borderRadius: '1rem',
                  padding: '1rem',
                  background: isActive ? 'rgba(74, 115, 255, 0.12)' : 'rgba(9, 15, 29, 0.72)',
                  display: 'grid',
                  gap: '0.7rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'start' }}>
                  <div>
                    <p className="metric-card__label" style={{ marginBottom: '0.35rem' }}>
                      {entry.repo_name}
                    </p>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>{entry.repo_root}</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpen(entry.id)}
                    style={{
                      border: '1px solid rgba(139, 180, 255, 0.3)',
                      borderRadius: '999px',
                      padding: '0.7rem 0.95rem',
                      background: 'rgba(74, 115, 255, 0.24)',
                      color: '#ecf2ff',
                      cursor: 'pointer',
                    }}
                  >
                    {isActive ? 'Open again' : 'Open saved run'}
                  </button>
                </div>

                <ul className="checklist" style={{ margin: 0 }}>
                  <li>Saved: {formatTimestamp(entry.saved_at)}</li>
                  <li>Generated: {formatTimestamp(entry.generated_at)}</li>
                  <li>Workflow files: {entry.workflow_file_count}</li>
                  <li>Bundles: {entry.bundle_count}</li>
                  <li>Models: {entry.model_count}</li>
                </ul>
              </article>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
