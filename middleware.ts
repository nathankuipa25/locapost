import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";

// Deliberately built from the edge-safe authConfig (no Prisma adapter)
// instead of importing the full "@/auth". Middleware runs in the Edge
// Runtime, which can't load the Prisma client's Node.js-only modules.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
});

export const config = {
  // Only guard routes that require a signed-in owner. /article/[id] is
  // intentionally left public — that's the shareable link anyone can view.
  matcher: ["/dashboard/:path*", "/create/:path*", "/edit/:path*"],
};
