import type { Metadata } from 'next'
import Link from 'next/link'
import ImmersiveShell from '@/components/immersive/ImmersiveShell'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import { SiteFooter, SiteHeader } from '@/components/global'
import s from '@/components/ServicesOverview/ServicesOverview.module.css'
import { INSIGHTS, readingMinutes } from '@/data/insights'
import { socialMetadata } from '@/lib/metadata'
import c from '../contact/contact.module.css'
import { Inline, formatDate } from './inline'
import i from './insights.module.css'

const DESCRIPTION =
  'Short, sourced articles for business owners on websites, custom software and AI automation. From Techwise IQ, based in Dubai and working worldwide.'

export const metadata: Metadata = {
  title: 'Insights',
  description: DESCRIPTION,
  alternates: { canonical: '/insights' },
  ...socialMetadata({ title: 'Insights | Techwise IQ', description: DESCRIPTION, url: '/insights' }),
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Insights',
  url: 'https://techwiseiq.com/insights',
  hasPart: INSIGHTS.map((a) => ({
    '@type': 'Article',
    headline: a.title,
    url: `https://techwiseiq.com/insights/${a.slug}`,
  })),
}

export default function InsightsPage() {
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
              <SectionLabel>Insights</SectionLabel>
              <DisplayHeading as="h1" size="statement" className={i.title}>
                Plain answers. <em>Real sources.</em>
              </DisplayHeading>
              <p className={c.intro}>
                Short reads for business owners on websites, software and AI. Every number links to
                where it came from, with its year.
              </p>
            </div>
          </section>

          <Section density="dense" aria-label="Articles">
            <ol role="list" className={i.index}>
              {INSIGHTS.map((a, n) => (
                <li key={a.slug} className={s.directoryItem}>
                  <div>
                    <span className={s.directoryNumber} aria-hidden="true">
                      {String(n + 1).padStart(2, '0')}
                    </span>
                    <h2 className={i.entryTitle}>
                      <Link href={`/insights/${a.slug}`}>{a.title}</Link>
                    </h2>
                  </div>
                  <div>
                    <p className={i.dek}>
                      <Inline text={a.dek} />
                    </p>
                    <p className={i.meta}>
                      <time dateTime={a.published}>{formatDate(a.published)}</time> ·{' '}
                      {readingMinutes(a)} min read
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        </main>
        <SiteFooter />
      </ImmersiveShell>
    </>
  )
}
