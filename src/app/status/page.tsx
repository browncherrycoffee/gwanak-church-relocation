"use client";

import { ArrowCounterClockwise, Buildings, Coin, Users, Warning } from "@phosphor-icons/react";
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
import { useChurchStatus } from "@/lib/stores";
import { formatKRW } from "@/lib/utils";

export default function StatusPage() {
  const { status, patch, reset } = useChurchStatus();

  const monthlyFixedCost =
    status.monthlyRent +
    status.monthlyParking +
    status.monthlyManagement +
    status.monthlyUtilities +
    status.monthlyOther;

  const offeringRatio =
    status.monthlyOfferingAvg > 0
      ? (monthlyFixedCost / status.monthlyOfferingAvg) * 100
      : 0;

  const tenYearRent = status.monthlyRent * 12 * 10;
  const attendanceRate =
    status.registeredMembers > 0
      ? (status.sundayAttendanceAvg / status.registeredMembers) * 100
      : 0;
  const nextGenTotal =
    status.infantsCount +
    status.elementaryCount +
    status.middleHighCount +
    status.youngAdultCount;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-primary">교회 현황</span>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          관악교회 현황 (객관 데이터)
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          공간·고정비·헌금·인원 등 객관 수치를 한 곳에 정리합니다.
          이전의 필요성을 구체적으로 설명하고, 매물 검토 시 감당 가능성을
          판단하는 근거로 사용합니다.
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">기준 시점 · {status.asOfDate || "미지정"}</Badge>
          {status.dataSourceNote && (
            <Badge variant="secondary" className="font-normal">
              출처 · {status.dataSourceNote}
            </Badge>
          )}
          <Button size="sm" variant="ghost" onClick={reset}>
            <ArrowCounterClockwise size={14} /> 시드로 초기화
          </Button>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric
          icon={<Coin size={18} />}
          label="월 고정비"
          value={monthlyFixedCost > 0 ? `${formatKRW(monthlyFixedCost)}원` : "미입력"}
          hint={
            status.monthlyOfferingAvg > 0
              ? `헌금 대비 ${offeringRatio.toFixed(0)}%`
              : "헌금 입력 시 비율 표시"
          }
        />
        <Metric
          icon={<Coin size={18} />}
          label="10년 임대 누적"
          value={tenYearRent > 0 ? `${formatKRW(tenYearRent)}원` : "—"}
          hint="월세 × 120개월 기준"
        />
        <Metric
          icon={<Users size={18} />}
          label="등록 / 출석"
          value={
            status.registeredMembers > 0
              ? `${status.sundayAttendanceAvg} / ${status.registeredMembers}`
              : "미입력"
          }
          hint={
            status.registeredMembers > 0
              ? `출석률 ${attendanceRate.toFixed(0)}%`
              : "주일 평균 기준 권장"
          }
        />
        <Metric
          icon={<Users size={18} />}
          label="다음세대 합계"
          value={nextGenTotal > 0 ? `${nextGenTotal}명` : "미입력"}
          hint={
            nextGenTotal > 0
              ? `영유아 ${status.infantsCount} · 유초등 ${status.elementaryCount} · 중고등 ${status.middleHighCount} · 청년 ${status.youngAdultCount}`
              : "부서별 입력 시 표시"
          }
        />
      </section>

      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <Warning size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">메타 · 데이터 기준</CardTitle>
            <CardDescription>
              언제 기준 / 누가 제공한 자료인지 기록합니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="기준 시점 (예: 2026-03)">
            <Input
              value={status.asOfDate}
              onChange={(e) => patch({ asOfDate: e.target.value })}
              placeholder="YYYY-MM"
            />
          </Field>
          <Field label="자료 출처·제공자">
            <Input
              value={status.dataSourceNote}
              onChange={(e) => patch({ dataSourceNote: e.target.value })}
              placeholder="예: 재정부 결산, 총무부 교적부 등"
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <Buildings size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">공간</CardTitle>
            <CardDescription>
              현재 사용 중인 예배당·교육관 공간 규모.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField
            label="본당 평수"
            suffix="평"
            value={status.currentSanctuaryPyeong}
            onChange={(v) => patch({ currentSanctuaryPyeong: v })}
          />
          <NumberField
            label="교육관 평수"
            suffix="평"
            value={status.educationSpacePyeong}
            onChange={(v) => patch({ educationSpacePyeong: v })}
          />
          <NumberField
            label="전체 사용 공간"
            suffix="평"
            value={status.totalSpacePyeong}
            onChange={(v) => patch({ totalSpacePyeong: v })}
            hint="본당·교육관·친교실·사무실 등 합산"
          />
          <NumberField
            label="본당 좌석 수"
            suffix="석"
            value={status.seatCapacity}
            onChange={(v) => patch({ seatCapacity: v })}
          />
          <Field label="공간 제약 메모" className="sm:col-span-2">
            <Textarea
              rows={3}
              value={status.spaceConstraintNote}
              onChange={(e) => patch({ spaceConstraintNote: e.target.value })}
              placeholder="현 공간이 부족한 구체 상황 — 영유아실 동선, 분반 공간, 주차 등"
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <Coin size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">고정비 (월 기준)</CardTitle>
            <CardDescription>
              월 임대료·주차·관리비·공과금·기타 고정비를 분리해 입력.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CurrencyField
            label="보증금 (총액)"
            value={status.depositKRW}
            onChange={(v) => patch({ depositKRW: v })}
            hint="예배당·교육관 합산"
          />
          <CurrencyField
            label="월 임대료"
            value={status.monthlyRent}
            onChange={(v) => patch({ monthlyRent: v })}
          />
          <CurrencyField
            label="월 주차비"
            value={status.monthlyParking}
            onChange={(v) => patch({ monthlyParking: v })}
            hint="성도·사역자 주차 포함"
          />
          <CurrencyField
            label="월 관리비"
            value={status.monthlyManagement}
            onChange={(v) => patch({ monthlyManagement: v })}
          />
          <CurrencyField
            label="월 공과금 (전기·수도·가스)"
            value={status.monthlyUtilities}
            onChange={(v) => patch({ monthlyUtilities: v })}
          />
          <CurrencyField
            label="월 기타 고정비"
            value={status.monthlyOther}
            onChange={(v) => patch({ monthlyOther: v })}
          />
          <Field label="기타 고정비 내역" className="sm:col-span-2">
            <Textarea
              rows={2}
              value={status.otherFixedDescription}
              onChange={(e) => patch({ otherFixedDescription: e.target.value })}
              placeholder="인터넷·보안·청소 등 구체 항목"
            />
          </Field>
          {monthlyFixedCost > 0 && (
            <div className="sm:col-span-2 rounded-md border border-dashed border-primary/40 bg-secondary/40 p-3 text-sm">
              <strong>월 고정비 합계</strong> · {formatKRW(monthlyFixedCost)}원
              <span className="ml-2 text-muted-foreground">
                (연 {formatKRW(monthlyFixedCost * 12)}원 · 10년 {formatKRW(monthlyFixedCost * 120)}원)
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <Coin size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">헌금 수입 (월평균)</CardTitle>
            <CardDescription>
              본 대시보드는 공개 저장이 아니며, 성도 간 열람을 전제로
              평균 수준만 기록합니다.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CurrencyField
            label="월평균 헌금 (합계)"
            value={status.monthlyOfferingAvg}
            onChange={(v) => patch({ monthlyOfferingAvg: v })}
          />
          <Field label="기준 기간 메모">
            <Input
              value={status.offeringPeriodNote}
              onChange={(e) => patch({ offeringPeriodNote: e.target.value })}
              placeholder="예: 최근 12개월 / 2025년 결산"
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start gap-2">
          <Users size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">인원 · 다음세대</CardTitle>
            <CardDescription>
              등록 교인과 출석, 부서별 다음세대 수치.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField
            label="등록 교인"
            suffix="명"
            value={status.registeredMembers}
            onChange={(v) => patch({ registeredMembers: v })}
          />
          <NumberField
            label="주일 평균 출석"
            suffix="명"
            value={status.sundayAttendanceAvg}
            onChange={(v) => patch({ sundayAttendanceAvg: v })}
          />
          <NumberField
            label="영유아부"
            suffix="명"
            value={status.infantsCount}
            onChange={(v) => patch({ infantsCount: v })}
          />
          <NumberField
            label="유초등부"
            suffix="명"
            value={status.elementaryCount}
            onChange={(v) => patch({ elementaryCount: v })}
          />
          <NumberField
            label="중고등부"
            suffix="명"
            value={status.middleHighCount}
            onChange={(v) => patch({ middleHighCount: v })}
          />
          <NumberField
            label="청년부"
            suffix="명"
            value={status.youngAdultCount}
            onChange={(v) => patch({ youngAdultCount: v })}
          />
          <Field label="출석 추이 메모" className="sm:col-span-2">
            <Textarea
              rows={2}
              value={status.attendanceTrend}
              onChange={(e) => patch({ attendanceTrend: e.target.value })}
              placeholder="최근 3년 출석 추이, 계절·분기별 편차 등"
            />
          </Field>
          <Field label="등록·출산 성장 메모" className="sm:col-span-2">
            <Textarea
              rows={2}
              value={status.memberGrowthNote}
              onChange={(e) => patch({ memberGrowthNote: e.target.value })}
              placeholder="최근 3년 신규 등록, 출산 가정 수, 이탈 현황 등"
            />
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs">{label}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <span className="text-lg font-bold sm:text-xl">{value}</span>
      <span className="text-[11px] text-muted-foreground">{hint}</span>
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

function NumberField({
  label,
  suffix,
  value,
  onChange,
  hint,
}: {
  label: string;
  suffix: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          placeholder="0"
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground">{suffix}</span>
      </div>
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </Field>
  );
}

function CurrencyField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          placeholder="0"
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground">원</span>
      </div>
      {value > 0 && (
        <span className="text-xs text-muted-foreground">
          = {formatKRW(value)}원
        </span>
      )}
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </Field>
  );
}

