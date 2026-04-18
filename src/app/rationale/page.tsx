"use client";

import { ArrowCounterClockwise, Plus, Target, TrashSimple } from "@phosphor-icons/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRationale } from "@/lib/stores";
import type { EmpathyLevel, RationaleItem } from "@/lib/types";
import { formatDate, uid } from "@/lib/utils";

const EMPATHY_OPTIONS: { value: EmpathyLevel; label: string }[] = [
  { value: "unknown", label: "미확인" },
  { value: "low", label: "낮음" },
  { value: "medium", label: "중간" },
  { value: "high", label: "높음" },
];

export default function RationalePage() {
  const { items, setItems, update, resetSeed } = useRationale();
  const [expanded, setExpanded] = useState<string | null>(null);

  const addNew = () => {
    const newItem: RationaleItem = {
      id: `rationale-${uid()}`,
      title: "새 근거",
      summary: "",
      evidence: "",
      counterpoints: "",
      responses: "",
      empathy: "unknown",
      updatedAt: new Date().toISOString(),
    };
    setItems((prev) => [...prev, newItem]);
    setExpanded(newItem.id);
  };

  const remove = (id: string) => {
    if (!confirm("이 근거를 삭제하시겠습니까?")) return;
    setItems((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-primary">
          <Target size={20} />
          <span className="text-xs font-medium">이전 준비위원회</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">이전의 필요성</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetSeed}>
              <ArrowCounterClockwise size={14} /> 초기 근거로 되돌리기
            </Button>
            <Button size="sm" onClick={addNew}>
              <Plus size={14} /> 새 근거
            </Button>
          </div>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          각 근거에 대해 <strong>요약 · 근거·데이터 · 반론 · 반론에 대한 답변 ·
          성도 공감 수준</strong>을 지속적으로 고도화합니다. 반론을 숨기지 않고
          먼저 기록해두면, 설명회에서 만나게 될 질문에 대응력이 생깁니다.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        {items.map((item) => {
          const open = expanded === item.id;
          return (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-1 flex-col gap-1">
                    <Input
                      value={item.title}
                      onChange={(e) => update(item.id, { title: e.target.value })}
                      className="h-9 border-0 px-0 text-base font-semibold shadow-none focus-visible:ring-0"
                    />
                    <CardDescription>
                      마지막 수정 {formatDate(item.updatedAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <EmpathySelect
                      value={item.empathy}
                      onChange={(v) => update(item.id, { empathy: v })}
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setExpanded(open ? null : item.id)}
                      aria-label={open ? "접기" : "펼치기"}
                    >
                      <span className="text-xs">{open ? "접기" : "펼치기"}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => remove(item.id)}
                      aria-label="삭제"
                    >
                      <TrashSimple size={14} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Field
                  label="요약"
                  value={item.summary}
                  onChange={(v) => update(item.id, { summary: v })}
                  placeholder="성도에게 설명하듯 한 문단으로 정리"
                />
                {open && (
                  <>
                    <Field
                      label="근거 · 데이터"
                      value={item.evidence}
                      onChange={(v) => update(item.id, { evidence: v })}
                      placeholder="출석 통계, 공간 도면, 계약서, 시장 데이터 등"
                    />
                    <Field
                      label="예상 반론"
                      value={item.counterpoints}
                      onChange={(v) => update(item.id, { counterpoints: v })}
                      placeholder="성도가 자연스럽게 품을 만한 의문·반대 논지"
                    />
                    <Field
                      label="반론에 대한 답변"
                      value={item.responses}
                      onChange={(v) => update(item.id, { responses: v })}
                      placeholder="반론을 존중하며 대화하듯 답변"
                    />
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
    </div>
  );
}

function EmpathySelect({
  value,
  onChange,
}: {
  value: EmpathyLevel;
  onChange: (v: EmpathyLevel) => void;
}) {
  const badgeVariant: Record<EmpathyLevel, "default" | "secondary" | "muted" | "destructive" | "outline"> = {
    unknown: "outline",
    low: "destructive",
    medium: "secondary",
    high: "default",
  };
  return (
    <div className="flex items-center gap-2">
      <Badge variant={badgeVariant[value]}>공감</Badge>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as EmpathyLevel)}
        className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
      >
        {EMPATHY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
