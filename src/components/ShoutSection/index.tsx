'use client'

import { useEffect, useRef } from 'react'
import styles from './ShoutSection.module.css'

export default function ShoutSection() {
  const strikeRef = useRef<HTMLSpanElement>(null)
  const outcomeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const strikeEl = strikeRef.current
    const outcomeEl = outcomeRef.current
    if (!strikeEl) return

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            strikeEl.setAttribute('data-struck', '')
            if (outcomeEl) outcomeEl.setAttribute('data-burst', '')
            observer.disconnect()
          }
        })
      },
      { threshold: 0.6 },
    )

    io.observe(strikeEl)
    return () => io.disconnect()
  }, [])

  return (
    <section className={styles.shout}>
<div className="wrap">
        <h2 className={styles.heading} data-animate="rotate-x">
          Agencies sell{' '}
          <span ref={strikeRef} className={styles.strike}>
            hours.
          </span>
          <br />
          We sell{' '}
          <span ref={outcomeRef} className={styles.highlight}>
            outcomes.
          </span>
        </h2>
        <p className={styles.body} data-animate="slide-up">
          A website that sells. Software that fits. Automations that hand your
          team its week back. That&apos;s the product — everything else is
          invoice padding.
        </p>
      </div>
    </section>
  )
}
