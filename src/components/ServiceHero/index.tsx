import Link from 'next/link'
import { Button } from '@/components/ui'
import styles from './ServiceHero.module.css'

interface ServiceHeroProps {
  label: string
  title: string
  description: string
}

export default function ServiceHero({ label, title, description }: ServiceHeroProps) {
  return (
    <section className={styles.hero}>
      <div className="wrap">
        <div className={styles.breadcrumb}>
          <Link href="/services" className={styles.back}>
            Services
          </Link>
          <span className={styles.sep}>/</span>
          <span className={styles.current}>{label}</span>
        </div>
        <h1 className={styles.title} data-animate="slide-up">
          {title}
        </h1>
        <p className={styles.body} data-animate="slide-up">
          {description}
        </p>
        <div className={styles.ctas} data-animate="slide-up">
          <Button variant="primary" href="/contact">
            Start a project
          </Button>
          <Button variant="secondary" href="/services">
            All services
          </Button>
        </div>
      </div>
    </section>
  )
}
