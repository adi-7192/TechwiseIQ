'use client'
import { useReveal } from '@/hooks/useReveal'

/**
 * Mounts the scroll-reveal IntersectionObserver for the current page.
 * Renders nothing. Drop one instance near the top of any page that uses .rv elements.
 */
export function RevealObserver() {
  useReveal()
  return null
}
