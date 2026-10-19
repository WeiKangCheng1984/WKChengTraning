/**
 * Quality audit for Season 3: semantic (語氣對打) + lookalike (形近對決).
 * node web/scripts/gre-humor-audit-semlook-quality.js
 */
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "../../gre-humor/clusters");

const BAD_PATTERNS = [
  [
    /\bCue the |gag sticks|On the exam,|most nearly means|Critics argued that the policy would|In the passage,|Picture the |Hold the meaning steady|A careful reader links|signals a shift toward|想像「|記住考意|標示語氣轉向|GRE tip:|GRE 提示：/i,
    "fab_template",
  ],
  [/claims need .+ evidence/i, "claims_need_template"],
  [
    /silent outcome switching|identification assumptions|preregister|p-hack|estimand|open materials|codebook(?! of)|unblinded|paywalled|sensitivity checks|vanity metrics|outcome switching/i,
    "lab_jargon",
  ],
  [/Do not .+ without|Do not silently|Do not peek/i, "lab_imperative"],
  [/keep the tone straight|抓住語氣|約「.+」——/i, "look_tip_template"],
  [/In academic English, writers may refer to/i, "academic_filler"],
  [/Students noted every |Reviewers called the proposal /i, "generic_meta"],
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
  if (gloss && (zh === gloss || zh === `${gloss}。` || zh.replace(/。$/, "") === gloss)) {
    issues.push("zh_gloss_only");
  }
  if (hw && !new RegExp(`\\b${esc(hw)}\\b`, "i").test(en) && !en.toLowerCase().includes(hw.toLowerCase())) {
    issues.push("missing_headword");
  }
  if (/would [a-z]+ basic protections/i.test(en)) issues.push("grammar_nonsense");
  if (/[\u4e00-\u9fff]/.test(en)) issues.push("han_in_en");
  // gloss glued into English tip
  if (/~\s*[\u4e00-\u9fff]/.test(en)) issues.push("gloss_in_en");

  return [...new Set(issues)];
}

const rows = [];
let total = 0;
const shapeBuckets = {};

for (const f of fs
  .readdirSync(dir)
  .filter((x) => (x.startsWith("sem-") || x.startsWith("look-")) && x.endsWith(".json"))
  .sort()) {
  const c = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  for (const m of c.members || []) {
    total += 1;
    const en = String(m.speakLineEn || "");
    // normalize shape for dupe detection
    const shape = en
      .toLowerCase()
      .replace(new RegExp(`\\b${esc(m.headword || "")}\\b`, "gi"), "HW")
      .replace(/[^a-zHW\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    shapeBuckets[shape] = (shapeBuckets[shape] || 0) + 1;

    const issues = issuesFor(m);
    if (issues.length) {
      rows.push({
        id: c.id,
        type: c.type || (f.startsWith("sem-") ? "semantic" : "lookalike"),
        hw: m.headword,
        issues,
        en: en.slice(0, 110),
        zh: String(m.speakLineZh || "").slice(0, 50),
        gloss: String(m.zhGloss || "").slice(0, 40),
      });
    }
  }
}

// mark shape dupes (>=4 identical skeletons)
for (const r of rows) {
  // already flagged via templates mostly
}
const dupeShapes = Object.entries(shapeBuckets)
  .filter(([s, n]) => s.length > 10 && n >= 4)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 25);

// also find members whose shape is heavily duplicated even if not in rows
const heavyDupes = [];
for (const f of fs
  .readdirSync(dir)
  .filter((x) => (x.startsWith("sem-") || x.startsWith("look-")) && x.endsWith(".json"))
  .sort()) {
  const c = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  for (const m of c.members || []) {
    const en = String(m.speakLineEn || "");
    const shape = en
      .toLowerCase()
      .replace(new RegExp(`\\b${esc(m.headword || "")}\\b`, "gi"), "HW")
      .replace(/[^a-zHW\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if ((shapeBuckets[shape] || 0) >= 4) {
      heavyDupes.push({ id: c.id, hw: m.headword, n: shapeBuckets[shape], en: en.slice(0, 90), shape: shape.slice(0, 70) });
      const row = rows.find((x) => x.id === c.id && x.hw === m.headword);
      if (row && !row.issues.includes("shape_dupe")) row.issues.push("shape_dupe");
      else if (!row) {
        rows.push({
          id: c.id,
          type: c.type,
          hw: m.headword,
          issues: ["shape_dupe"],
          en: en.slice(0, 110),
          zh: String(m.speakLineZh || "").slice(0, 50),
          gloss: String(m.zhGloss || "").slice(0, 40),
        });
      }
    }
  }
}

const byIssue = {};
for (const r of rows) for (const i of r.issues) byIssue[i] = (byIssue[i] || 0) + 1;

const out = {
  total,
  problemMembers: rows.length,
  byIssue,
  topDupShapes: dupeShapes.map(([s, n]) => ({ n, shape: s.slice(0, 80) })),
  priority: rows
    .map((r) => ({
      ...r,
      score:
        (r.issues.includes("fab_template") ? 50 : 0) +
        (r.issues.includes("look_tip_template") ? 45 : 0) +
        (r.issues.includes("gloss_in_en") ? 45 : 0) +
        (r.issues.includes("grammar_nonsense") ? 40 : 0) +
        (r.issues.includes("han_in_en") ? 40 : 0) +
        (r.issues.includes("academic_filler") ? 35 : 0) +
        (r.issues.includes("claims_need_template") ? 35 : 0) +
        (r.issues.includes("missing_headword") ? 30 : 0) +
        (r.issues.includes("lab_jargon") ? 25 : 0) +
        (r.issues.includes("shape_dupe") ? 20 : 0) +
        (r.issues.includes("lab_imperative") ? 15 : 0) +
        (r.issues.includes("generic_meta") ? 10 : 0) +
        (r.issues.includes("zh_gloss_only") ? 8 : 0) +
        (r.issues.includes("en_short") ? 6 : 0) +
        (r.issues.includes("zh_short") ? 5 : 0),
    }))
    .sort((a, b) => b.score - a.score),
};

fs.writeFileSync(path.join(__dirname, "../../gre-humor/SEMLOOK-QUALITY-AUDIT.json"), `${JSON.stringify(out, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      total: out.total,
      problemMembers: out.problemMembers,
      byIssue: out.byIssue,
      topDupShapes: out.topDupShapes.slice(0, 10),
      top40: out.priority.slice(0, 40).map((r) => ({
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
