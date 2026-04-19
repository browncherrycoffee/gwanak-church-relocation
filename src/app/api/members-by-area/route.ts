import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import postgres from "postgres";
import { AUTH_COOKIE_NAME, isAuthedCookieValid } from "@/lib/auth-shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SEOUL_GU = [
  "강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구",
  "동대문구","동작구","마포구","서대문구","서초구","성동구","성북구","송파구","양천구",
  "영등포구","용산구","은평구","종로구","중구","중랑구",
];

const GG_SI = [
  "과천시","광명시","군포시","고양시","구리시","김포시","남양주시","부천시","성남시","수원시",
  "시흥시","안산시","안양시","양주시","용인시","의왕시","의정부시","파주시","하남시","화성시",
];

type Row = { name: string; address: string | null };

let client: ReturnType<typeof postgres> | null = null;
function getClient() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL not set");
    client = postgres(url, { max: 1, idle_timeout: 20 });
  }
  return client;
}

function noCacheHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "CDN-Cache-Control": "no-store",
    "Vercel-CDN-Cache-Control": "no-store",
  };
}

async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return isAuthedCookieValid(jar.get(AUTH_COOKIE_NAME)?.value);
}

export async function GET(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json(
      { error: "인증이 필요합니다" },
      { status: 401, headers: noCacheHeaders() },
    );
  }
  const { searchParams } = new URL(request.url);
  const area = (searchParams.get("area") ?? "").trim();
  if (!area) {
    return NextResponse.json(
      { error: "area 파라미터가 필요합니다" },
      { status: 400, headers: noCacheHeaders() },
    );
  }

  try {
    const sql = getClient();
    let rows: Row[] = [];

    if (area === "주소 미입력") {
      rows = (await sql`
        SELECT name, address
        FROM members
        WHERE member_status != '제적'
          AND (address IS NULL OR trim(address) = '')
        ORDER BY name
      `) as unknown as Row[];
    } else if (area === "타 지역 / 미확인") {
      const knownList = [...SEOUL_GU, ...GG_SI];
      rows = (await sql`
        SELECT name, address
        FROM members
        WHERE member_status != '제적'
          AND address IS NOT NULL
          AND trim(address) != ''
          AND NOT (address ILIKE ANY (${knownList.map((w) => `%${w}%`)}))
        ORDER BY name
      `) as unknown as Row[];
    } else if ([...SEOUL_GU, ...GG_SI].includes(area)) {
      const pattern = `%${area}%`;
      rows = (await sql`
        SELECT name, address
        FROM members
        WHERE member_status != '제적'
          AND address ILIKE ${pattern}
        ORDER BY name
      `) as unknown as Row[];
    } else {
      return NextResponse.json(
        { area, members: [] },
        { headers: noCacheHeaders() },
      );
    }

    return NextResponse.json(
      {
        area,
        members: rows.map((r) => ({
          name: r.name,
          address: r.address ?? "",
        })),
      },
      { headers: noCacheHeaders() },
    );
  } catch (err) {
    console.error("[GET /api/members-by-area]", err);
    return NextResponse.json(
      { error: "조회 실패", detail: String(err) },
      { status: 500, headers: noCacheHeaders() },
    );
  }
}
