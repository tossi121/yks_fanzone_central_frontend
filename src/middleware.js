// import { NextResponse } from 'next/server';

// export function middleware(request) {
//   const path = request.nextUrl.pathname;

//   const publicPath = path === '/login';
//   const token = request.cookies.get('yks_fanzone_central_token')?.value || '';
//   const tokenPermissions = request.cookies.get('yks_fanzone_central_permissions')?.value || '';
//   console.log(tokenPermissions === 'manage_press_release');

//   if (publicPath && token) {
//     return NextResponse.redirect(new URL('/', request.nextUrl));
//   }

//   if (!publicPath && !token) {
//     return NextResponse.redirect(new URL('/login', request.nextUrl));
//   }
// }

// export const config = {
//   matcher: ['/', '/press-release/:path*', '/gallery/:path*', '/player-profile/:path*', '/user-access/:path*', '/login'],
// };

import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const publicPath = path === '/login';
  const token = request.cookies.get('yks_fanzone_central_permissions')?.value || '';

  if (publicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (!publicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (token === 'manage_press_release') {
    if (request.nextUrl.pathname.startsWith('/gallery')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (token === 'COACH' || token === 'PLAYER') {
    if (request.nextUrl.pathname.startsWith('/super-admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
}

export const config = {
  matcher: ['/', '/press-release/:path*', '/gallery/:path*', '/player-profile/:path*', '/user-access/:path*', '/login'],
};
