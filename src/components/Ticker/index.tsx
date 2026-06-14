import Marquee from '@/components/Marquee'
import styles from './Ticker.module.css'

export default function Ticker() {
  return (
    <>
      <ul className="sr-only">
        <li>Fixed scope</li>
        <li>Demos every Friday</li>
        <li>No surprise invoices</li>
        <li>Weeks not quarters</li>
      </ul>
      <div className={styles.ticker} aria-hidden="true">
        <Marquee duration={26}>
          <span className={styles.text}>
            Fixed scope ★ Demos every Friday ★ No surprise invoices ★ Weeks not
            quarters ★&nbsp;
          </span>
        </Marquee>
      </div>
    </>
  )
}
