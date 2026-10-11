import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata = {
  title: 'Herzgeschichten',
  description: 'Eine ruhige Community für ehrliche Geschichten rund um Liebe und Beziehungen.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <div className="page-shell">
          <SiteHeader />
          <main className="page-content">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
