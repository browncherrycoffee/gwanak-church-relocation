export const SITE_CONFIG = {
  name: "관악교회 예배당 이전 대시보드",
  short: "이전 대시보드",
  description:
    "관악교회 예배당 이전 준비 과정을 기록·고도화하기 위한 준비위원회 대시보드",
  url: "https://gwanak-relocation.vercel.app",
  moto: "모여서 함께 예배, 흩어져 삶의 예배",
  church: "관악교회",
} as const;

export type NavItem = {
  href: string;
  label: string;
  short: string;
  description: string;
};

export const NAV: NavItem[] = [
  { href: "/", label: "홈", short: "홈", description: "전체 현황 요약" },
  {
    href: "/story",
    label: "이전 이야기",
    short: "이야기",
    description: "성도 누구나 보는 단계별 안내",
  },
  {
    href: "/briefing",
    label: "보고 브리핑",
    short: "브리핑",
    description: "핵심 쟁점 · 예상 질문 · 보고 체크리스트",
  },
  {
    href: "/status",
    label: "교회 현황",
    short: "현황",
    description: "공간·고정비·헌금·인원 객관 데이터",
  },
  {
    href: "/rationale",
    label: "이전의 필요성",
    short: "필요성",
    description: "근거 · 반론 · 답변 · 공감 추적",
  },
  {
    href: "/meetings",
    label: "회의록",
    short: "회의록",
    description: "준비위원회 회의 기록",
  },
  {
    href: "/properties",
    label: "매물",
    short: "매물",
    description: "후보 매물 등록과 검증",
  },
  {
    href: "/discussions",
    label: "논의 주제",
    short: "논의",
    description: "논제별 찬반 고도화",
  },
];

export const STORAGE_PREFIX = "gwanak-relocation::";

export const COMMITTEE_CHARTER = {
  preamble:
    "예배당 이전을 위해 관악교회 당회는 예배당이전검토위원회(이하 '위원회')의 구성 등에 관하여 다음과 같이 결의하다.",
  composition: {
    title: "구성",
    summary: "장로 1명, 제직 3명, 각 전도회별 회장 6명, 청년부 헬퍼 2명 등 총 10명 내외의 위원으로 구성한다.",
    members: [
      { role: "장로", count: 1 },
      { role: "제직", count: 3 },
      { role: "각 전도회별 회장", count: 6 },
      { role: "청년부 헬퍼", count: 2 },
    ],
    total: "총 10명 내외",
  },
  duties: {
    title: "임무",
    intro:
      "위원회는 당회의 자문에 응하여 예배당 이전에 대한 다음 임무를 수행한다.",
    items: [
      "예배당 이전에 대한 성도들의 의견 수렴",
      "예배당 이전 장소의 발견",
      "이에 대한 의견의 교환",
      "활동 내역의 제직회에의 설명",
      "예배당 이전에 관한 당회 결의를 얻기 위한 당회에의 보고",
    ],
  },
} as const;
