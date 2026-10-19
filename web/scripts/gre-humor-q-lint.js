/**
 * Q-stage smell detector for gre-humor cluster descriptions.
 * node web/scripts/gre-humor-q-lint.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");

const TEMPLATE_RE = /Cue the |gag sticks|walks on/i;
const LAB_THEME_RE = /\b(prereg|preregister|open.?science|replication|p-hack|null effect|estimand)\b/i;
const CUE_ZH_RE = /出場|梗就黏住/;

function scoreCluster(c) {
  const reasons = [];
  let score = 0;
  const members = c.members || [];
  const script = String(c.script || "");
  const hook = String(c.hook || "");

  let templateHits = 0;
  let shortSpeak = 0;
  let roleEcho = 0;
  let labHits = 0;

  for (const m of members) {
    const en = String(m.speakLineEn || "");
    const zh = String(m.speakLineZh || "");
    if (TEMPLATE_RE.test(en) || TEMPLATE_RE.test(zh) || CUE_ZH_RE.test(zh)) {
      templateHits += 1;
    }
    if (en.length > 0 && en.length < 18) shortSpeak += 1;
    const role = String(m.roleInScript || "").trim();
    const gloss = String(m.zhGloss || "").trim();
    if (role && gloss && role === gloss) roleEcho += 1;
    if (LAB_THEME_RE.test(en) || LAB_THEME_RE.test(zh)) labHits += 1;
  }

  if (templateHits) {
    score += templateHits * 12;
    reasons.push(`templateSpeak×${templateHits}`);
  }
  if (script.length < 60) {
    score += 25;
    reasons.push(`scriptShort(${script.length})`);
  }
  const eqCount = (script.match(/＝|=/g) || []).length;
  const eqDensity = members.length ? eqCount / members.length : 0;
  if (eqCount >= 4 && eqDensity >= 0.45) {
    score += 18;
    reasons.push(`eqDense(${eqCount}/${members.length})`);
  }
  if (hook.length < 12) {
    score += 10;
    reasons.push("hookThin");
  }
  if (shortSpeak) {
    score += shortSpeak * 2;
    reasons.push(`shortSpeak×${shortSpeak}`);
  }
  if (roleEcho >= Math.max(3, Math.floor(members.length * 0.4))) {
    score += 12;
    reasons.push(`roleEcho×${roleEcho}`);
  }
  if ((c.type === "root" || c.type === "prefix") && labHits >= Math.max(4, Math.floor(members.length * 0.35))) {
    score += 8;
    reasons.push(`labTheme×${labHits}`);
  }
  if (!(c.pitfalls || []).length) {
    score += 6;
    reasons.push("noPitfalls");
  }
  if ((c.reviewHooks || []).length < 2) {
    score += 6;
    reasons.push("fewHooks");
  }

  return {
    id: c.id,
    type: c.type || "",
    score,
    reasons,
    templateHits,
    memberCount: members.length,
    scriptLen: script.length,
    polished: Boolean(c.qualityGate?.polishStage),
  };
}

const files = fs.readdirSync(clusterDir).filter((f) => f.endsWith(".json")).sort();
const rows = [];
for (const f of files) {
  const c = JSON.parse(fs.readFileSync(path.join(clusterDir, f), "utf8"));
  rows.push(scoreCluster(c));
}
rows.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

const withTemplate = rows.filter((r) => r.templateHits > 0);
const templateMembers = withTemplate.reduce((s, r) => s + r.templateHits, 0);
const priority = rows.filter((r) => r.score > 0);

const summary = {
  generatedAt: new Date().toISOString(),
  clusters: rows.length,
  withSmell: priority.length,
  clustersWithTemplateSpeak: withTemplate.length,
  templateSpeakMembers: templateMembers,
  top50: priority.slice(0, 50).map((r) => ({
    id: r.id,
    type: r.type,
    score: r.score,
    reasons: r.reasons,
    templateHits: r.templateHits,
  })),
};

fs.writeFileSync(path.join(humorDir, "q-priority.json"), `${JSON.stringify(summary, null, 2)}\n`);

const md = `# Q-LINT 氣味報告

生成時間：${summary.generatedAt}

| 指標 | 數值 |
|------|------|
| 家族總數 | ${summary.clusters} |
| 有氣味（score>0） | ${summary.withSmell} |
| 含模板跟讀句的族 | ${summary.clustersWithTemplateSpeak} |
| 模板跟讀句（成員次數） | ${summary.templateSpeakMembers} |

## Top 50 優先打磨

| score | id | type | template | reasons |
|------:|----|------|--------:|---------|
${summary.top50
  .map(
    (r) =>
      `| ${r.score} | \`${r.id}\` | ${r.type} | ${r.templateHits} | ${r.reasons.join(", ")} |`,
  )
  .join("\n")}

## 用法

\`\`\`bash
node web/scripts/gre-humor-q-lint.js
\`\`\`

優先佇列 JSON：\`gre-humor/q-priority.json\`
`;

fs.writeFileSync(path.join(humorDir, "Q-LINT-REPORT.md"), md);
console.log(
  JSON.stringify(
    {
      clusters: summary.clusters,
      withSmell: summary.withSmell,
      clustersWithTemplateSpeak: summary.clustersWithTemplateSpeak,
      templateSpeakMembers: summary.templateSpeakMembers,
      top5: summary.top50.slice(0, 5),
    },
    null,
    2,
  ),
);
