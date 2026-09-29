import { notFound } from "next/navigation";
import { EnglishCategoryClient } from "@/components/EnglishCategoryClient";
import english from "@/data/english.json";
import type { EnglishData } from "@/lib/types";

const data = english as EnglishData;

export function generateStaticParams() {
  return data.categories.map((c) => ({ slug: c.slug }));
}

export default async function EnglishCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = data.categories.find((c) => c.slug === slug);
  if (!category) notFound();
  return <EnglishCategoryClient category={category} />;
}
