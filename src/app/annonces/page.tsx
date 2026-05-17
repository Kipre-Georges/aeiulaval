import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AnnoncesGrid from '@/components/AnnoncesGrid';
import { getSettings, getAnnonces } from '@/lib/content';

export const metadata = {
  title: 'Petites annonces',
  description: 'Logement, colocation, covoiturage, cours, ventes entre membres de la communauté ivoirienne de l\'Université Laval.',
};

export default function AnnoncesPage() {
  const general = getSettings('general') as any;
  const annonces = getAnnonces() as any[];

  return (
    <>
      <Nav siteName={general.siteName || 'AEIULAVAL'} />
      <div className="content-page wide">
        <div className="sec-header">
          <div className="sec-tag orange">Communauté</div>
          <h1>Petites annonces</h1>
          <p className="page-intro">
            Logement, colocation, covoiturage, ventes et services entre membres. Pour publier
            une annonce, contacte le bureau de l&apos;asso, on s&apos;en occupe pour toi.
          </p>
        </div>

        {annonces.length === 0 ? (
          <div className="annonces-empty">
            <span className="annonces-empty-icon">📌</span>
            <h2>Aucune annonce pour le moment</h2>
            <p>Reviens bientôt, ou contacte le bureau si tu veux publier la première.</p>
          </div>
        ) : (
          <AnnoncesGrid annonces={annonces} />
        )}
      </div>
      <Footer siteName={general.siteName || 'AEIULAVAL'} />
    </>
  );
}
