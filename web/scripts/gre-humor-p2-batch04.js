/**
 * P2-batch04: ~20 clusters, humor-complete (hook/script/cards/quiz/TTS lines).
 * node web/scripts/gre-humor-p2-batch04.js
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
const STAGE = "P2-batch04";

const NEW = [
  {
    id: "root-graph-01", type: "root", elementLemma: "graph/gram", priority: "B",
    titleZh: "graph／gram｜圖寫繪圖司", titleEn: "Graph Ink Bureau",
    hook: "字根 graph/gram＝寫／圖——繪圖司專管圖表、電報與文法墨水。",
    script:
      "graph／graphic 把結果畫出來。diagram 流程圖牆。telegram 短訊急報。grammar／epigram 句法與警句墨水；autograph 簽名蓋章——司長：graphic clarity 加分；epigram 不能取代 ident。",
    reviewHooks: ["graph＝寫圖：graphic/diagram/telegram/grammar/epigram", "epigram＝警句"],
    pitfalls: ["epigram＝短警句；epigraph＝題詞", "telegram＝電報／短訊"],
    members: [
      card("graph", "圖；圖表", "主圖", "Put the primary graph in the abstract figure.", "把主圖放進摘要圖。"),
      card("graphic", "圖形的；生動的", "圖形清晰", "Use graphic clarity, not graphic drama.", "要圖形清晰，不要圖形戲劇。"),
      card("diagram", "圖解；示意圖", "流程圖牆", "A diagram of exclusions belongs in methods.", "排除示意圖應在方法段。"),
      card("telegram", "電報", "急報短訊", "Send a telegram-length correction notice.", "發電報長度的勘誤通知。"),
      card("grammar", "文法", "句法墨水", "Broken grammar in code comments breeds bugs.", "註解文法壞掉會滋生錯誤。"),
      card("epigram", "警句；雋語", "一句刺", "An epigram is not a causal claim.", "警句不是因果主張。"),
      card("autograph", "親筆簽名", "簽名蓋章", "Do not treat an autograph as peer review.", "別把簽名當同儕審查。", "story"),
      card("biography", "傳記", "人生圖寫", "A methods biography should list forks.", "方法傳記應列出分叉。", "story"),
      card("paragraph", "段落", "段寫單位", "One claim per paragraph, then evidence.", "一段一主張，再給證據。", "story"),
      card("monogram", "字母組合標記", "標記章", "Stamp a monogram on locked code.", "在鎖定程式碼蓋上標記。", "story"),
      card("graphite", "石墨", "畫線粉", "Trace uncertainty with a graphite pencil first.", "先用石墨筆描不確定。", "story"),
      card("cartography", "製圖學", "地圖寫法", "Sensitivity cartography maps assumption land.", "敏感度製圖學畫出假設地圖。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Short witty saying:", promptZh: "警句：", choices: ["epigram", "telegram", "graphite", "autograph"], answer: "epigram" },
      { id: "q2", type: "sense", promptEn: "Sketch showing structure:", promptZh: "圖解：", choices: ["diagram", "monogram", "biography", "grammar"], answer: "diagram" },
      { id: "q3", type: "sense", promptEn: "Vivid; of images:", promptZh: "圖形／生動：", choices: ["graphic", "noxious", "prim", "somnolent"], answer: "graphic" },
    ],
  },
  {
    id: "root-fract-01", type: "root", elementLemma: "frag/fract", priority: "B",
    titleZh: "frag／fract｜碎裂修復站", titleEn: "Fract Break Station",
    hook: "字根 frag/fract＝碎——修復站專管碎片、分數與難搞。",
    script:
      "fragment／fragmentary 樣本碎成片。fracture 裂縫報告。fraction／fractional 分數切片。fragile／frail 易碎玻璃；refract 折射光線——站長：fragmentary evidence 要標；fragile egos 別擋勘誤。",
    reviewHooks: ["fract＝碎：fragment/fracture/fraction/fragile/refract", "fragmentary＝片斷的"],
    pitfalls: ["fragile＝易碎；frail＝虛弱", "refract＝折射"],
    members: [
      card("fragment", "碎片；片段", "碎樣本", "Archive every fragment of the raw log.", "保存原始日誌每一碎片。"),
      card("fragmentary", "片斷的；不完整的", "碎證據", "Fragmentary evidence needs cautious claims.", "片斷證據需要謹慎主張。"),
      card("fracture", "骨折；裂縫", "裂縫報告", "A fracture in the protocol must be logged.", "規程裂縫必須記錄。"),
      card("fraction", "分數；部分", "切片", "Report the excluded fraction with reasons.", "報告排除分數並附理由。"),
      card("fractional", "分數的；微小的", "微小片", "Even a fractional leak of outcomes matters.", "結局哪怕微小洩漏也重要。"),
      card("fragile", "易碎的", "易碎玻璃", "Fragile findings need replication.", "易碎發現需要複現。"),
      card("frail", "虛弱的", "虛弱架", "A frail identification strategy collapses.", "虛弱識別策略會塌。"),
      card("refract", "折射", "折光", "Do not refract critique into personal attack.", "別把批評折射成人身攻擊。"),
      card("infraction", "違規", "規則碎裂", "An infraction of blinding rules voids trust.", "違反盲法規則摧毀信任。", "story"),
      card("diffraction", "繞射", "光繞彎", "Think of bias as diffraction around design gaps.", "把偏差當設計缺口的繞射。", "story"),
      card("shatter", "粉碎", "打碎", "One silent fork can shatter credibility.", "一次沉默分叉可粉碎可信度。", "story"),
      card("shard", "碎片", "玻璃渣", "Each shard of code needs a commit message.", "每片程式碼碎片需要 commit 訊息。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Easily broken:", promptZh: "易碎：", choices: ["fragile", "fraction", "telegram", "valiant"], answer: "fragile" },
      { id: "q2", type: "sense", promptEn: "Incomplete; in pieces:", promptZh: "片斷不完整：", choices: ["fragmentary", "graphic", "migrate", "vacant"], answer: "fragmentary" },
      { id: "q3", type: "sense", promptEn: "A break or crack:", promptZh: "裂縫／骨折：", choices: ["fracture", "epigram", "mandate", "quiet"], answer: "fracture" },
    ],
  },
  {
    id: "root-man-01", type: "root", elementLemma: "man", priority: "B",
    titleZh: "man｜手法操作台", titleEn: "Man Hand Bench",
    hook: "字根 man＝手——操作台專管手工、指揮、維修與手冊。",
    script:
      "manual／manually 親手操作。manipulate／manipulation 動手腳。manufacture 製造產出。manage／manager／management 指揮手；emancipate 鬆開手銬——台長：manipulate data 零分；manual checks 必要。",
    reviewHooks: ["man＝手：manual/manipulate/manufacture/manage/emancipate", "manipulate＝操縱"],
    pitfalls: ["manual＝手冊／手動", "emancipate＝解放"],
    members: [
      card("manual", "手冊；手動的", "親手操作", "Keep a manual for the analysis pipeline.", "為分析管線保留手冊。"),
      card("manually", "手動地", "親手做", "Manually audit a random subset of rows.", "手動稽核隨機列子集。"),
      card("manipulate", "操縱；操作", "動手腳", "Do not manipulate outcomes after seeing p.", "看到 p 後不要操縱結局。"),
      card("manipulation", "操縱", "動手腳行為", "Outcome manipulation is misconduct.", "結局操縱是不端。"),
      card("manufacture", "製造", "工廠產出", "Do not manufacture significance.", "不要製造顯著性。"),
      card("manage", "管理", "指揮手", "Manage version control like a lab notebook.", "把版本控制當實驗筆記管理。"),
      card("manager", "經理", "指揮的人", "A manager should model open corrections.", "經理應示範公開勘誤。"),
      card("management", "管理", "指揮系統", "Data management plans beat heroics.", "資料管理計畫勝過英雄主義。"),
      card("emancipate", "解放", "鬆銬", "Emancipate juniors to report errors safely.", "解放資淺者安全回報錯誤。", "story"),
      card("maneuver", "機動；手法", "手法動作", "A statistical maneuver needs pre-rules.", "統計手法需要預先規則。", "story"),
      card("manuscript", "手稿", "手寫本", "Lock the manuscript to a commit hash.", "把手稿鎖到 commit 雜湊。", "story"),
      card("handmade", "手工的", "親手做的", "Handmade figures still need axis labels.", "手工圖仍需軸標籤。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Handle deceitfully; control unfairly:", promptZh: "操縱：", choices: ["manipulate", "migrate", "vacate", "spiral"], answer: "manipulate" },
      { id: "q2", type: "sense", promptEn: "Done by hand; handbook:", promptZh: "手動／手冊：", choices: ["manual", "fracture", "polyglot", "quietude"], answer: "manual" },
      { id: "q3", type: "sense", promptEn: "Free from restraint:", promptZh: "解放：", choices: ["emancipate", "fragment", "mandate", "refract"], answer: "emancipate" },
    ],
  },
  {
    id: "root-mand-01", type: "root", elementLemma: "mand", priority: "B",
    titleZh: "mand｜命令櫃台", titleEn: "Mand Order Desk",
    hook: "字根 mand＝命令——櫃台專管命令、要求與委託單。",
    script:
      "command／commander 下達命令。demand／demanding 強勢要求。mandate／mandatory 強制令。commend 稱讚表現；countermand 撤銷前令——櫃員：mandatory prereg；countermand silent forks。",
    reviewHooks: ["mand＝命令：command/demand/mandate/mandatory/commend", "mandatory＝強制的"],
    pitfalls: ["commend＝稱讚；command＝命令", "countermand＝撤銷命令"],
    members: [
      card("command", "命令；指揮", "下達命令", "Command clarity beats charismatic chaos.", "命令清晰勝過魅力混亂。"),
      card("commander", "指揮官", "下令人", "The analysis commander owns the lock date.", "分析指揮官擁有鎖定日。"),
      card("demand", "要求；需求", "強勢要求", "Journals demand transparency; labs should too.", "期刊要求透明；實驗室也該如此。"),
      card("demanding", "苛求的", "高要求", "Demanding standards protect readers.", "苛求標準保護讀者。"),
      card("mandate", "授權；命令", "強制令", "Mandate open materials in the grant.", "在補助案強制開放材料。"),
      card("mandatory", "強制的", "必做的", "Mandatory checklists catch silent changes.", "強制清單抓住沉默變更。"),
      card("commend", "稱讚", "稱讚單", "Commend the team that posts nulls.", "稱讚發表虛無的團隊。"),
      card("countermand", "撤銷命令", "撤前令", "Countermand any post-hoc outcome swap.", "撤銷任何事後結局替換。"),
      card("remand", "還押；發回", "發回重審", "Remand shaky claims to reanalysis.", "把不穩主張發回重分析。", "story"),
      card("reprimand", "訓斥", "訓令", "A public reprimand is worse than a quiet fix.", "公開訓斥不如安靜修好。", "story"),
      card("commandment", "誡命", "誡條", "First commandment: do not peek unblinded.", "第一誡：不要非盲偷看。", "story"),
      card("requisition", "請購；徵用", "申請單", "File a requisition for compute, not for p.", "申請算力，不是申請 p。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Required by rule:", promptZh: "強制的：", choices: ["mandatory", "fragile", "vacant", "mute"], answer: "mandatory" },
      { id: "q2", type: "sense", promptEn: "Official order; authorize:", promptZh: "命令／授權：", choices: ["mandate", "epigram", "migrate", "spirit"], answer: "mandate" },
      { id: "q3", type: "sense", promptEn: "Praise formally:", promptZh: "稱讚：", choices: ["commend", "command", "demand", "fracture"], answer: "commend" },
    ],
  },
  {
    id: "root-migr-01", type: "root", elementLemma: "migr", priority: "B",
    titleZh: "migr｜遷移口岸", titleEn: "Migr Crossing Gate",
    hook: "字根 migr＝移——口岸專管遷移、移民與轉場。",
    script:
      "migrate／migration 資料搬家。immigrant／emigrant 進關／出關人。migratory 季節性遷徙。transmigrate 轉世梗搬場——關員：migrate pipelines 要有 checksum；別 migrate 結局定義。",
    reviewHooks: ["migr＝移：migrate/migration/immigrant/emigrant/migratory", "emigrant＝移出者"],
    pitfalls: ["immigrant＝移入；emigrant＝移出", "migratory＝遷徙的"],
    members: [
      card("migrate", "遷移", "搬家", "Migrate code only with tests and tags.", "遷移程式碼必須有測試與標籤。"),
      card("migration", "遷移", "搬遷案", "Document the schema migration fully.", "完整記錄結構遷移。"),
      card("immigrant", "移民（移入）", "進關人", "Treat immigrant datasets with local consent rules.", "移入資料集遵守在地同意規則。"),
      card("emigrant", "移民（移出）", "出關人", "Emigrant variables need destination labels.", "移出變數需要目的地標籤。"),
      card("migratory", "遷徙的", "季節遷", "Migratory collaborators still need shared logs.", "遷徙式合作者仍需共享日誌。"),
      card("transmigrate", "轉世；遷移靈魂", "轉場梗", "Do not transmigrate hypotheses midstream.", "不要中途轉世假說。", "story"),
      card("relocating", "重新安置", "再安置", "Relocating servers is not relocating outcomes.", "搬伺服器不是搬結局。", "story"),
      card("exodus", "大批離開", "大出走", "An exodus of staff risks lost documentation.", "人員大出走有文件遺失風險。", "story"),
      card("nomad", "遊牧者", "遊牧帳", "Nomad analysts still commit to a repo.", "遊牧分析師仍要提交到 repo。", "story"),
      card("transit", "過境", "過境帶", "Keep identifiers in transit encrypted.", "過境中的識別碼要加密。", "story"),
      card("uproot", "連根拔起", "拔根", "Uproot legacy scripts that hide peeks.", "拔起隱藏偷看的遺留腳本。", "story"),
      card("resettle", "重新定居", "再安家", "Resettle cleaned data in a read-only vault.", "把清乾淨資料再安家到唯讀庫。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Move from one place to another:", promptZh: "遷移：", choices: ["migrate", "commend", "refract", "vacate"], answer: "migrate" },
      { id: "q2", type: "lookalike", promptEn: "In-migrant vs out-migrant:", promptZh: "移入 vs 移出：", choices: ["immigrant / emigrant", "emigrant / immigrant", "migrate / migration", "nomad / exodus"], answer: "immigrant / emigrant" },
      { id: "q3", type: "sense", promptEn: "Wandering seasonally:", promptZh: "遷徙的：", choices: ["migratory", "mandatory", "fragile", "graphic"], answer: "migratory" },
    ],
  },
  {
    id: "root-mit-01", type: "root", elementLemma: "mis/mit", priority: "B",
    titleZh: "mis／mit｜投遞中心", titleEn: "Mit Dispatch Center",
    hook: "字根 mis/mit＝送——投遞中心專管發送、允許、承諾與傳教式推銷。",
    script:
      "transmit／transmission 把訊號送出。emit／emission 排放輸出。permit／permission／permissive 放行章。promise／compromise 承諾與妥協包裹；mission／missionary 任務與傳教——主任：permit peeking 不行；compromise methods 要透明。",
    reviewHooks: ["mit＝送：transmit/emit/permit/promise/compromise/mission", "permissive＝寬容放任"],
    pitfalls: ["permit＝允許；submit＝提交（sub 族）", "compromise＝妥協／危害"],
    members: [
      card("transmit", "傳送", "送出訊號", "Transmit only de-identified exports.", "只傳送去識別匯出。"),
      card("transmission", "傳送；傳播", "傳送帶", "Encryption in transmission is mandatory.", "傳送中加密是強制的。"),
      card("emit", "發出；排放", "排放口", "Models should emit uncertainty, not bravado.", "模型應排放不確定，不是虛張。"),
      card("emission", "排放", "排放量", "Report emission of compute costs honestly.", "誠實報告計算成本排放。"),
      card("permit", "允許；許可證", "放行章", "Do not permit unblinded interim peeks.", "不要允許非盲期中偷看。"),
      card("permission", "許可", "許可條", "Get permission before sharing identifiable files.", "分享可識別檔前先取得許可。"),
      card("permissive", "寬容的；放任的", "放太寬", "A permissive analysis plan invites fishing.", "放任分析計畫誘發淘篩。"),
      card("promise", "承諾", "承諾單", "Promise preregistration in the protocol.", "在規程承諾預註冊。"),
      card("compromise", "妥協；危害", "妥協包", "Do not compromise blinding for convenience.", "不要為方便危害盲法。"),
      card("mission", "任務", "任務單", "State the scientific mission before metrics.", "指標之前先陳述科學任務。", "story"),
      card("missionary", "傳教士", "傳教推銷", "Avoid missionary hype in abstracts.", "摘要避免傳教式炒作。", "story"),
      card("intermittent", "間歇的", "斷續送", "Intermittent logging still needs a clock sync.", "間歇日誌仍需時鐘同步。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Allow officially:", promptZh: "允許：", choices: ["permit", "fracture", "migrate", "vacant"], answer: "permit" },
      { id: "q2", type: "sense", promptEn: "Send across; broadcast:", promptZh: "傳送：", choices: ["transmit", "commend", "manual", "quiet"], answer: "transmit" },
      { id: "q3", type: "sense", promptEn: "Settle by mutual concession; endanger:", promptZh: "妥協／危害：", choices: ["compromise", "epigram", "shard", "polymath"], answer: "compromise" },
    ],
  },
  {
    id: "root-nat-01", type: "root", elementLemma: "nasc/nat", priority: "B",
    titleZh: "nasc／nat｜誕生產房", titleEn: "Nat Birth Ward",
    hook: "字根 nasc/nat＝生——產房專管天生、國家、自然與新生。",
    script:
      "native／nativity 土生與誕生。nature／natural／naturalistic 自然產線。nation／national／international 國界標籤。nascent 剛出生的計畫；innate 天生氣質——護士：nascent ideas 要養；假 natural 結論要查。",
    reviewHooks: ["nat＝生：native/nature/nation/nascent/innate", "nascent＝萌芽的"],
    pitfalls: ["innate＝天生的", "nascent＝剛出現的"],
    members: [
      card("native", "本地的；天生的", "土生", "Prefer native file formats over screenshots.", "寧可原生檔格式，不要截圖。"),
      card("nativity", "誕生；出生", "誕生場景", "Record the nativity of each derived variable.", "記錄每個派生變數的誕生。"),
      card("nature", "自然；本質", "本質", "State the nature of the estimand clearly.", "清楚陳述目標量本質。"),
      card("natural", "自然的", "自然產", "Natural experiments still need assumptions.", "自然實驗仍需假設。"),
      card("naturalistic", "自然主義的", "仿自然", "Naturalistic observation is not causal ID.", "自然主義觀察不是因果識別。"),
      card("nation", "國家", "國界", "Nation-level aggregates hide local bias.", "國家層加總掩蓋地方偏差。"),
      card("national", "國家的", "國立標", "National registries need access protocols.", "國家登錄庫需要存取規程。"),
      card("international", "國際的", "跨國標", "International teams still share one codebook.", "國際團隊仍共用一本編碼簿。"),
      card("nascent", "萌芽的；新生的", "剛出生", "Protect nascent replications from hype.", "保護萌芽複現免於炒作。"),
      card("innate", "天生的", "天生氣質", "Curiosity is innate; checklists are taught.", "好奇天生；清單靠教。", "story"),
      card("prenatal", "產前的", "產前檢查", "Do prenatal design reviews before funding.", "補助前先做產前設計審查。", "story"),
      card("renaissance", "復興", "再誕生", "A methods renaissance starts with open logs.", "方法復興從開放日誌開始。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Just beginning to exist:", promptZh: "萌芽新生：", choices: ["nascent", "mandatory", "fragile", "transmit"], answer: "nascent" },
      { id: "q2", type: "sense", promptEn: "Inborn; not learned:", promptZh: "天生的：", choices: ["innate", "migrate", "diagram", "reprimand"], answer: "innate" },
      { id: "q3", type: "sense", promptEn: "Of birthplace; original to a place:", promptZh: "本地／天生：", choices: ["native", "emission", "shard", "quietude"], answer: "native" },
    ],
  },
  {
    id: "root-press-01", type: "root", elementLemma: "press", priority: "B",
    titleZh: "press｜壓力印刷廠", titleEn: "Press Pressure Plant",
    hook: "字根 press＝壓——印刷廠專管壓力、表達、印象與壓制。",
    script:
      "press／pressure／pressing 機器壓力。express／expression／expressive 把墨擠出來。impress／impression／impressive 印出印象。oppress／repress／suppress 往下壓——廠長：suppress nulls 零分；express uncertainty。",
    reviewHooks: ["press＝壓：pressure/express/impress/oppress/repress/suppress", "suppress＝壓制／隱瞞"],
    pitfalls: ["suppress＝壓制；oppress＝壓迫", "impress＝留下印象"],
    members: [
      card("press", "壓；新聞界", "印刷機", "Do not let the press timeline force peeking.", "別讓新聞時程逼出偷看。"),
      card("pressure", "壓力", "壓力錶", "Deadline pressure is not a methods excuse.", "期限壓力不是方法藉口。"),
      card("pressing", "急迫的", "急壓單", "A pressing question still needs a design.", "急迫問題仍需要設計。"),
      card("express", "表達；快遞", "擠出墨", "Express limitations in the abstract.", "在摘要表達限制。"),
      card("expression", "表達；表情", "墨跡", "Keep the expression of results proportional.", "結果表達要成比例。"),
      card("expressive", "富表達的", "表情豐富", "Expressive plots still need error bars.", "富表達圖仍需誤差條。"),
      card("impress", "留下印象", "蓋印", "Impress reviewers with audits, not adjectives.", "用稽核打動審稿，不是形容詞。"),
      card("impression", "印象", "印痕", "First impressions of p-values mislead.", "對 p 值的第一印象常誤導。"),
      card("impressive", "令人印象深刻的", "印很深", "Impressive effect sizes need robustness checks.", "驚人效應量需要穩健檢查。"),
      card("oppress", "壓迫", "往下壓人", "Do not oppress dissent in lab meetings.", "實驗室會議不要壓迫異議。", "story"),
      card("repress", "壓抑", "壓回去", "Repress the urge to drop outliers silently.", "壓抑沉默丟掉離群的衝動。", "story"),
      card("suppress", "壓制；隱瞞", "壓住不報", "Never suppress inconvenient nulls.", "永不隱瞞麻煩的虛無。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Hold back; conceal:", promptZh: "壓制／隱瞞：", choices: ["suppress", "migrate", "native", "epigram"], answer: "suppress" },
      { id: "q2", type: "sense", promptEn: "State; squeeze out meaning:", promptZh: "表達：", choices: ["express", "fracture", "mandate", "vacant"], answer: "express" },
      { id: "q3", type: "sense", promptEn: "Force or stress:", promptZh: "壓力：", choices: ["pressure", "diagram", "immigrant", "commend"], answer: "pressure" },
    ],
  },
  {
    id: "root-spir-01", type: "root", elementLemma: "spir", priority: "B",
    titleZh: "spir｜呼吸氣象台", titleEn: "Spir Breath Observatory",
    hook: "字根 spir＝呼吸——氣象台專管 aspirate、精神、共謀與過期。",
    script:
      "spirit／spiritual 氣場。aspire／aspiration 吸氣向上。inspire／inspiration 把氣吹進別人。conspire／conspiracy 一起密謀換氣；expire／perspire 氣盡／流汗——台長：aspire to rigor；conspire against opacity。",
    reviewHooks: ["spir＝呼吸：spirit/aspire/inspire/conspire/expire", "conspire＝密謀"],
    pitfalls: ["aspire＝渴望；inspire＝啟發", "expire＝到期／死亡"],
    members: [
      card("spirit", "精神；靈魂", "氣場", "Keep the spirit of preregistration, not the checkbox only.", "保留預註冊精神，不是只打勾。"),
      card("spiritual", "精神的", "氣場的", "Spiritual motivation still needs methods.", "精神動機仍需要方法。"),
      card("aspire", "渴望；立志", "吸氣向上", "Aspire to share failures as well as wins.", "立志分享失敗與成功。"),
      card("aspiration", "志向；吸入", "向上吸氣", "Write the aspiration as a testable estimand.", "把志向寫成可檢目標量。"),
      card("inspire", "啟發", "吹氣給人", "Inspire juniors by modeling corrections.", "用示範勘誤啟發資淺者。"),
      card("inspiration", "靈感", "一口氣", "Inspiration is cheap; verification is work.", "靈感便宜；驗證是工作。"),
      card("conspire", "密謀", "一起換氣", "Do not conspire to hide exclusions.", "不要密謀隱藏排除。"),
      card("conspiracy", "陰謀", "密謀團", "A conspiracy of silence around errors is toxic.", "對錯誤的沉默陰謀有毒。"),
      card("expire", "到期；斷氣", "氣盡", "Let exclusivity claims expire with the data window.", "讓獨占主張與資料窗口一起到期。"),
      card("perspire", "流汗", "出汗", "Perspire over edge cases before launch.", "上線前為邊界案例流汗。", "story"),
      card("respiration", "呼吸", "換氣", "Team respiration needs retros without blame.", "團隊呼吸需要無責難回顧。", "story"),
      card("dispirited", "氣餒的", "洩氣", "Do not stay dispirited after a null—publish it.", "虛無後不要氣餒——發表它。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Aim upward; desire to achieve:", promptZh: "渴望立志：", choices: ["aspire", "suppress", "migrate", "fragile"], answer: "aspire" },
      { id: "q2", type: "sense", promptEn: "Plot secretly together:", promptZh: "密謀：", choices: ["conspire", "express", "native", "manual"], answer: "conspire" },
      { id: "q3", type: "sense", promptEn: "Come to an end; die:", promptZh: "到期／斷氣：", choices: ["expire", "impress", "diagram", "shard"], answer: "expire" },
    ],
  },
  {
    id: "root-vac-01", type: "root", elementLemma: "vac", priority: "B",
    titleZh: "vac｜真空清潔站", titleEn: "Vac Vacuum Station",
    hook: "字根 vac＝空——清潔站專管真空、空缺、假期與撤離。",
    script:
      "vacant／vacancy 空位子。vacuum 真空袋。evacuate／evacuation 撤離現場。vacation／vacate 放假清空；vacuous 空洞發言——站長：vacuous claims 掃走；vacant rows 要標缺失。",
    reviewHooks: ["vac＝空：vacant/vacuum/evacuate/vacation/vacuous", "vacuous＝空洞的"],
    pitfalls: ["vacant＝空的；vacuous＝無內容的", "vacate＝騰空／撤離"],
    members: [
      card("vacant", "空的；空缺的", "空位子", "Mark vacant cells as missing, not zero.", "空格標缺失，不要當零。"),
      card("vacancy", "空缺", "職缺／空位", "A vacancy in the codebook invites miscodes.", "編碼簿空缺誘發錯碼。"),
      card("vacuum", "真空", "真空袋", "There is no vacuum of assumptions—list them.", "沒有假設真空——請列出。"),
      card("evacuate", "撤離", "清場", "Evacuate secrets from public repos.", "把秘密從公開 repo 撤離。"),
      card("evacuation", "撤離", "撤離令", "Plan data evacuation before hardware fails.", "硬體故障前先規劃資料撤離。"),
      card("vacation", "假期", "放假", "Coverage does not take a vacation during holidays.", "假期期間覆蓋率不放假。"),
      card("vacate", "騰空；離開", "清空", "Vacate deprecated outcomes from the paper.", "把棄用結局從論文騰空。"),
      card("vacuous", "空洞的", "空話", "Vacuous significance talk wastes space.", "空洞顯著性空談浪費篇幅。"),
      card("void", "空隙；無效", "空洞區", "A void in the audit trail voids trust.", "稽核軌跡空隙使信任無效。", "story"),
      card("empty", "空的", "空箱", "Empty promises about sharing are misconduct-adjacent.", "空頭分享承諾近似不端。", "story"),
      card("blank", "空白", "空白格", "A blank methods section fails review.", "空白方法段審不過。", "story"),
      card("hollow", "中空的", "空心", "Hollow metrics inflate resumes.", "空心指標灌水履歷。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Empty of meaning:", promptZh: "空洞無物：", choices: ["vacuous", "mandatory", "nascent", "aspire"], answer: "vacuous" },
      { id: "q2", type: "sense", promptEn: "Unoccupied; empty:", promptZh: "空缺的：", choices: ["vacant", "conspire", "fragment", "transmit"], answer: "vacant" },
      { id: "q3", type: "sense", promptEn: "Leave empty; give up occupancy:", promptZh: "騰空離開：", choices: ["vacate", "impress", "migrate", "commend"], answer: "vacate" },
    ],
  },
  {
    id: "root-val-01", type: "root", elementLemma: "val", priority: "B",
    titleZh: "val｜價值健身房", titleEn: "Val Worth Gym",
    hook: "字根 val＝強／值——健身房專管價值、有效、勇敢與告別。",
    script:
      "value／valuable／evaluate／evaluation 秤價值。valid／validate／validity 有效認證。valiant／valor 勇敢組。equivalent 等值啞鈴；prevail／invalid 勝出／無效——教練：validate openly；invalid shortcuts 禁。",
    reviewHooks: ["val＝值／強：value/evaluate/valid/validate/valiant/prevail", "validity＝效度"],
    pitfalls: ["valid＝有效的；invalid＝無效的", "prevail＝勝過／盛行"],
    members: [
      card("value", "價值", "秤上讀數", "State the scientific value before the p.", "在 p 之前陳述科學價值。"),
      card("valuable", "有價值的", "有重量", "Negative results are valuable when honest.", "誠實的負結果有價值。"),
      card("evaluate", "評估", "上秤", "Evaluate robustness, not vibes.", "評估穩健，不是感覺。"),
      card("evaluation", "評估", "秤重報告", "External evaluation beats self-praise.", "外部評估勝過自誇。"),
      card("valid", "有效的", "認證通過", "A valid test needs a clear estimand.", "有效檢定需要清楚目標量。"),
      card("validate", "驗證", "蓋認證章", "Validate code against a known toy dataset.", "用已知玩具資料驗證程式碼。"),
      card("validity", "效度；有效性", "認證強度", "Discuss construct validity, not only p.", "討論構念效度，不只 p。"),
      card("valiant", "勇敢的", "勇敢組", "Valiant reporting includes limitations.", "勇敢報告包含限制。"),
      card("valor", "勇氣", "勇氣值", "Intellectual valor is correcting the record.", "智識勇氣是更正紀錄。", "story"),
      card("equivalent", "相等的", "等值啞鈴", "Do not treat proxies as equivalent outcomes.", "別把代理當等值結局。", "story"),
      card("prevail", "勝過；盛行", "勝出", "Evidence should prevail over hierarchy.", "證據應勝過層級。", "story"),
      card("invalid", "無效的", "認證失敗", "Unblinded peeks make tests invalid.", "非盲偷看使檢定無效。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Confirm accuracy; make valid:", promptZh: "驗證：", choices: ["validate", "vacate", "conspire", "fracture"], answer: "validate" },
      { id: "q2", type: "sense", promptEn: "Sound; legally/logically acceptable:", promptZh: "有效的：", choices: ["valid", "vacuous", "migratory", "pressing"], answer: "valid" },
      { id: "q3", type: "sense", promptEn: "Assess worth:", promptZh: "評估：", choices: ["evaluate", "emit", "diagram", "shard"], answer: "evaluate" },
    ],
  },
  {
    id: "root-strict-01", type: "root", elementLemma: "string/strict", priority: "B",
    titleZh: "string／strict｜綁緊繩索庫", titleEn: "Strict Cord Warehouse",
    hook: "字根 string/strict＝綁／緊——繩索庫專管嚴格、限制、緊繃與約束。",
    script:
      "strict／strictly／stricture 繩子勒緊。restrict／restriction／restrictive 限制區。constrain／constraint 約束帶。astringent 澀味收斂；strain／stringent 拉緊／嚴厲——庫管：stringent prereg；restrictive paywalls 要拆。",
    reviewHooks: ["strict＝緊：strict/restrict/constraint/stringent/stricture", "stringent＝嚴厲的"],
    pitfalls: ["stringent＝嚴格嚴厲", "stricture＝責難／狹窄"],
    members: [
      card("strict", "嚴格的", "勒緊", "Keep a strict separation of roles in analysis.", "分析中嚴格分離角色。"),
      card("strictly", "嚴格地", "勒緊副詞", "Strictly pre-specify primary outcomes.", "嚴格預先指定主要結局。"),
      card("stricture", "責難；狹窄", "勒痕責難", "Invite stricture from auditors early.", "及早邀請稽核責難。"),
      card("restrict", "限制", "設限", "Restrict access to identifiable keys.", "限制可識別金鑰存取。"),
      card("restriction", "限制", "限制條款", "List every restriction in the registry.", "在登錄庫列出每條限制。"),
      card("restrictive", "限制性的", "過緊門", "Restrictive NDAs block replication.", "過緊保密協議阻擋複現。"),
      card("constrain", "約束", "綁住", "Constrain researcher degrees of freedom.", "約束研究者自由度。"),
      card("constraint", "約束", "約束帶", "Budget is a constraint; honesty is not optional.", "預算是約束；誠實不是選配。"),
      card("stringent", "嚴厲的", "超緊規", "Stringent checks beat stringency theater.", "嚴厲檢查勝過嚴厲作秀。"),
      card("astringent", "收斂的；嚴苛的", "澀味", "An astringent review can still be fair.", "嚴苛審查仍可公平。", "story"),
      card("strain", "拉緊；菌株；壓力", "拉緊", "Strain gauges of bias include design plots.", "偏差應變計包含設計圖。", "story"),
      card("cordon", "封鎖線", "繩圈", "Cordon off production data from playgrounds.", "用封鎖線隔開正式資料與沙盒。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Severe; rigorously binding:", promptZh: "嚴厲嚴格：", choices: ["stringent", "vacuous", "nascent", "aspire"], answer: "stringent" },
      { id: "q2", type: "sense", promptEn: "Limit; keep within bounds:", promptZh: "限制：", choices: ["restrict", "inspire", "migrate", "epigram"], answer: "restrict" },
      { id: "q3", type: "sense", promptEn: "A limiting condition:", promptZh: "約束：", choices: ["constraint", "telegram", "valor", "shard"], answer: "constraint" },
    ],
  },
  {
    id: "root-tact-01", type: "root", elementLemma: "tact/tang", priority: "B",
    titleZh: "tact／tang｜觸覺接待處", titleEn: "Tact Touch Desk",
    hook: "字根 tact/tang＝觸——接待處專管接觸、策略、具體與完整。",
    script:
      "tact／tactful／tactless 交際觸感。contact／intact 接觸／完整未碰壞。tangible／intangible 摸得到／摸不到。tangent 跑題切線；contingent 依條件觸發——接待：tactful critique；intact blinding。",
    reviewHooks: ["tact＝觸：tact/contact/intact/tangible/tangent/contingent", "intact＝完整未損"],
    pitfalls: ["tact＝圓通；tactile＝觸覺的", "tangent＝切線／離題"],
    members: [
      card("tact", "圓通；機智", "交際觸感", "Use tact when requesting raw data.", "索取原始資料要用圓通。"),
      card("tactful", "圓通的", "有觸感", "Tactful emails still attach checklists.", "圓通郵件仍附清單。"),
      card("tactless", "不得體的", "沒觸感", "Tactless sarcasm sinks valid points.", "不得體諷刺毁掉有效論點。"),
      card("contact", "接觸；聯絡", "觸點", "Document every contact with the data vendor.", "記錄與資料供應商每次接觸。"),
      card("intact", "完整未損的", "沒碰壞", "Keep blinding intact until lock.", "鎖定前保持盲法完整。"),
      card("tangible", "可觸摸的；具體的", "摸得到", "Give tangible deliverables: code and codebook.", "給具體交付：程式碼與編碼簿。"),
      card("intangible", "無形的", "摸不到", "Intangible prestige is not a methods argument.", "無形聲望不是方法論據。"),
      card("tangent", "切線；離題", "跑題線", "Do not go on a tangent mid-prereg.", "預註冊中途不要離題。"),
      card("contingent", "依條件的；代表團", "觸發條件", "Secondary analyses are contingent on the primary.", "次要分析依主要結果而定。"),
      card("tactile", "觸覺的", "用手摸", "Tactile stickers on drives beat mystery folders.", "硬碟觸覺貼紙勝過神秘資料夾。", "story"),
      card("contiguous", "毗連的", "貼著的", "Keep contiguous logs without gaps.", "保持毗連日誌無缺口。", "story"),
      card("attain", "達成", "碰到目標", "Attain power targets before recruitment ends.", "招募結束前達成檢定力目標。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Whole; undamaged:", promptZh: "完整未損：", choices: ["intact", "vacuous", "suppress", "emigrant"], answer: "intact" },
      { id: "q2", type: "sense", promptEn: "Perceptible by touch; concrete:", promptZh: "具體可觸：", choices: ["tangible", "spiritual", "vacant", "nascent"], answer: "tangible" },
      { id: "q3", type: "sense", promptEn: "Diplomatic sensitivity:", promptZh: "圓通：", choices: ["tact", "press", "shard", "mandate"], answer: "tact" },
    ],
  },
  {
    id: "root-sect-01", type: "root", elementLemma: "sec/sect", priority: "B",
    titleZh: "sec／sect｜切割手術室", titleEn: "Sect Cutting OR",
    hook: "字根 sec/sect＝切——手術室專管切片、部門、昆蟲與相交。",
    script:
      "section／sector 切開分區。dissect／dissection 解剖方法。insect 小切蟲梗。intersect／intersection／intersecting 切線相交；bisect 對切——主刀：dissect assumptions；section bias sources。",
    reviewHooks: ["sect＝切：section/dissect/insect/intersect/bisect", "dissect＝剖析"],
    pitfalls: ["section＝章節／切開", "intersect＝相交"],
    members: [
      card("section", "部分；章節；切開", "切開區", "Add a limitations section that bites.", "加一段真正咬人的限制章。"),
      card("sector", "部門；扇形", "扇區", "Public sector data still needs consent maps.", "公共部門資料仍需同意地圖。"),
      card("dissect", "解剖；剖析", "動刀剖析", "Dissect the identification assumptions aloud.", "大聲剖析識別假設。"),
      card("dissection", "解剖", "解剖報告", "A methods dissection belongs in supplements.", "方法解剖屬於補充材料。"),
      card("insect", "昆蟲", "小切蟲", "Bug trackers catch insects before reviewers do.", "錯誤追蹤器比審稿人先抓蟲。", "story"),
      card("intersect", "相交", "切線交", "Where ethics and methods intersect, document both.", "倫理與方法相交處兩者都記錄。"),
      card("intersection", "交集；十字路口", "交點", "Study the intersection of missingness and attrition.", "研究缺失與流失的交集。"),
      card("bisect", "對切", "切成兩半", "Bisect the sample only if pre-planned.", "僅在預先計畫時對切樣本。"),
      card("secant", "割線", "割線刀", "A secant through subgroups needs correction.", "割過次群需要校正。", "story"),
      card("transect", "橫切線", "橫切", "Transect the city with random routes, not vibes.", "用隨機路線橫切城市，不是感覺。", "story"),
      card("cutaway", "剖面圖", "剖視", "Show a cutaway of the pipeline stages.", "展示管線階段剖面。", "story"),
      card("segment", "區段", "切片段", "Predefine segments before looking at outcomes.", "看結局前先定義區段。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Cut apart for study; analyze finely:", promptZh: "剖析：", choices: ["dissect", "aspire", "vacate", "commend"], answer: "dissect" },
      { id: "q2", type: "sense", promptEn: "Cross; meet at a point:", promptZh: "相交：", choices: ["intersect", "suppress", "migrate", "graphic"], answer: "intersect" },
      { id: "q3", type: "sense", promptEn: "Cut into two equal parts:", promptZh: "對切：", choices: ["bisect", "expire", "intact", "valor"], answer: "bisect" },
    ],
  },
  {
    id: "root-plac-01", type: "root", elementLemma: "plac", priority: "B",
    titleZh: "plac｜安撫接待室", titleEn: "Plac Calm Lounge",
    hook: "字根 plac＝平息／討好——接待室專管安撫、平靜、討好與和解。",
    script:
      "placid 水面平靜。placate 安撫怒審。placebo 安慰劑糖。complacent／complacency 自滿沙發；implacable 安撫不了——接待：placate egos after critique；complacent labs 危險。",
    reviewHooks: ["plac＝平：placid/placate/placebo/complacent/implacable", "complacent＝自滿的"],
    pitfalls: ["placate＝安撫；placebo＝安慰劑", "implacable＝無法平息的"],
    members: [
      card("placid", "平靜的", "平水面", "Keep a placid tone in rebuttals.", "反駁保持平靜語氣。"),
      card("placate", "安撫", "安撫怒", "Placate concerns with data, not adjectives.", "用資料安撫疑慮，不是形容詞。"),
      card("placebo", "安慰劑", "安慰糖", "Placebo arms still need outcome locks.", "安慰劑臂仍需結局鎖定。"),
      card("complacent", "自滿的", "自滿沙發", "Complacent labs skip audits.", "自滿實驗室跳過稽核。"),
      card("complacency", "自滿", "沙發病", "Complacency about p-hacking is contagious.", "對 p 操弄的自滿會傳染。"),
      card("implacable", "無法平息的", "安撫不了", "Implacable skepticism is fine; bad faith is not.", "無法平息的懷疑沒問題；惡意不行。"),
      card("plea", "懇求", "求情", "A plea for urgency is not a design.", "懇求急迫不是設計。", "story"),
      card("please", "取悅；請", "討好", "Do not please editors by hiding nulls.", "不要為取悅編輯隱藏虛無。", "story"),
      card("pleasant", "愉快的", "好氣氛", "Pleasant culture still needs hard reviews.", "愉快文化仍需嚴格審查。", "story"),
      card("appease", "綏靖；安撫", "綏靖", "Appease funders with milestones, not fake p.", "用里程碑安撫資助者，不是假 p。", "story"),
      card("soothe", "撫慰", "撫平", "Soothe anxiety with checklists.", "用清單撫慰焦慮。", "story"),
      card("calm", "冷靜", "冷靜鈕", "Stay calm when a bug appears post-print.", "刊後發現錯誤保持冷靜。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Self-satisfied; uncritically content:", promptZh: "自滿：", choices: ["complacent", "stringent", "nascent", "intact"], answer: "complacent" },
      { id: "q2", type: "sense", promptEn: "Make less angry; soothe:", promptZh: "安撫：", choices: ["placate", "bisect", "emit", "fracture"], answer: "placate" },
      { id: "q3", type: "sense", promptEn: "Impossible to appease:", promptZh: "無法平息：", choices: ["implacable", "vacuous", "migratory", "manual"], answer: "implacable" },
    ],
  },
  {
    id: "root-qui-01", type: "root", elementLemma: "qui", priority: "B",
    titleZh: "qui｜靜音控制室", titleEn: "Qui Quiet Control Room",
    hook: "字根 qui＝靜——控制室專管安靜、靜止、默許與收購安靜。",
    script:
      "quiet／quietly／quietude 靜音旋鈕。tranquil／tranquility 平靜畫面。acquiesce／acquiescent 默許點頭。requiem 安息曲梗；quietism 無為——控師：quietude for thinking；acquiesce to bad incentives 不行。",
    reviewHooks: ["qui＝靜：quiet/tranquil/acquiesce/quietude/requiem", "acquiesce＝默許"],
    pitfalls: ["acquiesce＝勉強同意／默許", "quietude＝寧靜"],
    members: [
      card("quiet", "安靜的", "靜音", "Keep a quiet channel for error reports.", "為錯誤回報保留安靜通道。"),
      card("quietly", "安靜地", "靜靜地", "Fix quietly, then announce publicly.", "先安靜修好，再公開宣布。"),
      card("quietude", "寧靜", "靜室", "Protect quietude for reading the protocol.", "保護閱讀規程的寧靜。"),
      card("tranquil", "平靜的", "平靜畫面", "Tranquil dashboards can hide missingness.", "平靜儀表板可能藏缺失。"),
      card("tranquility", "平靜", "平靜度", "Tranquility is not the same as rigor.", "平靜不等於嚴謹。"),
      card("acquiesce", "默許", "點頭默許", "Do not acquiesce to outcome switching.", "不要默許結局更換。"),
      card("acquiescent", "默許的", "好說話", "An acquiescent coauthor still shares blame.", "好說話共同作者仍共擔責任。"),
      card("requiem", "安魂曲", "安息曲", "Write a requiem for deprecated endpoints.", "為棄用終點寫安魂曲。", "story"),
      card("quietism", "寂靜主義", "無為靜", "Quietism about misconduct enables it.", "對不端的無為使其得逞。", "story"),
      card("mute", "靜音；啞", "靜音鍵", "Mute hype words in the title.", "標題靜音炒作詞。", "story"),
      card("silence", "沉默", "沉默區", "Silence about bugs is a lab hazard.", "對錯誤沉默是實驗室危害。", "story"),
      card("hush", "肅靜", "噓", "Hush culture blocks whistleblowers.", "噓聲文化阻擋吹哨。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Accept without protest:", promptZh: "默許：", choices: ["acquiesce", "dissect", "validate", "migrate"], answer: "acquiesce" },
      { id: "q2", type: "sense", promptEn: "Calm; peaceful:", promptZh: "平靜：", choices: ["tranquil", "stringent", "vacuous", "nascent"], answer: "tranquil" },
      { id: "q3", type: "sense", promptEn: "State of stillness:", promptZh: "寧靜：", choices: ["quietude", "fracture", "mandate", "epigram"], answer: "quietude" },
    ],
  },
  {
    id: "root-sat-01", type: "root", elementLemma: "sat/satis", priority: "B",
    titleZh: "sat／satis｜飽足餐廳", titleEn: "Satis Full Plate Diner",
    hook: "字根 sat/satis＝滿——餐廳專管滿足、飽和、過剩與資產。",
    script:
      "satisfy／satisfaction／satisfactory 上菜滿意度。sate／satiate／satiated 吃到飽。saturate／saturation／saturated 醬汁飽和。asset／satire 資產與諷刺配菜——主廚：satisfactory power；不要 saturate 摘要形容詞。",
    reviewHooks: ["sat＝滿：satisfy/sate/saturate/satisfactory/satiated", "saturate＝使飽和"],
    pitfalls: ["sate／satiate＝使飽足", "satire＝諷刺（形近彩蛋）"],
    members: [
      card("satisfy", "使滿足", "滿意上菜", "Satisfy reviewers with robustness, not adjectives.", "用穩健滿足審稿，不是形容詞。"),
      card("satisfaction", "滿意", "滿意度", "Reader satisfaction tracks clarity of estimands.", "讀者滿意追蹤目標量清晰度。"),
      card("satisfactory", "令人滿意的", "及格盤", "A satisfactory prereg is specific.", "令人滿意的預註冊要具體。"),
      card("sate", "使飽足", "吃飽", "Sate curiosity with exploratory labels.", "用探索標籤滿足好奇。"),
      card("satiate", "使充分滿足", "灌飽", "Do not satiate journals with recycled figures.", "不要用回收圖灌飽期刊。"),
      card("satiated", "吃飽的", "已飽", "A satiated alpha leaves nothing for confirmation.", "α 吃飽就沒剩確認額度。"),
      card("saturate", "使飽和", "倒滿醬", "Do not saturate the abstract with hype.", "不要用炒作使摘要飽和。"),
      card("saturation", "飽和", "飽和度", "Market saturation of flashy claims hurts trust.", "炫目主張市場飽和傷害信任。"),
      card("saturated", "飽和的", "已滿醬", "A saturated model still needs out-of-sample checks.", "飽和模型仍需樣本外檢查。"),
      card("asset", "資產", "資產盤", "Open code is a lab asset.", "開放程式碼是實驗室資產。", "story"),
      card("satire", "諷刺", "諷刺配菜", "Use satire carefully; methods are not a roast.", "諷刺要小心；方法不是吐槽秀。", "story"),
      card("enough", "足夠", "夠了", "Enough power beats elegant underpower.", "足夠檢定力勝過優雅的不足。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Fill completely; soak:", promptZh: "使飽和：", choices: ["saturate", "acquiesce", "bisect", "aspire"], answer: "saturate" },
      { id: "q2", type: "sense", promptEn: "Adequate; meeting needs:", promptZh: "令人滿意：", choices: ["satisfactory", "vacuous", "tactless", "migratory"], answer: "satisfactory" },
      { id: "q3", type: "sense", promptEn: "Fully satisfy appetite:", promptZh: "使飽足：", choices: ["satiate", "suppress", "intact", "diagram"], answer: "satiate" },
    ],
  },
  {
    id: "prefix-circum-01", type: "prefix", elementLemma: "circum-", priority: "B",
    titleZh: "circum-｜環繞航線塔", titleEn: "Circum Orbit Tower",
    hook: "字首 circum-＝環繞——航線塔專管周圍、迂回與環境。",
    script:
      "circumference 外圓周。circumvent 繞過規則。circumstance／circumstances 周圍情境。circumspect 環顧再走；circuitous 繞遠路——塔台：circumspect claims；勿 circumvent prereg。",
    reviewHooks: ["circum-＝環繞：circumference/circumvent/circumstance/circumspect", "circumvent＝規避"],
    pitfalls: ["circumvent＝設法規避", "circumspect＝謹慎周到"],
    members: [
      card("circumference", "圓周；周長", "外圈", "Measure the circumference of uncertainty.", "測量不確定的圓周。"),
      card("circumvent", "規避；繞過", "繞規則", "Do not circumvent inclusion criteria.", "不要規避納入標準。"),
      card("circumstance", "情況；環境", "周圍情境", "Report the circumstance of each exclusion.", "報告每次排除的情境。"),
      card("circumstances", "環境；境況", "多情境", "Under no circumstances peek unblinded.", "任何情況下都不要非盲偷看。"),
      card("circumspect", "謹慎的；周到的", "環顧再走", "Be circumspect before claiming generality.", "宣稱概括前要謹慎。"),
      card("circuitous", "迂回的", "繞遠路", "A circuitous methods section hides gaps.", "迂回方法段隱藏缺口。"),
      card("circuit", "電路；環線", "環線", "Close the feedback circuit with post-pub audits.", "用刊後稽核閉合回饋環。", "story"),
      card("surround", "包圍", "圍住", "Surround estimates with intervals.", "用區間包圍估計。", "story"),
      card("around", "周圍", "一圈", "Look around for rival explanations.", "環顧對立解釋。", "story"),
      card("bypass", "旁通；繞過", "旁路", "A ethics bypass is still misconduct.", "倫理旁路仍是不端。", "story"),
      card("perimeter", "周界", "周界線", "Define the perimeter of the target population.", "定義目標族群周界。", "story"),
      card("orbit", "軌道", "環軌道", "Keep helpers in orbit of the locked protocol.", "讓幫手繞著鎖定規程運轉。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Avoid by going around:", promptZh: "規避繞過：", choices: ["circumvent", "placate", "validate", "satiate"], answer: "circumvent" },
      { id: "q2", type: "sense", promptEn: "Cautious; looking around:", promptZh: "謹慎周到：", choices: ["circumspect", "vacuous", "complacent", "mute"], answer: "circumspect" },
      { id: "q3", type: "sense", promptEn: "Roundabout; indirect:", promptZh: "迂回：", choices: ["circuitous", "intact", "nascent", "stringent"], answer: "circuitous" },
    ],
  },
  {
    id: "prefix-poly-01", type: "prefix", elementLemma: "poly-", priority: "B",
    titleZh: "poly-｜多聲部錄音室", titleEn: "Poly Multitrack Studio",
    hook: "字首 poly-＝多——錄音室專管多元、多音、多形與多智。",
    script:
      "polyglot 多語軌。polygon 多邊舞台。polymorphic／polymorphism 多形變聲。polymath 多才工程師；polyphony 多聲部——製作人：polyglot docs；勿 polymorphic 結局定義。",
    reviewHooks: ["poly-＝多：polyglot/polygon/polymorphic/polymath/polyphony", "polyglot＝通多語者"],
    pitfalls: ["polymath＝博學者", "polymorphism＝多型／多態"],
    members: [
      card("polyglot", "通多種語言的人", "多語軌", "Ship polyglot documentation for collaborators.", "為合作者提供多語文件。"),
      card("polygon", "多邊形", "多邊舞台", "Plot uncertainty as a polygon, not a point.", "把不確定畫成多邊形，不是點。"),
      card("polymorphic", "多形的；多態的", "多形變聲", "Polymorphic outcome definitions invite chaos.", "多態結局定義招來混亂。"),
      card("polymorphism", "多型；多態", "多型譜", "Genetic polymorphism is not a free causal ticket.", "基因多型不是免費因果票。"),
      card("polymath", "博學者", "多才軌", "Even a polymath needs a checklist.", "即使博學者也需要清單。"),
      card("polyphony", "複音；多聲部", "多聲部", "Lab polyphony needs a conductor protocol.", "實驗室多聲部需要指揮規程。", "story"),
      card("polymer", "聚合物", "多單體", "Think of a paper as a polymer of claims and checks.", "把論文當主張與檢查的聚合物。", "story"),
      card("multimedia", "多媒體", "多媒介", "Multimedia supplements still need captions.", "多媒體補充仍需圖說。", "story"),
      card("multiple", "多重的", "多重", "Correct for multiple comparisons when planned.", "計畫時校正多重比較。", "story"),
      card("manifold", "多種的；流形", "多樣", "Manifold threats to validity need a table.", "多種效度威脅需要表格。", "story"),
      card("plural", "複數的；多元的", "複數", "Use plural authorship with plural accountability.", "多元作者伴隨多元問責。", "story"),
      card("multitude", "大量", "一大群", "A multitude of robustness checks beats one star.", "大量穩健檢查勝過一顆星。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Speaker of many languages:", promptZh: "通多語者：", choices: ["polyglot", "placid", "vacant", "strict"], answer: "polyglot" },
      { id: "q2", type: "sense", promptEn: "Person of wide learning:", promptZh: "博學者：", choices: ["polymath", "insect", "requiem", "shard"], answer: "polymath" },
      { id: "q3", type: "sense", promptEn: "Many forms; shape-shifting:", promptZh: "多形多態：", choices: ["polymorphic", "circumspect", "satiated", "tactful"], answer: "polymorphic" },
    ],
  },
  {
    id: "prefix-inter-01", type: "prefix", elementLemma: "inter-", priority: "B",
    titleZh: "inter-｜之間調度室", titleEn: "Inter Between Desk",
    hook: "字首 inter-＝之間——調度室專管中間、互相、打斷與間隔。",
    script:
      "interact／interaction／interactive 互動機。interrupt／interruption 打斷線。interval／interim 間隔／期中。intermediate／intermediary 中間人；international（nat 族）跨國——調度：interaction tests；勿 interim peek。",
    reviewHooks: ["inter-＝之間：interact/interrupt/interval/interim/intermediate", "interim＝暫時期中"],
    pitfalls: ["interim＝暫時的", "intermediary＝中間人"],
    members: [
      card("interact", "互動", "互動機", "Factors may interact; test that plan.", "因子可能互動；按計畫檢定。"),
      card("interaction", "交互作用", "交互項", "Pre-specify interaction hypotheses.", "預先指定交互假說。"),
      card("interactive", "互動的", "可互動", "Interactive dashboards still need version pins.", "互動儀表板仍需版本釘選。"),
      card("interrupt", "打斷", "打斷線", "Do not interrupt blinding for curiosity.", "不要為好奇打斷盲法。"),
      card("interruption", "中斷", "中斷點", "Log every interruption of data collection.", "記錄資料收集每次中斷。"),
      card("interval", "間隔；區間", "區間帶", "Always report intervals with estimates.", "估計值一律附區間。"),
      card("interim", "暫時的；期中的", "期中窗", "Interim looks need alpha spending rules.", "期中查看需要 α 花費規則。"),
      card("intermediate", "中間的", "中間層", "Name intermediate outcomes transparently.", "透明命名中間結局。"),
      card("intermediary", "中間人", "中間商", "An intermediary vendor still needs contracts.", "中間供應商仍需合約。"),
      card("interject", "插話", "插入句", "Interject caveats when claims overreach.", "主張過頭時插入但書。", "story"),
      card("interweave", "交織", "織在一起", "Interweave ethics and methods in training.", "訓練中交織倫理與方法。", "story"),
      card("between", "之間", "之間口語", "Effects between sites need pooling rules.", "站點之間效應需要合併規則。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Temporary; in the meantime:", promptZh: "期中暫時：", choices: ["interim", "placid", "polyglot", "vacuous"], answer: "interim" },
      { id: "q2", type: "sense", promptEn: "Space or time between; CI:", promptZh: "間隔／區間：", choices: ["interval", "fracture", "mandate", "sate"], answer: "interval" },
      { id: "q3", type: "sense", promptEn: "Break into; stop briefly:", promptZh: "打斷：", choices: ["interrupt", "bisect", "aspire", "commend"], answer: "interrupt" },
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
  `${JSON.stringify({ version: "v0.9-p2b04", total: lessonIndex.length, lessons: lessonIndex }, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(humorDir, "index.json"),
  `${JSON.stringify(
    {
      version: "v0.9-p2b04",
      status: "p2-batch04",
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
  path.join(humorDir, "P2-BATCH04-REPORT.md"),
  `# P2-batch04 完成報告（幽默完整）

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
