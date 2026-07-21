/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // AVIF first, WebP fallback. Next generates these at build/request time,
    // so the source JPGs in public/images stay untouched as the originals.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920],
    // Required from Next 16 onward; must list every `quality` value used.
    qualities: [75, 82, 90],
  },
}

export default nextConfig
