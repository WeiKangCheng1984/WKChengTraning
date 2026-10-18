/**
 * P2-batch02: ~20 B-level clusters, humor-first.
 * node web/scripts/gre-humor-p2-batch02.js
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
const STAGE = "P2-batch02";

const NEW = [
  {
    id: "root-opt-01", type: "root", elementLemma: "opt", priority: "B",
    titleZh: "opt｜選擇驗光室", titleEn: "Opt Choice Clinic",
    hook: "字根 opt＝選／視——驗光室同時配眼鏡與人生選項。",
    script: "option／optional 選配鏡片。adopt 認養一副觀點。optimism／optimum 樂觀到以為已是最佳。optic／synopsis／autopsy：看、總覽、剖開細看——醫師喊：先 synopsis 再選 option，別盲目 optimism。",
    reviewHooks: ["opt＝選／視：option/adopt/optimism/optimum/synopsis/autopsy", "optimum＝最適"],
    pitfalls: ["adopt＝採納／收養", "autopsy＝驗屍／事後剖析"],
    members: [
      card("option", "選項", "鏡片菜單", "Keep a preregistered option for sensitivity checks.", "預註冊保留敏感度檢查選項。"),
      card("optional", "可選的", "選配", "Open code should not be optional for claims.", "對主張而言開放程式碼不該可選。"),
      card("adopt", "採納；收養", "認養觀點", "Adopt shared standards across sites.", "跨站點採納共享標準。"),
      card("optimism", "樂觀", "驗光太樂觀", "Optimism about n=30 needs a power check.", "對 n=30 的樂觀需要檢定力檢查。"),
      card("optimum", "最適點", "最佳焦距", "There is no single optimum for every field.", "沒有適用所有領域的單一最適。"),
      card("optic", "視覺的；光學的", "看的線路", "Fix the optic of the figure before debating taste.", "辯論品味前先修好圖的視覺。"),
      card("synopsis", "摘要；梗概", "總覽鏡", "Write a honest synopsis, not a trailer.", "寫誠實梗概，不是預告片。"),
      card("autopsy", "驗屍；事後剖析", "剖開細看", "Run a blameless autopsy on the failed launch.", "對失敗上線做無責事後剖析。"),
      card("optimize", "最適化", "調到最佳", "Optimize clarity before optimizing citation count.", "先優化清晰再優化引用數。", "story"),
      card("optometrist", "驗光師", "調鏡的人", "Be the optometrist of your assumptions.", "做自己假設的驗光師。", "story"),
      card("adoption", "採納；收養", "認養儀式", "Track adoption of open tools quarterly.", "每季追蹤開放工具採納。", "story"),
      card("optimal", "最佳的", "對焦完成", "An optimal slogan is still not evidence.", "最佳口號仍不是證據。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Best or most favorable point:", promptZh: "最適：", choices: ["optimum", "option", "optic", "mischief"], answer: "optimum" },
      { id: "q2", type: "sense", promptEn: "Summary overview:", promptZh: "摘要梗概：", choices: ["synopsis", "autopsy", "regicide", "impugn"], answer: "synopsis" },
      { id: "q3", type: "sense", promptEn: "Take up; embrace as one's own:", promptZh: "採納：", choices: ["adopt", "submerge", "ridicule", "mutate"], answer: "adopt" },
    ],
  },
  {
    id: "root-ord-01", type: "root", elementLemma: "ord", priority: "B",
    titleZh: "ord｜秩序櫃枱", titleEn: "Ord Order Desk",
    hook: "字根 ord＝秩序——櫃枱專管排隊、命令、普通與協調。",
    script: "order 叫號排隊。ordinary 普通號；coordinate 協調多櫃。subordinate 下屬櫃員；insubordinate 不聽話翻櫃。ordinance 條例告示；ordain 正式任命——經理：先 order 再 ordinal 排名，別 insubordinate 亂改結局。",
    reviewHooks: ["ord＝秩序：order/ordinary/coordinate/subordinate/ordinance", "insubordinate＝不服從"],
    pitfalls: ["ordain＝任命／規定", "ordinance＝法令條例"],
    members: [
      card("order", "秩序；命令；訂單", "叫號", "State the analysis order before peeking.", "偷看前先聲明分析順序。"),
      card("ordinary", "普通的", "普通號", "Ordinary diligence beats flashy shortcuts.", "普通勤奮勝過炫目捷徑。"),
      card("coordinate", "協調；座標", "對齊多櫃", "Coordinate coding across raters.", "跨評分者協調編碼。"),
      card("subordinate", "下屬的；使從屬", "下屬櫃員", "Do not subordinate ethics to speed.", "不要讓倫理從屬於速度。"),
      card("insubordinate", "不服從的", "翻櫃員工", "Insubordinate silent forks wreck audits.", "不服從的沉默分叉毀掉稽核。"),
      card("ordinance", "條例；法令", "告示牌", "Follow the campus data ordinance.", "遵守校園資料條例。"),
      card("ordain", "任命；規定", "正式蓋章", "Do not ordain a metric without validation.", "未驗證不要正式規定指標。"),
      card("ordinal", "序數的；順序的", "排名貼紙", "Ordinal ranks lose interval information.", "序數排名失去區間資訊。", "story"),
      card("disorder", "混亂；失調", "櫃枱翻車", "Code disorder hides silent bugs.", "程式混亂隱藏沉默錯誤。", "story"),
      card("coordinator", "協調者", "對齊的人", "Appoint a data coordinator early.", "及早任命資料協調者。", "story"),
      card("extraordinary", "非凡的", "超普通", "Extraordinary claims need extraordinary evidence.", "非凡主張需要非凡證據。", "story"),
      card("orderly", "有秩序的", "排好隊", "Keep an orderly changelog.", "保持有秩序的變更紀錄。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Disobedient to authority:", promptZh: "不服從：", choices: ["insubordinate", "ordinary", "synopsis", "euphony"], answer: "insubordinate" },
      { id: "q2", type: "sense", promptEn: "Law or regulation:", promptZh: "條例：", choices: ["ordinance", "optimism", "impugn", "memento"], answer: "ordinance" },
      { id: "q3", type: "sense", promptEn: "Make secondary; lower in rank:", promptZh: "使從屬：", choices: ["subordinate", "adopt", "laud", "morph"], answer: "subordinate" },
    ],
  },
  {
    id: "root-ori-01", type: "root", elementLemma: "ori", priority: "B",
    titleZh: "ori｜日出導航台", titleEn: "Ori Sunrise Hub",
    hook: "字根 ori＝升起、起源——導航台對準太陽升起的地方。",
    script: "origin／originate 從哪升起。original 初升版本；orient／orientation 調整方向。aboriginal 最初住民意象；oriental（舊稱，謹慎）——領航員：找 origin 比找 oriental 標籤重要；orientation 週先講清楚。",
    reviewHooks: ["ori＝起：origin/originate/original/orient/orientation", "orient＝導向"],
    pitfalls: ["oriental 現代英語常過時／冒犯，教學標註即可", "orientation＝導向／新生訓練"],
    members: [
      card("origin", "起源", "升起點", "Trace the origin of each exclusion rule.", "追溯每條排除規則的起源。"),
      card("originate", "起源；發起", "從哪升起", "Where did the claim originate?", "主張起源何處？"),
      card("original", "最初的；原創的", "初升版", "Cite the original protocol, not a rumor.", "引用原始規程，不是謠言。"),
      card("orient", "導向；使熟悉", "對準太陽", "Orient new members to logging norms.", "讓新人對準日誌規範。"),
      card("orientation", "導向；新生訓練", "導航週", "Ethics orientation is mandatory.", "倫理導向訓練為必修。"),
      card("aboriginal", "原生的；原住民的", "最初在地", "Respect aboriginal knowledge systems in fieldwork.", "田野尊重原住民知識系統。"),
      card("disorient", "使迷失方向", "轉暈羅盤", "Missing metadata can disorient reanalyzers.", "缺中繼資料會讓再分析者迷失。", "story"),
      card("reorient", "重新導向", "重對太陽", "Reorient incentives toward sharing.", "把誘因重新導向共享。", "story"),
      card("originally", "原先", "一開始", "Originally preregistered outcomes must stay primary.", "原先預註冊結局須維持主要。", "story"),
      card("sunrise", "日出", "升起畫面", "Treat day-one logs as the project's sunrise.", "把第一天日誌當專案日出。", "story"),
      card("source", "來源", "升起的河", "Name every data source.", "具名每個資料來源。", "story"),
      card("nascent", "萌芽的", "剛升起", "Nascent tools need cautious adoption.", "萌芽工具需謹慎採納。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Align; familiarize with surroundings:", promptZh: "導向／使熟悉：", choices: ["orient", "impugn", "submerge", "ridicule"], answer: "orient" },
      { id: "q2", type: "sense", promptEn: "Beginning; source:", promptZh: "起源：", choices: ["origin", "ordinance", "cacophony", "petulant"], answer: "origin" },
      { id: "q3", type: "sense", promptEn: "First; not copied:", promptZh: "最初／原創：", choices: ["original", "insubordinate", "repugnant", "memento"], answer: "original" },
    ],
  },
  {
    id: "root-ped-01", type: "root", elementLemma: "ped/pod", priority: "B",
    titleZh: "ped｜腳步實驗室", titleEn: "Ped Foot Lab",
    hook: "字根 ped/pod＝腳——實驗室專管腳步、障礙與兒童科雙關（ped- 也＝兒童）。",
    script: "pedestrian 用腳走的平凡路。expedite 讓腳步加速放行；impede／impediment 絆腳石。pedestal 踮腳站的座；centipede／tripod 多腳怪與三腳架——教官：expedite 審核可以，impede 共享不行；pedestrian 寫作有時是美德。",
    reviewHooks: ["ped＝腳：pedestrian/expedite/impede/impediment/pedestal", "impede＝妨礙"],
    pitfalls: ["pedestrian 可＝行人／平淡無奇", "expedite＝加速辦理"],
    members: [
      card("pedestrian", "行人；平淡的", "用腳走的平凡", "Pedestrian clarity beats ornate fog.", "平淡清晰勝過華麗迷霧。"),
      card("expedite", "加速；催辦", "腳步加速放行", "Expedite corrections, not hype.", "加速勘誤，不是炒作。"),
      card("impede", "妨礙；阻礙", "絆腳", "Paywalls impede cumulative science.", "付費牆妨礙累積科學。"),
      card("impediment", "障礙；口吃（語障）", "絆腳石", "Missing consent is an impediment to publish.", "缺同意是發表障礙。"),
      card("pedestal", "基座；高台", "踮腳座", "Do not put celebrities on a methods pedestal.", "不要把名人放上方法基座。"),
      card("centipede", "蜈蚣", "多腳怪彩蛋", "A centipede of covariates needs justification.", "共變項蜈蚣需要理由。", "story"),
      card("tripod", "三腳架", "三隻腳", "A tripod of prereg, code, and data stabilizes claims.", "預註冊／程式碼／資料三腳架穩定主張。", "story"),
      card("pedal", "踏板", "踩腳", "Pedal back from overclaim quietly—then loudly correct.", "從過度宣稱踩煞車——然後大聲勘誤。", "story"),
      card("expedition", "遠征", "長途腳程", "Treat fieldwork like an expedition with logs.", "田野像遠征，要有日誌。", "story"),
      card("biped", "兩足動物", "兩隻腳", "Even bipeds trip without checklists.", "沒有檢核表兩足也會絆倒。", "story"),
      card("podium", "頒獎台", "站腳處", "The podium belongs to evidence, not vibes.", "頒獎台屬於證據不是感覺。", "story"),
      card("footprint", "足跡", "腳印", "Minimize the privacy footprint of raw files.", "最小化原始檔隱私足跡。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Speed up a process:", promptZh: "加速催辦：", choices: ["expedite", "impede", "orient", "laud"], answer: "expedite" },
      { id: "q2", type: "sense", promptEn: "Hinder; obstruct:", promptZh: "妨礙：", choices: ["impede", "adopt", "optimum", "euphony"], answer: "impede" },
      { id: "q3", type: "sense", promptEn: "Dull; commonplace (or walker):", promptZh: "平淡／行人：", choices: ["pedestrian", "regal", "pugnacious", "mutable"], answer: "pedestrian" },
    ],
  },
  {
    id: "root-put-01", type: "root", elementLemma: "put", priority: "B",
    titleZh: "put｜計算心事櫃", titleEn: "Put Computing Locker",
    hook: "字根 put＝想、算——櫃門寫著：爭議、聲譽、計算、委派。",
    script: "compute 先算。dispute 吵著算不清；reputation 聲譽櫃台。impute 把責任算到某人頭上；putative 據稱的候選人。deputy 代理計算員；computer 機器算盤——櫃員：impute 缺失要有模型，別亂 dispute 到沒日誌。",
    reviewHooks: ["put＝算：compute/dispute/reputation/impute/putative/deputy", "impute＝歸因／填補"],
    pitfalls: ["impute＝歸咎或統計填補", "putative＝推定的／據稱的"],
    members: [
      card("compute", "計算", "先算", "Compute intervals, not stars alone.", "計算區間，不只星號。"),
      card("dispute", "爭議；爭論", "吵著算不清", "Document the dispute trail.", "記錄爭議軌跡。"),
      card("reputation", "聲譽", "聲譽櫃台", "Reputation should not exempt audits.", "聲譽不該豁免稽核。"),
      card("impute", "歸咎；填補", "算到頭上／填上", "Impute missingness cautiously and report it.", "謹慎填補缺失並報告。"),
      card("putative", "推定的；據稱的", "據稱候選人", "A putative mechanism needs a test.", "據稱機制需要檢驗。"),
      card("deputy", "副手；代理", "代理計算員", "Name a deputy data steward.", "具名代理資料管家。"),
      card("computer", "電腦", "機器算盤", "A faster computer cannot fix bad design.", "更快電腦修不好壞設計。", "story"),
      card("computation", "計算過程", "算的流水", "Show computation steps for key figures.", "關鍵圖顯示計算步驟。", "story"),
      card("disreputable", "聲名狼藉的", "櫃台黑名單", "Disreputable vendors fail security review.", "聲名狼藉廠商過不了資安審查。", "story"),
      card("repute", "名氣", "傳聞聲譽", "Repute is not a p-value.", "名氣不是 p 值。", "story"),
      card("count", "計數", "算數", "Count exclusions before celebrating n.", "慶祝樣本前先計數排除。", "story"),
      card("accountable", "可究責的", "算得清责任", "Keep teams accountable for silent edits.", "讓團隊對沉默修改可究責。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Attribute; fill in statistically:", promptZh: "歸咎／填補：", choices: ["impute", "impede", "orient", "laud"], answer: "impute" },
      { id: "q2", type: "sense", promptEn: "Generally supposed; alleged:", promptZh: "推定／據稱：", choices: ["putative", "pedestrian", "optimum", "cacophony"], answer: "putative" },
      { id: "q3", type: "sense", promptEn: "Public standing; esteem:", promptZh: "聲譽：", choices: ["reputation", "tripod", "morph", "ridicule"], answer: "reputation" },
    ],
  },
  {
    id: "root-rog-01", type: "root", elementLemma: "rog", priority: "B",
    titleZh: "rog｜質問櫃臺", titleEn: "Rog Question Desk",
    hook: "字根 rog＝問——櫃臺專管提問、特權問、驕橫問。",
    script: "interrogate 問到水落石出。arrogant／arrogance 還沒問就自以為知道。prerogative 特權提問權；derogatory 貶低式問話。abrogate 廢止條款；arrogate 擅自據為己有——警衛：interrogation 對方法，arrogance 對人零分。",
    reviewHooks: ["rog＝問：interrogate/arrogant/prerogative/derogatory/abrogate/arrogate", "arrogate＝僭取"],
    pitfalls: ["abrogate＝廢止", "prerogative＝特權"],
    members: [
      card("interrogate", "審問；質詢", "問到水落石出", "Interrogate the identification assumptions.", "質詢識別假設。"),
      card("arrogant", "傲慢的", "還沒問就懂", "Arrogant certainty blocks correction.", "傲慢確定阻擋勘誤。"),
      card("arrogance", "傲慢", "傲慢值", "Arrogance about nulls wastes cohorts.", "對虛無的傲慢浪費世代。"),
      card("prerogative", "特權", "特權提問權", "Gatekeeping is not an editor's prerogative forever.", "把關不是編輯永久特權。"),
      card("derogatory", "貶損的", "貶低式問話", "Avoid derogatory labels for honest errors.", "對誠實錯誤避免貶損標籤。"),
      card("abrogate", "廢止；取消", "廢條款", "Abrogate incentives that punish sharing.", "廢止懲罰共享的誘因。"),
      card("arrogate", "僭取；擅據", "擅自據為己有", "Do not arrogate credit for others' code.", "不要僭取他人程式碼功勞。"),
      card("interrogation", "審問", "質詢過程", "Friendly interrogation of figures helps.", "友善質詢圖表有幫助。", "story"),
      card("surrogate", "代理人；替代", "代問的人", "Use a surrogate endpoint only with justification.", "僅在有理由時用替代終點。", "story"),
      card("question", "問題", "櫃臺基本款", "Question every silent default.", "質問每個沉默預設。", "story"),
      card("pry", "打探", "硬問", "Do not pry into identifiable free text casually.", "不要隨便打探可識別自由文本。", "story"),
      card("ask", "問", "開口", "Ask for raw data politely and persistently.", "禮貌且持續地索取原始資料。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Claim without right; seize:", promptZh: "僭取：", choices: ["arrogate", "adopt", "expedite", "immerse"], answer: "arrogate" },
      { id: "q2", type: "sense", promptEn: "Exclusive right/privilege:", promptZh: "特權：", choices: ["prerogative", "synopsis", "memento", "cacophony"], answer: "prerogative" },
      { id: "q3", type: "sense", promptEn: "Repeal; abolish formally:", promptZh: "廢止：", choices: ["abrogate", "impede", "orient", "laud"], answer: "abrogate" },
    ],
  },
  {
    id: "root-scop-01", type: "root", elementLemma: "scop", priority: "B",
    titleZh: "scop｜窺視望遠鏡館", titleEn: "Scop Observatory",
    hook: "字根 scop＝看——望遠鏡館專管範圍、窺視與各種 -scope。",
    script: "scope 視野範圍。telescope 看遠；microscope 看小；periscope 抬頭偷看。horoscope 星象娛樂（別當證據）。episcope／scope creep：範圍蔓延——館長：先定 scope，再防 scope creep；horoscope 請離開方法段。",
    reviewHooks: ["scop＝看：scope/telescope/microscope/periscope", "scope creep＝範圍蔓延"],
    pitfalls: ["scope＝範圍／機會", "horoscope 非科學證據"],
    members: [
      card("scope", "範圍；機會", "視野框", "Define the scope of claims narrowly.", "把主張範圍定窄一點。"),
      card("telescope", "望遠鏡", "看遠", "Do not telescope years of work into one lucky p.", "不要把多年工作壓縮成一次幸運 p。"),
      card("microscope", "顯微鏡", "看小", "Put the codebook under a microscope.", "把碼本放顯微鏡下。"),
      card("periscope", "潛望鏡", "抬頭偷看", "A periscope peek at interim results biases stopping.", "潛望鏡偷看期中結果扭曲停損。"),
      card("horoscope", "星座運勢", "娛樂窺視", "A horoscope is not a causal identification.", "星座運勢不是因果識別。"),
      card("scope creep", "範圍蔓延", "框一直變大", "Fight scope creep with written aims.", "用書面目標對抗範圍蔓延。", "story"),
      card("kaleidoscope", "萬花筒", "碎鏡看", "A kaleidoscope of metrics confuses policy.", "指標萬花筒迷惑政策。", "story"),
      card("endoscope", "內視鏡", "往裡看", "Endoscope the pipeline for silent forks.", "用內視鏡檢查管線沉默分叉。", "story"),
      card("scopophilia", "窺視癖（教學標註）", "愛偷看", "Scopophilia jokes aside: respect participant privacy.", "窺視玩笑之外：尊重參與者隱私。", "story"),
      card("overscope", "看得太寬", "框太大", "Overscope claims invite reviewer fire.", "主張過寬招來審稿砲火。", "story"),
      card("narrow", "變窄", "縮框", "Narrow the estimand before modeling.", "建模前先縮窄目標量。", "story"),
      card("outlook", "展望", "往外看", "Give a sober outlook in discussion.", "討論給清醒展望。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Range; extent of a project:", promptZh: "範圍：", choices: ["scope", "impede", "impute", "regal"], answer: "scope" },
      { id: "q2", type: "sense", promptEn: "Uncontrolled expansion of aims:", promptZh: "範圍蔓延：", choices: ["scope creep", "horoscope", "tripod", "conceit"], answer: "scope creep" },
      { id: "q3", type: "sense", promptEn: "Instrument for seeing far:", promptZh: "望遠鏡：", choices: ["telescope", "ordinance", "libertine", "derision"], answer: "telescope" },
    ],
  },
  {
    id: "root-serv-01", type: "root", elementLemma: "serv", priority: "B",
    titleZh: "serv｜侍守服務站", titleEn: "Serv Service Station",
    hook: "字根 serv＝侍、守——服務站專管保存、觀察、應得與順服。",
    script: "conserve／preserve 把油存好。observe／observation／observant 觀察加油燈。deserve 應得幾格油；subservient 過度順服客人。service／servant／reservation：服務、侍者、預約保留——站長：observe 資料，preserve 原始檔，別 subservient 到不敢報錯。",
    reviewHooks: ["serv＝守：conserve/preserve/observe/deserve/subservient", "subservient＝屈從的"],
    pitfalls: ["conserve≈preserve 略有分工：保育／保存", "deserve＝應得"],
    members: [
      card("conserve", "保存；保育", "把油存好", "Conserve statistical power with better design.", "用更好設計保存檢定力。"),
      card("preserve", "保存；維持", "封存原味", "Preserve raw files immutable.", "原始檔不可變地保存。"),
      card("observe", "觀察；遵守", "看加油燈", "Observe the preregistered plan.", "遵守預註冊計畫。"),
      card("observation", "觀察；評論", "觀察紀錄", "An observation is not a causal claim.", "觀察不是因果主張。"),
      card("observant", "善于觀察的；守規的", "眼尖員工", "Observant reviewers catch silent swaps.", "眼尖審稿人抓到沉默替換。"),
      card("deserve", "應得", "該加幾格", "Null results deserve space.", "虛無結果應得版面。"),
      card("subservient", "屈從的；輔助的", "過度順服", "Do not be subservient to fashion metrics.", "不要屈從流行指標。"),
      card("reservation", "保留；預約", "留位／保留意見", "State reservations about external validity.", "陳述對外部效度的保留。", "story"),
      card("service", "服務", "加油服務", "Treat data service as scholarship.", "把資料服務當學術。", "story"),
      card("conserve evidence", "保存證據", "封存證據", "Conserve evidence trails for audits.", "為稽核保存證據軌跡。", "story"),
      card("deserve better", "應得更好", "加油鼓勵", "Participants deserve better consent UX.", "參與者應得更好的同意體驗。", "story"),
      card("server", "伺服器", "站的機器", "Lock down the server before sharing IDs.", "共享 ID 前鎖好伺服器。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Keep safe from harm/decay:", promptZh: "保存：", choices: ["preserve", "impede", "arrogate", "ridicule"], answer: "preserve" },
      { id: "q2", type: "sense", promptEn: "Excessively obedient; servile:", promptZh: "屈從：", choices: ["subservient", "optimum", "pugnacious", "nascent"], answer: "subservient" },
      { id: "q3", type: "sense", promptEn: "Be worthy of:", promptZh: "應得：", choices: ["deserve", "telescope", "impute", "abrogate"], answer: "deserve" },
    ],
  },
  {
    id: "root-sign-01", type: "root", elementLemma: "sign", priority: "B",
    titleZh: "sign｜記號信號站", titleEn: "Sign Signal Station",
    hook: "字根 sign＝記號——信號站專管簽名、指派、設計與意義。",
    script: "sign 簽名放行。signal／significance 信號與顯著小旗。assign／designate 指派崗位。design 畫出藍圖；resign 簽名離職。insignificant 小到沒旗；consign 託運記號——站長：significance ≠ importance；先 design 再 sign。",
    reviewHooks: ["sign＝記號：sign/signal/significance/assign/designate/design/resign", "significant≠important 必然"],
    pitfalls: ["consign＝託付／寄售", "designate＝指定"],
    members: [
      card("sign", "簽名；標誌", "簽名放行", "Sign the conflict disclosure.", "簽署利益衝突揭露。"),
      card("signal", "信號", "信號燈", "Separate signal from noise with prereg.", "用預註冊分離信號與噪音。"),
      card("significance", "顯著性；意義", "小旗／意義", "Statistical significance is not practical importance.", "統計顯著不是實務重要。"),
      card("assign", "指派", "派崗位", "Assign blinding roles before randomization.", "隨機化前指派盲法角色。"),
      card("designate", "指定；命名", "指定記號", "Designate primary outcomes in writing.", "書面指定主要結局。"),
      card("design", "設計", "藍圖", "Design for missingness, not only for means.", "為缺失設計，不只為均值。"),
      card("resign", "辭職；屈從", "簽名離職", "Resign from vanity metrics.", "辭去虛榮指標。"),
      card("insignificant", "不顯著的；無足輕重的", "沒旗", "An insignificant p is still information.", "不顯著 p 仍是資訊。"),
      card("consign", "託運；交付", "託運記號", "Do not consign ethics to an afterthought.", "不要把倫理託付給事後想法。", "story"),
      card("signature", "簽名；特徵", "獨特記號", "Fraud often leaves a signature pattern.", "造假常留下特徵模式。", "story"),
      card("signpost", "路標", "指示牌", "Signpost limitations early.", "及早設置限制路標。", "story"),
      card("cosign", "連署", "一起簽", "Cosign only what you verified.", "只連署你驗證過的。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Appoint; name officially:", promptZh: "指定：", choices: ["designate", "impede", "immerse", "laud"], answer: "designate" },
      { id: "q2", type: "sense", promptEn: "Give up a position; accept as inevitable:", promptZh: "辭職／屈從：", choices: ["resign", "orient", "expedite", "morph"], answer: "resign" },
      { id: "q3", type: "sense", promptEn: "Message; cue amid noise:", promptZh: "信號：", choices: ["signal", "horoscope", "centipede", "conceit"], answer: "signal" },
    ],
  },
  {
    id: "root-soph-01", type: "root", elementLemma: "soph", priority: "B",
    titleZh: "soph｜智巧辯論社", titleEn: "Soph Debate Club",
    hook: "字根 soph＝智——辯論社專管真智慧與狡辯智慧。",
    script: "philosophy 愛智社長（他族也有）。sophisticated 老練精巧；sophomore 半吊子二年級。sophistry／sophist 把智慧用成狡辯。unsophisticated 樸拙——導師：sophisticated 方法可以，sophistry 零分。",
    reviewHooks: ["soph＝智：sophisticated/sophistry/sophist/sophomore", "sophistry＝詭辯"],
    pitfalls: ["sophisticated＝老練／複雜精巧", "sophistry＝似是而非的詭辯"],
    members: [
      card("sophisticated", "老練精巧的", "精巧辯手", "A sophisticated model still needs plain limits.", "精巧模型仍需白話限制。"),
      card("sophistry", "詭辯", "狡辯智慧", "Sophistry about p-hacking fools no auditor.", "關於 p 操弄的詭辯騙不了稽核。"),
      card("sophist", "詭辯家", "職業狡辯", "Don't hire a sophist to write the cover letter.", "別請詭辯家寫投稿信。"),
      card("sophomore", "二年級生；半吊子", "半熟辯手", "Sophomore overconfidence skips power analysis.", "半吊子過度自信跳過檢定力。"),
      card("unsophisticated", "不世故的；簡單的", "樸拙", "Unsophisticated honesty beats clever fog.", "樸拙誠實勝過聰明迷霧。"),
      card("sophistication", "精巧度；世故", "精巧値", "Methodological sophistication without ethics is brittle.", "無倫理的方法精巧很脆。", "story"),
      card("philosophy club", "哲學社", "愛智鄰居", "Keep a philosophy club for estimands.", "為目標量開哲學社。", "story"),
      card("wise", "有智慧的", "真智", "Wise teams pre-register.", "有智慧的團隊預註冊。", "story"),
      card("clever", "聰明的", "小聰明", "Clever tricks are not identification.", "小聰明不是識別。", "story"),
      card("fallacy", "謬誤", "辯論犯規", "Name the fallacy in the causal leap.", "點名因果跳躍的謬誤。", "story"),
      card("rhetoric", "修辭", "辯論包裝", "Rhetoric cannot replace robustness.", "修辭不能取代穩健。", "story"),
      card("naive", "天真的", "未練辯", "A naive average hides harm.", "天真平均掩蓋傷害。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Plausible but false reasoning:", promptZh: "詭辯：", choices: ["sophistry", "synopsis", "pedestal", "impute"], answer: "sophistry" },
      { id: "q2", type: "sense", promptEn: "Complex and refined; worldly-wise:", promptZh: "老練精巧：", choices: ["sophisticated", "ordinary", "repugnant", "nascent"], answer: "sophisticated" },
      { id: "q3", type: "sense", promptEn: "Person using clever fallacious arguments:", promptZh: "詭辯家：", choices: ["sophist", "regent", "tripod", "memento"], answer: "sophist" },
    ],
  },
  {
    id: "root-tempor-01", type: "root", elementLemma: "tempor", priority: "B",
    titleZh: "tempor｜時間調度室", titleEn: "Tempor Time Desk",
    hook: "字根 tempor＝時——調度室專管暫時、當代、拖延與合時。",
    script: "temporary 臨時通行證。contemporary 同時代同事。extemporaneous 即興發言（沒預寫）。temporize 拖時間和稀泥；tense／temporal：時間的——主任：temporary fix 要標日期；別 temporize 到錯過註冊窗。",
    reviewHooks: ["tempor＝時：temporary/contemporary/extemporaneous/temporize/temporal", "temporize＝拖延觀望"],
    pitfalls: ["extemporaneous＝即興的", "contemporary＝當代的／同時代的"],
    members: [
      card("temporary", "暫時的", "臨時通行證", "Label temporary exclusions clearly.", "清楚標示暫時排除。"),
      card("contemporary", "當代的；同時代的", "同時代同事", "Cite contemporary standards for open data.", "引用當代開放資料標準。"),
      card("extemporaneous", "即興的", "沒預寫發言", "Extemporaneous analysis is fine if labeled exploratory.", "即興分析可以，但要標探索性。"),
      card("temporize", "拖延觀望；妥協拖延", "拖時間和稀泥", "Do not temporize on correcting the record.", "勘誤紀錄不要拖延觀望。"),
      card("temporal", "時間的；世俗的", "時間軸", "Clarify temporal order for causality.", "釐清時間順序以談因果。"),
      card("tempo", "速度；節奏", "拍子", "Slow the tempo of claims to match evidence.", "把主張節奏降到匹配證據。", "story"),
      card("overtime", "加班；超時", "超時賽", "Overtime coding without sleep breeds errors.", "沒睡的加班編碼滋生錯誤。", "story"),
      card("timeline", "時間線", "調度表", "Publish a timeline of protocol changes.", "公開規程變更時間線。", "story"),
      card("meantime", "其間", "暫時空窗", "In the meantime, share interim documentation.", "其間分享期中文件。", "story"),
      card("timely", "及時的", "合時", "Timely corrections beat perfect silence.", "及時勘誤勝過完美沉默。", "story"),
      card("untimely", "不合時的", "不對時", "Untimely peeking ruins blinding.", "不合時偷看毀掉盲法。", "story"),
      card("temporarily", "暫時地", "臨時地", "Temporarily embargo data only with reason.", "僅在有理由時暫時禁運資料。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Delay to gain time; stall:", promptZh: "拖延觀望：", choices: ["temporize", "expedite", "laud", "morph"], answer: "temporize" },
      { id: "q2", type: "sense", promptEn: "Done without preparation; impromptu:", promptZh: "即興：", choices: ["extemporaneous", "ordinary", "regal", "putative"], answer: "extemporaneous" },
      { id: "q3", type: "sense", promptEn: "Belonging to the same time; modern:", promptZh: "當代／同時代：", choices: ["contemporary", "pedestrian", "impugn", "horoscope"], answer: "contemporary" },
    ],
  },
  {
    id: "root-term-01", type: "root", elementLemma: "term", priority: "B",
    titleZh: "term｜邊界終點站", titleEn: "Term Boundary Station",
    hook: "字根 term＝界、終——終點站專管術語、期限、終結與無盡。",
    script: "term 術語／期限。terminate／terminal／termination 到站終結。interminable 彷彿永不到站。determine 劃定邊界；exterminate 極端滅除——站長：先 define terms，再 terminate 收案；interminable 會議請結束。",
    reviewHooks: ["term＝界終：term/terminate/terminal/interminable/determine", "interminable＝無盡的"],
    pitfalls: ["terminate＝終止", "exterminate＝消滅（語氣重）"],
    members: [
      card("term", "術語；期限；學期", "站名牌", "Define every key term operationally.", "每個關鍵術語都操作型定義。"),
      card("terminate", "終止", "到站結束", "Terminate enrollment at planned N.", "在計畫樣本數終止收案。"),
      card("terminal", "終端的；末期的", "終點月台", "Terminal figures need readable axes.", "終端圖需要可讀軸。"),
      card("termination", "終止；結束", "結束廣播", "Document termination criteria.", "記錄終止標準。"),
      card("interminable", "無盡的；冗長的", "永不到站", "Interminable methods hide the procedure.", "無盡方法段掩蓋程序。"),
      card("determine", "決定；測定", "劃定邊界", "Determine the estimand before the model.", "建模前測定目標量。"),
      card("exterminate", "消滅", "極端清除", "Do not exterminate outliers without rules.", "沒有規則不要消滅極端值。"),
      card("terminology", "術語體系", "站名系統", "Align terminology across papers.", "跨論文對齊術語。", "story"),
      card("terminus", "終點", "最後一站", "State the terminus of follow-up.", "說明追蹤終點。", "story"),
      card("predetermine", "预先决定", "先劃界", "Do not predetermine results in the intro.", "不要在導論預先決定結果。", "story"),
      card("indeterminate", "不確定的", "界線模糊", "Indeterminate missingness needs sensitivity analysis.", "不確定缺失需要敏感度分析。", "story"),
      card("deadline", "截止日期", "站的鐘", "Treat the registry deadline as sacred.", "把登錄截止當神聖。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Seeming endless:", promptZh: "無盡冗長：", choices: ["interminable", "temporary", "optimum", "signal"], answer: "interminable" },
      { id: "q2", type: "sense", promptEn: "Bring to an end:", promptZh: "終止：", choices: ["terminate", "orient", "laud", "morph"], answer: "terminate" },
      { id: "q3", type: "sense", promptEn: "Decide; ascertain:", promptZh: "決定／測定：", choices: ["determine", "impede", "ridicule", "arrogate"], answer: "determine" },
    ],
  },
  {
    id: "root-terr-01", type: "root", elementLemma: "terr", priority: "B",
    titleZh: "terr｜大地驚魂館", titleEn: "Terr Earth & Terror Hall",
    hook: "字根 terr＝地／怕——驚魂館一邊是土地，一邊是恐懼（依詞分流）。",
    script: "terrain／territory／terrestrial 土地地圖。terrace 梯田看台。terror／terrible／terrify／terrorize 恐懼線。deter 嚇阻別靠近——導遊：territory 談地盤；terror 談害怕；別把 terrible writing 說成 terrain。",
    reviewHooks: ["terr＝地：terrain/territory/terrestrial；terr＝怕：terror/terrify/deter", "deter＝嚇阻"],
    pitfalls: ["同一拼寫族兩義：地 vs 怕", "deter＝制止／嚇阻"],
    members: [
      card("terrain", "地形；地帶", "土地地圖", "Know the ethical terrain before scraping.", "爬取前先摸清倫理地形。"),
      card("territory", "領土；領域", "地盤", "Respect disciplinary territory without silos.", "尊重學科地盤但不築倉。"),
      card("terrestrial", "地球的；陸上的", "陸生", "Terrestrial labs still need cloud backups.", "陸上實驗室仍需雲端備份。"),
      card("terrace", "梯田；露台", "階梯看台", "Build results as terraces of evidence, not cliffs of hype.", "把結果建成證據梯田，不是炒作懸崖。"),
      card("terror", "恐怖", "恐懼線", "Terror of retraction should not block corrections.", "對撤稿的恐懼不該阻擋勘誤。"),
      card("terrible", "糟糕的；可怕的", "糟到怕", "Terrible documentation is a safety issue.", "糟糕文件是安全問題。"),
      card("terrify", "使恐懼", "嚇一跳", "Do not terrify juniors for honest mistakes.", "不要因誠實錯誤恐嚇資淺者。"),
      card("deter", "嚇阻；制止", "別靠近牌", "Sanctions can deter fabrication.", "制裁能嚇阻捏造。"),
      card("terrorize", "恐嚇統治", "用怕統治", "Do not terrorize teams into fake positives.", "不要恐嚇團隊做出假陽性。", "story"),
      card("extraterrestrial", "外星的", "地外彩蛋", "Extraordinary (even extraterrestrial) claims need evidence.", "非凡（甚至外星）主張需要證據。", "story"),
      card("mediterranean", "地中海的", "地中詞源彩蛋", "Etymology toy: Mediterranean as mid-land sea.", "詞源玩具：地中海。", "story"),
      card("territorial", "地盤意識的", "護地盤", "Territorial data hoarding slows science.", "地盤式囤資料拖慢科學。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Discourage through fear of consequences:", promptZh: "嚇阻：", choices: ["deter", "adopt", "laud", "immerse"], answer: "deter" },
      { id: "q2", type: "sense", promptEn: "Area of land; domain:", promptZh: "領土／領域：", choices: ["territory", "sophistry", "impute", "cacophony"], answer: "territory" },
      { id: "q3", type: "sense", promptEn: "Landscape features; ground:", promptZh: "地形：", choices: ["terrain", "conceit", "petulant", "memento"], answer: "terrain" },
    ],
  },
  {
    id: "root-test-01", type: "root", elementLemma: "test", priority: "B",
    titleZh: "test｜見證檢察署", titleEn: "Test Witness Office",
    hook: "字根 test＝見證——檢察署專管作證、證詞、抗議與檢驗。",
    script: "testify／testimony／testimonial 作證三件套。attest 連署見證。contest／protest 抗議比賽。detest 厭惡到拒絕作證——檢察官：attest 你的程式碼；protest 不公誘因；別 detest 陰性結果。",
    reviewHooks: ["test＝見證：testify/testimony/attest/contest/protest/detest", "attest＝證明"],
    pitfalls: ["testimonial 可＝推薦證明", "detest＝憎恨"],
    members: [
      card("testify", "作證", "出庭說", "Let the data testify, not the press release.", "讓資料作證，不是新聞稿。"),
      card("testimony", "證詞", "證詞本", "Code is testimony; keep it readable.", "程式碼是證詞；保持可讀。"),
      card("testimonial", "推薦證明；見證文", "推薦卡", "A celebrity testimonial is not validation.", "名人見證文不是驗證。"),
      card("attest", "證明；表明", "連署見證", "Attest that exclusions were pre-specified.", "證明排除已預先指定。"),
      card("contest", "爭辯；競賽", "抗議比賽", "Contest shaky causal leaps.", "爭辯不穩的因果跳躍。"),
      card("protest", "抗議", "舉牌", "Protest paywalls that block replication.", "抗議阻擋複現的付費牆。"),
      card("detest", "憎恨；厭惡", "厭惡拒證", "Detest fraud, not honest nulls.", "厭惡造假，不是誠實虛無。"),
      card("testable", "可檢驗的", "能作證的主張", "Only testable claims belong in hypotheses.", "只有可檢驗主張屬於假說。", "story"),
      card("contestant", "參賽者", "比賽的人", "Every contestant metric needs a rulebook.", "每個參賽指標需要規則書。", "story"),
      card("attestation", "證明書", "見證文件", "Keep attestation of consent versions.", "保留同意版本證明。", "story"),
      card("protestation", "斷言；抗議", "大聲聲明", "Protestations of purity need audits.", "純潔斷言需要稽核。", "story"),
      card("witness", "證人", "在場的人", "Be a witness to protocol changes.", "做規程變更的證人。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Declare true; certify:", promptZh: "證明表明：", choices: ["attest", "impede", "temporize", "morph"], answer: "attest" },
      { id: "q2", type: "sense", promptEn: "Hate intensely:", promptZh: "憎恨：", choices: ["detest", "orient", "laud", "conserve"], answer: "detest" },
      { id: "q3", type: "sense", promptEn: "Evidence given by a witness:", promptZh: "證詞：", choices: ["testimony", "terrain", "optimum", "sophistry"], answer: "testimony" },
    ],
  },
  {
    id: "root-trib-01", type: "root", elementLemma: "trib", priority: "B",
    titleZh: "trib｜分配貢品處", titleEn: "Trib Tribute Desk",
    hook: "字根 trib＝分、給——貢品處專管貢獻、分配、部落與苦難。",
    script: "contribute／contribution／contributor 交貢品。distribute／distribution／tributary 分配支流。tribute 致敬貢品；tribe 部落櫃。tribulation 苦難關卡——處長：contribute 資料；distribute 功勞；tribulation 別靠造假渡。",
    reviewHooks: ["trib＝分給：contribute/distribute/tribute/tributary/tribe/tribulation", "tributary＝支流／進貢的"],
    pitfalls: ["tribute＝致敬／貢品", "tribulation＝苦難"],
    members: [
      card("contribute", "貢獻", "交貢品", "Contribute negative results too.", "也貢獻陰性結果。"),
      card("contribution", "貢獻", "貢品單", "State each author's contribution.", "說明每位作者貢獻。"),
      card("contributor", "貢獻者", "交貢的人", "List tool contributors in acknowledgments.", "誌謝列出工具貢獻者。"),
      card("distribute", "分配；分發", "分貢", "Distribute credit fairly.", "公平分配功勞。"),
      card("distribution", "分配；分布", "分布圖", "Show the outcome distribution, not only means.", "顯示結局分布，不只均值。"),
      card("tribute", "致敬；貢品", "致敬貢", "Pay tribute to prior null replications.", "向先前虛無複現致敬。"),
      card("tributary", "支流；進貢的", "支流櫃", "A tributary analysis still needs disclosure.", "支流分析仍需揭露。"),
      card("tribe", "部落", "部落櫃", "Method tribes should still share code.", "方法部落仍應共享程式碼。", "story"),
      card("tribulation", "苦難；考驗", "苦難關", "Peer review tribulation is not an excuse for opacity.", "同儕審查苦難不是不透明的藉口。", "story"),
      card("redistribute", "再分配", "重分貢", "Redistribute compute time to replication.", "把計算時間再分配給複現。", "story"),
      card("attribution", "歸因；署名", "算給誰", "Fix attribution before press.", "發新聞前修正署名。", "story"),
      card("share", "分享", "分出去", "Share protocols as living docs.", "把規程當活文件分享。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Give as due; honor with praise:", promptZh: "致敬／貢品：", choices: ["tribute", "deter", "impute", "sophistry"], answer: "tribute" },
      { id: "q2", type: "sense", promptEn: "Great suffering; trial:", promptZh: "苦難：", choices: ["tribulation", "synopsis", "pedestal", "euphony"], answer: "tribulation" },
      { id: "q3", type: "sense", promptEn: "Divide and give out:", promptZh: "分配：", choices: ["distribute", "arrogate", "terrify", "morph"], answer: "distribute" },
    ],
  },
  {
    id: "root-turb-01", type: "root", elementLemma: "turb", priority: "B",
    titleZh: "turb｜擾流控制室", titleEn: "Turb Turbulence Booth",
    hook: "字根 turb＝擾——控制室專管擾動、混亂與干擾。",
    script: "disturb／disturbance 擾動警報。turbulent 氣流亂；perturb 輕輕推亂。turbid 水混看不清；imperturbable 穩到擾不動——工程師：perturb 參數可以，disturb 原始日誌不行；寫作別 turbid。",
    reviewHooks: ["turb＝擾：disturb/turbulent/perturb/turbid/imperturbable", "turbid＝混濁"],
    pitfalls: ["perturb＝擾亂／微擾", "imperturbable＝沉著不可擾"],
    members: [
      card("disturb", "打擾；擾亂", "擾動警報", "Do not disturb locked datasets.", "不要擾亂已鎖定資料集。"),
      card("disturbance", "擾亂；騷動", "警報內容", "A protocol disturbance needs a version bump.", "規程擾亂需要升版。"),
      card("turbulent", "動盪的；湍流的", "氣流亂", "Turbulent incentives reward flashy claims.", "動盪誘因獎勵炫目主張。"),
      card("perturb", "擾亂；微擾", "輕輕推亂", "Perturb assumptions in sensitivity checks.", "在敏感度檢查中微擾假設。"),
      card("turbid", "混濁的", "水混看不清", "Turbid prose hides weak identification.", "混濁文風掩蓋弱識別。"),
      card("imperturbable", "沉著的；不可擾的", "穩到擾不動", "Stay imperturbable when critique arrives.", "批評到來時保持沉著。"),
      card("turbulence", "動盪；湍流", "亂流值", "Lab turbulence rises after opaque decisions.", "不透明決策後實驗室動盪上升。", "story"),
      card("perturbation", "微擾", "推一把", "Report each perturbation of the plan.", "報告計畫的每次微擾。", "story"),
      card("disturbing", "令人不安的", "警報感", "Disturbing effect sizes need robustness.", "令人不安的效應量需要穩健。", "story"),
      card("stir", "攪動", "攪一下", "Stir debate without stirring personal attacks.", "攪動辯論但不攪動人身攻擊。", "story"),
      card("agitate", "煽動；攪拌", "大力擾", "Agitate for open norms, not for drama.", "為開放規範煽動，不為戲劇。", "story"),
      card("calm", "平靜", "反擾流", "Keep a calm changelog voice.", "變更紀錄保持平靜語氣。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Cloudy; unclear:", promptZh: "混濁：", choices: ["turbid", "regal", "optimum", "attest"], answer: "turbid" },
      { id: "q2", type: "sense", promptEn: "Not easily upset; calm:", promptZh: "沉著不可擾：", choices: ["imperturbable", "turbulent", "terrible", "putative"], answer: "imperturbable" },
      { id: "q3", type: "sense", promptEn: "Disturb slightly; unsettle:", promptZh: "微擾：", choices: ["perturb", "orient", "laud", "expedite"], answer: "perturb" },
    ],
  },
  {
    id: "root-viv-01", type: "root", elementLemma: "viv/vit", priority: "B",
    titleZh: "viv｜活力維生站", titleEn: "Viv Vital Station",
    hook: "字根 viv/vit＝活——維生站專管活力、生還、生動與維生素梗。",
    script: "vivid 畫面活跳。survive／survival／survivor 活過關卡。revive 急救回魂；vital／vitality 要命的重要與活力。vivacious 活潑店員——站長：vital 限制要寫；vivid 例子幫忙；survive 複現戰。",
    reviewHooks: ["viv＝活：vivid/survive/revive/vital/vitality/vivacious", "vital＝極其重要／生命的"],
    pitfalls: ["vivid＝生動鮮明", "revive＝使復活／重振"],
    members: [
      card("vivid", "生動的；鮮明的", "畫面活跳", "Use vivid examples without overselling.", "用生動例子但不過度銷售。"),
      card("survive", "存活；倖存", "活過關", "Only transparent projects survive audits.", "只有透明專案撐過稽核。"),
      card("survival", "生存；存活率", "存活度量", "Report survival of findings under reanalysis.", "報告發現在再分析下的存活。"),
      card("survivor", "倖存者", "過關的人", "Treat retracted papers as teaching survivors.", "把撤稿當教學倖存者。"),
      card("revive", "復活；重振", "急救回魂", "Revive abandoned protocols with care.", "謹慎重振被棄規程。"),
      card("vital", "極其重要的；生命的", "要命重要", "Vital assumptions belong up front.", "要命假設放最前面。"),
      card("vitality", "活力", "能量條", "Open critique keeps a field's vitality.", "開放批評保持領域活力。"),
      card("vivacious", "活潑的", "活潑店員", "Vivacious talks still need sober slides.", "活潑演講仍需清醒投影片。"),
      card("vitamin", "維生素", "活字梗", "Think of checklists as vitamins for methods.", "把檢核表當方法維生素。", "story"),
      card("revive debate", "重啟辯論", "回魂討論", "Revive debate on estimands yearly.", "每年重啟目標量辯論。", "story"),
      card("alive", "活的", "還在跳", "Keep documentation alive with versions.", "用版本讓文件保持活。", "story"),
      card("lifeline", "生命線", "維生繩", "Shared code is a replication lifeline.", "共享程式碼是複現生命線。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Brightly clear; lifelike:", promptZh: "生動鮮明：", choices: ["vivid", "turbid", "terrible", "ordinary"], answer: "vivid" },
      { id: "q2", type: "sense", promptEn: "Essential to life; crucial:", promptZh: "極其重要：", choices: ["vital", "pedestrian", "horoscope", "mischief"], answer: "vital" },
      { id: "q3", type: "sense", promptEn: "Bring back to life/activity:", promptZh: "復活重振：", choices: ["revive", "deter", "impute", "resign"], answer: "revive" },
    ],
  },
  {
    id: "root-vor-01", type: "root", elementLemma: "vor", priority: "B",
    titleZh: "vor｜食欲怪獸食堂", titleEn: "Vor Appetite Cafeteria",
    hook: "字根 vor＝吃——食堂怪獸依食譜分類：雜食、肉食、吞食。",
    script: "voracious 食欲怪獸。devour 整盤吞。carnivore／herbivore／omnivore 肉／草／雜食窗口。savory 鹹香好吃（非 vor 但同桌）；vortex 漩渦把東西吃進去——廚師：voracious reading 好；devour 證據別只吞摘要。",
    reviewHooks: ["vor＝吃：voracious/devour/carnivore/herbivore/omnivore", "voracious＝貪婪的"],
    pitfalls: ["voracious＝貪婪／如饑似渴", "devour＝吞食"],
    members: [
      card("voracious", "貪婪的；如饑似渴的", "食欲怪獸", "Be voracious for primary sources.", "對一手來源如饑似渴。"),
      card("devour", "吞食；貪婪閱讀", "整盤吞", "Do not devour only abstracts.", "不要只吞摘要。"),
      card("carnivore", "肉食動物", "肉食窗", "A methods carnivore still needs veggies of ethics.", "方法肉食者仍需倫理蔬菜。"),
      card("herbivore", "草食動物", "草食窗", "Herbivore patience fits long replications.", "草食耐心適合長複現。"),
      card("omnivore", "雜食動物", "雜食窗", "An omnivore toolkit still needs coherence.", "雜食工具箱仍需一貫。"),
      card("vortex", "漩渦", "吃進去的渦", "Avoid the vortex of endless metrics.", "避開無盡指標漩渦。"),
      card("devouring", "吞食中", "狂吞", "Devouring hype leaves no room for limits.", "狂吞炒作就塞不下限制。", "story"),
      card("appetite", "食慾", "食堂入口", "An appetite for novelty needs a diet of nulls.", "嗜新食慾需要虛無減肥。", "story"),
      card("savory", "鹹香的；可口的", "好吃菜", "Savory narratives still need salt of doubt.", "可口敘事仍需懷疑的鹽。", "story"),
      card("glutton", "暴食者", "吃太多", "Do not be a glutton for covariates.", "不要當共變項暴食者。", "story"),
      card("digest", "消化", "慢慢吃", "Digest critique overnight before replying.", "回覆前隔夜消化批評。", "story"),
      card("binge", "狂吃", "一次吃爆", "Binge-reading without notes wastes time.", "不筆記的狂讀浪費時間。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Having a huge appetite; eager:", promptZh: "貪婪如饑：", choices: ["voracious", "temporary", "turbid", "attest"], answer: "voracious" },
      { id: "q2", type: "sense", promptEn: "Eat hungrily; consume eagerly:", promptZh: "吞食：", choices: ["devour", "orient", "preserve", "designate"], answer: "devour" },
      { id: "q3", type: "sense", promptEn: "Whirlpool; spiraling force:", promptZh: "漩渦：", choices: ["vortex", "tribute", "pedestal", "conceit"], answer: "vortex" },
    ],
  },
  {
    id: "prefix-con-01", type: "prefix", elementLemma: "con-/com-", priority: "A",
    titleZh: "con-/com-｜一起拼裝廠", titleEn: "Con Assembly Plant",
    hook: "字首 con-/com-＝一起／完全——拼裝廠專管湊齊、共同、壓縮。",
    script: "converge 零件湊齊；concurrent 同時開工。conspicuous 裝到超顯眼；consolidate 焊成一塊。concoct 調配配方；condone 默許劣件過關；concord 和諧出廠——廠長：converge on standards；never condone silent forks。",
    reviewHooks: ["con-＝一起：converge/concurrent/conspicuous/consolidate/concoct/condone", "condone＝寬恕／默許"],
    pitfalls: ["condone＝寬恕錯誤（常否定句）", "concoct＝調製／捏造"],
    members: [
      card("converge", "匯合；收斂", "零件湊齊", "Estimates should converge across specs.", "估計應跨規格收斂。"),
      card("concurrent", "同時的；並發的", "同時開工", "Avoid concurrent unblinded peeks.", "避免同時非盲偷看。"),
      card("conspicuous", "顯眼的", "裝到超顯眼", "Make limitations conspicuous.", "讓限制顯眼。"),
      card("consolidate", "鞏固；合併", "焊成一塊", "Consolidate logs before sharing.", "共享前鞏固日誌。"),
      card("concoct", "調製；捏造", "調配配方", "Do not concoct post-hoc stories.", "不要事後捏造故事。"),
      card("condone", "寬恕；默許", "劣件過關", "Never condone fabricated figures.", "永不默許偽造圖。"),
      card("concord", "和諧；一致", "和諧出廠", "Seek concord between prereg and paper.", "尋求預註冊與論文一致。"),
      card("combine", "結合", "拼在一起", "Combine datasets only with linkage audits.", "僅在連結稽核後合併資料。", "story"),
      card("companion", "同伴", "一起的人", "Code is the companion of the paper.", "程式碼是論文同伴。", "story"),
      card("complete", "完成；完全", "裝齊", "Complete the checklist before submit.", "提交前完成檢核表。", "story"),
      card("compress", "壓縮", "壓緊", "Compress slides, not uncertainty.", "壓縮投影片，不是不確定性。", "story"),
      card("committee", "委員會", "一起開會", "A committee cannot replace registered plans.", "委員會不能取代註冊計畫。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Overlook/forgive an offense:", promptZh: "默許寬恕：", choices: ["condone", "impede", "devour", "deter"], answer: "condone" },
      { id: "q2", type: "sense", promptEn: "Invent; fabricate a story/mix:", promptZh: "調製／捏造：", choices: ["concoct", "attest", "preserve", "orient"], answer: "concoct" },
      { id: "q3", type: "sense", promptEn: "Come together; meet:", promptZh: "匯合收斂：", choices: ["converge", "temporize", "terrify", "resign"], answer: "converge" },
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
  fs.writeFileSync(path.join(lessonDir, `lesson-${cluster.id}.json`), `${JSON.stringify(buildLesson({ ...cluster, quiz: raw.quiz }), null, 2)}\n`);
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
fs.writeFileSync(path.join(lessonDir, "index.json"), `${JSON.stringify({ version: "v0.8-p2b02", total: lessonIndex.length, lessons: lessonIndex }, null, 2)}\n`);
fs.writeFileSync(
  path.join(humorDir, "index.json"),
  `${JSON.stringify({ version: "v0.8-p2b02", status: "p2-batch02", uniqueWords: unique.size, clusters: allClusters.map((c) => ({ id: c.id, type: c.type, titleZh: c.titleZh, status: c.status, memberCount: (c.members || []).length })), lessons: lessonIndex }, null, 2)}\n`,
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
  path.join(humorDir, "P2-BATCH02-REPORT.md"),
  `# P2-batch02 完成報告

| 指標 | 數值 |
|------|------|
| 本批寫入 | ${written.length} |
| 總家族 | ${allClusters.length} |
| 獨特詞 | ${unique.size} |
| 距 P2(2500) | ${report.gapTo2500} |
| 距 4000 | ${report.gapTo4000} |

## 本批
${written.map((w) => `- \`${w.id}\`（${w.n}）`).join("\n")}

${blocked.length ? `## 未寫入\n${blocked.map((b) => `- ${b.id}: ${b.issues.join(", ")}`).join("\n")}` : ""}
`,
);
console.log(JSON.stringify(report, null, 2));
