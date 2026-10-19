/**
 * P2 pending triage (after P1 batches):
 * - GRE-worthy → gre-vocabulary.json
 * - basic / multiword / specialty teaching → deferred on cluster members
 * Run: node web/scripts/gre-humor-p2-pending.js
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const grePath = path.join(__dirname, "../src/data/gre-vocabulary.json");

/**
 * Only defer: (1) too basic for GRE bank (2) multiword keys (3) specialty/teaching-only.
 * Everything else pending → add to main vocab.
 */
const DEFER = new Set([
  // prior S3a/c
  "access", "process", "credit", "grade", "object", "subject", "project", "respect",
  "vocabulary", "vocal", "universe", "anniversary", "mission", "permit", "submit",
  "progress", "reject", "inject", "educate", "logic", "introduction", "interrupt",
  "suspicious", "sympathy", "pour", "sour", "sneak", "congress", "ancestor", "excess",
  "gradual", "prologue", "homeopathy", "sociopath", "telepathy", "pathy",
  // everyday / high-frequency (dilute GRE density)
  "acquire", "benefit", "comfort", "comforting", "confuse", "confusion", "effort",
  "emotion", "execute", "extend", "flexible", "fluent", "fluid", "formal", "formation",
  "ground", "inform", "influence", "inquiry", "joined", "legend", "motivation", "motive",
  "negative", "novel", "powerful", "powerless", "promote", "request", "refuse", "refusal",
  "relevant", "remote", "science", "scientific", "sequence", "session", "solution", "solve",
  "subsequent", "surround", "terminate", "transform", "victory", "victorious", "victor",
  "attend", "pretend", "president", "demote", "appoint", "disappoint", "pointed", "pointless",
  "inclusive", "collective", "dialect", "enforce", "forceful", "reinforce", "renew",
  "query", "quest", "pursuit", "inspire", "inspiration", "aspire", "aspiration",
  "spirited", "dispirited", "respire", "perspire", "respiratory", "attitude", "altitude",
  "gratitude", "aptitude", "uniform", "reform", "deform", "conform", "innovate",
  "innovation", "innovative", "potential", "empower", "migrate", "migration", "migrant",
  "migratory", "immigration", "emigration", "tense", "tension", "tendency", "intense",
  "elastic", "adaptable", "conscious", "anonymous", "anonymity", "synonym", "antonym",
  "acronym", "homonym", "chronic", "chronicle", "chronology", "chronological",
  "synchronize", "synchronous", "asynchronous", "chronometer", "coherent", "coherence",
  "hesitate", "hesitant", "hesitation", "adhere", "adherence", "adhesive", "obsess",
  "obsession", "sediment", "reside", "congregate", "congregation", "aggregate",
  "segregation", "desegregate", "junction", "conjunction", "disjunction", "conjunct",
  "elevate", "elevation", "lever", "leverage", "relief", "irrelevant", "dissolve",
  "resolve", "resolution", "consecutive", "consequence", "sequential", "convince",
  "eviction", "mortal", "immortal", "immortality", "postmortem", "punctual", "puncture",
  "punctuate", "punctuation", "fusion", "infuse", "infusion", "transfuse", "diffuse",
  "fortify", "fortress", "fortification", "affluent", "effluent", "confluence", "reflux",
  "generic", "engender", "homogeneous", "heterogeneous", "illuminate", "illumination",
  "luminous", "lucidity", "illustrious", "negate", "negligible", "exquisite",
  "prerequisite", "relinquish", "inquisition", "potency", "potentiality", "nova",
  "novelty", "formality", "formalism", "formative", "formulate", "beneficent", "benign",
  "benefit", "denounce", "depress", "devalue", "exalt", "externalize", "ingress",
  "obligation", "proclaim", "procure", "proponent", "procedural", "compound", "rebound",
  "resourceful", "simpleminded", "sophisticated", "ingenuity", "commotion", "locomotion",
  "mobilize", "momentous", "immutable", "disarray", "extensive", "magnitude", "multitude",
  "science", "request", "influence", "inform", "president", "session", "sequence",
  // specialty / weak GRE teaching props
  "acupuncture", "mortician", "mortuary", "deathblow", "congregant", "aggregative",
  "injunctive", "relucent", "luminescence", "novitiate", "nouveau", "remigration",
  "transmigrate", "egregiously", "unrelieved", "tensioned", "suffuse", "leaven",
  "segue", "plebiscite", "omnipotence", "omniscience", "nescience", "abnegation",
  "self-abnegation", "renegotiate", "impotent", "plenipotentiary", "invincible",
  "genocide", "lackluster", "counterpoint", "inane", "incisive", "inert", "infiltrate",
  "preemptive", "precursor", "proclivity", "prodigal", "prosaic", "protagonist",
  // multiword
  "conviction rate", "chronicle-worthy", "in-migration", "out-migration",
  "out-of-sync", "reside in", "rigor mortis", "non sequitur", "long-winded",
  "self-conscious", "scope creep", "conserve evidence", "deserve better",
  "philosophy club", "revive debate", "symphony of errors", "phobic response",
  "impetus check", "trial period",
  // P2-batch02 everyday / teaching props
  "option", "optional", "adopt", "optimism", "optimum", "optic", "optimize",
  "optometrist", "adoption", "optimal", "order", "ordinary", "coordinate",
  "subordinate", "ordinal", "disorder", "coordinator", "extraordinary", "orderly",
  "origin", "originate", "original", "orient", "orientation", "disorient",
  "reorient", "originally", "sunrise", "source", "nascent", "expedite",
  "pedestal", "centipede", "tripod", "pedal", "expedition", "biped", "podium",
  "footprint", "compute", "dispute", "reputation", "deputy", "computer",
  "computation", "count", "accountable", "repute", "question", "pry", "ask",
  "interrogate", "interrogation", "surrogate", "scope", "telescope", "microscope",
  "periscope", "horoscope", "kaleidoscope", "endoscope", "scopophilia", "overscope",
  "narrow", "outlook", "conserve", "preserve", "observe", "observation",
  "observant", "deserve", "reservation", "service", "server", "sign", "signal",
  "significance", "assign", "designate", "design", "resign", "insignificant",
  "consign", "signature", "signpost", "cosign", "sophomore", "unsophisticated",
  "sophistication", "wise", "clever", "fallacy", "rhetoric", "naive",
  "temporary", "contemporary", "tempo", "overtime", "timeline", "meantime",
  "timely", "untimely", "temporarily", "term", "terminal", "termination",
  "terminology", "terminus", "predetermine", "deadline", "terrain", "territory",
  "terrestrial", "terrace", "terror", "terrible", "terrify", "terrorize",
  "extraterrestrial", "mediterranean", "territorial", "testify", "testimony",
  "testimonial", "contest", "protest", "testable", "contestant", "attestation",
  "protestation", "witness", "contribute", "contribution", "contributor",
  "distribute", "distribution", "tribe", "redistribute", "attribution", "share",
  "disturb", "disturbance", "turbulent", "turbulence", "perturbation",
  "disturbing", "stir", "agitate", "calm", "survive", "survival", "survivor",
  "vitality", "vivacious", "vitamin", "alive", "lifeline", "carnivore",
  "herbivore", "omnivore", "devouring", "savory", "glutton", "digest", "binge",
  "combine", "companion", "complete", "compress", "committee", "concurrent",
  "conspicuous", "consolidate", "aboriginal", "ordain", "ordinance",
  "insubordinate", "appetite", "vortex",
  // P2-batch05/06 moderate defer: everyday / teaching props / weak GRE density
  "workshop", "handbook", "upgrade", "reboot", "prototype", "newbie", "freshman",
  "broadcast", "signal", "antenna", "horizon", "remote", "distant", "long-range",
  "crowd", "public", "civic", "rise", "spike", "scalpel", "incision", "craft",
  "tooling", "gadget", "blueprint", "pathway", "detour", "crossroad", "exit",
  "withdraw", "shout", "bulletin", "megaphone", "fineprint", "announcement", "outcry",
  "hint", "imply", "escape", "dodge", "refer", "slippery", "maze", "separate",
  "careful", "tactful", "compartmentalize", "whisper", "partition", "bin",
  "overlay", "add-on", "surface", "afterword", "overhead", "over-the-top", "penthouse",
  "overrule", "beforehand", "prior", "forerunner", "prelude", "warmup",
  "two-sided", "either-or", "fence-sitting", "double-edge", "self-driving", "self-rule",
  "autofocus", "autopilot", "automobile", "operate", "operation", "operator",
  "cooperate", "cooperation", "opera", "popular", "unpopular", "popularize",
  "populate", "population", "seed", "seedling", "sow", "germinate", "scatter",
  "sonic", "echo", "technical", "technique", "technology", "technician",
  "television", "via", "previous", "obvious", "automatic", "ambition", "ambitious",
  "ambience", "dialogue", "episode", "abstract", "abort", "abnormal", "crown",
  "across", "cross-cut", "transparent", "diurnal",
]);

const gre = JSON.parse(fs.readFileSync(grePath, "utf8"));
const vocab = new Map();
for (const letter of gre.letters || []) {
  for (const w of letter.words || []) {
    vocab.set(String(w.en || "").toLowerCase(), { letter, word: w });
  }
}

/** Moderate scope: only triage pending born in P2-batch05/06 clusters. */
const RECENT_STAGES = new Set(["P2-batch05", "P2-batch06"]);

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
    sources: "幽默聯想庫 P2-pending 補錄",
    detailed: true,
    fromHumorCluster: m.clusterId,
  };
}

const STAGE_TAG = "P2-pending-b06";

function shouldDefer(hw) {
  if (DEFER.has(hw)) return true;
  if (/\s/.test(hw)) return true;
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
        m.vocabStatus = addSet.has(hw) ? "synced-p2-pending-b06" : m.vocabStatus || "in-vocab";
        changed = true;
      }
    } else if (deferSet.has(hw) || shouldDefer(hw)) {
      m.inVocab = false;
      m.vocabStatus = "deferred-basic-or-specialty";
      m.vocabNote =
        "留在幽默庫作構詞／劇本用；暫不列入 GRE 難詞主庫，避免稀釋考點密度。";
      changed = true;
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
fs.writeFileSync(path.join(humorDir, "pending-triage-p2-b06.json"), `${JSON.stringify(triage, null, 2)}\n`);

const report = [];
report.push("# P2-pending-b06 分流報告（batch05/06 後・適度）");
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
fs.writeFileSync(path.join(humorDir, "P2-PENDING-B06-REPORT.md"), `${report.join("\n")}\n`);

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
      addedList: addedList.map((a) => a.en),
    },
    null,
    2,
  ),
);
