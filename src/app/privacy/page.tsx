import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import styles from './privacy.module.css'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Techwise IQ Technologies — how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className="wrap">
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.updated}>Last updated: June 2026</p>

          <section className={styles.section}>
            <h2 className={styles.heading}>Who we are</h2>
            <p>
              Techwise IQ Technologies (&quot;Techwise IQ&quot;, &quot;we&quot;, &quot;us&quot;) is a digital engineering
              agency based in Dubai, UAE. We build websites, custom software, and AI
              automation solutions for clients globally. Our website is{' '}
              <a href="https://techwiseiq.com">techwiseiq.com</a>.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>What data we collect</h2>
            <p>
              When you contact us via email, WhatsApp, or our contact form, we collect the
              information you provide — name, email address, phone number, and the details
              of your enquiry. We do not collect data through cookies or tracking scripts
              beyond privacy-respecting analytics (page views only, no cross-site tracking).
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>How we use your data</h2>
            <p>
              We use the information you provide solely to respond to your enquiry and
              deliver the services you engage us for. We do not sell, rent, or share your
              personal data with third parties for marketing purposes.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Data retention</h2>
            <p>
              We retain your contact information for as long as necessary to fulfil your
              project and maintain the relationship, or as required by law. You can request
              deletion at any time by emailing{' '}
              <a href="mailto:Info@techwiseiqtechnologies.ae">Info@techwiseiqtechnologies.ae</a>.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Your rights (GDPR / UAE PDPL)</h2>
            <p>
              You have the right to access, correct, or delete your personal data. You may
              also object to processing or request data portability. To exercise any of
              these rights, contact us at{' '}
              <a href="mailto:Info@techwiseiqtechnologies.ae">Info@techwiseiqtechnologies.ae</a>. We will
              respond within 30 days.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Third-party services</h2>
            <p>
              Our site may use privacy-friendly analytics (such as Plausible or Umami) that
              collect no personal data and set no cookies. WhatsApp enquiries are handled by
              Meta Platforms under their own privacy policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Contact</h2>
            <p>
              Questions about this policy?{' '}
              <a href="mailto:Info@techwiseiqtechnologies.ae">Info@techwiseiqtechnologies.ae</a>
              {' '}· Techwise IQ Technologies · Dubai, UAE
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
