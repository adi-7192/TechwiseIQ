import { SERVICES } from '@/data/services'
import s from './Illustrations.module.css'

/*
 * Home illustrations (13.1, D-045): the hero orbit and one feature space per
 * service chapter. Static DOM + small inline SVG, tokens only. Every mock with a
 * word carries a visible "Illustrative" tag; every word comes from services.ts.
 *
 * Motion hooks for HomeMotion (frontend-specialist, spec §9):
 *   [data-orbit-slot="1".."5"] scroll depth · [data-orbit-card] pointer depth
 *   [data-feature-space] trigger · [data-feature-card] · [data-artifact="a1".."a3"]
 * Static tilts are the CSS `rotate` property, so GSAP transforms compose with them.
 */

const { web, software, ai } = SERVICES
const steps = (list: { title: string }[]) => list.map((step) => step.title)

type Tone = 'ink' | 'muted' | 'acid'

function Tag({ tone }: { tone: Tone }) {
  return (
    <span className={s.tag} data-tone={tone}>
      Illustrative
    </span>
  )
}

/** Checklist / timeline rows: `done` rows filled, then an optional current row, the rest outlined. */
function Steps({ items, done, now = false }: { items: string[]; done: number; now?: boolean }) {
  return (
    <div className={s.steps}>
      {items.map((item, i) => (
        <span key={item} data-state={i < done ? 'done' : i === done && now ? 'now' : 'next'}>
          <i />
          {item}
        </span>
      ))}
    </div>
  )
}

/* ─── Hero orbit: five text-free UI skeletons around the copy ─── */

export function HeroOrbit() {
  return (
    <div className={s.orbit} aria-hidden="true">
      <div className={`${s.slot} ${s.o1}`} data-orbit-slot="1">
        <div className={`${s.card} ${s.site}`} data-orbit-card>
          <span className={s.dots}>
            <i />
            <i />
            <i />
          </span>
          <i className={s.inkBar} />
          <i className={s.inkBar} />
          <i className={s.accentPill} />
          <i className={s.faintLine} />
          <i className={s.faintLine} />
        </div>
      </div>
      <div className={`${s.slot} ${s.o2}`} data-orbit-slot="2">
        <div className={`${s.card} ${s.board}`} data-orbit-card>
          {[3, 2, 3].map((count, col) => (
            <span key={col}>
              {Array.from({ length: count }, (_, i) => (
                <i key={i} data-solid={col === 1 && i === 0 ? '' : undefined} />
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className={`${s.slot} ${s.o3}`} data-orbit-slot="3">
        <div className={`${s.card} ${s.dash}`} data-orbit-card>
          <i />
          <i />
          <i />
          <i />
          <svg viewBox="0 0 100 30" preserveAspectRatio="none">
            <polyline points="0,24 18,20 34,22 50,12 66,15 82,6 100,9" />
          </svg>
        </div>
      </div>
      <div className={`${s.slot} ${s.o4}`} data-orbit-slot="4">
        <div className={`${s.card} ${s.code}`} data-orbit-card>
          <i />
          <i />
          <i />
          <i />
          <i />
          <b />
        </div>
      </div>
      <div className={`${s.slot} ${s.o5}`} data-orbit-slot="5">
        <div className={`${s.card} ${s.flow}`} data-orbit-card>
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  )
}

/* ─── Feature spaces: one large card + 2–3 tilted artifacts per chapter ─── */

const LABELS = {
  web: 'Illustrative example: a website page with a call to action, a phone preview, a search result and a launch checklist',
  software:
    'Illustrative example: an internal dashboard, a phone app, connected tools and a weekly build timeline',
  ai: 'Illustrative example: an automation that reads email and documents, extracts the data and prepares a report while a person reviews it, plus an assistant chat, inbox sorting and a pilot plan',
} as const

export type FeatureKind = keyof typeof LABELS

export function FeatureSpace({ kind }: { kind: FeatureKind }) {
  return (
    <div
      className={s.featureSpace}
      role="img"
      aria-label={LABELS[kind]}
      data-illustration={kind}
      data-feature-space
      data-home-reveal
    >
      {kind === 'web' ? <WebMocks /> : kind === 'software' ? <SoftwareMocks /> : <AiMocks />}
    </div>
  )
}

function WebMocks() {
  return (
    <>
      <div className={`${s.featureCard} ${s.webCard}`} aria-hidden="true" data-feature-card>
        <div className={s.screen}>
          <div className={s.chrome}>
            <span className={s.dots}>
              <i />
              <i />
              <i />
            </span>
            <span className={s.sample}>Sample</span>
            <Tag tone="acid" />
          </div>
          <div className={s.webBody}>
            <div className={s.webCopy}>
              <i className={s.headBar} />
              <i className={s.headBar} />
              <i className={s.faintLine} />
              <i className={s.faintLine} />
              <i className={s.faintLine} />
              <span className={s.cta}>
                {web.fitSignals[2]} <span>→</span>
              </span>
            </div>
            <div className={s.artTile}>
              <svg viewBox="0 0 100 100">
                <circle className={s.orbitRing} cx="56" cy="44" r="40" />
                <circle className={s.disc} cx="50" cy="50" r="38" />
                <circle className={s.ring} cx="50" cy="50" r="24" />
                <circle className={s.hole} cx="50" cy="50" r="14" />
              </svg>
            </div>
          </div>
          <div className={s.webTiles}>
            {web.capabilities.slice(0, 3).map((capability) => (
              <span key={capability.title}>
                <i />
                {capability.title}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className={`${s.artifact} ${s.a1} ${s.phone} ${s.paper}`} aria-hidden="true" data-artifact="a1">
        <i className={s.notch} />
        <i className={s.photo} />
        <i className={s.inkBar} />
        <i className={s.inkBar} />
        <i className={s.faintInk} />
        <i className={s.faintInk} />
        <span className={s.chip}>{web.fitSignals[0]}</span>
        <Tag tone="ink" />
      </div>
      <div className={`${s.artifact} ${s.a2} ${s.surface}`} aria-hidden="true" data-artifact="a2">
        <span className={s.artTitle}>{web.capabilities[4].title}</span>
        <span className={s.result}>
          <i className={s.linkBar} />
          <i className={s.faintLine} />
          <i className={s.faintLine} />
        </span>
        <span className={s.chip}>{web.fitSignals[3]}</span>
        <Tag tone="muted" />
      </div>
      <div className={`${s.artifact} ${s.a3} ${s.paper} ${s.check}`} aria-hidden="true" data-artifact="a3">
        <Steps items={steps(web.process)} done={3} />
        <Tag tone="ink" />
      </div>
    </>
  )
}

function SoftwareMocks() {
  return (
    <>
      <div className={`${s.featureCard} ${s.swCard}`} aria-hidden="true" data-feature-card>
        <div className={s.screen}>
          <div className={s.sidebar}>
            <span className={s.sample}>Sample</span>
            {software.fitSignals.map((signal, i) => (
              <span key={signal} data-active={i === 1 ? '' : undefined}>
                {signal}
              </span>
            ))}
          </div>
          <div className={s.swMain}>
            <div className={s.swHead}>
              <span className={s.artTitle}>{software.capabilities[1].title}</span>
              <Tag tone="ink" />
            </div>
            <div className={s.swTiles}>
              <span className={s.bars}>
                {[46, 70, 38, 88, 60, 76].map((h) => (
                  <i key={h} style={{ height: `${h}%` }} />
                ))}
              </span>
              <span className={s.ringTile}>
                <svg viewBox="0 0 40 40">
                  <circle className={s.track} cx="20" cy="20" r="14" />
                  <circle className={s.arc} cx="20" cy="20" r="14" pathLength="100" />
                </svg>
              </span>
            </div>
            <div className={s.queue}>
              {['filled', 'outlined', 'quiet'].map((status) => (
                <span key={status}>
                  <i className={s.avatar} />
                  <i className={s.skel} />
                  <i className={s.skel} />
                  <i className={s.status} data-status={status} />
                </span>
              ))}
            </div>
            <svg className={s.strip} viewBox="0 0 200 30" preserveAspectRatio="none">
              <path className={s.grid} d="M0 10H200M0 20H200M50 0V30M100 0V30M150 0V30" />
              <polyline points="0,24 25,20 50,22 75,13 100,16 125,9 150,12 175,5 200,8" />
            </svg>
          </div>
        </div>
      </div>
      <div className={`${s.artifact} ${s.a1} ${s.phone} ${s.ink}`} aria-hidden="true" data-artifact="a1">
        <span className={s.appHead}>
          <i />
        </span>
        <i className={s.paperRow} />
        <i className={s.paperRow} />
        <i className={s.paperRow} />
        <i className={s.photo} />
        <span className={s.artTitle}>{software.capabilities[4].title}</span>
        <Tag tone="muted" />
      </div>
      <div className={`${s.artifact} ${s.a2} ${s.paper}`} aria-hidden="true" data-artifact="a2">
        <span className={s.artTitle}>{software.capabilities[2].title}</span>
        <svg className={s.connect} viewBox="0 0 120 64">
          <path className={s.wire} d="M30 12C60 12 60 32 92 32M30 32H92M30 52C60 52 60 32 92 32" />
          <rect x="6" y="2" width="20" height="20" />
          <rect x="6" y="22" width="20" height="20" />
          <rect x="6" y="42" width="20" height="20" />
          <path className={s.glyph} d="M11 7h10v10H11zM16 27a5 5 0 1 1 0 10a5 5 0 1 1 0-10zM16 46l5.5 10h-11z" />
          <circle className={s.hub} cx="102" cy="32" r="10" />
        </svg>
        <Tag tone="ink" />
      </div>
      <div className={`${s.artifact} ${s.a3} ${s.surface}`} aria-hidden="true" data-artifact="a3">
        <Steps items={steps(software.process)} done={2} now />
        <Tag tone="muted" />
      </div>
    </>
  )
}

function AiMocks() {
  return (
    <>
      <div className={`${s.featureCard} ${s.aiCard}`} aria-hidden="true" data-feature-card>
        <div className={s.screen}>
          <div className={s.swHead}>
            <span className={s.artTitle}>{ai.capabilities[0].title}</span>
            <Tag tone="muted" />
          </div>
          <div className={s.flowArea}>
            <svg className={s.wires} viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M27 23C31 23 30 30 34 30M27 59C31 59 30 46 34 46M66 37H74M50 64V72" />
            </svg>
            <i className={s.signal} style={{ left: '30.5%', top: '26.5%' }} />
            <i className={s.signal} style={{ left: '30.5%', top: '52.5%' }} />
            <i className={s.signal} style={{ left: '70%', top: '37%' }} />
            <span className={`${s.node} ${s.in1}`}>
              <svg viewBox="0 0 24 24">
                <path d="M3 6h18v12H3zM3 6l9 7 9-7" />
              </svg>
              {ai.fitSignals[1]}
            </span>
            <span className={`${s.node} ${s.in2}`}>
              <svg viewBox="0 0 24 24">
                <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6" />
              </svg>
              {ai.fitSignals[0]}
            </span>
            <span className={s.core}>
              <span className={s.corePill}>{ai.capabilities[2].title}</span>
              <i />
              <i />
              <i />
            </span>
            <span className={`${s.node} ${s.out}`}>
              {ai.capabilities[4].title}
              <span className={s.mini}>
                <i />
                <i />
                <i />
                <i />
              </span>
            </span>
            <span className={s.review}>
              <svg viewBox="0 0 24 24">
                <path d="M12 4a4 4 0 1 1 0 8a4 4 0 1 1 0-8zM4 21c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              <i data-toggle="on" />
              <i data-toggle="off" />
            </span>
          </div>
        </div>
      </div>
      <div className={`${s.artifact} ${s.a1} ${s.paper}`} aria-hidden="true" data-artifact="a1">
        <span className={s.artTitle}>{ai.capabilities[1].title}</span>
        <span className={s.bubbleIn}>
          <i />
          <i />
        </span>
        <span className={s.bubbleOut}>
          <i />
          <i />
        </span>
        <Tag tone="ink" />
      </div>
      <div className={`${s.artifact} ${s.a2} ${s.surface}`} aria-hidden="true" data-artifact="a2">
        <span className={s.artTitle}>{ai.capabilities[3].title}</span>
        {['filled', 'outlined', 'quiet'].map((label) => (
          <span key={label} className={s.mail}>
            <svg viewBox="0 0 24 24">
              <path d="M3 6h18v12H3zM3 6l9 7 9-7" />
            </svg>
            <i className={s.skel} />
            <i className={s.label} data-status={label} />
          </span>
        ))}
        <Tag tone="muted" />
      </div>
      <div className={`${s.artifact} ${s.a3} ${s.paper}`} aria-hidden="true" data-artifact="a3">
        <Steps items={steps(ai.process)} done={2} now />
        <Tag tone="ink" />
      </div>
    </>
  )
}
