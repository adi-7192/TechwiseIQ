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
        <h2 className="sr-only">How we work</h2>
        <span className={styles.label} aria-hidden="true">
          How it runs — no mystery
        </span>
        <div className={styles.grid} data-animate="slide-up" data-stagger="0.15">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={`${styles.step} ${i % 2 === 1 ? styles.stepOffset : ''}`}
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
