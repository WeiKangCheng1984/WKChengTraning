/**
 * P2-batch03: ~20 clusters, humor-complete (hook/script/cards/quiz/TTS lines).
 * node web/scripts/gre-humor-p2-batch03.js
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
const STAGE = "P2-batch03";

const NEW = [
  {
    id: "root-noc-01", type: "root", elementLemma: "noc/nox", priority: "B",
    titleZh: "noc／nox｜有害物質管制局", titleEn: "Nox Hazard Bureau",
    hook: "字根 noc/nox＝害——管制局門口寫：無辜／有罪／夜間加班都可能『有害』。",
    script:
      "innocent 自稱無害通行證。noxious／obnoxious 毒氣與討人厭同事。innocuous 看起來無害其實要驗。noxious fumes 從附錄冒出；innocence 被審核追問——局長章：innocuous 寫作可以，noxious 誘因不行；obnoxious 語氣零分。",
    reviewHooks: ["noc＝害：innocent/innocuous/noxious/obnoxious", "innocuous＝無害的"],
    pitfalls: ["innocent＝無辜；innocuous＝無害無冒犯", "noxious＝有害的"],
    members: [
      card("innocent", "無辜的；天真的", "無害通行證", "An innocent typo is not research misconduct.", "無辜打字錯誤不是研究不端。"),
      card("innocuous", "無害的；無冒犯的", "驗過的無害", "An innocuous footnote can still hide a swap.", "無害腳註仍可能藏替換。"),
      card("noxious", "有害的；有毒的", "毒氣警報", "Noxious incentives reward flashy false positives.", "有害誘因獎勵炫目假陽性。"),
      card("obnoxious", "討厭的；可憎的", "討人厭同事", "Obnoxious sarcasm sinks valid critique.", "討厭諷刺毁掉有效批評。"),
      card("innocence", "無辜；清白", "清白檔案", "Presume innocence, then audit the logs.", "先假定清白，再稽核日誌。"),
      card("noxiousness", "有害性", "毒値", "Measure the noxiousness of paywalled data.", "測量付費牆資料的有害性。", "story"),
      card("harmless", "無害的", "無害近親", "Harmless metaphors can still mislead.", "無害隱喻仍可能誤導。", "story"),
      card("toxic", "有毒的", "毒標籤", "Toxic lab culture blocks error reports.", "有毒實驗室文化阻擋錯誤回報。", "story"),
      card("nuisance", "滋擾", "小害蟲", "A nuisance bug still needs a ticket.", "滋擾級錯誤仍需開單。", "story"),
      card("contaminate", "污染", "弄髒樣本", "Do not contaminate the analysis with peeks.", "不要用偷看污染分析。", "story"),
      card("poison", "毒藥", "劇毒誘因", "Publication poison is silent outcome switching.", "發表毒藥是沉默更換結局。", "story"),
      card("antidote", "解毒劑", "解藥", "Preregistration is an antidote to fishing.", "預註冊是淘篩解毒劑。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Harmless; not offensive:", promptZh: "無害無冒犯：", choices: ["innocuous", "noxious", "obnoxious", "toxic"], answer: "innocuous" },
      { id: "q2", type: "sense", promptEn: "Harmful; poisonous:", promptZh: "有害：", choices: ["noxious", "innocent", "innocence", "harmless"], answer: "noxious" },
      { id: "q3", type: "sense", promptEn: "Extremely unpleasant; offensive:", promptZh: "討厭可憎：", choices: ["obnoxious", "innocuous", "antidote", "nuisance"], answer: "obnoxious" },
    ],
  },
  {
    id: "root-simil-01", type: "root", elementLemma: "simil/simul", priority: "B",
    titleZh: "simil｜相似模仿影棚", titleEn: "Simil Lookalike Studio",
    hook: "字根 simil/simul＝相似——影棚專管相像、同時、假裝與彙整。",
    script:
      "similar／similarity 長得很像。simulate／simulation 用替身拍危險戲。simultaneous 多機同時開拍。assimilate 把新人同化進劇組；facsimile 傳真複本；dissimilar 根本不是同一劇——導演：simulate 可以，假資料不行；facsimile ≠ 原始檔。",
    reviewHooks: ["simil＝似：similar/simulate/simultaneous/assimilate/facsimile", "simulate＝模擬"],
    pitfalls: ["assimilate＝同化／吸收", "facsimile＝精確複本"],
    members: [
      card("similar", "相似的", "長得很像", "Similar p-values do not imply same mechanisms.", "相似 p 值不代表同一機制。"),
      card("similarity", "相似性", "像的程度", "Report similarity metrics with caveats.", "報告相似性指標並附但書。"),
      card("simulate", "模擬", "替身拍戲", "Simulate missingness before claiming robustness.", "宣稱穩健前先模擬缺失。"),
      card("simulation", "模擬；假裝", "替身場次", "A simulation is not a substitute for field data alone.", "模擬不能單獨取代田野資料。"),
      card("simultaneous", "同時的", "多機同拍", "Avoid simultaneous unblinded peeks.", "避免同時非盲偷看。"),
      card("assimilate", "同化；吸收", "新人進劇組", "Assimilate open norms without erasing dissent.", "同化開放規範但不抹掉異議。"),
      card("facsimile", "精確複本；傳真", "複本道具", "A facsimile PDF is not editable raw data.", "傳真式 PDF 不是可編輯原始資料。"),
      card("dissimilar", "不相似的", "根本不像", "Dissimilar cohorts need stratified claims.", "不相似世代需要分層主張。"),
      card("simile", "明喻", "像什麼的修辭", "A simile in the intro is not identification.", "導論明喻不是識別策略。", "story"),
      card("semblance", "外表；相似外表", "看起來像", "A semblance of rigor is still fog.", "嚴謹的外表仍是霧。", "story"),
      card("verisimilitude", "逼真；酷似真實", "超像真", "Verisimilitude in examples helps teaching.", "例子逼真有助教學。", "story"),
      card("simultaneously", "同時地", "同拍副詞", "Do not edit code and results simultaneously unchecked.", "不要同時改碼與結果且不檢查。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Imitate a process by model:", promptZh: "模擬：", choices: ["simulate", "noxious", "obnoxious", "resign"], answer: "simulate" },
      { id: "q2", type: "sense", promptEn: "Exact copy:", promptZh: "精確複本：", choices: ["facsimile", "simile", "terror", "vortex"], answer: "facsimile" },
      { id: "q3", type: "sense", promptEn: "Absorb into a culture/system:", promptZh: "同化吸收：", choices: ["assimilate", "impede", "detest", "devour"], answer: "assimilate" },
    ],
  },
  {
    id: "root-sum-01", type: "root", elementLemma: "sum", priority: "B",
    titleZh: "sum｜加總提款機", titleEn: "Sum Total ATM",
    hook: "字根 sum＝拿、總——提款機專管總結、消費、假定與傲慢帳單。",
    script:
      "summary／summarize 列印總結小票。consume／consumer／consumption 把餘額花掉。assume／assumption 先假定密碼對。presumptuous 還沒刷卡就自以為VIP；sumptuous 豪華帳單——行員：assume 要寫明；presumptuous 語氣會被拒單。",
    reviewHooks: ["sum＝總／拿：summary/consume/assume/assumption/presumptuous", "presumptuous＝僭越自負"],
    pitfalls: ["assume≠ ensure", "sumptuous＝奢華的"],
    members: [
      card("summary", "摘要；總結", "總結小票", "A summary must list limitations.", "摘要必須列出限制。"),
      card("summarize", "總結", "列印總結", "Summarize without erasing uncertainty.", "總結時不要抹掉不確定性。"),
      card("consume", "消耗；消費", "花掉餘額", "Do not consume the whole alpha on fishing.", "不要把 α 全花在淘篩上。"),
      card("consumer", "消費者", "刷卡的人", "Treat readers as skeptical consumers of claims.", "把讀者當懷疑的主張消費者。"),
      card("consumption", "消耗；消費", "花費流水", "Track compute consumption in methods.", "方法段追蹤計算消耗。"),
      card("assume", "假定；承擔", "先假定", "State what you assume about missingness.", "說明你對缺失的假定。"),
      card("assumption", "假設", "密碼前提", "Every causal claim hides assumptions.", "每個因果主張都藏假設。"),
      card("presumptuous", "僭越的；自負的", "自以為VIP", "It is presumptuous to skip preregistration.", "跳過預註冊很僭越。"),
      card("sumptuous", "奢華的", "豪華帳單", "Sumptuous prose cannot buy identification.", "奢華文風買不到識別。", "story"),
      card("resume", "繼續；履歷", "再提款", "Resume enrollment only after lock.", "鎖定後才繼續收案。", "story"),
      card("summit", "高峰；峰會", "加總頂點", "Do not claim a summit from one pilot.", "不要用一次試點宣稱高峰。", "story"),
      card("sum", "總和", "加總鍵", "Report the sum of exclusions.", "報告排除總和。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Overly bold; taking liberties:", promptZh: "僭越自負：", choices: ["presumptuous", "innocuous", "similar", "vital"], answer: "presumptuous" },
      { id: "q2", type: "sense", promptEn: "Take as true without proof:", promptZh: "假定：", choices: ["assume", "simulate", "detest", "expedite"], answer: "assume" },
      { id: "q3", type: "sense", promptEn: "Use up; eat/drink:", promptZh: "消耗：", choices: ["consume", "attest", "orient", "laud"], answer: "consume" },
    ],
  },
  {
    id: "root-thesis-01", type: "root", elementLemma: "thesis", priority: "B",
    titleZh: "thesis｜命題對打擂台", titleEn: "Thesis Debate Ring",
    hook: "字根 thesis＝放、命題——擂台左右是正題與反題，合成才是結局。",
    script:
      "thesis 正方命題放上桌。antithesis 反方對打。synthesis 合成收場。hypothesis 待驗假說；parenthesis 括號旁白。prosthesis 義肢道具（詞源『放在前面』）——裁判：hypothesis 要可打；parenthesis 別塞進結局變項。",
    reviewHooks: ["thesis＝命題：thesis/antithesis/synthesis/hypothesis/parenthesis", "antithesis＝對立面"],
    pitfalls: ["hypothesis＝假說", "synthesis＝綜合／合成"],
    members: [
      card("thesis", "論題；論文", "正方命題", "State the thesis before the literature fog.", "文獻迷霧前先陳述論題。"),
      card("antithesis", "對立面；對照", "反方對打", "Report the antithesis finding honestly.", "誠實報告對立發現。"),
      card("synthesis", "綜合；合成", "合成收場", "A synthesis of replications beats one hit.", "複現綜合勝過單次爆紅。"),
      card("hypothesis", "假說", "待驗命題", "Preregister the hypothesis, not the punchline.", "預註冊假說，不是笑點。"),
      card("parenthesis", "括號；插句", "旁白括號", "Do not hide exclusions in a parenthesis.", "不要把排除藏在括號裡。"),
      card("prosthesis", "義肢；假體", "前方加裝道具", "A statistical prosthesis cannot fix bad design.", "統計義肢修不好壞設計。"),
      card("hypothetical", "假設的", "假如對打", "Keep hypotheticals labeled as such.", "假設情境要標清楚。", "story"),
      card("synthesize", "綜合；合成", "做合成", "Synthesize evidence with explicit weights.", "用明確權重綜合證據。", "story"),
      card("hypothesize", "提出假說", "放上假說", "Hypothesize before you peek.", "偷看前先提出假說。", "story"),
      card("dissertation", "學位論文", "長命題", "A dissertation needs open materials.", "學位論文需要開放材料。", "story"),
      card("proposition", "命題；提議", "討論桌上的句", "Test one proposition at a time when possible.", "可能時一次檢驗一個命題。", "story"),
      card("counterthesis", "反論題", "對打卡", "Write the counterthesis in the discussion.", "在討論寫反論題。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Direct opposite:", promptZh: "對立面：", choices: ["antithesis", "innocuous", "facsimile", "vortex"], answer: "antithesis" },
      { id: "q2", type: "sense", promptEn: "Combining into a whole:", promptZh: "綜合合成：", choices: ["synthesis", "noxious", "pedestal", "terror"], answer: "synthesis" },
      { id: "q3", type: "sense", promptEn: "Testable proposed explanation:", promptZh: "假說：", choices: ["hypothesis", "summary", "horoscope", "glutton"], answer: "hypothesis" },
    ],
  },
  {
    id: "root-trud-01", type: "root", elementLemma: "trud/trus", priority: "B",
    titleZh: "trud｜推擠閘門", titleEn: "Trud Push Gate",
    hook: "字根 trud/trus＝推——閘門專管硬推、侵入、突出與抽象。",
    script:
      "intrude／intrusion／intruder 硬闖閘門。obtrude／obtrusive 硬把東西推到眼前。protrude 往外突出。abstruse 推到抽象雲端看不懂；extrude 擠出成形——門衛：obtrusive 浮水印不行；abstruse 方法要翻譯。",
    reviewHooks: ["trud＝推：intrude/obtrude/protrude/abstruse/extrude", "abstruse＝深奧難懂"],
    pitfalls: ["obtrude／obtrusive＝強加／礙眼", "abstruse≠ abstract 完全等同"],
    members: [
      card("intrude", "侵入；打擾", "硬闖", "Do not intrude on blinded analysis.", "不要侵入盲法分析。"),
      card("intrusion", "侵入", "闖閘事件", "Data intrusion requires incident response.", "資料侵入需要事故應變。"),
      card("intruder", "入侵者", "闖閘的人", "Treat silent forks as protocol intruders.", "把沉默分叉當規程入侵者。"),
      card("obtrude", "強加；突出", "硬推到眼前", "Do not obtrude ideology onto measures.", "不要把意識形態強加到測量。"),
      card("obtrusive", "礙眼的；強加的", "擋視線", "Keep branding non-obtrusive on figures.", "圖上品牌不要礙眼。"),
      card("protrude", "突出；伸出", "往外凸", "Outliers that protrude need rules, not vibes.", "突出極端值需要規則不是感覺。"),
      card("abstruse", "深奧難懂的", "推到雲端", "Abstruse jargon blocks cumulative science.", "深奧行話阻擋累積科學。"),
      card("extrude", "擠出", "擠出成形", "Extrude clear takeaways from dense tables.", "從密集表擠出清楚重點。", "story"),
      card("thrust", "推力", "推一把", "Thrust transparency into the workflow.", "把透明推進工作流。", "story"),
      card("intrusive", "侵擾的", "太侵入", "Intrusive surveys need stronger consent.", "侵擾式問卷需要更強同意。", "story"),
      card("unobtrusive", "不顯眼的", "不擋路", "Prefer unobtrusive watermarks.", "偏好不顯眼浮水印。", "story"),
      card("pushy", "硬推的", "推銷感", "Pushy claims invite skepticism.", "硬推主張招來懷疑。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Hard to understand; esoteric:", promptZh: "深奧難懂：", choices: ["abstruse", "innocuous", "similar", "vivid"], answer: "abstruse" },
      { id: "q2", type: "sense", promptEn: "Enter without invitation:", promptZh: "侵入：", choices: ["intrude", "consume", "orient", "laud"], answer: "intrude" },
      { id: "q3", type: "sense", promptEn: "Stick out; project:", promptZh: "突出：", choices: ["protrude", "assume", "detest", "attest"], answer: "protrude" },
    ],
  },
  {
    id: "root-verb-01", type: "root", elementLemma: "verb", priority: "B",
    titleZh: "verb｜用字說話社", titleEn: "Verb Word Club",
    hook: "字根 verb＝字、詞——說話社專管用字、冗詞、逐字與諺語。",
    script:
      "verbal／verbose 口頭說與說太多。verbatim 逐字照念。proverb／proverbial 諺語與諺語級。verbalize 把想法說出口；verbiage 字海淹人——社長：verbatim 引原文；verbose 摘要會被退件。",
    reviewHooks: ["verb＝詞：verbal/verbose/verbatim/proverb/verbiage", "verbatim＝逐字"],
    pitfalls: ["verbose＝冗長", "verbiage＝冗詞／措辭"],
    members: [
      card("verbal", "口頭的；言語的", "用嘴巴", "Get verbal confirmation, then written consent.", "先口頭確認再書面同意。"),
      card("verbose", "冗長的", "說太多", "Cut verbose methods to the procedure.", "把冗長方法砍到程序。"),
      card("verbatim", "逐字的", "照念原文", "Quote exclusions verbatim from the registry.", "從登錄庫逐字引用排除。"),
      card("proverb", "諺語", "老話", "A proverb is not a causal law.", "諺語不是因果定律。"),
      card("proverbial", "諺語中的；眾所周知的", "諺語級", "The proverbial 'statistically significant' trap.", "眾所周知的『統計顯著』陷阱。"),
      card("verbalize", "用言語表達", "說出口", "Verbalize uncertainty in the abstract.", "在摘要把不確定說出口。"),
      card("verbiage", "冗詞；措辭", "字海", "Drop marketing verbiage from claims.", "主張刪掉行銷冗詞。"),
      card("adverb", "副詞", "修飾詞彩蛋", "An adverb like 'clearly' often hides doubt.", "『清楚地』這類副詞常藏懷疑。", "story"),
      card("proverbially", "如諺語所說", "老話說", "Proverbially hard problems still need n.", "如諺語難的問題仍需要樣本。", "story"),
      card("wordy", "囉唆的", "字多", "Wordy intros delay the question.", "囉唆導論拖延問題。", "story"),
      card("diction", "用字遣詞", "選詞", "Precise diction beats ornate fog.", "精確用字勝過華麗迷霧。", "story"),
      card("silence", "沉默", "不說話", "Silence about exclusions is a red flag.", "對排除沉默是紅旗。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Word for word:", promptZh: "逐字：", choices: ["verbatim", "verbose", "noxious", "simultaneous"], answer: "verbatim" },
      { id: "q2", type: "sense", promptEn: "Using too many words:", promptZh: "冗長：", choices: ["verbose", "innocent", "vital", "regal"], answer: "verbose" },
      { id: "q3", type: "sense", promptEn: "Excess wording; diction:", promptZh: "冗詞／措辭：", choices: ["verbiage", "facsimile", "pedestal", "vortex"], answer: "verbiage" },
    ],
  },
  {
    id: "root-vol-01", type: "root", elementLemma: "vol", priority: "B",
    titleZh: "vol｜意願飛行塔", titleEn: "Vol Will & Flight Tower",
    hook: "字根 vol＝願／飛——塔台左頻是意願，右頻是飛行（依詞分流）。",
    script:
      "voluntary／volunteer 自願登機。volition 意願操縱桿。benevolent／malevolent（他族）提醒好壞意願。volatile 脾氣／市況易飛走；volley 對打飛球；volume 音量飛高——塔台：voluntary consent；volatile claims 要繫安全帶。",
    reviewHooks: ["vol＝願：voluntary/volunteer/volition；vol＝飛／變：volatile/volley", "volition＝意志"],
    pitfalls: ["volatile＝易變／易揮發", "voluntary≠ volunteer 詞類不同"],
    members: [
      card("voluntary", "自願的", "自願登機", "Participation must be voluntary and informed.", "參與必須自願且知情。"),
      card("volunteer", "志工；自願做", "志願機組", "Volunteer coders still need credit.", "志願寫碼者仍需署名。"),
      card("volition", "意志；決意", "操縱桿", "Fraud is a choice of volition, not accident.", "造假是意志選擇不是意外。"),
      card("volatile", "易變的；易揮發的", "易飛走", "Volatile metrics need version pins.", "易變指標需要版本釘死。"),
      card("volley", "齊發；對打", "飛球對打", "A volley of critiques should stay on methods.", "齊發批評應停在方法上。"),
      card("volume", "音量；冊；體積", "音量飛高", "Turn down the volume of hype.", "把炒作音量調低。"),
      card("involuntary", "非自願的", "被推進機艙", "Involuntary data reuse needs fresh consent.", "非自願資料再利用需新同意。", "story"),
      card("volatility", "波動性", "飛走程度", "Report estimate volatility across specs.", "報告跨規格估計波動。", "story"),
      card("fly", "飛", "起飛", "Ideas that cannot fly without secrecy fail science.", "靠保密才能飛的想法不符科學。", "story"),
      card("willpower", "意志力", "願的力", "Willpower alone cannot replace checklists.", "單靠意志力不能取代檢核表。", "story"),
      card("willing", "願意的", "肯飛", "Be willing to publish nulls.", "願意發表虛無結果。", "story"),
      card("unwilling", "不願意的", "不肯飛", "Unwilling data sharing stalls replications.", "不願共享資料拖延複現。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Done by free will:", promptZh: "自願：", choices: ["voluntary", "noxious", "abstruse", "verbatim"], answer: "voluntary" },
      { id: "q2", type: "sense", promptEn: "Unstable; changeable:", promptZh: "易變：", choices: ["volatile", "innocuous", "similar", "regal"], answer: "volatile" },
      { id: "q3", type: "sense", promptEn: "Act of willing; willpower choice:", promptZh: "意志決意：", choices: ["volition", "facsimile", "pedestal", "horoscope"], answer: "volition" },
    ],
  },
  {
    id: "root-mens-01", type: "root", elementLemma: "mens/metri", priority: "B",
    titleZh: "mens｜度量衡檢驗所", titleEn: "Mens Measure Lab",
    hook: "字根 mens/metri＝量——檢驗所專管尺寸、公尺與『巨大』廣告。",
    script:
      "measure／measurement／measurable 先能量。metric／meter 公尺與指標。immense／immensity 大到尺不夠。commensurate 成比例對齊——所長：metric 要 operational；immense claim 要 immense evidence。",
    reviewHooks: ["mens＝量：measure/metric/immense/commensurate", "commensurate＝相稱的"],
    pitfalls: ["immense＝巨大的", "commensurate with＝與……相稱"],
    members: [
      card("measure", "測量；措施", "拿尺", "Measure what you claim.", "測量你所主張的。"),
      card("measurement", "測量", "量測過程", "Bad measurement sinks causal talk.", "糟糕測量讓因果空談沉沒。"),
      card("measurable", "可測量的", "量得到", "Prefer measurable endpoints.", "偏好可測量終點。"),
      card("metric", "度量；指標", "指標尺", "Declare the primary metric in advance.", "事先聲明主要指標。"),
      card("meter", "公尺；計量器", "公尺棒", "Calibrate the meter before comparing labs.", "比較實驗室前先校正計量器。"),
      card("immense", "巨大的", "尺不夠大", "Immense claims need immense checks.", "巨大主張需要巨大檢查。"),
      card("immensity", "巨大", "巨大感", "The immensity of the literature is not an excuse for thin methods.", "文獻巨大不是方法單薄的藉口。"),
      card("commensurate", "相稱的；成比例的", "對齊比例", "Rewards should be commensurate with contribution.", "報酬應與貢獻相稱。"),
      card("dimension", "維度", "量的方向", "State the dimension you generalize to.", "說明你概括到的維度。", "story"),
      card("scale", "尺度", "量尺", "Check scale invariance claims carefully.", "仔細檢查尺度不變宣稱。", "story"),
      card("gigantic", "巨大的", "巨大近親", "Gigantic dashboards can hide missingness.", "巨大儀表板可能藏缺失。", "story"),
      card("tiny", "微小的", "小到難量", "Tiny effects still deserve intervals.", "微小效應仍值得區間。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "In proportion; corresponding in size:", promptZh: "相稱：", choices: ["commensurate", "noxious", "verbose", "volatile"], answer: "commensurate" },
      { id: "q2", type: "sense", promptEn: "Huge; enormous:", promptZh: "巨大：", choices: ["immense", "innocuous", "verbatim", "similar"], answer: "immense" },
      { id: "q3", type: "sense", promptEn: "Standard of measurement; KPI-like:", promptZh: "度量指標：", choices: ["metric", "proverb", "intruder", "volley"], answer: "metric" },
    ],
  },
  {
    id: "root-mir-01", type: "root", elementLemma: "mir", priority: "C",
    titleZh: "mir｜奇蹟鏡屋", titleEn: "Mir Mirror House",
    hook: "字根 mir＝奇、看——鏡屋專管驚奇、鏡子與奇蹟廣告。",
    script:
      "miracle／miraculous 奇蹟燈箱（廣告勿信）。mirror 鏡子複現。admire／admiration 欣賞反光。mirage 沙漠假水——導遊：admire 好複現；mirage 的『顯著』請離開。",
    reviewHooks: ["mir＝奇／看：miracle/mirror/admire/mirage", "mirage＝海市蜃樓"],
    pitfalls: ["miracle 不應用於未複現發現", "mirage＝幻景"],
    members: [
      card("miracle", "奇蹟", "奇蹟燈箱", "A single study is not a miracle.", "單一研究不是奇蹟。"),
      card("miraculous", "奇蹟般的", "奇蹟廣告", "Miraculous effect sizes need skepticism.", "奇蹟般效應量需要懷疑。"),
      card("mirror", "鏡子；反映", "鏡子複現", "Independent labs should mirror the protocol.", "獨立實驗室應鏡像規程。"),
      card("admire", "欽佩；欣賞", "欣賞反光", "Admire careful null reporting.", "欣賞謹慎的虛無報告。"),
      card("admiration", "欽佩", "欣賞値", "Save admiration for transparent corrections.", "把欽佩留給透明勘誤。"),
      card("mirage", "海市蜃樓；幻景", "沙漠假水", "A mirage of certainty fades under audit.", "確定性的海市蜃樓在稽核下消散。"),
      card("mirror image", "鏡像", "左右相反像", "A mirror-image replication still needs local ethics.", "鏡像複現仍需在地倫理。", "story"),
      card("marvel", "驚嘆", "驚奇", "Marvel less; measure more.", "少驚嘆；多測量。", "story"),
      card("wonder", "驚奇；想知道", "想看清楚", "Wonder aloud about missing cells.", "大聲好奇缺失格子。", "story"),
      card("reflect", "反映；反省", "鏡子動作", "Reflect exclusions in the flowchart.", "在流程圖反映排除。", "story"),
      card("spectacle", "奇觀；眼鏡", "好看場面", "Do not turn corrections into spectacle.", "不要把勘誤變成奇觀秀。", "story"),
      card("illusion", "錯覺", "假像", "Significance stars can be an illusion of importance.", "顯著星號可能是重要錯覺。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Optical illusion; false appearance:", promptZh: "海市蜃樓／幻景：", choices: ["mirage", "metric", "thesis", "volunteer"], answer: "mirage" },
      { id: "q2", type: "sense", promptEn: "Regard with respect:", promptZh: "欽佩欣賞：", choices: ["admire", "intrude", "consume", "temporize"], answer: "admire" },
      { id: "q3", type: "sense", promptEn: "Reflecting surface; to copy faithfully:", promptZh: "鏡子／反映：", choices: ["mirror", "noxious", "abstruse", "verbose"], answer: "mirror" },
    ],
  },
  {
    id: "root-somn-01", type: "root", elementLemma: "somn", priority: "C",
    titleZh: "somn｜睡眠實驗室", titleEn: "Somn Sleep Lab",
    hook: "字根 somn＝睡——睡眠實驗室專管失眠、催眠與夢遊決策。",
    script:
      "insomnia 研究員徹夜改圖。somnolent 會議睡著。somnambulist 夢遊按了提交。hypnosis／somniferous 催眠與催睡藥味——護士：insomnia 改碼會出錯；別 somnambulist 式上線。",
    reviewHooks: ["somn＝睡：insomnia/somnolent/somnambulist/somniferous", "somnolent＝昏昏欲睡"],
    pitfalls: ["somnambulist＝夢遊者", "somniferous＝催睡的"],
    members: [
      card("insomnia", "失眠", "徹夜改圖", "Insomnia coding breeds silent bugs.", "失眠寫碼滋生沉默錯誤。"),
      card("somnolent", "昏昏欲睡的", "會議睡著", "Somnolent review misses swaps.", "昏昏欲睡的審查錯過替換。"),
      card("somnambulist", "夢遊者", "夢遊提交", "Do not be a somnambulist deployer.", "不要當夢遊部署者。"),
      card("somniferous", "催睡的", "催睡藥味", "Somniferous prose hides the estimand.", "催睡文風掩蓋目標量。"),
      card("hypnosis", "催眠", "被催眠", "Hype can feel like hypnosis—wake up to n.", "炒作像催眠——用樣本叫醒。"),
      card("asleep", "睡著的", "沒醒", "Do not ship while half asleep.", "半睡不要上線。", "story"),
      card("drowsy", "昏沉的", "想睡", "Drowsy ethics training helps no one.", "昏沉倫理訓練幫不了人。", "story"),
      card("nap", "小睡", "短睡", "A nap beats a reckless push.", "小睡勝過魯莽推送。", "story"),
      card("dream", "夢", "夢境主張", "Dream results need waking replications.", "夢境結果需要醒著的複現。", "story"),
      card("awake", "醒著的", "清醒", "Stay awake to interim peeking risks.", "對期中偷看風險保持清醒。", "story"),
      card("sleepwalk", "夢遊", "夢遊動詞", "Sleepwalk peer review is negligence.", "夢遊式同儕審查是疏忽。", "story"),
      card("lullaby", "搖籃曲", "催睡曲", "A methods lullaby of jargon puts readers under.", "行話搖籃曲催眠讀者。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Sleepy; drowsy:", promptZh: "昏昏欲睡：", choices: ["somnolent", "immense", "verbatim", "volatile"], answer: "somnolent" },
      { id: "q2", type: "sense", promptEn: "Inability to sleep:", promptZh: "失眠：", choices: ["insomnia", "mirage", "thesis", "facsimile"], answer: "insomnia" },
      { id: "q3", type: "sense", promptEn: "Sleepwalker:", promptZh: "夢遊者：", choices: ["somnambulist", "consumer", "intruder", "metric"], answer: "somnambulist" },
    ],
  },
  {
    id: "root-umbr-01", type: "root", elementLemma: "umbr", priority: "C",
    titleZh: "umbr｜陰影傘具店", titleEn: "Umbr Shade Shop",
    hook: "字根 umbr＝影——傘具店專管陰影、傘下與生氣翻臉。",
    script:
      "umbrella 大傘遮一切（別濫用）。umbra／penumbra 本影與半影。adumbrate 先投下輪廓陰影。umbrage 生氣翻臉覺得被踩影——店員：adumbrate 限制；別 take umbrage 於誠實批評。",
    reviewHooks: ["umbr＝影：umbrella/umbra/penumbra/adumbrate/umbrage", "take umbrage＝生氣見怪"],
    pitfalls: ["adumbrate＝預示／勾勒", "umbrage＝不快／生氣"],
    members: [
      card("umbrella", "傘；總括", "大傘", "An 'umbrella term' still needs definition.", "總括詞仍需定義。"),
      card("umbra", "本影", "全暗影", "Keep fraud in the umbra of zero tolerance.", "造假放在零容忍本影裡。"),
      card("penumbra", "半影", "灰影帶", "Ethics often lives in a penumbra of edge cases.", "倫理常活在邊緣半影。"),
      card("adumbrate", "預示；勾勒", "投下輪廓影", "Adumbrate the design in the abstract.", "在摘要勾勒設計。"),
      card("umbrage", "不快；生氣", "踩影翻臉", "Do not take umbrage at null results.", "不要對虛無結果見怪。"),
      card("shadow", "影子", "影近親", "Shadow the analysis with a second coder.", "用第二編碼者影子覆核分析。", "story"),
      card("shade", "陰影；色度", "遮光", "Shade uncertainty on the plot.", "在圖上為不確定遮光。", "story"),
      card("overshadow", "使黯然", "大影壓小", "Do not let branding overshadow methods.", "不要讓品牌壓過方法。", "story"),
      card("silhouette", "剪影", "輪廓影", "Give a silhouette of the causal graph early.", "及早給因果圖剪影。", "story"),
      card("cloud", "雲；陰影", "遮住", "Clouds of jargon hide weak n.", "行話雲遮住弱樣本。", "story"),
      card("eclipse", "蝕；蓋過", "影蓋過", "Do not eclipse limitations with celebrations.", "不要用慶祝蓋過限制。", "story"),
      card("cast a shadow", "投下陰影", "投下疑雲", "Leaked IDs cast a shadow on trust.", "外洩 ID 對信任投下陰影。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Offense; resentment (take ___ ):", promptZh: "不快見怪：", choices: ["umbrage", "metric", "thesis", "volley"], answer: "umbrage" },
      { id: "q2", type: "sense", promptEn: "Foreshadow; outline faintly:", promptZh: "預示勾勒：", choices: ["adumbrate", "intrude", "consume", "detest"], answer: "adumbrate" },
      { id: "q3", type: "sense", promptEn: "Partial shadow region:", promptZh: "半影：", choices: ["penumbra", "insomnia", "verbiage", "optimum"], answer: "penumbra" },
    ],
  },
  {
    id: "root-tom-01", type: "root", elementLemma: "tom", priority: "C",
    titleZh: "tom｜切割解剖室", titleEn: "Tom Cutting Room",
    hook: "字根 tom＝切——解剖室專管切開、原子與百科切片。",
    script:
      "atom／atomic 切到切不動。anatomy 結構解剖圖。tome 厚到像切下來的百科磚。epitome 典型切片代表；dichotomy 一刀兩半——主刀：dichotomy 前先定義；tome 別塞進摘要。",
    reviewHooks: ["tom＝切：atom/anatomy/tome/epitome/dichotomy", "dichotomy＝二分"],
    pitfalls: ["epitome＝典型／縮影", "tome＝巨冊"],
    members: [
      card("atom", "原子", "切到最小", "An atom of evidence is still evidence—report it.", "一原子證據仍是證據——請報告。"),
      card("atomic", "原子的；不可再分的", "切不動", "Atomic commits help audits.", "原子化提交幫助稽核。"),
      card("anatomy", "解剖；結構", "結構圖", "Show the anatomy of the pipeline.", "展示管線解剖結構。"),
      card("tome", "巨冊", "百科磚", "Do not hide the protocol in a unread tome.", "不要把規程藏在沒人讀的巨冊。"),
      card("epitome", "典型；縮影", "典型切片", "That lab is the epitome of open sharing.", "那實驗室是開放共享的典型。"),
      card("dichotomy", "二分法", "一刀兩半", "Avoid false dichotomies of 'significant or nothing'.", "避免『顯著或什麼都不是』的假二分。"),
      card("anatomy of error", "錯誤解剖", "剖錯", "Do an anatomy of error after retraction.", "撤稿後做錯誤解剖。", "story"),
      card("cut", "切", "下刀", "Cut exploratory claims from the abstract.", "從摘要切開探索性主張。", "story"),
      card("slice", "切片", "切一片", "Slice the sample only by prereg rules.", "僅依預註冊規則切片樣本。", "story"),
      card("section", "切開；章節", "切段", "Section the paper so limits are visible.", "切段論文讓限制可見。", "story"),
      card("dissect", "解剖分析", "細剖", "Dissect the identification assumptions.", "細剖識別假設。", "story"),
      card("binary", "二元的", "兩刀口", "Binary significance thinking is a trap.", "二元顯著思維是陷阱。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Division into two opposed parts:", promptZh: "二分：", choices: ["dichotomy", "mirage", "insomnia", "umbrage"], answer: "dichotomy" },
      { id: "q2", type: "sense", promptEn: "Perfect example; embodiment:", promptZh: "典型縮影：", choices: ["epitome", "noxious", "verbose", "volatile"], answer: "epitome" },
      { id: "q3", type: "sense", promptEn: "Large scholarly book:", promptZh: "巨冊：", choices: ["tome", "atom", "meter", "sum"], answer: "tome" },
    ],
  },
  {
    id: "root-prim-01", type: "root", elementLemma: "prim", priority: "C",
    titleZh: "prim｜第一優先櫃枱", titleEn: "Prim Priority Desk",
    hook: "字根 prim＝第一——櫃枱專管首要、原始、首相與『裝正經』。",
    script:
      "primary／primarily 第一優先章。prime 質數／最佳檔；primitive 原始工具。premier／primeval 首席與遠古。prim 裝正經——櫃員：primary outcome 先鎖；prim manners 幫不了 p 值。",
    reviewHooks: ["prim＝第一：primary/prime/primitive/premier/primeval", "primary outcome＝主要結局"],
    pitfalls: ["prim＝拘謹裝正經（另一義）", "primeval＝原始遠古"],
    members: [
      card("primary", "主要的；初級的", "第一優先", "Lock the primary outcome before peeking.", "偷看前鎖定主要結局。"),
      card("primarily", "主要地", "首要地", "This paper is primarily about measurement.", "本文首要關於測量。"),
      card("prime", "主要的；質數；最佳", "最佳檔", "Prime the team with a checklist.", "用檢核表先啟動團隊。"),
      card("primitive", "原始的；簡陋的", "原始工具", "Primitive tools beat opaque black boxes.", "簡陋工具勝過不透明黑箱。"),
      card("premier", "首位的；首相", "首席", "Premier journals still retract.", "一流期刊仍撤稿。"),
      card("primeval", "遠古的；原始的", "遠古層", "Primeval habits of hoarding data must end.", "囤資料的遠古習慣必須結束。"),
      card("prim", "拘謹的；裝正經的", "裝正經", "Prim tone cannot replace open code.", "裝正經語氣不能取代開放程式碼。", "story"),
      card("primer", "入門書；底漆", "入門層", "Write a primer for new coders.", "為新編碼者寫入門。", "story"),
      card("primordial", "原始的；根本的", "根本第一", "Ask the primordial question: what is the estimand?", "問根本問題：目標量是什麼？", "story"),
      card("first", "第一", "第一名", "First, preregister.", "第一，預註冊。", "story"),
      card("foremost", "最重要的", "最前", "Foremost: do not fabricate.", "最重要：不要捏造。", "story"),
      card("priority", "優先順序", "排隊序", "Make correction a priority over celebration.", "勘誤優先於慶祝。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Most important; principal:", promptZh: "主要的：", choices: ["primary", "somnolent", "abstruse", "noxious"], answer: "primary" },
      { id: "q2", type: "sense", promptEn: "Ancient; from earliest ages:", promptZh: "遠古原始：", choices: ["primeval", "verbatim", "facsimile", "volatile"], answer: "primeval" },
      { id: "q3", type: "sense", promptEn: "Stiffly formal; prudish:", promptZh: "拘謹裝正經：", choices: ["prim", "immense", "thesis", "intrude"], answer: "prim" },
    ],
  },
  {
    id: "prefix-syn-01", type: "prefix", elementLemma: "syn-/sym-", priority: "A",
    titleZh: "syn-/sym-｜同步合奏廳", titleEn: "Syn Harmony Hall",
    hook: "字首 syn-/sym-＝一起／相同——合奏廳專管同步、綜述與共生。",
    script:
      "symphony（他族）合奏。synthesis／synthesize 綜合成曲。synchronous／synchronize 同步拍子。sympathy／symbiosis／symposium／symmetry／syndicate／synoptic／synergy——指揮：synergy 要可測；syndicate 別變成黑箱聯盟。",
    reviewHooks: ["syn-＝一起：synthesis/synchronous/symbiosis/symposium/symmetry/synergy", "symbiosis＝共生"],
    pitfalls: ["synoptic＝概覽的", "syndicate＝企業聯合／集團"],
    members: [
      card("symbiosis", "共生", "互相養活", "Methods and ethics should be in symbiosis.", "方法與倫理應共生。"),
      card("symposium", "研討會；專題", "一起討論會", "Host a symposium on failed replications.", "舉辦失敗複現研討會。"),
      card("symmetry", "對稱", "左右對稱", "Do not invent symmetry the data lack.", "資料沒有的對稱別硬造。"),
      card("syndicate", "企業聯合；辛迪加", "聯盟櫃", "A syndicate of labs still needs open logs.", "實驗室聯盟仍需開放日誌。"),
      card("synoptic", "概覽的", "總譜一頁", "Give a synoptic figure of the design.", "給設計的概覽圖。"),
      card("synergy", "綜效；協同", "1+1>2", "Claim synergy only with interaction tests.", "有交互檢定才稱綜效。"),
      card("synagogue", "猶太會堂", "詞源彩蛋", "Etymology note: syn- also appears in synagogue.", "詞源：syn- 也出現在 synagogue。", "story"),
      card("syncopation", "切分音", "節奏錯位", "Avoid syncopation between prereg and paper.", "避免預註冊與論文節奏錯位。", "story"),
      card("syntax", "句法", "合在一起的規則", "Messy syntax in code breeds bugs.", "混亂句法滋生錯誤。", "story"),
      card("synapse", "突觸", "一起接上", "Build synapses between teams with shared docs.", "用共享文件建立團隊突觸。", "story"),
      card("synonymy", "同義關係", "一起同義", "Near synonymy still shifts tone.", "近同義仍改語氣。", "story"),
      card("synchronousness", "同步狀態", "同拍狀態", "Check synchronousness of clocks before recording.", "錄音前檢查時鐘同步狀態。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Living together mutually:", promptZh: "共生：", choices: ["symbiosis", "insomnia", "umbrage", "tome"], answer: "symbiosis" },
      { id: "q2", type: "sense", promptEn: "Combined greater effect:", promptZh: "綜效：", choices: ["synergy", "verbiage", "intruder", "nap"], answer: "synergy" },
      { id: "q3", type: "sense", promptEn: "Conference of specialists:", promptZh: "研討會：", choices: ["symposium", "mirage", "noxious", "prim"], answer: "symposium" },
    ],
  },
  {
    id: "prefix-hyper-01", type: "prefix", elementLemma: "hyper-", priority: "B",
    titleZh: "hyper-｜過度加速器", titleEn: "Hyper Overdrive",
    hook: "字首 hyper-＝過度——加速器專管過頭、超連結與誇大。",
    script:
      "hyperbole 誇大噴射。hyperactive 過動儀表板。hypersensitive 過敏警報。hyperlink 超連結跳轉；hypertension 高血壓梗——技師：hyperbole 寫作零分；hypotheses 別 hyper。",
    reviewHooks: ["hyper-＝過度：hyperbole/hyperactive/hypersensitive/hyperlink", "hyperbole＝誇張法"],
    pitfalls: ["hyperbole≠ hypothesis", "hypersensitive＝過於敏感"],
    members: [
      card("hyperbole", "誇張法", "誇大噴射", "Drop hyperbole from abstracts.", "摘要刪掉誇張。"),
      card("hyperactive", "過動的；過度活躍的", "過動儀表", "A hyperactive dashboard hides missingness.", "過動儀表板隱藏缺失。"),
      card("hypersensitive", "過敏的；過於敏感的", "過敏警報", "Be careful, not hypersensitive, to critique.", "對批評要小心，不要過敏。"),
      card("hyperlink", "超連結", "跳轉門", "Hyperlink the registry in the paper.", "在論文超連結登錄庫。"),
      card("hypertension", "高血壓", "壓力過高梗", "Lab hypertension rises with opaque deadlines.", "不透明期限讓實驗室『高血壓』。", "story"),
      card("hyperfocus", "過度聚焦", "焦點過猛", "Hyperfocus on p ignores intervals.", "過度聚焦 p 忽略區間。", "story"),
      card("overclaim", "過度宣稱", "過頭主張", "Overclaiming invites retractions.", "過度宣稱招來撤稿。", "story"),
      card("exaggerate", "誇大", "誇大動詞", "Do not exaggerate generalizability.", "不要誇大可概括性。", "story"),
      card("overdrive", "超速檔", "加速過猛", "Put methods in overdrive only after lock.", "鎖定後才把方法開超速。", "story"),
      card("too much", "太多", "過度口語", "Too much flexibility invites fishing.", "彈性太多誘發淘篩。", "story"),
      card("hyperbole check", "誇張檢查", "誇大煞車", "Run a hyperbole check on the title.", "對標題做誇張檢查。", "story"),
      card("extreme", "極端的", "極端", "Extreme outliers need pre-rules.", "極端離群需要預先規則。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Deliberate exaggeration:", promptZh: "誇張法：", choices: ["hyperbole", "penumbra", "insomnia", "metric"], answer: "hyperbole" },
      { id: "q2", type: "sense", promptEn: "Excessively sensitive:", promptZh: "過於敏感：", choices: ["hypersensitive", "innocuous", "primary", "tome"], answer: "hypersensitive" },
      { id: "q3", type: "sense", promptEn: "Overly active:", promptZh: "過度活躍：", choices: ["hyperactive", "somnolent", "verbatim", "regal"], answer: "hyperactive" },
    ],
  },
  {
    id: "prefix-hypo-01", type: "prefix", elementLemma: "hypo-", priority: "B",
    titleZh: "hypo-｜不足低壓艙", titleEn: "Hypo Low-Pressure Bay",
    hook: "字首 hypo-＝不足／在下——低壓艙專管假說、低估與皮下。",
    script:
      "hypothesis（thesis 族）在低壓艙待命。hypocrisy 說一套做一套漏氣。hypothetical 假如情境。hypodermic 皮下注射梗；hypothermia 低溫——艙長：hypothesis 要可驗；hypocrisy 對開放科學最傷。",
    reviewHooks: ["hypo-＝在下／不足：hypothesis/hypocrisy/hypothetical/hypodermic", "hypocrisy＝偽善"],
    pitfalls: ["hypocrisy＝偽善", "hypothetical＝假設的"],
    members: [
      card("hypothesis", "假說", "待命假說", "Spell out the hypothesis before analysis.", "分析前寫清假說。"),
      card("hypocrisy", "偽善", "漏氣雙標", "Open-science hypocrisy is sharing slogans only.", "開放科學偽善是只分享口號。"),
      card("hypothetical", "假設的", "假如情境", "Label hypothetical scenarios clearly.", "清楚標示假設情境。"),
      card("hypodermic", "皮下的；注射器", "皮下針", "Think of audits as hypodermic checks—precise.", "把稽核當皮下檢查：精準。"),
      card("hypothermia", "低體溫", "低溫艙", "Hypothermia of funding freezes replications.", "資金低溫凍結複現。", "story"),
      card("underpowered", "檢定力不足", "壓力不足", "Underpowered designs are hypo-evidence machines.", "檢定力不足是低證據機器。", "story"),
      card("understate", "低估陳述", "說太少", "Do not understate uncertainty.", "不要低估陳述不確定性。", "story"),
      card("beneath", "在下", "在下層", "Look beneath the mean for subgroups.", "往均值下層看次群。", "story"),
      card("low", "低", "低檔", "Low transparency predicts trouble.", "低透明預測麻煩。", "story"),
      card("deficit", "不足", "缺額", "A deficit of logs blocks audit.", "日誌不足阻擋稽核。", "story"),
      card("hypo claim", "不足宣稱", "說不夠", "A hypo claim still needs intervals.", "不足宣稱仍需要區間。", "story"),
      card("basement", "地下室", "在下空間", "Keep raw files in a secured basement, not Slack.", "原始檔放安全地下室，不是 Slack。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Pretending virtue one lacks:", promptZh: "偽善：", choices: ["hypocrisy", "hyperbole", "penumbra", "tome"], answer: "hypocrisy" },
      { id: "q2", type: "sense", promptEn: "Based on a supposed situation:", promptZh: "假設的：", choices: ["hypothetical", "noxious", "prim", "volatile"], answer: "hypothetical" },
      { id: "q3", type: "sense", promptEn: "Proposed explanation to test:", promptZh: "假說：", choices: ["hypothesis", "umbrella", "mirage", "nap"], answer: "hypothesis" },
    ],
  },
  {
    id: "prefix-sub-01", type: "prefix", elementLemma: "sub-", priority: "B",
    titleZh: "sub-｜地下工程隊", titleEn: "Sub Underground Crew",
    hook: "字首 sub-＝在下——工程隊專管底下、替補、征服與訂閱。",
    script:
      "submerge（他族）往下沉。submit／submission 呈交到上層。subordinate（他族）在下屬。subtle 底下細微差異。substitute 替補零件；subscribe／subscription 訂閱維修——隊長：subtle bias 要抓；submit 前先自查。",
    reviewHooks: ["sub-＝在下：submit/subtle/substitute/subscribe/subdue", "subtle＝微妙的"],
    pitfalls: ["subtle≠ shuttle", "subdue＝征服／壓制"],
    members: [
      card("submit", "提交；屈服", "呈交上層", "Submit the prereg before collection.", "收集前先提交預註冊。"),
      card("submission", "提交；屈服", "呈交件", "Track every submission version.", "追蹤每次提交版本。"),
      card("subtle", "微妙的；精細的", "底下細微", "Subtle selection bias compounds.", "微妙選擇偏差會累加。"),
      card("substitute", "替代；代替品", "替補零件", "Do not silently substitute outcomes.", "不要沉默替代結局。"),
      card("subscribe", "訂閱；同意", "訂閱維修", "Subscribe to correction alerts.", "訂閱勘誤警報。"),
      card("subscription", "訂閱", "訂閱制", "Subscription paywalls block replication.", "訂閱付費牆阻擋複現。"),
      card("subdue", "征服；壓制", "壓下去", "Subdue hype with preregistration.", "用預註冊壓制炒作。"),
      card("subtotal", "小計", "底下加總", "Show subtotals of exclusions by reason.", "依理由顯示排除小計。", "story"),
      card("subway", "地鐵", "地下通道", "Think of appendices as a subway—map them.", "把附錄當地鐵：要有地圖。", "story"),
      card("underground", "地下的", "地下作業", "No underground outcome switching.", "禁止地下更換結局。", "story"),
      card("beneath notice", "不值一提", "在目光下", "Nulls are not beneath notice.", "虛無不值一提是錯的。", "story"),
      card("underling", "下屬", "底下的人", "Protect underlings who report errors.", "保護回報錯誤的下屬。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Delicate; not obvious:", promptZh: "微妙精細：", choices: ["subtle", "immense", "noxious", "prim"], answer: "subtle" },
      { id: "q2", type: "sense", promptEn: "Replace with another:", promptZh: "替代：", choices: ["substitute", "admire", "detest", "orient"], answer: "substitute" },
      { id: "q3", type: "sense", promptEn: "Hand in; yield:", promptZh: "提交／屈服：", choices: ["submit", "volley", "mirage", "tome"], answer: "submit" },
    ],
  },
  {
    id: "rhyme-sist-01", type: "rhyme", elementLemma: "-sist", priority: "B",
    titleZh: "sist｜站立抵抗館", titleEn: "Sist Stand Hall",
    hook: "字根／押韻 sist＝站——抵抗館專管堅持、協助、存在與堅持到底。",
    script:
      "insist 站著不讓步。persist／persistence 一直站。assist／assistance 扶你站穩。consist／consistent 站成一貫。exist／existence 站在世界上；resist／resistance 站著反抗——館長：insist on prereg；persist through nulls。",
    reviewHooks: ["sist＝站：insist/persist/assist/consist/exist/resist", "consistent＝一致的"],
    pitfalls: ["insist on＝堅持要求", "consist of／in 用法不同"],
    members: [
      card("insist", "堅持；堅決要求", "站著不讓", "Insist on open materials.", "堅持要求開放材料。", "phonetic"),
      card("persist", "持續；堅持", "一直站", "Persist with corrections after pushback.", "遇阻力仍持續勘誤。", "phonetic"),
      card("persistence", "持續；毅力", "站功", "Persistence without methods is stubbornness.", "沒有方法的持續是固執。", "phonetic"),
      card("assist", "協助", "扶一把", "Assist juniors without rewriting their errors away.", "協助資淺者，但不要改掉他們的錯誤紀錄。", "phonetic"),
      card("assistance", "協助", "扶助", "Statistical assistance should be credited.", "統計協助應署名。", "phonetic"),
      card("consist", "由……組成；在於", "站成整體", "Good papers consist of claims plus checks.", "好論文由主張加檢查組成。", "phonetic"),
      card("consistent", "一致的", "站成一貫", "Keep coding rules consistent.", "保持編碼規則一致。", "phonetic"),
      card("exist", "存在", "站在世界上", "Null effects exist; publish them.", "虛無效應存在；請發表。", "phonetic"),
      card("existence", "存在", "存在狀態", "Question the existence of the effect, not the critic.", "質疑效應存在，不是批評者。", "phonetic"),
      card("resist", "抵抗", "站著反抗", "Resist fashion metrics.", "抵抗流行指標。", "phonetic"),
      card("resistance", "抵抗；阻力", "反抗力", "Resistance to sharing needs policy.", "對共享的阻力需要政策。", "phonetic"),
      card("subsist", "維持生存；靠……過活", "站著活命", "Labs cannot subsist on slogans alone.", "實驗室不能只靠口號過活。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Demand firmly:", promptZh: "堅決要求：", choices: ["insist", "admire", "consume", "mirage"], answer: "insist" },
      { id: "q2", type: "sense", promptEn: "Continue steadfastly:", promptZh: "持續堅持：", choices: ["persist", "intrude", "obtrude", "nap"], answer: "persist" },
      { id: "q3", type: "sense", promptEn: "In agreement; not contradictory:", promptZh: "一致：", choices: ["consistent", "noxious", "prim", "somnolent"], answer: "consistent" },
    ],
  },
  {
    id: "rhyme-vise-01", type: "rhyme", elementLemma: "-vise/-vice", priority: "B",
    titleZh: "vise／vice｜遠見與惡習館", titleEn: "Vise Vision & Vice Hall",
    hook: "vise＝看；vice＝惡／副——一館兩門：遠見顧問 vs 惡習警告。",
    script:
      "advise／advice／advisor 給遠見建議。revise／revision 再看一遍改稿。supervise／supervisor 監看。vice／vicious／vice versa：惡習、惡性、反之亦然——館長：revise  openly；vicious incentives 要拆。",
    reviewHooks: ["vise＝看：advise/revise/supervise；vice＝惡：vice/vicious", "advice 名詞／advise 動詞"],
    pitfalls: ["advice≠ advise 詞性", "vice versa＝反之亦然"],
    members: [
      card("advise", "勸告；建議", "給遠見", "Advise preregistration early.", "及早建議預註冊。", "phonetic"),
      card("advice", "建議", "建議書", "Take advice from auditors seriously.", "認真採納稽核建議。", "phonetic"),
      card("advisor", "顧問", "遠見人", "Name a methods advisor on the team.", "團隊具名方法顧問。", "phonetic"),
      card("revise", "修訂", "再看改", "Revise after critique without drama.", "批評後修訂不作秀。", "phonetic"),
      card("revision", "修訂版", "再看版本", "Log every revision of the protocol.", "記錄規程每次修訂。", "phonetic"),
      card("supervise", "監督", "監看", "Supervise randomization independently.", "獨立監督隨機化。", "phonetic"),
      card("supervisor", "主管；督導", "監看的人", "A supervisor should model corrections.", "督導應示範勘誤。", "phonetic"),
      card("vice", "惡習；副職", "惡習門", "P-hacking is a methodological vice.", "p 操弄是方法惡習。", "phonetic"),
      card("vicious", "惡性的；惡意的", "惡性循環", "Vicious cycles of secrecy block science.", "保密惡性循環阻擋科學。", "phonetic"),
      card("vice versa", "反之亦然", "左右對調", "If A implies B, check vice versa carefully.", "若 A 蘊含 B，小心檢查反之亦然。", "story"),
      card("envision", "設想", "看見未來", "Envision failure modes before launch.", "上線前設想失敗模式。", "story"),
      card("visible", "可見的", "看得到", "Make uncertainty visible.", "讓不確定可見。", "story"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Verb vs noun for counsel:", promptZh: "建議動詞 vs 名詞：", choices: ["advise / advice", "advice / advise", "revise / revision", "vice / vicious"], answer: "advise / advice" },
      { id: "q2", type: "sense", promptEn: "Look over; manage:", promptZh: "監督：", choices: ["supervise", "intrude", "devour", "nap"], answer: "supervise" },
      { id: "q3", type: "sense", promptEn: "Immoral habit; deputy:", promptZh: "惡習／副：", choices: ["vice", "tome", "metric", "penumbra"], answer: "vice" },
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
  `${JSON.stringify({ version: "v0.9-p2b03", total: lessonIndex.length, lessons: lessonIndex }, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(humorDir, "index.json"),
  `${JSON.stringify(
    {
      version: "v0.9-p2b03",
      status: "p2-batch03",
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
  path.join(humorDir, "P2-BATCH03-REPORT.md"),
  `# P2-batch03 完成報告（幽默完整）

| 指標 | 數值 |
|------|------|
| 本批寫入 | ${written.length} |
| 總家族 | ${allClusters.length} |
| 獨特詞 | ${unique.size} |
| 距 P2(2500) | ${report.gapTo2500} |
| 距 4000 | ${report.gapTo4000} |

## 本批家族
${written.map((w) => `- \`${w.id}\`（${w.n} 詞）`).join("\n")}

${blocked.length ? `## 未寫入\n${blocked.map((b) => `- ${b.id}: ${b.issues.join(", ")}`).join("\n")}` : ""}
`,
);
console.log(JSON.stringify(report, null, 2));
