import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;

  // Define the public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/";

  // Get the user cookie and auth token
  const userCookie = request.cookies.get("user")?.value;
  const authToken = request.cookies.get("authToken")?.value;
  
  // Check if user is authenticated (both cookie and token must exist)
  const isAuthenticated = userCookie && authToken;
  
  // If the path is public and the user is logged in, redirect to dashboard
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the path is protected and the user is not logged in, redirect to login
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Otherwise, continue with the request
  return NextResponse.next();
}

// Define the routes that should be protected by the middleware
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/"],
};
