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
