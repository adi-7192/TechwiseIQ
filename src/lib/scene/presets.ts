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
}

export const DEFAULT_SCENE: SceneName = 'intro'

export const SCENE_PRESETS: Record<SceneName, ScenePreset> = {
  intro: { accent: 0x76967d, secondary: 0x283f34, particleDensity: 1, cameraZ: 8.5, objectScale: 1, atmosphere: 0.7 },
  web: { accent: 0xc8ff54, secondary: 0x355443, particleDensity: 1, cameraZ: 8.2, objectScale: 1.05, atmosphere: 0.8 },
  automation: { accent: 0x695cff, secondary: 0x322f66, particleDensity: 0.95, cameraZ: 8.4, objectScale: 1, atmosphere: 0.78 },
  apps: { accent: 0xff6540, secondary: 0x5d2d22, particleDensity: 0.9, cameraZ: 8.3, objectScale: 1.08, atmosphere: 0.76 },
  advisory: { accent: 0xc9ff59, secondary: 0x5b6d35, particleDensity: 1, cameraZ: 8.5, objectScale: 1, atmosphere: 0.8 },
  developer: { accent: 0x70a8ff, secondary: 0x203b63, particleDensity: 0.95, cameraZ: 8.6, objectScale: 1.02, atmosphere: 0.75 },
}

/** DOM `data-scene` strings may use "build" as an alias for developer. */
export function resolveSceneName(value: string | null | undefined): SceneName {
  if (!value) return DEFAULT_SCENE
  if (value === 'build') return 'developer'
  return (value in SCENE_PRESETS ? value : DEFAULT_SCENE) as SceneName
}
