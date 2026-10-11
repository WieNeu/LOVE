import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

export async function getCategories() {
  return prisma.category.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
}

export async function getFeaturedStories(limit = 4) {
  return prisma.story.findMany({
    where: { moderationStatus: 'APPROVED', publishedAt: { not: null } },
    include: { category: true },
    orderBy: [{ publishedAt: 'desc' }, { likesCount: 'desc' }],
    take: limit
  });
}

export async function getPopularStories(limit = 5) {
  return prisma.story.findMany({
    where: { moderationStatus: 'APPROVED', publishedAt: { not: null } },
    include: { category: true },
    orderBy: [{ likesCount: 'desc' }, { commentsCount: 'desc' }, { viewsCount: 'desc' }],
    take: limit
  });
}

export async function getStoryById(id: string) {
  return prisma.story.findUnique({
    where: { id },
    include: {
      category: true,
      comments: {
        where: { moderationStatus: 'APPROVED' },
        orderBy: { createdAt: 'asc' }
      },
      likes: true
    }
  });
}

export async function incrementStoryView(id: string) {
  await prisma.story.update({
    where: { id },
    data: { viewsCount: { increment: 1 } }
  });
}

export async function getStories(params: {
  categoryId?: string;
  query?: string;
  sort?: 'newest' | 'popular' | 'most-viewed';
}) {
  const where: Prisma.StoryWhereInput = {
    moderationStatus: 'APPROVED',
    publishedAt: { not: null }
  };

  if (params.categoryId) {
    where.categoryId = params.categoryId;
  }

  if (params.query) {
    where.OR = [
      { title: { contains: params.query } },
      { content: { contains: params.query } },
      { anonymousName: { contains: params.query } },
      { category: { name: { contains: params.query } } }
    ];
  }

  let orderBy: Prisma.StoryOrderByWithRelationInput = { publishedAt: 'desc' };

  if (params.sort === 'popular') {
    orderBy = { likesCount: 'desc' };
  }

  if (params.sort === 'most-viewed') {
    orderBy = { viewsCount: 'desc' };
  }

  return prisma.story.findMany({
    where,
    include: { category: true },
    orderBy,
  });
}

export async function getRelatedStories(storyId: string, categoryId: string, limit = 3) {
  return prisma.story.findMany({
    where: {
      id: { not: storyId },
      categoryId,
      moderationStatus: 'APPROVED',
      publishedAt: { not: null }
    },
    include: { category: true },
    orderBy: [{ likesCount: 'desc' }, { publishedAt: 'desc' }],
    take: limit
  });
}

export async function getRandomStory() {
  const count = await prisma.story.count({
    where: { moderationStatus: 'APPROVED', publishedAt: { not: null } }
  });

  if (!count) return null;

  const skip = Math.floor(Math.random() * count);
  const story = await prisma.story.findMany({
    where: { moderationStatus: 'APPROVED', publishedAt: { not: null } },
    include: { category: true },
    skip,
    take: 1
  });

  return story[0] ?? null;
}

export async function getStats() {
  const [stories, comments, likes, users] = await Promise.all([
    prisma.story.count(),
    prisma.comment.count(),
    prisma.like.count(),
    prisma.user.count()
  ]);

  return {
    stories,
    comments,
    likes,
    users
  };
}
