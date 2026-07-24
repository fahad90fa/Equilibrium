// Procedural game controller — product-render style: matte black polymer
// with a clearcoat sheen, rubberized grips, restrained LED accents.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { COLORS } from './config.js'

function bodyMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0x14181e, metalness: 0.3, roughness: 0.42,
    clearcoat: 0.55, clearcoatRoughness: 0.3,
  })
}

function rubberMaterial() {
  return new THREE.MeshStandardMaterial({ color: 0x0c0f13, metalness: 0.1, roughness: 0.85 })
}

function ledMaterial(color, intensity = 1.1) {
  return new THREE.MeshStandardMaterial({
    color: 0x0a0c10, emissive: color, emissiveIntensity: intensity,
    metalness: 0.2, roughness: 0.45,
  })
}

// Glowing "EQ" badge in the middle
function makeBadgeTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#0b0d11'
  ctx.fillRect(0, 0, 128, 128)
  ctx.strokeStyle = '#ff4655'
  ctx.lineWidth = 6
  ctx.beginPath()
  const cx = 64, cy = 64, r = 46
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.stroke()
  ctx.fillStyle = '#e8e4dd'
  ctx.font = 'bold 44px "Bebas Neue", "Arial Narrow", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('EQ', 64, 68)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function createGamepad() {
  const pad = new THREE.Group()
  const body = bodyMaterial()
  const rubber = rubberMaterial()

  // Main slab
  const slab = new THREE.Mesh(new RoundedBoxGeometry(2.25, 0.88, 0.5, 5, 0.18), body)
  pad.add(slab)

  // Grips — angled capsules, rubberized
  const gripGeo = new THREE.CapsuleGeometry(0.33, 0.85, 8, 18)
  const gripL = new THREE.Mesh(gripGeo, rubber)
  gripL.position.set(-1.0, -0.48, 0.1)
  gripL.rotation.set(0.5, 0, 0.52)
  const gripR = gripL.clone()
  gripR.position.x = 1.0
  gripR.rotation.z = -0.52
  pad.add(gripL, gripR)

  // Thumbsticks — rubber caps, thin red LED ring at the base
  const stickBase = new THREE.CylinderGeometry(0.12, 0.15, 0.22, 20)
  const stickTop = new THREE.SphereGeometry(0.145, 20, 14)
  const ringMat = ledMaterial(COLORS.red, 1.5)
  ;[[-0.6, 0.1], [0.33, -0.16]].forEach(([x, y]) => {
    const g = new THREE.Group()
    const base = new THREE.Mesh(stickBase, rubber)
    const top = new THREE.Mesh(stickTop, rubber)
    top.position.y = 0.16
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.185, 0.016, 10, 28), ringMat)
    ring.rotation.x = Math.PI / 2
    g.add(base, top, ring)
    g.position.set(x, y, 0.28)
    g.rotation.x = Math.PI / 2
    pad.add(g)
  })

  // D-pad — matte black
  const dMat = new THREE.MeshStandardMaterial({ color: 0x181d24, metalness: 0.35, roughness: 0.55 })
  const dV = new THREE.Mesh(new RoundedBoxGeometry(0.14, 0.42, 0.09, 2, 0.03), dMat)
  const dH = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.14, 0.09, 2, 0.03), dMat)
  dV.position.set(-0.27, -0.16, 0.28)
  dH.position.copy(dV.position)
  pad.add(dV, dH)

  // Face buttons — black caps, two lit softly (red / warm white)
  const btnGeo = new THREE.CylinderGeometry(0.082, 0.082, 0.08, 20)
  const btnMats = [
    ledMaterial(COLORS.red, 1.3),
    dMat,
    dMat,
    ledMaterial(0xd8dce2, 0.7),
  ]
  ;[[0.6, 0.28], [0.6, -0.08], [0.42, 0.1], [0.78, 0.1]].forEach(([x, y], i) => {
    const b = new THREE.Mesh(btnGeo, btnMats[i])
    b.position.set(x, y, 0.28)
    b.rotation.x = Math.PI / 2
    pad.add(b)
  })

  // Shoulder bumpers
  const bumper = new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.13, 0.3, 2, 0.05), dMat)
  bumper.position.set(-0.72, 0.5, 0.05)
  const bumperR = bumper.clone()
  bumperR.position.x = 0.72
  pad.add(bumper, bumperR)

  // EQ badge
  const badgeTex = makeBadgeTexture()
  const badge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.165, 0.165, 0.05, 6),
    new THREE.MeshStandardMaterial({
      map: badgeTex, emissiveMap: badgeTex,
      emissive: 0xffffff, emissiveIntensity: 0.55, metalness: 0.25, roughness: 0.4,
    })
  )
  badge.position.set(0, 0.1, 0.28)
  badge.rotation.x = Math.PI / 2
  badge.rotation.y = Math.PI / 6
  pad.add(badge)

  // Slim red LED light-bar along the top edge
  const strip = new THREE.Mesh(
    new RoundedBoxGeometry(1.5, 0.045, 0.05, 2, 0.02),
    ledMaterial(COLORS.red, 1.9)
  )
  strip.position.set(0, 0.47, 0.14)
  pad.add(strip)

  pad.traverse((o) => { if (o.isMesh) { o.castShadow = true } })
  pad.rotation.x = -0.42
  return pad
}
