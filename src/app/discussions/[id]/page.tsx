"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, TrashSimple } from "@phosphor-icons/react";
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
import { useDiscussions } from "@/lib/stores";
import type {
  Discussion,
  DiscussionArgument,
  DiscussionStance,
  DiscussionStatus,
} from "@/lib/types";
import { formatDate, uid } from "@/lib/utils";

const STATUS_OPTIONS: { value: DiscussionStatus; label: string }[] = [
  { value: "open", label: "논의 중" },
  { value: "converging", label: "수렴 중" },
  { value: "decided", label: "결론" },
];

const STANCE_OPTIONS: {
  value: DiscussionStance;
  label: string;
  variant: "default" | "secondary" | "muted" | "destructive" | "outline";
}[] = [
  { value: "pro", label: "찬성", variant: "default" },
  { value: "con", label: "반대", variant: "destructive" },
  { value: "consider", label: "고려", variant: "secondary" },
];

export default function DiscussionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { get, upsert, remove } = useDiscussions();
  const discussion = get(params.id);

  if (!discussion) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-sm text-muted-foreground">
        <p>논제를 찾을 수 없습니다.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/discussions">
            <ArrowLeft size={14} /> 목록으로
          </Link>
        </Button>
      </div>
    );
  }

  const patch = (p: Partial<Discussion>) =>
    upsert({ ...discussion, ...p, updatedAt: new Date().toISOString() });

  const addArgument = (stance: DiscussionStance) => {
    const newArg: DiscussionArgument = {
      id: `arg-${uid()}`,
      stance,
      author: "",
      content: "",
      createdAt: new Date().toISOString(),
    };
    patch({ arguments: [...discussion.arguments, newArg] });
  };

  const updateArgument = (id: string, next: Partial<DiscussionArgument>) => {
    patch({
      arguments: discussion.arguments.map((a) => (a.id === id ? { ...a, ...next } : a)),
    });
  };

  const removeArgument = (id: string) => {
    patch({ arguments: discussion.arguments.filter((a) => a.id !== id) });
  };

  const deleteDiscussion = () => {
    if (!confirm("이 논제를 삭제하시겠습니까?")) return;
    remove(discussion.id);
    router.replace("/discussions");
  };

  const grouped = STANCE_OPTIONS.map((s) => ({
    ...s,
    items: discussion.arguments.filter((a) => a.stance === s.value),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/discussions">
            <ArrowLeft size={14} /> 논제 목록
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="outline">수정 {formatDate(discussion.updatedAt)}</Badge>
          <Button variant="outline" size="sm" onClick={deleteDiscussion}>
            <TrashSimple size={14} /> 삭제
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Textarea
              value={discussion.question}
              onChange={(e) => patch({ question: e.target.value })}
              rows={2}
              className="border-0 px-0 text-lg font-semibold shadow-none focus-visible:ring-0"
            />
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-2">
            <select
              value={discussion.status}
              onChange={(e) => patch({ status: e.target.value as DiscussionStatus })}
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
        <CardContent className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">배경</Label>
          <Textarea
            value={discussion.background}
            onChange={(e) => patch({ background: e.target.value })}
            placeholder="이 논제가 제기된 배경·맥락"
            rows={3}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {grouped.map((group) => (
          <Card key={group.value}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Badge variant={group.variant}>{group.label}</Badge>
                <span className="text-xs text-muted-foreground">
                  {group.items.length}
                </span>
              </CardTitle>
              <Button variant="ghost" size="icon-sm" onClick={() => addArgument(group.value)}>
                <Plus size={14} />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {group.items.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  아직 기록된 의견이 없습니다.
                </p>
              )}
              {group.items.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col gap-2 rounded-md border border-border p-3"
                >
                  <Input
                    value={a.author}
                    onChange={(e) => updateArgument(a.id, { author: e.target.value })}
                    placeholder="작성자 (예: 당회 / 김OO 집사)"
                    className="h-9"
                  />
                  <Textarea
                    value={a.content}
                    onChange={(e) => updateArgument(a.id, { content: e.target.value })}
                    placeholder="의견 내용"
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      {formatDate(a.createdAt)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeArgument(a.id)}
                      aria-label="삭제"
                    >
                      <TrashSimple size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">잠정 결론</CardTitle>
          <CardDescription>
            논의가 수렴될 때 잠정 결론을 적어두고, 최종 결론은 회의록에
            기록합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={discussion.tentativeConclusion}
            onChange={(e) => patch({ tentativeConclusion: e.target.value })}
            rows={4}
            placeholder="예: 1순위 관악구, 2순위 서울 서남권, 경기 외곽은 예외적 상황에서만 검토."
          />
        </CardContent>
      </Card>
    </div>
  );
}
