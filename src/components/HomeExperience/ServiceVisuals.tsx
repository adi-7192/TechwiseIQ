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
  const nodes = ['People', 'Data', 'Tools', 'Decisions']

  return (
    <div className={styles.softwareVisual} aria-hidden="true">
      <div className={styles.systemLines}>
        {[0, 1, 2].map((line) => (
          <span key={line} data-home-system-line>
            <i />
          </span>
        ))}
      </div>
      {nodes.map((node) => (
        <span
          key={node}
          className={styles.systemNode}
          data-node={node.toLowerCase()}
          data-home-system-node
        >
          {node}
        </span>
      ))}
      <span className={styles.systemCore} data-home-system-core>
        One
        <br />
        system
      </span>
    </div>
  )
}

function AIVisual() {
  return (
    <div className={styles.aiVisual} aria-hidden="true">
      <div className={styles.aiInput} data-home-ai-input>
        <span>Inbox / documents</span>
        <i />
        <i />
        <i />
      </div>
      <span className={styles.aiConnector} />
      <div className={styles.aiReview} data-home-ai-review>
        Human
        <br />
        review
      </div>
      <div className={styles.aiResult} data-home-ai-result>
        Useful action <span>→</span>
      </div>
    </div>
  )
}

export default function ServiceVisual({ id }: ServiceVisualProps) {
  if (id === 'web') return <WebVisual />
  if (id === 'software') return <SoftwareVisual />
  return <AIVisual />
}
