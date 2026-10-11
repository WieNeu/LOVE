'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get('email') || ''),
      password: String(form.get('password') || '')
    };

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setError('Login fehlgeschlagen. Bitte prüfe deine Daten.');
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <div className="form-layout">
      <div className="form-header panel">
        <h1>Willkommen zurück</h1>
        <p>Deine Geschichte zählt – auch im ruhigen Moment dazwischen.</p>
      </div>

      <form className="panel" onSubmit={onSubmit}>
        <div className="field-grid">
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="email">E-Mail-Adresse</label>
            <input id="email" name="email" type="email" placeholder="du@example.com" required />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="password">Passwort</label>
            <input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>
        </div>

        {error ? <p className="notice" style={{ marginTop: 16 }}>{error}</p> : null}

        <div className="action-row" style={{ marginTop: 20 }}>
          <button type="submit" className="button primary">Einloggen</button>
          <Link href="/register" className="button ghost">Registrieren</Link>
        </div>
      </form>
    </div>
  );
}
