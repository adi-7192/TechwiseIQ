'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import MobileNav, { type NavItem } from '@/components/global/MobileNav'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { cn } from '@/lib/utils'
import styles from './SiteHeader.module.css'

const NAV_LINKS: NavItem[] = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

/**
 * Global immersive header: typographic TECHWISE IQ wordmark, compact mono nav,
 * primary CTA, and an accessible mobile overlay. Hides on scroll-down / reveals
 * on scroll-up, and gains a solid technical surface once scrolled. Preserves the
 * skip-link, focus trap, Escape-to-close, and body scroll-lock of the old Nav.
 */
export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const ticking = useRef(false)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  const onScroll = useCallback(() => {
    if (ticking.current) return
    ticking.current = true
    requestAnimationFrame(() => {
      const y = window.scrollY
      setScrolled(y > 24)
      setHidden(y > 140 && y > lastY.current)
      lastY.current = y
      ticking.current = false
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  // Close the overlay on browser back/forward (link clicks close it directly).
  useEffect(() => {
    const close = () => setMenuOpen(false)
    window.addEventListener('popstate', close)
    return () => window.removeEventListener('popstate', close)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <a href="#main" className={styles.skip}>
        Skip to content
      </a>

      <header
        className={cn(
          styles.header,
          scrolled && styles.scrolled,
          hidden && !menuOpen && styles.hidden,
        )}
      >
        <Link href="/" className={styles.logo} aria-label="Techwise IQ — home">
          <span aria-hidden="true">
            TECHWISE<span className={styles.logoMark}>IQ</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.link}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <span className={styles.desktopCta}>
            <PrimaryCTA href="/contact" variant="primary">
              Start a project
            </PrimaryCTA>
          </span>

          <button
            ref={burgerRef}
            type="button"
            className={cn(styles.burger, menuOpen && styles.burgerOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={styles.burgerBox}>
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
            </span>
          </button>
        </div>
      </header>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={NAV_LINKS}
        triggerRef={burgerRef}
      />
    </>
  )
}
