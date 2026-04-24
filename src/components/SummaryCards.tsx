import type { AnalyzeReport } from '../lib/analyzerApi.js'

import ReportCharts from './ReportCharts.js'
import ReportDetails from './ReportDetails.js'

type SummaryCardsProps = {
  report: AnalyzeReport | null
}

const emptyCards = [
  {
    label: 'Models analyzed',
    value: '—',
    description: 'Run the analyzer to populate top-level metrics.',
  },
  {
    label: 'Workflow files',
    value: '—',
    description: 'Summary cards stay bounded to the analyzer response.',
  },
  {
    label: 'Bundles',
    value: '—',
    description: 'Bundle cards and charts populate after a completed analyzer run.',
  },
  {
    label: 'Roles',
    value: '—',
    description: 'Role bundle views stay read-only in the current phase.',
  },
]

export default function SummaryCards({ report }: SummaryCardsProps) {
  const cards = report
    ? [
        {
          label: 'Models analyzed',
          value: String(report.summary.model_count),
          description: 'Total model entries returned by the analyzer.',
        },
        {
          label: 'Workflow files',
          value: String(report.summary.workflow_file_count),
          description: 'Workflow files counted in the scanned repo.',
        },
        {
          label: 'Bundles',
          value: String(report.summary.bundle_count),
          description: 'Prompt or workflow bundles grouped by the analyzer.',
        },
        {
          label: 'Roles',
          value: String(report.summary.role_count),
          description: 'Top-level role count from the parsed summary.',
        },
      ]
    : emptyCards

  return (
    <>
      <section className="panel" aria-label="Analyzer summary cards">
        <div className="panel__header">
          <h2>Summary cards</h2>
          <p>Top-level metrics stay compact while charts and detailed tables handle the deeper breakdowns.</p>
        </div>

        <div className="metric-grid">
          {cards.map((card) => (
            <article className="metric-card" key={card.label}>
              <p className="metric-card__label">{card.label}</p>
              <h3>{card.value}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <ReportCharts report={report} />
      <ReportDetails report={report} />
    </>
  )
}
