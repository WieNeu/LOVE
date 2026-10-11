'use client';

import { FormEvent, useState } from 'react';
import { MessageCircle } from 'lucide-react';

export type CommentItem = {
  id: string;
  anonymousName: string;
  content: string;
  createdAt: string | Date;
};

export function CommentSection({ storyId, initialComments }: { storyId: string; initialComments: CommentItem[] }) {
  const [comments, setComments] = useState(initialComments);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      anonymousName: String(form.get('anonymousName') || ''),
      content: String(form.get('content') || '')
    };

    const response = await fetch(`/api/stories/${storyId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error || 'Kommentar konnte nicht gespeichert werden.');
      return;
    }

    const result = await response.json();
    setComments((current) => [...current, result.comment]);
    const formEl = event.currentTarget as HTMLFormElement;
    formEl.reset();
    setError('');
  }

  return (
    <div className="panel" style={{ marginTop: 18 }}>
      <div className="section-header">
        <h3>Kommentare</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="field-grid">
          <div className="field">
            <label htmlFor={`name-${storyId}`}>Anonymer Name</label>
            <input id={`name-${storyId}`} name="anonymousName" type="text" placeholder="EinfachIch" required />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor={`comment-${storyId}`}>Dein Kommentar</label>
            <textarea id={`comment-${storyId}`} name="content" placeholder="Ich kenne dieses Gefühl…" required />
          </div>
        </div>

        {error ? <p className="notice" style={{ marginTop: 16 }}>{error}</p> : null}

        <div className="action-row" style={{ marginTop: 18 }}>
          <button type="submit" className="button primary">
            <MessageCircle size={16} />
            Kommentieren
          </button>
        </div>
      </form>

      <div className="comment-list">
        {comments.length === 0 ? <p className="muted">Noch keine Kommentare. Sei die erste Person, die hier ehrlich antwortet.</p> : null}
        {comments.map((comment) => (
          <div className="comment-item" key={comment.id}>
            <strong>{comment.anonymousName}</strong>
            <div>{comment.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
