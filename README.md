# Surbhi Makeup Studio & Academy — Website

Next.js 15 (App Router) implementation of the approved design prototype.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Requires Node.js 18.18+ (LTS recommended).

## Structure

```
app/
  layout.tsx        Root layout — fonts, metadata, LocalBusiness JSON-LD,
                    header/footer/floating actions
  tokens.css        Brand design tokens (single source of truth)
  globals.css       Base styles, layout primitives, button system
  page.tsx          Home
  <route>/page.tsx  The 7 other views
  sitemap.ts        Generated sitemap
  robots.ts         Generated robots.txt
components/
  layout/           Header, Footer, FloatingActions
  sections/         Page sections (Hero, …)
  ui/               CtaBand, Icons, Placeholder
lib/site.ts         Business details, nav, contact points
public/images/      Source images (deduped from the handoff bundle)
```

## Conventions

- **Never hardcode brand values.** Colors, type, spacing and radii all live in
  `app/tokens.css`. If a value isn't there, add it there first.
- **Never hardcode contact details.** Phone, WhatsApp, address and social links
  come from `lib/site.ts`. The prototype repeated the phone number in 12 places.
- Component-scoped styles use CSS Modules. Shared primitives (`.btn`, `.section`,
  `.shell`, `.eyebrow`) live in `globals.css`.
- Images go through `next/image` — it emits AVIF/WebP with a responsive srcset
  and reserves layout space. Don't use raw `<img>` or CSS `background-image`
  for content imagery.

## Brand

| Token | Value | Use |
|---|---|---|
| `--gold` | `#D4AF37` | Primary accent, CTAs, numerals |
| `--rose` | `#B76E79` | Section eyebrows, tags |
| `--charcoal` | `#2E2E2E` | Dark surfaces, primary text |
| `--ivory` | `#F8F5F2` | Alternating section background |

Playfair Display (headings) · Jost (body) · Marcellus (nav & buttons), all
self-hosted via `next/font`.

## Status

**Complete.** All 8 pages ported from the prototype:

| Route | Sections |
|---|---|
| `/` | Hero, Featured Services, Why Choose, Featured Work, Academy Preview, Testimonials, Instagram, CTA |
| `/about` | Story, Founder, Mission/Vision, Graduates, Certifications |
| `/services` | Full 10-service grid with feature lists |
| `/portfolio` | Gallery with lightbox |
| `/academy` | Hero, Why Join, Courses, Training, Student gallery, Certification, Admissions, FAQ |
| `/testimonials` | Animated stats, review masonry |
| `/faq` | Searchable accordion + FAQPage schema |
| `/contact` | Validated enquiry form, studio details, map |

## Known issues carried over from the prototype

- **Portfolio imagery** — the portfolio tiles reuse student/academy photos with
  bridal captions ("Traditional Bridal", "Reception Glam"). Real bridal client
  photos are needed before launch.
- **Contact form** — submits by composing a WhatsApp message and opening the
  chat (`app/contact/ContactForm.tsx`). This works with no backend and lands
  where the studio already takes bookings. To move to email instead, replace
  `handleSubmit` with a POST to an API route.
- **Domain** — `site.url` in `lib/site.ts` is a placeholder; update it before
  deploying so canonical URLs, Open Graph and the sitemap are correct.
