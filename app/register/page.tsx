'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get('email') || ''),
      password: String(form.get('password') || ''),
      publicName: String(form.get('publicName') || '')
    };

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setError('Registrierung fehlgeschlagen. Bitte überprüfe die Eingaben.');
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <div className="form-layout">
      <div className="form-header panel">
        <h1>Dein ruhiger Raum</h1>
        <p>Du kannst anonym bleiben – oder einen öffentlichen Namen wählen, der zu dir passt.</p>
      </div>

      <form className="panel" onSubmit={onSubmit}>
        <div className="field-grid">
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="email">E-Mail-Adresse</label>
            <input id="email" name="email" type="email" placeholder="du@example.com" required />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="publicName">Öffentlicher Name (optional)</label>
            <input id="publicName" name="publicName" type="text" placeholder="Herzsucher42" />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="password">Passwort</label>
            <input id="password" name="password" type="password" minLength={6} placeholder="mindestens 6 Zeichen" required />
          </div>
        </div>

        {error ? <p className="notice" style={{ marginTop: 16 }}>{error}</p> : null}

        <div className="action-row" style={{ marginTop: 20 }}>
          <button type="submit" className="button primary">Registrieren</button>
          <Link href="/login" className="button ghost">Zum Login</Link>
        </div>
      </form>
    </div>
  );
}
