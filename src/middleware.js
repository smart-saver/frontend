import { NextResponse } from 'next/server';

const protectedPaths = ['/dashboard'];

export function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const token = req.cookies.get('authorization');
    const loginPath = '/login'
    const loginUrl = new URL(loginPath, origin);
    loginUrl.searchParams.append('redirect', pathname);

    if (!token) {
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

// Specify the paths that should trigger this middleware
export const config = {
  matcher: ['/dashboard/:path*'],
};
