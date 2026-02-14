import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import useChartColors from './useChartColors';
import './Charts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Stacked bar chart comparing solved vs remaining problems
 * across the three difficulty levels.
 *
 * Props:
 *   easySolved, mediumSolved, hardSolved   – numbers (solved counts)
 *   totalEasy,  totalMedium,  totalHard    – numbers (pool sizes)
 */
function AcceptanceRateChart({
  easySolved = 0,
  mediumSolved = 0,
  hardSolved = 0,
  totalEasy = 0,
  totalMedium = 0,
  totalHard = 0,
}) {
  const colors = useChartColors();

  const data = useMemo(() => {
    const easyRemaining = Math.max(0, totalEasy - easySolved);
    const mediumRemaining = Math.max(0, totalMedium - mediumSolved);
    const hardRemaining = Math.max(0, totalHard - hardSolved);

    return {
      labels: ['Easy', 'Medium', 'Hard'],
      datasets: [
        {
          label: 'Solved',
          data: [easySolved, mediumSolved, hardSolved],
          backgroundColor: [colors.easy, colors.medium, colors.hard],
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Remaining',
          data: [easyRemaining, mediumRemaining, hardRemaining],
          backgroundColor: hexToRgba(colors.grid, 0.25),
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  }, [
    easySolved,
    mediumSolved,
    hardSolved,
    totalEasy,
    totalMedium,
    totalHard,
    colors,
  ]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: colors.text2,
            usePointStyle: true,
            pointStyle: 'rectRounded',
            padding: 16,
            font: { size: 12 },
          },
        },
        title: {
          display: true,
          text: 'Solved vs Total',
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
            afterBody: (items) => {
              const idx = items[0]?.dataIndex;
              if (idx == null) return '';
              const totals = [totalEasy, totalMedium, totalHard];
              const solved = [easySolved, mediumSolved, hardSolved];
              const pct =
                totals[idx] > 0
                  ? ((solved[idx] / totals[idx]) * 100).toFixed(1)
                  : 0;
              return `${pct}% solved`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: { color: colors.text2 },
          grid: { display: false },
        },
        y: {
          stacked: true,
          ticks: { color: colors.text2 },
          grid: { color: colors.grid, drawBorder: false },
        },
      },
    };
  }, [colors, totalEasy, totalMedium, totalHard, easySolved, mediumSolved, hardSolved]);

  return (
    <div className="chart-container" style={{ height: 300 }}>
      <Bar data={data} options={options} />
    </div>
  );
}

/* ---- helpers ---- */

function hexToRgba(hex, alpha) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  if (hex.startsWith('rgb')) {
    return hex.replace('rgb(', 'rgba(').replace(')', `,${alpha})`);
  }
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default AcceptanceRateChart;
