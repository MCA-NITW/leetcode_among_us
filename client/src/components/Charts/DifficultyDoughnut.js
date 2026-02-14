import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import useChartColors from './useChartColors';
import './Charts.css';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Doughnut chart showing Easy / Medium / Hard solved distribution.
 * A custom "center text" plugin renders the total in the hole.
 *
 * Props:
 *   easySolved, mediumSolved, hardSolved – numbers
 */
function DifficultyDoughnut({ easySolved = 0, mediumSolved = 0, hardSolved = 0 }) {
  const colors = useChartColors();
  const total = easySolved + mediumSolved + hardSolved;

  // Center-text plugin (scoped to this instance).
  const centerTextPlugin = useMemo(() => {
    return {
      id: 'doughnutCenterText',
      afterDraw(chart) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;

        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Total number
        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = colors.text;
        ctx.fillText(total, centerX, centerY - 10);

        // Label
        ctx.font = '12px sans-serif';
        ctx.fillStyle = colors.text3;
        ctx.fillText('Solved', centerX, centerY + 14);

        ctx.restore();
      },
    };
  }, [total, colors.text, colors.text3]);

  const data = useMemo(() => {
    return {
      labels: ['Easy', 'Medium', 'Hard'],
      datasets: [
        {
          data: [easySolved, mediumSolved, hardSolved],
          backgroundColor: [colors.easy, colors.medium, colors.hard],
          borderColor: 'transparent',
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    };
  }, [easySolved, mediumSolved, hardSolved, colors]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: colors.text2,
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16,
            font: { size: 12 },
          },
        },
        tooltip: {
          backgroundColor: colors.bgRaised || 'rgba(0,0,0,0.8)',
          titleColor: colors.text,
          bodyColor: colors.text2,
          borderColor: colors.grid,
          borderWidth: 1,
          callbacks: {
            label: (ctx) => {
              const value = ctx.parsed;
              const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return ` ${ctx.label}: ${value} (${pct}%)`;
            },
          },
        },
      },
    };
  }, [colors, total]);

  return (
    <div className="chart-container chart-container--small" style={{ height: 200 }}>
      <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
    </div>
  );
}

export default DifficultyDoughnut;
