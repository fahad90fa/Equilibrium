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
  { title: 'VALORANT',          genre: 'TACTICAL 5v5', tags: ['PC'],         c1: 'rgba(255,70,85,.14)',   c2: '#ff4655', letter: 'V' },
  { title: 'COUNTER-STRIKE 2',  genre: 'TACTICAL FPS', tags: ['PC'],         c1: 'rgba(224,164,96,.13)',  c2: '#e0a460', letter: 'CS' },
  { title: 'DOTA 2',            genre: 'MOBA',         tags: ['PC'],         c1: 'rgba(199,62,74,.14)',   c2: '#c73e4a', letter: 'D' },
  { title: 'PUBG',              genre: 'BATTLE ROYALE',tags: ['PC'],         c1: 'rgba(214,164,60,.13)',  c2: '#d6a43c', letter: 'P' },
  { title: 'TEKKEN 8',          genre: 'FIGHTING',     tags: ['PS5'],        c1: 'rgba(146,102,204,.14)', c2: '#9266cc', letter: 'T' },
  { title: 'EA FC 25',          genre: 'FOOTBALL',     tags: ['PC', 'PS5'],  c1: 'rgba(74,186,126,.13)',  c2: '#4aba7e', letter: 'FC' },
  { title: 'CALL OF DUTY',      genre: 'FPS',          tags: ['PC'],         c1: 'rgba(120,164,190,.13)', c2: '#78a4be', letter: 'C' },
  { title: 'GTA V',             genre: 'OPEN WORLD',   tags: ['PC', 'PS5'],  c1: 'rgba(120,178,100,.13)', c2: '#78b264', letter: 'G' },
  { title: 'APEX LEGENDS',      genre: 'BATTLE ROYALE',tags: ['PC'],         c1: 'rgba(205,74,58,.14)',   c2: '#cd4a3a', letter: 'A' },
  { title: 'LEAGUE OF LEGENDS', genre: 'MOBA',         tags: ['PC'],         c1: 'rgba(190,164,112,.13)', c2: '#bea470', letter: 'L' },
  { title: 'FORTNITE',          genre: 'BATTLE ROYALE',tags: ['PC'],         c1: 'rgba(148,116,220,.13)', c2: '#9474dc', letter: 'F' },
  { title: 'ROCKET LEAGUE',     genre: 'CAR FOOTBALL', tags: ['PC', 'PS5'],  c1: 'rgba(96,168,206,.13)',  c2: '#60a8ce', letter: 'R' },
]

// Brand palette shared with the WebGL scenes
export const COLORS = {
  bg: 0x05070b,
  navy: 0x090d14,
  body: 0x14181e,
  red: 0xff4655,
  cyan: 0x7fd4e4,
  amber: 0xffb86b,
  white: 0xe9e5de,
}
