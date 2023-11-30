import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const publicPath = path === '/login';
  const tokenKey = request.cookies.get('yks_fanzone_central_permissions')?.value || '';
  const token = tokenKey;

  if (publicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (!publicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (token === 'manage_press_release') {
    if (request.nextUrl.pathname.startsWith('/gallery')) {
      return NextResponse.redirect(new URL('/press-release', request.url));
    }
  }
  if (token === 'manage_press_release') {
    if (request.nextUrl.pathname.startsWith('/player-profile')) {
      return NextResponse.redirect(new URL('/press-release', request.url));
    }
  }
  if (token === 'manage_press_release') {
    if (request.nextUrl.pathname.startsWith('/user-access')) {
      return NextResponse.redirect(new URL('/press-release', request.url));
    }
  }
  if (token === 'create_user') {
    if (request.nextUrl.pathname.startsWith('/gallery')) {
      return NextResponse.redirect(new URL('/user-access', request.url));
    }
  }
  if (token === 'create_user') {
    if (request.nextUrl.pathname.startsWith('/press-release')) {
      return NextResponse.redirect(new URL('/user-access', request.url));
    }
  }
  if (token === 'create_user') {
    if (request.nextUrl.pathname.startsWith('/player-profile')) {
      return NextResponse.redirect(new URL('/user-access', request.url));
    }
  }
  if (token === 'manage_gallery') {
    if (request.nextUrl.pathname.startsWith('/player-profile')) {
      return NextResponse.redirect(new URL('/gallery', request.url));
    }
  }
  if (token === 'manage_gallery') {
    if (request.nextUrl.pathname.startsWith('/press-release')) {
      return NextResponse.redirect(new URL('/gallery', request.url));
    }
  }
  if (token === 'manage_gallery') {
    if (request.nextUrl.pathname.startsWith('/user-access')) {
      return NextResponse.redirect(new URL('/gallery', request.url));
    }
  }
  if (token === 'manage_player_profile') {
    if (request.nextUrl.pathname.startsWith('/gallery')) {
      return NextResponse.redirect(new URL('/player-profile', request.url));
    }
  }
  if (token === 'manage_player_profile') {
    if (request.nextUrl.pathname.startsWith('/press-release')) {
      return NextResponse.redirect(new URL('/player-profile', request.url));
    }
  }
  if (token === 'manage_player_profile') {
    if (request.nextUrl.pathname.startsWith('/user-access')) {
      return NextResponse.redirect(new URL('/player-profile', request.url));
    }
  }
}

export const config = {
  matcher: ['/', '/press-release/:path*', '/gallery/:path*', '/player-profile/:path*', '/user-access/:path*', '/login'],
};
