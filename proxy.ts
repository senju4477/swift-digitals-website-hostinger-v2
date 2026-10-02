import { NextResponse, type NextRequest } from "next/server";
import { SITE_INDEXABLE, SITE_URL } from "@/lib/site";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const canonicalHost = new URL(SITE_URL).host.toLowerCase();
  const requestHost = (request.headers.get("host") ?? "").toLowerCase();
  if (!SITE_INDEXABLE || requestHost !== canonicalHost) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.svg|assets/).*)"] };
