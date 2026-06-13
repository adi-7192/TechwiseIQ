import Marquee from '@/components/Marquee'
import { Button, StickerBadge } from '@/components/ui'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <header className={styles.hero}>
      <StickerBadge className={styles.sticker}>AI-FIRST ★ DUBAI</StickerBadge>

      {/* 3 kinetic marquee rows — decorative, real h1 is in the claim card */}
      <div className="skew">
        <Marquee duration={26}>
          <span className={styles.rowText}>
            Websites · Software · AI ·&nbsp;
          </span>
        </Marquee>
      </div>
      <div className="skew">
        <Marquee direction="right" duration={30}>
          <span className={`${styles.rowText} ${styles.outlined}`}>
            Built in Dubai · Shipped worldwide ·&nbsp;
          </span>
        </Marquee>
      </div>
      <div className="skew">
        <Marquee duration={22}>
          <span className={`${styles.rowText} ${styles.hotText}`}>
            Weeks not quarters ·&nbsp;
          </span>
        </Marquee>
      </div>

      {/* Claim card — carries the semantic h1 */}
      <div className={styles.card}>
        <h1 className={`${styles.claim} rv`}>
          Techwise IQ — the AI-first engineering agency.{' '}
          <span className={styles.highlight}>
            The type does the talking. The work does the proving.
          </span>
        </h1>
        <div className={`${styles.ctas} rv rv-d1`}>
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
