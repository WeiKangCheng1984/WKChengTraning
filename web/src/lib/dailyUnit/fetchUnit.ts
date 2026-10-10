import type { DailyUnit } from "@/lib/dailyUnit/types";
import type { DayTheme } from "@/lib/dailyUnit/themes";

export async function fetchDailyUnit(opts: {
  programDay: number;
  unitIndex: number;
  recentFingerprints?: string[];
}): Promise<DailyUnit> {
  const res = await fetch("/api/daily-unit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      programDay: opts.programDay,
      unitIndex: opts.unitIndex,
      recentFingerprints: opts.recentFingerprints || [],
    }),
  });
  if (!res.ok) {
    throw new Error("無法載入今日單元");
  }
  const data = (await res.json()) as {
    ok: boolean;
    unit?: DailyUnit;
    error?: string;
  };
  if (!data.ok || !data.unit) {
    throw new Error(data.error || "無法載入今日單元");
  }
  return data.unit;
}

export type UnitMeta = {
  programDay: number;
  titleZh: string;
  titleEn: string;
  blurb: string;
  estimatedMinutes: number;
  unitId: string;
};

export function metaFromTheme(
  theme: DayTheme,
  unitIndex: number,
): UnitMeta {
  const titleSuffix = unitIndex === 0 ? "" : ` · 加練 ${unitIndex}`;
  return {
    programDay: theme.day,
    titleZh: `${theme.titleZh}${titleSuffix}`,
    titleEn: theme.titleEn,
    blurb: theme.blurb,
    estimatedMinutes: 8,
    unitId: `d${String(theme.day).padStart(2, "0")}-u${unitIndex}`,
  };
}
