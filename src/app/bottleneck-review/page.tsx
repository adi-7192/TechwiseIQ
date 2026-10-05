import type { Metadata } from 'next'
import ImmersiveShell from '@/components/immersive/ImmersiveShell'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import SiteFooter from '@/components/global/SiteFooter'
import SiteHeader from '@/components/global/SiteHeader'
import s from '@/components/ServicesOverview/ServicesOverview.module.css'
import { CONTACT_EMAIL } from '@/lib/site'
import { socialMetadata } from '@/lib/metadata'
import ContactForm from '../contact/ContactForm'
import c from '../contact/contact.module.css'
import p from './bottleneck-review.module.css'

const DESCRIPTION =
  'Tell us what’s slowing your business down. A free 20-minute call: you explain the problem, we explain how we’d fix it. Reply within 24 hours. Dubai-based, working worldwide.'

export const metadata: Metadata = {
  title: 'Free 20-minute bottleneck review',
  description: DESCRIPTION,
  alternates: { canonical: '/bottleneck-review' },
  ...socialMetadata({
    title: 'Free 20-minute bottleneck review | Techwise IQ',
    description: DESCRIPTION,
    url: '/bottleneck-review',
  }),
}

// D-003: no Offer / price / priceRange.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': 'https://techwiseiq.com/bottleneck-review',
  name: 'Free 20-minute bottleneck review',
  description: DESCRIPTION,
  url: 'https://techwiseiq.com/bottleneck-review',
  provider: { '@id': 'https://techwiseiq.com/#organization' },
}

const BRING = [
  'A website that gets visits but no enquiries.',
  'Copying the same data between spreadsheets by hand.',
  'An inbox your team sorts all day.',
  'A tool that almost does what you need.',
]

export default function BottleneckReviewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImmersiveShell scene="advisory">
        <SiteHeader />
        <main id="main">
          <section className={c.hero}>
            <div className="tw-wrap">
              <SectionLabel>Free · 20 minutes · Dubai / Worldwide</SectionLabel>
              <DisplayHeading as="h1" size="statement" className={p.title}>
                The free 20-minute <em>bottleneck review.</em>
              </DisplayHeading>
              <p className={c.intro}>
                Something in your business is slower than it should be. Bring it to us.{' '}
                <strong>Twenty minutes, free</strong>: you explain the mess, we explain how
                we&apos;d untangle it.
              </p>
            </div>
          </section>

          <Section ruled density="dense" aria-labelledby="how-title">
            <DisplayHeading as="h2" size="h2" id="how-title" className={s.sectionTitle}>
              How it works
            </DisplayHeading>
            <ol role="list" className={s.deliveryTrack}>
              <li>
                <span className={s.deliveryMarker}>01</span>
                <h3>You tell us.</h3>
                <p>
                  Fill in <a href="#review-form" className={p.inlineLink}>
                    the form below
                  </a>: what&apos;s stuck and
                  what you use today.
                </p>
              </li>
              <li>
                <span className={s.deliveryMarker}>02</span>
                <h3>We reply.</h3>
                <p>
                  A real person reads it and replies <strong>within 24 hours</strong> to set
                  up the call.
                </p>
              </li>
              <li>
                <span className={s.deliveryMarker}>03</span>
                <h3>The 20-minute call.</h3>
                <p>You explain the problem. We explain how we&apos;d untangle it.</p>
              </li>
              <li>
                <span className={s.deliveryMarker}>04</span>
                <h3>Then it&apos;s your call.</h3>
                <p>
                  Want us to build it? We bring options with our recommendation, then the
                  scope and price in writing. Not for you? <strong>No hard feelings.</strong>
                </p>
              </li>
            </ol>
          </Section>

          <Section ruled density="dense" aria-labelledby="bring-title">
            <div className={s.directoryIntro}>
              <DisplayHeading as="h2" size="h2" id="bring-title" className={s.sectionTitle}>
                Good things to bring
              </DisplayHeading>
              <ul role="list" className={s.capabilities}>
                {BRING.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Section>

          <Section ruled density="sparse" aria-labelledby="what-title">
            <div className={s.directoryIntro}>
              <DisplayHeading as="h2" size="h2" id="what-title" className={s.sectionTitle}>
                What it is (and isn&apos;t)
              </DisplayHeading>
              <p className={s.sectionBody}>
                It&apos;s a conversation, <strong>not a report and not a quote</strong>. If
                you want a quote after, it comes in writing for the option you choose. No
                packages, no price list.
              </p>
            </div>
          </Section>

          <Section
            ruled
            density="dense"
            id="review-form"
            className={p.formSection}
            aria-labelledby="form-title"
          >
            <DisplayHeading as="h2" size="h2" id="form-title" className={s.sectionTitle}>
              Tell us what&apos;s stuck.
            </DisplayHeading>
            <div className={p.formCol}>
              <ContactForm review />
              <p className={`${c.nextNote} u-breakable`}>
                Prefer email?{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>
                  Info@
                  <wbr />
                  techwiseiqtechnologies.ae
                </a>
              </p>
            </div>
          </Section>
        </main>
        <SiteFooter />
      </ImmersiveShell>
    </>
  )
}
