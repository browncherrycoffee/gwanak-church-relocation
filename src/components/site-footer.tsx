import { SITE_CONFIG } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
        <p className="font-medium">{SITE_CONFIG.church} 예배당 이전 준비위원회</p>
        <p className="mt-1">
          이 대시보드는 성도 한 사람도 소외되지 않는 이전을 위한
          준비위원회 내부 기록용입니다. 데이터는 이 브라우저 로컬 저장소에
          보관됩니다.
        </p>
      </div>
    </footer>
  );
}
