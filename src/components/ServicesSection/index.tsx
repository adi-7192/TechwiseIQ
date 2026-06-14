'use client'

import { useAccordion } from '@/hooks/useAccordion'
import styles from './ServicesSection.module.css'

const SERVICES = [
  {
    num: '001',
    title: 'Web Development',
    description:
      'Strategy, design, build, launch — end to end. Sites engineered to load fast and convert visitors, not decorate the internet. Custom design every time; templates are for agencies that bill by the hour.',
    deliverables: ['Marketing sites', 'E-commerce', 'CMS builds', 'SEO + GEO foundations'],
    href: '/services/web',
  },
  {
    num: '002',
    title: 'Custom Software',
    description:
      'Portals, dashboards, internal tools, products — software shaped to how your business actually runs. Scoped tight in writing, shipped in weekly demos you can click.',
    deliverables: ['Web apps + portals', 'APIs + integrations', 'Legacy rebuilds', 'Ongoing support'],
    href: '/services/software',
  },
  {
    num: '003',
    title: 'AI Automation',
    description:
      "We hunt the busywork in your workflows and kill it. Documents processed, emails triaged, reports generated — AI where it helps, plain code where it doesn't.",
    deliverables: ['Workflow automation', 'AI on your data', 'Doc + email processing', 'AI audits'],
    href: '/services/ai',
  },
]

export default function ServicesSection() {
  const { openIndex, toggle, setBodyRef } = useAccordion(SERVICES.length)

  return (
    <section className={styles.services} id="services">
      <div className="wrap">
        <div className={styles.head}>
          <span className={styles.label}>What we do — tap a row</span>
          <span className={styles.label}>001 — 003</span>
        </div>
      </div>
      {SERVICES.map((svc, i) => (
        <div
          key={svc.num}
          className={`${styles.svc}${openIndex === i ? ` ${styles.open}` : ''}`}
        >
          <div className="wrap">
            <h2 className={styles.heading}>
              <button
                id={`svc-btn-${i}`}
                className={styles.row}
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                aria-controls={`svc-body-${i}`}
                type="button"
              >
                <span className={styles.num}>{svc.num}</span>
                <span className={styles.title}>{svc.title}</span>
                <span className={styles.arr} aria-hidden="true">
                  →
                </span>
              </button>
            </h2>
            <div
              id={`svc-body-${i}`}
              ref={setBodyRef(i)}
              className={styles.body}
              role="region"
              aria-labelledby={`svc-btn-${i}`}
            >
              <div className={styles.bodyInner}>
                <p>{svc.description}</p>
                <ul>
                  {svc.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <a href={svc.href} className={styles.learnMore}>
                  Learn more →
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
