"use client";

import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import type { DailyStep, DailyUnit } from "@/lib/dailyUnit/types";

type Props = {
  unit: DailyUnit;
  onComplete: (stats: { correct: number; total: number }) => void;
  onExit: () => void;
};

export function DailyUnitPlayer({ unit, onComplete, onExit }: Props) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [contrastPicked, setContrastPicked] = useState<"bad" | "good" | null>(
    null,
  );

  const step = unit.steps[index];
  const total = unit.steps.length;
  const pct = Math.round(((index + (revealed || picked || contrastPicked ? 1 : 0)) / total) * 100);

  function advance(wasCorrect: boolean) {
    const nextCorrect = correct + (wasCorrect ? 1 : 0);
    setCorrect(nextCorrect);
    setPicked(null);
    setRevealed(false);
    setContrastPicked(null);
    if (index + 1 >= total) {
      onComplete({ correct: nextCorrect, total });
      return;
    }
    setIndex((i) => i + 1);
  }

  if (!step) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onExit}
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← 結束本單元
        </button>
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
          Day {unit.programDay} · {index + 1}/{total}
        </p>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>

      <div className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          {kindLabel(step.kind)}
        </p>
        <StepBody
          step={step}
          picked={picked}
          revealed={revealed}
          contrastPicked={contrastPicked}
          onPick={(c, ok) => {
            setPicked(c);
            window.setTimeout(() => advance(ok), 650);
          }}
          onReveal={() => setRevealed(true)}
          onRevealContinue={(ok) => advance(ok)}
          onContrast={(choice) => {
            setContrastPicked(choice);
            window.setTimeout(() => advance(choice === "good"), 700);
          }}
        />
      </div>
    </section>
  );
}

function kindLabel(kind: DailyStep["kind"]) {
  switch (kind) {
    case "vocab_choice":
      return "Vocab · 選詞";
    case "gre_choice":
      return "GRE · 選詞";
    case "cloze":
      return "Cloze · 填空";
    case "pattern_reveal":
      return "Pattern · 句型";
    case "grammar_contrast":
      return "Grammar · 對比";
    case "listen_choice":
      return "Listen · 聽選";
    case "speak_check":
      return "Speak · 跟讀";
    default:
      return "Practice";
  }
}

function StepBody({
  step,
  picked,
  revealed,
  contrastPicked,
  onPick,
  onReveal,
  onRevealContinue,
  onContrast,
}: {
  step: DailyStep;
  picked: string | null;
  revealed: boolean;
  contrastPicked: "bad" | "good" | null;
  onPick: (choice: string, ok: boolean) => void;
  onReveal: () => void;
  onRevealContinue: (ok: boolean) => void;
  onContrast: (choice: "bad" | "good") => void;
}) {
  if (
    step.kind === "vocab_choice" ||
    step.kind === "gre_choice" ||
    step.kind === "cloze" ||
    step.kind === "listen_choice"
  ) {
    return (
      <div className="mt-3 space-y-4">
        {step.kind === "listen_choice" && step.speakText ? (
          <div className="flex items-center gap-3">
            <SpeakButton text={step.speakText} label="播放" />
            <p className="text-sm text-[var(--muted)]">{step.prompt}</p>
          </div>
        ) : (
          <h2 className="font-[family-name:var(--font-display)] text-2xl leading-snug text-[var(--ink)]">
            {step.prompt}
          </h2>
        )}
        {step.promptHint ? (
          <p className="text-sm text-[var(--muted)]">{step.promptHint}</p>
        ) : null}
        <div className="grid gap-2">
          {step.choices.map((c) => {
            const isPicked = picked === c;
            const isAnswer = c === step.answer;
            let style =
              "border-[var(--line)] hover:border-[var(--accent)] text-[var(--ink)]";
            if (picked) {
              if (isAnswer) style = "border-emerald-600 bg-emerald-50 text-[var(--ink)]";
              else if (isPicked) style = "border-rose-500 bg-rose-50 text-[var(--ink)]";
              else style = "border-[var(--line)] opacity-50";
            }
            return (
              <button
                key={c}
                type="button"
                disabled={!!picked}
                onClick={() => onPick(c, c === step.answer)}
                className={`min-h-11 rounded-sm border px-4 py-2.5 text-left text-sm transition ${style}`}
              >
                {c}
              </button>
            );
          })}
        </div>
        {picked && step.explainZh ? (
          <p className="text-sm text-[var(--muted)]">{step.explainZh}</p>
        ) : null}
      </div>
    );
  }

  if (step.kind === "grammar_contrast") {
    return (
      <div className="mt-3 space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          {step.prompt}
        </h2>
        <p className="text-sm text-[var(--muted)]">哪一句比較自然／正確？</p>
        <div className="grid gap-2">
          {(
            [
              ["bad", step.bad],
              ["good", step.good],
            ] as const
          ).map(([key, text]) => {
            let style =
              "border-[var(--line)] hover:border-[var(--accent)]";
            if (contrastPicked) {
              if (key === "good")
                style = "border-emerald-600 bg-emerald-50";
              else if (contrastPicked === "bad")
                style = "border-rose-500 bg-rose-50";
              else style = "border-[var(--line)] opacity-50";
            }
            return (
              <button
                key={key}
                type="button"
                disabled={!!contrastPicked}
                onClick={() => onContrast(key)}
                className={`min-h-11 rounded-sm border px-4 py-2.5 text-left text-sm ${style}`}
              >
                {text}
              </button>
            );
          })}
        </div>
        {contrastPicked ? (
          <p className="text-sm text-[var(--muted)]">{step.note}</p>
        ) : null}
      </div>
    );
  }

  if (step.kind !== "pattern_reveal" && step.kind !== "speak_check") {
    return null;
  }

  return (
    <div className="mt-3 space-y-4">
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
        {step.promptZh}
      </h2>
      {step.kind === "speak_check" ? (
        <p className="text-sm text-[var(--muted)]">
          先想英文，再跟讀；不求完美，完成即過關。
        </p>
      ) : (
        <p className="text-sm text-[var(--muted)]">先心裡組句，再揭曉英文。</p>
      )}
      {!revealed ? (
        <button
          type="button"
          onClick={onReveal}
          className="min-h-11 w-full rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)] hover:bg-[var(--ink-soft)]"
        >
          揭曉英文
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <SpeakButton text={step.answerEn} label="發音" />
            <p className="font-[family-name:var(--font-display)] text-xl leading-snug text-[var(--ink)]">
              {step.answerEn}
            </p>
          </div>
          {step.note ? (
            <p className="text-sm text-[var(--muted)]">{step.note}</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onRevealContinue(true)}
              className="min-h-11 flex-1 rounded-sm bg-[var(--ink)] px-4 text-sm text-[var(--paper)]"
            >
              {step.kind === "speak_check" ? "已跟讀" : "記住了"}
            </button>
            <button
              type="button"
              onClick={() => onRevealContinue(false)}
              className="min-h-11 flex-1 rounded-sm border border-[var(--line)] px-4 text-sm text-[var(--ink)]"
            >
              還不熟
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function DailyUnitCompleteCard({
  unit,
  correct,
  total,
  onAgain,
  onHome,
}: {
  unit: DailyUnit;
  correct: number;
  total: number;
  onAgain: () => void;
  onHome: () => void;
}) {
  const rate = total ? Math.round((correct / total) * 100) : 0;
  const msg = useMemo(() => {
    if (rate >= 80) return "節奏很好，可以加練下一單元。";
    if (rate >= 50) return "過關！錯題明天還會再遇到類似內容。";
    return "先完成比完美重要，明天同一主題會換題再練。";
  }, [rate]);

  return (
    <section className="space-y-5 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
        Unit complete
      </p>
      <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
        {unit.titleZh} 完成
      </h2>
      <p className="text-sm text-[var(--muted)]">
        答對 {correct}/{total}（{rate}%）。{msg}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onAgain}
          className="min-h-11 rounded-sm bg-[var(--ink)] px-5 text-sm text-[var(--paper)]"
        >
          再來一單元（+5–10 分）
        </button>
        <button
          type="button"
          onClick={onHome}
          className="min-h-11 rounded-sm border border-[var(--line)] px-5 text-sm text-[var(--ink)]"
        >
          回到今日總覽
        </button>
      </div>
    </section>
  );
}
