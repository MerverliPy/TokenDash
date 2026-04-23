const shellHighlights = [
  {
    label: 'Backend',
    value: 'Connected foundation',
    detail: 'The dev-only backend and workflow routes are ready for UI integration.',
  },
  {
    label: 'Shell',
    value: 'Mobile-first',
    detail: 'This phase establishes the responsive dashboard frame and navigation surface.',
  },
  {
    label: 'Next up',
    value: 'Analyzer wiring',
    detail: 'Live run controls, summaries, and charts arrive in later phases.',
  },
] as const

const upcomingPanels = [
  'Run summaries and top token metrics',
  'Model and bundle breakdowns',
  'Warnings, comparisons, and local history',
] as const

const shellPillars = ['Local-first', 'Responsive shell', 'Dev workflow aware'] as const

export default function App() {
  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__copy">
          <p className="eyebrow">TokenDash</p>
          <h1>Local token workflow visibility, shaped for desktop and mobile.</h1>
          <p className="hero__text">
            This shell phase focuses on structure only: a responsive frame for the analysis dashboard,
            with backend status context and clear placeholders for future data surfaces.
          </p>

          <ul className="pill-list" aria-label="Shell design pillars">
            {shellPillars.map((item) => (
              <li key={item} className="pill-list__item">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="status-card" aria-label="Current shell status">
          <span className="status-card__badge">Phase: frontend-shell</span>
          <dl className="status-list">
            <div>
              <dt>Mode</dt>
              <dd>Dev-only local dashboard</dd>
            </div>
            <div>
              <dt>State</dt>
              <dd>Shell scaffold active</dd>
            </div>
            <div>
              <dt>Reachability</dt>
              <dd>Fresh analysis still depends on the local backend</dd>
            </div>
          </dl>
        </aside>
      </header>

      <main className="content-grid">
        <section className="panel">
          <div className="panel__header">
            <h2>Foundation highlights</h2>
            <p>Bounded scope for the current shell pass.</p>
          </div>

          <div className="metric-grid">
            {shellHighlights.map((item) => (
              <article key={item.label} className="metric-card">
                <p className="metric-card__label">{item.label}</p>
                <h3>{item.value}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel panel--accent">
          <div className="panel__header">
            <h2>What this shell prepares</h2>
            <p>The UI frame is ready for later feature phases without pretending those features exist yet.</p>
          </div>

          <ul className="checklist">
            {upcomingPanels.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="placeholder-strip" aria-label="Future dashboard panels">
            <div className="placeholder-card">
              <span>Summary cards</span>
            </div>
            <div className="placeholder-card">
              <span>Charts</span>
            </div>
            <div className="placeholder-card">
              <span>Detail tables</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
