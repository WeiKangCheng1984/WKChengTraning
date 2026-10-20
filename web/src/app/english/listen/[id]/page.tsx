import { notFound } from "next/navigation";
import { ListenArticleClient } from "@/components/ListenArticleClient";
import listening from "@/data/listening.json";
import type { ListeningData } from "@/lib/listening";

const data = listening as ListeningData;

export function generateStaticParams() {
  return data.articles.map((a) => ({ id: a.id }));
}

export default async function ListenArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const index = data.articles.findIndex((a) => a.id === id);
  const article = data.articles[index];
  if (!article) notFound();
  const prev = data.articles[index - 1];
  const next = data.articles[index + 1];
  return (
    <ListenArticleClient
      article={article}
      prev={prev ? { id: prev.id, titleZh: prev.titleZh } : null}
      next={next ? { id: next.id, titleZh: next.titleZh } : null}
    />
  );
}
