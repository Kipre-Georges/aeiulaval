import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getSettings, getResources } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Ressources',
  description: 'Guides et ressources essentielles pour les étudiants ivoiriens nouveaux arrivants à Québec : logement, immigration, emploi, santé.',
};

export default function ResourcesPage() {
  const general = getSettings('general') as any;
  const resources = getResources() as any[];

  const categories = Array.from(new Set(resources.map((r: any) => r.category)));

  return (
    <>
      <Nav siteName={general.siteName || 'AEIULAVAL'} />

      <div style={{ paddingTop: '6rem' }}>
        <section style={{ paddingBottom: '2rem' }}>
          <div className="sec-header" style={{ maxWidth: 800, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
            <div className="sec-tag green">Guide complet</div>
            <h2>Ressources pour les nouveaux arrivants</h2>
            <p>Tout ce qu&apos;il faut savoir pour bien s&apos;installer à Québec et réussir à l&apos;Université Laval.</p>
          </div>
        </section>

        <section className="section-resources" style={{ paddingTop: '2rem' }}>
          <div className="resources-container">
            <div className="res-grid">
              {resources.map((r: any) => (
                <a className="res-card" key={r.slug} href={`/ressources/${r.slug}`}>
                  <span className="res-icon">{r.icon}</span>
                  <h3>{r.title}</h3>
                  <p>{r.summary}</p>
                  <div className="arrow">→</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer siteName={general.siteName || 'AEIULAVAL'} />
    </>
  );
}
