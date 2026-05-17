import SubscribeButton from './SubscribeButton';

interface FooterProps {
  siteName: string;
}

export default function Footer({ siteName }: FooterProps) {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="logo-mark" style={{ width: 30, height: 20 }}>
            <div className="lo" />
            <div className="lw" />
            <div className="lg" />
          </div>
          <div className="footer-brand-text">
            <span>{siteName}</span>
            <small>Association des Étudiants Ivoiriens à l&apos;Université Laval</small>
          </div>
        </div>
        <div className="footer-nav">
          <a href="/#about">À propos</a>
          <a href="/evenements">Événements</a>
          <a href="/annonces">Annonces</a>
          <a href="/ressources">Ressources</a>
          <a href="/blog">Blog</a>
          <a href="/galerie">Galerie</a>
          <a href="/#contact">Contact</a>
        </div>
      </div>
      <div className="footer-subscribe">
        <SubscribeButton />
        <small>Reste informé des prochains événements en temps réel.</small>
      </div>
      <div className="footer-affiliation">
        <span className="footer-affiliation-label">Affiliée à</span>
        <a href="https://www.ulaval.ca" target="_blank" rel="noopener noreferrer" className="footer-ulaval" aria-label="Site de l'Université Laval">
          <img src="/images/partners/ulaval.svg" alt="Logo de l'Université Laval" className="footer-ulaval-logo" />
        </a>
      </div>
      <div className="footer-copy">
        © {new Date().getFullYear()} Association des Étudiants Ivoiriens à l&apos;Université Laval. Tous droits réservés.
      </div>
      <div className="footer-credit">
        Développé avec ❤️ par <span className="footer-credit-name">le fils de Akouba</span>
      </div>
    </footer>
  );
}
