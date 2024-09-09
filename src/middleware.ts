import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If trying to access the sign-in page, redirect to dashboard
  if (request.nextUrl.pathname.startsWith('/auth/signin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // For all other routes, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/signin', '/dashboard/:path*'],
};