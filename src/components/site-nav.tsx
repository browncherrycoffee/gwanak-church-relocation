"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { useState } from "react";
import { NAV, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-primary sm:text-base">
            {SITE_CONFIG.church} 예배당 이전
          </span>
          <span className="text-[10px] text-muted-foreground sm:text-xs">
            준비위원회 대시보드
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="메뉴 열기"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
        >
          {open ? <X size={18} /> : <List size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex flex-col rounded-md px-3 py-2",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground",
                )}
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
