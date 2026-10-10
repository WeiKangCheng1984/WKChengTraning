import { NextResponse } from "next/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

/** Public URL + publishable key for the browser when build-time NEXT_PUBLIC_* are missing. */
export async function GET() {
  const env = getSupabasePublicEnv();
  if (!env) {
    return NextResponse.json(
      { ok: false as const, error: "missing_env" },
      { status: 503 },
    );
  }
  return NextResponse.json({
    ok: true as const,
    url: env.url,
    key: env.key,
  });
}
