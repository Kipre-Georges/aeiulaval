import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getSettings, getBlogPosts, getMarkdownWithHtml } from '@/lib/content';

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((p: any) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const general = getSettings('general') as any;
  const { frontmatter, contentHtml } = await getMarkdownWithHtml('blog', slug);
  const fm = frontmatter as any;

  const date = new Date(fm.date);
  const dateStr = date.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      <Nav siteName={general.siteName || 'AEIULAVAL'} />
      <div className="content-page">
        <a href="/blog" className="back-link">← Retour au blog</a>

        {fm.image && (
          <div style={{
            width: '100%',
            height: 300,
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            marginBottom: '2rem',
          }}>
            <img src={fm.image} alt={fm.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-dimmer)', marginBottom: '1rem' }}>
          <span>{dateStr}</span>
          {fm.author && <span>· par {fm.author}</span>}
        </div>

        <h1>{fm.title}</h1>

        {fm.tags && fm.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {fm.tags.map((tag: string) => (
              <span key={tag} style={{
                padding: '0.25rem 0.8rem',
                borderRadius: 100,
                fontSize: '0.72rem',
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

        <div className="prose" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>
      <Footer siteName={general.siteName || 'AEIULAVAL'} />
    </>
  );
}
