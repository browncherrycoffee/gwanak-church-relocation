"use client";

import {
  ArrowCounterClockwise,
  Buildings,
  Coin,
  MapPin,
  Plus,
  TrashSimple,
  Users,
  Warning,
} from "@phosphor-icons/react";
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
import type { ResidentialArea } from "@/lib/types";
import { formatKRW, uid } from "@/lib/utils";

const AGE_BUCKETS = [
  { key: "ageUnder10", label: "10세 미만" },
  { key: "ageTeens", label: "10대" },
  { key: "ageTwenties", label: "20대" },
  { key: "ageThirties", label: "30대" },
  { key: "ageForties", label: "40대" },
  { key: "ageFifties", label: "50대" },
  { key: "ageSixties", label: "60대" },
  { key: "ageSeventyPlus", label: "70대 이상" },
  { key: "ageUnknown", label: "미입력" },
] as const;

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
          <NumberField
            label="활동 교인"
            suffix="명"
            value={status.activeMembers}
            onChange={(v) => patch({ activeMembers: v })}
            hint="교적부 memberStatus='활동' 기준"
          />
          <NumberField
            label="비활동 교인"
            suffix="명"
            value={status.inactiveMembers}
            onChange={(v) => patch({ inactiveMembers: v })}
            hint="교적부 memberStatus='비활동' 기준"
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

      <AgeDistributionCard />
      <ResidentialCard />
      <HouseholdCard />
    </div>
  );
}

function AgeDistributionCard() {
  const { status, patch } = useChurchStatus();
  const values = AGE_BUCKETS.map((b) => ({
    key: b.key,
    label: b.label,
    count: status[b.key],
  }));
  const total = values.reduce((s, v) => s + v.count, 0);
  const max = Math.max(...values.map((v) => v.count), 1);
  const elderlyRate =
    total > 0
      ? ((status.ageSixties + status.ageSeventyPlus) / total) * 100
      : 0;
  const youthRate =
    total > 0
      ? ((status.ageUnder10 + status.ageTeens + status.ageTwenties) / total) * 100
      : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-2">
        <Users size={20} className="mt-0.5 text-primary" />
        <div>
          <CardTitle className="text-base">나이대별 분포</CardTitle>
          <CardDescription>
            교적부 /members/stats 의 연령대(10세 미만 / 10대~70대 이상 / 미입력)
            기준으로 집계한 수치를 입력합니다.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <SummaryBox label="총합" value={total > 0 ? `${total}명` : "미입력"} />
          <SummaryBox
            label="60세 이상 비율"
            value={total > 0 ? `${elderlyRate.toFixed(0)}%` : "—"}
            hint="엘리베이터·저층 필요성 판단"
          />
          <SummaryBox
            label="20대 이하 비율"
            value={total > 0 ? `${youthRate.toFixed(0)}%` : "—"}
            hint="다음세대 공간·교육관 필요성"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs">{v.label}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={v.count || ""}
                    onChange={(e) =>
                      patch({ [v.key]: Number(e.target.value) || 0 } as Partial<typeof status>)
                    }
                    placeholder="0"
                    className="h-8 w-20 text-right"
                  />
                  <span className="w-10 text-right text-xs text-muted-foreground">
                    {total > 0 ? `${((v.count / total) * 100).toFixed(0)}%` : "—"}
                  </span>
                </div>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(v.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ResidentialCard() {
  const { status, patch } = useChurchStatus();
  const sorted = [...status.residentialBreakdown].sort((a, b) => b.count - a.count);
  const total = sorted.reduce((s, a) => s + a.count, 0);
  const max = Math.max(...sorted.map((a) => a.count), 1);

  const updateArea = (id: string, next: Partial<ResidentialArea>) =>
    patch({
      residentialBreakdown: status.residentialBreakdown.map((a) =>
        a.id === id ? { ...a, ...next } : a,
      ),
    });
  const addArea = () =>
    patch({
      residentialBreakdown: [
        ...status.residentialBreakdown,
        { id: `area-${uid()}`, area: "", count: 0 },
      ],
    });
  const removeArea = (id: string) =>
    patch({
      residentialBreakdown: status.residentialBreakdown.filter((a) => a.id !== id),
    });

  const gwanakArea = sorted.find((a) => a.area === "관악구");
  const geumcheonArea = sorted.find((a) => a.area === "금천구");
  const gwanakRate = total > 0 && gwanakArea ? (gwanakArea.count / total) * 100 : 0;
  const geumcheonRate =
    total > 0 && geumcheonArea ? (geumcheonArea.count / total) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <MapPin size={20} className="mt-0.5 text-primary" />
          <div>
            <CardTitle className="text-base">주거 지역 분포</CardTitle>
            <CardDescription>
              구역별(시·구 단위) 거주 교인 수. 이전 후보지의 접근성 평가와
              통근 변화 추정에 사용합니다.
            </CardDescription>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={addArea}>
          <Plus size={14} /> 지역 추가
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <SummaryBox
            label="집계 총합"
            value={total > 0 ? `${total}명` : "미입력"}
          />
          <SummaryBox
            label="관악구 비율"
            value={total > 0 ? `${gwanakRate.toFixed(0)}%` : "—"}
            hint="현 예배당 근거리 성도"
          />
          <SummaryBox
            label="금천구 비율"
            value={total > 0 ? `${geumcheonRate.toFixed(0)}%` : "—"}
            hint="후보지 근거리 성도"
          />
        </div>
        <div className="flex flex-col gap-2">
          {sorted.map((a) => (
            <div
              key={a.id}
              className="grid grid-cols-[1fr_90px_60px_auto] items-center gap-2"
            >
              <Input
                value={a.area}
                onChange={(e) => updateArea(a.id, { area: e.target.value })}
                placeholder="예: 관악구, 금천구, 경기 과천 등"
                className="h-9"
              />
              <Input
                type="number"
                value={a.count || ""}
                onChange={(e) =>
                  updateArea(a.id, { count: Number(e.target.value) || 0 })
                }
                placeholder="0"
                className="h-9 text-right"
              />
              <span className="text-right text-xs text-muted-foreground">
                {total > 0 ? `${((a.count / total) * 100).toFixed(0)}%` : "—"}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => removeArea(a.id)}
                aria-label="삭제"
              >
                <TrashSimple size={14} />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">비율 시각화</Label>
          <div className="flex flex-col gap-1.5">
            {sorted.filter((a) => a.count > 0).map((a) => (
              <div key={a.id} className="flex items-center gap-2">
                <span className="w-20 truncate text-xs">{a.area || "—"}</span>
                <div className="flex-1 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(a.count / max) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs text-muted-foreground">
                  {a.count}명
                </span>
              </div>
            ))}
            {sorted.every((a) => a.count === 0) && (
              <p className="text-xs text-muted-foreground">
                각 지역에 수치를 입력하면 막대 그래프로 표시됩니다.
              </p>
            )}
          </div>
        </div>
        <Field label="인구 통계 해석 메모">
          <Textarea
            rows={2}
            value={status.demographicsNote}
            onChange={(e) => patch({ demographicsNote: e.target.value })}
            placeholder="예: 관악구 비중이 70% 이상이므로 이전지 선정 시 통근 변화가 과반 성도에게 영향 — 접근성 평가 우선."
          />
        </Field>
      </CardContent>
    </Card>
  );
}

function HouseholdCard() {
  const { status, patch } = useChurchStatus();
  const avgHouseholdSize =
    status.householdCount > 0 ? status.registeredMembers / status.householdCount : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-2">
        <Users size={20} className="mt-0.5 text-primary" />
        <div>
          <CardTitle className="text-base">가정·세대</CardTitle>
          <CardDescription>
            가정 단위 수와 다가족 세대 비율. 이전 접근성 평가 시 가족 단위 이동을
            고려.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          label="총 세대 수"
          suffix="세대"
          value={status.householdCount}
          onChange={(v) => patch({ householdCount: v })}
          hint="교적부 familyMembers 기반 세대 수"
        />
        <NumberField
          label="다가족 세대 (2인 이상)"
          suffix="세대"
          value={status.multiMemberHouseholdCount}
          onChange={(v) => patch({ multiMemberHouseholdCount: v })}
          hint="부부·가족 단위 이동 영향 평가"
        />
        {avgHouseholdSize > 0 && (
          <div className="sm:col-span-2 rounded-md border border-dashed border-primary/40 bg-secondary/40 p-3 text-sm">
            <strong>세대당 평균</strong> · {avgHouseholdSize.toFixed(1)}명 (등록 교인 기준)
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SummaryBox({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-border bg-background p-3">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-base font-bold">{value}</span>
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
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

