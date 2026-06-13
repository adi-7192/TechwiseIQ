import styles from './CTASection.module.css'

export default function CTASection() {
  return (
    <section className={styles.contact} id="contact">
      <div className="wrap">
        <span className={styles.label}>Got a bottleneck? Bring it.</span>
        <a className={`${styles.bigmail} rv`} href="mailto:hello@techwiseiq.com">
          hello@<wbr />techwiseiq.com
        </a>
        <div className={`${styles.altRow} rv rv-d1`}>
          <a href="#">WhatsApp ↗</a>
          <a href="#">Book a 20-min call ↗</a>
          <a href="#">Dubai · Worldwide</a>
        </div>
      </div>
    </section>
  )
}
