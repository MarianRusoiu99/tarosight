import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_CONFIG } from '@/src/infrastructure/config/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page, API routes, and static assets
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Check for auth cookie using standardized config
  const token = request.cookies.get(AUTH_CONFIG.cookieName);
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply middleware to the main homepage and tarot pages
export const config = {
  matcher: ["/", "/tarot/:path*"],
}; 