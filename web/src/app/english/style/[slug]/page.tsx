import { notFound } from "next/navigation";
import { StyleStageClient } from "@/components/StyleStageClient";
import style from "@/data/style-phrases.json";
import type { StylePhrasesData } from "@/lib/types";

const data = style as StylePhrasesData;

export function generateStaticParams() {
  return data.stages.map((s) => ({ slug: s.slug }));
}

export default async function StyleStagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stage = data.stages.find((s) => s.slug === slug);
  if (!stage) notFound();
  return <StyleStageClient stage={stage} />;
}
