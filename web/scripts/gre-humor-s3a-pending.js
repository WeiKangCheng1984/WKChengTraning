/**
 * Stage S3a: triage pending-add headwords
 * - high GRE value → insert into gre-vocabulary.json
 * - deferred → mark on cluster members (stay in humor only)
 * Regenerates coverage after sync.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const grePath = path.join(__dirname, "../src/data/gre-vocabulary.json");

/** Words kept in humor for morphology/story but NOT added to GRE hard-word bank */
const DEFER = new Set([
  // too basic for GRE bank
  "access",
  "process",
  "credit",
  "grade",
  "object",
  "subject",
  "project",
  "respect",
  "vocabulary",
  "vocal",
  "universe",
  "anniversary",
  "mission",
  "permit",
  "submit",
  "progress",
  "reject",
  "inject",
  "educate",
  "logic",
  "introduction",
  "interrupt",
  "suspicious",
  "sympathy",
  "pour",
  "sour",
  "sneak",
  "congress",
  "ancestor",
  "excess",
  "gradual",
  "prologue",
  // specialty / pop / etymology teaching only
  "homeopathy",
  "sociopath",
  "telepathy",
  "pathy",
]);

const gre = JSON.parse(fs.readFileSync(grePath, "utf8"));
const vocab = new Map();
for (const letter of gre.letters || []) {
  for (const w of letter.words || []) {
    vocab.set(String(w.en || "").toLowerCase(), { letter, word: w });
  }
}

function collectPending() {
  const pending = [];
  for (const f of fs.readdirSync(clusterDir).filter((x) => x.endsWith(".json"))) {
    const c = JSON.parse(fs.readFileSync(path.join(clusterDir, f), "utf8"));
    for (const m of c.members || []) {
      const hw = String(m.headword || "").toLowerCase();
      if (!hw) continue;
      if (!vocab.has(hw)) {
        pending.push({ ...m, clusterId: c.id });
      }
    }
  }
  // unique by headword (first cluster wins for content)
  const map = new Map();
  for (const p of pending) {
    if (!map.has(p.headword)) map.set(p.headword, p);
  }
  return [...map.values()].sort((a, b) => a.headword.localeCompare(b.headword));
}

function letterBucket(en) {
  const ch = en[0].toLowerCase();
  return /[a-z]/.test(ch) ? ch : "x";
}

function makeEntry(m) {
  const en = m.headword;
  const zh = m.zhGloss || "";
  const endef = m.senseAnchor || zh;
  const exampleEn = m.speakLineEn || "";
  const exampleZh = m.speakLineZh || "";
  return {
    id: `gre-${en}`,
    en,
    zh,
    endef,
    exampleEn,
    example: exampleZh ? `${exampleEn} （${zh}）` : exampleEn,
    exampleUsage: exampleZh || "",
    synonyms: m.related?.synonyms || "",
    antonyms: m.related?.antonyms || "",
    derivatives: "",
    lookalikes: "",
    sources: "幽默聯想庫 S3a 補錄",
    detailed: true,
    fromHumorCluster: m.clusterId,
  };
}

const pending = collectPending();
const toAdd = [];
const toDefer = [];
for (const p of pending) {
  if (DEFER.has(p.headword)) toDefer.push(p);
  else toAdd.push(p);
}

// insert into gre.letters
const letterMap = new Map(gre.letters.map((l) => [l.letter.toLowerCase(), l]));
let added = 0;
const addedList = [];
for (const m of toAdd) {
  if (vocab.has(m.headword)) continue;
  const bucket = letterBucket(m.headword);
  let letter = letterMap.get(bucket);
  if (!letter) {
    letter = {
      letter: bucket.toUpperCase(),
      slug: bucket,
      wordCount: 0,
      words: [],
    };
    gre.letters.push(letter);
    letterMap.set(bucket, letter);
  }
  const entry = makeEntry(m);
  letter.words.push(entry);
  vocab.set(m.headword, { letter, word: entry });
  added += 1;
  addedList.push({ en: m.headword, clusterId: m.clusterId, zh: m.zhGloss });
}

// sort words in each letter
for (const letter of gre.letters) {
  letter.words.sort((a, b) => a.en.toLowerCase().localeCompare(b.en.toLowerCase()));
  letter.wordCount = letter.words.length;
}
gre.letters.sort((a, b) => a.letter.localeCompare(b.letter));
gre.total = gre.letters.reduce((n, l) => n + l.words.length, 0);
gre.humorSync = {
  stage: "S3a",
  syncedAt: new Date().toISOString(),
  addedFromHumor: added,
};

fs.writeFileSync(grePath, `${JSON.stringify(gre, null, 2)}\n`);

// mark cluster members
const deferSet = new Set(toDefer.map((d) => d.headword));
const addSet = new Set(addedList.map((a) => a.en));
for (const f of fs.readdirSync(clusterDir).filter((x) => x.endsWith(".json"))) {
  const fp = path.join(clusterDir, f);
  const c = JSON.parse(fs.readFileSync(fp, "utf8"));
  let changed = false;
  for (const m of c.members || []) {
    if (addSet.has(m.headword) || vocab.has(m.headword)) {
      if (m.vocabStatus !== "in-vocab") {
        m.inVocab = true;
        m.vocabStatus = addSet.has(m.headword) ? "synced-s3a" : "in-vocab";
        changed = true;
      } else {
        m.inVocab = true;
      }
    } else if (deferSet.has(m.headword)) {
      m.inVocab = false;
      m.vocabStatus = "deferred-basic-or-specialty";
      m.vocabNote =
        "留在幽默庫作構詞／劇本用；暫不列入 GRE 難詞主庫，避免稀釋考點密度。";
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(fp, `${JSON.stringify(c, null, 2)}\n`);
}

// triage file + supplement MD for vocabulary.md readers
const triage = {
  stage: "S3a",
  at: new Date().toISOString(),
  pendingBefore: pending.length,
  addedToGreJson: addedList,
  deferred: toDefer.map((d) => ({
    en: d.headword,
    clusterId: d.clusterId,
    zh: d.zhGloss,
    reason: DEFER.has(d.headword) ? "basic-or-specialty" : "other",
  })),
  greTotalAfter: gre.total,
};
fs.writeFileSync(
  path.join(humorDir, "pending-triage.json"),
  `${JSON.stringify(triage, null, 2)}\n`,
);

const supp = [];
supp.push("# GRE 詞庫補錄（幽默聯想庫 S3a）");
supp.push("");
supp.push("> 本檔為 S3a 從幽默家族卡同步進 `web/src/data/gre-vocabulary.json` 的詞條鏡像，便於人工審讀。");
supp.push(`> 共 **${addedList.length}** 詞；主站詞庫總數現為 **${gre.total}**。`);
supp.push("");
for (const a of addedList.sort((x, y) => x.en.localeCompare(y.en))) {
  const m = toAdd.find((t) => t.headword === a.en);
  supp.push(`### ${a.en}`);
  supp.push(`- **中文**：${a.zh}`);
  supp.push(`- **英文釋義**：${m?.senseAnchor || ""}`);
  supp.push(`- **例句**：${m?.speakLineEn || ""}`);
  supp.push(`- **中譯**：${m?.speakLineZh || ""}`);
  supp.push(`- **來源家族**：${a.clusterId}`);
  supp.push(`- **來源**：幽默聯想庫 S3a 補錄`);
  supp.push("");
}
supp.push("---");
supp.push("");
supp.push("## 暫緩進主庫（deferred）");
supp.push("");
for (const d of triage.deferred) {
  supp.push(`- \`${d.en}\`（${d.zh}）← ${d.clusterId}`);
}
supp.push("");
fs.writeFileSync(path.join(root, "GRE vocabulary-humor-supplement.md"), `${supp.join("\n")}\n`);

const report = [];
report.push("# 階段 S3a 完成報告｜pending-add 雙軌處理");
report.push("");
report.push(`> 日期：${new Date().toISOString().slice(0, 10)}`);
report.push("");
report.push("## 做了什麼");
report.push("");
report.push("1. 盤點幽默庫 pending-add（詞庫無的 headword）。");
report.push("2. **高價值 GRE 向** → 寫入 `web/src/data/gre-vocabulary.json`，並產出鏡像 `GRE vocabulary-humor-supplement.md`。");
report.push("3. **基礎／特規教學詞** → 不進主庫，成員標 `vocabStatus: deferred-basic-or-specialty`。");
report.push("4. 重跑覆蓋率。");
report.push("");
report.push("## 數字");
report.push("");
report.push(`| 項目 | 數值 |`);
report.push(`|------|------|`);
report.push(`| 處理前 pending | ${pending.length} |`);
report.push(`| 補進主詞庫 JSON | **${added}** |`);
report.push(`| 暫緩（幽默專用） | **${toDefer.length}** |`);
report.push(`| 主詞庫總詞數（後） | **${gre.total}** |`);
report.push("");
report.push("詳見 `pending-triage.json`。");
report.push("");
report.push("## 暫緩原則（摘要）");
report.push("");
report.push("- 過基礎、易稀釋 GRE 難詞密度：如 access / process / credit / reject…");
report.push("- 特規／通俗／純字源教學：homeopathy / sociopath / telepathy");
report.push("- 這些詞仍留在家族卡，可上課，但不計「主庫缺字」壓力。");
report.push("");
report.push("## 下一步建議（S3b）");
report.push("");
report.push("- 再擴 15～20 張 A/B 級家族，衝獨特詞 ≥ 500。");
report.push("- 審讀 `GRE vocabulary-humor-supplement.md`，有誤再回修 JSON。");
report.push("");

fs.writeFileSync(path.join(humorDir, "STAGE3a-REPORT.md"), `${report.join("\n")}\n`);

// refresh coverage
execFileSync(process.execPath, [path.join(__dirname, "gre-humor-coverage.js")], {
  stdio: "inherit",
});

// refresh index.json inVocab counts
const coverage = JSON.parse(
  fs.readFileSync(path.join(humorDir, "coverage-summary.json"), "utf8"),
);
const indexPath = path.join(humorDir, "index.json");
const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
index.version = "v0.3-s3a";
index.status = "stage3a-complete";
index.s3a = {
  added: added,
  deferred: toDefer.length,
  greTotal: gre.total,
};
for (const row of index.clusters || []) {
  const c = JSON.parse(fs.readFileSync(path.join(clusterDir, `${row.id}.json`), "utf8"));
  row.inVocab = (c.members || []).filter((m) => m.inVocab).length;
  row.pendingAdd = (c.members || [])
    .filter((m) => !m.inVocab)
    .map((m) => m.headword);
  row.status = c.status;
}
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      pendingBefore: pending.length,
      added,
      deferred: toDefer.length,
      greTotal: gre.total,
      coverage,
    },
    null,
    2,
  ),
);
