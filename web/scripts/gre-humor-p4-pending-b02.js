/**
 * Moderate pending triage after P3-batch02:
 * Scope: P2-batch07 / P3-batch01 / P3-batch02 only.
 * GRE-worthy → gre-vocabulary.json; basic / multiword / teaching props → deferred.
 * Run: node web/scripts/gre-humor-p4-pending-b02.js
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const grePath = path.join(__dirname, "../src/data/gre-vocabulary.json");

const DEFER = new Set([
  // scene props / everyday glue
  "mask","role","persona","cast","costume","makeup","whistle","boots","tower","flag",
  "puddle","layer","label","desk","ticket","queue","stamp","soda","foam","balloon",
  "confetti","umbrella","handkerchief","locker","rain","gavel","cart","match","robe",
  "studio","mic","globe","wallet","clinic","ledger","coin","clock","waitingroom",
  "timetable","sketchbook","sandtable","helmet","whiteboard","lab","monster","bulb",
  "lookout","railing","leaf","wind","camera","comic","chart","booth","mirror",
  "spotlight","eraser","scale","filter","carousel","luggage","tag","station",
  "broadcast","map","bench","sign","shed","fan","boot","towel","forecast","border",
  "agreement","summit","embassy","negotiator","water","headline","factcheck","lamp",
  "alert","myth","editor","bloodpressure","tomato","card","counter","praise","shame",
  "fit","banner","booing","gift","floor","cone","bump","complaint","tape","knee",
  "caution","predecessor","successor","diplomat","compromise","withdrawal","protocol",
  "corner","manual","elevator","shadow","door","join","yield","access","room",
  "people","water","music","house","table","chair","paper","phone","email","internet",
  "against","ahead","absence","allergy","amazement","apology","history","sense",
  "module","capsule","party","tail","oil","hall","rock","wood","bone","hat","guide",
  "salary","scissors","handshake","echo","parade","bell","gift","basket","guard",
  "rope","barrier","welcome","tease","angel","joke","frown","coach","blush","wink",
  "sigh","halo","rush","speed","market","dash","lane","cart","horn","plaza","folder",
  "press","lock","poster","whisper","curtain","yawn","root","script","prop","shelf",
  "boring","doom","soda","foam","confetti","handkerchief","waitingroom","timetable",
  "sketchbook","sandtable","whiteboard","lookout","railing","carousel","luggage",
  "bloodpressure","factcheck","booing","predecessor","successor","negotiator",
  "embassy","protocol","withdrawal","compromise","diplomat","agreement","border",
  "summit","caution","bump","tape","knee","cone","floor","banner","tomato","card",
  "counter","editor","myth","alert","headline","water","lamp","filter","scale",
  "eraser","bulb","monster","lab","chart","comic","camera","wind","leaf","towel",
  "boot","fan","shed","bench","station","tag","luggage","globe","wallet","clock",
  "ledger","robe","match","gavel","rain","locker","umbrella","confetti","balloon",
  "foam","soda","stamp","queue","ticket","desk","shadow","elevator","manual","corner",

  "trophy","gala","podium","applause","bouquet","tomato","court","gavel","badge","shield","rule",
  "polygraph","lounge","water","mask","sign","chair","lightbox","focus","mirror","glass","lamp",
  "punchclock","overtime","coffee","checklist","fan","sofa","remote","blanket","snack","pillow","slipper",
  "greenhouse","counter","shears","sprout","soil","hose","suitcase","customs","scale","air","zipper","label",
  "clinic","button","virus","chart","mood","result","sanitizer","footnote","maze","exit","sand","door","hint","escape",
  "advice","passport","meeting","nameplate","lawyer","embassy","agenda","stamp",
  "museum","headset","quiet","ticket","guide","exhibit","station","drawer","cookie","thermos","tray","napkin",
  "palette","audit","brush","swatch",
]);

const gre = JSON.parse(fs.readFileSync(grePath, "utf8"));
const vocab = new Map();
for (const letter of gre.letters || []) {
  for (const w of letter.words || []) {
    vocab.set(String(w.en || "").toLowerCase(), { letter, word: w });
  }
}

const RECENT_STAGES = new Set(["P4-batch02"]);

function collectPending() {
  const pending = [];
  for (const f of fs.readdirSync(clusterDir).filter((x) => x.endsWith(".json"))) {
    const c = JSON.parse(fs.readFileSync(path.join(clusterDir, f), "utf8"));
    const stage = c.qualityGate?.stage || "";
    if (!RECENT_STAGES.has(stage)) continue;
    for (const m of c.members || []) {
      const hw = String(m.headword || "").toLowerCase();
      if (!hw) continue;
      if (m.vocabStatus && String(m.vocabStatus).startsWith("deferred")) continue;
      if (!vocab.has(hw)) pending.push({ ...m, headword: hw, clusterId: c.id });
    }
  }
  const map = new Map();
  for (const p of pending) if (!map.has(p.headword)) map.set(p.headword, p);
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
    id: `gre-${en.replace(/\s+/g, "-")}`,
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
    sources: "幽默聯想庫 P4-pending-b02 補錄",
    detailed: true,
    fromHumorCluster: m.clusterId,
  };
}

const STAGE_TAG = "P4-pending-b02";

function shouldDefer(hw) {
  if (DEFER.has(hw)) return true;
  if (/\s/.test(hw)) return true;
  if (hw.length <= 3) return true;
  if (hw.includes("-") && !hw.startsWith("self-") && hw.split("-").some((p) => p.length <= 3)) return true;
  // story/device nouns commonly used as fillers
  if (/^(desk|door|map|sign|flag|room|card|lamp|boot|fan|rain|leaf|wind|tape|knee|bump|cone|floor|bench|tag|lab|mic|hat|oil|bell|echo|gift|guard|rope|lock|press|horn|lane|rush|speed|joke|halo|sigh|wink|coach|angel|myth|alert|scale|filter|comic|chart|bulb|monster|towel|shed|station|wallet|clock|ledger|robe|match|gavel|umbrella|balloon|soda|foam|stamp|queue|ticket|shadow|manual|corner|editor|tomato|banner|praise|shame|fit|water|headline|caution|border|summit|embassy|agreement|protocol)$/.test(hw)) return true;
  return false;
}

const pending = collectPending();
const toAdd = [];
const toDefer = [];
for (const p of pending) {
  if (shouldDefer(p.headword)) toDefer.push(p);
  else toAdd.push(p);
}

const letterMap = new Map(gre.letters.map((l) => [l.letter.toLowerCase(), l]));
let added = 0;
const addedList = [];
for (const m of toAdd) {
  if (vocab.has(m.headword)) continue;
  const bucket = letterBucket(m.headword);
  let letter = letterMap.get(bucket);
  if (!letter) {
    letter = { letter: bucket.toUpperCase(), slug: bucket, wordCount: 0, words: [] };
    gre.letters.push(letter);
    letterMap.set(bucket, letter);
  }
  const entry = makeEntry(m);
  letter.words.push(entry);
  vocab.set(m.headword, { letter, word: entry });
  added += 1;
  addedList.push({ en: m.headword, clusterId: m.clusterId, zh: m.zhGloss });
}

for (const letter of gre.letters) {
  letter.words.sort((a, b) => a.en.toLowerCase().localeCompare(b.en.toLowerCase()));
  letter.wordCount = letter.words.length;
}
gre.letters.sort((a, b) => a.letter.localeCompare(b.letter));
gre.total = gre.letters.reduce((n, l) => n + l.words.length, 0);
gre.humorSync = {
  stage: STAGE_TAG,
  syncedAt: new Date().toISOString(),
  addedFromHumor: added,
  deferred: toDefer.length,
};

fs.writeFileSync(grePath, `${JSON.stringify(gre, null, 2)}\n`);

const deferSet = new Set(toDefer.map((d) => d.headword));
const addSet = new Set(addedList.map((a) => a.en));
for (const f of fs.readdirSync(clusterDir).filter((x) => x.endsWith(".json"))) {
  const fp = path.join(clusterDir, f);
  const c = JSON.parse(fs.readFileSync(fp, "utf8"));
  let changed = false;
  for (const m of c.members || []) {
    const hw = String(m.headword || "").toLowerCase();
    if (addSet.has(hw) || (vocab.has(hw) && !shouldDefer(hw))) {
      if (!String(m.vocabStatus || "").startsWith("deferred")) {
        m.inVocab = true;
        m.vocabStatus = addSet.has(hw) ? "synced-p4-pending-b02" : m.vocabStatus || "in-vocab";
        changed = true;
      }
    } else if (deferSet.has(hw) || shouldDefer(hw)) {
      // only mark deferred if this member is in recent pending set for this hw
      if (deferSet.has(hw)) {
        m.inVocab = false;
        m.vocabStatus = "deferred-basic-or-specialty";
        m.vocabNote =
          "留在幽默庫作構詞／劇本用；暫不列入 GRE 難詞主庫，避免稀釋考點密度。";
        changed = true;
      }
    }
  }
  if (changed) fs.writeFileSync(fp, `${JSON.stringify(c, null, 2)}\n`);
}

const triage = {
  stage: STAGE_TAG,
  at: new Date().toISOString(),
  pendingBefore: pending.length,
  addedToGreJson: addedList,
  deferred: toDefer.map((d) => ({
    en: d.headword,
    clusterId: d.clusterId,
    zh: d.zhGloss,
    reason: "basic-multiword-or-specialty",
  })),
  greTotalAfter: gre.total,
};
fs.writeFileSync(path.join(humorDir, "pending-triage-p4-b02.json"), `${JSON.stringify(triage, null, 2)}\n`);

const report = [];
report.push("# P4-pending-b02 分流報告（P4-batch01・適度）");
report.push("");
report.push(`> 日期：${new Date().toISOString().slice(0, 10)}`);
report.push("");
report.push("| 項目 | 數值 |");
report.push("|------|------|");
report.push(`| 處理前 pending | ${pending.length} |`);
report.push(`| 補進主詞庫 | **${added}** |`);
report.push(`| 暫緩（幽默專用） | **${toDefer.length}** |`);
report.push(`| 主詞庫總數（後） | **${gre.total}** |`);
report.push("");
report.push("## 本批補庫");
report.push("");
for (const a of addedList) {
  report.push(`- \`${a.en}\`（${a.zh || ""}）← ${a.clusterId}`);
}
report.push("");
report.push("## 暫緩（劇本道具／日常詞）");
report.push("");
for (const d of toDefer.slice(0, 80)) {
  report.push(`- \`${d.headword}\`（${d.zhGloss || ""}）← ${d.clusterId}`);
}
if (toDefer.length > 80) report.push(`- …另 ${toDefer.length - 80} 筆`);
report.push("");
fs.writeFileSync(path.join(humorDir, "P4-PENDING-B02-REPORT.md"), `${report.join("\n")}\n`);

execFileSync(process.execPath, [path.join(__dirname, "gre-humor-coverage.js")], {
  stdio: "inherit",
});

console.log(
  JSON.stringify(
    {
      pendingBefore: pending.length,
      added,
      deferred: toDefer.length,
      greTotal: gre.total,
      addedSample: addedList.slice(0, 20).map((a) => a.en),
    },
    null,
    2,
  ),
);
