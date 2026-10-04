'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './IntroPreloader.module.css'

// Runs while parsing the document: the first frame and hydration agree about
// showing the introduction. Storage failures and reduced motion fail open.
const bootstrap = `(function(){try{if(!sessionStorage.getItem('tw-intro-seen')&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!location.hash){document.documentElement.dataset.intro='loading'}}catch(e){}})()`

export default function IntroPreloader() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const overlay = ref.current
    if (!overlay) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      document.documentElement.dataset.intro = 'ready'
      try {
        sessionStorage.setItem('tw-intro-seen', '1')
      } catch {
        /* optional storage */
      }
      window.dispatchEvent(new Event('tw:intro-complete'))
    }
    if (document.documentElement.dataset.intro !== 'loading' || media.matches) {
      finish()
      return
    }
    const tl = gsap.timeline({ onComplete: finish })
    tl.fromTo(
      overlay.querySelectorAll('[data-intro-block]'),
      { opacity: 0, y: 24, rotate: -12 },
      { opacity: 1, y: 0, rotate: 0, duration: 0.65, stagger: 0.12, ease: 'power3.out' }
    )
      .fromTo(
        overlay.querySelector('[data-intro-line]'),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.85, ease: 'power2.inOut' },
        0.2
      )
      .fromTo(
        overlay.querySelectorAll('[data-intro-word]'),
        { opacity: 0.2 },
        { opacity: 1, duration: 0.3, stagger: 0.3 },
        0.2
      )
      .to(overlay, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, 1.15)
    const skip = () => {
      tl.kill()
      finish()
    }
    const onMotion = () => {
      if (media.matches) skip()
    }
    const timeout = window.setTimeout(skip, 2600)
    window.addEventListener('keydown', skip, { once: true })
    window.addEventListener('wheel', skip, { once: true, passive: true })
    window.addEventListener('pointerdown', skip, { once: true })
    media.addEventListener('change', onMotion)
    return () => {
      tl.kill()
      clearTimeout(timeout)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('wheel', skip)
      window.removeEventListener('pointerdown', skip)
      media.removeEventListener('change', onMotion)
    }
  }, [])
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
      <div ref={ref} className={styles.loader} data-intro-overlay aria-hidden="true">
        <div className={styles.top}>
          <span>
            TECHWISE <b>IQ</b>
          </span>
          <span>DUBAI / WORLDWIDE</span>
        </div>
        <div className={styles.center}>
          <div className={styles.blocks}>
            <span data-intro-block>W</span>
            <span data-intro-block>S</span>
            <span data-intro-block>AI</span>
          </div>
          <p>
            <span data-intro-word>Think.</span> <span data-intro-word>Build.</span>{' '}
            <em data-intro-word>Move.</em>
          </p>
          <div className={styles.track}>
            <i data-intro-line />
          </div>
          <span className={styles.caption}>FROM AN IDEA TO SOMETHING THAT WORKS.</span>
        </div>
        <div className={styles.bottom}>
          <span>WEB / SOFTWARE / AI</span>
          <span>YOUR NEXT MOVE STARTS HERE ↗</span>
        </div>
      </div>
    </>
  )
}
