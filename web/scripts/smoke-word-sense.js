const gre = require("../src/data/gre-vocabulary.json");
const humor = require("../src/data/gre-humor.json");

function norm(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/'/g, "'");
}

function candidates(raw) {
  const w = norm(raw);
  const out = [w];
  if (w.endsWith("ed") && w.length > 4) {
    out.push(w.slice(0, -2));
    out.push(w.slice(0, -1));
  }
  if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) out.push(w.slice(0, -1));
  return [...new Set(out)];
}

const greMap = new Map();
for (const l of gre.letters) {
  for (const w of l.words) {
    const k = norm(w.en);
    if (!greMap.has(k)) greMap.set(k, w.zh);
  }
}
const humMap = new Map();
for (const c of humor.clusters) {
  for (const m of c.members || []) {
    const k = norm(m.headword);
    if (!humMap.has(k)) humMap.set(k, c.titleZh);
  }
}

const cases = ["abandon", "assent", "abandoned", "complacent", "xyznotaword"];
for (const w of cases) {
  let greHit = null;
  let humHit = null;
  for (const k of candidates(w)) {
    if (!greHit && greMap.has(k)) greHit = { k, zh: greMap.get(k) };
    if (!humHit && humMap.has(k)) humHit = { k, title: humMap.get(k) };
  }
  console.log(w, {
    gre: greHit ? greHit.k : null,
    humor: humHit ? humHit.k : null,
    found: Boolean(greHit || humHit),
  });
}
console.log("sizes", { gre: greMap.size, humor: humMap.size });
