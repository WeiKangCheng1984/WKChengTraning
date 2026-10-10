"use client";

import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import type {
  DailyStep,
  DailyUnit,
  StepResult,
} from "@/lib/dailyUnit/types";

type CompletePayload = {
  correct: number;
  total: number;
  results: StepResult[];
};

type Props = {
  unit: DailyUnit;
  onComplete: (stats: CompletePayload) => void;
  onExit: () => void;
};

export function DailyUnitPlayer({ unit, onComplete, onExit }: Props) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<StepResult[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [contrastPicked, setContrastPicked] = useState<"bad" | "good" | null>(
    null,
  );

  const step = unit.steps[index];
  const total = unit.steps.length;
  const pct = Math.round(
    ((index + (revealed || picked || contrastPicked ? 1 : 0)) / total) * 100,
  );

  function advance(wasCorrect: boolean, userAnswer?: string) {
    if (!step) return;
    const nextResults = [
      ...results,
      { step, ok: wasCorrect, userAnswer },
    ];
    setResults(nextResults);
    setPicked(null);
    setRevealed(false);
    setContrastPicked(null);
    if (index + 1 >= total) {
      onComplete({
        correct: nextResults.filter((r) => r.ok).length,
        total,
        results: nextResults,
      });
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
        <p className="text-xs font-medium tracking-[0.14em] text-[var(--sky)]">
          Day {unit.programDay} · {index + 1}/{total}
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[var(--line)]">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(100, pct)}%`,
            background:
              "linear-gradient(90deg, var(--sky), var(--accent))",
          }}
        />
      </div>

      <div
        className="border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7"
        style={{ borderRadius: "var(--radius)" }}
      >
        <p className="text-xs font-medium tracking-[0.14em] text-[var(--accent)]">
          {kindLabel(step.kind)}
        </p>
        <StepBody
          step={step}
          picked={picked}
          revealed={revealed}
          contrastPicked={contrastPicked}
          onPick={(c, ok) => {
            setPicked(c);
            window.setTimeout(() => advance(ok, c), 650);
          }}
          onReveal={() => setRevealed(true)}
          onRevealContinue={(ok, label) => advance(ok, label)}
          onContrast={(choice) => {
            setContrastPicked(choice);
            window.setTimeout(
              () =>
                advance(
                  choice === "good",
                  choice === "good" ? "選了正確句" : "選了較不自然句",
                ),
              700,
            );
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
  onRevealContinue: (ok: boolean, label: string) => void;
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
              if (isAnswer)
                style =
                  "border-[var(--ok)] bg-[var(--ok-soft)] text-[var(--ink)]";
              else if (isPicked)
                style =
                  "border-[var(--bad)] bg-[var(--bad-soft)] text-[var(--ink)]";
              else style = "border-[var(--line)] opacity-50";
            }
            return (
              <button
                key={c}
                type="button"
                disabled={!!picked}
                onClick={() => onPick(c, c === step.answer)}
                className={`min-h-11 rounded-lg border px-4 py-2.5 text-left text-sm transition ${style}`}
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
            let style = "border-[var(--line)] hover:border-[var(--sky)]";
            if (contrastPicked) {
              if (key === "good")
                style = "border-[var(--ok)] bg-[var(--ok-soft)]";
              else if (contrastPicked === "bad")
                style = "border-[var(--bad)] bg-[var(--bad-soft)]";
              else style = "border-[var(--line)] opacity-50";
            }
            return (
              <button
                key={key}
                type="button"
                disabled={!!contrastPicked}
                onClick={() => onContrast(key)}
                className={`min-h-11 rounded-lg border px-4 py-2.5 text-left text-sm ${style}`}
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
          className="min-h-11 w-full rounded-lg bg-[var(--sky)] px-4 text-sm text-white hover:brightness-105"
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
              onClick={() =>
                onRevealContinue(
                  true,
                  step.kind === "speak_check" ? "已跟讀" : "記住了",
                )
              }
              className="min-h-11 flex-1 rounded-lg bg-[var(--accent)] px-4 text-sm text-white"
            >
              {step.kind === "speak_check" ? "已跟讀" : "記住了"}
            </button>
            <button
              type="button"
              onClick={() => onRevealContinue(false, "還不熟")}
              className="min-h-11 flex-1 rounded-lg border border-[var(--line)] px-4 text-sm text-[var(--ink)]"
            >
              還不熟
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function reviewPrompt(step: DailyStep): string {
  switch (step.kind) {
    case "pattern_reveal":
    case "speak_check":
      return step.promptZh;
    case "grammar_contrast":
      return step.prompt;
    default:
      return step.prompt;
  }
}

function reviewAnswer(step: DailyStep): string {
  switch (step.kind) {
    case "pattern_reveal":
    case "speak_check":
      return step.answerEn;
    case "grammar_contrast":
      return step.good;
    default:
      return step.answer;
  }
}

function reviewExplain(step: DailyStep): string | undefined {
  switch (step.kind) {
    case "grammar_contrast":
      return `正確：${step.good}\n較不自然：${step.bad}\n${step.note}`;
    case "pattern_reveal":
    case "speak_check":
      return step.note;
    default:
      return step.explainZh;
  }
}

function reviewSpeak(step: DailyStep): string | undefined {
  switch (step.kind) {
    case "listen_choice":
      return step.speakText;
    case "pattern_reveal":
    case "speak_check":
      return step.answerEn;
    case "grammar_contrast":
      return step.good;
    default:
      return undefined;
  }
}

export function DailyUnitReview({
  unit,
  correct,
  total,
  results,
  onAgain,
  onHome,
  againLabel = "再來一單元（+5–10 分）",
  homeLabel = "回到今日總覽",
}: {
  unit: DailyUnit;
  correct: number;
  total: number;
  results: StepResult[];
  onAgain: () => void;
  onHome: () => void;
  againLabel?: string;
  homeLabel?: string;
}) {
  const rate = total ? Math.round((correct / total) * 100) : 0;
  const msg = useMemo(() => {
    if (rate >= 90) return "太棒了！節奏像在闖關，再加練一單元也很適合。";
    if (rate >= 70) return "過關啦！下面逐題看一下，把不熟的收進腦袋。";
    if (rate >= 50) return "完成最重要！錯題解析幫你把坑填起來。";
    return "先做完就贏一半。慢慢看解析，明天同一主題會換題再練。";
  }, [rate]);

  const wrong = results.filter((r) => !r.ok).length;

  return (
    <section className="space-y-6">
      <div
        className="border border-[var(--line)] p-6"
        style={{
          borderRadius: "var(--radius)",
          background:
            "linear-gradient(145deg, color-mix(in srgb, var(--accent-soft) 65%, white), color-mix(in srgb, var(--sky-soft) 70%, white))",
        }}
      >
        <p className="text-xs font-medium tracking-[0.16em] text-[var(--sky)]">
          單元複習檢討
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          {unit.titleZh} 完成！
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{msg}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span
            className="rounded-full px-3 py-1 font-medium text-white"
            style={{ background: "var(--accent)" }}
          >
            答對 {correct}/{total}
          </span>
          <span
            className="rounded-full px-3 py-1 font-medium text-white"
            style={{ background: "var(--sky)" }}
          >
            正確率 {rate}%
          </span>
          {wrong > 0 ? (
            <span className="rounded-full bg-[var(--bad-soft)] px-3 py-1 font-medium text-[var(--bad)]">
              需複習 {wrong} 題
            </span>
          ) : (
            <span className="rounded-full bg-[var(--ok-soft)] px-3 py-1 font-medium text-[var(--ok)]">
              全對！
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[var(--ink)]">每題解析</h3>
        <ol className="space-y-3">
          {results.map((r, i) => {
            const speak = reviewSpeak(r.step);
            const explain = reviewExplain(r.step);
            return (
              <li
                key={`${r.step.id}-${i}`}
                className="border border-[var(--line)] bg-[var(--surface)] p-4"
                style={{ borderRadius: "var(--radius)" }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-[var(--muted)]">
                    第 {i + 1} 題 · {kindLabel(r.step.kind)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      r.ok
                        ? "bg-[var(--ok-soft)] text-[var(--ok)]"
                        : "bg-[var(--bad-soft)] text-[var(--bad)]"
                    }`}
                  >
                    {r.ok ? "正確" : "再看一次"}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--ink)]">
                  {reviewPrompt(r.step)}
                </p>
                {r.step.kind === "listen_choice" && r.step.promptHint ? (
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {r.step.promptHint}
                  </p>
                ) : null}
                <div className="mt-3 space-y-1.5 text-sm">
                  {r.userAnswer ? (
                    <p className="text-[var(--muted)]">
                      你的作答：
                      <span
                        className={
                          r.ok ? "text-[var(--ok)]" : "text-[var(--bad)]"
                        }
                      >
                        {" "}
                        {r.userAnswer}
                      </span>
                    </p>
                  ) : null}
                  <p className="text-[var(--ink)]">
                    正確答案：
                    <span className="font-medium text-[var(--sky)]">
                      {" "}
                      {reviewAnswer(r.step)}
                    </span>
                    {speak ? (
                      <span className="ml-2 inline-flex align-middle">
                        <SpeakButton text={speak} label="發音" size="sm" />
                      </span>
                    ) : null}
                  </p>
                  {explain ? (
                    <p className="whitespace-pre-line rounded-lg bg-[var(--sky-soft)] px-3 py-2 text-[var(--ink-soft)]">
                      {explain}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        <button
          type="button"
          onClick={onAgain}
          className="min-h-11 rounded-lg bg-[var(--accent)] px-5 text-sm text-white hover:brightness-105"
        >
          {againLabel}
        </button>
        <button
          type="button"
          onClick={onHome}
          className="min-h-11 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-5 text-sm text-[var(--ink)]"
        >
          {homeLabel}
        </button>
      </div>
    </section>
  );
}
