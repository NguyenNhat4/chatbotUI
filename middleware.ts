import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // Function that will be executed on protected routes
  function middleware(req) {
    // You can add additional logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      // Only run this middleware on the dashboard route
      authorized({ req, token }) {
        // If there's a token, the user is authenticated
        return !!token;
      },
    },
  }
);

// Define the routes that should be protected by the middleware
export const config = {
  matcher: ["/dashboard/:path*"],
};
