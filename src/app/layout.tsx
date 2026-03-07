import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = 'https://ivoirienlaval.netlify.app';

export const metadata: Metadata = {
  title: {
    default: 'AEIULAVAL — Association des Étudiants Ivoiriens à l\'Université Laval',
    template: '%s | AEIULAVAL',
  },
  description: 'Un espace de solidarité, de culture et d\'entraide pour tous les étudiants ivoiriens et amis de la Côte d\'Ivoire à Québec.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    url: siteUrl,
    siteName: 'AEIULAVAL',
    title: 'AEIULAVAL — Association des Étudiants Ivoiriens à l\'Université Laval',
    description: 'Solidarité, culture et entraide pour les étudiants ivoiriens à Québec.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEIULAVAL',
    description: 'Solidarité, culture et entraide pour les étudiants ivoiriens à Québec.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js" strategy="afterInteractive" />
        <Script id="netlify-identity-redirect" strategy="afterInteractive">
          {`
            if (window.netlifyIdentity) {
              window.netlifyIdentity.on("init", user => {
                if (!user) {
                  window.netlifyIdentity.on("login", () => {
                    document.location.href = "/admin/";
                  });
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
