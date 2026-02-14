import React from 'react';
import {
  Chart,
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

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Grouped bar chart comparing two users' difficulty breakdown.
 *
 * user1Data / user2Data shape:
 *   { easySolved, mediumSolved, hardSolved }
 */
function DifficultyGroupedBar({ user1Data, user2Data, user1Name, user2Name }) {
  const colors = useChartColors();

  const labels = ['Easy', 'Medium', 'Hard'];

  const data = {
    labels,
    datasets: [
      {
        label: user1Name || 'User 1',
        data: [
          user1Data?.easySolved || 0,
          user1Data?.mediumSolved || 0,
          user1Data?.hardSolved || 0,
        ],
        backgroundColor: colors.accent,
        borderRadius: 4,
      },
      {
        label: user2Name || 'User 2',
        data: [
          user2Data?.easySolved || 0,
          user2Data?.mediumSolved || 0,
          user2Data?.hardSolved || 0,
        ],
        backgroundColor: colors.secondary,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: colors.text,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: colors.text2,
        },
        grid: {
          color: colors.grid,
        },
      },
      y: {
        ticks: {
          color: colors.text2,
        },
        grid: {
          color: colors.grid,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: 300 }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default DifficultyGroupedBar;
