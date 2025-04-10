import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the paths that require authentication
const protectedPaths = ["/customers", "/events", "/videos", "/income"];

export async function middleware(req: NextRequest) {
  // Invalid authentication logic waiting implementation
  // const token = req.cookies.get("authToken");
  // const isProtectedPath = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));

  // If the user is not authenticated and trying to access a protected path
  // if (!token && isProtectedPath) {
  //   return NextResponse.redirect(new URL("/auth/signin", req.url));
  // }
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
