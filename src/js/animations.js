// GSAP-driven choreography: preloader, scroll reveals, nav state.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Preloader: fake boot sequence, then angular wipe reveal ───────
export function runPreloader(onDone) {
  const pre = document.getElementById('preloader')
  const fill = document.getElementById('preloader-fill')
  const status = document.getElementById('preloader-status')
  if (!pre) { onDone(); return }

  const lines = [
    'INITIALIZING ARENA…',
    'LOADING RIGS [22/22]…',
    'CALIBRATING 240HZ DISPLAYS…',
    'CONNECTING TO LHR-01…',
    'GLHF — WELCOME TO EQUILIBRIUM',
  ]
  let i = 0
  const lineTimer = setInterval(() => {
    i = Math.min(i + 1, lines.length - 1)
    status.textContent = lines[i]
  }, 320)

  const tl = gsap.timeline({
    onComplete: () => {
      clearInterval(lineTimer)
      pre.classList.add('is-done')
      onDone()
    },
  })
  tl.to(fill, { width: '100%', duration: 1.5, ease: 'power2.inOut' })
    .to('.preloader__inner', { opacity: 0, y: -26, duration: 0.32, ease: 'power2.in' })
    .to('.preloader__panel--l', { xPercent: -101, duration: 0.55, ease: 'power4.inOut' }, '<0.1')
    .to('.preloader__panel--r', { xPercent: 101, duration: 0.55, ease: 'power4.inOut' }, '<')
    .set(pre, { display: 'none' })
}

// ── Hero entrance after preloader ─────────────────────────────────
export function heroEntrance() {
  const tl = gsap.timeline()
  tl.from('.hero__title', { y: 60, opacity: 0, duration: 0.9, ease: 'power4.out' })
    .to('.hero__kicker.reveal-up, .hero__tag.reveal-up, .hero__cta.reveal-up', {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12,
    }, '-=0.45')
    .from('.hero__hud-item', { opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
    .from('.hero__scroll', { opacity: 0, y: -10, duration: 0.5 }, '-=0.3')
}

// ── Scroll-triggered section reveals ──────────────────────────────
export function initScrollAnimations(reducedMotion) {
  if (reducedMotion) {
    gsap.set('.reveal-up', { opacity: 1, y: 0 })
    return
  }

  // generic section headers
  document.querySelectorAll('.section__head').forEach((head) => {
    gsap.from(head.children, {
      scrollTrigger: { trigger: head, start: 'top 85%' },
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
    })
  })

  // batched card entrances
  const cardGroups = [
    ['.arena__stats .stat', '.arena__stats'],
    ['.games__grid .game', '.games__grid'],
    ['.hardware__list .hw', '.hardware__list'],
    ['.gallery__grid .gtile', '.gallery__grid'],
    ['.rates__grid .rate', '.rates__grid'],
  ]
  cardGroups.forEach(([items, trigger]) => {
    gsap.from(items, {
      scrollTrigger: { trigger, start: 'top 82%' },
      y: 46, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07,
    })
  })

  gsap.from('.arena__copy > *', {
    scrollTrigger: { trigger: '.arena__copy', start: 'top 80%' },
    x: -40, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.09,
  })

  gsap.from('.hardware__scene', {
    scrollTrigger: { trigger: '.hardware__scene', start: 'top 80%' },
    clipPath: 'inset(0 100% 0 0)', duration: 1, ease: 'power4.inOut',
  })

  gsap.from('.findus__map', {
    scrollTrigger: { trigger: '.findus__grid', start: 'top 80%' },
    x: -60, opacity: 0, duration: 0.8, ease: 'power3.out',
  })
  gsap.from('.findus__info > *', {
    scrollTrigger: { trigger: '.findus__grid', start: 'top 78%' },
    x: 60, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
  })

  gsap.from('.social-band__inner > *', {
    scrollTrigger: { trigger: '.social-band', start: 'top 85%' },
    y: 30, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
  })
}

// ── Hero scene scroll hookup ──────────────────────────────────────
export function bindHeroScroll(heroApi) {
  if (!heroApi) return
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => heroApi.setScroll(self.progress),
  })
}
