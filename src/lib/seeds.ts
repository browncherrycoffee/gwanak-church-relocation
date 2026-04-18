import type {
  Discussion,
  Meeting,
  Property,
  RationaleItem,
} from "./types";

const now = () => new Date().toISOString();

export const RATIONALE_SEED: RationaleItem[] = [
  {
    id: "rationale-space",
    title: "예배 공간 대비 인원 증가",
    summary:
      "현재 신림동 예배당이 주일 예배 인원을 수용하기에 협소해지고 있습니다.",
    evidence:
      "최근 3년간 출석 인원 추이, 주일 본당 좌석 점유율, 2부 예배 필요성 검토 자료.",
    counterpoints:
      "시간대를 나눠 2부 예배로 해결 가능하지 않은가? 공간 때문이 아니라 정착 문화 때문 아닌가?",
    responses:
      "2부 예배는 한 공동체로서의 예배 경험을 약화시키고, 다음세대 분반 공간은 시간대 분산으로 해결되지 않음.",
    empathy: "unknown",
    updatedAt: now(),
  },
  {
    id: "rationale-nextgen",
    title: "다음세대·영유아 공간 부족",
    summary:
      "출산 가정이 늘어나며 영유아실·주일학교 분반 공간이 현재 구조로는 부족합니다.",
    evidence:
      "최근 3년간 출생·출석 아동 수, 현재 주일학교 분반 공간 사진·배치도.",
    counterpoints:
      "가변형 파티션으로 해결 가능하지 않은가? 자녀 많은 가정이 얼마나 늘었는가?",
    responses:
      "파티션은 임시 대응일 뿐 소음·동선·안전 측면에서 지속 가능 해결이 아님.",
    empathy: "unknown",
    updatedAt: now(),
  },
  {
    id: "rationale-market",
    title: "임대료 상승과 교회 임대 기피 문화",
    summary:
      "서울 임대료 상승과 종교시설 임대 기피 분위기가 심화되어 장기 임대로 공간을 유지하기 어려워지고 있습니다.",
    evidence:
      "서울 상업용 임대료 동향, 최근 주변 교회 이전·폐쇄 사례.",
    counterpoints:
      "아직은 우리가 감당할 수 있는 수준 아닌가? 매매보다 임대가 유연하지 않은가?",
    responses:
      "현재는 감당 가능하지만 5~10년 뒤 상승 리스크가 크고, 예배 공간은 구조물 투자가 필수라 임대는 매몰비용.",
    empathy: "unknown",
    updatedAt: now(),
  },
  {
    id: "rationale-lease-risk",
    title: "현 공간의 계약상 불안정성",
    summary:
      "10년 임대 후 4년 재계약을 체결했으나 이후 재계약 보장이 없고, 건물이 매매로 나와 있어 명도 리스크가 존재합니다.",
    evidence:
      "임대차 계약서, 건물 매매 공고, 상가건물 임대차보호법상 권리 범위.",
    counterpoints:
      "재계약 4년이 남아 있으니 서두를 필요 없지 않은가? 새 건물주와 협상 가능하지 않은가?",
    responses:
      "시간 여유가 있을 때 여유롭게 좋은 공간을 찾는 것이 오히려 성숙한 선택이며, 새 소유자의 의도는 우리가 통제할 수 없음.",
    empathy: "unknown",
    updatedAt: now(),
  },
  {
    id: "rationale-mission",
    title: "다음세대 성도를 위한 기틀 마련",
    summary:
      "관악교회의 예배 공간을 안정적으로 확보하여 다음세대가 교회를 누리고 이끌 수 있는 기반을 마련합니다.",
    evidence:
      "10년 이상 장기 공간 계획, 교육관·친교실·영유아실 구성 청사진.",
    counterpoints:
      "미래를 위해 현재 세대가 무리한 부담을 지는 것 아닌가? 교회의 본질은 공간이 아닌데?",
    responses:
      "무리한 부담이 되지 않는 범위에서만 추진하며, 공간은 본질이 아니나 본질을 담아내는 그릇이라는 점을 잊지 않음.",
    empathy: "unknown",
    updatedAt: now(),
  },
];

export const MEETINGS_SEED: Meeting[] = [];

export const PROPERTIES_SEED: Property[] = [
  {
    id: "property-chukbok",
    name: "금천구 축복교회 자리",
    address: "서울특별시 금천구 (상세 주소 확인 필요)",
    district: "금천구",
    price: 1_400_000_000,
    sizePyeong: 140,
    floor: "2층 (전체)",
    elevator: true,
    parking: "확인 필요",
    useType: "교회 용도로 사용되던 공간 (용도지역·건축물대장 재확인)",
    previousTenant: "축복교회 (이전 사유 교계 인맥으로 교차 확인 필요)",
    fixtures: "기존 교회 기물 인수 가능성 있음 — 품목·감정가·조건 확인 필요",
    pros: "교회 용도로 사용되던 공간이라 리모델링 부담 상대적으로 적음. 엘리베이터 있음. 140평 통째로 단일층 구성.",
    cons: "위치가 관악구에서 금천구로 변경되어 성도 접근성 재평가 필요. 구 축복교회 이전 배경 확인 필요.",
    status: "reviewing",
    contact: "",
    link: "",
    dueDiligence: [
      {
        id: "dd-registry",
        label: "등기부등본 (근저당·가압류·소유권 이력)",
        category: "서류",
        status: "pending",
        note: "",
      },
      {
        id: "dd-building-ledger",
        label: "건축물대장 (용도·위반건축물 여부)",
        category: "서류",
        status: "pending",
        note: "",
      },
      {
        id: "dd-zoning",
        label: "용도지역 및 종교시설 허용 여부",
        category: "서류",
        status: "pending",
        note: "",
      },
      {
        id: "dd-fire",
        label: "소방·피난 시설 (2방향 비상계단, 스프링클러, 유도등)",
        category: "안전",
        status: "pending",
        note: "",
      },
      {
        id: "dd-parking",
        label: "주차 대수 (법정 기준 대비 확보량)",
        category: "인프라",
        status: "pending",
        note: "",
      },
      {
        id: "dd-downstairs",
        label: "아래층 업종 (소음·진동·영업시간 충돌)",
        category: "환경",
        status: "pending",
        note: "",
      },
      {
        id: "dd-structure",
        label: "건물 구조 안전 (찬양·집회 진동 하중)",
        category: "건축",
        status: "pending",
        note: "",
      },
      {
        id: "dd-hvac",
        label: "냉난방 용량 140평 기준 적정성",
        category: "설비",
        status: "pending",
        note: "",
      },
      {
        id: "dd-electric",
        label: "전기 용량 및 승압 필요 여부",
        category: "설비",
        status: "pending",
        note: "",
      },
      {
        id: "dd-elevator",
        label: "엘리베이터 준공연도·정밀안전검사·교체주기",
        category: "설비",
        status: "pending",
        note: "",
      },
      {
        id: "dd-leak",
        label: "누수·결로·단열·외벽 상태",
        category: "건축",
        status: "pending",
        note: "",
      },
      {
        id: "dd-fixtures",
        label: "기물 인수 품목·감정가·조건",
        category: "계약",
        status: "pending",
        note: "",
      },
      {
        id: "dd-previous",
        label: "구 축복교회 이전 배경 교차 확인",
        category: "확인",
        status: "pending",
        note: "",
      },
      {
        id: "dd-access",
        label: "대중교통 접근성 (지하철·버스 도보 시간)",
        category: "위치",
        status: "pending",
        note: "",
      },
    ],
    visits: [],
    createdAt: now(),
    updatedAt: now(),
  },
];

export const DISCUSSIONS_SEED: Discussion[] = [
  {
    id: "discussion-region",
    question:
      "관악교회라는 이름과 역사를 고려할 때, 예배당 이전 범위는 어디까지 허용될까?",
    background:
      "관악구에서 지역 교회로 시작한 역사적 뿌리와, 현실적으로 적합한 매물을 찾기 위한 지리적 유연성 사이의 균형.",
    arguments: [
      {
        id: "arg-region-1",
        stance: "pro",
        author: "",
        content:
          "관악구 내에서 유지하는 것이 역사적 정체성·지역 선교에 부합.",
        createdAt: now(),
      },
      {
        id: "arg-region-2",
        stance: "consider",
        author: "",
        content:
          "서울 서남권(관악·금천·영등포·구로·동작) 정도까지는 현실적으로 허용 가능한 범위일 수 있음.",
        createdAt: now(),
      },
      {
        id: "arg-region-3",
        stance: "con",
        author: "",
        content:
          "경기 외곽은 성도 접근성·도시 선교 기반이 크게 약화되어 신중해야 함.",
        createdAt: now(),
      },
    ],
    tentativeConclusion:
      "1순위: 관악구 내 / 2순위: 서울 서남권 인접 구 / 3순위: 서울 내 타 권역 — 경기 외곽은 예외적 상황에서만 검토.",
    status: "open",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "discussion-budget",
    question:
      "매매가 상한선을 어디까지 허용할 것인가? 대출 비율은 어디까지가 건강한가?",
    background:
      "재정 감당 가능성과 매물 선택의 폭 사이의 긴장. 월 상환금이 헌금 규모에서 차지하는 비율의 상한.",
    arguments: [
      {
        id: "arg-budget-1",
        stance: "pro",
        author: "",
        content:
          "대출 60%, 월 상환이 헌금의 30% 이내 수준까지는 수용 가능.",
        createdAt: now(),
      },
      {
        id: "arg-budget-2",
        stance: "con",
        author: "",
        content:
          "월 상환 30%는 다른 사역(선교·구제·교육) 여력을 크게 제약하므로 20% 이내로 제한해야 함.",
        createdAt: now(),
      },
    ],
    tentativeConclusion: "",
    status: "open",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "discussion-timing",
    question:
      "현 공간 재계약이 4년 남은 상황에서 이전 시점은 언제가 적절한가?",
    background:
      "시간 여유를 활용한 여유로운 결정 vs. 시장 상황과 적합한 매물의 타이밍.",
    arguments: [
      {
        id: "arg-timing-1",
        stance: "pro",
        author: "",
        content:
          "재계약 기간 내 여유롭게 2~3년에 걸쳐 결정하는 것이 건강함.",
        createdAt: now(),
      },
      {
        id: "arg-timing-2",
        stance: "consider",
        author: "",
        content:
          "적합한 매물을 만나면 시점과 무관하게 신속한 결단이 필요할 수 있음.",
        createdAt: now(),
      },
    ],
    tentativeConclusion: "",
    status: "open",
    createdAt: now(),
    updatedAt: now(),
  },
];
