import { auth } from "@/auth";
import { NextResponse } from "next/server";

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
