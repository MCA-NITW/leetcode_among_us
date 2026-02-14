import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import useChartColors from './useChartColors';
import './Charts.css';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

/**
 * Radar chart showing the user's top-8 topic proficiencies.
 *
 * Props:
 *   tagProblemCounts – { advanced: [...], intermediate: [...], fundamental: [...] }
 *     where each entry is { tagName, problemsSolved }
 */
function TopicRadarChart({ tagProblemCounts = {} }) {
  const colors = useChartColors();

  const topTags = useMemo(() => {
    const all = [
      ...(tagProblemCounts.advanced || []),
      ...(tagProblemCounts.intermediate || []),
      ...(tagProblemCounts.fundamental || []),
    ];
    return all
      .slice()
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, 8);
  }, [tagProblemCounts]);

  const labels = useMemo(() => topTags.map((t) => t.tagName), [topTags]);
  const values = useMemo(() => topTags.map((t) => t.problemsSolved), [topTags]);

  const data = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: 'Problems Solved',
          data: values,
          backgroundColor: hexToRgba(colors.accent, 0.2),
          borderColor: colors.accent,
          borderWidth: 2,
          pointBackgroundColor: colors.accent,
          pointBorderColor: colors.text,
          pointHoverRadius: 6,
          pointRadius: 3,
        },
      ],
    };
  }, [labels, values, colors]);

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
          text: 'Topic Proficiency',
          color: colors.text,
          font: { size: 14, weight: '600' },
        },
        tooltip: {
          backgroundColor: colors.bgRaised || 'rgba(0,0,0,0.8)',
          titleColor: colors.text,
          bodyColor: colors.text2,
          borderColor: colors.grid,
          borderWidth: 1,
        },
      },
      scales: {
        r: {
          angleLines: { color: colors.grid },
          grid: { color: colors.grid },
          pointLabels: {
            color: colors.text2,
            font: { size: 11 },
          },
          ticks: {
            color: colors.text3,
            backdropColor: 'transparent',
          },
          beginAtZero: true,
        },
      },
    };
  }, [colors]);

  if (!topTags.length) {
    return (
      <div className="chart-container" style={{ height: 300 }}>
        <p style={{ color: colors.text3, textAlign: 'center', paddingTop: 80 }}>
          No skill data available.
        </p>
      </div>
    );
  }

  return (
    <div className="chart-container" style={{ height: 300 }}>
      <Radar data={data} options={options} />
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

export default TopicRadarChart;
