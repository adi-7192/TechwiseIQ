import Link from 'next/link'
import { CONTACT_EMAIL, WHATSAPP_URL } from '@/lib/site'
import styles from './SiteFooter.module.css'

/**
 * Global immersive footer. Preserves every link, the contact channels, and the
 * legal routes from the previous footer — restyled into the dark technical
 * world with a sparse statement over a dense link grid.
 */
export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.statement}>
          Agencies sell hours.
          <br />
          <em>We sell outcomes.</em>
        </p>

        <div className={styles.grid}>
          <div>
            <p className={styles.brandWordmark}>
              <span aria-hidden="true">
                TECHWISE<span className={styles.mark}>IQ</span>
              </span>
              <span className="sr-only">Techwise IQ</span>
            </p>
            <p className={styles.brandMeta}>Dubai · Worldwide</p>
          </div>

          <nav className={styles.col} aria-label="Site pages">
            <p className={styles.colHead}>Navigate</p>
            <Link href="/">Home</Link>
            <Link href="/work">Work</Link>
            <Link href="/services">Services</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          <nav className={styles.col} aria-label="Services">
            <p className={styles.colHead}>Services</p>
            <Link href="/services/web">Web Development</Link>
            <Link href="/services/software">Custom Software</Link>
            <Link href="/services/ai">AI Automation</Link>
          </nav>

          <div className={styles.col}>
            <p className={styles.colHead}>Contact</p>
            <a href={`mailto:${CONTACT_EMAIL}`}>
              Info@<wbr />techwiseiqtechnologies.ae
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              WhatsApp ↗
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© 2026 Techwise IQ Technologies</span>
          <div className={styles.legal}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
