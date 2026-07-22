import { site } from '@/lib/site'
import { allServices, courses, faqs } from '@/lib/content'

/**
 * Everything the chatbot is allowed to know, and the rules it must follow.
 *
 * The grounding text is injected into the Gemini prompt so answers stay tied
 * to real studio facts. The same facts drive the rule-based fallback used when
 * no API key is configured — so the bot behaves consistently either way.
 */

export const GROUNDING = `
BUSINESS
Name: ${site.name}
What we are: a luxury bridal makeup studio and professional beauty academy.
Location: ${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}, India.
Hours: ${site.hours}.
Phone: ${site.phoneDisplay}. WhatsApp: ${site.whatsappDisplay}.
Instagram: ${site.social.instagramHandle}.

SERVICES
${allServices.map((s) => `- ${s.title}: ${s.desc}`).join('\n')}

ACADEMY COURSES
${courses.map((c) => `- ${c.title} (${c.duration}): ${c.desc}`).join('\n')}

FAQ
${faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}
`.trim()

export const SYSTEM_PROMPT = `You are the virtual assistant for ${site.name}, a luxury bridal makeup studio and academy in ${site.address.locality}, Punjab.

Use ONLY the information provided below to answer. Follow these rules strictly:
- NEVER quote, estimate, or invent prices. Pricing is enquiry-only. If asked about cost, say pricing depends on the look and date, and invite them to enquire on WhatsApp (${site.whatsappDisplay}) or call ${site.phoneDisplay}.
- NEVER promise availability, dates, or discounts. Direct booking questions to WhatsApp or a call.
- If a question is outside makeup, the studio, or the academy, politely decline and steer back to how the studio can help.
- Keep answers warm, concise (2-4 sentences), and in an elegant, professional tone.
- When helpful, suggest booking a consultation or messaging on WhatsApp.
- Do not make up services, awards, or facts not listed below.

STUDIO INFORMATION:
${GROUNDING}`

export const GREETING =
  `Hello! I'm the ${site.shortName} assistant. I can help with our bridal & party makeup, academy courses, timings and location. How can I help you today?`

export const QUICK_REPLIES = [
  'Bridal makeup',
  'Academy courses',
  'Book an appointment',
  'Location & hours',
] as const

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

/**
 * Deterministic fallback used when Gemini is unavailable. Matches the user's
 * message to an intent and returns a grounded answer. Never fabricates.
 */
export function ruleBasedReply(message: string): string {
  const m = message.toLowerCase()
  const has = (...words: string[]) => words.some((w) => m.includes(w))

  if (has('price', 'cost', 'charge', 'rate', 'fee', 'kitna', 'how much', 'package')) {
    return `Our pricing depends on the look, services and your date, so we keep it enquiry-only. For a quick quote, message us on WhatsApp at ${site.whatsappDisplay} or call ${site.phoneDisplay} — we'll be happy to help.`
  }
  if (has('book', 'appointment', 'trial', 'slot', 'available', 'date', 'reserve')) {
    return `Lovely! To check dates and book, the fastest way is WhatsApp (${site.whatsappDisplay}) or a call to ${site.phoneDisplay}. You can also use the enquiry form on our Contact page. For wedding dates we recommend booking 2–3 months ahead.`
  }
  if (has('course', 'academy', 'class', 'training', 'learn', 'student', 'batch', 'certificate')) {
    const list = courses.map((c) => `${c.title} (${c.duration})`).join(', ')
    return `Our academy runs certified, hands-on courses: ${list}. Every graduate gets an ISO-certified certificate plus placement guidance. Message us on WhatsApp to ask about the next batch.`
  }
  if (has('location', 'address', 'where', 'reach', 'direction', 'map')) {
    return `We're at ${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}. ${site.hours}. You'll find a map on our Contact page.`
  }
  if (has('time', 'hour', 'open', 'timing', 'close')) {
    return `We're ${site.hours.toLowerCase()}. Feel free to call ${site.phoneDisplay} before visiting so we can give you our full attention.`
  }
  if (has('bridal', 'wedding', 'dulhan', 'shaadi')) {
    return `Bridal is the heart of our studio — bespoke HD and airbrush looks tailored to your outfit, features and venue, designed to last all day. We'd love to plan yours; message us on WhatsApp at ${site.whatsappDisplay} to start.`
  }
  if (has('hd', 'airbrush')) {
    return `We offer both HD and airbrush makeup for a flawless, long-wearing, camera-ready finish. Which occasion are you planning for? I can point you to the right service.`
  }
  if (has('party', 'engagement', 'reception', 'function', 'event')) {
    return `We create party, engagement and reception looks — from soft and romantic to bold and glamorous. Tell us your event and we'll suggest the perfect look; WhatsApp us at ${site.whatsappDisplay}.`
  }
  if (has('hair', 'skin', 'nail', 'facial', 'mani', 'pedi')) {
    return `Beyond makeup we offer hair styling and treatments, pre-bridal skin care, and a nail studio — everything to complete your look. Ask us anything specific or enquire on WhatsApp.`
  }
  if (has('hello', 'hi', 'hey', 'namaste', 'sat sri')) {
    return GREETING
  }
  if (has('contact', 'phone', 'number', 'whatsapp', 'call', 'email')) {
    return `You can reach us on WhatsApp at ${site.whatsappDisplay} or call ${site.phoneDisplay}. We're happy to help with bookings, the academy or any questions.`
  }
  if (has('thank', 'thanks', 'shukriya')) {
    return `You're most welcome! If there's anything else about our makeup services or academy, just ask. 💛`
  }

  return `I can help with our bridal & party makeup, academy courses, timings and location. For bookings or a quote, WhatsApp us at ${site.whatsappDisplay} or call ${site.phoneDisplay}. What would you like to know?`
}
