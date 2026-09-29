import { notFound } from "next/navigation";
import { VaultSubjectClient } from "@/components/VaultSubjectClient";
import cfa from "@/data/cfa.json";
import type { CfaData } from "@/lib/types";

const data = cfa as CfaData;

export function generateStaticParams() {
  return data.subjects.map((s) => ({ code: s.code }));
}

export default async function VaultSubjectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const subject = data.subjects.find((s) => s.code === code);
  if (!subject) notFound();
  return <VaultSubjectClient subject={subject} />;
}
