/**
 * Generate varied classroom fallbacks for bad sem/look speakLines.
 * Prefer later curated maps over these. Writes gre-humor/_curated-fallback.json
 *
 * node web/scripts/gre-humor-generate-semlook-fallback.js
 */
const fs = require("fs");
const path = require("path");

const humorDir = path.join(__dirname, "../../gre-humor");
const clusterDir = path.join(humorDir, "clusters");

const FAB =
  /Cue the |On the exam,|most nearly means|Critics argued that the policy would|In the passage,|Picture the |Hold the meaning steady|A careful reader links|signals a shift toward|GRE tip:|keep the tone straight|記住考意|標示語氣轉向|The critic noted her|A clear sense of .+ is crucial|In the end, they chose to/i;

function isBad(en, zh) {
  return (
    FAB.test(String(en || "")) ||
    FAB.test(String(zh || "")) ||
    /[\u4e00-\u9fff]/.test(String(en || "")) ||
    /would [a-z]+ basic protections/i.test(String(en || "")) ||
    String(en || "").length < 32 ||
    String(zh || "").length < 10
  );
}

function glossCore(g) {
  return String(g || "")
    .split(/；|;|／|\//)[0]
    .replace(/^(adj|v|n|adv|vt|vi)\.\s*/i, "")
    .trim();
}

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pick(arr, hw) {
  return arr[hash(hw) % arr.length];
}

function classify(hw, gloss) {
  const g = glossCore(gloss);
  if (/的$/.test(g) || /ous$|ic$|ive$|al$|ant$|ent$|ary$|ful$|less$|ible$|able$|oid$|ate$/i.test(hw) && /的|地/.test(g))
    return "adj";
  if (/地$/.test(g) || /ly$/i.test(hw)) return "adv";
  if (/^to |化$|使|讓/.test(g) || /ate$|ize$|ise$|ify$|ect$|ude$|en$/i.test(hw) && !/的$/.test(g)) return "verb";
  if (/tion$|sion$|ance$|ence$|ity$|ment$|ure$|ism$|ship$|ness$/i.test(hw)) return "noun";
  if (/的$/.test(g)) return "adj";
  // gloss starts with verb-ish Chinese
  if (/^(使|把|將|去|來|會|能|要)/.test(g) || g.length <= 4 && !/的$/.test(g)) {
    // short gloss often verb/noun — use morphology
    if (/e$|ing$/.test(hw)) return "verb";
  }
  return "noun";
}

function makeAdj(hw, g) {
  const frames = [
    {
      en: `The committee rejected the ${hw} claim after checking the facts.`,
      zh: `委員會查核事實後，駁回了那個「${g}」的主張。`,
    },
    {
      en: `Her ${hw} reply surprised everyone in the quiet classroom.`,
      zh: `她那「${g}」的回答，讓安靜教室裡的人都吃了一驚。`,
    },
    {
      en: `Critics called the new policy unnecessarily ${hw}.`,
      zh: `批評者認為新政策過分「${g}」。`,
    },
    {
      en: `He remained ${hw} even when the debate grew heated.`,
      zh: `即使辯論升溫，他仍保持「${g}」。`,
    },
    {
      en: `A more ${hw} approach would have avoided the misunderstanding.`,
      zh: `若採取更「${g}」的做法，或許能避免誤會。`,
    },
    {
      en: `The novel’s ${hw} ending left readers unsettled for days.`,
      zh: `小說「${g}」的結局讓讀者好幾天都不安。`,
    },
    {
      en: `Teachers prefer ${hw} explanations over flashy jargon.`,
      zh: `老師偏好「${g}」的說明，勝過花俏術語。`,
    },
    {
      en: `Under pressure, her tone became suddenly ${hw}.`,
      zh: `壓力之下，她的語氣突然變得「${g}」。`,
    },
  ];
  return pick(frames, hw);
}

function makeAdv(hw, g) {
  const frames = [
    {
      en: `She answered ${hw}, without raising her voice.`,
      zh: `她「${g}」地回答，並沒有提高音量。`,
    },
    {
      en: `The team worked ${hw} to meet the Friday deadline.`,
      zh: `團隊「${g}」地趕工，要趕上週五期限。`,
    },
    {
      en: `He spoke ${hw} about the risks before the vote.`,
      zh: `表決前，他「${g}」地談及風險。`,
    },
  ];
  return pick(frames, hw);
}

function makeVerb(hw, g) {
  const frames = [
    {
      en: `Good editors ${hw} weak claims before publication.`,
      zh: `好編輯會在出版前「${g}」薄弱主張。`,
    },
    {
      en: `Please do not ${hw} the evidence just to win the debate.`,
      zh: `請不要為了贏辯論而「${g}」證據。`,
    },
    {
      en: `Historians still ${hw} how the treaty changed trade routes.`,
      zh: `歷史學家仍在「${g}」條約如何改變貿易路線。`,
    },
    {
      en: `The mayor promised to ${hw} the damaged bridge this year.`,
      zh: `市長承諾今年會「${g}」損毀的橋梁。`,
    },
    {
      en: `Students learn to ${hw} sources instead of trusting headlines.`,
      zh: `學生要學的是「${g}」資料來源，而不是相信標題。`,
    },
    {
      en: `When rumors spread, leaders must ${hw} them with facts.`,
      zh: `謠言擴散時，領導者必須用事實去「${g}」它們。`,
    },
  ];
  return pick(frames, hw);
}

function makeNoun(hw, g) {
  const frames = [
    {
      en: `The report’s ${hw} became the center of the discussion.`,
      zh: `報告中的「${g}」成了討論焦點。`,
    },
    {
      en: `Without clear ${hw}, the plan confused every department.`,
      zh: `缺少清楚的「${g}」，計畫讓每個部門都困惑。`,
    },
    {
      en: `She valued honesty more than empty ${hw}.`,
      zh: `她看重誠實，勝過空洞的「${g}」。`,
    },
    {
      en: `A sudden ${hw} in the hallway interrupted the lecture.`,
      zh: `走廊突然出現的「${g}」打斷了講座。`,
    },
    {
      en: `The museum exhibit explained the ${hw} with simple diagrams.`,
      zh: `博物館展覽用簡易圖解說明這個「${g}」。`,
    },
    {
      en: `His quiet ${hw} earned more trust than loud promises.`,
      zh: `他安靜的「${g}」比大聲承諾更能贏得信任。`,
    },
    {
      en: `They treated the ${hw} as a warning, not a joke.`,
      zh: `他們把這「${g}」當成警告，而不是玩笑。`,
    },
    {
      en: `Years of careful ${hw} shaped her reputation in the field.`,
      zh: `多年謹慎的「${g}」塑造了她在領域裡的名聲。`,
    },
  ];
  return pick(frames, hw);
}

function make(hw, gloss) {
  const g = glossCore(gloss) || hw;
  const kind = classify(hw, gloss);
  if (kind === "adj") return makeAdj(hw, g);
  if (kind === "adv") return makeAdv(hw, g);
  if (kind === "verb") return makeVerb(hw, g);
  return makeNoun(hw, g);
}

const out = {};
let n = 0;
for (const f of fs
  .readdirSync(clusterDir)
  .filter((x) => (x.startsWith("sem-") || x.startsWith("look-")) && x.endsWith(".json"))) {
  const c = JSON.parse(fs.readFileSync(path.join(clusterDir, f), "utf8"));
  for (const m of c.members || []) {
    if (!isBad(m.speakLineEn, m.speakLineZh)) continue;
    const hw = m.headword;
    if (out[hw]) continue;
    out[hw] = make(hw, m.zhGloss || m.senseAnchor || "");
    n += 1;
  }
}

fs.writeFileSync(path.join(humorDir, "_curated-fallback.json"), `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ generated: n, sample: Object.entries(out).slice(0, 5) }, null, 2));
