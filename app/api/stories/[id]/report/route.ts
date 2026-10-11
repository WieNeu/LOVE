import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const body = await request.json().catch(() => ({ reason: 'Sonstiger Verstoß', description: '' }));

  const story = await prisma.story.findUnique({ where: { id: params.id } });
  if (!story) {
    return NextResponse.json({ error: 'Geschichte nicht gefunden.' }, { status: 404 });
  }

  await prisma.report.create({
    data: {
      storyId: story.id,
      reporterUserId: user?.id || null,
      reason: String(body.reason || 'Sonstiger Verstoß'),
      description: String(body.description || ''),
      status: 'OPEN'
    }
  });

  return NextResponse.json({ ok: true });
}
