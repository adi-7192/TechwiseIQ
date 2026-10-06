import styles from './work.module.css'

/** Decorative browser chrome above a site cover or live preview. */
export default function BrowserBar({ label }: { label: string }) {
  return (
    <div className={styles.browserBar} aria-hidden="true">
      <span />
      <span />
      <span />
      <b>{label}</b>
    </div>
  )
}
