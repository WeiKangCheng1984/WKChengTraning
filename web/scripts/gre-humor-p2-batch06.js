/**
 * P2-batch06: 20 clusters, humor-first; then pair with moderate pending.
 * node web/scripts/gre-humor-p2-batch06.js
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
  for (const w of letter.words || []) vocabMap.set(String(w.en || "").toLowerCase(), w);
}

const existing = new Set();
for (const f of fs.readdirSync(clusterDir).filter((x) => x.endsWith(".json"))) {
  const c = JSON.parse(fs.readFileSync(path.join(clusterDir, f), "utf8"));
  for (const m of c.members || []) existing.add(String(m.headword).toLowerCase());
}

function card(headword, zhGloss, roleInScript, speakLineEn, speakLineZh, humorDevice = "morphology") {
  const key = headword.toLowerCase();
  const v = vocabMap.get(key);
  return {
    headword: key,
    inVocab: Boolean(v),
    senseAnchor: v?.endef || zhGloss,
    roleInScript,
    humorDevice,
    zhGloss,
    speakLineEn,
    speakLineZh,
    related: { synonyms: v?.synonyms || "", antonyms: v?.antonyms || "" },
    vocabStatus: v ? "in-vocab" : "pending-add",
  };
}

const SEASON = {
  rhyme: { id: 1, titleZh: "押韻派對", titleEn: "Rhyme Party" },
  root: { id: 2, titleZh: "字根劇場", titleEn: "Root Theater" },
  semantic: { id: 3, titleZh: "語氣對打", titleEn: "Tone Duels" },
  lookalike: { id: 3, titleZh: "語氣對打", titleEn: "Tone Duels" },
  prefix: { id: 4, titleZh: "字首調味", titleEn: "Prefix Seasoning" },
};
const STAGE = "P2-batch06";

const NEW = [
  {
    id: "root-oper-01", type: "root", elementLemma: "oper", priority: "C",
    titleZh: "oper｜操作指揮台", titleEn: "Oper Control Deck",
    hook: "字根 oper＝工作——指揮台把「動手做」編成歌劇級流程。",
    script: "operate／operation／operator／operative 開機作業。cooperate／cooperation 合奏席。opera／operatic／opus 把工作唱成劇；inoperative／operable 故障燈與可修標——台長：operative definition 要寫；inoperative ethics 禁演。",
    reviewHooks: ["oper＝做：operate/operation/cooperate/operative/opus", "inoperative＝失效"],
    pitfalls: ["operative＝有效的／特工；operation＝手術／行動", "opus＝作品"],
    members: [
      card("operate", "操作；動手術", "開機", "Operate only on locked analysis code.", "只在鎖定分析程式上操作。"),
      card("operation", "操作；行動；手術", "作業單", "Document every operation that changes outcomes.", "記錄每次改結局的操作。"),
      card("operator", "操作員", "操作員椅", "The pipeline operator owns the changelog.", "管線操作員擁有變更日誌。"),
      card("operative", "有效的；特工", "有效章", "Write an operative definition of the endpoint.", "寫下終點的有效定義。"),
      card("inoperative", "失效的", "故障燈", "An inoperative prereg is worse than none.", "失效的預註冊比沒有更糟。"),
      card("operable", "可操作的；可動手術的", "可修標", "Keep claims operable under missing data.", "讓主張在缺失資料下仍可操作。"),
      card("cooperate", "合作", "合奏席", "Teams must cooperate on shared codebooks.", "團隊必須共用編碼簿合作。"),
      card("cooperation", "合作", "合奏契約", "Cooperation without audit is theater.", "沒有稽核的合作是表演。"),
      card("opera", "歌劇", "歌劇廳", "Do not turn methods into opera without scores.", "別把方法變成沒有樂譜的歌劇。", "story"),
      card("operatic", "歌劇式的；誇張的", "誇張唱腔", "Avoid operatic claims from tiny samples.", "避免從小樣本唱出誇張主張。", "story"),
      card("opus", "作品（編號）", "作品號", "Treat each paper as an opus with a version tag.", "把每篇論文當有版本號的作品。", "story"),
      card("workshop", "工作坊", "工作坊桌", "Run a methods workshop before launch.", "上線前開方法工作坊。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Not working; inactive:", promptZh: "失效的：", choices: ["inoperative", "popular", "sonic", "via"], answer: "inoperative" },
      { id: "q2", type: "sense", promptEn: "Effective; in force; secret agent:", promptZh: "有效／特工：", choices: ["operative", "populace", "surge", "neon"], answer: "operative" },
      { id: "q3", type: "sense", promptEn: "A creative work (often numbered):", promptZh: "作品：", choices: ["opus", "opera", "seed", "path"], answer: "opus" },
    ],
  },
  {
    id: "root-popul-01", type: "root", elementLemma: "popul", priority: "C",
    titleZh: "popul｜民意廣場", titleEn: "Popul Public Square",
    hook: "字根 popul＝民——廣場上擠滿人潮、民粹喇叭與冷清角落。",
    script: "popular／unpopular／popularize 人氣燈。populate／population／populous／populace 人潮統計。populist／depopulate 民粹喇叭與清空場——市長：populace ≠ sample；populist shortcuts 禁。",
    reviewHooks: ["popul＝民：popular/populate/population/populace/populist", "populace＝大眾"],
    pitfalls: ["populace＝民眾；population＝人口／母體", "populist＝民粹的"],
    members: [
      card("popular", "受歡迎的；流行的", "人氣燈", "Popular metrics can still be wrong.", "流行指標仍可能錯。"),
      card("unpopular", "不受歡迎的", "冷清角", "Unpopular nulls deserve publication.", "不受歡迎的虛無也該發表。"),
      card("popularize", "普及；推廣", "推廣攤", "Popularize prereg without dumbing it down.", "普及預註冊但不簡化到失真。"),
      card("populate", "使居住；填充", "填人潮", "Populate the codebook before the model.", "建模前先填滿編碼簿。"),
      card("population", "人口；母體", "母體牆", "State the population you can actually reach.", "說清你真正能觸及的母體。"),
      card("populous", "人口稠密的", "擁擠區", "Populous multi-site studies need site effects.", "人口稠密多站研究需要站點效應。"),
      card("populace", "大眾；平民", "廣場人群", "Do not confuse online populace with the frame.", "別把線上人群當抽樣架構。"),
      card("populist", "民粹的；民粹主義者", "民粹喇叭", "Populist certainty is not statistical certainty.", "民粹確定不是統計確定。"),
      card("depopulate", "使人口減少", "清空場", "Depopulate junk variables before fitting.", "擬合前清空垃圾變數。", "story"),
      card("crowd", "人群", "人群浪", "Crowd applause is not peer review.", "人群掌聲不是同儕審查。", "story"),
      card("public", "公眾的", "公眾席", "Keep public corrections faster than rumors.", "公開勘誤要比謠言快。", "story"),
      card("civic", "市民的", "市民約", "Civic science shares materials.", "市民科學分享材料。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "The common people:", promptZh: "大眾平民：", choices: ["populace", "opus", "surge", "via"], answer: "populace" },
      { id: "q2", type: "sense", promptEn: "Appealing to ordinary people; often anti-elite:", promptZh: "民粹的：", choices: ["populist", "technical", "sonorous", "trivial"], answer: "populist" },
      { id: "q3", type: "sense", promptEn: "Densely inhabited:", promptZh: "人口稠密：", choices: ["populous", "inoperative", "ultrasonic", "neon"], answer: "populous" },
    ],
  },
  {
    id: "root-semin-01", type: "root", elementLemma: "sem/semin", priority: "C",
    titleZh: "sem／semin｜種子散播站", titleEn: "Semin Seed Station",
    hook: "字根 sem/semin＝種——散播站專管播種、研討與「種子級」影響。",
    script: "seminar／seminary 研討溫室。seminal 種子級論文。disseminate／dissemination 把種子撒出去；inseminate／seed／seedling 播入與幼苗——站長：disseminate nulls；seminal 不是自封。",
    reviewHooks: ["semin＝種：seminar/seminal/disseminate/dissemination/seed", "seminal＝開創性的"],
    pitfalls: ["seminal＝開創／種子的；seminar＝研討會", "disseminate＝散播"],
    members: [
      card("seminar", "研討會", "溫室課", "Bring raw plots to the seminar, not vibes.", "研討會帶原始圖，不是感覺。"),
      card("seminary", "神學院；養成所", "養成所", "Treat lab training like a methods seminary.", "把實驗室訓練當方法養成所。"),
      card("seminal", "開創性的；種子的", "種子級", "Call a paper seminal only after replication.", "複現後才稱論文開創。"),
      card("disseminate", "散播；傳播", "撒種機", "Disseminate protocols with the preprint.", "與預印本一起散播規程。"),
      card("dissemination", "散播", "撒種紀錄", "Plan dissemination of negatives too.", "負結果也要有散播計畫。"),
      card("inseminate", "播入；使受精", "播入針", "Inseminate good habits in onboarding week.", "入職週就播入好習慣。"),
      card("seed", "種子", "種子袋", "Set a random seed and record it.", "設定隨機種子並記錄。"),
      card("seedling", "幼苗", "幼苗盆", "Protect seedling ideas from hype frost.", "保護幼苗想法免於炒作霜凍。", "story"),
      card("sow", "播種", "播種手", "Sow preregistration before collecting.", "收集前先播下預註冊。", "story"),
      card("germinate", "發芽", "發芽燈", "Let critiques germinate before rebutting.", "反駁前讓批評先發芽。", "story"),
      card("scatter", "撒布", "撒布圖", "Scatterplots beat adjective storms.", "散佈圖勝過形容詞風暴。", "story"),
      card("broadcast", "廣播", "廣播塔", "Broadcast corrections as loudly as launches.", "勘誤廣播要跟上線一樣大聲。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Highly original; influential like a seed:", promptZh: "開創性種子級：", choices: ["seminal", "popular", "sonic", "automatic"], answer: "seminal" },
      { id: "q2", type: "sense", promptEn: "Spread widely:", promptZh: "散播：", choices: ["disseminate", "depopulate", "deviate", "surge"], answer: "disseminate" },
      { id: "q3", type: "sense", promptEn: "Study meeting; class discussion:", promptZh: "研討會：", choices: ["seminar", "surgery", "autocrat", "path"], answer: "seminar" },
    ],
  },
  {
    id: "root-son-01", type: "root", elementLemma: "son", priority: "C",
    titleZh: "son｜共鳴錄音棚", titleEn: "Son Resonance Studio",
    hook: "字根 son＝聲——錄音棚管共鳴、刺耳、齊聲與超音波。",
    script: "sonic／sonorous／supersonic／ultrasonic 聲浪層。resonate／resonance／resonant 共鳴牆。unison 齊聲；dissonant／dissonance／assonant 刺耳與諧音——導播：let claims resonate with evidence；dissonant incentives 調音。",
    reviewHooks: ["son＝聲：sonic/sonorous/resonate/unison/dissonance", "dissonant＝不和諧"],
    pitfalls: ["resonate＝共鳴；dissonant＝不協調", "unison＝齊聲／一致"],
    members: [
      card("sonic", "聲音的；音速的", "聲浪", "Sonic branding cannot replace methods.", "聲音品牌取代不了方法。"),
      card("sonorous", "洪亮的", "洪亮麥", "Sonorous abstracts still need numbers.", "洪亮摘要仍需要數字。"),
      card("resonate", "共鳴；引起共鳴", "共鳴牆", "Let limitations resonate as loudly as wins.", "讓限制與勝利一樣共鳴。"),
      card("resonance", "共鳴；迴響", "迴響值", "Emotional resonance is not causal ID.", "情緒共鳴不是因果識別。"),
      card("resonant", "共鳴的", "共鳴標", "Resonant stories need boring audits.", "共鳴故事需要無聊稽核。"),
      card("unison", "齊聲；一致", "齊聲鍵", "Lock endpoints in unison across sites.", "跨站點齊聲鎖定終點。"),
      card("dissonant", "不和諧的", "刺耳燈", "Dissonant incentives distort reporting.", "不和諧誘因扭曲報告。"),
      card("dissonance", "不協調；認知失調", "刺耳值", "Cognitive dissonance after a null is data.", "虛無後的認知失調也是資料。"),
      card("assonant", "諧音的", "諧音鍵", "Assonant slogans are not analyses.", "諧音口號不是分析。", "story"),
      card("supersonic", "超音速的", "超音速", "Supersonic deadlines still need checklists.", "超音速期限仍需要清單。", "story"),
      card("ultrasonic", "超音波的", "超音波", "Use ultrasonic detail on edge cases.", "對邊界案例用超音波級細節。", "story"),
      card("echo", "回音", "回音壁", "Echo chambers amplify unreplicated claims.", "回音室放大未複現主張。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Harshly unharmonious:", promptZh: "不和諧刺耳：", choices: ["dissonant", "seminal", "popular", "trivial"], answer: "dissonant" },
      { id: "q2", type: "sense", promptEn: "To echo; strike a chord:", promptZh: "共鳴：", choices: ["resonate", "operate", "populate", "deviate"], answer: "resonate" },
      { id: "q3", type: "sense", promptEn: "Full, rich sound; imposing:", promptZh: "洪亮：", choices: ["sonorous", "populous", "inoperative", "neon"], answer: "sonorous" },
    ],
  },
  {
    id: "root-surg-01", type: "root", elementLemma: "surg", priority: "C",
    titleZh: "surg｜浪潮手術室", titleEn: "Surg Surge Ward",
    hook: "字根 surg＝升——手術室又處理浪潮上升，也處理外科切割。",
    script: "surge／upsurge／resurgent／resurgence 浪潮監視器。surgeon／surgery／surgical 精準下刀；insurgency 叛亂升溫——主任：surgical edits 可以；hype surge 要止血。",
    reviewHooks: ["surg＝升：surge/resurgence/surgical/surgeon/upsurge", "resurgent＝再起的"],
    pitfalls: ["surge＝湧現；surgery＝外科手術", "insurgency＝叛亂（與 insurgent 同源）"],
    members: [
      card("surge", "湧現；急升", "浪潮", "A surge in p-hacking follows vague plans.", "計畫含糊後 p 黑客會湧現。"),
      card("upsurge", "急劇上升", "上升箭", "An upsurge of interest is not evidence.", "興趣急升不是證據。"),
      card("resurgent", "再起的", "再起燈", "Resurgent errors need stronger gates.", "再起的錯誤需要更強閘門。"),
      card("resurgence", "再起；復甦", "再起曲線", "Watch for resurgence of dropped outliers.", "注意被丟掉離群值的再起。"),
      card("surgeon", "外科醫生", "主刀", "Be a surgeon of the analysis plan: precise cuts.", "當分析計畫的外科醫生：精準下刀。"),
      card("surgery", "外科；手術", "手術台", "Protocol surgery requires a change log.", "規程手術需要變更日誌。"),
      card("surgical", "外科的；精準的", "精準刀", "Make surgical corrections, not silent rewrites.", "做精準勘誤，不是沉默改寫。"),
      card("insurgency", "叛亂；起義", "叛亂溫", "An insurgency of undocumented forks is toxic.", "無文件分叉叛亂有毒。"),
      card("rise", "上升", "上升梯", "A rise in citations is not validity.", "引用上升不是效度。", "story"),
      card("spike", "尖峰", "尖峰針", "Explain every spike before celebrating.", "慶祝前先解釋每個尖峰。", "story"),
      card("scalpel", "手術刀", "小刀", "Use a scalpel on endpoints, not an axe.", "對終點用手術刀，不用斧頭。", "story"),
      card("incision", "切口", "切口線", "Every incision in the sample needs a reason.", "樣本每個切口需要理由。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Precise like a surgical cut:", promptZh: "精準外科式：", choices: ["surgical", "sonorous", "popular", "trivial"], answer: "surgical" },
      { id: "q2", type: "sense", promptEn: "A sudden powerful forward or upward movement:", promptZh: "湧現急升：", choices: ["surge", "seed", "via", "neon"], answer: "surge" },
      { id: "q3", type: "sense", promptEn: "Rising again; returning to strength:", promptZh: "再起的：", choices: ["resurgent", "operatic", "populous", "diagonal"], answer: "resurgent" },
    ],
  },
  {
    id: "root-techn-01", type: "root", elementLemma: "techn", priority: "C",
    titleZh: "techn｜技術工坊", titleEn: "Techn Craft Shop",
    hook: "字根 techn＝技——工坊把技術、煙火與技術官僚放上同一張工作台。",
    script: "technical／technique／technology／technician 工藝線。technocrat 技術官僚椅；pyrotechnics／polytechnic 煙火秀與綜合技校——師傅：technique > theatrics；technocrat 也不能免審。",
    reviewHooks: ["techn＝技：technical/technique/technology/technician/technocrat", "pyrotechnics＝煙火／炫技"],
    pitfalls: ["technique＝技巧；technology＝技術體系", "technocrat＝技術官僚"],
    members: [
      card("technical", "技術的", "技術標", "Technical debt in code becomes ethics debt.", "程式技術債會變倫理債。"),
      card("technique", "技巧；技法", "技法卡", "Name the estimation technique plainly.", "清楚命名估計技法。"),
      card("technology", "科技；技術", "技術架", "New technology still needs old checklists.", "新科技仍需要舊清單。"),
      card("technician", "技術員", "技術員凳", "A careful technician beats a charismatic slide.", "細心技術員勝過魅力簡報。"),
      card("technocrat", "技術官僚", "官僚椅", "A technocrat without humility ships bias.", "沒有謙遜的技術官僚會產出偏差。"),
      card("pyrotechnics", "煙火；炫技", "煙火秀", "Verbal pyrotechnics cannot hide missing data.", "言語煙火藏不住缺失資料。"),
      card("polytechnic", "理工的；綜合技術", "綜合技校", "Keep a polytechnic mix of skills on the team.", "團隊保持綜合技術技能組合。"),
      card("craft", "工藝", "手工藝", "Treat analysis as craft, not magic.", "把分析當工藝，不是魔法。", "story"),
      card("tooling", "工具鏈", "工具牆", "Invest in tooling for reproducibility.", "投資可複現工具鏈。", "story"),
      card("gadget", "小裝置", "小玩意", "A fancy gadget is not a design.", "花俏小裝置不是設計。", "story"),
      card("blueprint", "藍圖", "藍圖桌", "Publish the blueprint with the build.", "與建置一起公開藍圖。", "story"),
      card("workshop", "工坊課", "工坊班", "Workshop failures as openly as successes.", "像成功一樣公開工坊失敗。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Showy display; fireworks (literal or verbal):", promptZh: "煙火／炫技：", choices: ["pyrotechnics", "populace", "resonance", "via"], answer: "pyrotechnics" },
      { id: "q2", type: "sense", promptEn: "Expert who rules by technical skill:", promptZh: "技術官僚：", choices: ["technocrat", "populist", "surgeon", "neophyte"], answer: "technocrat" },
      { id: "q3", type: "sense", promptEn: "Method of doing practical work:", promptZh: "技巧技法：", choices: ["technique", "surge", "seedling", "path"], answer: "technique" },
    ],
  },
  {
    id: "root-tele-01", type: "root", elementLemma: "tele", priority: "C",
    titleZh: "tele｜遠距傳送站", titleEn: "Tele Farlink Station",
    hook: "字根 tele＝遠——傳送站專管遠距、遠望、遠寫與遠距上班。",
    script: "television／telegraph／telemetry 遠距訊號。telegenic 上鏡臉；telecommute 遠距工位——站長：telemetry of decisions；別只 telegenic 不實測。",
    reviewHooks: ["tele＝遠：television/telegraph/telemetry/telecommute/telegenic", "telemetry＝遙測"],
    pitfalls: ["telegenic＝上鏡的", "telemetry＝遙測數據"],
    members: [
      card("television", "電視", "遠距螢幕", "Television timelines must not force peeking.", "電視時程不該逼出偷看。"),
      card("telegraph", "電報；電匯暗示", "遠距急報", "Telegraph uncertainty in the abstract.", "在摘要電報式標出不確定。"),
      card("telemetry", "遙測", "遙測板", "Keep telemetry on who changed what when.", "遙測誰在何時改了什麼。"),
      card("telegenic", "上鏡的", "上鏡臉", "Telegenic charts still need axes.", "上鏡圖表仍需要座標軸。"),
      card("telecommute", "遠距通勤上班", "遠距工位", "Telecommute teams still share one repo clock.", "遠距團隊仍共用一個 repo 時鐘。"),
      card("remote", "遙遠的；遠端", "遠端鍵", "Remote collaborators need tighter logs.", "遠端合作者需要更緊日誌。", "story"),
      card("distant", "遠的", "遠距尺", "Distant effects need stronger identification.", "遠距效應需要更強識別。", "story"),
      card("long-range", "長程的", "長程箭", "Long-range claims need long-range data.", "長程主張需要長程資料。", "story"),
      card("broadcast", "廣播傳送", "廣播塔", "Broadcast the analysis freeze date.", "廣播分析凍結日。", "story"),
      card("signal", "訊號", "訊號燈", "Separate signal from dashboard noise.", "把訊號與儀表板噪音分開。", "story"),
      card("antenna", "天線", "天線杆", "Point the antenna at disconfirming evidence.", "天線指向否證證據。", "story"),
      card("horizon", "地平線", "地平線", "State the prediction horizon before fitting.", "擬合前說清預測地平線。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Looking good on camera:", promptZh: "上鏡的：", choices: ["telegenic", "surgical", "populous", "dissonant"], answer: "telegenic" },
      { id: "q2", type: "sense", promptEn: "Remote measurement data:", promptZh: "遙測：", choices: ["telemetry", "seminar", "opus", "neon"], answer: "telemetry" },
      { id: "q3", type: "sense", promptEn: "Work from afar by telecom:", promptZh: "遠距上班：", choices: ["telecommute", "depopulate", "deviate", "surge"], answer: "telecommute" },
    ],
  },
  {
    id: "root-via-01", type: "root", elementLemma: "via", priority: "C",
    titleZh: "via｜路徑分岔口", titleEn: "Via Path Junction",
    hook: "字根 via＝路——分岔口專管路徑、偏離、顯而易見與穿不透。",
    script: "via 路徑標。deviate／deviation／deviant 偏離道。previous／trivial／obvious 前一路與顯而易見牌；impervious／pervious 穿不透／可滲——交警：report deviation；impervious egos 禁行。",
    reviewHooks: ["via＝路：via/deviate/deviation/trivial/obvious/impervious", "impervious＝不能滲透／無動於衷"],
    pitfalls: ["trivial＝瑣碎；obvious＝明顯", "deviant＝偏離常規的（可中性／貶）"],
    members: [
      card("via", "經由；通過", "路徑標", "Share files via a versioned vault, not chat.", "經由版本庫分享檔案，不是聊天。"),
      card("deviate", "偏離", "偏離道", "Do not deviate from the plan silently.", "不要沉默偏離計畫。"),
      card("deviation", "偏離；偏差", "偏離表", "Log every deviation with a timestamp.", "每筆偏離記錄時間戳。"),
      card("deviant", "偏離常規的", "非常規標", "Label deviant analyses as exploratory.", "把非常規分析標為探索。"),
      card("previous", "先前的", "前一路", "Cite previous locks of the same dataset.", "引用同一資料集先前鎖定。"),
      card("trivial", "瑣碎的；平凡的", "瑣碎牌", "A trivial bug can still bias estimates.", "瑣碎 bug 仍可能偏差估計。"),
      card("obvious", "明顯的", "明顯牌", "If it is obvious, still show the check.", "即使明顯，仍展示檢查。"),
      card("impervious", "不能滲透的；無動於衷的", "穿不透盾", "Do not be impervious to critique.", "不要對批評無動於衷。"),
      card("pervious", "可滲透的", "可滲膜", "Keep leadership pervious to junior flags.", "讓領導層可被資淺舉旗滲透。", "story"),
      card("pathway", "通路", "通路圖", "Draw the causal pathway before the model.", "建模前畫因果通路。", "story"),
      card("detour", "繞道", "繞道牌", "Detours need signs in the supplement.", "繞道需要在補充材料立牌。", "story"),
      card("crossroad", "十字路口", "十字路口", "At each crossroad, write the decision rule.", "每個十字路口寫下決策規則。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Not allowing passage; unmoved:", promptZh: "穿不透／無動於衷：", choices: ["impervious", "popular", "sonic", "seminal"], answer: "impervious" },
      { id: "q2", type: "sense", promptEn: "Stray from a path or norm:", promptZh: "偏離：", choices: ["deviate", "operate", "surge", "resonate"], answer: "deviate" },
      { id: "q3", type: "sense", promptEn: "Of little importance; ordinary:", promptZh: "瑣碎平凡：", choices: ["trivial", "telegenic", "operatic", "populous"], answer: "trivial" },
    ],
  },
  {
    id: "prefix-auto-01", type: "prefix", elementLemma: "auto-", priority: "B",
    titleZh: "auto-｜自動駕駛艙", titleEn: "Auto Pilot Cabin",
    hook: "字首 auto-＝自己——駕駛艙要嘛自己開，要嘛自己統治，還寫自傳。",
    script: "automatic／autopilot／autofocus 自動檔。autonomy／autonomous 自治方向盤。autocrat／autocratic 獨裁按鈕；automobile／autobiography 載具與自傳——機長：autonomy with audits；拒 autocratic silence。",
    reviewHooks: ["auto-＝自己：automatic/autonomy/autonomous/autocrat/autopilot", "autocrat＝獨裁者"],
    pitfalls: ["autonomy＝自主；automatic＝自動的", "autocratic＝獨裁的"],
    members: [
      card("automatic", "自動的", "自動檔", "Automatic pipelines still need human gates.", "自動管線仍需要人工閘門。"),
      card("autonomy", "自主；自治", "自治盤", "Grant analysts autonomy to report errors.", "給分析師回報錯誤的自主權。"),
      card("autonomous", "自主的", "自主車", "Autonomous teams still sync nightly.", "自主團隊仍每晚同步。"),
      card("autocrat", "獨裁者", "獨裁鈕", "No lab autocrat owns the outcome list alone.", "實驗室獨裁者不能獨占結局清單。"),
      card("autocratic", "獨裁的", "獨裁風", "Autocratic edits without review are banned.", "無審查的獨裁編輯禁止。"),
      card("automobile", "汽車", "載具", "An automobile of tools needs a maintenance log.", "工具汽車需要維護日誌。"),
      card("autobiography", "自傳", "自傳本", "Methods autobiography should list forks.", "方法自傳應列出分叉。"),
      card("autopilot", "自動駕駛", "自動駕駛", "Do not leave ethics on autopilot.", "倫理不要放自動駕駛。", "story"),
      card("autofocus", "自動對焦", "對焦環", "Autofocus on the estimand, not the headline.", "自動對焦目標量，不是標題。", "story"),
      card("self-driving", "自駕的", "自駕車", "Self-driving code still needs seatbelts: tests.", "自駕程式仍需要安全帶：測試。", "story"),
      card("self-rule", "自治", "自治旗", "Self-rule includes self-correction.", "自治包含自我更正。", "story"),
      card("handbook", "手冊", "手冊匣", "Keep a pilot handbook next to the scripts.", "腳本旁放飛行員手冊。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Self-government; independence:", promptZh: "自主自治：", choices: ["autonomy", "populace", "surge", "seed"], answer: "autonomy" },
      { id: "q2", type: "sense", promptEn: "A ruler with absolute power:", promptZh: "獨裁者：", choices: ["autocrat", "technician", "mariner", "consultant"], answer: "autocrat" },
      { id: "q3", type: "sense", promptEn: "Working by itself:", promptZh: "自動的：", choices: ["automatic", "dissonant", "trivial", "seminal"], answer: "automatic" },
    ],
  },
  {
    id: "prefix-ambi-01", type: "prefix", elementLemma: "ambi-", priority: "B",
    titleZh: "ambi-｜雙面猶豫廳", titleEn: "Ambi Two-Face Lounge",
    hook: "字首 ambi-＝兩邊——猶豫廳左右開攻：雙關、矛盾情感、左右開弓。",
    script: "ambiguous／ambiguity 雙關霧。ambivalent／ambivalence 左右情感拉扯。ambidextrous 左右開弓；ambience／ambition／ambitious／ambivert 氣氛與野心——大廳經理：reduce ambiguity；ambivalence 可以寫進限制。",
    reviewHooks: ["ambi-＝兩邊：ambiguous/ambiguity/ambivalent/ambidextrous/ambition", "ambivalent＝矛盾情感"],
    pitfalls: ["ambiguous＝含糊；ambivalent＝矛盾態度", "ambidextrous＝左右手都靈"],
    members: [
      card("ambiguity", "含糊；歧義", "雙關霧", "Reduce outcome ambiguity before collection.", "收集前減少結局歧義。"),
      card("ambivalent", "矛盾情感的", "左右拉", "Be ambivalent about flashy but fragile findings.", "對花俏卻易碎發現保持矛盾情感。"),
      card("ambivalence", "矛盾情感", "拉扯計", "Report ambivalence about causal leaps.", "報告對因果跳躍的矛盾情感。"),
      card("ambidextrous", "左右開弓的", "雙手帳", "Be ambidextrous: code and communicate.", "左右開弓：寫程式也會溝通。"),
      card("ambience", "氣氛；環境", "氣氛燈", "Lab ambience should reward flags, not fear.", "實驗室氣氛應獎勵舉旗，不是恐懼。"),
      card("ambition", "野心；志向", "野心錶", "Ambition without a plan is noise.", "沒有計畫的野心是噪音。"),
      card("ambitious", "有野心的", "野心標", "Ambitious claims need ambitious checks.", "有野心的主張需要有野心的檢查。"),
      card("ambivert", "中間性格者", "中間人", "An ambivert facilitator keeps meetings fair.", "中間性格主持讓會議公平。", "story"),
      card("two-sided", "雙面的", "雙面牌", "Use two-sided tests unless justified.", "除非有理由，否則用雙尾檢定。", "story"),
      card("either-or", "二選一", "二選一門", "Avoid either-or framing of messy data.", "避免把凌亂資料框成二選一。", "story"),
      card("fence-sitting", "騎牆", "騎牆凳", "Fence-sitting on fraud is not neutrality.", "對造假騎牆不是中立。", "story"),
      card("double-edge", "雙刃", "雙刃刀", "Flexibility is a double-edge without locks.", "沒有鎖定的彈性是雙刃。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Having mixed feelings:", promptZh: "矛盾情感：", choices: ["ambivalent", "automatic", "surgical", "populous"], answer: "ambivalent" },
      { id: "q2", type: "sense", promptEn: "Uncertainty of meaning:", promptZh: "歧義含糊：", choices: ["ambiguity", "autonomy", "resurgence", "telemetry"], answer: "ambiguity" },
      { id: "q3", type: "sense", promptEn: "Able to use both hands equally:", promptZh: "左右開弓：", choices: ["ambidextrous", "autocratic", "dissonant", "trivial"], answer: "ambidextrous" },
    ],
  },
  {
    id: "prefix-ante-01", type: "prefix", elementLemma: "ante-", priority: "B",
    titleZh: "ante-｜前廳時光機", titleEn: "Ante Antechamber Time Machine",
    hook: "字首 ante-＝在前——前廳專管先前、前室，還有洪水以前的古老。",
    script: "antecedent／anterior／antedate 時間前綴。antechamber 前室等候。antebellum／antediluvian／antemeridian 戰前、洪水前、午前——接待：name antecedents；antediluvian pipelines 退役。",
    reviewHooks: ["ante-＝前：antecedent/anterior/antedate/antechamber/antediluvian", "antediluvian＝極古老"],
    pitfalls: ["antecedent＝先行詞／前事；anterior＝前面的", "antediluvian＝遠古／老掉牙"],
    members: [
      card("antecedent", "先行的；前事；先行詞", "前事牌", "List causal antecedents, not just correlates.", "列出因果前事，不只相關。"),
      card("anterior", "前面的；先前的", "前方燈", "Keep anterior decisions in the protocol.", "把先前決策留在規程。"),
      card("antedate", "早於；填早日期", "填早章", "Do not antedate analyses after seeing results.", "看到結果後不要倒填分析日期。"),
      card("antechamber", "前廳；前室", "前室椅", "Use the antechamber: pilot before main run.", "用前室：主跑前先試跑。"),
      card("antebellum", "戰前的", "戰前照", "Archive antebellum code before the redesign.", "改版前封存戰前程式碼。"),
      card("antediluvian", "遠古的；老掉牙的", "洪水前", "Retire antediluvian Excel-only workflows.", "淘汰洪水前的純 Excel 流程。"),
      card("antemeridian", "午前的", "午前鐘", "Schedule antemeridian locks when possible.", "可能時安排午前鎖定。", "story"),
      card("beforehand", "事先", "事先牌", "Decide exclusions beforehand.", "事先決定排除。", "story"),
      card("prior", "先前的", "先前匣", "Prior commitments beat post-hoc stories.", "先前承諾勝過事後故事。", "story"),
      card("forerunner", "先驅", "先驅旗", "Cite forerunners of your design honestly.", "誠實引用設計先驅。", "story"),
      card("prelude", "前奏", "前奏曲", "Pilot studies are a prelude, not proof.", "試點是前奏，不是證明。", "story"),
      card("warmup", "熱身", "熱身跑", "Warmup analyses stay labeled exploratory.", "熱身分析保持探索標籤。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Something that comes before:", promptZh: "前事／先行：", choices: ["antecedent", "populace", "surge", "echo"], answer: "antecedent" },
      { id: "q2", type: "sense", promptEn: "Extremely old-fashioned; before the Flood:", promptZh: "遠古老掉牙：", choices: ["antediluvian", "telegenic", "operable", "ambitious"], answer: "antediluvian" },
      { id: "q3", type: "sense", promptEn: "Assign an earlier date:", promptZh: "填早日期：", choices: ["antedate", "disseminate", "resonate", "deviate"], answer: "antedate" },
    ],
  },
  {
    id: "prefix-dia-01", type: "prefix", elementLemma: "dia-", priority: "B",
    titleZh: "dia-｜對角診療室", titleEn: "Dia Across Clinic",
    hook: "字首 dia-＝穿過／之間——診療室對角切開：對話、診斷、直徑與散居。",
    script: "dialogue／dialectic 對談床。diagnosis／diagnose 診斷燈。diagonal／diameter 對角與直徑尺；diaphanous／diurnal／diaspora 薄紗、日夜、散居——醫師：diagnose bias；diaphanous methods 不及格。",
    reviewHooks: ["dia-＝穿過：dialogue/diagnosis/diagnose/diagonal/diameter/diaspora", "diaphanous＝半透明薄弱"],
    pitfalls: ["diagnosis＝診斷；dialectic＝辯證", "diaspora＝離散群體"],
    members: [
      card("dialogue", "對話", "對談床", "Keep a dialogue between code and codebook.", "讓程式與編碼簿持續對話。"),
      card("dialectic", "辯證；辯論法", "辯證燈", "Use dialectic: thesis, antithesis, audit.", "用辯證：正、反、稽核。"),
      card("diagnosis", "診斷", "診斷單", "Write a diagnosis of threats to validity.", "寫下效度威脅診斷。"),
      card("diagnose", "診斷", "聽診器", "Diagnose leakage before fitting.", "擬合前診斷洩漏。"),
      card("diagonal", "對角的", "對角線", "Read the confusion matrix on the diagonal first.", "先看混淆矩陣對角線。"),
      card("diameter", "直徑", "直徑尺", "Report the diameter of uncertainty, not a point.", "報告不確定直徑，不是一點。"),
      card("diaphanous", "半透明的；薄弱的", "薄紗", "Diaphanous methods sections fail review.", "薄弱方法段審不過。"),
      card("diurnal", "晝夜的；日間的", "日夜鐘", "Account for diurnal collection effects.", "考慮日間收集效應。", "story"),
      card("diaspora", "離散；散居群體", "散居圖", "A diaspora of forks needs a map.", "分叉散居需要地圖。", "story"),
      card("across", "穿過", "穿過橋", "Effects across sites need pooling rules.", "跨站點效應需要合併規則。", "story"),
      card("cross-cut", "横切", "横切面", "Cross-cut the data by prereg strata.", "依預註冊分層横切資料。", "story"),
      card("transparent", "透明的", "透明窗", "Keep decision rules transparent.", "保持決策規則透明。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Identify the nature of a problem:", promptZh: "診斷：", choices: ["diagnose", "antedate", "surge", "populate"], answer: "diagnose" },
      { id: "q2", type: "sense", promptEn: "Light, thin, almost transparent:", promptZh: "半透明薄弱：", choices: ["diaphanous", "autocratic", "populous", "surgical"], answer: "diaphanous" },
      { id: "q3", type: "sense", promptEn: "Conversation between people:", promptZh: "對話：", choices: ["dialogue", "diameter", "neon", "seed"], answer: "dialogue" },
    ],
  },
  {
    id: "prefix-super-01", type: "prefix", elementLemma: "super-", priority: "A",
    titleZh: "super-｜超級頂樓", titleEn: "Super Penthouse",
    hook: "字首 super-＝在上／過度——頂樓專管卓越、表面、取代與最高級。",
    script: "superior／superb／superlative 頂樓獎盃。superficial 只擦表面。supernatural 超自然櫃；supersede／superintendent 取代令與總管——管理員：superb checks；superficial claims 趕下樓。",
    reviewHooks: ["super-＝上／過度：superior/superb/superficial/supersede/superlative", "supersede＝取代"],
    pitfalls: ["superficial＝膚淺的；superior＝較優的", "supersede＝取代（常拼錯）"],
    members: [
      card("superior", "較優的；上級的", "頂樓獎", "Prefer superior identification over fancy models.", "寧可較優識別，不要花俏模型。"),
      card("superb", "極好的", "極好燈", "Superb documentation beats superb adjectives.", "極好文件勝過極好形容詞。"),
      card("superficial", "表面的；膚淺的", "表面擦", "Superficial robustness checks mislead.", "膚淺穩健檢查會誤導。"),
      card("supernatural", "超自然的", "超自然櫃", "Treat unreplicated miracles as near supernatural.", "把未複現奇蹟當近乎超自然。"),
      card("supersede", "取代；淘汰", "取代令", "New protocols supersede folklore.", "新規程取代口頭傳說。"),
      card("superintendent", "主管；督學", "總管椅", "Appoint a reproducibility superintendent.", "指定可複現總管。"),
      card("superlative", "最高級的；最好的", "最高級", "Avoid superlative claims from one study.", "避免用單一研究下最高級主張。"),
      card("overhead", "上方；管理費", "頂樓費", "Track overhead of endless tweaking.", "追蹤無盡微調的頂樓成本。", "story"),
      card("over-the-top", "過頭的", "過頭燈", "Over-the-top certainty is a red flag.", "過頭確定是紅旗。", "story"),
      card("penthouse", "頂樓", "頂樓窗", "Keep primary results in the penthouse of the paper.", "主要結果放論文頂樓。", "story"),
      card("upgrade", "升級", "升級鍵", "Upgrade gates when errors recur.", "錯誤再現時升級閘門。", "story"),
      card("overrule", "否決", "否決錘", "Evidence can overrule hierarchy.", "證據可以否決層級。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Shallow; only on the surface:", promptZh: "表面膚淺：", choices: ["superficial", "seminal", "sonorous", "ambidextrous"], answer: "superficial" },
      { id: "q2", type: "sense", promptEn: "Replace in authority or use:", promptZh: "取代：", choices: ["supersede", "disseminate", "resonate", "populate"], answer: "supersede" },
      { id: "q3", type: "sense", promptEn: "Of the highest kind; best:", promptZh: "最高級：", choices: ["superlative", "trivial", "diurnal", "neon"], answer: "superlative" },
    ],
  },
  {
    id: "prefix-epi-01", type: "prefix", elementLemma: "epi-", priority: "C",
    titleZh: "epi-｜表皮附加層", titleEn: "Epi Surface Layer Lab",
    hook: "字首 epi-＝在上／附加——附加層管表皮、後記、墓誌銘與短暫。",
    script: "epidermis／epidemic／epicenter 表皮與疫情震源。epilogue／epitaph／epithet 後記、墓誌、稱號貼紙；ephemeral／episode 短暫一集——層長：ephemeral hype；epithet 不能取代定義。",
    reviewHooks: ["epi-＝上／附加：epidemic/epicenter/epilogue/epithet/ephemeral", "ephemeral＝短暫的"],
    pitfalls: ["epithet＝稱號／罵名；epitaph＝墓誌銘", "ephemeral＝短暫"],
    members: [
      card("epidemic", "流行病；流行的", "疫情旗", "An epidemic of silent forks needs quarantine.", "沉默分叉流行需要隔離。"),
      card("epidermis", "表皮", "表皮層", "Do not stop at the epidermis of the methods.", "別停在方法的表皮。"),
      card("epicenter", "震源；中心", "震源點", "Find the epicenter of the bias, not the symptom.", "找偏差震源，不是症狀。"),
      card("epilogue", "結語；後記", "後記頁", "Put corrections in an epilogue, not a rumor.", "勘誤放後記，不是謠言。"),
      card("epitaph", "墓誌銘", "墓誌碑", "A bad paper's epitaph is unreproducible.", "壞論文的墓誌是不可複現。"),
      card("epithet", "稱號；修飾語", "稱號貼", "An epithet is not an operational definition.", "稱號不是操作性定義。"),
      card("ephemeral", "短暫的", "泡沫燈", "Ephemeral significance fades without robustness.", "短暫顯著無穩健就消失。"),
      card("episode", "一集；片段", "片段集", "Treat each peek as a logged episode.", "把每次偷看當已記錄片段。", "story"),
      card("overlay", "覆蓋層", "覆蓋膜", "Label overlays that change coding.", "標註會改編碼的覆蓋層。", "story"),
      card("add-on", "附加元件", "附加盒", "Add-on analyses stay secondary.", "附加分析保持次要。", "story"),
      card("surface", "表面", "表面板", "Surface polish cannot hide missing consent.", "表面拋光藏不住缺失同意。", "story"),
      card("afterword", "後記", "後記卡", "Write an afterword when you correct the record.", "更正紀錄時寫後記。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Lasting a very short time:", promptZh: "短暫的：", choices: ["ephemeral", "populous", "superior", "automatic"], answer: "ephemeral" },
      { id: "q2", type: "sense", promptEn: "Descriptive label; sometimes insulting:", promptZh: "稱號／罵名：", choices: ["epithet", "epitaph", "diameter", "seed"], answer: "epithet" },
      { id: "q3", type: "sense", promptEn: "Focal point of a crisis:", promptZh: "震源中心：", choices: ["epicenter", "antechamber", "opus", "path"], answer: "epicenter" },
    ],
  },
  {
    id: "prefix-neo-01", type: "prefix", elementLemma: "neo-", priority: "C",
    titleZh: "neo-｜新詞孵化器", titleEn: "Neo Neologism Incubator",
    hook: "字首 neo-＝新——孵化器專管新詞、新手、新石器與霓虹燈。",
    script: "neologism／neophyte 新詞與新手徽章。neonatal／neolithic／neoclassical／neoliberal 新生、新石器、新古典、新自由——園長：neophyte questions welcome；neologism 不能取代清楚定義。",
    reviewHooks: ["neo-＝新：neologism/neophyte/neonatal/neolithic/neoclassical", "neophyte＝新手"],
    pitfalls: ["neologism＝新造詞", "neophyte＝新手／新信徒"],
    members: [
      card("neologism", "新造詞", "新詞瓶", "Define every neologism in the codebook.", "編碼簿定義每個新造詞。"),
      card("neophyte", "新手；新信徒", "新手徽章", "Protect neophyte analysts who raise flags.", "保護舉旗的新手分析師。"),
      card("neonatal", "新生的；新生兒的", "新生燈", "Neonatal projects need checklists from day one.", "新生專案第一天就要清單。"),
      card("neolithic", "新石器時代的", "新石器", "Retire neolithic copy-paste pipelines.", "淘汰新石器級複製貼上管線。"),
      card("neoclassical", "新古典的", "新古典", "Neoclassical slides still need error bars.", "新古典簡報仍需誤差條。"),
      card("neoliberal", "新自由主義的", "新自由旗", "Label neoliberal assumptions in policy papers.", "政策論文標註新自由假設。"),
      card("neon", "霓虹；氖", "霓虹燈", "Neon headlines need dull appendices.", "霓虹標題需要無聊附錄。", "story"),
      card("newbie", "新手", "新手椅", "Newbie onboarding includes how to correct.", "新手入職包含如何勘誤。", "story"),
      card("freshman", "新生", "新生證", "Freshman mistakes should be teachable moments.", "新生錯誤應是可教時刻。", "story"),
      card("reboot", "重啟", "重啟鍵", "Reboot the plan when assumptions crack.", "假設裂開時重啟計畫。", "story"),
      card("upgrade", "升級", "升級貼", "Upgrade definitions before collecting more.", "收集更多前先升級定義。", "story"),
      card("prototype", "原型", "原型桌", "Prototype openly; lock before confirmatory.", "公開做原型；驗證前鎖定。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "A newly coined word:", promptZh: "新造詞：", choices: ["neologism", "populace", "surge", "via"], answer: "neologism" },
      { id: "q2", type: "sense", promptEn: "Beginner; novice:", promptZh: "新手：", choices: ["neophyte", "autocrat", "technocrat", "superintendent"], answer: "neophyte" },
      { id: "q3", type: "sense", promptEn: "Of newborns; just beginning:", promptZh: "新生的：", choices: ["neonatal", "antediluvian", "dissonant", "trivial"], answer: "neonatal" },
    ],
  },
  {
    id: "prefix-ab-01", type: "prefix", elementLemma: "ab-", priority: "A",
    titleZh: "ab-｜撤離消毒門", titleEn: "Ab Exit Decontam Gate",
    hook: "字首 ab-＝離開／否定——消毒門專管離開、異常、棄權與厭惡。",
    script: "abnormal／aberration 異常警報。abscond／abdicate／abjure 溜走、退位、宣誓放棄。abhor／abort／abstract／abeyance／ablution 厭惡、中止、抽離、暫擱、清洗——門衛：abhor fabrication；abscond with data 零分。",
    reviewHooks: ["ab-＝離開：abnormal/aberration/abscond/abdicate/abhor/abeyance", "abscond＝潛逃"],
    pitfalls: ["abdicate＝退位放棄；abjure＝宣誓放棄", "abeyance＝暫緩擱置"],
    members: [
      card("abnormal", "異常的", "異常燈", "Flag abnormal missingness patterns early.", "及早標記異常缺失模式。"),
      card("aberration", "偏差；失常", "失常針", "Treat a lucky p as a possible aberration.", "把幸運 p 當可能失常。"),
      card("abscond", "潛逃；溜走", "溜走門", "Do not abscond with unshared materials.", "別帶著未分享材料溜走。"),
      card("abdicate", "退位；放棄職責", "退位章", "Leaders must not abdicate audit duty.", "領導不可放棄稽核職責。"),
      card("abjure", "宣誓放棄", "棄權誓", "Abjure outcome switching in writing.", "書面宣誓放棄結局替換。"),
      card("abhor", "憎惡", "厭惡鈴", "Abhor silent deletion of outliers.", "憎惡沉默刪除離群值。"),
      card("abort", "中止；流產", "中止鍵", "Abort a run when blinding breaks.", "盲法破裂時中止執行。"),
      card("abstract", "摘要；抽象的", "摘要卡", "Put uncertainty in the abstract.", "把不確定放進摘要。"),
      card("abeyance", "暫緩；擱置", "暫擱架", "Hold disputed claims in abeyance.", "爭議主張先暫擱。", "story"),
      card("ablution", "洗淨；潔禮", "清洗池", "Do ablution: clean identifiers before share.", "做清洗禮：分享前清識別碼。", "story"),
      card("exit", "出口", "出口燈", "Define exit criteria for interim peeks.", "定義期中偷看的退出標準。", "story"),
      card("withdraw", "撤回", "撤回單", "Withdraw overclaimed papers with a note.", "用說明撤回過度宣稱論文。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Leave hurriedly and secretly:", promptZh: "潛逃溜走：", choices: ["abscond", "resonate", "populate", "diagnose"], answer: "abscond" },
      { id: "q2", type: "sense", promptEn: "Hate; detest:", promptZh: "憎惡：", choices: ["abhor", "surge", "seed", "via"], answer: "abhor" },
      { id: "q3", type: "sense", promptEn: "Temporary suspension; being set aside:", promptZh: "暫緩擱置：", choices: ["abeyance", "autonomy", "epidemic", "opus"], answer: "abeyance" },
    ],
  },
  {
    id: "rhyme-archy-01", type: "rhyme", elementLemma: "-archy/-cracy", priority: "B",
    titleZh: "-archy／-cracy｜體制皇冠館", titleEn: "Archy Crown Gallery",
    hook: "尾韻 -archy/-cracy＝統治體制——皇冠館用一座座「誰說了算」的帽子串記。",
    script: "anarchy 無皇冠。monarchy／patriarchy／matriarchy／oligarchy／hierarchy 各式帽子。democracy／autocracy／bureaucracy／aristocracy／plutocracy 另一排帽子——導覽：hierarchy of evidence；拒 autocracy of one p。",
    reviewHooks: ["-archy/-cracy：anarchy/hierarchy/oligarchy/democracy/bureaucracy/plutocracy", "oligarchy＝寡頭"],
    pitfalls: ["hierarchy＝層級；anarchy＝無政府", "plutocracy＝財閥統治"],
    members: [
      card("anarchy", "無政府；混亂", "無皇冠", "Analysis anarchy starts without a lock date.", "沒有鎖定日就開始分析無政府。"),
      card("monarchy", "君主制", "單冠", "A methods monarchy still needs peer review.", "方法君主制仍需同儕審查。"),
      card("hierarchy", "層級；等級制", "層級帽", "State the hierarchy of outcomes clearly.", "清楚陳述結局層級。"),
      card("oligarchy", "寡頭政治", "寡人帽", "Avoid an oligarchy of unblinded PIs.", "避免非盲 PI 寡頭。"),
      card("matriarchy", "母系制", "母系冠", "Credit matriarchy: who actually kept logs.", "功勞母系制：誰真正維護日誌。"),
      card("patriarchy", "父系制", "父系冠", "Challenge patriarchy of 'senior knows best'.", "挑戰「資深一定對」的父系制。"),
      card("democracy", "民主", "民主帽", "Lab democracy: juniors can veto unsafe peeks.", "實驗室民主：資淺可否決不安全偷看。"),
      card("autocracy", "專制", "專制帽", "Autocracy over code review breeds bugs.", "程式審查專制滋生錯誤。"),
      card("bureaucracy", "官僚體制", "官僚帽", "Good bureaucracy is checklists, not delay.", "好官僚是清單，不是拖延。", "story"),
      card("aristocracy", "貴族統治", "貴族帽", "Citation aristocracy is not validity.", "引用貴族不是效度。", "story"),
      card("plutocracy", "財閥統治", "財閥帽", "Disclose funding to avoid plutocracy vibes.", "揭露資金以避免財閥感。", "story"),
      card("crown", "皇冠", "皇冠道具", "No single metric wears the crown alone.", "沒有單一指標獨戴皇冠。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Rule by a few:", promptZh: "寡頭：", choices: ["oligarchy", "anarchy", "seminar", "neon"], answer: "oligarchy" },
      { id: "q2", type: "sense", promptEn: "Ranked system of levels:", promptZh: "層級：", choices: ["hierarchy", "epidemic", "telemetry", "seed"], answer: "hierarchy" },
      { id: "q3", type: "sense", promptEn: "Government by the wealthy:", promptZh: "財閥統治：", choices: ["plutocracy", "populace", "diameter", "surge"], answer: "plutocracy" },
    ],
  },
  {
    id: "rhyme-claim-01", type: "rhyme", elementLemma: "-claim/-clam", priority: "B",
    titleZh: "-claim／-clam｜呼喊公告欄", titleEn: "Claim Shout Board",
    hook: "尾韻 claim/clam＝呼喊——公告欄專管大喊、收回、喧鬧與免責。",
    script: "exclaim／declaim 大喊朗讀。reclaim 收回失物。clamor／clamorous 喧鬧牆；disclaimer 免責小字——管理員：exclaim uncertainty；clamor 不能取代證據。",
    reviewHooks: ["claim/clam：exclaim/reclaim/declaim/clamor/disclaimer", "clamor＝喧鬧要求"],
    pitfalls: ["exclaim＝驚呼；declaim＝慷慨激昂演說", "disclaimer＝免責聲明"],
    members: [
      card("exclaim", "驚呼；大聲說", "驚呼鈴", "Exclaim caveats in the highlight box.", "在亮點框驚呼但書。"),
      card("reclaim", "收回；開墾", "收回籃", "Reclaim credit only with a public note.", "只在公開說明下收回功勞。"),
      card("declaim", "慷慨激昂地演說", "演說台", "Do not declaim causality from correlations.", "別從相關慷慨激昂演說因果。"),
      card("clamor", "喧鬧；大聲要求", "喧鬧牆", "Clamor for open data, not for miracles.", "喧鬧要求開放資料，不是奇蹟。"),
      card("clamorous", "喧鬧的", "喧鬧標", "Clamorous marketing needs quiet methods.", "喧鬧行銷需要安靜方法。"),
      card("disclaimer", "免責聲明", "免責小字", "A disclaimer cannot replace preregistration.", "免責聲明取代不了預註冊。"),
      card("shout", "喊叫", "喊叫筒", "Shout corrections as loud as launches.", "勘誤要跟上線一樣喊。", "story"),
      card("bulletin", "公告", "公告欄", "Post a bulletin when endpoints change.", "終點變更時貼公告。", "story"),
      card("megaphone", "擴音器", "擴音器", "Use the megaphone for limitations too.", "限制也用擴音器。", "story"),
      card("fineprint", "細則小字", "小字條", "Read the fineprint of exclusion rules.", "讀排除規則細則小字。", "story"),
      card("announcement", "宣布", "宣布卡", "Announcement of freezes beats rumor.", "凍結宣布勝過謠言。", "story"),
      card("outcry", "抗議呼聲", "抗議聲", "Public outcry starts when logs go missing.", "日誌消失時公眾抗議開始。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Noisy demand; uproar:", promptZh: "喧鬧要求：", choices: ["clamor", "hierarchy", "seminal", "via"], answer: "clamor" },
      { id: "q2", type: "sense", promptEn: "Statement denying responsibility:", promptZh: "免責聲明：", choices: ["disclaimer", "diagnosis", "autocrat", "seed"], answer: "disclaimer" },
      { id: "q3", type: "sense", promptEn: "Take back; recover:", promptZh: "收回：", choices: ["reclaim", "abscond", "surge", "populate"], answer: "reclaim" },
    ],
  },
  {
    id: "look-allude-01", type: "lookalike", elementLemma: "allude-elude", priority: "B",
    titleZh: "allude ↔ elude｜暗指迷宮", titleEn: "Allude vs Elude Maze",
    hook: "形近對決：allude＝暗指（點一下），elude＝躲避（溜走）——迷宮裡別走錯門。",
    script: "allusion／allusive 暗指箭頭。elusive／elusion 溜走霧。hint／imply／escape／dodge 客串——管理員：allude to limits；勿 let responsibility elude you。",
    reviewHooks: ["allude＝暗指 → allusion/allusive", "elude＝躲避 → elusive/elusion"],
    pitfalls: ["allude≠elude", "allusion＝典故暗指；illusion＝幻覺（另一組）"],
    members: [
      card("allusion", "暗指；典故", "暗指箭", "Make limitations an allusion readers cannot miss.", "讓限制成為讀者無法錯過的暗指。", "lookalike"),
      card("allusive", "暗指的", "暗指標", "Allusive abstracts still need numbers.", "暗指摘要仍需要數字。", "lookalike"),
      card("elusive", "難捉摸的；躲避的", "溜走霧", "Causal effects are often elusive without design.", "沒有設計時因果效應常難捉摸。", "lookalike"),
      card("elusion", "逃避；躲避", "躲避門", "Elusion of peer review is not strategy.", "逃避同儕審查不是策略。", "lookalike"),
      card("hint", "提示", "提示釘", "A hint in discussion is not a primary claim.", "討論裡的提示不是主要主張。", "story"),
      card("imply", "暗示", "暗示線", "Do not imply causality you did not identify.", "別暗示你沒識別的因果。", "story"),
      card("escape", "逃脫", "逃脫口", "Bugs escape when tests are thin.", "測試薄弱時 bug 會逃脫。", "story"),
      card("dodge", "閃避", "閃避步", "Do not dodge requests for code.", "不要閃避程式碼請求。", "story"),
      card("refer", "提及", "提及牌", "Refer explicitly to the preregistered estimand.", "明確提及預註冊目標量。", "story"),
      card("evade", "規避", "規避道", "Do not evade prereg with vibes.", "別用感覺規避預註冊。", "story"),
      card("slippery", "滑溜的", "滑溜地", "Slippery endpoints invite fishing.", "滑溜終點誘發淘篩。", "story"),
      card("maze", "迷宮", "迷宮圖", "Map the maze of decisions in a DAG or list.", "用 DAG 或清單畫決策迷宮。", "story"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Indirect reference:", promptZh: "暗指：", choices: ["allusion", "elusion", "surge", "neon"], answer: "allusion" },
      { id: "q2", type: "lookalike", promptEn: "Hard to catch; escaping:", promptZh: "難捉摸／躲避：", choices: ["elusive", "allusive", "popular", "trivial"], answer: "elusive" },
      { id: "q3", type: "sense", promptEn: "Act of escaping or avoiding:", promptZh: "逃避：", choices: ["elusion", "allusion", "seminar", "opus"], answer: "elusion" },
    ],
  },
  {
    id: "look-discrete-01", type: "lookalike", elementLemma: "discrete-discreet", priority: "A",
    titleZh: "discrete ↔ discreet｜謹慎分割櫃", titleEn: "Discrete vs Discreet Cabinet",
    hook: "形近對決：discrete＝分離的（一格一格），discreet＝謹慎的（小聲）——櫃子標籤別貼反。",
    script: "discretely 一格一格放。discreetly／indiscreet／discretion／discretionary 小聲、不謹慎、裁量權——管理員：discrete variables；discreet handling of identifiers。",
    reviewHooks: ["discrete＝分離的 → discretely", "discreet＝謹慎的 → discreetly/discretion"],
    pitfalls: ["discrete≠discreet", "discretion＝謹慎／裁量；discretionary＝酌情的"],
    members: [
      card("discretely", "分離地；離散地", "一格一格", "Code categories discretely with clear labels.", "用清楚標籤分離地編碼類別。", "lookalike"),
      card("discreetly", "謹慎地；低調地", "小聲放", "Store identifiers discreetly, encrypted.", "謹慎加密存放識別碼。", "lookalike"),
      card("indiscreet", "不謹慎的", "漏嘴燈", "Indiscreet screenshots leak participants.", "不謹慎截圖洩漏參與者。", "lookalike"),
      card("discretion", "謹慎；裁量", "裁量匣", "Use statistical discretion with pre-rules.", "在預先規則下使用統計裁量。", "lookalike"),
      card("discretionary", "酌情的；任意的", "酌情鈕", "Minimize discretionary outcome swaps.", "最小化酌情結局替換。", "lookalike"),
      card("separate", "分開的", "分開格", "Keep train and test separate.", "訓練與測試分開。", "story"),
      card("careful", "小心的", "小心牌", "Be careful with unblinded interim looks.", "對非盲期中查看要小心。", "story"),
      card("tactful", "得體圓滑的", "得體卡", "Be tactful with juniors who err honestly.", "對誠實犯錯的資淺者得體。", "story"),
      card("compartmentalize", "分隔管理", "分隔櫃", "Compartmentalize exploratory and confirmatory.", "分隔探索與驗證。", "story"),
      card("whisper", "低語", "低語區", "Whisper mode still needs an audit trail.", "低語模式仍需要稽核軌跡。", "story"),
      card("partition", "分割", "分割線", "Partition responsibilities for code review.", "分割程式審查責任。", "story"),
      card("bin", "分箱", "分箱格", "Pre-specify how you bin continuous variables.", "預先指定連續變數如何分箱。", "story"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "In a separate/distinct way:", promptZh: "分離地：", choices: ["discretely", "discreetly", "popularly", "surgically"], answer: "discretely" },
      { id: "q2", type: "lookalike", promptEn: "In a careful, low-key way:", promptZh: "謹慎低調地：", choices: ["discreetly", "discretely", "autocratically", "operatically"], answer: "discreetly" },
      { id: "q3", type: "sense", promptEn: "Left to choice; optional by judgment:", promptZh: "酌情任意的：", choices: ["discretionary", "epidemic", "sonorous", "neon"], answer: "discretionary" },
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
    type: cluster.type === "lookalike" || cluster.type === "semantic" ? "duel" : "family",
    minutes: "12-15",
    clusterId: cluster.id,
    titleZh: cluster.titleZh,
    titleEn: cluster.titleEn,
    flow: [
      { step: 1, name: "鉤子", minutes: 0.5, content: cluster.hook },
      { step: 2, name: "串記劇本", minutes: 2, content: cluster.script },
      { step: 3, name: "詞卡 round", minutes: 7, content: "義錨 → 角色 → 跟讀英／中" },
      { step: 4, name: "快測", minutes: 2, content: "quiz ×3" },
      { step: 5, name: "口令帶走", minutes: 0.5, content: cluster.reviewHooks },
    ],
    quiz: cluster.quiz,
    pitfalls: cluster.pitfalls,
    status: "reviewed",
    qualityGate: { reviewedAt: new Date().toISOString().slice(0, 10), stage: STAGE },
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
    if (!m.speakLineEn || m.speakLineEn.length < 18) issues.push(`speak:${m.headword}`);
    if (!m.speakLineZh) issues.push(`zh:${m.headword}`);
  }
  return issues;
}

const written = [];
const blocked = [];

for (const raw of NEW) {
  if (fs.existsSync(path.join(clusterDir, `${raw.id}.json`))) {
    blocked.push({ id: raw.id, issues: ["already-exists"], members: 0 });
    continue;
  }
  const seen = new Set();
  raw.members = (raw.members || []).filter((m) => {
    if (seen.has(m.headword) || existing.has(m.headword)) return false;
    seen.add(m.headword);
    return true;
  });
  const issues = qualityCheck(raw);
  if (issues.length) {
    blocked.push({ id: raw.id, issues, members: raw.members.length });
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
    priority: raw.priority || "B",
    qualityGate: { reviewedAt: new Date().toISOString().slice(0, 10), stage: STAGE },
  };
  fs.writeFileSync(path.join(clusterDir, `${cluster.id}.json`), `${JSON.stringify(cluster, null, 2)}\n`);
  fs.writeFileSync(
    path.join(lessonDir, `lesson-${cluster.id}.json`),
    `${JSON.stringify(buildLesson({ ...cluster, quiz: raw.quiz }), null, 2)}\n`,
  );
  for (const m of cluster.members) existing.add(m.headword);
  written.push({ id: cluster.id, n: cluster.members.length });
}

const allClusters = fs
  .readdirSync(clusterDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(clusterDir, f), "utf8")))
  .sort((a, b) => a.id.localeCompare(b.id));
const unique = new Set();
for (const c of allClusters) for (const m of c.members || []) unique.add(m.headword);

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
  `${JSON.stringify({ version: "v0.9-p2b06", total: lessonIndex.length, lessons: lessonIndex }, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(humorDir, "index.json"),
  `${JSON.stringify(
    {
      version: "v0.9-p2b06",
      status: "p2-batch06",
      uniqueWords: unique.size,
      clusters: allClusters.map((c) => ({
        id: c.id,
        type: c.type,
        titleZh: c.titleZh,
        status: c.status,
        memberCount: (c.members || []).length,
      })),
      lessons: lessonIndex,
    },
    null,
    2,
  )}\n`,
);

const report = {
  stage: STAGE,
  written: written.length,
  writtenDetail: written,
  blocked,
  totalClusters: allClusters.length,
  uniqueWords: unique.size,
  gapTo2500: Math.max(0, 2500 - unique.size),
  gapTo4000: Math.max(0, 4000 - unique.size),
};

fs.writeFileSync(
  path.join(humorDir, "P2-BATCH06-REPORT.md"),
  `# P2-batch06 完成報告（幽默完整）

| 指標 | 數值 |
|------|------|
| 本批寫入 | **${written.length}** |
| 總家族／課 | **${allClusters.length}** |
| 獨特詞 | **${unique.size}** |
| 距 P2(2500) | **${report.gapTo2500}** |
| 距 4,000 | **${report.gapTo4000}** |

## 本批家族
${written.map((w) => `- \`${w.id}\`（${w.n} 詞）`).join("\n")}

${blocked.length ? `## 未寫入\n${blocked.map((b) => `- ${b.id}: ${b.issues.join(", ")}`).join("\n")}\n` : ""}
## 下一步
- 適度 pending 分流
- 續 P2-batch07（若尚未達 2500）
`,
);

console.log(JSON.stringify(report, null, 2));
