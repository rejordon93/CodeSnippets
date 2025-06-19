// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes
const publicRoutes = ["/login", "/signup", "/"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  if (!token && !isPublic) {
    // Redirect to login if not authenticated and not on a public route
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
