/**
 * Inline SVG icons. The prototype used bare text glyphs (☎ ☶ ✦ ✓ ⚲) which
 * screen readers announce literally — "black telephone", "trigram for water" —
 * and which render inconsistently across platforms. All are decorative here
 * (aria-hidden); the accessible name lives on the parent link/button.
 */

type IconProps = { size?: number; className?: string }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
  focusable: 'false' as const,
})

export function PhoneIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function WhatsAppIcon({ size = 26, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.25.69-1.44 1.32-1.99 1.4-.53.08-1.17.11-1.89-.12-.44-.14-1-.32-1.71-.63-3.02-1.3-4.99-4.33-5.14-4.53-.15-.2-1.23-1.63-1.23-3.12s.78-2.22 1.06-2.52c.28-.3.61-.38.81-.38.2 0 .4 0 .58.01.19.01.44-.07.68.52.25.6.85 2.08.93 2.23.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.61.17.3.76 1.25 1.62 2.03 1.12 1 2.05 1.3 2.35 1.45.3.15.47.13.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.01.96.3.15.5.22.57.35.07.12.07.71-.18 1.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function InstagramIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

export function FacebookIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M14 9h2.5V6H14c-2.2 0-3.5 1.4-3.5 3.6V11H8v3h2.5v7h3v-7H16l.5-3h-3V9.8c0-.5.2-.8.9-.8Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** The gold four-point sparkle used for feature bullets (was `✦`). */
export function SparkIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M12 2c.5 5.2 4.8 9.5 10 10-5.2.5-9.5 4.8-10 10-.5-5.2-4.8-9.5-10-10 5.2-.5 9.5-4.8 10-10Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Checkmark for feature lists (was `✓`). */
export function CheckIcon({ size = 12, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="m4 12.5 5 5 11-11"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArrowRightIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M5 12h14m-6-7 7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
