/** Shared system prompt + module card helpers for AI conversation coach. */

export const COACH_SYSTEM_PROMPT = `# Role
You are my American English conversation partner and speaking coach for a 15–20 minute structured session.

# Session Arc (follow in order)
A) Greeting (about 1 min)
B) Open today's topic (about 2 min)
C) Practice target words/sentences WITH live polish: gently rephrase my lines, teach 1 extra usage when natural, share a brief native tip — keep turns to 1–3 sentences
D) I will ask you FIVE questions from the module — answer each briefly (1–3 sentences)
E) Then YOU ask me THREE questions — after each of my answers, give one short polish if needed
F) Summarize and compare our viewpoints (you may use Traditional Chinese for this part)
G) Close with a short conclusion: what I practiced well + one encouragement

# Rules
- Stay in the scenario/role from the module.
- Prefer spoken American English.
- Do not lecture in long paragraphs.
- During A–E, keep most talk in English; use Traditional Chinese mainly in F (and lightly in polish notes if I struggle).
- When I say NEXT, advance to the next phase. When I say WRAP, jump to F then G.
- When this prompt is loaded, reply with only: "Ready! Paste today's module card and we'll start from greeting."`;

export type CoachLine = {
  en: string;
  zh: string;
};

export type CoachLesson = {
  id: number;
  slug: string;
  season: number;
  seasonTitleZh: string;
  seasonTitleEn: string;
  domain: string;
  topicEn: string;
  topicZh: string;
  scenario: string;
  aiRole: string;
  sourceHref: string;
  sourceLabel: string;
  targets: string[];
  targetSentences: CoachLine[];
  myFiveQuestions: CoachLine[];
  /** Full oral practice bank (A–G), ≥30 sentences */
  practiceSentences?: CoachLine[];
  /** Longer spoken turns for phase C/E, 6–8 sentences */
  longSentences?: CoachLine[];
  minutes: string;
};

export type CoachLessonsData = {
  source: string;
  version?: string;
  total: number;
  seasons: Array<{
    id: number;
    titleZh: string;
    titleEn: string;
    lessons: number[];
  }>;
  lessons: CoachLesson[];
};

function lineEn(line: CoachLine | string): string {
  return typeof line === "string" ? line : line?.en || "";
}

function formatLines(lines: Array<CoachLine | string> | undefined): string {
  return (lines || [])
    .map((t, i) => {
      if (typeof t === "string") return `${i + 1}. ${t}`;
      return `${i + 1}. ${t.en}${t.zh ? `\n   ZH: ${t.zh}` : ""}`;
    })
    .join("\n");
}

export function formatModuleCard(lesson: CoachLesson): string {
  const pad = String(lesson.id).padStart(2, "0");
  const words = lesson.targets.map((t, i) => `${i + 1}. ${t}`).join("\n");
  const sents = formatLines(lesson.targetSentences);
  const qs = formatLines(lesson.myFiveQuestions);
  const practice = formatLines(lesson.practiceSentences);
  const longs = formatLines(lesson.longSentences);

  return `## Today's Module — Lesson ${pad}

**Topic:** ${lesson.topicEn} / ${lesson.topicZh}
**Domain:** ${lesson.domain}
**Scenario:** ${lesson.scenario}
**AI Role:** ${lesson.aiRole}

**Session flow (15–20 min):**
A Greeting → B Open topic → C Practice words/sentences with live polish → D I ask you 5 questions → E You ask me 3 questions → F Compare viewpoints → G Closing conclusion
(Commands: NEXT = next phase, WRAP = jump to F then G)

**Target Words / Phrases:**
${words}

**Target Sentences (use in phase C):**
${sents || "(use the target words in your own sentences)"}

**My 5 Questions for you (phase D):**
${qs}

**Practice Sentence Bank (≥30, cover A–G, with ZH gloss):**
${practice || "(see lesson page)"}

**Long Sentences (6–8, spoken turns, with ZH gloss):**
${longs || "(see lesson page)"}

Warm-up (optional): ${lesson.sourceLabel} → ${lesson.sourceHref}

Start in English from greeting after Ready. Use the practice bank and long sentences during the session. ZH lines are for my reference only — I speak English.`;
}

export { lineEn };
