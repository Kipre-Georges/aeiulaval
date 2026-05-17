import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getSettings, getAnnonces, getMarkdownWithHtml } from '@/lib/content';

export async function generateStaticParams() {
  const items = getAnnonces();
  return items.map((a: any) => ({ slug: a.slug }));
}

function categoryClass(c: string) {
  return c?.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[\/\s]+/g, '-') || 'autre';
}

function contactHref(value: string, type: string) {
  if (!value) return '#';
  if (type === 'email') return `mailto:${value}`;
  if (type === 'whatsapp') {
    const digits = value.replace(/[^\d]/g, '');
    return `https://wa.me/${digits}`;
  }
  if (type === 'telephone') return `tel:${value.replace(/\s/g, '')}`;
  return value;
}

function contactLabel(type: string) {
  if (type === 'email') return '✉️ Envoyer un email';
  if (type === 'whatsapp') return '💬 Contacter sur WhatsApp';
  if (type === 'telephone') return '📞 Appeler';
  return 'Contacter';
}

export default async function AnnonceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const general = getSettings('general') as any;
  const { frontmatter, contentHtml } = await getMarkdownWithHtml('annonces', slug);
  const fm = frontmatter as any;

  const publishedDate = new Date(fm.publishedDate);
  const publishedStr = publishedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <Nav siteName={general.siteName || 'AEIULAVAL'} />
      <div className="content-page">
        <a href="/annonces" className="back-link">← Toutes les annonces</a>

        <div className="annonce-detail-header">
          <span className={`annonce-badge cat-${categoryClass(fm.category)}`}>{fm.category}</span>
          <span className={`annonce-type type-${fm.type?.toLowerCase()}`}>{fm.type}</span>
        </div>

        <h1>{fm.title}</h1>

        <div className="annonce-detail-meta">
          {fm.location && <div className="annonce-meta-item"><span>📍</span>{fm.location}</div>}
          {fm.price && <div className="annonce-meta-item"><span>💰</span>{fm.price}</div>}
          <div className="annonce-meta-item"><span>📅</span>Publié le {publishedStr}</div>
          {fm.author && <div className="annonce-meta-item"><span>👤</span>{fm.author}</div>}
        </div>

        {fm.image && (
          <div className="annonce-detail-image">
            <img src={fm.image} alt={fm.imageAlt || fm.title} />
          </div>
        )}

        <div className="prose" dangerouslySetInnerHTML={{ __html: contentHtml }} />

        {fm.contact && (
          <div className="annonce-contact-box">
            <strong>Intéressé ? Contacte directement :</strong>
            <a
              href={contactHref(fm.contact, fm.contactType || 'email')}
              className="btn-glow btn-orange"
              target={fm.contactType === 'whatsapp' ? '_blank' : undefined}
              rel={fm.contactType === 'whatsapp' ? 'noopener noreferrer' : undefined}
            >
              {contactLabel(fm.contactType || 'email')}
            </a>
            <small>{fm.contact}</small>
          </div>
        )}
      </div>
      <Footer siteName={general.siteName || 'AEIULAVAL'} />
    </>
  );
}
