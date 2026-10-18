import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'
import { Line } from 'react-chartjs-2'
import useChartColors from './useChartColors'
import './Charts.css'
import type { HistoryPoint } from '../../utils/history'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
)

interface SolvedHistoryChartProps {
  points: HistoryPoint[]
}

/**
 * Problems solved (left axis) and contest rating (right axis) per recorded
 * day, from the daily snapshot history.
 */
function SolvedHistoryChart({ points }: Readonly<SolvedHistoryChartProps>) {
  const colors = useChartColors()
  const hasRating = points.some(p => p.rating !== null)

  const data: ChartData<'line'> = useMemo(
    () => ({
      labels: points.map(p =>
        new Date(`${p.date}T00:00:00Z`).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC'
        })
      ),
      datasets: [
        {
          label: 'Solved',
          data: points.map(p => p.solved),
          borderColor: colors.accent,
          backgroundColor: colors.accent,
          yAxisID: 'y',
          tension: 0.3,
          pointRadius: points.length > 30 ? 0 : 3,
          pointHoverRadius: 6,
          borderWidth: 2
        },
        ...(hasRating
          ? [
              {
                label: 'Rating',
                data: points.map(p => p.rating),
                borderColor: colors.contest,
                backgroundColor: colors.contest,
                yAxisID: 'y1',
                tension: 0.3,
                pointRadius: points.length > 30 ? 0 : 3,
                pointHoverRadius: 6,
                borderWidth: 2,
                borderDash: [6, 4],
                spanGaps: true
              }
            ]
          : [])
      ]
    }),
    [points, colors, hasRating]
  )

  const options: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: colors.text2 } },
        tooltip: {
          backgroundColor: colors.bgRaised || 'rgba(0,0,0,0.8)',
          titleColor: colors.text,
          bodyColor: colors.text2,
          borderColor: colors.grid,
          borderWidth: 1
        }
      },
      scales: {
        x: {
          ticks: { color: colors.text2, maxRotation: 45, autoSkip: true },
          grid: { color: colors.grid }
        },
        y: {
          position: 'left',
          ticks: { color: colors.text2, precision: 0 },
          grid: { color: colors.grid },
          title: { display: true, text: 'Solved', color: colors.text2 }
        },
        y1: {
          display: hasRating,
          position: 'right',
          ticks: { color: colors.text2, precision: 0 },
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Rating', color: colors.text2 }
        }
      }
    }),
    [colors, hasRating]
  )

  return (
    <div className="chart-container" style={{ height: 300 }}>
      <Line data={data} options={options} />
    </div>
  )
}

export default SolvedHistoryChart
