// Procedural low-poly game controller — built entirely from primitives,
// no external model files needed.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { COLORS } from './config.js'

function bodyMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0x1d2a3c, metalness: 0.55, roughness: 0.38,
    emissive: 0x0a1220, emissiveIntensity: 0.5,
  })
}

function glowMaterial(color, intensity = 1.6) {
  return new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: intensity,
    metalness: 0.1, roughness: 0.4,
  })
}

// Small canvas texture for the glowing "EQ" badge in the middle
function makeBadgeTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#0a0e17'
  ctx.fillRect(0, 0, 128, 128)
  ctx.strokeStyle = '#ff4655'
  ctx.lineWidth = 7
  ctx.beginPath()
  const cx = 64, cy = 64, r = 46
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.stroke()
  ctx.fillStyle = '#ece8e1'
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

  // Main slab
  const slab = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.95, 0.5, 4, 0.16), body)
  pad.add(slab)

  // Grips — angled capsules at each end
  const gripGeo = new THREE.CapsuleGeometry(0.34, 0.85, 6, 14)
  const gripL = new THREE.Mesh(gripGeo, body)
  gripL.position.set(-1.02, -0.48, 0.1)
  gripL.rotation.set(0.5, 0, 0.52)
  const gripR = gripL.clone()
  gripR.position.x = 1.02
  gripR.rotation.z = -0.52
  pad.add(gripL, gripR)

  // Thumbsticks
  const stickBase = new THREE.CylinderGeometry(0.13, 0.16, 0.22, 16)
  const stickTop = new THREE.SphereGeometry(0.15, 16, 12)
  const stickMat = new THREE.MeshStandardMaterial({ color: 0x0a0e17, metalness: 0.4, roughness: 0.5 })
  const ringMat = glowMaterial(COLORS.cyan, 1.9)
  ;[[-0.62, 0.1], [0.34, -0.16]].forEach(([x, y]) => {
    const g = new THREE.Group()
    const base = new THREE.Mesh(stickBase, stickMat)
    const top = new THREE.Mesh(stickTop, stickMat)
    top.position.y = 0.16
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.022, 8, 24), ringMat)
    ring.rotation.x = Math.PI / 2
    g.add(base, top, ring)
    g.position.set(x, y, 0.28)
    g.rotation.x = Math.PI / 2
    pad.add(g)
  })

  // D-pad
  const dMat = new THREE.MeshStandardMaterial({ color: 0x1c2836, metalness: 0.5, roughness: 0.45 })
  const dV = new THREE.Mesh(new RoundedBoxGeometry(0.14, 0.42, 0.1, 2, 0.03), dMat)
  const dH = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.14, 0.1, 2, 0.03), dMat)
  dV.position.set(-0.28, -0.16, 0.28)
  dH.position.copy(dV.position)
  pad.add(dV, dH)

  // Face buttons — diamond of four glowing dots
  const btnGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.09, 18)
  const btnColors = [COLORS.red, COLORS.cyan, COLORS.amber, 0x35d07f]
  ;[[0.62, 0.28], [0.62, -0.08], [0.44, 0.1], [0.8, 0.1]].forEach(([x, y], i) => {
    const b = new THREE.Mesh(btnGeo, glowMaterial(btnColors[i], 2.1))
    b.position.set(x, y, 0.28)
    b.rotation.x = Math.PI / 2
    pad.add(b)
  })

  // Shoulder bumpers
  const bumper = new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.13, 0.3, 2, 0.05), dMat)
  bumper.position.set(-0.75, 0.52, 0.05)
  const bumperR = bumper.clone()
  bumperR.position.x = 0.75
  pad.add(bumper, bumperR)

  // Glowing EQ badge
  const badge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.17, 0.06, 6),
    new THREE.MeshStandardMaterial({
      map: makeBadgeTexture(), emissiveMap: makeBadgeTexture(),
      emissive: 0xffffff, emissiveIntensity: 0.9, metalness: 0.2, roughness: 0.4,
    })
  )
  badge.position.set(0, 0.12, 0.28)
  badge.rotation.x = Math.PI / 2
  badge.rotation.y = Math.PI / 6
  pad.add(badge)

  // Accent light-strip across the top edge
  const strip = new THREE.Mesh(
    new RoundedBoxGeometry(1.7, 0.05, 0.06, 2, 0.02),
    glowMaterial(COLORS.red, 2.4)
  )
  strip.position.set(0, 0.5, 0.12)
  pad.add(strip)

  // Present at a heroic angle
  pad.rotation.x = -0.42
  return pad
}
