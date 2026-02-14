import React, { useMemo } from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import useChartColors from './useChartColors';
import './Charts.css';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Dual line chart comparing two users' contest rating history.
 *
 * Each history entry has the shape:
 *   { attended, rating, contest: { title, startTime } }
 */
function DualRatingChart({ user1History, user2History, user1Name, user2Name }) {
  const colors = useChartColors();

  const { labels, user1Ratings, user2Ratings, hasData } = useMemo(() => {
    // Filter to attended contests with valid contest data and sort by startTime ascending.
    const filterAndSort = (history) =>
      (history || [])
        .filter((h) => h.attended && h.contest && h.contest.startTime)
        .slice()
        .sort((a, b) => a.contest.startTime - b.contest.startTime);

    const sorted1 = filterAndSort(user1History);
    const sorted2 = filterAndSort(user2History);

    if (sorted1.length === 0 && sorted2.length === 0) {
      return { labels: [], user1Ratings: [], user2Ratings: [], hasData: false };
    }

    // Build maps keyed by startTime for quick lookup.
    const map1 = new Map();
    sorted1.forEach((h) => {
      map1.set(h.contest.startTime, h.rating);
    });

    const map2 = new Map();
    sorted2.forEach((h) => {
      map2.set(h.contest.startTime, h.rating);
    });

    // Merge all unique dates and sort ascending.
    const allDates = Array.from(
      new Set([...map1.keys(), ...map2.keys()])
    ).sort((a, b) => a - b);

    const dateLabels = allDates.map((ts) => {
      const d = new Date(ts * 1000);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        year: '2-digit',
      });
    });

    const ratings1 = allDates.map((ts) =>
      map1.has(ts) ? map1.get(ts) : null
    );
    const ratings2 = allDates.map((ts) =>
      map2.has(ts) ? map2.get(ts) : null
    );

    return {
      labels: dateLabels,
      user1Ratings: ratings1,
      user2Ratings: ratings2,
      hasData: true,
    };
  }, [user1History, user2History]);

  if (!hasData) {
    return (
      <div className="chart-container">
        <div className="chart-no-data">No contest data available</div>
      </div>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        label: user1Name || 'User 1',
        data: user1Ratings,
        borderColor: colors.accent,
        backgroundColor: colors.accent,
        pointBackgroundColor: colors.accent,
        tension: 0.3,
        spanGaps: true,
      },
      {
        label: user2Name || 'User 2',
        data: user2Ratings,
        borderColor: colors.secondary,
        backgroundColor: colors.secondary,
        pointBackgroundColor: colors.secondary,
        tension: 0.3,
        spanGaps: true,
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
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: colors.text2,
          maxRotation: 45,
          autoSkip: true,
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
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: 300 }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default DualRatingChart;
