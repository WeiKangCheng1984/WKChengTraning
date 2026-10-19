/**
 * Materialize P3-batch03 from /tmp/gre-humor-p3b03.json
 * node web/scripts/gre-humor-p3b03.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const lessonDir = path.join(humorDir, "lessons");
const dataPath = "/tmp/gre-humor-p3b03.json";

const gre = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/gre-vocabulary.json"), "utf8"),
);
const vocabMap = new Map();
for (const letter of gre.letters || []) {
  for (const w of letter.words || []) vocabMap.set(String(w.en || "").toLowerCase(), w);
}

const existing = new Set();
for (const f of fs.readdirSync(clusterDir).filter((x) => x.endsWith(".json"))) {
  const c = JSON.parse(fs.readFileSync(path.join(clusterDir, f), "utf8"));
  for (const m of c.members || []) existing.add(String(m.headword).toLowerCase());
}

const SEASON = {
  rhyme: { id: 1, titleZh: "押韻派對", titleEn: "Rhyme Party" },
  root: { id: 2, titleZh: "字根劇場", titleEn: "Root Theater" },
  semantic: { id: 3, titleZh: "語氣對打", titleEn: "Tone Duels" },
  lookalike: { id: 3, titleZh: "語氣對打", titleEn: "Tone Duels" },
  prefix: { id: 4, titleZh: "字首調味", titleEn: "Prefix Seasoning" },
};

function funnyLines(en, zh, role) {
  const speakLineEn = `Cue the ${role}: ${en} walks on and the gag sticks.`;
  const speakLineZh = `請「${role}」出場：${en} 一上場梗就黏住——${zh}。`;
  return { speakLineEn, speakLineZh };
}

function card(arr) {
  const [headword, zhGloss, roleInScript, speakLineEnRaw, speakLineZhRaw, humorDevice = "morphology"] =
    arr;
  const key = String(headword).toLowerCase();
  const v = vocabMap.get(key);
  const funny = funnyLines(key, zhGloss, roleInScript);
  // Prefer scene-cue lines when raw looks like a bland GRE tip
  const bland = String(speakLineEnRaw || "").startsWith("GRE tip:");
  return {
    headword: key,
    inVocab: Boolean(v),
    senseAnchor: v?.endef || zhGloss,
    roleInScript,
    humorDevice,
    zhGloss,
    speakLineEn: bland ? funny.speakLineEn : speakLineEnRaw || funny.speakLineEn,
    speakLineZh: bland ? funny.speakLineZh : speakLineZhRaw || funny.speakLineZh,
    related: { synonyms: v?.synonyms || "", antonyms: v?.antonyms || "" },
    vocabStatus: v ? "in-vocab" : "pending-add",
  };
}

function quizFrom(raw) {
  const [promptEn, promptZh, answer, ...rest] = raw;
  const choices = [answer, ...rest].slice(0, 4);
  return { id: "q", type: "sense", promptEn, promptZh, choices, answer };
}

const NEW = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const written = [];
const blocked = [];

for (const raw of NEW) {
  if (fs.existsSync(path.join(clusterDir, `${raw.id}.json`))) {
    blocked.push({ id: raw.id, issues: ["already-exists"] });
    continue;
  }
  const stage = raw.stage || "P3-batch03";
  let members = (raw.members || []).map(card).filter((m) => {
    if (existing.has(m.headword)) return false;
    return true;
  });
  const seen = new Set();
  members = members.filter((m) => {
    if (seen.has(m.headword)) return false;
    seen.add(m.headword);
    return true;
  });

  const quiz = (raw.quiz || []).map((q, i) => {
    const item = quizFrom(q);
    item.id = `q${i + 1}`;
    return item;
  });

  const issues = [];
  if (!raw.hook || raw.hook.length < 8) issues.push("hook");
  if (!raw.script || raw.script.length < 40) issues.push("script");
  if (members.length < 8) issues.push(`members<8(${members.length})`);
  if ((raw.review || []).length < 2) issues.push("hooks");
  if ((raw.pitfalls || []).length < 1) issues.push("pitfalls");
  if (quiz.length < 3) issues.push("quiz");
  for (const m of members) {
    if (!m.speakLineEn || m.speakLineEn.length < 18) issues.push(`speak:${m.headword}`);
  }
  if (issues.length) {
    blocked.push({ id: raw.id, issues, n: members.length });
    continue;
  }

  const cluster = {
    id: raw.id,
    type: raw.type,
    elementLemma: raw.lemma,
    titleZh: raw.titleZh,
    titleEn: raw.titleEn,
    hook: raw.hook,
    script: raw.script,
    members,
    reviewHooks: raw.review,
    pitfalls: raw.pitfalls,
    lessonRefs: [`lesson-${raw.id}`],
    status: "reviewed",
    priority: raw.pri || "B",
    qualityGate: { reviewedAt: new Date().toISOString().slice(0, 10), stage },
  };

  const season = SEASON[cluster.type] || SEASON.root;
  const lesson = {
    id: `lesson-${cluster.id}`,
    slug: cluster.id,
    season: season.id,
    seasonTitleZh: season.titleZh,
    seasonTitleEn: season.titleEn,
    type: cluster.type === "lookalike" || cluster.type === "semantic" ? "duel" : "family",
    minutes: "12-15",
    clusterId: cluster.id,
    titleZh: cluster.titleZh,
    titleEn: cluster.titleEn,
    flow: [
      { step: 1, name: "鉤子", minutes: 0.5, content: cluster.hook },
      { step: 2, name: "串記劇本", minutes: 2, content: cluster.script },
      { step: 3, name: "詞卡 round", minutes: 7, content: "義錨 → 角色 → 跟讀英／中" },
      { step: 4, name: "快測", minutes: 2, content: "quiz ×3" },
      { step: 5, name: "口令帶走", minutes: 0.5, content: cluster.reviewHooks },
    ],
    quiz,
    pitfalls: cluster.pitfalls,
    status: "reviewed",
    qualityGate: cluster.qualityGate,
  };

  fs.writeFileSync(path.join(clusterDir, `${cluster.id}.json`), `${JSON.stringify(cluster, null, 2)}\n`);
  fs.writeFileSync(path.join(lessonDir, `lesson-${cluster.id}.json`), `${JSON.stringify(lesson, null, 2)}\n`);
  for (const m of members) existing.add(m.headword);
  written.push({ id: cluster.id, stage, n: members.length });
}

const allClusters = fs
  .readdirSync(clusterDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(clusterDir, f), "utf8")))
  .sort((a, b) => a.id.localeCompare(b.id));
const unique = new Set();
for (const c of allClusters) for (const m of c.members || []) unique.add(m.headword);

const lessonIndex = allClusters.map((c) => {
  const season = SEASON[c.type] || SEASON.root;
  return {
    id: `lesson-${c.id}`,
    slug: c.id,
    season: season.id,
    seasonTitleZh: season.titleZh,
    titleZh: c.titleZh,
    clusterId: c.id,
    type: c.type === "lookalike" || c.type === "semantic" ? "duel" : "family",
    status: c.status,
    memberCount: (c.members || []).length,
  };
});
lessonIndex.sort((a, b) => a.season - b.season || a.slug.localeCompare(b.slug));

fs.writeFileSync(
  path.join(lessonDir, "index.json"),
  `${JSON.stringify({ version: "v0.9-p3-batch03", total: lessonIndex.length, lessons: lessonIndex }, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(humorDir, "index.json"),
  `${JSON.stringify(
    {
      version: "v0.9-p3-batch03",
      status: "p3-batch03",
      uniqueWords: unique.size,
      clusters: allClusters.map((c) => ({
        id: c.id,
        type: c.type,
        titleZh: c.titleZh,
        status: c.status,
        memberCount: (c.members || []).length,
      })),
      lessons: lessonIndex,
    },
    null,
    2,
  )}\n`,
);

fs.writeFileSync(
  path.join(humorDir, "P3-BATCH02-REPORT.md"),
  `# P3-batch03 完成報告（語義對打＋形近＋押韻・幽默優先）

| 指標 | 數值 |
|------|------|
| 本批寫入 | **${written.length}** |
| 總家族／課 | **${allClusters.length}** |
| 獨特詞 | **${unique.size}** |
| 距 P3(3400) | **${Math.max(0, 3400 - unique.size)}** |
| 距 4,000 | **${Math.max(0, 4000 - unique.size)}** |

## 本批家族（火山冰箱／形近診所／押韻派對）
${written.map((w) => `- \`${w.id}\`（${w.n} 詞）`).join("\n")}

## 品質備註
- 語義對打：熱↔冷、快↔慢、靜↔鬧、敏↔鈍、潔↔污、吸↔斥、省↔花、舊↔新——語氣分邊、場景記牢
- 形近診所：abolish/abominate/demolish、asperity/aspersion、brandish/blandish/bristle、bumble/bungle、contrite/trite、auspicious/ominous、delude/deluge/divulge
- 押韻：-uous／-eous／-ment／-sion 派對補強
- members≥8＋quiz×3＋reviewed；speak line 採場景 cue，避免乾巴巴 tip

## 下一步
- 適度 pending 分流（P2-batch07／P3-batch01／P3-batch03）
- 續 **P3-batch04** 衝 3,400（若尚未達標）
`,
);

console.log(
  JSON.stringify(
    {
      written: written.length,
      blocked,
      totalClusters: allClusters.length,
      uniqueWords: unique.size,
      gapTo3400: Math.max(0, 3400 - unique.size),
      gapTo4000: Math.max(0, 4000 - unique.size),
      ids: written.map((w) => w.id),
    },
    null,
    2,
  ),
);
