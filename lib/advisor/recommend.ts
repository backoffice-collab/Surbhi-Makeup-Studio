import type {
  BeautyProfile, Recommendations, EyeRecommendation, LookConcept,
  ProductRec, SeasonalSuggestion, EyeShape, FaceShape,
} from './types'
import { lipsticksFor, blushesFor, highlighterFor, eyePaletteFor } from './palette'

/**
 * Turns an estimated profile into concrete recommendations.
 *
 * Deliberately deterministic and local: the vision model's only job is to
 * describe what it sees, and this maps those observations onto the studio's
 * actual services. That keeps recommendations consistent, reviewable by a
 * human artist, and free of model hallucination about products or prices.
 */

const EYELINER: Record<EyeShape, { style: string; why: string }> = {
  Almond: { style: 'Soft Wing Eyeliner', why: 'A gentle wing follows the natural lift of almond eyes.' },
  Round: { style: 'Extended Wing', why: 'Elongates round eyes and adds a subtle almond illusion.' },
  Hooded: { style: 'Tightline with Thin Wing', why: 'Keeping liner close to the lash line stays visible when the eye is open.' },
  Monolid: { style: 'Gradient Smudged Liner', why: 'A diffused line reads better than a sharp wing on a smooth lid.' },
  Upturned: { style: 'Balanced Thin Liner', why: 'Even thickness keeps the natural upward lift in proportion.' },
  Downturned: { style: 'Lifted Outer Wing', why: 'Angling the wing upward visually counters the downward outer corner.' },
}

const LASHES: Record<EyeShape, { style: string; why: string }> = {
  Almond: { style: 'Wispy Lashes', why: 'Adds softness without hiding the eye shape.' },
  Round: { style: 'Cat-eye Lashes', why: 'Longer outer lashes stretch the eye horizontally.' },
  Hooded: { style: 'Long Centre Lashes', why: 'Height in the middle opens up a hooded lid.' },
  Monolid: { style: 'Full Volume Lashes', why: 'Creates visible depth along the lash line.' },
  Upturned: { style: 'Natural Volume Lashes', why: 'Enhances without exaggerating the existing lift.' },
  Downturned: { style: 'Outer-corner Flared Lashes', why: 'Draws the outer eye upward.' },
}

const BROW: Record<FaceShape, { style: string; why: string }> = {
  Oval: { style: 'Soft Arch', why: 'Complements balanced proportions without hardening the face.' },
  Round: { style: 'High Arch', why: 'Adds vertical length and structure to softer features.' },
  Square: { style: 'Rounded Arch', why: 'Softens a strong jawline.' },
  Heart: { style: 'Soft Rounded Brow', why: 'Balances a wider forehead against a narrower chin.' },
  Oblong: { style: 'Straight Flat Brow', why: 'Reduces apparent face length.' },
  Diamond: { style: 'Curved Arch', why: 'Softens prominent cheekbones.' },
}

const CONTOUR: Record<FaceShape, string> = {
  Oval: 'light contouring just under the cheekbones',
  Round: 'sculpting along the jaw and temples to add definition',
  Square: 'softened contour at the jaw corners',
  Heart: 'contour at the temples with blush placed slightly lower',
  Oblong: 'horizontal contour at the forehead and chin to shorten the face',
  Diamond: 'gentle contour on the cheekbones with a lifted blush placement',
}

export function buildRecommendations(profile: BeautyProfile): Recommendations {
  const lipstick = lipsticksFor(profile.undertone)
  const blush = blushesFor(profile.undertone)
  const highlighter = highlighterFor(profile.skinTone)
  const palette = eyePaletteFor(profile.undertone)

  const eyes: EyeRecommendation = {
    palette,
    eyeliner: EYELINER[profile.eyeShape].style,
    eyelinerWhy: EYELINER[profile.eyeShape].why,
    lashes: LASHES[profile.eyeShape].style,
    lashesWhy: LASHES[profile.eyeShape].why,
    brow: BROW[profile.faceShape].style,
    browWhy: BROW[profile.faceShape].why,
  }

  const warmth = profile.undertone === 'Cool' ? 'cool rose' : 'warm peach'
  const bridal =
    `An HD Bridal look with ${warmth} tones, ${highlighter[0].name.toLowerCase()} shimmer on the eyes, ` +
    `${CONTOUR[profile.faceShape]}, a ${eyes.eyeliner.toLowerCase()} and ${lipstick[0].name.toLowerCase()} ` +
    `lips would beautifully complement your visible features.`

  const looks: LookConcept[] = [
    {
      id: 'natural-glow',
      name: 'Natural Glow',
      tagline: 'Barely-there radiance for daytime events',
      image: '/images/student-5.jpg',
      lip: lipstick[0],
      blush: blush[0],
      eye: `${palette[0].name} wash with ${eyes.lashes.toLowerCase()}`,
      highlighter: highlighter[0],
      finish: 'Dewy, skin-like',
      occasion: 'Engagement brunch, roka, daytime functions',
    },
    {
      id: 'bridal-queen',
      name: 'Bridal Queen',
      tagline: 'Full HD bridal artistry built to last all day',
      image: '/images/signature-bride.jpg',
      lip: lipstick[3] ?? lipstick[0],
      blush: blush[0],
      eye: `${palette[1].name} and ${palette[3].name} with ${eyes.lashes.toLowerCase()}`,
      highlighter: highlighter[1] ?? highlighter[0],
      finish: 'Long-wear HD, matte base with a lit centre',
      occasion: 'Wedding day, phera, main ceremony',
    },
    {
      id: 'reception-glam',
      name: 'Reception Glam',
      tagline: 'Statement evening glamour under warm light',
      image: '/images/reception-glam.jpg',
      lip: lipstick[1],
      blush: blush[2] ?? blush[1],
      eye: `${palette[3].name} smokey with ${eyes.eyeliner.toLowerCase()}`,
      highlighter: highlighter[2] ?? highlighter[1] ?? highlighter[0],
      finish: 'Satin with a sculpted glow',
      occasion: 'Reception, cocktail, sangeet',
    },
    {
      id: 'party-night',
      name: 'Party Night',
      tagline: 'Modern, trend-led and camera-ready',
      image: '/images/engagement-look.jpg',
      lip: lipstick[2],
      blush: blush[1],
      eye: `${palette[2].name} shimmer with a graphic ${eyes.eyeliner.toLowerCase()}`,
      highlighter: highlighter[0],
      finish: 'Luminous, high-impact',
      occasion: 'Parties, birthdays, celebrations',
    },
  ]

  const products: ProductRec[] = [
    {
      category: 'Lipstick', brand: 'MAC', name: `Retro Matte — ${lipstick[0].name} family`,
      description: 'Long-wearing matte finish that holds through ceremonies and meals.',
      price: 'from ₹1,950', swatch: lipstick[0].hex,
    },
    {
      category: 'Blush', brand: 'NARS', name: `Blush — ${blush[0].name} family`,
      description: 'Finely milled, buildable colour that photographs true.',
      price: 'from ₹3,200', swatch: blush[0].hex,
    },
    {
      category: 'Eyeshadow', brand: 'Huda Beauty', name: 'Naughty Nude Palette',
      description: `Warm neutrals covering ${palette[0].name} through ${palette[3].name}.`,
      price: 'from ₹4,600', swatch: palette[1].hex,
    },
    {
      category: 'Highlighter', brand: 'Becca', name: `Shimmering Skin Perfector — ${highlighter[0].name}`,
      description: 'A liquid-to-powder glow that reads luminous, not glittery.',
      price: 'from ₹3,400', swatch: highlighter[0].hex,
    },
    {
      category: 'Primer', brand: 'Smashbox', name: 'Photo Finish Smooth & Blur',
      description: 'Grips makeup and softens texture — essential under HD bridal base.',
      price: 'from ₹2,900', swatch: '#E8DED2',
    },
    {
      category: 'Setting Spray', brand: 'Urban Decay', name: 'All Nighter',
      description: 'Locks the look for long ceremonies and warm venues.',
      price: 'from ₹2,700', swatch: '#CBD5DC',
    },
  ]

  const seasonal: SeasonalSuggestion[] = [
    { season: 'Summer', title: 'Lightweight Luminous', description: 'Sweat-resistant base, coral cheeks and a tinted lip balm finish.', accent: '#EE8A7A' },
    { season: 'Monsoon', title: 'Waterproof Definition', description: 'Smudge-proof liner, waterproof mascara and a long-wear matte lip.', accent: '#7FA6A0' },
    { season: 'Winter', title: 'Rich & Radiant', description: 'Hydrating base, deeper berry lips and a warm sculpted glow.', accent: '#8A3A4E' },
    { season: 'Festive', title: 'Gold & Glow', description: 'Champagne shimmer eyes, sculpted cheeks and a bold classic lip.', accent: '#D4AF37' },
  ]

  const trending = [
    'Soft glam with glass-skin base',
    'Monochrome rose — lips, cheeks and eyes in one family',
    'Modern Punjabi bridal with gold-leaf accents',
    'Sculpted nude with wispy lash clusters',
  ]

  const festival = [
    'Karva Chauth — classic red lip with gold shimmer eyes',
    'Diwali — bronze smokey eye with a warm nude lip',
    'Lohri — terracotta cheeks with a glossy finish',
    'Sangeet — glitter-accent lids built to last through dancing',
  ]

  return { lipstick, blush, highlighter, eyes, bridal, looks, products, seasonal, trending, festival }
}
