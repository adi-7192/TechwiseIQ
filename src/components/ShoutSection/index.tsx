'use client'

import { useEffect, useRef } from 'react'
import styles from './ShoutSection.module.css'

export default function ShoutSection() {
  const strikeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const el = strikeRef.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.setAttribute('data-struck', '')
            observer.disconnect()
          }
        })
      },
      { threshold: 0.6 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className={styles.shout}>
      <div className={styles.g1} aria-hidden="true" />
      <div className={styles.g2} aria-hidden="true" />
      <div className="wrap">
        <h2 className={`${styles.heading} rv`}>
          Agencies sell{' '}
          <span ref={strikeRef} className={styles.strike}>
            hours.
          </span>
          <br />
          We sell <span className={styles.highlight}>outcomes.</span>
        </h2>
        <p className={`${styles.body} rv rv-d1`}>
          A website that sells. Software that fits. Automations that hand your
          team its week back. That&apos;s the product — everything else is
          invoice padding.
        </p>
      </div>
    </section>
  )
}
