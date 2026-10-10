'use client'

/*
 * /about motion (D-041; spec docs/specs/10.1-about.md V10 + UX U2–U6, which win).
 * Progressive enhancement over the server markup in index.tsx, which is already
 * the final state. Rules this file keeps:
 *  - opacity + transform + stroke-dash only. Never autoAlpha/visibility, so every
 *    element stays in the accessibility tree and focusable (UX U2/U3).
 *  - one gsap.matchMedia(); its cleanup removes data-process-pinned /
 *    data-step-active and restores every count-up digit (revert can't undo text).
 *  - "already in view is final": once-reveals and counts whose element is already
 *    on screen or above it at build get no tween at all (scroll restoration, late
 *    hydration after the 3s fail-open). A trigger the page jumps past later also
 *    finishes instantly.
 *  - no Lenis calls, no preventDefault, no scrollerProxy, no snap.
 *  - the pin's fit guard (UX U3) re-checks after every ScrollTrigger refresh (zoom
 *    and resize trigger one) and after a font load. A stage that stops fitting
 *    rebuilds the whole run stacked (M10), once per visit: noFit never resets.
 */
import { useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// Same as HomeMotion: a mobile URL-bar resize must not force a full refresh
// mid-scroll. The pin never arms on touch devices, so nothing here depends on it.
ScrollTrigger.config({ ignoreMobileResize: true })

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const REDUCE = '(prefers-reduced-motion: reduce)'
const MOTION = '(prefers-reduced-motion: no-preference)'
const PIN = '(min-width: 1024px) and (min-height: 720px) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
const DEPTH = '(min-width: 768px) and (prefers-reduced-motion: no-preference)'
const QUERIES = { reduce: REDUCE, motion: MOTION, pin: PIN, depth: DEPTH }

// Token timing (design-system §5): micro 220ms, component 600ms, chapter 900ms.
const MICRO = 0.22
const COMPONENT = 0.6
const CHAPTER = 0.9
const EASE = 'expo.out' // cubic-bezier(.16, 1, .3, 1)

const REVEAL_CLEAR = 'opacity,transform'
// A factory: gsap.set() writes duration/repeat into its vars, so never share one object.
const drawFrom = () => ({ strokeDasharray: 1, strokeDashoffset: 1 })
const DRAW_CLEAR = 'strokeDasharray,strokeDashoffset'

/** The 03 pin: 30 timeline units across 3 viewport heights (UX U3 reference timeline). */
const PIN_UNITS = 30
/** Crossfade midpoints: which step is "active" for data-step-active. */
const STEP_SWITCH = [4.25, 14.75, 25.25]
/** Fit-guard rebuild: at most ~1s (60 frames at 60Hz) waiting for a Lenis ease to land. */
const MAX_LENIS_WAIT = 60

type Anim = gsap.core.Animation

/** The final value, kept on data-count by the server markup. */
const finalCount = (el: HTMLElement) => el.dataset.count ?? ''

/** On screen or above it: nothing to reveal, show the final state. */
const inView = (el: Element) => el.getBoundingClientRect().top < window.innerHeight

/**
 * Pinned-stage fit after a refresh. Layout height, not scrollHeight: the hidden
 * steps sit at y: 24, and transformed children inflate scrollHeight. While the
 * pin is active GSAP fixes the stage's height to the natural height it measured
 * during that refresh (pin reverted, in flow), so this is valid pinned or not.
 * +1: GSAP ceils that height, and 100svh can be fractional when zoomed.
 */
const stageFits = (stage: HTMLElement) => stage.offsetHeight <= window.innerHeight + 1

export default function AboutMotion() {
  useIsomorphicLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-about-experience]')
    if (!root) return
    const all = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = root) =>
      Array.from(scope.querySelectorAll<T>(selector))
    const one = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = root) =>
      scope.querySelector<T>(selector)

    // Client-side navigation: the inline bootstrap doesn't re-run, so hold the
    // start frame here. Still before paint (layout effect). Reduced motion never arms it.
    if (!window.matchMedia(REDUCE).matches) root.dataset.aboutMotion = 'pending'

    // Once-triggers that have fired (or were finished by focus). Held outside the
    // matchMedia run, so a rebuild keeps them final even when they sit below the
    // viewport again ("already passed is final", with inView covering the rest).
    const done = new WeakSet<Element>()
    const settled = (el: Element) => done.has(el) || inView(el)

    // Focus safety net (UX U2): a focused element inside an unfinished reveal
    // finishes that reveal at once. Rebuilt on every matchMedia run.
    let registry = new WeakMap<Element, Anim>()
    const onFocusIn = (event: FocusEvent) => {
      for (let el = event.target as Element | null; el && el !== root; el = el.parentElement) {
        const anim = registry.get(el)
        if (anim && anim.progress() < 1) {
          const trigger = anim.scrollTrigger?.trigger
          if (trigger) done.add(trigger)
          anim.scrollTrigger?.kill(false, true)
          anim.progress(1)
        }
      }
    }
    root.addEventListener('focusin', onFocusIn)

    let refreshFrame = 0
    // Set once the pinned stage stops fitting the viewport (zoom, late font).
    // Sticky for this visit, so a pin/stack rebuild can never loop.
    let noFit = false
    let rebuildFrame = 0
    let media = gsap.matchMedia()
    /**
     * Tear the run down and build it again; with noFit set it comes back stacked.
     * `settle` runs between the two, on the final unpinned layout, so the new run's
     * inView checks see the scroll position the visitor ends up at.
     */
    const restack = (settle?: () => void) => {
      media.revert()
      settle?.()
      media = gsap.matchMedia()
      media.add(QUERIES, run, root)
    }

    const run = (context: gsap.Context) => {
      const { reduce, pin, depth } = context.conditions ?? {}
      if (reduce) {
        // Final markup as served: no tweens, no pin, no drift, digits untouched.
        root.dataset.aboutMotion = 'reduced'
        return
      }

      let live = true
      const counts = all('[data-count]')
      const process = one('[data-process]')
      const stage = one('[data-process-stage]')
      const steps = all('[data-step]')

      /** A once-trigger that finishes instantly when the page jumps past it. */
      const once = (trigger: Element, start: string): ScrollTrigger.Vars => ({
        trigger,
        start,
        once: true,
        onEnter: (self) => {
          if (self.trigger) done.add(self.trigger)
          if (self.trigger && self.trigger.getBoundingClientRect().bottom < 0) self.animation?.progress(1)
        },
      })
      const track = (anim: Anim, ...elements: Element[]) => elements.forEach((el) => registry.set(el, anim))

      /** M2: opacity + y reveal, one synchronous fromTo per element. */
      const reveal = (el: HTMLElement, start = 'top 88%', y = 28) => {
        if (settled(el)) return
        track(
          gsap.fromTo(
            el,
            { opacity: 0, y },
            { opacity: 1, y: 0, duration: COMPONENT, ease: EASE, clearProps: REVEAL_CLEAR, scrollTrigger: once(el, start) }
          ),
          el
        )
      }
      const draw = (paths: Element[], vars: gsap.TweenVars = {}) => [
        paths,
        drawFrom(),
        { strokeDashoffset: 0, duration: MICRO, ease: EASE, clearProps: DRAW_CLEAR, ...vars },
      ] as const

      // M1: scroll-lit words. Opacity on the spans only, never the h2/em (UX U6).
      const title = one('#short-version-title')
      const words = all('[data-lit-word]')
      if (title && words.length) {
        gsap.fromTo(
          words,
          { opacity: 0.45 },
          {
            opacity: 1,
            duration: 1,
            stagger: 0.6,
            ease: 'none',
            scrollTrigger: { trigger: title, start: 'top 85%', end: 'bottom 40%', scrub: true },
          }
        )
      }

      // M2: single reveals (01 body, 02 head copy, 04 head, 05 head, CTA).
      const special = '[data-totals], [data-card], [data-commitment], [data-path], [data-process] [data-about-reveal]'
      all('[data-about-reveal]')
        .filter((el) => !el.matches(special))
        .forEach((el) => reveal(el))

      // M3 + M3b: route line draws, then the remote node fades in.
      const map = one('[data-route-map]')
      if (map && !settled(map)) {
        const tl = gsap.timeline({ scrollTrigger: once(map, 'top 80%') })
        tl.fromTo(...draw(all('[data-draw]', map), { duration: CHAPTER }), 0)
        const remote = all('[data-map-remote]', map)
        if (remote.length) {
          tl.fromTo(
            remote,
            { opacity: 0, scale: 0.6 },
            { opacity: 1, scale: 1, transformOrigin: '50% 50%', duration: MICRO, ease: EASE, clearProps: 'opacity,transform,transformOrigin' },
            0.75
          )
        }
        track(tl, map)
      }

      // M4: totals reveal + count-up (aria-hidden digits only; sr-only stays final).
      const totals = one('[data-totals]')
      if (totals && !settled(totals)) {
        const finals = counts.map(finalCount)
        counts.forEach((el, i) => (el.textContent = finals[i].replace(/\d+/g, '0')))
        const progress = { p: 0 }
        const tl = gsap.timeline({ scrollTrigger: once(totals, 'top 85%') })
        tl.fromTo(totals, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: COMPONENT, ease: EASE, clearProps: REVEAL_CLEAR }, 0)
        tl.to(
          progress,
          {
            p: 1,
            duration: CHAPTER,
            ease: EASE,
            onUpdate: () => {
              if (!live) return
              counts.forEach((el, i) => {
                el.textContent = finals[i].replace(/\d+/g, (n) => String(Math.round(Number(n) * progress.p)))
              })
            },
          },
          0
        )
        track(tl, totals)
      }

      // M5: cards, one fromTo each; later cards in a group trail slightly.
      all('[data-card]').forEach((card) => {
        const li = card.parentElement
        const position = li ? Array.from(li.parentElement?.children ?? []).indexOf(li) : 0
        if (settled(card)) return
        track(
          gsap.fromTo(
            card,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: COMPONENT,
              ease: EASE,
              delay: (position % 3) * 0.08, // stagger within each row of three
              clearProps: REVEAL_CLEAR,
              scrollTrigger: once(card, 'top 88%'),
            }
          ),
          card
        )
      })

      // M6: cover depth on the wrapper (the img keeps its own hover scale; D-008).
      if (depth) {
        all('[data-cover-depth]').forEach((wrapper) => {
          gsap.fromTo(
            wrapper,
            { yPercent: -3, scale: 1.06 },
            {
              yPercent: 3,
              scale: 1.06,
              ease: 'none',
              scrollTrigger: { trigger: wrapper.parentElement ?? wrapper, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          )
        })
      }

      // M7: ledger rows, then each row's check.
      const ledger = one('[data-commitment]')?.parentElement
      const rows = all('[data-commitment]')
      if (ledger && !settled(ledger)) {
        const tl = gsap.timeline({ scrollTrigger: once(ledger, 'top 85%') })
        tl.fromTo(rows, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: COMPONENT, ease: EASE, stagger: 0.08, clearProps: REVEAL_CLEAR }, 0)
        tl.fromTo(...draw(rows.flatMap((row) => all('[data-draw]', row)), { stagger: 0.12 }), 0.3)
        track(tl, ...rows)
      }

      // M8: service rows.
      const paths = all('[data-path]')
      const pathList = paths[0]?.parentElement
      if (pathList && !settled(pathList)) {
        track(
          gsap.fromTo(
            paths,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: COMPONENT,
              ease: EASE,
              stagger: 0.1,
              clearProps: REVEAL_CLEAR,
              scrollTrigger: once(pathList, 'top 88%'),
            }
          ),
          ...paths
        )
      }

      // M9: the pinned 03 sequence. Only while 03 is still below the viewport and
      // the stage has never failed the fit guard this visit (noFit):
      // arming it adds the pin spacer and the pinned layout, which must never
      // shift content the visitor is looking at (CLS, scroll restored below 03).
      let pinned = false
      let onRefresh: (() => void) | null = null
      const onFonts = () => {
        // A late font can make the stage taller without a resize: refresh, which
        // re-measures the pin and fires onRefresh.
        if (live && pinned && !noFit) ScrollTrigger.refresh()
      }
      if (pin && !noFit && process && stage && steps.length === 4 && !inView(process)) {
        process.setAttribute('data-process-pinned', '')
        // Runtime fit guard (UX U3): a stage taller than the viewport would clip.
        // stageFits (layout height), superseding the U3 spec's scrollHeight wording.
        if (!stageFits(stage)) process.removeAttribute('data-process-pinned')
        else pinned = true
      }

      if (pinned && stage) {
        const railFill = one('[data-rail-fill]', stage)
        const railChecks = all('[data-rail-node] [data-draw]', stage)
        const frameChecks = steps.map((step) => all('[data-step-frame] [data-draw]', step))
        let active = 0
        const setActive = (index: number) => {
          steps.forEach((step, i) => step.toggleAttribute('data-step-active', i === index))
          active = index
        }
        setActive(0)

        // Start frame. Opacity + y only: hidden steps stay in the accessibility tree.
        gsap.set(steps.slice(1), { opacity: 0, y: 24 })
        gsap.set(railFill, { scaleX: 0 })
        gsap.set([...railChecks, ...frameChecks[2], ...frameChecks[3]], drawFrom())

        const tl = gsap.timeline({
          defaults: { ease: 'none', immediateRender: false },
          scrollTrigger: {
            trigger: stage,
            pin: stage,
            pinSpacing: true,
            start: 'top top',
            end: '+=300%',
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const t = self.progress * PIN_UNITS
              const index = STEP_SWITCH.filter((at) => t >= at).length
              if (index !== active) setActive(index)
            },
          },
        })
        tl.fromTo(railFill, { scaleX: 0 }, { scaleX: 1, duration: PIN_UNITS }, 0)

        const drawAt = (paths: Element[], at: number, duration: number, stagger = 0) => {
          if (paths.length) tl.fromTo(paths, drawFrom(), { strokeDashoffset: 0, duration, stagger }, at)
        }
        // Inside each 1.5-unit window the outgoing step leaves first and the incoming
        // one follows (0.3 units of overlap, both under 0.35 opacity): two full-strength
        // texts never share the grid cell, so the midpoint stays legible.
        const crossfade = (from: number, at: number) => {
          tl.fromTo(steps[from], { opacity: 1, y: 0 }, { opacity: 0, y: -24, duration: 0.9 }, at)
          tl.fromTo(steps[from + 1], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9 }, at + 0.6)
          drawAt(railChecks.slice(from, from + 1), at, 1.5)
        }
        crossfade(0, 3.5) // step 1 holds 0–3.5
        crossfade(1, 14) // step 2 holds 5–14
        drawAt(frameChecks[2], 16, 1.5) // "Approved"
        crossfade(2, 24.5) // step 3 holds 15.5–24.5
        const log = frameChecks[3]
        drawAt(log, 26.3, 0.8, log.length > 1 ? 1.4 / (log.length - 1) : 0) // ends at 28.5
        drawAt(railChecks.slice(3, 4), 28.5, 1) // 29.5–30: hold, everything complete

        // Fit guard, continued (UX U3): zoom or a late font can make the pinned
        // stage taller than the viewport, which clips its bottom with no way to
        // scroll to it. Checked after every refresh (resize/zoom fires one). A
        // stage that still fits never rebuilds, mid-pin or not.
        const st = tl.scrollTrigger
        onRefresh = () => {
          if (!live || noFit || rebuildFrame || stageFits(stage)) return
          noFit = true
          let waited = 0
          const rebuild = () => {
            rebuildFrame = 0
            if (!live) return
            // N5: while Lenis is easing it writes the scroll position every frame and
            // would overwrite the compensation below, so wait for it to land. Bounded
            // (MAX_LENIS_WAIT frames) so a long fling can't keep the stage clipped.
            // `lenis-smooth`, not `lenis-scrolling`: the latter also covers Lenis's
            // passive "native" state, which never writes the scroll position and in
            // Lenis 1.3.26 can stay set after a zero-velocity scroll event.
            if (document.documentElement.classList.contains('lenis-smooth') && waited++ < MAX_LENIS_WAIT) {
              rebuildFrame = requestAnimationFrame(rebuild)
              return
            }
            // Keep what the visitor is looking at in place: the active step mid-pin,
            // the end of 03 once past it (the 300% spacer above them collapses).
            // Before the pin, everything that changes is at or below 03's top.
            const progress = st?.progress ?? 0
            const anchor = progress <= 0 ? null : progress < 1 ? steps[active] : process
            const edge = progress < 1 ? 'top' : 'bottom'
            const before = anchor?.getBoundingClientRect()[edge] ?? 0
            // Steps already shown in the pin stay final in the stacked build.
            if (progress > 0) steps.slice(0, progress < 1 ? active + 1 : steps.length).forEach((step) => done.add(step))
            restack(() => {
              if (!anchor) return
              const shift = anchor.getBoundingClientRect()[edge] - before
              if (Math.abs(shift) < 1) return
              // B2: one instant jump. globals.css sets html { scroll-behavior: smooth }
              // (Lenis only overrides it mid-ease), which would animate the
              // compensation: a visible multi-viewport glide nobody asked for.
              const html = document.documentElement
              const prev = html.style.scrollBehavior
              html.style.scrollBehavior = 'auto'
              window.scrollBy(0, shift)
              html.style.scrollBehavior = prev
            })
          }
          // Next frame: never revert ScrollTriggers inside ScrollTrigger's own dispatch.
          rebuildFrame = requestAnimationFrame(rebuild)
        }
        ScrollTrigger.addEventListener('refresh', onRefresh)
        document.fonts?.addEventListener('loadingdone', onFonts)
      } else {
        // M10: stacked reveals (no pin: <1024, coarse pointer, short viewport, or
        // the stage didn't fit). The rail stays display: none.
        steps.forEach((step) => {
          const text = one('[data-step-text]', step)
          const frame = one('[data-step-frame]', step)
          if (!text || !frame || settled(step)) return
          const tl = gsap.timeline({ scrollTrigger: once(step, 'top 85%') })
          tl.fromTo(text, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: COMPONENT, ease: EASE, clearProps: REVEAL_CLEAR }, 0)
          tl.fromTo(frame, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: COMPONENT, ease: EASE, clearProps: REVEAL_CLEAR }, 0.12)
          const checks = all('[data-draw]', frame)
          if (checks.length) tl.fromTo(...draw(checks, { stagger: 0.1 }), 0.4)
          track(tl, text, frame)
        })
      }

      root.dataset.aboutMotion = 'active'
      // Off the hydration commit: refresh() reflows the whole document.
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())

      // Runs after GSAP reverts this run's tweens and pins (UX U4, REQUIRED).
      // data-about-motion is left for the next run to set.
      return () => {
        live = false
        if (refreshFrame) cancelAnimationFrame(refreshFrame)
        // A media change before the rebuild frame re-runs stacked anyway (noFit).
        if (rebuildFrame) cancelAnimationFrame(rebuildFrame)
        rebuildFrame = 0
        if (onRefresh) ScrollTrigger.removeEventListener('refresh', onRefresh)
        document.fonts?.removeEventListener('loadingdone', onFonts)
        process?.removeAttribute('data-process-pinned')
        steps.forEach((step) => step.removeAttribute('data-step-active'))
        counts.forEach((el) => (el.textContent = finalCount(el)))
        registry = new WeakMap()
      }
    }
    media.add(QUERIES, run, root)

    return () => {
      if (refreshFrame) cancelAnimationFrame(refreshFrame)
      if (rebuildFrame) cancelAnimationFrame(rebuildFrame)
      root.removeEventListener('focusin', onFocusIn)
      media.revert()
      root.dataset.aboutMotion = 'static'
    }
  }, [])

  return null
}
