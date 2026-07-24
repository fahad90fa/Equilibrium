// Hardware section scene — a procedural gaming battlestation:
// monitor playing a live-drawn "gameplay HUD", RGB mechanical keyboard,
// tower with spinning glow fans. All generated in code, zero assets.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { COLORS } from './config.js'

// ── The "gameplay" that plays on the 3D monitor ───────────────────
function createScreenFeed() {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 288
  const ctx = c.getContext('2d')
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace

  const kills = ['EQ_Sniper ⟶ headshot ⟶ Rush_B', 'FahadOP ⟶ ace ⟶ enemy squad',
    'N00bSlayer ⟶ clutched ⟶ 1v3', 'LHR_Ghost ⟶ knifed ⟶ CamperKing',
    'ProBhai ⟶ wallbang ⟶ PeekLord']
  let killIdx = 0, killTimer = 0

  function draw(t) {
    // backdrop — moving perspective floor
    ctx.fillStyle = '#0b1220'
    ctx.fillRect(0, 0, 512, 288)
    ctx.strokeStyle = 'rgba(0,229,255,0.25)'
    ctx.lineWidth = 1
    const horizon = 120
    for (let i = 0; i < 12; i++) {
      const z = ((t * 60 + i * 40) % 480)
      const y = horizon + (z / 480) * 168
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke()
    }
    for (let i = -6; i <= 6; i++) {
      ctx.beginPath()
      ctx.moveTo(256 + i * 26, horizon)
      ctx.lineTo(256 + i * 130, 288)
      ctx.stroke()
    }
    // sky glow
    const g = ctx.createLinearGradient(0, 0, 0, horizon)
    g.addColorStop(0, '#111a2c'); g.addColorStop(1, '#1c2f45')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 512, horizon)
    // sun
    ctx.fillStyle = 'rgba(255,70,85,0.85)'
    ctx.beginPath(); ctx.arc(256, horizon - 18, 26, 0, Math.PI * 2); ctx.fill()

    // wandering "enemy" blips
    for (let i = 0; i < 3; i++) {
      const ex = 256 + Math.sin(t * (0.7 + i * 0.35) + i * 2.1) * (90 + i * 50)
      const ey = 150 + Math.cos(t * (0.5 + i * 0.3) + i) * 34
      ctx.fillStyle = i === 0 ? '#ff4655' : 'rgba(255,70,85,0.55)'
      ctx.fillRect(ex - 5, ey - 12, 10, 24)
    }

    // crosshair
    ctx.strokeStyle = '#00e5ff'
    ctx.lineWidth = 2
    const cx = 256 + Math.sin(t * 1.7) * 14, cy = 152 + Math.cos(t * 2.3) * 8
    ctx.beginPath()
    ctx.moveTo(cx - 14, cy); ctx.lineTo(cx - 5, cy)
    ctx.moveTo(cx + 5, cy); ctx.lineTo(cx + 14, cy)
    ctx.moveTo(cx, cy - 14); ctx.lineTo(cx, cy - 5)
    ctx.moveTo(cx, cy + 5); ctx.lineTo(cx, cy + 14)
    ctx.stroke()

    // HUD: healthbar
    ctx.fillStyle = 'rgba(10,14,23,0.75)'
    ctx.fillRect(14, 250, 150, 24)
    ctx.fillStyle = '#35d07f'
    ctx.fillRect(18, 254, 142 * (0.6 + 0.4 * Math.abs(Math.sin(t * 0.4))), 16)
    // HUD: ammo
    ctx.fillStyle = 'rgba(10,14,23,0.75)'
    ctx.fillRect(400, 250, 98, 24)
    ctx.fillStyle = '#ece8e1'
    ctx.font = 'bold 16px monospace'
    ctx.fillText(`${24 - (Math.floor(t * 4) % 25)} / 90`, 412, 267)
    // HUD: minimap
    ctx.strokeStyle = 'rgba(0,229,255,0.7)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(430, 14, 68, 68)
    ctx.fillStyle = 'rgba(0,229,255,0.15)'
    ctx.fillRect(430, 14, 68, 68)
    ctx.fillStyle = '#00e5ff'
    ctx.beginPath(); ctx.arc(464, 48, 3, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#ff4655'
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(438 + ((Math.sin(t * 0.8 + i * 2) * 0.5 + 0.5) * 52), 20 + ((Math.cos(t * 0.6 + i) * 0.5 + 0.5) * 52), 4, 4)
    }
    // HUD: killfeed
    killTimer += 1
    if (killTimer > 140) { killTimer = 0; killIdx = (killIdx + 1) % kills.length }
    ctx.fillStyle = 'rgba(10,14,23,0.7)'
    ctx.fillRect(14, 14, 250, 22)
    ctx.fillStyle = '#ff4655'
    ctx.font = '12px monospace'
    ctx.fillText(kills[killIdx], 22, 29)
    // scanline flicker
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    for (let y = (t * 120) % 6; y < 288; y += 6) ctx.fillRect(0, y, 512, 1)

    tex.needsUpdate = true
  }
  return { tex, draw }
}

function glowMat(color, intensity = 2) {
  return new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: intensity, metalness: 0.1, roughness: 0.5,
  })
}

export function initRigScene(canvas, { reducedMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(COLORS.navy, 8, 22)

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 60)
  camera.position.set(0, 1.9, 6.6)
  camera.lookAt(0, 0.85, 0)

  const dark = new THREE.MeshStandardMaterial({ color: 0x111a26, metalness: 0.6, roughness: 0.4 })
  const darker = new THREE.MeshStandardMaterial({ color: 0x0c1420, metalness: 0.5, roughness: 0.55 })

  const station = new THREE.Group()
  scene.add(station)

  // ── Desk ──
  const desk = new THREE.Mesh(new RoundedBoxGeometry(7, 0.18, 3.1, 2, 0.05), darker)
  desk.position.y = -0.1
  station.add(desk)
  const deskEdge = new THREE.Mesh(new THREE.BoxGeometry(7, 0.03, 0.05), glowMat(COLORS.red, 2.4))
  deskEdge.position.set(0, 0, 1.53)
  station.add(deskEdge)

  // ── Monitor (plays the live feed) ──
  const feed = createScreenFeed()
  const monitor = new THREE.Group()
  const frame = new THREE.Mesh(new RoundedBoxGeometry(3.5, 2.05, 0.12, 2, 0.04), dark)
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(3.3, 1.85),
    new THREE.MeshBasicMaterial({ map: feed.tex, toneMapped: false })
  )
  screen.position.z = 0.07
  const standNeck = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.7, 0.1), dark)
  standNeck.position.set(0, -1.3, -0.05)
  const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.06, 24), dark)
  standBase.position.set(0, -1.62, 0)
  monitor.add(frame, screen, standNeck, standBase)
  monitor.position.set(-0.4, 1.72, -0.6)
  monitor.rotation.y = 0.06
  station.add(monitor)

  // ── RGB mechanical keyboard ──
  const keyboard = new THREE.Group()
  const kbBase = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.12, 0.85, 2, 0.03), dark)
  keyboard.add(kbBase)
  const keyGeo = new RoundedBoxGeometry(0.135, 0.06, 0.135, 1, 0.015)
  const keys = []
  for (let r = 0; r < 4; r++) {
    for (let col = 0; col < 13; col++) {
      const m = new THREE.MeshStandardMaterial({
        color: 0x1a2635, metalness: 0.3, roughness: 0.6,
        emissive: new THREE.Color().setHSL((r * 13 + col) / 52, 0.9, 0.5),
        emissiveIntensity: 0.55,
      })
      const k = new THREE.Mesh(keyGeo, m)
      k.position.set(-0.96 + col * 0.16, 0.09, -0.24 + r * 0.16)
      keyboard.add(k)
      keys.push(k)
    }
  }
  keyboard.position.set(-0.4, 0.05, 0.65)
  keyboard.rotation.y = -0.04
  station.add(keyboard)

  // ── Mouse + glowing pad ──
  const mousePad = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.75), new THREE.MeshStandardMaterial({
    color: 0x0d1520, emissive: COLORS.cyan, emissiveIntensity: 0.08, roughness: 0.9,
  }))
  mousePad.rotation.x = -Math.PI / 2
  mousePad.position.set(1.25, 0.005, 0.62)
  const mouseBody = new THREE.Mesh(new THREE.SphereGeometry(0.16, 18, 14), dark)
  mouseBody.scale.set(0.85, 0.5, 1.3)
  mouseBody.position.set(1.25, 0.07, 0.62)
  const mouseStrip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.32), glowMat(COLORS.cyan, 2.2))
  mouseStrip.position.set(1.25, 0.14, 0.6)
  station.add(mousePad, mouseBody, mouseStrip)

  // ── Tower with spinning glow-fans ──
  const tower = new THREE.Group()
  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x1b2939, metalness: 0.55, roughness: 0.42,
    emissive: 0x0c1522, emissiveIntensity: 0.6,
  })
  const towerBody = new THREE.Mesh(new RoundedBoxGeometry(0.95, 2.2, 2.0, 2, 0.04), towerMat)
  tower.add(towerBody)
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 2.05),
    new THREE.MeshStandardMaterial({ color: 0x0a1018, metalness: 0.9, roughness: 0.15, transparent: true, opacity: 0.55 })
  )
  glass.position.set(0.49, 0, 0)
  glass.rotation.y = Math.PI / 2
  tower.add(glass)
  const fans = []
  const fanColors = [COLORS.red, COLORS.cyan, 0xff2bd6] // brand palette, no rainbow drift
  for (let i = 0; i < 3; i++) {
    const fan = new THREE.Group()
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.035, 10, 28), glowMat(fanColors[i], 2.2))
    fan.add(ring)
    for (let b = 0; b < 3; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.07, 0.02), dark)
      blade.rotation.z = (b / 3) * Math.PI * 2
      fan.add(blade)
    }
    // fans live on the front face, angled toward the camera
    fan.position.set(0, 0.66 - i * 0.66, 1.02)
    tower.add(fan)
    fans.push({ fan, ring })
  }
  const gpuStrip = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.02), glowMat(COLORS.cyan, 2.4))
  gpuStrip.position.set(0, -0.95, 1.02)
  tower.add(gpuStrip)
  tower.position.set(2.25, 1.0, -0.45)
  tower.rotation.y = -0.5
  station.add(tower)

  // ── Headset on a stand ──
  const hsStand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 10), dark)
  hsStand.position.set(-2.6, 0.45, 0.3)
  const hsBand = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 10, 24, Math.PI), dark)
  hsBand.position.set(-2.6, 0.85, 0.3)
  const earL = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 12), dark)
  earL.scale.set(1, 1.25, 0.7); earL.position.set(-2.9, 0.72, 0.3)
  const earR = earL.clone(); earR.position.x = -2.3
  const hsGlowL = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.018, 8, 20), glowMat(COLORS.red, 2))
  hsGlowL.position.copy(earL.position); hsGlowL.position.x -= 0.09; hsGlowL.rotation.y = Math.PI / 2
  const hsGlowR = hsGlowL.clone(); hsGlowR.position.x = earR.position.x + 0.09
  station.add(hsStand, hsBand, earL, earR, hsGlowL, hsGlowR)

  // ── Floor glow ──
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ color: 0x0a0e17, metalness: 0.4, roughness: 0.7 })
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -1.55
  scene.add(floor)

  station.position.y = -0.45

  // ── Lights ──
  scene.add(new THREE.AmbientLight(0x3c5070, 1.7))
  const key = new THREE.DirectionalLight(0xcfe0ff, 2.3)
  key.position.set(-3, 6, 5)
  scene.add(key)
  const redFill = new THREE.PointLight(COLORS.red, 24, 15)
  redFill.position.set(3.4, 2.4, 1.6)
  scene.add(redFill)
  const cyanFill = new THREE.PointLight(COLORS.cyan, 16, 13)
  cyanFill.position.set(-3.4, 1.8, 2.2)
  scene.add(cyanFill)
  // screen light spills onto the desk
  const screenLight = new THREE.PointLight(0x8ab6ff, 10, 7)
  screenLight.position.set(-0.4, 1.6, 0.4)
  scene.add(screenLight)
  // frontal fill so the station reads clearly
  const front = new THREE.PointLight(0xd8e6ff, 14, 16)
  front.position.set(0.6, 2.4, 5.6)
  scene.add(front)

  function resize() {
    const w = canvas.clientWidth || 600
    const h = canvas.clientHeight || 460
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  const mouse = { x: 0, tx: 0 }
  window.addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
  }, { passive: true })

  const clock = new THREE.Clock()
  let running = false
  let visible = true
  document.addEventListener('visibilitychange', () => { visible = !document.hidden })

  const io = new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting
  }, { threshold: 0.05 })
  io.observe(canvas)

  let frameCount = 0
  function tick() {
    requestAnimationFrame(tick)
    if (!running || !visible) return
    const t = clock.getElapsedTime()
    frameCount++

    // live gameplay feed — redraw every other frame (canvas 2D is cheap but why waste it)
    if (frameCount % 2 === 0) feed.draw(t)

    if (!reducedMotion) {
      // slow showcase sway
      station.rotation.y = Math.sin(t * 0.22) * 0.16 + mouse.x * 0.12
      // fans spin, glow pulses in brand colors
      fans.forEach(({ fan, ring }, i) => {
        fan.children.forEach((child, ci) => { if (ci > 0) child.rotation.z += 0.3 })
        ring.material.emissiveIntensity = 1.7 + Math.sin(t * 2.4 + i * 2.1) * 0.8
      })
      // rgb keyboard wave
      keys.forEach((k, i) => {
        const col = i % 13
        k.material.emissiveIntensity = 0.35 + Math.max(0, Math.sin(t * 3 - col * 0.45)) * 0.85
      })
      // occasional key "press"
      keys.forEach((k, i) => {
        k.position.y = 0.09 - (Math.sin(t * 9 + i * 37.7) > 0.985 ? 0.03 : 0)
      })
      redFill.intensity = 17 + Math.sin(t * 1.8) * 6
    }

    mouse.x += (mouse.tx - mouse.x) * 0.04
    renderer.render(scene, camera)
  }
  tick()
}
