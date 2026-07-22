'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { BeautyProfile } from '@/lib/advisor/types'
import { lipsticksFor, eyePaletteFor } from '@/lib/advisor/palette'
import { jewelleryFor } from '@/lib/advisor/jewellery'
import { whatsappUrl } from '@/lib/site'
import styles from './advisor.module.css'

type Stage = 'input' | 'scanning' | 'result' | 'error'

const EYELINER: Record<string, string> = {
  Almond: 'a soft winged liner', Round: 'an extended wing',
  Hooded: 'a tightlined thin wing', Monolid: 'a smudged gradient liner',
  Upturned: 'a balanced thin line', Downturned: 'a lifted outer wing',
}
const LASHES: Record<string, string> = {
  Almond: 'wispy lashes', Round: 'cat-eye lashes', Hooded: 'long centre lashes',
  Monolid: 'full-volume lashes', Upturned: 'natural volume lashes', Downturned: 'outer-flared lashes',
}

export default function AdvisorClient() {
  const [stage, setStage] = useState<Stage>('input')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [profile, setProfile] = useState<BeautyProfile | null>(null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const reduce = useReducedMotion()

  const onPick = useCallback((f: File | undefined) => {
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG or WebP).')
      setStage('error')
      return
    }
    if (f.size > 6 * 1024 * 1024) {
      setError('Please choose an image under 6 MB.')
      setStage('error')
      return
    }
    setError('')
    setFile(f)
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(f)
    })
    setStage('input')
  }, [])

  const analyze = useCallback(async () => {
    if (!file) return
    setStage('scanning')
    setError('')

    let result: BeautyProfile | null = null

    // 1. Try the server vision route (Gemini). Requires GEMINI_API_KEY.
    try {
      const form = new FormData()
      form.append('photo', file)
      const res = await fetch('/api/beauty-advisor', { method: 'POST', body: form })
      if (res.ok) {
        const data = await res.json()
        if (data?.profile) result = data.profile
      } else if (res.status === 422) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'No clear face detected.')
      }
      // Any other non-OK (e.g. 501 not configured) → fall through to local.
    } catch (e) {
      if (e instanceof Error && e.message.includes('face')) {
        setError(e.message)
        setStage('error')
        return
      }
      // network/other → local fallback below
    }

    // 2. Fall back to on-device analysis (no photo leaves the browser).
    if (!result) {
      try {
        const { analyzeLocally } = await import('@/lib/advisor/localAnalyze')
        result = await analyzeLocally(file)
      } catch {
        setError('We couldn’t analyse that image. Please try a clear, front-facing photo.')
        setStage('error')
        return
      }
    }

    // Give the scan animation a moment so it doesn't flash.
    await new Promise((r) => setTimeout(r, reduce ? 0 : 900))
    setProfile(result)
    setStage('result')
  }, [file, reduce])

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setFile(null)
    setProfile(null)
    setError('')
    setStage('input')
  }

  return (
    <div className={styles.wrap}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.srOnly}
        onChange={(e) => onPick(e.target.files?.[0])}
      />

      {/* INPUT / PREVIEW */}
      {(stage === 'input' || stage === 'scanning' || stage === 'error') && (
        <div className={styles.panel}>
          <div className={styles.dropCol}>
            {preview ? (
              <div className={styles.previewFrame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Your uploaded photo" className={styles.previewImg} />
                {stage === 'scanning' && (
                  <div className={styles.scanOverlay} aria-hidden="true">
                    {!reduce && <motion.div
                      className={styles.scanLine}
                      initial={{ top: '0%' }}
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    />}
                    <div className={styles.scanGrid} />
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className={styles.dropzone}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); onPick(e.dataTransfer.files?.[0]) }}
              >
                <UploadIcon />
                <span className={styles.dropTitle}>Upload a selfie</span>
                <span className={styles.dropHint}>
                  Drag a photo here, or tap to choose. On a phone you can take one live.
                </span>
              </button>
            )}
          </div>

          <div className={styles.actionCol}>
            <h2 className={styles.h2}>Your personalised beauty suggestions</h2>
            <p className={styles.copy}>
              Upload a clear, front-facing, well-lit photo. We’ll look at visible
              features and suggest a few things that could suit you — lip shades,
              eye makeup and everyday jewellery.
            </p>

            {stage === 'error' && <p className={styles.err} role="alert">{error}</p>}

            <div className={styles.btnRow}>
              {!preview ? (
                <button type="button" className="btn btn--gold" onClick={() => inputRef.current?.click()}>
                  Choose Photo
                </button>
              ) : stage === 'scanning' ? (
                <button type="button" className="btn btn--gold" disabled>Analysing…</button>
              ) : (
                <>
                  <button type="button" className="btn btn--gold" onClick={analyze}>
                    Analyse My Features
                  </button>
                  <button type="button" className="btn btn--dark" onClick={() => inputRef.current?.click()}>
                    Change Photo
                  </button>
                </>
              )}
            </div>

            <p className={styles.privacy}>
              🔒 Your photo is analysed just to generate suggestions and is never
              stored or shared. Without an AI key configured, analysis runs entirely
              in your browser.
            </p>
          </div>
        </div>
      )}

      {/* RESULT */}
      <AnimatePresence>
        {stage === 'result' && profile && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={styles.result}
          >
            <Results profile={profile} preview={preview} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Results({
  profile, preview, onReset,
}: { profile: BeautyProfile; preview: string | null; onReset: () => void }) {
  const lips = lipsticksFor(profile.undertone).slice(0, 4)
  const eyes = eyePaletteFor(profile.undertone)
  const jewel = jewelleryFor(profile)
  const eyeliner = EYELINER[profile.eyeShape] ?? 'a soft winged liner'
  const lashes = LASHES[profile.eyeShape] ?? 'wispy lashes'

  return (
    <>
      <div className={styles.resultHead}>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Your photo" className={styles.resultThumb} />
        )}
        <div>
          <p className="eyebrow">Your Beauty Profile</p>
          <div className={styles.chips}>
            <Chip label="Skin tone" value={profile.skinTone} />
            <Chip label="Undertone" value={profile.undertone} />
            <Chip label="Face shape" value={profile.faceShape} />
            <Chip label="Eye shape" value={profile.eyeShape} />
          </div>
          <div className={styles.confidence}>
            <span className={styles.confLabel}>AI confidence</span>
            <span className={styles.confBar}>
              <span className={styles.confFill} style={{ width: `${profile.confidence}%` }} />
            </span>
            <span className={styles.confPct}>{profile.confidence}%</span>
          </div>
        </div>
      </div>

      <div className={styles.cards}>
        {/* Lip shades */}
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Lip Shades</h3>
          <ul className={styles.swatches}>
            {lips.map((s) => (
              <li key={s.name} className={styles.swatch}>
                <span className={styles.dot} style={{ background: s.hex }} aria-hidden="true" />
                <span>
                  <strong>{s.name}</strong>
                  <span className={styles.why}>{s.why}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Eye makeup */}
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Eye Makeup</h3>
          <div className={styles.eyeRow}>
            {eyes.map((s) => (
              <span key={s.name} className={styles.eyeSwatch}>
                <span className={styles.eyeDot} style={{ background: s.hex }} aria-hidden="true" />
                {s.name}
              </span>
            ))}
          </div>
          <p className={styles.cardBody}>
            Try {eyes[0].name.toLowerCase()} across the lid with {eyes[3].name.toLowerCase()}
            {' '}in the outer corner, finished with {eyeliner} and {lashes}.
          </p>
        </section>

        {/* Jewellery */}
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Daily-wear Jewellery</h3>
          <p className={styles.cardBody}><strong>Metal:</strong> {jewel.metal}. {jewel.metalWhy}</p>
          <p className={styles.cardBody}><strong>Earrings:</strong> {jewel.earrings}. {jewel.earringsWhy}</p>
          <p className={styles.cardBody}><strong>Everyday:</strong> {jewel.daily}</p>
        </section>
      </div>

      {profile.notes.length > 0 && (
        <ul className={styles.notes}>
          {profile.notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      )}

      <div className={styles.resultCta}>
        <p className={styles.ctaLine}>✨ Love these? Our artists can create the full look for you.</p>
        <div className={styles.ctaBtns}>
          <Link href="/contact" className="btn btn--gold">Book a Consultation</Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn--dark">WhatsApp Us</a>
          <button type="button" className="btn btn--dark" onClick={onReset}>Try Another Photo</button>
        </div>
      </div>
    </>
  )
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className={styles.chip}>
      <span className={styles.chipLabel}>{label}</span>
      <span className={styles.chipValue}>{value}</span>
    </span>
  )
}

function UploadIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 16V4m0 0 4 4m-4-4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
