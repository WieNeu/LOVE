import Link from 'next/link';
import { siteConfig } from '@/lib/config';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark small">❤</span>
            <span>{siteConfig.name}</span>
          </div>
          <p className="muted">Du entscheidest selbst, was du von dir preisgibst.</p>
        </div>

        <div className="footer-links">
          <Link href="/privacy">Datenschutz</Link>
          <Link href="/imprint">Impressum</Link>
          <Link href="/terms">Nutzungsbedingungen</Link>
          <Link href="/community-rules">Community-Regeln</Link>
        </div>
      </div>
    </footer>
  );
}
