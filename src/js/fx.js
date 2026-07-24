// Interactive micro-FX: crosshair cursor, 3D card tilt, glitch bursts,
// animated stat counters, game-card injection.
import { GAMES } from './config.js'

// ── Crosshair cursor ──────────────────────────────────────────────
export function initCursor() {
  const el = document.getElementById('cursor')
  if (!el) return
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!fine) return
  document.body.classList.add('has-cursor')

  let x = -100, y = -100, cx = -100, cy = -100
  window.addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY }, { passive: true })

  function loop() {
    cx += (x - cx) * 0.32
    cy += (y - cy) * 0.32
    el.style.transform = `translate(${cx}px, ${cy}px)`
    requestAnimationFrame(loop)
  }
  loop()

  document.addEventListener('pointerover', (e) => {
    if (e.target.closest('[data-hover], a, button, input, select')) el.classList.add('is-active')
  })
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest('[data-hover], a, button, input, select')) el.classList.remove('is-active')
  })
}

// ── Random glitch bursts on .glitch elements ──────────────────────
export function initGlitchBursts(reducedMotion) {
  if (reducedMotion) return
  const els = document.querySelectorAll('.glitch')
  els.forEach((el) => {
    (function burst() {
      const delay = 1800 + Math.random() * 4200
      setTimeout(() => {
        el.classList.add('is-glitching')
        setTimeout(() => el.classList.remove('is-glitching'), 260 + Math.random() * 340)
        burst()
      }, delay)
    })()
  })
}

// ── 3D tilt on cards ──────────────────────────────────────────────
export function initTilt(reducedMotion) {
  if (reducedMotion || !window.matchMedia('(hover: hover)').matches) return
  document.querySelectorAll('.tilt, .game').forEach((card) => {
    let raf = null
    card.addEventListener('pointermove', (e) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        card.style.transform = `perspective(700px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-3px)`
        raf = null
      })
    })
    card.addEventListener('pointerleave', () => {
      card.style.transform = ''
      card.style.transition = 'transform .4s ease'
      setTimeout(() => (card.style.transition = ''), 400)
    })
  })
}

// ── Stat counters ─────────────────────────────────────────────────
export function initCounters() {
  const counters = document.querySelectorAll('.count')
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const el = entry.target
      io.unobserve(el)
      const target = parseInt(el.dataset.count, 10)
      const dur = 1400
      const start = performance.now()
      function step(now) {
        const p = Math.min((now - start) / dur, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        el.textContent = Math.round(target * eased)
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    })
  }, { threshold: 0.6 })
  counters.forEach((c) => io.observe(c))
}

// ── Inject game cards from data ───────────────────────────────────
export function renderGames() {
  const grid = document.getElementById('games-grid')
  if (!grid) return
  grid.innerHTML = GAMES.map((g) => `
    <article class="game" data-letter="${g.letter}" data-hover
      style="--g-c1:${g.c1}; --g-c2:${g.c2}">
      <span class="game__genre mono">${g.genre}</span>
      <h3 class="game__title">${g.title}</h3>
      <div class="game__tags">${g.tags.map((t) => `<i>${t}</i>`).join('')}</div>
    </article>
  `).join('')
}
