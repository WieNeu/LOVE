import { NextResponse } from 'next/server';
import { commentSchema } from '@/lib/validators';
import { prisma } from '@/lib/db';
import { moderateText } from '@/lib/moderation';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const parsed = commentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Kommentar ist ungültig.' }, { status: 400 });
  }

  const story = await prisma.story.findUnique({ where: { id: params.id } });
  if (!story) {
    return NextResponse.json({ error: 'Geschichte nicht gefunden.' }, { status: 404 });
  }

  const moderation = moderateText({
    title: story.title,
    content: parsed.data.content,
    anonymousName: parsed.data.anonymousName
  });

  const comment = await prisma.comment.create({
    data: {
      storyId: story.id,
      anonymousName: parsed.data.anonymousName,
      content: parsed.data.content,
      moderationStatus: moderation.isSafe ? 'APPROVED' : 'FLAGGED'
    }
  });

  await prisma.story.update({
    where: { id: story.id },
    data: { commentsCount: { increment: 1 } }
  });

  return NextResponse.json({ comment }, { status: 201 });
}
