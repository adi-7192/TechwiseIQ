'use client'

import { type RefObject, useEffect, useRef } from 'react'
import Link from 'next/link'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { WHATSAPP_URL } from '@/lib/site'
import { cn } from '@/lib/utils'
import styles from './MobileNav.module.css'

export type NavItem = { label: string; href: string }

type MobileNavProps = {
  open: boolean
  onClose: () => void
  links: NavItem[]
  /** The burger button — focus returns here when the menu closes. */
  triggerRef: RefObject<HTMLButtonElement | null>
}

/**
 * Full-screen mobile navigation overlay. Fully keyboard-accessible: focus moves
 * in on open, is trapped among the overlay's controls, Escape closes, and focus
 * returns to the trigger. No WebGL dependency — usable with motion disabled.
 */
export default function MobileNav({ open, onClose, links, triggerRef }: MobileNavProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Body scroll lock while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Focus management + trap + Escape
  useEffect(() => {
    if (!open) return
    const overlay = overlayRef.current
    const focusables = overlay?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    )
    const els = Array.from(focusables ?? [])
    els[0]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        triggerRef.current?.focus()
        return
      }
      if (e.key !== 'Tab' || els.length === 0) return
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose, triggerRef])

  return (
    <div
      ref={overlayRef}
      id="mobile-nav"
      className={cn(styles.overlay, open && styles.open)}
      aria-hidden={!open}
    >
      <nav className={styles.list} aria-label="Primary">
        {links.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            className={styles.link}
            onClick={onClose}
            tabIndex={open ? 0 : -1}
          >
            <span className={styles.num} aria-hidden="true">
              0{i + 1}
            </span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <PrimaryCTA href="/contact" variant="primary" onClick={onClose}>
          Start a project
        </PrimaryCTA>
        <PrimaryCTA href={WHATSAPP_URL} variant="secondary" external>
          WhatsApp
        </PrimaryCTA>
        <span className={styles.meta}>Dubai · Worldwide</span>
      </div>
    </div>
  )
}
