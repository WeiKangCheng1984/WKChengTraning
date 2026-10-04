import { notFound } from "next/navigation";
import { SpeakArticleClient } from "@/components/SpeakArticleClient";
import speak from "@/data/speak.json";
import type { SpeakData } from "@/lib/types";

const data = speak as SpeakData;

export function generateStaticParams() {
  return data.articles.map((a) => ({ slug: a.slug }));
}

export default async function SpeakArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = data.articles.find((a) => a.slug === slug);
  if (!article) notFound();
  return <SpeakArticleClient article={article} />;
}
