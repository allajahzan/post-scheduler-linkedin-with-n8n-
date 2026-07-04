import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Protect /posts, /profile, and /notifications routes
  if (
    request.nextUrl.pathname.startsWith("/posts") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/notifications")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Verify token
      await jwtVerify(token, SECRET_KEY);
      return NextResponse.next();
    } catch (error) {
      // Invalid token
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token"); // clear invalid token
      return response;
    }
  }

  // Optional: Prevent logged in users from accessing login
  if (request.nextUrl.pathname === "/login") {
    if (token) {
      try {
        await jwtVerify(token, SECRET_KEY);
        return NextResponse.redirect(new URL("/posts", request.url));
      } catch (error) {
        // Token is invalid, let them proceed to login
      }
    }
  }

  // Handle root URL (/) redirect
  if (request.nextUrl.pathname === "/") {
    if (token) {
      try {
        await jwtVerify(token, SECRET_KEY);
        return NextResponse.redirect(new URL("/posts", request.url));
      } catch (error) {
        // Token invalid, clear it and go to login
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
      }
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/posts/:path*",
    "/profile/:path*",
    "/notifications/:path*",
    "/login",
  ],
};
