import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'development-secret-change-me');
const COOKIE_NAME = 'love_session';

export type SessionUser = {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({ id: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as SessionUser;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function clearSessionCookie() {
  cookies().set(COOKIE_NAME, '', { path: '/', expires: new Date(0) });
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: String(payload.id) },
    select: { id: true, email: true, role: true, status: true }
  });

  if (!user || user.status === 'BLOCKED') return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }
  return user;
}
