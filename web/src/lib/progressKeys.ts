/** localStorage keys synced to Supabase progress_snapshots */
export const PROGRESS_KEYS = [
  "omnilearn-mastery-v1",
  "omnilearn-srs-v1",
  "omnilearn-quiz-progress-v1",
  "omnilearn-oral-progress-v1",
  "omnilearn-plan-done-v1",
  "omnilearn-favorites-v1",
  "omnilearn-rewards-v1",
  "omnilearn-my-sentences-v1",
] as const;

export type ProgressKey = (typeof PROGRESS_KEYS)[number];
