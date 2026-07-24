// ── Site-wide constants — edit business details here ──────────────
export const SITE = {
  name: 'Equilibrium Gaming Zone',
  phone: '+92 42 3519 1222',
  phoneHref: 'tel:+924235191222',
  // WhatsApp number the booking form sends to (country code + number, digits only).
  // TODO(owner): replace with the lounge's WhatsApp mobile number.
  whatsapp: '924235191222',
  mapsUrl: 'https://goo.gl/maps/N7HUdXtKXWP75iNL8',
  instagram: 'https://www.instagram.com/equilibriumgamingpk/',
  facebook: 'https://www.facebook.com/EquilibriumPk.official',
}

// ── Games roster shown in section 02 ──────────────────────────────
// c1: glow tint  |  c2: accent/stroke  |  letter: watermark initial
export const GAMES = [
  { title: 'VALORANT',          genre: 'TACTICAL 5v5', tags: ['PC'],         c1: 'rgba(255,70,85,.32)',   c2: '#ff4655', letter: 'V' },
  { title: 'COUNTER-STRIKE 2',  genre: 'TACTICAL FPS', tags: ['PC'],         c1: 'rgba(255,184,107,.30)', c2: '#ffb86b', letter: 'CS' },
  { title: 'DOTA 2',            genre: 'MOBA',         tags: ['PC'],         c1: 'rgba(214,40,40,.32)',   c2: '#e63946', letter: 'D' },
  { title: 'PUBG',              genre: 'BATTLE ROYALE',tags: ['PC'],         c1: 'rgba(242,177,52,.30)',  c2: '#f2b134', letter: 'P' },
  { title: 'TEKKEN 8',          genre: 'FIGHTING',     tags: ['PS5'],        c1: 'rgba(155,93,229,.32)',  c2: '#9b5de5', letter: 'T' },
  { title: 'EA FC 25',          genre: 'FOOTBALL',     tags: ['PC', 'PS5'],  c1: 'rgba(53,208,127,.30)',  c2: '#35d07f', letter: 'FC' },
  { title: 'CALL OF DUTY',      genre: 'FPS',          tags: ['PC'],         c1: 'rgba(0,229,255,.26)',   c2: '#00e5ff', letter: 'C' },
  { title: 'GTA V',             genre: 'OPEN WORLD',   tags: ['PC', 'PS5'],  c1: 'rgba(108,197,81,.30)',  c2: '#6cc551', letter: 'G' },
  { title: 'APEX LEGENDS',      genre: 'BATTLE ROYALE',tags: ['PC'],         c1: 'rgba(218,54,42,.32)',   c2: '#da362a', letter: 'A' },
  { title: 'LEAGUE OF LEGENDS', genre: 'MOBA',         tags: ['PC'],         c1: 'rgba(200,170,110,.30)', c2: '#c8aa6e', letter: 'L' },
  { title: 'FORTNITE',          genre: 'BATTLE ROYALE',tags: ['PC'],         c1: 'rgba(155,93,229,.30)',  c2: '#b388ff', letter: 'F' },
  { title: 'ROCKET LEAGUE',     genre: 'CAR FOOTBALL', tags: ['PC', 'PS5'],  c1: 'rgba(0,229,255,.28)',   c2: '#4dd8ff', letter: 'R' },
]

// Brand palette shared with the WebGL scenes
export const COLORS = {
  bg: 0x0a0e17,
  navy: 0x0f1923,
  body: 0x16202e,
  red: 0xff4655,
  cyan: 0x00e5ff,
  amber: 0xffb86b,
  white: 0xece8e1,
}
