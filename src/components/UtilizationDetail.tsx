import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DisplayUtilizationPoint } from '../types/dashboard'

interface UtilizationDetailProps {
  data: DisplayUtilizationPoint[]
  onBack: () => void
}

const UtilizationDetail = ({ data, onBack }: UtilizationDetailProps) => {
  const chartData = data.map((point) => ({
    ...point,
    label: new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: 'short',
    }).format(new Date(point.date)),
  }))

  return (
    <div className="utilization-detail">
      <header className="detail-header">
        <div>
          <h1>Display-Auslastung</h1>
          <p>Live-Auswertung der gebuchten Slots inklusive Forecast für freie Inventare.</p>
        </div>
        <button className="tone-button ghost" type="button" onClick={onBack}>
          Zurück zum Dashboard
        </button>
      </header>

      <section className="detail-metrics">
        <div className="detail-card">
          <span className="detail-label">Durchschnittliche Auslastung</span>
          <span className="detail-value">
            {Math.round(
              chartData.reduce((sum, entry) => sum + entry.utilizationPercent, 0) / chartData.length,
            )}
            %
          </span>
        </div>
        <div className="detail-card">
          <span className="detail-label">Freie Slots (Ø)</span>
          <span className="detail-value">
            {Math.round(chartData.reduce((sum, entry) => sum + entry.freeSlots, 0) / chartData.length)}
          </span>
        </div>
        <div className="detail-card">
          <span className="detail-label">Höchste Auslastung</span>
          <span className="detail-value">
            {Math.max(...chartData.map((entry) => entry.utilizationPercent))}%
          </span>
        </div>
        <div className="detail-card">
          <span className="detail-label">Niedrigste Auslastung</span>
          <span className="detail-value">
            {Math.min(...chartData.map((entry) => entry.utilizationPercent))}%
          </span>
        </div>
      </section>

      <section className="detail-chart">
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={chartData} margin={{ top: 10, right: 32, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="detailGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.85)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(148, 163, 184, 0.25)" />
            <XAxis dataKey="label" stroke="rgba(148, 163, 184, 0.6)" />
            <YAxis stroke="rgba(148, 163, 184, 0.6)" unit="%" domain={[0, 100]} />
            <Tooltip
              cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
              contentStyle={{
                background: 'rgba(17, 24, 39, 0.85)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                borderRadius: 16,
                color: '#f8fafc',
                backdropFilter: 'blur(8px)',
              }}
              formatter={(value, key) =>
                key === 'utilizationPercent' ? [`${value}%`, 'Auslastung'] : [value ?? '–', key ?? 'Wert']
              }
            />
            <Area
              type="monotone"
              dataKey="utilizationPercent"
              stroke="#3b82f6"
              strokeWidth={4}
              fill="url(#detailGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <section className="detail-table">
        <h2>Belegung nach Woche</h2>
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Standort</th>
              <th>Gebuchte Slots</th>
              <th>Freie Slots</th>
              <th>Auslastung</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row) => (
              <tr key={row.id}>
                <td>{row.label}</td>
                <td>{row.location}</td>
                <td>{row.bookedSlots}</td>
                <td>{row.freeSlots}</td>
                <td>{row.utilizationPercent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default UtilizationDetail
