import styles from './ProcessSection.module.css'

const STEPS = [
  {
    num: '01',
    title: 'Diagnose',
    body: 'A short discovery sprint. Goals, systems, bottlenecks — mapped before we quote a dirham.',
  },
  {
    num: '02',
    title: 'Scope',
    body: 'Fixed written scope. Timeline, cost, deliverables. No vague estimates.',
  },
  {
    num: '03',
    title: 'Build',
    body: 'Working software every Friday. Progress you can click, not status reports.',
  },
  {
    num: '04',
    title: 'Run',
    body: 'Launch + handover. Optional retainer for support and new automations.',
  },
]

export default function ProcessSection() {
  return (
    <section className={styles.process}>
      <div className="wrap">
        <span className={styles.label}>How it runs — no mystery</span>
        <div className={styles.grid}>
          {STEPS.map((step, i) => (
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
