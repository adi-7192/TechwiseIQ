/**
 * Scene presets for the persistent WebGL atmosphere (docs/04_MOTION_AND_3D_SPEC.md).
 * Each chapter publishes its scene name via `data-scene`; the engine interpolates
 * toward the matching preset. Colours mirror the design-system scene logic:
 * intro = muted green/graphite, web = acid, automation = violet, apps = orange,
 * advisory = acid/olive, developer/build = cool blue.
 */

export type SceneName =
  | 'intro'
  | 'web'
  | 'automation'
  | 'apps'
  | 'advisory'
  | 'developer'

export type ScenePreset = {
  /** Point-field tint (hex int). Kept muted — never neon. */
  accent: number
  /** Wireframe form colour (hex int). */
  secondary: number
  /** 0–1 multiplier on the visible point count. */
  particleDensity: number
  /** Camera distance on Z. */
  cameraZ: number
  /** Generative-form scale. */
  objectScale: number
  /** 0–1 overall opacity/energy of the field. */
  atmosphere: number
  /**
   * Where the interface composition sits, in world units, so it stays out of
   * the chapter's copy column. Positive X is right of centre. Chapters that
   * put their copy on the left push the scene right, and vice versa.
   */
  offsetX: number
  offsetY: number
  /**
   * Line opacity for the interface panels. Sparse chapters (hero, work,
   * operating model) have room for the composition and carry it; the dense
   * two-column service chapters already lead with a foreground proof object,
   * so the scene recedes to a texture rather than competing with it.
   */
  wireOpacity: number
}

export const DEFAULT_SCENE: SceneName = 'intro'

export const SCENE_PRESETS: Record<SceneName, ScenePreset> = {
  // Hero and the wide left-aligned chapters (selected work, operating model)
  // keep their copy on the left, so the composition sits low and right of it.
  intro: { accent: 0x8fb39a, secondary: 0x4c7360, particleDensity: 1, cameraZ: 8.5, objectScale: 0.85, atmosphere: 0.82, offsetX: 4.3, offsetY: -1.05, wireOpacity: 0.45 },
  web: { accent: 0xc8ff54, secondary: 0x5f9470, particleDensity: 1, cameraZ: 8.2, objectScale: 1, atmosphere: 0.95, offsetX: 3, offsetY: 0.2, wireOpacity: 0.3 },
  automation: { accent: 0x7d72ff, secondary: 0x5b55a8, particleDensity: 0.98, cameraZ: 8.4, objectScale: 0.98, atmosphere: 0.92, offsetX: 3, offsetY: 0.2, wireOpacity: 0.3 },
  // Custom software is the one chapter that flips its layout: copy on the right.
  apps: { accent: 0xff6540, secondary: 0x9a4c35, particleDensity: 0.94, cameraZ: 8.3, objectScale: 1, atmosphere: 0.9, offsetX: -3, offsetY: 0.2, wireOpacity: 0.3 },
  advisory: { accent: 0xd0ff68, secondary: 0x8b9e57, particleDensity: 1, cameraZ: 8.5, objectScale: 0.98, atmosphere: 0.95, offsetX: 2.8, offsetY: 0, wireOpacity: 0.5 },
  developer: { accent: 0x70a8ff, secondary: 0x3d6aa4, particleDensity: 0.98, cameraZ: 8.6, objectScale: 1, atmosphere: 0.9, offsetX: 2.8, offsetY: 0, wireOpacity: 0.5 },
}

/** DOM `data-scene` strings may use "build" as an alias for developer. */
export function resolveSceneName(value: string | null | undefined): SceneName {
  if (!value) return DEFAULT_SCENE
  if (value === 'build') return 'developer'
  return (value in SCENE_PRESETS ? value : DEFAULT_SCENE) as SceneName
}
