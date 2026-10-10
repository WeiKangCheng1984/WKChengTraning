import { notFound } from "next/navigation";
import { OralUnitClient } from "@/components/OralUnitClient";
import oral from "@/data/oral-practice.json";
import type { OralPracticeData } from "@/lib/types";

const data = oral as OralPracticeData;

export function generateStaticParams() {
  return data.units.map((u) => ({ slug: u.slug }));
}

export default async function OralUnitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = data.units.findIndex((u) => u.slug === slug);
  if (idx < 0) notFound();
  const unit = data.units[idx];
  const nextSlug = data.units[idx + 1]?.slug ?? null;
  return <OralUnitClient unit={unit} nextSlug={nextSlug} />;
}
