import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const existingSession = cookieStore.get('love_like_session')?.value || crypto.randomUUID();

  cookieStore.set('love_like_session', existingSession, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30
  });

  const story = await prisma.story.findUnique({ where: { id: params.id } });
  if (!story) {
    return NextResponse.json({ error: 'Geschichte nicht gefunden.' }, { status: 404 });
  }

  try {
    await prisma.like.create({
      data: {
        storyId: story.id,
        userSession: existingSession
      }
    });

    const updated = await prisma.story.update({
      where: { id: story.id },
      data: { likesCount: { increment: 1 } }
    });

    return NextResponse.json({ likesCount: updated.likesCount });
  } catch {
    const existingCount = await prisma.story.findUnique({
      where: { id: story.id },
      select: { likesCount: true }
    });

    return NextResponse.json({ likesCount: existingCount?.likesCount ?? story.likesCount });
  }
}
