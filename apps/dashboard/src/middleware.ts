import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Define the paths that require authentication
const protectedPaths = ["/customers", "/events", "/videos", "/income", "/paper-items", "/authors", "/images"];

export async function middleware(req: NextRequest) {
  const isProtected = protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Important: ceci n'est PAS une validation de sécurité, juste une redirection UX
  const cookie = getSessionCookie(req);
  if (!cookie) return NextResponse.redirect(new URL("/signin", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
