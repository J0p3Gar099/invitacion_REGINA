export const PARTY = {
  name: process.env.NEXT_PUBLIC_BIRTHDAY_NAME ?? 'Valentina',
  age: Number(process.env.NEXT_PUBLIC_BIRTHDAY_AGE ?? 25),
  date: process.env.NEXT_PUBLIC_PARTY_DATE ?? '2025-07-19T20:00:00',
  place: process.env.NEXT_PUBLIC_PARTY_PLACE ?? 'Terraza La Condesa',
  address: process.env.NEXT_PUBLIC_PARTY_ADDRESS ?? 'Av. Ámsterdam 150, Condesa, CDMX',
  time: process.env.NEXT_PUBLIC_PARTY_TIME ?? '8:00 PM',
  rsvpDeadline: process.env.NEXT_PUBLIC_RSVP_DEADLINE ?? '15 de julio',
}

export const GIFTS = [
  { id: 'g1', emoji: '💄', name: 'Kit de maquillaje', hint: 'Charlotte Tilbury o similar' },
  { id: 'g2', emoji: '📚', name: 'Libro de arte', hint: 'Fotografía o diseño' },
  { id: 'g3', emoji: '🕯️', name: 'Velas aromáticas', hint: 'Maison Margiela' },
  { id: 'g4', emoji: '🧖', name: 'Experiencia SPA', hint: 'Día de spa para dos' },
  { id: 'g5', emoji: '🎶', name: 'Spotify Premium', hint: 'Tarjeta regalo 1 año' },
  { id: 'g6', emoji: '✈️', name: 'Fondo de viaje', hint: 'Para su próxima aventura' },
]

export const DRINKS = [
  { id: 'd1', emoji: '🍾', name: 'Champagne', desc: 'Para el brindis' },
  { id: 'd2', emoji: '🥃', name: 'Mezcal', desc: 'Del bueno, que pique' },
  { id: 'd3', emoji: '🍹', name: 'Gin & Tónica', desc: 'Con botanicals frescos' },
  { id: 'd4', emoji: '🍷', name: 'Vino tinto', desc: 'Rioja o Malbec' },
  { id: 'd5', emoji: '🍺', name: 'Cerveza craft', desc: 'IPA o Weizen' },
  { id: 'd6', emoji: '🫧', name: 'Sin alcohol', desc: 'Sodas y jugos' },
]
