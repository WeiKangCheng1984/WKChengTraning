/**
 * Pack gre-humor/clusters + lessons into web/src/data/gre-humor.json for the site.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const lessonDir = path.join(humorDir, "lessons");
const outPath = path.join(__dirname, "../src/data/gre-humor.json");

const clusters = fs
  .readdirSync(clusterDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(clusterDir, f), "utf8")))
  .sort((a, b) => a.id.localeCompare(b.id));

const lessons = fs
  .readdirSync(lessonDir)
  .filter((f) => f.startsWith("lesson-") && f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(lessonDir, f), "utf8")));

const lessonByCluster = new Map(lessons.map((l) => [l.clusterId, l]));

const TYPE_LABEL = {
  rhyme: { zh: "押韻派對", en: "Rhyme", season: 1 },
  root: { zh: "字根劇場", en: "Root", season: 2 },
  semantic: { zh: "語氣對打", en: "Semantic", season: 3 },
  lookalike: { zh: "形近對決", en: "Look-alike", season: 3 },
  prefix: { zh: "字首調味", en: "Prefix", season: 4 },
};

const unique = new Set();
for (const c of clusters) {
  for (const m of c.members || []) unique.add(m.headword);
}

const packed = clusters.map((c) => {
  const lesson = lessonByCluster.get(c.id);
  const meta = TYPE_LABEL[c.type] || TYPE_LABEL.root;
  return {
    id: c.id,
    slug: c.id,
    type: c.type,
    typeZh: meta.zh,
    typeEn: meta.en,
    season: meta.season,
    priority: c.priority || "A",
    status: c.status || "draft",
    titleZh: c.titleZh,
    titleEn: c.titleEn,
    hook: c.hook,
    script: c.script,
    reviewHooks: c.reviewHooks || [],
    pitfalls: c.pitfalls || [],
    members: (c.members || []).map((m) => ({
      headword: m.headword,
      zhGloss: m.zhGloss,
      senseAnchor: m.senseAnchor,
      roleInScript: m.roleInScript,
      humorDevice: m.humorDevice,
      speakLineEn: m.speakLineEn,
      speakLineZh: m.speakLineZh,
      inVocab: Boolean(m.inVocab),
      vocabStatus: m.vocabStatus || (m.inVocab ? "in-vocab" : "pending"),
    })),
    memberCount: (c.members || []).length,
    quiz: lesson?.quiz || [],
    flow: lesson?.flow || [],
    minutes: lesson?.minutes || "12-15",
  };
});

const seasons = [
  {
    id: 1,
    titleZh: "押韻派對",
    titleEn: "Rhyme Party",
    lessons: packed.filter((p) => p.type === "rhyme").map((p) => p.slug),
  },
  {
    id: 2,
    titleZh: "字根劇場",
    titleEn: "Root Theater",
    lessons: packed.filter((p) => p.type === "root").map((p) => p.slug),
  },
  {
    id: 3,
    titleZh: "語氣與形近對打",
    titleEn: "Tone & Look-alikes",
    lessons: packed
      .filter((p) => p.type === "semantic" || p.type === "lookalike")
      .map((p) => p.slug),
  },
  {
    id: 4,
    titleZh: "字首調味",
    titleEn: "Prefix Seasoning",
    lessons: packed.filter((p) => p.type === "prefix").map((p) => p.slug),
  },
];

const doc = {
  source: "gre-humor/",
  version: "s3c-site-v1",
  generatedAt: new Date().toISOString(),
  totalClusters: packed.length,
  uniqueWords: unique.size,
  seasons,
  clusters: packed,
};

fs.writeFileSync(outPath, `${JSON.stringify(doc, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      out: outPath,
      clusters: packed.length,
      uniqueWords: unique.size,
      withQuiz: packed.filter((p) => p.quiz.length >= 3).length,
    },
    null,
    2,
  ),
);
