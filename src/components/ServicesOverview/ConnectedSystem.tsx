'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import styles from './ConnectedSystem.module.css'

/** One illustrative journey connects the three disciplines. Static output is SSR-safe. */
export default function ConnectedSystem() {
  const root = useRef<HTMLElement>(null)
  const playback = useRef<(() => void) | null>(null)
  const manualPause = useRef(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pieces = element.querySelectorAll('[data-system-piece]')
    const signals = element.querySelectorAll('[data-system-signal]')
    let visible = false
    const context = gsap.context(() => {}, element)
    let timeline: gsap.core.Timeline
    context.add(() => {
      timeline = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.5 })
      timeline.fromTo(
        pieces,
        { opacity: 0.16, y: 10 },
        { opacity: 1, y: 0, stagger: 0.55, duration: 0.85, ease: 'power2.out' }
      )
      signals.forEach((signal, index) => {
        timeline.fromTo(
          signal,
          { scaleX: 0, opacity: 1 },
          { scaleX: 1, duration: 1.1, ease: 'power2.inOut' },
          1.3 + index * 1.5
        )
      })
      timeline.to({}, { duration: 2.5 })
      timeline.to([...pieces, ...signals], { opacity: 0.16, duration: 0.8 })
    })
    const sync = () => {
      element.dataset.motion = media.matches ? 'reduced' : 'active'
      if (media.matches) {
        timeline.pause()
        gsap.set([...pieces, ...signals], { clearProps: 'all' })
      } else if (visible && !document.hidden && !manualPause.current) timeline.play()
      else timeline.pause()
    }
    const onPreference = () => {
      if (!media.matches) timeline.restart().pause()
      sync()
    }
    playback.current = sync
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      { threshold: 0.15 }
    )
    observer.observe(element)
    document.addEventListener('visibilitychange', sync)
    media.addEventListener('change', onPreference)
    sync()
    return () => {
      playback.current = null
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      media.removeEventListener('change', onPreference)
      context.revert()
      delete element.dataset.motion
    }
  }, [])

  return (
    <figure
      ref={root}
      className={styles.system}
      aria-label="Illustrative journey from website enquiry to reviewed work"
    >
      <div className={styles.topline}>
        <span>Connected by design</span>
        <span>Illustrative</span>
      </div>
      <div className={styles.browser}>
        <div className={styles.browserBar}>
          <span aria-hidden="true">● ● ●</span>
          <span>01 / Website</span>
        </div>
        <div className={styles.browserBody}>
          <div data-system-piece>
            <span className={styles.kicker}>Your business, clearly.</span>
            <strong>
              A better first
              <br />
              impression.
            </strong>
            <span className={styles.mockButton}>
              Let&apos;s talk <span aria-hidden="true">↗</span>
            </span>
          </div>
          <div className={styles.webArt} data-system-piece aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <div className={styles.connector} aria-hidden="true">
        <i data-system-signal />
        <span>Enquiry captured ↓</span>
      </div>
      <div className={styles.operation} data-system-piece>
        <span className={styles.kicker}>02 / Custom software</span>
        <div className={styles.request}>
          <span className={styles.requestIcon} aria-hidden="true">
            ↳
          </span>
          <div>
            <strong>New project enquiry</strong>
            <small>One record. Ready for your team.</small>
          </div>
          <span className={styles.status}>Received</span>
        </div>
      </div>
      <div className={styles.connector} aria-hidden="true">
        <i data-system-signal />
        <span>Details passed on ↓</span>
      </div>
      <div className={styles.automation} data-system-piece>
        <span className={styles.kicker}>03 / AI automation</span>
        <div className={styles.flow}>
          <span>Extract details</span>
          <b aria-hidden="true">→</b>
          <span>Route</span>
          <b aria-hidden="true">→</b>
          <span className={styles.review}>Human review</span>
        </div>
      </div>
      <figcaption className={styles.caption}>
        <span>From first visit to the next action.</span>
        <button
          type="button"
          className={styles.pause}
          aria-pressed={paused}
          onClick={() => {
            manualPause.current = !manualPause.current
            setPaused(manualPause.current)
            playback.current?.()
          }}
        >
          {paused ? 'Play' : 'Pause'} animation
        </button>
      </figcaption>
    </figure>
  )
}
