import { notFound } from "next/navigation";
import { QuizClient } from "@/components/QuizClient";
import quizBank from "@/data/quiz-bank.json";
import type { QuizBankData } from "@/lib/types";

const data = quizBank as QuizBankData;

export function generateStaticParams() {
  return data.quizzes.map((q) => ({ slug: q.slug }));
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = data.quizzes.findIndex((q) => q.slug === slug);
  if (idx < 0) notFound();
  const quiz = data.quizzes[idx];
  const nextSlug = data.quizzes[idx + 1]?.slug ?? null;
  return <QuizClient quiz={quiz} nextSlug={nextSlug} />;
}
