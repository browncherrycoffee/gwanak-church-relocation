"use client";

import Link from "next/link";
import { NotePencil, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMeetings } from "@/lib/stores";
import { formatDate } from "@/lib/utils";

export default function MeetingsPage() {
  const { items } = useMeetings();

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-primary">
          <NotePencil size={20} />
          <span className="text-xs font-medium">이전 준비위원회</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">회의록</h1>
          <Button asChild size="sm">
            <Link href="/meetings/new">
              <Plus size={14} /> 새 회의록
            </Link>
          </Button>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          준비위원회 정기 회의의 안건·논의·결정사항·액션 아이템을 기록합니다.
          결정된 사항은 <strong>누가 · 언제까지 · 무엇을</strong> 형태로 남겨야
          다음 회의에서 진척 추적이 가능합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        {items.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center text-sm text-muted-foreground">
              <span>아직 작성된 회의록이 없습니다.</span>
              <Button asChild size="sm">
                <Link href="/meetings/new">
                  <Plus size={14} /> 첫 회의록 작성하기
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {items.map((m) => {
          const openActions = m.actions.filter((a) => !a.done).length;
          return (
            <Link
              key={m.id}
              href={`/meetings/${m.id}`}
              className="block rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">
                    {formatDate(m.date)} {m.location ? `· ${m.location}` : ""}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    참석 {m.attendees || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {openActions > 0 && (
                    <Badge variant="destructive">미완료 액션 {openActions}</Badge>
                  )}
                  <Badge variant="outline">액션 총 {m.actions.length}</Badge>
                </div>
              </div>
              {m.agenda && (
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                  {m.agenda}
                </p>
              )}
            </Link>
          );
        })}
      </section>
    </div>
  );
}
