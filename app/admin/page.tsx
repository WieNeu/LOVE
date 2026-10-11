import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function AdminPage() {
  await requireAdmin();

  const [storyStats, flaggedStories, reports, categories] = await Promise.all([
    prisma.story.groupBy({
      by: ['moderationStatus'],
      _count: { _all: true }
    }),
    prisma.story.findMany({
      where: { moderationStatus: { in: ['PENDING', 'FLAGGED'] } },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.report.findMany({
      where: { status: 'OPEN' },
      include: { story: true, comment: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ]);

  const totalStories = storyStats.reduce((sum, item) => sum + item._count._all, 0);

  return (
    <div className="list-page">
      <div className="section-header">
        <h2>Admin-Dashboard</h2>
      </div>

      <div className="grid grid-four">
        <div className="story-card">
          <div className="muted">Gesamt</div>
          <h3>{totalStories}</h3>
        </div>
        <div className="story-card">
          <div className="muted">Neu</div>
          <h3>{storyStats.find((entry) => entry.moderationStatus === 'PENDING')?._count._all ?? 0}</h3>
        </div>
        <div className="story-card">
          <div className="muted">Gemeldet</div>
          <h3>{reports.length}</h3>
        </div>
        <div className="story-card">
          <div className="muted">Kategorien</div>
          <h3>{categories.length}</h3>
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <div className="section-header">
          <h3>Moderationswarteschlange</h3>
        </div>
        {flaggedStories.length === 0 ? (
          <div className="empty-state">
            <h3>Keine Einträge zur Moderation.</h3>
          </div>
        ) : (
          <div className="comment-list">
            {flaggedStories.map((story) => (
              <div className="comment-item" key={story.id}>
                <div className="card-meta">
                  <strong>{story.title}</strong>
                  <span className="category-pill">{story.moderationStatus}</span>
                </div>
                <p className="muted">von {story.anonymousName} · {story.category.name}</p>
                <div className="action-row">
                  <Link href={`/stories/${story.id}`} className="button ghost">Ansehen</Link>
                  <form action={`/api/admin/stories/${story.id}/moderate`} method="POST" style={{ display: 'inline-flex' }}>
                    <input type="hidden" name="status" value="APPROVED" />
                    <button type="submit" className="button primary small">Freigeben</button>
                  </form>
                  <form action={`/api/admin/stories/${story.id}/moderate`} method="POST" style={{ display: 'inline-flex' }}>
                    <input type="hidden" name="status" value="REJECTED" />
                    <button type="submit" className="button ghost small">Zurückhalten</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 28 }}>
        <div className="section-header">
          <h3>Offene Meldungen</h3>
        </div>
        <div className="comment-list">
          {reports.map((report) => (
            <div className="comment-item" key={report.id}>
              <strong>{report.reason}</strong>
              <p className="muted">{report.description || 'Keine Beschreibung'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
