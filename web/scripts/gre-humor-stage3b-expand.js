/**
 * Stage S3b: ~20 A/B reviewed clusters → target ≥500 unique humor words.
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
  for (const m of c.members || []) existing.add(m.headword);
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
  };
}

const SEASON = {
  rhyme: { id: 1, titleZh: "押韻派對", titleEn: "Rhyme Party" },
  root: { id: 2, titleZh: "字根劇場", titleEn: "Root Theater" },
  semantic: { id: 3, titleZh: "語氣對打", titleEn: "Tone Duels" },
  lookalike: { id: 3, titleZh: "語氣對打", titleEn: "Tone Duels" },
};

/** Compact cluster factory */
function C(spec) {
  return spec;
}

const NEW = [
  C({
    id: "root-fer-01", type: "root", elementLemma: "fer", priority: "A",
    titleZh: "fer｜搬運與偏好調度室", titleEn: "Ferry Desk of fer",
    hook: "字根 fer＝帶、拿——文件與偏好都在傳送帶上。",
    script: "資料 transfer 轉送；會議 defer 延後再搬。prefer 比較想搬哪邊，confer 湊一起商量。infer 從線索搬出結論，refer 把問題搬去別處。offer／proffer 端上來；fertile 多產，proliferate 大量增生；differ 搬成不一樣，indifferent 懶得搬偏好，suffer 被迫扛著走。",
    reviewHooks: ["fer＝搬：transfer/defer/prefer/confer/infer/refer", "infer≠imply；defer＝延期或順從"],
    pitfalls: ["infer（聽者推論）≠ imply（說者暗示）", "defer to＝順從權威"],
    members: [
      card("transfer", "轉移；調動", "轉送到另一條帶", "Do not transfer blame without tracing the cause.", "未追因就不要轉移責難。"),
      card("defer", "延期；順從", "先搬到以後", "We defer judgment until replication arrives.", "複現到來前，我們延後下判斷。"),
      card("prefer", "更喜歡；寧可", "比較想搬哪邊", "Reviewers prefer precise claims over sweeping ones.", "審稿人寧可要精確主張。"),
      card("confer", "商議；授予", "湊一起搬意見", "The panel will confer before announcing rankings.", "小組將在宣布排名前商議。"),
      card("infer", "推論；推斷", "從線索搬出結論", "From silence we should not infer consent.", "不該從沉默推論出同意。"),
      card("refer", "提及；轉介；參考", "把問題搬去別處", "Please refer to the appendix for full tables.", "完整表格請參考附錄。"),
      card("offer", "提供；提議", "端上來", "The paper offers a narrower mechanism than advertised.", "論文提供的機制比宣傳更窄。", "story"),
      card("proffer", "正式提出；遞上", "更正式地遞", "Counsel proffered an alternative reading of the clause.", "律師正式提出另一種解讀。"),
      card("fertile", "肥沃的；多產的", "能產出很多", "A fertile debate generated testable hypotheses.", "多產辯論產生可檢驗假說。"),
      card("proliferate", "激增；擴散", "大量搬出來", "Metrics proliferate when incentives reward counting.", "誘因獎勵計數時指標激增。"),
      card("differ", "不同；有分歧", "搬成不一樣", "Experts differ on how to weight outliers.", "專家對極端值加權有分歧。"),
      card("indifferent", "冷漠的；無所謂的", "不想搬偏好", "An indifferent public still shapes turnout math.", "冷漠公眾仍形塑投票率。"),
      card("suffer", "遭受；受苦", "被迫扛著搬走", "The design will suffer if power is too low.", "檢定力太低，設計會受苦。"),
      card("referendum", "公投", "把決定搬回給眾人", "A referendum cannot replace careful cost analysis.", "公投不能取代成本分析。", "story"),
      card("circumference", "圓周；周邊", "帶著邊界走一圈", "Stay within the circumference of the defined construct.", "停留在構念圓周內。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Draw a conclusion from evidence:", promptZh: "從證據推出結論：", choices: ["imply", "infer", "prefer", "offer"], answer: "infer" },
      { id: "q2", type: "sense", promptEn: "Put off until later:", promptZh: "延後：", choices: ["defer", "refer", "confer", "transfer"], answer: "defer" },
      { id: "q3", type: "sense", promptEn: "Multiply rapidly:", promptZh: "迅速激增：", choices: ["proliferate", "proffer", "fertile", "circumference"], answer: "proliferate" },
    ],
  }),
  C({
    id: "root-port-01", type: "root", elementLemma: "port", priority: "A",
    titleZh: "port｜港口物流劇", titleEn: "Port Logistics",
    hook: "字根 port＝運、帶——碼頭專管進出口與重要消息。",
    script: "貨物 import 運入、export 運出；deport 把人運出境。portable 可攜，transport 整段運輸。important 有重量；opportune／opportunity 剛好靠岸。support 托住，report 運回消息；portfolio 一組可運資產，purport 聲稱運載何義，insupportable 托不住。",
    reviewHooks: ["port＝運：import/export/deport/transport/portable", "opportune＝合時；purport＝聲稱"],
    pitfalls: ["deport 驅人 ≠ export 運貨", "important 勿只記『重要』忘構詞重量感"],
    members: [
      card("import", "進口；重要性", "運進來", "The import of the finding is practical, not merely theoretical.", "該發現的重要性是實務的。"),
      card("export", "出口；輸出", "運出去", "Methods that export poorly across cultures need local tests.", "難跨文化輸出的方法需在地檢驗。"),
      card("deport", "驅逐出境", "把人運走", "The metaphor of deporting outliers can hide selection bias.", "『驅逐極端值』可能掩蓋選擇偏差。"),
      card("portable", "可攜的；可移植的", "可隨身運", "A portable checklist travels between labs.", "可移植檢核表能在實驗室間旅行。"),
      card("transport", "運輸", "整段運程", "How we transport samples affects degradation.", "樣本運輸方式影響降解。"),
      card("important", "重要的", "有重量的貨", "Important claims deserve pre-registered tests.", "重要主張值得預註冊檢驗。", "story"),
      card("opportune", "合時宜的", "剛好靠岸", "An opportune pause let cooler evidence speak.", "合時停頓讓冷靜證據說話。"),
      card("opportunity", "機會", "靠岸窗口", "Missing data is also a missed opportunity for honesty.", "缺漏資料也是錯失誠實機會。"),
      card("support", "支持；支撐", "從下面托住", "Correlations alone rarely support causal claims.", "單靠相關很少支撐因果。"),
      card("report", "報告", "運回總部", "Report effect sizes with intervals, not stars alone.", "報告效應量請帶區間。"),
      card("portfolio", "作品集；投資組合", "一組可運資產", "A methods portfolio beats a single fashionable tool.", "方法組合勝過單一流行工具。"),
      card("purport", "聲稱；主旨", "宣稱運載的意義", "The statute purports to protect privacy broadly.", "法條聲稱要廣泛保護隱私。"),
      card("insupportable", "無法支撐的；難忍的", "托不住", "That leap from survey to policy is insupportable.", "從問卷跳到政策無法支撐。"),
      card("porter", "搬運工", "碼頭搬運者", "Think of operationalization as the porter of concepts.", "操作型定義像概念搬運工。", "story"),
      card("sport", "運動；炫耀（古義 disport 近）", "把精力運去競技", "Do not sport with definitions mid-argument.", "論證中途不要拿定義嬉戲。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Well-timed:", promptZh: "合時宜：", choices: ["opportune", "portable", "deport", "porter"], answer: "opportune" },
      { id: "q2", type: "sense", promptEn: "Claim to be or mean:", promptZh: "聲稱：", choices: ["purport", "import only goods", "export", "portfolio"], answer: "purport" },
      { id: "q3", type: "sense", promptEn: "Impossible to justify:", promptZh: "無法支撐：", choices: ["insupportable", "support", "report", "transport"], answer: "insupportable" },
    ],
  }),
  C({
    id: "root-pos-01", type: "root", elementLemma: "pos/pon", priority: "A",
    titleZh: "pos／pon｜擺放控制室", titleEn: "Placement Control",
    hook: "字根 pos/pon＝放、置——誰被放哪裡，誰說了算。",
    script: "propose 放上桌；impose 強加。compose 組裝，dispose 處置，expose 揭露，oppose 對放反對。postpone 往後放；component 零件，positive 明確肯定，deposit 存放。juxtapose 並置，superimpose 疊加，proposition 命題，exponent 倡導者，repository 儲庫。",
    reviewHooks: ["pos＝放：propose/impose/compose/expose/oppose/postpone", "juxtapose＝並置對照"],
    pitfalls: ["propose ≠ purpose", "dispose of＝丟棄；disposed to＝傾向"],
    members: [
      card("propose", "提議", "放上桌", "We propose a preregistered analysis plan.", "我們提議預註冊分析計畫。"),
      card("impose", "強加", "硬放上去", "Do not impose a narrative the data cannot carry.", "不要強加資料扛不起的敘事。"),
      card("compose", "組成；撰寫", "組裝放置", "Compose the abstract after results are stable.", "結果穩定後再寫摘要。"),
      card("dispose", "處置；使傾向", "安排去向", "How labs dispose of failed trials shapes the literature.", "失敗試驗怎麼處置形塑文獻。"),
      card("expose", "揭露", "揭開來放", "Replication can expose fragile findings.", "複現能揭露脆弱發現。"),
      card("oppose", "反對", "放在對面", "Stakeholders may oppose transparency that threatens rents.", "利害關係人可能反對威脅租金的透明。"),
      card("postpone", "延期", "往後放", "Postpone celebration until robustness checks pass.", "穩健檢查通過前先延期慶祝。"),
      card("component", "組成部分", "零件", "Trust is a component of cumulative science.", "信任是累積科學的元件。"),
      card("positive", "正面的；陽性的", "明確放下肯定", "A positive result still needs a credible mechanism.", "陽性結果仍需可信機制。", "story"),
      card("deposit", "存放；訂金", "存放到層裡", "Deposit raw files in a trusted repository.", "原始檔存進可信儲庫。"),
      card("juxtapose", "並列；並置", "並排放", "Juxtapose the two models to show the gap.", "並置兩模型以顯示差距。"),
      card("repository", "儲庫", "久放之處", "A public repository reduces private hoarding of data.", "公開儲庫減少私藏。", "story"),
      card("proposition", "命題；提議", "討論桌上的句子", "State the proposition before you defend it.", "先陳述命題再辯護。"),
      card("superimpose", "疊加", "放在上面一層", "Do not superimpose ideology on measurement choices.", "不要把意識形態疊加在測量上。"),
      card("exponent", "倡導者；指數", "放在外面倡導", "An early exponent of open methods faced resistance.", "開放方法早期倡導者遇阻力。"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Delay to later:", promptZh: "延期：", choices: ["postpone", "propose", "impose", "expose"], answer: "postpone" },
      { id: "q2", type: "sense", promptEn: "Place side by side:", promptZh: "並置：", choices: ["juxtapose", "deposit", "oppose", "compose"], answer: "juxtapose" },
      { id: "q3", type: "sense", promptEn: "Force on others:", promptZh: "強加：", choices: ["impose", "compose", "positive", "component"], answer: "impose" },
    ],
  }),
  C({
    id: "root-fac-01", type: "root", elementLemma: "fac/fic/fect", priority: "A",
    titleZh: "fac／fect｜製造工廠", titleEn: "The Making Factory",
    hook: "字根 fac/fic/fect＝做、造——工廠日夜開工。",
    script: "容易做叫 facile；受益人造 benefactor，作惡的 malefactor。製造是 manufacture，事實是 fact。affect 施加影響，effect 造成結果；defect 缺陷，perfect 做完無缺。efficient 有效做事，proficient 熟練，sufficient 做得夠，artificial 人造的。",
    reviewHooks: ["fac＝做：facile/fact/manufacture/benefactor", "affect＝影響過程；effect＝結果／造成"],
    pitfalls: ["affect vs effect 必分清", "facile 常帶『過於輕易／膚淺』貶義"],
    members: [
      card("facile", "輕易的；膚淺的", "太好做", "A facile explanation ignores conflicting cases.", "膚淺解釋忽略衝突案例。"),
      card("benefactor", "恩人；捐助者", "做好事的人", "A quiet benefactor funded the open archive.", "低調捐助者資助開放典藏。"),
      card("malefactor", "作惡者", "做壞事的人", "Do not cast critics as malefactors for asking methods questions.", "別因方法提問就把批評者當惡人。"),
      card("manufacture", "製造；捏造", "工廠產出", "Do not manufacture certainty from noisy data.", "不要從噪音資料捏造確定性。"),
      card("fact", "事實", "做出來的真東西／已成立者", "Separate fact from preferred narrative.", "把事實與偏好敘事分開。", "story"),
      card("affect", "影響；感動", "去做作用", "Incentives affect what gets measured.", "誘因影響測什麼。"),
      card("effect", "結果；效應；使發生", "做出的結果", "Estimate the effect with pre-specified controls.", "用預先指定控制估計效應。"),
      card("defect", "缺陷", "做得有缺口", "A sampling defect can mimic a treatment effect.", "抽樣缺陷可能模仿處理效應。"),
      card("perfect", "完美的；完成", "做完無缺", "No design is perfect; report limitations.", "沒有完美設計；請報告限制。"),
      card("efficient", "有效率的", "少耗能多做事", "An efficient estimator is not automatically unbiased.", "有效率估計量不自動無偏。"),
      card("proficient", "熟練的", "做得熟", "Proficient coding still needs code review.", "熟練寫碼仍需審查。"),
      card("sufficient", "足夠的", "做得夠", "A sufficient statistic compresses without loss for the parameter.", "充分統計量為參數無損壓縮。"),
      card("artificial", "人造的；矯揉的", "人造做出來", "Artificial categories can reify soft boundaries.", "人為範疇可能把軟邊界實體化。"),
      card("facilitate", "促進；使容易", "幫忙去做順", "Templates facilitate consistent reporting.", "模板促進一致報告。"),
      card("factor", "因素；因子", "做事的構成件", "Control for each theorized factor explicitly.", "明確控制每個理論因素。"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "affect vs effect — result noun is usually:", promptZh: "結果名詞通常是：", choices: ["effect", "affect", "facile", "defect"], answer: "effect" },
      { id: "q2", type: "sense", promptEn: "Overly easy or shallow:", promptZh: "過於輕易／膚淺：", choices: ["facile", "proficient", "sufficient", "factor"], answer: "facile" },
      { id: "q3", type: "sense", promptEn: "Make easier:", promptZh: "使更容易：", choices: ["facilitate", "malefactor", "manufacture lies only", "perfect"], answer: "facilitate" },
    ],
  }),
  C({
    id: "root-cap-01", type: "root", elementLemma: "cap/cept/cip", priority: "A",
    titleZh: "cap／cept｜捕捉與接收站", titleEn: "Capture & Receive",
    hook: "字根 cap/cept/cip＝拿、抓、接收。",
    script: "captivate 抓住目光；intercept 中途截走。susceptible 易被抓住影響，perceive 接收到知覺。receive／receipt 收到，accept 接受，except 排除不拿。concept 一起抓住的概念，anticipate 提前抓住，participate 分一份去抓，capable 有能力抓住，capacity 容量。",
    reviewHooks: ["cap＝抓：captivate/intercept/perceive/accept/except/concept", "susceptible＝易感；capacity＝容量"],
    pitfalls: ["accept ≠ except", "anticipate 不只『期待』也有『預先處理』"],
    members: [
      card("captivate", "迷住；吸引", "抓住目光", "A vivid case can captivate without proving generality.", "生動案例能迷住，但不證明普遍性。"),
      card("intercept", "攔截", "中途截走", "Filters intercept spam before it reaches inboxes.", "過濾器在進信箱前攔截垃圾信。"),
      card("susceptible", "易受影響的", "易被抓住", "Young fields are susceptible to hype cycles.", "年輕領域易受炒作週期影響。"),
      card("perceive", "察覺；認為", "接收到知覺", "Readers perceive confidence from hedging choices.", "讀者從對沖用語察覺信心。"),
      card("receive", "收到", "接下來", "Did the editor receive the corrected supplement?", "編輯收到修正附錄了嗎？", "story"),
      card("accept", "接受", "收下", "Journals increasingly accept null results with strong design.", "期刊漸接受設計強的無效應結果。"),
      card("except", "除了；排除", "不拿進來", "All trials except one used blinded scoring.", "除一項外皆用盲評。"),
      card("concept", "概念", "一起抓住的想法", "Define the concept before you operationalize it.", "操作化前先定義概念。"),
      card("anticipate", "預期；預先處理", "提前抓住", "Anticipate reviewer concerns in the limitations section.", "在限制段落預先處理審稿疑慮。"),
      card("participate", "參與", "分一份去抓", "Patients should participate as partners, not only subjects.", "病人應以夥伴身分參與。"),
      card("capable", "有能力的", "抓得住", "A capable design still needs honest missing-data rules.", "有能力的設計仍需誠實缺值規則。"),
      card("capacity", "容量；能力", "能裝多少", "Institutional capacity limits how fast reforms travel.", "制度容量限制改革速度。"),
      card("capture", "捕捉；奪取", "抓到", "Surveys rarely capture tacit knowledge well.", "問卷很少能捕捉默會知識。"),
      card("recipient", "接受者", "被遞到的人", "Name the recipient of benefits, not only average effects.", "說清受益接受者，不只平均效應。"),
      card("emancipate", "解放", "解開被抓住的鎖", "Open tools can emancipate labs from vendor lock-in.", "開放工具能讓實驗室擺脫供應商鎖定。"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "accept vs except:", promptZh: "accept 與 except：", choices: ["take in vs leave out", "same meaning", "only grammar particles", "both mean refuse"], answer: "take in vs leave out" },
      { id: "q2", type: "sense", promptEn: "Easily influenced:", promptZh: "易受影響：", choices: ["susceptible", "capable", "capacity", "receipt"], answer: "susceptible" },
      { id: "q3", type: "sense", promptEn: "Block or seize on the way:", promptZh: "中途攔截：", choices: ["intercept", "participate", "concept", "receive"], answer: "intercept" },
    ],
  }),
];

// Continue adding clusters 6-20
NEW.push(
  C({
    id: "root-ten-01", type: "root", elementLemma: "ten/tain", priority: "A",
    titleZh: "ten／tain｜抓住不放練習場", titleEn: "Hold On Tight",
    hook: "字根 ten/tain＝持、握——誰抓得住誰。",
    script: "tenacious 抓很緊；abstain 不伸手拿。retain 留住，maintain 維持，contain 裝住，obtain 取得。sustain 支撐住，pertain 相關聯，tenant 承租抓住空間，tenure 任期抓住職位，tenable 站得住，untenable 站不住，extend／tend 另族——這裡看 attention 把心抓住。",
    reviewHooks: ["ten＝持：tenacious/retain/maintain/contain/obtain/sustain", "abstain＝不拿；untenable＝守不住"],
    pitfalls: ["maintain ≠ maintainance 拼寫", "abstain from＋名詞／動名詞"],
    members: [
      card("tenacious", "頑強的；緊抓的", "抓很緊", "Tenacious anomalies deserve another look.", "頑強異常值得再看。"),
      card("abstain", "戒絕；棄權", "不伸手", "Several members abstained from the vote.", "數名成員投票棄權。"),
      card("retain", "保留；聘留", "留住", "Retain raw logs for auditability.", "保留原始紀錄以便稽核。"),
      card("maintain", "維持；主張", "維持住", "Maintain the same coding rules across waves.", "各波次維持同一編碼規則。"),
      card("contain", "包含；遏制", "裝住", "The model cannot contain every contextual factor.", "模型無法裝下所有脈絡因素。"),
      card("obtain", "獲得", "取得", "Obtain consent before linking records.", "連結紀錄前先取得同意。"),
      card("sustain", "維持；支撐", "撐住", "Can the budget sustain longitudinal follow-up?", "預算撐得起縱貫追蹤嗎？"),
      card("pertain", "有關；隸屬", "相關聯", "Only variables that pertain to the hypothesis stay in.", "只留與假說相關的變項。"),
      card("tenant", "承租人", "抓住空間的人", "Think of a theory as a tenant in the house of evidence.", "把理論想成證據之屋的承租人。", "story"),
      card("tenure", "任期；終身職", "抓住職位", "Tenure incentives can shape risk-taking in research.", "終身職誘因會形塑研究冒險。"),
      card("tenable", "站得住腳的", "守得住", "Is the causal claim tenable under selection?", "選擇偏差下因果主張站得住嗎？"),
      card("untenable", "站不住腳的", "守不住", "That reading becomes untenable once dates conflict.", "日期衝突後該解讀站不住。"),
      card("attention", "注意", "把心抓住", "Attention is a scarce resource in crowded literatures.", "擁擠文獻裡注意力是稀缺資源。", "story"),
      card("continent", "大陸；克制的（古）", "連成一片握住的地", "Results may not travel across continents without adaptation.", "結果跨大陸未必不經適應就成立。", "story"),
      card("detention", "拘留；留置", "被抓住關住", "Methodological detention of papers harms learning speed.", "論文方法上的『扣留』傷害學習速度。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Stubbornly persistent:", promptZh: "頑強緊抓：", choices: ["tenacious", "abstain", "tenant", "attention"], answer: "tenacious" },
      { id: "q2", type: "sense", promptEn: "Cannot be defended:", promptZh: "站不住腳：", choices: ["untenable", "tenable", "obtain", "retain"], answer: "untenable" },
      { id: "q3", type: "sense", promptEn: "Hold back from doing:", promptZh: "戒絕／棄權：", choices: ["abstain", "sustain", "contain", "pertain"], answer: "abstain" },
    ],
  }),
  C({
    id: "root-scrib-01", type: "root", elementLemma: "scrib/script", priority: "A",
    titleZh: "scrib｜書寫管理局", titleEn: "Script Bureau",
    hook: "字根 scrib/script＝寫——誰寫進去，誰被寫出去。",
    script: "describe 描寫，inscribe 刻寫進去，proscribe 明文禁止，prescribe 開處方／規定。script 劇本，manuscript 手稿，subscribe 署名訂閱，transcribe 轉寫，ascribe 歸因寫到誰頭上，circumscribe 劃界限制，scribble 亂寫，conscript 徵召寫入名單，postscript 又及。",
    reviewHooks: ["scrib＝寫：describe/inscribe/proscribe/prescribe/ascribe/transcribe", "proscribe＝禁；prescribe＝規定／開藥"],
    pitfalls: ["proscribe vs prescribe 反向", "ascribe X to Y＝把 X 歸因於 Y"],
    members: [
      card("describe", "描述", "描寫出來", "Describe the sampling frame before results.", "結果前先描述抽樣架構。"),
      card("inscribe", "題寫；銘刻", "寫進去", "Values inscribed in charters need operational teeth.", "憲章銘刻的價值需要可操作牙齒。"),
      card("proscribe", "禁止；排斥", "明文禁止寫死", "The code proscribes dual submission.", "規範禁止一稿兩投。"),
      card("prescribe", "規定；開處方", "寫成規定", "Guidelines prescribe reporting confidence intervals.", "指引規定報告信賴區間。"),
      card("script", "劇本；腳本", "寫好的流程", "Preregistration is a script against flexible plotting.", "預註冊是對抗彈性畫圖的腳本。", "story"),
      card("manuscript", "手稿", "手寫／稿件", "The manuscript should flag all deviations.", "手稿應標明所有偏離。"),
      card("subscribe", "訂閱；同意署名", "署名附和", "I cannot subscribe to that causal leap.", "我無法附和那因果跳躍。"),
      card("transcribe", "謄寫；轉寫", "轉寫到另一媒介", "Transcribe interviews with speaker labels.", "訪談轉寫請標說話者。"),
      card("ascribe", "歸因", "寫到誰頭上", "Do not ascribe intent without evidence.", "無證據不要歸因意圖。"),
      card("circumscribe", "限制；劃界", "畫圈限制", "Budget rules circumscribe feasible designs.", "預算規則限制可行設計。"),
      card("scribble", "潦草書寫", "亂寫", "Margin scribbles are not a codebook.", "頁邊亂寫不是編碼簿。", "story"),
      card("conscript", "徵召", "寫入名單強徵", "Do not conscript unrelated citations for decoration.", "不要強徵無關引用當裝飾。"),
      card("postscript", "又及；附言", "正文後再寫", "A postscript cannot fix a broken identification strategy.", "又及救不了壞的識別策略。"),
      card("nondescript", "無可名狀的；不起眼的", "寫不出特色", "A nondescript method section hides key choices.", "平淡方法段會藏起關鍵選擇。"),
      card("superscript", "上標", "寫在上面的小字", "Check superscripts in chemical and statistical notation.", "檢查化學與統計記號上標。", "story"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "proscribe vs prescribe:", promptZh: "禁止 vs 規定：", choices: ["forbid vs order/set down", "same", "only medical", "only legal synonyms"], answer: "forbid vs order/set down" },
      { id: "q2", type: "sense", promptEn: "Attribute to a cause:", promptZh: "歸因：", choices: ["ascribe", "describe scenery", "scribble", "script a play only"], answer: "ascribe" },
      { id: "q3", type: "sense", promptEn: "Limit the range of:", promptZh: "劃界限制：", choices: ["circumscribe", "subscribe", "transcribe", "postscript"], answer: "circumscribe" },
    ],
  }),
  C({
    id: "root-struct-01", type: "root", elementLemma: "struct", priority: "A",
    titleZh: "struct｜建築工地", titleEn: "Construction Site",
    hook: "字根 struct＝建造——論證也是工程。",
    script: "construct 建造，instruct 指導建造，destruct／destroy 拆毁，obstruct 阻擋施工。structure 結構，infrastructure 基礎建設，reconstruct 重建，restructure 改組。construction 構築物／解釋，destructive 破壞性，instructive 有教導性，superstructure 上層建築。",
    reviewHooks: ["struct＝建：construct/instruct/obstruct/structure/infrastructure", "obstruct＝擋；reconstruct＝重建"],
    pitfalls: ["construction 可指『解釋建構』", "destruct 少見，多用 destroy／destructive"],
    members: [
      card("construct", "建造；構念", "蓋起來", "Define the construct before choosing items.", "選題目前先定義構念。"),
      card("instruct", "指導；指示", "教怎麼蓋", "Protocols instruct assistants on coding edge cases.", "流程指示助理如何編碼邊界案例。"),
      card("destroy", "毀滅", "拆掉", "One leak can destroy years of trust.", "一次洩漏可毀掉多年信任。"),
      card("obstruct", "阻礙", "擋住工地", "Missing metadata obstructs reuse.", "缺中繼資料阻礙再利用。"),
      card("structure", "結構", "骨架", "Argument structure should be visible in headings.", "論證結構應在標題可見。"),
      card("infrastructure", "基礎設施", "地下管線", "Data infrastructure is part of scientific capital.", "資料基礎設施是科學資本。"),
      card("reconstruct", "重建", "再蓋一次", "Historians reconstruct events from partial archives.", "史家從殘缺檔案重建事件。"),
      card("restructure", "改組；重整", "改骨架", "Restructure the paper around one sharp question.", "圍繞一個尖銳問題重整論文。"),
      card("construction", "建造；解釋建構", "構築物", "That legal construction stretches the text.", "該法律解釋過度拉伸文本。"),
      card("destructive", "破壞性的", "會拆毁的", "Destructive criticism without alternatives stalls fields.", "只有破壞無替代的批評讓領域停滯。"),
      card("instructive", "有啟發的", "教得到東西", "Failed replications can be instructive.", "失敗複現可以有啟發。"),
      card("superstructure", "上層建築", "底座上的樓", "Do not confuse rhetorical superstructure with identification.", "别把修辭上層建築當成識別策略。", "story"),
      card("instrument", "工具；儀器", "建造用的器具", "Validate the instrument before scaling the survey.", "放大調查前先驗證工具。"),
      card("obstruction", "障礙", "阻擋物", "Paywalls remain an obstruction to cumulative work.", "付費牆仍是累積工作的障礙。"),
      card("structural", "結構上的", "骨架層的", "Structural reforms beat one-off trainings.", "結構改革勝過一次性訓練。"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Block or hinder:", promptZh: "阻礙：", choices: ["obstruct", "instruct", "construct", "instrument"], answer: "obstruct" },
      { id: "q2", type: "sense", promptEn: "Underlying systems enabling activity:", promptZh: "基礎設施：", choices: ["infrastructure", "superstructure only rhetoric", "scribble", "facile"], answer: "infrastructure" },
      { id: "q3", type: "sense", promptEn: "Rebuild from remains:", promptZh: "重建：", choices: ["reconstruct", "destroy", "obstruction", "tenure"], answer: "reconstruct" },
    ],
  }),
  C({
    id: "root-pend-01", type: "root", elementLemma: "pend/pens", priority: "A",
    titleZh: "pend｜懸吊與待決櫃", titleEn: "Pending & Hanging",
    hook: "字根 pend/pens＝懸、稱、付——掛著的事最折磨人。",
    script: "pending 懸而未決；suspend 暫時吊起來。depend 掛靠依賴，independent 不掛靠。append 附加，appendix 附錄。compensate 補償秤平，dispense 分配／免除，pensive 沉思掛著臉，expenditure 支出，pension 養老金，perpendicular 垂直掛線，impending 迫近懸在頭上。",
    reviewHooks: ["pend＝懸：pending/suspend/depend/append/impending", "compensate＝補償秤平"],
    pitfalls: ["pending＝待決；impending＝即將發生", "dispense with＝免除不用"],
    members: [
      card("pending", "待決的；直到", "掛著沒定", "Results are pending ethics clearance.", "結果尚待倫理審查。"),
      card("suspend", "暫停；懸吊", "暫時吊起", "Suspend recruitment when adverse events cluster.", "不良事件群聚時暫停收案。"),
      card("depend", "依賴", "掛靠", "Estimates depend on the exclusion restriction.", "估計依賴排除限制。"),
      card("independent", "獨立的", "不掛靠", "Independent replication beats in-house confirmation.", "獨立複現勝過內部確認。"),
      card("append", "附加", "掛上去", "Append the codebook to the replication package.", "把編碼簿附加到複現包。"),
      card("appendix", "附錄；闌尾", "掛在正文後", "Put long tables in an appendix.", "長表放附錄。"),
      card("compensate", "補償", "秤平", "Weighting can compensate for known nonresponse.", "加權可補償已知不回應。"),
      card("dispense", "分配；免除", "分發／免用", "We can dispense with decorative citations.", "我們可以免除裝飾性引用。"),
      card("pensive", "沉思的", "臉掛著思緒", "A pensive tone is fine; vagueness is not.", "沉思語氣可以；含糊不行。"),
      card("expenditure", "支出", "付出去的", "Track expenditure against preregistered milestones.", "依預註冊里程碑追蹤支出。"),
      card("pension", "退休金", "晚年掛帳", "Pension systems illustrate long-horizon policy tradeoffs.", "退休金制度說明長期政策取捨。", "story"),
      card("perpendicular", "垂直的", "掛成直角", "Keep axes perpendicular and honestly scaled.", "軸線保持垂直且誠實刻度。"),
      card("impending", "即將發生的", "懸在頭上迫近", "Impending deadlines distort careful reading.", "迫近截止扭曲細讀。"),
      card("pendant", "垂飾；懸著的", "吊飾", "A pendant caveat cannot rescue a broken design.", "垂吊的但書救不了壞設計。", "story"),
      card("propensity", "傾向", "懸向某一邊", "Estimate propensity with covariates chosen ex ante.", "用事先選好的共變估計傾向。"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "About to happen:", promptZh: "即將發生：", choices: ["impending", "pending forever", "appendix", "pension"], answer: "impending" },
      { id: "q2", type: "sense", promptEn: "Temporarily stop:", promptZh: "暫停：", choices: ["suspend", "append", "pensive", "pendant"], answer: "suspend" },
      { id: "q3", type: "sense", promptEn: "Make up for:", promptZh: "補償：", choices: ["compensate", "depend", "dispense candy only", "perpendicular"], answer: "compensate" },
    ],
  }),
);

NEW.push(
  C({
    id: "root-pel-01", type: "root", elementLemma: "pel/puls", priority: "A",
    titleZh: "pel／puls｜推力實驗室", titleEn: "Pulse & Push Lab",
    hook: "字根 pel/puls＝推——被推走或被推動。",
    script: "compel 強迫推動；expel 推出去；repel 推開。impulse 衝動推力，propel 向前推，dispel 驅散。pulse 脈搏，compel／compulsory 強制，expulsion 開除，repellent 令人反感，impel 驅使，pulsate 搏動。",
    reviewHooks: ["pel＝推：compel/expel/repel/propel/dispel/impel", "impulse＝衝動；compulsory＝強制"],
    pitfalls: ["compel＝強迫做；impel＝驅使（較內在）", "repel 可指物理推開或令人反感"],
    members: [
      card("compel", "強迫", "強推去做", "Evidence should compel revision, not loyalty tests.", "證據應強迫修正，而非忠誠測驗。"),
      card("expel", "驅逐；開除", "推出去", "Schools rarely expel for honest error, but silence does.", "學校少因誠實錯誤開除，沉默卻會。"),
      card("repel", "擊退；使反感", "推開", "Opaque methods repel collaborators.", "不透明方法讓合作者反感。"),
      card("impulse", "衝動；脈衝", "一股推力", "Resist the impulse to peek at outcomes early.", "忍住提早偷看結果的衝動。"),
      card("propel", "推進", "向前推", "Clear stakes propel careful reading.", "清楚利害推進細讀。"),
      card("dispel", "驅散", "推散迷霧", "Open data can dispel rumors of selective reporting.", "開放資料能驅散選擇性報告謠言。"),
      card("pulse", "脈搏；脈衝", "規律推一下", "Take the pulse of the literature with living reviews.", "用持續評論為文獻把脈。", "story"),
      card("compulsory", "強制的", "非推不可", "Compulsory preregistration changes gaming incentives.", "強制預註冊改變投機誘因。"),
      card("expulsion", "開除；驅逐", "被推出的結果", "Expulsion from a consortium should follow due process.", "逐出聯盟應有正當程序。"),
      card("repellent", "令人反感的；驅蟲的", "把人推開的", "A repellent tone loses persuadable readers.", "反感語氣失去可說服讀者。"),
      card("impel", "驅使", "往前驅", "Curiosity should impel checks, not shortcuts.", "好奇應驅使核查，而非捷徑。"),
      card("pulsate", "搏動", "一下一下推", "Attention pulsates with media cycles.", "注意力隨媒體週期搏動。"),
      card("propulsion", "推進力", "推進系統", "Citation propulsion is not the same as truth-tracking.", "引用推進力≠追蹤真理。", "story"),
      card("repulsion", "排斥；反感", "推開的力", "Mutual repulsion between camps blocks synthesis.", "陣營互斥阻礙綜整。"),
      card("compulsion", "強迫；強迫觀念", "不得不推", "Under compulsion, consent is compromised.", "強迫下同意已打折。"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Drive forward:", promptZh: "推進：", choices: ["propel", "expel from club only", "repel insects only", "pulse"], answer: "propel" },
      { id: "q2", type: "sense", promptEn: "Scatter or drive away (doubts/fears):", promptZh: "驅散：", choices: ["dispel", "compel", "compulsory", "expulsion"], answer: "dispel" },
      { id: "q3", type: "sense", promptEn: "Force someone to do:", promptZh: "強迫：", choices: ["compel", "repellent perfume", "pulse rate", "propulsion rocket only"], answer: "compel" },
    ],
  }),
  C({
    id: "root-sent-01", type: "root", elementLemma: "sent/sens", priority: "A",
    titleZh: "sent／sens｜感覺與同意議會", titleEn: "Sense & Assent Hall",
    hook: "字根 sent/sens＝感、意見——議會裡大家『覺得』與『同意』。",
    script: "sentiment 情緒意見；assent 同意，dissent 已在 look 族——這裡補 consent 同意／許可。sense 感官／意義，sensible 明智，sensitive 敏感，sensory 感官的。resent 憤恨，presentiment 預感，sentinel 哨兵，consensus 共識，sensational 聳動。",
    reviewHooks: ["sent＝感／意：sentiment/consent/sense/sensible/sensitive/resent/consensus", "consensus＝共同感到的一致"],
    pitfalls: ["sensible（明智）≠ sensitive（敏感）", "assent/dissent 已在 look-a-01，本族重 consent／consensus"],
    members: [
      card("sentiment", "情緒；意見", "感覺意見", "Policy should not track online sentiment alone.", "政策不該只追網路情緒。"),
      card("consent", "同意；許可", "點頭允許", "Document consent before data linkage.", "資料連結前記錄同意。"),
      card("sense", "感官；意義；道理", "感覺／意義", "Does this operationalization make sense theoretically?", "此操作化理論上說得通嗎？", "story"),
      card("sensible", "明智的；可察覺的", "有道理的感覺", "A sensible robustness check is cheap insurance.", "明智穩健檢查是便宜保險。"),
      card("sensitive", "敏感的", "易感", "Results are sensitive to one influential point.", "結果對一個影響點敏感。"),
      card("sensory", "感官的", "感官通道", "Sensory overload in dashboards hides the signal.", "儀表板感官過載會藏訊號。"),
      card("resent", "憤恨", "越想越氣的感", "Teams resent uncredited labor on shared datasets.", "團隊憤恨共享資料上未記名勞動。"),
      card("presentiment", "預感", "事先感到", "A presentiment of failure is not a stopping rule.", "失敗預感不是停止規則。"),
      card("sentinel", "哨兵", "警戒感受者", "Sentinel sites detect outbreaks early.", "哨兵站點及早偵測疫情。", "story"),
      card("consensus", "共識", "共同感到一致", "Consensus can lag behind better evidence.", "共識可能落後更好證據。"),
      card("sensational", "聳動的", "過度刺激感覺", "Sensational abstracts travel farther than careful ones.", "聳動摘要比謹慎摘要傳更遠。"),
      card("nonsense", "胡說", "無意義感覺", "Call speculation nonsense when it wears a proof costume.", "投機穿上證明外衣時就叫它胡說。", "story"),
      card("desensitize", "使不敏感", "降低感覺", "Repeated crises can desensitize audiences to risk.", "反覆危機使觀眾對風險不敏感。"),
      card("sentinel-event", "警訊事件（複合教學）", "哨兵事件", "Treat a sentinel failure as a system signal.", "把哨兵式失敗當系統訊號。", "story"),
      card("resentment", "怨恨", "積累的憤感", "Unpaid reviewing breeds resentment.", "無酬審稿滋生怨恨。"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "sensible vs sensitive:", promptZh: "明智 vs 敏感：", choices: ["wise vs easily affected", "same", "both mean emotional", "grammar only"], answer: "wise vs easily affected" },
      { id: "q2", type: "sense", promptEn: "General agreement:", promptZh: "共識：", choices: ["consensus", "resentment", "nonsense", "sentinel"], answer: "consensus" },
      { id: "q3", type: "sense", promptEn: "Permission / agreement to proceed:", promptZh: "許可／同意進行：", choices: ["consent", "sentiment only mood", "sensational", "desensitize"], answer: "consent" },
    ],
  }),
);

// Fix sentinel-event - headword with hyphen might be awkward; replace
const sentCluster = NEW.find((c) => c.id === "root-sent-01");
if (sentCluster) {
  sentCluster.members = sentCluster.members.filter((m) => m.headword !== "sentinel-event");
  sentCluster.members.push(
    card("extrasensory", "超感官的", "感官之外", "Extrasensory claims need extraordinary tests.", "超感官宣稱需要非凡檢驗。"),
  );
}

NEW.push(
  C({
    id: "root-sta-01", type: "root", elementLemma: "sta/stit", priority: "A",
    titleZh: "sta／stit｜站立與制度廣場", titleEn: "Stand & Institute Square",
    hook: "字根 sta/stit＝站——站得住才成制度。",
    script: "status 地位狀態；statue 雕像站著。constitute 組成構成，institution 制度，substitute 替代站上。desist 停止站開，persist 堅持站著，resist 抵抗。stable 穩定，stability 穩定性，establish 建立站穩，stance 立場，obstacle 擋路，standard 標準。",
    reviewHooks: ["sta＝站：status/constitute/institution/persist/resist/stable/establish", "desist＝停；substitute＝替代站上"],
    pitfalls: ["statue（雕像）≠ statute（法規）≠ status", "constitute＝構成／設立"],
    members: [
      card("status", "地位；狀態", "站在哪裡", "Report status of preregistration deviations.", "報告預註冊偏離狀態。"),
      card("statue", "雕像", "站著的石人", "A statue of a founder is not a methods section.", "創辦人雕像不是方法段。", "story"),
      card("constitute", "構成；設立", "站成整體", "These items constitute the distress index.", "這些題項構成困擾指數。"),
      card("institution", "制度；機構", "站穩的組織", "Institution design shapes what evidence counts.", "制度設計形塑何謂有效證據。"),
      card("substitute", "代替", "替代站上", "Do not substitute rhetoric for identification.", "不要用修辭替代識別。"),
      card("desist", "停止", "站開停手", "Desist from harvesting outcomes mid-stream.", "停止中途收割結果。"),
      card("persist", "持續；堅持", "一直站著", "Biases persist when incentives stay misaligned.", "誘因錯位時偏差持續。"),
      card("resist", "抵抗", "站著對抗", "Fields resist reforms that threaten hierarchies.", "領域抵抗威脅階層的改革。"),
      card("stable", "穩定的", "站得穩", "Seek stable estimates across specifications.", "在不同設定中尋求穩定估計。"),
      card("stability", "穩定性", "穩的程度", "Stability checks belong in the main text.", "穩定性檢查應放正文。"),
      card("establish", "建立；確立", "站穩根基", "Establish coding reliability before analysis.", "分析前確立編碼信度。"),
      card("stance", "立場", "站姿／立場", "State your stance on causal language explicitly.", "明確陳述對因果語言的立場。"),
      card("obstacle", "障礙", "擋路的東西", "Paywalls remain an obstacle to synthesis.", "付費牆仍是綜整障礙。"),
      card("standard", "標準", "站立的尺度", "Adopt reporting standards early.", "及早採用報告標準。"),
      card("statute", "成文法", "寫成站穩的法", "Cite the statute, not a blog summary.", "引用成文法，不是部落格摘要。", "lookalike"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "statue / statute / status:", promptZh: "雕像／法規／狀態：", choices: ["statue=sculpture; statute=law; status=standing", "all same", "only spelling variants", "statue=law"], answer: "statue=sculpture; statute=law; status=standing" },
      { id: "q2", type: "sense", promptEn: "Stop doing:", promptZh: "停止：", choices: ["desist", "persist", "resist", "stance"], answer: "desist" },
      { id: "q3", type: "sense", promptEn: "Make up; form:", promptZh: "構成：", choices: ["constitute", "statue", "obstacle", "sport"], answer: "constitute" },
    ],
  }),
  C({
    id: "root-ven-01", type: "root", elementLemma: "ven/vent", priority: "A",
    titleZh: "ven／vent｜到來與出口", titleEn: "Arrive & Vent",
    hook: "字根 ven/vent＝來——人來了、氣出來了。",
    script: "intervene 介入而來；convene 召集來到。invent 發明出來，prevent 搶先擋住到來。event 發生的事，adventure 冒險前來，revenue 進來的錢，avenue 大道，convenient 方便到來，venture 冒險投入，vent 出口出氣，contravene 違背對撞而來。",
    reviewHooks: ["ven＝來：intervene/convene/invent/prevent/event/revenue", "contravene＝違背；vent＝出氣口"],
    pitfalls: ["invent ≠ inventt 拼寫", "prevent＝防止到來；intervene＝介入其中"],
    members: [
      card("intervene", "介入", "插進來", "When harm appears, protocols say when to intervene.", "出現傷害時，流程規定何時介入。"),
      card("convene", "召集", "叫來到齊", "Convene the DSMB after unexpected deaths.", "非預期死亡後召集安全委員會。"),
      card("invent", "發明", "做出未來之物到來", "Do not invent subgroups after seeing outcomes.", "看過結果後不要發明子群。"),
      card("prevent", "防止", "擋住到來", "Blinding can prevent some expectancy biases.", "盲法可防止部分期望偏差。"),
      card("event", "事件", "到來發生的事", "Predefine adverse events of interest.", "預先定義關注不良事件。", "story"),
      card("adventure", "冒險", "大膽前來", "Methodological adventure needs sharper safeguards.", "方法冒險需要更利防護。", "story"),
      card("revenue", "收入", "進來的錢", "Subscription revenue can conflict with open access.", "訂閱收入可能與開放取用衝突。"),
      card("avenue", "大道；途徑", "可走來的路", "Preregistration is one avenue to credibility.", "預註冊是可信度途徑之一。"),
      card("convenient", "方便的", "來得方便", "Convenient samples limit external claims.", "方便樣本限制外部推論。"),
      card("venture", "冒險事業；敢於", "投入前來", "Venture capital metaphors mislead basic science.", "創投隱喻誤導基礎科學。"),
      card("vent", "出口；發洩", "出氣", "Use the discussion to vent limitations, not excuses.", "討論段發洩限制，不是藉口。", "story"),
      card("contravene", "違反；抵觸", "對撞而來", "Hidden exclusions contravene the protocol.", "隱匿排除抵觸協議。"),
      card("intervention", "介入措施", "介入之物", "Name the intervention dose and delivery.", "說清介入劑量與交付。"),
      card("prevention", "預防", "防止體系", "Prevention claims need absolute risk context.", "預防宣稱需要絕對風險脈絡。"),
      card("advent", "到來；來臨", "重要到來", "The advent of cheap sequencing changed priors.", "廉價定序到來改變先驗。"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Come between to alter course:", promptZh: "介入：", choices: ["intervene", "invent after peeking", "revenue", "vent anger only"], answer: "intervene" },
      { id: "q2", type: "sense", promptEn: "Violate a rule:", promptZh: "違反：", choices: ["contravene", "convene", "avenue", "adventure"], answer: "contravene" },
      { id: "q3", type: "sense", promptEn: "Stop from happening:", promptZh: "防止：", choices: ["prevent", "event party", "venture capital only", "convenient"], answer: "prevent" },
    ],
  }),
  C({
    id: "root-vid-01", type: "root", elementLemma: "vid/vis", priority: "A",
    titleZh: "vid／vis｜視線塔", titleEn: "Vision Tower",
    hook: "字根 vid/vis＝看——誰看得見證據。",
    script: "evident 明顯可見；provide 預先看顧供應，providence／provident 遠見。revise 再看修改，supervise 監督看管，visage 臉容，visible 可見，vision 願景／視力，visit 走看，visual 視覺的，evidence 可見憑據，improvisation 臨時看著辦，invidious 招忌的比較。",
    reviewHooks: ["vid＝看：evident/provide/revise/supervise/visible/evidence", "invidious＝招人忌妒的比較"],
    pitfalls: ["provident（有遠見節儉）≠ provincial", "revise＝修改再看"],
    members: [
      card("evident", "明顯的", "看得見", "Selection is evident from the attrition table.", "從耗損表可明顯見選擇。"),
      card("provide", "提供", "預先看顧而給", "Provide code that runs on a clean machine.", "提供能在乾淨機器跑的程式。"),
      card("provident", "有遠見的；節儉的", "看得遠", "Provident archiving saves future labs.", "有遠見的典藏拯救未來實驗室。"),
      card("revise", "修訂", "再看改過", "Revise claims after the robustness battery.", "穩健電池後再修訂主張。"),
      card("supervise", "監督", "看管", "Supervise labeling to reduce drift.", "監督標註以減少漂移。"),
      card("visage", "臉容；外貌", "看上去的臉", "Do not judge a paper by journal visage alone.", "別只靠期刊臉判斷論文。", "story"),
      card("visible", "可見的", "能看見", "Make assumptions visible in a box.", "把假設放進框裡看得見。"),
      card("vision", "視力；願景", "看見的方向", "A vision without metrics is a poster.", "沒有指標的願景只是海報。", "story"),
      card("visit", "造訪", "走去看", "Visit the raw traces before summarizing.", "摘要前先看原始軌跡。", "story"),
      card("visual", "視覺的", "用眼睛看的", "Visual clutter undermines chart honesty.", "視覺雜訊破壞圖表誠實。"),
      card("evidence", "證據", "看得見的憑據", "Evidence outweighs eloquence.", "證據重於雄辯。"),
      card("improvise", "即興", "臨時看著辦", "Do not improvise exclusion rules after peeking.", "偷看後不要即興訂排除規則。"),
      card("invidious", "招忌的；不公平比較的", "看起來惹人厭的比較", "Invidious rankings ignore uncertainty.", "招忌排名忽略不確定性。"),
      card("videotape", "錄影帶／錄影（教學）", "把看見的存下", "Videotape coding training for reliability audits.", "為信度稽核錄下編碼訓練。", "story"),
      card("visage-policy", "（skip）", "x", "x", "x"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Likely to cause resentment via unfair compare:", promptZh: "招忌的不公比較：", choices: ["invidious", "evident", "visit", "visual"], answer: "invidious" },
      { id: "q2", type: "sense", promptEn: "Look at again and change:", promptZh: "修訂：", choices: ["revise", "visage", "provide money only", "vision board only"], answer: "revise" },
      { id: "q3", type: "sense", promptEn: "Overseeing work:", promptZh: "監督：", choices: ["supervise", "improvise", "evidence", "videotape hobby"], answer: "supervise" },
    ],
  }),
);

// remove bad member visage-policy
const vid = NEW.find((c) => c.id === "root-vid-01");
if (vid) {
  vid.members = vid.members.filter((m) => m.headword !== "visage-policy");
  vid.members.push(
    card("visibility", "可見度", "能見程度", "Visibility of negative results is still uneven.", "負結果可見度仍不均。"),
  );
}

NEW.push(
  C({
    id: "root-fin-01", type: "root", elementLemma: "fin", priority: "A",
    titleZh: "fin｜邊界與終結線", titleEn: "Finish Line",
    hook: "字根 fin＝終、界——畫線的地方。",
    script: "final 最終，finish 完成，finite 有限，infinite 無限。define 下定義劃界，refine 精煉邊界，confine 限制在界內，affinity 相近吸引。finance 金錢邊界管理，fine 精細／罰款，finale 終章，definitive 決定性，indefinite 不定。",
    reviewHooks: ["fin＝界／終：final/finite/define/refine/confine/definitive", "affinity＝相近；infinite＝無界"],
    pitfalls: ["finite ≠ infinite", "define＝劃界定義"],
    members: [
      card("final", "最終的", "終線", "Final analyses should match the preregistered set.", "最終分析應對齊預註冊集合。"),
      card("finish", "完成", "跑到終點", "Finish robustness before press quotes.", "新聞稿前先完成穩健檢查。", "story"),
      card("finite", "有限的", "有邊界", "Attention is finite; prioritize claims.", "注意力有限；排序主張。"),
      card("infinite", "無限的", "無邊界", "Infinite flexibility makes false positives infinite too.", "無限彈性也讓假陽性無限。"),
      card("define", "定義", "劃界", "Define success criteria before launch.", "啟動前定義成功標準。"),
      card("refine", "精煉；改進", "把界修細", "Refine the codebook after pilot disagreements.", "試點分歧後精煉編碼簿。"),
      card("confine", "限制；禁閉", "關在界內", "Confine exploratory plots to a sandbox.", "探索圖關在沙盒內。"),
      card("affinity", "親近；親和", "界線靠近", "Affinity for a theory can bias coding.", "對理論的親近感會偏差編碼。"),
      card("finance", "金融；資助", "管錢的邊界", "Who finances the trial must be disclosed.", "誰資助試驗必須揭露。", "story"),
      card("finale", "終章", "最後一幕", "The finale should restate limits, not hype.", "終章應重申限制，而非炒作。", "story"),
      card("definitive", "決定性的；權威的", "一錘定界", "No single study is definitive.", "沒有單一研究具決定性。"),
      card("indefinite", "不定的；無限期的", "界不清楚", "Indefinite postponement kills accountability.", "無限期延期殺死課責。"),
      card("finality", "終結性；定局", "已到終點感", "Treat editorial finality as provisional.", "把編輯定局當暫定。"),
      card("refinement", "精煉；改進", "修細的產品", "Each refinement should be logged.", "每次精煉應記錄。"),
      card("unfinished", "未完成的", "沒到終線", "Unfinished robustness is unfinished science.", "未完成穩健＝未完成科學。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Having bounds; not endless:", promptZh: "有限：", choices: ["finite", "infinite", "finale concert", "finance bank only"], answer: "finite" },
      { id: "q2", type: "sense", promptEn: "Mark the meaning boundaries:", promptZh: "定義劃界：", choices: ["define", "affinity friendship only", "unfinished", "deport"], answer: "define" },
      { id: "q3", type: "sense", promptEn: "Authoritative / conclusive:", promptZh: "決定性／權威：", choices: ["definitive", "indefinite", "confine jail only", "scribble"], answer: "definitive" },
    ],
  }),
  C({
    id: "root-dict-01", type: "root", elementLemma: "dict", priority: "A",
    titleZh: "dict｜言說法庭", titleEn: "Dictum Court",
    hook: "字根 dict＝說——誰說了算。",
    script: "dictate 口述命令；predict 預先說。contradict 反過來說，verdict 真實的裁決之說。dictionary 詞典，dictum 正式意見，edict 公告，indict 起訴指控，benediction 祝福之說，malediction 詛咒，jurisdiction 司法言說範圍，abdicate 已在詞庫——這裡看 dedicate 奉獻宣告。",
    reviewHooks: ["dict＝說：dictate/predict/contradict/verdict/edict/indict", "contradict＝矛盾反說；jurisdiction＝管轄言說範圍"],
    pitfalls: ["indict＝起訴（發音特殊）", "dictum ≠ dictumum"],
    members: [
      card("dictate", "口述；命令；決定", "說了就算", "Do not let deadlines dictate design quality.", "別讓截止日決定設計品質。"),
      card("predict", "預測", "預先說", "Predict direction and rough magnitude when possible.", "盡可能預測方向與大致幅度。"),
      card("contradict", "反駁；矛盾", "反過來說", "New data may contradict a cherished model.", "新資料可能矛盾於鍾愛模型。"),
      card("verdict", "裁決；定論", "真實之說的結果", "The verdict on generalizability is still out.", "概化性的定論尚未出爐。"),
      card("dictionary", "詞典", "標準說法本", "Operational definitions beat dictionary hand-waving.", "操作定義勝過詞典空談。", "story"),
      card("dictum", "正式聲明；格言式意見", "權威一句話", "A famous dictum is not a citation.", "名言不是引用。"),
      card("edict", "敕令；公告", "官方說出的令", "Lab edicts should be versioned like code.", "實驗室公告應像程式一樣版本化。"),
      card("indict", "起訴；控告", "正式指控之說", "Do not indict a field for one bad paper.", "不要因一篇爛文起訴整個領域。"),
      card("benediction", "祝福", "好話說出口", "The acknowledgments need not be a benediction marathon.", "誌謝不必變成祝福馬拉松。", "story"),
      card("malediction", "詛咒", "壞話咒語", "Online malediction is not peer review.", "網路詛咒不是同儕審查。"),
      card("jurisdiction", "管轄權", "能說了算的範圍", "Clarify statistical jurisdiction of each analysis.", "釐清各分析的統計管轄。"),
      card("dedicate", "奉獻；致力於", "宣告獻給", "Dedicate a section to negative controls.", "專節獻給負控制。"),
      card("predictor", "預測變項／預測器", "用來預先說的東西", "A strong predictor is not automatically a cause.", "強預測子不自動是原因。"),
      card("contradiction", "矛盾", "反說的狀態", "Resolve contradiction before meta-analysis.", "統合分析前先處理矛盾。"),
      card("dictatorial", "獨裁的", "一人說了算", "Dictatorial lab culture suppresses error reports.", "獨裁實驗室文化壓抑錯誤報告。"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Say the opposite; conflict with:", promptZh: "矛盾／反駁：", choices: ["contradict", "dictate notes only", "dictionary", "benediction"], answer: "contradict" },
      { id: "q2", type: "sense", promptEn: "Formally charge with a crime:", promptZh: "起訴：", choices: ["indict", "edict party", "verdict cake", "predictor"], answer: "indict" },
      { id: "q3", type: "sense", promptEn: "Authority area:", promptZh: "管轄範圍：", choices: ["jurisdiction", "malediction", "sport", "pour"], answer: "jurisdiction" },
    ],
  }),
  C({
    id: "root-jud-01", type: "root", elementLemma: "jud/jur/jus", priority: "A",
    titleZh: "jud／jur｜審判席", titleEn: "Judgment Bench",
    hook: "字根 jud/jur/jus＝法、判——誰來審。",
    script: "judge 法官／判斷，judicial 司法的，judicious 明斷的。prejudice 預先判決，adjudicate 裁決。jury 陪審團，juridical 法律上的，justice 正義，justify 辯護使正當，injustice 不義，jurisdiction 已在 dict 族——這裡看 perjury 偽證，injury 傷害。",
    reviewHooks: ["jud＝判：judge/judicial/judicious/prejudice/adjudicate/justify", "prejudice＝預先偏判；perjury＝偽證"],
    pitfalls: ["judicious（明智判斷）≠ judicial（司法的）", "justify＝提出正當理由"],
    members: [
      card("judge", "判斷；法官", "下判斷的人", "Judge models by out-of-sample performance.", "用樣本外表現判斷模型。"),
      card("judicial", "司法的", "法庭那套", "Keep a judicial separation between exploration and confirmation.", "探索與確認保持司法式分離。"),
      card("judicious", "明斷的；審慎的", "判得明智", "Judicious pruning of covariates beats kitchen-sink models.", "審慎修剪共變勝過一鍋炒。"),
      card("prejudice", "偏見；損害", "預先判了", "Prejudice enters when labels leak into coding.", "標籤洩漏進編碼時偏見進入。"),
      card("adjudicate", "裁決", "正式判", "Let a precommitted rule adjudicate borderline cases.", "用預先承諾規則裁決邊界案例。"),
      card("jury", "陪審團", "一群判的人", "A jury of peers still needs conflict disclosures.", "同儕陪審仍需利益揭露。", "story"),
      card("justice", "正義；司法", "公正之判", "Procedural justice matters in authorship disputes.", "作者權爭議中程序正義重要。"),
      card("justify", "證明正當；對齊", "說出為何可判如此", "Justify each exclusion in one sentence.", "每項排除用一句話證明正當。"),
      card("injustice", "不義", "錯判的結構", "Citation injustice tracks prestige gradients.", "引用不義追蹤聲望梯度。"),
      card("perjury", "偽證", "假誓言", "Fabrication is the perjury of science.", "造假是科學的偽證。"),
      card("injury", "傷害", "被判痛的結果", "Underpowered studies can still cause injury via false hope.", "低檢定力研究仍可透過假希望造成傷害。"),
      card("juridical", "法律上的；司法的", "法的面向", "Juridical metaphors help, but biology is not a courtroom.", "法律隱喻有用，但生物不是法庭。"),
      card("judgment", "判斷；判決", "判斷本身", "Suspend judgment until diagnostics are clean.", "診斷乾淨前先懸置判斷。"),
      card("prejudicial", "有 Harm／偏見的", "會造成預判傷害", "Prejudicial language in reviews should be edited out.", "審稿中的偏見語言應刪除。"),
      card("unjust", "不公正的", "不義的", "Unjust authorship norms waste talent.", "不公正作者規範浪費人才。"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "judicious vs judicial:", promptZh: "明斷 vs 司法：", choices: ["wise judgment vs of the courts", "same", "both mean unfair", "spelling only"], answer: "wise judgment vs of the courts" },
      { id: "q2", type: "sense", promptEn: "Preconceived bias:", promptZh: "偏見：", choices: ["prejudice", "jury lunch", "injury bruise only", "statue"], answer: "prejudice" },
      { id: "q3", type: "sense", promptEn: "Lying under oath (science analogy: fabrication):", promptZh: "偽證：", choices: ["perjury", "justify margins", "judicous typo", "advent"], answer: "perjury" },
    ],
  }),
);

NEW.push(
  C({
    id: "rhyme-ain-01", type: "rhyme", elementLemma: "-ain/-ane", priority: "B",
    titleZh: "-ain｜抱怨與訓練營", titleEn: "The -ain Camp",
    hook: "尾巴 -ain：抱怨、解釋、約束、大腦與排水管。",
    script: "抱怨 complain，解釋 explain，約束 restrain／constraint。大腦 brain，排水 drain，木頭 grain，染 stain，緊張 strain，獲得 gain，主要 main，平原 plain，雨 rain——串成一座吵闹訓練營。",
    reviewHooks: ["-ain：complain/explain/restrain/constraint/strain/gain", "constraint＝約束條件"],
    pitfalls: ["restrain（抑制）vs constraint（名詞約束）", "plain ≠ plane"],
    members: [
      card("complain", "抱怨", "營裡喊不平", "Reviewers may complain about missing power analysis.", "審稿人可能抱怨缺少檢定力分析。", "story"),
      card("explain", "解釋", "講清楚", "Explain exclusions before results.", "結果前先解釋排除。", "story"),
      card("restrain", "抑制；拘束", "拉住不讓衝", "Restrain causal verbs without identification.", "沒識別就抑制因果動詞。", "story"),
      card("constraint", "約束；限制", "營規", "Budget is a hard constraint on sample size.", "預算是樣本量硬約束。", "story"),
      card("strain", "拉緊；張力；菌株", "緊繃", "Strain on staff predicts coding errors.", "人員緊繃預測編碼錯誤。", "story"),
      card("gain", "獲得", "練到的進步", "Report absolute risk gain, not relative alone.", "報告絕對風險獲益，不只相對。", "story"),
      card("main", "主要的", "主線", "Keep the main hypothesis visually first.", "主假說視覺上放最前。", "story"),
      card("plain", "清楚的；平原", "一眼平原", "Use plain language in consent forms.", "同意書用清楚語言。", "story"),
      card("stain", "污漬；染色", "沾上的斑", "A ethics stain spreads faster than a correction.", "倫理污點比更正傳更快。", "story"),
      card("drain", "排水；耗盡", "流走精力", "Meetings can drain analytic attention.", "會議會排乾分析注意力。", "story"),
      card("brain", "腦", "營指揮部", "Brain-friendly figures beat dense tables sometimes.", "有時腦友好圖勝密集表。", "story"),
      card("grain", "穀粒；紋理；一點點", "一粒", "Take findings with a grain of uncertainty.", "帶著一粒不確定性看待發現。", "story"),
      card("rain", "雨", "營外下雨", "When critiques rain, triage by severity.", "批評如雨時依嚴重度分流。", "story"),
      card("train", "訓練；火車", "操練", "Train annotators with gold standards.", "用金標準訓練標註者。", "story"),
      card("maintain", "維持", "（構詞橋）保持營運", "Maintain version control on the codebook.", "維持編碼簿版本控制。", "morphology"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "A limiting condition:", promptZh: "約束條件：", choices: ["constraint", "complain", "rain", "brain"], answer: "constraint" },
      { id: "q2", type: "sense", promptEn: "Hold back:", promptZh: "抑制：", choices: ["restrain", "explain joke", "stain shirt only", "grain rice only"], answer: "restrain" },
      { id: "q3", type: "sense", promptEn: "Clear; not fancy:", promptZh: "清楚樸素：", choices: ["plain", "plane flight", "train station only", "drain sink only"], answer: "plain" },
    ],
  }),
  C({
    id: "sem-clear-01", type: "semantic", elementLemma: "clear-vs-obscure", priority: "A",
    titleZh: "清晰 ↔ 晦澀", titleEn: "Clear vs Obscure",
    hook: "一邊玻璃窗，一邊霧玻璃——GRE 最愛考『說得清不清』。",
    script: "清晰：lucid、explicit、perspicuous、transparent。晦澀：obscure、opaque、ambiguous、equivocal（voc 族已練）、vague、abstruse、recondite。用對打一次記兩排。",
    reviewHooks: ["清：lucid/explicit/transparent/perspicuous", "晦：obscure/opaque/vague/abstruse/recondite"],
    pitfalls: ["explicit≠implicit", "opaque 可指不透明或難懂"],
    members: [
      card("lucid", "清晰的；清醒的", "玻璃窗", "A lucid limitation section builds trust.", "清晰限制段建立信任。", "contrast"),
      card("explicit", "明確的", "寫在外面", "Be explicit about missing-data rules.", "缺值規則要明確。", "contrast"),
      card("perspicuous", "明白易懂的", "透亮", "Prefer perspicuous diagrams over ornament.", "寧可明白圖，不要裝飾。", "contrast"),
      card("transparent", "透明的", "可透視", "Transparent pipelines enable audit.", "透明管線可稽核。", "contrast"),
      card("obscure", "晦澀的；遮掩", "霧玻璃", "Jargon can obscure a simple design flaw.", "行話會遮掩簡單設計缺陷。", "contrast"),
      card("opaque", "不透明的；難懂的", "墨玻璃", "Opaque preprocessing invites distrust.", "不透明前處理招致不信。", "contrast"),
      card("ambiguous", "模稜的", "兩種影子", "Ambiguous items destroy interrater reliability.", "模稜題項摧毀評分者信度。", "contrast"),
      card("vague", "含糊的", "霧", "Vague hypotheses cannot fail.", "含糊假說不會失敗。", "contrast"),
      card("abstruse", "深奧難解的", "霧很厚", "Abstruse prose is not rigor.", "深奧難解文筆≠嚴謹。", "contrast"),
      card("recondite", "深奧的；隱僻的", "藏很深", "Recondite citations should still be findable.", "隱僻引用仍應可找到。", "contrast"),
      card("implicit", "隱含的", "沒寫在外面", "Make implicit assumptions explicit.", "把隱含假設說明白。", "contrast"),
      card("clarity", "清晰", "清的名詞", "Clarity is a ethical duty in consent.", "同意書裡清晰是倫理義務。", "contrast"),
      card("nebula", "星雲（比喻一團霧）", "宇宙霧", "A nebula of buzzwords is not a theory.", "術語星雲不是理論。", "story"),
      card("crystal", "水晶（比喻清楚）", "結晶清楚", "Crystal-clear stopping rules prevent peeking.", "水晶般清楚的停止規則防偷看。", "story"),
      card("muddy", "混濁的", "泥水", "Muddy contrasts weaken identification stories.", "混濁對照削弱識別故事。", "contrast"),
    ],
    quiz: [
      { id: "q1", type: "contrast", promptEn: "Easy to understand; clear:", promptZh: "清晰易懂：", choices: ["lucid", "abstruse", "opaque", "muddy"], answer: "lucid" },
      { id: "q2", type: "contrast", promptEn: "Hard to see through (figurative):", promptZh: "難看穿／不透明：", choices: ["opaque", "transparent", "explicit", "crystal"], answer: "opaque" },
      { id: "q3", type: "contrast", promptEn: "Not stated directly:", promptZh: "隱含：", choices: ["implicit", "explicit", "clarity", "perspicuous"], answer: "implicit" },
    ],
  }),
  C({
    id: "look-pair-01", type: "lookalike", elementLemma: "imply-infer", priority: "A",
    titleZh: "形近／易混對決包", titleEn: "Look-alike Pack",
    hook: "考場花眼專用：成對拆開，不准混打。",
    script: "imply 暗示（說者）↔ infer 推論（聽者）。averse 厭惡 ↔ adverse 不利。discrete 分離 ↔ discreet 謹慎。censor 審查 ↔ censure 譴責。incredible 難以置信（事）↔ incredulous 不信（人）已在 cred 族。appraise 估價 ↔ apprise 通知。allude 暗指 ↔ elude 躲避。",
    reviewHooks: ["imply↔infer；averse↔adverse；discrete↔discreet；censor↔censure", "allude＝暗指；elude＝躲過"],
    pitfalls: ["每對只差拼寫／角色，造句先問『誰做動作』", "discrete 常用於數學／類別分離"],
    members: [
      card("imply", "暗示；意味著", "說者丟線索", "Does the abstract imply causality it did not identify?", "摘要是否暗示未識別的因果？", "lookalike"),
      card("averse", "厭惡的；不願的", "主觀不想", "Risk-averse editors may over-weight novelty.", "厭惡風險的編輯可能過度看重新奇。", "lookalike"),
      card("discrete", "分離的；離散的", "分開的點", "Use discrete categories only if theoretically clean.", "唯有理論乾淨才用離散類別。", "lookalike"),
      card("discreet", "謹慎的；不張揚的", "小心不張揚", "Be discreet with identifiable qualitative excerpts.", "可識別質性摘錄要謹慎。", "lookalike"),
      card("censor", "審查；刪改", "擋內容", "Do not censor inconvenient robustness failures.", "不要審查掉不便的穩健失敗。", "lookalike"),
      card("censure", "譴責", "罵／正式非難", "Public censure should follow due process.", "公開譴責應經正當程序。", "lookalike"),
      card("appraise", "評估；估價", "估價值", "Appraise study quality with a rubric, not vibes.", "用量表評估研究品質，不要靠感覺。", "lookalike"),
      card("apprise", "通知", "告知", "Apprise coauthors of all deviations promptly.", "及時通知共同作者所有偏離。", "lookalike"),
      card("allude", "暗指", "側面提到", "Allude to related work without dumping twenty names.", "暗指相關研究，不要傾倒二十人名。", "lookalike"),
      card("elude", "躲避；使不懂", "躲過", "A clear write-up should not elude non-specialists entirely.", "清楚寫作不該完全讓非專家看不懂。", "lookalike"),
      card("perspective", "視角；觀點", "看的角度", "State the theoretical perspective up front.", "先說理論視角。", "lookalike"),
      card("prospective", "前瞻的；預期的", "往前看的設計", "Prefer prospective registration when feasible.", "可行時寧用前瞻註冊。", "lookalike"),
      card("historic", "歷史性的；有歷史意義的", "史上少見", "A historic leak is still one case.", "歷史性洩漏仍是單案。", "lookalike"),
      card("historical", "歷史的；有關歷史的", "歷史相關", "Provide historical context for the measure.", "為測量提供歷史脈絡。", "lookalike"),
      card("venal", "貪贓的", "可收買", "Venal incentives corrupt peer review.", "貪贓誘因腐化同儕審查。", "lookalike"),
      card("venial", "可恕的（小過）", "可原諒小錯", "A venial typo is not research misconduct.", "可恕的打字錯誤不是研究不端。", "lookalike"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Speaker hints vs listener concludes:", promptZh: "說者暗示 vs 聽者推論：", choices: ["imply / infer", "infer / imply", "censor / censure", "allude / elude"], answer: "imply / infer" },
      { id: "q2", type: "lookalike", promptEn: "Separate/distinct vs careful/tactful:", promptZh: "分離 vs 謹慎：", choices: ["discrete / discreet", "discreet / discrete", "venal / venial", "historic / historical"], answer: "discrete / discreet" },
      { id: "q3", type: "lookalike", promptEn: "Corruptible vs forgivable fault:", promptZh: "貪贓 vs 可恕小過：", choices: ["venal / venial", "venial / venal", "appraise / apprise", "averse / adverse"], answer: "venal / venial" },
    ],
  }),
);

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
    qualityGate: { reviewedAt: new Date().toISOString().slice(0, 10), stage: "S3b" },
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
  // drop dups inside cluster
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
    qualityGate: { reviewedAt: new Date().toISOString().slice(0, 10), stage: "S3b" },
  };
  fs.writeFileSync(path.join(clusterDir, `${cluster.id}.json`), `${JSON.stringify(cluster, null, 2)}\n`);
  const lesson = buildLesson({ ...cluster, quiz: raw.quiz });
  fs.writeFileSync(path.join(lessonDir, `${lesson.id}.json`), `${JSON.stringify(lesson, null, 2)}\n`);
  for (const m of cluster.members) existing.add(m.headword);
  written.push({ id: cluster.id, n: cluster.members.length });
}

// refresh indexes
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
  `${JSON.stringify({ version: "v0.4-s3b", total: lessonIndex.length, lessons: lessonIndex }, null, 2)}\n`,
);

const vocab = new Set([...vocabMap.keys()]);
const unique = new Set();
for (const c of allClusters) for (const m of c.members || []) unique.add(m.headword);

fs.writeFileSync(
  path.join(humorDir, "index.json"),
  `${JSON.stringify(
    {
      version: "v0.4-s3b",
      status: "stage3b-complete",
      uniqueWords: unique.size,
      clusters: allClusters.map((c) => ({
        id: c.id,
        type: c.type,
        titleZh: c.titleZh,
        priority: c.priority || "A",
        status: c.status,
        memberCount: (c.members || []).length,
        inVocab: (c.members || []).filter((m) => vocab.has(m.headword) || m.inVocab).length,
        pendingAdd: (c.members || [])
          .filter((m) => !(vocab.has(m.headword) || m.inVocab))
          .map((m) => m.headword),
      })),
      lessons: lessonIndex,
    },
    null,
    2,
  )}\n`,
);

// patch elements clusterIds lightly
const elementsPath = path.join(humorDir, "elements.json");
const elementsDoc = JSON.parse(fs.readFileSync(elementsPath, "utf8"));
for (const w of written) {
  const raw = NEW.find((n) => n.id === w.id);
  if (!raw) continue;
  const needle = String(raw.elementLemma || "").split("/")[0].toLowerCase();
  const el = elementsDoc.elements.find(
    (e) => e.type === raw.type || (raw.type === "root" && e.type === "root"),
  );
  // better match
  const el2 =
    elementsDoc.elements.find(
      (e) => e.lemma.toLowerCase().includes(needle) && (e.type === raw.type || (raw.type === "rhyme" && e.type === "rhyme")),
    ) || el;
  if (el2 && !el2.clusterIds.includes(w.id)) el2.clusterIds.push(w.id);
}
elementsDoc.counts.withCluster = elementsDoc.elements.filter((e) => e.clusterIds.length > 0).length;
fs.writeFileSync(elementsPath, `${JSON.stringify(elementsDoc, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      written: written.length,
      writtenDetail: written,
      blocked,
      totalClusters: allClusters.length,
      uniqueWords: unique.size,
      targetOk: unique.size >= 500,
    },
    null,
    2,
  ),
);
