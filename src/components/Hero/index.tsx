'use client'

import dynamic from 'next/dynamic'
import Marquee from '@/components/Marquee'
import { Button, StickerBadge, PlaceholderImage } from '@/components/ui'
import styles from './Hero.module.css'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
})

export default function Hero() {
  return (
    <header className={styles.hero}>
      <HeroScene />
      <StickerBadge className={styles.sticker}>AI-FIRST ★ DUBAI</StickerBadge>

      {/* 3 kinetic marquee rows — decorative, real h1 is in the claim card */}
      <div className="skew" data-animate="slide-up">
        <Marquee duration={26}>
          <span className={styles.rowText}>
            Websites · Software · AI ·&nbsp;
          </span>
        </Marquee>
      </div>
      <div className="skew" data-animate="slide-up">
        <Marquee direction="right" duration={30}>
          <span className={`${styles.rowText} ${styles.outlined}`}>
            Built in Dubai · Shipped worldwide ·&nbsp;
          </span>
        </Marquee>
      </div>
      <div className="skew" data-animate="slide-up">
        <Marquee duration={22}>
          <span className={`${styles.rowText} ${styles.hotText}`}>
            Weeks not quarters ·&nbsp;
          </span>
        </Marquee>
      </div>

      {/* Claim card — carries the semantic h1 */}
      <div className={styles.card}>
        <h1 className={styles.claim} data-animate="slide-up">
          Techwise IQ — the AI-first engineering agency.{' '}
          <span className={styles.highlight}>
            We build it. We ship it. You own the outcome.
          </span>
        </h1>
        <div className={styles.ctas} data-animate="slide-up">
          <Button variant="primary" href="#contact">
            Book a call
          </Button>
          <Button variant="secondary" href="#services">
            What we do ↓
          </Button>
        </div>
      </div>

      {/* Floating screenshot placeholder */}
      <div className={styles.screenshot} data-animate="scale" data-parallax="0.6">
        <PlaceholderImage label="Project preview" />
      </div>

      <span className={styles.cue}>
        <span className={styles.cueArrow}>↓</span> Scroll
      </span>
    </header>
  )
}
