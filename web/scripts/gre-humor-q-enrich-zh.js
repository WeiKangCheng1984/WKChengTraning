/**
 * Enrich zhGloss (and Chinese senseAnchor) for every humor member.
 * Safe to re-run. Does NOT add/remove headwords.
 *
 * node web/scripts/gre-humor-q-enrich-zh.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const gre = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/data/gre-vocabulary.json"), "utf8"));

const vocabMap = new Map();
for (const letter of gre.letters || []) {
  for (const w of letter.words || []) {
    vocabMap.set(String(w.en || "").toLowerCase(), w);
  }
}

/** Prefer specific phrases; avoid bare /disgust/ matching retract etc. */
const ENDEF_HINTS = [
  [/do away with/i, "廢除；廢止（制度／法令）"],
  [/hate or loathe|loathe intensely|hate intensely/i, "強烈厭惡；憎惡"],
  [/destroy completely(?!.*enjoy)/i, "徹底摧毀；拆毀（建築或比喻擊垮）"],
  [/destroy completely; enjoy avidly|enjoy avidly/i, "吞食；狼吞虎嚥；也可指如饑似渴地讀"],
  [/\bharmless\b|not offensive/i, "無害的；無冒犯的"],
  [/causing intense displeasure|causing .* disgust|or resentment/i, "令人厭惡的；惹人反感的"],
  [/\bpoisonous\b|\btoxic\b|harmful to/i, "有害的；有毒的"],
  [/wave|flourish|swing back and forth/i, "揮舞；炫耀地晃動"],
  [/flatter|personal advantage|cringing or flattering/i, "諂媚；奉承討好"],
  [/no longer true or accurate|misrepresent|misconstrue/i, "扭曲；曲解"],
  [/through intimidation|by coercion/i, "勒索；脅迫強取"],
  [/formally reject or disavow/i, "撤回；正式收回前言"],
  [/lengthen|prolong|draw out/i, "延長；拖延"],
  [/pull away from a source/i, "縮回；抽離"],
  [/diminish the worth|belittle/i, "貶低；減損"],
  [/easy to control|manageable/i, "易駕馭的；溫馴的"],
  [/hard to manage|stubbornly resistant/i, "難駕馭的；棘手的"],
  [/to frighten or discourage|intimidate/i, "嚇倒；使氣餒"],
  [/not discouraged|resolute despite/i, "不氣餒的；無畏的"],
  [/empty of meaning/i, "空洞的；言之無物"],
  [/self-satisfied|uncritically content/i, "自滿的；洋洋得意"],
  [/make less angry|soothe/i, "安撫；平息怒氣"],
  [/impossible to appease/i, "無法平息的；不肯罷休的"],
];

const THIN_EXPAND = {
  恨: "恨；憎恨（情緒）",
  怒: "怒；憤怒",
  法律: "法律；法令（常作廢除對象）",
  建築: "建築；樓宇（常作拆毀對象）",
  廢除: "廢除；廢止（制度／法令）",
  厭惡: "厭惡；強烈反感",
  拆毀: "拆毀；夷平（建築）",
  破壞: "破壞；摧毀",
  吸引: "吸引；把注意力拉過來",
  無害的: "無害的；無冒犯的",
  有害的: "有害的；有毒的",
  殘骸: "殘骸；毀壞後的殘餘",
  瓦礫: "瓦礫；碎石殘塊",
  招牌: "招牌；標示牌",
  按鈕: "按鈕；操作鍵",
  嚇倒: "嚇倒；使氣餒",
  不氣餒: "不氣餒的；無畏的",
  勇氣: "勇氣；膽識",
  奉承: "奉承；甜言討好",
  揮舞炫耀: "揮舞；炫耀地晃動",
  發怒豎起: "發怒；毛髮／怒意豎起",
  易碎的: "易碎的；脆弱的",
  廢除論者: "廢除論者；主張廢止某制度者",
  憎惡: "憎惡；強烈厭惡",
  提示: "提示；暗示",
  逃脫: "逃脫；躲避",
  閃避: "閃避；躲开",
  縮回: "縮回；撤回",
};

const BOILER_RE =
  /的（考場語氣）|（考場核心義）|（考場語氣）|帶「[^」]+」語氣|記住考意「[^」]+」|的（考場核心義）/g;

function hasHan(s) {
  return /[\u4e00-\u9fff]/.test(s);
}

function mostlyEnglish(s) {
  const t = String(s || "").trim();
  if (!t) return false;
  const han = (t.match(/[\u4e00-\u9fff]/g) || []).length;
  const lat = (t.match(/[A-Za-z]/g) || []).length;
  return lat > Math.max(1, han * 2);
}

function stripBoiler(s) {
  return String(s || "")
    .replace(BOILER_RE, "")
    .replace(/[（(][^）)]*$/u, "") // drop truncated trailing paren from older runs
    .replace(/；{2,}/g, "；")
    .replace(/^；+|；+$/g, "")
    .trim();
}

function cleanVocabZh(raw) {
  let s = String(raw || "").trim();
  if (!s) return "";
  s = s.replace(/^(adj|adv|v|n|vt|vi|prep|conj|pron|num)\.\s*/i, "");
  const parts = s.split(/｜|\|/).map((p) => p.trim()).filter(Boolean);
  let main =
    parts.find((p) => hasHan(p) && !/教學補註|GRE tip|核心義|中文錨點/i.test(p)) || parts[0] || "";
  main = main
    .replace(/教學補註[：:].*$/u, "")
    .replace(/GRE tip:.*$/i, "")
    .replace(/核心義[：:].*$/u, "")
    .replace(/中文錨點[：:]/u, "")
    .trim();
  return stripBoiler(main.replace(/[;；]+/g, "；").replace(/\s*；\s*/g, "；"));
}

function hintFromEndef(endef) {
  const e = String(endef || "");
  if (!e || !mostlyEnglish(e)) return "";
  for (const [re, zh] of ENDEF_HINTS) {
    if (re.test(e)) return zh;
  }
  return "";
}

function splitChunks(s) {
  // Split on ；/,/、 but not inside full-width/half-width parentheses.
  const raw = stripBoiler(s);
  const parts = [];
  let buf = "";
  let depth = 0;
  for (const ch of raw) {
    if (ch === "（" || ch === "(") depth += 1;
    if (ch === "）" || ch === ")") depth = Math.max(0, depth - 1);
    if (depth === 0 && /[；;，,、]/.test(ch)) {
      if (buf.trim()) parts.push(buf.trim());
      buf = "";
      continue;
    }
    buf += ch;
  }
  if (buf.trim()) parts.push(buf.trim());
  return parts.filter((x) => x && hasHan(x) && !mostlyEnglish(x));
}

function normKey(chunk) {
  return chunk.replace(/[（(][^）)]*[）)]/g, "").replace(/的$/u, "").replace(/\s+/g, "");
}

function mergeUnique(chunks, max = 3, maxLen = 48) {
  const out = [];
  const keys = [];
  for (const raw of chunks) {
    const c = stripBoiler(raw);
    if (!c) continue;
    const k = normKey(c);
    if (!k) continue;
    let merged = false;
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === k || keys[i].includes(k) || k.includes(keys[i])) {
        // Keep the more informative chunk (longer, or with parenthesis nuance)
        const score = (x) => x.length + (/[（(]/.test(x) ? 4 : 0);
        if (score(c) > score(out[i])) {
          out[i] = c;
          keys[i] = normKey(c);
        }
        merged = true;
        break;
      }
    }
    if (!merged) {
      out.push(c);
      keys.push(k);
    }
    if (out.length >= max) break;
  }
  // Only drop whole chunks — never cut inside parentheses.
  let keep = out.slice();
  while (keep.length > 1 && keep.join("；").length > maxLen) keep.pop();
  if (keep.length === 1 && keep[0].length > maxLen) {
    // Prefer complete parenthetical; else soft ellipsis at end
    const one = keep[0];
    if (/[（(]/.test(one) && !/[）)]$/.test(one)) {
      return `${one.replace(/[（(][^（(]*$/, "").replace(/；+$/, "")}…`;
    }
    return `${one.slice(0, maxLen - 1)}…`;
  }
  return keep.join("；");
}

function enrichZhGloss(m, vocab) {
  const vocabZh = cleanVocabZh(vocab?.zh);
  const endef = vocab?.endef || "";
  const hint = hintFromEndef(endef);
  const current = stripBoiler(m.zhGloss);
  const senseZh =
    hasHan(m.senseAnchor) && !mostlyEnglish(m.senseAnchor) ? stripBoiler(m.senseAnchor) : "";

  // Primary: vocab Chinese, else cleaned current, else sense
  let primary = vocabZh || current || senseZh || "";
  primary = stripBoiler(primary);

  // Atomic thin → expand table
  const primaryAtom = splitChunks(primary)[0] || primary;
  if (THIN_EXPAND[primaryAtom] && splitChunks(primary).length <= 1 && primaryAtom.length <= 4) {
    primary = THIN_EXPAND[primaryAtom];
  } else if (primaryAtom.length <= 2 && hasHan(primaryAtom) && THIN_EXPAND[primaryAtom]) {
    primary = THIN_EXPAND[primaryAtom];
  }

  const chunks = [];
  for (const c of splitChunks(primary)) chunks.push(c);
  // Add hint chunks that bring new nuance
  if (hint) {
    for (const c of splitChunks(hint)) chunks.push(c);
  }

  let rich = mergeUnique(chunks, 3, 52);
  if (!rich) rich = primary || current || String(m.headword);
  // Strip accidental role-scene leftovers from earlier passes
  rich = rich
    .split("；")
    .map((x) => x.trim())
    .filter((x) => x && !/^場面：/.test(x))
    .join("；");
  return stripBoiler(rich);
}

function enrichSenseAnchor(m, zhGloss) {
  const cur = stripBoiler(m.senseAnchor);
  if (hasHan(cur) && !mostlyEnglish(cur)) {
    // Prefer zhGloss if richer; else normalize cur
    const a = mergeUnique([...splitChunks(zhGloss), ...splitChunks(cur)], 2, 40);
    return a || zhGloss || cur;
  }
  // English-only → Chinese exam anchor
  return zhGloss || cur;
}

const stats = { clusters: 0, members: 0, zhChanged: 0, senseChanged: 0, samples: [] };

for (const file of fs.readdirSync(clusterDir).filter((f) => f.endsWith(".json")).sort()) {
  const fp = path.join(clusterDir, file);
  const c = JSON.parse(fs.readFileSync(fp, "utf8"));
  stats.clusters += 1;
  let touched = false;
  for (const m of c.members || []) {
    stats.members += 1;
    const vocab = vocabMap.get(String(m.headword || "").toLowerCase());
    const beforeZh = m.zhGloss;
    const beforeSense = m.senseAnchor;
    const zh = enrichZhGloss(m, vocab);
    const sense = enrichSenseAnchor(m, zh);
    if (zh !== beforeZh) {
      m.zhGloss = zh;
      stats.zhChanged += 1;
      touched = true;
      if (stats.samples.length < 16) {
        stats.samples.push({ headword: m.headword, before: beforeZh, after: zh });
      }
    }
    if (sense !== beforeSense) {
      m.senseAnchor = sense;
      stats.senseChanged += 1;
      touched = true;
    }
  }
  if (touched) {
    c.qualityGate = {
      ...(c.qualityGate || {}),
      zhEnrichedAt: new Date().toISOString().slice(0, 10),
      polishStage: c.qualityGate?.polishStage || "Q-zh",
    };
    fs.writeFileSync(fp, `${JSON.stringify(c, null, 2)}\n`);
  }
}

fs.writeFileSync(
  path.join(humorDir, "Q-ZH-ENRICH-REPORT.md"),
  `# Q 中文釋義 enrichment 報告

| 指標 | 數值 |
|------|------|
| 家族 | ${stats.clusters} |
| 成員 | ${stats.members} |
| zhGloss 更新（本輪） | **${stats.zhChanged}** |
| senseAnchor 更新（本輪） | **${stats.senseChanged}** |

## 抽樣

${stats.samples.map((s) => `- **${s.headword}**：\`${s.before}\` → \`${s.after}\``).join("\n")}

## 規則

1. 清掉套話（考場語氣／記住考意）  
2. 主庫中文為主；英文 endef 用**精確**對照補場合／對象  
3. 過短原子義查表展開；合併去重，約 ≤48 字  
4. 英文明義錨改中文  
5. 不增刪 headword  
`,
);

console.log(JSON.stringify({ ...stats, samples: stats.samples.slice(0, 12) }, null, 2));
