/**
 * Apply curated speakLines for Season 3 (sem + look).
 * Reads gre-humor/_curated-look.json, _curated-semA.json, _curated-semB.json, _curated-semC.json
 *
 * node web/scripts/gre-humor-apply-semlook-curated.js
 * node web/scripts/gre-humor-apply-semlook-curated.js --force-bad-only
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const lessonDir = path.join(humorDir, "lessons");

const FAB =
  /Cue the |gag sticks|On the exam,|most nearly means|Critics argued that the policy would|In the passage,|Picture the |Hold the meaning steady|A careful reader links|signals a shift toward|GRE tip:|keep the tone straight|記住考意|標示語氣轉向|想像「|The critic noted her|A clear sense of .+ is crucial|In the end, they chose to/i;

// fallback first; curated maps override
const maps = [
  "_curated-fallback.json",
  "_curated-look.json",
  "_curated-semA.json",
  "_curated-semB.json",
  "_curated-semC.json",
];
const CURATED = {};
for (const name of maps) {
  const fp = path.join(humorDir, name);
  if (!fs.existsSync(fp)) {
    console.warn("missing", name);
    continue;
  }
  const obj = JSON.parse(fs.readFileSync(fp, "utf8"));
  Object.assign(CURATED, obj);
}

const forceBadOnly = process.argv.includes("--force-bad-only");

function isBad(en, zh) {
  return (
    FAB.test(String(en || "")) ||
    FAB.test(String(zh || "")) ||
    /[\u4e00-\u9fff]/.test(String(en || "")) ||
    /would [a-z]+ basic protections/i.test(String(en || "")) ||
    String(zh || "").length < 10
  );
}

function pick(hw) {
  return CURATED[hw] || CURATED[String(hw || "").toLowerCase()] || null;
}

const stats = { fixed: 0, missing: [], clusters: new Set(), skippedOk: 0, badStill: 0 };

for (const f of fs
  .readdirSync(clusterDir)
  .filter((x) => (x.startsWith("sem-") || x.startsWith("look-")) && x.endsWith(".json"))) {
  const fp = path.join(clusterDir, f);
  const c = JSON.parse(fs.readFileSync(fp, "utf8"));
  let touched = false;
  for (const m of c.members || []) {
    const bad = isBad(m.speakLineEn, m.speakLineZh);
    const next = pick(m.headword);
    if (!next) {
      if (bad) {
        stats.missing.push({ id: c.id, hw: m.headword });
        stats.badStill += 1;
      } else stats.skippedOk += 1;
      continue;
    }
    if (forceBadOnly && !bad && m.speakLineEn === next.en) {
      stats.skippedOk += 1;
      continue;
    }
    if (m.speakLineEn === next.en && m.speakLineZh === next.zh) {
      stats.skippedOk += 1;
      continue;
    }
    if (forceBadOnly && !bad) {
      stats.skippedOk += 1;
      continue;
    }
    m.speakLineEn = next.en;
    m.speakLineZh = next.zh;
    touched = true;
    stats.fixed += 1;
    stats.clusters.add(c.id);
  }
  if (touched) {
    c.qualityGate = {
      ...(c.qualityGate || {}),
      semlookPolishAt: new Date().toISOString().slice(0, 10),
      semlookPolishStage: "semlook-careful-polish",
    };
    fs.writeFileSync(fp, `${JSON.stringify(c, null, 2)}\n`);
    const lp = path.join(lessonDir, `lesson-${c.id}.json`);
    if (fs.existsSync(lp)) {
      const lesson = JSON.parse(fs.readFileSync(lp, "utf8"));
      lesson.qualityGate = {
        ...(lesson.qualityGate || {}),
        semlookPolishAt: new Date().toISOString().slice(0, 10),
      };
      fs.writeFileSync(lp, `${JSON.stringify(lesson, null, 2)}\n`);
    }
  }
}

fs.writeFileSync(
  path.join(humorDir, "SEMLOOK-APPLY-STATUS.json"),
  `${JSON.stringify(
    {
      curatedKeys: Object.keys(CURATED).length,
      fixed: stats.fixed,
      clusters: [...stats.clusters].sort(),
      missingCount: stats.missing.length,
      missingSample: stats.missing.slice(0, 40),
      skippedOk: stats.skippedOk,
      badStill: stats.badStill,
    },
    null,
    2,
  )}\n`,
);

console.log(
  JSON.stringify(
    {
      curatedKeys: Object.keys(CURATED).length,
      fixed: stats.fixed,
      clusters: stats.clusters.size,
      missing: stats.missing.length,
      badStill: stats.badStill,
      missingSample: stats.missing.slice(0, 15),
    },
    null,
    2,
  ),
);
