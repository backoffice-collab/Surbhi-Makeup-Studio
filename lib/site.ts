/**
 * Single source of truth for business details, navigation and contact points.
 * The prototype repeated these literals across ~30 places; changing the phone
 * number there meant 12 separate edits.
 */

export const site = {
  name: 'Surbhi Makeup Studio & Academy',
  shortName: 'Surbhi Makeup Studio',
  tagline: 'Luxury bridal makeup studio & professional beauty academy in Kot Kapura, Punjab.',
  url: 'https://surbhimakeupstudio.com', // update when the domain is live

  phone: '+918360796775',
  phoneDisplay: '+91 83607 96775',
  whatsapp: '919501397259',
  whatsappDisplay: '+91 95013 97259',

  address: {
    street: 'Fauji Road',
    locality: 'Kot Kapura',
    region: 'Punjab',
    postalCode: '151204',
    country: 'IN',
  },

  hours: 'Open daily · 9 AM – 9 PM',
  hoursStructured: 'Mo-Su 09:00-21:00',

  social: {
    instagram: 'https://instagram.com/surbhi_makeup_studio',
    instagramHandle: '@surbhi_makeup_studio',
    facebook: 'https://facebook.com/surbhimakeupstudio1',
  },
} as const

export const whatsappUrl = `https://wa.me/${site.whatsapp}`
export const telUrl = `tel:${site.phone}`

/** The 8 views — now real routes instead of a `page` state string. */
export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Academy', href: '/academy' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'FAQs', href: '/faq' },
  { label: 'Contact', href: '/contact' },
] as const

export const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Academy', href: '/academy' },
  { label: 'Contact', href: '/contact' },
] as const

export const footerServices = [
  'Bridal Makeup',
  'HD & Airbrush',
  'Party Makeup',
  'Hair & Skin',
  'Nail Studio',
] as const

/** Routes whose hero is dark, so the header starts transparent over them. */
export const darkHeroRoutes = ['/', '/academy', '/portfolio'] as const
