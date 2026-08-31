'use client'

import { useEffect, useState } from 'react'
import styles from './ChapterNav.module.css'

const CHAPTER_LINKS = [
  { id: 'top', label: 'Intro' },
  { id: 'websites', label: 'Web' },
  { id: 'automation', label: 'Automation' },
  { id: 'apps', label: 'Apps' },
  { id: 'advisory', label: 'Advisory' },
] as const

/** Native anchors keep hash history, keyboard behavior, and no-JS navigation. */
export default function ChapterNav() {
  const [active, setActive] =
    useState<(typeof CHAPTER_LINKS)[number]['id']>('top')

  useEffect(() => {
    const targets = CHAPTER_LINKS.map(({ id }) =>
      document.getElementById(id),
    ).filter((target): target is HTMLElement => Boolean(target))
    let frame = 0

    const update = () => {
      frame = 0
      const readingLine = window.scrollY + window.innerHeight * 0.42
      let current = targets[0]?.id ?? 'top'

      for (const target of targets) {
        if (target.offsetTop <= readingLine) current = target.id
        else break
      }

      setActive(current as (typeof CHAPTER_LINKS)[number]['id'])
    }

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    window.addEventListener('hashchange', scheduleUpdate)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('hashchange', scheduleUpdate)
    }
  }, [])

  return (
    <nav className={styles.nav} aria-label="Page chapters">
      <div className={styles.track}>
        {CHAPTER_LINKS.map(({ id, label }) => (
          <a
            key={id}
            className={styles.link}
            href={`#${id}`}
            aria-current={active === id ? 'location' : undefined}
            onClick={() => setActive(id)}
          >
            <span className={styles.dot} aria-hidden="true" />
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}
