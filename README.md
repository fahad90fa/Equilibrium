# EQUILIBRIUM GAMING ZONE — Official Website

A fully animated, 3D, gaming-vibe website for **Equilibrium Gaming Zone** — Lahore's 24/7
esports arena (Commercial Area 184, Airline Society, Johar Town).

Dark tactical theme inspired by Valorant / CS2 / Dota 2: neon-red + cyan on deep navy,
angular HUD-style UI, glitch effects, and two real-time WebGL 3D scenes — all procedural,
zero image/model assets.

## ✨ What's inside

- **Animated 3D hero** — synthwave grid rushing under a floating, glowing game controller
  (built from primitives in Three.js), particle field, wireframe sentinels, neon bloom
  post-processing, mouse parallax and scroll-linked camera.
- **Live "battlestation" 3D scene** — a monitor that actually *plays* a procedurally-drawn
  FPS HUD (killfeed, crosshair, minimap, ammo), RGB mechanical keyboard wave, tower with
  spinning brand-colored glow fans.
- **Full gaming-vibe UI** — preloader boot sequence, crosshair custom cursor, glitch title
  bursts, CRT scanlines + noise, angular clip-path buttons, corner-bracket cards, tilting
  3D hover cards, animated stat counters, skewed marquee of game titles.
- **Sections** — Hero, The Arena (stats), Games roster (12 titles), Hardware (3D scene +
  specs), Rates, Social band, Find Us (dark-styled Google Map) + WhatsApp booking form.
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
