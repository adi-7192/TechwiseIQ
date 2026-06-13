import { useState, useRef } from 'react'

/**
 * One-open-at-a-time accordion with max-height animation.
 *
 * Usage:
 *   const { openIndex, toggle, setBodyRef } = useAccordion(3)
 *
 *   <button onClick={() => toggle(i)} aria-expanded={openIndex === i}>
 *   <div ref={setBodyRef(i)} style={{ maxHeight: 0, overflow: 'hidden', transition: 'max-height .5s cubic-bezier(.2,.7,.3,1)' }}>
 */
export function useAccordion(count: number) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const bodyRefs = useRef<(HTMLElement | null)[]>(new Array(count).fill(null))

  // Stable ref callbacks — created once, same identity every render.
  // Using unstable lambdas (setBodyRef(i) inline) causes React to cycle
  // the ref on every render (null → element), momentarily breaking toggle.
  const stableRefCallbacks = useRef(
    Array.from({ length: count }, (_, i) => (el: HTMLElement | null) => {
      bodyRefs.current[i] = el
    }),
  )

  function setBodyRef(i: number) {
    return stableRefCallbacks.current[i]
  }

  function toggle(i: number) {
    const isOpen = openIndex === i

    // Close all
    bodyRefs.current.forEach(el => {
      if (el) el.style.maxHeight = '0px'
    })

    if (!isOpen) {
      const el = bodyRefs.current[i]
      if (el) el.style.maxHeight = `${el.scrollHeight}px`
      setOpenIndex(i)
    } else {
      setOpenIndex(null)
    }
  }

  return { openIndex, toggle, setBodyRef }
}
