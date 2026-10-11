import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const body = await request.json().catch(() => ({ reason: 'Sonstiger Verstoß', description: '' }));

  const comment = await prisma.comment.findUnique({ where: { id: params.id } });
  if (!comment) {
    return NextResponse.json({ error: 'Kommentar nicht gefunden.' }, { status: 404 });
  }

  await prisma.report.create({
    data: {
      commentId: comment.id,
      reporterUserId: user?.id || null,
      reason: String(body.reason || 'Sonstiger Verstoß'),
      description: String(body.description || ''),
      status: 'OPEN'
    }
  });

  return NextResponse.json({ ok: true });
}
