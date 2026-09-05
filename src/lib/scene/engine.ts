import * as THREE from 'three'

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
 * If WebGL is unavailable `getSceneEngine()` returns null and the CSS
 * atmosphere alone carries the hero.
 */

const NODES_DESKTOP = 900
const NODES_MOBILE = 300
/** Nodes per cluster: one anchor plus five satellites drawn around it. */
const CLUSTER = 6
const MOBILE_QUERY = '(max-width: 768px), (pointer: coarse)'

/** Field extents in world units. Depth is what sells the parallax. */
const SPAN_X = 26
const SPAN_Y = 16
const DEPTH = 22

/** Muted graphite-green at rest, acid only on the few live nodes. */
const COLOR_NODE = 0x8fb39a
const COLOR_LIVE = 0xc8ff54
const COLOR_LINK = 0x4c7360

const CAMERA_Z = 6.4

/** Deterministic pseudo-random — stable across hydration, reload and SSR. */
function rand(index: number, salt: number) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453
  return value - Math.floor(value)
}

function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value
}

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
    // Starts transparent and fades up once there is a first frame to show. The
    // canvas is mounted at idle, several hundred ms after the hero has already
    // begun animating, so appearing at full brightness read as a hard cut. The
    // reduce block in globals.css drops the transition, which is correct there.
    canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:block;' +
      'opacity:0;transition:opacity 900ms var(--tw-ease-out)'

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(52, 1, 0.1, 60)
    this.camera.position.z = CAMERA_Z

    this.group = new THREE.Group()
    this.scene.add(this.group)

    const { positions, colors, linkPositions } = this.createField(NODES_DESKTOP)

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

  /**
   * Clustered lattice: every group of `CLUSTER` nodes is one anchor plus
   * satellites scattered around it, with two links back to the anchor. The
   * result reads as connected systems receding into depth rather than as an
   * even spray of dust.
   *
   * Vertex colour carries both the depth falloff and the centre "well" that
   * keeps hero copy legible, so no CSS overlay gradient is required.
   */
  private createField(count: number) {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const links: number[] = []

    // Unpack the two base tints once. Building this field runs on the main
    // thread right after hydration, so the per-node path stays allocation-free
    // (no Color instances, no clone/multiplyScalar) and never becomes a long task.
    const nodeR = ((COLOR_NODE >> 16) & 255) / 255
    const nodeG = ((COLOR_NODE >> 8) & 255) / 255
    const nodeB = (COLOR_NODE & 255) / 255
    const liveR = ((COLOR_LIVE >> 16) & 255) / 255
    const liveG = ((COLOR_LIVE >> 8) & 255) / 255
    const liveB = (COLOR_LIVE & 255) / 255

    let anchorX = 0
    let anchorY = 0
    let anchorZ = 0

    for (let i = 0; i < count; i++) {
      const slot = i % CLUSTER
      let x: number
      let y: number
      let z: number

      if (slot === 0) {
        anchorX = (rand(i, 2) - 0.5) * SPAN_X
        anchorY = (rand(i, 3) - 0.5) * SPAN_Y
        anchorZ = -rand(i, 4) * DEPTH
        x = anchorX
        y = anchorY
        z = anchorZ
      } else {
        // Satellites stay inside a small radius so clusters read as one object.
        x = anchorX + (rand(i, 5) - 0.5) * 2.4
        y = anchorY + (rand(i, 6) - 0.5) * 2.4
        z = anchorZ + (rand(i, 7) - 0.5) * 1.8
        if (slot <= 2) {
          links.push(anchorX, anchorY, anchorZ, x, y, z)
        }
      }

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Depth falloff: the far end of the corridor fades toward the background.
      const depth = clamp01(-z / DEPTH)
      const depthFade = 1 - depth * 0.72
      const nearness = 1 - depth

      // Soft well through the middle of the near layers, where the h1 sits.
      const nx = x / (SPAN_X * 0.5)
      const ny = y / (SPAN_Y * 0.5)
      const radial = Math.min(1, Math.sqrt(nx * nx + ny * ny) / 0.6)
      const legibility = 1 - nearness * (1 - radial) * 0.85

      const shade = depthFade * legibility
      // A sparse minority of nodes carry the acid signal; the rest stay muted.
      const isLive = slot === 0 && rand(i, 8) > 0.86
      const level = isLive ? Math.min(1, shade * 1.25) : shade
      const offset = i * 3
      colors[offset] = (isLive ? liveR : nodeR) * level
      colors[offset + 1] = (isLive ? liveG : nodeG) * level
      colors[offset + 2] = (isLive ? liveB : nodeB) * level
    }

    return { positions, colors, linkPositions: new Float32Array(links) }
  }

  private applyPixelRatio() {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1
    // Cap at 1.5; drop to 1 on constrained mobile.
    const cap = this.mobile ? 1 : 1.5
    const ratio = Math.min(dpr, cap)
    this.renderer.setPixelRatio(ratio)
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
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
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
    this.addListeners()

    if (this.reduced) {
      // Frozen, low-cost static frame — no RAF loop.
      this.stopLoop()
      this.renderStaticFrame()
    } else {
      this.startLoop()
    }
  }

  detach(container: HTMLElement) {
    // Only detach if we still own this container (guards racey remounts).
    if (this.container && this.container !== container) return
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
    if (this.running || !this.supported) return
    this.running = true
    this.renderer.domElement.dataset.animationRunning = 'true'
    this.lastTime = performance.now()
    const tick = (now: number) => {
      if (!this.running) return
      if (this.mobile && now - this.lastTime < 1000 / 30) {
        this.rafId = requestAnimationFrame(tick)
        return
      }
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
  }

  private frame(now: number) {
    this.lastTime = now
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
    if (!this.supported) return
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
