"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import type { GreHumorCluster } from "@/lib/greHumor";

type Props = {
  cluster: GreHumorCluster;
  prevSlug: string | null;
  nextSlug: string | null;
};

export function GreHumorLessonClient({ cluster, prevSlug, nextSlug }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);

  const score = useMemo(() => {
    if (!revealed) return null;
    let ok = 0;
    for (const q of cluster.quiz) {
      if (answers[q.id] === q.answer) ok += 1;
    }
    return { ok, total: cluster.quiz.length };
  }, [answers, cluster.quiz, revealed]);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/english/gre/humor"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← GRE 幽默聯想
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          Season {cluster.season} · {cluster.typeZh} · {cluster.minutes} min ·{" "}
          {cluster.memberCount} 詞
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          {cluster.titleZh}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{cluster.titleEn}</p>
      </div>

      <section className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-medium text-[var(--ink)]">怎麼練</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[var(--muted)]">
          <li>聽／讀「鉤子」與「串記劇本」（可點發音）。</li>
          <li>逐詞跟讀 headword 與例句；對照中文角色與義錨。</li>
          <li>做下方 3 題快測，再記住口令帶走。</li>
        </ol>
      </section>

      <section className="space-y-3">
        <div className="flex items-start gap-2">
          <SpeakButton text={cluster.titleEn} label={cluster.titleEn} size="sm" />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
              鉤子
            </p>
            <p className="mt-1 text-[var(--ink)]">{cluster.hook}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              發音按鈕讀英文課名：{cluster.titleEn}
            </p>
          </div>
        </div>

        <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper)] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
              串記劇本
            </p>
            <SpeakButton
              text={`Key words: ${cluster.members.map((m) => m.headword).join(", ")}.`}
              label="本族單字"
              size="sm"
            />
            <SpeakButton
              text={`Key words: ${cluster.members.map((m) => m.headword).join(", ")}.`}
              label="慢速點名"
              size="sm"
              speed="slow"
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]">
            {cluster.script}
          </p>
          <p className="mt-2 text-xs text-[var(--muted)]">
            劇本為中英串記；請用上方按鈕聽本族英文單字點名，再逐詞跟讀下方例句。
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          詞卡（{cluster.memberCount}）
        </h2>
        <ul className="space-y-3">
          {cluster.members.map((m) => (
            <li
              key={m.headword}
              className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper)] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <SpeakButton text={m.headword} label={m.headword} size="sm" />
                <SpeakButton
                  text={m.headword}
                  label="慢"
                  size="sm"
                  speed="slow"
                />
                <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
                  {m.headword}
                </h3>
                <span className="text-sm text-[var(--muted)]">{m.zhGloss}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">
                <span className="text-[var(--accent)]">劇本角色：</span>
                {m.roleInScript}
              </p>
              {m.senseAnchor ? (
                <p className="mt-1 text-sm text-[var(--ink)]">
                  <span className="text-[var(--muted)]">義錨：</span>
                  {m.senseAnchor}
                </p>
              ) : null}
              <div className="mt-3 flex items-start gap-2 rounded-sm border border-[var(--line)] bg-[var(--surface)] p-3">
                <div className="flex flex-col gap-1">
                  <SpeakButton
                    text={m.speakLineEn}
                    label={m.speakLineEn.slice(0, 24)}
                    size="sm"
                  />
                  <SpeakButton
                    text={m.speakLineEn}
                    label="慢速例句"
                    size="sm"
                    speed="slow"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--ink)]">{m.speakLineEn}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{m.speakLineZh}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {(cluster.quiz?.length ?? 0) > 0 ? (
        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
            快測（{cluster.quiz.length} 題）
          </h2>
          <ul className="space-y-4">
            {cluster.quiz.map((q, i) => (
              <li
                key={q.id}
                className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper)] p-4"
              >
                <div className="flex items-start gap-2">
                  <SpeakButton text={q.promptEn} label={`Q${i + 1}`} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-[var(--ink)]">
                      {i + 1}. {q.promptEn}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{q.promptZh}</p>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.choices.map((choice) => {
                    const selected = answers[q.id] === choice;
                    const isAnswer = revealed && choice === q.answer;
                    const wrong =
                      revealed && selected && choice !== q.answer;
                    return (
                      <button
                        key={choice}
                        type="button"
                        disabled={revealed}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: choice }))
                        }
                        className={`flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${
                          isAnswer
                            ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                            : wrong
                              ? "border-red-400/60 bg-red-50"
                              : selected
                                ? "border-[var(--ink)] bg-[var(--surface)]"
                                : "border-[var(--line)] bg-[var(--surface)]"
                        }`}
                      >
                        <SpeakButton text={choice} label={choice} size="sm" />
                        <span>{choice}</span>
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="inline-flex min-h-10 items-center rounded-lg bg-[var(--accent)] px-4 text-sm text-white"
            >
              核對答案
            </button>
            {revealed ? (
              <button
                type="button"
                onClick={() => {
                  setRevealed(false);
                  setAnswers({});
                }}
                className="inline-flex min-h-10 items-center rounded-lg border border-[var(--line)] px-4 text-sm"
              >
                重測
              </button>
            ) : null}
            {score ? (
              <p className="text-sm text-[var(--ink)]">
                得分 {score.ok} / {score.total}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
            口令帶走
          </p>
          <ul className="mt-2 space-y-2">
            {cluster.reviewHooks.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm">
                <SpeakButton text={h} label={h.slice(0, 20)} size="sm" />
                <span className="text-[var(--ink)]">{h}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
            易混／陷阱
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--ink)]">
            {cluster.pitfalls.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex flex-wrap gap-2">
        {prevSlug ? (
          <Link
            href={`/english/gre/humor/${prevSlug}`}
            className="inline-flex min-h-10 items-center rounded-lg border border-[var(--line)] px-4 text-sm"
          >
            ← 上一族
          </Link>
        ) : null}
        {nextSlug ? (
          <Link
            href={`/english/gre/humor/${nextSlug}`}
            className="inline-flex min-h-10 items-center rounded-lg border border-[var(--line)] px-4 text-sm"
          >
            下一族 →
          </Link>
        ) : null}
        <Link
          href="/english/gre"
          className="inline-flex min-h-10 items-center rounded-lg border border-[var(--line)] px-4 text-sm text-[var(--sky)]"
        >
          回 GRE 字母庫
        </Link>
      </section>
    </div>
  );
}
