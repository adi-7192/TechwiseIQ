'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './Nav.module.css'

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const ticking = useRef(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)

  const onScroll = useCallback(() => {
    if (ticking.current) return
    ticking.current = true
    requestAnimationFrame(() => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > 120 && y > lastY.current)
      lastY.current = y
      ticking.current = false
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Escape closes the overlay; Tab is trapped between the burger and the
  // overlay links while open; focus moves into the overlay on open.
  useEffect(() => {
    if (!menuOpen) return
    const burger = burgerRef.current
    const links = overlayRef.current?.querySelectorAll<HTMLElement>('a[href]')
    const els = [burger, ...(links ?? [])].filter(
      (el): el is HTMLElement => Boolean(el),
    )

    els[1]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        burger?.focus()
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
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${hidden && !menuOpen ? styles.hidden : ''}`}
      >
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          {/* logotype — WCAG contrast-exempt, hidden from AT in favor of plain text */}
          <span aria-hidden="true">
            TECHWISE<span className={styles.accent}>IQ</span>
          </span>
          <span className="sr-only">Techwise IQ — home</span>
        </Link>

        <div className={styles.links}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/contact" className={styles.cta}>
          Start a project
        </Link>

        <button
          ref={burgerRef}
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </button>
      </nav>

      {/* Full-screen mobile overlay */}
      <div
        ref={overlayRef}
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className={styles.overlayInner}>
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.overlayLink}
              style={{ transitionDelay: menuOpen ? `${0.08 + i * 0.06}s` : '0s' }}
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span className={styles.overlayNum}>0{i + 1}</span>
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className={styles.overlayCta}
            style={{ transitionDelay: menuOpen ? `${0.08 + NAV_LINKS.length * 0.06}s` : '0s' }}
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
          >
            Start a project
          </Link>
        </div>
      </div>
    </>
  )
}
