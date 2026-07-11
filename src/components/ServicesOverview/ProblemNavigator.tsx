'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SERVICE_PROBLEMS, SERVICES } from '@/data/services'
import styles from './ServicesOverview.module.css'

export default function ProblemNavigator() {
  const [selectedId, setSelectedId] = useState(SERVICE_PROBLEMS[0].id)
  const problem =
    SERVICE_PROBLEMS.find((item) => item.id === selectedId) ??
    SERVICE_PROBLEMS[0]
  const service = SERVICES[problem.primaryService]

  return (
    <div className={styles.navigator} data-testid="problem-navigator">
      <div className={styles.problemList} aria-label="Choose the closest problem">
        {SERVICE_PROBLEMS.map((item, index) => (
          <a
            key={item.id}
            href={`#service-${item.primaryService}`}
            className={styles.problemLink}
            aria-current={item.id === selectedId ? 'true' : undefined}
            onClick={(event) => {
              event.preventDefault()
              setSelectedId(item.id)
            }}
          >
            <span>{item.label}</span>
            <span aria-hidden="true">0{index + 1}</span>
          </a>
        ))}
      </div>
      <div
        className={styles.recommendation}
        data-testid="service-recommendation"
        aria-live="polite"
      >
        <span className={styles.eyebrow}>Best match / {service.number}</span>
        <h3>{service.title}</h3>
        <p>{problem.rationale}</p>
        <ul>
          {problem.examples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
        <Link href={service.slug}>
          Explore {service.title} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  )
}
