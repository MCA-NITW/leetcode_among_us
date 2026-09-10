import { useEffect, useRef } from 'react'

/**
 * Adds the `is-visible` class to the referenced element the first time it
 * scrolls into view. Pair with the global `.reveal` utility in index.css.
 *
 * Elements already in the viewport on mount become visible immediately, so
 * above-the-fold content never waits for a scroll event. Falls back to always
 * visible when IntersectionObserver is unavailable.
 */
export function useReveal<T extends HTMLElement>(
  rootMargin = '0px 0px -60px 0px'
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('is-visible')
            observer.disconnect()
          }
        }
      },
      { rootMargin, threshold: 0.1 }
    )
    observer.observe(node)

    return () => observer.disconnect()
  }, [rootMargin])

  return ref
}
