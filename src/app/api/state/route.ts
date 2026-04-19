import { put, list, del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, isAuthedCookieValid } from "@/lib/auth-shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BLOB_KEY = "gwanak-relocation/state.json";

async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return isAuthedCookieValid(jar.get(AUTH_COOKIE_NAME)?.value);
}

function unauthorized() {
  return NextResponse.json(
    { error: "인증이 필요합니다" },
    { status: 401, headers: noCacheHeaders() },
  );
}

type CloudState = {
  version: number;
  updatedAt: string;
  data: Record<string, unknown>;
};

function noCacheHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "CDN-Cache-Control": "no-store",
    "Vercel-CDN-Cache-Control": "no-store",
  };
}

async function findBlob() {
  const result = await list({ prefix: BLOB_KEY, limit: 10 });
  return result.blobs.find((b) => b.pathname === BLOB_KEY) ?? null;
}

async function getBlobState(): Promise<CloudState | null> {
  const blob = await findBlob();
  if (!blob) return null;
  const bust = Date.now();
  const res = await fetch(`${blob.url}?t=${bust}`, {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache" },
  });
  if (!res.ok) {
    console.error("[getBlobState] fetch blob failed", res.status, blob.url);
    return null;
  }
  return (await res.json()) as CloudState;
}

function emptyState(): CloudState {
  return { version: 0, updatedAt: new Date().toISOString(), data: {} };
}

export async function GET() {
  if (!(await isAuthed())) return unauthorized();
  try {
    const state = await getBlobState();
    return NextResponse.json(state ?? emptyState(), {
      headers: noCacheHeaders(),
    });
  } catch (err) {
    console.error("[GET /api/state]", err);
    return NextResponse.json(emptyState(), { headers: noCacheHeaders() });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthed())) return unauthorized();
  try {
    const body = (await request.json()) as { data?: Record<string, unknown> };
    const data = body.data ?? {};
    const current = await getBlobState();
    const next: CloudState = {
      data,
      version: (current?.version ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    };
    const existing = await findBlob();
    if (existing) {
      try {
        await del(existing.url);
      } catch (err) {
        console.error("[PUT /api/state] del failed", err);
      }
    }
    await put(BLOB_KEY, JSON.stringify(next), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
    return NextResponse.json(next, { headers: noCacheHeaders() });
  } catch (err) {
    console.error("[PUT /api/state]", err);
    return NextResponse.json(
      { error: "저장 실패", detail: String(err) },
      { status: 500, headers: noCacheHeaders() },
    );
  }
}
