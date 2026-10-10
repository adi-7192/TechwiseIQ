import * as THREE from 'three'
import { GAP, MOBILE_QUERY, RISE_SPREAD, TOWERS_DESKTOP, createCity, districtCentres } from './city'
import { P, PARAM_COUNT, STOPS, STOP_NAMES, flatten, portraitStop, sampleJourney, type StopName } from './journey'

/**
 * Home skyline — ONE renderer for the whole session, behind the whole Home
 * page (docs/design-system.md, "Home journey"; D-038, D-039).
 *
 * A city of instanced towers rises from the centre; an acid light follows the
 * pointer through the streets; as the page scrolls the camera travels a
 * continuous path with a stop per section (lib/scene/journey.ts), each service
 * lighting its own district.
 *
 * Performance contract:
 * - All per-tower motion (rise, breathing, pull toward the light, beacons,
 *   district glow) runs in the shader. Instance matrices are written once per
 *   layout, never per frame; per frame the CPU updates a few uniforms, the
 *   light and the camera.
 * - Render on demand: while the hero is on screen the loop runs continuously;
 *   below it, it runs only while something changes (scroll, pointer, resize,
 *   the camera still settling) and then sleeps, so the GPU idles while a
 *   visitor reads.
 * - Adaptive resolution: desktop DPR steps down 1.5 → 1.25 → 1 if frames run
 *   long, and back up when they are fast again. Mobile: DPR 1, 30fps, smaller
 *   city, no MSAA. Tab hidden → stopped.
 * - Software WebGL (SwiftShader, llvmpipe — VMs, no GPU acceleration, CI): a
 *   lite budget — the city in the hero only (DPR 0.75, 30fps, no MSAA, render
 *   on demand) and the CSS atmosphere below it. CPU-drawn frames block the
 *   page, so the full journey needs a GPU.
 * - Reduced motion: one still frame of the hero, hidden below the hero.
 *
 * If WebGL is unavailable `getSceneEngine()` returns null and the page keeps
 * the CSS atmosphere from globals.css.
 */

const ACID = 0xc8ff54
/** Seconds each tower takes to rise once its delay has passed. */
const RISE_SECONDS = 0.9
const RISE_END = RISE_SPREAD + RISE_SECONDS
/** Rise clock value that means "everything is up" (reduced motion, return visits). */
const RISEN = 99
/** A stop is fully reached when its section's top is this far down the viewport. */
const ANCHOR_LINE = 0.3
/** Camera/params follow the scroll target with this rate (1/s, frame-rate independent). */
const FOLLOW = 3.2
/** The cursor light chases its target at this rate (1/s; ≈6% per frame at 60fps). */
const LIGHT_FOLLOW = 3.7
/** Below this (world units) the camera and light have settled and the loop may sleep. */
const SETTLED = 0.01
const DPR_STEPS = [1.5, 1.25, 1]
const LITE_DPR = 0.75

/** True when WebGL is rendered on the CPU. Probed once with a throwaway context. */
function softwareRenderer() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2') ?? document.createElement('canvas').getContext('webgl')
    if (!gl) return false
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const name = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER))
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name)
  } catch {
    return false
  }
}

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
    uAmbient: { value: 1 },
    uLight: { value: new THREE.Vector3(2, 0, 2) },
    uBeacon: { value: new THREE.Color(ACID) },
    uViewport: { value: new THREE.Vector2(1, 1) },
    uExposure: { value: 1 },
    uWell: { value: new THREE.Vector3(0, 0.7, 0.9) }, // side (0 = centre), strength, top
    uDistrict: { value: new THREE.Vector3() },
    // Acid, orange, and violet lifted 25% toward the foreground (--tw-violet is too dark to read as light).
    uDistrictColor: { value: [new THREE.Color(ACID), new THREE.Color(0xff6540), new THREE.Color(0x8b80ff)] },
  }

  private mobile = false
  private portrait = false
  /** ≤768px wide (incl. landscape phones): single-column copy, so phone exposure rules. */
  private narrow = false
  private reduced = false
  /** Software-rendered WebGL: lite budget (see the contract above). */
  private lite = false

  private rafId: number | null = null
  private running = false
  private lastTime = 0
  private lastFrame = 0
  private riseClock = 0
  /**
   * Scene time: advances only while frames are drawn. Sway, breathing, beacons
   * and the light's wander read this, not wall time, so waking the loop after
   * a sleep continues exactly where it stopped instead of jumping.
   */
  private clock = 0

  // Journey: resolved stops, their scroll anchors, the damped live params.
  private stops: Float32Array[] = []
  private anchors: number[] = []
  private heroBottom = 1
  private readonly target = new Float32Array(PARAM_COUNT)
  private readonly params = new Float32Array(PARAM_COUNT)
  private primed = false

  /** Pointer in normalised device coordinates; the light chases its ground hit. */
  private readonly pointer = new THREE.Vector2(0.25, -0.35)
  private readonly lightTarget = new THREE.Vector3(2, 0, 2)
  private readonly raycaster = new THREE.Raycaster()
  private readonly ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  private readonly hit = new THREE.Vector3()
  private readonly look = new THREE.Vector3()

  // Adaptive resolution (desktop).
  private dprStep = 0
  private frameEma = 16
  private slowFrames = 0
  private fastFrames = 0

  private container: HTMLElement | null = null
  private listening = false
  private motionMedia: MediaQueryList | null = null
  private resizeObserver: ResizeObserver | null = null
  private measureTimer = 0
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
      this.narrow = typeof window !== 'undefined' && window.innerWidth <= 768
      // `__twSceneFull` lets an e2e test exercise the journey on a GPU-less CI runner.
      this.lite = typeof window !== 'undefined' && softwareRenderer() &&
        !(window as Window & { __twSceneFull?: boolean }).__twSceneFull
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
      antialias: !this.mobile && !this.lite,
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
      'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:block;opacity:0'

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(0x060706, 12, 46)
    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120)

    // Unit box standing on the ground; the shader scales it to each height.
    const box = new THREE.BoxGeometry(GAP * 0.74, 1, GAP * 0.74).translate(0, 0.5, 0)
    // Lite (software WebGL) uses Lambert: half the shader compile and cheaper
    // pixels on a CPU, at the cost of the metallic sheen.
    const material = this.lite
      ? new THREE.MeshLambertMaterial({ color: 0x1b221d })
      : new THREE.MeshStandardMaterial({ color: 0x1b221d, roughness: 0.38, metalness: 0.55 })
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms)
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          /* glsl */ `#include <common>
          attribute vec4 aTower; // height, rise delay, beacon, district
          uniform float uTime;
          uniform float uRise;
          uniform float uMotion;
          uniform float uAmbient;
          uniform vec3 uLight;
          varying float vBeacon;
          varying float vRoof;
          varying float vDistrict;`,
        )
        .replace(
          '#include <begin_vertex>',
          /* glsl */ `#include <begin_vertex>
          vec2 base = vec2(instanceMatrix[3][0], instanceMatrix[3][2]);
          float rise = clamp((uRise - aTower.y) / ${RISE_SECONDS.toFixed(2)}, 0.0, 1.0);
          rise = 1.0 - pow(1.0 - rise, 4.0);
          vec2 toLight = base - uLight.xz;
          float lift = exp(-dot(toLight, toLight) * 0.6) * 0.5;
          float breathe = sin(uTime * 0.6 + base.x * 0.5 + base.y * 0.3) * 0.03 * aTower.x * uAmbient;
          transformed.y *= max(0.001, aTower.x * rise + (lift + breathe) * uMotion * rise);
          vRoof = step(0.5, normal.y) * rise;
          vBeacon = aTower.z * vRoof;
          vDistrict = aTower.w;`,
        )
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          /* glsl */ `#include <common>
          uniform vec3 uBeacon;
          uniform vec2 uViewport;
          uniform float uExposure;
          uniform vec3 uWell;
          uniform vec3 uDistrict;
          uniform vec3 uDistrictColor[3];
          varying float vBeacon;
          varying float vRoof;
          varying float vDistrict;`,
        )
        .replace(
          '#include <emissivemap_fragment>',
          /* glsl */ `#include <emissivemap_fragment>
          totalEmissiveRadiance += uBeacon * vBeacon;
          // The active service's district glows in its accent, roofs brightest.
          vec3 district = vDistrict < 0.5 ? vec3(0.0)
            : vDistrict < 1.5 ? uDistrictColor[0] * uDistrict.x
            : vDistrict < 2.5 ? uDistrictColor[1] * uDistrict.y
            : uDistrictColor[2] * uDistrict.z;
          totalEmissiveRadiance += district * (0.03 + 0.3 * vRoof);`,
        )
        // Legibility without a CSS gradient (design-system §7): towers behind
        // the copy shade themselves down, and dense sections lower the exposure.
        .replace(
          '#include <dithering_fragment>',
          /* glsl */ `#include <dithering_fragment>
          vec2 screen = gl_FragCoord.xy / uViewport;
          // |uWell.x| blends a centred well (0) into a side well (±1); no well = strength 0.
          float edge = uWell.x < 0.0 ? screen.x : 1.0 - screen.x;
          float sideMask = 1.0 - smoothstep(0.22, 0.55, edge);
          float centreMask = 1.0 - smoothstep(0.2, 0.42, abs(screen.x - 0.5));
          float behindCopy = mix(centreMask, sideMask, abs(uWell.x)) * (1.0 - smoothstep(uWell.z - 0.2, uWell.z, screen.y));
          gl_FragColor.rgb *= (1.0 - uWell.y * behindCopy) * uExposure;`,
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

    const grid = new THREE.GridHelper(90, 200, 0x1c231d, 0x121712)
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
    this.light = new THREE.PointLight(ACID, 80, 14, 1.5)
    this.light.position.set(2, 1.4, 2)
    this.scene.add(this.light)

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
      data[i * 4 + 3] = city.district[i]
    }
    this.towers.count = city.count
    this.towers.instanceMatrix.needsUpdate = true
    this.towerAttr.needsUpdate = true
    this.renderer.domElement.dataset.towerCount = String(city.count)

    // Stops are relative to the districts, which move with the layout.
    const centres = districtCentres(this.portrait)
    this.stops = STOP_NAMES.map((name: StopName) =>
      flatten(this.portrait || this.narrow ? portraitStop(name, this.portrait) : STOPS[name], centres),
    )
    this.primed = false
  }

  private applyPixelRatio() {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1
    const ratio = Math.min(dpr, this.lite ? LITE_DPR : this.mobile ? 1 : DPR_STEPS[this.dprStep])
    if (this.renderer.getPixelRatio() !== ratio) {
      this.renderer.setPixelRatio(ratio)
      this.renderer.getDrawingBufferSize(this.uniforms.uViewport.value)
    }
    this.renderer.domElement.dataset.pixelRatio = String(ratio)
  }

  /** Mobile and software rendering run at 30fps. */
  private get capped() {
    return this.mobile || this.lite
  }

  private publishBudget() {
    const canvas = this.renderer.domElement
    canvas.dataset.mobile = String(this.mobile)
    canvas.dataset.render = this.lite ? 'software' : 'gpu'
    canvas.dataset.targetFps = String(this.capped ? 30 : 60)
    canvas.dataset.animationRunning = String(this.running)
  }

  private updateResponsiveBudget() {
    const mobile = window.matchMedia(MOBILE_QUERY).matches
    const portrait = window.innerWidth / window.innerHeight < 0.8
    const narrow = window.innerWidth <= 768
    if (mobile === this.mobile && portrait === this.portrait && narrow === this.narrow) return
    this.mobile = mobile
    this.portrait = portrait
    this.narrow = narrow
    this.dprStep = 0
    this.layoutCity()
    this.publishBudget()
  }

  private sizeToContainer() {
    const container = this.container
    if (!container) return
    const width = Math.max(1, container.clientWidth)
    const height = Math.max(1, container.clientHeight)
    // Writing canvas.width again reallocates the drawing buffer even when it
    // is unchanged, so only resize on a real change.
    if (width !== this.width || height !== this.height) {
      this.width = width
      this.height = height
      this.renderer.setSize(width, height, false)
      this.camera.aspect = width / height
      this.camera.fov = this.portrait ? 52 : 34
      this.camera.updateProjectionMatrix()
      this.renderer.getDrawingBufferSize(this.uniforms.uViewport.value)
    }
  }

  /**
   * Cache where each journey stop is reached, in scroll pixels. Called on
   * attach, resize and (debounced) document size changes — never per frame.
   */
  private measureStops() {
    const markers = document.querySelectorAll<HTMLElement>('[data-journey]')
    const byName = new Map<string, HTMLElement>()
    markers.forEach((el) => byName.set(el.dataset.journey ?? '', el))
    const scroll = window.scrollY
    const line = window.innerHeight * ANCHOR_LINE
    let previous = -Infinity
    this.anchors = STOP_NAMES.map((name, i) => {
      const el = byName.get(name)
      const top = el ? el.getBoundingClientRect().top + scroll : previous + 1
      const anchor = i === 0 ? 0 : Math.max(previous + 1, top - line)
      previous = anchor
      return anchor
    })
    const hero = byName.get('hero')
    this.heroBottom = hero ? hero.getBoundingClientRect().bottom + scroll : window.innerHeight
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
    this.primed = false

    this.sizeToContainer()
    this.measureStops()
    this.attachment += 1
    this.addListeners()
    // A previous visit may have left the canvas hidden.
    this.renderer.domElement.style.visibility = ''
    // Lite shows nothing below the hero: if the page opens down there (an
    // anchor, a restored scroll), don't pay for the shader until it's needed.
    if (this.lite && window.scrollY > this.hideLine()) {
      this.renderer.domElement.style.visibility = 'hidden'
      return
    }
    if (this.lite && !this.preparation) this.prepareLater()
    else this.prepare()
  }

  /** Reduced motion and lite hide the canvas once the hero is half gone, before the next section's copy reaches it. */
  private hideLine() {
    return this.heroBottom - window.innerHeight * 0.5
  }

  /**
   * Lite: a CPU shader compile competes with page load on exactly the machines
   * that can least afford it, so it waits for a quiet moment after load.
   */
  private prepareTimer = 0
  private prepareLater() {
    if (this.preparation || this.prepareTimer) return
    this.prepareTimer = window.setTimeout(() => {
      const run = () => {
        this.prepareTimer = 0
        if (this.container) this.prepare()
      }
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 2500 })
      else run()
    }, 1500)
  }

  /** Compile once (parallel compilation keeps it off the CSS hero entrance), then draw. */
  private prepare() {
    const attachment = this.attachment
    const container = this.container
    this.preparation ??= this.renderer.compileAsync(this.scene, this.camera)
    void this.preparation.then(() => {
      this.prepared = true
      if (attachment !== this.attachment || this.container !== container) return
      if (this.reduced) this.renderStaticFrame()
      else if (!document.hidden) this.wake()
    }).catch(() => { /* Decorative scene: keep the CSS atmosphere on failure. */ })
  }

  detach(container: HTMLElement) {
    if (this.container && this.container !== container) return
    this.attachment += 1
    window.clearTimeout(this.prepareTimer)
    this.prepareTimer = 0
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
    // Wakes the loop only; the frame reads scrollY itself (Lenis stays the one driver).
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('pointermove', this.onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', this.onVisibility)
    this.motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.motionMedia.addEventListener('change', this.onMotionPreference)

    // Images and fonts loading move the sections: re-measure, debounced.
    this.resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(this.measureTimer)
      this.measureTimer = window.setTimeout(() => {
        this.measureStops()
        this.wake()
      }, 150)
    })
    this.resizeObserver.observe(document.body)
    this.listening = true
  }

  private removeListeners() {
    if (!this.listening || typeof window === 'undefined') return
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('pointermove', this.onPointerMove)
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.motionMedia?.removeEventListener('change', this.onMotionPreference)
    this.motionMedia = null
    this.resizeObserver?.disconnect()
    this.resizeObserver = null
    window.clearTimeout(this.measureTimer)
    this.listening = false
  }

  private onMotionPreference = (event: MediaQueryListEvent) => {
    this.reduced = event.matches
    if (this.reduced) {
      this.stopLoop()
      this.renderStaticFrame()
    } else {
      this.renderer.domElement.style.visibility = ''
      this.wake()
    }
  }

  private onResize = () => {
    this.updateResponsiveBudget()
    this.applyPixelRatio()
    this.sizeToContainer()
    this.measureStops()
    if (this.reduced) this.renderStaticFrame()
    else this.wake()
  }

  private onScroll = () => {
    if (this.reduced || this.lite) {
      // The hero keeps its city; below it the CSS atmosphere shows.
      const below = window.scrollY > this.hideLine()
      this.renderer.domElement.style.visibility = below ? 'hidden' : ''
      if (below) return
      if (!this.preparation) {
        this.prepareLater() // draws (or renders the still frame) once compiled
        return
      }
      if (this.reduced) return
    }
    this.wake()
  }

  private onPointerMove = (event: PointerEvent) => {
    // Touch steers nothing: on phones the light wanders on its own in the hero.
    if (event.pointerType === 'touch') return
    this.pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
    this.wake()
  }

  private onVisibility = () => {
    if (document.hidden) this.stopLoop()
    else this.wake()
  }

  // ── Loop ────────────────────────────────────────────────────────────────
  /** Start the loop if it is allowed to run; it puts itself back to sleep. */
  private wake() {
    if (this.running || !this.supported || !this.prepared || this.reduced || !this.container || document.hidden) return
    this.running = true
    this.renderer.domElement.dataset.animationRunning = 'true'
    this.lastTime = performance.now()
    this.lastFrame = this.lastTime
    this.slowFrames = this.fastFrames = 0
    const tick = (now: number) => {
      if (!this.running) return
      const elapsed = now - this.lastTime
      const interval = 1000 / 30
      if (this.capped && elapsed < interval - 0.5) {
        this.rafId = requestAnimationFrame(tick)
        return
      }
      // Preserve the remainder so a 60Hz display holds a steady 30fps.
      this.lastTime = this.capped
        ? this.lastTime + interval * Math.max(1, Math.floor(elapsed / interval))
        : now
      if (this.frame(now)) this.rafId = requestAnimationFrame(tick)
      else this.stopLoop()
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

  /** The stop whose section is on screen (for tests and debugging); written only on change. */
  private publishStop(scroll: number) {
    let i = 0
    while (i < this.anchors.length - 1 && scroll >= this.anchors[i + 1]) i++
    const canvas = this.renderer.domElement
    if (canvas.dataset.stop !== STOP_NAMES[i]) canvas.dataset.stop = STOP_NAMES[i]
  }

  private markPainted() {
    if (this.painted) return
    this.painted = true
    this.renderer.domElement.style.opacity = '1'
    this.renderer.domElement.dataset.painted = 'true'
  }

  /** Desktop only: trade resolution for frame time, and back. */
  private adaptResolution(dtMs: number) {
    if (this.mobile || this.lite) return
    this.frameEma += (dtMs - this.frameEma) * 0.1
    if (this.frameEma > 22) {
      this.fastFrames = 0
      if (++this.slowFrames > 45 && this.dprStep < DPR_STEPS.length - 1) {
        this.dprStep += 1
        this.slowFrames = 0
        this.applyPixelRatio()
      }
    } else if (this.frameEma < 12) {
      this.slowFrames = 0
      if (++this.fastFrames > 240 && this.dprStep > 0) {
        this.dprStep -= 1
        this.fastFrames = 0
        this.applyPixelRatio()
      }
    }
  }

  /** Apply the damped journey params to the scene. */
  private applyParams(time: number) {
    const p = this.params
    const sway = Math.sin(time * 0.05) * 0.8 * p[P.ambient]
    this.camera.position.set(p[P.pos] + sway, p[P.pos + 1], p[P.pos + 2])
    this.look.set(p[P.look], p[P.look + 1], p[P.look + 2])
    this.camera.lookAt(this.look)
    this.uniforms.uExposure.value = p[P.exposure]
    this.uniforms.uWell.value.set(p[P.wellSide], p[P.wellStrength], p[P.wellTop])
    this.uniforms.uDistrict.value.set(p[P.districts], p[P.districts + 1], p[P.districts + 2])
    this.uniforms.uAmbient.value = p[P.ambient]
    this.light.color.setRGB(p[P.light], p[P.light + 1], p[P.light + 2])
    this.light.intensity = (this.mobile ? 60 : 80) * p[P.lightPower]
    this.light.distance = 14 * p[P.lightPower]
    this.light.position.y = p[P.lightHeight]
  }

  /** One frame. Returns whether the loop should keep running. */
  private frame(now: number) {
    const dtMs = now - this.lastFrame
    // Cap one step at 0.5s: enough to absorb a hitch, small enough that very
    // slow (CPU-rendered) frames still finish the rise and settle in real time.
    // The loop resets its clock on wake, so a sleep never arrives as one big step.
    const dt = Math.min(0.5, dtMs / 1000)
    this.lastFrame = now
    this.clock += dt
    const time = this.clock

    // The rise waits for the first-visit intro to lift, like the hero copy.
    if (document.documentElement.dataset.intro !== 'loading') this.riseClock += dt
    this.uniforms.uRise.value = this.riseClock
    this.uniforms.uTime.value = time
    this.uniforms.uMotion.value = 1

    // Journey: follow the scroll target smoothly, whatever the frame rate.
    const scroll = window.scrollY
    sampleJourney(this.stops, this.anchors, scroll, this.target)
    this.publishStop(scroll)
    let moving = 0
    if (!this.primed) {
      this.params.set(this.target)
      this.primed = true
    } else {
      const k = 1 - Math.exp(-dt * FOLLOW)
      for (let i = 0; i < PARAM_COUNT; i++) {
        const delta = this.target[i] - this.params[i]
        this.params[i] += delta * k
        moving = Math.max(moving, Math.abs(delta))
      }
    }
    this.applyParams(time)

    const inHero = window.scrollY < this.heroBottom
    // Lite: no journey below the hero (onScroll hides the canvas there).
    if (this.lite && window.scrollY > this.hideLine()) return false
    if (this.mobile && inHero) this.pointer.set(Math.sin(time * 0.35) * 0.6, -0.3 + Math.cos(time * 0.27) * 0.25)
    this.raycaster.setFromCamera(this.pointer, this.camera)
    if (this.raycaster.ray.intersectPlane(this.ground, this.hit)) {
      this.lightTarget.set(THREE.MathUtils.clamp(this.hit.x, -16, 16), 0, THREE.MathUtils.clamp(this.hit.z, -14, 8))
    }
    // Time-based, like the camera: a slow device settles as fast as a quick one.
    const lx = this.lightTarget.x - this.light.position.x
    const lz = this.lightTarget.z - this.light.position.z
    const lk = 1 - Math.exp(-dt * LIGHT_FOLLOW)
    this.light.position.x += lx * lk
    this.light.position.z += lz * lk
    this.uniforms.uLight.value.copy(this.light.position)

    // Rooftop beacons blink slowly in unison.
    this.uniforms.uBeacon.value.setHex(ACID).multiplyScalar(0.55 + Math.sin(time * 2.2) * 0.35)

    this.renderer.render(this.scene, this.camera)
    this.markPainted()
    this.adaptResolution(dtMs)

    // Keep running in the hero (ambient life, GPU only) and until everything has settled.
    const lightMoving = Math.abs(lx) + Math.abs(lz) > SETTLED
    return (inHero && !this.lite) || this.riseClock < RISE_END || moving > SETTLED || lightMoving
  }

  private renderStaticFrame() {
    if (!this.supported || !this.prepared) return
    // The city is standing; turning motion back on must not replay the rise.
    this.riseClock = RISEN
    this.uniforms.uRise.value = RISEN
    this.uniforms.uMotion.value = 0
    this.uniforms.uBeacon.value.setHex(ACID).multiplyScalar(0.7)
    this.params.set(this.stops[0])
    this.primed = true
    this.applyParams(0)
    this.renderer.render(this.scene, this.camera)
    this.markPainted()
    this.renderer.domElement.style.visibility = window.scrollY > this.hideLine() ? 'hidden' : ''
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
