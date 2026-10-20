import { notFound } from "next/navigation";
import { EssayThemeClient } from "@/components/EssayThemeClient";
import essayWriting from "@/data/essay-writing.json";
import type { EssayWritingData } from "@/lib/types";

const data = essayWriting as EssayWritingData;

export function generateStaticParams() {
  return data.themes.map((t) => ({ slug: t.slug }));
}

export default async function WritingThemePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = data.themes.findIndex((t) => t.slug === slug);
  if (index < 0) notFound();
  const theme = data.themes[index];
  const prev = data.themes[index - 1];
  const next = data.themes[index + 1];

  return (
    <EssayThemeClient
      theme={theme}
      themeIndex={index}
      themeTotal={data.themes.length}
      prevSlug={prev?.slug}
      nextSlug={next?.slug}
    />
  );
}
