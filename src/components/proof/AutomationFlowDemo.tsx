import type { ReactNode } from 'react'
import ProofFrame from './ProofFrame'
import styles from './AutomationFlowDemo.module.css'

/* Deterministic sample record — the same output every render, no live model. */
const SAMPLE = {
  input: {
    tag: 'Inbound lead',
    name: 'Dubai Logistics Co.',
    fields: [
      ['Region', 'United Arab Emirates'],
      ['Team size', '40+ people'],
      ['Message', '“Need quotes turned around faster.”'],
    ],
  },
  rules: [
    'Region in service area',
    'Team size ≥ 10',
    'Budget signal present',
    'Not on block list',
  ],
  judgment: [
    ['Intent', 'High'],
    ['Fit', 'Strong'],
    ['Confidence', 'High'],
  ],
  reasons: [
    'Operates across three locations',
    'Quoting handled manually today',
    'Asked for a delivery timeline',
  ],
  actions: ['Route to the founder', 'Draft a first reply', 'Create the CRM record'],
} as const

function Stage({
  index,
  kind,
  title,
  children,
}: {
  index: string
  kind: string
  title: string
  children: ReactNode
}) {
  return (
    <li className={styles.stage}>
      <span className={styles.stageHead}>
        <span className={styles.stageIndex}>{index}</span>
        <span className={styles.stageKind}>{kind}</span>
      </span>
      <p className={styles.stageTitle}>{title}</p>
      {children}
    </li>
  )
}

function Arrow() {
  return (
    <span className={styles.connector} aria-hidden="true">
      →
    </span>
  )
}

type AutomationFlowDemoProps = {
  caption?: string
  className?: string
}

/**
 * AutomationFlowDemo — a deterministic lead-intake pipeline shown as DOM/CSS:
 * sample input → deterministic rules → AI judgment → system action, with an
 * explicit human-review path for the cases that shouldn't auto-resolve. No live
 * model call; the output is fixed sample data with qualitative labels only.
 */
export default function AutomationFlowDemo({
  caption = 'Inputs, rules, model judgment and actions stay explicit — and a person still owns the edge cases.',
  className,
}: AutomationFlowDemoProps) {
  return (
    <ProofFrame
      label="flow / lead-intake"
      caption={caption}
      className={className}
      aria-label="Illustrative automation flow: input, deterministic rules, AI judgment, system action, and human review"
    >
      <ol className={styles.pipeline}>
        <Stage index="01" kind="Input" title="Sample lead">
          <span className={styles.recordTag}>{SAMPLE.input.tag}</span>
          <span className={styles.recordName}>{SAMPLE.input.name}</span>
          <dl className={styles.fields}>
            {SAMPLE.input.fields.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Stage>

        <Arrow />

        <Stage index="02" kind="Deterministic rules" title="Checks that never guess">
          <ul className={styles.rules}>
            {SAMPLE.rules.map((rule) => (
              <li key={rule}>
                <span className={styles.check} aria-hidden="true">
                  ✓
                </span>
                {rule}
              </li>
            ))}
          </ul>
          <span className={styles.rulesFoot}>
            {SAMPLE.rules.length} / {SAMPLE.rules.length} passed → continue
          </span>
        </Stage>

        <Arrow />

        <Stage index="03" kind="AI judgment" title="Classify, don’t decide alone">
          <div className={styles.badges}>
            {SAMPLE.judgment.map(([k, v]) => (
              <span className={styles.badge} key={k}>
                <span className={styles.badgeKey}>{k}</span>
                <span className={styles.badgeVal}>{v}</span>
              </span>
            ))}
          </div>
          <ul className={styles.reasons}>
            {SAMPLE.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Stage>

        <Arrow />

        <Stage index="04" kind="System action" title="Do the repetitive part">
          <ul className={styles.actions}>
            {SAMPLE.actions.map((a) => (
              <li key={a}>
                <span className={styles.dot} aria-hidden="true" />
                {a}
              </li>
            ))}
          </ul>
        </Stage>
      </ol>

      <aside className={styles.escalation}>
        <span className={styles.escalationMark} aria-hidden="true" />
        <div>
          <span className={styles.escalationHead}>Human review · when needed</span>
          <p className={styles.escalationBody}>
            Low confidence or high deal value routes to a person instead of auto-resolving. This
            sample cleared the rules cleanly — a human still receives the summary.
          </p>
        </div>
      </aside>
    </ProofFrame>
  )
}
