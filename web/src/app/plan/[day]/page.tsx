import { notFound } from "next/navigation";
import { PlanDayClient } from "@/components/PlanDayClient";
import { PLAN_DAYS } from "@/lib/plan";
import cfa from "@/data/cfa.json";
import english from "@/data/english.json";
import type { CfaData, EnglishData } from "@/lib/types";

const cfaData = cfa as CfaData;
const enData = english as EnglishData;

export function generateStaticParams() {
  return PLAN_DAYS.map((d) => ({ day: String(d.day) }));
}

export default async function PlanDayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day: dayStr } = await params;
  const dayNum = Number(dayStr);
  const day = PLAN_DAYS.find((d) => d.day === dayNum);
  if (!day) notFound();

  const subject = cfaData.subjects.find((s) => s.code === day.cfaCode);
  const category = enData.categories.find((c) => c.slug === day.enSlug);
  if (!subject || !category) notFound();

  return <PlanDayClient day={day} subject={subject} category={category} />;
}
