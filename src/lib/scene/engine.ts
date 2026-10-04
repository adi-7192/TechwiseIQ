import * as THREE from 'three'
import { NODES_DESKTOP, NODES_MOBILE, CLUSTER, MOBILE_QUERY, DEPTH, COLOR_LINK, CAMERA_Z, clamp01, createField } from './field'

/**
 * Hero depth field — ONE renderer for the whole session, mounted behind the
 * home hero only.
 *
 * This replaces the site-wide persistent atmosphere. The canvas is no longer a
 * fixed full-viewport layer following chapter `data-scene` markers; it is an
 * absolutely-positioned layer inside a single hero container, and the loop is
 * gated by an IntersectionObserver so the GPU is idle the moment the hero
 * leaves the viewport. Every other route and chapter keeps the CSS radial
 * atmosphere in globals.css, which was always the working fallback.
 *
 * Composition (docs/design-system.md §5, docs/anti-slop-checklist.md):
 * a receding lattice of clustered nodes with faint links between them — the
 * depth of a system you are looking into, not decorative stardust. Points are
 * generated deterministically so the frame is identical across hydration and
 * reloads, and near-centre nodes are shaded down in the vertex data so hero
 * copy never sits on top of a bright point (no CSS vignette gradient needed).
 *
 * If WebGL is unavailable `getSceneEngine()` returns null and the initial
 * server-rendered field stays visible over the CSS atmosphere.
 */

class SceneEngine {
  readonly supported: boolean

  private renderer!: THREE.WebGLRenderer
  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private group!: THREE.Group
  private nodes!: THREE.Points
  private nodeMat!: THREE.PointsMaterial
  private links!: THREE.LineSegments
  private linkMat!: THREE.LineBasicMaterial

  private nodeCount = NODES_DESKTOP
  private mobile = false
  private reduced = false

  private rafId: number | null = null
  private running = false
  private lastTime = 0

  private readonly pointer = { x: 0, y: 0 }
  private readonly pointerTarget = { x: 0, y: 0 }
  /** 0 while the hero fills the viewport, 1 once it has scrolled fully past. */
  private exit = 0

  private container: HTMLElement | null = null
  /** Hero box in document space, so the loop never has to measure it per frame. */
  private heroTop = 0
  private heroHeight = 1
  private listening = false
  private motionMedia: MediaQueryList | null = null
  private resizeObserver: ResizeObserver | null = null
  private visibility: IntersectionObserver | null = null
  private onScreen = true
  private painted = false
  private width = 0
  private height = 0
  private prepared = false
  private preparation: Promise<unknown> | null = null
  private attachment = 0

  constructor() {
    try {
      this.mobile = typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
      this.nodeCount = this.mobile ? NODES_MOBILE : NODES_DESKTOP
      this.build()
      this.supported = true
    } catch {
      this.supported = false
    }
  }

  // ── Build the (single) scene graph ──────────────────────────────────────
  private build() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      // Deliberately not 'high-performance': that forces the discrete GPU on
      // dual-GPU machines — a context-creation stall and a battery cost — for a
      // decorative field of a few hundred points the integrated GPU renders
      // without noticing.
      powerPreference: 'default',
    })
    this.renderer.setClearColor(0x000000, 0) // transparent: CSS bg shows through
    this.applyPixelRatio()

    const canvas = this.renderer.domElement
    canvas.setAttribute('aria-hidden', 'true')
    // The server-rendered field is visible until the first live frame. Swap at
    // full opacity so the background never arrives late or doubles in brightness.
    canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:block;' +
      'opacity:0'

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(52, 1, 0.1, 60)
    this.camera.position.z = CAMERA_Z

    this.group = new THREE.Group()
    this.scene.add(this.group)

    const { positions, colors, linkPositions } = createField(NODES_DESKTOP)

    const nodeGeo = new THREE.BufferGeometry()
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    this.nodeMat = new THREE.PointsMaterial({
      size: this.mobile ? 0.034 : 0.042,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      // NormalBlending (default) — no additive glow, per the anti-glow rule.
    })
    this.nodes = new THREE.Points(nodeGeo, this.nodeMat)
    this.group.add(this.nodes)

    const linkGeo = new THREE.BufferGeometry()
    linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPositions, 3))
    this.linkMat = new THREE.LineBasicMaterial({
      color: COLOR_LINK,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    })
    this.links = new THREE.LineSegments(linkGeo, this.linkMat)
    this.group.add(this.links)

    this.applyDensity()
    this.publishBudget()
  }

  private applyPixelRatio() {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1
    // Cap at 1.5; drop to 1 on constrained mobile.
    const cap = this.mobile ? 1 : 1.5
    const ratio = Math.min(dpr, cap)
    if (this.renderer.getPixelRatio() !== ratio) this.renderer.setPixelRatio(ratio)
    this.renderer.domElement.dataset.pixelRatio = String(ratio)
  }

  private applyDensity() {
    this.nodeCount = this.mobile ? NODES_MOBILE : NODES_DESKTOP
    this.nodes.geometry.setDrawRange(0, this.nodeCount)
    // Two links per cluster, and clusters are drawn in generation order, so the
    // link range tracks the node range exactly.
    this.links.geometry.setDrawRange(0, Math.floor(this.nodeCount / CLUSTER) * 4)
    const canvas = this.renderer.domElement
    canvas.dataset.pointLimit = String(this.mobile ? NODES_MOBILE : NODES_DESKTOP)
    canvas.dataset.pointCount = String(this.nodeCount)
  }

  private publishBudget() {
    const canvas = this.renderer.domElement
    canvas.dataset.mobile = String(this.mobile)
    canvas.dataset.targetFps = String(this.mobile ? 30 : 60)
    canvas.dataset.animationRunning = String(this.running)
  }

  private updateResponsiveBudget() {
    const mobile = window.matchMedia(MOBILE_QUERY).matches
    if (mobile === this.mobile) return
    this.mobile = mobile
    this.nodeMat.size = mobile ? 0.034 : 0.042
    this.applyDensity()
    this.publishBudget()
  }

  private sizeToContainer() {
    const container = this.container
    if (!container) return
    const width = Math.max(1, container.clientWidth)
    const height = Math.max(1, container.clientHeight)
    // ResizeObserver also fires on observe(), and window resize can report the
    // same box (especially with mobile browser chrome). Writing canvas.width
    // again clears/reallocates the drawing buffer even when it is unchanged.
    if (width !== this.width || height !== this.height) {
      this.width = width
      this.height = height
      this.renderer.setSize(width, height, false)
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
    }
    this.measureContainer()
  }

  /**
   * Cache the hero's document-space box. Called from the same places that
   * already relayout — attach, resize, the ResizeObserver, and each time the
   * hero re-enters the viewport — so the render loop can read scroll progress
   * arithmetically instead of measuring.
   */
  private measureContainer() {
    const container = this.container
    if (!container) return
    const rect = container.getBoundingClientRect()
    this.heroTop = rect.top + window.scrollY
    this.heroHeight = Math.max(1, rect.height)
  }

  // ── Public controller API ───────────────────────────────────────────────
  attach(container: HTMLElement) {
    if (!this.supported) return
    this.container = container
    container.appendChild(this.renderer.domElement)

    this.reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    this.sizeToContainer()
    const attachment = ++this.attachment
    this.addListeners()
    // Let drivers supporting parallel shader compilation finish without a
    // blocking first render in the middle of the CSS hero entrance. Reuse the
    // warm programs on subsequent visits; failed preparation keeps the fallback.
    this.preparation ??= this.renderer.compileAsync(this.scene, this.camera)
    void this.preparation.then(() => {
      this.prepared = true
      if (attachment !== this.attachment || this.container !== container) return
      if (this.reduced) this.renderStaticFrame()
      else if (this.onScreen && !document.hidden) this.startLoop()
    }).catch(() => { /* Decorative scene: retain the CSS atmosphere on failure. */ })
  }

  detach(container: HTMLElement) {
    // Only detach if we still own this container (guards racey remounts).
    if (this.container && this.container !== container) return
    this.attachment += 1
    this.stopLoop()
    this.removeListeners()
    const canvas = this.renderer.domElement
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
    this.container = null
  }

  // ── Listeners ─────────────────────────────────────────────────────────────
  private addListeners() {
    if (this.listening || typeof window === 'undefined' || !this.container) return

    window.addEventListener('resize', this.onResize, { passive: true })
    document.addEventListener('visibilitychange', this.onVisibility)

    this.motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.motionMedia.addEventListener('change', this.onMotionPreference)

    if (!this.reduced && !this.mobile) {
      window.addEventListener('pointermove', this.onPointerMove, { passive: true })
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.sizeToContainer()
      if (this.reduced) this.renderStaticFrame()
    })
    this.resizeObserver.observe(this.container)

    // The whole point of a hero-scoped scene: no GPU work once it is offscreen.
    this.visibility = new IntersectionObserver(
      ([entry]) => {
        this.onScreen = entry.isIntersecting
        if (!this.onScreen) this.stopLoop()
        else if (!this.reduced && !document.hidden) {
          // Re-measure on re-entry: cheap, and it self-corrects the cached box
          // after any layout change that didn't resize the container itself.
          this.measureContainer()
          this.startLoop()
        }
      },
      { threshold: 0 },
    )
    this.visibility.observe(this.container)

    this.listening = true
  }

  private removeListeners() {
    if (!this.listening || typeof window === 'undefined') return
    window.removeEventListener('resize', this.onResize)
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.motionMedia?.removeEventListener('change', this.onMotionPreference)
    this.motionMedia = null
    window.removeEventListener('pointermove', this.onPointerMove)
    this.resizeObserver?.disconnect()
    this.resizeObserver = null
    this.visibility?.disconnect()
    this.visibility = null
    this.listening = false
  }

  private onMotionPreference = (event: MediaQueryListEvent) => {
    this.reduced = event.matches
    window.removeEventListener('pointermove', this.onPointerMove)
    if (this.reduced) {
      this.stopLoop()
      this.renderStaticFrame()
    } else {
      if (!this.mobile) {
        window.addEventListener('pointermove', this.onPointerMove, { passive: true })
      }
      if (this.container && this.onScreen && !document.hidden) this.startLoop()
    }
  }

  private onResize = () => {
    this.updateResponsiveBudget()
    this.applyPixelRatio()
    this.sizeToContainer()
    if (this.reduced) this.renderStaticFrame()
  }

  private onPointerMove = (event: PointerEvent) => {
    this.pointerTarget.x = event.clientX / window.innerWidth - 0.5
    this.pointerTarget.y = event.clientY / window.innerHeight - 0.5
  }

  private onVisibility = () => {
    if (document.hidden) {
      this.stopLoop()
    } else if (!this.reduced && this.container && this.onScreen) {
      this.startLoop()
    }
  }

  // ── Loop ────────────────────────────────────────────────────────────────
  private startLoop() {
    if (this.running || !this.supported || !this.prepared) return
    this.running = true
    this.renderer.domElement.dataset.animationRunning = 'true'
    this.lastTime = performance.now()
    const tick = (now: number) => {
      if (!this.running) return
      const elapsed = now - this.lastTime
      const interval = 1000 / 30
      if (this.mobile && elapsed < interval - 0.5) {
        this.rafId = requestAnimationFrame(tick)
        return
      }
      // Preserve the remainder: resetting to `now` drops every third frame
      // when a 60Hz timestamp lands just short of the 30Hz interval.
      this.lastTime = this.mobile
        ? this.lastTime + interval * Math.max(1, Math.floor(elapsed / interval))
        : now
      this.frame(now)
      this.rafId = requestAnimationFrame(tick)
    }
    this.rafId = requestAnimationFrame(tick)
  }

  private stopLoop() {
    this.running = false
    if (this.supported) {
      this.renderer.domElement.dataset.animationRunning = 'false'
    }
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  /**
   * Hero exit progress, derived from the cached box in `measureContainer()`.
   * This used to call getBoundingClientRect() here — inside the render loop —
   * which forced a full layout on every single frame the hero was on screen.
   * Same value, no measurement.
   *
   * Still not a scroll listener: this runs inside a loop that is already
   * scheduled and already stops when the hero is offscreen, so it adds no second
   * scroll source alongside Lenis (docs/design-system.md — one scroll driver).
   */
  private readExit() {
    if (!this.container) return 0
    return clamp01((window.scrollY - this.heroTop) / this.heroHeight)
  }

  /** Reveal the canvas once it has actually painted something. */
  private markPainted() {
    if (this.painted) return
    this.painted = true
    this.renderer.domElement.style.opacity = '1'
    this.renderer.domElement.dataset.painted = 'true'
  }

  private frame(now: number) {
    this.exit += (this.readExit() - this.exit) * 0.12

    // Slow ambient drift. No wrap, no respawn — the field breathes rather than
    // travels, which keeps it quiet behind display type.
    this.group.rotation.z = Math.sin(now * 0.00003) * 0.05
    this.group.position.z = Math.sin(now * 0.00007) * 0.6

    // Pointer parallax: the camera moves through the field, so near clusters
    // shift further than far ones and the depth reads as real.
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * 0.045
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * 0.045
    this.camera.position.x += (this.pointer.x * 1.6 - this.camera.position.x) * 0.04
    this.camera.position.y += (-this.pointer.y * 1.05 - this.camera.position.y) * 0.04

    // As the hero scrolls away the camera pushes into the corridor and the
    // field fades out, so nothing is being rendered under the next chapter.
    const targetZ = CAMERA_Z - this.exit * 4.5
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.06
    this.camera.lookAt(0, 0, -DEPTH * 0.35)

    const fade = 1 - this.exit * 0.95
    this.nodeMat.opacity = 0.9 * fade
    this.linkMat.opacity = 0.18 * fade

    this.renderer.render(this.scene, this.camera)
    this.markPainted()
  }

  private renderStaticFrame() {
    if (!this.supported || !this.prepared) return
    this.group.rotation.z = 0
    this.group.position.z = 0
    this.camera.position.set(0, 0, CAMERA_Z)
    this.camera.lookAt(0, 0, -DEPTH * 0.35)
    this.nodeMat.opacity = 0.9
    this.linkMat.opacity = 0.18
    this.renderer.render(this.scene, this.camera)
    this.markPainted()
  }
}

// ── Session singleton ───────────────────────────────────────────────────────
type EngineSlot = { engine: SceneEngine | null }
const KEY = '__tw_scene_kinetic_engine__'

export function getSceneEngine(): SceneEngine | null {
  if (typeof window === 'undefined') return null
  const g = globalThis as unknown as Record<string, EngineSlot | undefined>
  let slot = g[KEY]
  if (!slot) {
    let engine: SceneEngine | null = null
    try {
      const created = new SceneEngine()
      engine = created.supported ? created : null
    } catch {
      engine = null
    }
    slot = { engine }
    g[KEY] = slot
  }
  return slot.engine
}

export type { SceneEngine }
