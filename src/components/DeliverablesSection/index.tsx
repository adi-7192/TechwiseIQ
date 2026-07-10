import styles from './DeliverablesSection.module.css'

interface DeliverablesSectionProps {
  deliverables: string[]
}

export default function DeliverablesSection({ deliverables }: DeliverablesSectionProps) {
  return (
    <section className={styles.section}>
      <div className="wrap">
        <span className={styles.label}>What you get</span>
        <ul className={styles.grid} data-animate="slide-up" data-stagger="0.08">
          {deliverables.map((d) => (
            <li key={d} className={styles.item}>
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
