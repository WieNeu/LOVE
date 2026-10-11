import { redirect } from 'next/navigation';
import { getRandomStory } from '@/lib/data';

export default async function RandomStoryPage() {
  const story = await getRandomStory();

  if (!story) {
    redirect('/stories');
  }

  redirect(`/stories/${story.id}`);
}
