"use client";

import Link from "next/link";
import {
  ArrowRight,
  Buildings,
  ChatCircleText,
  CheckSquare,
  Coin,
  Compass,
  Gavel,
  NotePencil,
  Target,
  UsersThree,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COMMITTEE_CHARTER, SITE_CONFIG } from "@/lib/constants";
import {
  useChurchStatus,
  useDiscussions,
  useMeetings,
  useProperties,
  useRationale,
} from "@/lib/stores";
import { formatDate, formatKRW } from "@/lib/utils";

const empathyLabel: Record<string, { label: string; variant: "default" | "secondary" | "muted" | "destructive" | "outline" }> = {
  unknown: { label: "미확인", variant: "outline" },
  low: { label: "낮음", variant: "destructive" },
  medium: { label: "중간", variant: "secondary" },
  high: { label: "높음", variant: "default" },
};

export default function Home() {
  const { items: rationaleItems } = useRationale();
  const { items: meetings } = useMeetings();
  const { items: properties } = useProperties();
  const { items: discussions } = useDiscussions();
  const { status } = useChurchStatus();

  const monthlyFixedCost =
    status.monthlyRent +
    status.monthlyParking +
    status.monthlyManagement +
    status.monthlyUtilities +
    status.monthlyOther;
  const offeringRatio =
    status.monthlyOfferingAvg > 0
      ? (monthlyFixedCost / status.monthlyOfferingAvg) * 100
      : 0;
  const nextGenTotal =
    status.infantsCount +
    status.elementaryCount +
    status.middleHighCount +
    status.youngAdultCount;
  const ageTotal =
    status.ageUnder10 +
    status.ageTeens +
    status.ageTwenties +
    status.ageThirties +
    status.ageForties +
    status.ageFifties +
    status.ageSixties +
    status.ageSeventyPlus +
    status.ageUnknown;
  const elderlyRate =
    ageTotal > 0
      ? ((status.ageSixties + status.ageSeventyPlus) / ageTotal) * 100
      : 0;
  const residentialTotal = status.residentialBreakdown.reduce(
    (s, a) => s + a.count,
    0,
  );
  const topArea = [...status.residentialBreakdown]
    .filter((a) => a.count > 0)
    .sort((a, b) => b.count - a.count)[0];
  const hasStatusData =
    monthlyFixedCost > 0 ||
    status.monthlyOfferingAvg > 0 ||
    status.registeredMembers > 0 ||
    nextGenTotal > 0 ||
    ageTotal > 0 ||
    residentialTotal > 0;

  const activeProperties = properties.filter(
    (p) => p.status === "initial" || p.status === "reviewing",
  );
  const openDiscussions = discussions.filter((d) => d.status !== "decided");
  const recentMeeting = meetings[0];

  const empathyHigh = rationaleItems.filter((r) => r.empathy === "high").length;
  const empathyUnknown = rationaleItems.filter((r) => r.empathy === "unknown").length;

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <span className="text-xs font-medium text-primary">{SITE_CONFIG.church} · 예배당 이전</span>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          이전 준비위원회 대시보드
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          이전의 필요성을 고도화하고, 회의록과 매물, 논의 주제를 한 곳에서
          관리합니다. 핵심 원칙은 <strong>성도 한 사람도 소외되지 않는
          이전</strong>입니다.
        </p>
        <p className="text-xs text-muted-foreground">
          표어 · {SITE_CONFIG.moto}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-start gap-2">
            <Gavel size={20} className="mt-0.5 text-primary" />
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base">
                당회 결의 · 위원회 구성
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {COMMITTEE_CHARTER.preamble}
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <UsersThree size={14} /> {COMMITTEE_CHARTER.composition.title}
            </div>
            <p className="text-sm">
              {COMMITTEE_CHARTER.composition.summary}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {COMMITTEE_CHARTER.composition.members.map((m) => (
                <Badge key={m.role} variant="secondary" className="font-normal">
                  {m.role} {m.count}명
                </Badge>
              ))}
              <Badge variant="outline" className="font-normal">
                {COMMITTEE_CHARTER.composition.total}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start gap-2">
            <Target size={20} className="mt-0.5 text-primary" />
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base">
                위원회 {COMMITTEE_CHARTER.duties.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {COMMITTEE_CHARTER.duties.intro}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm">
              {COMMITTEE_CHARTER.duties.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <CheckSquare size={22} className="mt-0.5 text-primary" />
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold">추진 현황</h2>
              <p className="text-xs text-muted-foreground">
                2026-05-31 위원회 활동 보고 기준
              </p>
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-2">
              {[
                { date: "4/4", item: "예배당이전검토위원회 당회 의결", done: true },
                { date: "4/5", item: "재직회에 위원회 설립 목적 설명 및 위원 선출", done: true },
                { date: "4/16", item: "위원회 위원들 소집 및 설명회", done: true },
                { date: "4/17~5/22", item: "활동 종료 및 잠정(안) 도출", done: true },
                { date: "5/23", item: "위원회 내부 검토 및 당회 보고(안) 마련", done: true },
                { date: "5/24", item: "성도 대상 설명회 광고", done: true },
                { date: "5/25", item: "당회 보고 (서면)", done: true },
                { date: "5/31", item: "위원회 활동 보고 (1차 설명회)", done: true },
                { date: "~6월 1주", item: "성도 의견 취합", done: false },
                { date: "6/14", item: "2차 설명회 (의견 반영, 자금상환계획)", done: false },
                { date: "미정", item: "공동의회 (매입 결정, 연보 취합)", done: false },
              ].map((t) => (
                <div key={t.date + t.item} className="flex items-start gap-2">
                  <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${t.done ? "bg-primary" : "bg-muted-foreground/30"}`} />
                  <span className="text-xs">
                    <span className="font-medium text-primary">{t.date}</span>{" "}
                    <span className={t.done ? "" : "text-muted-foreground"}>{t.item}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          icon={<Target size={18} />}
          label="필요성 근거"
          value={`${rationaleItems.length}개`}
          hint={`공감 고도화 ${empathyHigh}개 · 미확인 ${empathyUnknown}개`}
        />
        <MetricCard
          icon={<Buildings size={18} />}
          label="검토 중 매물"
          value={`${activeProperties.length}개`}
          hint={`전체 등록 ${properties.length}개`}
        />
        <MetricCard
          icon={<ChatCircleText size={18} />}
          label="미해결 논제"
          value={`${openDiscussions.length}개`}
          hint={`전체 ${discussions.length}개 중`}
        />
        <MetricCard
          icon={<NotePencil size={18} />}
          label="회의록"
          value={`${meetings.length}회`}
          hint={recentMeeting ? `최근 ${formatDate(recentMeeting.date)}` : "아직 기록 없음"}
        />
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Coin size={18} /> 교회 현황 — 객관 수치
          </CardTitle>
          <Link
            href="/status"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary"
          >
            입력·편집 <ArrowRight size={14} />
          </Link>
        </CardHeader>
        <CardContent>
          {!hasStatusData ? (
            <div className="flex flex-col gap-2 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
              <p>
                아직 공간·고정비·헌금·인원 수치가 입력되지 않았습니다.
                객관 데이터가 있어야 이전의 필요성과 감당 가능성을 구체적으로
                설명할 수 있습니다.
              </p>
              <Link
                href="/status"
                className="inline-flex w-fit items-center gap-1 text-xs font-medium text-primary"
              >
                현황 입력 시작 <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <HomeMetric
                label="월 고정비"
                value={monthlyFixedCost > 0 ? `${formatKRW(monthlyFixedCost)}원` : "—"}
                hint={
                  status.monthlyOfferingAvg > 0
                    ? `헌금 대비 ${offeringRatio.toFixed(0)}%`
                    : ""
                }
              />
              <HomeMetric
                label="월평균 헌금"
                value={status.monthlyOfferingAvg > 0 ? `${formatKRW(status.monthlyOfferingAvg)}원` : "—"}
                hint={status.offeringPeriodNote || ""}
              />
              <HomeMetric
                label="등록 / 출석"
                value={
                  status.registeredMembers > 0
                    ? `${status.sundayAttendanceAvg} / ${status.registeredMembers}`
                    : "—"
                }
                hint={
                  status.registeredMembers > 0
                    ? `출석률 ${((status.sundayAttendanceAvg / status.registeredMembers) * 100).toFixed(0)}%`
                    : ""
                }
              />
              <HomeMetric
                label="다음세대"
                value={nextGenTotal > 0 ? `${nextGenTotal}명` : "—"}
                hint={
                  nextGenTotal > 0
                    ? `영유아 ${status.infantsCount} · 유초등 ${status.elementaryCount} · 중고등 ${status.middleHighCount} · 청년 ${status.youngAdultCount}`
                    : ""
                }
              />
              <HomeMetric
                label="60세 이상 비율"
                value={ageTotal > 0 ? `${elderlyRate.toFixed(0)}%` : "—"}
                hint="엘리베이터·저층 필요성 판단"
              />
              <HomeMetric
                label="주 거주 지역"
                value={
                  topArea
                    ? `${topArea.area} ${((topArea.count / residentialTotal) * 100).toFixed(0)}%`
                    : "—"
                }
                hint={
                  topArea
                    ? `${topArea.count}명 / 집계 ${residentialTotal}명`
                    : "지역 분포 입력 시 표시"
                }
              />
              <HomeMetric
                label="10년 임대 누적"
                value={
                  status.monthlyRent > 0
                    ? `${formatKRW(status.monthlyRent * 120)}원`
                    : "—"
                }
                hint="월세 × 120개월 (매입 비교 기준)"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target size={18} /> 이전의 필요성 — 공감 현황
            </CardTitle>
            <Link
              href="/rationale"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary"
            >
              전체 보기 <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {rationaleItems.map((r) => (
              <div
                key={r.id}
                className="flex items-start justify-between gap-3 rounded-md border border-border p-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{r.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {r.summary}
                  </span>
                </div>
                <Badge variant={empathyLabel[r.empathy]?.variant ?? "outline"}>
                  {empathyLabel[r.empathy]?.label ?? "미확인"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Buildings size={18} /> 검토 중 매물
            </CardTitle>
            <Link
              href="/properties"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary"
            >
              전체 보기 <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {activeProperties.length === 0 && (
              <p className="text-sm text-muted-foreground">
                아직 검토 중인 매물이 없습니다.
              </p>
            )}
            {activeProperties.map((p) => (
              <Link
                key={p.id}
                href={`/properties/${p.id}`}
                className="flex flex-col gap-1 rounded-md border border-border p-3 hover:border-primary"
              >
                <span className="text-sm font-medium">{p.name}</span>
                <span className="text-xs text-muted-foreground">
                  {p.district} · {p.sizePyeong}평 · {formatKRW(p.price)}원
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ChatCircleText size={18} /> 미해결 논제
            </CardTitle>
            <Link
              href="/discussions"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary"
            >
              전체 보기 <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {openDiscussions.length === 0 && (
              <p className="text-sm text-muted-foreground">
                모든 논제가 결론에 도달했습니다.
              </p>
            )}
            {openDiscussions.slice(0, 5).map((d) => (
              <Link
                key={d.id}
                href={`/discussions/${d.id}`}
                className="flex flex-col gap-1 rounded-md border border-border p-3 hover:border-primary"
              >
                <span className="text-sm font-medium line-clamp-2">
                  {d.question}
                </span>
                <span className="text-xs text-muted-foreground">
                  의견 {d.arguments.length}개 · {d.status === "open" ? "논의 중" : "수렴 중"}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <NotePencil size={18} /> 최근 회의
            </CardTitle>
            <Link
              href="/meetings"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary"
            >
              전체 보기 <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {!recentMeeting && (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  아직 작성된 회의록이 없습니다.
                </p>
                <Link
                  href="/meetings/new"
                  className="inline-flex w-fit items-center gap-1 text-xs font-medium text-primary"
                >
                  회의록 작성 <ArrowRight size={14} />
                </Link>
              </div>
            )}
            {recentMeeting && (
              <Link
                href={`/meetings/${recentMeeting.id}`}
                className="flex flex-col gap-1 rounded-md border border-border p-3 hover:border-primary"
              >
                <span className="text-sm font-medium">
                  {formatDate(recentMeeting.date)} 회의
                </span>
                <span className="text-xs text-muted-foreground line-clamp-2">
                  {recentMeeting.agenda || "안건 미기재"}
                </span>
              </Link>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <CheckSquare size={22} className="mt-0.5 text-primary" />
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold">
                이전을 위해 고려해야 할 8가지 요소
              </h2>
              <p className="text-xs text-muted-foreground">
                2026-04-18 첫 준비위원회에서 합의된 매물 평가 기준입니다.
                이 8가지를 기준으로 검토한 결과, 에벤에셀프라자를 잠정 후보로 선정하였습니다.
              </p>
            </div>
            <ol className="grid list-decimal grid-cols-1 gap-x-6 gap-y-1.5 pl-5 text-sm text-foreground sm:grid-cols-2">
              <li>
                지역 범위 · 교인 이동 동선과 거주 분포
              </li>
              <li>
                층수 · 노약자·유아 접근성 (저층 우선)
              </li>
              <li>
                면적 기준 · 단층 80~90평 이상 확보
              </li>
              <li>
                추가 비용 · 인테리어·리모델링 예산 반영
              </li>
              <li>
                임대인 수용 여부 · 교회 용도 허용 확인
              </li>
              <li>
                주차 · 엘리베이터 · 차량/노약자 배려
              </li>
              <li>
                확장 가능성 · 5~10년 후 성장 여지
              </li>
              <li>
                교통 편의성 · 대중교통·주요 도로 접근
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-dashed border-primary/30 bg-secondary/40 p-5">
        <div className="flex items-start gap-3">
          <Compass size={22} className="mt-0.5 text-primary" />
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold">향후 일정 및 계획</h2>
              <p className="text-xs text-muted-foreground">
                2026-05-31 위원회 활동 보고 기준
              </p>
            </div>
            <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1.5">
              <li>1차 설명회(5/31) 후 성도 의견 취합 (~6월 1주차)</li>
              <li>2차 설명회(6/14) — 성도 의견 반영 및 문제점 해결방안, 자금상환계획 보고</li>
              <li>임시 당회 후 공동의회 일정 광고</li>
              <li>공동의회(미정) — 예배당 이전/물건 매입 결정, 연보(무기명) 금액 작성/취합</li>
              <li>가결 시, 예배당이전위원회로 명칭 변경 및 자금조달 계획 실행</li>
              <li>기타 차입금 및 연보 액수 부족 시, Plan B 보고 후 재추진 여부 논의</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}

function HomeMetric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-background p-3">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-base font-bold sm:text-lg">{value}</span>
      {hint && (
        <span className="text-[11px] text-muted-foreground line-clamp-2">
          {hint}
        </span>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs">{label}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <span className="text-xl font-bold sm:text-2xl">{value}</span>
      <span className="text-[11px] text-muted-foreground">{hint}</span>
    </div>
  );
}
