import * as THREE from 'three'
import { GAP, MOBILE_QUERY, TOWERS_DESKTOP, createCity } from './city'

/**
 * Hero skyline — ONE renderer for the whole session, mounted behind the home
 * hero only (docs/design-system.md, "Hero skyline").
 *
 * A city of instanced towers rises from the centre out; an acid light follows
 * the pointer through the streets and nearby towers stretch toward it; as the
 * hero scrolls away the camera climbs to an overhead map view.
 *
 * Performance contract:
 * - All per-tower motion (rise, breathing, the pull toward the light, rooftop
 *   beacons) runs in the vertex/fragment shader. Instance matrices are written
 *   once per layout, never per frame; the CPU only updates a handful of
 *   uniforms, the light and the camera.
 * - One instanced draw call for the city, one for the ground grid.
 * - DPR capped at 1.5 desktop / 1 mobile, 30fps cap and a smaller city on
 *   mobile, no antialiasing on mobile.
 * - The loop is gated by an IntersectionObserver over the hero and by tab
 *   visibility; reduced motion renders a single static frame with no loop.
 *
 * If WebGL is unavailable `getSceneEngine()` returns null and the hero keeps
 * the CSS atmosphere from globals.css.
 */

const ACID = 0xc8ff54
/** Seconds each tower takes to rise once its delay has passed. */
const RISE_SECONDS = 0.9
/** Rise clock value that means "everything is up" (reduced motion, return visits). */
const RISEN = 99

/** Camera at rest (hero filling the viewport) and after the climb. */
const CAMERA = {
  landscape: { fov: 34, pos: [0, 3.6, 15.5], look: [0, 1.6, -6] },
  portrait: { fov: 52, pos: [0, 3.4, 9.5], look: [0, 3.6, -6] },
  overhead: { pos: [0, 19, 2.5], look: [0, 0, -3.5] },
} as const

class SceneEngine {
  readonly supported: boolean

  private renderer!: THREE.WebGLRenderer
  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private towers!: THREE.InstancedMesh
  private towerAttr!: THREE.InstancedBufferAttribute
  private light!: THREE.PointLight
  private readonly uniforms = {
    uTime: { value: 0 },
    uRise: { value: 0 },
    uMotion: { value: 1 },
    uLight: { value: new THREE.Vector3(2, 0, 2) },
    uBeacon: { value: new THREE.Color(ACID) },
    /** Drawing-buffer size, for the legibility well. */
    uViewport: { value: new THREE.Vector2(1, 1) },
    /** 1 on landscape screens, where the copy sits over the lower-left city. */
    uWell: { value: 1 },
  }

  private mobile = false
  private portrait = false
  private reduced = false

  private rafId: number | null = null
  private running = false
  private lastTime = 0
  private lastFrame = 0
  private riseClock = 0

  /** Pointer in normalised device coordinates; the light chases its ground hit. */
  private readonly pointer = new THREE.Vector2(0.25, -0.35)
  private readonly lightTarget = new THREE.Vector3(2, 0, 2)
  private readonly raycaster = new THREE.Raycaster()
  private readonly ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  private readonly hit = new THREE.Vector3()
  private readonly look = new THREE.Vector3()
  /** 0 while the hero fills the viewport, 1 once it has scrolled fully past. */
  private exit = 0
  private canvasShift = -1

  private container: HTMLElement | null = null
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
      this.portrait = typeof window !== 'undefined' && window.innerWidth / window.innerHeight < 0.8
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
      // MSAA on desktop only: the towers have long straight edges that alias
      // badly without it, and phones can't spare the fill rate.
      antialias: !this.mobile,
      // Not 'high-performance': that forces the discrete GPU on dual-GPU
      // machines (a context stall and a battery cost) for a scene the
      // integrated GPU handles.
      powerPreference: 'default',
    })
    this.renderer.setClearColor(0x000000, 0) // transparent: CSS atmosphere shows through
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.applyPixelRatio()

    const canvas = this.renderer.domElement
    canvas.setAttribute('aria-hidden', 'true')
    // Hidden until the first frame is drawn; the towers then rise from the
    // ground, so there is no finished image to arrive late.
    canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:block;' +
      'opacity:0;will-change:transform'

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(0x060706, 12, 42)
    this.camera = new THREE.PerspectiveCamera(CAMERA.landscape.fov, 1, 0.1, 100)

    // Unit box standing on the ground; the shader scales it to each height.
    const box = new THREE.BoxGeometry(GAP * 0.74, 1, GAP * 0.74).translate(0, 0.5, 0)
    const material = new THREE.MeshStandardMaterial({ color: 0x1b221d, roughness: 0.38, metalness: 0.55 })
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms)
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          /* glsl */ `#include <common>
          attribute vec4 aTower; // height, rise delay, beacon, -
          uniform float uTime;
          uniform float uRise;
          uniform float uMotion;
          uniform vec3 uLight;
          varying float vBeacon;`,
        )
        .replace(
          '#include <begin_vertex>',
          /* glsl */ `#include <begin_vertex>
          vec2 base = vec2(instanceMatrix[3][0], instanceMatrix[3][2]);
          float rise = clamp((uRise - aTower.y) / ${RISE_SECONDS.toFixed(2)}, 0.0, 1.0);
          rise = 1.0 - pow(1.0 - rise, 4.0);
          vec2 toLight = base - uLight.xz;
          float lift = exp(-dot(toLight, toLight) * 0.6) * 0.5;
          float breathe = sin(uTime * 0.6 + base.x * 0.5 + base.y * 0.3) * 0.03 * aTower.x;
          transformed.y *= max(0.001, aTower.x * rise + (lift + breathe) * uMotion * rise);
          vBeacon = aTower.z * step(0.5, normal.y) * rise;`,
        )
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          /* glsl */ `#include <common>
          uniform vec3 uBeacon;
          uniform vec2 uViewport;
          uniform float uWell;
          varying float vBeacon;`,
        )
        .replace(
          '#include <emissivemap_fragment>',
          /* glsl */ `#include <emissivemap_fragment>
          totalEmissiveRadiance += uBeacon * vBeacon;`,
        )
        // Legibility without a CSS gradient (design-system §7): the towers behind
        // the left-aligned copy shade themselves down. Same idea as the old
        // field's vertex-colour well.
        .replace(
          '#include <dithering_fragment>',
          /* glsl */ `#include <dithering_fragment>
          vec2 screen = gl_FragCoord.xy / uViewport;
          float behindCopy = (1.0 - smoothstep(0.22, 0.55, screen.x)) * (1.0 - smoothstep(0.42, 0.62, screen.y));
          gl_FragColor.rgb *= 1.0 - 0.62 * behindCopy * uWell;`,
        )
    }

    this.towers = new THREE.InstancedMesh(box, material, TOWERS_DESKTOP)
    this.towerAttr = new THREE.InstancedBufferAttribute(new Float32Array(TOWERS_DESKTOP * 4), 4)
    this.towers.geometry.setAttribute('aTower', this.towerAttr)
    // Heights live in the shader, so the CPU bounding volume is wrong; the
    // city is always in front of the camera anyway.
    this.towers.frustumCulled = false
    this.scene.add(this.towers)
    this.layoutCity()

    const grid = new THREE.GridHelper(80, 180, 0x1c231d, 0x121712)
    grid.position.y = 0.001
    this.scene.add(grid)

    this.scene.add(new THREE.HemisphereLight(0x3d5244, 0x050605, 1.3))
    const rim = new THREE.DirectionalLight(0xbfd4c4, 1.6)
    rim.position.set(-8, 10, -14)
    this.scene.add(rim)
    // Soft moonlight on the rooftops so the grid reads before the pointer arrives.
    const moon = new THREE.DirectionalLight(0x9fb8a6, 0.7)
    moon.position.set(6, 14, 10)
    this.scene.add(moon)
    this.light = new THREE.PointLight(ACID, this.mobile ? 60 : 80, 14, 1.5)
    this.light.position.set(2, 1.4, 2)
    this.scene.add(this.light)

    this.placeCamera(0, 0)
    this.publishBudget()
  }

  /** Write the city into the instance buffers. Runs on build and on breakpoint changes only. */
  private layoutCity() {
    const city = createCity(this.mobile, this.portrait)
    const matrix = new THREE.Matrix4()
    const data = this.towerAttr.array as Float32Array
    for (let i = 0; i < city.count; i++) {
      this.towers.setMatrixAt(i, matrix.makeTranslation(city.x[i], 0, city.z[i]))
      data[i * 4] = city.height[i]
      data[i * 4 + 1] = city.delay[i]
      data[i * 4 + 2] = city.beacon[i]
    }
    this.towers.count = city.count
    this.towers.instanceMatrix.needsUpdate = true
    this.towerAttr.needsUpdate = true
    this.renderer.domElement.dataset.towerCount = String(city.count)
  }

  private applyPixelRatio() {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1
    const ratio = Math.min(dpr, this.mobile ? 1 : 1.5)
    if (this.renderer.getPixelRatio() !== ratio) this.renderer.setPixelRatio(ratio)
    this.renderer.domElement.dataset.pixelRatio = String(ratio)
  }

  private publishBudget() {
    const canvas = this.renderer.domElement
    canvas.dataset.mobile = String(this.mobile)
    canvas.dataset.targetFps = String(this.mobile ? 30 : 60)
    canvas.dataset.animationRunning = String(this.running)
  }

  private updateResponsiveBudget() {
    const mobile = window.matchMedia(MOBILE_QUERY).matches
    const portrait = window.innerWidth / window.innerHeight < 0.8
    if (mobile === this.mobile && portrait === this.portrait) return
    this.mobile = mobile
    this.portrait = portrait
    this.light.intensity = mobile ? 60 : 80
    this.layoutCity()
    this.publishBudget()
  }

  private sizeToContainer() {
    const container = this.container
    if (!container) return
    const width = Math.max(1, container.clientWidth)
    const height = Math.max(1, container.clientHeight)
    // ResizeObserver also fires on observe(), and window resize can report the
    // same box. Writing canvas.width again reallocates the drawing buffer.
    if (width !== this.width || height !== this.height) {
      this.width = width
      this.height = height
      this.renderer.setSize(width, height, false)
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
    }
    this.renderer.getDrawingBufferSize(this.uniforms.uViewport.value)
    this.uniforms.uWell.value = this.portrait ? 0 : 1
    this.measureContainer()
  }

  /** Cache the hero's document-space box so the loop never measures layout. */
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
    // Coming back to the page shows the city already standing.
    if (this.painted) this.riseClock = RISEN

    this.sizeToContainer()
    const attachment = ++this.attachment
    this.addListeners()
    // Parallel shader compilation keeps the first draw off the CSS hero entrance.
    this.preparation ??= this.renderer.compileAsync(this.scene, this.camera)
    void this.preparation.then(() => {
      this.prepared = true
      if (attachment !== this.attachment || this.container !== container) return
      if (this.reduced) this.renderStaticFrame()
      else if (this.onScreen && !document.hidden) this.startLoop()
    }).catch(() => { /* Decorative scene: keep the CSS atmosphere on failure. */ })
  }

  detach(container: HTMLElement) {
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
    window.addEventListener('pointermove', this.onPointerMove, { passive: true })

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
    if (this.reduced) {
      this.stopLoop()
      this.renderStaticFrame()
    } else if (this.container && this.onScreen && !document.hidden) {
      this.startLoop()
    }
  }

  private onResize = () => {
    this.updateResponsiveBudget()
    this.applyPixelRatio()
    this.sizeToContainer()
    if (this.reduced) this.renderStaticFrame()
  }

  private onPointerMove = (event: PointerEvent) => {
    // Touch steers nothing: on phones the light wanders on its own.
    if (event.pointerType === 'touch') return
    this.pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
  }

  private onVisibility = () => {
    if (document.hidden) this.stopLoop()
    else if (!this.reduced && this.container && this.onScreen) this.startLoop()
  }

  // ── Loop ────────────────────────────────────────────────────────────────
  private startLoop() {
    if (this.running || !this.supported || !this.prepared) return
    this.running = true
    this.renderer.domElement.dataset.animationRunning = 'true'
    this.lastTime = performance.now()
    this.lastFrame = this.lastTime
    const tick = (now: number) => {
      if (!this.running) return
      const elapsed = now - this.lastTime
      const interval = 1000 / 30
      if (this.mobile && elapsed < interval - 0.5) {
        this.rafId = requestAnimationFrame(tick)
        return
      }
      // Preserve the remainder so a 60Hz display holds a steady 30fps.
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
    if (this.supported) this.renderer.domElement.dataset.animationRunning = 'false'
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  /** Hero exit progress from the cached box: no layout reads in the loop. */
  private readExit() {
    if (!this.container) return 0
    const value = (window.scrollY - this.heroTop) / this.heroHeight
    return value < 0 ? 0 : value > 1 ? 1 : value
  }

  private markPainted() {
    if (this.painted) return
    this.painted = true
    this.renderer.domElement.style.opacity = '1'
    this.renderer.domElement.dataset.painted = 'true'
  }

  /** Camera from street level (e = 0) to the overhead map (e = 1). */
  private placeCamera(e: number, sway: number) {
    const rest = this.portrait ? CAMERA.portrait : CAMERA.landscape
    if (this.camera.fov !== rest.fov) {
      this.camera.fov = rest.fov
      this.camera.updateProjectionMatrix()
    }
    const lerp = THREE.MathUtils.lerp
    const top = CAMERA.overhead
    this.camera.position.set(
      sway * (1 - e),
      lerp(rest.pos[1], top.pos[1], e),
      lerp(rest.pos[2], top.pos[2], e),
    )
    this.look.set(0, lerp(rest.look[1], top.look[1], e), lerp(rest.look[2], top.look[2], e))
    this.camera.lookAt(this.look)
  }

  private frame(now: number) {
    const dt = Math.min(0.1, (now - this.lastFrame) / 1000)
    this.lastFrame = now
    const time = now / 1000

    // The rise waits for the first-visit intro to lift, like the hero copy.
    if (document.documentElement.dataset.intro !== 'loading') this.riseClock += dt
    this.uniforms.uRise.value = this.riseClock
    this.uniforms.uTime.value = time
    this.uniforms.uMotion.value = 1

    this.exit += (this.readExit() - this.exit) * 0.12
    const e = this.exit * this.exit * (3 - 2 * this.exit)
    this.placeCamera(e, Math.sin(time * 0.05) * 0.8)

    // The canvas trails the hero at a slower scroll speed, so the climb to the
    // map view stays on screen while the copy leaves (parallax, not a pin).
    const shift = Math.round(this.exit * this.heroHeight * 0.45)
    if (shift !== this.canvasShift) {
      this.canvasShift = shift
      this.renderer.domElement.style.transform = `translate3d(0,${shift}px,0)`
    }

    if (this.mobile) this.pointer.set(Math.sin(time * 0.35) * 0.6, -0.3 + Math.cos(time * 0.27) * 0.25)
    this.raycaster.setFromCamera(this.pointer, this.camera)
    if (this.raycaster.ray.intersectPlane(this.ground, this.hit)) {
      this.lightTarget.set(
        THREE.MathUtils.clamp(this.hit.x, -14, 14),
        0,
        THREE.MathUtils.clamp(this.hit.z, -12, 6),
      )
    }
    this.light.position.x += (this.lightTarget.x - this.light.position.x) * 0.06
    this.light.position.z += (this.lightTarget.z - this.light.position.z) * 0.06
    this.light.position.y = 1.4 + e * 1.6
    this.uniforms.uLight.value.copy(this.light.position)

    // Rooftop beacons blink slowly in unison.
    this.uniforms.uBeacon.value.setHex(ACID).multiplyScalar(0.55 + Math.sin(time * 2.2) * 0.35)

    this.renderer.render(this.scene, this.camera)
    this.markPainted()
  }

  private renderStaticFrame() {
    if (!this.supported || !this.prepared) return
    this.uniforms.uRise.value = RISEN
    this.uniforms.uMotion.value = 0
    this.uniforms.uBeacon.value.setHex(ACID).multiplyScalar(0.7)
    this.placeCamera(0, 0)
    this.renderer.render(this.scene, this.camera)
    this.markPainted()
  }
}

// ── Session singleton ───────────────────────────────────────────────────────
type EngineSlot = { engine: SceneEngine | null }
const KEY = '__tw_scene_skyline_engine__'

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
