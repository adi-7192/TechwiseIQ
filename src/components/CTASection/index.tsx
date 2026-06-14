import styles from './CTASection.module.css'

export default function CTASection() {
  return (
    <section className={styles.contact} id="contact">
      <div className="wrap">
        <span className={styles.label}>Got a bottleneck? Bring it.</span>
        <h2 className={`${styles.heading} rv`}>
          START THE
          <br />
          CONVERSATION.
        </h2>
        <div className={`${styles.channels} rv rv-d1`}>
          <a
            className={styles.channel}
            href="mailto:Info@techwiseiqtechnologies.ae"
          >
            <span className={styles.channelType}>Email</span>
            <span className={styles.channelValue}>
              Info@techwiseiqtechnologies.ae
            </span>
          </a>
          <a
            className={styles.channel}
            href="https://wa.me/971567760667"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.channelType}>WhatsApp</span>
            <span className={styles.channelValue}>Chat with us ↗</span>
          </a>
          {/* TODO: wire booking link */}
          <a className={styles.channel} href="#">
            <span className={styles.channelType}>Book a call</span>
            <span className={styles.channelValue}>20-min intro ↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
