import { redirect } from "next/navigation";

/** 20-day plan removed — CFA data remains under /vault */
export default function PlanRedirectPage() {
  redirect("/vault");
}
