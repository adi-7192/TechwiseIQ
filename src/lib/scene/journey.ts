// The Home journey: one camera path through the skyline, a stop per section
// (docs/design-system.md, "Home journey"; D-039). Pure numbers, no three.js, so
// it is unit-testable and cheap to import.

type Vec3 = readonly [number, number, number]

export type Stop = {
  /** 0 = city origin, 1 web, 2 software, 3 AI: pos/look are relative to that district. */
  focus: 0 | 1 | 2 | 3
  pos: Vec3
  look: Vec3
  /** Final colour scale: 1 in open sections, lower behind dense content. */
  exposure: number
  /** Copy-side dimming: -1 copy on the left, +1 on the right, 0 centred (no well = wellStrength 0). */
  wellSide: number
  wellStrength: number
  /** Screen height (0 bottom → 1 top) where the well fades out; >1 covers the full height. */
  wellTop: number
  /** Cursor light colour (linear-ish rgb 0–1), height above ground and power. */
  light: Vec3
  lightHeight: number
  lightPower: number
  /** Glow strength of the web, software and AI districts. */
  districts: Vec3
  /** Breathing towers and camera sway (1 in the hero and finale). */
  ambient: number
}

const ACID: Vec3 = [0.784, 1, 0.329]
const ORANGE: Vec3 = [1, 0.396, 0.251]
const VIOLET: Vec3 = [0.545, 0.502, 1]

export const STOP_NAMES = ['hero', 'services', 'websites', 'apps', 'automation', 'work', 'model', 'finale'] as const
export type StopName = (typeof STOP_NAMES)[number]

const base = { wellSide: 0, wellStrength: 0, wellTop: 1.2, light: ACID, lightHeight: 1.4, lightPower: 1, districts: [0, 0, 0] as Vec3, ambient: 0.35 }

export const STOPS: Record<StopName, Stop> = {
  // Street level, copy centred over the city.
  hero: { ...base, focus: 0, pos: [0, 3.6, 15.5], look: [0, 1.6, -6], exposure: 1, wellSide: 0, wellStrength: 0.8, wellTop: 0.9, ambient: 1 },
  // The climb ends on a map: three districts glow faintly — "three ways forward".
  services: { ...base, focus: 0, pos: [0, 19, 2.5], look: [0, 0, -3.5], exposure: 0.3, wellSide: -1, wellStrength: 0.7, lightHeight: 3, lightPower: 1.6, districts: [0.45, 0.45, 0.45], ambient: 0.3 },
  // Each service flies to its district; the well sits behind the thesis, set right.
  websites: { ...base, focus: 1, pos: [-3, 5.5, 10], look: [-3.5, 0.5, 0], exposure: 0.22, wellSide: 1, wellStrength: 0.8, lightHeight: 2, lightPower: 1.3, districts: [1, 0.12, 0.12] },
  apps: { ...base, focus: 2, pos: [4, 6, 9], look: [3.5, 0.5, 0], exposure: 0.22, wellSide: 1, wellStrength: 0.8, light: ORANGE, lightHeight: 2, lightPower: 1.3, districts: [0.12, 1, 0.12] },
  automation: { ...base, focus: 3, pos: [-4, 7, 9], look: [-3.5, 0.5, 0], exposure: 0.28, wellSide: 1, wellStrength: 0.8, light: VIOLET, lightHeight: 2, lightPower: 1.3, districts: [0.12, 0.12, 1] },
  // Dense cards: a high, quiet overview.
  work: { ...base, focus: 0, pos: [0, 24, 10], look: [0, 0, -4], exposure: 0.4, lightHeight: 4, lightPower: 2, districts: [0.35, 0.35, 0.35], ambient: 0.2 },
  model: { ...base, focus: 0, pos: [14, 12, 16], look: [0, 0, -5], exposure: 0.3, lightHeight: 3, lightPower: 1.6, districts: [0.25, 0.25, 0.25], ambient: 0.2 },
  // Back down to the street, facing the needle: "Let's build what's next." (centred CTA)
  finale: { ...base, focus: 1, pos: [-4, 1.6, 12], look: [0, 4, -1], exposure: 1, wellSide: 0, wellStrength: 0.6, districts: [0.6, 0.6, 0.6], ambient: 1 },
}

/**
 * Portrait screens (phones): copy runs the full width, so a side well cannot
 * protect it. The hero is framed closer with a softer centred well, and every
 * later section runs at a low exposure instead (§8 contrast sweep: muted body
 * text needs a near-black backdrop).
 */
export function portraitStop(name: StopName, closeHero = true): Stop {
  const stop = STOPS[name]
  if (name === 'hero') return closeHero ? { ...stop, pos: [0, 3.4, 9.5], look: [0, 3.6, -6], wellStrength: 0.45 } : stop
  return { ...stop, wellStrength: 0, exposure: name === 'finale' ? 0.6 : Math.min(stop.exposure, 0.18) }
}

/** Flat parameter layout shared by the sampler and the engine's damped state. */
export const P = {
  pos: 0, look: 3, exposure: 6, wellSide: 7, wellStrength: 8, wellTop: 9,
  light: 10, lightHeight: 13, lightPower: 14, districts: 15, ambient: 18,
} as const
export const PARAM_COUNT = 19

/** Resolve a stop to absolute world numbers, given the district centres (x, z). */
export function flatten(stop: Stop, centres: readonly (readonly [number, number])[]) {
  const [cx, cz] = stop.focus ? centres[stop.focus - 1] : [0, 0]
  const out = new Float32Array(PARAM_COUNT)
  out.set([stop.pos[0] + cx, stop.pos[1], stop.pos[2] + cz], P.pos)
  out.set([stop.look[0] + cx, stop.look[1], stop.look[2] + cz], P.look)
  out.set([stop.exposure, stop.wellSide, stop.wellStrength, stop.wellTop], P.exposure)
  out.set(stop.light, P.light)
  out.set([stop.lightHeight, stop.lightPower], P.lightHeight)
  out.set(stop.districts, P.districts)
  out[P.ambient] = stop.ambient
  return out
}

/**
 * Blend between the stops around scroll position `y`. `anchors` are the scroll
 * positions where each stop is fully reached (ascending). The camera rests on a
 * stop for the first part of each segment, then eases to the next — so a reader
 * sees a settled view while reading and a smooth move between sections.
 */
export const HOLD = 0.35
export function sampleJourney(stops: readonly Float32Array[], anchors: readonly number[], y: number, out: Float32Array) {
  const last = stops.length - 1
  let i = 0
  while (i < last && y >= anchors[i + 1]) i++
  if (i === last || y <= anchors[0]) {
    out.set(stops[y <= anchors[0] ? 0 : last])
    return out
  }
  const span = anchors[i + 1] - anchors[i]
  const t = Math.min(1, Math.max(0, ((y - anchors[i]) / span - HOLD) / (1 - HOLD)))
  const e = t * t * (3 - 2 * t)
  const a = stops[i]
  const b = stops[i + 1]
  for (let k = 0; k < PARAM_COUNT; k++) out[k] = a[k] + (b[k] - a[k]) * e
  return out
}
