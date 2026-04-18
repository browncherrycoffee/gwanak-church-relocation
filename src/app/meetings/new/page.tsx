"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMeetings } from "@/lib/stores";
import { uid } from "@/lib/utils";

export default function NewMeetingPage() {
  const router = useRouter();
  const { upsert } = useMeetings();
  const created = useRef(false);

  useEffect(() => {
    if (created.current) return;
    created.current = true;
    const id = `meeting-${uid()}`;
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();
    upsert({
      id,
      date: today,
      location: "",
      attendees: "",
      agenda: "",
      discussion: "",
      decisions: "",
      actions: [],
      notes: "",
      createdAt: now,
      updatedAt: now,
    });
    router.replace(`/meetings/${id}`);
  }, [router, upsert]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
      새 회의록을 생성 중입니다...
    </div>
  );
}
