import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('love_session')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const valid = await verifySessionToken(token);
  if (!valid || valid.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
