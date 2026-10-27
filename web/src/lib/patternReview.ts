import { listReflexPacks } from "@/lib/patternReflex";

export function patternReviewKeys(): Array<{ scope: "pattern"; id: string }> {
  return listReflexPacks().map((p) => ({ scope: "pattern" as const, id: p.id }));
}
