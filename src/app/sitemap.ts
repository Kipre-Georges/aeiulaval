import { MetadataRoute } from 'next';
import { getEvents, getBlogPosts, getResources, getGallery } from '@/lib/content';

const BASE = 'https://ivoirienlaval.netlify.app';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,            changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/evenements`,  changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/ressources`,  changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/blog`,        changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/galerie`,     changeFrequency: 'monthly', priority: 0.6 },
  ];

  const events    = getEvents().map((e: any)    => ({ url: `${BASE}/evenements/${e.slug}`, lastModified: new Date(e.date), changeFrequency: 'monthly' as const, priority: 0.7 }));
  const posts     = getBlogPosts().map((p: any) => ({ url: `${BASE}/blog/${p.slug}`,        lastModified: new Date(p.date), changeFrequency: 'monthly' as const, priority: 0.6 }));
  const resources = getResources().map((r: any) => ({ url: `${BASE}/ressources/${r.slug}`,  changeFrequency: 'monthly' as const, priority: 0.6 }));
  const albums    = getGallery().map((a: any)   => ({ url: `${BASE}/galerie/${a.slug}`,     lastModified: new Date(a.date), changeFrequency: 'monthly' as const, priority: 0.5 }));

  return [...staticPages, ...events, ...posts, ...resources, ...albums];
}
