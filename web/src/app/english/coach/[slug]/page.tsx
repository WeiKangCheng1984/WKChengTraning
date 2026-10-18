import { notFound } from "next/navigation";
import { CoachLessonClient } from "@/components/CoachLessonClient";
import coach from "@/data/coach-lessons.json";
import type { CoachLessonsData } from "@/lib/coachPrompt";

const data = coach as CoachLessonsData;

export function generateStaticParams() {
  return data.lessons.map((l) => ({ slug: l.slug }));
}

export default async function CoachLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = data.lessons.findIndex((l) => l.slug === slug);
  if (idx < 0) notFound();
  const lesson = data.lessons[idx]!;
  const prev = data.lessons[idx - 1];
  const next = data.lessons[idx + 1];
  return (
    <CoachLessonClient
      lesson={lesson}
      prevSlug={prev?.slug ?? null}
      nextSlug={next?.slug ?? null}
    />
  );
}
