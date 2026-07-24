// ═══════════════════════════════════════════════════════════════
// EQUILIBRIUM GAMING ZONE — site boot
// ═══════════════════════════════════════════════════════════════
import './styles/base.css'
import './styles/sections.css'
import { SITE } from './js/config.js'
import { initCursor, initGlitchBursts, initTilt, initCounters, renderGames } from './js/fx.js'
import { runPreloader, heroEntrance, initScrollAnimations, bindHeroScroll } from './js/animations.js'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (reducedMotion) document.documentElement.classList.add('reduced')

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch { return false }
}

// ── Nav behaviour ─────────────────────────────────────────────────
function initNav() {
  const nav = document.getElementById('nav')
  const burger = document.getElementById('nav-burger')
  const links = document.getElementById('nav-links')

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40)
  }, { passive: true })

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('is-open')
    burger.setAttribute('aria-expanded', String(open))
  })
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    links.classList.remove('is-open')
    burger.setAttribute('aria-expanded', 'false')
  }))
}

// ── Booking form → WhatsApp deep link ─────────────────────────────
function initBookingForm() {
  const form = document.getElementById('book-form')
  if (!form) return
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(form)
    const msg = [
      `🎮 *BOOKING REQUEST — Equilibrium Gaming Zone*`,
      `Name: ${data.get('name')}`,
      `Phone: ${data.get('phone')}`,
      `Platform: ${data.get('platform')}`,
      `When: ${data.get('when') || 'ASAP'}`,
    ].join('\n')
    const url = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank', 'noopener')
  })
}

// ── Marquee duplication for a seamless loop ───────────────────────
function initMarquee() {
  const track = document.getElementById('marquee-track')
  if (!track) return
  track.innerHTML += track.innerHTML // two copies → -50% translate loops cleanly
}

// ── Boot sequence ─────────────────────────────────────────────────
document.getElementById('year').textContent = String(new Date().getFullYear())
renderGames()
initMarquee()
initNav()
initBookingForm()
initCursor()
initCounters()
initTilt(reducedMotion)

// 3D boots only after the preloader finishes — heavy shader compilation
// would otherwise stall the loading animation on weaker GPUs.
function bootScenes() {
  if (!webglAvailable()) {
    document.getElementById('hero-canvas').style.background =
      'radial-gradient(80% 60% at 50% 40%, #16202e 0%, #0a0e17 100%)'
    return
  }
  import('./js/heroScene.js').then(({ initHeroScene }) => {
    const canvas = document.getElementById('hero-canvas')
    const heroApi = initHeroScene(canvas, { reducedMotion })
    canvas.classList.add('is-live')
    bindHeroScroll(heroApi)
  })
  import('./js/rigScene.js').then(({ initRigScene }) => {
    initRigScene(document.getElementById('rig-canvas'), { reducedMotion })
  })
}

runPreloader(() => {
  heroEntrance()
  initScrollAnimations(reducedMotion)
  initGlitchBursts(reducedMotion)
  // Let the entrance choreography finish before WebGL shader compilation
  // can steal main-thread time; the canvas then fades in over the dark bg.
  setTimeout(bootScenes, 1600)
})
