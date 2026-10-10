import HomeHero from './HomeHero'
import ServiceStories from './ServiceStories'
import SelectedWork from './SelectedWork'
import OperatingModel from './OperatingModel'
import HomeMotion from './HomeMotion'
import CursorGlow from './CursorGlow'
import SceneLoader from '@/components/immersive/SceneLoader'
import styles from './studio.module.css'

// Runs while the parser is still inside this div, so the scroll reveals' start
// frame is in effect at first paint and they never show their finished state
// first. Client-side navigations don't re-run inline scripts — HomeMotion's
// layout effect covers that case, before paint too.
//
// This only affects below-the-fold content: the hero animates itself in CSS and
// is never hidden waiting on the bundle.
//
// Fails open: reduced motion never arms it, and a bundle that never boots gets
// the content back after 3s. Same idiom as IntroPreloader.tsx.
const motionBootstrap = `(function(){try{var e=document.currentScript.parentElement;if(!e||matchMedia('(prefers-reduced-motion: reduce)').matches)return;e.dataset.homeMotion='pending';setTimeout(function(){if(e.dataset.homeMotion==='pending')e.dataset.homeMotion='static'},3000)}catch(err){}})()`

const CHAPTERS = [
  ['top', 'Intro'],
  ['websites', 'Websites'],
  ['apps', 'Software'],
  ['automation', 'Automation'],
  ['selected-work', 'Work'],
] as const

export default function ImmersiveHome() {
  return (
    // The inline script below sets data-home-motion before hydration on purpose.
    <div className={styles.experience} data-home-experience data-home-motion="static" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      <HomeMotion />
      {/* One fixed WebGL layer behind the whole page (D-039); sections sit above it. */}
      <SceneLoader className={styles.sceneLayer} />
      <CursorGlow />
      <HomeHero />
      {/* Straight after the hero so it is early in the tab order (UX 13.1). */}
      <nav aria-label="Page chapters" className={styles.pillNav}>
        {CHAPTERS.map(([id, label]) => (
          <a key={id} href={`#${id}`} data-nav={id}>
            {label}
          </a>
        ))}
      </nav>
      <ServiceStories />
      <SelectedWork />
      <OperatingModel />
    </div>
  )
}
