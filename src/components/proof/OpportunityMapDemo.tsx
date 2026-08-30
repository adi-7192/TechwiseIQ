import ProofFrame from './ProofFrame'
import styles from './OpportunityMapDemo.module.css'

type Tier = 'build' | 'next' | 'test' | 'later'

const TIER_LABEL: Record<Tier, string> = {
  build: 'Build first',
  next: 'Next',
  test: 'Test first',
  later: 'Later',
}

/* Deterministic sample opportunities. x = feasibility, y = value (both %),
   risk stated explicitly. No ROI or performance numbers — this maps judgement. */
const OPPORTUNITIES: {
  name: string
  value: string
  feasibility: string
  risk: string
  tier: Tier
  x: number
  y: number
  size: 'sm' | 'md' | 'lg'
  labelSide: 'left' | 'right'
}[] = [
  { name: 'Lead triage', value: 'High', feasibility: 'High', risk: 'Low', tier: 'build', x: 78, y: 82, size: 'lg', labelSide: 'left' },
  { name: 'Document extraction', value: 'Med–high', feasibility: 'High', risk: 'Low', tier: 'build', x: 68, y: 60, size: 'md', labelSide: 'left' },
  { name: 'Support assistant', value: 'Medium', feasibility: 'Medium', risk: 'Medium', tier: 'next', x: 48, y: 46, size: 'md', labelSide: 'right' },
  { name: 'Dynamic pricing', value: 'High', feasibility: 'Low', risk: 'High', tier: 'test', x: 24, y: 76, size: 'md', labelSide: 'right' },
  { name: 'Demand forecasting', value: 'Medium', feasibility: 'Low', risk: 'Medium', tier: 'later', x: 30, y: 30, size: 'sm', labelSide: 'right' },
]

/* Recommended order = build-first, then next, then test, then later. */
const SEQUENCE_ORDER: Tier[] = ['build', 'next', 'test', 'later']
const RANKED = [...OPPORTUNITIES].sort(
  (a, b) => SEQUENCE_ORDER.indexOf(a.tier) - SEQUENCE_ORDER.indexOf(b.tier),
)

const LEGEND: Tier[] = ['build', 'next', 'test', 'later']

type OpportunityMapDemoProps = {
  caption?: string
  className?: string
}

/**
 * OpportunityMapDemo — an AI opportunity map: each candidate is plotted by
 * value (vertical) against feasibility (horizontal), coloured by the
 * recommended move, with risk stated per item. A ranked list turns the map into
 * a sequence. Static DOM/CSS; deterministic sample data, no fabricated ROI.
 */
export default function OpportunityMapDemo({
  caption = 'Value against feasibility, risk called out per item — turned into a build order, not a wishlist.',
  className,
}: OpportunityMapDemoProps) {
  return (
    <ProofFrame
      label="map / ai-opportunities"
      caption={caption}
      className={className}
      aria-label="Illustrative AI opportunity map plotting value against feasibility with risk labelled"
    >
      <div className={styles.layout}>
        <div className={styles.plotWrap}>
          <span className={`${styles.axisLabel} ${styles.axisY}`}>Value →</span>
          <div className={styles.plot} role="img" aria-label="Opportunities plotted by value and feasibility">
            <span className={styles.quadHint}>Build first</span>
            {OPPORTUNITIES.map((o) => (
              <span
                key={o.name}
                className={`${styles.node} ${styles[o.tier]} ${styles[o.size]} ${styles[o.labelSide]}`}
                style={{ left: `${o.x}%`, bottom: `${o.y}%` }}
              >
                <span className={styles.nodeDot} aria-hidden="true" />
                <span className={styles.nodeLabel}>{o.name}</span>
              </span>
            ))}
          </div>
          <span className={`${styles.axisLabel} ${styles.axisX}`}>Feasibility →</span>
        </div>

        <div className={styles.side}>
          <ol className={styles.ranked}>
            {RANKED.map((o, i) => (
              <li key={o.name} className={styles.rankItem}>
                <span className={styles.rankNum}>{String(i + 1).padStart(2, '0')}</span>
                <div className={styles.rankBody}>
                  <span className={styles.rankTop}>
                    <span className={styles.rankName}>{o.name}</span>
                    <span className={`${styles.tierChip} ${styles[o.tier]}`}>
                      {TIER_LABEL[o.tier]}
                    </span>
                  </span>
                  <span className={styles.rankMeta}>
                    <span>Value: {o.value}</span>
                    <span>Feasibility: {o.feasibility}</span>
                    <span>Risk: {o.risk}</span>
                  </span>
                </div>
              </li>
            ))}
          </ol>

          <ul className={styles.legend}>
            {LEGEND.map((t) => (
              <li key={t}>
                <span className={`${styles.legendDot} ${styles[t]}`} aria-hidden="true" />
                {TIER_LABEL[t]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProofFrame>
  )
}
