import { useEffect } from 'react'

/**
 * Registers IntersectionObserver on all `.rv` elements in the document.
 * Adds `.in` class when element enters viewport (threshold 0.18).
 * Under prefers-reduced-motion, applies `.in` immediately to all.
 * Call once from a top-level client component (e.g. the page layout).
 */
export function useReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.rv'))

    if (reduced) {
      elements.forEach(el => el.classList.add('in'))
      return
    }

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18 }
    )

    elements.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}
