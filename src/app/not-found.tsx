import type { Metadata } from 'next'
import ImmersiveShell from '@/components/immersive/ImmersiveShell'
import SiteFooter from '@/components/global/SiteFooter'
import SiteHeader from '@/components/global/SiteHeader'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import styles from './not-found.module.css'

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: "This page doesn't exist. Or we murdered it.",
}

export default function NotFound() {
  return (
    <ImmersiveShell scene="advisory" withScene={false}>
      <SiteHeader />
      <main id="main" className={styles.main}>
        <div className={styles.inner}>
          <h1 className={styles.code}>404</h1>
          <p className={styles.message}>
            This page doesn&apos;t exist. Or we murdered it.
          </p>
          <div className={styles.actions}>
            <PrimaryCTA href="/">Go home</PrimaryCTA>
            <PrimaryCTA href="/services" variant="secondary">
              What we do
            </PrimaryCTA>
          </div>
        </div>
      </main>
      <SiteFooter />
    </ImmersiveShell>
  )
}
