import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.grid}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <p className={styles.wordmark}>
            TECHWISE <span className={styles.hotIQ}>IQ</span>
          </p>
          <p className={styles.tagline}>
            Agencies sell hours.
            <br />
            We sell outcomes.
          </p>
          <p className={styles.meta}>Dubai · Worldwide</p>
        </div>

        {/* Navigate */}
        <nav className={styles.col} aria-label="Site pages">
          <p className={styles.colHead}>Navigate</p>
          <Link href="/">Home</Link>
          <Link href="/work">Work</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Services */}
        <nav className={styles.col} aria-label="Services">
          <p className={styles.colHead}>Services</p>
          <Link href="/services/web">Web Development</Link>
          <Link href="/services/software">Custom Software</Link>
          <Link href="/services/ai">AI Automation</Link>
        </nav>

        {/* Contact */}
        <div className={styles.col}>
          <p className={styles.colHead}>Contact</p>
          <a href="mailto:Info@techwiseiqtechnologies.ae">
            Info@<wbr />techwiseiqtechnologies.ae
          </a>
          <a
            href="https://wa.me/971567760667"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp ↗
          </a>
        </div>
      </div>

      <div className={`wrap ${styles.bottom}`}>
        <span>© 2026 Techwise IQ Technologies</span>
        <div className={styles.legal}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
