/** Domain types for the AI Beauty Advisor. */

export type SkinTone =
  | 'Fair' | 'Light' | 'Light Medium' | 'Medium' | 'Medium Deep' | 'Deep' | 'Rich Deep'

export type Undertone = 'Cool' | 'Neutral' | 'Warm' | 'Olive'

export type FaceShape = 'Oval' | 'Round' | 'Square' | 'Heart' | 'Oblong' | 'Diamond'

export type EyeShape = 'Almond' | 'Round' | 'Hooded' | 'Monolid' | 'Upturned' | 'Downturned'

export type LipShape = 'Full' | 'Bow-shaped' | 'Wide' | 'Round' | 'Thin' | 'Heart-shaped'

export type BrowStyle = 'Soft Arch' | 'High Arch' | 'Straight' | 'Rounded' | 'Tapered'

export type HairColor = 'Black' | 'Dark Brown' | 'Brown' | 'Light Brown' | 'Auburn' | 'Grey'

/** What the vision model returns. Every field is an estimate, never a fact. */
export interface BeautyProfile {
  skinTone: SkinTone
  undertone: Undertone
  faceShape: FaceShape
  eyeShape: EyeShape
  lipShape: LipShape
  browStyle: BrowStyle
  hairColor: HairColor
  /** 0–100. How confident the analysis is, surfaced honestly to the user. */
  confidence: number
  /** Plain-language caveats shown alongside the report. */
  notes: string[]
  /** True when generated locally rather than by the vision model. */
  isFallback: boolean
}

export interface Shade {
  name: string
  hex: string
  why: string
}

export interface EyeRecommendation {
  palette: Shade[]
  eyeliner: string
  eyelinerWhy: string
  lashes: string
  lashesWhy: string
  brow: string
  browWhy: string
}

export interface LookConcept {
  id: 'natural-glow' | 'bridal-queen' | 'reception-glam' | 'party-night'
  name: string
  tagline: string
  image: string
  lip: Shade
  blush: Shade
  eye: string
  highlighter: Shade
  finish: string
  occasion: string
}

export interface ProductRec {
  category: string
  brand: string
  name: string
  description: string
  price: string
  swatch: string
}

export interface SeasonalSuggestion {
  season: string
  title: string
  description: string
  accent: string
}

export interface Recommendations {
  lipstick: Shade[]
  blush: Shade[]
  highlighter: Shade[]
  eyes: EyeRecommendation
  bridal: string
  looks: LookConcept[]
  products: ProductRec[]
  seasonal: SeasonalSuggestion[]
  trending: string[]
  festival: string[]
}

export interface AdvisorResult {
  profile: BeautyProfile
  recommendations: Recommendations
  createdAt: number
  /** Object URL or data URL of the user's photo. Client-side only, never sent to storage. */
  photo?: string
}

export type AdvisorStage =
  | 'idle'
  | 'consent'
  | 'input'
  | 'scanning'
  | 'report'
  | 'error'
