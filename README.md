# EQUILIBRIUM GAMING ZONE — Official Website

A fully animated, 3D, gaming-vibe website for **Equilibrium Gaming Zone** — Lahore's 24/7
esports arena (Commercial Area 184, Airline Society, Johar Town).

Design language v3 "PROTOCOL" — built on the actual Valorant visual identity: bone-white
editorial bands slamming against dark navy, signal-red slashes, huge condensed typography,
diagonal section cuts, ghost outline text, notched corners. Plus two real-time
photoreal-leaning WebGL scenes (PBR materials, image-based lighting, ACES filmic tone
mapping, soft shadows) — all procedural, zero image/model assets.

## ✨ What's inside

- **Cinematic 3D hero** — studio product-showcase: a matte-black PBR game controller with
  red LED accents floating over a glossy reflective floor, volumetric light shafts,
  drifting dust motes, red backlight halo, restrained bloom, slow dolly + mouse parallax.
- **Live "battlestation" 3D scene** — a monitor that actually *plays* a procedurally-drawn
  tactical-FPS feed (killfeed, crosshair with hitmarkers, minimap, ammo), red-LED
  mechanical keyboard wave, brushed-metal tower with spinning LED fans, soft shadows.
- **Full gaming-vibe UI** — preloader boot sequence, crosshair custom cursor, glitch title
  bursts, CRT scanlines + noise, angular clip-path buttons, corner-bracket cards, tilting
  3D hover cards, animated stat counters, skewed marquee of game titles.
- **Drop-in gallery** — put photos/clips in `src/assets/gallery/` and they appear
  automatically in the "Inside the Arena" section as CCTV-style feeds with a fullscreen
  tactical lightbox (keyboard nav, video support). Empty state shows styled "NO SIGNAL"
  camera placeholders. See `src/assets/gallery/README.md`.
- **Sections** — Hero, The Arena (stats), Games roster (12 titles), Hardware (3D scene +
  specs), Gallery, Rates, Social band, Find Us (dark-styled Google Map) + WhatsApp booking form.
- **Practical stuff** — GSAP ScrollTrigger reveals, IntersectionObserver-paused renderers,
  `prefers-reduced-motion` support, WebGL fallback, self-hosted fonts (no external
  requests), SEO meta + LocalBusiness JSON-LD, fully responsive with mobile nav.

## 🚀 Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # preview the production build
```

Deploy the `dist/` folder anywhere (Vercel, Netlify, GitHub Pages — `base: './'` is
already set so subpath hosting works).

## 🔧 Customize (owner checklist)

| What | Where |
| --- | --- |
| Gallery photos & clips | drop files into `src/assets/gallery/` (filename → caption) |
| Phone / WhatsApp / social links | `src/js/config.js` (`SITE`) — **set `whatsapp` to the lounge's WhatsApp mobile number** (booking form sends there) |
| Games list & card colors | `src/js/config.js` (`GAMES`) |
| Hourly rates | `index.html` → section `04 / RATES` (current numbers are indicative placeholders — update before going live) |
| Address / map | `index.html` → section `05 / FIND US` (map iframe query + address text) |
| Brand colors | `src/styles/base.css` (`:root` variables) + `src/js/config.js` (`COLORS`) |

## 🗂 Structure

```
index.html              all page markup
public/fonts/           self-hosted Bebas Neue / Rajdhani / Share Tech Mono
src/main.js             boot sequence
src/styles/             base design system + section layouts
src/js/config.js        ← business data lives here
src/js/heroScene.js     hero WebGL scene (grid, particles, controller, bloom)
src/js/gamepad.js       procedural 3D controller model
src/js/rigScene.js      battlestation scene w/ live-drawn gameplay feed
src/js/fx.js            cursor, tilt, glitch, counters, game cards
src/js/animations.js    preloader + GSAP scroll choreography
```

Built with [Vite](https://vite.dev), [Three.js](https://threejs.org) and [GSAP](https://gsap.com).
