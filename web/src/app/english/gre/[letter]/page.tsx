import { notFound } from "next/navigation";
import { GreLetterClient } from "@/components/GreLetterClient";
import greVocabulary from "@/data/gre-vocabulary.json";
import type { GreVocabularyData } from "@/lib/types";

const data = greVocabulary as GreVocabularyData;

export function generateStaticParams() {
  return data.letters.map((l) => ({ letter: l.slug }));
}

export default async function GreLetterPage({
  params,
}: {
  params: Promise<{ letter: string }>;
}) {
  const { letter: slug } = await params;
  const letter = data.letters.find((l) => l.slug === slug);
  if (!letter) notFound();
  return <GreLetterClient letter={letter} />;
}
