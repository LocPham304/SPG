import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { isAppLocale, routing } from "@/i18n/routing";
import { isPublicNewsCategorySlug } from "@/types/public-news";

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const [, firstSegment, secondSegment, thirdSegment, ...remainingSegments] =
    request.nextUrl.pathname.split("/");

  if (
    isAppLocale(firstSegment) &&
    secondSegment === "news" &&
    thirdSegment &&
    isPublicNewsCategorySlug(thirdSegment) &&
    remainingSegments.every((segment) => segment === "") &&
    request.nextUrl.searchParams.get("page") === "1"
  ) {
    const normalizedUrl = request.nextUrl.clone();
    normalizedUrl.searchParams.delete("page");
    return NextResponse.redirect(normalizedUrl, 308);
  }

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
