import styles from './DeliverablesSection.module.css'

interface DeliverablesSectionProps {
  deliverables: string[]
}

export default function DeliverablesSection({ deliverables }: DeliverablesSectionProps) {
  return (
    <section className={styles.section}>
      <div className="wrap">
        <span className={styles.label}>What you get</span>
        <ul className={styles.grid}>
          {deliverables.map((d, i) => (
            <li
              key={d}
              className={`${styles.item} rv${i >= 2 && i < 4 ? ' rv-d1' : ''}${i >= 4 ? ' rv-d2' : ''}`}
            >
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
              {d}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
