import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AEIULAVAL — Association des Étudiants Ivoiriens à l\'Université Laval',
  description: 'Un espace de solidarité, de culture et d\'entraide pour tous les étudiants ivoiriens et amis de la Côte d\'Ivoire à Québec.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
