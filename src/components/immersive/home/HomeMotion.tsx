'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const FINE_POINTER = '(hover: hover) and (pointer: fine) and (min-width: 769px)'

/** Progressive enhancement for grouped reveals, proof depth, and restrained tilt. */
export default function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-home-experience]')
    if (!root) return

    const reduced = window.matchMedia(REDUCED_MOTION).matches
    root.dataset.homeMotion = reduced ? 'reduced' : 'active'
    if (reduced) return

    const pointerCleanups: Array<() => void> = []
    const context = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>('[data-home-reveal]')
      reveals.forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power3.out',
            clearProps: 'opacity,visibility,transform',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          },
        )
      })

      const proofs = gsap.utils.toArray<HTMLElement>('[data-home-proof]')
      proofs.forEach((proof) => {
        gsap.fromTo(
          proof,
          { yPercent: 1.6 },
          {
            yPercent: -1.6,
            ease: 'none',
            scrollTrigger: {
              trigger: proof.closest('[data-scene]') ?? proof,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
            },
          },
        )
      })

      const artifacts = gsap.utils.toArray<HTMLElement>('[data-home-artifact]')
      artifacts.forEach((artifact) => {
        const depth = Number(artifact.dataset.depth ?? 1)
        gsap.to(artifact, {
          y: -10 * depth,
          ease: 'none',
          scrollTrigger: {
            trigger: '#top',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      })

      if (window.matchMedia(FINE_POINTER).matches) {
        proofs.forEach((proof) => {
          const rotateX = gsap.quickTo(proof, 'rotationX', {
            duration: 0.45,
            ease: 'power3.out',
          })
          const rotateY = gsap.quickTo(proof, 'rotationY', {
            duration: 0.45,
            ease: 'power3.out',
          })
          const onMove = (event: PointerEvent) => {
            const rect = proof.getBoundingClientRect()
            const x = (event.clientX - rect.left) / rect.width - 0.5
            const y = (event.clientY - rect.top) / rect.height - 0.5
            rotateX(y * -3)
            rotateY(x * 3)
          }
          const onLeave = () => {
            rotateX(0)
            rotateY(0)
          }
          proof.addEventListener('pointermove', onMove, { passive: true })
          proof.addEventListener('pointerleave', onLeave)
          pointerCleanups.push(() => {
            proof.removeEventListener('pointermove', onMove)
            proof.removeEventListener('pointerleave', onLeave)
          })
        })

        const onArtifactMove = (event: PointerEvent) => {
          const x = event.clientX / window.innerWidth - 0.5
          artifacts.forEach((artifact) => {
            const depth = Number(artifact.dataset.depth ?? 1)
            gsap.to(artifact, {
              x: x * 9 * depth,
              duration: 0.55,
              ease: 'power3.out',
              overwrite: 'auto',
            })
          })
        }
        window.addEventListener('pointermove', onArtifactMove, {
          passive: true,
        })
        pointerCleanups.push(() =>
          window.removeEventListener('pointermove', onArtifactMove),
        )
      }
    }, root)

    ScrollTrigger.refresh()

    return () => {
      pointerCleanups.forEach((cleanup) => cleanup())
      context.revert()
      delete root.dataset.homeMotion
    }
  }, [])

  return null
}
