const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "../../gre-humor/clusters");
const lab =
  /preregister|p-hack|estimand|codebook|open materials|silent outcome|unblinded|paywalled|sensitivity checks|vanity metrics|outcome switching/i;
const fab =
  /Cue the |On the exam,|Critics argued that the policy would|Picture the |A careful reader links|Hold the meaning steady|In the passage,/i;

function esc(hw) {
  return String(hw).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

let labN = 0;
let fabN = 0;
let miss = 0;
const samples = [];

for (const f of fs.readdirSync(dir).filter((x) => x.startsWith("root-") && x.endsWith(".json"))) {
  const c = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  for (const m of c.members || []) {
    const en = String(m.speakLineEn || "");
    const zh = String(m.speakLineZh || "");
    const hw = String(m.headword || "");
    if (lab.test(en) || lab.test(zh)) {
      labN += 1;
      if (samples.length < 12) samples.push({ t: "lab", hw, en: en.slice(0, 80) });
    }
    if (fab.test(en) || fab.test(zh)) {
      fabN += 1;
      if (samples.length < 12) samples.push({ t: "fab", hw, en: en.slice(0, 80) });
    }
    if (hw && !new RegExp(`\\b${esc(hw)}\\b`, "i").test(en) && !en.toLowerCase().includes(hw.toLowerCase())) {
      miss += 1;
      if (samples.length < 12) samples.push({ t: "miss", hw, en: en.slice(0, 80) });
    }
  }
}

console.log(JSON.stringify({ labN, fabN, miss, samples }, null, 2));
