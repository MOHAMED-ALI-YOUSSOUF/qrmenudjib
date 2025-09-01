import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Si l'utilisateur n'est pas connecté
  if (!token) {
    if (pathname.startsWith("/dashboard")) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.url)
      );
    }
    return NextResponse.next(); // accès libre aux autres pages
  }

  // Si l'utilisateur est connecté et tente d'aller sur signin/signup
  if (pathname === "/auth/signin" || pathname === "/auth/signup") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Sinon, laisser passer
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/signin", "/auth/signup"],
};
