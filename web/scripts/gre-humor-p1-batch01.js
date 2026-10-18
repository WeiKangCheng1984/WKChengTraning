/**
 * P1-batch01: ~20 unused A-priority clusters → push unique humor words toward ~700+.
 * Run: node web/scripts/gre-humor-p1-batch01.js
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

const NEW = [
  {
    id: "root-gen-01",
    type: "root",
    elementLemma: "gen",
    priority: "A",
    titleZh: "gen｜基因與天才產房",
    titleEn: "Gen Delivery Room",
    hook: "字根 gen＝生、種——產房專管「生出什麼」。",
    script:
      "congenital 一生下來就帶著；progeny 是子孫產線。ingenious 巧思生出妙招，ingenuous 天真得像剛出生。homogeneous 同種，heterogeneous 雜種混生；engender 催生出結果，genesis 起源故事，genealogy 家譜，genocide 滅種暴行。",
    reviewHooks: ["gen＝生：congenital/progeny/ingenious/ingenuous", "ingenious 巧妙 ≠ ingenuous 天真"],
    pitfalls: ["ingenious（巧妙）≠ ingenuous（天真率直）", "congenital 先天 ≠ congenital 勿寫成 congential"],
    members: [
      card("congenital", "先天的", "一生下來就帶", "Congenital defects need early screening.", "先天缺陷需要早期篩檢。"),
      card("progeny", "後代；子孫", "產線上的子孫", "Ideas leave intellectual progeny in later papers.", "想法在後續論文留下思想後代。"),
      card("ingenious", "巧妙的；機智的", "生出妙招", "An ingenious design saved sample size.", "巧妙設計省下樣本量。"),
      card("ingenuous", "天真的；率直的", "剛出生般天真", "Her ingenuous question exposed the hidden assumption.", "她率直的問題揭開隱藏假設。"),
      card("homogeneous", "同質的", "同種一窩", "A homogeneous sample limits external validity.", "同質樣本限制外部效度。"),
      card("heterogeneous", "異質的", "雜種混生", "Heterogeneous effects hide in average treatment effects.", "異質效應藏在平均處理效應裡。"),
      card("engender", "產生；造成", "催生結果", "Ambiguous rubrics engender grading disputes.", "模糊評分規準催生爭議。"),
      card("genesis", "起源；創始", "起源故事", "The genesis of the theory was a failed replication.", "該理論起源於一次失敗複現。"),
      card("genealogy", "家譜；系譜", "追溯血緣", "A genealogy of methods shows forgotten branches.", "方法系譜顯示被遺忘的分支。"),
      card("genocide", "種族滅絕", "滅種暴行", "The term genocide carries legal and moral weight.", "種族滅絕一詞具有法律與道德重量。"),
      card("generic", "一般的；通用的", "無品牌通種", "Generic advice rarely fits local constraints.", "通用建議很少符合在地限制。", "story"),
      card("indigenous", "本土的；土著的", "當地生出的", "Indigenous knowledge can correct outsider models.", "本土知識能校正外來模型。"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Clever vs naive/sincere:", promptZh: "巧妙 vs 天真：", choices: ["ingenious / ingenuous", "ingenuous / ingenious", "generic / genesis", "progeny / genesis"], answer: "ingenious / ingenuous" },
      { id: "q2", type: "sense", promptEn: "Present from birth:", promptZh: "先天的：", choices: ["congenital", "generic", "engender", "genealogy"], answer: "congenital" },
      { id: "q3", type: "sense", promptEn: "Bring into being:", promptZh: "催生／造成：", choices: ["engender", "genocide", "homogeneous", "progeny"], answer: "engender" },
    ],
  },
  {
    id: "root-leg-01",
    type: "root",
    elementLemma: "leg/lect",
    priority: "A",
    titleZh: "leg／lect｜選讀法庭",
    titleEn: "Select & Read Court",
    hook: "字根 leg/lect＝選、讀、法——法庭又選又讀。",
    script:
      "eligible 有資格被選；illegible 字跡讀不出。negligence 該選注意卻沒選；relegate 貶到次等席。legend 被選出傳頌的故事；legible 清晰可讀。dialect 地方選用的說法；eclectic 精選雜拼；predilection 偏好先選；sacrilege 對聖物不敬的「誤選」。",
    reviewHooks: ["leg/lect＝選讀：eligible/illegible/negligence/relegate", "eligible 有資格 ≠ illegible 難讀"],
    pitfalls: ["eligible（合格）≠ illegible（難辨識）", "relegate＝貶謫／降級，不是 ban"],
    members: [
      card("eligible", "有資格的", "可被選上", "Only preregistered trials were eligible for pooling.", "只有預註冊試驗有資格納入合併。"),
      card("illegible", "難以辨認的", "讀不出來", "Illegible field notes waste months of fieldwork.", "難辨田野筆記浪費數月。"),
      card("negligence", "疏忽；過失", "該注意卻沒選注意", "Negligence in consent forms invites sanctions.", "知情同意疏忽招致處罰。"),
      card("relegate", "貶謫；降級", "選去次等席", "Do not relegate ethics to an appendix.", "不要把倫理貶到附錄。"),
      card("legend", "傳說；圖例", "被選傳頌", "The figure legend must define every symbol.", "圖例必須定義每個符號。", "story"),
      card("legible", "清晰可讀的", "讀得清楚", "Make axis labels legible at slide distance.", "軸標籤在投影距離也要可讀。"),
      card("dialect", "方言；語體", "地方選用說法", "Discipline dialect can exclude outsiders.", "學科語體可能排除外人。"),
      card("eclectic", "兼收並蓄的", "精選雜拼", "An eclectic toolkit still needs coherence.", "兼收並蓄工具箱仍需一貫性。"),
      card("predilection", "偏愛；嗜好", "偏好先選", "A predilection for novelty biases publication.", "嗜新偏愛扭曲發表。"),
      card("sacrilege", "褻瀆神聖", "對聖物誤選不敬", "Treating raw data casually feels like methodological sacrilege.", "隨意對待原始資料像方法論褻瀆。"),
      card("legislature", "立法機關", "制定法條的選民堂", "The legislature funded open-data mandates.", "立法機關資助開放資料強制令。", "story"),
      card("collective", "集體的；集合體", "一起被選進一籃", "Collective action problems stall reforms.", "集體行動困境拖延改革。", "story"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Qualified vs unreadable:", promptZh: "有資格 vs 難讀：", choices: ["eligible / illegible", "illegible / eligible", "legible / legend", "relegate / legend"], answer: "eligible / illegible" },
      { id: "q2", type: "sense", promptEn: "Demote to a lower status:", promptZh: "貶謫／降級：", choices: ["relegate", "eligible", "dialect", "collective"], answer: "relegate" },
      { id: "q3", type: "sense", promptEn: "Strong preference:", promptZh: "偏愛：", choices: ["predilection", "negligence", "sacrilege", "legible"], answer: "predilection" },
    ],
  },
  {
    id: "root-mot-01",
    type: "root",
    elementLemma: "mob/mot/mov",
    priority: "A",
    titleZh: "mot｜動機傳動軸",
    titleEn: "Motive Drive Shaft",
    hook: "字根 mot/mov＝動——傳動軸專管誰在動、為何動。",
    script:
      "motive／motivation 為何而動；emotion 心被帶動。promote 往前推升，demote 往下挪。remote 離得遠；locomotion 移動方式。commotion 一陣騷動；motile 能自己動。immutable 動不了改不了；mobilize 動員起來；momentous 一動就影響重大。",
    reviewHooks: ["mot＝動：motive/emotion/promote/demote/remote", "immutable＝不可更改"],
    pitfalls: ["motive（動機）≠ motif（主題動機／圖案）", "demote ≠ devote"],
    members: [
      card("motive", "動機", "為何而動", "State the motive for excluding outliers.", "說明排除極端值的動機。"),
      card("motivation", "動機；激勵", "推動力", "Intrinsic motivation beats punitive grading.", "內在動機勝過懲罰式評分。"),
      card("emotion", "情緒", "心被帶動", "Emotion can bias risk perception.", "情緒可能扭曲風險知覺。", "story"),
      card("promote", "晉升；促進", "往前推", "Open methods promote cumulative trust.", "開放方法促進累積信任。"),
      card("demote", "降級", "往下挪", "A failed audit can demote a preferred model.", "失敗稽核可把偏好模型降級。"),
      card("remote", "遙遠的；遠端的", "離得遠", "Remote sensing still needs ground truth.", "遙感仍需地面實況。"),
      card("locomotion", "移動；運動", "怎麼移動", "Measure locomotion errors in the robot trial.", "量測機器人試驗的移動誤差。"),
      card("commotion", "騷動；喧鬧", "一陣亂動", "Online commotion is not evidence of effect size.", "網路騷動不是效應量證據。"),
      card("motile", "能運動的", "自己會動", "Motile cells complicate fixed imaging.", "能動細胞讓固定成像變複雜。"),
      card("immutable", "不可更改的", "動不了改不了", "Treat timestamps as immutable once logged.", "時間戳一經記錄即不可改。"),
      card("mobilize", "動員；調動", "發動起來", "Mobilize reviewers early for adversarial checks.", "及早動員審稿人做對抗檢查。"),
      card("momentous", "重大的", "一動影響大", "A momentous protocol change needs versioning.", "重大規程變更需要版本控管。"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Reason for acting:", promptZh: "動機：", choices: ["motive", "remote", "commotion", "motile"], answer: "motive" },
      { id: "q2", type: "sense", promptEn: "Unchangeable:", promptZh: "不可更改：", choices: ["immutable", "mobilize", "demote", "emotion"], answer: "immutable" },
      { id: "q3", type: "sense", promptEn: "Lower in rank:", promptZh: "降級：", choices: ["demote", "promote", "momentous", "locomotion"], answer: "demote" },
    ],
  },
  {
    id: "root-neg-01",
    type: "root",
    elementLemma: "neg",
    priority: "A",
    titleZh: "neg｜否定開關室",
    titleEn: "Negation Switchboard",
    hook: "字根 neg＝否——開關室專管「關掉／否認」。",
    script:
      "negate 直接否定；abnegate 自我否定放棄。renegade 背叛原陣營。negligent／negligible：疏忽 vs 可忽略的小量。renege 食言反悔；denigrate 抹黑貶低。negotiation 討價還價像半否定半妥協；negative 負面開關。",
    reviewHooks: ["neg＝否：negate/abnegate/renegade/renege/denigrate", "negligent 疏忽 ≠ negligible 可忽略"],
    pitfalls: ["negligent（疏忽的人／行為）≠ negligible（小到可忽略）", "renege on a promise＝食言"],
    members: [
      card("negate", "否定；取消", "關掉命題", "One confound can negate the causal claim.", "一個混淆變項能否掉因果主張。"),
      card("abnegate", "放棄；克己", "關掉自己的欲求", "Leaders who abnegate credit build stronger teams.", "放棄邀功的領導者能建更強團隊。"),
      card("renegade", "叛徒；變節者", "否掉原陣營", "A renegade analyst published the null result.", "變節分析者發表了虛無結果。"),
      card("negligent", "疏忽的", "該管卻否掉注意", "Negligent storage of identifiers is a breach.", "識別資料疏忽儲存即違規。"),
      card("negligible", "可忽略的", "小到可否掉不計", "The bias was negligible under sensitivity checks.", "敏感度檢查下偏差可忽略。"),
      card("renege", "食言；違約", "否掉承諾", "Do not renege on data-sharing pledges.", "不要對資料共享承諾食言。"),
      card("denigrate", "詆毀；貶低", "抹黑否定價值", "Do not denigrate qualitative work as soft.", "不要把質性工作抹黑成「軟」。"),
      card("negative", "否定的；陰性的", "負面開關", "A negative finding still updates beliefs.", "陰性發現仍更新信念。", "story"),
      card("abnegation", "放棄；克己", "關掉自我", "Methodological abnegation means dropping pet theories.", "方法論克己意味放下寵物理論。"),
      card("renegotiate", "重新談判", "把否掉的條件再談", "Renegotiate authorship when roles change mid-project.", "角色中途改變時重談作者權。", "story"),
      card("negation", "否定；取消", "否命題本身", "Logical negation flips the claim's truth value.", "邏輯否定翻轉命題真值。"),
      card("self-abnegation", "自我犧牲／克己", "徹底關掉自我", "Self-abnegation can hide coercive lab cultures.", "過度克己可能掩蓋強制實驗室文化。", "story"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Careless vs tiny enough to ignore:", promptZh: "疏忽 vs 可忽略：", choices: ["negligent / negligible", "negligible / negligent", "negate / renege", "denigrate / negate"], answer: "negligent / negligible" },
      { id: "q2", type: "sense", promptEn: "Go back on a promise:", promptZh: "食言：", choices: ["renege", "abnegate", "negative", "negation"], answer: "renege" },
      { id: "q3", type: "sense", promptEn: "Speak ill of; belittle:", promptZh: "詆毀：", choices: ["denigrate", "renegade", "eligible", "remote"], answer: "denigrate" },
    ],
  },
  {
    id: "root-nym-01",
    type: "root",
    elementLemma: "nomen/nym",
    priority: "A",
    titleZh: "nym｜名牌更衣室",
    titleEn: "Name-Tag Locker",
    hook: "字根 nym/nomen＝名——更衣室專管掛什麼名牌。",
    script:
      "anonymous 不掛名；pseudonym 掛假名。synonym 同義名牌，antonym 反義名牌。misnomer 叫錯名；ignominy 臭名。nominal 名義上的；renown 大名。nomenclature 整套命名系統；homonym 同音異義的撞名。",
    reviewHooks: ["nym＝名：anonymous/pseudonym/synonym/antonym/misnomer", "nominal＝名義上"],
    pitfalls: ["misnomer＝名稱不當，不是「失誤」泛稱", "ignominy＝恥辱臭名"],
    members: [
      card("anonymous", "匿名的", "不掛名", "Anonymous review can reduce status bias.", "匿名審查可降低地位偏差。"),
      card("pseudonym", "筆名；假名", "掛假名", "She published under a pseudonym to avoid retaliation.", "她用筆名發表以免報復。"),
      card("synonym", "同義詞", "同義名牌", "A near synonym still shifts tone.", "近義詞仍會改語氣。"),
      card("antonym", "反義詞", "反義名牌", "List the antonym to test if you grasp the scale.", "列出反義詞以檢驗是否掌握尺度。"),
      card("misnomer", "誤稱；用詞不當", "叫錯名", "Calling it a 'pilot' was a misnomer for a full trial.", "稱為試點其實是完整試驗的誤稱。"),
      card("ignominy", "恥辱；臭名", "臭名掛牌", "Fraud brings lasting ignominy to a lab.", "造假給實驗室帶來長久恥辱。"),
      card("nominal", "名義上的；微不足道的", "只掛名", "Nominal authorship without contribution is unethical.", "無貢獻的掛名作者不倫理。"),
      card("renown", "名聲；名望", "大名", "Renown should not exempt anyone from audit.", "名望不該豁免稽核。"),
      card("nomenclature", "命名法；術語體系", "整套名牌規則", "Clarify nomenclature before coding categories.", "編碼類別前先釐清命名。"),
      card("homonym", "同音／同形異義詞", "撞名", "Homonyms confuse automated text classifiers.", "同形異義詞困擾自動分類器。"),
      card("acronym", "首字母縮寫", "縮成名牌", "Define every acronym at first use.", "每個縮寫首次出現要定義。", "story"),
      card("anonymity", "匿名狀態", "不掛名狀態", "Anonymity is hard once raw audio exists.", "有原始音檔時匿名很難。"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Wrong or inaccurate name:", promptZh: "誤稱：", choices: ["misnomer", "synonym", "acronym", "renown"], answer: "misnomer" },
      { id: "q2", type: "sense", promptEn: "In name only:", promptZh: "名義上的：", choices: ["nominal", "anonymous", "antonym", "homonym"], answer: "nominal" },
      { id: "q3", type: "sense", promptEn: "Public disgrace:", promptZh: "恥辱臭名：", choices: ["ignominy", "pseudonym", "nomenclature", "anonymity"], answer: "ignominy" },
    ],
  },
  {
    id: "root-quis-01",
    type: "root",
    elementLemma: "quer/quis",
    priority: "A",
    titleZh: "quis｜尋問徵收處",
    titleEn: "Inquiry Collection Desk",
    hook: "字根 quer/quis＝問、求——徵收處專管追問與索取。",
    script:
      "inquisitive 愛追問；requisite 必要索取物。perquisite 額外津貼（perk）。inquisition 嚴厲審問。acquire 取得；relinquish 放手不求。exquisite 精緻到像精選求得；prerequisite 先決需求；conquistador 歷史上的征服求取者；query 發出查詢。",
    reviewHooks: ["quis＝求問：inquisitive/requisite/perquisite/acquire", "requisite 必要 ≠ perquisite 額外津貼"],
    pitfalls: ["requisite（必要條件）≠ perquisite（特權／津貼）", "inquisition 帶高壓審問色彩"],
    members: [
      card("inquisitive", "好問的；好奇的", "愛追問", "Inquisitive reviewers catch silent exclusions.", "好問審稿人抓到沉默排除。"),
      card("requisite", "必要的；必需品", "必要索取", "Statistical power is a requisite, not a luxury.", "檢定力是必需，不是奢侈。"),
      card("perquisite", "額外津貼；特權", "額外求得", "Travel funds should not become a hidden perquisite.", "差旅費不該變隱藏津貼。"),
      card("inquisition", "審問；調查", "高壓追問", "An ethics inquisition without due process backfires.", "無正當程序的倫理審問會反噬。"),
      card("acquire", "獲得；習得", "求到手上", "Acquire skills before acquiring expensive tools.", "先習得技能再買昂貴工具。"),
      card("relinquish", "放棄；交出", "放手不求", "Relinquish control of randomization to a third party.", "把隨機化控制交給第三方。"),
      card("exquisite", "精緻的；強烈的", "精選求得", "Exquisite instruments still need dirty field tests.", "精緻儀器仍需骯髒田野測試。"),
      card("prerequisite", "先決條件", "先求到才能下一步", "Replication literacy is a prerequisite for meta-analysis.", "複現素養是統合分析先決。"),
      card("query", "詢問；質疑", "發出查詢", "Query the registry for unpublished trials.", "向登錄庫查詢未發表試驗。"),
      card("quest", "探求；任務", "長途求索", "The quest for significance warps designs.", "追求顯著性會扭曲設計。", "story"),
      card("request", "請求", "提出要求", "Request raw data before accepting the narrative.", "接受敘事前先請求原始資料。", "story"),
      card("inquiry", "探究；調查", "正式追問", "Open inquiry beats closed confirmation.", "開放探究勝過封閉確認。"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Necessary vs perk/privilege:", promptZh: "必要 vs 津貼特權：", choices: ["requisite / perquisite", "perquisite / requisite", "query / quest", "acquire / request"], answer: "requisite / perquisite" },
      { id: "q2", type: "sense", promptEn: "Give up; let go:", promptZh: "放棄交出：", choices: ["relinquish", "acquire", "exquisite", "inquisition"], answer: "relinquish" },
      { id: "q3", type: "sense", promptEn: "Curious; fond of asking:", promptZh: "好問：", choices: ["inquisitive", "prerequisite", "quest", "nominal"], answer: "inquisitive" },
    ],
  },
  {
    id: "root-sci-01",
    type: "root",
    elementLemma: "sci",
    priority: "A",
    titleZh: "sci｜知與良心觀測台",
    titleEn: "Knowing Observatory",
    hook: "字根 sci＝知——觀測台專管「知道／良知」。",
    script:
      "science 系統之知；conscious 有意識知道。conscience 良心那盞燈；omniscient 全知。prescient 預先知道；nescient／nescience 無知。plebiscite 全民表決像集體表態所知；unconscionable 違背良心到不可接受。",
    reviewHooks: ["sci＝知：science/conscious/conscience/omniscient/prescient", "conscious 意識 ≠ conscience 良心"],
    pitfalls: ["conscious（有意識）≠ conscience（良心）", "prescient＝有先見之明"],
    members: [
      card("science", "科學", "系統之知", "Science advances by correcting itself.", "科學靠自我校正前進。", "story"),
      card("conscious", "有意識的", "知道自己在知", "Be conscious of researcher degrees of freedom.", "要意識到研究者自由度。"),
      card("conscience", "良心", "道德之知", "A researcher's conscience should stop p-hacking.", "研究者良心應阻止 p 值操弄。"),
      card("omniscient", "全知的", "什麼都知", "No reviewer is omniscient across fields.", "沒有審稿人跨領域全知。"),
      card("prescient", "有先見的", "預先知道", "Her prescient warning about overfitting aged well.", "她對過度擬合的先見經得起時間。"),
      card("nescience", "無知", "不知狀態", "Admit nescience rather than invent certainty.", "承認無知勝過捏造確定。"),
      card("plebiscite", "公民投票", "全民表態所知", "A plebiscite cannot replace technical review.", "公投不能取代技術審查。"),
      card("unconscionable", "良心難安的；過分的", "違背良心", "Withholding adverse results is unconscionable.", "隱瞞不良結果良心難安。"),
      card("self-conscious", "不自在的；自我意識強的", "過度覺察自己", "Self-conscious prose hides weak claims.", "扭捏文風常掩蓋弱主張。", "story"),
      card("subconscious", "潛意識的", "知在水面下", "Subconscious cues still need controlled tests.", "潛意識線索仍需對照試驗。", "story"),
      card("omniscience", "全知", "全知之狀態", "Claims of omniscience belong to theology, not labs.", "全知宣稱屬神學不屬實驗室。"),
      card("scientific", "科學的", "合科學規範", "Scientific humility includes reporting limits.", "科學謙遜包含報告限制。", "story"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Aware vs moral sense:", promptZh: "有意識 vs 良心：", choices: ["conscious / conscience", "conscience / conscious", "science / nescience", "prescient / omniscient"], answer: "conscious / conscience" },
      { id: "q2", type: "sense", promptEn: "Having foresight:", promptZh: "有先見：", choices: ["prescient", "plebiscite", "scientific", "subconscious"], answer: "prescient" },
      { id: "q3", type: "sense", promptEn: "Morally unacceptable:", promptZh: "良心難安／過分：", choices: ["unconscionable", "omniscient", "nescience", "conscious"], answer: "unconscionable" },
    ],
  },
  {
    id: "root-sed-01",
    type: "root",
    elementLemma: "sed/sess/sid",
    priority: "A",
    titleZh: "sed｜久坐議事廳",
    titleEn: "Sitting Assembly Hall",
    hook: "字根 sed/sid＝坐——議事廳誰坐下、誰潛伏。",
    script:
      "sedentary 久坐；sediment 沉下去的渣。reside 住下，president 坐主位。session 一次開會坐下；obsess 坐著不放。assiduous 勤坐苦幹；insidious 潛伏坐下害人。subsidiary 附屬坐下幫忙；dissident 不肯同坐一席的異議者。",
    reviewHooks: ["sed＝坐：sedentary/sediment/reside/session/obsess", "assiduous 勤奮 ≠ insidious 陰險"],
    pitfalls: ["assiduous（勤勉）≠ insidious（陰險漸進）", "obsess＝執著不放"],
    members: [
      card("sedentary", "久坐的；定居少動的", "久坐不動", "Sedentary designs miss real-world motion noise.", "久坐式設計錯過真實移動噪音。"),
      card("sediment", "沉澱物", "沉下去", "Policy sediment accumulates from old rules.", "舊規累積成政策沉澱。"),
      card("reside", "居住；存在於", "住下", "Authority should reside in transparent criteria.", "權威應存在於透明標準。"),
      card("president", "主席；總統", "坐主位", "The society president disclosed funding ties.", "學會主席揭露資助關係。", "story"),
      card("session", "會期；時段", "坐下開會一次", "Each coding session used a blinded codebook.", "每次編碼時段使用盲法碼本。"),
      card("obsess", "使著魔；執念", "坐著不放", "Do not obsess over a single p-threshold.", "不要執念單一 p 門檻。"),
      card("assiduous", "勤勉的", "勤坐苦幹", "Assiduous documentation prevents silent edits.", "勤勉記錄防止沉默修改。"),
      card("insidious", "陰險的；隱伏的", "潛伏坐下害人", "Insidious selection bias grows with convenience samples.", "陰險選擇偏差隨便利樣本成長。"),
      card("subsidiary", "附屬的；子公司", "附屬坐下", "Report subsidiary analyses as exploratory.", "附屬分析標為探索性。"),
      card("dissident", "異議者", "不肯同坐", "Dissident findings deserve the same review rigor.", "異議發現值得同等審查嚴謹。"),
      card("reside in", "在於", "坐落於", "The error may reside in measurement, not theory.", "錯誤可能在測量不在理論。", "story"),
      card("obsession", "執念", "坐著不放的狀態", "An obsession with novelty crowds out replication.", "嗜新執念排擠複現。"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Diligent vs treacherously gradual:", promptZh: "勤勉 vs 陰險隱伏：", choices: ["assiduous / insidious", "insidious / assiduous", "sedentary / sediment", "obsess / session"], answer: "assiduous / insidious" },
      { id: "q2", type: "sense", promptEn: "Sitting a lot; inactive:", promptZh: "久坐少動：", choices: ["sedentary", "dissident", "president", "subsidiary"], answer: "sedentary" },
      { id: "q3", type: "sense", promptEn: "Person who disagrees with authority:", promptZh: "異議者：", choices: ["dissident", "sediment", "reside", "session"], answer: "dissident" },
    ],
  },
  {
    id: "root-sequ-01",
    type: "root",
    elementLemma: "sequ/secut",
    priority: "A",
    titleZh: "sequ｜跟隨追擊隊",
    titleEn: "Sequence Pursuit Squad",
    hook: "字根 sequ＝跟隨——追擊隊專管誰跟在誰後面。",
    script:
      "sequence 順序跟著；consequence 跟著來的後果。subsequent 隨後；consecutive 連續跟著。prosecute 依法追擊，persecute 無理追打。obsequious 諂媚跟太緊；execute 執行跟上命令。segue 平滑接下一段；non sequitur 跟不上邏輯的句子。",
    reviewHooks: ["sequ＝跟：sequence/consequence/subsequent/consecutive", "prosecute 檢控 ≠ persecute 迫害"],
    pitfalls: ["prosecute（起訴／執行）≠ persecute（迫害）", "non sequitur＝推論不接"],
    members: [
      card("sequence", "序列；順序", "排好跟隨", "Report the analysis sequence before peeking.", "偷看前先報告分析序列。"),
      card("consequence", "後果；重要性", "跟著來的結果", "Underpowered studies have scientific consequence.", "檢定力不足有科學後果。"),
      card("subsequent", "隨後的", "跟在後面", "Subsequent replications failed to confirm.", "隨後複現未能確認。"),
      card("consecutive", "連續的", "一個接一個", "Three consecutive nulls lowered confidence.", "連續三次虛無降低信心。"),
      card("prosecute", "起訴；徹查執行", "依法追擊", "Agencies can prosecute data fraud.", "機關可起訴資料詐欺。"),
      card("persecute", "迫害", "無理追打", "Do not persecute whistleblowers.", "不要迫害吹哨者。"),
      card("obsequious", "諂媚的", "跟太緊獻殷勤", "Obsequious citing of celebrities weakens peer review.", "諂媚引用名人削弱同儕審查。"),
      card("execute", "執行；處死", "跟上命令執行", "Execute the preregistered plan without silent swaps.", "執行預註冊計畫、勿沉默替換。"),
      card("segue", "平滑過渡", "接下一段", "Segue from methods to limits without hype.", "從方法平滑接到限制，勿炒作。"),
      card("non sequitur", "不邏輯的推論", "跟不上邏輯", "That slogan is a policy non sequitur.", "那句口號是政策上的不接邏輯。"),
      card("sequential", "依序的", "按序列跟", "Use sequential analysis only with alpha spending.", "序列分析須配合 α 消耗。", "story"),
      card("pursuit", "追求；追趕", "追擊行動", "Blind pursuit of significance wastes cohorts.", "盲目追求顯著性浪費世代。", "story"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Legal chase vs unjust harassment:", promptZh: "檢控 vs 迫害：", choices: ["prosecute / persecute", "persecute / prosecute", "sequence / sequel", "execute / segue"], answer: "prosecute / persecute" },
      { id: "q2", type: "sense", promptEn: "Fawning; overly eager to please:", promptZh: "諂媚：", choices: ["obsequious", "subsequent", "consecutive", "pursuit"], answer: "obsequious" },
      { id: "q3", type: "sense", promptEn: "Coming after:", promptZh: "隨後：", choices: ["subsequent", "prosecute", "execute", "pursuit"], answer: "subsequent" },
    ],
  },
  {
    id: "root-solv-01",
    type: "root",
    elementLemma: "solv/solut",
    priority: "A",
    titleZh: "solv｜溶解與解方實驗室",
    titleEn: "Solvent Lab",
    hook: "字根 solv＝解、鬆——實驗室專管溶解問題與責任。",
    script:
      "solve 解開；dissolve 溶解散去。resolve 下決心解開／決議；absolve 解除罪責。soluble 可溶，solvent 溶劑／有償債力。solution 解方；irresolute 猶豫不解。resolute 堅決；dissolute 放蕩無約束像道德溶解。",
    reviewHooks: ["solv＝解：solve/dissolve/resolve/absolve/soluble", "absolve＝解除罪責"],
    pitfalls: ["resolve 可指決心或決議，看語境", "dissolute＝放蕩，不是 dissolve 的簡單形容詞"],
    members: [
      card("solve", "解決；解答", "解開", "Solve identification before claiming causation.", "宣稱因果前先解決識別問題。"),
      card("dissolve", "溶解；解散", "溶散", "Trust can dissolve after one opaque correction.", "一次不透明勘誤就能溶解信任。"),
      card("resolve", "解決；決心；決議", "下決心解開", "Resolve disputes with shared code, not status.", "用共享程式碼解決爭議，非地位。"),
      card("absolve", "赦免；解除責任", "解開罪責", "A disclaimer does not absolve sloppy measurement.", "免責聲明不解脫草率測量。"),
      card("soluble", "可溶的；可解決的", "可溶解", "Not every conflict is soluble by more data.", "不是每個衝突都能靠更多資料溶解。"),
      card("solvent", "溶劑；有清償力的", "能溶／能償", "A solvent explanation dissolves the paradox.", "有力解釋能溶解悖論。"),
      card("solution", "溶液；解決方案", "解方", "The solution was narrower inclusion criteria.", "解方是更窄的納入標準。", "story"),
      card("irresolute", "猶豫不決的", "解不開決心", "Irresolute leadership stalls preregistration norms.", "猶豫領導拖延預註冊規範。"),
      card("resolute", "堅決的", "決心已解鎖", "Be resolute about sharing negative results.", "對分享陰性結果要堅決。"),
      card("dissolute", "放蕩的", "道德溶解", "A dissolute citation culture ignores primary sources.", "放蕩的引用文化忽略一手來源。"),
      card("resolution", "決議；解析度；決心", "解出來的決定", "Pass a resolution requiring data deposits.", "通過要求寄存資料的決議。", "story"),
      card("insoluble", "不能溶解／解決的", "解不開", "Some ethical trade-offs remain insoluble.", "有些倫理取捨仍然無解。"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Free from blame:", promptZh: "解除罪責：", choices: ["absolve", "dissolve", "soluble", "dissolute"], answer: "absolve" },
      { id: "q2", type: "lookalike", promptEn: "Firm vs hesitant:", promptZh: "堅決 vs 猶豫：", choices: ["resolute / irresolute", "irresolute / resolute", "solve / solution", "solvent / soluble"], answer: "resolute / irresolute" },
      { id: "q3", type: "sense", promptEn: "Morally loose; dissipated:", promptZh: "放蕩：", choices: ["dissolute", "dissolve", "absolve", "solvent"], answer: "dissolute" },
    ],
  },
  {
    id: "root-tend-01",
    type: "root",
    elementLemma: "tend/tens",
    priority: "A",
    titleZh: "tend｜伸張拉力場",
    titleEn: "Tension Field",
    hook: "字根 tend/tens＝伸、張——拉力場專管拉長與張力。（有別於 ten＝握持）",
    script:
      "extend 往外伸；contend 伸拳競爭。distend 脹開；tense／tension 拉緊。intense 強度拉滿；ostensible 表面上伸出來給人看。attend 把注意力伸過去；pretend 假裝伸一套戲。extensive 範圍伸很廣；tendency 傾向往哪伸。",
    reviewHooks: ["tend＝伸：extend/contend/distend/tension/ostensible", "ostensible＝表面上的"],
    pitfalls: ["ostensible＝表面宣稱，常暗示未必真", "contend＝競爭／主張，不是 content"],
    members: [
      card("extend", "延伸；延長", "往外伸", "Extend the follow-up window before claiming durability.", "宣稱持久性前先延長追蹤窗。"),
      card("contend", "競爭；主張", "伸拳爭辯", "Authors contend that bias is bounded.", "作者主張偏差有界。"),
      card("distend", "膨脹；腫脹", "脹開", "Hype can distend expectations beyond evidence.", "炒作會把期望脹到超過證據。"),
      card("tense", "緊張的；時態", "拉緊", "A tense deadline tempts cutting corners.", "緊張期限誘使抄捷徑。"),
      card("tension", "張力；緊張", "拉力", "There is productive tension between speed and rigor.", "速度與嚴謹之間有生產性張力。"),
      card("intense", "強烈的", "拉滿強度", "Intense scrutiny should be fair, not theatrical.", "強烈檢視應公平而非作秀。"),
      card("ostensible", "表面上的", "伸出來給看的理由", "The ostensible reason masked a funding conflict.", "表面理由掩蓋資助利益衝突。"),
      card("attend", "出席；注意", "把注意伸過去", "Attend to missingness patterns early.", "及早注意缺失模式。"),
      card("pretend", "假裝", "伸一套假動作", "Do not pretend uncertainty is settled.", "不要假裝不確定性已解決。", "story"),
      card("extensive", "廣泛的", "伸很廣", "Extensive robustness checks beat a single star.", "廣泛穩健檢查勝過單一星號。"),
      card("tendency", "傾向", "往哪邊伸", "There is a tendency to overfit narratives.", "有對敘事過度擬合的傾向。"),
      card("tensioned", "被拉緊的", "已上拉力", "A tensioned debate clarified operational definitions.", "拉緊的辯論釐清操作型定義。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Apparent; claimed on the surface:", promptZh: "表面上的：", choices: ["ostensible", "extensive", "distend", "tense"], answer: "ostensible" },
      { id: "q2", type: "sense", promptEn: "Argue; compete:", promptZh: "主張／競爭：", choices: ["contend", "attend", "pretend", "extend"], answer: "contend" },
      { id: "q3", type: "sense", promptEn: "Swell; expand outward:", promptZh: "脹開：", choices: ["distend", "tendency", "intense", "tension"], answer: "distend" },
    ],
  },
  {
    id: "root-vinc-01",
    type: "root",
    elementLemma: "vinc/vict",
    priority: "A",
    titleZh: "vinc｜勝敗競技場",
    titleEn: "Victory Arena",
    hook: "字根 vinc/vict＝勝——競技場專管誰被說服、誰被擊敗。",
    script:
      "victor／victory 勝者。convict 定罪勝過辯護；evict 趕出勝出空間。convince 說服取勝；invincible 打不敗。vanquish 徹底打垮；provincial 眼界窄像地方小勝。eviction 驅逐令；conviction 信念／定罪；victorious 勝利的。",
    reviewHooks: ["vict＝勝：victor/convict/evict/convince/invincible/vanquish", "convict 可作動詞定罪或名詞囚犯"],
    pitfalls: ["provincial 常指眼界狹窄，不只「省的」", "conviction＝信念或定罪，看語境"],
    members: [
      card("victor", "勝利者", "勝者", "The victor narrative ignored failed pilots.", "勝者敘事忽略失敗試點。"),
      card("victory", "勝利", "勝局", "A statistical victory is not a policy victory.", "統計勝利不是政策勝利。"),
      card("convict", "定罪；囚犯", "定罪勝過辯護", "You cannot convict a theory on one noisy study.", "不能靠一項嘈雜研究給理論定罪。"),
      card("evict", "驅逐", "趕出", "Evict redundant predictors after justification.", "說明理由後驅逐冗餘預測變項。"),
      card("convince", "說服", "說服取勝", "Graphs convince more than p-values alone.", "圖比單靠 p 值更能說服。"),
      card("invincible", "不可戰勝的", "打不敗", "No method is invincible against bad measurement.", "沒有方法能戰勝糟糕測量。"),
      card("vanquish", "征服；擊敗", "徹底打垮", "New evidence can vanquish a fashionable model.", "新證據能打垮流行模型。"),
      card("provincial", "眼界狹窄的；地方的", "小地方視野", "A provincial reading misses cross-cultural tests.", "狹窄解讀錯過跨文化檢驗。"),
      card("eviction", "驅逐；驅逐令", "趕出程序", "Variable eviction needs pre-specified rules.", "變項驅逐需要預先規則。"),
      card("conviction", "信念；定罪", "堅信／判定有罪", "Write with conviction, revise with doubt.", "寫作帶信念，修改帶懷疑。"),
      card("victorious", "勝利的", "得勝的", "A victorious press release oversold the RCT.", "得勝新聞稿過度銷售隨機試驗。", "story"),
      card("conviction rate", "定罪率", "勝訴統計", "Do not analogize p-hacking to a conviction rate casually.", "不要隨便把 p 操弄類比定罪率。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Persuade:", promptZh: "說服：", choices: ["convince", "evict", "provincial", "victor"], answer: "convince" },
      { id: "q2", type: "sense", promptEn: "Narrow in outlook:", promptZh: "眼界狹窄：", choices: ["provincial", "invincible", "victory", "eviction"], answer: "provincial" },
      { id: "q3", type: "sense", promptEn: "Defeat completely:", promptZh: "徹底擊敗：", choices: ["vanquish", "convict", "convince", "victorious"], answer: "vanquish" },
    ],
  },
  {
    id: "rhyme-ound-01",
    type: "rhyme",
    elementLemma: "-ound",
    priority: "A",
    titleZh: "ound｜回聲競技場",
    titleEn: "The -ound Echo Arena",
    hook: "押韻族 -ound：聲音與困局在場內來回撞。",
    script:
      "profound 深到見底；confound 攪混讓人懵。expound 展開說明；impound 扣押封存。resound 回聲震場；astound 震驚全場。compound 複合加重；rebound 反彈。surround 包圍；abound 充斥。",
    reviewHooks: ["-ound：profound/confound/expound/impound/resound", "confound＝混淆／挫敗"],
    pitfalls: ["confound 統計上＝混淆變項；日常也可「使困惑」", "expound＝闡述，不是 explode"],
    members: [
      card("profound", "深刻的；深奧的", "深到見底", "A profound limit is better admitted early.", "深刻限制最好及早承認。", "phonetic"),
      card("confound", "混淆；挫敗", "攪混懵掉", "Age may confound the treatment association.", "年齡可能混淆處理關聯。", "phonetic"),
      card("expound", "闡述；詳細說明", "展開講", "Expound the identification strategy in plain English.", "用白話闡述識別策略。", "phonetic"),
      card("impound", "扣押；沒收", "封存扣住", "Impound contested datasets until audit ends.", "稽核結束前扣押爭議資料集。", "phonetic"),
      card("resound", "回響；馳名", "回聲震場", "The critique will resound across methods blogs.", "批評會在方法部落格回響。", "phonetic"),
      card("astound", "使震驚", "震場", "Null results can still astound optimistic fields.", "虛無結果仍能震驚樂觀領域。", "phonetic"),
      card("compound", "複合；加重；化合物", "疊加變重", "Missing data can compound selection bias.", "缺失資料會加重選擇偏差。", "phonetic"),
      card("rebound", "反彈", "彈回來", "Effects may rebound after the intervention ends.", "介入結束後效應可能反彈。", "phonetic"),
      card("surround", "包圍", "團團圍住", "Surround claims with uncertainty intervals.", "用不確定區間包圍主張。", "phonetic"),
      card("abound", "大量存在；充滿", "到處都是", "Cautionary tales abound after overclaimed RCTs.", "過度宣稱隨機試驗後警世故事充斥。", "phonetic"),
      card("unbounded", "無界的", "沒圍欄", "Unbounded researcher freedom invites fishing.", "無界研究者自由誘發淘篩。", "story"),
      card("ground", "基礎；地面", "落地根基", "Ground theory in measurement, not vibes.", "把理論落在測量上而非感覺。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Explain in detail:", promptZh: "詳細闡述：", choices: ["expound", "impound", "rebound", "abound"], answer: "expound" },
      { id: "q2", type: "sense", promptEn: "Mix up; be a lurking variable:", promptZh: "混淆：", choices: ["confound", "profound", "resound", "ground"], answer: "confound" },
      { id: "q3", type: "sense", promptEn: "Seize and hold:", promptZh: "扣押：", choices: ["impound", "compound", "surround", "astound"], answer: "impound" },
    ],
  },
  {
    id: "sem-honest-01",
    type: "semantic",
    elementLemma: "honest-vs-deceit",
    priority: "A",
    titleZh: "誠實↔欺瞞｜對打擂台",
    titleEn: "Honesty vs Deceit Duel",
    hook: "語義對打：坦率隊 vs 欺瞞隊——GRE 語氣超愛考。",
    script:
      "坦率隊：candid／candor 直言，sincere 真誠，veracity 真實性。欺瞞隊：guile 狡詐，duplicity 雙面，deceit／deception 欺騙，artifice 伎倆，dissemble 掩飾，feign 佯裝，pretense 偽裝。",
    reviewHooks: ["坦率：candid/candor/sincere/veracity", "欺瞞：guile/duplicity/dissemble/feign"],
    pitfalls: ["dissemble＝掩饰真意，不是 disassemble 拆卸", "candor＝坦率（名詞）"],
    members: [
      card("candid", "坦率的", "直言不諱", "Write a candid limitations section.", "寫一段坦率的限制說明。", "contrast"),
      card("candor", "坦率", "坦率本身", "Candor about uncertainty builds credibility.", "對不確定性的坦率建立可信度。", "contrast"),
      card("sincere", "真誠的", "不裝", "A sincere apology includes corrected data.", "真誠道歉包含更正資料。", "contrast"),
      card("veracity", "真實性", "真假度量", "Check the veracity of secondary citations.", "核對二手引用的真實性。", "contrast"),
      card("guile", "狡詐", "心機牌", "Marketing guile has no place in abstracts.", "行銷狡詐不該出現在摘要。", "contrast"),
      card("duplicity", "口是心非；雙面", "兩張臉", "Duplicity in preregistration destroys trust.", "預註冊口是心非摧毀信任。", "contrast"),
      card("deceit", "欺騙", "騙術", "Statistical deceit often hides in silent exclusions.", "統計欺騙常藏在沉默排除。", "contrast"),
      card("deception", "欺瞞行為", "騙人過程", "Deception in human subjects needs ethics review.", "人體研究欺瞞需倫理審查。", "contrast"),
      card("artifice", "伎倆；巧計", "手法牌", "Rhetorical artifice cannot replace identification.", "修辭伎倆不能取代識別策略。", "contrast"),
      card("dissemble", "掩飾；裝樣子", "藏真意", "Do not dissemble about conflicting interests.", "不要掩飾利益衝突。", "contrast"),
      card("feign", "佯裝", "假裝", "Feign ignorance and you train bad incentives.", "佯裝無知會訓練壞誘因。", "contrast"),
      card("pretense", "偽裝；藉口", "假面具", "Drop the pretense that all findings were predicted.", "放下『全部結果皆預測』的偽裝。", "contrast"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Frankness; openness:", promptZh: "坦率：", choices: ["candor", "guile", "artifice", "pretense"], answer: "candor" },
      { id: "q2", type: "sense", promptEn: "Conceal true feelings:", promptZh: "掩飾真意：", choices: ["dissemble", "candid", "veracity", "sincere"], answer: "dissemble" },
      { id: "q3", type: "sense", promptEn: "Double-dealing:", promptZh: "口是心非：", choices: ["duplicity", "candor", "veracity", "sincere"], answer: "duplicity" },
    ],
  },
  {
    id: "sem-overt-01",
    type: "semantic",
    elementLemma: "overt-vs-covert",
    priority: "A",
    titleZh: "公開↔隱密｜對打擂台",
    titleEn: "Overt vs Covert Duel",
    hook: "語義對打：公開可見 vs 偷偷摸摸——考場超愛對照。",
    script:
      "公開隊：overt 公開，patent／manifest 明顯，transparent 透明。隱密隊：covert 隱蔽，clandestine 祕密，surreptitious／furtive 偷偷摸摸，latent／occult 潛藏，stealth 隱身。",
    reviewHooks: ["公開：overt/patent/manifest/transparent", "隱密：covert/clandestine/surreptitious/furtive"],
    pitfalls: ["overt ↔ covert 成對記", "patent 可指明顯或專利，看語境"],
    members: [
      card("overt", "公開的；明顯的", "擺在明面", "Overt preregistration beats private plans.", "公開預註冊勝過私下計畫。", "contrast"),
      card("covert", "隱蔽的", "藏起來", "Covert multiple testing inflates false positives.", "隱蔽多重檢定膨脹偽陽性。", "contrast"),
      card("clandestine", "祕密的；暗中的", "地下作業", "Clandestine data edits should be impossible.", "暗中改資料應不可能。", "contrast"),
      card("surreptitious", "偷偷摸摸的", "偷溜", "Surreptitious outcome switching is misconduct.", "偷偷更換結局變項是不端。", "contrast"),
      card("furtive", "鬼祟的", "賊兮兮", "Furtive glances at interim results bias stopping.", "鬼祟偷看期中結果扭曲停損。", "contrast"),
      card("patent", "明顯的；專利", "擺明可見", "The flaw was patent in the raw scatterplot.", "缺陷在原始散點圖上很明顯。", "contrast"),
      card("manifest", "明顯的；顯示", "顯現出來", "Bias became manifest after stratification.", "分層後偏差顯現。", "contrast"),
      card("latent", "潛在的；潛伏的", "還沒浮出", "Latent classes need strong identification.", "潛在類別需要強識別。", "contrast"),
      card("occult", "隱秘的；超自然的", "隱而不見", "Do not treat statistical noise as occult wisdom.", "不要把統計噪音當隱秘智慧。", "contrast"),
      card("stealth", "隱密行動；隱身", "悄悄進場", "Stealth revisions without changelogs erode trust.", "無變更紀錄的隱密修訂侵蝕信任。", "contrast"),
      card("transparent", "透明的", "看得穿", "Transparent code is a public good.", "透明程式碼是公共財。", "contrast"),
      card("opaque", "不透明的", "看不穿", "Opaque vendor models block audit.", "不透明廠商模型阻礙稽核。", "contrast"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Open vs hidden:", promptZh: "公開 vs 隱蔽：", choices: ["overt / covert", "covert / overt", "latent / patent", "stealth / manifest"], answer: "overt / covert" },
      { id: "q2", type: "sense", promptEn: "Done secretly; sneaky:", promptZh: "偷偷摸摸：", choices: ["surreptitious", "patent", "manifest", "transparent"], answer: "surreptitious" },
      { id: "q3", type: "sense", promptEn: "Present but not yet visible:", promptZh: "潛在／潛伏：", choices: ["latent", "overt", "clandestine", "opaque"], answer: "latent" },
    ],
  },
  {
    id: "look-emigrate-01",
    type: "lookalike",
    elementLemma: "emigrate-immigrate",
    priority: "A",
    titleZh: "e／im-migrate｜進出海關對決",
    titleEn: "Emigrate vs Immigrate",
    hook: "形近對決：e- 離開 vs im- 進入——方向一反全錯。",
    script:
      "emigrate 從本國遷出；immigrate 遷入他國。migration 遷移總稱；migratory 遷徙的。e- 像 exit，im- 像 into。再加 migrant 遷徙者；transmigration 轉生／轉遷（較少考但好記方向）。",
    reviewHooks: ["emigrate＝遷出；immigrate＝遷入", "e- exit；im- into"],
    pitfalls: ["主語國家不同：從 A emigrate、對 B immigrate", "不要與 migrate 總稱混淆方向"],
    members: [
      card("emigrate", "移出；僑居國外", "離開本國", "Researchers may emigrate when labs lose funding.", "實驗室失資時研究者可能移出。", "lookalike"),
      card("immigrate", "移入", "進入他國", "Talent may immigrate toward open-science hubs.", "人才可能移入開放科學樞紐。", "lookalike"),
      card("migrate", "遷移；移居", "總稱搬遷", "Ideas migrate across disciplines slowly.", "想法跨學科遷移很慢。", "lookalike"),
      card("migration", "遷移；遷徙", "搬遷過程", "Citation migration reveals shifting canons.", "引用遷移顯示經典更迭。", "lookalike"),
      card("migrant", "移居者；候鳥", "遷移的人／物", "Migrant metaphors can obscure legal status.", "移民隱喻可能模糊法律身分。", "lookalike"),
      card("migratory", "遷徙的", "習慣遷移的", "Migratory collaborations follow grant cycles.", "遷徙式合作跟隨補助週期。", "lookalike"),
      card("immigration", "移入；移民政策", "進入側", "Immigration of methods needs local validation.", "方法「移入」需要在地驗證。", "lookalike"),
      card("emigration", "移出", "離開側", "Emigration of talent warns of hostile climates.", "人才移出警告惡劣氣候。", "lookalike"),
      card("transmigrate", "轉生；轉遷", "轉到下一處", "Do not transmigrate conclusions across mismatched populations.", "不要把結論轉遷到不匹配母體。", "lookalike"),
      card("in-migration", "遷入（地區內）", "區域進入", "In-migration of startups changed the city's labs.", "新創遷入改變城市實驗室。", "story"),
      card("out-migration", "遷出（地區內）", "區域離開", "Out-migration followed the factory closures.", "工廠關閉後出現遷出。", "story"),
      card("remigration", "再遷移；回流", "又搬一次", "Remigration of scholars can restart collaborations.", "學者回流可重啟合作。", "story"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Leave a country vs enter a country:", promptZh: "移出 vs 移入：", choices: ["emigrate / immigrate", "immigrate / emigrate", "migrate / migrant", "emigration / migration"], answer: "emigrate / immigrate" },
      { id: "q2", type: "sense", promptEn: "General verb for moving:", promptZh: "遷移總稱：", choices: ["migrate", "emigrate only", "immigrate only", "remigration"], answer: "migrate" },
      { id: "q3", type: "sense", promptEn: "Memory tip: e- is like:", promptZh: "記憶：e- 像：", choices: ["exit", "into", "enter", "import"], answer: "exit" },
    ],
  },
  {
    id: "look-ingenious-01",
    type: "lookalike",
    elementLemma: "ingenious-ingenuous",
    priority: "A",
    titleZh: "ingenious／ingenuous｜巧思 vs 天真對決",
    titleEn: "Ingenious vs Ingenuous",
    hook: "只差一點點拼寫：巧妙機智 vs 天真率直——高頻易混。",
    script:
      "ingenious＝有 ingenuity（巧思）；ingenuous＝近於 naive／candid（天真率直）。再對打：genius 天才氣場，disingenuous 不誠實地裝天真。考試最愛用 ingenuous 考「單純」不是「聰明」。",
    reviewHooks: ["ingenious＝巧妙；ingenuous＝天真率直", "disingenuous＝假惺惺"],
    pitfalls: ["ingenuous 不是 ingenious 的誤拼", "disingenuous＝不真誠"],
    members: [
      card("ingenious", "巧妙的", "巧思牌", "An ingenious randomization device blocked leakage.", "巧妙隨機化裝置擋住洩漏。", "lookalike"),
      card("ingenuous", "天真率直的", "天真牌", "An ingenuous reading missed the sarcasm.", "天真解讀錯過諷刺。", "lookalike"),
      card("ingenuity", "巧思；機智", "巧妙本事", "Methodological ingenuity still needs ethics.", "方法巧思仍需倫理。", "lookalike"),
      card("disingenuous", "不真誠的；假惺惺的", "裝天真", "It is disingenuous to hide exclusions in footnotes.", "把排除藏在腳註是假惺惺。", "lookalike"),
      card("naive", "天真的；幼稚的", "單純鄰居", "A naive model ignored clustering.", "天真模型忽略叢集。", "contrast"),
      card("candor", "坦率", "率直親戚", "Ingenuous candor can still be precise.", "天真式坦率仍可精確。", "contrast"),
      card("artful", "狡猾巧妙的", "巧中帶滑", "Artful wording can mislead without lying.", "狡猾措辭可不說謊卻誤導。", "contrast"),
      card("guileless", "坦率無詭計的", "無心機", "Guileless reporting lists all deviations.", "無心機報告列出全部偏離。", "contrast"),
      card("crafty", "狡猾的", "心機鄰居", "Crafty selective quoting distorts reviews.", "狡猾選擇性引用扭曲評論。", "contrast"),
      card("resourceful", "足智多謀的", "巧妙近親", "Resourceful debugging is not p-hacking.", "足智除錯不是 p 操弄。", "contrast"),
      card("simpleminded", "頭腦簡單的", "過度天真", "Simpleminded averages hide subgroup harm.", "頭腦簡單的平均掩蓋次群傷害。", "contrast"),
      card("sophisticated", "老練精巧的", "反天真", "A sophisticated design still needs plain summary.", "精巧設計仍需白話摘要。", "contrast"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Clever vs innocent/sincere:", promptZh: "巧妙 vs 天真：", choices: ["ingenious / ingenuous", "ingenuous / ingenious", "artful / naive", "crafty / candor"], answer: "ingenious / ingenuous" },
      { id: "q2", type: "sense", promptEn: "Pretending sincerity; insincere:", promptZh: "假惺惺：", choices: ["disingenuous", "ingenuity", "guileless", "resourceful"], answer: "disingenuous" },
      { id: "q3", type: "sense", promptEn: "Cleverness; inventiveness:", promptZh: "巧思：", choices: ["ingenuity", "ingenuous", "simpleminded", "naive"], answer: "ingenuity" },
    ],
  },
  {
    id: "prefix-bene-mal-01",
    type: "prefix",
    elementLemma: "bene-/mal-",
    priority: "A",
    titleZh: "bene↔mal｜好壞雙開關",
    titleEn: "Bene vs Mal Switches",
    hook: "字首 bene＝好、mal＝壞——同一機器兩種開關。",
    script:
      "benevolent 好心腸；benefactor 做好事的金主；benign 良性／和善。對面：malign 惡意中傷，malicious 惡意的，malady 病痛，malfeasance 瀆職惡行，malevolent 惡意的。記法：bene～benefit；mal～malice。",
    reviewHooks: ["bene＝好：benevolent/benefactor/benign", "mal＝壞：malign/malicious/malady/malfeasance"],
    pitfalls: ["benign 醫療＝良性；人格＝和善", "malign 可作動詞「誹謗」或形容詞「惡性的」"],
    members: [
      card("benevolent", "仁慈的", "好開關", "A benevolent funder still demands transparency.", "仁慈金主仍要求透明。", "morphology"),
      card("benefactor", "捐助者；恩人", "做好事的人", "Name the benefactor in acknowledgments honestly.", "在誌謝誠實具名捐助者。", "morphology"),
      card("benign", "良性的；和善的", "無害好性", "Not every anomaly is benign.", "不是每個異常都良性。", "morphology"),
      card("beneficent", "行善的；有益的", "主動行好", "Beneficent defaults nudge better sharing.", "有益預設推動更好共享。", "morphology"),
      card("malign", "誹謗；惡性的", "壞嘴／惡性", "Do not malign critics to dodge critique.", "不要用誹謗評論者來躲避批評。", "morphology"),
      card("malicious", "惡意的", "壞心眼", "Malicious compliance with disclosure can still mislead.", "惡意合規披露仍可能誤導。", "morphology"),
      card("malady", "疾病；弊病", "壞病", "P-hacking is a systemic malady.", "p 操弄是系統性弊病。", "morphology"),
      card("malfeasance", "瀆職；不法行為", "做壞事職權", "Research malfeasance triggers institutional review.", "研究瀆職觸發機構審查。", "morphology"),
      card("malevolent", "惡意的；歹毒的", "壞意圖", "Assume error before assuming malevolent intent.", "先假設錯誤再假設歹毒意圖。", "morphology"),
      card("malediction", "詛咒", "壞嘴咒語", "Online malediction is not peer review.", "網路詛咒不是同儕審查。", "morphology"),
      card("benefit", "益處；受益", "得到好處", "Who benefits from opacity?", "誰從不透明受益？", "story"),
      card("malpractice", "不當執業", "壞執業", "Statistical malpractice includes undisclosed fishing.", "統計不當執業包含未揭露淘篩。", "morphology"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Kind vs spiteful intent:", promptZh: "仁慈 vs 惡意：", choices: ["benevolent / malevolent", "malevolent / benevolent", "benign / benefit", "malady / malign"], answer: "benevolent / malevolent" },
      { id: "q2", type: "sense", promptEn: "Wrongdoing by an official/professional:", promptZh: "瀆職／不法：", choices: ["malfeasance", "benefactor", "benign", "benefit"], answer: "malfeasance" },
      { id: "q3", type: "sense", promptEn: "Mild; not harmful (often medical):", promptZh: "良性／和善：", choices: ["benign", "malicious", "malady", "malediction"], answer: "benign" },
    ],
  },
  {
    id: "prefix-pre-01",
    type: "prefix",
    elementLemma: "pre-",
    priority: "A",
    titleZh: "pre-｜預先倒數計時器",
    titleEn: "Pre- Countdown",
    hook: "字首 pre-＝在前／預先——開跑前先倒數。",
    script:
      "precede 走在前面；preclude 預先排除。precept 訓誡規矩；preamble 前言。prelude 序曲；precursor 前驅。prognosis／prognosticate 預後／預言（pro 也常「向前」）。anticipate 預先設想；preemptive 先發制人。",
    reviewHooks: ["pre-＝預先：precede/preclude/precept/preamble/prelude", "precede＝在前；proceed＝繼續前進"],
    pitfalls: ["precede（先於）≠ proceed（繼續）", "preclude＝使不可能／排除"],
    members: [
      card("precede", "先於；在……之前", "走在前面", "Preregistration should precede data collection.", "預註冊應先於資料收集。", "morphology"),
      card("preclude", "排除；使不可能", "預先擋掉", "Missing consent precludes publication.", "缺少同意就排除發表可能。", "morphology"),
      card("precept", "戒律；準則", "預先規矩", "A core precept: never silent-swap outcomes.", "核心準則：永不沉默替換結局。", "morphology"),
      card("preamble", "序言；前言", "開場前言", "The statute's preamble states the purpose.", "法條前言陳述目的。", "morphology"),
      card("prelude", "序曲；前奏", "開場序曲", "The leaked memo was a prelude to retraction.", "外洩備忘錄是撤稿前奏。", "morphology"),
      card("precursor", "前驅；先兆", "前面那個", "A small bias can be a precursor to collapse.", "小偏差可能是崩盤先兆。", "morphology"),
      card("prognosis", "預後；展望", "預先判斷走向", "Give a sober prognosis, not a sales pitch.", "給清醒預後，不是銷售稿。", "morphology"),
      card("prognosticate", "預言；預測", "預先說結果", "Do not prognosticate from underpowered pilots.", "不要用低檢定力試點預言。", "morphology"),
      card("anticipate", "預期；預先考慮", "先想到", "Anticipate reviewer objections in the cover letter.", "在投稿信預想審稿異議。", "morphology"),
      card("preemptive", "先發制人的", "搶先一手", "Preemptive disclosure beats forced correction.", "先發披露勝過被迫勘誤。", "morphology"),
      card("preliminary", "初步的", "預先第一輪", "Label preliminary findings clearly.", "初步發現要清楚標示。", "story"),
      card("prerequisite", "先決條件", "預先必備", "Shared code is a prerequisite for trust.", "共享程式碼是信任先決。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Come before:", promptZh: "先於：", choices: ["precede", "preclude", "preamble", "prelude"], answer: "precede" },
      { id: "q2", type: "sense", promptEn: "Make impossible; rule out:", promptZh: "排除／使不可能：", choices: ["preclude", "precede", "prognosis", "anticipate"], answer: "preclude" },
      { id: "q3", type: "sense", promptEn: "Introductory statement:", promptZh: "序言：", choices: ["preamble", "precursor", "preemptive", "prognosticate"], answer: "preamble" },
    ],
  },
  {
    id: "prefix-dis-01",
    type: "prefix",
    elementLemma: "dis-",
    priority: "A",
    titleZh: "dis-｜拆解否定工廠",
    titleEn: "Dis- Demolition Plant",
    hook: "字首 dis-＝分開／否定——工廠專管拆掉與否定。",
    script:
      "disperse 打散；distort 扭歪。discredit 讓信用散掉；dismantle 拆解。disparage 貶低拆台；dissuade 勸阻拆念頭。dispassionate 抽離感情；discord 不和。disarray 混亂；disavow 否認切割。",
    reviewHooks: ["dis-＝拆／否：disperse/distort/discredit/dismantle/disparage", "dissuade＝勸阻"],
    pitfalls: ["disinterested≈公正無利益；uninterested＝不感興趣（另記）", "disparage＝貶低"],
    members: [
      card("disperse", "散佈；解散", "打散", "Disperse rumors with a public correction log.", "用公開勘誤日誌打散謠言。", "morphology"),
      card("distort", "扭曲", "扭歪", "Truncation can distort effect sizes.", "截斷會扭曲效應量。", "morphology"),
      card("discredit", "使喪失信用", "拆信用", "One fabrication can discredit a whole lab.", "一次捏造可使整間實驗室失信。", "morphology"),
      card("dismantle", "拆除；拆解", "拆掉結構", "Dismantle incentives that reward only positives.", "拆掉只獎勵陽性的誘因。", "morphology"),
      card("disparage", "貶低；誹謗", "拆台貶低", "Do not disparage fields you have not read.", "不要貶低你沒讀過的領域。", "morphology"),
      card("dissuade", "勸阻", "拆掉念頭", "Good mentoring can dissuade fraudulent shortcuts.", "好指導能勸阻造假捷徑。", "morphology"),
      card("dispassionate", "冷靜公正的", "抽離感情", "Write a dispassionate methods critique.", "寫冷靜公正的方法批評。", "morphology"),
      card("discord", "不和；不一致", "拆和諧", "Discord between prereg and paper needs explanation.", "預註冊與論文不一致需解釋。", "morphology"),
      card("disarray", "混亂；紊亂", "拆整齊", "Code in disarray hides silent bugs.", "混亂程式碼隱藏沉默錯誤。", "morphology"),
      card("disavow", "否認；拒絕承認", "切割否認", "Authors must disavow forged figures publicly.", "作者必須公開否認偽造圖。", "morphology"),
      card("disclose", "揭露", "打開不藏", "Disclose all deviations from the plan.", "揭露所有偏離計畫之處。", "story"),
      card("dissent", "異議；不同意", "拆共識", "Protect dissent in journal clubs.", "在期刊讀書會保護異議。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Belittle; speak slightingly:", promptZh: "貶低：", choices: ["disparage", "disperse", "disclose", "dissent"], answer: "disparage" },
      { id: "q2", type: "sense", promptEn: "Advise against:", promptZh: "勸阻：", choices: ["dissuade", "disavow", "distort", "discord"], answer: "dissuade" },
      { id: "q3", type: "sense", promptEn: "Take apart systematically:", promptZh: "拆解：", choices: ["dismantle", "disarray", "discredit", "dispassionate"], answer: "dismantle" },
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
    qualityGate: { reviewedAt: new Date().toISOString().slice(0, 10), stage: "P1-batch01" },
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
    priority: raw.priority || "A",
    qualityGate: { reviewedAt: new Date().toISOString().slice(0, 10), stage: "P1-batch01" },
  };
  fs.writeFileSync(path.join(clusterDir, `${cluster.id}.json`), `${JSON.stringify(cluster, null, 2)}\n`);
  const lesson = buildLesson({ ...cluster, quiz: raw.quiz });
  fs.writeFileSync(path.join(lessonDir, `${lesson.id}.json`), `${JSON.stringify(lesson, null, 2)}\n`);
  for (const m of cluster.members) existing.add(m.headword);
  written.push({ id: cluster.id, n: cluster.members.length });
}

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
  `${JSON.stringify({ version: "v0.5-p1b01", total: lessonIndex.length, lessons: lessonIndex }, null, 2)}\n`,
);

const unique = new Set();
for (const c of allClusters) for (const m of c.members || []) unique.add(m.headword);

fs.writeFileSync(
  path.join(humorDir, "index.json"),
  `${JSON.stringify(
    {
      version: "v0.5-p1b01",
      status: "p1-batch01",
      uniqueWords: unique.size,
      clusters: allClusters.map((c) => ({
        id: c.id,
        type: c.type,
        titleZh: c.titleZh,
        priority: c.priority || "A",
        status: c.status,
        memberCount: (c.members || []).length,
        inVocab: (c.members || []).filter((m) => vocabMap.has(m.headword) || m.inVocab).length,
        pendingAdd: (c.members || [])
          .filter((m) => !(vocabMap.has(m.headword) || m.inVocab))
          .map((m) => m.headword),
      })),
      lessons: lessonIndex,
    },
    null,
    2,
  )}\n`,
);

const elementsPath = path.join(humorDir, "elements.json");
const elementsDoc = JSON.parse(fs.readFileSync(elementsPath, "utf8"));
for (const w of written) {
  const raw = NEW.find((n) => n.id === w.id);
  if (!raw) continue;
  const needle = String(raw.elementLemma || "").toLowerCase();
  const el2 = elementsDoc.elements.find((e) => {
    const lem = String(e.lemma || "").toLowerCase();
    return lem.includes(needle.split("/")[0].replace(/^-/, "")) || needle.includes(lem.replace(/^-/, "").split("/")[0]);
  });
  if (el2 && !(el2.clusterIds || []).includes(w.id)) {
    el2.clusterIds = el2.clusterIds || [];
    el2.clusterIds.push(w.id);
    el2.status = "clustered";
  }
}
elementsDoc.counts.withCluster = elementsDoc.elements.filter((e) => (e.clusterIds || []).length > 0).length;
fs.writeFileSync(elementsPath, `${JSON.stringify(elementsDoc, null, 2)}\n`);

const report = {
  stage: "P1-batch01",
  written: written.length,
  writtenDetail: written,
  blocked,
  totalClusters: allClusters.length,
  uniqueWords: unique.size,
  gapTo1000: Math.max(0, 1000 - unique.size),
  gapTo4000: Math.max(0, 4000 - unique.size),
};
fs.writeFileSync(
  path.join(humorDir, "P1-BATCH01-REPORT.md"),
  `# P1-batch01 完成報告

| 指標 | 數值 |
|------|------|
| 本批寫入家族 | ${written.length} |
| 總家族 | ${allClusters.length} |
| 獨特幽默詞 | ${unique.size} |
| 距 P1 目標 1,000 | ${report.gapTo1000} |
| 距總目標 4,000 | ${report.gapTo4000} |

## 本批家族
${written.map((w) => `- \`${w.id}\`（${w.n} 詞）`).join("\n")}

${blocked.length ? `## 未寫入\n${blocked.map((b) => `- ${b.id}: ${b.issues.join(", ")} (members=${b.members})`).join("\n")}` : ""}
`,
);

console.log(JSON.stringify(report, null, 2));
