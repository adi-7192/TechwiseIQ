import { WHATSAPP_URL } from '@/lib/site'
import styles from './WhatsAppButton.module.css'

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp — chat"
      className={styles.btn}
    >
      <span className={styles.fullLabel}>WhatsApp</span>
      <span className={styles.compactLabel} aria-hidden="true">
        Chat
      </span>{' '}
      ↗
    </a>
  )
}
