import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getSettings, getGallery } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Galerie photos',
  description: 'Photos et souvenirs des événements et activités de l\'association des étudiants ivoiriens à Laval.',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function GalleryPage() {
  const general = getSettings('general') as any;
  const albums = getGallery() as any[];

  return (
    <>
      <Nav siteName={general.siteName || 'AEIULAVAL'} />

      <div style={{ paddingTop: '6rem' }}>
        <section style={{ paddingBottom: '2rem' }}>
          <div className="sec-header" style={{ maxWidth: 800, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
            <div className="sec-tag green">Souvenirs</div>
            <h2>Galerie photos</h2>
            <p>Les meilleurs moments de nos événements et activités.</p>
          </div>
        </section>

        <section style={{ background: 'var(--dark)', paddingTop: '2rem' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {albums.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '4rem 0' }}>
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</p>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Aucun album pour le moment.</p>
                <p style={{ color: 'var(--text-dimmer)', fontSize: '0.92rem' }}>
                  Les albums peuvent être ajoutés via l&apos;interface <a href="/admin/" style={{ color: 'var(--orange)' }}>admin</a>.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '1.5rem',
              }}>
                {albums.map((album: any) => {
                  const cover = album.photos?.[0]?.image;
                  const photoCount = album.photos?.length || 0;

                  return (
                    <a
                      key={album.slug}
                      href={`/galerie/${album.slug}`}
                      style={{
                        display: 'block',
                        background: 'var(--dark-card)',
                        border: '1px solid var(--dark-border)',
                        borderRadius: 'var(--radius)',
                        overflow: 'hidden',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {/* Cover image or placeholder */}
                      <div style={{
                        width: '100%',
                        height: 220,
                        background: cover ? 'none' : 'linear-gradient(135deg, rgba(255,107,43,0.15), rgba(0,200,83,0.15))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                      }}>
                        {cover ? (
                          <img src={cover} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '3rem' }}>📷</span>
                        )}
                        {/* Photo count badge */}
                        <div style={{
                          position: 'absolute',
                          bottom: 12,
                          right: 12,
                          background: 'rgba(0,0,0,0.7)',
                          backdropFilter: 'blur(10px)',
                          padding: '0.3rem 0.8rem',
                          borderRadius: 100,
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'white',
                        }}>
                          {photoCount} photo{photoCount !== 1 ? 's' : ''}
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{ padding: '1.2rem 1.5rem' }}>
                        <h3 style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: '#1A1A1A',
                          marginBottom: '0.3rem',
                        }}>
                          {album.title}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-dimmer)' }}>
                          {formatDate(album.date)}
                        </p>
                        {album.description && (
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                            {album.description}
                          </p>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer siteName={general.siteName || 'AEIULAVAL'} />
    </>
  );
}
