/*
 * /about (D-041). Server-rendered in its FINAL state: totals final, checks and
 * the route line drawn, every word lit, all four process frames stacked.
 * Motion (AboutMotion, frontend-specialist) only ever animates FROM a start
 * state back to this markup. Hooks it can rely on:
 *
 *   [data-about-experience]   root. data-about-motion="static" from the server
 *                             (suppressHydrationWarning: the inline bootstrap may
 *                             flip it to "pending" before hydration). States:
 *                             static | pending | active | reduced. Pending CSS
 *                             (opacity only, never visibility) lives in the CSS module.
 *   [data-about-reveal]       once-reveal targets: 01 body, 02 head copy, totals dl,
 *                             each card, 03 step text + frame, 04 head + rows,
 *                             05 head + rows, CTA. Never the hero, never the 01 h2.
 *   [data-lit-word]           01 h2 word spans (inline, literal spaces between them).
 *   [data-totals] [data-count] totals dl; data-count holds the final value, the span
 *                             its text, with an sr-only sibling (final) that is never mutated.
 *   [data-route-map] [data-map-remote]  map figure; remote-country node groups.
 *   [data-draw]               stroke paths with pathLength="1" (route line, all checks).
 *   [data-card] [data-cover-depth]  cards; the cover wrapper that may drift (the img
 *                             keeps its own CSS hover scale).
 *   [data-process] [data-process-stage]  03 section / the element to pin. Set
 *                             data-process-pinned on [data-process] for the pinned
 *                             layout (CSS is ready); remove it to fall back to stacked.
 *   [data-step] [data-step-text] [data-step-frame]  03 items (+ optional data-step-active).
 *   [data-rail] [data-rail-fill] [data-rail-node]  03 progress rail (aria-hidden,
 *                             display: none unless pinned).
 *   [data-commitment="D-0xx"] 04 rows.  [data-path]  05 rows.
 */
import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PillNav } from '@/components/immersive/reference'
import BrowserBar from '@/components/BrowserBar'
import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { CASE_STUDIES } from '@/data/case-studies'
import {
  getClientCountries,
  getDeliveryMetrics,
  getProjectStatus,
  partitionProjects,
} from '@/app/work/work-projects'
import { cn } from '@/lib/utils'
import type { CaseStudy } from '@/types'
import {
  COMMITMENTS,
  COMMITMENTS_HEAD,
  CTA,
  EXPERTISE_PATHS,
  FACTS,
  HERO,
  PATHS_HEAD,
  PROCESS,
  SHORT,
  STEPS,
  TRACK,
} from './about-content'
import AboutMotion from './AboutMotion'
import styles from './AboutExperience.module.css'

// Runs while the parser is inside the root (placed right after the hero, before
// the first gated hook), so the reveals' start frame is in effect at first paint
// (Home's motionBootstrap). Client navigations don't re-run inline scripts;
// AboutMotion's layout effect covers that, before paint too.
// Fails open: reduced motion never arms it, and a bundle that never boots gets the
// content back after 3s. The hero carries no gated hooks, so it never waits.
const motionBootstrap = `(function(){try{var e=document.currentScript.parentElement;if(!e||matchMedia('(prefers-reduced-motion: reduce)').matches)return;e.dataset.aboutMotion='pending';setTimeout(function(){if(e.dataset.aboutMotion==='pending')e.dataset.aboutMotion='static'},3000)}catch(err){}})()`

const index = (i: number) => String(i + 1).padStart(2, '0')
/** "3–5" reads as "3 to 5" for screen readers. */
const spoken = (value: string) => value.replace('–', ' to ')
const builds = (count: number) => `${count} build${count === 1 ? '' : 's'}`

/** Stroke styling lives in .check (CSS), not repeated as attributes on all 15 instances. */
function CheckMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" className={styles.check}>
      <path data-draw pathLength="1" d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  )
}

function LitWords({ text }: { text: string }) {
  return text.split(' ').map((word, i) => (
    <Fragment key={i}>
      {i > 0 && ' '}
      <span data-lit-word>{word}</span>
    </Fragment>
  ))
}

/** Schematic, not geography. Remote countries without a position appear in the caption only. */
const HOME_COUNTRY = 'UAE'
const REMOTE: Record<string, { x: number; y: number }> = { India: { x: 318, y: 60 } }

function RouteMap({ countries }: { countries: { country: string; count: number }[] }) {
  const home = countries.find((c) => c.country === HOME_COUNTRY)
  return (
    <svg viewBox="0 0 360 200" aria-hidden="true" focusable="false" className={styles.map}>
      {/* One path, not a <g> of 8 <line>s: same grid, 8 fewer DOM nodes. */}
      <path className={styles.graticule} d="M0 50H360M0 100H360M0 150H360M60 0V200M120 0V200M180 0V200M240 0V200M300 0V200" />
      <rect className={styles.zone} x="30" y="84" width="150" height="86" />
      {home && <text x="38" y="160">{`${home.country} · ${builds(home.count)}`}</text>}
      <rect className={styles.hub} x="150" y="112" width="8" height="8" />
      <text x="142" y="120" textAnchor="end" className={styles.hubLabel}>{TRACK.hub}</text>
      {countries.filter((c) => REMOTE[c.country]).map(({ country, count }) => {
        const { x, y } = REMOTE[country]
        return (
          <Fragment key={country}>
            <path data-draw pathLength="1" className={styles.route} d={`M160 112 C 200 40, 260 30, ${x - 5} ${y - 1}`} />
            <g data-map-remote>
              <rect className={styles.node} x={x - 3.5} y={y - 3.5} width="7" height="7" />
              <text x={x + 34} y={y + 24} textAnchor="end">{`${country} · ${builds(count)}`}</text>
            </g>
          </Fragment>
        )
      })}
    </svg>
  )
}

function Card({ cs, variant }: { cs: CaseStudy; variant: 'lead' | 'side' | 'compact' }) {
  const url = cs.liveUrl ?? cs.previewUrl
  const status = getProjectStatus(cs)
  const sizes = {
    lead: '(max-width: 1023px) 100vw, 60vw',
    side: '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 30vw',
    compact: '(max-width: 767px) 100vw, 25vw',
  }[variant]
  return (
    <li className={styles[variant]}>
      <article className={styles.card} data-card data-about-reveal>
        {/* Pointer shortcut only; the text link below is the accessible one (/work pattern). */}
        <Link href={`/work/${cs.slug}`} className={cn(styles.coverLink, cs.liveUrl && styles.coverLive)} tabIndex={-1} aria-hidden="true">
          {url && <BrowserBar label={new URL(url).hostname.replace(/^www\./, '')} />}
          <div className={styles.shot}>
            <div className={styles.depth} data-cover-depth>
              {cs.coverImage && (
                <Image src={cs.coverImage} alt={`${cs.title} website preview`} fill sizes={sizes} loading="lazy" className={styles.coverImage} />
              )}
            </div>
          </div>
        </Link>
        <div className={styles.cardBody}>
          <h3 className={styles.cardTitle}>{cs.title}</h3>
          <div className={styles.cardMeta}>
            <p className={cn(styles.chip, cs.liveUrl && styles.chipLive)} data-project-status={status.toLowerCase().replaceAll(' ', '-')}>
              {status}
            </p>
            <p>{cs.industry.replaceAll(' / ', ' · ')}</p>
          </div>
          <Link href={`/work/${cs.slug}`} className={styles.textLink}>
            {TRACK.cardLink}
            <span className="sr-only"> for {cs.title}</span> <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>
    </li>
  )
}

function Frame({ id, step }: { id: string; step: (typeof STEPS)[number] }) {
  const { content } = step
  return (
    <figure className={styles.frame} aria-labelledby={`${id}-title ${id}-tag`} data-step-frame data-about-reveal>
      <div className={styles.frameBar}>
        <span id={`${id}-title`}>{step.frame}</span>
        <span id={`${id}-tag`} className={styles.tag}>{PROCESS.tag}</span>
      </div>
      <div className={styles.frameBody}>
        {content.kind === 'fields' && (
          <>
            <dl className={styles.fields}>
              {content.rows.map(([term, value]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            {content.approved && (
              <p className={styles.approved}>
                {PROCESS.approved} <CheckMark />
              </p>
            )}
          </>
        )}
        {content.kind === 'options' && (
          <>
            <ul className={styles.options}>
              {content.options.map((option) => (
                <li key={option.key} className={option.pick ? styles.pick : undefined}>
                  <b>{option.key}</b> <span>{option.text}</span>{' '}
                  {option.pick && <span className={styles.pickTag}>{PROCESS.pickTag}</span>}
                </li>
              ))}
            </ul>
            <p className={styles.why}>
              <b>{content.why[0]}:</b> {content.why[1]}
            </p>
          </>
        )}
        {content.kind === 'log' && (
          <ul className={styles.log}>
            {content.rows.map((row) => (
              <li key={row}>
                <CheckMark /> {row}
              </li>
            ))}
          </ul>
        )}
      </div>
      <figcaption className={styles.frameCaption}>{PROCESS.caption}</figcaption>
    </figure>
  )
}

const NAV = [
  ['short-version', 'Short version'],
  ['track-record', 'Track record'],
  ['process', 'Process'],
  ['commitments', 'Commitments'],
  ['services', 'Services'],
] as const

export default function AboutExperience() {
  const totals = getDeliveryMetrics(CASE_STUDIES)
  const [liveSites, , weeks] = totals
  const countries = getClientCountries(CASE_STUDIES)
  const countryNames = countries.map((c) => c.country)
  const { featured, remaining } = partitionProjects(CASE_STUDIES)
  const facts: readonly (readonly [string, string])[] = [
    FACTS.based,
    FACTS.build,
    [FACTS.clients, countryNames.join('\u00a0· ')],
    ...(liveSites ? [[FACTS.liveSites, liveSites.value] as const] : []),
    ...(weeks ? [[FACTS.speed, `${weeks.value} weeks`] as const] : []),
    FACTS.reply,
  ]

  return (
    // The inline motion bootstrap may set data-about-motion before hydration (Home pattern).
    <div className={styles.experience} data-about-experience data-about-motion="static" data-testid="about-experience" suppressHydrationWarning>
      <AboutMotion />
      {/* 00 Hero + fact sheet: never gated or animated. */}
      <Section as="section" density="flush" className={styles.hero} innerClassName={styles.heroGrid} aria-labelledby="about-title">
        <SectionLabel className={styles.heroLabel}>{HERO.label}</SectionLabel>
        <DisplayHeading as="h1" id="about-title" size="chapter" className={styles.heroTitle}>
          {HERO.title} <em>{HERO.titleAccent}</em>
        </DisplayHeading>
        <p className={styles.lede}>
          {HERO.ledeStart} <strong>{HERO.ledeStrong}</strong>.
        </p>
        <p className={styles.promise}>{HERO.promise}</p>
        <div className={styles.facts}>
          <SectionLabel>{FACTS.label}</SectionLabel>
          <dl aria-label="Company facts" className={styles.factList}>
            {facts.map(([term, value]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>
                  {value.includes('–') ? (
                    <>
                      <span className="sr-only">{spoken(value)}</span>
                      <span aria-hidden="true">{value}</span>
                    </>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>
      {/* After the hero, not before it: an inline script stops the parser, and Chrome
          paints what it has. Here that first paint already holds the h1 (the LCP),
          and the script still runs before the first gated hook is parsed. */}
      <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      {/* After the hero, like Home's, so it is early in the tab order. */}
      <PillNav items={NAV} />

      {/* 01 The short version */}
      <Section as="section" id="short-version" ruled density="sparse" className={styles.short} innerClassName={styles.shortGrid} aria-labelledby="short-version-title">
        <SectionLabel index="01">{SHORT.label}</SectionLabel>
        <DisplayHeading id="short-version-title" size="statement" className={styles.shortTitle}>
          <LitWords text={SHORT.title} />{' '}
          <em>
            <LitWords text={SHORT.titleAccent} />
          </em>
        </DisplayHeading>
        <div className={styles.shortBody} data-about-reveal>
          <p>{SHORT.body}</p>
          <p className={styles.closing}>{SHORT.closing}</p>
        </div>
      </Section>

      {/* 02 Track record */}
      <Section as="section" id="track-record" ruled density="dense" className={styles.track} aria-labelledby="track-record-title">
        <div className={styles.trackHead}>
          <div className={styles.trackCopy} data-about-reveal>
            <SectionLabel index="02">{TRACK.label}</SectionLabel>
            <DisplayHeading id="track-record-title" size="h2" className={styles.sectionTitle}>
              {TRACK.title} <em>{TRACK.titleAccent}</em>
            </DisplayHeading>
            <p className={styles.intro}>{TRACK.intro}</p>
          </div>
          <figure className={styles.mapFigure} data-route-map>
            <RouteMap countries={countries} />
            <p className="sr-only">{countries.map((c) => `${c.country}: ${builds(c.count)}.`).join(' ')}</p>
            <figcaption className={styles.mapCaption}>{TRACK.caption(countryNames)}</figcaption>
          </figure>
        </div>

        {totals.length > 0 && (
          <dl aria-label="Live client work totals" className={styles.totals} data-totals data-about-reveal>
            {totals.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>
                  <span className="sr-only">{spoken(metric.value)}</span>
                  <span aria-hidden="true" data-count={metric.value}>{metric.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        )}

        <ul role="list" className={styles.cards}>
          {featured.map((cs, i) => <Card key={cs.slug} cs={cs} variant={i === 0 ? 'lead' : 'side'} />)}
          {remaining.map((cs) => <Card key={cs.slug} cs={cs} variant="compact" />)}
        </ul>
      </Section>

      {/* 03 How we work with you: the pinned showpiece on desktop (AboutMotion) */}
      <Section as="section" id="process" ruled density="sparse" className={styles.process} aria-labelledby="process-title" data-process>
        <div className={styles.processStage} data-process-stage>
          <div className={styles.processHead}>
            <SectionLabel index="03">{PROCESS.label}</SectionLabel>
            <DisplayHeading id="process-title" size="statement" className={styles.sectionTitle}>
              {PROCESS.title} <em>{PROCESS.titleAccent}</em>
            </DisplayHeading>
            <p className={styles.intro}>{PROCESS.intro}</p>
            <p className={styles.sample}>{PROCESS.sample}</p>
          </div>
          <div className={styles.rail} aria-hidden="true" data-rail>
            <span className={styles.railFill} data-rail-fill />
            {STEPS.map((step, i) => (
              <span key={step.frame} className={styles.railNode} data-rail-node>
                {index(i)}
                <span className={styles.railBox}>
                  <CheckMark />
                </span>
              </span>
            ))}
          </div>
          <ol className={styles.steps}>
            {STEPS.map((step, i) => (
              <li key={step.frame} className={styles.step} data-step>
                <div className={styles.stepText} data-step-text data-about-reveal>
                  <span className={styles.stepIndex} aria-hidden="true">{index(i)}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
                <Frame id={`frame-${i + 1}`} step={step} />
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 04 What we commit to */}
      <Section as="section" id="commitments" ruled density="dense" className={styles.commitments} innerClassName={styles.commitGrid} aria-labelledby="commitments-title">
        <div className={styles.commitHead} data-about-reveal>
          <SectionLabel index="04">{COMMITMENTS_HEAD.label}</SectionLabel>
          <DisplayHeading id="commitments-title" size="h2" className={styles.sectionTitle}>
            {COMMITMENTS_HEAD.title} <em>{COMMITMENTS_HEAD.titleAccent}</em>
          </DisplayHeading>
        </div>
        <ul className={styles.ledger}>
          {COMMITMENTS.map((row) => (
            <li key={row.statement} data-commitment={row.id} data-about-reveal>
              <span className={styles.box}>
                <CheckMark />
              </span>
              <p className={styles.statement}>{row.statement}</p>
              <p className={styles.detail}>{row.detail}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 05 What we build */}
      <Section as="section" id="services" ruled density="sparse" className={styles.services} aria-labelledby="services-title">
        <div data-about-reveal>
          <SectionLabel index="05">{PATHS_HEAD.label}</SectionLabel>
          <DisplayHeading id="services-title" size="statement" className={styles.sectionTitle}>
            {PATHS_HEAD.title} <em>{PATHS_HEAD.titleAccent}</em>
          </DisplayHeading>
        </div>
        <ul className={styles.paths}>
          {EXPERTISE_PATHS.map((path, i) => (
            <li key={path.href} className={styles.path} data-path data-about-reveal>
              <span className={styles.pathIndex} aria-hidden="true">{index(i)}</span>
              <DisplayHeading as="h3" size="h2" className={styles.pathTitle}>
                <Link href={path.href} className={styles.pathLink}>{path.name}</Link>
              </DisplayHeading>
              <dl className={styles.problem}>
                <dt>{PATHS_HEAD.problemLabel}</dt>
                <dd>{path.problem}</dd>
              </dl>
              <span className={styles.pathArrow} aria-hidden="true">→</span>
              <dl className={styles.outcome}>
                <dt>{PATHS_HEAD.outcomeLabel}</dt>
                <dd>{path.outcome}</dd>
              </dl>
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA: compact, so the footer stays the page's one big ending */}
      <Section as="section" id="about-cta" ruled density="dense" className={styles.cta} aria-labelledby="about-cta-title">
        <div className={styles.ctaGrid} data-about-reveal>
          <div>
            <SectionLabel>{CTA.label}</SectionLabel>
            <DisplayHeading id="about-cta-title" size="h2" className={styles.ctaTitle}>
              {CTA.title} <em>{CTA.titleAccent}</em>
            </DisplayHeading>
          </div>
          <p className={styles.ctaBody}>{CTA.body}</p>
          <PrimaryCTA href="/contact" className={styles.ctaButton}>
            {CTA.button}
          </PrimaryCTA>
        </div>
      </Section>
    </div>
  )
}
