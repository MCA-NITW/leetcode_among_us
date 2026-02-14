import { useState, useEffect } from 'react';

/**
 * Custom hook that reads CSS custom properties from :root and
 * re-reads them whenever the data-theme attribute changes.
 *
 * Returns a stable object of resolved color strings that chart
 * components can use for axes, labels, grid lines, etc.
 */
function useChartColors() {
  const [colors, setColors] = useState(() => readColors());

  useEffect(() => {
    // Re-read colors whenever the theme attribute mutates.
    const observer = new MutationObserver(() => {
      setColors(readColors());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Also read once on mount (handles SSR hydration edge-case).
    setColors(readColors());

    return () => observer.disconnect();
  }, []);

  return colors;
}

function readColors() {
  const style = getComputedStyle(document.documentElement);
  const get = (name) => style.getPropertyValue(name).trim();

  return {
    text: get('--text-1'),
    text2: get('--text-2'),
    text3: get('--text-3'),
    grid: get('--border'),
    easy: get('--easy-color'),
    medium: get('--medium-color'),
    hard: get('--hard-color'),
    accent: get('--accent'),
    contest: get('--contest-color'),
    secondary: get('--secondary'),
    bgRaised: get('--bg-raised'),
    bgGlass: get('--bg-glass'),
  };
}

export default useChartColors;
