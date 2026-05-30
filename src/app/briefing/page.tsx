"use client";

import {
  Buildings,
  ChatCircleText,
  CheckSquare,
  Coin,
  Compass,
  ListChecks,
  Target,
  UsersThree,
  Warning,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Urgency = "high" | "mid" | "low";

const urgencyBadge: Record<
  Urgency,
  { label: string; variant: "destructive" | "secondary" | "outline" }
> = {
  high: { label: "높음", variant: "destructive" },
  mid: { label: "중간", variant: "secondary" },
  low: { label: "낮음", variant: "outline" },
};

// ── 1. 이전의 당위성 ───────────────────────────────────────────
const RATIONALE: { no: number; title: string; detail: string; urgency: Urgency }[] = [
  {
    no: 1,
    title: "건물 매매 상태",
    detail:
      "현 예배당을 포함한 상가 건물 전체가 매매로 나온 상태. 새 건물주가 올 경우 임대 조건이 급변할 수 있음",
    urgency: "high",
  },
  {
    no: 2,
    title: "퇴거 특약 존재",
    detail:
      "임대차계약서 특약에 ‘재건축 시 바로 퇴거’ 조항 — 건물주 의사에 따라 즉시 나가야 할 수 있음",
    urgency: "high",
  },
  {
    no: 3,
    title: "계약 불안정성",
    detail:
      "최초 10년 임대 기간 만료 후 추가 연장 중. 3년 후 재계약 여부 자체가 불확실 — 능동적으로 움직일 수 있는 시간이 한정적",
    urgency: "high",
  },
  {
    no: 4,
    title: "공간 부족",
    detail:
      "실제 예배 공간 40~45평에 출석 100~120명 — 인원 대비 협소. 유아실·교육관·식당 등 분리 어려움",
    urgency: "mid",
  },
  {
    no: 5,
    title: "엘리베이터 없음",
    detail: "연로/장애 성도의 예배 참여 어려움. 건물 노후화로 안전 우려",
    urgency: "mid",
  },
  {
    no: 6,
    title: "주차 갈등",
    detail:
      "건물 주차 불가로 별도 주차비 지출(월 50~80만원) + 건물주·방문자와 마찰",
    urgency: "low",
  },
];

// ── 2. 재정 구조 비교 ──────────────────────────────────────────
const COST_COMPARE: {
  item: string;
  current: string;
  after: string;
  delta: string;
  deltaTone: "up" | "down" | "neutral";
}[] = [
  { item: "임대료 / 대출이자", current: "200만원", after: "350만원 (이자 6%)", delta: "+150만원", deltaTone: "up" },
  { item: "타 교회 상환", current: "—", after: "30~50만원", delta: "+30~50만원", deltaTone: "up" },
  { item: "주차비", current: "50~80만원", after: "약 20만원 (1/4 수준)", delta: "-30~60만원", deltaTone: "down" },
  { item: "관리비·전기·수도", current: "40~200만원", after: "100만원+ (확인 필요)", delta: "확인 중", deltaTone: "neutral" },
  { item: "합계", current: "290~480만원", after: "500~530만원+", delta: "+최소 150만원", deltaTone: "up" },
];

const SAVING_POINTS: { item: string; ratio: string; note: string }[] = [
  { item: "목회비(인건비)", ratio: "55~60%", note: "사역자 생활과 직결되어 줄이기 어려움. 복리후생·연수비 등 부대 항목이 있다면 소폭 조정 가능 여부 확인" },
  { item: "선교비", ratio: "10~15%", note: "교회 사명에 반하므로 신중. 다만 일시적으로 동결(인상분 유예)하는 정도는 논의 가능" },
  { item: "교육/기관비", ratio: "5~10%", note: "프로그램 효율화·교재 공동구매 등으로 소폭 절감 가능. 다만 교육 축소는 다음세대에 악영향" },
  { item: "행사/친교비", ratio: "3~5%", note: "수련회·체육대회 등 행사 횟수·규모를 조정하면 절감 여지" },
  { item: "기타 운영비", ratio: "5~10%", note: "사무용품·인쇄비·통신비 등 항목별 점검으로 연간 수십만~100만원 절감 가능" },
  { item: "주차비 절감", ratio: "—", note: "이전 자체로 월 30~60만원 절감 (가장 확실한 절감 항목)" },
  { item: "공간 대관 수입(신규)", ratio: "—", note: "주중 미사용 시간 대관 시 월 20~50만원 수입 기대 가능 (이지원 집사님 제안)" },
];

// ── 3. 자금 조달 시나리오 ──────────────────────────────────────
const TOTAL_COST: { item: string; amount: string; note: string }[] = [
  { item: "매수가", amount: "12억원", note: "에벤에셀프라자 6층 137평" },
  { item: "취득세", amount: "6,440만원", note: "종교단체 면제 가능성 확인 중" },
  { item: "부동산 수수료", amount: "1,400만원", note: "VAT 포함" },
  { item: "기타(이사비 등)", amount: "500만원", note: "" },
];

const PLAN_A: { source: string; amount: string; cond: string }[] = [
  { source: "자본금 (교회 적립금/보증금)", amount: "2억", cond: "보증금 회수 가정 — 시점 확인 필요" },
  { source: "성도 연보 (특별헌금)", amount: "1억", cond: "자발적 서약제" },
  { source: "은행 대출 (60%)", amount: "7.2억", cond: "이자 6%, 월 350만원" },
  { source: "타 교회 차입", amount: "2억", cond: "현 예배당 세입자 유치 시 차입 축소" },
];

const PLAN_C_OPTIONS = [
  "대출 비중 75% 이상 → 은행 심사 자체가 통과 안 될 수 있음. 이 경우 매입 자체 재검토",
  "매입 대신 장기 임차(전세/월세)로 전환 검토 — 축복교회 혹은 다른 매물",
  "매입 시점을 6개월~1년 연기하고, 그 사이 적립금 확보 + 연보 모금",
  "현 예배당 유지하면서 다른 매물 탐색 계속 (더 저렴한 물건이 나올 수 있음)",
];

const PRECHECK: { no: number; item: string; state: string; tone: Urgency; next: string }[] = [
  { no: 1, item: "자본금 2억의 정확한 출처", state: "미명시", tone: "high", next: "적립금/보증금/기타 구분. 보증금이면 회수 시점 확인" },
  { no: 2, item: "타 교회 차입 비공식 타진 결과", state: "고려 중", tone: "high", next: "1~2곳이라도 의향 확인. 이자/상환 조건 가안" },
  { no: 3, item: "은행 대출 사전 상담", state: "미착수", tone: "high", next: "종교단체 상가 대출 가능 은행 1~2곳 사전 상담. 예상 금리·한도 확인" },
  { no: 4, item: "취득세 면제 가능성", state: "확인 중", tone: "mid", next: "세무사 자문으로 확정. 면제 시 6,440만원 절감 → 자금 압박 크게 완화" },
  { no: 5, item: "현 보증금 반환 시점", state: "미확인", tone: "mid", next: "현 건물주와 퇴거·보증금 반환 일정 조율 필요" },
  { no: 6, item: "축복교회 관리비 월별 상세", state: "요청 중", tone: "mid", next: "이지원 집사님이 요청해 놓은 상태. 2차 설명회 전 확보 필수" },
];

// ── 5. 의견 수렴 절차 ──────────────────────────────────────────
const PROCESS: { period: string; activity: string; how: string; can: string }[] = [
  { period: "5/31", activity: "1차 설명회 (오늘)", how: "위원회 활동 보고. 현장 질의응답. 서면 의견서 배부", can: "확정" },
  { period: "6/1~6/7", activity: "전도회별 소모임 논의", how: "각 전도회 회장(위원)이 모임에서 안건 공유 → 질문/염려/찬반 의견 수렴 → 위원회에 전달", can: "요청 필요" },
  { period: "6/1~6/10", activity: "익명 온라인 의견 수렴", how: "구글 폼 등으로 ‘찬성/반대/보류’ + 자유 의견. 발언이 어려운 성도도 참여 가능", can: "쉽게 가능" },
  { period: "6/7~6/10", activity: "개별 소통 (어르신/핵심 성도)", how: "목사님·장로님이 전화·방문으로 마음 챙기기. 불안한 분들 경청", can: "시간 투자" },
  { period: "6/14", activity: "2차 설명회", how: "1차 의견 반영, 자금상환계획 상세 보고, 추가 질의응답", can: "확정" },
  { period: "6/14~", activity: "임시 당회 → 공동의회 일정 공고", how: "최소 2주 전 공고. 공동의회는 7월 초 권장 (졸속 인상 방지)", can: "당회 결정" },
];

// ── 6. 성도 예상 Q&A ──────────────────────────────────────────
const QA_GROUPS: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "A. 재정 (가장 많은 질문 예상)",
    items: [
      { q: "자본금 2억은 어디서 나오는 돈인가요?", a: "출처를 명확히 (적립금/보증금/기타). ‘보증금 회수’라면 회수 시점과 현 건물주 동의 여부도 함께 설명." },
      { q: "타 교회 4억은 확정인가요? 안 되면?", a: "현재 상태 솔직히 공유. Plan B/C 시나리오로 대응. ‘확보 안 되면 무리하게 진행하지 않겠다’는 원칙 천명." },
      { q: "이자가 오르면? 원금은 언제 갚나요?", a: "5%/6%/7% 시나리오별 월 이자표. 원금 상환 계획(거치 후 분할상환 등)은 2차 설명회에서 상세 보고 예정이라고 안내." },
      { q: "연보는 의무인가요? 얼마씩 내야 하나요?", a: "‘완전 자발적이며, 금액도 각자 형편에 따라 자유롭게.’ 가구당 평균 참고 금액은 제시하되 강제하지 않음을 강조." },
      { q: "선교비/교육비가 줄어드는 건 아닌가요?", a: "구체적 예산 재편안은 2차 설명회에서 보고. ‘교회의 본질적 사역이 위축되지 않도록 하겠다’는 원칙 천명." },
    ],
  },
  {
    group: "B. 물건 / 위치",
    items: [
      { q: "축복교회는 왜 이 건물을 파나요?", a: "매각 사유를 사전 확인. 건물 구조/안전 문제가 아님을 설명할 수 있어야 함." },
      { q: "어르신들/장애 성도분들 교통은요?", a: "엘리베이터 있음(현재 없음보다 개선). 거리는 멀어지나 셔틀/카풀 등 대책 검토 중." },
      { q: "137평이면 금방 또 좁아지지 않나요?", a: "장의자 39개(약 150~160명 수용), 옆 서재로 확장 가능, 필요시 건물 내 다른 층 임대/매매 검토 가능." },
      { q: "서해아파트는 왜 안 되나요?", a: "1억 저렴하고 면적도 크지만 (1)용도변경 필요 (2)현 헬스장 임차인 퇴거·원상복구 비용 리스크 (3)엘리베이터 없음. 종합적으로 에벤에셀프라자가 안전한 선택." },
    ],
  },
  {
    group: "C. 절차 / 공동체",
    items: [
      { q: "오늘 투표하는 건가요?", a: "‘아닙니다. 오늘은 1차 보고입니다. 의견 수렴 → 2차 설명회(6/14) → 충분한 논의 후 공동의회에서 최종 결정합니다.’" },
      { q: "반대해도 괜찮은 건가요?", a: "‘물론입니다. 반대 의견도 우리 교회를 사랑하는 마음에서 나오는 것이며, 충분히 경청하겠습니다.’" },
      { q: "부결되면 어떻게 되나요?", a: "현 예배당에서 계속 예배하면서 다른 매물 탐색 계속. 다만 현 건물의 리스크(매매 상태, 퇴거 특약)는 남아있음을 인지." },
      { q: "금천구 가면 ‘관악교회’라는 이름은요?", a: "‘이름은 우리의 시작과 뿌리를 담은 것. 변경 여부는 성도님들과 함께 논의할 사안.’ (정체성 쟁점 참조)" },
      { q: "빚을 지고 건물을 사는 게 맞나요?", a: "‘신앙적으로도 중요한 질문입니다. 다만 현재 월세+주차비로 이미 연 3,500~5,700만원을 쓰고 있고, 이 돈은 돌아오지 않습니다. 매입 시 대출 상환은 결국 우리 자산이 됩니다.’" },
      { q: "너무 급하게 진행되는 것 아닌가요?", a: "‘위원회가 4월에 구성되어 2개월간 조사했고, 앞으로도 최소 1개월 이상의 논의 기간을 둡니다. 다만 매물이 시장에 계속 남아있을 보장이 없어, 적절한 속도로 진행할 필요는 있습니다.’" },
    ],
  },
];

// ── 7. 보고 전 체크리스트 ──────────────────────────────────────
const CHECKLIST: { no: number; item: string; level: "필수" | "권장" | "있으면 좋음"; action: string }[] = [
  { no: 1, item: "자본금 2억 출처 명확히 정리", level: "필수", action: "보고서에 한 줄 추가 또는 구두 설명 준비" },
  { no: 2, item: "타 교회 차입 현황 — 최소 ‘논의 중/미착수’ 구분", level: "필수", action: "솔직하게 현재 상태 공유" },
  { no: 3, item: "Plan B/C 시나리오 정리", level: "필수", action: "‘안 되면 어떻게’ 질문에 답할 수 있도록" },
  { no: 4, item: "금리 5%/6%/7% 시나리오별 월 비용 한 장", level: "권장", action: "간단한 표 준비 (구두라도)" },
  { no: 5, item: "‘오늘은 보고이지 투표가 아닙니다’ 멘트 준비", level: "필수", action: "보고 서두에 명확히" },
  { no: 6, item: "‘반대 의견도 환영합니다’ 멘트 준비", level: "필수", action: "보고 말미에 명확히" },
  { no: 7, item: "서면 의견서 양식 준비", level: "권장", action: "현장에서 배부, 1주 내 회수" },
  { no: 8, item: "전도회 소모임 논의 일정 요청 가안", level: "권장", action: "6월 첫째 주 전도회 모임에서 안건 공유 요청" },
  { no: 9, item: "어르신 교통 대책 방향", level: "있으면 좋음", action: "셔틀/카풀 검토 중이라고 언급" },
];

export default function BriefingPage() {
  return (
    <div className="flex flex-col gap-10">
      {/* 헤더 */}
      <section className="flex flex-col gap-3">
        <span className="text-xs font-medium text-primary">
          관악교회 예배당 이전 · 5/31 1차 설명회 대비
        </span>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          보고 브리핑 — 핵심 쟁점 &amp; 예상 질문
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          위원회 활동 보고(차승회 장로) + 재정 검토(이지원 집사) + 준비위원 검토
          의견을 종합한 보고 대비 가이드입니다. “옮겨야 하는 이유”는 분명합니다.
          중요한 것은 <strong>“어떻게 잘, 함께 옮겨갈 것인가”</strong>이며, 그
          답을 성도 여러분과 함께 찾아가는 자리입니다.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">잠정 후보 · 에벤에셀프라자 (금천구 12억/137평)</Badge>
          <Badge variant="secondary" className="font-normal">2차 설명회 · 6/14</Badge>
        </div>
      </section>

      {/* 1. 이전의 당위성 */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <Target size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">1. 이전의 당위성 — 왜 지금 옮겨야 하는가</CardTitle>
            <CardDescription>
              “왜”가 명확해야 “어떻게”의 부담도 받아들일 수 있습니다. 보고 시 이
              부분을 먼저 충분히 설명해야 합니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {RATIONALE.map((r) => (
            <div
              key={r.no}
              className="flex items-start justify-between gap-3 rounded-md border border-border p-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">
                  {r.no}. {r.title}
                </span>
                <span className="text-xs text-muted-foreground">{r.detail}</span>
              </div>
              <Badge variant={urgencyBadge[r.urgency].variant} className="shrink-0">
                {urgencyBadge[r.urgency].label}
              </Badge>
            </div>
          ))}
          <Note>
            “옮겨야 하는 이유”는 분명합니다. 문제는 “어떻게 잘 옮겨갈 것인가”이며,
            이것이 오늘 보고의 본질입니다. 아래 4가지 쟁점이 그 답을 준비하는 데
            필요한 항목들입니다.
          </Note>
        </CardContent>
      </Card>

      {/* 2. 쟁점1: 재정 구조 */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <Coin size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">쟁점 1 · 재정 구조 — 늘어나는 고정비, 어디서 줄일 수 있나</CardTitle>
            <CardDescription>
              이전 시 월 고정비가 최소 150~200만원 이상 늘어납니다. 이 증가분을
              어디서 흡수할 수 있는지 사전에 체크하고, 구체적으로 이야기할 수
              있어야 성도들이 “감당할 수 있겠구나”라는 확신을 가질 수 있습니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">항목</th>
                  <th className="py-2 pr-3 font-medium">현재 (월)</th>
                  <th className="py-2 pr-3 font-medium">이전 후 (월, 추정)</th>
                  <th className="py-2 font-medium">증감</th>
                </tr>
              </thead>
              <tbody>
                {COST_COMPARE.map((c) => {
                  const isTotal = c.item === "합계";
                  return (
                    <tr
                      key={c.item}
                      className={`border-b border-border/60 ${isTotal ? "font-semibold" : ""}`}
                    >
                      <td className="py-2 pr-3">{c.item}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{c.current}</td>
                      <td className="py-2 pr-3">{c.after}</td>
                      <td
                        className={`py-2 ${
                          c.deltaTone === "up"
                            ? "text-red-600"
                            : c.deltaTone === "down"
                              ? "text-emerald-600"
                              : "text-muted-foreground"
                        }`}
                      >
                        {c.delta}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">절감 가능성이 있는 비목 체크 포인트</span>
            {SAVING_POINTS.map((s) => (
              <div
                key={s.item}
                className="flex items-start justify-between gap-3 rounded-md border border-border p-3"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{s.item}</span>
                  <span className="text-xs text-muted-foreground">{s.note}</span>
                </div>
                {s.ratio !== "—" && (
                  <Badge variant="outline" className="shrink-0 font-normal">
                    현재 {s.ratio}
                  </Badge>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-md border border-dashed border-primary/40 bg-secondary/40 p-4 text-sm">
            <p className="mb-2 font-semibold text-primary">재정 건전성 벤치마크 (이지원 집사 검토)</p>
            <ul className="flex flex-col gap-1 text-foreground">
              <li>· 예산 대비 시설비: <strong>현재 약 16.2% → 이전 후 약 22.7%</strong> (넉넉히 25%)</li>
              <li>· 일반 교회 예산 비중: 인건비 45~55% · 시설비 20~25% · 선교/교육 10~20%</li>
              <li>· 관악교회 현 목회비 비중 55~60% — 임차료가 저렴해 시설비가 낮았던 구조</li>
              <li>· 이전 후에도 시설비 %가 일반 교회 범위를 크게 벗어나지 않음. 다른 부분 소폭 감축 + 연보로 마음을 모으는 방식 병행</li>
            </ul>
          </div>

          <Note>
            내일 보고에서 “어느 비목을 얼마나 줄이겠다”까지 발표할 필요는 없습니다.
            다만 <strong>“위원회가 이 부분을 인지하고 있고, 당회와 함께 구체적 예산
            재편안을 2차 설명회(6/14)에서 보고하겠다”</strong>라고 말하면
            충분합니다. 중요한 것은 성도들이 “이 문제를 우리도 고민하고 있다”는 걸
            느끼는 것입니다.
          </Note>
        </CardContent>
      </Card>

      {/* 3. 쟁점2: 자금 조달 */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <Buildings size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">쟁점 2 · 자금 조달 — Plan A/B/C 시나리오</CardTitle>
            <CardDescription>
              거의 전액을 대출+연보+타 교회 차입으로 진행해야 하는 상황에서,
              시나리오별 계획이 있어야 성도들이 안심하고 결정할 수 있습니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div>
            <span className="text-sm font-semibold">총 필요 자금 · 12.2~12.9억원</span>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {TOTAL_COST.map((t) => (
                <div key={t.item} className="flex items-baseline justify-between gap-2 rounded-md border border-border p-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{t.item}</span>
                    {t.note && <span className="text-[11px] text-muted-foreground">{t.note}</span>}
                  </div>
                  <span className="shrink-0 text-sm font-semibold">{t.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plan A */}
          <div className="rounded-md border-l-4 border-emerald-500 bg-emerald-50/40 p-4">
            <p className="mb-2 text-sm font-semibold text-emerald-700">Plan A · 최선의 시나리오 — 모든 것이 계획대로</p>
            <div className="flex flex-col gap-1.5">
              {PLAN_A.map((p) => (
                <div key={p.source} className="flex items-baseline justify-between gap-3 text-sm">
                  <span>{p.source} <span className="text-xs text-muted-foreground">· {p.cond}</span></span>
                  <span className="shrink-0 font-semibold">{p.amount}</span>
                </div>
              ))}
              <div className="mt-1 flex items-baseline justify-between border-t border-emerald-500/30 pt-1.5 text-sm font-bold">
                <span>합계 · 월 고정비 약 500만원</span>
                <span>12.2억</span>
              </div>
            </div>
          </div>

          {/* Plan B */}
          <div className="rounded-md border-l-4 border-amber-400 bg-amber-50/40 p-4 text-sm">
            <p className="mb-1 font-semibold text-amber-700">Plan B · 연보가 목표의 50%일 때</p>
            <p className="text-foreground">
              성도 연보 5,000만원(목표 50% 달성) → 타 교회 차입 2.5~3억으로
              <span className="text-red-600"> 5,000만~1억 추가 차입 필요</span>.
              타교회 상환분 증가로 월 고정비 약 530~560만원.
            </p>
            <p className="mt-1 text-muted-foreground">
              대응: 연보 서약 기간을 연장(1년→2년 분할)하거나, 매입 시점을 1~2개월
              늦춰 모금 기간 확보.
            </p>
          </div>

          {/* Plan C */}
          <div className="rounded-md border-l-4 border-red-400 bg-red-50/40 p-4 text-sm">
            <p className="mb-1 font-semibold text-red-700">Plan C · 타 교회 차입이 안 될 때</p>
            <p className="text-foreground">
              은행 대출 9~10억으로 <span className="text-red-600">대출 비중 대폭 상승(75~83%)</span>.
              6% 기준 월 450~500만원 이자만 발생 → 총 월비용 600만원+.
            </p>
            <ul className="mt-2 flex flex-col gap-1 text-foreground">
              {PLAN_C_OPTIONS.map((o, i) => (
                <li key={i}>· {o}</li>
              ))}
            </ul>
          </div>

          {/* 사전 확인 필요 사항 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">자금 조달 관련 사전 확인이 필요한 사항</span>
            {PRECHECK.map((p) => (
              <div key={p.no} className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{p.no}. {p.item}</span>
                  <span className="text-xs text-muted-foreground">→ {p.next}</span>
                </div>
                <Badge variant={urgencyBadge[p.tone].variant} className="shrink-0 font-normal">
                  {p.state}
                </Badge>
              </div>
            ))}
          </div>

          <Note>
            “우리는 최선의 시나리오만 보고 달려가는 것이 아닙니다. 연보가
            부족하거나, 타 교회 차입이 안 되는 상황까지 미리 대비하고 있습니다.
            <strong> 무리한 결정은 하지 않겠습니다.</strong> 공동의회에서 자금 조달
            현황이 충분히 갖춰졌을 때 비로소 최종 결정을 요청드리겠습니다.”
          </Note>
        </CardContent>
      </Card>

      {/* 4. 쟁점3: 정체성 */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <Compass size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">쟁점 3 · 정체성 — “관악교회”가 금천구로 가도 괜찮은가</CardTitle>
            <CardDescription>
              자가용 20분, 생활권으로는 가까운 거리이지만 관할 구역이 바뀌는 것은
              단순 주소 변경이 아니라 교회의 이름과 정체성에 대한 고민을 수반합니다.
              가볍게 넘기지 말고 진지하게 다뤄야 합니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <QaBlock
            q="교회 이름을 바꿔야 하나요?"
            a="바꿀 필요는 없습니다. 교회 이름은 지역명이 아니라 정체성의 표현입니다. 관악구에서 시작된 교회의 역사와 뿌리를 담은 것이며, 이전한다고 반드시 바꿔야 하는 것은 아닙니다. 다만 ‘관악’이라는 이름을 유지할지는 성도들과 함께 논의할 사안 — 이번 보고에서 결론낼 것이 아니라 ‘이런 고민도 함께 하고 있다’고 언급하는 것이 적절합니다."
          />
          <QaBlock
            q="관악구 지역 사역은 어떻게 되나요?"
            a="금천구는 관악구 바로 옆이고 기존 성도 대부분의 생활권에서 크게 벗어나지 않습니다. 교회가 관악구를 ‘우리 선교 필드’로 여겨왔다면 이전 후에도 그 사역을 이어갈 방법(구역 모임, 지역 봉사 등)을 함께 논의해야 합니다. 동시에 금천구라는 새로운 지역에서의 사역 기회도 생기므로 긍정적으로 이야기할 수 있습니다."
          />
          <QaBlock
            q="멀어져서 교회 안 나오시게 되는 분은 없을까요?"
            a="가장 현실적인 걱정입니다. 특히 어르신, 도보 출석 성도, 대중교통 의존 성도의 접근성이 달라집니다. (관악역 기준 버스 10분/도보 20분 · 금천구청역 버스 15분/도보 30분 · 자가용 20분) 대책으로 주일 셔틀 운행, 카풀 매칭, 택시비 지원(어르신) 등을 검토합니다."
          />
          <Note>
            “관악교회의 정체성은 건물 주소가 아니라, 함께 모여 예배드리는 우리
            공동체에 있습니다. 이름과 지역 사역에 대한 고민은 이전 결정과 별도로
            성도 여러분과 함께 논의하겠습니다. 어떤 결정을 하든,
            <strong> 한 분도 소외되지 않는 것이 우리의 원칙입니다.</strong>”
          </Note>
        </CardContent>
      </Card>

      {/* 5. 쟁점4: 의견 수렴 절차 */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <UsersThree size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">쟁점 4 · 의견 수렴 절차 — 찬반 투표 전에 무엇이 필요한가</CardTitle>
            <CardDescription>
              12억 규모 매입은 교회 역사상 가장 큰 재정 결정일 수 있으며, 모든
              성도가 “내 목소리가 반영됐다”고 느끼는 것이 건강한 공동체를 위해
              중요합니다. 사전에 충분히 소통하는 것이 결과적으로 빠른 길입니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {PROCESS.map((p) => (
            <div key={p.period + p.activity} className="flex items-start gap-3 rounded-md border border-border p-3">
              <span className="mt-0.5 w-20 shrink-0 text-xs font-semibold text-primary">{p.period}</span>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm font-medium">{p.activity}</span>
                <span className="text-xs text-muted-foreground">{p.how}</span>
              </div>
              <Badge variant="outline" className="shrink-0 font-normal">{p.can}</Badge>
            </div>
          ))}
          <Note>
            이 과정은 “통과 의례”가 아니라 <strong>실제로 의견을 듣고 반영하는
            과정</strong>이 되어야 합니다. 소모임에서 나온 우려 사항은 2차
            설명회에서 반드시 다뤄야 합니다. 정기 모임이 없는 전도회는 온라인
            (카카오톡 그룹) 의견 수렴으로 대체할 수 있습니다.
          </Note>
        </CardContent>
      </Card>

      {/* 6. 성도 예상 Q&A */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <ChatCircleText size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">성도 예상 질문 &amp; 답변 가이드 (15개)</CardTitle>
            <CardDescription>
              현장 질의응답에 대비한 답변 톤·핵심 포인트입니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {QA_GROUPS.map((g) => (
            <div key={g.group} className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-primary">{g.group}</span>
              {g.items.map((it, i) => (
                <QaBlock key={i} q={it.q} a={it.a} />
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 7. 보고 전 체크리스트 */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <ListChecks size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">내일 보고 전 최종 체크리스트</CardTitle>
            <CardDescription>
              보고의 핵심은 네 가지 쟁점에 대해 위원회가 고민하고 있다는 것을
              보여주는 것입니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {CHECKLIST.map((c) => (
            <div key={c.no} className="flex items-start gap-3 rounded-md border border-border p-3">
              <CheckSquare size={18} className="mt-0.5 shrink-0 text-primary" />
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm font-medium">{c.no}. {c.item}</span>
                <span className="text-xs text-muted-foreground">{c.action}</span>
              </div>
              <Badge
                variant={c.level === "필수" ? "destructive" : c.level === "권장" ? "secondary" : "outline"}
                className="shrink-0 font-normal"
              >
                {c.level}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 마무리 */}
      <section className="rounded-xl border border-primary/30 bg-secondary/40 p-5">
        <div className="flex items-start gap-3">
          <Warning size={22} className="mt-0.5 text-primary" />
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-semibold">종합 정리</p>
            <p className="text-muted-foreground">
              내일 보고의 핵심은 <strong className="text-foreground">네 가지 쟁점</strong>에 대해
              위원회가 고민하고 있다는 것을 보여주는 것입니다 — ① 재정 구조(어디서
              줄일지 체크 중, 2차 설명회에서 예산안 보고) ② 자금 조달(Plan B/C까지
              준비, 무리한 결정 안 함) ③ 정체성(이름·지역 사역도 함께 논의) ④ 의견
              수렴(전도회 소모임·온라인·개별 소통으로 모든 목소리 청취).
            </p>
            <p className="text-foreground">
              관악교회가 하나님의 인도하심 가운데 한 마음으로 지혜로운 결정을
              내리시길 기도합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border-l-4 border-primary/50 bg-secondary/40 p-3 text-sm leading-relaxed text-foreground">
      {children}
    </div>
  );
}

function QaBlock({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-sm font-medium">Q. {q}</p>
      <p className="mt-1.5 border-l-2 border-primary/40 pl-3 text-sm leading-relaxed text-muted-foreground">
        {a}
      </p>
    </div>
  );
}
