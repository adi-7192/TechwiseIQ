'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import styles from './ServiceDemo.module.css'

type Kind = 'web' | 'software' | 'ai'
const STAGE_TIME = 2.4
const labels: Record<Kind, string[]> = {
  web: [
    'Build the experience',
    'Adapt to every screen',
    'Make the next step clear',
    'Enquiry received',
  ],
  software: [
    'A request arrives',
    'The right person reviews',
    'Check the details',
    'Approved and recorded',
  ],
  ai: [
    'An enquiry arrives',
    'Extract the useful details',
    'Check and route',
    'Ready for human review',
  ],
}
const names: Record<Kind, string> = { web: 'Website', software: 'Software', ai: 'AI workflow' }

/** A continuous product demonstration with smooth, overlapping construction beats.
 * Visibility and the pause control own playback; SSR/reduced motion stay complete. */
export default function ServiceDemo({ kind }: { kind: Kind }) {
  const root = useRef<HTMLElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const manualPause = useRef(false)
  const inView = useRef(false)
  const [step, setStep] = useState(3)
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const element = root.current
    if (!element) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let started = false
    const find = (selector: string) => Array.from(element.querySelectorAll<HTMLElement>(selector))
    const tl = gsap.timeline({
      paused: true,
      repeat: -1,
      repeatDelay: 0.4,
      defaults: { immediateRender: false },
    })
    const pieces =
      kind === 'web'
        ? '[data-build-piece], [data-phone], [data-demo-cursor], [data-demo-notification]'
        : kind === 'software'
          ? '[data-app-piece], [data-review], [data-check], [data-approved]'
          : '[data-flow-input], [data-flow-node], [data-extracted], [data-rule], [data-output], [data-packet]'
    tl.set(find(pieces), { autoAlpha: 0 }, 0)
    tl.set(find('[data-demo-content]'), { opacity: 1 }, 0)
    for (let i = 0; i < 4; i++) tl.call(() => setStep(i), [], i * STAGE_TIME)
    // One indicator, not two: each segment fills across its own stage, so the
    // step position and the time inside that step read from the same bar.
    find('[data-stage-fill]').forEach((fill, i) => {
      tl.fromTo(
        fill,
        { scaleX: 0 },
        { scaleX: 1, duration: i === 3 ? 3.2 : STAGE_TIME, ease: 'none' },
        i * STAGE_TIME
      )
    })
    const reveal = (selector: string, at: number, stagger = 0.12) => {
      tl.fromTo(
        find(selector),
        { autoAlpha: 0, y: 22, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.95, stagger, ease: 'power3.inOut' },
        at
      )
    }
    if (kind === 'web') {
      reveal('[data-build-piece]', 0.15, 0.42)
      tl.fromTo(
        find('[data-phone]'),
        { autoAlpha: 0, x: 45, y: 20, rotation: 10 },
        { autoAlpha: 1, x: 0, y: 0, rotation: 5, duration: 1.4, ease: 'power3.inOut' },
        2.4
      )
      tl.fromTo(
        find('[data-demo-cursor]'),
        { autoAlpha: 0, x: -60, y: -40 },
        { autoAlpha: 1, x: 0, y: 0, duration: 1.25, ease: 'power2.inOut' },
        4.55
      )
      tl.to(
        find('[data-demo-button]'),
        { scale: 1.1, duration: 0.35, yoyo: true, repeat: 1, ease: 'sine.inOut' },
        5.8
      )
      reveal('[data-demo-notification]', 7.1)
      tl.to(find('[data-demo-cursor]'), { autoAlpha: 0, duration: 0.4 }, 7)
    } else if (kind === 'software') {
      reveal('[data-app-piece]', 0.15, 0.32)
      reveal('[data-review]', 2.45)
      reveal('[data-check]', 4.85, 0.45)
      reveal('[data-approved]', 7.2)
      tl.fromTo(
        find('[data-scan]'),
        { scaleX: 0 },
        { scaleX: 1, duration: 1.7, ease: 'power2.inOut' },
        4.7
      )
    } else {
      reveal('[data-flow-input]', 0.2)
      reveal('[data-flow-node]', 2.45)
      reveal('[data-extracted]', 3.3, 0.25)
      reveal('[data-rule]', 4.85)
      reveal('[data-output]', 7.2, 0.22)
      tl.fromTo(
        find('[data-packet]'),
        { yPercent: -120, autoAlpha: 0 },
        { yPercent: 240, autoAlpha: 1, duration: 1.3, stagger: 2.4, ease: 'none' },
        1.7
      )
    }
    // Hold the completed result, then dissolve into the next construction cycle.
    tl.to(find('[data-demo-content]'), { opacity: 0.35, duration: 0.5, ease: 'sine.inOut' }, 10.4)
    tl.to({}, { duration: 0.1 }, 10.9)
    timeline.current = tl
    const syncPlayback = () => {
      if (media.matches || !inView.current || document.hidden || manualPause.current) tl.pause()
      else tl.play()
      element.dataset.playing = String(
        !media.matches && inView.current && !document.hidden && !manualPause.current
      )
    }
    const onPreference = () => {
      setReduced(media.matches)
      if (media.matches) {
        tl.pause()
        gsap.set(find('[data-animated]'), { clearProps: 'all' })
        element.dataset.playing = 'false'
        setStep(3)
      } else if (started) {
        tl.restart()
        syncPlayback()
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        inView.current = entries[0].isIntersecting
        setReady(true)
        setReduced(media.matches)
        if (!started && inView.current) {
          started = true
          if (media.matches) setStep(3)
          else tl.restart()
        }
        syncPlayback()
      },
      { threshold: 0.3 }
    )
    observer.observe(element)
    media.addEventListener('change', onPreference)
    document.addEventListener('visibilitychange', syncPlayback)
    return () => {
      observer.disconnect()
      tl.kill()
      gsap.set(find('[data-animated]'), { clearProps: 'all' })
      timeline.current = null
      media.removeEventListener('change', onPreference)
      document.removeEventListener('visibilitychange', syncPlayback)
    }
  }, [kind])

  function replay() {
    manualPause.current = false
    setPaused(false)
    setAnnouncement('Demonstration restarted.')
    if (root.current) root.current.dataset.playing = String(!reduced)
    if (reduced) {
      setStep(0)
      return
    }
    timeline.current?.restart()
  }
  function togglePause() {
    manualPause.current = !manualPause.current
    setPaused(manualPause.current)
    if (root.current) root.current.dataset.playing = String(!manualPause.current)
    if (manualPause.current) timeline.current?.pause()
    else if (inView.current && !document.hidden) timeline.current?.play()
  }
  function advance() {
    timeline.current?.pause()
    manualPause.current = true
    setPaused(true)
    const next = step === 3 ? 0 : step + 1
    setStep(next)
    // Keep resume synchronized with a manually selected stage.
    timeline.current?.seek(next * STAGE_TIME, true)
    if (root.current) {
      root.current.dataset.playing = 'false'
      gsap.set(root.current.querySelectorAll('[data-animated]'), { clearProps: 'all' })
    }
    setAnnouncement(labels[kind][next])
  }

  return (
    <figure
      ref={root}
      className={styles.demo}
      data-demo={kind}
      data-step={step}
      data-ready={ready}
      data-playing="false"
      aria-label={`${names[kind]} demonstration — illustrative sample`}
    >
      <div className={styles.topbar}>
        <span>
          <i className={styles.dot} /> {names[kind]} / in action
        </span>
        <span>Illustrative</span>
      </div>
      <div className={styles.screen} data-demo-content data-animated>
        {kind === 'web' && <Website step={step} />}
        {kind === 'software' && <Software step={step} />}
        {kind === 'ai' && <Automation step={step} />}
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.stepNumber}>
          0{step + 1}
          <span> / 04</span>
        </span>
        <span>{labels[kind][step]}</span>
        <span className={styles.statusDot} />
      </figcaption>
      <div className={styles.progress} aria-hidden="true">
        {labels[kind].map((label, i) => (
          <span key={label} data-filled={i <= step}>
            <i data-stage-fill data-animated />
          </span>
        ))}
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          onClick={replay}
          disabled={!ready}
          aria-label={`Replay ${names[kind].toLowerCase()} demo`}
        >
          ↻ Replay
        </button>
        {!reduced && (
          <button type="button" onClick={togglePause} disabled={!ready}>
            {paused ? 'Play' : 'Pause'}
          </button>
        )}
        <button className={styles.next} type="button" onClick={advance} disabled={!ready}>
          {step === 3
            ? 'Try it yourself'
            : kind === 'software' && step === 2
              ? 'Approve request'
              : 'Next step'}{' '}
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <span className="sr-only" role="status">
        {announcement}
      </span>
    </figure>
  )
}

function Website({ step }: { step: number }) {
  return (
    <div className={styles.webStage}>
      <div className={styles.webBrowser}>
        <div className={styles.browserChrome}>
          <span>● ● ●</span>
          <span>form.studio</span>
          <span>↗</span>
        </div>
        <div className={styles.webPage}>
          <div className={styles.webNav} data-build-piece data-animated>
            <b>FORM®</b>
            <span>Spaces &nbsp; About &nbsp; ↗</span>
          </div>
          <span className={styles.eyebrow}>CONSIDERED SPACES</span>
          <p className={styles.webHeading} data-build-piece data-animated>
            Room for
            <br />
            what’s next.
          </p>
          <div className={styles.webArt} data-build-piece data-animated aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className={styles.webBottom} data-build-piece data-animated>
            <span>Architecture with purpose.</span>
            <span className={styles.paperButton} data-demo-button data-animated>
              Let’s talk ↗
            </span>
          </div>
        </div>
      </div>
      <div className={styles.phone} data-phone data-animated aria-hidden="true">
        <div className={styles.phoneCamera} />
        <b>FORM®</b>
        <p>
          Room for
          <br />
          what’s next.
        </p>
        <div className={styles.phoneArt} />
        <span>Let’s talk ↗</span>
      </div>
      <div
        className={styles.notification}
        data-demo-notification
        data-animated
        data-shown={step === 3}
      >
        <span className={styles.check}>✓</span>
        <div>
          <b>New project enquiry</b>
          <span>From first impression to first conversation.</span>
        </div>
      </div>
      <span className={styles.demoCursor} data-demo-cursor data-animated aria-hidden="true">
        ↖
      </span>
      <div className={styles.screenNote}>
        <span>RESPONSIVE BY DESIGN</span>
        <span>DESKTOP + MOBILE</span>
      </div>
    </div>
  )
}
function Software({ step }: { step: number }) {
  return (
    <div className={styles.appStage}>
      <div className={styles.appHeader} data-app-piece data-animated>
        <span className={styles.appBrand}>
          IQ<span>/</span>OPS
        </span>
        <span className={styles.avatar}>AM</span>
      </div>
      <div className={styles.appHeading} data-app-piece data-animated>
        <div>
          <span className={styles.eyebrow}>WORKSPACE / PROCUREMENT</span>
          <p>Everything in its place.</p>
        </div>
        <span className={styles.count}>{step === 3 ? '2' : '3'} open</span>
      </div>
      <div className={styles.queue}>
        <div className={styles.queueLabels}>
          <span>REQUEST</span>
          <span>STATUS</span>
        </div>
        <div className={styles.selectedRow} data-app-piece data-animated>
          <span>
            <b>New supplier onboarding</b>
            <small>REQ–024 · Procurement</small>
          </span>
          <span className={styles.badge}>
            {['New', 'In review', 'In review', 'Approved ✓'][step]}
          </span>
        </div>
        <div className={styles.queueRow} data-app-piece data-animated>
          <span>Equipment request</span>
          <small>Queued</small>
        </div>
        <div className={styles.queueRow} data-app-piece data-animated>
          <span>Contract renewal</span>
          <small>Queued</small>
        </div>
      </div>
      <div className={styles.review} data-review data-animated data-shown={step >= 1}>
        <div className={styles.scanTrack} aria-hidden="true">
          <i data-scan data-animated />
        </div>
        <div className={styles.reviewHead}>
          <b>Supplier review</b>
          <span>Assigned to A. Morgan</span>
        </div>
        <div className={styles.checkRow} data-check data-animated>
          <span>Business details</span>
          <span>{step >= 2 ? 'Verified ✓' : 'Checking…'}</span>
        </div>
        <div className={styles.checkRow} data-check data-animated>
          <span>Required documents</span>
          <span>{step >= 2 ? 'Complete ✓' : 'Checking…'}</span>
        </div>
        <div className={styles.reviewResult} data-approved data-animated>
          {step === 3 ? '✓ Approved · recorded in activity log' : 'Human approval required'}
        </div>
      </div>
    </div>
  )
}
function Automation({ step }: { step: number }) {
  return (
    <div className={styles.aiStage}>
      <div className={styles.aiHeading}>
        <span className={styles.eyebrow}>WORKFLOW / ENQUIRY TO ACTION</span>
        <p>The busywork takes care of itself.</p>
      </div>
      <div className={styles.input} data-flow-input data-animated>
        <span className={styles.mailIcon}>↗</span>
        <div>
          <b>New website enquiry</b>
          <p>“We need a customer portal for our team.”</p>
        </div>
        <span className={styles.inputBadge}>Input</span>
      </div>
      <div className={styles.connector} data-lit={step >= 1}>
        <i />
        <b data-packet data-animated />
      </div>
      <div className={styles.aiNode} data-flow-node data-animated data-lit={step >= 1}>
        <span className={styles.aiMark}>✳</span>
        <div>
          <b>Understand & organise</b>
          <span>Extract the request. Keep the context.</span>
        </div>
        <span className={styles.nodeStatus}>{step >= 1 ? '✓' : '01'}</span>
      </div>
      <div className={styles.extracted} data-extracted data-animated data-shown={step >= 1}>
        <span>
          Service <b>Custom software</b>
        </span>
        <span>
          Need <b>Customer portal</b>
        </span>
      </div>
      <div className={styles.connector} data-lit={step >= 2}>
        <i />
        <b data-packet data-animated />
      </div>
      <div className={styles.ruleNode} data-rule data-animated data-lit={step >= 2}>
        <span>◇</span>
        <b>Clear request + service match</b>
        <span>{step >= 2 ? 'Passed ✓' : 'Rules'}</span>
      </div>
      <div className={styles.branch} data-lit={step >= 3} aria-hidden="true">
        <i />
        <i />
      </div>
      <div className={styles.outputs}>
        <div data-output data-animated data-lit={step >= 3}>
          <span>↗</span>
          <b>Create CRM record</b>
          <small>{step >= 3 ? 'Ready for follow-up ✓' : 'System action'}</small>
        </div>
        <div data-output data-animated data-lit={step >= 3}>
          <span>◎</span>
          <b>Human checkpoint</b>
          <small>{step >= 3 ? 'Review suggested reply ✓' : 'A person stays in control'}</small>
        </div>
      </div>
    </div>
  )
}
