'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category } from '@prisma/client';

export function StoryForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [contentPreview, setContentPreview] = useState('');
  const [showSensitive, setShowSensitive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      anonymousName: String(formData.get('anonymousName') || ''),
      title: String(formData.get('title') || ''),
      categoryId: String(formData.get('categoryId') || ''),
      content: String(formData.get('content') || ''),
      contentWarning: showSensitive ? String(formData.get('contentWarning') || '') : ''
    };

    const response = await fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));
    setIsSubmitting(false);

    if (!response.ok) {
      setError(result.error || 'Es ist ein Fehler aufgetreten.');
      return;
    }

    router.push(`/stories/${result.story.id}`);
    router.refresh();
  }

  const previewText = useMemo(() => {
    if (!contentPreview) return '';
    return contentPreview
      .split('\n\n')
      .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`)
      .join('');
  }, [contentPreview]);

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div className="field-grid">
        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="anonymousName">Anonymer Name</label>
          <input id="anonymousName" name="anonymousName" type="text" placeholder="Herzsucher23" required />
          <div className="helper">Dieser Name ist öffentlich sichtbar. Verwende keine persönlichen Daten, wenn du anonym bleiben möchtest.</div>
        </div>

        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="title">Titel</label>
          <input id="title" name="title" type="text" placeholder="Ich dachte, wir würden für immer zusammenbleiben." required />
        </div>

        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="categoryId">Kategorie</label>
          <select id="categoryId" name="categoryId" required>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.icon} {category.name}</option>
            ))}
          </select>
        </div>

        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="content">Geschichte</label>
          <textarea id="content" name="content" placeholder="Schreib dir von der Seele, was dich beschäftigt…" required />
        </div>

        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={showSensitive}
              onChange={(event) => setShowSensitive(event.target.checked)}
            />
            Meine Geschichte enthält sensible Inhalte.
          </label>
        </div>

        {showSensitive ? (
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="contentWarning">Art der sensiblen Inhalte</label>
            <select id="contentWarning" name="contentWarning">
              <option value="">Bitte wählen</option>
              <option value="Gewalt">Gewalt</option>
              <option value="Tod">Tod</option>
              <option value="Betrug">Betrug</option>
              <option value="Psychische Belastung">Psychische Belastung</option>
              <option value="Andere sensible Inhalte">Andere sensible Inhalte</option>
            </select>
          </div>
        ) : null}
      </div>

      <div className="notice" style={{ marginTop: 18 }}>
        Bitte veröffentliche keine echten Namen, Telefonnummern, Adressen, E-Mail-Adressen oder andere persönlichen Daten von dir oder anderen Personen.
      </div>

      <div className="action-row" style={{ marginTop: 18 }}>
        <button type="submit" className="button primary" disabled={isSubmitting}>
          {isSubmitting ? 'Wird veröffentlicht…' : 'Geschichte veröffentlichen'}
        </button>
        <button
          type="button"
          className="button ghost"
          onClick={() => {
            const textarea = document.getElementById('content') as HTMLTextAreaElement | null;
            setContentPreview(textarea?.value || '');
          }}
        >
          Vorschau anzeigen
        </button>
      </div>

      {error ? <p className="notice" style={{ marginTop: 18 }}>{error}</p> : null}

      {contentPreview ? (
        <div style={{ marginTop: 20 }}>
          <h3>Vorschau</h3>
          <div className="story-text" dangerouslySetInnerHTML={{ __html: previewText }} />
        </div>
      ) : null}
    </form>
  );
}
