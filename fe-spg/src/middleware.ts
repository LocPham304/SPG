import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { isAppLocale, routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const firstSegment = request.nextUrl.pathname.split("/")[1];

  if (firstSegment === "admin") {
    return NextResponse.next();
  }

  if (firstSegment && !isAppLocale(firstSegment)) {
    return NextResponse.next();
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
