'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

export function LikeButton({ storyId, initialCount }: { storyId: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);

  async function handleLike() {
    if (liked) return;

    const response = await fetch(`/api/stories/${storyId}/like`, {
      method: 'POST'
    });

    if (!response.ok) return;

    const data = await response.json();
    setLikeState(data.likesCount);
  }

  function setLikeState(nextCount: number) {
    setCount(nextCount);
    setLiked(true);
  }

  return (
    <button className="button ghost" onClick={handleLike} type="button">
      <Heart size={16} color={liked ? '#9f4f5d' : '#5c4a4d'} fill={liked ? '#f7dfe3' : 'none'} />
      {count}
    </button>
  );
}
