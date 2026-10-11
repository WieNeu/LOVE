'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';

export function ReportButton({ storyId, commentId }: { storyId?: string; commentId?: string }) {
  const [sent, setSent] = useState(false);

  async function handleReport() {
    const endpoint = commentId ? `/api/comments/${commentId}/report` : `/api/stories/${storyId}/report`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Sonstiger Verstoß', description: 'Meldung über die Oberfläche.' })
    });

    if (response.ok) {
      setSent(true);
    }
  }

  return (
    <button type="button" className="button ghost" onClick={handleReport}>
      <Flag size={16} />
      {sent ? 'Gemeldet' : 'Geschichte melden'}
    </button>
  );
}
