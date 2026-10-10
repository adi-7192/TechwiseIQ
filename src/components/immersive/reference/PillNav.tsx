'use client'

import { useEffect, useRef } from 'react'
import styles from './reference.module.css'

/** Fixed bottom chapter nav (hidden ≤768px). Marks the section crossing mid-viewport. */
export default function PillNav({ items }: { items: ReadonlyArray<readonly [id: string, label: string]> }) {
  const nav = useRef<HTMLElement>(null)

  useEffect(() => {
    const links = Array.from(nav.current?.querySelectorAll('a') ?? [])
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          for (const a of links) {
            if (a.hash === `#${entry.target.id}`) a.setAttribute('aria-current', 'true')
            else a.removeAttribute('aria-current')
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const [id] of items) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items])

  return (
    <nav ref={nav} aria-label="Page chapters" className={styles.pillNav}>
      {items.map(([id, label]) => (
        <a key={id} href={`#${id}`}>
          {label}
        </a>
      ))}
    </nav>
  )
}
