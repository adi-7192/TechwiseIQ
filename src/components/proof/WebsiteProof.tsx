import ProofFrame from './ProofFrame'
import styles from './WebsiteProof.module.css'

/* Qualitative proof tiles — evidence types, never fabricated numbers. */
const PROOF_TILES = [
  {
    kind: 'Case study',
    note: 'Challenge → decision → result, in the client’s words.',
    icon: 'doc',
  },
  {
    kind: 'Live prototype',
    note: 'Click the real interaction, not a screenshot of one.',
    icon: 'cursor',
  },
  {
    kind: 'Shipped work',
    note: 'A site that is already in production and earning trust.',
    icon: 'check',
  },
] as const

function TileIcon({ name }: { name: string }) {
  if (name === 'doc') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <line x1="8.5" y1="8" x2="15.5" y2="8" />
        <line x1="8.5" y1="12" x2="15.5" y2="12" />
        <line x1="8.5" y1="16" x2="12.5" y2="16" />
      </svg>
    )
  }
  if (name === 'cursor') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 4l13 6-5.5 2L11 18z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  )
}

type WebsiteProofProps = {
  caption?: string
  className?: string
}

/**
 * WebsiteProof — a miniature marketing page rendered in DOM/CSS/SVG that
 * demonstrates the argument order Techwise builds sites around:
 * positioning → proof → action. No fabricated metrics; the evidence tiles name
 * *kinds* of proof, and there is exactly one call to action.
 */
export default function WebsiteProof({
  caption = 'How the page argues: one sharp promise, real evidence, a single next action.',
  className,
}: WebsiteProofProps) {
  return (
    <ProofFrame
      label="preview / marketing-site"
      caption={caption}
      className={className}
      aria-label="Illustrative marketing site showing positioning, proof and a single call to action"
    >
      <div className={styles.site}>
        <div className={styles.topbar} aria-hidden="true">
          <span className={styles.logo}>
            STUDIO<span className={styles.logoMark}>·</span>
          </span>
          <span className={styles.nav}>
            <span />
            <span />
            <span />
          </span>
          <span className={styles.navPill}>Contact</span>
        </div>

        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>01 / Positioning</span>
            <p className={styles.promise}>
              One sharp promise, <em>before the scroll.</em>
            </p>
            <span className={styles.underline} aria-hidden="true" />
            <p className={styles.sub}>
              Say what changes for the buyer — then make every section prove it.
            </p>
          </div>
          <div className={styles.heroVisual} aria-hidden="true">
            <svg viewBox="0 0 200 200" role="img">
              <circle cx="100" cy="100" r="86" className={styles.ringOuter} />
              <circle cx="100" cy="100" r="54" className={styles.ringMid} />
              <circle cx="100" cy="100" r="22" className={styles.ringCore} />
            </svg>
          </div>
        </div>

        <div className={styles.proof}>
          <span className={styles.eyebrow}>02 / Proof</span>
          <ul className={styles.tiles}>
            {PROOF_TILES.map((tile) => (
              <li className={styles.tile} key={tile.kind}>
                <span className={styles.tileIcon}>
                  <TileIcon name={tile.icon} />
                </span>
                <span className={styles.tileKind}>{tile.kind}</span>
                <span className={styles.tileNote}>{tile.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.action}>
          <div>
            <span className={styles.eyebrow}>03 / Action</span>
            <p className={styles.actionNote}>One clear next step — no competing calls to action.</p>
          </div>
          <span className={styles.cta}>
            See the proof <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </ProofFrame>
  )
}
