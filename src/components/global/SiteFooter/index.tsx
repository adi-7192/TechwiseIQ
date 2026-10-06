import Link from 'next/link'
import { CONTACT_EMAIL, WHATSAPP_URL } from '@/lib/site'
import styles from './SiteFooter.module.css'

/** `journey`: Home only — the footer is the skyline journey's last stop, so it
 *  drops its background and lets the scene show behind "Let's build what's next". */
export default function SiteFooter({ journey = false }: { journey?: boolean }) {
  return (
    <footer
      className={journey ? `${styles.footer} ${styles.journey}` : styles.footer}
      data-journey={journey ? 'finale' : undefined}
      aria-labelledby="footer-title"
    >
      <div className={styles.inner}>
        <div className={styles.eyebrow}>
          <span>
            <i /> YOUR NEXT CHAPTER
          </span>
          <span>DUBAI · WORKING WORLDWIDE</span>
        </div>
        <Link
          className={styles.invitation}
          href="/contact"
          aria-label="Let’s build what’s next — bring us the problem"
        >
          <h2 id="footer-title">
            Let’s build
            <br />
            <em>what’s next.</em>
          </h2>
          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </Link>
        <div className={styles.contactRow}>
          <p>
            An idea, a messy workflow, a website you’ve outgrown.
            <br />
            Bring it. We’ll help you <strong>make it real</strong>.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`}>
            Info@
            <wbr />
            techwiseiqtechnologies.ae <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className={styles.grid}>
          <div className={styles.identity}>
            <span className={styles.coordinates}>25.2048° N / 55.2708° E</span>
            <p>
              Websites. Software. AI.
              <br />
              Built in Dubai.
              <br />
              <span>Made to work.</span>
            </p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Talk on WhatsApp <span aria-hidden="true">↗</span>
            </a>
          </div>
          <nav className={styles.col} aria-label="Site pages">
            <p>Explore</p>
            <Link href="/">Home</Link>
            <Link href="/work">Work</Link>
            <Link href="/insights">Insights</Link>
            <Link href="/services">Services</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <nav className={styles.col} aria-label="Services">
            <p>What we build</p>
            <Link href="/services/web">Websites</Link>
            <Link href="/services/software">Custom Software</Link>
            <Link href="/services/ai">AI Automation & Advisory</Link>
          </nav>
          <div className={styles.col}>
            <p>One team. From idea to launch.</p>
            <span>Strategy & design</span>
            <span>Development & integration</span>
            <span>Launch & ongoing support</span>
            <a href="#main" className={styles.backTop}>
              Back to top <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
        <div className={styles.wordmark} aria-hidden="true">
          TECHWISE<span>IQ</span>
        </div>
        <div className={styles.bottom}>
          <span>© 2026 Techwise IQ Technologies</span>
          <span>THOUGHTFULLY DESIGNED. BUILT TO WORK.</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
