import { NextResponse } from "next/server";
import { buildDailyUnit } from "@/lib/dailyUnit/buildUnit";
import { themeForDay, DAILY_PROGRAM_DAYS } from "@/lib/dailyUnit/themes";

export const runtime = "nodejs";

/** Server-side unit builder — keeps large JSON off the client bundle. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      programDay?: number;
      unitIndex?: number;
      recentFingerprints?: string[];
    };
    const programDay = Math.max(
      1,
      Math.min(DAILY_PROGRAM_DAYS, Number(body.programDay) || 1),
    );
    const unitIndex = Math.max(0, Math.min(40, Number(body.unitIndex) || 0));
    const recentFingerprints = Array.isArray(body.recentFingerprints)
      ? body.recentFingerprints.filter((x) => typeof x === "string").slice(0, 600)
      : [];

    const unit = buildDailyUnit(programDay, unitIndex, { recentFingerprints });
    const theme = themeForDay(programDay);
    return NextResponse.json({
      ok: true as const,
      unit,
      theme,
      totalProgramDays: DAILY_PROGRAM_DAYS,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false as const,
        error: e instanceof Error ? e.message : "build_failed",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    totalProgramDays: DAILY_PROGRAM_DAYS,
    themes: Array.from({ length: DAILY_PROGRAM_DAYS }, (_, i) =>
      themeForDay(i + 1),
    ),
  });
}
