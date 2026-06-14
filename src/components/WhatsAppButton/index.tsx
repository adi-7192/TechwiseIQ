import styles from './WhatsAppButton.module.css'

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/971567760667"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={styles.btn}
    >
      WhatsApp ↗
    </a>
  )
}
