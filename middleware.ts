import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
 

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/guru") && token.role !== "GURU") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/siswa") && token.role !== "SISWA") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/guru/:path*", "/siswa/:path*"],
};
