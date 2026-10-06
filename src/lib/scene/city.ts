// Hero skyline layout: pure and deterministic, so every load (and every test)
// sees the same city. The engine turns it into one instanced mesh.

export const MOBILE_QUERY = '(max-width: 768px), (pointer: coarse)'

/** Towers per side. Phones get under half the desktop city. */
export const GRID_DESKTOP = { cols: 64, rows: 40 } as const
export const GRID_MOBILE = { cols: 40, rows: 28 } as const
export const TOWERS_DESKTOP = GRID_DESKTOP.cols * GRID_DESKTOP.rows
export const TOWERS_MOBILE = GRID_MOBILE.cols * GRID_MOBILE.rows

/** Spacing between tower centres, in world units. */
export const GAP = 0.44
/** The needle tower: the one landmark in the skyline. */
export const NEEDLE_HEIGHT = 8.5
/** Seconds for the rise to sweep from the centre to the outer edge. */
export const RISE_SPREAD = 1.6

function rand(index: number, salt: number) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453
  return value - Math.floor(value)
}

/**
 * One entry per tower: ground position (x, z), final height, rise delay
 * (seconds, by distance from the centre) and whether its roof carries a beacon.
 *
 * Low-rise noise everywhere, a dense downtown and one needle. Downtown sits to
 * the right of centre on landscape screens so it frames the left-aligned
 * headline instead of standing behind it; portrait screens keep it nearer the
 * middle, under the copy.
 */
export function createCity(mobile: boolean, portrait: boolean) {
  const { cols, rows } = mobile ? GRID_MOBILE : GRID_DESKTOP
  const downtownX = portrait ? 1.5 : 5
  const count = cols * rows
  const x = new Float32Array(count)
  const z = new Float32Array(count)
  const height = new Float32Array(count)
  const delay = new Float32Array(count)
  const beacon = new Float32Array(count)
  const maxReach = Math.hypot(cols / 2, rows / 2)
  let needle = 0
  let needleDistance = Infinity

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c
      const tx = (c - (cols - 1) / 2) * GAP
      const tz = (r - (rows - 1) / 2) * GAP - 3
      const dx = tx - downtownX
      const downtown = Math.exp(-((dx * dx) / 16 + ((tz + 6) * (tz + 6)) / 10))
      const toNeedle = Math.hypot(dx, tz + 7)
      if (toNeedle < needleDistance) {
        needle = i
        needleDistance = toNeedle
      }

      x[i] = tx
      z[i] = tz
      height[i] = 0.12 + rand(i, 1) ** 3 * 1.2 + downtown * (1.2 + rand(i, 2) ** 2 * 4.2)
      delay[i] = (Math.hypot(c - cols / 2, r - rows / 2) / maxReach) * RISE_SPREAD
      beacon[i] = rand(i, 3) > 0.9 && height[i] > 0.9 ? 1 : 0
    }
  }
  // Exactly one needle: the tower nearest the downtown landmark spot.
  height[needle] = NEEDLE_HEIGHT
  return { cols, rows, count, x, z, height, delay, beacon }
}
