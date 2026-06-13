'use client'

import { useEffect, useRef } from 'react'
import styles from './Manifesto.module.css'

const LEAD_WORDS =
  'We build websites, software & AI automations for businesses that'.split(' ')
const PUNCH_WORDS = ['hate', 'boring.']

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const burstFired = useRef(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const el = sectionRef.current
    if (!el) return
    const wordEls = el.querySelectorAll<HTMLSpanElement>('[data-w]')
    const count = wordEls.length
    const FADE_BAND = 4
    const hotStart = count - PUNCH_WORDS.length

    function litCheck() {
      const r = el!.getBoundingClientRect()
      const progress = Math.min(Math.max((innerHeight * 0.82 - r.top) / r.height, 0), 1)
      // Cursor drives the first N-2 words across 0→85% of scroll progress
      // Hot words only start after 85%, giving a visible pause
      const leadEnd = hotStart
      const cursor = progress <= 0.85
        ? (progress / 0.85) * leadEnd
        : leadEnd + ((progress - 0.85) / 0.15) * PUNCH_WORDS.length

      wordEls.forEach((w, i) => {
        let opacity: number
        if (i < cursor - 1) {
          opacity = 1
        } else if (i > cursor + FADE_BAND) {
          opacity = 0.14
        } else {
          const t = Math.min(Math.max((cursor - i) / FADE_BAND, 0), 1)
          opacity = 0.14 + t * 0.86
        }
        w.style.opacity = String(opacity)
      })

      // Fire burst once when hot words are fully revealed
      const allHotLit = cursor >= count
      if (allHotLit && !burstFired.current) {
        burstFired.current = true
        for (let i = hotStart; i < count; i++) {
          wordEls[i].setAttribute('data-burst', '')
        }
      }
      if (!allHotLit) {
        burstFired.current = false
        for (let i = hotStart; i < count; i++) {
          wordEls[i].removeAttribute('data-burst')
        }
      }
    }

    window.addEventListener('scroll', litCheck, { passive: true })
    litCheck()
    return () => window.removeEventListener('scroll', litCheck)
  }, [])

  return (
    <section ref={sectionRef} className={styles.manifesto}>
      <div className="wrap">
        <span className={styles.label}>The short version</span>
        <p className={styles.text}>
          {LEAD_WORDS.map((word, i) => (
            <span key={i} data-w="" className={styles.word}>
              {word}{' '}
            </span>
          ))}
          <span className={styles.hotLine}>
            {PUNCH_WORDS.map((word, i) => (
              <span
                key={`hot-${i}`}
                data-w=""
                className={`${styles.word} ${styles.hot}`}
              >
                {word}{i < PUNCH_WORDS.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        </p>
      </div>
    </section>
  )
}
