import type { Metadata } from 'next'
import ImmersiveShell from '@/components/immersive/ImmersiveShell'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import SiteFooter from '@/components/global/SiteFooter'
import SiteHeader from '@/components/global/SiteHeader'
import { BOOKING_URL, CONTACT_EMAIL, WHATSAPP_URL } from '@/lib/site'
import { socialMetadata } from '@/lib/metadata'
import ContactForm from './ContactForm'
import styles from './contact.module.css'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Tell us what\u2019s slowing you down. We\u2019ll reply with scope, timeline, and cost within 24 hours. Dubai-based, serving clients worldwide.',
  alternates: { canonical: '/contact' },
  ...socialMetadata({
    title: 'Contact | Techwise IQ',
    description:
      'Tell us what\u2019s slowing you down. Scope, timeline, and cost within 24 hours.',
    url: '/contact',
  }),
}

export default function ContactPage() {
  return (
    <ImmersiveShell scene="advisory">
      <SiteHeader />
      <main id="main" data-contact-page>
        <section className={styles.hero}>
          <div className="tw-wrap">
            <SectionLabel>Get in touch / Dubai · Worldwide</SectionLabel>
            <h1 className={styles.title}>
              Let&apos;s <span className={styles.titleAccent}>talk.</span>
            </h1>
            <p className={styles.intro}>
              Tell us what&apos;s slowing you down. We&apos;ll reply with scope,
              timeline, and cost &mdash; in writing, within 24 hours.
            </p>
          </div>
        </section>

        <section>
          <div className="tw-wrap">
            <div className={styles.grid}>
              <div>
                <ContactForm />
              </div>

              <aside className={styles.sidebar}>
                <p className={styles.sideLabel}>Or reach out directly</p>
                <div className={styles.contactMethods}>
                  <a href={`mailto:${CONTACT_EMAIL}`} className={styles.method}>
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
                    href={WHATSAPP_URL}
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
      <SiteFooter />
    </ImmersiveShell>
  )
}
