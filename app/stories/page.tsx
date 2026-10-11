import Link from 'next/link';
import { StoryCard } from '@/components/story-card';
import { getCategories, getStories } from '@/lib/data';

export default async function StoriesPage({
  searchParams
}: {
  searchParams?: { q?: string; category?: string; sort?: string };
}) {
  const categories = await getCategories();
  const stories = await getStories({
    query: searchParams?.q || '',
    categoryId: searchParams?.category || undefined,
    sort: (searchParams?.sort as 'newest' | 'popular' | 'most-viewed') || 'newest'
  });

  return (
    <div className="list-page">
      <div className="section-header">
        <h2>Alle Geschichten</h2>
      </div>

      <form className="filter-bar" method="get" action="/stories">
        <input className="search" type="text" name="q" defaultValue={searchParams?.q || ''} placeholder="Suche nach Trennung, Ex, Liebe, Dating…" />

        <select name="category" defaultValue={searchParams?.category || ''}>
          <option value="">Alle Kategorien</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>

        <select name="sort" defaultValue={searchParams?.sort || 'newest'}>
          <option value="newest">Neueste</option>
          <option value="popular">Beliebteste</option>
          <option value="most-viewed">Meistgelesene</option>
        </select>

        <button type="submit" className="button primary small">Suchen</button>
      </form>

      {stories.length === 0 ? (
        <div className="empty-state">
          <h3>Wir haben keine Geschichte gefunden, die dazu passt.</h3>
          <p className="muted">Vielleicht ist deine Geschichte die erste, die genau hier dazugehört.</p>
          <Link href="/write" className="button primary">Meine Geschichte erzählen</Link>
        </div>
      ) : (
        <div className="grid grid-three">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}
