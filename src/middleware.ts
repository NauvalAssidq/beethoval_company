import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function getGeoLocale(request: NextRequest): "id" | "en" | null {
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry");

  if (!country) return null;
  return country.toUpperCase() === "ID" ? "id" : "en";
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isMissingLocale = routing.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
  const hasSavedLocale =
    localeCookie !== undefined &&
    routing.locales.includes(localeCookie as (typeof routing.locales)[number]);

  const geoLocale = getGeoLocale(request);
  const preferredLocale = hasSavedLocale
    ? localeCookie
    : geoLocale ?? routing.defaultLocale;

  const pathWithoutLocale = isMissingLocale
    ? pathname
    : pathname.split("/").slice(2).join("/") === "" 
      ? "/" 
      : `/${pathname.split("/").slice(2).join("/")}`;

  if (pathWithoutLocale.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || process.env.BETTER_AUTH_SECRET,
    });
    if (!token) {
      const locale = isMissingLocale ? preferredLocale : pathname.split("/")[1];
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  if (pathWithoutLocale === "/login" || pathWithoutLocale.startsWith("/login")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || process.env.BETTER_AUTH_SECRET,
    });
    if (token) {
      const locale = isMissingLocale ? preferredLocale : pathname.split("/")[1];
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
  }

  if (isMissingLocale) {
    const targetLocale = preferredLocale;
    const targetUrl = new URL(`/${targetLocale}${pathname === "/" ? "" : pathname}${search}`, request.url);
    return NextResponse.redirect(targetUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
