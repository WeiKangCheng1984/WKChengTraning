/** Lightweight cute emoji icons for friendlier UI */
export function CuteIcon({
  name,
  className = "text-lg",
}: {
  name:
    | "sun"
    | "book"
    | "mic"
    | "vault"
    | "star"
    | "fire"
    | "check"
    | "spark"
    | "ear"
    | "pencil"
    | "cloud"
    | "heart"
    | "rocket"
    | "more";
  className?: string;
}) {
  const map: Record<typeof name, string> = {
    sun: "☀️",
    book: "📘",
    mic: "🎙️",
    vault: "🗂️",
    star: "⭐",
    fire: "🔥",
    check: "✅",
    spark: "✨",
    ear: "👂",
    pencil: "✏️",
    cloud: "☁️",
    heart: "🧡",
    rocket: "🚀",
    more: "🧩",
  };
  return (
    <span className={`inline-block leading-none ${className}`} aria-hidden>
      {map[name]}
    </span>
  );
}
