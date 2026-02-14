import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import useChartColors from './useChartColors';
import './Charts.css';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

/**
 * Scatter chart plotting contest performance:
 *   X-axis = rating at time of contest
 *   Y-axis = problems solved (0-4)
 *   Point color depends on problems solved count.
 *
 * Props:
 *   contestHistory – array of { attended, rating, problemsSolved,
 *                     contest: { title, startTime } }
 */
function ContestScatterChart({ contestHistory = [] }) {
  const colors = useChartColors();

  const attended = useMemo(() => {
    return contestHistory.filter((c) => c.attended);
  }, [contestHistory]);

  // Assign each point a color based on problems solved.
  const pointColor = (solved) => {
    if (solved <= 1) return colors.hard;
    if (solved === 2) return colors.medium;
    return colors.easy; // 3 or 4
  };

  const data = useMemo(() => {
    const points = attended.map((c) => ({
      x: c.rating,
      y: c.problemsSolved ?? 0,
    }));

    const pointColors = attended.map((c) =>
      pointColor(c.problemsSolved ?? 0)
    );

    return {
      datasets: [
        {
          label: 'Contest Performance',
          data: points,
          backgroundColor: pointColors,
          borderColor: pointColors,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attended, colors]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Contest Performance',
          color: colors.text,
          font: { size: 14, weight: '600' },
        },
        tooltip: {
          backgroundColor: colors.bgRaised || 'rgba(0,0,0,0.8)',
          titleColor: colors.text,
          bodyColor: colors.text2,
          borderColor: colors.grid,
          borderWidth: 1,
          callbacks: {
            label: (ctx) => {
              const idx = ctx.dataIndex;
              const entry = attended[idx];
              const title = entry?.contest?.title || '';
              return [
                `Rating: ${ctx.parsed.x}`,
                `Solved: ${ctx.parsed.y}`,
                title,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Rating',
            color: colors.text2,
          },
          ticks: { color: colors.text2 },
          grid: { color: colors.grid, drawBorder: false },
        },
        y: {
          title: {
            display: true,
            text: 'Problems Solved',
            color: colors.text2,
          },
          min: 0,
          max: 4,
          ticks: {
            stepSize: 1,
            color: colors.text2,
          },
          grid: { color: colors.grid, drawBorder: false },
        },
      },
    };
  }, [colors, attended]);

  if (!attended.length) {
    return (
      <div className="chart-container" style={{ height: 300 }}>
        <p style={{ color: colors.text3, textAlign: 'center', paddingTop: 80 }}>
          No contest data available.
        </p>
      </div>
    );
  }

  return (
    <div className="chart-container" style={{ height: 300 }}>
      <Scatter data={data} options={options} />
    </div>
  );
}

export default ContestScatterChart;
