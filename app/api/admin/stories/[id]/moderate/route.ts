import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const formData = await request.formData();
  const status = String(formData.get('status') || 'APPROVED');

  const story = await prisma.story.update({
    where: { id: params.id },
    data: {
      moderationStatus: status === 'APPROVED' ? 'APPROVED' : 'REJECTED',
      publishedAt: status === 'APPROVED' ? new Date() : null
    }
  });

  return NextResponse.redirect(new URL('/admin', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
