/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // All images are served from /public on this origin — no remote hosts,
    // and no "localhost" entry that would only ever work in development.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  poweredByHeader: false,
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
