import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getSettings, getBlogPosts } from '@/lib/content';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogPage() {
  const general = getSettings('general') as any;
  const posts = getBlogPosts() as any[];

  return (
    <>
      <Nav siteName={general.siteName || 'AEIULAVAL'} />

      <div style={{ paddingTop: '6rem' }}>
        <section style={{ paddingBottom: '2rem' }}>
          <div className="sec-header" style={{ maxWidth: 800, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
            <div className="sec-tag orange">Actualités</div>
            <h2>Notre blog</h2>
            <p>Les dernières nouvelles de l&apos;association et de la communauté ivoirienne à Laval.</p>
          </div>
        </section>

        <section style={{ background: 'var(--dark)', paddingTop: '2rem' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {posts.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '4rem 0' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Aucun article pour le moment.</p>
                <p style={{ color: 'var(--text-dimmer)', fontSize: '0.92rem' }}>
                  Les membres du bureau peuvent publier via l&apos;interface <a href="/admin/" style={{ color: 'var(--orange)' }}>admin</a>.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {posts.map((post: any) => (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: post.image ? '200px 1fr' : '1fr',
                      gap: '1.5rem',
                      padding: '2rem',
                      background: 'var(--dark-card)',
                      border: '1px solid var(--dark-border)',
                      borderRadius: 'var(--radius)',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                      alignItems: 'center',
                    }}
                    className="blog-card-hover"
                  >
                    {post.image && (
                      <div style={{
                        width: '100%',
                        height: 140,
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        background: 'var(--glass)',
                      }}>
                        <img
                          src={post.image}
                          alt={post.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div>
                      <div style={{
                        display: 'flex',
                        gap: '1rem',
                        fontSize: '0.78rem',
                        color: 'var(--text-dimmer)',
                        marginBottom: '0.6rem',
                      }}>
                        <span>{formatDate(post.date)}</span>
                        {post.author && <span>par {post.author}</span>}
                      </div>
                      <h3 style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        color: 'white',
                        marginBottom: '0.5rem',
                      }}>
                        {post.title}
                      </h3>
                      <p style={{
                        fontSize: '0.92rem',
                        color: 'var(--text-dim)',
                        lineHeight: 1.6,
                      }}>
                        {post.summary}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                          {post.tags.map((tag: string) => (
                            <span key={tag} style={{
                              padding: '0.2rem 0.7rem',
                              borderRadius: 100,
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              background: 'rgba(255, 107, 43, 0.1)',
                              color: 'var(--orange-soft)',
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer siteName={general.siteName || 'AEIULAVAL'} />
    </>
  );
}
