import { useMemo } from 'react'
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

interface DisplayUtilizationChartProps {
  data: DisplayUtilizationPoint[]
  onOpenDetail: () => void
}

const DisplayUtilizationChart = ({ data, onOpenDetail }: DisplayUtilizationChartProps) => {
  const chartData = useMemo(
    () =>
      data.map((point) => ({
        ...point,
        label: new Intl.DateTimeFormat('de-DE', {
          day: '2-digit',
          month: 'short',
        }).format(new Date(point.date)),
      })),
    [data],
  )

  return (
    <div className="card utilization-card" role="button" tabIndex={0} onClick={onOpenDetail}>
      <header className="card-header">
        <div>
          <div className="card-title">Display-Auslastung</div>
          <div className="card-sub">Freie Buchungsplätze nach Kalenderwoche</div>
        </div>
        <button
          className="tone-button ghost"
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onOpenDetail()
          }}
        >
          Analytics öffnen
        </button>
      </header>
      <div className="utilization-metrics">
        <div>
          <span className="metric-label">Ø Auslastung</span>
          <span className="metric-value">
            {Math.round(
              chartData.reduce((sum, entry) => sum + (entry.utilizationPercent ?? 0), 0) /
                chartData.length || 0,
            )}
            %
          </span>
        </div>
        <div>
          <span className="metric-label">Ø freie Plätze</span>
          <span className="metric-value">
            {Math.round(
              chartData.reduce((sum, entry) => sum + (entry.freeSlots ?? 0), 0) /
                chartData.length || 0,
            )}
          </span>
        </div>
      </div>
      <div className="utilization-chart">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="utilGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(76, 85, 255, 0.9)" />
                <stop offset="100%" stopColor="rgba(76, 85, 255, 0.05)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
            <XAxis dataKey="label" stroke="rgba(148, 163, 184, 0.65)" />
            <YAxis
              stroke="rgba(148, 163, 184, 0.65)"
              unit="%"
              domain={[0, 100]}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ stroke: '#4c55ff', strokeWidth: 1 }}
              contentStyle={{
                background: 'rgba(15, 20, 46, 0.85)',
                border: '1px solid rgba(76, 85, 255, 0.4)',
                borderRadius: 12,
                color: '#f8fafc',
              }}
              formatter={(value, key) =>
                key === 'utilizationPercent' ? [`${value}%`, 'Auslastung'] : [value ?? '–', key ?? 'Wert']
              }
            />
            <Area
              type="monotone"
              dataKey="utilizationPercent"
              stroke="#4c55ff"
              strokeWidth={3}
              fill="url(#utilGradient)"
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <footer className="utilization-footer">Detailansicht für Kampagnen & Standorte anzeigen →</footer>
    </div>
  )
}

export default DisplayUtilizationChart
