/**
 * Stricter quality audit for root-theater speakLines.
 * node web/scripts/gre-humor-audit-root-quality.js
 */
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "../../gre-humor/clusters");

const BAD_PATTERNS = [
  [/Cue the |gag sticks|On the exam,|most nearly means|Critics argued that the policy would|In the passage,|Picture the |Hold the meaning steady|A careful reader links|signals a shift toward|想像「|記住考意|標示語氣轉向/i, "fab_template"],
  [/claims need .+ evidence/i, "claims_need_template"],
  [/silent outcome switching|identification assumptions|preregister|p-hack|estimand|open materials|codebook(?! of)/i, "lab_jargon"],
  [/Do not .+ without|Do not silently|Do not peek/i, "lab_imperative"],
  [/Publication poison|null effects exist|Paywalled/i, "lab_theme"],
];

function esc(hw) {
  return String(hw).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function issuesFor(m) {
  const en = String(m.speakLineEn || "");
  const zh = String(m.speakLineZh || "");
  const hw = String(m.headword || "");
  const gloss = String(m.zhGloss || "").split(/；|;/)[0].trim();
  const issues = [];

  for (const [re, tag] of BAD_PATTERNS) {
    if (re.test(en) || re.test(zh)) issues.push(tag);
  }
  if (en.length < 32) issues.push("en_short");
  if (zh.length < 10) issues.push("zh_short");
  // zh is basically just the gloss
  if (gloss && (zh === gloss || zh === `${gloss}。` || zh.replace(/。$/, "") === gloss)) {
    issues.push("zh_gloss_only");
  }
  // headword missing from English sentence
  if (hw && !new RegExp(`\\b${esc(hw)}\\b`, "i").test(en) && !en.toLowerCase().includes(hw.toLowerCase())) {
    issues.push("missing_headword");
  }
  // awkward: using noun as bare verb in "would X basic"
  if (/would [a-z]+ basic protections/i.test(en)) issues.push("grammar_nonsense");
  // very generic meta
  if (/Students noted every |Reviewers called the proposal /i.test(en)) issues.push("generic_meta");
  // Chinese mixed into English oddly
  if (/[\u4e00-\u9fff]/.test(en)) issues.push("han_in_en");

  return [...new Set(issues)];
}

const rows = [];
let total = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.startsWith("root-") && x.endsWith(".json")).sort()) {
  const c = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  for (const m of c.members || []) {
    total += 1;
    const issues = issuesFor(m);
    if (issues.length) {
      rows.push({
        id: c.id,
        hw: m.headword,
        issues,
        en: String(m.speakLineEn || "").slice(0, 100),
        zh: String(m.speakLineZh || "").slice(0, 50),
        gloss: String(m.zhGloss || "").slice(0, 40),
      });
    }
  }
}

const byIssue = {};
for (const r of rows) for (const i of r.issues) byIssue[i] = (byIssue[i] || 0) + 1;

const out = {
  total,
  problemMembers: rows.length,
  byIssue,
  // prioritize: fab, grammar, lab, missing, then short/gloss
  priority: rows
    .map((r) => ({
      ...r,
      score:
        (r.issues.includes("fab_template") ? 50 : 0) +
        (r.issues.includes("grammar_nonsense") ? 40 : 0) +
        (r.issues.includes("claims_need_template") ? 35 : 0) +
        (r.issues.includes("lab_jargon") ? 25 : 0) +
        (r.issues.includes("lab_theme") ? 20 : 0) +
        (r.issues.includes("lab_imperative") ? 15 : 0) +
        (r.issues.includes("missing_headword") ? 30 : 0) +
        (r.issues.includes("han_in_en") ? 40 : 0) +
        (r.issues.includes("zh_gloss_only") ? 8 : 0) +
        (r.issues.includes("en_short") ? 6 : 0) +
        (r.issues.includes("zh_short") ? 5 : 0) +
        (r.issues.includes("generic_meta") ? 10 : 0),
    }))
    .sort((a, b) => b.score - a.score),
};

fs.writeFileSync(
  path.join(__dirname, "../../gre-humor/ROOT-QUALITY-AUDIT.json"),
  `${JSON.stringify(out, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    {
      total: out.total,
      problemMembers: out.problemMembers,
      byIssue: out.byIssue,
      top30: out.priority.slice(0, 30).map((r) => ({
        id: r.id,
        hw: r.hw,
        score: r.score,
        issues: r.issues,
        en: r.en,
      })),
    },
    null,
    2,
  ),
);
