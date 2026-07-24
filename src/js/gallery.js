// "Inside the Arena" gallery — drop-in media system.
// Any image/video placed in src/assets/gallery/ is picked up at build
// time and rendered automatically; with no files, styled CCTV
// "NO SIGNAL" placeholders keep the section looking intentional.

const modules = import.meta.glob(
  '../assets/gallery/*.{jpg,jpeg,png,webp,avif,gif,mp4,webm,JPG,JPEG,PNG,WEBP,MP4,WEBM}',
  { eager: true, query: '?url', import: 'default' }
)

const VIDEO_RE = /\.(mp4|webm)$/i

const PLACEHOLDER_CAMS = [
  'MAIN FLOOR', 'SQUAD ROW', 'PS5 LOUNGE',
  'SNACK BAR', 'TOURNEY NIGHT', 'ENTRANCE',
]

function mediaTag(item, { controls = false } = {}) {
  return item.video
    ? `<video src="${item.url}" muted loop autoplay playsinline ${controls ? 'controls' : ''}></video>`
    : `<img src="${item.url}" alt="${item.label}" loading="lazy" />`
}

function renderPlaceholders(grid) {
  grid.innerHTML = PLACEHOLDER_CAMS.map((cam, i) => `
    <figure class="gtile gtile--empty" aria-hidden="true">
      <div class="gtile__static"></div>
      <div class="gtile__nosignal">
        <svg viewBox="0 0 40 40" width="30" height="30"><polygon points="20,3 36,11.5 36,28.5 20,37 4,28.5 4,11.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>
        <span class="mono">NO SIGNAL</span>
      </div>
      <figcaption class="gtile__bar mono">
        <span>CAM-${String(i + 1).padStart(2, '0')}</span><span>${cam}</span><b>● REC</b>
      </figcaption>
    </figure>`).join('')
  const hint = document.getElementById('gallery-hint')
  if (hint) hint.hidden = false
}

function initLightbox(items) {
  const box = document.createElement('div')
  box.className = 'lightbox'
  box.id = 'lightbox'
  box.setAttribute('role', 'dialog')
  box.setAttribute('aria-label', 'Gallery viewer')
  box.innerHTML = `
    <button class="lightbox__close" aria-label="Close viewer" data-hover>✕</button>
    <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous" data-hover>‹</button>
    <div class="lightbox__media" id="lightbox-media"></div>
    <button class="lightbox__nav lightbox__nav--next" aria-label="Next" data-hover>›</button>
    <div class="lightbox__counter mono" id="lightbox-counter"></div>`
  document.body.appendChild(box)

  const mediaEl = box.querySelector('#lightbox-media')
  const counter = box.querySelector('#lightbox-counter')
  let idx = 0

  function show(i) {
    idx = (i + items.length) % items.length
    const item = items[idx]
    mediaEl.innerHTML = mediaTag(item, { controls: true })
    counter.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')} — ${item.label}`
  }
  function open(i) {
    show(i)
    box.classList.add('is-open')
    document.body.style.overflow = 'hidden'
  }
  function close() {
    box.classList.remove('is-open')
    mediaEl.innerHTML = ''
    document.body.style.overflow = ''
  }

  box.querySelector('.lightbox__close').addEventListener('click', close)
  box.querySelector('.lightbox__nav--prev').addEventListener('click', () => show(idx - 1))
  box.querySelector('.lightbox__nav--next').addEventListener('click', () => show(idx + 1))
  box.addEventListener('click', (e) => { if (e.target === box) close() })
  window.addEventListener('keydown', (e) => {
    if (!box.classList.contains('is-open')) return
    if (e.key === 'Escape') close()
    if (e.key === 'ArrowLeft') show(idx - 1)
    if (e.key === 'ArrowRight') show(idx + 1)
  })

  return open
}

export function initGallery() {
  const grid = document.getElementById('gallery-grid')
  if (!grid) return

  const items = Object.entries(modules)
    .map(([path, url]) => {
      const file = path.split('/').pop()
      return {
        url,
        file,
        video: VIDEO_RE.test(file),
        label: file.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').toUpperCase(),
      }
    })
    .sort((a, b) => a.file.localeCompare(b.file))

  if (!items.length) {
    renderPlaceholders(grid)
    return
  }

  grid.innerHTML = items.map((m, i) => `
    <figure class="gtile" data-hover data-idx="${i}" tabindex="0" role="button"
      aria-label="Open ${m.label}">
      ${mediaTag(m)}
      <figcaption class="gtile__bar mono">
        <span>CAM-${String(i + 1).padStart(2, '0')}</span><span>${m.label}</span><b>● LIVE</b>
      </figcaption>
    </figure>`).join('')

  const open = initLightbox(items)
  grid.querySelectorAll('.gtile').forEach((tile) => {
    tile.addEventListener('click', () => open(Number(tile.dataset.idx)))
    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(Number(tile.dataset.idx)) }
    })
  })
}
