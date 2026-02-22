/** @type {import('next').NextConfig} */
const nextConfig = {
  // En mode développement, ne pas activer 'export'
  // En mode production (build), activer 'export' pour Netlify
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
  }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
