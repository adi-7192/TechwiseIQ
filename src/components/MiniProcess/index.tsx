import styles from './MiniProcess.module.css'

interface Step {
  num: string
  title: string
  body: string
}

interface MiniProcessProps {
  steps: Step[]
}

export default function MiniProcess({ steps }: MiniProcessProps) {
  return (
    <section className={styles.section}>
      <div className="wrap">
        <span className={styles.label}>How it runs</span>
        <div className={styles.grid} data-animate="slide-up" data-stagger="0.12">
          {steps.map((step) => (
            <div key={step.num} className={styles.step}>
              <div className={styles.big}>{step.num}</div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.body}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
