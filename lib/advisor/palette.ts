import type { Shade, SkinTone, Undertone } from './types'

/**
 * Shade libraries keyed by undertone. Hex values are approximate visual
 * references for on-screen swatches — they are not calibrated cosmetic
 * matches, and the UI says so.
 */

const LIP: Record<Undertone, Shade[]> = {
  Warm: [
    { name: 'Nude Peach', hex: '#D99B7C', why: 'Echoes the warmth in your skin for a soft, everyday finish.' },
    { name: 'Terracotta', hex: '#B5563C', why: 'A sun-warmed earth tone that flatters golden undertones.' },
    { name: 'Coral Rose', hex: '#CC6A63', why: 'Brightens warm complexions without looking stark.' },
    { name: 'Classic Red', hex: '#B22234', why: 'A warm-leaning red for occasions that call for impact.' },
  ],
  Cool: [
    { name: 'Dusty Rose', hex: '#C08497', why: 'A muted pink that sits naturally against cool undertones.' },
    { name: 'Berry Wine', hex: '#7D2E46', why: 'Deep and blue-based — striking on cool complexions.' },
    { name: 'Soft Mauve', hex: '#A87C93', why: 'A gentle everyday shade that avoids competing with your skin.' },
    { name: 'Blue Red', hex: '#9E1B32', why: 'A cool-toned classic red that makes teeth read brighter.' },
  ],
  Neutral: [
    { name: 'Rosewood', hex: '#B9737A', why: 'Balanced between warm and cool — versatile on neutral skin.' },
    { name: 'Nude Beige', hex: '#C99885', why: 'A your-lips-but-better tone for daytime.' },
    { name: 'Classic Red', hex: '#AE2334', why: 'True red reads clean on neutral undertones.' },
    { name: 'Mauve Pink', hex: '#B57F8E', why: 'Soft contrast that suits most neutral complexions.' },
  ],
  Olive: [
    { name: 'Warm Nude', hex: '#C08A6E', why: 'Counters any ashiness and warms the overall look.' },
    { name: 'Brick Rose', hex: '#A85A50', why: 'Earthy depth that complements olive undertones.' },
    { name: 'Deep Berry', hex: '#8A3A4E', why: 'Rich contrast that keeps olive skin looking luminous.' },
    { name: 'Burnt Orange', hex: '#B85C38', why: 'A bold, flattering choice against green-gold undertones.' },
  ],
}

const BLUSH: Record<Undertone, Shade[]> = {
  Warm: [
    { name: 'Peach', hex: '#F0A07C', why: 'Mirrors a natural warm flush.' },
    { name: 'Coral', hex: '#EE8A7A', why: 'Lifts the face with golden warmth.' },
    { name: 'Warm Nude', hex: '#D9A188', why: 'Subtle sculpting for softer occasions.' },
    { name: 'Apricot', hex: '#EFA98A', why: 'Fresh and bright without going pink.' },
  ],
  Cool: [
    { name: 'Rose Pink', hex: '#E191A4', why: 'The most natural flush on cool skin.' },
    { name: 'Soft Plum', hex: '#B57E97', why: 'Adds dimension without warmth.' },
    { name: 'Berry Tint', hex: '#C76B85', why: 'A cooler pop for evening looks.' },
    { name: 'Cool Mauve', hex: '#C093A5', why: 'Understated everyday colour.' },
  ],
  Neutral: [
    { name: 'Rose Pink', hex: '#E39AA5', why: 'Reads natural across neutral complexions.' },
    { name: 'Peach', hex: '#EFA588', why: 'Warms the face without overwhelming it.' },
    { name: 'Soft Berry', hex: '#C87C90', why: 'A deeper option for photography.' },
    { name: 'Warm Nude', hex: '#D9A28E', why: 'Blends seamlessly for a sculpted finish.' },
  ],
  Olive: [
    { name: 'Terracotta Blush', hex: '#CC7B60', why: 'Warms olive skin and prevents a grey cast.' },
    { name: 'Coral', hex: '#E88C74', why: 'Brings brightness back to the cheeks.' },
    { name: 'Brick Rose', hex: '#C0705F', why: 'Adds natural-looking depth.' },
    { name: 'Warm Nude', hex: '#D29A80', why: 'A quiet everyday wash of colour.' },
  ],
}

/** Highlighter is driven by depth of complexion rather than undertone. */
export function highlighterFor(tone: SkinTone): Shade[] {
  const light: Shade[] = [
    { name: 'Pearl', hex: '#F4E9DC', why: 'A soft luminous finish that suits fairer complexions.' },
    { name: 'Champagne', hex: '#EBD5AE', why: 'Warm glow without visible glitter.' },
    { name: 'Icy Rose', hex: '#F2DBD6', why: 'A delicate lift on the high points of the face.' },
  ]
  const mid: Shade[] = [
    { name: 'Champagne', hex: '#E8C98F', why: 'The most versatile glow for medium skin.' },
    { name: 'Rose Gold', hex: '#E0A98B', why: 'Adds warmth and photographs beautifully.' },
    { name: 'Gold', hex: '#D9B45B', why: 'Richer shimmer for evening and bridal looks.' },
  ]
  const deep: Shade[] = [
    { name: 'Gold', hex: '#D4A03C', why: 'Reads luminous rather than chalky on deeper skin.' },
    { name: 'Bronze Glow', hex: '#C08040', why: 'Sculpts and highlights at the same time.' },
    { name: 'Copper Rose', hex: '#C57A5C', why: 'A warm sheen that complements richer complexions.' },
  ]
  if (tone === 'Fair' || tone === 'Light') return light
  if (tone === 'Deep' || tone === 'Rich Deep') return deep
  return mid
}

export function lipsticksFor(undertone: Undertone): Shade[] {
  return LIP[undertone]
}

export function blushesFor(undertone: Undertone): Shade[] {
  return BLUSH[undertone]
}

/** Eyeshadow palettes, again keyed by undertone. */
export function eyePaletteFor(undertone: Undertone): Shade[] {
  if (undertone === 'Cool') {
    return [
      { name: 'Champagne', hex: '#EAD7B7', why: 'Brightens the inner corner.' },
      { name: 'Taupe', hex: '#9C8879', why: 'Natural-looking crease definition.' },
      { name: 'Rose Gold', hex: '#D9A28F', why: 'A soft wash of colour on the lid.' },
      { name: 'Plum Smokey', hex: '#5E3C4C', why: 'Depth for the outer corner.' },
    ]
  }
  if (undertone === 'Olive') {
    return [
      { name: 'Soft Gold', hex: '#E3C481', why: 'Counters any green cast in the lid.' },
      { name: 'Bronze', hex: '#A9712F', why: 'Warm depth that suits olive skin.' },
      { name: 'Copper', hex: '#B5683C', why: 'A luminous mid-tone.' },
      { name: 'Brown Smokey', hex: '#4E3527', why: 'Softly smoked outer corner.' },
    ]
  }
  return [
    { name: 'Soft Gold', hex: '#E6C98B', why: 'A luminous base across the lid.' },
    { name: 'Bronze', hex: '#AC7434', why: 'Adds warmth and dimension.' },
    { name: 'Rose Gold', hex: '#DFA48D', why: 'Photographs beautifully under warm light.' },
    { name: 'Brown Smokey', hex: '#513828', why: 'Classic depth for the outer third.' },
  ]
}
