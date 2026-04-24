import type { AnalyzeReport } from '../lib/analyzerApi.js'

type ReportChartsProps = {
  report: AnalyzeReport | null
}

type ChartDatum = {
  label: string
  value: number
  tone: 'primary' | 'secondary' | 'neutral'
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

function buildStatusData(report: AnalyzeReport | null): ChartDatum[] {
  if (!report) {
    return []
  }

  return Object.entries(report.summary.status_counts)
    .map(([label, value]): ChartDatum => ({
      label,
      value,
      tone: label === 'exact' ? 'primary' : label === 'estimated' ? 'secondary' : 'neutral',
    }))
    .sort((left, right) => right.value - left.value)
}

function buildBundleData(report: AnalyzeReport | null): ChartDatum[] {
  if (!report) {
    return []
  }

  return [...report.bundles]
    .sort((left, right) => right.estimated_input_tokens - left.estimated_input_tokens)
    .slice(0, 5)
    .map((bundle, index) => ({
      label: bundle.label,
      value: bundle.estimated_input_tokens,
      tone: index === 0 ? 'primary' : 'secondary',
    }))
}

function BarChart({ title, subtitle, data, valueLabel }: { title: string; subtitle: string; data: ChartDatum[]; valueLabel: string }) {
  const maxValue = Math.max(...data.map((item) => item.value), 0)

  return (
    <article className="panel chart-panel">
      <div className="panel__header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {data.length > 0 ? (
        <div className="bar-chart" role="img" aria-label={title}>
          {data.map((item) => {
            const width = maxValue > 0 ? `${Math.max((item.value / maxValue) * 100, 8)}%` : '0%'

            return (
              <div className="bar-chart__row" key={item.label}>
                <div className="bar-chart__copy">
                  <span className="bar-chart__label">{item.label}</span>
                  <span className="bar-chart__value">
                    {formatCompactNumber(item.value)} {valueLabel}
                  </span>
                </div>

                <div className="bar-chart__track" aria-hidden="true">
                  <div className={`bar-chart__fill bar-chart__fill--${item.tone}`} style={{ width }} />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p>No chart data yet. Run the analyzer to render visual summaries.</p>
      )}
    </article>
  )
}

export default function ReportCharts({ report }: ReportChartsProps) {
  const statusData = buildStatusData(report)
  const bundleData = buildBundleData(report)

  return (
    <>
      <BarChart
        title="Model status chart"
        subtitle="Status counts from the analyzer response, sorted by frequency."
        data={statusData}
        valueLabel="models"
      />
      <BarChart
        title="Bundle input estimate chart"
        subtitle="Largest bundles by estimated input tokens to highlight expensive context groups."
        data={bundleData}
        valueLabel="tokens"
      />
    </>
  )
}
