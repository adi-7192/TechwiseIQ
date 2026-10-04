import { CAMERA_Z, COLOR_LINK, MOBILE_QUERY, NODES_DESKTOP, NODES_MOBILE, createField } from '@/lib/scene/field'
import styles from './HeroStage.module.css'

// A lightweight image, rendered into the initial HTML, rather than hundreds of
// SVG DOM nodes or another client bundle. The same vertices and perspective as
// WebGL keep the first frame consistent with the live field.
function poster(count: number, pointSize: number) {
  const { positions, colors, linkPositions } = createField(count)
  const focal = 500 / Math.tan(26 * Math.PI / 180)
  const number = (value: number) => value.toFixed(2)
  const project = (values: Float32Array, offset: number) => {
    const depth = CAMERA_Z - values[offset + 2]
    return [values[offset] * focal / depth, -values[offset + 1] * focal / depth, depth]
  }
  // Vertex colours are linear in Three.js; SVG colours are sRGB.
  const srgb = (value: number) => Math.round(255 * (
    value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055
  ))
  const nodes: string[] = []
  const links: string[] = []
  for (let i = 0; i < positions.length; i += 3) {
    const [x, y, depth] = project(positions, i)
    const size = Math.max(1, pointSize * 500 / depth)
    const color = colors.slice(i, i + 3).map(srgb).join(',')
    nodes.push(`<rect x="${number(x - size / 2)}" y="${number(y - size / 2)}" width="${number(size)}" height="${number(size)}" fill="rgb(${color})"/>`)
  }
  for (let i = 0; i < linkPositions.length; i += 6) {
    const [x1, y1] = project(linkPositions, i)
    const [x2, y2] = project(linkPositions, i + 3)
    links.push(`M${number(x1)},${number(y1)}L${number(x2)},${number(y2)}`)
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2000 -500 4000 1000"><g opacity=".9">${nodes.join('')}</g><path d="${links.join('')}" fill="none" stroke="#${COLOR_LINK.toString(16)}" stroke-opacity=".18"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const desktop = poster(NODES_DESKTOP, 0.042)
const mobile = poster(NODES_MOBILE, 0.034)

export default function HeroFieldPoster() {
  return (
    <picture className={styles.poster} data-hero-poster>
      <source media={MOBILE_QUERY} srcSet={mobile} />
      {/* Inline SVG is already optimized and must be available before hydration. */}
      <img src={desktop} width="4000" height="1000" alt="" loading="eager" />
    </picture>
  )
}
