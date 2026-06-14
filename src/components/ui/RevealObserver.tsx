'use client'

import { useReveal } from '@/hooks/useReveal'

/**
 * Renders nothing. Drop one instance near the top of any page that uses .rv elements.
 * Activates IntersectionObserver-based reveal animations via useReveal().
 */
export function RevealObserver() {
  useReveal()
  return null
}
