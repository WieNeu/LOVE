import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validators';
import { createSessionToken, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungültige Eingaben.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email }
  });

  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: 'Login fehlgeschlagen.' }, { status: 401 });
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Login fehlgeschlagen.' }, { status: 401 });
  }

  const token = await createSessionToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  await setSessionCookie(token);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      publicName: user.publicName,
      role: user.role
    }
  });
}
