/** Personal-use allowlist — only these emails may sign in / sync. */
export const ALLOWED_EMAILS = ["fox994@gmail.com"] as const;

export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (ALLOWED_EMAILS as readonly string[]).includes(normalized);
}
