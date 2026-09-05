import HomeHero from './HomeHero'
import ServiceStories from './ServiceStories'
import SelectedWork from './SelectedWork'
import OperatingModel from './OperatingModel'
import HomeMotion from './HomeMotion'
import styles from './studio.module.css'

// Runs while the parser is still inside this div, so the pre-animation state in
// studio.module.css is in effect at first paint and the entry animations never
// show their finished frame first. Client-side navigations don't re-run inline
// scripts — HomeMotion's layout effect covers that case, before paint too.
//
// Skipped while the intro overlay is up (IntroPreloader's own bootstrap runs
// first and has already set html[data-intro]): the overlay is opaque and covers
// the viewport, so there is no flash to prevent — and arming the pre-state there
// would only withhold the hero copy from the first paint, which is what the
// browser measures as LCP. Hidden-behind-an-overlay is not worth paying for.
//
// Fails open: reduced motion never arms it, and a bundle that never boots gets
// the content back after 3s. Same idiom as IntroPreloader.tsx.
const motionBootstrap = `(function(){try{var e=document.currentScript.parentElement;if(!e||document.documentElement.dataset.intro==='loading'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;e.dataset.homeMotion='pending';setTimeout(function(){if(e.dataset.homeMotion==='pending')e.dataset.homeMotion='static'},3000)}catch(err){}})()`

export default function ImmersiveHome() {
  return (
    <div className={styles.experience} data-home-experience data-home-motion="static">
      <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      <HomeMotion />
      <HomeHero />
      <ServiceStories />
      <SelectedWork />
      <OperatingModel />
    </div>
  )
}
