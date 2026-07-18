import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { ScrollAnimator } from '@/components/ui'
import { BOOKING_URL } from '@/lib/site'
import ContactForm from './ContactForm'
import styles from './contact.module.css'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Tell us what\u2019s slowing you down. We\u2019ll reply with scope, timeline, and cost within 24 hours. Dubai-based, serving clients worldwide.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | Techwise IQ',
    description:
      'Tell us what\u2019s slowing you down. Scope, timeline, and cost within 24 hours.',
    url: 'https://techwiseiq.com/contact',
  },
}

export default function ContactPage() {
  return (
    <>
      <ScrollAnimator />
      <Nav />
      <main>
        <section className={styles.hero}>
          <div className="wrap">
            <span className={styles.label}>Get in touch</span>
            <h1 className={styles.title} data-animate="slide-up">
              Let&apos;s <span className={styles.titleAccent}>talk.</span>
            </h1>
            <p className={styles.intro} data-animate="slide-up">
              Tell us what&apos;s slowing you down. We&apos;ll reply with scope,
              timeline, and cost &mdash; in writing, within 24 hours.
            </p>
          </div>
        </section>

        <section>
          <div className="wrap">
            <div className={styles.grid}>
              <div data-animate="slide-up">
                <ContactForm />
              </div>

              <aside className={styles.sidebar} data-animate="slide-up">
                <p className={styles.sideLabel}>Or reach out directly</p>
                <div className={styles.contactMethods}>
                  <a href="mailto:Info@techwiseiqtechnologies.ae" className={styles.method}>
                    <span className={styles.methodTitle}>
                      Email <span className={styles.methodArrow}>&rarr;</span>
                    </span>
                    <span className={styles.methodDetail}>
                      Info@
                      <wbr />
                      techwiseiqtechnologies.ae
                    </span>
                  </a>
                  <a
                    href="https://wa.me/971567760667"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.method}
                  >
                    <span className={styles.methodTitle}>
                      WhatsApp{' '}
                      <span className={styles.methodArrow}>&rarr;</span>
                    </span>
                    <span className={styles.methodDetail}>
                      Chat on WhatsApp
                    </span>
                  </a>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.method}
                  >
                    <span className={styles.methodTitle}>
                      Book a call{' '}
                      <span className={styles.methodArrow}>&rarr;</span>
                    </span>
                    <span className={styles.methodDetail}>
                      20-minute intro call
                    </span>
                  </a>
                </div>

                <div className={styles.promise}>
                  <p className={styles.promiseTitle}>Response guarantee</p>
                  <p className={styles.promiseBody}>
                    Every inquiry gets a reply within 24 hours. Usually
                    faster. No auto-responders, no ticket numbers &mdash; a
                    real person who read what you wrote.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
