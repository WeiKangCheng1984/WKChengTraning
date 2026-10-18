import { notFound } from "next/navigation";
import { GreHumorLessonClient } from "@/components/GreHumorLessonClient";
import humor from "@/data/gre-humor.json";
import type { GreHumorData } from "@/lib/greHumor";

const data = humor as GreHumorData;

export function generateStaticParams() {
  return data.clusters.map((c) => ({ slug: c.slug }));
}

export default async function GreHumorLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = data.clusters.findIndex((c) => c.slug === slug);
  if (idx < 0) notFound();
  const cluster = data.clusters[idx];
  const prevSlug = idx > 0 ? data.clusters[idx - 1].slug : null;
  const nextSlug =
    idx < data.clusters.length - 1 ? data.clusters[idx + 1].slug : null;

  return (
    <GreHumorLessonClient
      cluster={cluster}
      prevSlug={prevSlug}
      nextSlug={nextSlug}
    />
  );
}
