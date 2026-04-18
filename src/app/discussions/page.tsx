"use client";

import Link from "next/link";
import { ChatCircleText, Plus } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDiscussions } from "@/lib/stores";
import type { DiscussionStatus } from "@/lib/types";

const STATUS_LABEL: Record<DiscussionStatus, { label: string; variant: "default" | "secondary" | "muted" | "destructive" | "outline" }> = {
  open: { label: "논의 중", variant: "outline" },
  converging: { label: "수렴 중", variant: "secondary" },
  decided: { label: "결론", variant: "default" },
};

export default function DiscussionsPage() {
  const { items } = useDiscussions();

  const sorted = [...items].sort((a, b) => {
    const order: DiscussionStatus[] = ["open", "converging", "decided"];
    return order.indexOf(a.status) - order.indexOf(b.status);
  });

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-primary">
          <ChatCircleText size={20} />
          <span className="text-xs font-medium">이전 준비위원회</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">논의 주제</h1>
          <Button asChild size="sm">
            <Link href="/discussions/new">
              <Plus size={14} /> 새 논제
            </Link>
          </Button>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          이전을 두고 자연스럽게 떠오르는 질문을 <strong>논제</strong>로
          등록하고, 찬성·반대·고려사항 의견을 기록하며 고도화합니다.
          충분히 고도화된 논제는 설명회와 공동의회 자료의 기반이 됩니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        {sorted.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center text-sm text-muted-foreground">
              <span>아직 등록된 논제가 없습니다.</span>
              <Button asChild size="sm">
                <Link href="/discussions/new">
                  <Plus size={14} /> 첫 논제 등록하기
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {sorted.map((d) => {
          const pro = d.arguments.filter((a) => a.stance === "pro").length;
          const con = d.arguments.filter((a) => a.stance === "con").length;
          const consider = d.arguments.filter((a) => a.stance === "consider").length;
          return (
            <Link
              key={d.id}
              href={`/discussions/${d.id}`}
              className="block rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <span className="text-sm font-semibold leading-snug">
                  {d.question}
                </span>
                <Badge variant={STATUS_LABEL[d.status].variant}>
                  {STATUS_LABEL[d.status].label}
                </Badge>
              </div>
              {d.background && (
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                  {d.background}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="default">찬성 {pro}</Badge>
                <Badge variant="destructive">반대 {con}</Badge>
                <Badge variant="secondary">고려 {consider}</Badge>
                {d.tentativeConclusion && (
                  <Badge variant="accent">잠정 결론 있음</Badge>
                )}
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
