// Hero WebGL scene — cinematic product-showcase style:
// PBR controller under studio spotlights on a glossy dark floor,
// volumetric light shafts, drifting dust, ACES filmic grade + bloom.
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { createGamepad } from './gamepad.js'
import { COLORS } from './config.js'
import { softSprite, beamGradient, haloSprite, hexPanelTexture } from './textures.js'

function makeDust(count) {
  const geo = new THREE.BufferGeometry()
  const pos = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 22
    pos[i * 3 + 1] = Math.random() * 9 - 1.6
    pos[i * 3 + 2] = -Math.random() * 16 + 5
    seeds[i] = Math.random() * Math.PI * 2
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const mat = new THREE.PointsMaterial({
    size: 0.055, map: softSprite(48), transparent: true, opacity: 0.5,
    color: 0xcfd8e6, blending: THREE.AdditiveBlending, depthWrite: false,
  })
  const points = new THREE.Points(geo, mat)
  points.userData.seeds = seeds
  return points
}

function makeBeam(color, opacity) {
  const geo = new THREE.ConeGeometry(2.5, 11, 40, 1, true)
  const mat = new THREE.MeshBasicMaterial({
    map: beamGradient(), color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  })
  return new THREE.Mesh(geo, mat)
}

export function initHeroScene(canvas, { reducedMotion = false } = {}) {
  const isMobile = window.innerWidth < 820

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: !isMobile, alpha: false, powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.12
  if (!isMobile) {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x05070b)
  scene.fog = new THREE.FogExp2(0x05070b, 0.052)

  // image-based lighting for believable reflections on the PBR materials
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.06).texture
  scene.environmentIntensity = 0.35

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 80)
  camera.position.set(0, 1.35, 7.4)

  // ── Stage ──
  // glossy dark floor — picks up the environment + spotlight like polished stone
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 40),
    new THREE.MeshStandardMaterial({
      color: 0x090c12, metalness: 0.82, roughness: 0.24, envMapIntensity: 1.1,
    })
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -1.7
  floor.receiveShadow = true
  scene.add(floor)

  // faint red ground-glow ring under the showcase
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.35, 2.5, 64),
    new THREE.MeshBasicMaterial({
      map: haloSprite(256), color: COLORS.red, transparent: true, opacity: 0.16,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
  )
  ring.rotation.x = -Math.PI / 2
  ring.position.set(0, -1.69, 1.4)
  scene.add(ring)

  // hex-plate backdrop wall, barely visible through the haze
  const wallTex = hexPanelTexture()
  wallTex.repeat.set(5, 2.4)
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 26),
    new THREE.MeshStandardMaterial({
      map: wallTex, color: 0x2c374a, metalness: 0.6, roughness: 0.6,
    })
  )
  wall.position.set(0, 6, -15)
  scene.add(wall)

  // cinematic red backlight halo behind the controller
  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(11, 11),
    new THREE.MeshBasicMaterial({
      map: haloSprite(256, '255,60,74'), transparent: true, opacity: 0.38,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
  )
  halo.position.set(0.4, 0.9, -3.4)
  scene.add(halo)

  // volumetric-style light shafts
  const beamL = makeBeam(0xbfd4ee, 0.05)
  beamL.position.set(-3.6, 3.4, -1.5)
  beamL.rotation.z = 0.42
  const beamR = makeBeam(0xffb0b6, 0.045)
  beamR.position.set(3.8, 3.6, -2.2)
  beamR.rotation.z = -0.38
  scene.add(beamL, beamR)

  // drifting dust motes
  const dust = makeDust(isMobile ? 140 : 320)
  scene.add(dust)

  // ── The showcase piece ──
  const pad = createGamepad()
  pad.scale.setScalar(isMobile ? 0.58 : 0.78)
  pad.position.set(0, -0.12, 2.4)
  scene.add(pad)

  // ── Lights (studio setup) ──
  scene.add(new THREE.AmbientLight(0x1c2634, 1.4))
  // key spot from top-front — casts the contact shadow
  const key = new THREE.SpotLight(0xe8f0ff, 140, 30, 0.55, 0.45, 1.6)
  key.position.set(2.5, 7.5, 6)
  key.target = pad
  if (!isMobile) {
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.bias = -0.0005
  }
  scene.add(key)
  // red rim from behind-left — the signature accent
  const rim = new THREE.PointLight(COLORS.red, 30, 20, 1.8)
  rim.position.set(-4, 2.6, -1.5)
  scene.add(rim)
  // cool kicker from the right for edge separation
  const kick = new THREE.PointLight(0x9fc4ff, 16, 16, 1.8)
  kick.position.set(5, 1.2, 2.5)
  scene.add(kick)
  // soft frontal fill
  const front = new THREE.PointLight(0xd8e2f2, 7, 14, 1.9)
  front.position.set(0, 1.4, 6)
  scene.add(front)

  // ── Post: restrained bloom (LEDs + halo only) + filmic output ──
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.85, 0.62)
  composer.addPass(bloom)
  composer.addPass(new OutputPass())

  // ── Interaction ──
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

  const clock = new THREE.Clock()
  let running = true
  let visible = true
  document.addEventListener('visibilitychange', () => { visible = !document.hidden })
  const io = new IntersectionObserver(([entry]) => { running = entry.isIntersecting }, { threshold: 0.02 })
  io.observe(canvas)

  let scrollProgress = 0

  function tick() {
    requestAnimationFrame(tick)
    if (!running || !visible) return
    const t = clock.getElapsedTime()
    const dt = Math.min(clock.getDelta(), 0.05)

    if (!reducedMotion) {
      // slow display-stand rotation + gentle float
      pad.rotation.y = Math.sin(t * 0.4) * 0.5 + t * 0.1
      pad.position.y = -0.12 + Math.sin(t * 1.1) * 0.1
      pad.rotation.z = Math.sin(t * 0.55) * 0.05

      // dust drifts upward, loops
      const pos = dust.geometry.attributes.position
      const seeds = dust.userData.seeds
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) + dt * 0.14
        if (y > 7.5) y = -1.6
        pos.setY(i, y)
        pos.setX(i, pos.getX(i) + Math.sin(t * 0.5 + seeds[i]) * dt * 0.05)
      }
      pos.needsUpdate = true

      // light shafts sway almost imperceptibly
      beamL.rotation.z = 0.42 + Math.sin(t * 0.3) * 0.03
      beamR.rotation.z = -0.38 + Math.cos(t * 0.26) * 0.03
      halo.material.opacity = 0.44 + Math.sin(t * 1.3) * 0.08
      rim.intensity = 27 + Math.sin(t * 1.7) * 6
    }

    // slow cinematic dolly + mouse parallax
    mouse.x += (mouse.tx - mouse.x) * 0.045
    mouse.y += (mouse.ty - mouse.y) * 0.045
    const dolly = reducedMotion ? 0 : Math.sin(t * 0.16) * 0.25
    camera.position.x = mouse.x * 0.55
    camera.position.y = 1.35 - mouse.y * 0.3 + scrollProgress * 1.2
    camera.position.z = 7.4 + dolly + scrollProgress * 2.6
    camera.lookAt(0, 0.3, 0.8)

    composer.render(dt)
  }
  tick()

  return {
    setScroll(progress) { scrollProgress = progress },
  }
}
