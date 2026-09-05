import * as THREE from 'three'
import { DEFAULT_SCENE, SCENE_PRESETS, type SceneName, type ScenePreset } from './presets'

/**
 * Persistent WebGL atmosphere — ONE renderer for the whole session.
 *
 * The engine is a module singleton (stashed on globalThis so Fast Refresh in
 * dev never spins up a second renderer). React's <PersistentScene> is only a
 * thin controller: it `attach()`es the shared canvas into the current
 * `.tw-world` and `detach()`es on unmount. Route changes therefore re-parent the
 * same canvas rather than creating a new renderer — satisfying the spec's
 * "one persistent renderer / no duplicate canvases" rule.
 *
 * If WebGL is unavailable, `getSceneEngine()` returns null and the CSS radial
 * atmosphere in globals.css remains the (fully usable) fallback.
 */

const MAX_POINTS_DESKTOP = 100
const MAX_POINTS_MOBILE = 32
const MOBILE_QUERY = '(max-width: 768px), (pointer: coarse)'

type EngineState = {
  target: ScenePreset
  pointColor: THREE.Color
  wireColor: THREE.Color
}

class SceneEngine {
  readonly supported: boolean

  private renderer!: THREE.WebGLRenderer
  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private group!: THREE.Group
  private points!: THREE.Points
  private pointMat!: THREE.PointsMaterial
  private wire!: THREE.LineSegments
  private dust!: THREE.Points
  private dustMat!: THREE.PointsMaterial
  private wireMat!: THREE.LineBasicMaterial
  private pointLimit = MAX_POINTS_DESKTOP
  private panelTarget: Float32Array | null = null

  private state: EngineState
  private currentScene: SceneName = DEFAULT_SCENE

  private rafId: number | null = null
  private running = false
  private reduced = false
  private mobile = false
  private lastTime = 0

  private readonly pointer = { x: 0, y: 0 }
  private readonly pointerTarget = { x: 0, y: 0 }
  private scrollProgress = 0
  private externalScroll = false
  private container: HTMLElement | null = null
  private listening = false
  private motionMedia: MediaQueryList | null = null

  constructor() {
    const preset = SCENE_PRESETS[DEFAULT_SCENE]
    this.state = {
      target: preset,
      pointColor: new THREE.Color(preset.accent),
      wireColor: new THREE.Color(preset.secondary),
    }

    try {
      this.mobile = typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
      this.pointLimit = this.mobile ? MAX_POINTS_MOBILE : MAX_POINTS_DESKTOP
      this.build(preset)
      this.supported = true
    } catch {
      this.supported = false
    }
  }

  // ── Build the (single) scene graph ──────────────────────────────────────
  private build(preset: ScenePreset) {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setClearColor(0x000000, 0) // transparent: CSS bg shows through
    this.applyPixelRatio()

    const canvas = this.renderer.domElement
    canvas.setAttribute('aria-hidden', 'true')
    canvas.dataset.scene = DEFAULT_SCENE
    canvas.style.cssText =
      'position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:block'

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100)
    this.camera.position.z = preset.cameraZ

    this.group = new THREE.Group()
    this.scene.add(this.group)

    // A small reusable buffer carries signals along the interface connections.
    const pos = new Float32Array(MAX_POINTS_DESKTOP * 3)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.pointMat = new THREE.PointsMaterial({
      size: this.mobile ? 0.032 : 0.03,
      color: this.state.pointColor.clone(),
      transparent: true,
      opacity: preset.atmosphere * 0.75,
      depthWrite: false,
      // NormalBlending (default) — no additive glow, per the anti-glow rule.
    })
    this.points = new THREE.Points(geo, this.pointMat)
    this.group.add(this.points)

    // Connected interface outlines, composed for the active service.
    const knotGeo = this.createWireGeometry()
    this.wireMat = new THREE.LineBasicMaterial({
      color: this.state.wireColor.clone(),
      transparent: true,
      opacity: 0.5,
    })
    this.wire = new THREE.LineSegments(knotGeo, this.wireMat)
    this.group.add(this.wire)

    // No generative core object: the connected interface panels above ARE the
    // form (docs/anti-slop-checklist.md forbids a stock 3D blob behind copy).
    const dustPositions = new Float32Array(480 * 3)
    // Deterministic scatter makes the composition stable across hydration/reloads.
    for (let i = 0; i < 480; i++) {
      const a = i * 2.399963,
        y = 1 - (i / 479) * 2,
        radius = Math.sqrt(1 - y * y)
      const r = 3.2 + Math.sin(i * 17.3) * 1.2
      dustPositions.set([Math.cos(a) * radius * r, y * r, Math.sin(a) * radius * r], i * 3)
    }
    const dustGeometry = new THREE.BufferGeometry()
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
    this.dustMat = new THREE.PointsMaterial({
      color: preset.accent,
      size: 0.022,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
    })
    this.dust = new THREE.Points(dustGeometry, this.dustMat)
    this.scene.add(this.dust)

    this.applyDensity(preset)
    this.publishBudget()
  }

  /** Five interface planes keep matching vertices, so service changes can
   * interpolate the same lightweight geometry instead of swapping renderers. */
  private createWireGeometry(name: SceneName = this.currentScene) {
    const layouts: Record<string, number[][]> = {
      intro: [
        [0, 0, 0, 3.4, 2.2],
        [-1.6, 1.4, -1, 2.1, 1.2],
        [1.7, -0.9, 0.8, 2.1, 1.1],
        [1.7, 1.2, -0.7, 1.3, 0.9],
        [-1.7, -1.3, -0.3, 1.3, 0.9],
      ],
      // A browser window with a phone beside it and two content blocks feeding
      // it — the shape of the thing we ship on the Websites chapter.
      web: [
        [0, 0.15, 0, 3.8, 2.6],
        [2.2, -0.9, 0.6, 0.95, 1.85],
        [-1.3, 1.9, -0.7, 2, 0.75],
        [1.2, 1.95, -0.7, 1.5, 0.75],
        [-1.5, -1.85, -0.6, 2.1, 0.7],
      ],
      // An audit board: one working surface, findings pinned around it.
      advisory: [
        [0, 0.1, 0, 3.2, 2.1],
        [-2.1, 1.7, -0.6, 1.5, 0.7],
        [2.1, 1.7, -0.6, 1.5, 0.7],
        [-2.1, -1.6, 0.3, 1.5, 0.7],
        [2.1, -1.6, 0.3, 1.5, 0.7],
      ],
      // Source panes stacked over a build output.
      developer: [
        [0, 0.4, 0, 3, 2.3],
        [-1.7, -1.7, 0.4, 2.4, 0.6],
        [1.7, -1.7, 0.4, 2.4, 0.6],
        [-1.9, 2.1, -0.6, 1.6, 0.6],
        [1.9, 2.1, -0.6, 1.6, 0.6],
      ],
      apps: [
        [0, 0, 0, 2, 1.5],
        [-2, 1.2, -0.5, 1.5, 1.1],
        [2, 1.2, -0.5, 1.5, 1.1],
        [-2, -1.2, 0.2, 1.5, 1.1],
        [2, -1.2, 0.2, 1.5, 1.1],
      ],
      automation: [
        [0, 0, 0, 2, 1.2],
        [0, 1.8, -0.6, 2, 1],
        [-1.5, -1.7, 0.3, 1.7, 1],
        [1.5, -1.7, 0.3, 1.7, 1],
        [2.6, 0.3, -0.8, 1.2, 0.8],
      ],
    }
    const layout = layouts[name] ?? layouts.intro
    const vertices: number[] = []
    const line = (a: number[], b: number[]) => vertices.push(...a, ...b)
    layout.forEach(([x, y, z, w, h], i) => {
      const left = x - w / 2,
        right = x + w / 2,
        top = y + h / 2,
        bottom = y - h / 2
      line([left, top, z], [right, top, z])
      line([right, top, z], [right, bottom, z])
      line([right, bottom, z], [left, bottom, z])
      line([left, bottom, z], [left, top, z])
      line([left, top - h * 0.2, z], [right, top - h * 0.2, z])
      line([left + w * 0.12, y, z], [left + w * 0.68, y, z])
      line([left + w * 0.12, y - h * 0.15, z], [left + w * 0.44, y - h * 0.15, z])
      // Every panel connects to the central interface.
      const center = layout[0]
      line([x, bottom, z], [center[0], center[1], center[2] - 0.15 - i * 0.03])
    })
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    return geometry
  }

  private applyPixelRatio() {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1
    // Cap at 1.5; drop to 1 on constrained mobile.
    const cap = this.mobile ? 1 : 1.5
    const ratio = Math.min(dpr, cap)
    this.renderer.setPixelRatio(ratio)
    this.renderer.domElement.dataset.pixelRatio = String(ratio)
  }

  private applyDensity(preset: ScenePreset) {
    const count = Math.min(
      this.mobile ? 4 : 8,
      Math.floor(this.pointLimit * preset.particleDensity)
    )
    this.points.geometry.setDrawRange(0, count)
    this.dust?.geometry.setDrawRange(0, this.mobile ? 160 : 480)
    this.renderer.domElement.dataset.pointLimit = String(this.pointLimit)
    this.renderer.domElement.dataset.pointCount = String(count)
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
    this.pointLimit = mobile ? MAX_POINTS_MOBILE : MAX_POINTS_DESKTOP
    this.pointMat.size = mobile ? 0.03 : 0.026
    this.wire.geometry.dispose()
    this.wire.geometry = this.createWireGeometry()
    this.applyDensity(this.state.target)
    this.publishBudget()
  }

  private sizeToViewport() {
    if (typeof window === 'undefined') return
    const w = window.innerWidth
    const h = window.innerHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  // ── Public controller API ───────────────────────────────────────────────
  attach(container: HTMLElement) {
    if (!this.supported) return
    this.container = container
    container.appendChild(this.renderer.domElement)

    this.reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    this.sizeToViewport()
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

  /**
   * Feed scroll progress (0–1) from the shared smooth-scroll driver so the
   * atmosphere drifts off the same source as ScrollTrigger — one scroll driver,
   * no duplicate reads. While an external source is active the engine's own
   * passive scroll listener no-ops; it re-arms as the fallback if the driver
   * detaches (reduced motion / no Lenis).
   */
  setScrollProgress(progress: number) {
    this.externalScroll = true
    this.scrollProgress = Math.min(1, Math.max(0, progress))
    if (this.reduced) this.renderStaticFrame()
  }

  releaseScrollSource() {
    this.externalScroll = false
    this.onScroll()
  }

  setScene(name: SceneName) {
    this.renderer.domElement.dataset.scene = name
    if (name === this.currentScene) return
    this.currentScene = name
    const geometry = this.createWireGeometry(name)
    this.panelTarget = new Float32Array(geometry.getAttribute('position').array)
    geometry.dispose()
    const preset = SCENE_PRESETS[name]
    this.state.target = preset
    this.applyDensity(preset)
    if (this.reduced) this.renderStaticFrame() // reflect scene without animating
  }

  // ── Listeners ─────────────────────────────────────────────────────────────
  private addListeners() {
    if (this.listening || typeof window === 'undefined') return
    window.addEventListener('resize', this.onResize, { passive: true })
    window.addEventListener('scroll', this.onScroll, { passive: true })
    document.addEventListener('visibilitychange', this.onVisibility)
    this.motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.motionMedia.addEventListener('change', this.onMotionPreference)
    if (!this.reduced && !this.mobile) {
      window.addEventListener('pointermove', this.onPointerMove, {
        passive: true,
      })
    }
    this.listening = true
    this.onScroll()
  }

  private removeListeners() {
    if (!this.listening || typeof window === 'undefined') return
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('scroll', this.onScroll)
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.motionMedia?.removeEventListener('change', this.onMotionPreference)
    this.motionMedia = null
    window.removeEventListener('pointermove', this.onPointerMove)
    this.listening = false
  }

  private onMotionPreference = (event: MediaQueryListEvent) => {
    this.reduced = event.matches
    window.removeEventListener('pointermove', this.onPointerMove)
    if (this.reduced) {
      this.stopLoop()
      this.renderStaticFrame()
    } else {
      if (!this.mobile)
        window.addEventListener('pointermove', this.onPointerMove, { passive: true })
      if (this.container && !document.hidden) this.startLoop()
    }
  }

  private onResize = () => {
    this.updateResponsiveBudget()
    this.applyPixelRatio()
    this.sizeToViewport()
    if (this.reduced) this.renderStaticFrame()
  }

  private onScroll = () => {
    if (typeof window === 'undefined' || this.externalScroll) return
    const max = Math.max(1, document.body.scrollHeight - window.innerHeight)
    this.scrollProgress = window.scrollY / max
  }

  private onPointerMove = (e: PointerEvent) => {
    this.pointerTarget.x = e.clientX / window.innerWidth - 0.5
    this.pointerTarget.y = e.clientY / window.innerHeight - 0.5
  }

  private onVisibility = () => {
    if (document.hidden) {
      this.stopLoop()
    } else if (!this.reduced && this.container) {
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

  private frame(now: number) {
    const dt = Math.min(0.05, (now - this.lastTime) / 1000)
    this.lastTime = now
    const t = this.state.target

    // Colour interpolation (slow).
    this.pointMat.color.lerp(this.state.pointColor.set(t.accent), 0.02)
    this.wireMat.color.lerp(this.state.wireColor.set(t.secondary), 0.02)
    this.pointMat.opacity += (t.atmosphere * 0.75 - this.pointMat.opacity) * 0.02
    this.dustMat.color.lerp(this.state.pointColor, 0.02)
    // The panels are the only form now, so they carry the atmosphere — but stay
    // faint enough that copy passing over them is never competing with a line.
    this.wireMat.opacity += ((t.wireOpacity * (this.mobile ? 0.45 : 1)) - this.wireMat.opacity) * 0.035
    this.dust.rotation.y += dt * 0.025
    this.dust.rotation.x = Math.sin(now * 0.00008) * 0.08
    this.group.scale.setScalar(
      this.group.scale.x + (this.composedScale(t) - this.group.scale.x) * 0.03
    )
    this.camera.position.z += (t.cameraZ - this.camera.position.z) * 0.03

    // A stable architectural composition with restrained pointer and scroll depth.
    this.group.rotation.y = Math.sin(now * 0.00008) * 0.09 + this.pointer.x * 0.06
    this.group.rotation.x = -0.08 + this.pointer.y * 0.04
    this.group.rotation.z = -0.08
    // Ease between chapter compositions instead of snapping, so the panels
    // travel across the frame as the copy column swaps sides.
    this.group.position.x += (this.composedX(t) - this.group.position.x) * 0.03
    const driftTarget = this.composedY(t) + (this.scrollProgress - 0.5) * -0.6
    this.group.position.y += (driftTarget - this.group.position.y) * 0.05
    if (this.panelTarget) {
      const attribute = this.wire.geometry.getAttribute('position') as THREE.BufferAttribute
      const positions = attribute.array as Float32Array
      for (let i = 0; i < positions.length; i++)
        positions[i] += (this.panelTarget[i] - positions[i]) * Math.min(1, dt * 3)
      attribute.needsUpdate = true
    }

    // Pointer camera offset.
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * 0.05
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * 0.05
    this.camera.position.x += (this.pointer.x * 0.34 - this.camera.position.x) * 0.03
    this.camera.position.y += (-this.pointer.y * 0.22 - this.camera.position.y) * 0.03
    this.camera.lookAt(0, 0, 0)

    this.updateSignals(now)
    this.renderer.render(this.scene, this.camera)
  }

  private updateSignals(now: number) {
    const paths = this.wire.geometry.getAttribute('position').array
    const attribute = this.points.geometry.getAttribute('position') as THREE.BufferAttribute
    const positions = attribute.array as Float32Array
    for (let i = 0; i < 8; i++) {
      const offset = ((i % 4) + 1) * 48 + 42
      const progress = (now * 0.00014 + i * 0.23) % 1
      for (let axis = 0; axis < 3; axis++)
        positions[i * 3 + axis] =
          paths[offset + axis] + (paths[offset + 3 + axis] - paths[offset + axis]) * progress
    }
    attribute.needsUpdate = true
  }

  /**
   * Composition placement for the active preset. A phone has no empty column
   * for the panels to sit in — the copy runs full width — so there they are
   * pushed to the lower outside corner and mostly off-frame instead.
   */
  private composedX(preset: ScenePreset) {
    return this.mobile ? Math.sign(preset.offsetX) * 2.7 : preset.offsetX
  }

  private composedY(preset: ScenePreset) {
    return this.mobile ? preset.offsetY - 1.5 : preset.offsetY
  }

  private composedScale(preset: ScenePreset) {
    return preset.objectScale * (this.mobile ? 0.78 : 1)
  }

  private renderStaticFrame() {
    if (!this.supported) return
    const t = this.state.target
    this.pointMat.color.set(t.accent)
    this.wireMat.color.set(t.secondary)
    this.pointMat.opacity = t.atmosphere * 0.75
    this.wireMat.opacity = t.wireOpacity * (this.mobile ? 0.45 : 1)
    this.dustMat.color.set(t.accent)
    this.group.scale.setScalar(this.composedScale(t))
    this.camera.position.set(0, 0, t.cameraZ)
    this.group.rotation.set(-0.08, 0.09, -0.08)
    this.group.position.x = this.composedX(t)
    if (this.panelTarget) {
      const attribute = this.wire.geometry.getAttribute('position') as THREE.BufferAttribute
      attribute.copyArray(this.panelTarget)
      attribute.needsUpdate = true
    }
    this.group.position.y = this.composedY(t)
    this.camera.lookAt(0, 0, 0)
    this.updateSignals(0)
    this.renderer.render(this.scene, this.camera)
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
