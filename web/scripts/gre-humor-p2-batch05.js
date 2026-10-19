/**
 * P2-batch05: 20 clusters, humor-first (vivid scenes, sticky hooks).
 * node web/scripts/gre-humor-p2-batch05.js
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
const STAGE = "P2-batch05";

const NEW = [
  {
    id: "root-lat-01",
    type: "root",
    elementLemma: "lat",
    priority: "B",
    titleZh: "lat｜側邊快遞局",
    titleEn: "Lat Sideways Courier",
    hook: "字根 lat＝邊／帶——快遞局只走側門：橫向、拉開、連帶責任全包。",
    script:
      "lateral 側滑閃人；relative／relation／relate 把親戚網路連起來。dilate 把瞳孔拉開；elated 開心到飄。collate／collateral／translate 核對、抵押、翻譯——局長：lateral thinking 可以；collateral damage 不行。",
    reviewHooks: ["lat＝邊：lateral/relative/dilate/collate/collateral", "elated＝興高采烈"],
    pitfalls: ["lateral＝側面的；literal＝字面的", "collateral＝附帶／抵押"],
    members: [
      card("lateral", "側面的；橫向的", "側滑閃人", "Try a lateral check, not a louder claim.", "試橫向檢查，不是更大聲主張。"),
      card("relative", "相對的；親戚", "親戚網", "Effect sizes are relative to the baseline.", "效應量相對基準而言。"),
      card("relation", "關係", "連線圖", "State the relation you actually identified.", "說清楚你真正識別的關係。"),
      card("relate", "關聯；敘述", "把線接上", "Relate the result to the preregistered estimand.", "把結果連回預註冊目標量。"),
      card("dilate", "擴張；詳述", "拉開瞳孔", "Do not dilate anecdotes into causal proof.", "別把軼事擴成因果證明。"),
      card("elated", "興高采烈的", "開心飄", "Stay curious when elated by a significant p.", "被顯著 p 沖昏時仍保持好奇。"),
      card("collate", "核對整理", "對表員", "Collate code, data, and codebook before submission.", "投稿前核對程式、資料與編碼簿。"),
      card("translate", "翻譯；轉換", "翻譯官", "Translate methods into plain language for readers.", "把方法翻譯成讀者能懂的話。"),
      card("collateral", "附帶的；抵押品", "附帶傷", "Avoid collateral harm to trust when rushing.", "趕工時避免傷及信任。", "story"),
      card("prelate", "高級神職", "側邊大佬", "Even a prelate of the field needs peer review.", "領域大佬也需要同儕審查。", "story"),
      card("latitudinal", "緯度的；幅度的", "緯線尺", "Report latitudinal variation across sites.", "報告跨站點的幅度差異。", "story"),
      card("sidestep", "側步避開", "側步閃", "Do not sidestep limitations in the discussion.", "討論段不要側步避開限制。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Sideways; of the side:", promptZh: "側面橫向：", choices: ["lateral", "sacred", "pacify", "vagabond"], answer: "lateral" },
      { id: "q2", type: "sense", promptEn: "Joyfully excited:", promptZh: "興高采烈：", choices: ["elated", "evasive", "scanty", "urbane"], answer: "elated" },
      { id: "q3", type: "sense", promptEn: "Secondary; accompanying damage/security:", promptZh: "附帶／抵押：", choices: ["collateral", "salient", "mercenary", "solo"], answer: "collateral" },
    ],
  },
  {
    id: "root-prehend-01",
    type: "root",
    elementLemma: "prehend/prise",
    priority: "B",
    titleZh: "prehend／prise｜抓取鑑識課",
    titleEn: "Prehend Grab Lab",
    hook: "字根 prehend/prise＝抓——鑑識課專抓罪犯、抓重點、抓到驚喜。",
    script:
      "apprehend 抓住嫌犯；comprehend／comprehensive 全面抓住意思。reprehend／reprehensible 抓出來罵。surprise／enterprise／comprise／prize 驚喜、事業、包含、獎杯——教官：apprehensive 可以；reprehensible 造假抓起來。",
    reviewHooks: ["prehend＝抓：apprehend/comprehend/reprehend/surprise/comprise", "reprehensible＝應受譴責"],
    pitfalls: ["apprehend＝逮捕／理解；comprehend＝理解", "comprise＝包含（不是 composed of 的反向乱用）"],
    members: [
      card("apprehend", "逮捕；理解", "抓嫌犯", "Apprehend the confound before you celebrate.", "慶祝前先抓住混淆因子。"),
      card("comprehend", "理解", "抓住意思", "If readers cannot comprehend it, rewrite.", "讀者抓不住意思就重寫。"),
      card("comprehensive", "全面的", "全抓清單", "A comprehensive audit beats a heroic patch.", "全面稽核勝過英雄式修補。"),
      card("reprehend", "譴責", "抓出來罵", "Reprehend silent outcome switching.", "譴責沉默的結局替換。"),
      card("reprehensible", "應受譴責的", "該罵標籤", "Fabrication is reprehensible, full stop.", "捏造應受譴責，句號。"),
      card("apprehensive", "憂慮的", "抓心慌", "Be apprehensive of convenience samples.", "對方便樣本保持憂慮。"),
      card("surprise", "驚喜；使吃驚", "驚喜箱", "Preregistration reduces harmful surprise.", "預註冊減少有害驚喜。"),
      card("enterprise", "事業；進取心", "事業桌", "Treat the project as a public enterprise.", "把專案當公共事業。"),
      card("comprise", "包含", "整包抓住", "The sample should comprise all eligible cases.", "樣本應包含所有合格個案。", "story"),
      card("prize", "獎；珍視", "獎杯", "Prize transparency over theatrical novelty.", "珍視透明勝過表演式新奇。", "story"),
      card("reprisal", "報復", "反抓一擊", "Fear of reprisal kills error reporting.", "怕報復會殺死錯誤回報。", "story"),
      card("prison", "監獄", "關起來", "Do not prison inconvenient nulls in a drawer.", "別把麻煩虛無關進抽屜。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Deserving strong blame:", promptZh: "應受譴責：", choices: ["reprehensible", "lateral", "pacific", "numerous"], answer: "reprehensible" },
      { id: "q2", type: "sense", promptEn: "Understand fully; seize meaning:", promptZh: "全面理解：", choices: ["comprehend", "dilate", "evade", "pacify"], answer: "comprehend" },
      { id: "q3", type: "sense", promptEn: "Anxious; fearful that something is wrong:", promptZh: "憂慮不安：", choices: ["apprehensive", "elated", "urbane", "salient"], answer: "apprehensive" },
    ],
  },
  {
    id: "root-propri-01",
    type: "root",
    elementLemma: "propri",
    priority: "B",
    titleZh: "propri｜產權禮儀社",
    titleEn: "Propri Etiquette Club",
    hook: "字根 propri＝適當／己有——禮儀社專管「這是誰的」與「這樣得體嗎」。",
    script:
      "proper／improper／propriety 得體門禁。property／proprietary／proprietor 產權與老闆章。appropriate／appropriation／expropriate 撥用、挪用、徵收——社長：appropriate methods；improper peeking 趕出門。",
    reviewHooks: ["propri＝適當／己有：proper/property/appropriate/propriety/expropriate", "proprietary＝專有的"],
    pitfalls: ["appropriate＝適當的／撥用；expropriate＝徵收沒收", "propriety＝得體"],
    members: [
      card("proper", "適當的；真正的", "得體證", "Use the proper unit of analysis.", "使用適當的分析單位。"),
      card("improper", "不適當的", "失禮鈴", "Improper unblinding voids the trial spirit.", "不當破盲摧毀試驗精神。"),
      card("propriety", "得體；禮儀", "禮儀手冊", "Scientific propriety includes sharing negatives.", "科學得體包含分享負結果。"),
      card("property", "財產；性質", "產權牌", "State which property of the estimator you care about.", "說清你在意估計式的哪種性質。"),
      card("proprietary", "專有的", "專有鎖", "Prefer open tools over proprietary black boxes.", "寧可開放工具，不要專有黑箱。"),
      card("proprietor", "業主；老闆", "老闆章", "The data proprietor still owes documentation.", "資料業主仍欠文件。"),
      card("appropriate", "適當的；撥用", "撥用章", "Choose an appropriate loss function.", "選擇適當的損失函數。"),
      card("appropriation", "撥款；挪用", "挪用以案", "Silent appropriation of others' code needs citation.", "沉默挪用他人程式碼需引用。"),
      card("expropriate", "徵收；沒收", "徵收令", "Do not expropriate credit from juniors.", "不要徵收資淺者的功勞。", "story"),
      card("ownership", "所有權", "誰的鍋", "Clarify ownership of analysis decisions.", "釐清分析決策的所有權。", "story"),
      card("belongings", "財物", "私人物品", "Keep identifiable belongings out of public dumps.", "可識別個資別丟進公開垃圾桶。", "story"),
      card("etiquette", "禮儀", "禮儀卡", "Lab etiquette: correct the record fast.", "實驗室禮儀：快速更正紀錄。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Correctness of manners; decency:", promptZh: "得體禮儀：", choices: ["propriety", "invasion", "paucity", "salient"], answer: "propriety" },
      { id: "q2", type: "sense", promptEn: "Privately owned; exclusive:", promptZh: "專有的：", choices: ["proprietary", "lateral", "craven", "desolate"], answer: "proprietary" },
      { id: "q3", type: "sense", promptEn: "Take away private property by authority:", promptZh: "徵收沒收：", choices: ["expropriate", "comprehend", "pacify", "navigate"], answer: "expropriate" },
    ],
  },
  {
    id: "root-sacr-01",
    type: "root",
    elementLemma: "sacr/sanct",
    priority: "B",
    titleZh: "sacr／sanct｜聖物保全署",
    titleEn: "Sacr Sanctuary Agency",
    hook: "字根 sacr/sanct＝聖——保全署把「不可碰」的東西貼封印，也抓假虔誠。",
    script:
      "sacred／sacrosanct 貼上聖封。sanctuary／sanctify／saint 庇護所與封聖儀式。sacrifice／sacrificial 獻祭交換；sanction／sanctimonious／consecrate 制裁、假神聖、奉獻——署長：methods 可 sacred；ego 不可 sacrosanct。",
    reviewHooks: ["sacr/sanct＝聖：sacred/sanctuary/sacrifice/sanction/sacrosanct", "sanctimonious＝假虔誠"],
    pitfalls: ["sanction＝批准／制裁（雙義）", "sacrosanct＝神聖不可侵犯"],
    members: [
      card("sacred", "神聖的", "聖封貼紙", "Treat consent as sacred, not optional.", "把同意視為神聖，不是可選。"),
      card("sacrosanct", "神聖不可侵犯的", "禁碰封印", "No hypothesis is sacrosanct after new evidence.", "新證據後沒有假說不可碰。"),
      card("sanctuary", "庇護所；聖殿", "庇護所", "Make the lab a sanctuary for honest doubt.", "讓實驗室成為誠實懷疑的庇護所。"),
      card("sanctify", "使神聖；認可", "封聖章", "Do not sanctify a pipeline just because it is old.", "別因老舊就封聖一條管線。"),
      card("sacrifice", "犧牲；獻祭", "獻祭交換", "Never sacrifice blinding for speed.", "永遠不要為速度犧牲盲法。"),
      card("sacrificial", "犧牲的", "祭品標", "Juniors are not sacrificial authors.", "資淺者不是祭品作者。"),
      card("sanction", "批准；制裁", "批准／制裁章", "Ethics boards sanction protocols, not vibes.", "倫理委員會批准規程，不是感覺。"),
      card("consecrate", "奉獻；使神聖", "奉獻儀式", "Consecrate time for replication, not only novelty.", "把時間奉獻給複現，不只新奇。"),
      card("saint", "聖徒", "聖人海報", "Even a methods saint needs checklists.", "方法聖人仍需要清單。", "story"),
      card("sanctimonious", "假虔誠的", "假神聖臉", "Sanctimonious slogans do not replace audits.", "假虔誠口號取代不了稽核。", "story"),
      card("holy", "神聖的", "口語聖", "Keep a holy distance from unblinded peeks.", "與非盲偷看保持神聖距離。", "story"),
      card("taboo", "禁忌", "禁區牌", "Make outcome switching a lab taboo.", "把結局替換設為實驗室禁忌。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Too sacred to be criticized:", promptZh: "神聖不可侵犯：", choices: ["sacrosanct", "lateral", "mercenary", "scanty"], answer: "sacrosanct" },
      { id: "q2", type: "sense", promptEn: "Hypocritically pious:", promptZh: "假虔誠：", choices: ["sanctimonious", "apprehensive", "pacific", "urbane"], answer: "sanctimonious" },
      { id: "q3", type: "sense", promptEn: "Approve or penalize officially:", promptZh: "批准／制裁：", choices: ["sanction", "comprise", "dilate", "vagabond"], answer: "sanction" },
    ],
  },
  {
    id: "root-sal-01",
    type: "root",
    elementLemma: "sal/sult",
    priority: "B",
    titleZh: "sal／sult｜彈跳諮詢台",
    titleEn: "Sal Bounce Desk",
    hook: "字根 sal/sult＝跳——諮詢台專管跳出重點、跳去罵人、彈回來。",
    script:
      "salient 跳出刺點；sally 衝出去一輪。insult／assail／assault 跳過來攻擊。result／consult／consultant 跳回結果與顧問；resilient／desultory／exult 彈回、跳來跳去、歡躍——台長：salient findings 要報；desultory fishing 禁。",
    reviewHooks: ["sal/sult＝跳：salient/insult/result/consult/resilient/desultory", "desultory＝雜亂跳"],
    pitfalls: ["salient＝顯著突出；silent＝沉默", "desultory＝無計劃跳來跳去"],
    members: [
      card("salient", "顯著的；突出的", "刺點跳出", "Report the salient threat to validity first.", "先報告最突出的效度威脅。"),
      card("sally", "突襲；俏皮話", "衝出去", "One exploratory sally needs a clear label.", "一次探索突襲需要清楚標籤。"),
      card("insult", "侮辱", "跳過來罵", "Do not insult reviewers with hidden exclusions.", "別用隱藏排除侮辱審稿人。"),
      card("assail", "抨擊；襲擊", "跳打", "Assail weak designs, not people.", "抨擊虛弱設計，不是抨擊人。"),
      card("assault", "攻擊", "猛攻", "An assault on p-hacking starts with templates.", "打擊 p 值黑客從模板開始。"),
      card("result", "結果", "跳回結果", "Lock the result definition before looking.", "看之前先鎖定結果定義。"),
      card("consult", "諮詢", "跳去問", "Consult a statistician before clever tricks.", "耍聰明前先諮詢統計師。"),
      card("consultant", "顧問", "顧問鈴", "A consultant cannot replace your prereg.", "顧問取代不了你的預註冊。"),
      card("resilient", "有韌性的", "彈回來", "Build resilient pipelines with tests.", "用測試打造有韌性的管線。", "story"),
      card("resilience", "韌性", "彈力值", "Resilience includes recovering from nulls.", "韌性包含從虛無中恢復。", "story"),
      card("desultory", "雜亂無章的", "跳來跳去", "Desultory analyses look like fishing.", "雜亂分析看起來像淘篩。", "story"),
      card("exult", "歡躍", "跳著慶祝", "Exult after replication, not after one peek.", "複現後再歡躍，不是偷看後。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Most noticeable; jumping out:", promptZh: "顯著突出：", choices: ["salient", "sacred", "solitary", "craven"], answer: "salient" },
      { id: "q2", type: "sense", promptEn: "Jumping about without plan:", promptZh: "雜亂跳換：", choices: ["desultory", "proper", "marine", "intrepid"], answer: "desultory" },
      { id: "q3", type: "sense", promptEn: "Able to spring back:", promptZh: "有韌性：", choices: ["resilient", "reprehensible", "scanty", "vacant"], answer: "resilient" },
    ],
  },
  {
    id: "root-suad-01",
    type: "root",
    elementLemma: "suad",
    priority: "B",
    titleZh: "suad｜勸說廣播站",
    titleEn: "Suad Persuasion Radio",
    hook: "字根 suad＝勸——廣播站用甜嗓勸你，也用冷靜嗓勸你別衝動。",
    script:
      "persuade／persuasion／persuasive 主頻道勸進。suave 滑順主持腔。assuage 安撫聽眾情緒；convince／coax／cajole／wheedle 說服家族客串——台長：persuasive writing 可以；cajole reviewers 用資料，不是奉承。",
    reviewHooks: ["suad＝勸：persuade/persuasion/persuasive/suave/assuage", "assuage＝緩和"],
    pitfalls: ["persuade＝說服；assuage＝減輕（情緒／疼痛）", "suave＝圓滑文雅"],
    members: [
      card("persuade", "說服", "主頻道勸", "Persuade with pre-specified analyses.", "用預先指定分析來說服。"),
      card("persuasion", "說服；信念", "勸說節目", "Change of persuasion needs new evidence.", "改變信念需要新證據。"),
      card("persuasive", "有說服力的", "勸功力", "A persuasive figure still needs uncertainty.", "有說服力的圖仍需不確定性。"),
      card("suave", "圓滑文雅的", "滑順腔", "Suave talks cannot hide messy code.", "圓滑演講藏不住混亂程式碼。"),
      card("assuage", "緩和；安撫", "安撫鍵", "Assuage anxiety with open logs, not spin.", "用開放日誌安撫焦慮，不是話術。"),
      card("convince", "使確信", "說到心坎", "Convince yourself last, readers first.", "最後才說服自己，先說服讀者。", "story"),
      card("coax", "好言勸誘", "溫柔推", "Coax collaborators toward checklists kindly.", "溫柔勸誘合作者使用清單。", "story"),
      card("cajole", "哄騙；甜言", "甜言攻勢", "Do not cajole ethics boards with half-truths.", "別用半真半假哄倫理委員會。", "story"),
      card("wheedle", "用甜言誘騙", "撒嬌騙", "Wheedle-free grants still need rigor.", "不靠撒嬌的補助仍需嚴謹。", "story"),
      card("rhetoric", "修辭", "修辭旋鈕", "Rhetoric amplifies, it does not replace data.", "修辭放大，不取代資料。", "story"),
      card("pitch", "推銷說詞", "推銷稿", "Keep the pitch shorter than the methods.", "推銷稿要比方法段短。", "story"),
      card("softsoap", "灌迷湯", "迷湯桶", "Softsoap cannot repair a broken protocol.", "灌迷湯修不好破掉的規程。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Win someone over by argument:", promptZh: "說服：", choices: ["persuade", "invade", "enumerate", "sacrifice"], answer: "persuade" },
      { id: "q2", type: "sense", promptEn: "Make less severe; soothe:", promptZh: "緩和安撫：", choices: ["assuage", "assail", "exult", "abdicate"], answer: "assuage" },
      { id: "q3", type: "sense", promptEn: "Smoothly charming in manner:", promptZh: "圓滑文雅：", choices: ["suave", "salient", "desolate", "craven"], answer: "suave" },
    ],
  },
  {
    id: "root-vad-01",
    type: "root",
    elementLemma: "vad/vas",
    priority: "B",
    titleZh: "vad／vas｜入侵迴避道",
    titleEn: "Vad Invasion Lane",
    hook: "字根 vad/vas＝走——這條道要嘛衝進去，要嘛滑走開，瀰漫全場。",
    script:
      "invade／invasion／invasive 衝進領地。evade／evasion／evasive 滑走閃答。pervade／pervasive 走遍每個角落；wade 涉水前進——道長：pervasive bias 要清；evasive answers 不及格。",
    reviewHooks: ["vad＝走：invade/evade/pervade/invasive/evasive/pervasive", "pervasive＝瀰漫的"],
    pitfalls: ["evade＝逃避；invade＝入侵", "pervasive＝遍布；persuasive＝有說服力"],
    members: [
      card("invade", "入侵", "衝進去", "Do not invade privacy for a convenience win.", "別為方便入侵隱私。"),
      card("invasion", "入侵", "入侵警報", "An invasion of researcher degrees of freedom.", "研究者自由度入侵警報。"),
      card("invasive", "侵入性的", "侵入標籤", "Prefer less invasive measures when possible.", "可能時優先較少侵入的量測。"),
      card("evade", "逃避；規避", "滑走開", "Do not evade preregistration with vibes.", "別用感覺規避預註冊。"),
      card("evasion", "逃避", "閃躲術", "Evasion in the limitations section is obvious.", "限制段的閃躲很明顯。"),
      card("evasive", "閃爍其詞的", "閃答模式", "Evasive replies trigger deeper review.", "閃爍回覆會觸發更深審查。"),
      card("pervade", "瀰漫；遍布", "走遍全場", "Doubt should pervade extraordinary claims.", "非凡主張該被懷疑瀰漫。"),
      card("pervasive", "遍布的", "全場霧", "Pervasive missingness needs a plan.", "遍布缺失需要計畫。"),
      card("wade", "涉水；吃力前進", "涉水走", "Wade through edge cases before launch.", "上線前涉過邊界案例。", "story"),
      card("intrude", "闖入", "闖入鈴", "Do not intrude on blinded arms mid-study.", "研究中途別闖入盲法臂。", "story"),
      card("trespass", "擅自進入", "越界牌", "Trespass into outcomes only with a plan.", "只在有計畫時進入結局。", "story"),
      card("diffuse", "擴散的", "擴散霧", "Diffuse responsibility kills ownership.", "責任擴散殺死所有權。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Spread throughout:", promptZh: "遍布瀰漫：", choices: ["pervasive", "salient", "proper", "solo"], answer: "pervasive" },
      { id: "q2", type: "sense", promptEn: "Avoid answering directly:", promptZh: "閃爍規避：", choices: ["evasive", "elated", "sacred", "naval"], answer: "evasive" },
      { id: "q3", type: "sense", promptEn: "Enter by force; encroach:", promptZh: "入侵：", choices: ["invade", "persuade", "collate", "pacify"], answer: "invade" },
    ],
  },
  {
    id: "root-mar-01",
    type: "root",
    elementLemma: "mar",
    priority: "C",
    titleZh: "mar｜海事風浪館",
    titleEn: "Mar Sea Hall",
    hook: "字根 mar＝海——風浪館專管海上、水手、潛水與藍色事故。",
    script:
      "marine／maritime／mariner 海上編制。submarine 潛下去偷探。marina 停泊碼頭；ultramarine／aquamarine 藍到發亮——館長：submarine peeks 禁止；maritime logs 要留。",
    reviewHooks: ["mar＝海：marine/maritime/submarine/mariner/marina", "maritime＝海事的"],
    pitfalls: ["marine＝海的；marinate＝醃（無關）", "submarine＝潛水艇／水下的"],
    members: [
      card("marine", "海的；海軍陸戰隊", "海上編制", "Treat multi-site drift like marine currents.", "把多站漂移當海流處理。"),
      card("maritime", "海事的；沿海的", "海事法", "Maritime-level documentation survives storms.", "海事級文件撐得過風暴。"),
      card("submarine", "潛水艇；水下的", "潛下去", "No submarine looks at unblinded outcomes.", "禁止潛水偷看非盲結局。"),
      card("mariner", "水手", "水手日誌", "Every mariner of the pipeline signs the log.", "管線上每個水手都簽日誌。"),
      card("marina", "碼頭；船塢", "停泊處", "Dock raw data in a read-only marina.", "把原始資料停泊在唯讀碼頭。"),
      card("ultramarine", "深藍的", "深藍漆", "Ultramarine claims need ultramarine evidence.", "深藍主張需要深藍證據。", "story"),
      card("aquamarine", "海藍寶石色", "海藍光", "Aquamarine slides still need error bars.", "海藍簡報仍需誤差條。", "story"),
      card("seafaring", "航海的", "航海癖", "Seafaring teams need shared maps of decisions.", "航海團隊需要共享決策地圖。", "story"),
      card("tide", "潮汐", "潮汐表", "Publish with the tide of the data lock, not hype.", "跟著資料鎖定潮汐發表，不是炒作。", "story"),
      card("anchor", "錨", "下錨", "Anchor claims to a commit hash.", "把主張錨到 commit 雜湊。", "story"),
      card("shipwreck", "船難", "船難現場", "A methods shipwreck starts with missing logs.", "方法船難始於缺失日誌。", "story"),
      card("buoy", "浮標", "浮標燈", "Use buoys: milestones that keep the project afloat.", "用浮標：讓專案浮著的里程碑。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Of the sea; seafaring trade:", promptZh: "海事的：", choices: ["maritime", "maternal", "mercenary", "meager"], answer: "maritime" },
      { id: "q2", type: "sense", promptEn: "Underwater vessel; hidden beneath:", promptZh: "潛水／水下：", choices: ["submarine", "sanctuary", "salient", "suave"], answer: "submarine" },
      { id: "q3", type: "sense", promptEn: "Sailor:", promptZh: "水手：", choices: ["mariner", "matron", "patron", "vagabond"], answer: "mariner" },
    ],
  },
  {
    id: "root-mater-01",
    type: "root",
    elementLemma: "mater/matr",
    priority: "C",
    titleZh: "mater／matr｜母系登記處",
    titleEn: "Mater Mother Registry",
    hook: "字根 mater/matr＝母——登記處管母系、婚姻、母校，還有矩陣媽媽。",
    script:
      "maternal／maternity／matron 母性櫃台。matriarch／matriarchal 家族女王。matrimony 結婚登記；alma mater／matrix 母校與矩陣媽媽——登記員：matrix 要可逆；matriarch 也不能免審。",
    reviewHooks: ["mater＝母：maternal/matriarch/matrimony/matron/matrix/alma mater", "matriarch＝女家長"],
    pitfalls: ["maternal＝母親的；paternal＝父親的", "alma mater＝母校"],
    members: [
      card("maternal", "母親的", "母性章", "Maternal leave policies need documented coverage.", "產假政策需要文件化覆蓋。"),
      card("maternity", "母性；產科", "產科窗", "Budget maternity of a project: birth of variables.", "為專案「生產」變數編預算。"),
      card("matriarch", "女家長", "家族女王", "Even the lab matriarch accepts corrections.", "實驗室女家長也接受勘誤。"),
      card("matriarchal", "母系的", "母系制", "Matriarchal credit rules still need transparency.", "母系功勞規則仍需透明。"),
      card("matron", "女監護；成熟女性", "監護人", "A methods matron keeps the codebook tidy.", "方法監護人讓編碼簿整潔。"),
      card("matrimony", "婚姻", "結婚登記", "Code matrimony: merge only with tests.", "程式聯姻：有測試才合併。"),
      card("matrix", "矩陣；母體", "矩陣媽媽", "Show the confusion matrix, not just accuracy.", "展示混淆矩陣，不只正確率。"),
      card("alma", "慈養的（alma mater）", "母校前綴", "Cite your alma mater's open-science rules.", "引用母校的開放科學規則。", "story"),
      card("motherlode", "富礦脈", "主礦脈", "The motherlode is raw data with provenance.", "富礦是帶出處的原始資料。", "story"),
      card("nurture", "養育", "養育箱", "Nurture replications like new litters.", "像養幼崽一樣養育複現。", "story"),
      card("brood", "一窩；憂思", "一窩幼崽", "A brood of related analyses needs a family tree.", "一窩相關分析需要族譜。", "story"),
      card("lineage", "世系", "血統樹", "Track variable lineage across transforms.", "追蹤變數跨轉換的世系。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Female head of a family:", promptZh: "女家長：", choices: ["matriarch", "mariner", "mercenary", "vagabond"], answer: "matriarch" },
      { id: "q2", type: "sense", promptEn: "Marriage:", promptZh: "婚姻：", choices: ["matrimony", "maritime", "paucity", "assault"], answer: "matrimony" },
      { id: "q3", type: "sense", promptEn: "Array; mold; enclosing structure:", promptZh: "矩陣／母體：", choices: ["matrix", "marina", "sally", "suave"], answer: "matrix" },
    ],
  },
  {
    id: "root-merc-01",
    type: "root",
    elementLemma: "merc",
    priority: "C",
    titleZh: "merc｜傭兵商會",
    titleEn: "Merc Hire Guild",
    hook: "字根 merc＝商／報——商會裡有商人、商品，也有只為錢打仗的傭兵。",
    script:
      "merchant／merchandise／mercantile／commerce／commercial 買賣大廳。mercenary 只認錢的刀。mercy／merciful 法外開恩櫃；mercury 滑溜信使——會長：commercial incentives 要揭露；mercenary stats 滾出去。",
    reviewHooks: ["merc＝商／報：merchant/merchandise/mercenary/commerce/mercy", "mercenary＝唯利是圖"],
    pitfalls: ["mercenary＝傭兵／唯利；merciful＝慈悲的", "commerce＝商業"],
    members: [
      card("merchant", "商人", "買賣櫃", "Be a merchant of methods, not of miracles.", "做方法商人，不是奇蹟商人。"),
      card("merchandise", "商品", "貨架", "Do not merchandise p-values as products.", "別把 p 值當商品販售。"),
      card("mercantile", "商業的", "商會風", "Mercantile pressure can distort endpoints.", "商業壓力會扭曲終點。"),
      card("commerce", "商業；往來", "交易廳", "Open science is commerce of scrutiny.", "開放科學是審視的交易。"),
      card("commercial", "商業的；廣告", "廣告燈", "Disclose commercial ties in the paper.", "在論文揭露商業關係。"),
      card("mercenary", "傭兵；唯利是圖的", "只認錢刀", "Mercenary analytic choices chase headlines.", "唯利分析選擇追逐標題。"),
      card("mercy", "慈悲；寬恕", "開恩櫃", "Show no mercy to fabricated rows.", "對捏造列不開恩。"),
      card("merciful", "慈悲的", "慈悲章", "Be merciful to honest mistakes, harsh to cover-ups.", "對誠實錯誤慈悲，對掩蓋嚴厲。"),
      card("mercury", "水銀；信使", "滑溜信使", "Mercury-fast releases still need audits.", "水銀般快速發布仍需稽核。", "story"),
      card("bargain", "交易；便宜貨", "砍價桌", "A bargain with bias is never cheap.", "與偏差討價還價從不便宜。", "story"),
      card("invoice", "發票", "發票單", "Invoice compute costs honestly in grants.", "在補助案誠實開列計算成本。", "story"),
      card("payoff", "報酬；結果", "報酬表", "State the scientific payoff before the press.", "新聞前先說科學報酬。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Motivated only by money:", promptZh: "唯利是圖：", choices: ["mercenary", "maternal", "salient", "intrepid"], answer: "mercenary" },
      { id: "q2", type: "sense", promptEn: "Trade; business exchange:", promptZh: "商業往來：", choices: ["commerce", "sanctuary", "evasion", "solace"], answer: "commerce" },
      { id: "q3", type: "sense", promptEn: "Compassion; leniency:", promptZh: "慈悲寬恕：", choices: ["mercy", "matrix", "assault", "paucity"], answer: "mercy" },
    ],
  },
  {
    id: "root-nav-01",
    type: "root",
    elementLemma: "nav",
    priority: "C",
    titleZh: "nav｜航海調度室",
    titleEn: "Nav Chart Room",
    hook: "字根 nav＝船——調度室管海軍、導航、繞地球一圈，還有暈船。",
    script:
      "navy／naval 艦隊編制。navigate／navigation／navigator／nautical 航海圖與舵手。circumnavigate 繞一圈；astronaut／nausea 太空人與暈船袋——調度：navigate uncertainty；別 circumnavigate 審查。",
    reviewHooks: ["nav＝船：navy/navigate/navigation/nautical/circumnavigate", "nausea＝噁心"],
    pitfalls: ["naval＝海軍的；navel＝肚臍", "circumnavigate＝環航／避開"],
    members: [
      card("navy", "海軍", "艦隊", "Keep a navy of unit tests around the pipeline.", "在管線外圍部署單元測試艦隊。"),
      card("naval", "海軍的", "海軍編制", "Naval discipline: commit messages with cargo lists.", "海軍紀律：commit 訊息附貨物清單。"),
      card("navigate", "航行；導航", "掌舵", "Navigate trade-offs explicitly in the paper.", "在論文明確導航權衡。"),
      card("navigation", "航行；導航", "航圖", "Provide navigation for readers through supplements.", "為讀者提供補充材料航圖。"),
      card("navigator", "航海者；導航者", "舵手", "Appoint a reproducibility navigator.", "指定一位可複現舵手。"),
      card("nautical", "航海的", "航海尺", "Nautical charts beat oral folklore.", "航海圖勝過口頭傳說。"),
      card("circumnavigate", "環航；避開", "繞一圈", "Do not circumnavigate peer review with preprints only.", "別只用預印本繞開同儕審查。"),
      card("astronaut", "太空人", "太空艙", "Be an astronaut of edge cases in staging.", "在測試環境當邊界案例太空人。", "story"),
      card("nausea", "噁心", "暈船袋", "P-hacking should induce methodological nausea.", "p 值黑客應引起方法噁心感。", "story"),
      card("compass", "羅盤", "羅盤針", "Let the protocol be your compass.", "讓規程當你的羅盤。", "story"),
      card("rudder", "舵", "船舵", "Preregistration is the rudder under windy hype.", "預註冊是炒作風中的舵。", "story"),
      card("flotilla", "小艦隊", "小艦隊", "A flotilla of robustness checks escorts the claim.", "穩健檢查小艦隊護送主張。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Steer a course; find a way:", promptZh: "導航航行：", choices: ["navigate", "pacify", "expropriate", "assail"], answer: "navigate" },
      { id: "q2", type: "sense", promptEn: "Sail around; bypass:", promptZh: "環航／避開：", choices: ["circumnavigate", "comprehend", "dilate", "consecrate"], answer: "circumnavigate" },
      { id: "q3", type: "sense", promptEn: "Of ships and sailing:", promptZh: "航海的：", choices: ["nautical", "nuptial", "natal", "neural"], answer: "nautical" },
    ],
  },
  {
    id: "root-numer-01",
    type: "root",
    elementLemma: "numer",
    priority: "C",
    titleZh: "numer｜計數清算櫃",
    titleEn: "Numer Counting Desk",
    hook: "字根 numer＝數——清算櫃把數字排好，也抓「數不清」的誇大。",
    script:
      "numeral／numerator／numerous／innumerable 數字柜台。enumerate／enumeration 逐一點名。supernumerary 編制外多餘；numerology 把數字當玄學——櫃員：enumerate exclusions；拒 numerology 式解讀。",
    reviewHooks: ["numer＝數：numeral/numerous/enumerate/innumerable/numerator", "enumerate＝列舉"],
    pitfalls: ["innumerable＝無數的；numerous＝許多的", "numerator＝分子"],
    members: [
      card("numeral", "數字", "數字牌", "Define the numeral coding before collection.", "收集前定義數字編碼。"),
      card("numerous", "許多的", "很多櫃", "Numerous robustness checks beat one lucky p.", "許多穩健檢查勝過一個幸運 p。"),
      card("enumerate", "列舉；點數", "逐一點名", "Enumerate every exclusion with counts.", "列舉每次排除並附計數。"),
      card("enumeration", "列舉；清點", "清點表", "Publish the enumeration of deviations.", "公開偏離的清點表。"),
      card("innumerable", "無數的", "數不清堆", "Innumerable post-hoc tweaks destroy credibility.", "無數事後微調摧毀可信度。"),
      card("numerator", "分子", "分數上方", "Keep the numerator definition locked.", "鎖定分子定義。"),
      card("supernumerary", "多餘的；編制外", "多餘名額", "Cut supernumerary outcomes early.", "及早砍掉多餘結局。"),
      card("numerology", "數字命理", "玄學算命", "Do not practice p-value numerology.", "不要搞 p 值數字命理。", "story"),
      card("tally", "計數；記分", "正字記分", "Tally decisions in a living protocol.", "在活的規程裡記分決策。", "story"),
      card("census", "普查", "普查表", "Run a census of variables before modeling.", "建模前做變數普查。", "story"),
      card("headcount", "人數清點", "人頭數", "Report headcount at each exclusion step.", "每步排除報告人頭數。", "story"),
      card("arithmetic", "算術", "算術板", "Show the arithmetic behind composite scores.", "展示複合分數背後的算術。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "List one by one; count off:", promptZh: "列舉點數：", choices: ["enumerate", "evade", "exult", "elate"], answer: "enumerate" },
      { id: "q2", type: "sense", promptEn: "Too many to count:", promptZh: "無數的：", choices: ["innumerable", "lateral", "suave", "craven"], answer: "innumerable" },
      { id: "q3", type: "sense", promptEn: "Extra beyond the needed number:", promptZh: "多餘編制外：", choices: ["supernumerary", "sanctimonious", "maritime", "maternal"], answer: "supernumerary" },
    ],
  },
  {
    id: "root-paci-01",
    type: "root",
    elementLemma: "paci",
    priority: "C",
    titleZh: "paci｜和解談判桌",
    titleEn: "Paci Peace Table",
    hook: "字根 paci＝和平——談判桌把怒火按下去，簽停戰，也識破假和平。",
    script:
      "pacify／pacific／pacifist／pacifism 和解小組。peace／pax 停戰旗。truce／armistice／placid／calm 停火與平靜客串——主席：pacify conflicts with data；假 pacific 微笑不改錯，無效。",
    reviewHooks: ["paci＝和平：pacify/pacific/pacifist/pacifism/peace", "pacify＝平息"],
    pitfalls: ["pacific＝和平的／太平洋", "pacifist＝和平主義者"],
    members: [
      card("pacify", "平息；安撫", "按住怒火", "Pacify reviewer concerns with evidence.", "用證據平息審稿疑慮。"),
      card("pacific", "和平的；平和的", "停戰臉", "Keep a pacific tone while defending methods.", "捍衛方法時保持平和語氣。"),
      card("pacifist", "和平主義者", "反戰牌", "Be a pacifist toward people, a hawk toward bias.", "對人和平，對偏差強硬。"),
      card("pacifism", "和平主義", "和平綱領", "Methodological pacifism is not ignoring fraud.", "方法和平主義不是忽視造假。"),
      card("peace", "和平", "停戰旗", "Make peace with null results by publishing them.", "用發表與虛無結果和解。"),
      card("pax", "和平；平安", "Pax 印章", "Declare a pax on outcome renaming midstream.", "對中途改結局名稱下停戰令。", "story"),
      card("truce", "休戰", "休戰協定", "Call a truce: freeze the analysis plan.", "喊休戰：凍結分析計畫。", "story"),
      card("armistice", "停戰協定", "停戰書", "Sign an armistice with endless tweaking.", "與無盡微調簽停戰。", "story"),
      card("placid", "平靜的", "平靜湖", "Placid writing can still carry sharp claims.", "平靜文筆仍可承載尖銳主張。", "story"),
      card("calm", "冷靜的", "冷靜鍵", "Stay calm when the primary endpoint fails.", "主要終點失敗時保持冷靜。", "story"),
      card("reconcile", "和解；核對一致", "對帳和解", "Reconcile codebook and code before lock.", "鎖定前和解編碼簿與程式。", "story"),
      card("ceasefire", "停火", "停火線", "A ceasefire on debate needs shared numbers.", "辯論停火需要共享數字。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Make calm; soothe anger:", promptZh: "平息安撫：", choices: ["pacify", "invade", "assail", "exult"], answer: "pacify" },
      { id: "q2", type: "sense", promptEn: "Peaceful; tranquil:", promptZh: "和平平和：", choices: ["pacific", "pervasive", "mercenary", "desultory"], answer: "pacific" },
      { id: "q3", type: "sense", promptEn: "Person opposed to war:", promptZh: "和平主義者：", choices: ["pacifist", "mariner", "proprietor", "consultant"], answer: "pacifist" },
    ],
  },
  {
    id: "root-pater-01",
    type: "root",
    elementLemma: "pater/patr",
    priority: "C",
    titleZh: "pater／patr｜父系贊助會",
    titleEn: "Pater Patron Club",
    hook: "字根 pater/patr＝父——贊助會管父系、愛國、贊助人，也管「 dur patronizing」。",
    script:
      "paternal／paternity／patriarch 父系大廳。patriot／patriotic 愛國啦啦隊。patron／patronage／patronize 贊助與屈尊俯就；expatriate／repatriate  expatriate 出走、送回——會長：patronize juniors 零分；patron open tools。",
    reviewHooks: ["pater/patr＝父：paternal/patriarch/patriot/patron/patronize/expatriate", "patronize＝贊助／屈尊"],
    pitfalls: ["patronize＝贊助或擺出恩賜態度（雙義）", "expatriate＝移居國外者"],
    members: [
      card("paternal", "父親的", "父系章", "Paternal leave is part of lab sustainability.", "陪產假是實驗室永續一環。"),
      card("paternity", "父性；父權身份", "父職窗", "Claim paternity of errors as well as wins.", "錯誤與勝利都要認父職。"),
      card("patriarch", "家長；元老", "元老椅", "The patriarch still submits to prereg.", "元老仍服從預註冊。"),
      card("patriot", "愛國者", "啦啦隊", "Be a patriot of rigor, not of brands.", "做嚴謹的愛國者，不是品牌的。"),
      card("patriotic", "愛國的", "愛國燈", "Patriotic loyalty to a method can blind you.", "對方法的愛國忠誠會致盲。"),
      card("patron", "贊助人；主顧", "贊助章", "Thank patrons without selling conclusions.", "感謝贊助人但不出賣結論。"),
      card("patronage", "贊助；恩庇", "恩庇網", "Disclose patronage that could bias design.", "揭露可能偏差設計的贊助。"),
      card("patronize", "贊助；屈尊對待", "屈尊臉", "Do not patronize readers with hand-waving.", "別用含糊其辭屈尊對待讀者。"),
      card("expatriate", "移居國外者", "出走者", "Expatriate datasets need local ethics care.", "出境資料集需要在地倫理照護。", "story"),
      card("repatriate", "遣返；送回本國", "送回國", "Repatriate cleaned data to a locked vault.", "把清乾淨資料送回鎖定庫。", "story"),
      card("sponsor", "贊助者", "贊助條", "Name the sponsor beside the conflict box.", "在利益衝突旁寫明贊助者。", "story"),
      card("benefactor", "捐助者", "捐助碑", "A benefactor cannot buy a preferred p.", "捐助者買不到偏好的 p。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Treat condescendingly; or support as sponsor:", promptZh: "屈尊／贊助：", choices: ["patronize", "pacify", "enumerate", "navigate"], answer: "patronize" },
      { id: "q2", type: "sense", promptEn: "Male head of family; founding elder:", promptZh: "家長元老：", choices: ["patriarch", "matriarch", "mariner", "vagabond"], answer: "patriarch" },
      { id: "q3", type: "sense", promptEn: "Person living outside their native country:", promptZh: "移居國外者：", choices: ["expatriate", "proprietor", "pacifist", "numeral"], answer: "expatriate" },
    ],
  },
  {
    id: "root-urb-01",
    type: "root",
    elementLemma: "urb",
    priority: "C",
    titleZh: "urb｜城市風度局",
    titleEn: "Urb City Manners Bureau",
    hook: "字根 urb＝城——風度局管都市、郊區，還有「urbane」那種都會禮貌。",
    script:
      "urban／suburb／suburban／exurb／interurban 城市圈規劃。urbane／urbanity 都會風度課——局長：urbane rebuttals 可以；suburban folklore 不能當方法。",
    reviewHooks: ["urb＝城：urban/suburb/urbane/urbanity/suburban", "urbane＝溫文都會的"],
    pitfalls: ["urbane＝溫文爾雅；urban＝都市的", "suburb＝郊區"],
    members: [
      card("urban", "都市的", "都市圈", "Urban multi-site studies need site effects.", "都市多站研究需要站點效應。"),
      card("suburb", "郊區", "郊區站", "Do not hide exclusions in a suburb of the appendix.", "別把排除藏在附錄郊區。"),
      card("suburban", "郊區的", "郊區風", "Suburban convenience samples limit transport.", "郊區方便樣本限制外推。"),
      card("urbane", "溫文都會的", "風度課", "Urbane critique still names the error.", "溫文批評仍要點名錯誤。"),
      card("urbanity", "都雅；禮數", "禮數手冊", "Urbanity without honesty is empty polish.", "沒有誠實的都雅是空拋光。"),
      card("exurb", "遠郊", "遠郊帶", "Exurb collaborators need shared time zones rules.", "遠郊合作者需要共享時區規則。", "story"),
      card("interurban", "城際的", "城際線", "Interurban replication networks share protocols.", "城際複現網絡共享規程。", "story"),
      card("civic", "市民的", "市民約", "Civic duty: correct the public record.", "市民義務：更正公開紀錄。", "story"),
      card("metropolitan", "大都市的", "大都會", "Metropolitan claims need metropolitan evidence.", "大都會主張需要大都會證據。", "story"),
      card("downtown", "市中心", "市中心檔", "Keep primary results downtown, not in footnotes.", "主要結果放市中心，不放腳註。", "story"),
      card("skyline", "天際線", "天際線", "Your skyline of figures should show uncertainty.", "圖表天際線應顯示不確定性。", "story"),
      card("boulevard", "大道", "林蔭道", "Make the analysis boulevard one-way and signed.", "讓分析大道單向且有路標。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Refined and polite in a city way:", promptZh: "溫文都會：", choices: ["urbane", "urban", "craven", "scanty"], answer: "urbane" },
      { id: "q2", type: "sense", promptEn: "Residential area outside a city:", promptZh: "郊區：", choices: ["suburb", "matrix", "sanction", "prize"], answer: "suburb" },
      { id: "q3", type: "sense", promptEn: "Polished manners; city polish:", promptZh: "都雅禮數：", choices: ["urbanity", "paucity", "invasion", "nausea"], answer: "urbanity" },
    ],
  },
  {
    id: "root-vag-01",
    type: "root",
    elementLemma: "vag",
    priority: "C",
    titleZh: "vag｜遊蕩迷路站",
    titleEn: "Vag Wander Station",
    hook: "字根 vag＝遊——迷路站收留遊民、揮霍旅人，也抓「話太散」的分析。",
    script:
      "vagrant／vagrancy／vagabond 遊民接待。extravagant／extravagance 揮霍旅費。divagate 離題散步；roam／ramble／meander 閒晃客串——站長：extravagant claims 要收據；divagate 可以，但要標探索。",
    reviewHooks: ["vag＝遊：vagrant/vagabond/extravagant/extravagance/divagate", "extravagant＝過度揮霍"],
    pitfalls: ["extravagant＝過度的；extra＝額外的", "vagabond＝流浪漢"],
    members: [
      card("vagrant", "流浪的；遊民", "遊民牌", "Vagrant hypotheses need a shelter: prereg.", "流浪假說需要庇護所：預註冊。"),
      card("vagrancy", "遊蕩；流浪罪", "遊蕩罪", "Statistical vagrancy is unplanned wandering.", "統計遊蕩就是無計畫閒晃。"),
      card("vagabond", "流浪漢", "背包客", "A methods vagabond still carries a notebook.", "方法流浪漢仍要帶筆記本。"),
      card("extravagant", "過度的；揮霍的", "揮霍旅費", "Extravagant claims need extravagant evidence.", "過度主張需要過度證據。"),
      card("extravagance", "奢侈；過度", "奢侈帳單", "Cut extravagance in secondary endpoints.", "削減次要終點的奢侈。"),
      card("divagate", "離題；遊走", "離題散步", "Label when you divagate into exploration.", "離題探索時請標註。"),
      card("roam", "漫遊", "漫遊鍵", "Roam the literature, then lock the question.", "先漫遊文獻，再鎖定問題。", "story"),
      card("ramble", "漫談；漫步", "漫談稿", "Do not ramble past the estimand.", "別漫談到目標量之外。", "story"),
      card("meander", "蜿蜒；漫步", "蜿蜒河", "Meander in brainstorming, not in the final code.", "腦力激盪可蜿蜒，最終程式不行。", "story"),
      card("nomadic", "遊牧的", "遊牧帳", "Nomadic analysts sync to one repo nightly.", "遊牧分析師每晚同步到同一 repo。", "story"),
      card("drift", "漂移", "漂流標", "Watch for covariate drift across waves.", "注意跨波次共變數漂移。", "story"),
      card("wayward", "任性迷路的", "任性路", "Wayward tweaks belong in a sandbox.", "任性微調屬於沙盒。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Excessive; spending beyond reason:", promptZh: "過度揮霍：", choices: ["extravagant", "pacific", "salient", "proper"], answer: "extravagant" },
      { id: "q2", type: "sense", promptEn: "Wander from the topic:", promptZh: "離題遊走：", choices: ["divagate", "navigate", "pacify", "collate"], answer: "divagate" },
      { id: "q3", type: "sense", promptEn: "Wandering homeless person:", promptZh: "流浪漢：", choices: ["vagabond", "patriarch", "mariner", "numerator"], answer: "vagabond" },
    ],
  },
  {
    id: "root-sol-01",
    type: "root",
    elementLemma: "sol",
    priority: "B",
    titleZh: "sol｜獨奏日照廳",
    titleEn: "Sol Solo Sun Hall",
    hook: "字根 sol＝獨／日——日照廳既辦獨奏，也開日照；寂寞與陽光同一個票口。",
    script:
      "solo／soloist／solitary／sole 獨奏席。desolate／solace 荒涼與安慰劑。solar／parasol 日照與遮陽傘——廳長：sole primary endpoint；solitary genius 神話退場。",
    reviewHooks: ["sol＝獨／日：solo/solitary/sole/desolate/solace/solar", "desolate＝荒涼的"],
    pitfalls: ["sole＝唯一的；soul＝靈魂", "solace＝安慰"],
    members: [
      card("solo", "獨奏；單獨的", "獨奏席", "No solo decisions on outcome swaps.", "結局替換禁止獨斷。"),
      card("soloist", "獨奏者", "獨奏明星", "Even a star soloist needs an orchestra of checks.", "明星獨奏也需要檢查樂團。"),
      card("solitary", "孤獨的；單獨的", "獨坐椅", "Solitary reanalyses invite silent bias.", "孤獨再分析誘發沉默偏差。"),
      card("sole", "唯一的；鞋底", "唯一票", "Name the sole primary endpoint in ink.", "用墨水寫明唯一主要終點。"),
      card("desolate", "荒涼的；淒涼的", "荒涼場", "A desolate methods section fails readers.", "荒涼的方法段對不起讀者。"),
      card("solace", "安慰", "安慰茶", "Open data is solace after a null.", "開放資料是虛無之後的安慰。"),
      card("solar", "太陽的", "日照燈", "Solar-clear figures beat ornate darkness.", "日照般清晰的圖勝過華麗黑暗。"),
      card("parasol", "陽傘", "遮陽傘", "Use a parasol of sensitivity analyses.", "撑起敏感度分析陽傘。", "story"),
      card("alone", "單獨", "單獨鍵", "Do not decide alone after seeing results.", "看到結果後不要單獨決定。", "story"),
      card("lonely", "寂寞的", "寂寞燈", "Lonely variables still need definitions.", "寂寞變數仍需定義。", "story"),
      card("sunlit", "陽光照射的", "光照面", "Keep assumptions sunlit in the paper.", "讓假設在論文裡被陽光照射。", "story"),
      card("spotlight", "聚光燈", "聚光燈", "Spotlight limitations as brightly as wins.", "限制與勝利一樣用聚光燈。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Only; single and exclusive:", promptZh: "唯一的：", choices: ["sole", "solar", "salient", "suave"], answer: "sole" },
      { id: "q2", type: "sense", promptEn: "Bleak and empty; forsaken:", promptZh: "荒涼淒涼：", choices: ["desolate", "desultory", "pacific", "elated"], answer: "desolate" },
      { id: "q3", type: "sense", promptEn: "Comfort in sorrow:", promptZh: "安慰：", choices: ["solace", "assault", "invasion", "paucity"], answer: "solace" },
    ],
  },
  {
    id: "prefix-para-01",
    type: "prefix",
    elementLemma: "para-",
    priority: "B",
    titleZh: "para-｜旁門異常館",
    titleEn: "Para Side Door Hall",
    hook: "字首 para-＝旁／異常——旁門館收模範、悖論、寄生與改寫版。",
    script:
      "paragon 模範展櫃。paradox／parallel／paradigm 悖論、平行線、範式轉盤。parasite 寄生客；paraphrase／paramount／paranormal／parable 改寫、至上、超常、寓言——館長：paramount clarity；parasite claims 驅除。",
    reviewHooks: ["para-＝旁／異常：paradox/parallel/paradigm/parasite/paragon/paramount", "paragon＝模範"],
    pitfalls: ["paradigm＝範式；paragon＝模範", "paramount＝至上的"],
    members: [
      card("paradox", "悖論", "悖論鏡", "Report the paradox of significant yet tiny effects.", "報告顯著卻微小的悖論。"),
      card("parallel", "平行的；類似的", "平行線", "Run a parallel blinded analysis track.", "跑一條平行盲法分析軌道。"),
      card("paradigm", "範式；典範", "範式轉盤", "A paradigm shift still needs boring audits.", "範式轉移仍需要無聊稽核。"),
      card("parasite", "寄生虫；寄生者", "寄生客", "HARKing is a parasite on honest inquiry.", "HARKing 是誠實探究的寄生虫。"),
      card("paragon", "模範；完美典型", "模範櫃", "Be a paragon of correction speed.", "做勘誤速度的模範。"),
      card("paraphrase", "改述", "改寫台", "Paraphrase claims without changing the estimand.", "改述主張但不改目標量。"),
      card("paramount", "至上的；最重要的", "至上旗", "Transparency is paramount under uncertainty.", "不確定下透明至上。"),
      card("paranormal", "超常的", "超常燈", "Treat extraordinary claims as almost paranormal.", "把非凡主張當近乎超常。", "story"),
      card("parable", "寓言", "寓言箱", "A methods parable: the lab that hid a null.", "方法寓言：那個藏起虛無的實驗室。", "story"),
      card("bypass", "旁路", "旁路門", "Do not bypass consent with technicalities.", "別用技術細節旁路同意。", "story"),
      card("sidekick", "助手；配角", "配角燈", "Secondary endpoints are sidekicks, not leads.", "次要終點是配角，不是主角。", "story"),
      card("outlier", "離群值", "旁門怪人", "Label outliers; do not quietly exile them.", "標註離群值；別安靜放逐。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Model of excellence:", promptZh: "模範典型：", choices: ["paragon", "parasite", "paradox", "suburb"], answer: "paragon" },
      { id: "q2", type: "sense", promptEn: "Supreme; most important:", promptZh: "至上最重要：", choices: ["paramount", "pacific", "scanty", "craven"], answer: "paramount" },
      { id: "q3", type: "sense", promptEn: "Contradictory but true-seeming statement:", promptZh: "悖論：", choices: ["paradox", "patron", "matrix", "buoy"], answer: "paradox" },
    ],
  },
  {
    id: "prefix-pan-01",
    type: "prefix",
    elementLemma: "pan-",
    priority: "B",
    titleZh: "pan-｜全景萬神殿",
    titleEn: "Pan All-View Pantheon",
    hook: "字首 pan-＝全——萬神殿要全景、萬能藥、全面混亂，還有默劇。",
    script:
      "panorama／panoramic 全景窗。panacea 萬能藥攤。pandemonium 全場混亂；pantomime／pandemic／pantheon 默劇、大流行、萬神殿——殿主：panoramic reporting；拒 panacea 口號。",
    reviewHooks: ["pan-＝全：panorama/panacea/pandemonium/pandemic/pantheon", "panacea＝萬靈藥"],
    pitfalls: ["panacea＝萬能藥（常是否定用法）", "pandemonium＝大混亂"],
    members: [
      card("panorama", "全景；概觀", "全景窗", "Give a panorama of limitations, not a footnote.", "給限制全景，不是腳註。"),
      card("panoramic", "全景的", "全景鏡", "Panoramic dashboards still need version pins.", "全景儀表板仍需版本釘選。"),
      card("panacea", "萬靈藥", "萬能藥攤", "There is no panacea model for every dataset.", "沒有適合一切資料的萬靈藥模型。"),
      card("pandemonium", "大混亂", "混亂殿", "Unlogged changes create analytic pandemonium.", "未記錄變更造成分析大混亂。"),
      card("pantomime", "默劇；手勢戲", "默劇場", "Do not pantomime significance without numbers.", "別用手勢默劇表演顯著性。"),
      card("pandemic", "大流行的；疫情", "大流行旗", "Pandemic-speed science still needs brakes.", "大流行速度的科學仍需要煞車。"),
      card("pantheon", "萬神殿；名流群", "萬神殿", "Do not treat celebrity labs as a pantheon beyond review.", "別把明星實驗室當不可審的萬神殿。"),
      card("blanket", "毯子；全面的", "全面毯", "Avoid blanket claims across heterogeneous sites.", "避免對異質站點下全面斷言。", "story"),
      card("wholesale", "批發；全面的", "批發砍", "Wholesale dropping of outliers needs rules.", "批發丟掉離群需要規則。", "story"),
      card("across-the-board", "全面的", "全面板", "Across-the-board significance is a red flag.", "全面顯著是紅旗。", "story"),
      card("omni", "全（口語詞根）", "全字貼", "Omni-claims invite omni-scrutiny.", "全稱主張招來全面審視。", "story"),
      card("everywhere", "到處", "到處燈", "If bias is everywhere, say how you checked.", "若偏差到處都是，說明你怎麼查。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Cure-all; remedy for everything:", promptZh: "萬靈藥：", choices: ["panacea", "paragon", "paucity", "patron"], answer: "panacea" },
      { id: "q2", type: "sense", promptEn: "Wild uproar; chaos everywhere:", promptZh: "大混亂：", choices: ["pandemonium", "panorama", "matrimony", "solace"], answer: "pandemonium" },
      { id: "q3", type: "sense", promptEn: "Wide unbroken view:", promptZh: "全景：", choices: ["panorama", "parasite", "prison", "prize"], answer: "panorama" },
    ],
  },
  {
    id: "sem-scarce-01",
    type: "semantic",
    elementLemma: "scarce-vs-abundant",
    priority: "B",
    titleZh: "稀缺 ↔ 充裕｜倉庫對打",
    titleEn: "Scarce vs Abundant Warehouse Duel",
    hook: "一邊貨架空空（paucity/dearth），一邊貨堆到爆（plethora/copious）——倉管用對打記住語氣。",
    script:
      "稀缺隊：paucity／dearth／scarcity／scanty／meager 喊「不夠」。充裕隊：copious／plethora／myriad／abundance／surplus 喊「太多」。裁判：GRE 常考「看起來很多其實空」或「看起來少其實致命」。",
    reviewHooks: ["稀缺：paucity/dearth/scanty/meager", "充裕：copious/plethora/myriad/abundance"],
    pitfalls: ["paucity＝缺乏；plethora＝過剩", "meager＝貧瘠不足"],
    members: [
      card("paucity", "缺乏；少數", "空貨架", "A paucity of preregistered plans invites chaos.", "預註冊計畫缺乏會引來混亂。", "contrast"),
      card("dearth", "缺乏；飢饉", "缺貨鈴", "There is a dearth of shared negative results.", "共享負結果極度缺乏。", "contrast"),
      card("scarcity", "稀缺", "稀缺標", "Scarcity of degrees of freedom is a feature.", "自由度稀缺是一種特性。", "contrast"),
      card("scanty", "不足的；吝嗇的", "薄薄一層", "Scanty methods detail fails replication.", "方法細節不足無法複現。", "contrast"),
      card("meager", "貧瘠的；不足的", "瘦弱份", "Meager samples need honest limits.", "瘦弱樣本需要誠實界限。", "contrast"),
      card("copious", "豐富的；大量的", "堆滿箱", "Copious notes beat heroic memory.", "豐富筆記勝過英雄式記憶。", "contrast"),
      card("plethora", "過剩；過多", "爆倉堆", "A plethora of endpoints needs correction.", "終點過剩需要校正。", "contrast"),
      card("myriad", "無數；種種", "萬千櫃", "Myriad tweaks without a plan look like fishing.", "無數無計畫微調像淘篩。", "contrast"),
      card("abundance", "充裕", "豐收牌", "Abundance of openness reduces rumor.", "開放充裕減少謠言。", "contrast"),
      card("surplus", "剩餘；過剩", "剩餘倉", "Surplus analyses belong in supplements.", "剩餘分析屬於補充材料。", "story"),
      card("sparse", "稀疏的", "稀疏架", "Sparse data still deserves a full codebook.", "稀疏資料仍值得完整編碼簿。", "story"),
      card("overflow", "溢出", "溢出桶", "Overflow of claims needs a priority list.", "主張溢出需要優先清單。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Shortage; scarcity of supply:", promptZh: "缺乏：", choices: ["paucity", "plethora", "panacea", "paragon"], answer: "paucity" },
      { id: "q2", type: "sense", promptEn: "Excess; overabundance:", promptZh: "過剩：", choices: ["plethora", "dearth", "scanty", "meager"], answer: "plethora" },
      { id: "q3", type: "sense", promptEn: "Plentiful; abundant in quantity:", promptZh: "豐富大量：", choices: ["copious", "craven", "desolate", "lateral"], answer: "copious" },
    ],
  },
  {
    id: "sem-courage-01",
    type: "semantic",
    elementLemma: "courage-vs-cowardice",
    priority: "B",
    titleZh: "勇敢 ↔ 怯懦｜勇氣擂台",
    titleEn: "Courage vs Cowardice Arena",
    hook: "擂台左邊 intrepid／dauntless 往前衝；右邊 craven／timorous 往後縮——記住褒貶語氣。",
    script:
      "勇敢隊：intrepid／dauntless／valorous／plucky／audacious 衝去公開虛無。怯懦隊：craven／timorous／pusillanimous／trepidation／timid 害怕勘誤——裁判：audacious 可以是勇敢或魯莽，看語境。",
    reviewHooks: ["勇敢：intrepid/dauntless/valorous/audacious", "怯懦：craven/timorous/pusillanimous/trepidation"],
    pitfalls: ["audacious＝大膽（可褒可貶）", "pusillanimous＝卑怯的"],
    members: [
      card("intrepid", "無畏的", "無畏衝鋒", "Intrepid reporting includes ugly limitations.", "無畏報告包含難看的限制。", "contrast"),
      card("dauntless", "勇敢無懼的", "不嚇退", "Stay dauntless when the primary fails.", "主要終點失敗時保持無懼。", "contrast"),
      card("valorous", "英勇的", "英勇章", "Valorous science corrects itself in public.", "英勇科學公開自我更正。", "contrast"),
      card("plucky", "有勇氣的；倔強的", "小勇猛", "Plucky juniors should be rewarded for flags.", "倔強資淺者舉旗應被獎勵。", "contrast"),
      card("audacious", "大膽的；放肆的", "大膽跳", "Audacious claims need audacious evidence.", "大膽主張需要大膽證據。", "contrast"),
      card("craven", "懦弱的", "縮回去", "Craven silence after an error is misconduct-adjacent.", "錯誤後懦弱沉默近似不端。", "contrast"),
      card("timorous", "膽怯的", "發抖燈", "Timorous teams hide deviations.", "膽怯團隊隱藏偏離。", "contrast"),
      card("pusillanimous", "卑怯的", "卑怯章", "Pusillanimous leadership punishes messengers.", "卑怯領導懲罰報信者。", "contrast"),
      card("trepidation", "恐懼；惶恐", "惶恐錶", "Trepidation before opening the envelope is healthy.", "打開信封前的惶恐是健康的。", "contrast"),
      card("timid", "膽小的", "膽小鍵", "Timid abstracts that hide uncertainty mislead.", "隱藏不確定的膽小摘要會誤導。", "story"),
      card("bold", "大膽的", "粗體膽", "Be bold about sharing code.", "分享程式碼要大膽。", "story"),
      card("fearless", "無所畏懼的", "無畏貼", "Fearless transparency beats perfect vibes.", "無畏透明勝過完美感覺。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Fearless; bold:", promptZh: "無畏：", choices: ["intrepid", "craven", "scanty", "suave"], answer: "intrepid" },
      { id: "q2", type: "sense", promptEn: "Contemptibly cowardly:", promptZh: "卑怯懦弱：", choices: ["craven", "valorous", "copious", "salient"], answer: "craven" },
      { id: "q3", type: "sense", promptEn: "Fear; nervous dread:", promptZh: "惶恐恐懼：", choices: ["trepidation", "panacea", "matrix", "marina"], answer: "trepidation" },
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
  `${JSON.stringify({ version: "v0.9-p2b05", total: lessonIndex.length, lessons: lessonIndex }, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(humorDir, "index.json"),
  `${JSON.stringify(
    {
      version: "v0.9-p2b05",
      status: "p2-batch05",
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
  path.join(humorDir, "P2-BATCH05-REPORT.md"),
  `# P2-batch05 完成報告（幽默完整）

| 指標 | 數值 |
|------|------|
| 本批寫入 | **${written.length}** |
| 總家族／課 | **${allClusters.length}** |
| 獨特詞 | **${unique.size}** |
| 距 P2(2500) | **${report.gapTo2500}** |
| 距 4,000 | **${report.gapTo4000}** |

## 本批家族（幽默優先：場景人設＋串記劇本）

${written.map((w) => `- \`${w.id}\`（${w.n} 詞）`).join("\n")}

${blocked.length ? `## 未寫入\n${blocked.map((b) => `- ${b.id}: ${b.issues.join(", ")}`).join("\n")}\n` : ""}
## 品質備註
- 每族：hook／script／members≥8／reviewHooks／pitfalls／lesson＋quiz×3／status: reviewed
- 本批強調「好笑好記」：側邊快遞、抓取鑑識、聖物保全、彈跳諮詢、勸說廣播、倉庫對打、勇氣擂台等場景

## 下一步
- 續 **P2-batch06**；可選 pending 分流
- 推 GitHub：僅在使用者明確要求時
`,
);

console.log(JSON.stringify(report, null, 2));
