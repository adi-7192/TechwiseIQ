import HomeHero from './HomeHero'
import ServiceStories from './ServiceStories'
import SelectedWork from './SelectedWork'
import OperatingModel from './OperatingModel'
import HomeMotion from './HomeMotion'
import styles from './studio.module.css'

export default function ImmersiveHome() {
  return (
    <div className={styles.experience} data-home-experience data-home-motion="static">
      <HomeMotion />
      <HomeHero />
      <ServiceStories />
      <SelectedWork />
      <OperatingModel />
    </div>
  )
}
