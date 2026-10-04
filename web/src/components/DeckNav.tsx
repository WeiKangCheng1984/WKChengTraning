"use client";

type Props = {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  label?: string;
  prevLabel?: string;
  nextLabel?: string;
  disablePrev?: boolean;
  disableNext?: boolean;
};

export function DeckNav({
  index,
  total,
  onPrev,
  onNext,
  label,
  prevLabel = "上一題",
  nextLabel = "下一題",
  disablePrev = false,
  disableNext = false,
}: Props) {
  if (total <= 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-sm text-[var(--muted)]">
        {index + 1} / {total}
        {label ? ` · ${label}` : ""}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={disablePrev}
          className="min-h-10 rounded-sm border border-[var(--line)] px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--paper)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {prevLabel}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={disableNext}
          className="min-h-10 rounded-sm bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)] hover:bg-[var(--ink-soft)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
