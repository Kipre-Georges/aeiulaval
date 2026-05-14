import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getSettings, getGallery } from '@/lib/content';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function generateStaticParams() {
  const albums = getGallery();
  return albums.map((a: any) => ({ slug: a.slug }));
}

export default async function GalleryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const general = getSettings('general') as any;

  // Load the album data
  const filePath = path.join(process.cwd(), 'content', 'gallery', `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(fileContent);
  const album = data as any;

  const date = new Date(album.date);
  const dateStr = date.toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      <Nav siteName={general.siteName || 'AEIULAVAL'} />

      <div style={{ paddingTop: '6rem' }}>
        <section style={{ paddingBottom: '2rem' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <a href="/galerie" className="back-link">← Retour à la galerie</a>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '2.4rem',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-1px',
              marginBottom: '0.5rem',
            }}>
              {album.title}
            </h1>
            <p style={{ color: 'var(--text-dimmer)', fontSize: '0.92rem', marginBottom: '0.5rem' }}>
              📅 {dateStr}
              {album.photos && <span> · {album.photos.length} photo{album.photos.length !== 1 ? 's' : ''}</span>}
            </p>
            {album.description && (
              <p style={{ color: 'var(--text-dim)', fontSize: '1rem', maxWidth: 600, lineHeight: 1.7 }}>
                {album.description}
              </p>
            )}
          </div>
        </section>

        <section style={{ background: 'var(--dark)', paddingTop: '1rem' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {album.photos && album.photos.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem',
              }}>
                {album.photos.map((photo: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      background: 'var(--dark-card)',
                      border: '1px solid var(--dark-border)',
                      transition: 'all 0.3s',
                    }}
                  >
                    <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
                      <img
                        src={photo.image}
                        alt={photo.caption || `Photo ${i + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </div>
                    {photo.caption && (
                      <div style={{
                        padding: '0.8rem 1rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-dim)',
                      }}>
                        {photo.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '3rem 0' }}>
                <p>Aucune photo dans cet album.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer siteName={general.siteName || 'AEIULAVAL'} />
    </>
  );
}
