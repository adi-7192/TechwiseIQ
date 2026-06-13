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

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${hidden && !menuOpen ? styles.hidden : ''}`}
      >
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          TECHWISE<span className={styles.accent}>IQ</span>
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
