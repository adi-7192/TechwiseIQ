import * as THREE from 'three'
import {
  DEFAULT_SCENE,
  SCENE_PRESETS,
  type SceneName,
  type ScenePreset,
} from './presets'

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

const MAX_POINTS_DESKTOP = 1800
const MAX_POINTS_MOBILE = 700
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
  private wire!: THREE.Mesh
  private wireMat!: THREE.MeshBasicMaterial
  private pointLimit = MAX_POINTS_DESKTOP

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
  private container: HTMLElement | null = null
  private listening = false

  constructor() {
    const preset = SCENE_PRESETS[DEFAULT_SCENE]
    this.state = {
      target: preset,
      pointColor: new THREE.Color(preset.accent),
      wireColor: new THREE.Color(preset.secondary),
    }

    try {
      this.mobile =
        typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
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

    // Point field distributed on a spherical shell.
    // Keep one small desktop-capacity buffer so orientation/responsive changes
    // can raise or lower the draw range without reallocating the point field.
    const pos = new Float32Array(MAX_POINTS_DESKTOP * 3)
    for (let i = 0; i < MAX_POINTS_DESKTOP; i++) {
      const a = Math.random() * Math.PI * 2
      const b = Math.acos(2 * Math.random() - 1)
      const r = 2.1 + Math.random() * 2.9
      pos[i * 3] = Math.sin(b) * Math.cos(a) * r
      pos[i * 3 + 1] = Math.cos(b) * r
      pos[i * 3 + 2] = Math.sin(b) * Math.sin(a) * r
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.pointMat = new THREE.PointsMaterial({
      size: this.mobile ? 0.03 : 0.026,
      color: this.state.pointColor.clone(),
      transparent: true,
      opacity: preset.atmosphere * 0.7,
      depthWrite: false,
      // NormalBlending (default) — no additive glow, per the anti-glow rule.
    })
    this.points = new THREE.Points(geo, this.pointMat)
    this.group.add(this.points)

    // One abstract wireframe generative form.
    const knotGeo = this.createWireGeometry()
    this.wireMat = new THREE.MeshBasicMaterial({
      color: this.state.wireColor.clone(),
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    })
    this.wire = new THREE.Mesh(knotGeo, this.wireMat)
    this.group.add(this.wire)

    this.applyDensity(preset)
    this.publishBudget()
  }

  private createWireGeometry() {
    return new THREE.TorusKnotGeometry(
      1.5,
      0.28,
      this.mobile ? 90 : 140,
      12,
      2,
      3,
    )
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
    const count = Math.floor(this.pointLimit * preset.particleDensity)
    this.points.geometry.setDrawRange(0, count)
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
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

  setScene(name: SceneName) {
    this.renderer.domElement.dataset.scene = name
    if (name === this.currentScene) return
    this.currentScene = name
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
    window.removeEventListener('pointermove', this.onPointerMove)
    this.listening = false
  }

  private onResize = () => {
    this.updateResponsiveBudget()
    this.applyPixelRatio()
    this.sizeToViewport()
    if (this.reduced) this.renderStaticFrame()
  }

  private onScroll = () => {
    if (typeof window === 'undefined') return
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
    this.pointMat.opacity += (t.atmosphere * 0.7 - this.pointMat.opacity) * 0.02
    this.group.scale.setScalar(
      this.group.scale.x + (t.objectScale - this.group.scale.x) * 0.03,
    )
    this.camera.position.z += (t.cameraZ - this.camera.position.z) * 0.03

    // Ambient movement.
    this.group.rotation.y += dt * 0.05
    this.group.rotation.x =
      Math.sin(now * 0.00012) * 0.15 + this.pointer.y * 0.1
    this.wire.rotation.x = now * 0.00006
    this.wire.rotation.z = now * 0.00009

    // Scroll-linked vertical drift.
    const driftTarget = (this.scrollProgress - 0.5) * -1.8
    this.group.position.y += (driftTarget - this.group.position.y) * 0.05

    // Pointer camera offset.
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * 0.05
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * 0.05
    this.camera.position.x +=
      (this.pointer.x * 0.34 - this.camera.position.x) * 0.03
    this.camera.position.y +=
      (-this.pointer.y * 0.22 - this.camera.position.y) * 0.03
    this.camera.lookAt(0, 0, 0)

    this.renderer.render(this.scene, this.camera)
  }

  private renderStaticFrame() {
    if (!this.supported) return
    const t = this.state.target
    this.pointMat.color.set(t.accent)
    this.wireMat.color.set(t.secondary)
    this.pointMat.opacity = t.atmosphere * 0.6
    this.group.scale.setScalar(t.objectScale)
    this.camera.position.set(0, 0, t.cameraZ)
    this.group.rotation.set(0.1, 0.4, 0)
    this.group.position.y = 0
    this.camera.lookAt(0, 0, 0)
    this.renderer.render(this.scene, this.camera)
  }
}

// ── Session singleton ───────────────────────────────────────────────────────
type EngineSlot = { engine: SceneEngine | null }
const KEY = '__tw_scene_engine__'

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
