'use client'

import { useAccordion } from '@/hooks/useAccordion'
import styles from './FAQSection.module.css'

interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQ[]
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const { openIndex, toggle, setBodyRef } = useAccordion(faqs.length)

  return (
    <section className={styles.section}>
      <div className="wrap">
        <span className={styles.label}>Common questions</span>
        <div className={styles.list}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`${styles.faq}${openIndex === i ? ` ${styles.open}` : ''}`}
            >
              <h3 className={styles.heading}>
                <button
                  id={`faq-btn-${i}`}
                  className={styles.row}
                  onClick={() => toggle(i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-body-${i}`}
                  type="button"
                >
                  <span className={styles.q}>{faq.question}</span>
                  <span className={styles.toggle} aria-hidden="true">
                    {openIndex === i ? '−' : '+'}
                  </span>
                </button>
              </h3>
              <div
                id={`faq-body-${i}`}
                ref={setBodyRef(i)}
                className={styles.body}
                role="region"
                aria-labelledby={`faq-btn-${i}`}
              >
                <p className={styles.answer}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
