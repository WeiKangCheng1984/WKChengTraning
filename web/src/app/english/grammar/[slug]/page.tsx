import { notFound } from "next/navigation";
import { GrammarLessonClient } from "@/components/GrammarLessonClient";
import grammar from "@/data/grammar.json";
import type { GrammarData } from "@/lib/types";

const data = grammar as GrammarData;

export function generateStaticParams() {
  return data.lessons.map((l) => ({ slug: l.slug }));
}

export default async function GrammarLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = data.lessons.findIndex((l) => l.slug === slug);
  if (idx < 0) notFound();
  const lesson = data.lessons[idx];
  const prevSlug = idx > 0 ? data.lessons[idx - 1].slug : undefined;
  const nextSlug =
    idx < data.lessons.length - 1 ? data.lessons[idx + 1].slug : undefined;

  return (
    <GrammarLessonClient
      lesson={lesson}
      prevSlug={prevSlug}
      nextSlug={nextSlug}
    />
  );
}
