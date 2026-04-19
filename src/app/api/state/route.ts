import { put, head, del } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BLOB_KEY = "gwanak-relocation/state.json";

type CloudState = {
  version: number;
  updatedAt: string;
  data: Record<string, unknown>;
};

async function getBlobState(): Promise<CloudState | null> {
  try {
    const info = await head(BLOB_KEY);
    if (!info) return null;
    const res = await fetch(info.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as CloudState;
  } catch {
    return null;
  }
}

function emptyState(): CloudState {
  return { version: 0, updatedAt: new Date().toISOString(), data: {} };
}

export async function GET() {
  try {
    const state = await getBlobState();
    return NextResponse.json(state ?? emptyState());
  } catch (err) {
    console.error("[GET /api/state]", err);
    return NextResponse.json(emptyState());
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { data?: Record<string, unknown> };
    const data = body.data ?? {};
    const current = await getBlobState();
    const next: CloudState = {
      data,
      version: (current?.version ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    };
    try {
      const existing = await head(BLOB_KEY);
      if (existing) await del(existing.url);
    } catch {
      // ignore
    }
    await put(BLOB_KEY, JSON.stringify(next), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return NextResponse.json(next);
  } catch (err) {
    console.error("[PUT /api/state]", err);
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}
