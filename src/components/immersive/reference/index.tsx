import type { CSSProperties, ReactNode } from 'react'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { HeroOrbit } from '@/components/immersive/home/Illustrations'
import styles from './reference.module.css'

/*
 * Inner-page building blocks in Home's reference grammar (Stage 14, D-045/D-046).
 * Skill: .claude/skills/reference-redesign/SKILL.md. Server components only;
 * float comes from DepthMotion (`data-depth` on opaque panels), the hero
 * entrance is CSS, and the pill nav's active state is in PillNav.tsx.
 */

export { styles as refStyles }
export { default as PillNav } from './PillNav'

type Cta = { href: string; label: string; external?: boolean }

const ACCENT = {
  acid: 'var(--tw-acid)',
  orange: 'var(--tw-orange)',
  violet: 'color-mix(in srgb, var(--tw-violet) 88%, var(--tw-fg))',
  blue: 'var(--tw-blue)',
} as const
export type Accent = keyof typeof ACCENT
const accentStyle = (accent?: Accent) =>
  accent ? ({ '--tw-accent': ACCENT[accent] } as CSSProperties) : undefined

/** Centred hero: eyebrow, line + ghost line, lead, up to two pills, optional orbit. */
export function RefHero({
  id = 'top',
  eyebrow,
  line,
  ghost,
  lead,
  primary,
  secondary,
  orbit = false,
  crumb,
  compact = false,
  children,
}: {
  id?: string
  /** No viewport min-height: for pages whose job (a form, an article) starts right below. */
  compact?: boolean
  eyebrow?: string
  /** Replaces the eyebrow (e.g. a breadcrumb nav). */
  crumb?: ReactNode
  line: ReactNode
  ghost?: ReactNode
  lead?: ReactNode
  primary?: Cta
  secondary?: Cta
  orbit?: boolean
  /** Rendered under the actions (e.g. a fact strip). */
  children?: ReactNode
}) {
  return (
    <section
      id={id}
      className={styles.hero}
      data-compact={compact || undefined}
      aria-labelledby={`${id}-title`}
    >
      <div className={styles.stage}>
        {orbit ? <HeroOrbit /> : <span hidden />}
        <div className={styles.eyebrow} data-ref-support>
          {crumb ?? <SectionLabel hideMark>{eyebrow}</SectionLabel>}
        </div>
        <h1 id={`${id}-title`} className={styles.title}>
          <span className={styles.line}>
            <span data-ref-line>{line}</span>
          </span>
          {ghost && (
            <>
              {' '}
              <span className={styles.line}>
                <span className={styles.ghost} data-ref-line>
                  {ghost}
                </span>
              </span>
            </>
          )}
        </h1>
        {lead && (
          <p className={styles.lead} data-ref-support>
            {lead}
          </p>
        )}
        {(primary || secondary) && (
          <div className={styles.actions} data-ref-support>
            {primary && (
              <PrimaryCTA href={primary.href} external={primary.external}>
                {primary.label}
              </PrimaryCTA>
            )}
            {secondary && (
              <PrimaryCTA href={secondary.href} variant="secondary" external={secondary.external}>
                {secondary.label}
              </PrimaryCTA>
            )}
          </div>
        )}
        {children && (
          <div className={styles.heroExtra} data-ref-support>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}

/** 3-col intro: small count / giant statement with ghost half / muted aside. */
export function RefIntro({
  id,
  count,
  line,
  ghost,
  aside,
  testId,
  children,
}: {
  id: string
  count: string
  line: ReactNode
  ghost?: ReactNode
  aside?: ReactNode
  testId?: string
  children?: ReactNode
}) {
  return (
    <section
      id={id}
      className={styles.section}
      aria-labelledby={`${id}-title`}
      data-testid={testId}
    >
      <div className={`tw-wrap ${styles.introGrid}`}>
        <SectionLabel hideMark className={styles.introCount}>
          {count}
        </SectionLabel>
        <h2 id={`${id}-title`} className={styles.introTitle}>
          <span>{line}</span> {ghost && <span className={styles.ghost}>{ghost}</span>}
        </h2>
        {aside ? <div className={styles.introAside}>{aside}</div> : <span />}
      </div>
      {children && <div className="tw-wrap">{children}</div>}
    </section>
  )
}

/** Chapter: count + giant one-word title with accent dot, thesis set right, then children. */
export function Chapter({
  id,
  count,
  word,
  title,
  body,
  cta,
  accent,
  children,
  tight = false,
  testId,
}: {
  id: string
  count: string
  word: string
  title: ReactNode
  body?: ReactNode
  cta?: Cta
  accent?: Accent
  children?: ReactNode
  tight?: boolean
  testId?: string
}) {
  return (
    <section
      id={id}
      className={styles.section}
      data-tight={tight || undefined}
      data-testid={testId}
      style={accentStyle(accent)}
      aria-labelledby={`${id}-title`}
    >
      <div className="tw-wrap">
        <div className={styles.chapterHead}>
          <div>
            <SectionLabel hideMark className={styles.count}>
              {count}
            </SectionLabel>
            <h2 id={`${id}-title`} className={styles.word}>
              {word}
              <span className={styles.dot} aria-hidden="true" />
            </h2>
          </div>
          <div className={styles.thesis}>
            <h3 className={styles.thesisHead}>{title}</h3>
            {body && <div className={styles.thesisBody}>{body}</div>}
            {cta && (
              <PrimaryCTA href={cta.href} variant="ghost" className={styles.thesisLink}>
                {cta.label}
              </PrimaryCTA>
            )}
          </div>
        </div>
        {children && <div className={styles.chapterBody}>{children}</div>}
      </div>
    </section>
  )
}

export type CapItem = { label?: string; title: ReactNode; body?: ReactNode }

/** Hairline-ruled grid. Labels default to 01, 02, … */
export function CapabilityGrid({
  items,
  cols = 3,
  className,
  testId,
  ariaLabel,
}: {
  items: CapItem[]
  cols?: 2 | 3 | 4
  className?: string
  testId?: string
  ariaLabel?: string
}) {
  return (
    <ol
      data-testid={testId}
      aria-label={ariaLabel}
      className={`${styles.capGrid} ${className ?? ''}`}
      data-cols={cols === 3 ? undefined : cols}
      style={{ '--cols': cols } as CSSProperties}
    >
      {items.map((item, i) => (
        <li className={styles.cap} key={i}>
          <span className={styles.capIndex}>
            <i aria-hidden="true" />
            {item.label ?? String(i + 1).padStart(2, '0')}
          </span>
          <h4 className={styles.capHead}>{item.title}</h4>
          {item.body && <p className={styles.capBody}>{item.body}</p>}
        </li>
      ))}
    </ol>
  )
}

/** Opaque surface that floats over the checkered backdrop (DepthMotion). */
export function Panel({
  children,
  depth = 20,
  className,
}: {
  children: ReactNode
  depth?: number
  className?: string
}) {
  return (
    <div className={`${styles.panel} ${className ?? ''}`} data-depth={depth}>
      {children}
    </div>
  )
}
