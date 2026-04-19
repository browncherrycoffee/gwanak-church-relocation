import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_VALUE,
  getDashboardPassword,
  isAuthedCookieValid,
} from "@/lib/auth-shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_AGE = 60 * 60 * 24 * 30;

function noCacheHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "CDN-Cache-Control": "no-store",
    "Vercel-CDN-Cache-Control": "no-store",
  };
}

export async function GET() {
  const jar = await cookies();
  const c = jar.get(AUTH_COOKIE_NAME);
  return NextResponse.json(
    { authed: isAuthedCookieValid(c?.value) },
    { headers: noCacheHeaders() },
  );
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    password?: string;
  };
  if (!body.password || body.password !== getDashboardPassword()) {
    return NextResponse.json(
      { error: "비밀번호가 일치하지 않습니다" },
      { status: 401, headers: noCacheHeaders() },
    );
  }
  const jar = await cookies();
  jar.set({
    name: AUTH_COOKIE_NAME,
    value: AUTH_COOKIE_VALUE,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return NextResponse.json({ ok: true }, { headers: noCacheHeaders() });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE_NAME);
  return NextResponse.json({ ok: true }, { headers: noCacheHeaders() });
}
