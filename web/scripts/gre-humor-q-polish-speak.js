/**
 * Replace Cue-template speakLines with vocab examples or crafted classroom lines.
 * Does NOT add/remove headwords.
 *
 * Usage:
 *   node web/scripts/gre-humor-q-polish-speak.js --ids look-abolish-01,root-tract-01
 *   node web/scripts/gre-humor-q-polish-speak.js --top 25 --stage Q-wave1
 *   node web/scripts/gre-humor-q-polish-speak.js --all-templates --stage Q-wave2
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const lessonDir = path.join(humorDir, "lessons");
const gre = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/data/gre-vocabulary.json"), "utf8"));

const vocabMap = new Map();
for (const letter of gre.letters || []) {
  for (const w of letter.words || []) {
    vocabMap.set(String(w.en || "").toLowerCase(), w);
  }
}

const TEMPLATE_RE = /Cue the |gag sticks|walks on/i;
const CUE_ZH_RE = /出場|梗就黏住/;

function isTemplateText(s) {
  return TEMPLATE_RE.test(String(s || "")) || CUE_ZH_RE.test(String(s || ""));
}

function isTemplate(m) {
  return isTemplateText(m.speakLineEn) || isTemplateText(m.speakLineZh);
}

function stripExampleNoise(s) {
  return String(s || "")
    .replace(/（[^）]*）/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function ensureWordInSentence(word, sentence) {
  const w = word.toLowerCase();
  if (sentence.toLowerCase().includes(w)) return sentence;
  // Prefer inserting as main verb/noun near start
  if (/^[A-Z]/.test(sentence)) {
    return `${word[0].toUpperCase()}${word.slice(1)} appears here: ${sentence}`;
  }
  return `Remember ${word}: ${sentence}`;
}

function craftSpeak(headword, zhGloss, senseAnchor, role) {
  const gloss = (zhGloss || senseAnchor || headword).split(/[｜|;]/)[0].trim();
  const roleBit = role && role !== gloss ? role : null;
  const patterns = [
    () => {
      const base = `Critics argued that the policy would ${headword} basic protections.`;
      return {
        en: base.length >= 18 ? base : `Students must learn what ${headword} really means in context.`,
        zh: `批評者主張該政策會${gloss}基本保障。`,
      };
    },
    () => ({
      en: `In the passage, ${headword} signals a shift toward "${gloss}".`,
      zh: `文中 ${headword} 標示語氣轉向「${gloss}」。`,
    }),
    () => ({
      en: roleBit
        ? `Picture the ${roleBit}: the word ${headword} means ${gloss}.`
        : `Hold the meaning steady: ${headword} means ${gloss}.`,
      zh: roleBit ? `想像「${roleBit}」：${headword}＝${gloss}。` : `記住考意：${headword}＝${gloss}。`,
    }),
    () => ({
      en: `A careful reader links ${headword} to ${gloss}, not a lookalike neighbor.`,
      zh: `細心讀者把 ${headword} 連到「${gloss}」，不連形近鄰居。`,
    }),
  ];
  const i = Math.abs(hash(headword)) % patterns.length;
  const out = patterns[i]();
  if (out.en.length < 18) {
    out.en = `On the exam, ${headword} most nearly means "${gloss}".`;
    out.zh = `考試裡 ${headword} 最接近「${gloss}」。`;
  }
  return out;
}

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function polishMember(m) {
  if (!isTemplate(m)) return false;
  const hw = String(m.headword || "").toLowerCase();
  const v = vocabMap.get(hw);
  let en = "";
  let zh = "";

  // Prefer clean vocab examples; reject Cue-contaminated bank lines.
  if (v?.exampleEn) {
    const cand = stripExampleNoise(v.exampleEn);
    if (cand.length >= 18 && !isTemplateText(cand)) {
      en = cand;
      zh = stripChineseOnly(v.example) || `對譯：${m.zhGloss || m.senseAnchor || hw}`;
    }
  }
  if (!en && v?.example && !isTemplateText(v.example)) {
    const parsed = splitBilingualExample(v.example);
    if (parsed.en && parsed.en.length >= 18 && !isTemplateText(parsed.en)) {
      en = parsed.en;
      zh = parsed.zh || `對譯：${m.zhGloss || hw}`;
    }
  }

  if (!en || isTemplateText(en) || isTemplateText(zh)) {
    const crafted = craftSpeak(hw, m.zhGloss, m.senseAnchor, m.roleInScript);
    en = crafted.en;
    zh = crafted.zh;
  } else {
    en = ensureWordInSentence(hw, en);
    if (!/[。！？.!?]$/.test(zh)) zh = `${zh}${/[a-zA-Z]/.test(zh) ? "." : "。"}`;
  }

  // Final guard: never persist template text.
  if (isTemplateText(en) || isTemplateText(zh) || en.length < 18) {
    const crafted = craftSpeak(hw, m.zhGloss, m.senseAnchor, m.roleInScript);
    en = crafted.en;
    zh = crafted.zh;
  }

  m.speakLineEn = en;
  m.speakLineZh = zh;
  return true;
}

function stripChineseOnly(example) {
  const m = String(example).match(/（([^）]+)）/);
  if (m) return m[1].trim();
  const m2 = String(example).match(/\(([^)]+)\)\s*$/);
  if (m2 && /[\u4e00-\u9fff]/.test(m2[1])) return m2[1].trim();
  return "";
}

function splitBilingualExample(example) {
  const s = String(example);
  const m = s.match(/^(.*?)[（(]([^）)]+)[）)]\s*$/);
  if (m) {
    return { en: stripExampleNoise(m[1]), zh: m[2].trim() };
  }
  return { en: stripExampleNoise(s), zh: "" };
}

function lightlyThickenScript(c) {
  const script = String(c.script || "");
  if (script.length >= 80) return false;
  const members = (c.members || []).slice(0, 6);
  if (!members.length) return false;
  const cast = members
    .map((m) => `${m.headword}（${m.roleInScript || m.zhGloss || "角色"}）`)
    .join("、");
  const axis =
    c.type === "lookalike"
      ? "形近對決：先分清語意軸，再對號入座。"
      : c.type === "semantic"
        ? "語義對打：兩邊語氣相反，考試選「褒貶／強弱」對的那側。"
        : "串記：同一世界觀裡，每個詞都有固定動作位。";
  c.script = `${script}${script.endsWith("。") ? "" : "。"}${axis}登場：${cast}。`.slice(0, 220);
  return true;
}

function syncLesson(cluster) {
  const lessonPath = path.join(lessonDir, `lesson-${cluster.id}.json`);
  if (!fs.existsSync(lessonPath)) return false;
  const lesson = JSON.parse(fs.readFileSync(lessonPath, "utf8"));
  for (const step of lesson.flow || []) {
    if (step.name === "鉤子") step.content = cluster.hook;
    if (step.name === "串記劇本") step.content = cluster.script;
    if (step.name === "口令帶走") step.content = cluster.reviewHooks;
  }
  lesson.pitfalls = cluster.pitfalls;
  if (lesson.qualityGate) {
    lesson.qualityGate.polishStage = cluster.qualityGate?.polishStage;
    lesson.qualityGate.polishedAt = cluster.qualityGate?.polishedAt;
  }
  fs.writeFileSync(lessonPath, `${JSON.stringify(lesson, null, 2)}\n`);
  return true;
}

function parseArgs(argv) {
  const out = { ids: [], top: 0, allTemplates: false, stage: "Q-polish" };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--ids") out.ids = String(argv[++i] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    else if (a === "--top") out.top = Number(argv[++i] || 0);
    else if (a === "--all-templates") out.allTemplates = true;
    else if (a === "--stage") out.stage = String(argv[++i] || out.stage);
  }
  return out;
}

const args = parseArgs(process.argv);
const priorityPath = path.join(humorDir, "q-priority.json");
let priorityIds = [];
if (fs.existsSync(priorityPath)) {
  const p = JSON.parse(fs.readFileSync(priorityPath, "utf8"));
  priorityIds = (p.top50 || []).map((x) => x.id);
}

let targetIds = new Set(args.ids);
if (args.top > 0) {
  for (const id of priorityIds.slice(0, args.top)) targetIds.add(id);
}
if (args.allTemplates) {
  for (const f of fs.readdirSync(clusterDir).filter((x) => x.endsWith(".json"))) {
    const c = JSON.parse(fs.readFileSync(path.join(clusterDir, f), "utf8"));
    if ((c.members || []).some(isTemplate)) targetIds.add(c.id);
  }
}

if (!targetIds.size) {
  console.error("No targets. Use --ids, --top N, or --all-templates");
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const report = [];

for (const id of [...targetIds].sort()) {
  const fp = path.join(clusterDir, `${id}.json`);
  if (!fs.existsSync(fp)) {
    report.push({ id, ok: false, error: "missing" });
    continue;
  }
  const c = JSON.parse(fs.readFileSync(fp, "utf8"));
  const before = (c.members || []).filter(isTemplate).length;
  let changedSpeak = 0;
  for (const m of c.members || []) {
    if (polishMember(m)) changedSpeak += 1;
  }
  const thickened = lightlyThickenScript(c);
  // role echo soft fix: if role === gloss, give a picture noun from title/hook fragment
  let roleFix = 0;
  for (const m of c.members || []) {
    const role = String(m.roleInScript || "").trim();
    const gloss = String(m.zhGloss || "").trim();
    if (role && gloss && role === gloss) {
      m.roleInScript = `${gloss}角色`;
      roleFix += 1;
    }
  }
  if (!(c.pitfalls || []).length) {
    c.pitfalls = ["先對齊考試核心義，再記聯想；勿讓梗蓋過詞義。"];
  }
  if ((c.reviewHooks || []).length < 2) {
    const heads = (c.members || []).slice(0, 4).map((m) => m.headword);
    c.reviewHooks = [
      `${c.elementLemma || c.id}：${heads.join("/")}`,
      "合上書先講人設，再點半數成員",
    ];
  }
  c.qualityGate = {
    ...(c.qualityGate || {}),
    polishedAt: today,
    polishStage: args.stage,
  };
  fs.writeFileSync(fp, `${JSON.stringify(c, null, 2)}\n`);
  syncLesson(c);
  const after = (c.members || []).filter(isTemplate).length;
  report.push({
    id,
    before,
    changedSpeak,
    after,
    thickened,
    roleFix,
  });
}

console.log(
  JSON.stringify(
    {
      stage: args.stage,
      targets: targetIds.size,
      cleared: report.filter((r) => r.before > 0 && r.after === 0).length,
      stillTemplate: report.filter((r) => r.after > 0).length,
      detail: report,
    },
    null,
    2,
  ),
);
