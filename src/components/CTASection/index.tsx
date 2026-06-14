import { GeometricAccents } from '@/components/ui'
import styles from './CTASection.module.css'

export default function CTASection() {
  return (
    <section className={styles.contact} id="contact">
      <div className="wrap">
        <span className={styles.label}>Got a bottleneck? Bring it.</span>
        <div className={styles.split}>
          <div className={styles.left} data-animate="slide-left">
            <h2 className={styles.heading}>
              START THE
              <br />
              CONVERSATION.
            </h2>
          </div>
          <div className={styles.accent}>
            <GeometricAccents variant="cta" />
          </div>
          <div className={styles.right} data-animate="slide-right" data-stagger="0.1">
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
      </div>
    </section>
  )
}
