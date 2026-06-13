import Link from 'next/link'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        Techwise<span className={styles.accent}>IQ</span>
      </Link>
      <Link href="/contact" className={styles.cta}>
        Start a project
      </Link>
    </nav>
  )
}
