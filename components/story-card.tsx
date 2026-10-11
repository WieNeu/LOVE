import Link from 'next/link';
import { MessageCircle, Heart } from 'lucide-react';
import type { Story, Category } from '@prisma/client';

export type StoryCardStory = Story & {
  category: Category;
};

function formatDate(date: Date | null) {
  if (!date) return 'Heute';
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

export function StoryCard({ story }: { story: StoryCardStory }) {
  return (
    <article className="story-card">
      {story.isDemo ? <span className="story-badge demo">Demo-Inhalt</span> : null}
      <div className="card-meta">
        <span className="author">von {story.anonymousName}</span>
        <span className="category-pill">{story.category.icon} {story.category.name}</span>
      </div>

      <Link href={`/stories/${story.id}`} className="story-title-link">
        <h3>{story.title}</h3>
      </Link>

      <p className="story-preview">{story.content.slice(0, 160)}{story.content.length > 160 ? '…' : ''}</p>

      <div className="card-footer">
        <span>{formatDate(story.publishedAt)}</span>
        <div className="meta-inline">
          <span><Heart size={14} />{story.likesCount}</span>
          <span><MessageCircle size={14} />{story.commentsCount}</span>
        </div>
      </div>
    </article>
  );
}
