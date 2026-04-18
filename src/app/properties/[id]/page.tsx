"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, TrashSimple } from "@phosphor-icons/react";
import { useMemo } from "react";
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
import { useProperties } from "@/lib/stores";
import type { DueDiligenceItem, Property, PropertyStatus } from "@/lib/types";
import { formatKRW, uid } from "@/lib/utils";

const STATUS_OPTIONS: { value: PropertyStatus; label: string }[] = [
  { value: "initial", label: "초기검토" },
  { value: "reviewing", label: "실사중" },
  { value: "onhold", label: "보류" },
  { value: "rejected", label: "제외" },
  { value: "selected", label: "선정" },
];

const DD_STATUS_OPTIONS: { value: DueDiligenceItem["status"]; label: string; variant: "default" | "secondary" | "muted" | "destructive" | "outline" }[] = [
  { value: "pending", label: "미확인", variant: "outline" },
  { value: "ok", label: "확인완료", variant: "default" },
  { value: "issue", label: "이슈", variant: "destructive" },
  { value: "na", label: "해당없음", variant: "muted" },
];

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { get, upsert, remove } = useProperties();

  const property = get(params.id);

  const ddByCategory = useMemo(() => {
    if (!property) return new Map<string, DueDiligenceItem[]>();
    const map = new Map<string, DueDiligenceItem[]>();
    for (const item of property.dueDiligence) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return map;
  }, [property]);

  if (!property) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-sm text-muted-foreground">
        <p>매물을 찾을 수 없습니다.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/properties">
            <ArrowLeft size={14} /> 목록으로
          </Link>
        </Button>
      </div>
    );
  }

  const patch = (p: Partial<Property>) =>
    upsert({ ...property, ...p, updatedAt: new Date().toISOString() });

  const updateDD = (id: string, next: Partial<DueDiligenceItem>) => {
    patch({
      dueDiligence: property.dueDiligence.map((d) =>
        d.id === id ? { ...d, ...next } : d,
      ),
    });
  };

  const addDD = () => {
    patch({
      dueDiligence: [
        ...property.dueDiligence,
        {
          id: `dd-${uid()}`,
          label: "새 실사 항목",
          category: "기타",
          status: "pending",
          note: "",
        },
      ],
    });
  };

  const removeDD = (id: string) => {
    patch({ dueDiligence: property.dueDiligence.filter((d) => d.id !== id) });
  };

  const addVisit = () => {
    patch({
      visits: [
        ...property.visits,
        {
          id: `visit-${uid()}`,
          date: new Date().toISOString().slice(0, 10),
          attendees: "",
          findings: "",
        },
      ],
    });
  };

  const updateVisit = (id: string, next: Partial<{ date: string; attendees: string; findings: string }>) => {
    patch({
      visits: property.visits.map((v) => (v.id === id ? { ...v, ...next } : v)),
    });
  };

  const removeVisit = (id: string) => {
    patch({ visits: property.visits.filter((v) => v.id !== id) });
  };

  const deleteProperty = () => {
    if (!confirm("이 매물을 삭제하시겠습니까?")) return;
    remove(property.id);
    router.replace("/properties");
  };

  const ddDone = property.dueDiligence.filter((d) => d.status === "ok").length;
  const ddIssue = property.dueDiligence.filter((d) => d.status === "issue").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/properties">
            <ArrowLeft size={14} /> 매물 목록
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={deleteProperty}>
          <TrashSimple size={14} /> 삭제
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Input
              value={property.name}
              onChange={(e) => patch({ name: e.target.value })}
              className="h-10 border-0 px-0 text-xl font-bold shadow-none focus-visible:ring-0"
            />
          </CardTitle>
          <CardDescription>
            <select
              value={property.status}
              onChange={(e) => patch({ status: e.target.value as PropertyStatus })}
              className="h-7 rounded-md border border-input bg-transparent px-2 text-xs"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="주소">
            <Input
              value={property.address}
              onChange={(e) => patch({ address: e.target.value })}
              placeholder="예: 서울특별시 금천구 ..."
            />
          </Field>
          <Field label="구·동">
            <Input
              value={property.district}
              onChange={(e) => patch({ district: e.target.value })}
              placeholder="예: 금천구"
            />
          </Field>
          <Field label="매매가 (원)">
            <Input
              type="number"
              value={property.price || ""}
              onChange={(e) => patch({ price: Number(e.target.value) || 0 })}
              placeholder="1400000000"
            />
            {property.price > 0 && (
              <span className="text-xs text-muted-foreground">
                {formatKRW(property.price)}원
              </span>
            )}
          </Field>
          <Field label="평수">
            <Input
              type="number"
              value={property.sizePyeong || ""}
              onChange={(e) => patch({ sizePyeong: Number(e.target.value) || 0 })}
              placeholder="140"
            />
          </Field>
          <Field label="층수">
            <Input
              value={property.floor}
              onChange={(e) => patch({ floor: e.target.value })}
              placeholder="예: 2층 전체"
            />
          </Field>
          <Field label="주차">
            <Input
              value={property.parking}
              onChange={(e) => patch({ parking: e.target.value })}
              placeholder="예: 5대 / 법정 8대"
            />
          </Field>
          <Field label="엘리베이터">
            <label className="flex h-11 items-center gap-2 rounded-md border border-input px-3 text-sm">
              <input
                type="checkbox"
                checked={property.elevator}
                onChange={(e) => patch({ elevator: e.target.checked })}
              />
              있음
            </label>
          </Field>
          <Field label="용도지역·건축물 용도">
            <Input
              value={property.useType}
              onChange={(e) => patch({ useType: e.target.value })}
              placeholder="예: 준주거 / 근린생활시설 (종교집회장)"
            />
          </Field>
          <Field label="이전 사용자">
            <Input
              value={property.previousTenant}
              onChange={(e) => patch({ previousTenant: e.target.value })}
              placeholder="예: 축복교회"
            />
          </Field>
          <Field label="연락처">
            <Input
              value={property.contact}
              onChange={(e) => patch({ contact: e.target.value })}
              placeholder="중개사·담당자 연락처"
            />
          </Field>
          <Field label="링크">
            <Input
              value={property.link}
              onChange={(e) => patch({ link: e.target.value })}
              placeholder="매물 상세 URL"
            />
          </Field>
          <Field label="기물 인수 조건" className="sm:col-span-2">
            <Textarea
              value={property.fixtures}
              onChange={(e) => patch({ fixtures: e.target.value })}
              placeholder="기존 기물 품목·감정가·포함 여부"
              rows={2}
            />
          </Field>
          <Field label="장점" className="sm:col-span-2">
            <Textarea
              value={property.pros}
              onChange={(e) => patch({ pros: e.target.value })}
              rows={3}
            />
          </Field>
          <Field label="단점 · 우려" className="sm:col-span-2">
            <Textarea
              value={property.cons}
              onChange={(e) => patch({ cons: e.target.value })}
              rows={3}
            />
          </Field>
          <Field label="재정 · 감정평가 · 대출 메모" className="sm:col-span-2">
            <Textarea
              value={property.financingNotes ?? ""}
              onChange={(e) => patch({ financingNotes: e.target.value })}
              placeholder="금융권 감정평가액, 대출 가능 비율, 이자·상환 조건, 접촉 중 은행 등"
              rows={6}
            />
          </Field>
        </CardContent>
      </Card>

      {(property.photos ?? []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>사진</CardTitle>
            <CardDescription>현장 답사·공유 자료 이미지.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(property.photos ?? []).map((src, idx) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-video overflow-hidden rounded-md border border-border"
                >
                  <Image
                    src={src}
                    alt={`${property.name} 사진 ${idx + 1}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition group-hover:scale-[1.02]"
                  />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>실사 체크리스트</CardTitle>
            <CardDescription>
              확인 완료 <strong>{ddDone}</strong> / 총{" "}
              {property.dueDiligence.length}
              {ddIssue > 0 && <span className="ml-2 text-destructive">이슈 {ddIssue}건</span>}
            </CardDescription>
          </div>
          <Button size="sm" onClick={addDD}>
            <Plus size={14} /> 항목 추가
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {[...ddByCategory.entries()].map(([category, items]) => (
            <div key={category} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-primary">{category}</span>
                <Badge variant="outline">{items.length}</Badge>
              </div>
              <div className="flex flex-col gap-2">
                {items.map((d) => (
                  <div
                    key={d.id}
                    className="grid grid-cols-1 gap-2 rounded-md border border-border p-3 sm:grid-cols-[1fr_120px_auto]"
                  >
                    <div className="flex flex-col gap-2">
                      <Input
                        value={d.label}
                        onChange={(e) => updateDD(d.id, { label: e.target.value })}
                      />
                      <Textarea
                        value={d.note}
                        onChange={(e) => updateDD(d.id, { note: e.target.value })}
                        placeholder="확인 결과·담당자·증빙 메모"
                        rows={2}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <select
                        value={d.status}
                        onChange={(e) => updateDD(d.id, { status: e.target.value as DueDiligenceItem["status"] })}
                        className="h-9 rounded-md border border-input bg-transparent px-2 text-xs"
                      >
                        {DD_STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <Badge
                        variant={
                          DD_STATUS_OPTIONS.find((s) => s.value === d.status)
                            ?.variant ?? "outline"
                        }
                      >
                        {DD_STATUS_OPTIONS.find((s) => s.value === d.status)?.label}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeDD(d.id)}
                      aria-label="삭제"
                    >
                      <TrashSimple size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>현장 답사 기록</CardTitle>
            <CardDescription>날짜·참석자·현장 소견을 기록합니다.</CardDescription>
          </div>
          <Button size="sm" onClick={addVisit}>
            <Plus size={14} /> 답사 추가
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {property.visits.length === 0 && (
            <p className="text-sm text-muted-foreground">아직 답사 기록이 없습니다.</p>
          )}
          {property.visits.map((v) => (
            <div
              key={v.id}
              className="grid grid-cols-1 gap-2 rounded-md border border-border p-3 sm:grid-cols-[160px_1fr_auto]"
            >
              <Input
                type="date"
                value={v.date}
                onChange={(e) => updateVisit(v.id, { date: e.target.value })}
              />
              <div className="flex flex-col gap-2">
                <Input
                  value={v.attendees}
                  onChange={(e) => updateVisit(v.id, { attendees: e.target.value })}
                  placeholder="참석자"
                />
                <Textarea
                  value={v.findings}
                  onChange={(e) => updateVisit(v.id, { findings: e.target.value })}
                  placeholder="현장 소견 · 추가 확인이 필요한 부분"
                  rows={3}
                />
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => removeVisit(v.id)}
                aria-label="삭제"
              >
                <TrashSimple size={14} />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
