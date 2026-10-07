import { notFound } from "next/navigation";
import { VocabTableClient } from "@/components/VocabTableClient";
import vocabulary from "@/data/vocabulary.json";
import type { VocabularyData } from "@/lib/types";

const data = vocabulary as VocabularyData;

export function generateStaticParams() {
  return data.tables.map((t) => ({ slug: t.slug }));
}

export default async function VocabTablePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const table = data.tables.find((t) => t.slug === slug);
  if (!table) notFound();
  return <VocabTableClient table={table} />;
}
