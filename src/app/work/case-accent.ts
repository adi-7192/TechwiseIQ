import type { SceneName } from '@/components/immersive/ImmersiveShell'

/**
 * Each case study earns its own visual treatment inside the shared immersive
 * world. `CASE_ACCENT` maps a slug to a signal-colour token name (from
 * globals `--tw-*`); `CASE_SCENE` maps a slug to the scene the ImmersiveShell
 * uses so the atmosphere glow matches the accent. New case studies fall back
 * to the acid / web scene.
 */
export const CASE_ACCENT: Record<string, string> = {
  'supreme-universal': 'acid', // commodity-trading signal (explicit, not fallback)
  'express-petroleum': 'orange', // energy / fuel signal
  rsight: 'blue', // night-lighting signal
  'aaskra-realty': 'orange', // warm, luxury real-estate signal
  'express-trade-financing': 'blue', // cool, institutional trade-finance signal
}

export const CASE_SCENE: Record<string, SceneName> = {
  'supreme-universal': 'web',
  'express-petroleum': 'apps',
  rsight: 'build',
  'aaskra-realty': 'apps',
  'express-trade-financing': 'build',
}
