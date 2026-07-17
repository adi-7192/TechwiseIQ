import Image from 'next/image'
import type { HomeServiceId } from './home-content'
import styles from './HomeExperience.module.css'

type ServiceVisualProps = {
  id: HomeServiceId
}

function WebVisual() {
  return (
    <div className={styles.webVisual} data-home-web-frame>
      <Image
        className={styles.webImage}
        src="/work/aaskra-hero.webp"
        alt="AASKRA Realty website interface"
        width={1440}
        height={900}
        sizes="(max-width: 767px) calc(100vw - 40px), 50vw"
        data-home-web-image
      />
      <span className={styles.webCaption}>Live website / Dubai</span>
    </div>
  )
}

function SoftwareVisual() {
  const activities = [
    ['New request', 'Assigned'],
    ['Client approval', 'Ready'],
    ['Project handoff', 'Done'],
  ] as const

  return (
    <div
      className={styles.softwareDashboard}
      data-home-software-dashboard
      aria-hidden="true"
    >
      <div className={styles.softwareAppBar} />
      <div className={styles.softwareSidebar}>
        {[0, 1, 2, 3].map((item) => (
          <i key={item} />
        ))}
      </div>
      <div className={styles.softwareAppMain}>
        <strong>Operations overview</strong>
        <div className={styles.softwareMetrics}>
          <span>24</span>
          <span>08</span>
          <span>96%</span>
        </div>
        <div className={styles.softwareActivity}>
          {activities.map(([label, status]) => (
            <div key={label}>
              <span>{label}</span>
              <b data-home-software-status>{status}</b>
            </div>
          ))}
        </div>
      </div>
      <span
        className={styles.softwareCursor}
        data-home-software-cursor
      />
    </div>
  )
}

function AIVisual() {
  const inputs = ['Inbox', 'Forms', 'Documents'] as const
  const outputs = ['Update CRM', 'Draft reply', 'Build report'] as const

  return (
    <div
      className={styles.aiOrchestration}
      data-home-ai-orchestration
      aria-hidden="true"
    >
      <div className={styles.aiStack}>
        {inputs.map((input) => (
          <span key={input} data-home-ai-input>
            {input}
          </span>
        ))}
      </div>
      <i className={styles.aiRail} />
      <div className={styles.aiCore} data-home-ai-core>
        <span>✦</span>
        <strong>AI workflow</strong>
        <small>Understand · Decide · Route</small>
      </div>
      <i className={styles.aiRail} />
      <div className={`${styles.aiStack} ${styles.aiOutputStack}`}>
        {outputs.map((output) => (
          <span key={output} data-home-ai-output>
            {output}
          </span>
        ))}
      </div>
      <i className={styles.aiSignal} data-home-ai-signal />
    </div>
  )
}

export default function ServiceVisual({ id }: ServiceVisualProps) {
  if (id === 'web') return <WebVisual />
  if (id === 'software') return <SoftwareVisual />
  return <AIVisual />
}
