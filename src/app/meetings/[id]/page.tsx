"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, TrashSimple } from "@phosphor-icons/react";
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
import { useMeetings } from "@/lib/stores";
import type { ActionItem, Meeting } from "@/lib/types";
import { formatDate, uid } from "@/lib/utils";

export default function MeetingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { get, upsert, remove } = useMeetings();

  const meeting = get(params.id);

  if (!meeting) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-sm text-muted-foreground">
        <p>회의록을 찾을 수 없습니다.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/meetings">
            <ArrowLeft size={14} /> 목록으로
          </Link>
        </Button>
      </div>
    );
  }

  const patch = (p: Partial<Meeting>) =>
    upsert({ ...meeting, ...p, updatedAt: new Date().toISOString() });

  const addAction = () => {
    const newAction: ActionItem = {
      id: `action-${uid()}`,
      title: "",
      owner: "",
      dueDate: "",
      done: false,
    };
    patch({ actions: [...meeting.actions, newAction] });
  };

  const updateAction = (id: string, next: Partial<ActionItem>) => {
    patch({
      actions: meeting.actions.map((a) => (a.id === id ? { ...a, ...next } : a)),
    });
  };

  const removeAction = (id: string) => {
    patch({ actions: meeting.actions.filter((a) => a.id !== id) });
  };

  const deleteMeeting = () => {
    if (!confirm("이 회의록을 삭제하시겠습니까?")) return;
    remove(meeting.id);
    router.replace("/meetings");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/meetings">
            <ArrowLeft size={14} /> 회의록 목록
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="outline">마지막 수정 {formatDate(meeting.updatedAt)}</Badge>
          <Button variant="outline" size="sm" onClick={deleteMeeting}>
            <TrashSimple size={14} /> 삭제
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">회의 정보</CardTitle>
          <CardDescription>일시·장소·참석자를 정확히 기록합니다.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>일시</Label>
            <Input
              type="date"
              value={meeting.date}
              onChange={(e) => patch({ date: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>장소</Label>
            <Input
              value={meeting.location}
              onChange={(e) => patch({ location: e.target.value })}
              placeholder="예: 본당 2층 교역자실"
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label>참석자</Label>
            <Input
              value={meeting.attendees}
              onChange={(e) => patch({ attendees: e.target.value })}
              placeholder="예: 유해신 목사, 당회원, 준비위원 7인"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">안건 · 논의 · 결정사항</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>안건</Label>
            <Textarea
              value={meeting.agenda}
              onChange={(e) => patch({ agenda: e.target.value })}
              placeholder="항목별로 정리 (1. …  2. …  3. …)"
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>논의 내용</Label>
            <Textarea
              value={meeting.discussion}
              onChange={(e) => patch({ discussion: e.target.value })}
              placeholder="주요 발언·의견·대립점 기록"
              rows={6}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>결정사항</Label>
            <Textarea
              value={meeting.decisions}
              onChange={(e) => patch({ decisions: e.target.value })}
              placeholder="이 회의에서 최종 결정된 사항"
              rows={4}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>참고 메모</Label>
            <Textarea
              value={meeting.notes}
              onChange={(e) => patch({ notes: e.target.value })}
              placeholder="다음 회의에서 다룰 주제, 참고할 자료 링크 등"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">액션 아이템</CardTitle>
            <CardDescription>
              누가 · 언제까지 · 무엇을 — 다음 회의 전까지 추적.
            </CardDescription>
          </div>
          <Button size="sm" onClick={addAction}>
            <Plus size={14} /> 항목 추가
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {meeting.actions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              아직 등록된 액션 아이템이 없습니다.
            </p>
          )}
          {meeting.actions.map((a) => (
            <div
              key={a.id}
              className="grid grid-cols-1 items-start gap-2 rounded-md border border-border p-3 sm:grid-cols-[auto_1fr_160px_140px_auto]"
            >
              <button
                type="button"
                onClick={() => updateAction(a.id, { done: !a.done })}
                aria-label="완료 토글"
                className={`flex h-9 w-9 items-center justify-center rounded-md border ${
                  a.done ? "border-primary bg-primary text-primary-foreground" : "border-input"
                }`}
              >
                <Check size={14} />
              </button>
              <Input
                value={a.title}
                onChange={(e) => updateAction(a.id, { title: e.target.value })}
                placeholder="해야 할 일"
              />
              <Input
                value={a.owner}
                onChange={(e) => updateAction(a.id, { owner: e.target.value })}
                placeholder="담당자"
              />
              <Input
                type="date"
                value={a.dueDate}
                onChange={(e) => updateAction(a.id, { dueDate: e.target.value })}
              />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => removeAction(a.id)}
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
