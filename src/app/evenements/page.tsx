import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getSettings, getEvents } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Événements',
  description: 'Retrouve l\'ensemble des activités et événements de l\'association des étudiants ivoiriens à l\'Université Laval.',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString(),
    month: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', ''),
    full: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

function categoryClass(cat: string) {
  return cat?.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-') || 'autre';
}

export default function EventsPage() {
  const general = getSettings('general') as any;
  const events = getEvents() as any[];

  const now = new Date();
  const upcoming = events.filter((e: any) => new Date(e.date) >= now);
  const past = events.filter((e: any) => new Date(e.date) < now);

  return (
    <>
      <Nav siteName={general.siteName || 'AEIULAVAL'} />

      <div style={{ paddingTop: '6rem' }}>
        {/* Header */}
        <section style={{ paddingBottom: '2rem' }}>
          <div className="sec-header" style={{ maxWidth: 800, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
            <div className="sec-tag orange">Calendrier</div>
            <h2>Tous nos événements</h2>
            <p>Retrouve ici l&apos;ensemble de nos activités passées et à venir.</p>
          </div>
        </section>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="section-events" style={{ paddingTop: '3rem' }}>
            <div className="events-container">
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--green)',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: 'var(--green)', display: 'inline-block',
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
                À venir
              </h3>
              <div className="events-grid">
                {upcoming.map((e: any) => (
                  <a className="ev-card" key={e.slug} href={`/evenements/${e.slug}`}>
                    <span className={`ev-badge ${categoryClass(e.category)}`}>{e.category}</span>
                    <h3>{e.title}</h3>
                    <p className="ev-desc">{e.description}</p>
                    <div className="ev-footer">
                      <span>📅 {formatDate(e.date).full}</span>
                      <span>📍 {e.location?.split(',')[0]}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Past */}
        {past.length > 0 && (
          <section style={{ background: 'var(--dark)', borderTop: '1px solid var(--dark-border)' }}>
            <div className="events-container">
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--text-dimmer)',
                marginBottom: '2rem',
              }}>
                Événements passés
              </h3>
              <div className="events-grid">
                {past.map((e: any) => (
                  <a className="ev-card" key={e.slug} href={`/evenements/${e.slug}`} style={{ opacity: 0.7 }}>
                    <span className={`ev-badge ${categoryClass(e.category)}`}>{e.category}</span>
                    <h3>{e.title}</h3>
                    <p className="ev-desc">{e.description}</p>
                    <div className="ev-footer">
                      <span>📅 {formatDate(e.date).full}</span>
                      <span>📍 {e.location?.split(',')[0]}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {events.length === 0 && (
          <section style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
            <p>Aucun événement pour le moment. Reviens bientôt !</p>
          </section>
        )}
      </div>

      <Footer siteName={general.siteName || 'AEIULAVAL'} />
    </>
  );
}
