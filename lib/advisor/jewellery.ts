import type { BeautyProfile, FaceShape, Undertone } from './types'

/**
 * Daily-wear jewellery suggestions from visible features.
 * Metal tone follows undertone; earring silhouette follows face shape.
 * Presented as styling suggestions, never as rules.
 */

export interface JewelleryRec {
  metal: string
  metalWhy: string
  earrings: string
  earringsWhy: string
  daily: string
}

const METAL: Record<Undertone, { metal: string; why: string }> = {
  Warm: { metal: 'Yellow gold & rose gold', why: 'Warm metals echo the golden warmth in your skin.' },
  Olive: { metal: 'Yellow gold & antique gold', why: 'Warm golds bring light to olive undertones.' },
  Cool: { metal: 'Silver, platinum & white gold', why: 'Cool-toned metals sit naturally against cool undertones.' },
  Neutral: { metal: 'Gold or silver — both suit you', why: 'Neutral undertones carry warm and cool metals equally well.' },
}

const EARRINGS: Record<FaceShape, { style: string; why: string }> = {
  Oval: { style: 'Studs, small hoops or drops', why: 'Balanced proportions suit almost any earring shape.' },
  Round: { style: 'Long drops or danglers', why: 'Vertical length gently elongates a round face.' },
  Square: { style: 'Rounded hoops or curved drops', why: 'Soft curves balance a defined jawline.' },
  Heart: { style: 'Teardrop or chandelier earrings', why: 'Wider-at-the-bottom shapes balance a narrower chin.' },
  Oblong: { style: 'Studs or short clustered earrings', why: 'Compact styles add width without lengthening the face.' },
  Diamond: { style: 'Studs or tops wider at the ear', why: 'Balances prominent cheekbones.' },
}

const DAILY: Record<Undertone, string> = {
  Warm: 'A fine gold chain with a small pendant for everyday elegance.',
  Olive: 'Delicate gold jhumkas or a thin chain for a soft daily glow.',
  Cool: 'A slim silver chain or minimal white-gold studs for daily wear.',
  Neutral: 'A dainty chain in your preferred metal, paired with small studs.',
}

export function jewelleryFor(profile: BeautyProfile): JewelleryRec {
  return {
    metal: METAL[profile.undertone].metal,
    metalWhy: METAL[profile.undertone].why,
    earrings: EARRINGS[profile.faceShape].style,
    earringsWhy: EARRINGS[profile.faceShape].why,
    daily: DAILY[profile.undertone],
  }
}
