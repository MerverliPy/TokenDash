import type { AnalyzeReport } from '../lib/analyzerApi.js'

type ReportDetailsProps = {
  report: AnalyzeReport | null
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value)
}

function formatCurrency(value: number | null): string {
  if (value === null) {
    return 'n/a'
  }

  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 4 }).format(value)
}

function EmptyState({ message }: { message: string }) {
  return <p className="detail-empty">{message}</p>
}

export default function ReportDetails({ report }: ReportDetailsProps) {
  const roleEstimates = report?.role_estimates ?? []
  const workflowFiles = report?.workflow_files ?? []

  return (
    <>
      <section className="panel" aria-label="Model detail table">
        <div className="panel__header">
          <h2>Model detail view</h2>
          <p>Each analyzed model includes pricing status, bundle assignment, and analyzer notes.</p>
        </div>

        {report ? (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Model</th>
                  <th scope="col">Status</th>
                  <th scope="col">Bundle</th>
                  <th scope="col">Token basis</th>
                  <th scope="col">Cost</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                {report.models.map((model) => (
                  <tr key={model.model}>
                    <td data-label="Model">{model.model}</td>
                    <td data-label="Status">{model.status}</td>
                    <td data-label="Bundle">{model.assigned_bundle_label ?? model.assigned_bundle_id ?? 'n/a'}</td>
                    <td data-label="Token basis">{model.token_basis}</td>
                    <td data-label="Cost">{formatCurrency(model.cost_usd)}</td>
                    <td data-label="Notes">{model.notes.length > 0 ? model.notes.join(' ') : 'No notes'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No models to display yet. Run the analyzer first." />
        )}
      </section>

      <section className="panel" aria-label="Bundle detail cards">
        <div className="panel__header">
          <h2>Bundle detail view</h2>
          <p>Bundles summarize grouped workflow context and expose the files included in each estimate.</p>
        </div>

        {report ? (
          <div className="detail-card-grid">
            {report.bundles.map((bundle) => (
              <article className="detail-card" key={bundle.id}>
                <p className="metric-card__label">{bundle.id}</p>
                <h3>{bundle.label}</h3>
                <dl className="detail-list">
                  <div>
                    <dt>Files</dt>
                    <dd>{formatNumber(bundle.file_count)}</dd>
                  </div>
                  <div>
                    <dt>Input estimate</dt>
                    <dd>{formatNumber(bundle.estimated_input_tokens)}</dd>
                  </div>
                  <div>
                    <dt>Output estimate</dt>
                    <dd>{formatNumber(bundle.estimated_output_tokens)}</dd>
                  </div>
                </dl>
                <ul className="inline-list">
                  {bundle.files.map((file) => (
                    <li key={file}>{file}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState message="No bundle detail is available until a report is loaded." />
        )}
      </section>

      <section className="panel" aria-label="Role estimate detail table">
        <div className="panel__header">
          <h2>Role bundle view</h2>
          <p>Role estimates stay read-only and reflect the analyzer's current bundle mapping.</p>
        </div>

        {roleEstimates.length > 0 ? (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Role</th>
                  <th scope="col">Bundle</th>
                  <th scope="col">Files</th>
                  <th scope="col">Input estimate</th>
                  <th scope="col">Output estimate</th>
                </tr>
              </thead>
              <tbody>
                {roleEstimates.map((role) => (
                  <tr key={role.role}>
                    <td data-label="Role">{role.role}</td>
                    <td data-label="Bundle">{role.bundle_id}</td>
                    <td data-label="Files">{formatNumber(role.file_count)}</td>
                    <td data-label="Input estimate">{formatNumber(role.estimated_input_tokens)}</td>
                    <td data-label="Output estimate">{formatNumber(role.estimated_output_tokens)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No role estimates were returned for this report." />
        )}
      </section>

      <section className="panel panel--accent" aria-label="Workflow file detail table">
        <div className="panel__header">
          <h2>Workflow file view</h2>
          <p>Workflow files, kinds, and token estimates are exposed directly from the analyzer payload.</p>
        </div>

        {workflowFiles.length > 0 ? (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Path</th>
                  <th scope="col">Kind</th>
                  <th scope="col">Role</th>
                  <th scope="col">Size</th>
                  <th scope="col">Input estimate</th>
                </tr>
              </thead>
              <tbody>
                {workflowFiles.map((file) => (
                  <tr key={file.path}>
                    <td data-label="Path">{file.path}</td>
                    <td data-label="Kind">{file.kind}</td>
                    <td data-label="Role">{file.role ?? 'n/a'}</td>
                    <td data-label="Size">{formatNumber(file.size_bytes)} bytes</td>
                    <td data-label="Input estimate">{formatNumber(file.estimated_input_tokens)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No workflow file entries are available yet." />
        )}
      </section>
    </>
  )
}
