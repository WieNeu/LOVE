import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, Heart, MessageCircle, ShieldAlert } from 'lucide-react';
import { CommentSection } from '@/components/comment-section';
import { LikeButton } from '@/components/like-button';
import { ReportButton } from '@/components/report-button';
import { getRelatedStories, getStoryById, incrementStoryView } from '@/lib/data';

export default async function StoryDetailPage({ params }: { params: { id: string } }) {
  const story = await getStoryById(params.id);

  if (!story) {
    notFound();
  }

  if (story.moderationStatus !== 'APPROVED') {
    notFound();
  }

  await incrementStoryView(story.id);

  const related = await getRelatedStories(story.id, story.categoryId, 3);

  return (
    <div className="article-shell">
      <div className="story-header">
        <Link href="/stories" className="muted"><ArrowLeft size={16} /> Alle Geschichten</Link>
        <div className="kicker">{story.category.icon} {story.category.name}</div>
        <h1>{story.title}</h1>
        <div className="story-meta">
          <span>von {story.anonymousName}</span>
          <span>•</span>
          <span><CalendarDays size={14} /> {new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }).format(story.publishedAt ?? story.createdAt)}</span>
        </div>
      </div>

      <article className="story-text">
        {story.content.split('\n').map((paragraph, index) => (
          <p key={`${story.id}-${index}`}>{paragraph}</p>
        ))}
      </article>

      <div className="action-row">
        <LikeButton storyId={story.id} initialCount={story.likesCount} />
        <button type="button" className="button ghost">
          <MessageCircle size={16} />
          Kommentieren
        </button>
        <ReportButton storyId={story.id} />
      </div>

      <CommentSection
        storyId={story.id}
        initialComments={story.comments.map((comment) => ({
          id: comment.id,
          anonymousName: comment.anonymousName,
          content: comment.content,
          createdAt: comment.createdAt
        }))}
      />

      {related.length > 0 ? (
        <div style={{ marginTop: 28 }}>
          <div className="section-header">
            <h2>Vielleicht gefällt dir auch</h2>
          </div>
          <div className="grid grid-three">
            {related.map((relatedStory) => (
              <Link key={relatedStory.id} href={`/stories/${relatedStory.id}`} className="story-card">
                <div className="card-meta">
                  <span className="author">von {relatedStory.anonymousName}</span>
                  <span className="category-pill">{relatedStory.category.icon} {relatedStory.category.name}</span>
                </div>
                <h3>{relatedStory.title}</h3>
                <p className="story-preview">{relatedStory.content.slice(0, 110)}…</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
