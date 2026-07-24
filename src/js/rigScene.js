// Hardware section scene — a realistic gaming battlestation render:
// PBR materials with IBL reflections, soft shadows, a monitor playing a
// live-drawn tactical-FPS feed, red-LED keyboard and case fans.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { COLORS } from './config.js'

// ── The tactical "gameplay" that plays on the 3D monitor ──────────
function createScreenFeed() {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 288
  const ctx = c.getContext('2d')
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4

  const kills = ['EQ_Sniper       headshot       Rush_B', 'FahadOP       ace       enemy squad',
    'LHR_Ghost       clutch       1v3', 'ProBhai       wallbang       PeekLord']
  let killIdx = 0, killTimer = 0, hitFlash = 0

  function draw(t) {
    // muted night-ops backdrop with an ember glow at the horizon
    const sky = ctx.createLinearGradient(0, 0, 0, 132)
    sky.addColorStop(0, '#0c1119')
    sky.addColorStop(1, '#22303f')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, 512, 132)
    const ember = ctx.createRadialGradient(340, 130, 4, 340, 130, 120)
    ember.addColorStop(0, 'rgba(255,120,70,0.34)')
    ember.addColorStop(1, 'rgba(255,120,70,0)')
    ctx.fillStyle = ember
    ctx.fillRect(200, 40, 300, 96)
    const gnd = ctx.createLinearGradient(0, 132, 0, 288)
    gnd.addColorStop(0, '#141a21')
    gnd.addColorStop(1, '#07090c')
    ctx.fillStyle = gnd
    ctx.fillRect(0, 132, 512, 156)

    // distant structures (parallax silhouettes)
    ctx.fillStyle = '#0d1219'
    for (let i = 0; i < 7; i++) {
      const bx = ((i * 97 - t * 14) % 620) - 60
      const bh = 26 + ((i * 37) % 40)
      ctx.fillRect(bx, 132 - bh, 44, bh)
    }
    // ground perspective streaks
    ctx.strokeStyle = 'rgba(120,140,160,0.08)'
    ctx.lineWidth = 1
    for (let i = -5; i <= 5; i++) {
      ctx.beginPath()
      ctx.moveTo(256 + i * 22, 132)
      ctx.lineTo(256 + i * 120, 288)
      ctx.stroke()
    }

    // hostiles — dark silhouettes with red outline boxes
    for (let i = 0; i < 3; i++) {
      const ex = 256 + Math.sin(t * (0.6 + i * 0.3) + i * 2.1) * (100 + i * 45)
      const ey = 158 + Math.cos(t * (0.45 + i * 0.3) + i) * 26
      ctx.fillStyle = '#10151c'
      ctx.fillRect(ex - 5, ey - 14, 10, 26)
      ctx.fillStyle = '#1b232d'
      ctx.beginPath(); ctx.arc(ex, ey - 18, 4, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = 'rgba(255,70,85,0.85)'
      ctx.lineWidth = 1
      ctx.strokeRect(ex - 9, ey - 25, 18, 40)
      ctx.fillStyle = 'rgba(255,70,85,0.9)'
      ctx.font = '8px monospace'
      ctx.fillText(`${(34 + i * 11)}m`, ex - 8, ey - 29)
    }

    // crosshair — clean white, hitmarker flash on "shots"
    const cx = 256 + Math.sin(t * 1.6) * 12, cy = 160 + Math.cos(t * 2.1) * 7
    ctx.strokeStyle = 'rgba(235,240,245,0.95)'
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.moveTo(cx - 12, cy); ctx.lineTo(cx - 4, cy)
    ctx.moveTo(cx + 4, cy); ctx.lineTo(cx + 12, cy)
    ctx.moveTo(cx, cy - 12); ctx.lineTo(cx, cy - 4)
    ctx.moveTo(cx, cy + 4); ctx.lineTo(cx, cy + 12)
    ctx.stroke()
    if (Math.sin(t * 0.9) > 0.93) hitFlash = 1
    if (hitFlash > 0.02) {
      ctx.strokeStyle = `rgba(255,70,85,${hitFlash})`
      ctx.beginPath()
      ;[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
        ctx.moveTo(cx + sx * 6, cy + sy * 6); ctx.lineTo(cx + sx * 11, cy + sy * 11)
      })
      ctx.stroke()
      hitFlash *= 0.86
    }

    // HUD — minimal white/red
    ctx.fillStyle = 'rgba(6,8,11,0.72)'
    ctx.fillRect(14, 252, 132, 22)
    ctx.fillStyle = '#2e3a46'
    ctx.fillRect(18, 262, 124, 6)
    ctx.fillStyle = '#e8edf2'
    ctx.fillRect(18, 262, 124 * (0.55 + 0.45 * Math.abs(Math.sin(t * 0.35))), 6)
    ctx.font = 'bold 9px monospace'
    ctx.fillStyle = '#aab6c2'
    ctx.fillText('HP', 18, 259)

    ctx.fillStyle = 'rgba(6,8,11,0.72)'
    ctx.fillRect(408, 252, 90, 22)
    ctx.fillStyle = '#e8edf2'
    ctx.font = 'bold 14px monospace'
    ctx.fillText(`${24 - (Math.floor(t * 3) % 25)}`, 418, 268)
    ctx.fillStyle = '#66727e'
    ctx.font = '10px monospace'
    ctx.fillText('/ 90', 448, 268)

    // minimap — grayscale, red pings
    ctx.fillStyle = 'rgba(6,8,11,0.72)'
    ctx.fillRect(428, 14, 70, 70)
    ctx.strokeStyle = 'rgba(160,175,190,0.5)'
    ctx.lineWidth = 1
    ctx.strokeRect(428, 14, 70, 70)
    ctx.strokeStyle = 'rgba(160,175,190,0.16)'
    ctx.beginPath()
    ctx.moveTo(428, 49); ctx.lineTo(498, 49)
    ctx.moveTo(463, 14); ctx.lineTo(463, 84)
    ctx.stroke()
    ctx.fillStyle = '#e8edf2'
    ctx.beginPath(); ctx.arc(463, 49, 2.5, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#ff4655'
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(436 + ((Math.sin(t * 0.7 + i * 2) * 0.5 + 0.5) * 54), 20 + ((Math.cos(t * 0.5 + i) * 0.5 + 0.5) * 56), 3, 3)
    }

    // killfeed
    killTimer += 1
    if (killTimer > 150) { killTimer = 0; killIdx = (killIdx + 1) % kills.length }
    ctx.fillStyle = 'rgba(6,8,11,0.66)'
    ctx.fillRect(14, 14, 236, 20)
    ctx.font = '10px monospace'
    ctx.fillStyle = '#c9d2db'
    ctx.fillText(kills[killIdx].split('       ')[0], 20, 27)
    ctx.fillStyle = '#ff4655'
    ctx.fillText('⌖ ' + kills[killIdx].split('       ')[1], 100, 27)
    ctx.fillStyle = '#c9d2db'
    ctx.fillText(kills[killIdx].split('       ')[2], 168, 27)

    // subtle scan flicker
    ctx.fillStyle = 'rgba(255,255,255,0.018)'
    for (let y = (t * 90) % 5; y < 288; y += 5) ctx.fillRect(0, y, 512, 1)

    tex.needsUpdate = true
  }
  return { tex, draw }
}

function ledMat(color, intensity = 1.4) {
  return new THREE.MeshStandardMaterial({
    color: 0x0a0c10, emissive: color, emissiveIntensity: intensity,
    metalness: 0.2, roughness: 0.5,
  })
}

export function initRigScene(canvas, { reducedMotion = false } = {}) {
  const isMobile = window.innerWidth < 820
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.18
  if (!isMobile) {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0f1923, 0.03)

  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.06).texture
  scene.environmentIntensity = 0.4

  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 60)
  camera.position.set(0, 1.9, 6.6)
  camera.lookAt(0, 0.85, 0)

  // materials
  const plastic = new THREE.MeshPhysicalMaterial({
    color: 0x11151b, metalness: 0.3, roughness: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.4,
  })
  const metal = new THREE.MeshStandardMaterial({ color: 0x161b22, metalness: 0.75, roughness: 0.35 })
  const matte = new THREE.MeshStandardMaterial({ color: 0x0c0f14, metalness: 0.25, roughness: 0.7 })

  const station = new THREE.Group()
  scene.add(station)

  // ── Desk — dark laminate with a soft sheen ──
  const desk = new THREE.Mesh(new RoundedBoxGeometry(7, 0.16, 3.1, 2, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x0d1015, metalness: 0.45, roughness: 0.4, envMapIntensity: 0.8 }))
  desk.position.y = -0.1
  desk.receiveShadow = true
  station.add(desk)
  const deskEdge = new THREE.Mesh(new THREE.BoxGeometry(7, 0.025, 0.04), ledMat(COLORS.red, 1.6))
  deskEdge.position.set(0, -0.02, 1.53)
  station.add(deskEdge)

  // ── Monitor (plays the live feed) ──
  const feed = createScreenFeed()
  const monitor = new THREE.Group()
  const frame = new THREE.Mesh(new RoundedBoxGeometry(3.5, 2.05, 0.1, 2, 0.03), plastic)
  frame.castShadow = true
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(3.36, 1.9),
    new THREE.MeshBasicMaterial({ map: feed.tex, toneMapped: false })
  )
  screen.position.z = 0.06
  const standNeck = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.7, 0.09), metal)
  standNeck.position.set(0, -1.3, -0.05)
  const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.58, 0.05, 28), metal)
  standBase.position.set(0, -1.62, 0)
  monitor.add(frame, screen, standNeck, standBase)
  monitor.position.set(-0.4, 1.72, -0.6)
  monitor.rotation.y = 0.06
  station.add(monitor)

  // ── Keyboard — black caps over a red LED underglow wave ──
  const keyboard = new THREE.Group()
  const kbBase = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.11, 0.85, 2, 0.03), plastic)
  kbBase.castShadow = true
  keyboard.add(kbBase)
  const keyGeo = new RoundedBoxGeometry(0.135, 0.055, 0.135, 1, 0.014)
  const keys = []
  for (let r = 0; r < 4; r++) {
    for (let col = 0; col < 13; col++) {
      const m = new THREE.MeshStandardMaterial({
        color: 0x14181e, metalness: 0.25, roughness: 0.6,
        emissive: COLORS.red, emissiveIntensity: 0.12,
      })
      const k = new THREE.Mesh(keyGeo, m)
      k.position.set(-0.96 + col * 0.16, 0.085, -0.24 + r * 0.16)
      keyboard.add(k)
      keys.push(k)
    }
  }
  keyboard.position.set(-0.4, 0.05, 0.65)
  keyboard.rotation.y = -0.04
  station.add(keyboard)

  // ── Mouse + pad ──
  const mousePad = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.75), matte)
  mousePad.rotation.x = -Math.PI / 2
  mousePad.position.set(1.25, 0.002, 0.62)
  const mouseBody = new THREE.Mesh(new THREE.SphereGeometry(0.16, 22, 16), plastic)
  mouseBody.scale.set(0.82, 0.48, 1.28)
  mouseBody.position.set(1.25, 0.065, 0.62)
  mouseBody.castShadow = true
  const mouseStrip = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.016, 0.3), ledMat(COLORS.red, 1.5))
  mouseStrip.position.set(1.25, 0.135, 0.6)
  station.add(mousePad, mouseBody, mouseStrip)

  // ── Tower — brushed metal case, tempered-glass front, red LED fans ──
  const tower = new THREE.Group()
  const towerBody = new THREE.Mesh(new RoundedBoxGeometry(0.95, 2.2, 2.0, 2, 0.03), metal)
  towerBody.castShadow = true
  tower.add(towerBody)
  const glassFront = new THREE.Mesh(
    new THREE.PlaneGeometry(0.86, 2.1),
    new THREE.MeshPhysicalMaterial({
      color: 0x05070b, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.42,
      clearcoat: 1, clearcoatRoughness: 0.05,
    })
  )
  glassFront.position.set(0, 0, 1.06)
  tower.add(glassFront)
  const fans = []
  for (let i = 0; i < 3; i++) {
    const fan = new THREE.Group()
    const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 28), matte)
    housing.rotation.x = Math.PI / 2
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.026, 12, 32), ledMat(COLORS.red, 1.6))
    fan.add(housing, ring)
    const blades = new THREE.Group()
    for (let b = 0; b < 7; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.016), metal)
      blade.position.x = 0.12
      const holder = new THREE.Group()
      holder.rotation.z = (b / 7) * Math.PI * 2
      holder.add(blade)
      blades.add(holder)
    }
    fan.add(blades)
    fan.position.set(0, 0.66 - i * 0.66, 1.02)
    tower.add(fan)
    fans.push({ blades, ring })
  }
  tower.position.set(2.25, 1.0, -0.45)
  tower.rotation.y = -0.5
  station.add(tower)

  // ── Headset on a stand ──
  const hsStand = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.9, 12), metal)
  hsStand.position.set(-2.6, 0.45, 0.3)
  const hsBand = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 12, 28, Math.PI), plastic)
  hsBand.position.set(-2.6, 0.85, 0.3)
  const earL = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 14), plastic)
  earL.scale.set(1, 1.25, 0.7); earL.position.set(-2.9, 0.72, 0.3)
  const earR = earL.clone(); earR.position.x = -2.3
  const hsGlowL = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.014, 10, 22), ledMat(COLORS.red, 1.2))
  hsGlowL.position.copy(earL.position); hsGlowL.position.x -= 0.09; hsGlowL.rotation.y = Math.PI / 2
  const hsGlowR = hsGlowL.clone(); hsGlowR.position.x = earR.position.x + 0.09
  station.add(hsStand, hsBand, earL, earR, hsGlowL, hsGlowR)

  // ── Floor — same glossy studio floor as the hero ──
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(34, 34),
    new THREE.MeshStandardMaterial({ color: 0x0c141d, metalness: 0.8, roughness: 0.28, envMapIntensity: 0.9 })
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -1.55
  floor.receiveShadow = true
  scene.add(floor)

  station.position.y = -0.45

  // ── Lights ──
  scene.add(new THREE.AmbientLight(0x1e2836, 1.5))
  const key = new THREE.SpotLight(0xe6eeff, 110, 30, 0.6, 0.5, 1.7)
  key.position.set(-2.5, 7, 5)
  key.target = station
  if (!isMobile) {
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.bias = -0.0005
  }
  scene.add(key)
  const redFill = new THREE.PointLight(COLORS.red, 18, 14, 1.9)
  redFill.position.set(3.4, 2.4, 1.6)
  scene.add(redFill)
  const coolFill = new THREE.PointLight(0xaec6e8, 10, 13, 1.9)
  coolFill.position.set(-3.4, 1.8, 2.4)
  scene.add(coolFill)
  const screenLight = new THREE.PointLight(0x9db8dd, 9, 7, 1.9)
  screenLight.position.set(-0.4, 1.6, 0.5)
  scene.add(screenLight)

  function resize() {
    const w = canvas.clientWidth || 600
    const h = canvas.clientHeight || 460
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  // Pre-compile shaders and render one warm-up frame now (while the user
  // is still up at the hero) so the first scroll-past never stalls.
  feed.draw(0)
  renderer.compile(scene, camera)
  renderer.render(scene, camera)

  const mouse = { x: 0, tx: 0 }
  window.addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
  }, { passive: true })

  const clock = new THREE.Clock()
  let running = false
  let visible = true
  document.addEventListener('visibilitychange', () => { visible = !document.hidden })
  const io = new IntersectionObserver(([entry]) => { running = entry.isIntersecting }, { threshold: 0.05 })
  io.observe(canvas)

  let frameCount = 0
  function tick() {
    requestAnimationFrame(tick)
    if (!running || !visible) return
    const t = clock.getElapsedTime()
    frameCount++

    if (frameCount % 2 === 0) feed.draw(t)

    if (!reducedMotion) {
      station.rotation.y = Math.sin(t * 0.2) * 0.14 + mouse.x * 0.1

      fans.forEach(({ blades, ring }, i) => {
        blades.rotation.z += 0.32
        ring.material.emissiveIntensity = 1.35 + Math.sin(t * 2.2 + i * 2.1) * 0.45
      })
      // red LED wave sweeping across the keys
      keys.forEach((k, i) => {
        const col = i % 13
        k.material.emissiveIntensity = 0.1 + Math.max(0, Math.sin(t * 2.2 - col * 0.4)) * 0.5
        k.position.y = 0.085 - (Math.sin(t * 9 + i * 37.7) > 0.988 ? 0.025 : 0)
      })
      redFill.intensity = 16 + Math.sin(t * 1.6) * 4
    }

    mouse.x += (mouse.tx - mouse.x) * 0.04
    renderer.render(scene, camera)
  }
  tick()
}
