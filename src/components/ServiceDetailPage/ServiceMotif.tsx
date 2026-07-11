import type { ServiceMotifId } from '@/data/services'
import styles from './ServiceDetailPage.module.css'

export default function ServiceMotif({ motif }: { motif: ServiceMotifId }) {
  if (motif === 'web') {
    return (
      <div className={`${styles.motif} ${styles.webMotif}`} aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    )
  }

  if (motif === 'software') {
    return (
      <div
        className={`${styles.motif} ${styles.softwareMotif}`}
        aria-hidden="true"
      >
        <i />
        <i />
        <i />
        <b />
        <b />
      </div>
    )
  }

  return (
    <div className={`${styles.motif} ${styles.aiMotif}`} aria-hidden="true">
      <i />
      <i />
      <i />
      <span>Human check</span>
    </div>
  )
}
