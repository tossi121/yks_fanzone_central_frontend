import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const publicPath = path === '/login';
  const token = request.cookies.get('yks_fanzone_central_token')?.value || '';

  if (publicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (!publicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
}

export const config = {
  matcher: [
    '/',
    '/press-release/:path*',
    '/gallery/:path*',
    '/player-profile/:path*',
    '/user-access/:path*',
    '/video-tagging/:path*',
    '/photo-tagging/:path*',
    '/articles/:path*',
    '/login',
  ],
};
