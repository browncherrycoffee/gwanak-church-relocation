"use client";

import {
  ArrowDown,
  Buildings,
  Calendar,
  CheckCircle,
  Coin,
  Elevator,
  HandHeart,
  Heart,
  HouseLine,
  MapPin,
  Quotes,
  ShieldCheck,
  UsersThree,
  Warning,
  WarningCircle,
} from "@phosphor-icons/react";
import { SITE_CONFIG } from "@/lib/constants";

// 큰 글씨·쉬운 말로, 위에서 아래로 한 번에 읽는 전 성도용 안내 페이지.

const CORE_FACTS = [
  "법적으로 보장됐던 최초 10년 계약 기간은 이미 지났습니다. 지금은 ‘재연장’ 상태로 약 3년이 남아 있을 뿐입니다.",
  "그 3년조차 안전하지 않습니다 — 계약서 특약상 매각 후 철거(신축)가 결정되면 만료 전이라도 즉시 퇴거해야 합니다. 이미 건물이 100억에 매물로 나왔고, 90억에 사겠다는 사람도 나타났습니다(건물주는 100억 이하 거절).",
  "설령 매각이 이루어지지 않더라도, 재연장 3년이 끝난 뒤 다시 재계약된다는 보장은 어디에도 없습니다.",
];

const NEEDS = [
  { icon: <UsersThree size={26} />, title: "이미 포화 상태입니다", desc: "실제 예배 공간은 40~45평뿐인데, 늦게 오시는 분은 문 앞까지 간이 의자로 앉아 예배드립니다. 뒤쪽은 어수선하고 아이 울음소리에 집중이 어렵습니다. 감사하게도 여러 가정에 새 생명이 계속 태어나 몇 년 뒤엔 더 비좁아지고, 새로 찾아오시는 분들을 맞이하기도 어렵습니다." },
  { icon: <Elevator size={26} />, title: "엘리베이터가 없습니다", desc: "3층까지 계단뿐이라 연로하신 분·몸이 불편하신 분이 예배하러 오시기 힘듭니다." },
  { icon: <Buildings size={26} />, title: "건물이 오래되고 주차가 안 됩니다", desc: "노후로 안전이 걱정되고, 주차가 안 돼 매달 주차비를 따로 내며 건물주와 갈등도 있습니다." },
  { icon: <Coin size={26} />, title: "월세는 사라지는 돈입니다", desc: "지금 내는 월세·관리비·주차비는 10년이면 약 5억인데, 모두 남지 않고 사라집니다." },
];

const PASTOR = {
  who: "김재윤 교수님 · 고신대학교",
  when: "2026년 4월, 제직회에 보내주신 권면",
  lead: "예배당 이전과 관련하여 좀 간곡한 말씀을 올립니다.",
  body: [
    "최근 서울 고신교회 중 상가 임대에 어려움을 겪는 교회들이 있습니다. 오래 관계를 맺던 임대인이 세상을 떠난 뒤 상속세 때문에 건물이 팔리거나, 임대료가 가파르게 오르는 경우입니다.",
    "문제는 이런 교회들이 대체 장소를 구하기가 쉽지 않아 교회 존립까지 위협받는다는 것입니다.",
    "우리 교회가 쓰는 장소도 앞으로 여러 변화에 내몰릴 수 있습니다. 서울에서 장소를 확보하는 것은 교회 존립과 직결된 문제입니다.",
  ],
  highlight: "지금 내는 월세도 10년이면 5억에 가깝습니다. 매입을 해서 이자와 원금을 갚아가면 장소가 남지만, 월세는 없어지는 돈입니다. 우리 자녀들을 생각하면 꼭 함께 생각해 볼 문제입니다.",
};

const CONTRACT = [
  { label: "‘신축 시 즉시 퇴거’ 약속이 계약서에 있습니다", desc: "보장된 최초 10년은 이미 지나 지금은 재연장 약 3년 잔여인데, 그 3년조차 매각 후 철거(신축)가 결정되면 만료 전이라도 즉시 나가야 합니다. 그리고 3년 뒤 재계약 보장도 없습니다." },
  { label: "나갈 때 원상복구는 우리 교회 부담입니다", desc: "계약서상 시설비·원상복구 비용을 임대인이 인정하지 않습니다. 그동안 꾸민 시설도 보상받지 못합니다." },
  { label: "100억 매물로 나왔고, 90억 매수 희망자가 나타났습니다", desc: "건물주는 ‘안 판다’고 하시지만 부동산에는 ‘팔아달라’ 하셨고, 실제로 90억에 사겠다는 사람이 나타났습니다(건물주는 100억 이하 거절). 말씀만으로 안심하기 어렵습니다." },
];

const GAPS = [
  "‘안 판다’는 말과 ‘팔아달라’는 행동이 다릅니다 — 믿어야 할 것은 행동입니다.",
  "‘거래에 1년 걸린다’는 건 보장이 아니라 추측이고, 거래를 맡은 부동산의 말입니다.",
  "새 예배 장소를 찾고 허가받고 공사하는 데만 보통 1~2년이 걸립니다. ‘닥쳐서 찾자’면 이미 늦습니다.",
];

const WORRIES = [
  {
    q: "“멀어서 못 나갈 것 같아요”",
    feel: "가장 마음 아픈 걱정입니다. 신앙생활의 터전이 흔들리니까요. 특히 어르신, 걸어서 오시는 분, 대중교통을 이용하시는 분께는 절실한 문제입니다.",
    answer: "주일 차량(셔틀)·카풀·어르신 택시 지원을 적극 준비합니다. 거리상으로도 자가용 약 20분, 성도의 약 70%는 이미 관악구 밖에 사셔서 생활권이 크게 바뀌지는 않습니다. 무엇보다 ‘한 사람도 소외되지 않는 이전’이 원칙이고, 교통 때문에 공동체가 흔들린다면 그분들을 위해서라도 이전 자체를 다시 생각합니다.",
  },
  {
    q: "“빚을 지고 건물을 사는 게 신앙적으로 맞나요?”",
    feel: "큰 빚에 대한 두려움, 헌금이 무리하게 쓰일까 하는 거룩한 부담은 당연하고 귀한 마음입니다.",
    answer: "‘빚=죄’가 아니라 함께 기도하며 분별할 청지기의 문제입니다. 게다가 지금도 월세·주차비로 매년 수천만 원을 쓰는데 그 돈은 사라집니다. 매입 상환금은 갚을수록 교회 자산이 됩니다. 다만 감당 못 할 수준이면 진행하지 않습니다 — 무리한 결정은 하지 않겠습니다.",
  },
  {
    q: "“연보를 꼭 해야 하나요? 부담돼요”",
    feel: "형편이 어려운 분께 연보 목표는 무거운 짐이 될 수 있습니다. 그 부담을 결코 가볍게 여기지 않습니다.",
    answer: "연보는 완전히 자발적·익명이며 형편껏입니다. 정해진 액수도, 못 했을 때의 정죄도 없습니다. 오히려 연보가 충분히 모이지 않으면 ‘무리하게 진행하지 말라’는 신호로 받아들입니다.",
  },
  {
    q: "“금천구로 가면 ‘관악교회’ 이름은요?”",
    feel: "교회의 이름과 정체성에 대한 소중한 물음입니다. 가볍게 넘길 일이 아닙니다.",
    answer: "이름은 지역명이 아니라 우리의 시작과 뿌리를 담은 표현이라 그대로 둘 수 있습니다. 정체성은 건물 주소가 아니라 함께 예배하는 우리 공동체에 있습니다. 이름·지역 사역에 대한 고민도 이전 결정과 별도로 성도님들과 함께 의논하겠습니다.",
  },
  {
    q: "“너무 급하게 밀어붙이는 것 같아요”",
    feel: "충분히 듣지 못했다는 느낌, 그 과정에서 받은 상처와 마음의 시험을 무겁게 받아들입니다.",
    answer: "이전 논의는 이미 2년 전부터 있어 왔고, 공청회는 ‘결정’이 아니라 ‘의견을 듣는’ 자리였습니다. 의사결정 시한도 서리집사 선출 때까지 미뤄, 더 충분히 의논합니다. 더 폭넓게 듣기 위해 확대당회로 모이며, 위원회를 계속할지까지 열어 놓고 논의합니다.",
  },
  {
    q: "“지금도 괜찮은데 꼭 옮겨야 하나요?”",
    feel: "익숙한 자리를 떠나는 일은 누구에게나 부담스럽습니다. 당연한 마음입니다.",
    answer: "지금이 ‘괜찮아 보이는’ 것이 함정일 수 있습니다. 건물이 매물로 나왔고 ‘신축 시 즉시 퇴거’ 조항이 있어, 우리가 원하는 때가 아니라 떠밀리는 때에 나가야 할 수 있습니다. 새 예배 공간을 찾고 허가받고 공사하는 데만 1~2년이 걸립니다. 그래서 시간과 선택권이 있는 ‘지금’ 차분히 준비하려는 것입니다.",
  },
  {
    q: "“이미 떠나겠다는 분들도 계시다던데…”",
    feel: "한 분 한 분의 마음이 가장 아픕니다. 이전보다 공동체의 일치가 먼저입니다.",
    answer: "위원회는 이를 ‘추진의 걸림돌’이 아니라 ‘멈춰 돌아보라는 신호’로 받습니다. 떠나려는 분께 설득보다 먼저 안부와 마음을 여쭙고, 상처드린 부분은 사과합니다. 멈춤이나 연기도 실패가 아니라 분별의 결과일 수 있습니다.",
  },
  {
    q: "“공동의회에서 부결되면 어떻게 되나요?”",
    feel: "결정 절차에 대한 정당한 질문입니다.",
    answer: "부결되면 현 예배당에서 계속 예배하며 다른 길을 찾습니다. 다만 현 건물의 매각·퇴거 위험은 그대로 남아 있으므로, 그 경우에도 대비는 이어갑니다. 어떤 결정이든 공동의회에서 함께 내립니다 — 오늘 강요받는 분은 없습니다.",
  },
];

const PROMISES = [
  "한 사람도 소외되지 않는 이전을 하겠습니다.",
  "재정적으로 무리가 되는 이전은 하지 않겠습니다.",
  "충분히 듣고, 함께 기도하며, 공동의회에서 함께 결정합니다.",
  "오늘 정해진 것은 아무것도 없습니다. 강요받는 분은 없습니다.",
];

export default function StoryPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-12 text-[17px] leading-relaxed sm:text-lg">
      {/* Hero */}
      <section className="flex flex-col items-center gap-4 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <HouseLine size={16} /> {SITE_CONFIG.church} 예배당 이전
        </span>
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          우리 예배당 이야기,<br />함께 천천히 살펴봐요
        </h1>
        <p className="max-w-xl text-muted-foreground">
          이 글은 찬성을 권하려는 글이 아닙니다. <strong className="text-foreground">같은 사실을 함께 보고, 같이 생각해 보기 위한 안내</strong>입니다.
          위에서 아래로 차근차근 읽어 주세요.
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Quotes size={16} className="text-primary" /> {SITE_CONFIG.moto}
        </div>
        <ArrowDown size={24} className="mt-2 animate-bounce text-primary" />
      </section>

      {/* Step 1 — 필요성 */}
      <Step n={1} title="왜 이전을 생각하게 되었나요?" icon={<Heart size={22} />}>
        {/* 가장 핵심: 계약 안정성 불확실 + 매물·매수자 등장 */}
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-50/70 p-6">
          <div className="flex items-center gap-2 text-amber-800">
            <Warning size={24} weight="fill" className="shrink-0" />
            <p className="text-lg font-bold sm:text-xl">가장 중요한 사실 — 지금 자리에 ‘계속 머문다’는 보장이 없습니다</p>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {CORE_FACTS.map((f, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-background p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="font-medium leading-relaxed">{f}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[15px] font-semibold leading-relaxed text-amber-800 sm:text-base">
            그래서 핵심 질문은 ‘얼마나 더 버틸 수 있나’가 아니라,
            <br className="hidden sm:block" /> ‘아직 시간과 선택권이 있을 때 우리가 주도해서 안정된 예배 공간을 마련할 수 있나’입니다.
          </p>
        </div>

        <p className="mb-4 mt-7 text-muted-foreground">
          여기에 더해, 오래 누적된 어려움도 함께 겹쳐 있습니다.
        </p>
        <div className="flex flex-col gap-3">
          {NEEDS.map((n, i) => (
            <div key={i} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {n.icon}
              </div>
              <div>
                <p className="font-semibold">{n.title}</p>
                <p className="mt-0.5 text-[15px] text-muted-foreground sm:text-base">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Step>

      {/* Step 2 — 김재윤 교수 메시지 */}
      <Step n={2} title="한 분의 간곡한 권면" icon={<Quotes size={22} />}>
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6">
          <p className="text-lg font-semibold leading-relaxed">“{PASTOR.lead}”</p>
          <div className="mt-4 flex flex-col gap-3 text-[16px] text-foreground sm:text-[17px]">
            {PASTOR.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-background p-4 text-[17px] font-semibold leading-relaxed text-primary sm:text-lg">
            “{PASTOR.highlight}”
          </div>
          <p className="mt-4 text-sm text-muted-foreground">— {PASTOR.who} · {PASTOR.when}</p>
        </div>
      </Step>

      {/* Step 3 — 계약서 증거 */}
      <Step n={3} title="지금 우리 예배당의 ‘진짜’ 상황" icon={<WarningCircle size={22} />}>
        <p className="mb-5 text-muted-foreground">
          막연한 걱정이 아니라, <strong className="text-foreground">계약서와 부동산 확인으로 드러난 사실</strong>입니다.
        </p>

        {/* 계약서 원본 증거 이미지 (특약 빨간 표시) */}
        <figure className="mb-5 overflow-hidden rounded-2xl border border-border bg-card">
          <img
            src="/contract-feature.jpg"
            alt="현 예배당 임대차계약서 특약사항 — 빨간 박스로 표시한 핵심 조항"
            className="w-full"
          />
          <figcaption className="flex flex-col gap-1 border-t border-border p-4 text-[14px] sm:text-[15px]">
            <span className="font-semibold">실제 임대차계약서 ‘특약사항’ (빨간 표시)</span>
            <span className="text-muted-foreground">
              <span className="font-medium text-red-600">빨간 박스 ①</span> 권리금·시설비를 임대인이 일체 인정하지 않음 → 나갈 때 원상복구·시설비는 교회 부담
            </span>
            <span className="text-muted-foreground">
              <span className="font-medium text-red-600">빨간 박스 ②</span> ‘건물 신축 시 (퇴거)’ 조건임을 계약 때 강조·설명함 → 신축·매각 시 바로 나가야 할 수 있음
            </span>
            <a href="/contract-annotated.jpg" target="_blank" rel="noopener noreferrer" className="mt-1 w-fit text-sm font-medium text-primary underline">
              계약서 전체 이미지 보기 →
            </a>
          </figcaption>
        </figure>

        <div className="flex flex-col gap-3">
          {CONTRACT.map((c, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50/60 p-4">
              <Warning size={22} className="mt-0.5 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-800">{c.label}</p>
                <p className="mt-0.5 text-[15px] text-foreground sm:text-base">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-card p-5">
          <p className="font-semibold">‘괜찮다, 천천히 해도 된다’는 말의 빈틈</p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {GAPS.map((g, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[15px] text-muted-foreground sm:text-base">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-2xl border-l-4 border-primary bg-secondary/40 p-4 font-semibold leading-relaxed">
          그래서 질문을 바꿔야 합니다 — <span className="text-primary">“얼마나 더 버틸 수 있나”</span>가 아니라,
          <span className="text-primary"> “아직 시간과 선택권이 있을 때, 우리가 주도해서 안정된 예배 공간을 마련할 수 있나”</span>입니다.
        </div>
      </Step>

      {/* Step 4 — 후보: 축복교회 */}
      <Step n={4} title="찾은 곳 — 금천구 축복교회 예배당" icon={<MapPin size={22} />}>
        <div className="mb-4 rounded-xl border-l-4 border-primary bg-secondary/40 p-3 text-[15px] leading-relaxed sm:text-base">
          <strong>여기까지의 흐름</strong> — ① 공간은 이미 포화이고 ② 지금 자리는 매각·퇴거 위험으로 계속 머문다는 보장이 없습니다.
          그렇다면 답은 ‘버티기’가 아니라, <strong>시간과 선택권이 있는 지금 안정된 예배 공간을 주도적으로 확보</strong>하는 것입니다. 그래서 찾은 곳이 —
        </div>
        <p className="mb-4 text-muted-foreground">
          여러 매물을 살핀 끝에 잠정 후보로 정한 곳입니다. 자가용 약 20분 거리입니다.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Stat big="12억" small="매입가 · 137평" />
          <Stat big="있음" small="엘리베이터" tone="good" />
          <Stat big="1/4" small="주차비 (현재 대비)" tone="good" />
          <Stat big="바로" small="예배당·교육관·식당 사용 가능" tone="good" />
        </div>
        <p className="mt-4 text-[15px] text-muted-foreground sm:text-base">
          기존 축복교회가 쓰던 본당·영유아실·교육관·주방·교역자실이 그대로 있어 큰 공사 없이 사용할 수 있습니다.
        </p>
      </Step>

      {/* Step 5 — 임대 vs 매수 */}
      <Step n={5} title="‘계속 임대’와 ‘매입’, 무엇이 다를까요?" icon={<Coin size={22} />}>
        <p className="mb-5 text-muted-foreground">
          가장 많이 묻는 질문입니다. 놀랍게도 <strong className="text-foreground">매달 나가는 돈은 거의 비슷합니다.</strong> 차이는 ‘남는 것’입니다.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 임대 */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
            <p className="text-center text-lg font-bold">계속 임대하면</p>
            <Stat big="약 550~600만" small="매달 (관악구 동급 임대 가정)" />
            <div className="rounded-xl bg-red-50 p-4 text-center">
              <p className="text-sm text-muted-foreground">10년 동안 낸 돈</p>
              <p className="text-2xl font-bold text-red-600">약 6.5~7억</p>
              <p className="mt-1 text-sm font-semibold text-red-600">→ 모두 사라집니다</p>
            </div>
            <p className="text-center text-[15px] text-muted-foreground">10년 뒤 남는 것: 보증금 회수뿐, 건물은 없음. 재계약·인상·퇴거 걱정은 계속됩니다.</p>
          </div>
          {/* 매입 */}
          <div className="flex flex-col gap-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 p-5">
            <p className="text-center text-lg font-bold">매입하면</p>
            <Stat big="약 540~575만" small="매달 (대출이자+관리비)" tone="good" />
            <div className="rounded-xl bg-emerald-100/70 p-4 text-center">
              <p className="text-sm text-muted-foreground">10년 뒤 남는 것</p>
              <p className="text-2xl font-bold text-emerald-700">우리 예배당 + 자산</p>
              <p className="mt-1 text-sm font-semibold text-emerald-700">→ 갚은 만큼 교회 것이 됩니다</p>
            </div>
            <p className="text-center text-[15px] text-muted-foreground">더 이상 쫓겨날 걱정 없이, 다음 세대에게 안정된 터전을 물려줍니다.</p>
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-border bg-card p-5">
          <p className="font-semibold">“관악구에 새로 임대하면 되지 않나요?”</p>
          <p className="mt-2 text-[15px] text-muted-foreground sm:text-base">
            그 마음 충분히 이해합니다. 다만 새로 임대해도 다음이 그대로 따라옵니다:
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {[
              "같은 불안정의 반복 — 새 임대도 몇 년 뒤 재계약·임대료 인상·퇴거 걱정이 똑같이 돌아옵니다. 지금 우리가 겪는 바로 그 문제입니다.",
              "공사·시설비가 새로 듭니다 — 예배당으로 쓰려면 강대상·의자·음향·영유아실·교육실을 새로 갖춰야 하고, 종교시설 용도 허가도 다시 받아야 합니다.",
              "엘리베이터·주차를 갖춘 큰 공간은 관악구에서도 드물고, 있으면 임대료가 비쌉니다.",
              "그렇게 큰돈과 수고를 들여도, 결국 ‘남는 것’은 없습니다.",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[15px] text-foreground sm:text-base">
                <Warning size={18} className="mt-1 shrink-0 text-amber-600" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 rounded-xl border border-dashed border-border p-3 text-center text-[14px] text-muted-foreground">
          ※ 임대 금액은 동급 규모를 가정한 추정이며, 실제 시세는 조사 후 확정합니다. 매입 금액은 실제 대출 견적·관리비 명세에 따른 것입니다.
        </p>
      </Step>

      {/* Step 6 — 염려 공감 */}
      <Step n={6} title="이런 걱정, 충분히 이해합니다" icon={<HandHeart size={22} />}>
        <p className="mb-5 text-muted-foreground">
          반대나 염려도 모두 교회를 사랑하는 마음에서 나옵니다. 먼저 그 마음을 듣고 함께 답을 찾겠습니다.
        </p>
        <div className="flex flex-col gap-4">
          {WORRIES.map((w, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-lg font-bold">{w.q}</p>
              <p className="mt-2 rounded-xl bg-secondary/50 p-3 text-[15px] sm:text-base">
                <span className="font-semibold text-primary">그 마음 — </span>{w.feel}
              </p>
              <p className="mt-2 flex gap-2 text-[15px] sm:text-base">
                <CheckCircle size={20} className="mt-0.5 shrink-0 text-emerald-600" />
                <span><span className="font-semibold">이렇게 준비합니다 — </span>{w.answer}</span>
              </p>
            </div>
          ))}
        </div>
      </Step>

      {/* Step 7 — 약속 */}
      <Step n={7} title="위원회의 약속" icon={<ShieldCheck size={22} />}>
        <div className="flex flex-col gap-3">
          {PROMISES.map((p, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <CheckCircle size={24} className="shrink-0 text-primary" weight="fill" />
              <p className="font-semibold">{p}</p>
            </div>
          ))}
        </div>
      </Step>

      {/* Step 8 — 참여 */}
      <Step n={8} title="함께 해주세요" icon={<UsersThree size={22} />}>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
            <Calendar size={24} className="mt-0.5 shrink-0 text-primary" />
            <p>
              <span className="font-semibold">충분한 시간이 있습니다.</span> 의사결정 시한이 서리집사 선출 때까지 미뤄졌습니다.
              서두르지 않고 함께 의논합니다.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
            <HandHeart size={24} className="mt-0.5 shrink-0 text-primary" />
            <p>
              <span className="font-semibold">의견을 들려주세요.</span> 좋은 점도, 걱정도, 반대도 모두 소중합니다.
              전도회 모임·온라인·직접 말씀 등 편하신 방법으로 나눠 주세요.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
            <Heart size={24} className="mt-0.5 shrink-0 text-primary" weight="fill" />
            <p>
              <span className="font-semibold">함께 기도해 주세요.</span> 우리 모두의 마음과 생각이
              하나님께서 기뻐하시는 길로 모이도록 기도로 준비합니다.
            </p>
          </div>
        </div>
      </Step>

      {/* 마무리 */}
      <section className="rounded-2xl bg-primary/5 p-8 text-center">
        <Quotes size={28} className="mx-auto text-primary" />
        <p className="mt-3 text-xl font-bold leading-relaxed">
          모여서 함께 예배,<br />흩어져 삶의 예배
        </p>
        <p className="mt-3 text-muted-foreground">
          예배당은 수단이고, 목적은 함께 예배하는 우리 공동체입니다.<br />
          끝까지 붙들 것은 <strong className="text-foreground">한 사람도 잃지 않으려는 마음</strong>입니다.
        </p>
      </section>
    </div>
  );
}

function Step({
  n,
  title,
  icon,
  children,
}: {
  n: number;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
          {n}
        </div>
        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <span className="text-primary">{icon}</span>
          {title}
        </h2>
      </div>
      <div className="sm:pl-14">{children}</div>
    </section>
  );
}

function Stat({
  big,
  small,
  tone,
}: {
  big: string;
  small: string;
  tone?: "good";
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background p-4 text-center">
      <span className={`text-2xl font-bold ${tone === "good" ? "text-emerald-700" : "text-foreground"}`}>
        {big}
      </span>
      <span className="mt-1 text-[13px] text-muted-foreground sm:text-sm">{small}</span>
    </div>
  );
}
