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
        className="control-form"
      >
        <label className="control-form__field">
          <span className="eyebrow control-form__label">
            Repo root override
          </span>
          <input
            type="text"
            value={repoRoot}
            onChange={(event) => onRepoRootChange(event.target.value)}
            placeholder="/home/calvin/TokenDash"
            spellCheck={false}
            className="touch-input"
          />
        </label>

        <div className="button-row button-row--stack-mobile">
          <button
            type="submit"
            disabled={isRunning}
            className="touch-button touch-button--primary"
          >
            {isRunning ? 'Running analyzer…' : 'Run analyzer'}
          </button>

          <p className="helper-text">The dashboard uses the existing `POST /api/analyze` backend route.</p>
        </div>
      </form>
    </section>
  )
}
