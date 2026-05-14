import './globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { getSettings } from '@/lib/content';
import InstallPrompt from '@/components/InstallPrompt';

const siteUrl = 'https://ivoirienlaval.netlify.app';

const sharedDescription = 'Communauté étudiante ivoirienne à l\'Université Laval (Québec) : événements culturels, entraide, ressources pour nouveaux arrivants et accompagnement. Akwaba !';

export const metadata: Metadata = {
  title: {
    default: 'AEIULAVAL — Étudiants Ivoiriens à l\'Université Laval',
    template: '%s | AEIULAVAL',
  },
  description: sharedDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    url: siteUrl,
    siteName: 'AEIULAVAL',
    title: 'AEIULAVAL — Étudiants Ivoiriens à l\'Université Laval',
    description: sharedDescription,
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'AEIULAVAL — La communauté ivoirienne de Laval',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEIULAVAL — Étudiants Ivoiriens à l\'Université Laval',
    description: sharedDescription,
    images: [`${siteUrl}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    title: 'AEIULAVAL',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  themeColor: '#FF6B2B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = getSettings('theme');
  const fontHeading = theme.fontHeading || 'Syne';
  const fontBody = theme.fontBody || 'DM Sans';

  const cssVars = {
    ...(theme.colorPrimary && {
      '--orange': theme.colorPrimary,
      '--orange-soft': theme.colorPrimary,
      '--green': theme.colorSecondary,
      '--green-neon': theme.colorSecondary,
      '--dark': theme.colorBackground,
      '--text': theme.colorText,
      '--dark-card': theme.colorCard,
      '--radius': theme.borderRadius,
    }),
    '--font-heading': `'${fontHeading}', sans-serif`,
    '--font-body': `'${fontBody}', sans-serif`,
  } as React.CSSProperties;

  const fontsToLoad = Array.from(new Set([fontHeading, fontBody]))
    .map(f => `family=${encodeURIComponent(f)}:wght@400;500;600;700;800`)
    .join('&');
  const googleFontsUrl = `https://fonts.googleapis.com/css2?${fontsToLoad}&display=swap`;

  return (
    <html lang="fr" style={cssVars}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={googleFontsUrl} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'AEIULAVAL',
              alternateName: 'Association des Étudiants Ivoiriens à l\'Université Laval',
              url: siteUrl,
              logo: `${siteUrl}/opengraph-image`,
              description: 'Un espace de solidarité, de culture et d\'entraide pour tous les étudiants ivoiriens et amis de la Côte d\'Ivoire à Québec.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Québec',
                addressRegion: 'QC',
                addressCountry: 'CA',
              },
            }),
          }}
        />
        {children}
        <InstallPrompt />
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
