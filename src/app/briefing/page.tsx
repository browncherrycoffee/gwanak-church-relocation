"use client";

import {
  Buildings,
  ChatCircleText,
  CheckSquare,
  Coin,
  Compass,
  Gavel,
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
  { item: "임대료 / 대출이자", current: "200만원", after: "약 320~335만원 (7억·5.4~5.7%)", delta: "+120~135만원", deltaTone: "up" },
  { item: "타 교회 상환", current: "—", after: "30~50만원", delta: "+30~50만원", deltaTone: "up" },
  { item: "주차비", current: "50~80만원", after: "약 21만원 (정기 4대 12 + 할인권 9)", delta: "-약 30~60만원", deltaTone: "down" },
  { item: "관리비·공용·전기·수도", current: "40~200만원", after: "약 167만원 (실측 평균)", delta: "실측 반영", deltaTone: "neutral" },
  { item: "합계", current: "290~480만원", after: "약 540~575만원", delta: "+약 160~190만원", deltaTone: "up" },
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

// ── 축복교회(에벤에셀프라자 6층) 관리비 실측 ──────────────────
const BOKBOK_FEE: {
  period: string;
  rows: { item: string; avg: string; desc: string }[];
  total: string;
  note: string;
} = {
  period: "2025.1 ~ 2026.4 · 16개월 부과 명세 평균",
  rows: [
    { item: "세대관리비", avg: "약 91만원", desc: "관리소 인건비·화재보험·장기수선충당금 등 (매입 시 새로 부담하는 소유자 관리비)" },
    { item: "세대 전기료", avg: "약 48만원", desc: "6층(예배당)에서 사용한 순수 전기" },
    { item: "공용관리비 (전기)", avg: "약 25만원", desc: "건물 공용부 전기" },
    { item: "공용관리비 (수도)", avg: "약 3만원", desc: "건물 공용부 수도 (부정기 부과)" },
    { item: "정기주차권", avg: "12만원", desc: "대당 3만원·6층 최대 5대 / 축복교회 4대 고정" },
    { item: "주차할인권", avg: "약 9만원", desc: "6층 방문객 비정기 주차 등록 (변동)" },
  ],
  total: "약 188만원 / 월",
  note: "목사님·안장로 방문 시 안내받은 ‘관리비 140만원’은 세대분(세대관리비 91 + 세대전기 48). 여기에 공용관리비(약 28)·주차비(약 21)가 더해져 월 총 부과액은 평균 약 188만원. 주차비는 현 예배당(50~80만)보다 크게 낮지만, 세대관리비(약 91만)는 매입(소유) 시 새로 생기는 비용.",
};

// ── 대출 1차 견적 (이지원 집사 확인 중) ───────────────────────
const LOAN_OPTIONS: {
  label: string;
  rate: string;
  repay: string;
  monthly: string;
  note: string;
}[] = [
  {
    label: "안 1 · 이자 부담 ↓ (원금 상환 미룸)",
    rate: "5.7%~ (소폭 변동)",
    repay: "만기일시 (거치 — 매월 이자만)",
    monthly: "7억 기준 월 이자 약 333만원",
    note: "거치기간 월 부담 최소. 단 만기에 원금 일시 상환 부담이 남음.",
  },
  {
    label: "안 2 · 금리 ↓ (원금 조금씩 상환)",
    rate: "5.4%~ (소폭 변동)",
    repay: "원금 일부 균등 (매월 원금 50만원 + 이자)",
    monthly: "7억 기준 월 약 365만원 (이자 315 + 원금 50)",
    note: "원금이 매월 줄어 총이자 절감·자산 적립. 단 월 부담 증가.",
  },
];
const LOAN_COMMON =
  "공통: 대출기간 5~10년 · 금액 6~7억 · 변동주기 3/6개월(택1) · 중도상환수수료 0.73% · 담보=축복교회 상가 · 화재공제 등 부대조건 상담 후 결정. ※ 담보물건만으로 제공된 1차 견적이며 실제 상담 시 변동 가능.";
const LOAN_DOCS: { group: string; docs: string }[] = [
  { group: "법인 교회인 경우", docs: "법인 등기사항증명서 · 정관(규약)" },
  { group: "법인 아닌 교회인 경우", docs: "소속 교단의 소속증명서 · 정관" },
  { group: "공통", docs: "교회 관련 자료 · 목사님 신용평점" },
];

// ── 공간 비용 관점 (이지원·이명건 집사 공동 의견) ─────────────
const SPACE_COST_BENCH: { range: string; meaning: string }[] = [
  { range: "10~20%", meaning: "건물을 이미 소유했거나 대출이 거의 없는 경우" },
  { range: "20~30%", meaning: "일반적으로 무리가 없는 수준" },
];

// ── 현 예배당 매각·임차 정황 (인근 부동산 확인) ───────────────
const SALE_FACTS: { fact: string; detail: string }[] = [
  {
    fact: "건물주(윤영주 회장)는 부인하나, 부동산엔 매각을 의뢰 (변덕)",
    detail: "목사님이 직접 윤영주 회장을 만났을 때는 ‘절대 파는 일은 없다’고 하셨으나, 인근 ‘색다른 부동산’(02-882-8007) 주인은 ‘윤 회장이 이랬다저랬다 변덕은 있지만 건물을 팔아달라고 했다’고 전함. 매각 의사 자체는 실재하나 일관되지 않은 상태.",
  },
  {
    fact: "가격이 경직적 — 100억 이하 매각 불가 입장",
    detail: "매수 희망자가 90억을 제안했지만, 윤 회장 가족은 ‘100억 이하로는 절대 팔지 않겠다’는 입장이라 협의가 더딤. 거래 성사 난이도가 높음.",
  },
  {
    fact: "땅 모양·주변 비협조로 거래가 쉽지 않음",
    detail: "부지가 사각형이 아니라 약 40평이 죽은 공간이라, 주위 건물과 함께 사야 좋은 모양이 나옴. 그런데 주변 건물주는 팔 생각이 전혀 없어 합필 개발이 쉽지 않고, 따라서 거래도 쉽게 성사되지는 않을 것이라는 게 부동산의 견해.",
  },
  {
    fact: "성사돼도 거래 완결까지 최소 1년 — 시간 여유 있음",
    detail: "이 규모의 땅은 매수가 결정된 뒤에도 거래 완결까지 최소 1년이 걸림. 부동산은 ‘현 보증금·계약 만료까지의 월세 등을 고려할 때, 그때 가서 이사 갈 곳을 정해도 시간이 충분하다’고 조언함.",
  },
];

// ‘괜찮다 / 천천히 해도 된다’는 결론의 논리적 허점 (개별 사실은 맞아도 결론이 따라오지 않음)
const SALE_GAPS: { title: string; body: string }[] = [
  {
    title: "허점 1 · ‘절대 안 판다’는 말은 행동과 모순되고, 법적 효력도 없다",
    body: "본인은 교회엔 ‘안 판다’면서 부동산엔 ‘팔아달라’ 했고, 부동산도 그를 ‘변덕스럽다’고 평했습니다. 말과 행동이 충돌하면 신뢰할 것은 행동입니다. 법적으로도 임대인의 구두 약속(안 팔겠다)은 계약상 의무가 아니어서 교회에 아무 권리를 만들어 주지 않고, 장래의 매수인을 구속하지도 않습니다 — 안심의 근거로 삼을 가치가 거의 없습니다.",
  },
  {
    title: "허점 2 · ‘1년 여유’는 성사되기 어려운 시나리오에 붙은 추정치다",
    body: "그 ‘최소 1년’은 주변 건물과 합쳐 사는 대형 합필 거래를 전제한 기간입니다. 그런데 같은 부동산이 ‘이웃이 팔 생각이 전혀 없어 거래가 어렵다’고 했습니다. 즉 1년이 걸린다는 그 거래 자체가 성사되기 어려운 경우이고, 실제 가능성이 높은 단일 건물 매각은 계약부터 잔금까지 보통 수개월이면 끝납니다. 위안이 정작 일어나기 힘든 경우에 매달린 자기모순입니다.",
  },
  {
    title: "허점 3 · ‘거래 완결 시점’과 ‘교회가 안전한 시점’은 다르다 (시계가 둘)",
    body: "설령 매각에 1년이 걸려도 그것이 교회에 1년의 안전을 주지는 않습니다. 새 예배 처소는 물색 → 계약 → 종교시설 용도 허가 → 공사까지 통상 1~2년이 걸립니다. 매각이 1년 안에 끝날 수 있다면 ‘거래가 끝나면 그때 찾자’는 조언은 출발선부터 이미 늦습니다. 종이 위 계약기간이 곧 안정적 점유를 뜻하지도 않습니다(‘신축 시 즉시 퇴거’ 특약).",
  },
];

// 관악교회 입장 — 예배 공동체를 이어가기 위한 보수적 준비
const SALE_PREP: string[] = [
  "모니터링 — 건물주 구두 약속에 기대지 말고, 등기부·매물 등록 여부를 주기적으로 확인.",
  "법률 검토 — ‘즉시 퇴거’ 조항·보증금 반환·대항력·계약갱신요구권을 부동산 전문 변호사와 점검(위 허점 결론은 반드시 변호사 확인 권장).",
  "리드타임 역산 — 새 예배 처소는 물색→허가→공사에 통상 1~2년. ‘거래 끝나면 찾자’가 아니라 지금부터 준비해야 시점이 맞음.",
  "사전 준비 태세 — 후보 매물·자금 계획·성도 의견 수렴을 ‘결정 전’에 갖춰, 좋은 매물(기회)과 갑작스런 퇴거(위기) 모두에 대응 가능한 상태 유지.",
  "재정 버퍼 — 보증금 회수 지연·현·신 예배당 이중 비용 가능성에 대비한 여유 확보.",
  "임대 대안 병행 조사 — 단, 현 임대의 구조적 불안정(특약·매각 정황)이 ‘새 임대’에도 반복됨을 전제로.",
];

// ── 관악구 새 임대 vs 축복교회 매매 비교 ──────────────────────
// 임대 수치는 동급 규모(전용 약 130~140평급) 관악구 상가 시세 ‘가정’ — 실제 조사 필요.
// 매매 수치는 실견적(대출 5.4~5.7%)·실측(관리비 188만) 기반.
const LEASE_VS_BUY_COST: { item: string; lease: string; buy: string; emph?: boolean }[] = [
  { item: "초기 자금", lease: "보증금 약 3억 (가정)", buy: "자기자금 약 3억(자본 2+연보 1) + 대출 7억 + 타교회 2억" },
  { item: "월 임대료 / 대출이자", lease: "약 450만원 (가정)", buy: "약 320만원 (7억·5.4~5.7%)" },
  { item: "월 관리비·공과·주차", lease: "약 100~150만원 (가정)", buy: "약 188만원 (실측)" },
  { item: "타 교회 상환", lease: "—", buy: "30~50만원" },
  { item: "월 합계", lease: "약 550~600만원 (가정)", buy: "약 540~575만원", emph: true },
  { item: "10년 누적 (임대료/이자)", lease: "약 6.5~7억 — 전액 소멸", buy: "이자분 약 3.8억 소멸, 원금은 자산화" },
  { item: "10년 후 남는 것", lease: "보증금 약 3억 회수(무이자)뿐, 건물 0", buy: "건물(12억+) 보유 + 상환 원금만큼 순자산", emph: true },
];
const LEASE_VS_BUY_EFFECT: { aspect: string; lease: string; buy: string }[] = [
  { aspect: "점유 안정성", lease: "계약 만료·임대료 인상·퇴거 위험이 반복", buy: "영구 안정 — 퇴거 위험 없음" },
  { aspect: "초기 부담", lease: "낮음 (보증금 위주)", buy: "높음 (대출·연보)" },
  { aspect: "유연성", lease: "이동이 비교적 쉬움", buy: "이동 어려움 (환금성 낮음)" },
  { aspect: "비용의 귀결", lease: "매월 소멸 (돌아오지 않음)", buy: "상환금 중 원금이 자산으로 축적" },
  { aspect: "시설 투자", lease: "회수 불가 · 용도 협의 매번 필요", buy: "자유롭게 · 영구 사용" },
  { aspect: "다음세대", lease: "불안정한 환경을 물려줌", buy: "안정된 예배 터전을 물려줌" },
  { aspect: "주요 리스크", lease: "임대 시장 변동·재계약 불확실", buy: "대출·금리 부담, 집합건물 환금성" },
];

// ── 현 예배당 임대차계약서 핵심 (계약서 원본 기준) ────────────
// 사진상 명확히 읽히는 항목만 사실로 기재. 흐릿한 수치는 ‘원본 확인 필요’로 표기.
const CONTRACT_FACTS: { label: string; value: string; confirmed: boolean }[] = [
  { label: "계약 종류", value: "부동산 임대차계약서 · 재연장 계약", confirmed: true },
  { label: "소재지", value: "서울 관악구 신림동 247-2, 3층 남쪽 일부 (현 관악교회)", confirmed: true },
  { label: "건물·면적", value: "철근콘크리트 근린생활시설 · 임대 부분 218㎡(약 66평)", confirmed: true },
  { label: "임대인", value: "윤영주 (임대료 계좌: 우체국 1002-033-948512, 예금주 윤영주)", confirmed: true },
  { label: "보증금", value: "₩165,000,000 (약 1.65억) — 기존 ‘2억’ 가정과 차이, 자금계획 재확인 필요", confirmed: true },
  { label: "월 임대료 / 만료일", value: "원본 글씨 흐림 — 정확 금액·만료일 원본 확인 필요 (월세는 이지원 집사 추정 약 200만)", confirmed: false },
];
const CONTRACT_CLAUSES: { title: string; body: string }[] = [
  {
    title: "★ 건물 신축 시 (즉시 퇴거) 조건 — 계약 시 강조·설명함",
    body: "특약에 ‘건물 신축 시 (퇴거)’ 취지가 명시되어 있고 계약 시 이를 강조·설명했다는 기재가 있음. 앞서 부동산이 확인한 ‘신축 매수자 대기·즉시 퇴거’ 정황과 직접 연결되는 조항.",
  },
  {
    title: "원상복구·시설비 일체 임대인 불인정",
    body: "특약상 임대인은 원상복구 비용과 시설비를 일체 인정하지 않음. 즉 퇴거 시 원상복구는 임차인(교회) 부담이며, 그동안 투자한 시설비도 보상받지 못함 — 김정권·이명건 집사가 우려한 ‘원상복구 부담’이 계약서로 확인됨.",
  },
];

// ── 성도 우려에 대한 목회적 소통 가이드 ───────────────────────
const CARE_PRINCIPLES: string[] = [
  "이전은 수단이고 목적은 예배 공동체입니다. 건물보다 한 영혼이 귀합니다 — 이전 때문에 한 사람이 시험에 들거나 교회를 떠난다면, 그 자체로 멈춰 돌아봐야 할 신호입니다.",
  "설득에 앞서 경청입니다. 떠나려는 분, 부담을 느끼는 분께 먼저 안부를 묻고 마음을 듣습니다. 과정에서 상처를 드린 부분이 있다면 솔직히 사과합니다.",
  "반대 의견도 교회를 사랑하는 마음에서 나옵니다. ‘반대 = 믿음 부족’이라는 프레임은 절대 쓰지 않습니다.",
  "두 원칙을 다시 확인합니다 — ① 한 사람도 소외되지 않는 이전 ② 재정적 무리로 치닫는 이전은 하지 않는다. 둘 중 하나라도 걸리면 진행하지 않습니다.",
];
const CARE_CONCERNS: { label: string; empathize: string; communicate: string }[] = [
  {
    label: "대출·빚에 대한 부담 — ‘빚지고 사는 게 신앙적으로 맞나’",
    empathize: "큰 빚에 대한 두려움, 헌금이 무리하게 쓰일까 하는 거룩한 부담은 지극히 자연스럽고 귀한 마음입니다.",
    communicate: "무리한 결정은 하지 않습니다(Plan B/C). 공간 비용 20~30%는 일반적으로 무리 없는 수준이지만, 감당이 어렵다고 판단되면 멈춥니다. ‘빚 = 죄’가 아니라 청지기적 분별의 문제로, 함께 기도하며 판단할 사안입니다.",
  },
  {
    label: "연보 부담 — ‘꼭 해야 하나, 얼마나 내야 하나’",
    empathize: "형편이 어려운 분께 연보 목표는 무거운 짐이 될 수 있습니다. 그 부담을 결코 가볍게 여기지 않습니다.",
    communicate: "연보는 완전히 자발적·익명이며 형편껏입니다. 정해진 액수도, 못 했을 때의 정죄도 없습니다. 연보가 모이지 않으면 그 자체를 ‘무리하게 진행하지 말라’는 신호로 받아들입니다.",
  },
  {
    label: "접근성 — ‘멀어서 출석 못 할 것 같다 / 안 나가겠다’",
    empathize: "신앙생활의 터전이 흔들리는, 가장 현실적이고 아픈 우려입니다. 청년부 설문에서도 거부의 핵심 사유였습니다.",
    communicate: "주일 셔틀·카풀·택시 지원을 적극 검토합니다. ‘한 사람도 소외되지 않는 이전’이 원칙이며, 접근성 때문에 공동체가 깨진다면 그분들을 위해서라도 이전 자체를 재고합니다.",
  },
  {
    label: "‘급하게 밀어붙인다’ — 소문·상처·시험",
    empathize: "충분히 듣지 못했다는 느낌, 과정에서 받은 상처와 마음의 시험을 무겁게 받아들입니다.",
    communicate: "공청회는 결정이 아니라 의견 수렴 단계였습니다. 더 폭넓게 듣기 위해 확대당회로 모이며, 위원회 활동 지속 여부까지 열어 놓고 논의합니다. 상처드린 부분은 사과하며, 속도와 방식은 얼마든지 재조정할 수 있습니다.",
  },
];
const CARE_AVOID: string[] = [
  "‘반대하면 믿음이 없다’ 식의 영적 압박",
  "떠나려는 분을 ‘붙잡기 위한 설득’부터 — 먼저 안부와 돌봄",
  "숫자·논리로 몰아붙이기 — 감정과 관계가 먼저",
  "확정되지 않은 것을 확정된 것처럼 말하기 (오늘 강제되는 것은 아무것도 없음)",
];

// ── 청년부 사전 설문 (정다은 자매 진행) ───────────────────────
// 개인별 응답(이름↔가/부)은 민감 정보이므로 비공개 — 집계·주요 의견만 익명 반영.
const YOUTH_SURVEY: {
  total: number;
  rows: { label: string; count: number; pct: number; tone: "ok" | "no" | "wait" }[];
  refusalReason: string;
  notes: string[];
} = {
  total: 46,
  rows: [
    { label: "수락 (가)", count: 29, pct: 63, tone: "ok" },
    { label: "거부 (부)", count: 5, pct: 11, tone: "no" },
    { label: "응답 대기", count: 12, pct: 26, tone: "wait" },
  ],
  refusalReason:
    "거부 5명 전원의 사유가 ‘거리·교통 접근성’(멀어서 / 대중교통 불편 / 편도 약 1시간 등 출석이 어려울 것 같음). 응답 대기 중에도 같은 사유가 언급됨.",
  notes: [
    "최근 대출 금리가 오르는 추세인데, 상환이 교회의 부담이 되지 않을지 우려",
    "당회가 염두에 둔 이전 시기가 궁금함",
    "당회의 결정에 따르겠다 / 당회 부름 여부에 따라 출석을 결정하겠다",
  ],
};

// ── 3. 자금 조달 시나리오 ──────────────────────────────────────
const TOTAL_COST: { item: string; amount: string; note: string }[] = [
  { item: "매수가", amount: "12억원", note: "에벤에셀프라자 6층 137평" },
  { item: "취득세", amount: "6,440만원", note: "종교단체 면제 가능성 확인 중" },
  { item: "부동산 수수료", amount: "1,400만원", note: "VAT 포함" },
  { item: "기타(이사비 등)", amount: "500만원", note: "" },
];

const PLAN_A: { source: string; amount: string; cond: string }[] = [
  { source: "자본금 (교회 적립금/보증금)", amount: "2억", cond: "계약서상 보증금 1.65억 — 차액 약 0.35억 출처·회수 시점 확인 필요" },
  { source: "성도 연보 (특별헌금)", amount: "1억", cond: "자발적 서약제" },
  { source: "은행 대출", amount: "6~7억", cond: "금리 5.4~5.7% 견적, 월 이자 약 315~333만원" },
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
  { no: 3, item: "은행 대출 사전 상담", state: "1차 견적 수신", tone: "mid", next: "축복교회 상가 담보 기준 2개 안 수신(만기일시 5.7% / 원금균등 5.4%, 6~7억, 5~10년). 실제 상담 시 변동 가능. 필요 서류·목사님 신용평점 준비" },
  { no: 4, item: "취득세 면제 가능성", state: "확인 중", tone: "mid", next: "세무사 자문으로 확정. 면제 시 6,440만원 절감 → 자금 압박 크게 완화" },
  { no: 5, item: "현 보증금(₩1.65억) 반환 시점·자본금 차액", state: "확인 필요", tone: "high", next: "계약서상 보증금 1.65억 확인 — 자금계획 ‘자본금 2억’과 차이나는 차액(약 0.35억) 출처 및 보증금 반환 시점을 건물주와 조율. 현 건물 매각 정황(별도 카드) 함께 고려" },
  { no: 6, item: "축복교회 관리비 월별 상세", state: "수신 완료", tone: "low", next: "16개월 부과 명세 확보 — 월 평균 약 188만원(세대 140+공용 28+주차 21). 비교표·Plan A에 실측 반영 완료" },
  { no: 7, item: "현 예배당 임대 승계처(후속 임차) 확보", state: "미확인", tone: "high", next: "이어받을 교회/단체를 못 찾을 경우 보증금 회수 지연·원상복구 비용·일정 중복(이중 부담) 발생 → Plan B/C에 반영 (이명건 집사 지적)" },
];

// ── 5. 의견 수렴 절차 ──────────────────────────────────────────
const PROCESS: { period: string; activity: string; how: string; can: string }[] = [
  { period: "5/31", activity: "1차 설명회 (오늘)", how: "위원회 활동 보고. 현장 질의응답. 서면 의견서 배부", can: "확정" },
  { period: "6/1~6/7", activity: "전도회별 소모임 논의", how: "각 전도회 회장(위원)이 모임에서 안건 공유 → 질문/염려/찬반 의견 수렴 → 위원회에 전달", can: "요청 필요" },
  { period: "6/1~6/10", activity: "익명 온라인 의견 수렴", how: "구글 폼 등으로 ‘찬성/반대/보류’ + 자유 의견. 발언이 어려운 성도도 참여 가능", can: "쉽게 가능" },
  { period: "6/7~6/10", activity: "개별 소통 (어르신/핵심 성도)", how: "목사님·장로님이 전화·방문으로 마음 챙기기. 불안한 분들 경청", can: "시간 투자" },
  { period: "6/14", activity: "제직회 → 확대당회", how: "1차 공청회 후 성도 우려·이탈이 커져, 당회원 외 제직의 지혜를 모아 의견 수렴·위원회 활동 지속 여부까지 폭넓게 논의", can: "소집 확정" },
  { period: "추후", activity: "2차 설명회", how: "수렴 의견 반영, 자금상환계획 상세 보고, 추가 질의응답 (확대당회 논의 결과에 따라 일정 조정)", can: "조정 가능" },
  { period: "~서리집사 선출", activity: "의사결정 시한 연장 — 충분한 소통 기간", how: "의사결정 시한이 서리집사 선출 때까지 연장됨. 이 기간 성도 의견·불편·현실적 어려움을 최대한 경청", can: "확보됨" },
  { period: "추후", activity: "임시 당회 → 공동의회 일정 공고", how: "최소 2주 전 공고. 졸속 인상 방지 — 충분한 논의 후 진행", can: "당회 결정" },
];

// ── 6. 성도 예상 Q&A ──────────────────────────────────────────
const QA_GROUPS: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "A. 재정 (가장 많은 질문 예상)",
    items: [
      { q: "자본금 2억은 어디서 나오는 돈인가요?", a: "출처를 명확히 (적립금/보증금/기타). ‘보증금 회수’라면 회수 시점과 현 건물주 동의 여부도 함께 설명." },
      { q: "타 교회 4억은 확정인가요? 안 되면?", a: "현재 상태 솔직히 공유. Plan B/C 시나리오로 대응. ‘확보 안 되면 무리하게 진행하지 않겠다’는 원칙 천명." },
      { q: "이자가 오르면? 원금은 언제 갚나요?", a: "1차 견적은 금리 5.4~5.7%(변동). 두 가지 방식 — 금리를 조금 높이는 대신 만기일시(거치, 이자만) / 금리를 낮추는 대신 매월 원금 50만원 상환. 거치기간은 감당 가능하나 원금 상환 단계는 부담이 커, 원금 상환 재원(연보 적립·세입자 확보·장기 계획)을 함께 마련하는 것이 핵심 — 2차 설명회에서 상환 계획을 상세 보고 예정." },
      { q: "연보는 의무인가요? 얼마씩 내야 하나요?", a: "‘완전 자발적이며, 금액도 각자 형편에 따라 자유롭게.’ 가구당 평균 참고 금액은 제시하되 강제하지 않음을 강조." },
      { q: "선교비/교육비가 줄어드는 건 아닌가요?", a: "구체적 예산 재편안은 2차 설명회에서 보고. ‘교회의 본질적 사역이 위축되지 않도록 하겠다’는 원칙 천명." },
      { q: "현 예배당은 이어받을 곳이 있나요? 보증금은 언제 돌려받나요?", a: "임대 조건이 좋아 단기 사용 희망 교회·단체가 있을 수 있으나 승계처 확보는 아직 미확인. 못 찾을 경우 보증금 회수 지연·원상복구 비용·이중 부담 가능성이 있어 Plan B/C에 반영. ‘승계가 안 되는 경우까지 대비하고 있다’고 안내." },
    ],
  },
  {
    group: "B. 물건 / 위치",
    items: [
      { q: "축복교회는 왜 이 건물을 파나요?", a: "매각 사유를 사전 확인. 건물 구조/안전 문제가 아님을 설명할 수 있어야 함." },
      { q: "건물주는 안 판다는데 왜 굳이 나가야 하나요?", a: "건물주(윤영주 회장)는 ‘안 판다’고 하시지만, 정작 부동산에는 ‘팔아달라’고 의뢰하신 정황이라 말씀이 일관되지 않습니다(변덕). 100억 경직·땅 모양 등으로 거래가 쉽진 않고 성사돼도 1년 이상 걸릴 전망이라 당장 급하진 않지만, ‘안 판다’는 구두 약속은 안심의 근거가 못 됩니다. 그래서 손 놓고 기다리기보다 등기부 확인·후보 매물·자금·의견 수렴을 미리 준비해 두는 것이 안전합니다. 무리하게 서두르는 것도, 무대책으로 있는 것도 아닌 ‘준비된 적기 판단’입니다." },
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
type CautionKind = "확인 완료" | "확인 대상" | "전언·추정" | "정책·판단";
const cautionKindStyle: Record<
  CautionKind,
  { variant: "secondary" | "outline"; cls: string }
> = {
  "확인 완료": { variant: "outline", cls: "text-emerald-700 border-emerald-300" },
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
        kind: "확인 완료",
        check: "계약서 특약으로 확인됨 — ‘원상복구·시설비 일체 임대인 불인정’. 즉 퇴거 시 원상복구는 교회 부담이고 시설 투자비도 보상받지 못함. 비용 규모는 견적으로 산출 필요.",
      },
      {
        claim: "건물 소유주의 매도 의사가 불확실 — 매각 여부·보증금 회수 변수",
        kind: "확인 대상",
        check: "목사님 면담 결과 건물주(윤영주 회장)는 ‘절대 안 판다’지만, 부동산은 ‘변덕은 있어도 팔아달라고 했다’고 전함 — 매각 의사는 실재하나 일관되지 않음. 100억 경직·땅 모양·주변 비협조로 거래는 쉽지 않고 성사돼도 1년+ 소요 전망. 단 건물주 말은 안심 근거가 못 되므로 등기부·매물 등록을 주기적으로 확인(아래 ‘현 예배당 매각 정황’ 카드 참조).",
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
        kind: "확인 완료",
        check: "16개월 부과 명세 확보 — 월 평균 약 188만원(세대관리 91+세대전기 48+공용 28+주차 21). 주차는 현 예배당(50~80만)보다 크게 낮으나, 세대관리비(약 91만)는 매입 시 새로 생기는 비용. 비교표·Plan A에 실측 반영.",
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
    gist: "이전 필요성에 공감하며 ① 임대 승계 실패 리스크 ② 관악 거주 30%(정체성) ③ 비목 조정 구체화를 제기. 매각 정황은 보수적으로 봐야 하며(‘안 판다’는 말·부동산 조언은 안심 근거 못 됨), 관건은 ‘얼마나 버티느냐’가 아니라 ‘시간·선택권이 있을 때 주도적으로 확보하느냐’. 동시에 성도 부담을 충분히 경청하는 과정이 우선이라고 봄.",
    reflect: "Plan B/C·사전확인·정체성에 반영 + 매각 정황 ‘핵심 프레임’·목회적 소통 가이드로 반영.",
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
  {
    name: "정다은 자매",
    role: "이전검토위원 · 청년부",
    focus: "청년부 의견 수렴",
    gist: "청년부를 대상으로 이전 가/부 의사 사전 설문을 진행 중. 과반이 수락이나 거부·대기의 핵심 사유는 ‘거리·교통 접근성’으로 모임.",
    reflect: "청년부 설문 결과를 별도 카드로 반영(아래). 접근성 대책(셔틀·카풀)의 중요성 근거로 활용.",
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
      "실측·실견적 반영 시 이전 후 공간비용은 월 약 540~575만원(대출이자 5.4~5.7% + 관리비 실측 188만 등)으로, 현 예산(약 2.8억) 대비 약 23~25% 수준입니다. 이는 일반 교회의 ‘무리 없는 범위(20~30%)’ 안에 들며, 출석 110명 기준 ‘월 약 580만원이 공간에 쓰이는 것이 보통’이라는 기준과도 부합합니다. 현재 16.2%로 비정상적으로 낮았던 탓에 인식이 보수적이었을 뿐입니다. 다만 장로님 지적대로 거치기간(이자만)은 감당 가능하나 원금 상환 단계는 부담이므로, 원금 상환 재원 계획이 함께 필요합니다.",
    conclusion:
      "공간비용 비율로 보면 무리한 수준이 아니며, 구체적 예산 재편안(2차 설명회)으로 입증합니다. 단 ① 원금 상환 재원(연보·세입자·장기 계획) 마련과 ② 연보·차입이 목표에 못 미칠 때 Plan B/C로 속도 조절 — 이 두 조건을 전제로 진행합니다. 본질 사역(선교·구제·교육)은 보호하되, 예배 공간 확보도 그에 못지않게 중요한 사명임을 함께 설명합니다.",
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
      "출석 교인의 약 70%가 이미 관악구 밖에 거주하고, 자가용 20분 거리로 생활권을 크게 벗어나지 않습니다. 이름은 지역명이 아니라 정체성의 표현이라 유지할 수 있습니다. 다만 접근성은 가장 실질적인 영향 — 청년부 사전 설문에서도 거부·대기의 핵심 사유가 전부 ‘거리·교통’이었습니다. 취약 성도(어르신·도보 출석)와 대중교통 의존 청년은 셔틀·카풀·택시 지원으로 보완해야 합니다.",
    conclusion:
      "정체성은 건물 주소가 아니라 함께 예배하는 공동체에 있습니다. 다만 ‘접근성’은 가볍게 볼 수 없는 변수이므로(청년부 설문이 이를 뒷받침), 교통 대책을 구체화하는 것을 전제로 ‘한 사람도 소외되지 않는 이전’ 원칙을 견지합니다.",
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

      {/* 1-0. 현 예배당 매각·임차 정황 */}
      <Card className="border-amber-300">
        <CardHeader className="flex flex-row items-start gap-2">
          <Warning size={20} className="mt-0.5 text-amber-600" />
          <div>
            <CardTitle className="text-base">현 예배당 매각·임차 정황 (인근 부동산 확인)</CardTitle>
            <CardDescription>
              ‘건물 매매 상태·퇴거 특약’이 막연한 우려가 아니라 실제 정황으로
              확인되는 부분입니다. 동시에 정보가 엇갈리는 지점도 있어, 낙관보다
              대비책을 갖추는 근거가 됩니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {SALE_FACTS.map((s, i) => (
            <div key={i} className="rounded-md border border-amber-200 bg-amber-50/40 p-3">
              <p className="text-sm font-semibold text-amber-700">{s.fact}</p>
              <p className="mt-1 text-xs leading-relaxed text-foreground">{s.detail}</p>
            </div>
          ))}

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div className="rounded-md border border-border p-3">
              <p className="text-sm font-semibold">‘괜찮다 / 천천히 해도 된다’ 논리의 허점</p>
              <div className="mt-2 flex flex-col gap-2">
                {SALE_GAPS.map((g, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-foreground">{g.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{g.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-primary/40 bg-secondary/30 p-3">
              <p className="text-sm font-semibold text-primary">관악교회의 보수적 준비 (예배 공동체 지속을 위해)</p>
              <ul className="mt-2 flex flex-col gap-1.5 text-xs leading-relaxed text-foreground">
                {SALE_PREP.map((p, i) => (
                  <li key={i}>· {p}</li>
                ))}
              </ul>
            </div>
          </div>

          <Note>
            <strong>요약</strong> — 개별 사실(가격차·땅 모양·대형 거래 소요 기간)은
            사실일 수 있으나, <strong>‘그러니 지금 움직일 필요 없다’는 결론은 그
            사실들로부터 도출되지 않습니다.</strong> 진짜 허점은 안심을 주는 그 추론
            자체이며, 법(대항력·계약갱신요구권·신축 특약)과 현실(이전 준비에 1~2년)이라는
            두 축에서 드러납니다. 관악교회는 예배 공동체를 이어가야 하므로 낙관에 기대
            손을 놓기보다 위 항목을 <strong>보수적으로 미리 준비</strong>해 두는 것이
            안전합니다 — ‘당장 무리한 매입’과도, ‘무대책 현상유지’와도 다른{" "}
            <strong>“준비된 상태에서의 적기 판단”</strong>. 이 결론들은 <strong>반드시
            부동산 전문 변호사의 확인</strong>을 거치시길 권하며, 대외 전달 시에는 ‘이미
            100억 매물’ 같은 단정보다 사실 범위 안에서 신중히 표현해야 합니다.
          </Note>

          <div className="rounded-md border border-primary/50 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-primary">핵심 프레임 — 질문을 바꾼다 (이명건 집사 답변)</p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">
              관건은 <strong>“현 예배당에서 얼마나 더 버틸 수 있느냐”</strong>가 아니라,
              <strong> “아직 우리에게 시간과 선택권이 있을 때, 축복교회 매입안을 포함해
              안정적인 예배 공간 확보를 주도적으로 결정할 수 있느냐”</strong>입니다.
              건물주의 ‘안 판다’는 말도(이미 매물·매수 의향자 존재, 90억 거절은 ‘100억
              이상이면 매각’으로 읽힐 수 있음), 부동산의 ‘1년 여유’ 조언도(거래 성사가
              이익인 입장) 안심의 근거로 삼기엔 조심스럽습니다. 떠밀리듯 반응하는 자리가
              아니라, <strong>주도권을 쥔 채 분별하는 자리</strong>로 가는 것이 목표입니다.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 1-0b. 현 예배당 임대차계약서 핵심 */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <Gavel size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">현 예배당 임대차계약서 핵심 (원본 기준)</CardTitle>
            <CardDescription>
              계약서 원본에서 확인된 사항입니다. 글씨가 흐려 확정하기 어려운 수치는
              ‘원본 확인 필요’로 표기했습니다 — 정확성을 위해 추정으로 단정하지
              않았습니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {CONTRACT_FACTS.map((f) => (
              <div key={f.label} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-muted-foreground">{f.label}</span>
                  <Badge
                    variant="outline"
                    className={`shrink-0 font-normal ${f.confirmed ? "text-emerald-700 border-emerald-300" : "text-amber-700 border-amber-300"}`}
                  >
                    {f.confirmed ? "확인" : "원본 확인 필요"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-foreground">{f.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">핵심 특약사항</span>
            {CONTRACT_CLAUSES.map((c, i) => (
              <div key={i} className="rounded-md border border-amber-200 bg-amber-50/40 p-3">
                <p className="text-sm font-semibold text-amber-700">{c.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-foreground">{c.body}</p>
              </div>
            ))}
          </div>

          <Note>
            계약서로 두 가지가 사실 확인됐습니다 — ① <strong>‘신축 시 퇴거’ 조건이
            특약에 명시</strong>되어, 매각·재건축이 진행되면 통상 임차 보호보다 빠른
            퇴거 위험이 실재함 ② <strong>원상복구·시설비는 전부 교회 부담</strong>(임대인
            불인정)이라 퇴거 시 추가 비용·손실이 따름. 한편 <strong>보증금이
            1.65억으로 확인</strong>돼 자금계획상 ‘자본금 2억(보증금 회수 가정)’과
            차이가 있으므로, 차액의 출처와 보증금 반환 시점을 함께 점검해야 합니다.
            (정확한 월세·만료일·특약 문구는 변호사 검토 시 원본으로 재확인 권장)
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
            여러분이 나눠 주신 의견은 대립이 아니라 <strong>하나의 결정을 더
            단단하게 만드는 보완 관계</strong>입니다. 필요성엔 모두 공감하므로,
            남은 과제는 ‘재정을 감당 가능하게 설계하고, 리스크를 계획에 반영하며,
            모든 성도의 마음을 모으는 것’입니다.
          </Note>
        </CardContent>
      </Card>

      {/* 1-2. 성도 우려에 대한 목회적 소통 가이드 */}
      <Card className="border-primary/40">
        <CardHeader className="flex flex-row items-start gap-2">
          <ChatCircleText size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">이전을 둘러싼 우려 — 목회적 소통 가이드</CardTitle>
            <CardDescription>
              1차 공청회 이후 일부 성도님들이 대출·연보 부담, 접근성, 과정에 대한
              상처로 우려하거나 교회를 떠나려 하시는 상황입니다. 이 자리는 ‘설득해
              밀어붙이기’가 아니라 <strong>먼저 듣고 돌보며, 정직하고 합리적으로
              소통하기</strong> 위한 가이드입니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {/* 현 상황 정직한 인정 */}
          <div className="rounded-md border-l-4 border-primary/50 bg-secondary/40 p-4 text-sm leading-relaxed">
            <p className="font-semibold text-primary">먼저 — 지금 상황을 정직하게</p>
            <p className="mt-1 text-foreground">
              1차 공청회 이후 10명 이상이 교회를 떠나려는 뜻을 비치고, 우려·상처·시험의
              소문이 들려옵니다. 위원회는 이를 <strong>‘추진의 걸림돌’이 아니라 ‘멈춰
              돌아보라는 신호’</strong>로 받아들입니다. 그래서 당회·제직이 확대당회로
              모여 다양한 의견 수렴과 <strong>위원회 활동 지속 여부까지 열어 놓고</strong>
              논의합니다. 또한 <strong>의사결정 시한이 서리집사 선출 때까지 연장</strong>되어
              성도님들과 충분히 소통할 시간이 확보되었습니다 — 이 기간 동안 의견·불편·현실적
              어려움을 최대한 경청하는 과정을 충분히 거칩니다. 멈춤이나 연기도 실패가 아니라
              분별의 결과일 수 있습니다. <strong>공동체의 일치가 이전보다 우선입니다.</strong>
            </p>
          </div>

          {/* 소통의 대전제 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">소통의 대전제 (먼저 마음가짐)</span>
            {CARE_PRINCIPLES.map((p, i) => (
              <div key={i} className="rounded-md border border-border p-3 text-sm leading-relaxed text-foreground">
                {p}
              </div>
            ))}
          </div>

          {/* 우려 유형별 — 이해 + 합리적 설명 */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold">우려 유형별 — 마음을 이해하고, 합리적으로 설명하기</span>
            {CARE_CONCERNS.map((c, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <p className="text-sm font-semibold">{c.label}</p>
                <p className="mt-1.5 rounded-md bg-secondary/40 p-2 text-xs leading-relaxed text-foreground">
                  <span className="font-medium text-primary">먼저 그 마음 · </span>{c.empathize}
                </p>
                <p className="mt-1.5 border-l-2 border-primary/40 pl-3 text-xs leading-relaxed text-muted-foreground">
                  <span className="font-medium text-primary">함께 나눌 설명 · </span>{c.communicate}
                </p>
              </div>
            ))}
          </div>

          {/* 피해야 할 소통 */}
          <div className="rounded-md border border-amber-200 bg-amber-50/40 p-3">
            <p className="text-sm font-semibold text-amber-700">이렇게는 소통하지 않습니다</p>
            <ul className="mt-1.5 flex flex-col gap-1 text-xs leading-relaxed text-foreground">
              {CARE_AVOID.map((a, i) => (
                <li key={i}>· {a}</li>
              ))}
            </ul>
          </div>

          <Note>
            동시에, 가만히 있어도 사라지지 않는 현실(현 예배당의 매각 정황·‘즉시 퇴거’
            특약)은 정직하게 공유합니다. 그래서 <strong>‘준비’는 필요하지만 ‘준비’와
            ‘강행’은 다릅니다.</strong> 오늘 확정된 것은 아무것도 없으며, 공동의회
            가결 전에는 어떤 것도 강제되지 않습니다. 우리가 끝까지 붙들 것은
            <strong> 한 사람도 잃지 않으려는 마음</strong>입니다.
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
              실측 관리비·실견적 금리를 반영하면 이전 시 월 고정비가 약 +160~190만원
              늘어납니다(관리비는 예상보다 높고, 대출 금리는 다소 낮음). 이 증가분을
              어디서 흡수할 수 있는지 사전에 체크하고 구체적으로 이야기할 수 있어야
              성도들이 “감당할 수 있겠구나”라는 확신을 가질 수 있습니다.
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

          {/* 축복교회 관리비 실측 */}
          <div className="rounded-md border border-border p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-semibold">축복교회 관리비·주차비 실측</span>
              <span className="text-xs text-muted-foreground">{BOKBOK_FEE.period}</span>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {BOKBOK_FEE.rows.map((r) => (
                <div key={r.item} className="flex items-baseline justify-between gap-2 rounded-md border border-border/60 px-3 py-2">
                  <div className="flex flex-col">
                    <span className="text-sm">{r.item}</span>
                    <span className="text-[11px] leading-snug text-muted-foreground">{r.desc}</span>
                  </div>
                  <span className="shrink-0 text-sm font-semibold">{r.avg}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-baseline justify-between rounded-md border border-dashed border-primary/40 bg-secondary/40 px-3 py-2 text-sm font-bold">
              <span>월 총 부과액 평균</span>
              <span>{BOKBOK_FEE.total}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{BOKBOK_FEE.note}</p>
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

          {/* 공간 비용 관점 (이지원·이명건 집사 공동 의견) */}
          <div className="rounded-md border border-dashed border-primary/40 bg-secondary/40 p-4 text-sm">
            <p className="mb-2 font-semibold text-primary">공간 비용을 보는 관점 — 인식의 재고 (이지원·이명건 집사 공동 의견)</p>
            <p className="mb-3 text-foreground">
              예산 대비 공간 비용에는 통상적인 건강선이 있습니다. 성도님들의 귀한
              헌금이 목회비·구제·선교에 투명하게 잘 쓰이고 있지만,{" "}
              <strong>성도가 예배당에 와서 예배에 집중할 수 있는 공간을 잘 제공하는
              것도 그에 못지않게 중요</strong>하다는 점이 함께 재고되면 좋겠습니다.
            </p>
            <div className="mb-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {SPACE_COST_BENCH.map((b) => (
                <div key={b.range} className="flex items-baseline gap-2 rounded-md border border-border/60 bg-background px-3 py-2">
                  <span className="shrink-0 text-sm font-semibold text-primary">{b.range}</span>
                  <span className="text-xs text-muted-foreground">{b.meaning}</span>
                </div>
              ))}
            </div>
            <ul className="flex flex-col gap-1 text-foreground">
              <li>· 관악교회 기준(출석 약 110명·연 예산 2.8억 가정): <strong>25%면 연 7,000만 / 월 약 580만</strong>이 공간에 쓰이는 것이 보통 수준</li>
              <li>· 이전 후 예상 공간비용(약 540~575만, 이자 기준)은 <strong>예산의 약 23~25%</strong> — 일반적으로 무리 없는 범위(20~30%)에 해당</li>
              <li>· 현재는 약 16.2%로 <strong>비정상적으로 낮음</strong> — 워낙 저렴한 조건 덕에 공간 예비비로 남았을 금액이 (좋은 곳이지만) 다른 곳에 쓰여 와, 공간 비용 인식이 보수적으로 굳어진 면이 있음</li>
              <li>· 일반 교회 예산 비중 참고: 인건비 45~55% · 시설비 20~25% · 선교/교육 10~20% (관악 현 목회비 55~60%)</li>
            </ul>
            <div className="mt-3 rounded-md border border-border bg-background p-3">
              <p className="text-xs font-medium text-muted-foreground">예상되는 두 관점 (의견이 갈릴 지점)</p>
              <ol className="mt-1 list-decimal pl-4 text-xs leading-relaxed text-foreground">
                <li>예산이 빠듯해 더 높은 지출은 어렵다 — 다른 곳에 쓸 예산을 잠식한다 <span className="text-muted-foreground">(다수 의견 예상)</span></li>
                <li>성도가 많이 늘어난 만큼, 원활한 예배를 위해 공간 비용도 그에 비례해 늘리는 것이 맞다</li>
              </ol>
            </div>
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
                <span>합계 · 월 고정비 약 540~575만원 (관리비 실측 반영)</span>
                <span>12.2억</span>
              </div>
            </div>
          </div>

          {/* 대출 1차 견적 */}
          <div className="rounded-md border border-border p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-semibold">은행 대출 1차 견적 (이지원 집사 확인 중)</span>
              <Badge variant="secondary" className="font-normal">2개 안 · trade-off</Badge>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {LOAN_OPTIONS.map((o) => (
                <div key={o.label} className="flex flex-col gap-1 rounded-md border border-border/70 p-3">
                  <span className="text-sm font-semibold text-primary">{o.label}</span>
                  <span className="text-xs"><span className="text-muted-foreground">금리 </span>{o.rate}</span>
                  <span className="text-xs"><span className="text-muted-foreground">상환 </span>{o.repay}</span>
                  <span className="text-xs"><span className="text-muted-foreground">월 부담 </span><strong>{o.monthly}</strong></span>
                  <span className="text-[11px] leading-snug text-muted-foreground">{o.note}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{LOAN_COMMON}</p>
            <div className="mt-2 rounded-md border border-dashed border-border p-3">
              <p className="text-xs font-medium text-muted-foreground">대출 필요 서류</p>
              <ul className="mt-1 flex flex-col gap-0.5 text-xs text-foreground">
                {LOAN_DOCS.map((d) => (
                  <li key={d.group}>· <span className="font-medium">{d.group}</span> — {d.docs}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 장로님 의견 — 거치 vs 원리금 */}
          <div className="rounded-md border-l-4 border-amber-400 bg-amber-50/40 p-4 text-sm">
            <p className="mb-1 font-semibold text-amber-700">장로님 의견 · 거치는 가능하나 원금 상환은 부담</p>
            <p className="text-foreground">
              간단히 계산했을 때 <strong>거치기간(매월 이자만)은 버틸 수 있으나,
              원리금(원금까지) 상환이 시작되면 현 재정으로는 감당이 어렵다</strong>는
              현실적 진단입니다. 따라서 만기일시(거치)를 택하더라도{" "}
              <strong>만기 시 원금 상환 재원(연보 적립·세입자 확보·장기 계획)을
              반드시 함께 마련</strong>해야 하며, 이것이 자금 조달의 핵심 과제입니다.
            </p>
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

      {/* 3-1. 관악구 새 임대 vs 축복교회 매매 비교 */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <Coin size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">관악구 새 임대 vs 축복교회 매매 — 비용·효과 비교</CardTitle>
            <CardDescription>
              ‘임대로 가면 더 안전하지 않나’라는 물음에 답하기 위해, 축복교회와
              비슷한 규모(전용 약 130~140평급)를 <strong>관악구에 새로 임대</strong>하는
              경우와 <strong>축복교회를 매입</strong>하는 경우를 비교합니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-md border border-dashed border-amber-300 bg-amber-50/40 p-3 text-xs leading-relaxed text-foreground">
            <span className="font-semibold text-amber-700">전제 · </span>
            관악구 임대 수치는 <strong>실제 시세 조사가 없어 ‘가정’</strong>입니다(현 66평 임대 기준을 규모에 맞춰 추정). 매매 수치는 <strong>실견적(대출 5.4~5.7%)·실측(관리비 188만)</strong> 기반입니다. 임대 매물·시세를 실제 조사하면 수치를 확정해 다시 비교할 수 있습니다.
          </div>

          {/* 비용 비교 */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">항목</th>
                  <th className="py-2 pr-3 font-medium">관악구 새 임대 (가정)</th>
                  <th className="py-2 font-medium">축복교회 매매 (실측·견적)</th>
                </tr>
              </thead>
              <tbody>
                {LEASE_VS_BUY_COST.map((r) => (
                  <tr key={r.item} className={`border-b border-border/60 ${r.emph ? "font-semibold" : ""}`}>
                    <td className="py-2 pr-3">{r.item}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{r.lease}</td>
                    <td className="py-2">{r.buy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 효과 비교 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">효과(정성) 비교</span>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">관점</th>
                    <th className="py-2 pr-3 font-medium">임대</th>
                    <th className="py-2 font-medium">매매</th>
                  </tr>
                </thead>
                <tbody>
                  {LEASE_VS_BUY_EFFECT.map((r) => (
                    <tr key={r.aspect} className="border-b border-border/60">
                      <td className="py-2 pr-3 font-medium">{r.aspect}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{r.lease}</td>
                      <td className="py-2 text-foreground">{r.buy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Note>
            핵심은 — <strong>월 현금 부담은 임대(약 550~600만)와 매매(약 540~575만)가
            비슷할 수 있다</strong>는 점입니다. 차이는 ‘남는 것’입니다. 임대는 10년에
            6.5~7억이 <strong>전액 소멸</strong>하고 보증금만 돌아오지만, 매매는 비슷한
            월 부담으로 <strong>건물 자산과 상환 원금이 남고 점유가 영구히 안정</strong>됩니다.
            게다가 관악구 새 임대도 <strong>현 임대의 구조적 불안정(재계약·인상·퇴거)이
            그대로 반복</strong>됩니다. 다만 매매의 리스크(원금 상환 부담·집합건물 환금성)는
            실재하므로, <strong>관악구 임대 실시세를 조사해 수치를 확정한 뒤 최종
            비교</strong>하는 것을 권합니다.
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

      {/* 5-1b. 청년부 사전 설문 */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <UsersThree size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">청년부 사전 설문 — 이전 가/부 의사 (정다은 자매 진행)</CardTitle>
            <CardDescription>
              이전검토위원인 청년부 정다은 자매가 청년부를 대상으로 축복교회 이전
              가·부 의사를 사전 확인 중인 설문입니다. <strong>청년부 한정·비공식·진행
              중</strong> 자료이며 전체 성도 의견 수렴(전도회·온라인)과는 별개의
              참고용입니다. 개인별 응답은 비공개로 하고 집계·주요 의견만 정리합니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">응답 현황 · 총 {YOUTH_SURVEY.total}명</span>
            {YOUTH_SURVEY.rows.map((r) => (
              <div key={r.label} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-sm">{r.label}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full ${
                      r.tone === "ok" ? "bg-emerald-500" : r.tone === "no" ? "bg-red-400" : "bg-muted-foreground/40"
                    }`}
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
                <span className="w-20 shrink-0 text-right text-sm font-semibold">
                  {r.count}명 <span className="font-normal text-muted-foreground">({r.pct}%)</span>
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-md border border-amber-200 bg-amber-50/40 p-3">
            <p className="text-sm font-semibold text-amber-700">거부 사유는 전부 ‘접근성’</p>
            <p className="mt-1 text-xs leading-relaxed text-foreground">{YOUTH_SURVEY.refusalReason}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">주요 의견·질문 (익명)</span>
            {YOUTH_SURVEY.notes.map((n, i) => (
              <p key={i} className="rounded-md border border-border p-2.5 text-xs leading-relaxed text-foreground">
                · {n}
              </p>
            ))}
          </div>

          <Note>
            청년부는 과반(63%)이 수락이나, <strong>거부·대기의 핵심이 ‘거리·교통
            접근성’</strong>입니다 — 셔틀·카풀 등 교통 대책이 청년 출석 유지의
            관건임을 다시 보여줍니다. 다만 청년부 한정·진행 중 표본이므로 전체 성도
            의견과 동일시하지 않도록 주의해 전달합니다.
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
            <CardTitle className="text-base">성도 예상 질문 &amp; 답변 가이드 (20개)</CardTitle>
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
