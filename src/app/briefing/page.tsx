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
  { no: 7, item: "현 예배당 임대 승계처(후속 임차) 확보", state: "미확인", tone: "high", next: "이어받을 교회/단체를 못 찾을 경우 보증금 회수 지연·원상복구 비용·일정 중복(이중 부담) 발생 → Plan B/C에 반영 (이명건 집사 지적)" },
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
      { q: "현 예배당은 이어받을 곳이 있나요? 보증금은 언제 돌려받나요?", a: "임대 조건이 좋아 단기 사용 희망 교회·단체가 있을 수 있으나 승계처 확보는 아직 미확인. 못 찾을 경우 보증금 회수 지연·원상복구 비용·이중 부담 가능성이 있어 Plan B/C에 반영. ‘승계가 안 되는 경우까지 대비하고 있다’고 안내." },
    ],
  },
  {
    group: "B. 물건 / 위치",
    items: [
      { q: "축복교회는 왜 이 건물을 파나요?", a: "매각 사유를 사전 확인. 건물 구조/안전 문제가 아님을 설명할 수 있어야 함." },
      { q: "어르신들/장애 성도분들 교통은요?", a: "엘리베이터 있음(현재 없음보다 개선). 거리는 멀어지나 셔틀/카풀 등 대책 검토 중." },
      { q: "137평이면 금방 또 좁아지지 않나요?", a: "장의자 39개(약 150~160명 수용), 옆 서재로 확장 가능, 필요시 건물 내 다른 층 임대/매매 검토 가능." },
      { q: "서해아파트는 왜 안 되나요?", a: "1억 저렴하고 면적도 크지만 (1)용도변경 필요 (2)현 헬스장 임차인 퇴거·원상복구 비용 리스크 (3)엘리베이터 없음. 종합적으로 에벤에셀프라자가 안전한 선택." },
      { q: "집합건물 6층이라 토지 지분·자산가치가 낮다던데요?", a: "사실입니다. 다만 목적이 ‘투자 수익’이 아니라 ‘안정적 예배 공간 확보’입니다. 환금성은 다시 팔아 재이전할 때만 문제가 되는데, 애초 장기 정착이 목표라 빈번한 재매도를 전제하지 않습니다. 그럼에도 매입가·대출 규모는 보수적으로 검증합니다." },
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
      { q: "너무 급하게 진행되는 것 아닌가요?", a: "오히려 반대입니다. 이전 논의는 이미 2년 전부터 있어 왔고, 그동안 주변 임대 물건도 꾸준히 알아봐 왔습니다. 다만 현 임차 기간이 남아 실행하지 못한 채 머물러 있었을 뿐입니다. 위원회는 4월에 정식 구성되어 2개월간 조사했고, 앞으로도 최소 1개월 이상의 논의·의견 수렴 기간을 둡니다. 정보 탐색과 매입 결정은 별개이며, 급하게 밀어붙이는 것이 아닙니다." },
      { q: "꼭 지금 매입해야 하나요? 관악구 내 재임대가 안전하지 않나요?", a: "이전의 근본 목적은 ‘안정적·항구적 예배 공간 확보로 미래세대까지 교회를 잇는 것’입니다. 현 임대의 불안정(재건축 특약·매매 진행·재계약 불확실)은 임대라는 형태 자체의 한계라, 관악구 내 새 임대도 같은 위험이 반복됩니다. 임대료는 사라지는 비용(10년 4~7억)이지만 매입 상환금은 교회 자산이 됩니다. 임대는 매입이 어려울 때의 차선책(Plan C)으로 둡니다. 단 재정 감당선을 넘으면 무리하지 않습니다." },
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

// ── 수렴된 의견 (김정권 성도 소견) + 사실 검증 분류 ────────────
// 제기된 항목 대부분이 "~다고 함/~예상됨" 형태의 전언·추정 → 사실로 단정하지 말고
// ① 확인 대상(자료로 객관 확정 가능) ② 전언·추정(미검증) ③ 정책·판단(가치 결정)으로 분류.
type CautionKind = "확인 대상" | "전언·추정" | "정책·판단";
const cautionKindStyle: Record<
  CautionKind,
  { variant: "secondary" | "outline"; cls: string }
> = {
  "확인 대상": { variant: "secondary", cls: "" },
  "전언·추정": { variant: "outline", cls: "text-amber-700 border-amber-300" },
  "정책·판단": { variant: "outline", cls: "text-muted-foreground" },
};
const CAUTION_GROUPS: {
  title: string;
  items: { claim: string; kind: CautionKind; check: string }[];
}[] = [
  {
    title: "현 예배당(관악) 관련 리스크",
    items: [
      {
        claim: "임차 잔여 기간이 약 2.5년 남아, 기간 중 이전 시 임차보증금 회수에 어려움이 생길 수 있음",
        kind: "확인 대상",
        check: "잔여 기간·중도 해지·원상복구 조항은 계약서로 즉시 확정 가능. ‘회수 어려움’은 추정 — 일반적으로 보증금은 계약 종료 또는 새 임차인 입주 시 반환되므로 ‘못 받는’ 문제가 아니라 ‘반환 시점’ 문제일 수 있음. 계약서·임대차 전문가 자문으로 확정.",
      },
      {
        claim: "후속 임차인이 교회가 아니면 사용 공간 원상복구 + 집기 철거 부담 발생",
        kind: "확인 대상",
        check: "계약서 원상복구 조항으로 확정. 새 임차인이 교회라 해서 우리 원상복구 의무가 자동 면제되는 것은 아니며(시설 승계는 별도 합의), 비용 규모도 견적으로 산출 가능.",
      },
      {
        claim: "건물 소유주와 자녀들 간 매도 견해차가 있어, 정상 매도 여부·보증금 회수가 불확실",
        kind: "전언·추정",
        check: "가족 간 견해차는 출처·사실 여부 확인 필요. 또한 건물이 매각돼 소유주가 바뀌어도 임차 보증금 반환 의무는 새 소유주에게 승계되는 것이 원칙(대항력 확보 시) — 법리 확인 시 상당 부분 해소 가능.",
      },
    ],
  },
  {
    title: "축복교회(매입 대상) 자산가치",
    items: [
      {
        claim: "집합건물 6층이라 토지 지분이 적고, 부동산 가격 상승 정도가 상대적으로 낮다고 함",
        kind: "전언·추정",
        check: "일반적 경향에 대한 전언. 해당 물건의 실제 시세·지분은 등기부·시세 조사로 확인. 이번 매입은 투자가 아닌 예배 공간 확보가 목적이라 영향이 제한적.",
      },
      {
        claim: "집합건물 공간 사용 시 상당한 관리비가 발생한다고 함",
        kind: "확인 대상",
        check: "축복교회 월별 관리비 명세 확보로 확정(이지원 집사 요청 중). 실제 숫자 확인 전 ‘상당하다’ 단정 금물 — 2차 설명회 전 확보 필수.",
      },
      {
        claim: "추후 더 적합한 장소로 재이전하려 할 때 매도(환금)에 어려움 예상",
        kind: "전언·추정",
        check: "장기 정착이 목적이므로 빈번한 재매도를 전제하지 않음 — 발생 가능성이 낮은 시나리오에 대한 추정.",
      },
    ],
  },
  {
    title: "관악교회 재정 부담",
    items: [
      {
        claim: "추가 대출이자 + 건물 관리비 경상 지출을 현 재정에서 감당할 수 있는가",
        kind: "확인 대상",
        check: "대출 조건 확정 + 예산 재편안으로 계량 검증 가능. 1차 근거: 시설비 비율 16.2%→22.7%로 일반 교회 범위(20~25%) 내(이지원 집사 분석).",
      },
      {
        claim: "원리금 상환으로 선교·구제 등 기존 사역이 제한받을 수 있음",
        kind: "정책·판단",
        check: "예산 재편 시 ‘본질 사역 보호’를 원칙으로 결정할 사항 — 위원회·당회의 가치 판단 영역.",
      },
      {
        claim: "임차보증금을 상당 기간 받지 못할 때 예상되는 재정 운용상의 문제",
        kind: "확인 대상",
        check: "위 보증금 회수 항목(1·3) 검증 결과에 종속. 회수 시점이 확인되면 자금 일정에 버퍼로 반영 — 검증으로 상당 부분 해소 가능.",
      },
    ],
  },
];

// ── 의견 제출자별 검토 관점 정리 ──────────────────────────────
// (찬반/추진 등 입장 분류는 민감하므로 지양 — 각자가 살핀 '검토 영역'으로만 정리)
const POSITIONS: {
  name: string;
  role: string;
  focus: string;
  gist: string;
  reflect: string;
}[] = [
  {
    name: "차승회 장로",
    role: "위원회 보고자",
    focus: "종합 보고",
    gist: "이전 5대 배경, 후보지 비교 검토, 잠정 후보(에벤에셀프라자) 선정 사유, 자금조달 계획과 향후 일정을 종합해 위원회 활동으로 보고.",
    reflect: "보고의 기준 골격(당위성·후보·자금·일정).",
  },
  {
    name: "이지원 집사",
    role: "위원 · 재정 검토",
    focus: "재정 검토",
    gist: "월 고정비 +150~200만, 보증금 2억 즉시 활용 어려움 등 재정 부담을 짚되, 시설비 비율은 일반 교회 범위(20~25%) 내라 감당 가능하다고 분석. 주중 대관 수입 등 보완책 제안.",
    reflect: "재정 투명성 + 예산 재편안 + 절감·대관·연보로 흡수.",
  },
  {
    name: "이명건 집사",
    role: "준비위원",
    focus: "리스크·정체성 검토",
    gist: "이전 필요성에 공감하며 ① 현 예배당 임대 승계 실패 리스크 ② 관악구 거주 출석 교인 약 30%(정체성·이름) ③ 비목 조정 구체화를 보완 과제로 제기.",
    reflect: "Plan B/C·사전확인 항목·정체성 논의에 반영.",
  },
  {
    name: "김정권 성도",
    role: "성도 서면 의견",
    focus: "대안 검토 제안",
    gist: "보증금 회수·원상복구·집합건물 자산가치·재정 부담을 들어, 즉시 매입보다 적합 공간 임대를 의사결정 대안으로 함께 검토하자고 제안.",
    reflect: "리스크는 계획에 반영. 임대 대안은 차선책으로 검토(아래 쟁점 분석 참조).",
  },
  {
    name: "김금순 자매",
    role: "성도 현장 의견",
    focus: "경험·공감 공유",
    gist: "이전 논의는 이미 2년 전부터 있었고 그동안 주변 임대 물건도 알아봐 왔으나, 현 임차 기간이 남아 실행하지 못한 채 머물러 있었다는 경험을 공유. 같은 고민·질문을 가진 성도가 많다고 전함.",
    reflect: "‘오래 검토해온 사안(급하지 않음)’ + ‘임차 기간 제약’이라는 현장 맥락을 보고에 반영. 매물 정보 탐색은 매입 결정과 별개로 계속.",
  },
];

// ── 쟁점별 총체적 논리 정리 ────────────────────────────────────
const CONCLUSIONS: {
  no: number;
  issue: string;
  concern: string;
  analysis: string;
  conclusion: string;
}[] = [
  {
    no: 1,
    issue: "매입 vs 임대(재임대) 대안",
    concern: "지금 매입은 부담스럽다 — 관악구 내 재임대 등 임대로 가는 것이 안전하지 않은가?",
    analysis:
      "이전을 검토하게 된 근본 목적은 ‘안정적이고 항구적인 예배 공간을 확보해 미래세대까지 교회를 이어가는 것’입니다. 현 임대의 불안정(재건축 시 즉시 퇴거 특약·건물 매매 진행·2.5년 후 재계약 불확실)은 특정 건물의 문제가 아니라 ‘임대’라는 형태 자체의 구조적 한계입니다. 관악구 안에서 새로 임대해도 동일한 위험(계약 만료·임대료 인상·퇴거)이 반복되며, 근본 목적인 ‘안정성·항구성’을 충족하지 못합니다. 임대료는 매월 사라지는 비용(현재 연 3,500~5,700만원, 10년 4~7억)이지만 매입 상환금은 교회의 자산으로 축적됩니다.",
    conclusion:
      "감당 가능한 조건이라면 ‘매입을 통한 항구적 예배 공간 확보’가 이전의 근본 목적에 가장 부합합니다. 임대 대안은 이 목적을 충족하지 못하므로 매입이 어려울 때의 차선책(Plan C)으로만 유효합니다. 단, 재정이 감당선을 넘으면 매입을 미루거나 재검토합니다.",
  },
  {
    no: 2,
    issue: "집합건물 자산가치·환금성",
    concern: "집합건물 6층이라 토지 지분이 적고 시세 상승·환금성이 낮다.",
    analysis:
      "사실에 부합하는 지적입니다. 다만 이번 매입의 목적은 ‘투자 수익’이 아니라 ‘예배 공간의 안정적 확보’입니다. 환금성은 ‘추후 다시 매도해 재이전’할 때만 문제가 되는데, 애초 목적이 장기 정착이므로 빈번한 재매도를 전제하지 않습니다.",
    conclusion:
      "자산가치 우려는 목적(예배 공간 확보)과 층위가 다른 문제입니다. ‘투자 자산’이 아니라 ‘신앙의 터전’으로 접근하되, 만일에 대비해 매입가 적정성과 대출 규모는 보수적으로 검증합니다.",
  },
  {
    no: 3,
    issue: "재정 감당 가능성",
    concern: "추가 고정비·대출이자로 선교·구제 등 사역이 위축되지 않는가?",
    analysis:
      "월 고정비 +150~200만원 증가는 사실입니다. 그러나 예산 대비 시설비 비율은 16.2% → 22.7%로, 일반 교회 통상 범위(20~25%) 안에 있습니다. 주차비 절감(월 30~60만)·행사/운영비 소폭 조정·공간 대관 수입·자발적 연보로 흡수 가능하며, 본질 사역은 보호 원칙입니다.",
    conclusion:
      "감당 불가능한 수준이 아니며, 구체적 예산 재편안(2차 설명회)으로 입증합니다. 단 연보·차입이 목표에 못 미치면 무리하지 않고 Plan B/C로 속도를 조절합니다.",
  },
  {
    no: 4,
    issue: "보증금 회수·임대 승계·이중 부담",
    concern: "현 보증금을 제때 못 받고 원상복구·이중 비용이 날 수 있다.",
    analysis:
      "실재하는 리스크입니다(임차 잔여 2.5년·건물주와 자녀 간 견해차·후속 임차인 불확실). 그러나 이는 ‘매입을 하지 말아야 할 이유’가 아니라 ‘실행 시 관리해야 할 변수’입니다. 매입 시점과 자금계획에 버퍼를 두고, 보증금 반환 시점 확인과 후속 임차 탐색을 선행하면 통제 가능합니다.",
    conclusion:
      "리스크는 회피 대상이 아니라 관리 대상입니다. Plan B/C와 사전 확인 항목으로 통제하며 진행합니다.",
  },
  {
    no: 5,
    issue: "정체성·접근성 (관악 → 금천)",
    concern: "관악교회가 금천구로 가도 괜찮은가? 이름과 멀어지는 성도는?",
    analysis:
      "출석 교인의 약 70%가 이미 관악구 밖에 거주하고, 자가용 20분 거리로 생활권을 크게 벗어나지 않습니다. 이름은 지역명이 아니라 정체성의 표현이라 유지할 수 있습니다. 접근성이 취약한 성도(어르신·도보 출석)는 셔틀·카풀·택시 지원으로 보완합니다.",
    conclusion:
      "정체성은 건물 주소가 아니라 함께 예배하는 공동체에 있습니다. 실질적 영향은 제한적이며, 취약 성도 돌봄을 전제로 ‘한 사람도 소외되지 않는 이전’ 원칙을 견지합니다.",
  },
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

      {/* 1-1. 의견 제출자별 입장 정리 */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <UsersThree size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">의견 제출자별 검토 관점 정리</CardTitle>
            <CardDescription>
              지금까지 모인 의견은 모두 ‘이전의 필요성’에 공감하며, 각자 서로 다른
              영역을 깊이 살펴 주신 것입니다. 찬반으로 가르지 않고, 어떤 관점을
              나눠 주셨고 위원회가 이를 어떻게 반영하는지를 정리합니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {POSITIONS.map((p) => (
            <div key={p.name} className="rounded-md border border-border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{p.name}</span>
                <span className="text-xs text-muted-foreground">{p.role}</span>
                <Badge variant="outline" className="ml-auto shrink-0 font-normal text-muted-foreground">
                  {p.focus}
                </Badge>
              </div>
              <p className="mt-1.5 text-sm text-foreground">{p.gist}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-primary">위원회 반영 · </span>
                {p.reflect}
              </p>
            </div>
          ))}
          <Note>
            네 분의 의견은 대립이 아니라 <strong>하나의 결정을 더 단단하게 만드는
            보완 관계</strong>입니다. 필요성엔 모두 공감하므로, 남은 과제는 ‘재정을
            감당 가능하게 설계하고, 리스크를 계획에 반영하며, 모든 성도의 마음을
            모으는 것’입니다.
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

          {/* 임대 승계 리스크 */}
          <div className="rounded-md border-l-4 border-amber-400 bg-amber-50/40 p-4 text-sm">
            <p className="mb-1 font-semibold text-amber-700">별도 리스크 · 현 예배당 임대 승계 (이명건 집사 지적)</p>
            <p className="text-foreground">
              현 예배당은 임대 조건이 좋아 단기적으로 사용하려는 교회·단체가 있을
              수 있으나, <strong>저희가 장기 지속이 어렵다고 판단해 떠나는 자리인
              만큼 이어받을 곳을 못 찾을 가능성도 있습니다.</strong> 승계가 바로
              이뤄지지 않으면 <span className="text-red-600">보증금 회수 지연 · 원상복구 비용 · 일정
              중복으로 인한 이중 부담(현·신 예배당 동시 비용)</span>이 발생할 수
              있어, 이 부분도 Plan B/C 자금·일정 계획에 함께 반영해야 합니다.
            </p>
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
          <div className="rounded-md border border-dashed border-primary/40 bg-secondary/40 p-3">
            <p className="font-semibold text-primary">교적부 확인 데이터 (이명건 집사)</p>
            <p className="mt-1 text-foreground">
              현재 <strong>관악구에 거주하며 출석하는 교인은 전체 교적의 약 30%</strong>입니다.
              즉 성도의 약 70%는 이미 관악구 밖에 거주하고 있어, 관할 구역 변경이
              과반 성도의 생활권을 크게 바꾸지는 않습니다. 다만 ‘관악교회’라는 이름과
              정체성에 대해 당회가 어떻게 생각하는지 궁금해하실 성도님들이 계실 수 있어,
              <strong> 의견 취합 시 이 주제도 함께 포함</strong>하는 것이 좋습니다.
            </p>
          </div>
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

      {/* 5-1. 수렴된 의견 — 김정권 소견 */}
      <Card className="border-amber-300">
        <CardHeader className="flex flex-row items-start gap-2">
          <Warning size={20} className="mt-0.5 text-amber-600" />
          <div>
            <CardTitle className="text-base">수렴된 의견 — “임대 대안도 함께 검토” (김정권 성도 소견)</CardTitle>
            <CardDescription>
              1차 설명회 이후 서면으로 제출된 의견입니다. 즉시 매입보다 적합한
              공간을 임대해 사용하는 방안을 의사결정 대안으로 검토하고, 충분한
              검토·의견 수렴 후 결정하자는 제안 — 2차 설명회(6/14)에서 반드시
              다뤄야 할 사안입니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="rounded-md border border-dashed border-amber-300 bg-amber-50/50 p-3 text-xs leading-relaxed text-foreground">
            <span className="font-semibold text-amber-700">먼저 — 사실인가, 추정인가?</span>{" "}
            제기된 항목은 대부분 “~다고 함 / ~예상됨” 형태라 <strong>사실로 단정하기 전에 검증이 필요</strong>합니다.
            아래 각 항목을 ① <strong>확인 대상</strong>(계약서·명세·시세 등 자료로 객관 확정 가능) ②
            <strong> 전언·추정</strong>(출처 불명·일반론, 미검증) ③ <strong>정책·판단</strong>(교회의 가치·우선순위 결정 영역)으로
            분류하고, 확인 방향을 함께 답니다.
          </div>

          <div className="flex flex-col gap-4">
            {CAUTION_GROUPS.map((g) => (
              <div key={g.title} className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-amber-700">{g.title}</span>
                <div className="flex flex-col gap-2">
                  {g.items.map((it, i) => {
                    const ks = cautionKindStyle[it.kind];
                    return (
                      <div key={i} className="rounded-md border border-border p-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm text-foreground">{it.claim}</span>
                          <Badge variant={ks.variant} className={`shrink-0 font-normal ${ks.cls}`}>
                            {it.kind}
                          </Badge>
                        </div>
                        <p className="mt-1.5 border-l-2 border-primary/40 pl-3 text-xs leading-relaxed text-muted-foreground">
                          <span className="font-medium text-primary">검증 · </span>
                          {it.check}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <Note>
            정리하면 — 보증금·원상복구·관리비·감당성은 <strong>계약서·명세·대출 조건으로
            객관 확정 가능한 ‘확인 대상’</strong>이고, 소유주 가족 견해차·집합건물 시세·재이전
            환금성은 <strong>출처 불명의 ‘전언·추정’</strong>입니다. 즉 상당수는 사실 확인만으로
            해소될 수 있으며, 실제 리스크로 남는 부분만 Plan B/C와 사전 확인 항목으로
            관리합니다. <strong>“우려를 무겁게 듣되, 사실은 검증해서 말씀드린다”</strong>가
            위원회의 태도입니다.
          </Note>
        </CardContent>
      </Card>

      {/* 5-2. 쟁점별 총체적 논리 정리 */}
      <Card className="border-primary/40">
        <CardHeader className="flex flex-row items-start gap-2">
          <Target size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">쟁점별 총체적 논리 정리 — 가장 합리적인 결론</CardTitle>
            <CardDescription>
              제기된 의견을 쟁점별로 모아, 사실에 근거해 분석하고 가장 합리적인
              결론을 정리합니다. 위원회가 성도님들의 질문에 일관되고 논리적으로
              답하기 위한 기준이며, 충분히 해소 가능한 염려는 명확한 근거로
              안심시켜 드리고 실질 리스크는 계획에 반영하기 위함입니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {CONCLUSIONS.map((c) => (
            <div key={c.no} className="rounded-md border border-border p-4">
              <p className="text-sm font-semibold text-primary">
                쟁점 {c.no} · {c.issue}
              </p>
              <dl className="mt-2 flex flex-col gap-2 text-sm leading-relaxed">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">제기된 우려</dt>
                  <dd className="text-foreground">“{c.concern}”</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">사실 분석</dt>
                  <dd className="text-foreground">{c.analysis}</dd>
                </div>
                <div className="rounded-md border-l-4 border-primary/50 bg-secondary/40 p-3">
                  <dt className="text-xs font-medium text-primary">합리적 결론</dt>
                  <dd className="text-foreground">{c.conclusion}</dd>
                </div>
              </dl>
            </div>
          ))}
          <Note>
            모든 의견은 교회를 사랑하는 마음에서 나온 것입니다. 위원회의 역할은
            각 염려를 사실에 근거해 검토하여,
            <strong> 확인만으로 해소되는 염려는 분명한 근거로 안심시켜 드리고,
            실질적 리스크는 Plan B/C와 사전 확인 항목으로 계획에 반영</strong>하는
            것입니다. 핵심은 <strong>“안정적이고 항구적인 예배 공간을 확보해
            미래세대까지 교회를 이어간다”</strong>는 근본 목적이며, 이 기준에서
            모든 쟁점을 일관되게 설명합니다.
          </Note>
        </CardContent>
      </Card>

      {/* 6. 성도 예상 Q&A */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <ChatCircleText size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">성도 예상 질문 &amp; 답변 가이드 (18개)</CardTitle>
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
