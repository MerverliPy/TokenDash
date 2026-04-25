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
        <div className="history-list">
          {entries.map((entry) => {
            const isActive = activeEntryId === entry.id

            return (
              <article key={entry.id} className={`history-entry${isActive ? ' history-entry--active' : ''}`}>
                <div className="history-entry__header">
                  <div>
                    <p className="metric-card__label history-entry__label">
                      {entry.repo_name}
                    </p>
                    <h3 className="history-entry__title">{entry.repo_root}</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpen(entry.id)}
                    className="touch-button touch-button--secondary history-entry__button"
                  >
                    {isActive ? 'Open again' : 'Open saved run'}
                  </button>
                </div>

                <ul className="checklist history-entry__stats">
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
