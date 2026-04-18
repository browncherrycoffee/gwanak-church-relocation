"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useProperties } from "@/lib/stores";
import { uid } from "@/lib/utils";

const DEFAULT_DUE_DILIGENCE = [
  { label: "등기부등본 (근저당·가압류·소유권 이력)", category: "서류" },
  { label: "건축물대장 (용도·위반건축물 여부)", category: "서류" },
  { label: "용도지역 및 종교시설 허용 여부", category: "서류" },
  { label: "소방·피난 시설 (2방향 비상계단, 스프링클러, 유도등)", category: "안전" },
  { label: "주차 대수 (법정 기준 대비 확보량)", category: "인프라" },
  { label: "아래층 업종 (소음·진동·영업시간 충돌)", category: "환경" },
  { label: "건물 구조 안전 (찬양·집회 진동 하중)", category: "건축" },
  { label: "냉난방 용량 적정성", category: "설비" },
  { label: "전기 용량 및 승압 필요 여부", category: "설비" },
  { label: "엘리베이터 준공연도·정밀안전검사·교체주기", category: "설비" },
  { label: "누수·결로·단열·외벽 상태", category: "건축" },
  { label: "기물 인수 품목·감정가·조건", category: "계약" },
  { label: "이전 사용자 이전 배경 교차 확인", category: "확인" },
  { label: "대중교통 접근성 (지하철·버스 도보 시간)", category: "위치" },
];

export default function NewPropertyPage() {
  const router = useRouter();
  const { upsert } = useProperties();
  const created = useRef(false);

  useEffect(() => {
    if (created.current) return;
    created.current = true;
    const id = `property-${uid()}`;
    const now = new Date().toISOString();
    upsert({
      id,
      name: "새 매물",
      address: "",
      district: "",
      price: 0,
      sizePyeong: 0,
      floor: "",
      elevator: false,
      parking: "",
      useType: "",
      previousTenant: "",
      fixtures: "",
      pros: "",
      cons: "",
      status: "initial",
      contact: "",
      link: "",
      dueDiligence: DEFAULT_DUE_DILIGENCE.map((d, i) => ({
        id: `dd-${uid()}-${i}`,
        label: d.label,
        category: d.category,
        status: "pending",
        note: "",
      })),
      visits: [],
      photos: [],
      financingNotes: "",
      createdAt: now,
      updatedAt: now,
    });
    router.replace(`/properties/${id}`);
  }, [router, upsert]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
      새 매물을 생성 중입니다...
    </div>
  );
}
