/**
 * Stage S2: add 12 A-level reviewed clusters + lessons.
 * Quality gate mirrors gre-humor-promote-reviewed.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const lessonDir = path.join(humorDir, "lessons");
const gre = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/gre-vocabulary.json"), "utf8"),
);
const vocabMap = new Map();
for (const letter of gre.letters || []) {
  for (const w of letter.words || []) {
    vocabMap.set(String(w.en || "").toLowerCase(), w);
  }
}

// existing headwords to avoid dup primary membership
const existing = new Set();
for (const f of fs.readdirSync(clusterDir).filter((x) => x.endsWith(".json"))) {
  const c = JSON.parse(fs.readFileSync(path.join(clusterDir, f), "utf8"));
  for (const m of c.members || []) existing.add(m.headword);
}

function card(headword, opts) {
  const key = headword.toLowerCase();
  const v = vocabMap.get(key);
  return {
    headword: key,
    inVocab: Boolean(v),
    senseAnchor: opts.senseAnchor || v?.endef || opts.zhGloss,
    roleInScript: opts.roleInScript,
    humorDevice: opts.humorDevice || "morphology",
    zhGloss: opts.zhGloss,
    speakLineEn: opts.speakLineEn,
    speakLineZh: opts.speakLineZh,
    related: {
      synonyms: v?.synonyms || opts.synonyms || "",
      antonyms: v?.antonyms || opts.antonyms || "",
    },
  };
}

const SEASON = {
  rhyme: { id: 1, titleZh: "押韻派對", titleEn: "Rhyme Party" },
  root: { id: 2, titleZh: "字根劇場", titleEn: "Root Theater" },
  semantic: { id: 3, titleZh: "語氣對打", titleEn: "Tone Duels" },
  lookalike: { id: 3, titleZh: "語氣對打", titleEn: "Tone Duels" },
};

const NEW = [
  {
    id: "root-vert-01",
    type: "root",
    elementLemma: "vert/vers",
    titleZh: "vert／vers｜轉彎人生操作台",
    titleEn: "Turntable of vert/vers",
    hook: "字根 vert/vers＝轉——人生遙控器專管轉向。",
    script:
      "風向一變就 divert 轉向；危險來了趕緊 avert 轉開。政策 revert 轉回舊制，野心家想 subvert 從底下推翻。性格 perverse 老愛反著轉；世界觀是宇宙的 universe，一封信是寫給你的 verse 轉過來的詩行。",
    reviewHooks: [
      "vert＝轉：divert 轉開、avert 避開、revert 轉回、subvert 底下翻轉",
      "perverse＝故意反著來；universe＝轉成一整體的世界",
    ],
    pitfalls: [
      "avert（轉開／避免）≠ advert（注意／廣告相關）",
      "subvert 是顛覆體制，不是單純『轉個彎』",
    ],
    members: [
      card("divert", { zhGloss: "使轉向；轉移注意力；娛樂", roleInScript: "把方向轉開", speakLineEn: "The anecdote diverted attention from the weak premise.", speakLineZh: "這則軼事把注意力從薄弱前提轉開。" }),
      card("avert", { zhGloss: "避免；轉開（目光／災難）", roleInScript: "轉開危險", speakLineEn: "Early warnings helped avert a larger crisis.", speakLineZh: "早期預警協助避免了更大危機。" }),
      card("revert", { zhGloss: "回復；恢復原狀", roleInScript: "轉回舊設定", speakLineEn: "Without oversight, practices may revert to old habits.", speakLineZh: "缺少監督時，做法可能轉回舊習慣。" }),
      card("subvert", { zhGloss: "顛覆；暗中破壞", roleInScript: "從底下翻轉體制", speakLineEn: "Satire can subvert official narratives without direct attack.", speakLineZh: "諷刺能在不直接攻擊下顛覆官方敘事。" }),
      card("perverse", { zhGloss: "乖戾的；故意作對的", roleInScript: "反著轉的性格", speakLineEn: "A perverse reading ignores the plain sense of the text.", speakLineZh: "乖戾的解讀會忽略文本的平白意思。" }),
      card("universe", { zhGloss: "宇宙；領域全體", roleInScript: "轉成一整個世界", humorDevice: "story", speakLineEn: "The study claims validity across a broad universe of cases.", speakLineZh: "該研究宣稱在廣泛案例宇宙中皆有效。" }),
      card("versatile", { zhGloss: "多才多藝的；用途多的", roleInScript: "能到處轉的人／工具", speakLineEn: "A versatile method travels across disciplines.", speakLineZh: "多用途方法能跨領域旅行。" }),
      card("adverse", { zhGloss: "不利的；有害的", roleInScript: "轉過來擋你的風", humorDevice: "lookalike", speakLineEn: "Adverse incentives warped the reporting.", speakLineZh: "不利的誘因扭曲了通報。" }),
      card("anniversary", { zhGloss: "週年紀念", roleInScript: "年份轉了一圈", humorDevice: "story", speakLineEn: "The anniversary essay revisited the founding debate.", speakLineZh: "週年紀念文重訪了創立時的辯論。" }),
      card("controversy", { zhGloss: "爭議", roleInScript: "意見轉來轉去打結", speakLineEn: "The controversy turned on how to define harm.", speakLineZh: "爭議聚焦在如何定義傷害。" }),
      card("introvert", { zhGloss: "內向者；使內轉", roleInScript: "能量往內轉", humorDevice: "story", speakLineEn: "An introvert may still lead through careful writing.", speakLineZh: "內向者仍可透過審慎寫作領導。" }),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "To prevent a disaster by turning it aside is to:", promptZh: "把災難轉開以避免，是：", choices: ["subvert", "avert", "revert", "divert for fun only"], answer: "avert" },
      { id: "q2", type: "sense", promptEn: "To undermine a system from within is to:", promptZh: "從內部顛覆體制，是：", choices: ["avert", "revert", "subvert", "anniversary"], answer: "subvert" },
      { id: "q3", type: "lookalike", promptEn: "adverse (harmful) is closest to:", promptZh: "adverse（不利的）最接近：", choices: ["averse only", "harmful / unfavorable", "advertise", "reverse"], answer: "harmful / unfavorable" },
    ],
  },
  {
    id: "root-voc-01",
    type: "root",
    elementLemma: "voc/vok",
    titleZh: "voc／vok｜呼叫中心",
    titleEn: "Call Center of voc/vok",
    hook: "字根 voc/vok＝呼、叫——整棟樓都是對講機。",
    script:
      "你 invoke 呼叫權威來站台；對手 provoke 挑釁你出聲。會議 convoke 把人召來，權利被 revoke 撤銷就消音。vocabulary 是你的詞彙武器庫，vocal 是出聲音的；equivocal 一句話兩種叫聲，univocal 只有一種意思。",
    reviewHooks: [
      "voc＝叫：invoke 请来、provoke 激怒出聲、convoke 召開、revoke 撤聲／撤權",
      "equivocal 模稜兩可 ↔ univocal 單一明確",
    ],
    pitfalls: [
      "invoke（援引／祈求）≠ evoke（喚起情感）——evoke 已在 rhyme-eak 族",
      "revoke 與 evoke 尾韻像，方向相反：收回 vs 喚起",
    ],
    members: [
      card("invoke", { zhGloss: "援引；祈求；啟用", roleInScript: "呼叫權威", speakLineEn: "The brief invokes precedent from earlier rulings.", speakLineZh: "訴狀援引了先前裁定作為先例。" }),
      card("provoke", { zhGloss: "激怒；激起", roleInScript: "挑釁出聲", speakLineEn: "The remark was meant to provoke a reaction, not illuminate.", speakLineZh: "那句話意在激起反應，而非澄清。" }),
      card("convoke", { zhGloss: "召集（會議）", roleInScript: "把人召來", speakLineEn: "Leaders convoked an emergency panel.", speakLineZh: "領導人召集了緊急小組。" }),
      card("avocation", { zhGloss: "副業；嗜好（呼叫你離開正職的事）", roleInScript: "把你從正職叫走的嗜好", humorDevice: "story", speakLineEn: "Poetry remained his avocation, not his livelihood.", speakLineZh: "詩仍是他的副業嗜好，不是生計。" }),
      card("vocabulary", { zhGloss: "詞彙", roleInScript: "可呼叫的詞庫", humorDevice: "story", speakLineEn: "A precise vocabulary reduces equivocation.", speakLineZh: "精確詞彙能減少模稜兩可。" }),
      card("vocal", { zhGloss: "聲音的；直言的", roleInScript: "出聲的", speakLineEn: "Vocal critics forced a policy rewrite.", speakLineZh: "直言批評者迫使政策重寫。" }),
      card("equivocal", { zhGloss: "模稜兩可的", roleInScript: "一句兩種叫聲", speakLineEn: "An equivocal answer delayed the decision.", speakLineZh: "模稜兩可的回答拖延了決定。" }),
      card("univocal", { zhGloss: "單義的；明確的", roleInScript: "只有一種叫聲", speakLineEn: "The statute is rarely univocal in application.", speakLineZh: "法條在適用上很少是單義明確的。" }),
      card("advocate", { zhGloss: "提倡；辯護者", roleInScript: "替人出聲", speakLineEn: "She advocates transparent peer review.", speakLineZh: "她提倡透明的同儕審查。" }),
      card("vociferous", { zhGloss: "喊叫的；喧嘩的", roleInScript: "超大聲呼叫", speakLineEn: "Vociferous objections filled the hearing.", speakLineZh: "喧嘩反對聲充滿聽證會。" }),
      card("irrevocable", { zhGloss: "不可撤銷的", roleInScript: "叫聲收不回去", speakLineEn: "The resignation was framed as irrevocable.", speakLineZh: "辭呈被定性為不可撤銷。" }),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "To cite authority in support is to:", promptZh: "援引權威來支持，是：", choices: ["provoke", "invoke", "convoke", "vocalize only"], answer: "invoke" },
      { id: "q2", type: "sense", promptEn: "Ambiguous in meaning:", promptZh: "意思模稜兩可：", choices: ["univocal", "equivocal", "vociferous", "advocate"], answer: "equivocal" },
      { id: "q3", type: "sense", promptEn: "Cannot be undone or withdrawn:", promptZh: "無法撤銷：", choices: ["avocation", "irrevocable", "vocal", "provoke"], answer: "irrevocable" },
    ],
  },
  {
    id: "root-mit-01",
    type: "root",
    elementLemma: "mit/miss",
    titleZh: "mit／miss｜快遞與派遣局",
    titleEn: "Dispatch Desk of mit/miss",
    hook: "字根 mit/miss＝送、放——一切都是快遞單。",
    script:
      "信號 transmit 送出去；員工被 dismiss 送走。責任 remiss 是該送卻沒送到；密使是 emissary。permit 放行，submit 呈送上去，intermittent 送一下停一下。mission 是被派出去的任務，missile 是被送出去的武器。",
    reviewHooks: [
      "mit＝送：transmit 傳送、dismiss 打發走、submit 呈上、permit 放行",
      "remiss＝該做沒做（快遞丟件）；intermittent＝斷斷續續送",
    ],
    pitfalls: [
      "emit（發出）與 omit（省略）只差一字母——本族先主打 mit/miss 派遣義",
      "dismiss 可指解雇或『不予考慮』",
    ],
    members: [
      card("transmit", { zhGloss: "傳送；傳播", roleInScript: "把訊號送出", speakLineEn: "Rumors transmit faster than corrections.", speakLineZh: "謠言比澄清傳得更快。" }),
      card("dismiss", { zhGloss: "解雇；打發；不予考慮", roleInScript: "把人／想法送走", speakLineEn: "Do not dismiss anomalous data too quickly.", speakLineZh: "不要太快把異常資料打發掉。" }),
      card("remiss", { zhGloss: "疏忽的；怠慢的", roleInScript: "該送沒送到", speakLineEn: "It would be remiss to ignore conflicting studies.", speakLineZh: "忽略互相衝突的研究會是疏忽。" }),
      card("emissary", { zhGloss: "使者；密使", roleInScript: "被送出去的人", speakLineEn: "An emissary carried the compromise proposal.", speakLineZh: "一名密使帶著妥協方案。" }),
      card("permit", { zhGloss: "允許；許可證", roleInScript: "放行章", speakLineEn: "The design does not permit causal claims.", speakLineZh: "該設計不允許做出因果宣稱。" }),
      card("submit", { zhGloss: "提交；屈服", roleInScript: "呈送上去", speakLineEn: "Authors must submit raw data upon request.", speakLineZh: "作者必須在要求時提交原始資料。" }),
      card("intermittent", { zhGloss: "間歇的；斷續的", roleInScript: "送一下停一下", speakLineEn: "Intermittent funding stalled the longitudinal design.", speakLineZh: "斷續經費讓縱貫設計停擺。" }),
      card("mission", { zhGloss: "任務；使命", roleInScript: "被派出的任務", humorDevice: "story", speakLineEn: "The mission of the review is synthesis, not discovery.", speakLineZh: "該評論的使命是綜整，不是發現。" }),
      card("missive", { zhGloss: "公文；書信", roleInScript: "送出的信件", speakLineEn: "A terse missive ended the collaboration.", speakLineZh: "一封簡短書信結束了合作。" }),
      card("admissible", { zhGloss: "可採納的（證據等）", roleInScript: "允許被送進法庭／論證", speakLineEn: "Only admissible evidence should shape the verdict.", speakLineZh: "只有可採納證據才應影響裁決。" }),
      card("omission", { zhGloss: "遺漏；省略", roleInScript: "該送卻沒放進包裹", humorDevice: "lookalike", speakLineEn: "The omission of a control group weakens inference.", speakLineZh: "遺漏對照組削弱了推論。" }),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Negligent about a duty:", promptZh: "對職責怠慢疏忽：", choices: ["remiss", "missive", "transmit", "mission"], answer: "remiss" },
      { id: "q2", type: "sense", promptEn: "Starting and stopping repeatedly:", promptZh: "反覆開始又停止：", choices: ["admissible", "intermittent", "emissary", "submit"], answer: "intermittent" },
      { id: "q3", type: "sense", promptEn: "A messenger sent on a task:", promptZh: "被派出去辦事的使者：", choices: ["omission", "emissary", "permit", "dismiss"], answer: "emissary" },
    ],
  },
  {
    id: "root-duc-01",
    type: "root",
    elementLemma: "duc/duct",
    titleZh: "duc／duct｜導遊與導管",
    titleEn: "Guides and Ducts",
    hook: "字根 duc/duct＝引導——要嘛當導遊，要嘛當水管。",
    script:
      "好領導 conduct 引導團隊；證據 induce 引導你得出結論，邏輯 deduce 往下推導。壞人 abduct 把人拐走；教育 educate 把人往知識引導。aqueduct 引水，viaduct 引路跨谷；deduction 是推導或扣除。",
    reviewHooks: [
      "duc＝引：conduct 帶領、induce 引出、deduce 推導、abduct 拐走",
      "educate＝把人引出無知；aqueduct＝引水之管",
    ],
    pitfalls: [
      "induce（歸納／引起）與 deduce（演繹）方向不同",
      "deduction 雙義：推理扣除／金額扣除",
    ],
    members: [
      card("conduct", { zhGloss: "引導；實施；行為", roleInScript: "帶隊前進", speakLineEn: "How we conduct the interview shapes the answers.", speakLineZh: "我們如何進行訪談會形塑答案。" }),
      card("induce", { zhGloss: "引起；勸誘；歸納", roleInScript: "把結論引出來", speakLineEn: "The stimulus may induce a temporary bias.", speakLineZh: "該刺激可能引起暫時偏差。" }),
      card("deduce", { zhGloss: "演繹；推論", roleInScript: "順著管子往下推", speakLineEn: "From the premises we deduce a narrower claim.", speakLineZh: "由前提我們演繹出更窄的主張。" }),
      card("abduct", { zhGloss: "誘拐；綁架", roleInScript: "把人引走邪路", speakLineEn: "The plot abducts the reader from the main thesis.", speakLineZh: "情節把讀者從主論點拐走。（比喻用法需謹慎）", synonyms: "kidnap" }),
      card("educate", { zhGloss: "教育", roleInScript: "引出無知", humorDevice: "story", speakLineEn: "Public reports should educate without condescending.", speakLineZh: "公開報告應教育讀者而不屈尊俯就。" }),
      card("aqueduct", { zhGloss: "高架引水渠", roleInScript: "引水之管", humorDevice: "story", speakLineEn: "The aqueduct metaphor describes knowledge pipelines.", speakLineZh: "引水渠隱喻用來描述知識管線。" }),
      card("viaduct", { zhGloss: "高架橋", roleInScript: "引路跨過山谷", humorDevice: "story", speakLineEn: "A viaduct of citations connected distant fields.", speakLineZh: "一座引文高架橋連接了遙遠領域。" }),
      card("deduction", { zhGloss: "推論；扣除", roleInScript: "推導產物／扣掉的量", speakLineEn: "The deduction follows only if the premise holds.", speakLineZh: "唯有前提成立，該推論才成立。" }),
      card("seduce", { zhGloss: "引誘；誘惑", roleInScript: "引向慾望", speakLineEn: "Elegant prose can seduce readers past weak evidence.", speakLineZh: "優美文筆可能誘使讀者略過薄弱證據。" }),
      card("ductile", { zhGloss: "可塑的；易導引成形的", roleInScript: "可被引導改變形狀", speakLineEn: "Ductile institutions adapt without breaking.", speakLineZh: "具延展性的制度能適應而不破裂。" }),
      card("introduction", { zhGloss: "引言；介紹；導入", roleInScript: "把讀者引進來", humorDevice: "story", speakLineEn: "A clear introduction conducts the reader into the stakes.", speakLineZh: "清楚的引言把讀者引入利害關係。" }),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Reasoning from general premises to a particular conclusion:", promptZh: "由一般前提推到特定結論：", choices: ["induce", "deduce", "seduce", "abduct"], answer: "deduce" },
      { id: "q2", type: "sense", promptEn: "To lead someone astray by temptation:", promptZh: "用誘惑把人引偏：", choices: ["educate", "seduce", "conduct", "viaduct"], answer: "seduce" },
      { id: "q3", type: "sense", promptEn: "Capable of being drawn into a new shape:", promptZh: "可被拉引改變形狀：", choices: ["ductile", "aqueduct", "deduction", "introduction"], answer: "ductile" },
    ],
  },
  {
    id: "root-spect-01",
    type: "root",
    elementLemma: "spect/spec",
    titleZh: "spect｜監視與觀景台",
    titleEn: "The Observation Deck",
    hook: "字根 spect/spec＝看——到處都是鏡頭與觀景窗。",
    script:
      "檢查員 inspect 仔細看；circumspect 人看一圈才行動。conspicuous 顯眼到隨便看都看到；spectacle 是給人看的大場面。retrospect 往回看，prospect 往前看；despicable 不屑一看，respect 是重新看重。",
    reviewHooks: [
      "spect＝看：inspect 檢視、circumspect 環顧、retrospect 回看、prospect 前瞻",
      "conspicuous＝好看到爆；despicable＝不值得看重",
    ],
    pitfalls: [
      "prospect（前景／prospectus 簡章）不要和 perspective（視角）混用",
      "circumspect＝謹慎，不是『環狀眼鏡』字面玩笑當真",
    ],
    members: [
      card("inspect", { zhGloss: "檢查；審視", roleInScript: "仔細看", speakLineEn: "Peer reviewers inspect methods before results.", speakLineZh: "同儕審查者先審視方法再看結果。" }),
      card("circumspect", { zhGloss: "謹慎的；周密的", roleInScript: "看一圈再走", speakLineEn: "Circumspect claims survive hostile reading.", speakLineZh: "周密的宣稱更能扛住敵意閱讀。" }),
      card("conspicuous", { zhGloss: "顯眼的；引人注目的", roleInScript: "想不看到都難", speakLineEn: "The gap in the data is conspicuous.", speakLineZh: "資料中的缺口非常顯眼。" }),
      card("spectacle", { zhGloss: "景象；壯觀場面", roleInScript: "給人看的大秀", speakLineEn: "Media spectacle can replace sober analysis.", speakLineZh: "媒體奇觀可能取代冷靜分析。" }),
      card("retrospect", { zhGloss: "回顧", roleInScript: "往回看", speakLineEn: "In retrospect, the warning signs were clear.", speakLineZh: "事後回顧，警訊其實很清楚。" }),
      card("prospect", { zhGloss: "前景；預期；探勘", roleInScript: "往前看", speakLineEn: "The prospect of replication motivated caution.", speakLineZh: "可複現的前景促使人們謹慎。" }),
      card("despicable", { zhGloss: "可鄙的", roleInScript: "不屑一看", speakLineEn: "Despicable tactics undermine public trust.", speakLineZh: "可鄙手段破壞公眾信任。" }),
      card("respect", { zhGloss: "尊重；方面", roleInScript: "重新看重", humorDevice: "story", speakLineEn: "In one respect, the critics are right.", speakLineZh: "就某一方面而言，批評者是對的。" }),
      card("spectator", { zhGloss: "旁觀者", roleInScript: "只看不演", speakLineEn: "Democracy suffers when citizens remain spectators.", speakLineZh: "公民若只當旁觀者，民主會受損。" }),
      card("spectrum", { zhGloss: "光譜；範圍", roleInScript: "一眼看見的全範圍", speakLineEn: "Opinions fall across a wide spectrum.", speakLineZh: "意見落在寬廣光譜上。" }),
      card("suspicious", { zhGloss: "可疑的；懷疑的", roleInScript: "看得不太對勁", humorDevice: "story", speakLineEn: "Suspicious patterns warrant a second look.", speakLineZh: "可疑模式值得再看一次。" }),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Careful and unwilling to take risks:", promptZh: "謹慎、不願冒險：", choices: ["conspicuous", "circumspect", "spectacle", "spectator"], answer: "circumspect" },
      { id: "q2", type: "sense", promptEn: "Looking back at the past:", promptZh: "回顧過去：", choices: ["prospect", "retrospect", "inspect", "spectrum"], answer: "retrospect" },
      { id: "q3", type: "sense", promptEn: "Easy to notice; striking:", promptZh: "容易注意到、顯眼：", choices: ["despicable", "conspicuous", "circumspect", "respect"], answer: "conspicuous" },
    ],
  },
  {
    id: "root-ject-01",
    type: "root",
    elementLemma: "ject",
    titleZh: "ject｜投擲訓練場",
    titleEn: "The Throwing Range",
    hook: "字根 ject＝投、擲——想法與物件滿場飛。",
    script:
      "反對就 reject 扔回去；意見 inject 注射進去。計劃 project 向前投射，猜測是 conjecture。eject 彈射出去，subject 被扔在權下，object 扔出異議。abject 被扔到最低處，trajectory 是拋物線軌道。",
    reviewHooks: [
      "ject＝扔：reject 扔回、inject 注入、project 向前投、eject 彈出",
      "conjecture＝一起投出來的猜測；abject＝被扔到最低",
    ],
    pitfalls: [
      "subject 多義：主題／臣民／使遭受——看上下文",
      "project 名詞計畫／動詞投射，詞性要分清",
    ],
    members: [
      card("reject", { zhGloss: "拒絕；駁回", roleInScript: "扔回去", speakLineEn: "Reviewers may reject a paper for design flaws.", speakLineZh: "審查者可能因設計缺陷駁回論文。" }),
      card("inject", { zhGloss: "注入；插話", roleInScript: "射進去", speakLineEn: "Inject one clarifying example into the paragraph.", speakLineZh: "在段落中注入一個澄清例子。" }),
      card("project", { zhGloss: "投射；規劃；項目", roleInScript: "向前扔出計畫", speakLineEn: "Do not project motives without evidence.", speakLineZh: "沒有證據就不要投射動機。" }),
      card("conjecture", { zhGloss: "推測；臆測", roleInScript: "把猜測投進場", speakLineEn: "The conclusion is still conjecture, not proof.", speakLineZh: "結論仍是臆測，不是證明。" }),
      card("eject", { zhGloss: "彈出；驅逐", roleInScript: "彈射出去", speakLineEn: "Security ejected disruptors from the hall.", speakLineZh: "保全把搗亂者驅離會場。" }),
      card("subject", { zhGloss: "主題；臣民；使遭受", roleInScript: "被扔在權威之下", speakLineEn: "Subjects were randomly assigned to conditions.", speakLineZh: "受試者被隨機分到各條件。" }),
      card("object", { zhGloss: "反對；物體；目標", roleInScript: "扔出異議", speakLineEn: "Counsel objected to the leading question.", speakLineZh: "律師對誘導性問題提出異議。" }),
      card("abject", { zhGloss: "悲慘的；下流的；徹底的（貶）", roleInScript: "被扔到最低處", speakLineEn: "Abject failure forced a redesign of the study.", speakLineZh: "徹底慘敗迫使研究重新設計。" }),
      card("trajectory", { zhGloss: "軌道；軌跡", roleInScript: "扔出去的路徑", speakLineEn: "Career trajectory is not destiny.", speakLineZh: "職涯軌跡不是命運。" }),
      card("interject", { zhGloss: "突然插話", roleInScript: "中途扔一句進去", speakLineEn: "Please do not interject until the claim is finished.", speakLineZh: "請等論點說完再插話。" }),
      card("projectile", { zhGloss: "拋射物", roleInScript: "被扔出去的東西", humorDevice: "story", speakLineEn: "A metaphor can become a rhetorical projectile.", speakLineZh: "隱喻可能變成修辭拋射物。" }),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "An educated guess without firm proof:", promptZh: "沒有堅實證據的推測：", choices: ["trajectory", "conjecture", "eject", "projectile"], answer: "conjecture" },
      { id: "q2", type: "sense", promptEn: "Miserable or utterly degrading:", promptZh: "悲慘或徹底卑下：", choices: ["abject", "object", "inject", "project"], answer: "abject" },
      { id: "q3", type: "sense", promptEn: "To throw a remark into a conversation:", promptZh: "突然插入一句話：", choices: ["reject", "interject", "subject", "eject"], answer: "interject" },
    ],
  },
  {
    id: "root-rupt-01",
    type: "root",
    elementLemma: "rupt",
    titleZh: "rupt｜破裂維修課",
    titleEn: "Breakage Workshop",
    hook: "字根 rupt＝破——哪裡一響，哪裡就裂。",
    script:
      "談判 abrupt 突然中斷；制度 corrupt 從內部破爛。抗議 disrupt 打亂秩序，火山 erupt 噴出。bankrupt 破產，rupture 是裂口；interrupt 从中打斷，irrupt 衝破闖入。",
    reviewHooks: [
      "rupt＝破：abrupt 驟斷、corrupt 內爛、disrupt 打亂、erupt 噴出",
      "bankrupt＝銀行／帳面破裂；rupture＝裂口本身",
    ],
    pitfalls: [
      "abrupt 指突然，不一定負面，但常帶生硬感",
      "corrupt 可作形容詞或動詞",
    ],
    members: [
      card("abrupt", { zhGloss: "突然的；唐突的", roleInScript: "突然裂開／中斷", speakLineEn: "An abrupt transition confused the audience.", speakLineZh: "突然的轉折讓聽眾困惑。" }),
      card("corrupt", { zhGloss: "腐敗的；使敗壞", roleInScript: "從內部破爛", speakLineEn: "Corrupt incentives distort measurement.", speakLineZh: "腐敗誘因扭曲測量。" }),
      card("disrupt", { zhGloss: "擾亂；使中斷", roleInScript: "把秩序打破", speakLineEn: "New tools disrupt old workflows—and old hierarchies.", speakLineZh: "新工具擾亂舊流程——以及舊階層。" }),
      card("erupt", { zhGloss: "爆發；噴出", roleInScript: "從裂口噴出", speakLineEn: "Controversy erupted after the leak.", speakLineZh: "洩漏後爭議爆發。" }),
      card("bankrupt", { zhGloss: "破產的；完全缺乏的", roleInScript: "帳面破裂", speakLineEn: "The theory is morally bankrupt if it excuses harm.", speakLineZh: "若為傷害開脫，該理論在道德上已破產。" }),
      card("rupture", { zhGloss: "破裂；裂口", roleInScript: "裂縫本體", speakLineEn: "A rupture between method and claim is fatal.", speakLineZh: "方法與主張之間的裂口是致命的。" }),
      card("interrupt", { zhGloss: "打斷", roleInScript: "从中間弄破話流", speakLineEn: "Please do not interrupt the operational definition.", speakLineZh: "請不要打斷操作型定義。" }),
      card("irruption", { zhGloss: "突然侵入；湧入", roleInScript: "衝破闖入", speakLineEn: "An irruption of cases overwhelmed the clinic model.", speakLineZh: "病例突然湧入壓垮了診所模型。" }),
      card("eruption", { zhGloss: "爆發；噴發", roleInScript: "噴發事件", speakLineEn: "The eruption of outrage was predictable.", speakLineZh: "憤怒的爆發其實可預期。" }),
      card("corruption", { zhGloss: "腐敗；損壞", roleInScript: "破爛的狀態", speakLineEn: "Data corruption invalidated the third trial.", speakLineZh: "資料損壞使第三次試驗無效。" }),
      card("disruptive", { zhGloss: "破壞性的；顛覆式的", roleInScript: "專門製造破裂的", speakLineEn: "Disruptive claims need stronger evidence, not louder ads.", speakLineZh: "顛覆式宣稱需要更強證據，而非更大聲廣告。" }),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Sudden and unexpected:", promptZh: "突然且出人意料：", choices: ["corrupt", "abrupt", "bankrupt", "rupture"], answer: "abrupt" },
      { id: "q2", type: "sense", promptEn: "To break the normal flow or system:", promptZh: "打斷正常流程或系統：", choices: ["disrupt", "erupt only lava", "respect", "inspect"], answer: "disrupt" },
      { id: "q3", type: "sense", promptEn: "A break or tear:", promptZh: "裂口／破裂：", choices: ["rupture", "interrupt politely", "prospect", "inject"], answer: "rupture" },
    ],
  },
  {
    id: "root-cred-01",
    type: "root",
    elementLemma: "cred",
    titleZh: "cred｜信用櫃台",
    titleEn: "The Credit Counter",
    hook: "字根 cred＝信——這裡只收『可信度』當貨幣。",
    script:
      "說法要 credible 才收得進；credulous 人什麼都信，incredulous 人怎麼都不信。credential 是信用證件，credit 是信用額度。credence 是給予相信，credo 是信條；discredit 讓人失去信用。",
    reviewHooks: [
      "cred＝信：credible 可信、credulous 輕信、incredulous 不信、discredit 抹黑失信",
      "credential＝證明你可信的證件；credo＝你信什麼",
    ],
    pitfalls: [
      "incredible（難以置信的事物）vs incredulous（不肯信的人）——易混",
      "credulous 是貶義居多：太好騙",
    ],
    members: [
      card("credible", { zhGloss: "可信的", roleInScript: "櫃台收得下的說法", speakLineEn: "A credible mechanism explains the effect size.", speakLineZh: "可信的機制能解釋效應量。" }),
      card("credulous", { zhGloss: "輕信的", roleInScript: "什麼都蓋章相信", speakLineEn: "Credulous readers amplify weak studies.", speakLineZh: "輕信的讀者會放大薄弱研究。" }),
      card("incredulous", { zhGloss: "懷疑的；不相信的", roleInScript: "櫃台拒收", speakLineEn: "Experts remained incredulous about the miracle cure.", speakLineZh: "專家對奇蹟療法仍表懷疑。" }),
      card("credential", { zhGloss: "資格證件；憑證", roleInScript: "信用會員卡", speakLineEn: "Credentials do not replace transparent methods.", speakLineZh: "資格證件不能取代透明方法。" }),
      card("credit", { zhGloss: "信用；讚譽；學分", roleInScript: "信用額度", speakLineEn: "Give credit to prior work you build on.", speakLineZh: "對你所延續的先前研究要給予讚譽／歸功。" }),
      card("credence", { zhGloss: "相信；信任", roleInScript: "給予相信", speakLineEn: "The finding gained credence after replication.", speakLineZh: "該發現在複現後獲得信任。" }),
      card("credo", { zhGloss: "信條", roleInScript: "櫃台背後的信仰海報", speakLineEn: "Open data became the lab’s credo.", speakLineZh: "開放資料成了該實驗室的信條。" }),
      card("discredit", { zhGloss: "使喪失信用", roleInScript: "把信用撤銷", speakLineEn: "Selective leaks aimed to discredit the committee.", speakLineZh: "選擇性洩密旨在使委員會喪失信用。" }),
      card("accredited", { zhGloss: "經認證的", roleInScript: "官方蓋過信用章", speakLineEn: "Only accredited labs may process the samples.", speakLineZh: "唯有經認證實驗室可處理樣本。" }),
      card("credibility", { zhGloss: "可信度", roleInScript: "信用分數", speakLineEn: "Credibility erodes when errors go uncorrected.", speakLineZh: "錯誤不更正，可信度就侵蝕。" }),
      card("incredible", { zhGloss: "難以置信的", roleInScript: "超出櫃台想像", humorDevice: "lookalike", speakLineEn: "Incredible claims require extraordinary evidence.", speakLineZh: "難以置信的宣稱需要非凡證據。" }),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "A person who refuses to believe is:", promptZh: "不肯相信的人是：", choices: ["incredible", "incredulous", "credulous", "accredited"], answer: "incredulous" },
      { id: "q2", type: "sense", promptEn: "Too ready to believe:", promptZh: "太容易相信：", choices: ["credulous", "credible", "discredit", "credo"], answer: "credulous" },
      { id: "q3", type: "sense", promptEn: "To damage someone’s reputation for truth:", promptZh: "損害某人的可信聲譽：", choices: ["credit", "discredit", "credence", "credential"], answer: "discredit" },
    ],
  },
  {
    id: "root-path-01",
    type: "root",
    elementLemma: "path",
    titleZh: "path｜情感診所",
    titleEn: "The Feeling Clinic",
    hook: "字根 path＝感、受苦——診所專治『感不感得到』。",
    script:
      "apathy 是掛號也不想感；empathy 能感同身受，sympathy 隔床安慰。pathos 是催淚橋段，pathetic 可憐到讓人感嘆。antipathy 天生反感，pathogen 讓身體受苦的病原；homeopathy 等療法名也帶 path，但考試先抓住『感／病』核心。",
    reviewHooks: [
      "path＝感／苦：apathy 無感、empathy 同感、sympathy 同情、antipathy 反感",
      "pathos＝悲劇感染力；pathogen＝致病者",
    ],
    pitfalls: [
      "empathy（代入感受）vs sympathy（同情／憐憫）層次不同",
      "pathetic 口語常貶，學術上也可指『引發悲憫』",
    ],
    members: [
      card("apathy", { zhGloss: "冷漠；無興趣", roleInScript: "完全不想感", speakLineEn: "Voter apathy can mute even strong reforms.", speakLineZh: "選民冷漠能使再強的改革也消音。" }),
      card("empathy", { zhGloss: "同理心；感同身受", roleInScript: "把對方的感受接進來", speakLineEn: "Empathy aids interviewing but does not replace coding rules.", speakLineZh: "同理心有助訪談，但不能取代編碼規則。" }),
      card("sympathy", { zhGloss: "同情；同感", roleInScript: "隔床安慰", speakLineEn: "Sympathy alone cannot allocate scarce beds.", speakLineZh: "單靠同情無法分配稀缺床位。" }),
      card("pathos", { zhGloss: "悲愴力；同情的感染", roleInScript: "催淚處方", speakLineEn: "The speech relied more on pathos than on proof.", speakLineZh: "演說更依賴悲愴感染而非證據。" }),
      card("pathetic", { zhGloss: "可憐的；無力的（常貶）", roleInScript: "感嘆其弱", speakLineEn: "A pathetic sample size cannot support the claim.", speakLineZh: "可憐的樣本數支撐不起該主張。" }),
      card("antipathy", { zhGloss: "反感；憎惡", roleInScript: "天生排斥感", speakLineEn: "Mutual antipathy stalled coalition talks.", speakLineZh: "相互反感讓聯盟談判停滯。" }),
      card("pathogen", { zhGloss: "病原體", roleInScript: "讓身體受苦的東西", humorDevice: "story", speakLineEn: "The model treats misinformation like a pathogen.", speakLineZh: "該模型把錯誤訊息當成病原體。" }),
      card("pathology", { zhGloss: "病理；病態", roleInScript: "研究苦難的學科", speakLineEn: "Organizational pathology showed up as chronic delay.", speakLineZh: "組織病態表現為長期拖延。" }),
      card("telepathy", { zhGloss: "心靈感應", roleInScript: "遠距感覺（多比喻）", humorDevice: "story", speakLineEn: "Good editors are not telepathic; mark your claims.", speakLineZh: "好編輯不是心靈感應——請標明你的主張。" }),
      card("sociopath", { zhGloss: "反社會人格者（通俗用法）", roleInScript: "社會情感電路故障", humorDevice: "story", speakLineEn: "Popular media overuses “sociopath” as a slur.", speakLineZh: "大眾媒體過度把「sociopath」當罵人用語。" }),
      card("homeopathy", { zhGloss: "順勢療法（名含 path；考構詞辨識）", roleInScript: "診所裡的療法招牌", humorDevice: "story", speakLineEn: "Etymology explains -pathy in homeopathy, but efficacy is a separate claim.", speakLineZh: "字源能解釋 homeopathy 裡的 -pathy，但療效是另一個命題。" }),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Lack of interest or emotion:", promptZh: "缺乏興趣或情感：", choices: ["empathy", "apathy", "pathos", "sympathy"], answer: "apathy" },
      { id: "q2", type: "contrast", promptEn: "Sharing another’s feelings from inside is closer to:", promptZh: "從內部分享他人感受，更接近：", choices: ["sympathy as pity only", "empathy", "antipathy", "pathogen"], answer: "empathy" },
      { id: "q3", type: "sense", promptEn: "A strong feeling of dislike:", promptZh: "強烈反感：", choices: ["antipathy", "apathy", "telepathy", "pathy"], answer: "antipathy" },
    ],
  },
  {
    id: "root-gress-01",
    type: "root",
    elementLemma: "grad/gress",
    titleZh: "gress｜步伐競技場",
    titleEn: "The Pace Arena",
    hook: "字根 grad/gress＝走、步——誰進步誰退步看腳步。",
    script:
      "社會要 progress 向前走；失敗就 regress 退步。aggressive 人步步進逼，digress 演講走歪路。congress 走到一起開會；egress 是出口那一步。grade 是階梯等級，gradual 一步一步。",
    reviewHooks: [
      "gress＝走：progress 前進、regress 後退、digress 離題走、aggressive 進逼",
      "congress＝走到一起；egress＝走出去",
    ],
    pitfalls: [
      "digress（離題）不是 digressive 就一定壞——有時是風格，但考試常標『偏離主線』",
      "aggressive 中性可指積極，語境常帶攻擊性",
    ],
    members: [
      card("progress", { zhGloss: "進步；前進", roleInScript: "向前走", speakLineEn: "Progress requires measurable milestones.", speakLineZh: "進步需要可測量的里程碑。" }),
      card("regress", { zhGloss: "退步；回歸", roleInScript: "往回走", speakLineEn: "Under stress, teams may regress to safer routines.", speakLineZh: "壓力下團隊可能退回更安全的例行做法。" }),
      card("aggressive", { zhGloss: "侵略的；積極進取的", roleInScript: "步步進逼", speakLineEn: "Aggressive coding can introduce new bugs.", speakLineZh: "過度積極的編碼可能引入新錯誤。" }),
      card("digress", { zhGloss: "離題", roleInScript: "走到旁邊小路", speakLineEn: "Let me digress briefly, then return to the claim.", speakLineZh: "容我短暫離題，再回到主張。" }),
      card("congress", { zhGloss: "國會；代表大會", roleInScript: "走到一起", humorDevice: "story", speakLineEn: "The congress of specialists produced a joint statement.", speakLineZh: "專家大會產出了聯合聲明。" }),
      card("egress", { zhGloss: "出口；外出", roleInScript: "走出去的口", speakLineEn: "Clear egress routes are part of lab safety.", speakLineZh: "清楚的出口動線是實驗室安全的一部分。" }),
      card("grade", { zhGloss: "等級；坡度；評分", roleInScript: "一步一階", humorDevice: "story", speakLineEn: "We grade evidence by design quality, not by hype.", speakLineZh: "我們依設計品質評分證據，而非依炒作。" }),
      card("gradual", { zhGloss: "逐漸的", roleInScript: "一步一步", speakLineEn: "Change was gradual rather than revolutionary.", speakLineZh: "改變是逐漸的，而非革命性的。" }),
      card("degrade", { zhGloss: "降級；貶低；降解", roleInScript: "往下走階梯", speakLineEn: "Noise can degrade signal quality.", speakLineZh: "噪音會降低訊號品質。" }),
      card("retrograde", { zhGloss: "倒退的；逆向的", roleInScript: "倒著走", speakLineEn: "The policy looks retrograde by current standards.", speakLineZh: "以現行標準看，該政策顯得倒退。" }),
      card("transgress", { zhGloss: "逾越；違反", roleInScript: "跨過不該走的線", speakLineEn: "To transgress the protocol voids the trial.", speakLineZh: "逾越協議會使試驗無效。" }),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "To wander from the main topic:", promptZh: "偏離主題：", choices: ["progress", "digress", "egress", "grade"], answer: "digress" },
      { id: "q2", type: "sense", promptEn: "To violate a boundary or rule:", promptZh: "逾越界線或規則：", choices: ["transgress", "congress", "gradual", "egress"], answer: "transgress" },
      { id: "q3", type: "sense", promptEn: "Moving backward; reactionary:", promptZh: "倒退的：", choices: ["retrograde", "progress", "aggressive", "inject"], answer: "retrograde" },
    ],
  },
  {
    id: "root-ced-01",
    type: "root",
    elementLemma: "ced/ceed/cess",
    titleZh: "ced／ceed／cess｜進退讓步道",
    titleEn: "The Yielding Walkway",
    hook: "字根 ced/ceed/cess＝走、讓——誰先走、誰讓路。",
    script:
      "前輩 precede 走在前面；會議 proceed 繼續往前走。對手 recede 後退，你才 access 進入。調人 intercede 走到中間說情，硬派 secede 退出聯盟；excess 走過頭，process 是一整段行走流程。",
    reviewHooks: [
      "ced＝走／讓：precede 先前走、proceed 繼續走、recede 後退、intercede 介入調停",
      "secede＝退出；access＝走得進去；excess＝走過頭",
    ],
    pitfalls: [
      "precede（在前）vs proceed（繼續）最易混",
      "concede（讓步承認）已在 look-a-01；本族改練 intercede／secede",
    ],
    members: [
      card("precede", { zhGloss: "先於；領先", roleInScript: "走在前面", speakLineEn: "Definitions should precede measurement choices.", speakLineZh: "定義應先於測量選擇。" }),
      card("proceed", { zhGloss: "繼續進行", roleInScript: "接著往前走", speakLineEn: "We may proceed only after consent is recorded.", speakLineZh: "唯有記錄同意後才可繼續。" }),
      card("recede", { zhGloss: "後退；減退", roleInScript: "往後退開", speakLineEn: "As noise recedes, the signal becomes clearer.", speakLineZh: "噪音減退後，訊號更清楚。" }),
      card("access", { zhGloss: "進入；使用權", roleInScript: "走得進去", speakLineEn: "Unequal access skews who appears in the sample.", speakLineZh: "不均等的進入權扭曲了樣本組成。" }),
      card("intercede", { zhGloss: "調停；說情介入", roleInScript: "走到中間幫人求情", speakLineEn: "A mediator interceded before talks collapsed.", speakLineZh: "調停者在談判崩盤前介入說情。" }),
      card("secede", { zhGloss: "退出；分離", roleInScript: "走出聯盟", speakLineEn: "A faction threatened to secede from the coalition.", speakLineZh: "某派系威脅退出聯盟。" }),
      card("excess", { zhGloss: "過度；過量", roleInScript: "走過頭", speakLineEn: "Excess confidence mimics competence.", speakLineZh: "過度自信模仿了能力。" }),
      card("process", { zhGloss: "過程；處理", roleInScript: "行走的整段流程", humorDevice: "story", speakLineEn: "Name the process before you name the outcome.", speakLineZh: "先說清過程，再說結果。" }),
      card("ancestor", { zhGloss: "祖先", roleInScript: "更早就走在前面的人", humorDevice: "story", speakLineEn: "Intellectual ancestors shape today’s categories.", speakLineZh: "思想祖先形塑了今日的範疇。" }),
      card("predecessor", { zhGloss: "前任；前身", roleInScript: "位置上的前一位", speakLineEn: "Our method improves on its predecessor.", speakLineZh: "我們的方法改進了其前身。" }),
      card("unprecedented", { zhGloss: "前所未有的", roleInScript: "前面沒人走過", speakLineEn: "Unprecedented scale requires new safeguards.", speakLineZh: "前所未有的規模需要新防護。" }),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Come before in time vs continue forward:", promptZh: "時間上在前 vs 繼續向前：", choices: ["precede / proceed", "proceed / precede", "recede / access", "secede / concede"], answer: "precede / proceed" },
      { id: "q2", type: "sense", promptEn: "To withdraw from a union:", promptZh: "退出聯盟：", choices: ["secede", "intercede", "precede", "excess"], answer: "secede" },
      { id: "q3", type: "sense", promptEn: "Never done or known before:", promptZh: "前所未有：", choices: ["unprecedented", "predecessor", "ancestor", "process"], answer: "unprecedented" },
    ],
  },
  {
    id: "root-loqu-01",
    type: "root",
    elementLemma: "log/loqu",
    titleZh: "loqu／log｜話術與論理雙演廳",
    titleEn: "Talk & Logos Stage",
    hook: "loqu＝說，log＝理／言——一邊開口，一邊要講道理。",
    script:
      "eloquent 人把話說漂亮；colloquial 是巷口聊天腔。soliloquy 獨角戲自言自語；grandiloquent 說話浮誇。logic 要合理，analogy 用類比說話；eulogy 說好話送別，prologue 開場先說。",
    reviewHooks: [
      "loqu＝說：eloquent 善說、colloquial 俗說、soliloquy 自說、grandiloquent 誇說",
      "log＝理／言：logic 論理、analogy 類比言、eulogy 讚詞、prologue 前言",
    ],
    pitfalls: [
      "與 sem-talk-01（話多／話少）互補：本族重『怎麼說／論理』",
      "eulogy（頌詞）≠ elegy（輓歌）——形近另記",
    ],
    members: [
      card("eloquent", { zhGloss: "雄辯的；有說服力的", roleInScript: "漂亮地說", speakLineEn: "An eloquent summary still needs citations.", speakLineZh: "再雄辯的摘要仍需要引用。" }),
      card("colloquial", { zhGloss: "口語的；通俗的", roleInScript: "巷口腔", speakLineEn: "Colloquial tone can undercut formal claims.", speakLineZh: "口語語氣可能削弱正式主張。" }),
      card("soliloquy", { zhGloss: "獨白", roleInScript: "自己對自己說", speakLineEn: "The chapter reads like a soliloquy, not a dialogue with critics.", speakLineZh: "這章讀起來像獨白，而非與批評者對話。" }),
      card("grandiloquent", { zhGloss: "誇大其詞的", roleInScript: "說得太大聲太空", speakLineEn: "Grandiloquent promises outran the budget.", speakLineZh: "誇大承諾超越了預算。" }),
      card("logic", { zhGloss: "邏輯；道理", roleInScript: "說話要合理", humorDevice: "story", speakLineEn: "Check the logic before polishing the prose.", speakLineZh: "先檢查邏輯，再打磨文筆。" }),
      card("analogy", { zhGloss: "類比", roleInScript: "用相似物來說", speakLineEn: "A strained analogy misleads more than it teaches.", speakLineZh: "牽強類比誤導多於教學。" }),
      card("eulogy", { zhGloss: "頌詞；悼詞（稱頌）", roleInScript: "說好話送別", speakLineEn: "The eulogy praised method as much as results.", speakLineZh: "頌詞對方法與結果同樣稱許。" }),
      card("prologue", { zhGloss: "序言；開場白", roleInScript: "開場先說", speakLineEn: "The prologue frames why the question matters.", speakLineZh: "序言框定了問題為何重要。" }),
      card("loquacity", { zhGloss: "話多；健談（偏多話）", roleInScript: "說個不停的量", speakLineEn: "Loquacity is not the same as clarity.", speakLineZh: "話多不等於清楚。" }),
      card("elocution", { zhGloss: "演說術；發音法", roleInScript: "怎麼把話說出口", speakLineEn: "Elocution cannot rescue a hollow argument.", speakLineZh: "演說技巧救不了空洞論證。" }),
      card("ideology", { zhGloss: "意識形態", roleInScript: "一套說理系統", humorDevice: "story", speakLineEn: "Ideology can script which analogies feel natural.", speakLineZh: "意識形態會編排哪些類比顯得自然。" }),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Conversational rather than formal language:", promptZh: "偏口語而非正式：", choices: ["colloquial", "grandiloquent", "eulogy", "logic"], answer: "colloquial" },
      { id: "q2", type: "sense", promptEn: "A speech of praise, often for the dead:", promptZh: "稱頌的演說（常用于悼念）：", choices: ["prologue", "eulogy", "analogy", "soliloquy"], answer: "eulogy" },
      { id: "q3", type: "sense", promptEn: "Pompous or inflated in speech:", promptZh: "說話浮誇：", choices: ["grandiloquent", "eloquent", "colloquial", "elocution"], answer: "grandiloquent" },
    ],
  },
];

function buildLesson(cluster) {
  const season = SEASON[cluster.type] || SEASON.root;
  return {
    id: `lesson-${cluster.id}`,
    slug: cluster.id,
    season: season.id,
    seasonTitleZh: season.titleZh,
    seasonTitleEn: season.titleEn,
    type: "family",
    minutes: "12-15",
    clusterId: cluster.id,
    titleZh: cluster.titleZh,
    titleEn: cluster.titleEn,
    flow: [
      { step: 1, name: "鉤子", minutes: 0.5, content: cluster.hook },
      { step: 2, name: "串記劇本", minutes: 2, content: cluster.script },
      {
        step: 3,
        name: "詞卡 round",
        minutes: 7,
        content: "依 members 逐詞：義錨 → 劇本角色 → 跟讀 speakLineEn／對照 speakLineZh",
      },
      { step: 4, name: "快測", minutes: 2, content: "見 quiz（3 題）" },
      { step: 5, name: "口令帶走", minutes: 0.5, content: cluster.reviewHooks },
    ],
    quiz: cluster.quiz,
    pitfalls: cluster.pitfalls,
    status: "reviewed",
    qualityGate: {
      reviewedAt: new Date().toISOString().slice(0, 10),
      stage: "S2",
      checklist: [
        "hook+script",
        "members ≥8 bilingual lines",
        "reviewHooks ≥2",
        "pitfalls ≥1",
        "quiz ×3",
      ],
    },
  };
}

function qualityCheck(cluster) {
  const issues = [];
  if (!cluster.hook || cluster.hook.length < 8) issues.push("hook");
  if (!cluster.script || cluster.script.length < 40) issues.push("script");
  if ((cluster.members || []).length < 8) issues.push("members<8");
  if ((cluster.reviewHooks || []).length < 2) issues.push("hooks");
  if ((cluster.pitfalls || []).length < 1) issues.push("pitfalls");
  if ((cluster.quiz || []).length < 3) issues.push("quiz");
  for (const m of cluster.members || []) {
    if (existing.has(m.headword)) issues.push(`dup:${m.headword}`);
    if (!m.speakLineEn || m.speakLineEn.length < 20) issues.push(`speak:${m.headword}`);
    if (!m.speakLineZh) issues.push(`zh:${m.headword}`);
    if (/The committee decided to/i.test(m.speakLineEn || "")) issues.push(`tmpl:${m.headword}`);
  }
  return issues;
}

const written = [];
const blocked = [];

for (const raw of NEW) {
  const issues = qualityCheck(raw);
  if (issues.length) {
    blocked.push({ id: raw.id, issues });
    continue;
  }
  const cluster = {
    id: raw.id,
    type: raw.type,
    elementLemma: raw.elementLemma,
    titleZh: raw.titleZh,
    titleEn: raw.titleEn,
    hook: raw.hook,
    script: raw.script,
    members: raw.members,
    reviewHooks: raw.reviewHooks,
    pitfalls: raw.pitfalls,
    lessonRefs: [`lesson-${raw.id}`],
    status: "reviewed",
    priority: "A",
    qualityGate: {
      reviewedAt: new Date().toISOString().slice(0, 10),
      stage: "S2",
      note: "New A-level cluster with full lesson",
    },
  };
  fs.writeFileSync(path.join(clusterDir, `${cluster.id}.json`), `${JSON.stringify(cluster, null, 2)}\n`);
  const lesson = buildLesson({ ...cluster, quiz: raw.quiz });
  fs.writeFileSync(path.join(lessonDir, `${lesson.id}.json`), `${JSON.stringify(lesson, null, 2)}\n`);
  for (const m of cluster.members) existing.add(m.headword);
  written.push(cluster.id);
}

// refresh lesson index + humor index
const allClusters = fs
  .readdirSync(clusterDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(clusterDir, f), "utf8")))
  .sort((a, b) => a.id.localeCompare(b.id));

const lessonIndex = allClusters.map((c) => {
  const season = SEASON[c.type] || SEASON.root;
  return {
    id: `lesson-${c.id}`,
    slug: c.id,
    season: season.id,
    seasonTitleZh: season.titleZh,
    titleZh: c.titleZh,
    clusterId: c.id,
    type: c.type === "lookalike" || c.type === "semantic" ? "duel" : "family",
    status: c.status,
    memberCount: (c.members || []).length,
  };
});
lessonIndex.sort((a, b) => a.season - b.season || a.slug.localeCompare(b.slug));
fs.writeFileSync(
  path.join(lessonDir, "index.json"),
  `${JSON.stringify({ version: "v0.2-s2", total: lessonIndex.length, lessons: lessonIndex }, null, 2)}\n`,
);

const vocab = new Set([...vocabMap.keys()]);
fs.writeFileSync(
  path.join(humorDir, "index.json"),
  `${JSON.stringify(
    {
      version: "v0.2-s2",
      status: "stage2-complete",
      clusters: allClusters.map((c) => ({
        id: c.id,
        type: c.type,
        titleZh: c.titleZh,
        priority: c.priority || "A",
        status: c.status,
        memberCount: (c.members || []).length,
        inVocab: (c.members || []).filter((m) => vocab.has(m.headword)).length,
        pendingAdd: (c.members || [])
          .filter((m) => !vocab.has(m.headword))
          .map((m) => m.headword),
      })),
      lessons: lessonIndex,
    },
    null,
    2,
  )}\n`,
);

// patch elements.json clusterIds for new lemmas
const elementsPath = path.join(humorDir, "elements.json");
const elementsDoc = JSON.parse(fs.readFileSync(elementsPath, "utf8"));
for (const raw of NEW) {
  if (!written.includes(raw.id)) continue;
  const el = elementsDoc.elements.find(
    (e) => e.type === "root" && e.lemma.toLowerCase().includes(raw.elementLemma.split("/")[0].toLowerCase()),
  );
  if (el && !el.clusterIds.includes(raw.id)) el.clusterIds.push(raw.id);
}
elementsDoc.counts.withCluster = elementsDoc.elements.filter((e) => e.clusterIds.length > 0).length;
fs.writeFileSync(elementsPath, `${JSON.stringify(elementsDoc, null, 2)}\n`);

console.log(JSON.stringify({ written, blocked, totalClusters: allClusters.length }, null, 2));
