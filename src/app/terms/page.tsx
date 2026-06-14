import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import styles from './terms.module.css'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Techwise IQ Technologies — the conditions under which we provide our services.',
}

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className="wrap">
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.updated}>Last updated: June 2026</p>

          <section className={styles.section}>
            <h2 className={styles.heading}>Agreement</h2>
            <p>
              By engaging Techwise IQ Technologies (&quot;Techwise IQ&quot;, &quot;we&quot;, &quot;us&quot;) for any
              service, you agree to these terms. If you do not agree, do not engage our
              services. These terms apply to all projects, retainers, and consultations.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Scope of work</h2>
            <p>
              All projects are scoped in writing before work begins. The written scope
              document is the authoritative reference for deliverables, timeline, and price.
              Changes to scope are agreed in writing and may affect timeline and cost.
              We do not proceed on verbal agreements alone.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Payment</h2>
            <p>
              Payment terms are specified in each project agreement. We typically require a
              deposit before work begins and milestone payments tied to delivery. Invoices
              are due within the period stated on the invoice. Late payment may pause work
              until the account is settled.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Intellectual property</h2>
            <p>
              Upon receipt of full payment, you own the final deliverables — code, designs,
              and content produced specifically for your project. We retain the right to
              display the work in our portfolio unless you request otherwise in writing.
              Third-party libraries and tools used in the project are subject to their own
              licences.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Confidentiality</h2>
            <p>
              We treat all client information as confidential. We do not share your business
              details, data, or project specifics with third parties except where necessary
              to deliver the project (e.g. hosting providers, domain registrars). We are
              happy to sign an NDA where required.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Limitation of liability</h2>
            <p>
              Techwise IQ is not liable for indirect, incidental, or consequential damages
              arising from the use of deliverables. Our total liability in any matter is
              limited to the fees paid for the specific project in question. We build with
              care but cannot guarantee outcomes that depend on factors outside our
              control — market conditions, third-party platforms, or client content.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Governing law</h2>
            <p>
              These terms are governed by the laws of the United Arab Emirates. Any disputes
              will be resolved through good-faith negotiation first; if that fails, through
              the courts of Dubai.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Contact</h2>
            <p>
              Questions about these terms?{' '}
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
