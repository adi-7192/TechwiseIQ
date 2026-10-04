import ProofFrame, { type ProofSurface } from './ProofFrame'
import styles from './OperationsConsoleDemo.module.css'

type Status = 'queued' | 'review' | 'approved'

const STATUS_LABEL: Record<Status, string> = {
  queued: 'Queued',
  review: 'In review',
  approved: 'Approved',
}

/* Deterministic queue state — a believable operations backlog, not real data. */
const QUEUE: {
  item: string
  ref: string
  type: string
  owner: string
  status: Status
  selected?: boolean
}[] = [
  { item: 'Vendor onboarding', ref: 'VND-0231', type: 'Procurement', owner: 'R. Haddad', status: 'review', selected: true },
  { item: 'Refund request', ref: 'FIN-4821', type: 'Finance', owner: 'S. Nair', status: 'queued' },
  { item: 'Access request', ref: 'IT-1180', type: 'IT', owner: 'A. Khan', status: 'queued' },
  { item: 'Contract renewal', ref: 'LEG-0907', type: 'Legal', owner: 'M. Ali', status: 'approved' },
]

const NAV = ['Queue', 'Approvals', 'Vendors', 'Settings'] as const

const CHECKS = [
  { label: 'Trade licence valid', state: 'pass' },
  { label: 'Bank details match record', state: 'pass' },
  { label: 'Sanctions screening', state: 'attention' },
] as const

type OperationsConsoleDemoProps = {
  caption?: string
  className?: string
  surface?: ProofSurface
}

/**
 * OperationsConsoleDemo — one role-shaped interface for a review/approval
 * workflow: a decision queue with explicit states (queued → in review →
 * approved), and a detail panel where automated checks surface what a human
 * must actually decide. Deterministic sample data; counts describe queue state,
 * not performance.
 */
export default function OperationsConsoleDemo({
  caption = 'One console around a real sequence of work: queue, review the checks, approve or return.',
  className,
  surface = 'dark',
}: OperationsConsoleDemoProps) {
  const awaiting = QUEUE.filter((r) => r.status !== 'approved').length
  const selected = QUEUE.find((r) => r.selected)

  return (
    <ProofFrame
      label="console / operations"
      caption={caption}
      surface={surface}
      className={className}
      aria-label="Illustrative operations console with a review and approval queue"
    >
      <div className={styles.console}>
        <nav className={styles.sidebar} aria-label="Console sections (illustrative)">
          <span className={styles.brand}>
            OPS<span className={styles.brandMark}>/</span>HQ
          </span>
          <ul className={styles.navList}>
            {NAV.map((n, i) => (
              <li key={n} className={i === 0 ? styles.navActive : undefined}>
                {n}
              </li>
            ))}
          </ul>
          <span className={styles.queueCount}>{awaiting} awaiting review</span>
        </nav>

        <div className={styles.main}>
          <div className={styles.toolbar}>
            <h4 className={styles.title}>Decision queue</h4>
            <div className={styles.filters} aria-hidden="true">
              <span className={styles.filterActive}>All</span>
              <span className={styles.filter}>Mine</span>
              <span className={styles.filter}>Urgent</span>
            </div>
          </div>

          <ul className={styles.rows}>
            <li className={styles.headRow} aria-hidden="true">
              <span>Item</span>
              <span>Type</span>
              <span>Requested by</span>
              <span>Status</span>
              <span />
            </li>
            {QUEUE.map((row) => (
              <li
                key={row.ref}
                className={row.selected ? `${styles.row} ${styles.rowSelected}` : styles.row}
              >
                <span className={styles.cell} data-label="Item">
                  <span className={styles.itemName}>{row.item}</span>
                  <span className={styles.itemRef}>{row.ref}</span>
                </span>
                <span className={styles.cell} data-label="Type">
                  {row.type}
                </span>
                <span className={styles.cell} data-label="Requested by">
                  {row.owner}
                </span>
                <span className={styles.cell} data-label="Status">
                  <span className={`${styles.status} ${styles[row.status]}`}>
                    {STATUS_LABEL[row.status]}
                  </span>
                </span>
                <span className={`${styles.cell} ${styles.actionCell}`}>
                  {row.status === 'approved' ? (
                    <span className={styles.done} aria-hidden="true">
                      ✓
                    </span>
                  ) : (
                    <span className={styles.open}>Open →</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          {selected && (
            <div className={styles.detail}>
              <div className={styles.detailHead}>
                <span className={styles.detailKind}>Reviewing · {selected.ref}</span>
                <span className={styles.detailTitle}>{selected.item}</span>
              </div>
              <ul className={styles.checks}>
                {CHECKS.map((c) => (
                  <li key={c.label} className={c.state === 'pass' ? styles.pass : styles.attention}>
                    <span className={styles.checkMark} aria-hidden="true">
                      {c.state === 'pass' ? '✓' : '!'}
                    </span>
                    <span>{c.label}</span>
                    <span className={styles.checkState}>
                      {c.state === 'pass' ? 'Passed' : 'Needs attention'}
                    </span>
                  </li>
                ))}
              </ul>
              <div className={styles.controls}>
                <span className={styles.approve}>Approve</span>
                <span className={styles.return}>Return with note</span>
                <span className={styles.controlNote}>Human decides · every action logged</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProofFrame>
  )
}
