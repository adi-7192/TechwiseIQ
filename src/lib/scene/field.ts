// Shared deterministic geometry for the first-paint poster and live WebGL field.
export const NODES_DESKTOP = 900
export const NODES_MOBILE = 300
/** Nodes per cluster: one anchor plus five satellites drawn around it. */
export const CLUSTER = 6
export const MOBILE_QUERY = '(max-width: 768px), (pointer: coarse)'

/** Field extents in world units. Depth is what sells the parallax. */
const SPAN_X = 26
const SPAN_Y = 16
export const DEPTH = 22

/** Muted graphite-green at rest, acid only on the few live nodes. */
const COLOR_NODE = 0x8fb39a
const COLOR_LIVE = 0xc8ff54
export const COLOR_LINK = 0x4c7360

export const CAMERA_Z = 6.4

/** Deterministic pseudo-random — stable across hydration, reload and SSR. */
function rand(index: number, salt: number) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453
  return value - Math.floor(value)
}

export function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value
}

/**
 * Clustered lattice: every group of `CLUSTER` nodes is one anchor plus
 * satellites scattered around it, with two links back to the anchor. The
 * result reads as connected systems receding into depth rather than as an
 * even spray of dust.
 *
 * Vertex colour carries both the depth falloff and the centre "well" that
 * keeps hero copy legible, so no CSS overlay gradient is required.
 */
export function createField(count: number) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const links: number[] = []

  // Unpack the two base tints once. Building this field runs on the main
  // thread right after hydration, so the per-node path stays allocation-free
  // (no Color instances, no clone/multiplyScalar) and never becomes a long task.
  const nodeR = ((COLOR_NODE >> 16) & 255) / 255
  const nodeG = ((COLOR_NODE >> 8) & 255) / 255
  const nodeB = (COLOR_NODE & 255) / 255
  const liveR = ((COLOR_LIVE >> 16) & 255) / 255
  const liveG = ((COLOR_LIVE >> 8) & 255) / 255
  const liveB = (COLOR_LIVE & 255) / 255

  let anchorX = 0
  let anchorY = 0
  let anchorZ = 0

  for (let i = 0; i < count; i++) {
    const slot = i % CLUSTER
    let x: number
    let y: number
    let z: number

    if (slot === 0) {
      anchorX = (rand(i, 2) - 0.5) * SPAN_X
      anchorY = (rand(i, 3) - 0.5) * SPAN_Y
      anchorZ = -rand(i, 4) * DEPTH
      x = anchorX
      y = anchorY
      z = anchorZ
    } else {
      // Satellites stay inside a small radius so clusters read as one object.
      x = anchorX + (rand(i, 5) - 0.5) * 2.4
      y = anchorY + (rand(i, 6) - 0.5) * 2.4
      z = anchorZ + (rand(i, 7) - 0.5) * 1.8
      if (slot <= 2) {
        links.push(anchorX, anchorY, anchorZ, x, y, z)
      }
    }

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    // Depth falloff: the far end of the corridor fades toward the background.
    const depth = clamp01(-z / DEPTH)
    const depthFade = 1 - depth * 0.72
    const nearness = 1 - depth

    // Soft well through the middle of the near layers, where the h1 sits.
    const nx = x / (SPAN_X * 0.5)
    const ny = y / (SPAN_Y * 0.5)
    const radial = Math.min(1, Math.sqrt(nx * nx + ny * ny) / 0.6)
    const legibility = 1 - nearness * (1 - radial) * 0.85

    const shade = depthFade * legibility
    // A sparse minority of nodes carry the acid signal; the rest stay muted.
    const isLive = slot === 0 && rand(i, 8) > 0.86
    const level = isLive ? Math.min(1, shade * 1.25) : shade
    const offset = i * 3
    colors[offset] = (isLive ? liveR : nodeR) * level
    colors[offset + 1] = (isLive ? liveG : nodeG) * level
    colors[offset + 2] = (isLive ? liveB : nodeB) * level
  }

  return { positions, colors, linkPositions: new Float32Array(links) }
}

