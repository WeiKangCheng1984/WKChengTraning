/** Replace [SLOT] or [SLOT: default…] markers with scenario fills. */
export function fillEssayTemplate(
  body: string,
  fills: Record<string, string>,
): string {
  return body.replace(
    /\[([A-Z0-9_]+)(?::[^\]]*)?\]/g,
    (match, key: string) => fills[key] ?? match,
  );
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
