'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import type { ServiceContent } from '@/data/services'
import styles from './ServiceWorkbench.module.css'

const TITLES = {
  web: [
    'Map the journey.',
    'Give the brand a voice.',
    'Build every breakpoint.',
    'Put content in your hands.',
    'Make the answer findable.',
    'Ready for the real world.',
  ],
  software: [
    'A portal of your own.',
    'The whole operation, in view.',
    'Get your tools talking.',
    'Move forward, in stages.',
    'Start with the essential.',
    'Make the next release better.',
  ],
  ai: [
    'Give busywork a route.',
    'Answers with a source.',
    'Documents become data.',
    'An inbox with direction.',
    'From sources to summary.',
    'Find the right first move.',
  ],
}
const AI_INPUTS = [
  'New enquiry',
  'Team question',
  'Supplier invoice',
  'Incoming email',
  'Weekly activity',
  'Current workflows',
]
const AI_OUTPUTS = [
  'Owner assigned',
  'Source-linked answer',
  'Structured record',
  'Suggested reply',
  'Reviewable report',
  'Prioritized pilot',
]

export default function ServiceWorkbench({ service }: { service: ServiceContent }) {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [ready, setReady] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const manualPause = useRef(false)
  const syncPlayback = useRef<(() => void) | null>(null)
  const selected = service.capabilities[active]

  useEffect(() => {
    const element = stage.current
    if (!element) return
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const pieces = element.querySelectorAll('[data-piece]')
      // Dim floor 0.6 keeps the mock text >= 4.5:1 (ink on paper) mid-loop.
      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.2 })
      tl.fromTo(
        pieces,
        { opacity: 0.6, y: 14 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.3, ease: 'power3.out' }
      )
      tl.to({}, { duration: 2.8 })
      tl.to(pieces, { opacity: 0.6, duration: 0.6 })
      if (manualPause.current) tl.progress(0.6).pause()
      let visible = false
      const sync = () =>
        visible && !document.hidden && !manualPause.current ? tl.play() : tl.pause()
      syncPlayback.current = sync
      const observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting
          sync()
        },
        { threshold: 0.25 }
      )
      observer.observe(element)
      document.addEventListener('visibilitychange', sync)
      return () => {
        syncPlayback.current = null
        observer.disconnect()
        document.removeEventListener('visibilitychange', sync)
      }
    })
    return () => media.revert()
  }, [active])

  return (
    <div className={styles.workbench} data-workbench={service.id}>
      <div className={styles.choices}>
        <p className={styles.label}>Choose a capability</p>
        <div className={styles.buttons}>
          {service.capabilities.map((capability, i) => (
            <button
              key={capability.title}
              type="button"
              aria-pressed={i === active}
              aria-controls="capability-preview"
              onClick={() => {
                setActive(i)
                setReady(true)
              }}
            >
              <span className={styles.number}>0{i + 1}</span>
              <span>{capability.title}</span>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <p className={styles.hint}>Different starting points. Built around your business.</p>
      </div>
      <div className={styles.preview} id="capability-preview">
        <div className={styles.toolbar}>
          <span>
            IQ /{' '}
            {service.id === 'web'
              ? 'Design studio'
              : service.id === 'software'
                ? 'Product studio'
                : 'Automation lab'}
          </span>
          <span>Illustrative</span>
        </div>
        <div className={styles.stage} ref={stage}>
          {service.id === 'web' ? (
            <WebArtifact active={active} />
          ) : service.id === 'software' ? (
            <SoftwareArtifact active={active} />
          ) : (
            <AIArtifact active={active} />
          )}
        </div>
        <div className={styles.description} aria-live={ready ? 'polite' : 'off'}>
          <span className={styles.label}>
            0{active + 1} / {selected.title}
          </span>
          <h3>{TITLES[service.id][active]}</h3>
          <p>{selected.body}</p>
        </div>
        <button
          type="button"
          className={styles.motionControl}
          aria-pressed={!playing}
          onClick={() => {
            manualPause.current = !manualPause.current
            setPlaying(!manualPause.current)
            syncPlayback.current?.()
          }}
        >
          {playing ? 'Pause' : 'Play'} preview
        </button>
      </div>
      <noscript>
        <style>{`[data-workbench] { display: none; }`}</style>
        <p>Explore the complete capabilities in the notes below.</p>
      </noscript>
    </div>
  )
}

function WebArtifact({ active }: { active: number }) {
  if (active === 0)
    return (
      <div className={styles.sitemap}>
        <div className={styles.siteRoot} data-piece>
          Home <span>Start with a clear promise</span>
        </div>
        <div className={styles.siteBranches}>
          {['The offer', 'The proof', 'The next step'].map((label, i) => (
            <div data-piece key={label}>
              <span>0{i + 1}</span>
              <strong>{label}</strong>
              <i />
              <i />
            </div>
          ))}
        </div>
        <p className={styles.artifactNote}>A deliberate path from interest to enquiry.</p>
      </div>
    )
  if (active === 1)
    return (
      <div className={styles.brandBoard}>
        <div data-piece className={styles.typeSpecimen}>
          <small>ART DIRECTION / TYPE & COMPOSITION</small>
          <strong>
            Make
            <br />
            <em>an impression.</em>
          </strong>
          <span>Aa Bb Cc / 012345</span>
        </div>
        <div className={styles.swatches} data-piece>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.brandRule} data-piece>
          One identity. Every interaction. ↗
        </div>
      </div>
    )
  if (active === 3)
    return (
      <div className={styles.editor}>
        <div className={styles.editorNav}>
          CONTENT / INSIGHTS <span>Draft</span>
        </div>
        <div data-piece>
          <small>PAGE TITLE</small>
          <strong>A story worth sharing.</strong>
        </div>
        <div className={styles.editorBlocks} data-piece>
          <span>Image</span>
          <p>
            Write, edit, and publish.
            <i />
            <i />
          </p>
        </div>
        <div data-piece className={styles.publish}>
          Your content, ready to go. <span>Publish ↗</span>
        </div>
      </div>
    )
  if (active === 4)
    return (
      <div className={styles.search}>
        <span className={styles.searchQuery} data-piece>
          ⌕ &nbsp; The service your customer needs
        </span>
        <div data-piece>
          <small>YOUR BUSINESS / SERVICES</small>
          <strong>A clear answer, ready to discover.</strong>
          <p>Useful service content. Descriptive titles. An understandable next step.</p>
        </div>
        <div className={styles.searchTags} data-piece>
          <span>Semantic HTML</span>
          <span>Metadata</span>
          <span>Structured data</span>
        </div>
        <p className={styles.artifactNote}>Search foundations. No ranking promises.</p>
      </div>
    )
  if (active === 5)
    return (
      <div className={styles.release}>
        <span className={styles.label}>LAUNCH / REVIEW CHECKLIST</span>
        {['Mobile journeys', 'Forms & integrations', 'Content & discovery', 'Handover'].map(
          (item) => (
            <div data-piece key={item}>
              <span>{item}</span>
              <b>✓</b>
            </div>
          )
        )}
        <strong data-piece>Built. Checked. Ready.</strong>
      </div>
    )
  return (
    <div className={styles.responsive}>
      <div className={styles.miniBrowser} data-piece>
        <small>
          ● ● ● <span>YOUR WEBSITE</span>
        </small>
        <strong>
          Room for
          <br />
          what&apos;s next.
        </strong>
        <div className={styles.photoBlocks}>
          <i />
          <i />
        </div>
        <span className={styles.pill}>Let&apos;s talk ↗</span>
      </div>
      <div className={styles.miniPhone} data-piece>
        <small>YOUR BRAND</small>
        <strong>
          Room for
          <br />
          what&apos;s next.
        </strong>
        <i />
        <span>Let&apos;s talk ↗</span>
      </div>
      <p className={styles.artifactNote}>One experience. Every screen.</p>
    </div>
  )
}

function SoftwareArtifact({ active }: { active: number }) {
  if (active === 2 || active === 3)
    return (
      <div className={styles.integration}>
        <div data-piece className={styles.tool}>
          CRM<span>Customer records</span>
        </div>
        <div className={styles.connection} data-piece>
          ↓
        </div>
        <div data-piece className={styles.hub}>
          {active === 3 ? 'Staged migration' : 'Integration layer'}
          <span>{active === 3 ? 'Map → validate → transfer' : 'Validate → transform → sync'}</span>
        </div>
        <div className={styles.connection} data-piece>
          ↓
        </div>
        <div className={styles.toolPair} data-piece>
          <span>{active === 3 ? 'Existing system' : 'Customer portal'}</span>
          <span>{active === 3 ? 'New application' : 'Operations'}</span>
        </div>
      </div>
    )
  if (active === 4)
    return (
      <div className={styles.mobileProduct}>
        <div className={styles.appPhone} data-piece>
          <small>FIELD / TODAY</small>
          <strong>
            Your next
            <br />
            assignment.
          </strong>
          <div>
            Site visit<span>Ready to start</span>
          </div>
          <div>
            Inspection<span>Review checklist</span>
          </div>
          <b>Open assignment ↗</b>
        </div>
        <div className={styles.mobileNotes}>
          <span data-piece>01 / Core journey</span>
          <span data-piece>02 / Real user feedback</span>
          <span data-piece>03 / Focused first release</span>
        </div>
      </div>
    )
  return (
    <div className={styles.product}>
      <div className={styles.productNav}>
        IQ / {active === 5 ? 'RELEASE BOARD' : active === 1 ? 'OPERATIONS' : 'CLIENT PORTAL'}
        <span>AM</span>
      </div>
      <strong data-piece>
        {active === 5
          ? 'The next useful release.'
          : active === 1
            ? 'One view of the work.'
            : 'Welcome to your workspace.'}
      </strong>
      <div className={styles.kanban}>
        {(active === 5
          ? ['Feedback', 'In progress', 'Ready to review']
          : ['New requests', 'In review', 'Complete']
        ).map((label, i) => (
          <div key={label} data-piece>
            <small>{label}</small>
            <article>
              <span className={styles.ticketLine} />
              <b>
                {active === 5
                  ? ['Simplify intake', 'Improve search', 'Team review'][i]
                  : ['Project enquiry', 'Document check', 'Approved request'][i]}
              </b>
              <p>
                {['Assigned to your team', 'The next action is clear', 'Recorded and traceable'][i]}
              </p>
              <span className={styles.avatar}>{['JD', 'AM', '✓'][i]}</span>
            </article>
          </div>
        ))}
      </div>
      <span className={styles.productFoot} data-piece>
        People, records, and next actions. Connected.
      </span>
    </div>
  )
}

function AIArtifact({ active }: { active: number }) {
  return (
    <div className={styles.aiCanvas}>
      <div className={styles.inputDoc} data-piece>
        <small>INPUT / APPROVED SOURCE</small>
        <strong>{AI_INPUTS[active]}</strong>
        <i />
        <i />
        <span>
          {active === 2
            ? 'Invoice • Supplier • Total'
            : active === 1
              ? 'Approved business knowledge'
              : 'Information with its context'}
        </span>
      </div>
      <div className={styles.aiBridge} data-piece>
        <span>↓</span>
        <strong>
          {active === 5
            ? 'Value × feasibility × risk'
            : active === 1
              ? 'Find relevant source material'
              : 'Extract · classify · check'}
        </strong>
        <span>↓</span>
      </div>
      <div className={styles.aiResults}>
        <div data-piece>
          <small>USEFUL OUTPUT</small>
          <strong>{AI_OUTPUTS[active]}</strong>
          <span>Ready for the next step ↗</span>
        </div>
        <div data-piece>
          <small>CONTROL POINT</small>
          <strong>Human review</strong>
          <span>Exceptions stay visible ◎</span>
        </div>
      </div>
    </div>
  )
}
