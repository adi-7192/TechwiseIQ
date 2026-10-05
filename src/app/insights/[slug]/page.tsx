import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ImmersiveShell from '@/components/immersive/ImmersiveShell'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import Section from '@/components/immersive/primitives/Section'
import { SiteFooter, SiteHeader } from '@/components/global'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { INSIGHTS, getInsight, readingMinutes, type Block } from '@/data/insights'
import { socialMetadata } from '@/lib/metadata'
import c from '../../contact/contact.module.css'
import { Inline, formatDate, plain } from '../inline'
import i from '../insights.module.css'

interface Props {
  params: Promise<{ slug: string }>
}

const BASE = 'https://techwiseiq.com'

export async function generateStaticParams() {
  return INSIGHTS.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const a = getInsight(slug)
  if (!a) return {}
  const url = `/insights/${a.slug}`
  const description = plain(a.dek)
  return {
    title: a.title,
    description,
    alternates: { canonical: url },
    ...socialMetadata({ title: `${a.title} | Techwise IQ`, description, url }),
  }
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return <p><Inline text={block.text} /></p>
    case 'h2':
      return <h2><Inline text={block.text} /></h2>
    case 'table':
      return (
        <table>
          <thead>
            <tr>
              {block.head.map((h) => (
                <th key={h} scope="col"><Inline text={h} /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, k) =>
                  k === 0 ? (
                    <th key={k} scope="row"><Inline text={cell} /></th>
                  ) : (
                    <td key={k}><Inline text={cell} /></td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )
    default: {
      const List = block.type
      return (
        <List>
          {block.items.map((item) => (
            <li key={item}><Inline text={item} /></li>
          ))}
        </List>
      )
    }
  }
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params
  const a = getInsight(slug)
  if (!a) notFound()
  const url = `${BASE}/insights/${a.slug}`

  // D-003: no Offer / price.
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: plain(a.dek),
      datePublished: a.published,
      dateModified: a.published,
      author: { '@type': 'Organization', name: 'Techwise IQ team' },
      publisher: { '@id': `${BASE}/#organization` },
      url,
      citation: a.sources.map((src) => src.url),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Insights', item: `${BASE}/insights` },
        { '@type': 'ListItem', position: 2, name: a.title, item: url },
      ],
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImmersiveShell scene="advisory">
        <SiteHeader />
        <main id="main">
          <article>
            <header className={c.hero}>
              <div className="tw-wrap">
                <nav aria-label="Breadcrumb" className={`${i.meta} ${i.crumbs}`}>
                  <Link href="/insights">Insights</Link>
                  <span aria-hidden="true">/</span>
                  <span aria-current="page">{a.title}</span>
                </nav>
                <DisplayHeading as="h1" size="h2" className={i.articleTitle}>
                  {a.title}
                </DisplayHeading>
                <p className={c.intro}>
                  <Inline text={a.dek} />
                </p>
                <p className={`${i.meta} ${i.byline}`}>
                  Techwise IQ team · <time dateTime={a.published}>{formatDate(a.published)}</time>{' '}
                  · {readingMinutes(a)} min read
                </p>
              </div>
            </header>

            <Section as="div" density="dense">
              <div className={i.prose}>
                {a.body.map((block, n) => (
                  <BlockView key={n} block={block} />
                ))}
              </div>

              <div className={i.closing}>
                {a.closing && (
                  <p><Inline text={a.closing} /></p>
                )}
                <PrimaryCTA href="/contact">Bring us the problem</PrimaryCTA>
              </div>

              <section className={`${i.sources} u-breakable`} aria-labelledby="sources-title">
                <h2 id="sources-title">Sources</h2>
                <ol>
                  {a.sources.map((src, n) => (
                    <li key={src.url} id={`source-${n + 1}`}>
                      <a href={src.url} target="_blank" rel="noopener noreferrer">
                        {src.label}
                        <span className="sr-only">, opens in a new tab</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            </Section>
          </article>
        </main>
        <SiteFooter />
      </ImmersiveShell>
    </>
  )
}
