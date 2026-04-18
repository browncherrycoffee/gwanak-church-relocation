"use client";

import Link from "next/link";
import { Buildings, Plus } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProperties } from "@/lib/stores";
import type { PropertyStatus } from "@/lib/types";
import { formatKRW } from "@/lib/utils";

const STATUS_LABEL: Record<PropertyStatus, { label: string; variant: "default" | "secondary" | "muted" | "destructive" | "outline" }> = {
  initial: { label: "초기검토", variant: "outline" },
  reviewing: { label: "실사중", variant: "default" },
  onhold: { label: "보류", variant: "secondary" },
  rejected: { label: "제외", variant: "destructive" },
  selected: { label: "선정", variant: "default" },
};

export default function PropertiesPage() {
  const { items } = useProperties();

  const sorted = [...items].sort((a, b) => {
    const order: PropertyStatus[] = ["selected", "reviewing", "initial", "onhold", "rejected"];
    return order.indexOf(a.status) - order.indexOf(b.status);
  });

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-primary">
          <Buildings size={20} />
          <span className="text-xs font-medium">이전 준비위원회</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">매물 검토</h1>
          <Button asChild size="sm">
            <Link href="/properties/new">
              <Plus size={14} /> 새 매물
            </Link>
          </Button>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          후보 매물을 등록하고 실사 체크리스트·현장 답사 기록·장단점을
          지속적으로 업데이트합니다. 서류·안전·설비·환경·위치 항목을 모두
          확인하기 전에는 <strong>선정</strong> 상태로 올리지 않습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        {sorted.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center text-sm text-muted-foreground">
              <span>아직 등록된 매물이 없습니다.</span>
              <Button asChild size="sm">
                <Link href="/properties/new">
                  <Plus size={14} /> 첫 매물 등록하기
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {sorted.map((p) => {
          const doneDD = p.dueDiligence.filter((d) => d.status === "ok").length;
          const issueDD = p.dueDiligence.filter((d) => d.status === "issue").length;
          return (
            <Link
              key={p.id}
              href={`/properties/${p.id}`}
              className="block rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{p.name}</span>
                    <Badge variant={STATUS_LABEL[p.status].variant}>
                      {STATUS_LABEL[p.status].label}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {p.address || p.district}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="text-sm font-semibold text-primary">
                    {p.price ? `${formatKRW(p.price)}원` : "가격 미정"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {p.sizePyeong ? `${p.sizePyeong}평` : ""}
                    {p.floor ? ` · ${p.floor}` : ""}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">
                  실사 {doneDD}/{p.dueDiligence.length}
                </Badge>
                {issueDD > 0 && (
                  <Badge variant="destructive">이슈 {issueDD}</Badge>
                )}
                {p.elevator && <Badge variant="muted">엘리베이터</Badge>}
                <Badge variant="muted">답사 {p.visits.length}회</Badge>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
