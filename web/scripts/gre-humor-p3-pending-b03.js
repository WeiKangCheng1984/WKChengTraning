/**
 * Moderate pending triage after P3-batch02:
 * Scope: P2-batch07 / P3-batch01 / P3-batch02 only.
 * GRE-worthy → gre-vocabulary.json; basic / multiword / teaching props → deferred.
 * Run: node web/scripts/gre-humor-p3-pending-b03.js
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const grePath = path.join(__dirname, "../src/data/gre-vocabulary.json");

const DEFER = new Set([
  // scene props / everyday glue — keep humor, skip GRE bank dilution
  "mask", "role", "persona", "cast", "costume", "makeup", "whistle", "boots",
  "tower", "mudsplash", "tux", "stopwatch", "flag", "puddle", "layer", "label",
  "aboutness", "self-ref", "notify", "briefing", "assessment", "valuation",
  "youngster", "gangster", "teamster", "prankster", "punster", "rhymester",
  "trickster", "smugness", "flatterer", "fawning", "waver", "fleeting", "durable",
  "decisive", "categorical", "metadata", "metalanguage", "metacognition",
  "metaphor", "metaphorical", "metaphysics", "metastasis",
  "entire", "expire", "enquire", "attire", "umpire", "spire", "mire",
  "glass", "fog", "cement", "yoga", "curtain", "gun", "stage", "carpet",
  "whip", "lion", "shrimp", "window", "pad", "smoke", "bomb", "heart",
  "particle", "cabinet", "specimen", "party", "tail", "sound",
  "against", "ahead", "absence", "allergy", "amazement", "apology", "anglemark",
  "android", "all-seeing", "history", "sense", "credit", "module", "capsule",
  "molecule", "start", "begin", "finish", "end", "open", "close", "clear",
  "dark", "honest", "lie", "liar", "brave", "fear", "soft", "hard", "praise",
  "blame", "critic", "hero", "coward", "enemy", "friend", "truth", "false",
  "self-ref", "red-carpet", "soft-foot", "fog-glass", "people", "water",
  "music", "number", "letter", "color", "colour", "animal", "plant", "house",
  "table", "chair", "paper", "phone", "email", "internet", "empire", "vampire",
  "sapphire", "gracious", "spacious", "tabloid", "asteroid", "humanoid",
  // P3-batch03 scene props
  "thermometer", "lava", "icecube", "shrug", "volcano", "freezer", "spark", "frost",
  "fever", "chill", "lightning", "snail", "stopwatch", "queue", "package", "meeting",
  "turbo", "brake", "sprint", "nap", "lake", "storm", "lifebuoy", "wharf", "megaphone",
  "teacup", "ripple", "siren", "pillow", "crowd", "scalpel", "mallet", "lens", "donkey",
  "focus", "blur", "wit", "fogbrain", "edge", "bluntedge", "whiterobe", "ink", "laundry",
  "spot", "bleach", "mud", "mirror", "smudge", "soap", "splash", "magnet", "roachsticker",
  "spotlight", "boundary", "perfume", "stink", "selfie", "warning", "charm", "yuck",
  "piggybank", "shredder", "ledger", "coupon", "goldcoin", "receipt", "budget", "splurge",
  "savings", "voidcheck", "cabinet", "popup", "tourguide", "price-tag", "mothball", "unbox",
  "vintage", "hashtag", "dust", "neon", "hate", "wreck", "law", "building", "button",
  "clinic", "signage", "wreckingball", "petition", "loathing", "rubble", "harsh", "slander",
  "rumor", "tone", "ear", "stain", "cast", "critique", "gossip", "sharp", "wet", "badge",
  "anger", "sword", "candy", "quill", "stage", "compliment", "threat", "fur", "smile",
  "trip", "floor", "wetfloor", "hands", "feet", "sign", "mess", "apology", "corridor",
  "cone", "cliche", "slogan", "tear", "sticker", "vending", "guilt", "boredom", "sincere",
  "overused", "coin", "sunshine", "cloud", "mic", "forecast", "lucky", "ribbon", "desk",
  "map", "flood", "secret", "lie", "leak", "umbrella", "mask", "nozzle", "studio", "truth",
  "rain", "whisper", "alarm", "djbooth", "tail", "party", "oil", "hall", "rock", "wood",
  "bone", "hat", "guide", "ticket", "salary", "scissors", "handshake", "echo", "parade",
  "bell", "door", "gift", "basket", "ballot", "will", "pocket", "key", "guard",
  "scaffold", "blueprint", "crane", "helmet", "calendar", "brick", "hardhat", "cause",
  "surround", "gate", "arrow", "problem", "result", "blockade", "detour", "chain", "net",
  "lamp", "street", "buoy", "meter", "mayor", "rope", "barrier", "guestlist", "bouncer",
  "stamp", "fence", "welcome", "tease", "angel", "locker", "joke", "frown", "coach",
  "blush", "wink", "sigh", "halo", "rush", "turntable", "speed", "market", "dash",
  "announce", "lane", "cart", "horn", "plaza", "booth", "folder", "press", "lock",
  "poster", "camera", "curtain", "yawn", "root", "script", "prop", "shelf", "boring", "doom",
]);

const gre = JSON.parse(fs.readFileSync(grePath, "utf8"));
const vocab = new Map();
for (const letter of gre.letters || []) {
  for (const w of letter.words || []) {
    vocab.set(String(w.en || "").toLowerCase(), { letter, word: w });
  }
}

const RECENT_STAGES = new Set(["P3-batch03"]);

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
    sources: "幽默聯想庫 P3-pending-b03 補錄",
    detailed: true,
    fromHumorCluster: m.clusterId,
  };
}

const STAGE_TAG = "P3-pending-b03";

function shouldDefer(hw) {
  if (DEFER.has(hw)) return true;
  if (/\s/.test(hw)) return true;
  if (hw.length <= 3) return true;
  // hyphenated teaching props / meta labels
  if (hw.includes("-") && hw.split("-").some((p) => p.length <= 3)) return true;
  // obvious everyday stems (keep GRE-ish morphology out of this net)
  const BASIC_RE =
    /^(un|re|pre|over|under)?(start|begin|finish|open|close|clear|dark|soft|hard|fear|lie|end|friend|enemy|hero|truth|false|people|water|music|number|house|table|chair|paper|phone)(ing|ed|er|ly|ness|ful|less|ment|tion)?$/;
  if (BASIC_RE.test(hw)) return true;
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
        m.vocabStatus = addSet.has(hw) ? "synced-p3-pending-b03" : m.vocabStatus || "in-vocab";
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
fs.writeFileSync(path.join(humorDir, "pending-triage-p3-b03.json"), `${JSON.stringify(triage, null, 2)}\n`);

const report = [];
report.push("# P3-pending-b03 分流報告（P3-batch03・適度）");
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
fs.writeFileSync(path.join(humorDir, "P3-PENDING-B03-REPORT.md"), `${report.join("\n")}\n`);

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
