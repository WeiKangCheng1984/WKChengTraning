import { notFound } from "next/navigation";
import { ConversationTypeClient } from "@/components/ConversationTypeClient";
import conversation from "@/data/conversation-four.json";
import type { ConversationFourData } from "@/lib/types";

const data = conversation as ConversationFourData;

export function generateStaticParams() {
  return data.types.map((t) => ({ slug: t.slug }));
}

export default async function ConversationTypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const type = data.types.find((t) => t.slug === slug);
  if (!type) notFound();
  return <ConversationTypeClient type={type} />;
}
