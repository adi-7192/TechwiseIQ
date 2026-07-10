import Marquee from '@/components/Marquee'
import { Button, StickerBadge } from '@/components/ui'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <header className={styles.hero}>
      <StickerBadge className={styles.sticker}>AI-FIRST ★ DUBAI</StickerBadge>

      {/* 3 kinetic marquee rows — decorative, real h1 is in the claim card.
          Entrance is a CSS animation (plays at first paint, keeps LCP fast —
          a JS entrance hides the largest text until after hydration); the
          velocity skew writes the inner .skew div's transform per frame —
          separate elements so the two never fight over one transform. */}
      <div className={`${styles.enter} ${styles.marqueeRow} ${styles.rowOne}`}>
        <div className="skew">
          <Marquee duration={26}>
            <span className={styles.rowText}>Websites · Software · AI ·&nbsp;</span>
          </Marquee>
        </div>
      </div>
      <div className={`${styles.enter} ${styles.enterD1} ${styles.marqueeRow} ${styles.rowTwo}`}>
        <div className="skew">
          <Marquee direction="right" duration={30}>
            <span className={`${styles.rowText} ${styles.outlined}`}>
              Built in Dubai · Shipped worldwide ·&nbsp;
            </span>
          </Marquee>
        </div>
      </div>
      <div className={`${styles.enter} ${styles.enterD2} ${styles.marqueeRow} ${styles.rowThree}`}>
        <div className="skew">
          <Marquee duration={22}>
            <span className={`${styles.rowText} ${styles.hotText}`}>
              Weeks not quarters ·&nbsp;
            </span>
          </Marquee>
        </div>
      </div>

      {/* Claim card — carries the semantic h1 */}
      <div className={styles.card}>
        <h1 className={`${styles.claim} ${styles.enter} ${styles.enterD2}`}>
          Techwise IQ — the AI-first engineering agency.{' '}
          <span className={styles.highlight}>We build it. We ship it. You own the outcome.</span>
        </h1>
        <div className={`${styles.ctas} ${styles.enter} ${styles.enterD3}`}>
          <Button variant="primary" href="#contact">
            Book a call
          </Button>
          <Button variant="secondary" href="#services">
            What we do ↓
          </Button>
        </div>
      </div>

      <span className={styles.cue}>
        <span className={styles.cueArrow}>↓</span> Scroll
      </span>
    </header>
  )
}
