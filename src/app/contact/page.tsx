import type { Metadata } from 'next'
import Link from 'next/link'
import ImmersiveShell from '@/components/immersive/ImmersiveShell'
import { RefHero } from '@/components/immersive/reference'
import SiteFooter from '@/components/global/SiteFooter'
import SiteHeader from '@/components/global/SiteHeader'
import { CONTACT_EMAIL, WHATSAPP_URL } from '@/lib/site'
import { socialMetadata } from '@/lib/metadata'
import ContactForm, { NextSteps } from './ContactForm'
import styles from './contact.module.css'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Tell us what\u2019s slowing you down. We\u2019ll reply within 24 hours, then send a written scope after a short call. Dubai-based, serving clients worldwide.',
  alternates: { canonical: '/contact' },
  ...socialMetadata({
    title: 'Contact | Techwise IQ',
    description:
      'Tell us what\u2019s slowing you down. A reply within 24 hours, then a written scope after a short call.',
    url: '/contact',
  }),
}

export default function ContactPage() {
  return (
    <ImmersiveShell scene="advisory">
      <SiteHeader />
      <main id="main" data-contact-page>
        <RefHero
          compact
          eyebrow="Get in touch / Dubai · Worldwide"
          line="Let’s"
          ghost="talk shop."
          lead={
            <>
              Tell us what&apos;s slowing you down. We reply <strong>within 24 hours</strong> (yes,
              really), then a written scope after a short call.
            </>
          }
        >
          <p className={styles.nextNote}>
            Not ready for a project? Try the{' '}
            <Link href="/bottleneck-review">
              <strong>free 20-minute bottleneck review</strong>
            </Link>
            .
          </p>
        </RefHero>

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
                </div>

                <NextSteps />
              </aside>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </ImmersiveShell>
  )
}
