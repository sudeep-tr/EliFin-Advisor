import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/expenses", "/portfolio", "/goals", "/risk-assessment", "/coach", "/onboarding"];

export function middleware(req: NextRequest) {
  const hasToken = req.cookies.has("token");
  const isProtected = PROTECTED.some((path) => req.nextUrl.pathname.startsWith(path));

  if (isProtected && !hasToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/expenses/:path*", "/portfolio/:path*", "/goals/:path*", "/risk-assessment/:path*", "/coach/:path*", "/onboarding/:path*"],
};
