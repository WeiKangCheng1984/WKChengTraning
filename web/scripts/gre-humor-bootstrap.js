/**
 * Bootstrap GRE humor library v0:
 * - elements.json (core elements with A/B/C)
 * - 12 seed clusters under gre-humor/clusters/
 * - sample lesson gre-humor/lessons/lesson-root-tract-01.json
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const outDir = path.join(root, "gre-humor");
const clusterDir = path.join(outDir, "clusters");
const lessonDir = path.join(outDir, "lessons");

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

ensureDir(clusterDir);
ensureDir(lessonDir);

/** Load vocab set from gre-vocabulary.json */
function loadVocabSet() {
  const gre = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../src/data/gre-vocabulary.json"), "utf8"),
  );
  const map = new Map();
  for (const letter of gre.letters || []) {
    for (const w of letter.words || []) {
      const en = String(w.en || "").toLowerCase();
      if (!en) continue;
      map.set(en, {
        en: w.en,
        zh: (w.zh || "").split("｜")[0].trim(),
        endef: w.endef || "",
        exampleEn: w.exampleEn || "",
        synonyms: w.synonyms || "",
        antonyms: w.antonyms || "",
        lookalikes: w.lookalikes || "",
      });
    }
  }
  return map;
}

const vocab = loadVocabSet();

function card(headword, opts) {
  const key = headword.toLowerCase();
  const v = vocab.get(key);
  const inVocab = Boolean(v);
  return {
    headword: key,
    inVocab,
    senseAnchor: opts.senseAnchor || v?.endef || opts.zhGloss || "",
    roleInScript: opts.roleInScript,
    humorDevice: opts.humorDevice || "story",
    zhGloss: opts.zhGloss || v?.zh || "",
    speakLineEn:
      opts.speakLineEn ||
      v?.exampleEn ||
      `In GRE texts, "${key}" often signals: ${opts.zhGloss || "its core academic sense"}.`,
    speakLineZh: opts.speakLineZh || `考試語境裡，「${key}」常指向：${opts.zhGloss || "其核心學術義"}。`,
    related: opts.related || {
      synonyms: v?.synonyms || "",
      antonyms: v?.antonyms || "",
    },
  };
}

// ——— Elements v0 ———
const PREFIXES = [
  ["ab-", "離開／否定", "A"],
  ["ad-", "朝向／加上", "A"],
  ["anti-", "反對／相反", "A"],
  ["con-/com-", "一起／完全", "A"],
  ["de-", "向下／去除", "A"],
  ["dis-", "分開／否定", "A"],
  ["ex-/e-", "向外／前", "A"],
  ["in-/im-", "進入／否定（依詞而定）", "A"],
  ["inter-", "之間", "B"],
  ["ob-", "迎向／反對", "A"],
  ["per-", "貫穿／徹底", "A"],
  ["pre-", "在前／預先", "A"],
  ["pro-", "向前／贊成", "A"],
  ["re-", "回／再", "A"],
  ["sub-", "在下", "B"],
  ["syn-/sym-", "一起／相同", "A"],
  ["trans-", "跨越", "A"],
  ["un-", "否定", "B"],
  ["en-/em-", "使成為", "B"],
  ["circum-", "環繞", "B"],
  ["contra-", "對抗", "B"],
  ["dia-", "穿過／之間", "B"],
  ["epi-", "在上／附加", "C"],
  ["hyper-", "過度", "B"],
  ["hypo-", "不足／在下", "B"],
  ["meta-", "之後／超越", "C"],
  ["para-", "旁／異常", "B"],
  ["peri-", "周圍", "C"],
  ["poly-", "多", "B"],
  ["semi-", "半", "C"],
  ["super-", "在上／過度", "A"],
  ["ultra-", "極端", "C"],
  ["be-", "使／圍繞", "C"],
  ["fore-", "先前", "C"],
  ["mis-", "錯誤", "B"],
  ["non-", "非", "C"],
  ["out-", "向外／勝過", "C"],
  ["over-", "過度", "B"],
  ["under-", "不足／在下", "B"],
  ["with-", "反對／撤回", "C"],
  ["a-/an-", "無／不", "A"],
  ["ambi-", "兩邊", "B"],
  ["ante-", "在前", "B"],
  ["auto-", "自己", "B"],
  ["bene-", "好", "A"],
  ["mal-", "壞", "A"],
  ["multi-", "多", "B"],
  ["neo-", "新", "C"],
  ["omni-", "全", "B"],
  ["pan-", "全", "B"],
];

const ROOTS = [
  ["tract", "拉、扯、拖", "A"],
  ["tort/tors", "扭、轉、絞", "A"],
  ["scend/scent", "爬、升", "A"],
  ["claud/claus/clud/clos", "關、鎖", "A"],
  ["vert/vers", "轉", "A"],
  ["gen", "生、種", "A"],
  ["voc/vok", "呼、聲", "A"],
  ["mit/miss", "送、放", "A"],
  ["duc/duct", "引導", "A"],
  ["spect/spec", "看", "A"],
  ["scrib/script", "寫", "A"],
  ["port", "運、帶", "A"],
  ["pos/pon", "放、置", "A"],
  ["fac/fic/fect", "做、造", "A"],
  ["cap/cept/cip", "拿、抓", "A"],
  ["ten/tain", "持、握", "A"],
  ["grad/gress", "走、步", "A"],
  ["ced/ceed/cess", "走、讓", "A"],
  ["fer", "帶、拿", "A"],
  ["ject", "投、擲", "A"],
  ["rupt", "破", "A"],
  ["struct", "建造", "A"],
  ["form", "形", "B"],
  ["graph/gram", "寫、圖", "B"],
  ["log/loqu", "說、理", "A"],
  ["path", "感、病", "A"],
  ["phil", "愛", "B"],
  ["phob", "怕", "B"],
  ["chron", "時", "B"],
  ["cred", "信", "A"],
  ["dict", "說", "A"],
  ["ducere→duc", "引導", "B"],
  ["fin", "終、界", "B"],
  ["flu", "流", "B"],
  ["fort", "強", "B"],
  ["frag/fract", "碎", "B"],
  ["fus", "澆、熔", "B"],
  ["greg", "群", "B"],
  ["her/hes", "黏", "B"],
  ["jud/jur/jus", "法、判", "A"],
  ["junct", "連接", "B"],
  ["lat", "帶、邊", "B"],
  ["leg/lect", "選、讀、法", "A"],
  ["lev", "輕、舉", "B"],
  ["liber", "自由", "B"],
  ["loc/loq", "說／地方（依形）", "B"],
  ["luc/lum", "光", "B"],
  ["man", "手", "B"],
  ["mand", "命令", "B"],
  ["mar", "海", "C"],
  ["mater/matr", "母", "C"],
  ["medi", "中", "B"],
  ["mem", "記", "B"],
  ["mens/metri", "量", "B"],
  ["merc", "商、報", "C"],
  ["merge/mers", "沉", "B"],
  ["migr", "移", "B"],
  ["mir", "奇、看", "C"],
  ["mis/mit", "送", "B"],
  ["mob/mot/mov", "動", "A"],
  ["mon/monit", "警告、提醒", "B"],
  ["mor/mort", "死", "B"],
  ["morph", "形", "B"],
  ["mut", "變", "B"],
  ["nasc/nat", "生", "B"],
  ["nav", "船", "C"],
  ["neg", "否", "A"],
  ["noc/nox", "害", "B"],
  ["nomen/nym", "名", "A"],
  ["nov", "新", "B"],
  ["numer", "數", "C"],
  ["onym", "名", "B"],
  ["oper", "工作", "C"],
  ["opt", "選、視", "B"],
  ["ord", "秩序", "B"],
  ["ori", "升起、起源", "B"],
  ["paci", "和平", "C"],
  ["pater/patr", "父", "C"],
  ["ped/pod", "腳", "B"],
  ["pel/puls", "推", "A"],
  ["pend/pens", "懸、稱、付", "A"],
  ["pet", "求、衝", "B"],
  ["phil→phile", "愛", "C"],
  ["phon", "聲", "B"],
  ["plac", "平息、討好", "B"],
  ["pon/pose", "放", "B"],
  ["popul", "民", "C"],
  ["port→portable", "運", "C"],
  ["pot", "能、力", "B"],
  ["prehend/prise", "抓", "B"],
  ["press", "壓", "B"],
  ["prim", "第一", "C"],
  ["priv", "私", "B"],
  ["prob", "試、好", "B"],
  ["propri", "適當、己有", "B"],
  ["pugn", "打", "B"],
  ["punct", "點、刺", "B"],
  ["put", "想、算", "B"],
  ["quer/quis", "問、求", "A"],
  ["qui", "靜", "B"],
  ["radic", "根", "B"],
  ["rap/rav", "奪", "B"],
  ["rect", "直、正", "B"],
  ["reg/rex", "統治", "B"],
  ["rid/ris", "笑", "B"],
  ["rog", "問", "B"],
  ["rupt→bankrupt", "破", "C"],
  ["sacr/sanct", "聖", "B"],
  ["sal/sult", "跳", "B"],
  ["sat/satis", "滿", "B"],
  ["sci", "知", "A"],
  ["scop", "看", "B"],
  ["scrib→script", "寫", "C"],
  ["sec/sect", "切", "B"],
  ["sed/sess/sid", "坐", "A"],
  ["sem/semin", "種", "C"],
  ["sen", "老", "C"],
  ["sent/sens", "感", "A"],
  ["sequ/secut", "跟隨", "A"],
  ["serv", "侍、守", "B"],
  ["sign", "記號", "B"],
  ["simil/simul", "相似", "B"],
  ["sol", "獨／日（依詞）", "B"],
  ["solv/solut", "解", "A"],
  ["somn", "睡", "C"],
  ["son", "聲", "C"],
  ["soph", "智", "B"],
  ["spec→spect", "看", "C"],
  ["spir", "呼吸", "B"],
  ["sta/stit", "站", "A"],
  ["string/strict", "綁、緊", "B"],
  ["stru→struct", "建造", "C"],
  ["suad", "勸", "B"],
  ["sum", "拿、總", "B"],
  ["surg", "升", "C"],
  ["tact/tang", "觸", "B"],
  ["tain→ten", "持", "C"],
  ["techn", "技", "C"],
  ["tele", "遠", "C"],
  ["tempor", "時", "B"],
  ["ten→tend/tens", "伸、張", "A"],
  ["term", "界、終", "B"],
  ["terr", "地／怕（依詞）", "B"],
  ["test", "見證", "B"],
  ["the/theo", "神", "C"],
  ["therm", "熱", "C"],
  ["thesis", "放、命題", "B"],
  ["tom", "切", "C"],
  ["torq→tort", "扭", "C"],
  ["tort→torsion", "扭", "C"],
  ["tract→traction", "拉", "C"],
  ["trib", "分、給", "B"],
  ["trud/trus", "推", "B"],
  ["turb", "擾", "B"],
  ["umbr", "影", "C"],
  ["urb", "城", "C"],
  ["vac", "空", "B"],
  ["vad/vas", "走", "B"],
  ["vag", "遊", "C"],
  ["val", "強、值", "B"],
  ["ven/vent", "來", "A"],
  ["ver", "真", "A"],
  ["verb", "字、詞", "B"],
  ["vert→verse", "轉", "C"],
  ["via", "路", "C"],
  ["vid/vis", "看", "A"],
  ["vinc/vict", "勝", "A"],
  ["viv/vit", "活", "B"],
  ["voc→vok", "呼", "C"],
  ["vol", "願／飛（依詞）", "B"],
  ["vor", "吃", "B"],
];

const RHYME_ELEMENTS = [
  ["-our/-ore", "豪門恩怨押韻族", "A"],
  ["-edge/-adge", "邊緣承諾押韻族", "A"],
  ["-eak/-oke", "毀滅洩漏押韻族", "A"],
  ["-ant/-ent", "螞蟻動態人物族", "A"],
  ["-ess/-ness", "狀態名詞族（候選）", "B"],
  ["-ude/-ute", "抽象質地族（候選）", "B"],
  ["-ign/-ine", "標記／性質族（候選）", "B"],
  ["-ect/-act", "動作尾韻族（候選）", "B"],
  ["-ive/-ance", "傾向／狀態族（候選）", "B"],
  ["-ory/-ary", "場所／傾向族（候選）", "B"],
  ["-ism/-ist", "主義／人家族（候選）", "B"],
  ["-ate/-ite", "動詞／人家族（候選）", "B"],
  ["-ound/-aunt", "ound/aunt 押韻族（候選）", "A"],
  ["-ain/-ane", "ain/ane 押韻族（候選）", "B"],
  ["-ire/-yre", "ire 押韻族（候選）", "B"],
  ["-ult/-ilt", "ult 押韻族（候選）", "B"],
  ["-ose/-ous", "ose/ous 形近尾（候選）", "B"],
  ["-cede/-ceed/-sess", "走／讓步拼寫族（候選）", "A"],
  ["-ceive/-ceit", "拿／騙拼寫族（候選）", "B"],
  ["-plain/-plainant", "抱怨族（候選）", "C"],
  ["-sult/-salt", "跳／結果族（候選）", "C"],
  ["-tain/-tense", "持／張族（候選）", "B"],
  ["-vent/-vene", "來／介入族（候選）", "B"],
  ["-vise/-vice", "看／惡族（候選）", "B"],
  ["-duct/-duce", "引導族（候選）", "A"],
  ["-sist/-sist", "站立抵抗族（候選）", "B"],
  ["-fuse/-found", "澆／熔／基礎族（候選）", "B"],
  ["-claim/-clam", "呼喊族（候選）", "B"],
  ["-spir/-spire", "呼吸志向族（候選）", "B"],
  ["-cred/-crea", "信／創造近形（候選）", "B"],
  ["-judic/-jury", "審判族（候選）", "B"],
  ["-path/-pathy", "情感病感族（候選）", "A"],
  ["-phon/-phony", "聲／假族（候選）", "B"],
  ["-graph/-gram", "書寫圖族（候選）", "B"],
  ["-logy/-logue", "學／對話族（候選）", "B"],
  ["-archy/-cracy", "統治體制族（候選）", "B"],
  ["-phobia/-philia", "怕／愛對照尾（候選）", "B"],
  ["-oid/-ode", "形似族（候選）", "C"],
  ["-ule/-icle", "小詞尾族（候選）", "C"],
  ["-escent/-escent", "漸變族（候選）", "B"],
  ["-acious/-aceous", "傾向形尾（候選）", "B"],
  ["-iferous/-ivorous", "產生／食（候選）", "C"],
  ["-acious vs -aceous", "易混形尾對（候選）", "C"],
  ["-iate/-eate", "動詞形尾（候選）", "C"],
  ["-ine/-ene", "化學／性質尾（候選）", "C"],
  ["-ome/-oma", "體／瘤尾（候選）", "C"],
  ["-urgy/-urgy", "工藝尾（候選）", "C"],
  ["-mancy/-mancy", "占卜尾（候選）", "C"],
  ["-ette/-et", "小詞／陰性尾（候選）", "C"],
  ["-ster/-ster", "人／貶義尾（候選）", "C"],
];

const SEMANTIC_ELEMENTS = [
  ["flattery-vs-arrogance", "馬屁精↔傲嬌", "A"],
  ["silent-vs-talkative", "沉默↔長舌", "A"],
  ["temper-vs-amiable", "暴躁↔和藹", "A"],
  ["praise-vs-criticize", "吹捧↔抨擊", "B"],
  ["scarce-vs-abundant", "稀缺↔充裕", "B"],
  ["clear-vs-obscure", "清晰↔晦澀", "B"],
  ["brief-vs-verbose", "簡潔↔冗長", "B"],
  ["humble-vs-vain", "謙遜↔虛榮", "B"],
  ["courage-vs-cowardice", "勇敢↔怯懦", "B"],
  ["honest-vs-deceit", "誠實↔欺瞞", "A"],
  ["support-vs-undermine", "支持↔削弱", "A"],
  ["increase-vs-decrease", "增↔減", "B"],
  ["begin-vs-end", "始↔終", "B"],
  ["include-vs-exclude", "納↔斥", "B"],
  ["temporary-vs-permanent", "暫↔久", "B"],
  ["literal-vs-figurative", "字面↔比喻", "B"],
  ["objective-vs-biased", "客觀↔偏頗", "A"],
  ["certain-vs-doubtful", "確定↔存疑", "B"],
  ["order-vs-chaos", "秩序↔混亂", "B"],
  ["native-vs-foreign", "本土↔外來", "C"],
  ["sacred-vs-profane", "神聖↔世俗", "B"],
  ["thrifty-vs-lavish", "節儉↔揮霍", "B"],
  ["rigid-vs-flexible", "僵固↔彈性", "B"],
  ["overt-vs-covert", "公開↔隱密", "A"],
  ["acute-vs-chronic", "急性↔慢性", "B"],
  ["benign-vs-malignant", "良性↔惡性", "B"],
  ["voluntary-vs-coerced", "自願↔脅迫", "B"],
  ["abstract-vs-concrete", "抽象↔具體", "B"],
  ["innovative-vs-derivative", "創新↔派生模仿", "B"],
  ["elated-vs-despondent", "興高↔沮喪", "B"],
];

const LOOKALIKE_ELEMENTS = [
  ["a-lookalikes-01", "A 開頭易混組", "A"],
  ["c-lookalikes-01", "C 開頭易混組", "B"],
  ["d-lookalikes-01", "D 開頭易混組", "B"],
  ["e-lookalikes-01", "E 開頭易混組", "B"],
  ["i-lookalikes-01", "I 開頭易混組", "B"],
  ["p-lookalikes-01", "P 開頭易混組", "B"],
  ["r-lookalikes-01", "R 開頭易混組", "B"],
  ["s-lookalikes-01", "S 開頭易混組", "B"],
  ["b-lookalikes-01", "B 開頭易混組", "B"],
  ["f-lookalikes-01", "F 開頭易混組", "B"],
  ["g-lookalikes-01", "G 開頭易混組", "B"],
  ["h-lookalikes-01", "H 開頭易混組", "B"],
  ["m-lookalikes-01", "M 開頭易混組", "B"],
  ["t-lookalikes-01", "T 開頭易混組", "B"],
  ["v-lookalikes-01", "V 開頭易混組", "B"],
  ["un-lookalikes-01", "un-/in- 否定易混", "A"],
  ["emigrate-immigrate", "移出／移入對", "A"],
  ["imply-infer", "暗示／推論對", "A"],
  ["averse-adverse", "厭惡／不利對", "A"],
  ["appraise-apprise", "估價／通知對", "B"],
  ["allude-elude", "暗指／躲避對", "B"],
  ["censor-censure", "審查／譴責對", "A"],
  ["complacent-complaisant", "自滿／討好對", "B"],
  ["discrete-discreet", "分離／謹慎對", "A"],
  ["historic-historical", "歷史性／與歷史有關", "B"],
  ["incredible-incredulous", "難以置信／不肯信", "A"],
  ["perspective-prospective", "視角／預期", "B"],
  ["respectfully-respectively", "尊敬地／分別地", "B"],
  ["sensual-sensuous", "感官情慾／美感感官", "C"],
  ["venal-venial", "貪腐／可恕", "B"],
];

function packElements() {
  const elements = [];
  let n = 0;
  const add = (type, lemma, glossZh, priority) => {
    n += 1;
    elements.push({
      id: `${type}-${String(n).padStart(3, "0")}`,
      type,
      lemma,
      glossZh,
      priority,
      clusterIds: [],
      status: "listed",
    });
  };
  for (const [lemma, glossZh, priority] of PREFIXES) add("prefix", lemma, glossZh, priority);
  for (const [lemma, glossZh, priority] of ROOTS) add("root", lemma, glossZh, priority);
  for (const [lemma, glossZh, priority] of RHYME_ELEMENTS) add("rhyme", lemma, glossZh, priority);
  for (const [lemma, glossZh, priority] of SEMANTIC_ELEMENTS) add("semantic", lemma, glossZh, priority);
  for (const [lemma, glossZh, priority] of LOOKALIKE_ELEMENTS) add("lookalike", lemma, glossZh, priority);
  return elements;
}

const elements = packElements();

// link seed clusters to element ids by lemma match
function findElementId(type, needle) {
  const e = elements.find(
    (x) => x.type === type && x.lemma.toLowerCase().includes(needle.toLowerCase()),
  );
  return e?.id || null;
}

// ——— 12 seed clusters ———
const clusters = [];

function pushCluster(c) {
  // attach element ids
  if (c.elementLemma && c.type) {
    const eid = findElementId(
      c.type === "rhyme"
        ? "rhyme"
        : c.type === "root"
          ? "root"
          : c.type === "semantic"
            ? "semantic"
            : "lookalike",
      c.elementLemma,
    );
    if (eid) {
      c.elementIds = [eid];
      const el = elements.find((x) => x.id === eid);
      if (el && !el.clusterIds.includes(c.id)) el.clusterIds.push(c.id);
    }
  }
  clusters.push(c);
  fs.writeFileSync(path.join(clusterDir, `${c.id}.json`), `${JSON.stringify(c, null, 2)}\n`);
}

pushCluster({
  id: "rhyme-our-01",
  type: "rhyme",
  elementLemma: "-our/-ore",
  titleZh: "-our / -ore｜豪門恩怨系列",
  titleEn: "The Our Household Saga",
  hook: "把 our（我們的）當主角——臭臉老爸正在大掃除。",
  script:
    "我們的（our）豪宅裡，dour 老爸臉臭到能醃菜；他一邊 scour 刷地板，一邊把酸掉的情緒 pour 進水桶。空氣整間 sour，他還 lour／lower 著眉。最後全家只好 mourn：歡樂已死。",
  members: [
    card("pour", { zhGloss: "倒出；傾注", roleInScript: "把情緒／液體倒進桶", speakLineEn: "Don’t pour cold water on the proposal before you hear it.", speakLineZh: "先聽完再說，別急著潑冷水。" }),
    card("sour", { zhGloss: "變酸；變壞；不高興的", roleInScript: "空氣變酸、氣氛變糟", speakLineEn: "Relations soured after the leaked memo.", speakLineZh: "備忘錄外洩後，關係變質了。" }),
    card("scour", { zhGloss: "徹底刷洗；徹底搜查", roleInScript: "刷地板／翻箱搜查", speakLineEn: "Investigators scoured the records for inconsistencies.", speakLineZh: "調查人員徹底翻查紀錄找矛盾。" }),
    card("dour", { zhGloss: "嚴厲冷酷的；陰鬱的", roleInScript: "臭臉老爸", speakLineEn: "His dour expression never softened during negotiations.", speakLineZh: "談判時他那張冷酷臉始終沒鬆過。" }),
    card("mourn", { zhGloss: "哀悼；感到悲痛", roleInScript: "哀悼歡樂已死", speakLineEn: "Critics mourned the decline of careful argumentation.", speakLineZh: "評論者哀悼嚴謹論證的衰落。" }),
  ],
  reviewHooks: ["our 豪宅：倒（pour）酸（sour）刷（scour）臭臉（dour）哀悼（mourn）", "看到 -our/-ore，先找『我們家』場景"],
  pitfalls: ["lour/lower（皺眉）口語少見，先主攻 dour/scour", "pour ≠ poor（貧窮）諧音陷阱"],
  lessonRefs: ["lesson-rhyme-our-01"],
  status: "draft",
  priority: "A",
});

pushCluster({
  id: "rhyme-edge-01",
  type: "rhyme",
  elementLemma: "-edge/-adge",
  titleZh: "-edge / -adge｜邊緣承諾系列",
  titleEn: "Life on the Edge",
  hook: "edge＝邊緣——站在邊緣發誓、長毛、避險、還被獾纠缠。",
  script:
    "站在崖邊（edge）你 pledge 保證不跳；羽毛 fledge 長到邊緣才敢飛。旁邊種了 hedge 當避險，卻有人 allege 你在說謊，還有隻 badger 獾從早纠缠到晚。",
  members: [
    card("pledge", { zhGloss: "保證；誓言；質押", roleInScript: "崖邊發誓", speakLineEn: "She pledged to uphold the committee’s standards.", speakLineZh: "她誓言維護委員會標準。" }),
    card("fledge", { zhGloss: "長羽毛；羽翼漸豐", roleInScript: "羽毛長到邊緣", speakLineEn: "The fledgling idea needs time to fledge into a policy.", speakLineZh: "這個雛形想法需要時間羽翼漸豐成政策。" }),
    card("hedge", { zhGloss: "樹籬；避險；防範；閃爍其詞", roleInScript: "邊緣的保護籬", speakLineEn: "Investors hedged against currency swings.", speakLineZh: "投資人針對匯率波動做避險。" }),
    card("allege", { zhGloss: "宣稱；指控（未必證實）", roleInScript: "有人宣稱你說謊", speakLineEn: "The report alleges conflicts of interest.", speakLineZh: "報告指控存在利益衝突。" }),
    card("badger", { zhGloss: "獾；纠缠不休", roleInScript: "邊緣獾纠缠", speakLineEn: "Stop badgering the witness with the same question.", speakLineZh: "別用同一問題纠缠證人。" }),
  ],
  reviewHooks: ["edge：誓（pledge）飛（fledge）籬（hedge）稱（allege）獾（badger）", "allege＝宣稱未證；不要自動當成事實"],
  pitfalls: ["hedge 多義：實體樹籬 vs 金融避險 vs 說話閃躲", "fledge 在詞庫可能缺失→pending-add"],
  lessonRefs: ["lesson-rhyme-edge-01"],
  status: "draft",
  priority: "A",
});

pushCluster({
  id: "rhyme-eak-01",
  type: "rhyme",
  elementLemma: "-eak/-oke",
  titleZh: "-eak / -oke｜毀滅與洩漏系列",
  titleEn: "Leak, Wreak, Bleak",
  hook: "leak（漏）的延伸——發洩破壞後，只剩淒涼廢墟。",
  script:
    "秘密一 leak，惡棍就 sneak 進來 wreak 破壞；現場留下 bleak 廢墟與一道 streak 焦痕。你想 evoke 大家的良知，上司卻 revoke 你的權限。",
  members: [
    card("wreak", { zhGloss: "造成（破壞）；發洩", roleInScript: "發洩破壞", speakLineEn: "The storm wreaked havoc on coastal towns.", speakLineZh: "暴風雨對沿海城鎮造成浩劫。" }),
    card("bleak", { zhGloss: "荒涼的；黯淡的", roleInScript: "淒涼廢墟", speakLineEn: "Prospects for reform look bleak.", speakLineZh: "改革前景看起來黯淡。" }),
    card("sneak", { zhGloss: "鬼祟行事；偷偷摸摸", roleInScript: "鬼祟溜進", speakLineEn: "He tried to sneak a clause into the contract.", speakLineZh: "他想偷偷塞一條條款進合約。" }),
    card("streak", { zhGloss: "條紋；一陣子；疾馳", roleInScript: "焦痕／連勝連敗", speakLineEn: "A losing streak can bias risk judgments.", speakLineZh: "連敗可能扭曲風險判斷。" }),
    card("evoke", { zhGloss: "喚起（情感／記憶）", roleInScript: "喚起良知", speakLineEn: "The passage evokes a sense of irreversible loss.", speakLineZh: "這段文字喚起一種不可逆的失落感。" }),
    card("revoke", { zhGloss: "撤銷；廢止", roleInScript: "撤銷權限", speakLineEn: "The board revoked the temporary exemption.", speakLineZh: "董事會撤銷了臨時豁免。" }),
  ],
  reviewHooks: ["leak 宇宙：sneak→wreak→bleak→streak；evoke↔revoke", "evoke 喚起／revoke 收回——方向相反"],
  pitfalls: ["wreak 常接 havoc；不要寫成 wreck 的拼法混用（語境不同）", "bleak ≠ black"],
  lessonRefs: ["lesson-rhyme-eak-01"],
  status: "draft",
  priority: "A",
});

pushCluster({
  id: "rhyme-ant-01",
  type: "rhyme",
  elementLemma: "-ant/-ent",
  titleZh: "-ant / -ent｜螞蟻動態人物系列",
  titleEn: "ANT Uprising",
  hook: "ANT（螞蟻）大暴走——英勇蟻對暴君怒吼。",
  script:
    "一隻 gallant 英勇小蟻，對著 tyrant 暴君開始 rant 怒吼；牠的觀點有 slant 偏斜，事後又 repent 後悔自己太衝。",
  members: [
    card("gallant", { zhGloss: "英勇的；殷勤瀟灑的", roleInScript: "英勇小蟻", speakLineEn: "A gallant defense of an unpopular thesis can still persuade.", speakLineZh: "為不受歡迎論點作英勇辯護仍可能說服人。" }),
    card("rant", { zhGloss: "怒吼；咆哮；慷慨激昂的演說", roleInScript: "對暴君怒吼", speakLineEn: "The columnist’s rant obscured the actual data.", speakLineZh: "專欄的咆哮掩蓋了實際數據。" }),
    card("slant", { zhGloss: "傾斜；偏見；傾向", roleInScript: "偏斜觀點", speakLineEn: "The coverage had a clear political slant.", speakLineZh: "報導帶有明顯政治傾向。" }),
    card("repent", { zhGloss: "後悔；懺悔", roleInScript: "後悔太衝", speakLineEn: "Few policymakers publicly repent failed forecasts.", speakLineZh: "很少政策制定者公開後悔失敗預測。" }),
    card("tyrant", { zhGloss: "暴君；專制者", roleInScript: "暴君", speakLineEn: "The essay frames the editor as an intellectual tyrant.", speakLineZh: "文章把編輯刻畫成智識暴君。" }),
  ],
  reviewHooks: ["ANT：gallant 蟻 rant，slant 後 repent，對抗 tyrant", "-ant/-ent 常見『人／形容』尾，先抓角色"],
  pitfalls: ["slant 可作名詞（偏見）或動詞（傾斜陳述）", "rant 偏口語／修辭貶義，GRE 閱讀常用來標『情緒多於論證』"],
  lessonRefs: ["lesson-rhyme-ant-01"],
  status: "draft",
  priority: "A",
});

pushCluster({
  id: "root-tract-01",
  type: "root",
  elementLemma: "tract",
  titleZh: "tract｜拔河狂人劇場",
  titleEn: "The Tug-of-War Maniac",
  hook: "字根 tract＝拉、扯、拖——主角是拔河狂人。",
  script:
    "拔河狂人最會 attract 觀眾目光；一有風吹草動就 distract 對手。合約他要 protract 拖長，說過的話又能 retract 拉回肚子。別人一成功他就 detract 貶低；溫馴的叫 tractable，死都不肯被拉的叫 intractable。",
  members: [
    card("attract", { zhGloss: "吸引", roleInScript: "把目光拉過來", humorDevice: "morphology", speakLineEn: "Clear theses attract careful readers.", speakLineZh: "清楚的論旨能吸引細心的讀者。" }),
    card("distract", { zhGloss: "使分心；干擾", roleInScript: "把注意力拉開", humorDevice: "morphology", speakLineEn: "Irrelevant details distract from the main claim.", speakLineZh: "無關細節會把人從主論點拉開。" }),
    card("protract", { zhGloss: "延長；拖延", roleInScript: "把時間往前拖長", humorDevice: "morphology", speakLineEn: "They protracted negotiations to exhaust the other side.", speakLineZh: "他們拖延談判以消耗對方。" }),
    card("retract", { zhGloss: "撤回；縮回", roleInScript: "把話拉回來", humorDevice: "morphology", speakLineEn: "The journal asked the authors to retract the paper.", speakLineZh: "期刊要求作者撤回該論文。" }),
    card("detract", { zhGloss: "貶低；減損", roleInScript: "把價值往下拉", humorDevice: "morphology", speakLineEn: "One weak paragraph should not detract from the whole argument.", speakLineZh: "一段弱段落不該減損整篇論證。" }),
    card("tractable", { zhGloss: "易駕馭的；溫順的；易處理的", roleInScript: "拉得動的繩／人", humorDevice: "morphology", speakLineEn: "The problem looks more tractable after we define terms.", speakLineZh: "定義術語後，問題顯得更好處理。" }),
    card("intractable", { zhGloss: "難駕馭的；棘手的", roleInScript: "怎麼拉都不動", humorDevice: "morphology", speakLineEn: "Poverty remains an intractable policy challenge.", speakLineZh: "貧困仍是棘手的政策挑戰。" }),
  ],
  reviewHooks: [
    "tract＝拉：吸引吸引過來、分心拉開、拖延拉長、撤回拉回、貶低往下拉",
    "tractable 拉得動 ↔ intractable 拉不動",
  ],
  pitfalls: [
    "detract from = 減損……的價值；不要寫成『攻擊某人』的唯一義",
    "retract（撤回說法／縮回）≠ retreat（撤退）",
    "protract 偏『延長過程』，不是『保護 protect』",
  ],
  lessonRefs: ["lesson-root-tract-01"],
  status: "reviewed",
  priority: "A",
});

pushCluster({
  id: "root-tort-01",
  type: "root",
  elementLemma: "tort/tors",
  titleZh: "tort｜麻花捲人格",
  titleEn: "Twisted Personality Lab",
  hook: "tort＝扭——說話反扭叫反駁，錢硬扭出來叫勒索。",
  script:
    "麻花師傅會 distort 真相的形狀；要錢時 extort 硬扭；別人一問他就 retort 反扭回去。路是 tortuous 彎來彎去，表情 contort 扭曲，內心長期 torment 折磨。",
  members: [
    card("distort", { zhGloss: "扭曲；曲解", roleInScript: "把真相扭變形", humorDevice: "morphology", speakLineEn: "Selective quotation can distort an author’s position.", speakLineZh: "選擇性引述會扭曲作者立場。" }),
    card("extort", { zhGloss: "敲詐；勒索", roleInScript: "把錢扭出來", humorDevice: "morphology", speakLineEn: "The regime extorted confessions through threat.", speakLineZh: "政權以威脅勒索口供。" }),
    card("retort", { zhGloss: "反駁；反擊", roleInScript: "把話扭回去", humorDevice: "morphology", speakLineEn: "She retorted that the critique ignored the data.", speakLineZh: "她反駁說批評忽略了數據。" }),
    card("tortuous", { zhGloss: "曲折的；彎彎繞繞的", roleInScript: "扭來扭去的路／論理", humorDevice: "morphology", speakLineEn: "The tortuous reasoning lost the audience.", speakLineZh: "彎彎繞繞的推理讓聽眾掉線。" }),
    card("contort", { zhGloss: "使扭曲變形", roleInScript: "臉／邏輯扭成奇形", humorDevice: "morphology", speakLineEn: "He contorted the statute beyond recognition.", speakLineZh: "他把法條解釋扭到認不出原樣。" }),
    card("torment", { zhGloss: "折磨；苦惱", roleInScript: "持續扭著痛", humorDevice: "morphology", speakLineEn: "Doubt continued to torment the researchers.", speakLineZh: "疑慮持續折磨研究人員。" }),
  ],
  reviewHooks: ["tort＝扭：distort 扭形、extort 扭錢、retort 扭回、tortuous 扭路", "tortuous（曲折）≠ torturous（折磨人的）——差一個字母"],
  pitfalls: ["tortuous vs torturous 必記", "retort 可作動詞或名詞（機智反駁）"],
  lessonRefs: ["lesson-root-tort-01"],
  status: "draft",
  priority: "A",
});

pushCluster({
  id: "root-scend-01",
  type: "root",
  elementLemma: "scend/scent",
  titleZh: "scend｜階層攀爬遊戲",
  titleEn: "Climb the Ladder",
  hook: "scend＝爬升——一起往上或往下看人。",
  script:
    "英雄 ascend 上升，反派 descend 下降；真正高手 transcend 超越階層。最討厭的是 condescend：假裝屈尊下爬來『關心』你。音樂一 crescendo，情緒也往上爬。",
  members: [
    card("ascend", { zhGloss: "上升；登上", roleInScript: "往上爬", humorDevice: "morphology", speakLineEn: "She ascended to leadership after the crisis.", speakLineZh: "危機後她上升到領導位置。" }),
    card("descend", { zhGloss: "下降；落入", roleInScript: "往下爬", humorDevice: "morphology", speakLineEn: "The debate descended into personal attacks.", speakLineZh: "辯論墮落到人身攻擊。" }),
    card("transcend", { zhGloss: "超越", roleInScript: "爬出階層之外", humorDevice: "morphology", speakLineEn: "Great art can transcend its historical moment.", speakLineZh: "偉大藝術能超越其歷史時刻。" }),
    card("condescend", { zhGloss: "屈尊；以恩賜態度對待", roleInScript: "假裝爬下來關心你", humorDevice: "morphology", speakLineEn: "Do not condescend to readers with oversimplified claims.", speakLineZh: "別用過度簡化的說法屈尊俯就讀者。" }),
    card("crescendo", { zhGloss: "漸強；高潮漸起", roleInScript: "聲音／情緒往上爬", humorDevice: "story", speakLineEn: "Criticism rose to a crescendo before the vote.", speakLineZh: "投票前批評聲浪漸強至高潮。" }),
  ],
  reviewHooks: ["爬：ascend↑ descend↓ transcend 超出去；condescend＝假裝下來", "condescend 必帶『高人一等』語氣"],
  pitfalls: ["descend into = 墮落到某種壞狀態", "crescendo 常被誤用為『高潮本身』，嚴格說是『漸強過程』"],
  lessonRefs: ["lesson-root-scend-01"],
  status: "draft",
  priority: "A",
});

pushCluster({
  id: "root-clud-01",
  type: "root",
  elementLemma: "claud/claus/clud/clos",
  titleZh: "clud｜獄卒日常",
  titleEn: "Lockdown Logistics",
  hook: "clud／claus＝關、鎖——獄卒的一天。",
  script:
    "下班前 conclude 總結案情；不受歡迎的人 exclude 排除在外；提前上鎖叫 preclude。想安靜就 seclude 把自己關起來；管路 occlude 堵塞時全員慌張——有人甚至有 claustrophobia 幽閉恐懼。",
  members: [
    card("conclude", { zhGloss: "結束；推斷出", roleInScript: "把案子鎖上句點", humorDevice: "morphology", speakLineEn: "We conclude that the evidence is insufficient.", speakLineZh: "我們斷定證據不足。" }),
    card("exclude", { zhGloss: "排除；拒絕納入", roleInScript: "不讓進門", humorDevice: "morphology", speakLineEn: "The sample excluded outliers above three standard deviations.", speakLineZh: "樣本排除了三個標準差以上的極端值。" }),
    card("preclude", { zhGloss: "預先阻止；使不可能", roleInScript: "預先把門鎖上", humorDevice: "morphology", speakLineEn: "Budget limits preclude a full replication study.", speakLineZh: "預算限制使完整重製研究不可行。" }),
    card("seclude", { zhGloss: "使隔絕；隱居", roleInScript: "把自己鎖進小房間", humorDevice: "morphology", speakLineEn: "The writer secluded herself to finish the draft.", speakLineZh: "作者隔絕自己以完成草稿。" }),
    card("occlude", { zhGloss: "堵塞；閉塞", roleInScript: "管路被堵住", humorDevice: "morphology", speakLineEn: "Plaque can occlude the artery.", speakLineZh: "斑塊可能堵塞動脈。" }),
    card("claustrophobia", { zhGloss: "幽閉恐懼症", roleInScript: "怕被關", humorDevice: "story", speakLineEn: "His claustrophobia made enclosed archives unbearable.", speakLineZh: "幽閉恐懼讓密閉檔案室令他难受。" }),
  ],
  reviewHooks: ["關：conclude 結案、exclude 拒入、preclude 預鎖、seclude 自鎖、occlude 堵塞", "preclude ≈ prevent by making impossible"],
  pitfalls: ["include 的反義常想到 exclude；preclude 不是『預先包括』", "conclude 雙義：結束／得出結論"],
  lessonRefs: ["lesson-root-clud-01"],
  status: "draft",
  priority: "A",
});

pushCluster({
  id: "sem-flattery-01",
  type: "semantic",
  elementLemma: "flattery-vs-arrogance",
  titleZh: "馬屁精 ↔ 傲嬌怪",
  titleEn: "Toady vs. Supercilious",
  hook: "一邊跪著誇，一邊用睫毛從天花板瞪你。",
  script:
    "辦公室裡 sycophant／toady 會 fawn 巴結；對面座位坐著 arrogant、supercilious、imperious 的主管，睫毛好像長在額頭上往下掃視。",
  members: [
    card("sycophant", { zhGloss: "諂媚者", roleInScript: "職業馬屁精", humorDevice: "phonetic", speakLineEn: "A sycophant praises power, not evidence.", speakLineZh: "諂媚者歌頌的是權力，不是證據。" }),
    card("toady", { zhGloss: "馬屁精；諂媚者", roleInScript: "馬屁精備位", humorDevice: "contrast", speakLineEn: "He dismissed the aide as a political toady.", speakLineZh: "他把那名助理斥為政治馬屁精。" }),
    card("fawn", { zhGloss: "巴結；奉承", roleInScript: "搖尾乞憐的動作", humorDevice: "story", speakLineEn: "Junior analysts should not fawn over every fashion in theory.", speakLineZh: "初級分析師不該對每個理論時尚巴結奉承。" }),
    card("arrogant", { zhGloss: "傲慢的", roleInScript: "對面傲嬌", humorDevice: "contrast", speakLineEn: "An arrogant tone can sink an otherwise sound argument.", speakLineZh: "傲慢語氣可能毁掉本來站得住的論證。" }),
    card("supercilious", { zhGloss: "目空一切的；高傲的", roleInScript: "睫毛在頭頂看人", humorDevice: "morphology", speakLineEn: "Her supercilious smile dismissed the objection.", speakLineZh: "她目空一切的笑把異議掃掉。" }),
    card("imperious", { zhGloss: "專橫的；霸道的", roleInScript: "命令式傲嬌", humorDevice: "contrast", speakLineEn: "An imperious email rarely invites collaboration.", speakLineZh: "專橫的郵件很少帶來合作。" }),
  ],
  reviewHooks: ["下位：sycophant/toady/fawn；上位：arrogant/supercilious/imperious", "supercilious ≈ super + cilium（睫毛）在上往下看"],
  pitfalls: ["fawn 另有『小鹿』義，考試多為動詞巴結", "sycophant 諧音可記，但答題要回到『諂媚者』"],
  lessonRefs: ["lesson-sem-flattery-01"],
  status: "draft",
  priority: "A",
});

pushCluster({
  id: "sem-talk-01",
  type: "semantic",
  elementLemma: "silent-vs-talkative",
  titleZh: "沉默寡言 ↔ 長舌婦",
  titleEn: "Taciturn vs. Garrulous",
  hook: "一邊痛到倒吸涼氣說不出話，一邊嘎嚕嚕叫不停。",
  script:
    "會議室左排 taciturn、reticent、laconic——能不說就不說；右排 loquacious、garrulous、verbose——停不下來。",
  members: [
    card("taciturn", { zhGloss: "沉默寡言的", roleInScript: "倒吸涼氣派", humorDevice: "phonetic", speakLineEn: "The taciturn witness answered in monosyllables.", speakLineZh: "沉默的證人只用單音節回答。" }),
    card("reticent", { zhGloss: "不輕易透露的；緘默的", roleInScript: "有話留半句", humorDevice: "contrast", speakLineEn: "She remained reticent about her funding sources.", speakLineZh: "她對資金來源仍不輕易透露。" }),
    card("laconic", { zhGloss: "言簡意賅的", roleInScript: "短到像密碼", humorDevice: "contrast", speakLineEn: "His laconic reply ended the discussion.", speakLineZh: "他言簡意賅的回覆結束了討論。" }),
    card("loquacious", { zhGloss: "話多的；滔滔不絕的", roleInScript: "話匣子", humorDevice: "contrast", speakLineEn: "A loquacious narrator can bury the plot.", speakLineZh: "滔滔不絕的敘事者可能把情節埋掉。" }),
    card("garrulous", { zhGloss: "喋喋不休的", roleInScript: "嘎嚕嚕老母雞", humorDevice: "phonetic", speakLineEn: "The garrulous memoir digresses endlessly.", speakLineZh: "這本喋喋不休的回憶錄沒完没了地離題。" }),
    card("verbose", { zhGloss: "冗長的；囉唆的", roleInScript: "字數膨脹", humorDevice: "contrast", speakLineEn: "Cut verbose transitions; keep the claim sharp.", speakLineZh: "刪掉冗長過渡，讓論點保持鋒利。" }),
  ],
  reviewHooks: ["少話：taciturn/reticent/laconic；多話：loquacious/garrulous/verbose", "laconic＝短而精；verbose＝長而肥"],
  pitfalls: ["reticent 強調『不願透露』；taciturn 強調『生性少話』", "loquacious 中性偏多話；garrulous 更嫌喋喋"],
  lessonRefs: ["lesson-sem-talk-01"],
  status: "draft",
  priority: "A",
});

pushCluster({
  id: "sem-temper-01",
  type: "semantic",
  elementLemma: "temper-vs-amiable",
  titleZh: "脾氣暴躁 ↔ 和藹可親",
  titleEn: "Choleric vs. Affable",
  hook: "熱可樂一開就炸，對面卻始終春風笑。",
  script:
    "左邊 choleric、irascible、peevish——點火就爆；右邊 affable、genial、amiable——誰來都好說話。",
  members: [
    card("choleric", { zhGloss: "易怒的", roleInScript: "熱可樂炸彈", humorDevice: "phonetic", speakLineEn: "A choleric referee escalated every dispute.", speakLineZh: "易怒的裁判讓每個爭議都升級。" }),
    card("irascible", { zhGloss: "暴躁易怒的", roleInScript: "點火就著", humorDevice: "contrast", speakLineEn: "The irascible professor dismissed soft questions.", speakLineZh: "暴躁教授直接打發軟問題。" }),
    card("peevish", { zhGloss: "易怒的；壞脾氣的", roleInScript: "碎碎念易怒", humorDevice: "contrast", speakLineEn: "Peevish objections rarely improve the draft.", speakLineZh: "壞脾氣的反對很少能改好草稿。" }),
    card("affable", { zhGloss: "和藹可親的", roleInScript: "好說話笑臉", humorDevice: "contrast", speakLineEn: "An affable chair kept the panel constructive.", speakLineZh: "和藹的主席讓座談保持建設性。" }),
    card("genial", { zhGloss: "友善溫和的", roleInScript: "溫暖氣場", humorDevice: "contrast", speakLineEn: "His genial tone disarmed hostile reviewers.", speakLineZh: "他溫和的語氣化解了敵意審稿人。" }),
    card("amiable", { zhGloss: "親切隨和的", roleInScript: "好相處", humorDevice: "contrast", speakLineEn: "Amiable colleagues still need clear standards.", speakLineZh: "親切同事依然需要清楚標準。" }),
  ],
  reviewHooks: ["爆：choleric/irascible/peevish；暖：affable/genial/amiable", "choleric≈熱可樂一開就噴"],
  pitfalls: ["amiable 指人緣好；amicable 常指關係／協議和睦——形近"],
  lessonRefs: ["lesson-sem-temper-01"],
  status: "draft",
  priority: "A",
});

pushCluster({
  id: "look-a-01",
  type: "lookalike",
  elementLemma: "a-lookalikes-01",
  titleZh: "A 開頭易混對決",
  titleEn: "A-Word Look-alikes",
  hook: "只差一兩個字母，考場最容易看花眼——用對決拆開。",
  script:
    "assent 點頭同意，dissent 舉手異議。accede 同意加入，concede 不得不讓步。aesthetic 追求美，ascetic 赤腳踩天梯苦行。abate 風雨減弱，abet 教唆你去下注。",
  members: [
    card("assent", { zhGloss: "同意；贊成", roleInScript: "點頭那方", humorDevice: "lookalike", speakLineEn: "The panel gave quiet assent to the amendment.", speakLineZh: "小組默默同意該修正。" }),
    card("dissent", { zhGloss: "異議；不同意", roleInScript: "舉手反對那方", humorDevice: "lookalike", speakLineEn: "One justice wrote a sharp dissent.", speakLineZh: "一位大法官寫下犀利異議。" }),
    card("accede", { zhGloss: "同意；加入；繼承", roleInScript: "同意入局", humorDevice: "lookalike", speakLineEn: "They refused to accede to the demand.", speakLineZh: "他們拒絕同意該要求。" }),
    card("concede", { zhGloss: "承認；讓步", roleInScript: "不得不讓", humorDevice: "lookalike", speakLineEn: "Even critics concede the study’s rigor.", speakLineZh: "連批評者也承認該研究嚴謹。" }),
    card("aesthetic", { zhGloss: "美學的；審美的", roleInScript: "追求美", humorDevice: "lookalike", speakLineEn: "The essay privileges aesthetic form over utility.", speakLineZh: "文章重審美形式勝過實用。" }),
    card("ascetic", { zhGloss: "苦行的；禁慾的", roleInScript: "愛踩梯修道", humorDevice: "phonetic", speakLineEn: "An ascetic lifestyle rejected every luxury.", speakLineZh: "苦行生活方式拒絕一切奢侈。" }),
    card("abate", { zhGloss: "減輕；減弱", roleInScript: "風雨變小", humorDevice: "lookalike", speakLineEn: "Once the noise abated, analysis resumed.", speakLineZh: "噪音減弱後，分析才繼續。" }),
    card("abet", { zhGloss: "教唆；煽動；協助（做壞事）", roleInScript: "a + bet 教唆下注", humorDevice: "phonetic", speakLineEn: "Silence can abet wrongdoing.", speakLineZh: "沉默可能協助不法行為。" }),
  ],
  reviewHooks: ["assent↔dissent；accede↔concede；aesthetic↔ascetic；abate↔abet", "abet＝教唆（常貶）；abate＝減弱"],
  pitfalls: ["aesthetic / ascetic 發音與拼寫雙坑", "accede to + 要求／條約"],
  lessonRefs: ["lesson-look-a-01"],
  status: "draft",
  priority: "A",
});

// ——— Sample lesson: root-tract-01 ———
const tract = clusters.find((c) => c.id === "root-tract-01");
const lesson = {
  id: "lesson-root-tract-01",
  slug: "root-tract-01",
  season: 2,
  seasonTitleZh: "字根劇場",
  seasonTitleEn: "Root Theater",
  type: "family",
  minutes: "12-15",
  clusterId: "root-tract-01",
  titleZh: "拔河狂人｜tract 拉扯拖",
  titleEn: "Tug-of-War Maniac — tract",
  flow: [
    { step: 1, name: "鉤子", minutes: 0.5, content: tract.hook },
    { step: 2, name: "串記劇本", minutes: 2, content: tract.script },
    {
      step: 3,
      name: "詞卡 round",
      minutes: 7,
      content: "依 members 逐詞：義錨 → 劇本角色 → 跟讀 speakLineEn",
    },
    { step: 4, name: "快測", minutes: 2, content: "見 quiz" },
    { step: 5, name: "口令帶走", minutes: 0.5, content: tract.reviewHooks },
  ],
  quiz: [
    {
      id: "q1",
      type: "sense",
      promptEn: "Which word best means “to make something seem less valuable”?",
      promptZh: "哪一個詞最接近「使某事顯得較不有價值／貶低」？",
      choices: ["attract", "detract", "protract", "tractable"],
      answer: "detract",
    },
    {
      id: "q2",
      type: "sense",
      promptEn: "A problem that is hard to manage is:",
      promptZh: "一個很難處理／駕馭的問題是：",
      choices: ["tractable", "attractive", "intractable", "retracted"],
      answer: "intractable",
    },
    {
      id: "q3",
      type: "lookalike",
      promptEn: "protract is closest in idea to:",
      promptZh: "protract 在概念上最接近：",
      choices: ["protect", "prolong", "protest", "portray"],
      answer: "prolong",
    },
  ],
  status: "reviewed",
};

fs.writeFileSync(path.join(lessonDir, "lesson-root-tract-01.json"), `${JSON.stringify(lesson, null, 2)}\n`);

const lessonsIndex = {
  version: "v0",
  total: 1,
  lessons: [
    {
      id: lesson.id,
      slug: lesson.slug,
      season: lesson.season,
      titleZh: lesson.titleZh,
      clusterId: lesson.clusterId,
      status: lesson.status,
    },
  ],
};
fs.writeFileSync(path.join(lessonDir, "index.json"), `${JSON.stringify(lessonsIndex, null, 2)}\n`);

const elementsDoc = {
  version: "v0",
  generatedAt: new Date().toISOString(),
  target: { prefixes: "40-50", roots: "200-250", totalElements: "300-350", words: 4000 },
  counts: {
    total: elements.length,
    prefix: elements.filter((e) => e.type === "prefix").length,
    root: elements.filter((e) => e.type === "root").length,
    rhyme: elements.filter((e) => e.type === "rhyme").length,
    semantic: elements.filter((e) => e.type === "semantic").length,
    lookalike: elements.filter((e) => e.type === "lookalike").length,
    priorityA: elements.filter((e) => e.priority === "A").length,
    priorityB: elements.filter((e) => e.priority === "B").length,
    priorityC: elements.filter((e) => e.priority === "C").length,
    withCluster: elements.filter((e) => e.clusterIds.length > 0).length,
  },
  elements,
};
fs.writeFileSync(path.join(outDir, "elements.json"), `${JSON.stringify(elementsDoc, null, 2)}\n`);

const index = {
  version: "v0",
  status: "bootstrap",
  clusters: clusters.map((c) => ({
    id: c.id,
    type: c.type,
    titleZh: c.titleZh,
    priority: c.priority,
    status: c.status,
    memberCount: c.members.length,
    inVocab: c.members.filter((m) => m.inVocab).length,
    pendingAdd: c.members.filter((m) => !m.inVocab).map((m) => m.headword),
  })),
  lessons: lessonsIndex.lessons,
};
fs.writeFileSync(path.join(outDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      elements: elementsDoc.counts,
      clusters: clusters.length,
      lesson: lesson.id,
      pendingAddTotal: index.clusters.reduce((a, c) => a + c.pendingAdd.length, 0),
    },
    null,
    2,
  ),
);
