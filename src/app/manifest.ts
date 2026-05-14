import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AEIULAVAL — Étudiants Ivoiriens à l\'Université Laval',
    short_name: 'AEIULAVAL',
    description: 'Communauté étudiante ivoirienne à l\'Université Laval — événements, ressources et entraide.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FFFFFF',
    theme_color: '#FF6B2B',
    lang: 'fr-CA',
    categories: ['education', 'social', 'lifestyle'],
    icons: [
      { src: '/icon', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
