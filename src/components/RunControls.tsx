type RunControlsProps = {
  repoRoot: string
  isRunning: boolean
  onRepoRootChange: (value: string) => void
  onRun: () => void
}

export default function RunControls({ repoRoot, isRunning, onRepoRootChange, onRun }: RunControlsProps) {
  return (
    <section className="panel" aria-label="Manual analyzer run controls">
      <div className="panel__header">
        <h2>Manual run controls</h2>
        <p>Run the analyzer on demand. Leave the repo root blank to target the current TokenDash repo.</p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          onRun()
        }}
        style={{ display: 'grid', gap: '0.85rem' }}
      >
        <label style={{ display: 'grid', gap: '0.4rem' }}>
          <span className="eyebrow" style={{ letterSpacing: '0.08em' }}>
            Repo root override
          </span>
          <input
            type="text"
            value={repoRoot}
            onChange={(event) => onRepoRootChange(event.target.value)}
            placeholder="/home/calvin/TokenDash"
            spellCheck={false}
            style={{
              width: '100%',
              borderRadius: '0.9rem',
              border: '1px solid rgba(139, 180, 255, 0.24)',
              background: 'rgba(9, 15, 29, 0.92)',
              color: '#ecf2ff',
              padding: '0.85rem 0.95rem',
            }}
          />
        </label>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="submit"
            disabled={isRunning}
            style={{
              border: '1px solid rgba(139, 180, 255, 0.35)',
              borderRadius: '999px',
              padding: '0.8rem 1rem',
              background: isRunning ? 'rgba(74, 115, 255, 0.2)' : 'rgba(74, 115, 255, 0.32)',
              color: '#ecf2ff',
              cursor: isRunning ? 'wait' : 'pointer',
            }}
          >
            {isRunning ? 'Running analyzer…' : 'Run analyzer'}
          </button>

          <p style={{ margin: 0, color: '#c8d6f8' }}>The dashboard uses the existing `POST /api/analyze` backend route.</p>
        </div>
      </form>
    </section>
  )
}
