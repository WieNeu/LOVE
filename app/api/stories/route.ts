import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { moderateText } from '@/lib/moderation';
import { createStorySchema } from '@/lib/validators';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createStorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Bitte prüfe deine Eingaben.' }, { status: 400 });
  }

  const user = await getCurrentUser();
  const moderation = moderateText({
    title: parsed.data.title,
    content: parsed.data.content,
    anonymousName: parsed.data.anonymousName
  });

  const story = await prisma.story.create({
    data: {
      authorUserId: user?.id || null,
      anonymousName: parsed.data.anonymousName,
      title: parsed.data.title,
      content: parsed.data.content,
      categoryId: parsed.data.categoryId,
      contentWarning: parsed.data.contentWarning || null,
      moderationStatus: moderation.isSafe ? 'APPROVED' : 'FLAGGED',
      publishedAt: moderation.isSafe ? new Date() : null,
      isDemo: false
    },
    include: { category: true }
  });

  return NextResponse.json({ story, moderation: moderation.reasons }, { status: 201 });
}
