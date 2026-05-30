import type {
  ChurchStatus,
  Discussion,
  Meeting,
  PastoralNote,
  Property,
  RationaleItem,
} from "./types";

const now = () => new Date().toISOString();

export const CHURCH_STATUS_SEED: ChurchStatus = {
  asOfDate: "2026-04-18",
  dataSourceNote: "교적부 2026-04-18 스냅샷 (memberStatus 제적 55명 제외한 등록 160명 기준)",

  currentSanctuaryPyeong: 60,
  educationSpacePyeong: 0,
  totalSpacePyeong: 0,
  seatCapacity: 0,

  depositKRW: 0,
  monthlyRent: 0,
  monthlyParking: 0,
  monthlyManagement: 0,
  monthlyUtilities: 0,
  monthlyOther: 0,
  otherFixedDescription: "",

  monthlyOfferingAvg: 0,
  offeringPeriodNote: "최근 12개월 평균 기준 권장",

  registeredMembers: 160,
  sundayAttendanceAvg: 0,
  activeMembers: 136,
  inactiveMembers: 24,
  infantsCount: 0,
  elementaryCount: 14,
  middleHighCount: 7,
  youngAdultCount: 47,

  ageUnder10: 4,
  ageTeens: 12,
  ageTwenties: 21,
  ageThirties: 21,
  ageForties: 12,
  ageFifties: 16,
  ageSixties: 9,
  ageSeventyPlus: 5,
  ageUnknown: 60,

  householdCount: 0,
  multiMemberHouseholdCount: 0,

  residentialBreakdown: [
    { id: "area-gwanak", area: "관악구", count: 46 },
    { id: "area-seoul-gangnam", area: "강남구", count: 5 },
    { id: "area-seoul-gangdong", area: "강동구", count: 1 },
    { id: "area-seoul-gangseo", area: "강서구", count: 4 },
    { id: "area-seoul-gwangjin", area: "광진구", count: 1 },
    { id: "area-geumcheon", area: "금천구", count: 1 },
    { id: "area-seoul-nowon", area: "노원구", count: 2 },
    { id: "area-dongjak", area: "동작구", count: 8 },
    { id: "area-seoul-seodaemun", area: "서대문구", count: 4 },
    { id: "area-seoul-seocho", area: "서초구", count: 6 },
    { id: "area-seoul-seongbuk", area: "성북구", count: 1 },
    { id: "area-seoul-songpa", area: "송파구", count: 3 },
    { id: "area-seoul-yangcheon", area: "양천구", count: 1 },
    { id: "area-seoul-yeongdeungpo", area: "영등포구", count: 1 },
    { id: "area-seoul-yongsan", area: "용산구", count: 1 },
    { id: "area-seoul-eunpyeong", area: "은평구", count: 1 },
    { id: "area-seoul-jungnang", area: "중랑구", count: 2 },
    { id: "area-gg-gwangmyeong", area: "광명시", count: 3 },
    { id: "area-gg-goyang", area: "고양시", count: 5 },
    { id: "area-gg-guri", area: "구리시", count: 1 },
    { id: "area-gg-namyangju", area: "남양주시", count: 1 },
    { id: "area-gg-suwon", area: "수원시", count: 5 },
    { id: "area-gg-siheung", area: "시흥시", count: 2 },
    { id: "area-gg-anyang", area: "안양시", count: 2 },
    { id: "area-gg-yongin", area: "용인시", count: 11 },
    { id: "area-gg-uiwang", area: "의왕시", count: 2 },
    { id: "area-gg-hwaseong", area: "화성시", count: 1 },
    { id: "area-other", area: "타 지역 / 미확인", count: 4 },
    { id: "area-missing", area: "주소 미입력", count: 35 },
  ],

  attendanceTrend: "",
  memberGrowthNote:
    "교적부 기준: 전체 215명 중 제적 55명 · 활동 136명 · 비활동 24명. 주소 미입력 35명·나이 미입력 60명으로 정확도 개선을 위해 교적부 정리 병행 필요.",
  spaceConstraintNote:
    "현재 본당 60평이 예배 인원과 다음세대 분반 공간으로는 부족하다는 의견이 지속되어 왔음.",
  demographicsNote:
    "교적부 주소 정밀 분석 결과 (제적 55명 제외, 160명 기준). 관악구 46명(29%)이 가장 많고, 경기 용인시 11명·동작구 8명·서초구 6명·강남구·고양시·수원시 각 5명 순. 경기 거주 34명(21%) 중 상당수가 용인·고양·수원 등 원거리 분산 — 이전 후보지 선정 시 접근성 영향 큼. 주소 미입력 35명은 교적부 보완 필요. 타 지역 4명(충남·전남)은 이전 검토 대상 외. 나이 '미입력' 60명은 교적부 생년월일 보완 필요. 영유아부 department 미지정으로 0으로 표시됨(실제 자녀 존재 시 유초등부 14에 포함 가능).",

  updatedAt: new Date("2026-04-19").toISOString(),
};

export const RATIONALE_SEED: RationaleItem[] = [
  {
    id: "rationale-space",
    title: "물리적 공간 부족과 예배 집중 어려움",
    summary:
      "등록 성도 증가, 영유아 자녀들의 출생과 성장에 따른 물리적 공간 부족과 협소로 인해, 예배 집중 및 설교 청취 어려움 현상 지속.",
    evidence:
      "최근 3년간 출석 인원 추이, 주일 본당 좌석 점유율, 영유아실 공간 부족 사례.",
    counterpoints:
      "시간대를 나눠 2부 예배로 해결 가능하지 않은가? 공간 때문이 아니라 정착 문화 때문 아닌가?",
    responses:
      "2부 예배는 한 공동체로서의 예배 경험을 약화시키고, 다음세대 분반 공간은 시간대 분산으로 해결되지 않음.",
    empathy: "high",
    updatedAt: now(),
  },
  {
    id: "rationale-market",
    title: "월세 급등과 예배당 확보 불안정",
    summary:
      "서울 소재 고신총회 교회들 중 월세 급등으로 예배당을 얻지 못하여 성도들이 함께 모여 예배 드리지 못하는 이슈 발생.",
    evidence:
      "서울 상업용 임대료 동향, 고신총회 소속 서울 교회 이전·폐쇄 사례, 김재윤 교수 서면 권면.",
    counterpoints:
      "아직은 우리가 감당할 수 있는 수준 아닌가? 매매보다 임대가 유연하지 않은가?",
    responses:
      "현재는 감당 가능하지만 5~10년 뒤 상승 리스크가 크고, 예배 공간은 구조물 투자가 필수라 임대는 매몰비용. 월세를 10년만 계산해도 5억에 가깝다.",
    empathy: "high",
    updatedAt: now(),
  },
  {
    id: "rationale-building-safety",
    title: "건물 노후화·엘리베이터 부재",
    summary:
      "건물 노후화로 안전 우려 및 엘리베이터 부재로 연로/장애 성도들의 예배 참여 어려움.",
    evidence:
      "현 건물 준공연도, 노후화 현황 사진, 3층까지 계단 이용 필수인 구조, 연로 성도 출석 현황.",
    counterpoints:
      "다른 방법(리프트 설치 등)으로 해결 가능하지 않은가?",
    responses:
      "임대 건물에 리프트 설치는 건물주 승인 필요 + 비용 대비 효과 미미. 근본적으로 엘리베이터가 있는 공간으로 이전하는 것이 바람직.",
    empathy: "high",
    updatedAt: now(),
  },
  {
    id: "rationale-parking",
    title: "주차 불가와 건물주 갈등",
    summary:
      "건물 주차 불가에 따른 주차비 추가 지출, 성도 및 방문자 주차 불편 및 건물주와의 갈등 발생.",
    evidence:
      "현 예배당 주차 불가 현황, 월 주차비 지출 내역, 건물주와의 주차 관련 분쟁 이력.",
    counterpoints:
      "주차비를 지불하면 해결 가능한 문제 아닌가?",
    responses:
      "주차비 지출이 교회 재정에 부담이 되고, 건물주와의 갈등이 예배 환경에 부정적 영향. 방문자·신규 성도 유입에도 장벽.",
    empathy: "high",
    updatedAt: now(),
  },
  {
    id: "rationale-lease-risk",
    title: "건물 매매에 따른 계약 불확실성",
    summary:
      "건물주 사정에 의해 예배당을 포함한 상가 건물이 매매로 나온 상태 확인. 매각될 경우, 2년 후 새 주인과의 월세 계약 불확실성 증가.",
    evidence:
      "건물 매매 공고 확인, 상가건물 임대차보호법상 권리 범위, 현 임대차 계약 잔여기간.",
    counterpoints:
      "재계약 4년이 남아 있으니 서두를 필요 없지 않은가? 새 건물주와 협상 가능하지 않은가?",
    responses:
      "시간 여유가 있을 때 여유롭게 좋은 공간을 찾는 것이 오히려 성숙한 선택이며, 새 소유자의 의도는 우리가 통제할 수 없음. 매각 후 명도 리스크는 현실적 위협.",
    empathy: "high",
    updatedAt: now(),
  },
];

export const MEETINGS_SEED: Meeting[] = [
  {
    id: "meeting-2026-04-18-first",
    date: "2026-04-18",
    location: "관악교회",
    attendees: "이전검토준비위원회 위원",
    agenda: `1. 준비위원회 발족 취지 공유
2. 이전의 필요성에 대한 의견 나눔
3. 찾은 물건지 하나 공유 (금천구 구 축복교회 자리)
4. 앞으로의 진행 방향과 원칙`,
    discussion: `# 회의 진행 내용

차승회 장로의 예배당 이전 준비위원들을 소집하고 위원회 발족의 취지와 방향을 이야기하다.

필요성에 대한 논의와 성도들의 의견을 취합하여 교회에 보고함이 필요하다.

현재 금천구 축복교회 물건에 대해 공유하다.

14억 매매 — 은행 대출 가능 유무와 대출 비율을 고려했을 때 남은 잔금의 지불 가능 여부와 방법에 대해서 논의하다.

성도들이 이 과정에서 마음이 불편하거나 어려움을 느끼시거나 잔금이 모여지지 않는다면 하나님께서 원하시지 않는 것으로 생각해야 할 수도 있다고 이야기하다.

최형호 형제가 여러 상황으로 결국 이전을 못 가게 되었을 때 플랜 B는 무엇인지 문의하다 → 다른 임대 장소 혹은 매매 장소를 여기 위원들 중심으로 지속적으로 찾아볼 것이다.

차승회 장로가 현재 지역 중심, 특별히 관악구 중심에서 교회를 이루어 가서 이름도 관악교회인데 관악구를 벗어나는 것과 더 멀리 서울을 떠나 경기도 쪽으로도 이동이 가능할지 여부를 논의해보자고 하다.

정다은 자매가 관악구 내에서 교회에 출석하는 비율에 대한 조사와 그들이 새로 옮겨지는 교회로 차량 이동이 가능할지 여부가 중요할 것 같다고 의견을 제시하다.

지역을 옮기는 것에 대해 이후에 좀 더 논의를 계속 이어가고 고도화 하자고 이야기하다.

최형호 형제가 현재 교역자분들의 사역비용도 매년 동결로 알고 있는데 교회 이전에 필요한 자금 마련이 될지, 되더라도 교회 운영에 현금 흐름에 어려움이 생기는 건 아닌지 염려에 대해 이야기하다.

차승회 장로가 교역자분들의 사역비용이 매년 동결한다고 이야기하신 것은 사실과 다르다고 이야기하다. 부교역자 분들의 사역비가 매년 상승하고 있으며, 주 교역자이신 유해신 담임목사님의 경우 중고등학교 선생님의 급여 수준 정도와 맞춰서 드리고자 노력하고 그렇게 하고 있으며, 현재 연세가 많아지셔서 임금피크 형태로 동결된 것이라 답변하다.

교회가 재정적인 어려움에 치닫으면서까지 옮기는 것은 적절하지 않아 그런 상황이라면 진행하지는 않을 것이라고 이야기하고, 현재 재정 상황은 염려하는 상황으로 가진 않을 것으로 보인다고 답변하다.

이명건 집사가 회의마다 회의록을 작성하기로 하다.

금천구 축복교회에 실사를 이지원 집사가 먼저 다녀와 보기로 하다.

실사를 다녀오고 대출 실행 가능 여부 등이 좀 더 구체화 되면 다시 공유하기로 하다.

이명건 집사가 개별적으로 은행에 대출 실행 가능 여부를 문의하였고 진행 상황을 위원회에 공유하기로 하다.

새로운 매물도 지속해서 찾아보기로 하고, 차승회 장로가 "무엇보다 결과는 이미 하나님께서 주셨을 텐데 이 과정이 정말 중요할 것"이라고 이야기하다. 과정 가운데에서 하나님의 뜻을 구하고 성도를 사랑하고 다음 세대를 이어 이 말씀 공동체를 이어가길 소망하는 마음으로 겸손하게 준비하자고 이야기하며 기도로 회의를 마치기로 하다.

---

# 이전을 위해 고려했던 요소 (회의에서 정리)

1) **지역 범위** — 관악교회라는 이름의 정체성을 고려해 가능하면 관악구 내, 멀어도 금천구 등 인접지역으로 한정. (추후 경기권 가능성 포함해 계속 논의)
2) **층수** — 지하, 1층을 제외한 건물 상층부.
3) **면적 기준** — 현재 예배당 본당 전용이 60평. 옮기는 의미가 있으려면 단층 80~90평 이상이 되어야 함.
4) **추가 비용** — 대부분의 상가·물건이 교회 용도가 아니므로 인테리어·가구 구매 등 추가 비용 발생 전제.
5) **임대인 수용 여부** — 임대인이 종교시설을 원하지 않는 경우가 많으므로 사전 확인 필수.
6) **주차·엘리베이터** — 고령 성도님들을 고려한 엘리베이터, 성도·외부인 주차 공간.
7) **향후 확장 가능성** — 해당 건물 내에서 공간을 더 넓혀갈 가능성이 있는지 검토.
8) **교통 편의성** — 성도 접근성·대중교통. 관악구 내 성도 거주·교통 접근성 조사 필요.

# 물건지 공유

- 금천구 구 축복교회 자리 (매매 14억 / 2층 전체 140평 / 엘리베이터 있음 / 교회 기물 전부 인수 조건)
- 실사는 아직 본격적으로 진행 전. 이지원 집사가 먼저 방문, 이후 서류 실사 순으로 진행 예정.

# 진행 방향에 대한 합의

- 재계약 4년이 남아 있으니 **쫓기지 않고** 여러 매물을 충분히 검토.
- 결정 과정은 **투명하게**, 당회·제직회·설명회·간담회 여러 회차로 소통.
- **성도 한 사람도 소외되거나 마음 상하지 않는 이전**을 대원칙으로 삼음.
- **재정적 어려움으로 치닫는 이전은 진행하지 않는다.** 잔금이 모이지 않거나 성도가 무리하게 되는 상황이면 하나님의 뜻이 아닐 수 있음을 함께 분별한다.`,
    decisions: `- 준비위원회 정기 회의 운영 시작.
- 위 8개 요소를 향후 매물 평가의 기준으로 사용.
- 금천구 물건지는 이지원 집사 현장 방문 → 서류 실사 단계로 진행.
- 이명건 집사가 매 회의 회의록을 작성.
- 이명건 집사가 개별 은행에 대출 실행 가능 여부를 문의하고 위원회에 공유.
- 지역 범위(관악구 외·경기권)와 성도 거주·차량 이동 가능성은 다음 회의 이후 계속 논의·고도화.
- 재정적 무리·현금 흐름 악화로 이어지는 이전은 진행하지 않는다는 원칙 합의.
- 필요성·논의·매물 진행 상황을 본 대시보드에 축적해가며 고도화.`,
    actions: [
      {
        id: "action-2026-04-18-site-visit",
        title: "금천구 축복교회 현장 실사 방문",
        owner: "이지원 집사",
        dueDate: "2026-04-30",
        done: false,
      },
      {
        id: "action-2026-04-18-bank-loan",
        title: "은행 대출 실행 가능 여부 문의 및 진행 상황 공유",
        owner: "이명건 집사",
        dueDate: "2026-04-30",
        done: false,
      },
      {
        id: "action-2026-04-18-minutes",
        title: "매 회의 회의록 작성",
        owner: "이명건 집사",
        dueDate: "",
        done: false,
      },
      {
        id: "action-2026-04-18-district-study",
        title: "관악구 내 성도 거주·출석 비율 및 차량 이동 가능성 조사",
        owner: "정다은 자매",
        dueDate: "",
        done: false,
      },
      {
        id: "action-2026-04-18-new-listings",
        title: "새로운 매물 지속 탐색 및 공유",
        owner: "위원회 전체",
        dueDate: "",
        done: false,
      },
    ],
    notes: "",
    createdAt: "2026-04-18T00:00:00.000Z",
    updatedAt: "2026-04-18T00:00:00.000Z",
  },
];

export const PASTORAL_NOTES_SEED: PastoralNote[] = [
  {
    id: "pastoral-kimjaeyun-2026-04",
    title: "서울 임대 교회 현실과 다음 세대를 위한 결단",
    author: "김재윤 교수",
    role: "고신대학교",
    context: "제직회 톡방에 공유해주신 목회적 권면 (2026-04)",
    content: `예배당 이전과 관련하여 좀 간곡한 말씀을 올립니다. 최근 서울 소재 고신교회중 상가임대 상황중 어려움을 겪는 교회들이 있습니다. 오랜기간 관계를 맺었던 임대인의 세대교체 곧 사망후 상속세 납부를 위해서 건물 자체가 매각되거나 임대료 상승이 가파른 경우들입니다.

문제는 이런 교회들이 교회 존립을 위협 받을 정도로 대체 장소를 구하기가 쉽지 않다는 것입니다.

우리교회가 사용하는 장소도 앞으로 여러 변화에 내몰릴 수 있습니다. 현재 임대인이 언제까지 생존할지도... 서울지역은 아파트 한 채 가격만해도 10억을 쉽게 부르는 도시입니다. 이런 곳에서 장소를 확보하는건 교회 존립과도 직결된 문제입니다.  지금 지불하는 월세도 10년을 계산하면 5억에 가깝습니다. 매입을해서 이자와 원금을 갚아가면 장소가 남지만 월세는 없어지는 돈입니다.

심각해지는 서울의 임대상황을 두고 계속 임대로 있는것은 교회존립과 연결된 문제라고 많은 서울지역 교회들이 인식하고 있습니다. 우리자녀들을 생각하면 꼭 생각해 볼 문제입니다.`,
    receivedAt: "2026-04",
    updatedAt: "2026-04-19T00:00:00.000Z",
  },
];

export const PROPERTIES_SEED: Property[] = [
  {
    id: "property-chukbok",
    name: "에벤에셀프라자 (구 축복교회)",
    address: "서울 금천구 금하로 720 6층",
    district: "금천구",
    price: 1_200_000_000,
    sizePyeong: 137,
    floor: "6층",
    elevator: true,
    parking: "기본 2대 / 상가 주차장 시간당 500원 (현 대비 1/4), 동일 상가 내 주차 가능",
    useType: "일반 상가 (현 축복교회 예배당으로 사용 중)",
    previousTenant: "축복교회 (예배당 시설·집기 그대로 유지 중)",
    fixtures: "본당·영유아실·교육관·주방/식당·교역자실·창고 등 공간/시설/집기 모두 곧바로 사용 가능. 인테리어 추가 비용 거의 없음.",
    pros: "축복교회 예배당 시설 그대로 사용 가능, 인테리어 추가 비용 없음. 본당·영유아실·교육관·주방/식당·교역자실·창고 공간이 잘 나뉘어져 있음. 상가 엘리베이터 이용 가능하여 주차부터 예배당까지 안전한 출입. 주차비 현 대비 1/4 수준.",
    cons: "관악교회→자가용 20분 거리. 금천구청역→버스 15분/도보 30분으로 근처 역에서 상대적 거리 멂. 주차비 여전히 발생 (시간당 500원).",
    status: "selected",
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
      {
        id: "dd-financing",
        label: "금융권 감정평가 및 대출 가능 비율",
        category: "재정",
        status: "pending",
        note: "농협 잠정 감정평가액 약 13억 (구두). 대출 60% 수준 가능 전망. 교회 재정 상세 자료 제출 후 확정. 타 은행도 접촉 중.",
      },
      {
        id: "dd-cashflow",
        label: "현 교육관·예배당 월세·보증금·주차비 대비 월 상환액 비교",
        category: "재정",
        status: "pending",
        note: "현 임대 비용 + 주차비 총합 대비 원리금 상환 수준을 시뮬레이션해 감당 가능성 판단.",
      },
      {
        id: "dd-price-negotiation",
        label: "매매가 협상 범위 (기물 인수 조건 포함 14억 호가)",
        category: "계약",
        status: "pending",
        note: "기존 교회 기물 전부 인수 조건으로 14억 호가. 일부 조정 여지 있음 — 최종 매도 희망가 확인.",
      },
    ],
    visits: [],
    photos: [
      "/properties/chukbok-01.png",
      "/properties/chukbok-02.png",
      "/properties/chukbok-03.jpeg",
      "/properties/chukbok-04.jpeg",
      "/properties/chukbok-05.jpeg",
      "/properties/chukbok-06.jpeg",
      "/properties/chukbok-07.jpeg",
      "/properties/chukbok-08.jpeg",
      "/properties/chukbok-09.jpeg",
      "/properties/chukbok-10.jpeg",
      "/properties/chukbok-11.jpeg",
      "/properties/chukbok-12.jpeg",
      "/properties/chukbok-13.jpeg",
      "/properties/chukbok-14.jpeg",
      "/properties/chukbok-15.jpeg",
      "/properties/chukbok-16.jpeg",
      "/properties/chukbok-17.jpeg",
      "/properties/chukbok-18.jpeg",
      "/properties/chukbok-19.jpeg",
    ],
    financingNotes: `## 자금조달 계획 (2026-05-31 위원회 활동 보고)

### 총 예상비용: 12.2~12.9억원
- **매수가격**: 12억원
- **취득록세**: 6,440만원 (면제 가능성 확인 중 — 지방세특례제한법 제4절 제50조 1항, 종교단체 예배용 부동산 취득세 면제)
- **부동산 수수료**: 1,400만원 (VAT 포함)
- **기타 (이사비 등)**: 500만원

### 자금 구성
- **자본금**: 약 2억원 (예배당/교육관)
- **연보**: 약 1억원 (미정)
- **차입금**: 9.2~11.2억원
  - 은행: 7.2억원 (매매가 60% 대출 가능, 실제 심사 후 규모/금리 확정)
  - 기타: 4억원 (타 교회 등 가능한 방법 고려 중)
  - 현 예배당 세입자를 찾을 경우 2억원으로 줄며, 실제 연보규모와 함께 검토

### 향후 일정
1. 1차 설명회(5/31) 후 성도 의견 취합 (~6월 1주차)
2. 2차 설명회(6/14) — 성도 의견 반영 및 문제점 해결방안, 자금상환계획 보고
3. 임시 당회 후 공동의회 일정 광고
4. 공동의회(미정) — 예배당 이전/물건 매입 결정, 연보(무기명) 금액 작성/취합
5. 가결 시, 예배당이전위원회로 명칭 변경 및 자금조달 계획 실행
6. 기타 차입금 및 연보 액수 부족 시, Plan B 보고 후 재추진 여부 논의`,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "property-seohae",
    name: "서해아파트 상가",
    address: "경기도 안양시 만안구 석수동 293-4 3층",
    district: "안양시",
    price: 1_100_000_000,
    sizePyeong: 150,
    floor: "3층",
    elevator: false,
    parking: "기본 10대 / 화창초교 공용 시간당 1,000원 (현 대비 1/2)",
    useType: "일반 상가 (제2종 근린생활시설 — 종교집회장 용도변경 필요)",
    previousTenant: "헬스장 (현 임차인 임대료 미납 중, 보증금 5천만원 모두 소진)",
    fixtures: "현 헬스장 시설 철거 필요. 헬스기구 철거 가능 여부 불투명. 원상복구 후 예배당 공사 필요 — 계약 및 비용 리스크 큼.",
    pros: "가격 저렴 및 전용면적 더 큼 (150평/11억). 근처 역으로부터의 접근성 좋음 (관악역→버스 10분/도보 20분).",
    cons: "건축물 용도 변경 필요 (제2종 근린생활시설→종교집회장). 현 헬스장 임차인 임대료 미납·보증금 소진으로 헬스기구 철거 가능 여부 불투명. 원상복구 후 예배당 공사 비용 리스크 큼. 공간 설계비/예배당 시설 구입비 추가. 상가 엘리베이터 없음.",
    status: "rejected",
    contact: "",
    link: "",
    dueDiligence: [],
    visits: [],
    photos: [],
    financingNotes: "위원회 검토 결과 에벤에셀프라자 대비 리스크 과다로 탈락. 1억 저렴하고 면적이 크지만, 용도변경·임차인 분쟁·철거·공사 비용 등 불확실성이 너무 큼.",
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
