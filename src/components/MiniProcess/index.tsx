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
        <div className={styles.grid}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`${styles.step} rv${i === 1 ? ' rv-d1' : ''}${i >= 2 ? ' rv-d2' : ''}`}
            >
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
