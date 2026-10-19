/** Audit root theater speakLines. node web/scripts/gre-humor-audit-root-examples.js */
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "../../gre-humor/clusters");
const FAB =
  /Cue the |gag sticks|walks on|On the exam,|most nearly means|Critics argued that the policy would|In the passage,|Picture the |Hold the meaning steady|A careful reader links|signals a shift toward|記住考意|出場|標示語氣轉向|想像「/i;

function esc(hw) {
  return hw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function shape(en, hw) {
  return String(en || "")
    .toLowerCase()
    .replace(new RegExp(`\\b${esc(hw)}\\b`, "gi"), "_")
    .replace(/\s+/g, " ")
    .trim();
}

const shapeCount = new Map();
const fabList = [];
let short = 0;
let glossOnlyZh = 0;
let total = 0;

for (const f of fs.readdirSync(dir).filter((x) => x.startsWith("root-") && x.endsWith(".json"))) {
  const c = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  for (const m of c.members || []) {
    total += 1;
    const en = String(m.speakLineEn || "");
    const zh = String(m.speakLineZh || "");
    const hw = String(m.headword || "");
    if (en.length < 28) short += 1;
    if (zh.length <= 8 || zh === `${m.zhGloss}。` || /^[^。]{1,12}。$/.test(zh)) glossOnlyZh += 1;
    if (FAB.test(en) || FAB.test(zh)) fabList.push({ id: c.id, hw, en: en.slice(0, 90), zh: zh.slice(0, 40) });
    const sh = shape(en, hw);
    if (!shapeCount.has(sh)) shapeCount.set(sh, { n: 0, samples: [] });
    const rec = shapeCount.get(sh);
    rec.n += 1;
    if (rec.samples.length < 4) rec.samples.push(`${c.id}:${hw}`);
  }
}

const topShapes = [...shapeCount.entries()]
  .filter(([, v]) => v.n >= 3)
  .sort((a, b) => b[1].n - a[1].n)
  .slice(0, 30)
  .map(([sh, v]) => ({ n: v.n, shape: sh.slice(0, 100), samples: v.samples }));

const out = {
  total,
  fabCount: fabList.length,
  short,
  glossOnlyZh,
  fabList,
  topShapes,
};
fs.writeFileSync(path.join(__dirname, "../../gre-humor/ROOT-EXAMPLES-AUDIT.json"), `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ total, fabCount: fabList.length, short, glossOnlyZh, topShapes: topShapes.slice(0, 15), fabList }, null, 2));
