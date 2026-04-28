import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

const ADMIN_COOKIE = "admin_session";

// 不需驗證的路徑
const PUBLIC_PATHS = ["/admin/login", "/api/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const secret = process.env.ADMIN_PASSWORD;
  const isAuthed = token && secret ? await verifySessionToken(token, secret) : false;

  if (!isAuthed) {
    // API 路徑回傳 JSON 401，頁面路徑重導向登入頁
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // 透過自訂 header 將 pathname 傳給 Server Component layout
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
