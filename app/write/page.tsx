import Link from 'next/link';
import { StoryForm } from '@/components/story-form';
import { getCategories } from '@/lib/data';

export default async function WritePage() {
  const categories = await getCategories();

  return (
    <div className="form-layout">
      <div className="form-header panel">
        <h1>Erzähl uns deine Geschichte.</h1>
        <p>Schreib dir von der Seele, was dich beschäftigt. Du entscheidest selbst, wie viel du erzählen möchtest.</p>
      </div>

      <StoryForm categories={categories} />

      <div className="action-row" style={{ justifyContent: 'center' }}>
        <Link href="/stories" className="button ghost">Andere Geschichten lesen</Link>
      </div>
    </div>
  );
}
