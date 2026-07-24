// Procedurally generated textures for the cinematic scenes —
// soft sprites, beam gradients and glow halos, all drawn on canvas.
import * as THREE from 'three'

// Soft round particle sprite (dust motes / bokeh)
export function softSprite(size = 64, inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, inner)
  g.addColorStop(0.4, inner.replace(/1\)$/, '0.45)'))
  g.addColorStop(1, outer)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Vertical gradient used on volumetric light cones (bright top → clear bottom)
export function beamGradient() {
  const c = document.createElement('canvas')
  c.width = 2
  c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 0, 128)
  g.addColorStop(0, 'rgba(255,255,255,0.85)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.28)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 2, 128)
  return new THREE.CanvasTexture(c)
}

// Big soft halo for cinematic backlight
export function haloSprite(size = 256, rgb = '255,70,85') {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, `rgba(${rgb},0.55)`)
  g.addColorStop(0.45, `rgba(${rgb},0.16)`)
  g.addColorStop(1, `rgba(${rgb},0)`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Subtle hex-plate pattern for the backdrop wall
export function hexPanelTexture(size = 512) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#07090e'
  ctx.fillRect(0, 0, size, size)
  ctx.strokeStyle = 'rgba(60,74,94,0.28)'
  ctx.lineWidth = 1.2
  const r = 34
  const h = r * Math.sqrt(3)
  for (let row = -1; row < size / h + 1; row++) {
    for (let col = -1; col < size / (r * 1.5) + 1; col++) {
      const cx = col * r * 1.5
      const cy = row * h + (col % 2 ? h / 2 : 0)
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6
        const x = cx + r * Math.cos(a)
        const y = cy + r * Math.sin(a)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}
