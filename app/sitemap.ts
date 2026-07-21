import type { MetadataRoute } from 'next'
import { site, navItems } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return navItems.map(({ href }) => ({
    url: `${site.url}${href === '/' ? '' : href}`,
    lastModified: new Date(),
    changeFrequency: href === '/' ? 'weekly' : 'monthly',
    priority: href === '/' ? 1 : 0.8,
  }))
}
