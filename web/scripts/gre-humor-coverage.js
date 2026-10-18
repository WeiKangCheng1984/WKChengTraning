/**
 * Coverage report: GRE vocabulary ↔ gre-humor clusters
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const grePath = path.join(__dirname, "../src/data/gre-vocabulary.json");

const gre = JSON.parse(fs.readFileSync(grePath, "utf8"));
const vocab = new Set();
for (const letter of gre.letters || []) {
  for (const w of letter.words || []) {
    if (w.en) vocab.add(String(w.en).toLowerCase());
  }
}

const clusterFiles = fs
  .readdirSync(clusterDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

const covered = new Map(); // headword -> [clusterIds]
const pending = [];
const clusters = [];

for (const file of clusterFiles) {
  const c = JSON.parse(fs.readFileSync(path.join(clusterDir, file), "utf8"));
  clusters.push(c);
  for (const m of c.members || []) {
    const hw = String(m.headword || "").toLowerCase();
    if (!hw) continue;
    if (!covered.has(hw)) covered.set(hw, []);
    covered.get(hw).push(c.id);
    if (!vocab.has(hw)) pending.push({ headword: hw, clusterId: c.id });
  }
}

const uniqueCovered = [...covered.keys()];
const inVocabCovered = uniqueCovered.filter((w) => vocab.has(w));
const orphanSample = [...vocab].filter((w) => !covered.has(w)).slice(0, 40);

const elementsPath = path.join(humorDir, "elements.json");
const elementsDoc = fs.existsSync(elementsPath)
  ? JSON.parse(fs.readFileSync(elementsPath, "utf8"))
  : null;

const report = [];
report.push("# GRE Humor 覆蓋率報告");
report.push("");
report.push(`> 產生時間：${new Date().toISOString()}`);
report.push("");
report.push("## 總覽");
report.push("");
report.push(`| 指標 | 數值 |`);
report.push(`|------|------|`);
report.push(`| 詞庫 headword | ${vocab.size} |`);
report.push(`| 幽默庫獨特詞 | ${uniqueCovered.length} |`);
report.push(`| 已在詞庫內的覆蓋 | ${inVocabCovered.length} |`);
report.push(`| 幽默庫有、詞庫無（pending-add） | ${pending.length} |`);
report.push(`| 家族數 | ${clusters.length} |`);
report.push(
  `| 核心元素 | ${elementsDoc ? elementsDoc.counts.total : "—"}（A=${elementsDoc?.counts.priorityA ?? "—"}） |`,
);
report.push(
  `| 覆蓋率（對詞庫） | ${((inVocabCovered.length / vocab.size) * 100).toFixed(2)}% |`,
);
report.push(`| 距離 4,000 獨特詞 | ${Math.max(0, 4000 - uniqueCovered.length)} |`);
report.push("");
report.push("## 各家族");
report.push("");
report.push("| ID | 狀態 | 成員 | 詞庫命中 | pending |");
report.push("|----|------|------|----------|---------|");
for (const c of clusters) {
  const hit = (c.members || []).filter((m) => vocab.has(m.headword)).length;
  const pend = (c.members || []).filter((m) => !vocab.has(m.headword)).length;
  report.push(
    `| ${c.id} | ${c.status} | ${(c.members || []).length} | ${hit} | ${pend} |`,
  );
}
report.push("");
report.push("## pending-add（幽默庫有、詞庫無）");
report.push("");
if (!pending.length) report.push("（無）");
else {
  for (const p of pending) report.push(`- \`${p.headword}\` ← ${p.clusterId}`);
}
report.push("");
report.push("## 詞庫孤兒抽樣（尚未掛家族，前 40）");
report.push("");
report.push(orphanSample.map((w) => `\`${w}\``).join(" · "));
report.push("");
report.push("## 下一步建議（自動）");
report.push("");
if (uniqueCovered.length < 1000) {
  report.push("1. 繼續第二輪：把 priority A 元素做成完整家族卡（目標獨特詞 ≥ 1,000）。");
  report.push("2. 優先補齊本報告 pending-add 進詞庫，或自幽默卡標註 quarantine。");
  report.push("3. 以 `lesson-root-tract-01` 為範本，再產出 3 堂押韻課（rhyme-our/edge/eak）。");
} else {
  report.push("1. 進入 B 級輻射與覆蓋差集清剿。");
}
report.push("");

const reportPath = path.join(humorDir, "coverage-report.md");
fs.writeFileSync(reportPath, `${report.join("\n")}\n`);

const jsonSummary = {
  vocabSize: vocab.size,
  uniqueHumorWords: uniqueCovered.length,
  inVocabCovered: inVocabCovered.length,
  pendingAdd: pending.length,
  clusters: clusters.length,
  coveragePct: +((inVocabCovered.length / vocab.size) * 100).toFixed(2),
  gapTo4000: Math.max(0, 4000 - uniqueCovered.length),
};
fs.writeFileSync(
  path.join(humorDir, "coverage-summary.json"),
  `${JSON.stringify(jsonSummary, null, 2)}\n`,
);

console.log(JSON.stringify(jsonSummary, null, 2));
console.log("wrote", reportPath);
