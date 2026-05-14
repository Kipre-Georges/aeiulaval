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
          <span>{siteName}</span>
        </div>
        <div className="footer-nav">
          <a href="/#about">À propos</a>
          <a href="/evenements">Événements</a>
          <a href="/ressources">Ressources</a>
          <a href="/blog">Blog</a>
          <a href="/galerie">Galerie</a>
          <a href="/#contact">Contact</a>
        </div>
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
