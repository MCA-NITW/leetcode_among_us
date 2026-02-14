import React, { useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import useChartColors from './useChartColors';
import './Charts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Line chart that plots a user's contest rating over time.
 *
 * Props:
 *   contestHistory – array of { attended, rating, ranking,
 *                     contest: { title, startTime } }
 */
function ContestRatingChart({ contestHistory = [] }) {
  const colors = useChartColors();
  const chartRef = useRef(null);

  // Keep only attended contests with valid contest data and sort chronologically.
  const attended = useMemo(() => {
    return contestHistory
      .filter((c) => c.attended && c.contest && c.contest.startTime)
      .sort((a, b) => a.contest.startTime - b.contest.startTime);
  }, [contestHistory]);

  const labels = useMemo(() => {
    return attended.map((c) => {
      const d = new Date(c.contest.startTime * 1000);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
  }, [attended]);

  const ratings = useMemo(() => attended.map((c) => c.rating), [attended]);

  const data = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: 'Rating',
          data: ratings,
          borderColor: colors.accent,
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const { ctx: context, chartArea } = chart;
            if (!chartArea) return 'transparent';
            const gradient = context.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );
            gradient.addColorStop(0, hexToRgba(colors.contest, 0.4));
            gradient.addColorStop(1, hexToRgba(colors.contest, 0.0));
            return gradient;
          },
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: colors.accent,
          pointHoverBorderColor: colors.text,
          pointHoverBorderWidth: 2,
          borderWidth: 2,
        },
      ],
    };
  }, [labels, ratings, colors]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Contest Rating',
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
              const entry = attended[idx];
              return `Rank: #${entry.ranking}\n${entry.contest?.title || ''}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: colors.text2, maxRotation: 45, autoSkip: true },
          grid: { color: colors.grid, drawBorder: false },
        },
        y: {
          ticks: { color: colors.text2 },
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
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}

/* ---- helpers ---- */

function hexToRgba(hex, alpha) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  // Handle named/rgb colors returned from getComputedStyle.
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

export default ContestRatingChart;
