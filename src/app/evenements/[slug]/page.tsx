import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getSettings, getEvents, getMarkdownWithHtml } from '@/lib/content';

export async function generateStaticParams() {
  const events = getEvents();
  return events.map((e: any) => ({ slug: e.slug }));
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const general = getSettings('general') as any;
  const { frontmatter, contentHtml } = await getMarkdownWithHtml('events', slug);
  const fm = frontmatter as any;

  const date = new Date(fm.date);
  const dateStr = date.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: fm.title,
    startDate: fm.date,
    ...(fm.endDate && { endDate: fm.endDate }),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: fm.location,
      address: { '@type': 'PostalAddress', addressLocality: 'Québec', addressRegion: 'QC', addressCountry: 'CA' },
    },
    description: fm.description,
    organizer: { '@type': 'Organization', name: 'AEIULAVAL', url: 'https://ivoirienlaval.netlify.app' },
    ...(fm.image && { image: [fm.image] }),
    offers: {
      '@type': 'Offer',
      price: fm.isFree ? '0' : (fm.price || '0'),
      priceCurrency: 'CAD',
      availability: 'https://schema.org/InStock',
      url: `https://ivoirienlaval.netlify.app/evenements/${slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <Nav siteName={general.siteName || 'AEIULAVAL'} />
      <div className="content-page">
        <a href="/#events" className="back-link">← Retour aux événements</a>
        <div className="sec-tag orange" style={{ marginBottom: '0.5rem' }}>{fm.category}</div>
        <h1>{fm.title}</h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '1.05rem' }}>
          📅 {dateStr} — 📍 {fm.location}
        </p>
        {fm.isFree && (
          <p style={{ color: 'var(--green-neon)', fontWeight: 600, marginBottom: '2rem' }}>🎫 Entrée libre</p>
        )}
        <div className="prose" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        {fm.registrationUrl && (
          <div style={{ marginTop: '2rem' }}>
            <a href={fm.registrationUrl} className="btn-glow btn-orange" target="_blank" rel="noopener noreferrer">
              S&apos;inscrire →
            </a>
          </div>
        )}
      </div>
      <Footer siteName={general.siteName || 'AEIULAVAL'} />
    </>
  );
}
