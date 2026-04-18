"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDiscussions } from "@/lib/stores";
import { uid } from "@/lib/utils";

export default function NewDiscussionPage() {
  const router = useRouter();
  const { upsert } = useDiscussions();
  const created = useRef(false);

  useEffect(() => {
    if (created.current) return;
    created.current = true;
    const id = `discussion-${uid()}`;
    const now = new Date().toISOString();
    upsert({
      id,
      question: "새 논제",
      background: "",
      arguments: [],
      tentativeConclusion: "",
      status: "open",
      createdAt: now,
      updatedAt: now,
    });
    router.replace(`/discussions/${id}`);
  }, [router, upsert]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
      새 논제를 생성 중입니다...
    </div>
  );
}
