import { redirect } from "next/navigation";

export function generateStaticParams() {
  return Array.from({ length: 20 }, (_, i) => ({ day: String(i + 1) }));
}

export default function PlanDayRedirectPage() {
  redirect("/vault");
}
