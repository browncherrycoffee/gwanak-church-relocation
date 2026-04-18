"use client";

import Link from "next/link";
import {
  ArrowRight,
  Buildings,
  ChatCircleText,
  Compass,
  NotePencil,
  Target,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_CONFIG } from "@/lib/constants";
import { useDiscussions, useMeetings, useProperties, useRationale } from "@/lib/stores";
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

      <section className="rounded-xl border border-dashed border-primary/30 bg-secondary/40 p-5">
        <div className="flex items-start gap-3">
          <Compass size={22} className="mt-0.5 text-primary" />
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">추천 다음 단계</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li>이전의 필요성 5대 근거를 당회·제직회 의견을 수렴해 문구 고도화</li>
              <li>금천구 매물의 서류 실사 체크리스트 14개 항목 각각 담당자 지정</li>
              <li>지역 범위·예산 상한·이전 시점 세 논제 각각 찬반 의견 수집</li>
              <li>다음 준비위원회 일정과 안건을 회의록으로 사전 등록</li>
            </ul>
          </div>
        </div>
      </section>
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
