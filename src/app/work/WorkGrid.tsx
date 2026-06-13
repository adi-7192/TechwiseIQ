'use client'

import Image from 'next/image'
import { useAccordion } from '@/hooks/useAccordion'
import styles from './work.module.css'

const PROJECTS = [
  {
    slug: 'aaskra-realty',
    title: 'AASKRA Realty',
    service: 'Web Development',
    tagline:
      'Premium real estate investment consultancy \u2014 luxury positioning for Dubai\u2019s high-net-worth market',
    image: '/work/aaskra-hero.png',
    liveUrl: 'https://www.aaskrarealestate.ae',
    deliverables: [
      '11-page Next.js website with custom luxury design',
      'Cinematic animated loading screen + hero sequence',
      '6 interactive location profiles with ROI metrics',
      '3 strategy service pages (off-plan, buying, selling)',
      'Developer partnership showcase (EMAAR, DAMAC, SOBHA, etc.)',
      'WhatsApp Business + consultation booking integration',
      'Blog/insights content section',
      'Full SEO (Schema.org, OpenGraph, structured data)',
      'RERA-compliant legal pages',
    ],
    impact:
      'Established a credible digital presence for a new real estate consultancy targeting high-net-worth investors. The site positions AASKRA alongside established Dubai developers with concrete data \u2014 ROI percentages, entry prices, location analysis \u2014 instead of generic luxury imagery. Integrated lead generation via WhatsApp and consultation booking.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
  },
  {
    slug: 'express-trade-financing',
    title: 'Express Trade Financing',
    service: 'Web Development',
    tagline:
      'Trade finance advisory \u2014 institutional credibility for a firm facilitating USD 200M+ in instruments',
    image: '/work/etf-hero.png',
    liveUrl: 'https://www.expresstradefinancing.ae',
    deliverables: [
      '10-page website with custom design and animations',
      'Global transaction map showing 25+ countries served',
      '3 detailed case studies with real deal outcomes',
      'Trade finance + SME support service pages',
      'Journal section with market analysis articles',
      'Animated hero with Dubai skyline panorama',
      'WhatsApp + consultation form integration',
      'Google Analytics + Schema.org SEO setup',
    ],
    impact:
      'Gave a boutique trade finance firm the digital presence of an institutional player. Real case studies \u2014 USD 1M letter of credit, USD 600K bid bond, cross-border usance LC \u2014 build trust that no amount of stock photography could. The site converts inquiries from import/export firms across 25+ countries.',
    stack: ['Vite', 'JavaScript', 'CSS Animations', 'Google Analytics'],
  },
]

export default function WorkGrid() {
  const { openIndex, toggle, setBodyRef } = useAccordion(PROJECTS.length)

  return (
    <>
      <div className={styles.tiles}>
        {PROJECTS.map((p, i) => (
          <button
            key={p.slug}
            className={`${styles.tile}${openIndex === i ? ` ${styles.tileActive}` : ''}`}
            onClick={() => toggle(i)}
            type="button"
            aria-expanded={openIndex === i}
            aria-controls={`project-${i}`}
          >
            <div className={styles.tileImgWrap}>
              <Image
                src={p.image}
                alt={`${p.title} website screenshot`}
                fill
                sizes="(max-width: 600px) 100vw, 50vw"
                className={styles.tileImg}
              />
            </div>
            <div className={styles.tileBody}>
              <span className={styles.tileService}>{p.service}</span>
              <h2 className={styles.tileTitle}>{p.title}</h2>
              <span className={styles.tileTagline}>{p.tagline}</span>
              <span className={styles.tileIndicator} aria-hidden="true">
                +
              </span>
            </div>
          </button>
        ))}
      </div>

      {PROJECTS.map((p, i) => (
        <div
          key={p.slug}
          id={`project-${i}`}
          ref={setBodyRef(i)}
          className={styles.detail}
          role="region"
          aria-labelledby={`project-${i}-title`}
        >
          <div className={styles.detailInner}>
            <div className={styles.detailPad}>
              <span className={styles.detailLabel}>What we delivered</span>
              <ul className={styles.deliverables}>
                {p.deliverables.map((d) => (
                  <li key={d} className={styles.deliverable}>
                    <span className={styles.delArrow} aria-hidden="true">
                      &rarr;
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
              <div className={styles.stackRow}>
                {p.stack.map((t) => (
                  <span key={t} className={styles.stackTag}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.detailPad}>
              <span className={styles.detailLabel}>The impact</span>
              <p className={styles.impactBody}>{p.impact}</p>
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.visitLink}
              >
                Visit live site &rarr;
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
