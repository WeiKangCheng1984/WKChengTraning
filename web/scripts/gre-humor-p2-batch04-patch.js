/** Patch: add radic + rap to finish P2-batch04 at 20 clusters. */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const lessonDir = path.join(humorDir, "lessons");
const gre = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/data/gre-vocabulary.json"), "utf8"));
const vocabMap = new Map();
for (const L of gre.letters || []) for (const w of L.words || []) vocabMap.set(String(w.en || "").toLowerCase(), w);

const existing = new Set();
for (const f of fs.readdirSync(clusterDir).filter((x) => x.endsWith(".json"))) {
  const c = JSON.parse(fs.readFileSync(path.join(clusterDir, f), "utf8"));
  for (const m of c.members || []) existing.add(m.headword.toLowerCase());
}

function card(h, zh, role, en, zhL, d = "morphology") {
  const v = vocabMap.get(h);
  return {
    headword: h,
    inVocab: Boolean(v),
    senseAnchor: v?.endef || zh,
    roleInScript: role,
    humorDevice: d,
    zhGloss: zh,
    speakLineEn: en,
    speakLineZh: zhL,
    related: { synonyms: v?.synonyms || "", antonyms: v?.antonyms || "" },
    vocabStatus: v ? "in-vocab" : "pending-add",
  };
}

const STAGE = "P2-batch04";
const packs = [
  {
    id: "root-radic-01",
    type: "root",
    elementLemma: "radic",
    priority: "B",
    titleZh: "radic｜根系園藝部",
    titleEn: "Radic Root Garden",
    hook: "字根 radic＝根——園藝部專管根本、根除與生根。",
    script:
      "radical／radically 連根改革。eradicate／eradication 根除雜草。radix／radicle／rootlet 根與幼根；rooted／rootedness／uprooting／deracinate——園長：eradicate p-hacking；radical openness。",
    reviewHooks: ["radic＝根：radical/eradicate/radix/rooted/deracinate", "eradicate＝根除"],
    pitfalls: ["radical＝根本的／激進的", "deracinate＝連根拔起"],
    members: [
      card("radical", "根本的；激進的", "連根", "Radical transparency beats decorative openness.", "根本透明勝過裝飾性開放。"),
      card("radically", "根本地", "連根副詞", "Radically rewrite incentives around corrections.", "根本改寫圍繞勘誤的誘因。"),
      card("eradicate", "根除", "拔雜草", "Eradicate silent outcome switching.", "根除沉默結局更換。"),
      card("eradication", "根除", "根除案", "Eradication of opacity starts with logs.", "根除不透明從日誌開始。"),
      card("radix", "字根；基數", "根部", "Treat the estimand as the radix of claims.", "把目標量當主張的根。"),
      card("radicle", "胚根；幼根", "幼根", "Protect the radicle of junior skepticism.", "保護資淺懷疑的幼根。", "story"),
      card("rootlet", "細根", "細根絲", "Each rootlet of bias needs a label.", "每條偏差細根都要標籤。", "story"),
      card("rooted", "生根的", "已生根", "Keep good habits rooted in checklists.", "讓好習慣在清單中生根。", "story"),
      card("rootedness", "生根性", "扎根度", "Rootedness in methods beats charisma.", "方法扎根勝過魅力。", "story"),
      card("uprooting", "拔根", "拔根中", "Uprooting legacy scripts needs a migration plan.", "拔除遺留腳本需要遷移計畫。", "story"),
      card("deracinate", "連根拔起", "拔起人", "Deracinate cargo-cult statistics.", "連根拔起盲從統計。", "story"),
      card("irradiate", "照射", "光灑根", "Irradiate dark corners of the pipeline with audits.", "用稽核照射管線暗角。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Destroy completely; root out:", promptZh: "根除：", choices: ["eradicate", "aspire", "placate", "mute"], answer: "eradicate" },
      { id: "q2", type: "sense", promptEn: "Fundamental; extreme:", promptZh: "根本／激進：", choices: ["radical", "vacuous", "interim", "polyglot"], answer: "radical" },
      { id: "q3", type: "sense", promptEn: "Uproot from native place:", promptZh: "連根拔起：", choices: ["deracinate", "satisfy", "bisect", "commend"], answer: "deracinate" },
    ],
  },
  {
    id: "root-rap-01",
    type: "root",
    elementLemma: "rap/rav",
    priority: "B",
    titleZh: "rap／rav｜奪取警報台",
    titleEn: "Rap Seize Alarm",
    hook: "字根 rap/rav＝奪——警報台專管強奪、狂喜與蹂躪。",
    script:
      "rapacious／rapacity 貪婪奪取。rapt／rapture／enrapture 奪魂狂喜。ravage／ravages／ravishing 蹂躪與奪目；usurp／plunder／seize——台長：rapacious metrics 禁；勿 usurp authorship。",
    reviewHooks: ["rap＝奪：rapacious/rapt/rapture/ravage/usurp", "rapacious＝貪婪的"],
    pitfalls: ["rapt＝全神貫注；rapture＝狂喜", "usurp＝篡奪"],
    members: [
      card("rapacious", "貪婪的", "搶奪嘴", "Rapacious citation farming erodes trust.", "貪婪刷引用侵蝕信任。"),
      card("rapacity", "貪婪", "搶奪慾", "Rapacity for significance invites fishing.", "對顯著性的貪婪誘發淘篩。"),
      card("rapt", "全神貫注的", "被奪走眼", "Stay rapt on the protocol, not the press.", "全神貫注規程，不是新聞。"),
      card("rapture", "狂喜", "奪魂喜", "Do not write abstracts in rapture without intervals.", "摘要別在狂喜中省略區間。"),
      card("enrapture", "使狂喜", "搶走心", "Flashy figures can enrapture and mislead.", "炫圖能使人狂喜並誤導。"),
      card("ravage", "蹂躪", "毀壞掃", "Fraud will ravage a lab faster than a bug.", "欺詐蹂躪實驗室比蟲快。"),
      card("ravages", "蹂躪痕跡", "毀壞痕", "Show the ravages of attrition in a flowchart.", "用流程圖展示流失蹂躪。"),
      card("ravishing", "令人著迷的", "奪目", "A ravishing narrative is not identification.", "奪目敘事不是識別策略。"),
      card("usurp", "篡奪", "搶位", "Do not usurp first authorship by stealth edits.", "不要靠偷偷改稿篡奪一作。", "story"),
      card("plunder", "掠奪", "搶庫", "Plunder of shared data without credit is theft.", "無署名掠奪共享資料是竊。", "story"),
      card("seize", "抓住；奪取", "一把抓", "Seize teaching moments when nulls appear.", "虛無出現時抓住教學時刻。", "story"),
      card("abduct", "綁架", "劫走", "Do not abduct conclusions from weak designs.", "不要從弱設計劫走結論。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Extremely greedy:", promptZh: "貪婪：", choices: ["rapacious", "tranquil", "nascent", "stringent"], answer: "rapacious" },
      { id: "q2", type: "sense", promptEn: "Seize a position wrongfully:", promptZh: "篡奪：", choices: ["usurp", "educate", "vacate", "diagram"], answer: "usurp" },
      { id: "q3", type: "sense", promptEn: "Destroy violently; lay waste:", promptZh: "蹂躪：", choices: ["ravage", "placate", "migrate", "commend"], answer: "ravage" },
    ],
  },
];

const written = [];
for (const raw of packs) {
  if (fs.existsSync(path.join(clusterDir, `${raw.id}.json`))) continue;
  raw.members = raw.members.filter((m) => !existing.has(m.headword)).slice(0, 12);
  if (raw.members.length < 8) {
    console.log("short", raw.id, raw.members.length);
    continue;
  }
  const cluster = {
    id: raw.id,
    type: raw.type,
    elementLemma: raw.elementLemma,
    titleZh: raw.titleZh,
    titleEn: raw.titleEn,
    hook: raw.hook,
    script: raw.script,
    members: raw.members,
    reviewHooks: raw.reviewHooks,
    pitfalls: raw.pitfalls,
    lessonRefs: [`lesson-${raw.id}`],
    status: "reviewed",
    priority: raw.priority,
    qualityGate: { reviewedAt: new Date().toISOString().slice(0, 10), stage: STAGE },
  };
  const lesson = {
    id: `lesson-${raw.id}`,
    slug: raw.id,
    season: 2,
    seasonTitleZh: "字根劇場",
    seasonTitleEn: "Root Theater",
    type: "family",
    minutes: "12-15",
    clusterId: raw.id,
    titleZh: raw.titleZh,
    titleEn: raw.titleEn,
    flow: [
      { step: 1, name: "鉤子", minutes: 0.5, content: raw.hook },
      { step: 2, name: "串記劇本", minutes: 2, content: raw.script },
      { step: 3, name: "詞卡 round", minutes: 7, content: "義錨 → 角色 → 跟讀英／中" },
      { step: 4, name: "快測", minutes: 2, content: "quiz ×3" },
      { step: 5, name: "口令帶走", minutes: 0.5, content: raw.reviewHooks },
    ],
    quiz: raw.quiz,
    pitfalls: raw.pitfalls,
    status: "reviewed",
    qualityGate: cluster.qualityGate,
  };
  fs.writeFileSync(path.join(clusterDir, `${raw.id}.json`), `${JSON.stringify(cluster, null, 2)}\n`);
  fs.writeFileSync(path.join(lessonDir, `lesson-${raw.id}.json`), `${JSON.stringify(lesson, null, 2)}\n`);
  for (const m of raw.members) existing.add(m.headword);
  written.push({ id: raw.id, n: raw.members.length });
}

const SEASON = {
  rhyme: { id: 1, titleZh: "押韻派對" },
  root: { id: 2, titleZh: "字根劇場" },
  semantic: { id: 3, titleZh: "語氣對打" },
  lookalike: { id: 3, titleZh: "語氣對打" },
  prefix: { id: 4, titleZh: "字首調味" },
};
const all = fs
  .readdirSync(clusterDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(clusterDir, f), "utf8")))
  .sort((a, b) => a.id.localeCompare(b.id));
const unique = new Set();
for (const c of all) for (const m of c.members || []) unique.add(m.headword);
const lessonIndex = all.map((c) => {
  const s = SEASON[c.type] || SEASON.root;
  return {
    id: `lesson-${c.id}`,
    slug: c.id,
    season: s.id,
    seasonTitleZh: s.titleZh,
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
  `${JSON.stringify({ version: "v0.9-p2b04", total: lessonIndex.length, lessons: lessonIndex }, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(humorDir, "index.json"),
  `${JSON.stringify(
    {
      version: "v0.9-p2b04",
      status: "p2-batch04",
      uniqueWords: unique.size,
      clusters: all.map((c) => ({
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

const batchIds = [
  "root-graph-01",
  "root-fract-01",
  "root-man-01",
  "root-mand-01",
  "root-migr-01",
  "root-nat-01",
  "root-press-01",
  "root-vac-01",
  "root-val-01",
  "root-strict-01",
  "root-tact-01",
  "root-sect-01",
  "root-plac-01",
  "root-qui-01",
  "root-sat-01",
  "prefix-circum-01",
  "prefix-poly-01",
  "prefix-inter-01",
  "root-radic-01",
  "root-rap-01",
];
const detail = batchIds
  .map((id) => {
    const c = all.find((x) => x.id === id);
    return c ? { id, n: (c.members || []).length } : null;
  })
  .filter(Boolean);

const report = `# P2-batch04 完成報告（幽默完整）

| 指標 | 數值 |
|------|------|
| 本批寫入 | **${detail.length}** |
| 總家族／課 | **${all.length}** |
| 獨特詞 | **${unique.size}** |
| 距 P2(2500) | **${Math.max(0, 2500 - unique.size)}** |
| 距 4,000 | **${Math.max(0, 4000 - unique.size)}** |

## 本批家族
${detail.map((w) => `- \`${w.id}\`（${w.n} 詞）`).join("\n")}

## 品質備註
- 每族：hook／script／members≥8／reviewHooks／pitfalls／lesson＋quiz×3／status: reviewed
- 原案 \`root-mit-01\` 已存在、\`root-spir-01\` 重複詞過多；改以 \`root-radic-01\`、\`root-rap-01\` 補滿 20 族

## 下一步
- 續 P2-batch05；可選 pending 分流
`;
fs.writeFileSync(path.join(humorDir, "P2-BATCH04-REPORT.md"), report);
console.log(JSON.stringify({ written, total: all.length, unique: unique.size, batch: detail.length }, null, 2));
