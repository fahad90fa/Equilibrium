// Hero WebGL scene — synthwave grid rushing under a floating controller,
// drifting particle field, neon bloom. Fully procedural.
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { createGamepad } from './gamepad.js'
import { COLORS } from './config.js'

const GRID_DEPTH = 60

function makeGrid() {
  // Custom line grid so we can scroll it toward the camera forever
  const size = 90
  const step = 1.5
  const positions = []
  for (let x = -size / 2; x <= size / 2; x += step) {
    positions.push(x, 0, -GRID_DEPTH, x, 0, 0)
  }
  for (let z = -GRID_DEPTH; z <= 0; z += step) {
    positions.push(-size / 2, 0, z, size / 2, 0, z)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  const mat = new THREE.LineBasicMaterial({
    color: COLORS.red, transparent: true, opacity: 0.34,
  })
  return new THREE.LineSegments(geo, mat)
}

function makeParticles(count) {
  const geo = new THREE.BufferGeometry()
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const cRed = new THREE.Color(COLORS.red)
  const cCyan = new THREE.Color(COLORS.cyan)
  const cWhite = new THREE.Color(0x7a8aa0)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 40
    pos[i * 3 + 1] = Math.random() * 16 - 3
    pos[i * 3 + 2] = -Math.random() * 40 + 4
    const r = Math.random()
    const c = r < 0.25 ? cRed : r < 0.5 ? cCyan : cWhite
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const mat = new THREE.PointsMaterial({
    size: 0.07, vertexColors: true, transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })
  return new THREE.Points(geo, mat)
}

export function initHeroScene(canvas, { reducedMotion = false } = {}) {
  const isMobile = window.innerWidth < 820

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: !isMobile, alpha: false, powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(COLORS.bg)
  scene.fog = new THREE.Fog(COLORS.bg, 9, 34)

  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100)
  camera.position.set(0, 1.15, 6.6)

  // ── Actors ──
  const grid = makeGrid()
  grid.position.y = -1.9
  scene.add(grid)

  const gridFar = makeGrid()
  gridFar.material = grid.material.clone()
  gridFar.material.opacity = 0.13
  gridFar.material.color = new THREE.Color(COLORS.cyan)
  gridFar.position.y = 5.4
  gridFar.rotation.x = Math.PI // ceiling grid
  scene.add(gridFar)

  const particles = makeParticles(isMobile ? 260 : 650)
  scene.add(particles)

  const pad = createGamepad()
  pad.scale.setScalar(isMobile ? 0.62 : 0.88)
  pad.position.set(0, 0.42, 2.4)
  scene.add(pad)

  // Wireframe sentinels floating at the flanks for depth
  const wireMat = new THREE.MeshBasicMaterial({
    color: COLORS.cyan, wireframe: true, transparent: true, opacity: 0.16,
  })
  const icoL = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 0), wireMat)
  icoL.position.set(-7.5, 2.4, -6)
  const icoR = new THREE.Mesh(new THREE.OctahedronGeometry(1.9, 0), wireMat.clone())
  icoR.material.color = new THREE.Color(COLORS.red)
  icoR.position.set(7.8, 3.1, -8)
  scene.add(icoL, icoR)

  // ── Lights ──
  scene.add(new THREE.AmbientLight(0x3a4c68, 1.15))
  const key = new THREE.DirectionalLight(0xbfd9ff, 2.6)
  key.position.set(4, 6, 6)
  scene.add(key)
  const under = new THREE.PointLight(COLORS.red, 26, 18)
  under.position.set(0, -1.2, 3)
  scene.add(under)
  const rim = new THREE.PointLight(COLORS.cyan, 18, 20)
  rim.position.set(-5, 4, 0)
  scene.add(rim)
  // soft frontal fill so the controller body reads as a shape, not a silhouette
  const front = new THREE.PointLight(0xd8e6ff, 10, 14)
  front.position.set(0, 1.6, 5.4)
  scene.add(front)

  // ── Post-processing (bloom = the neon) ──
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.85, 0.75, 0.18)
  composer.addPass(bloom)
  composer.addPass(new OutputPass())

  // ── Interaction state ──
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
  function onPointer(e) {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  function resize() {
    const w = canvas.clientWidth || window.innerWidth
    const h = canvas.clientHeight || window.innerHeight
    renderer.setSize(w, h, false)
    composer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  // ── Animation loop ──
  const clock = new THREE.Clock()
  let running = true
  let visible = true

  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden
  })

  // Pause rendering once the hero is fully scrolled past
  const io = new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting
  }, { threshold: 0.02 })
  io.observe(canvas)

  const gridSpeed = reducedMotion ? 0 : 3.2

  function tick() {
    requestAnimationFrame(tick)
    if (!running || !visible) return
    const t = clock.getElapsedTime()
    const dt = Math.min(clock.getDelta(), 0.05)

    // infinite grid scroll
    grid.position.z = (t * gridSpeed) % 1.5
    gridFar.position.z = (t * gridSpeed * 0.55) % 1.5

    if (!reducedMotion) {
      pad.rotation.y = Math.sin(t * 0.45) * 0.55 + t * 0.12
      pad.position.y = 0.42 + Math.sin(t * 1.2) * 0.14
      pad.rotation.z = Math.sin(t * 0.6) * 0.06

      particles.rotation.y = t * 0.02
      icoL.rotation.x = t * 0.24; icoL.rotation.y = t * 0.18
      icoR.rotation.x = -t * 0.2; icoR.rotation.y = t * 0.26

      // red underglow pulse
      under.intensity = 22 + Math.sin(t * 2.2) * 8
    }

    // mouse parallax with soft lerp
    mouse.x += (mouse.tx - mouse.x) * 0.05
    mouse.y += (mouse.ty - mouse.y) * 0.05
    camera.position.x = mouse.x * 0.7
    camera.position.y = 1.15 - mouse.y * 0.35
    camera.lookAt(0, 0.9, 0)

    composer.render(dt)
  }
  tick()

  return {
    setScroll(progress) {
      // hero parallax as user scrolls away
      camera.fov = 58 + progress * 14
      camera.updateProjectionMatrix()
      pad.position.z = 2.2 + progress * 3.4
    },
  }
}
