import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.BETTER_AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  const isMissingLocale = routing.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  const pathWithoutLocale = isMissingLocale
    ? pathname
    : pathname.split("/").slice(2).join("/") === "" 
      ? "/" 
      : `/${pathname.split("/").slice(2).join("/")}`;

  if (pathWithoutLocale.startsWith("/dashboard")) {
    if (!token) {
      const locale = isMissingLocale ? routing.defaultLocale : pathname.split("/")[1];
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  if (pathWithoutLocale === "/login" || pathWithoutLocale.startsWith("/login")) {
    if (token) {
      const locale = isMissingLocale ? routing.defaultLocale : pathname.split("/")[1];
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
