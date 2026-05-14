import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getSettings, getResources, getMarkdownWithHtml } from '@/lib/content';

export async function generateStaticParams() {
  const resources = getResources();
  return resources.map((r: any) => ({ slug: r.slug }));
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const general = getSettings('general') as any;
  const { frontmatter, contentHtml } = await getMarkdownWithHtml('resources', slug);

  return (
    <>
      <Nav siteName={general.siteName || 'AEIULAVAL'} />
      <div className="content-page">
        <a href="/#resources" className="back-link">← Retour aux ressources</a>
        <h1>{(frontmatter as any).icon} {(frontmatter as any).title}</h1>
        <div className="prose" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>
      <Footer siteName={general.siteName || 'AEIULAVAL'} />
    </>
  );
}
