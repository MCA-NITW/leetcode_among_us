import React, { useMemo } from 'react';
import {
  Chart,
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

Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

/**
 * Helper: convert a hex color string to rgba with the given alpha.
 * Falls back to transparent if parsing fails.
 */
function hexToRgba(hex, alpha) {
  if (!hex) return `rgba(0,0,0,${alpha})`;

  // Handle rgb/rgba strings that the computed style might return.
  if (hex.startsWith('rgb')) {
    const match = hex.match(/[\d.]+/g);
    if (match && match.length >= 3) {
      return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${alpha})`;
    }
    return `rgba(0,0,0,${alpha})`;
  }

  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Radar chart overlaying two users' topic strengths.
 *
 * tagProblemCounts shape:
 *   { advanced: [{tagName, problemsSolved}], intermediate: [...], fundamental: [...] }
 */
function DualRadarChart({ user1Tags, user2Tags, user1Name, user2Name }) {
  const colors = useChartColors();

  const { labels, user1Values, user2Values, hasData } = useMemo(() => {
    // Flatten all categories into a single list for each user.
    const flatten = (tags) => {
      if (!tags) return [];
      const all = [
        ...(tags.advanced || []),
        ...(tags.intermediate || []),
        ...(tags.fundamental || []),
      ];
      return all;
    };

    const flat1 = flatten(user1Tags);
    const flat2 = flatten(user2Tags);

    if (flat1.length === 0 && flat2.length === 0) {
      return { labels: [], user1Values: [], user2Values: [], hasData: false };
    }

    // Build maps: tagName -> problemsSolved for each user.
    const map1 = new Map();
    flat1.forEach(({ tagName, problemsSolved }) => {
      map1.set(tagName, (map1.get(tagName) || 0) + problemsSolved);
    });

    const map2 = new Map();
    flat2.forEach(({ tagName, problemsSolved }) => {
      map2.set(tagName, (map2.get(tagName) || 0) + problemsSolved);
    });

    // Find tags common to both users.
    const commonTags = [...map1.keys()].filter((tag) => map2.has(tag));

    if (commonTags.length === 0) {
      return { labels: [], user1Values: [], user2Values: [], hasData: false };
    }

    // Sort by combined count descending and take top 8.
    commonTags.sort(
      (a, b) =>
        map1.get(b) + map2.get(b) - (map1.get(a) + map2.get(a))
    );
    const top = commonTags.slice(0, 8);

    return {
      labels: top,
      user1Values: top.map((tag) => map1.get(tag) || 0),
      user2Values: top.map((tag) => map2.get(tag) || 0),
      hasData: true,
    };
  }, [user1Tags, user2Tags]);

  if (!hasData) {
    return (
      <div className="chart-container">
        <div className="chart-no-data">No topic data available</div>
      </div>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        label: user1Name || 'User 1',
        data: user1Values,
        borderColor: colors.accent,
        backgroundColor: hexToRgba(colors.accent, 0.2),
        pointBackgroundColor: colors.accent,
        fill: true,
      },
      {
        label: user2Name || 'User 2',
        data: user2Values,
        borderColor: colors.secondary,
        backgroundColor: hexToRgba(colors.secondary, 0.2),
        pointBackgroundColor: colors.secondary,
        fill: true,
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
      r: {
        angleLines: {
          color: colors.grid,
        },
        grid: {
          color: colors.grid,
        },
        pointLabels: {
          color: colors.text2,
          font: {
            size: 11,
          },
        },
        ticks: {
          color: colors.text2,
          backdropColor: 'transparent',
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: 300 }}>
      <Radar data={data} options={options} />
    </div>
  );
}

export default DualRadarChart;
