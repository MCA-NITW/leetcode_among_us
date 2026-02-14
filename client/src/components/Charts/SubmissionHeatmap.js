import React, { useMemo } from 'react';
import useChartColors from './useChartColors';
import './Charts.css';

/**
 * GitHub-style contribution heatmap (pure CSS grid, no chart.js).
 *
 * Props:
 *   submissionCalendar – object keyed by unix-timestamp strings,
 *                        values are submission counts.
 *                        e.g. { "1700000000": 3, "1700086400": 1 }
 */
function SubmissionHeatmap({ submissionCalendar = {} }) {
  const colors = useChartColors();

  // Build a Map<dateString, count> from the calendar prop.
  const countByDate = useMemo(() => {
    const map = new Map();
    Object.entries(submissionCalendar).forEach(([ts, count]) => {
      const d = new Date(Number(ts) * 1000);
      const key = toDateKey(d);
      map.set(key, (map.get(key) || 0) + count);
    });
    return map;
  }, [submissionCalendar]);

  // Generate the 365-day grid (ending today).
  const { cells, monthLabels, totalSubmissions } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start from 52 full weeks ago on Sunday so columns align.
    const start = new Date(today);
    start.setDate(start.getDate() - 364);
    // Shift back to the previous Sunday if needed.
    const dayOfWeek = start.getDay(); // 0=Sun
    start.setDate(start.getDate() - dayOfWeek);

    const dayCells = [];
    let total = 0;
    const months = [];
    let lastMonth = -1;

    const cursor = new Date(start);
    while (cursor <= today) {
      const key = toDateKey(cursor);
      const count = countByDate.get(key) || 0;
      total += count;

      // Track the week-column index for month labels.
      const weekIdx = Math.floor(dayCells.length / 7);
      const month = cursor.getMonth();
      if (month !== lastMonth) {
        months.push({
          label: cursor.toLocaleDateString('en-US', { month: 'short' }),
          col: weekIdx + 1, // CSS grid is 1-indexed
        });
        lastMonth = month;
      }

      dayCells.push({
        key,
        count,
        level: countToLevel(count),
        date: new Date(cursor),
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return { cells: dayCells, monthLabels: months, totalSubmissions: total };
  }, [countByDate]);

  // Number of complete week-columns.
  const totalWeeks = Math.ceil(cells.length / 7);

  // Color for a given intensity level (0-4).
  const levelColor = (level) => {
    const accent = colors.accent;
    switch (level) {
      case 0:
        return colors.grid || 'rgba(255,255,255,0.05)';
      case 1:
        return hexToRgba(accent, 0.2);
      case 2:
        return hexToRgba(accent, 0.4);
      case 3:
        return hexToRgba(accent, 0.7);
      case 4:
        return accent;
      default:
        return 'transparent';
    }
  };

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div className="chart-container chart-container--wide" style={{ height: 400 }}>
      {/* Title + total */}
      <div style={styles.header}>
        <span style={{ color: colors.text, fontWeight: 600, fontSize: 14 }}>
          Submission Activity
        </span>
        <span style={{ color: colors.text3, fontSize: 12 }}>
          {totalSubmissions} submission{totalSubmissions !== 1 ? 's' : ''} in the
          last year
        </span>
      </div>

      <div style={styles.wrapper}>
        {/* Day-of-week labels */}
        <div style={styles.dayLabels}>
          {dayLabels.map((label, i) => (
            <span key={i} style={{ ...styles.dayLabel, color: colors.text3 }}>
              {label}
            </span>
          ))}
        </div>

        <div style={{ overflow: 'auto', flex: 1 }}>
          {/* Month labels row */}
          <div
            style={{
              ...styles.monthRow,
              gridTemplateColumns: `repeat(${totalWeeks}, 14px)`,
            }}
          >
            {monthLabels.map((m, i) => (
              <span
                key={i}
                style={{
                  ...styles.monthLabel,
                  gridColumn: m.col,
                  color: colors.text3,
                }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Heatmap grid */}
          <div
            style={{
              ...styles.grid,
              gridTemplateColumns: `repeat(${totalWeeks}, 14px)`,
              gridTemplateRows: 'repeat(7, 14px)',
            }}
          >
            {cells.map((cell, i) => (
              <div
                key={cell.key + i}
                title={`${cell.date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}: ${cell.count} submission${cell.count !== 1 ? 's' : ''}`}
                style={{
                  ...styles.cell,
                  backgroundColor: levelColor(cell.level),
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <span style={{ color: colors.text3, fontSize: 11, marginRight: 4 }}>
          Less
        </span>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <div
            key={lvl}
            style={{
              ...styles.cell,
              ...styles.legendCell,
              backgroundColor: levelColor(lvl),
            }}
          />
        ))}
        <span style={{ color: colors.text3, fontSize: 11, marginLeft: 4 }}>
          More
        </span>
      </div>
    </div>
  );
}

/* ---- helpers ---- */

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function countToLevel(count) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

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

/* ---- inline styles ---- */

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wrapper: {
    display: 'flex',
    gap: 4,
  },
  dayLabels: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    paddingTop: 20, // offset for month row
  },
  dayLabel: {
    fontSize: 10,
    lineHeight: '14px',
    textAlign: 'right',
    width: 28,
  },
  monthRow: {
    display: 'grid',
    gap: 2,
    marginBottom: 2,
    height: 16,
  },
  monthLabel: {
    fontSize: 10,
    lineHeight: '16px',
    whiteSpace: 'nowrap',
  },
  grid: {
    display: 'grid',
    gap: 2,
    gridAutoFlow: 'column',
  },
  cell: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legend: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 3,
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
};

export default SubmissionHeatmap;
