import Link from 'next/link';
import { Heart, LogIn, LogOut, PencilLine, Sparkles, UserCircle2 } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { siteConfig } from '@/lib/config';

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link href="/" className="brand" aria-label={siteConfig.name}>
          <span className="brand-mark"><Heart size={18} /></span>
          <span>{siteConfig.name}</span>
        </Link>

        <nav className="main-nav" aria-label="Hauptnavigation">
          <Link href="/stories">Geschichten</Link>
          <Link href="/write">Geschichte erzählen</Link>
          <Link href="/stories/random">Zufällige Geschichte</Link>
          <Link href="/about">Über uns</Link>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <Link href="/admin" className="secondary-link">Mein Bereich</Link>
              <form action="/api/logout" method="POST">
                <button type="submit" className="button ghost small">
                  <LogOut size={16} />
                  Abmelden
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="secondary-link">Login</Link>
              <Link href="/register" className="button small primary">
                <UserCircle2 size={16} />
                Registrieren
              </Link>
            </>
          )}

          <Link href="/write" className="button small primary accent">
            <PencilLine size={16} />
            Erzählen
          </Link>
        </div>
      </div>
    </header>
  );
}
