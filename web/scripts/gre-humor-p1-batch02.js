/**
 * P1-batch02: ~20 clusters → push unique humor words toward / past 1,000.
 * Run: node web/scripts/gre-humor-p1-batch02.js
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

const STAGE = "P1-batch02";

const NEW = [
  {
    id: "root-flu-01", type: "root", elementLemma: "flu", priority: "B",
    titleZh: "flu｜流動調度站", titleEn: "Flu Flow Station",
    hook: "字根 flu＝流——調度站專管什麼在流、流過量。",
    script: "fluent 流利；affluent 財源流進來。flux／influx 流動與湧入；fluctuate 上下波動。superfluous 流過頭變成多餘；mellifluous 蜜一樣流暢。confluence 匯流；effluent 流出物；fluid 流動態。",
    reviewHooks: ["flu＝流：fluent/affluent/flux/influx/fluctuate/superfluous", "superfluous＝多餘"],
    pitfalls: ["affluent＝富裕（財流進）；effluent＝流出物／污水", "superfluous≠superficial"],
    members: [
      card("fluent", "流利的", "流得順", "Be fluent about uncertainty, not about hype.", "對不確定性要說得流利，不是對炒作。"),
      card("affluent", "富裕的", "財流進來", "Affluent labs still need open methods.", "富裕實驗室仍需開放方法。"),
      card("effluent", "流出物；污水", "流出去的髒", "Treat publication bias like toxic effluent.", "把發表偏差當有毒流出物。"),
      card("flux", "流動；變動", "一直在流", "Methods are in flux; document versions.", "方法在變動中，請記錄版本。"),
      card("influx", "湧入", "大量流入", "An influx of datasets needs curation labor.", "資料集湧入需要策展人力。"),
      card("fluctuate", "波動", "上下流", "Estimates fluctuate with inclusion rules.", "估計隨納入規則波動。"),
      card("superfluous", "多餘的", "流過頭", "Cut superfluous adjectives from abstracts.", "刪掉摘要裡多餘形容詞。"),
      card("mellifluous", "聲音甜美的", "蜜物流暢", "Mellifluous prose can hide weak identification.", "甜美文風可能掩蓋弱識別。"),
      card("confluence", "匯流；匯合", "流到一起", "A confluence of errors sank the claim.", "錯誤匯流淹没主張。"),
      card("fluid", "流動的；流體", "未定型", "Keep categories fluid until coding stabilizes.", "編碼穩定前讓類別保持流動。"),
      card("influence", "影響", "流入作用", "Disclose funding influence on framing.", "揭露資助對框架的影響。", "story"),
      card("reflux", "回流", "流回來", "Policy reflux followed the failed pilot.", "失敗試點後政策回流。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "More than enough; unnecessary:", promptZh: "多餘：", choices: ["superfluous", "fluent", "flux", "affluent"], answer: "superfluous" },
      { id: "q2", type: "sense", promptEn: "Wealthy:", promptZh: "富裕：", choices: ["affluent", "effluent", "influx", "fluid"], answer: "affluent" },
      { id: "q3", type: "sense", promptEn: "Vary irregularly:", promptZh: "波動：", choices: ["fluctuate", "confluence", "mellifluous", "reflux"], answer: "fluctuate" },
    ],
  },
  {
    id: "root-fort-01", type: "root", elementLemma: "fort", priority: "B",
    titleZh: "fort｜要塞勇氣營", titleEn: "Fort Courage Camp",
    hook: "字根 fort＝強——要塞裡練的是力氣與運氣。",
    script: "fortify 加固；fortitude 堅忍力。fortuitous 偶然的強運；forte 強項。fortress 堡壘；fortification 防禦工事。effort 出力；comfort 給力安慰。",
    reviewHooks: ["fort＝強：fortify/fortitude/fortuitous/forte/fortress", "fortuitous＝偶然（非 fortunes 必定好運）"],
    pitfalls: ["fortuitous＝出於偶然，不保證「幸運是好事」", "forte＝專長／強項"],
    members: [
      card("fortify", "加固；強化", "加防衛", "Fortify claims with robustness checks.", "用穩健檢查加固主張。"),
      card("fortitude", "堅忍；剛毅", "內在強", "Replication work takes quiet fortitude.", "複現工作需要安靜的剛毅。"),
      card("fortuitous", "偶然的", "碰巧變強運", "A fortuitous sample is not a design.", "偶然樣本不是設計。"),
      card("forte", "強項；專長", "最擅長的力", "Transparency is this lab's forte.", "透明是這實驗室的強項。"),
      card("fortress", "要塞；堡壘", "硬殼營", "Do not turn your theory into an unfalsifiable fortress.", "別把理論建成不可證偽要塞。"),
      card("fortification", "防禦工事；強化", "加牆", "Method fortification includes preregistration.", "方法強化包含預註冊。"),
      card("effort", "努力；費力", "出力", "Report effort spent on data cleaning.", "報告花在資料清理的努力。", "story"),
      card("comfort", "安慰；舒適", "給力安撫", "Comfort with ambiguity marks mature science.", "能安於模糊標記成熟科學。", "story"),
      card("forceful", "有力的", "用力推", "Forceful claims need forceful evidence.", "有力主張需要有力證據。", "story"),
      card("enforce", "強制執行", "用强制力", "Enforce sharing policies consistently.", "一致地強制執行共享政策。", "story"),
      card("reinforce", "加強；增援", "再加一層力", "Negative results can reinforce theory bounds.", "陰性結果可加強理論邊界。", "story"),
      card("comforting", "令人安慰的", "安撫感", "A comforting narrative is not a proof.", "令人安慰的敘事不是證明。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Courage in pain; endurance:", promptZh: "堅忍：", choices: ["fortitude", "fortuitous", "forte", "fortress"], answer: "fortitude" },
      { id: "q2", type: "sense", promptEn: "Happening by chance:", promptZh: "偶然：", choices: ["fortuitous", "fortify", "enforce", "effort"], answer: "fortuitous" },
      { id: "q3", type: "sense", promptEn: "Strong point; specialty:", promptZh: "強項：", choices: ["forte", "fortress", "comfort", "flux"], answer: "forte" },
    ],
  },
  {
    id: "root-fus-01", type: "root", elementLemma: "fus", priority: "B",
    titleZh: "fus｜澆熔混合廠", titleEn: "Fus Pouring Plant",
    hook: "字根 fus＝澆、熔——工廠把東西澆在一起或澆散。",
    script: "infuse 注入；profuse 澆得過多。effusive 感情傾瀉；diffuse 擴散澆開。confuse 混澆搞糊；refuse 拒絕不收澆。suffuse 瀰漫；transfuse 輸注。fusion 熔合；infusion 浸泡注入。",
    reviewHooks: ["fus＝澆：infuse/profuse/effusive/diffuse/confuse", "profuse＝大量的"],
    pitfalls: ["diffuse 可作動詞擴散或形容詞冗散", "effusive＝溢於言表，常偏感情"],
    members: [
      card("infuse", "注入；灌輸", "澆進去", "Infuse humility into the discussion section.", "把謙遜注入討論段。"),
      card("profuse", "大量的；過多的", "澆太多", "Profuse acknowledgments cannot replace methods detail.", "大量誌謝不能取代方法細節。"),
      card("effusive", "感情洋溢的", "傾瀉感情", "Effusive praise in reviews can hide critique.", "洋溢讚美可能掩蓋批評。"),
      card("diffuse", "擴散；冗散的", "澆散開", "Diffuse aims produce unfocused papers.", "目標冗散產出失焦論文。"),
      card("confuse", "使混淆", "混澆糊掉", "Do not confuse significance with importance.", "不要把顯著性與重要性混淆。"),
      card("refuse", "拒絕", "不收這澆", "Refuse silent outcome switching.", "拒絕沉默更換結局變項。"),
      card("suffuse", "充滿；瀰漫", "澆滿氛圍", "Anxiety can suffuse a lab after a retraction.", "撤稿後焦慮可瀰漫實驗室。"),
      card("transfuse", "輸血；注入", "轉澆過去", "Transfuse lessons from failed trials into protocols.", "把失敗試驗教訓輸進規程。"),
      card("fusion", "熔合；融合", "熔成一塊", "Interdisciplinary fusion needs shared measures.", "跨領域融合需要共享測量。", "story"),
      card("infusion", "注入；浸泡液", "一輪注入", "An infusion of new coders needs training.", "新編碼員注入需要訓練。", "story"),
      card("refusal", "拒絕", "拒絕狀態", "Document refusal rates in surveys.", "記錄調查拒絕率。", "story"),
      card("confusion", "混亂；混淆", "混澆結果", "Category confusion inflates error bars.", "類別混淆膨脹誤差。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Abundant; plentiful:", promptZh: "大量的：", choices: ["profuse", "refuse", "fusion", "confuse"], answer: "profuse" },
      { id: "q2", type: "sense", promptEn: "Overflowing with emotion:", promptZh: "感情洋溢：", choices: ["effusive", "infuse", "suffuse", "transfuse"], answer: "effusive" },
      { id: "q3", type: "sense", promptEn: "Spread out; wordy/unfocused:", promptZh: "擴散／冗散：", choices: ["diffuse", "forte", "fortify", "levy"], answer: "diffuse" },
    ],
  },
  {
    id: "root-greg-01", type: "root", elementLemma: "greg", priority: "B",
    titleZh: "greg｜群聚牧場", titleEn: "Greg Herd Ranch",
    hook: "字根 greg＝群——牧場專管聚在一起或被分開。",
    script: "gregarious 愛群聚；congregate 聚集。segregate 隔離分群；aggregate 總合成群。egregious 糟到「出群」顯眼；congregation 會眾。desegregate 取消隔離。",
    reviewHooks: ["greg＝群：gregarious/congregate/segregate/aggregate/egregious", "egregious＝極壞（出群壞）"],
    pitfalls: ["egregious＝極壞／驚人地糟，不是「卓越」古義常用於現代貶義", "aggregate＝合計"],
    members: [
      card("gregarious", "合群的", "愛待在群裡", "Gregarious networking still needs quiet writing time.", "合群交際仍需安靜寫作時間。"),
      card("congregate", "聚集", "聚成一群", "Do not let p-hackers congregate around one metric.", "別讓 p 操弄者圍聚單一指標。"),
      card("segregate", "隔離；分開", "拆群隔離", "Segregate exploratory from confirmatory analyses.", "把探索與驗證分析隔離。"),
      card("aggregate", "合計；聚合體", "合成總群", "Report both aggregate and subgroup effects.", "同時報告總體與次群效應。"),
      card("egregious", "極壞的；過分的", "壞到出群", "Egregious selective reporting invites sanctions.", "過分選擇性報告招致處罰。"),
      card("congregation", "會眾；聚集", "一群人", "The congregation of stakeholders delayed the protocol.", "利害關係人聚集拖延規程。"),
      card("desegregate", "廢除隔離", "取消分群牆", "Desegregate methods training across departments.", "跨系廢除方法訓練隔離。"),
      card("aggregative", "聚合的", "往總量靠", "Aggregative indices can hide harm.", "聚合指標可能掩蓋傷害。", "story"),
      card("segregation", "隔離狀態", "分群狀態", "Outcome segregation by gender needs justification.", "依性別隔離結局需理由。", "story"),
      card("congregant", "會眾成員", "群裡一員", "Each congregant signed a conflict form.", "每位成員簽署利益衝突表。", "story"),
      card("egregiously", "極其過分地", "出群地糟", "The figure was egregiously cropped.", "圖被過分裁切。", "story"),
      card("gregariousness", "合群性", "愛群特質", "Gregariousness ≠ scientific rigor.", "合群性不等於科學嚴謹。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Outstandingly bad:", promptZh: "極壞／過分：", choices: ["egregious", "gregarious", "aggregate", "congregate"], answer: "egregious" },
      { id: "q2", type: "sense", promptEn: "Sociable; fond of company:", promptZh: "合群：", choices: ["gregarious", "segregate", "desegregate", "egregiously"], answer: "gregarious" },
      { id: "q3", type: "sense", promptEn: "Separate by group:", promptZh: "隔離分群：", choices: ["segregate", "aggregate", "congregation", "forte"], answer: "segregate" },
    ],
  },
  {
    id: "root-her-01", type: "root", elementLemma: "her/hes", priority: "B",
    titleZh: "her／hes｜黏著猶豫室", titleEn: "Adhere & Hesitate Room",
    hook: "字根 her/hes＝黏——要嘛黏住，要嘛猶豫不黏。",
    script: "adhere 黏附遵守；adhesive 黏著劑。coherent／cohesive 黏成一貫。inherent 內在黏著的本質。hesitate／hesitant 猶豫不黏定。incoherent 黏不起來。",
    reviewHooks: ["her＝黏：adhere/coherent/cohesive/inherent", "hesitate＝猶豫"],
    pitfalls: ["coherent（論理一貫）≠ cohesive（群體凝聚力）略有分工", "inherent＝固有"],
    members: [
      card("adhere", "遵守；黏附", "黏住規則", "Adhere to the preregistered plan.", "遵守預註冊計畫。"),
      card("adhesive", "黏著的；膠帶", "黏膠", "An adhesive label marked blinded samples.", "黏標標記盲樣。"),
      card("coherent", "連貫的；一致的", "黏成一條理", "Keep the causal story coherent.", "讓因果故事連貫。"),
      card("cohesive", "有凝聚力的", "黏成一團", "A cohesive team still needs dissent channels.", "有凝聚力的團隊仍需異議通道。"),
      card("inherent", "固有的；內在的", "天生黏在本質", "Noise is inherent in survey measures.", "噪音是調查測量固有的。"),
      card("hesitate", "猶豫", "不黏定", "Do not hesitate to report nulls.", "不要猶豫報告虛無結果。"),
      card("hesitant", "猶豫的", "黏不定", "Hesitant leadership delays corrections.", "猶豫領導拖延勘誤。"),
      card("incoherent", "不連貫的", "黏不起來", "Incoherent constructs fail validation.", "不連貫構念無法驗證。"),
      card("hesitation", "猶豫", "停一下", "Hesitation before submission beats rushed errors.", "投稿前猶豫勝過倉促錯誤。", "story"),
      card("adherence", "依從；黏附", "黏著程度", "Measure adherence to the intervention.", "測量介入依從度。", "story"),
      card("coherence", "連貫性", "黏合理度", "Check coherence across sections.", "檢查各節連貫性。", "story"),
      card("inherence", "內在性", "固有存在", "Do not treat preference as inherence.", "不要把偏好當固有本質。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Stick to; follow:", promptZh: "遵守／黏附：", choices: ["adhere", "hesitate", "diffuse", "refuse"], answer: "adhere" },
      { id: "q2", type: "sense", promptEn: "Built-in; essential:", promptZh: "固有：", choices: ["inherent", "adhesive", "hesitant", "profuse"], answer: "inherent" },
      { id: "q3", type: "sense", promptEn: "Logically consistent:", promptZh: "連貫一致：", choices: ["coherent", "egregious", "fortuitous", "effusive"], answer: "coherent" },
    ],
  },
  {
    id: "root-junct-01", type: "root", elementLemma: "junct", priority: "B",
    titleZh: "junct｜接點調度台", titleEn: "Juncture Switchboard",
    hook: "字根 junct＝連接——調度台專管接點與禁令。",
    script: "junction 交叉接點；juncture 關鍵時刻接點。conjunction 合取連接；disjunction 析取分開。injunction 禁制令；adjunct 附加連接物。subjugate 壓下去統治；conjunct 連接的。",
    reviewHooks: ["junct＝接：junction/juncture/conjunction/injunction/adjunct", "injunction＝禁制令"],
    pitfalls: ["juncture＝關鍵時刻／接點", "subjugate＝征服／使屈服"],
    members: [
      card("junction", "交叉點；接點", "線路交會", "At the junction of ethics and incentives, document both.", "在倫理與誘因接點，兩者都記錄。"),
      card("juncture", "時刻；接點", "關鍵接點", "This juncture calls for a registered report.", "此刻需要註冊報告。"),
      card("conjunction", "結合；連詞", "合在一起", "In conjunction with sensitivity checks, re-estimate.", "結合敏感度檢查再估計。"),
      card("disjunction", "分離；析取", "接不上", "Theory–data disjunction weakens the paper.", "理論與資料分離削弱論文。"),
      card("injunction", "禁制令；命令", "禁止連接某行為", "An injunction blocked further scraping.", "禁制令阻擋繼續爬取。"),
      card("adjunct", "附屬物；助理", "附加接上", "Treat a blog post as an adjunct, not primary evidence.", "部落格當附屬非主要證據。"),
      card("subjugate", "征服；使屈服", "壓接統治", "Do not subjugate methods to marketing.", "不要讓方法屈服於行銷。"),
      card("conjunct", "連接的；結合的", "接上的", "Conjunct hypotheses need joint tests.", "結合假說需要聯合檢定。"),
      card("injunctive", "禁令的；勸告的", "命令語氣", "Injunctive norms shape lab culture.", "勸告性規範形塑實驗室文化。", "story"),
      card("joined", "已連接", "接好了", "Joined datasets need linkage audits.", "已連接資料集需連結稽核。", "story"),
      card("rejoin", "再加入；回答", "重新接回", "Rejoin the consortium after fixing leaks.", "修補洩漏後再加入聯盟。", "story"),
      card("disjoint", "不相交的", "沒接上", "Use disjoint training and test sets.", "使用不相交訓練／測試集。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Critical moment; connection point:", promptZh: "關鍵時刻／接點：", choices: ["juncture", "adjunct", "refuse", "forte"], answer: "juncture" },
      { id: "q2", type: "sense", promptEn: "Court order to stop something:", promptZh: "禁制令：", choices: ["injunction", "conjunction", "junction", "conjunct"], answer: "injunction" },
      { id: "q3", type: "sense", promptEn: "Bring under control; conquer:", promptZh: "征服／使屈服：", choices: ["subjugate", "aggregate", "infuse", "adhere"], answer: "subjugate" },
    ],
  },
  {
    id: "root-lev-01", type: "root", elementLemma: "lev", priority: "B",
    titleZh: "lev｜舉重與輕浮吊車", titleEn: "Lev Crane Yard",
    hook: "字根 lev＝輕、舉——吊車專管舉起或減輕。",
    script: "alleviate 減輕；elevate 抬高。levity 輕浮；levy 徵收（抽起來）。leverage 槓桿用力；relevant／irrelevant 相關舉得上／舉不上。leaven 發酵舉起；lever 槓桿。",
    reviewHooks: ["lev＝舉／輕：alleviate/elevate/levity/levy/leverage", "levity＝輕浮不當嚴肅"],
    pitfalls: ["levy＝徵稅／徵收", "alleviate＝減輕（痛苦／問題）"],
    members: [
      card("alleviate", "減輕；緩和", "把重物舉輕一點", "Better measures alleviate some bias, not all.", "更好測量減輕部分偏差，非全部。"),
      card("elevate", "提升；抬高", "往上舉", "Elevate replication to equal status with novelty.", "把複現提升到與新奇同等地位。"),
      card("levity", "輕浮；不嚴肅", "太輕了", "Levity about fraud norms is dangerous.", "對造假規範輕浮很危險。"),
      card("levy", "徵收；課稅", "抽起來", "Levy a cost on undisclosed exclusions.", "對未揭露排除課以成本。"),
      card("leverage", "槓桿；利用", "用小力舉大", "Leverage open tools instead of proprietary black boxes.", "利用開放工具而非專有黑箱。"),
      card("relevant", "相關的", "舉得上題", "Keep only relevant covariates.", "只保留相關共變項。"),
      card("irrelevant", "不相干的", "舉不上題", "Drop irrelevant digressions from the intro.", "刪掉導論不相干離題。"),
      card("leaven", "發酵；使活躍", "輕輕舉起氣氛", "Curiosity can leaven a dry methods course.", "好奇心能使乾癟方法課發酵。"),
      card("lever", "槓桿", "撬棍", "A single noisy study is a weak lever for policy.", "單一嘈雜研究是弱政策槓桿。", "story"),
      card("elevation", "海拔；提升", "舉起高度", "Elevation of status should follow contribution.", "地位提升應跟隨貢獻。", "story"),
      card("relief", "減輕；救濟", "放下重擔感", "Public correction brings delayed relief.", "公開勘誤帶來延遲的解脫。", "story"),
      card("unrelieved", "未減輕的", "舉不掉的重", "Unrelieved ambiguity belongs in the limits section.", "未減輕的模糊屬於限制段。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Make less severe:", promptZh: "減輕：", choices: ["alleviate", "levy", "levity", "leaven"], answer: "alleviate" },
      { id: "q2", type: "sense", promptEn: "Lack of seriousness:", promptZh: "輕浮：", choices: ["levity", "elevate", "leverage", "relevant"], answer: "levity" },
      { id: "q3", type: "sense", promptEn: "Impose a tax or fee; collect:", promptZh: "徵收：", choices: ["levy", "lever", "relief", "forte"], answer: "levy" },
    ],
  },
  {
    id: "root-luc-01", type: "root", elementLemma: "luc/lum", priority: "B",
    titleZh: "luc／lum｜光源澄清室", titleEn: "Lucid Light Room",
    hook: "字根 luc/lum＝光——澄清室專管照亮與透光。（lucid 已在他族則跳過）",
    script: "elucidate 闡明照亮；pellucid 清澈透光。translucent 半透明；luminary 發光大人物。luminous 發光的；illuminate 照明。lackluster 無光澤；illustrious 輝煌。",
    reviewHooks: ["luc＝光：elucidate/pellucid/translucent/luminary/illuminate", "elucidate＝闡明"],
    pitfalls: ["pellucid＝極度清晰", "lackluster＝乏善可陳"],
    members: [
      card("elucidate", "闡明；說明", "把光打進去", "Elucidate the identification assumptions.", "闡明識別假設。"),
      card("pellucid", "清澈的；清晰的", "透到見底", "Write a pellucid abstract.", "寫清澈摘要。"),
      card("translucent", "半透明的", "透一點光", "Translucent reporting still hides key exclusions.", "半透明報告仍藏關鍵排除。"),
      card("luminary", "名人；發光體", "大燈人物", "Do not defer to luminaries without reading methods.", "別不讀方法就服從名人。"),
      card("luminous", "發光的；明亮的", "發亮", "A luminous figure cannot replace a table.", "明亮圖不能取代表格。"),
      card("illuminate", "照明；啟發", "開燈", "Examples illuminate abstract claims.", "例子照亮抽象主張。"),
      card("lackluster", "無光澤的；平庸的", "沒光", "Lackluster documentation slows replication.", "平庸文件拖延複現。"),
      card("illustrious", "傑出的；輝煌的", "光輝履歷", "Illustrious affiliations do not validate results.", "輝煌單位不驗證結果。"),
      card("illumination", "照明；啟發", "光照結果", "Seek illumination, not applause.", "追求啟發而非掌聲。", "story"),
      card("lucidity", "清晰；清醒", "清楚度", "Lucidity beats jargon density.", "清晰勝過術語密度。", "story"),
      card("relucent", "反光的", "反光", "Relucent metaphors can distract.", "反光隱喻可能分心。", "story"),
      card("luminescence", "冷光；發光", "自己發光", "Claim luminescence only with mechanisms.", "有機制才稱發光。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Make clear; explain:", promptZh: "闡明：", choices: ["elucidate", "levy", "segregate", "refuse"], answer: "elucidate" },
      { id: "q2", type: "sense", promptEn: "Crystal clear:", promptZh: "清澈清晰：", choices: ["pellucid", "lackluster", "egregious", "fortuitous"], answer: "pellucid" },
      { id: "q3", type: "sense", promptEn: "Dull; uninspired:", promptZh: "無光澤／平庸：", choices: ["lackluster", "luminous", "luminary", "illustrious"], answer: "lackluster" },
    ],
  },
  {
    id: "root-mort-01", type: "root", elementLemma: "mor/mort", priority: "B",
    titleZh: "mort｜生死登記處", titleEn: "Mort Registry",
    hook: "字根 mort＝死——登記處專管終點與瀕死。",
    script: "mortal／mortality 會死與死亡率。immortal 不死。mortify 使羞愧欲死；moribund 瀕死。mortgage 抵押（把未來押死）；postmortem 事後檢討；mortuary 停屍間。",
    reviewHooks: ["mort＝死：mortal/mortality/mortify/moribund/postmortem", "moribund＝瀕死／即將廢止"],
    pitfalls: ["mortify 常＝使羞愧，不只「殺死」", "postmortem＝事後檢討／屍檢"],
    members: [
      card("mortal", "終有一死的；致命的", "會死的", "Even famous theories are mortal.", "即使著名理論也會死。"),
      card("immortal", "不朽的", "不死", "No dataset is immortal without curation.", "沒有策展就沒有不朽資料集。"),
      card("mortality", "死亡率；必死性", "死亡度量", "Report mortality with risk intervals.", "報告死亡率請帶風險區間。"),
      card("mortify", "使羞愧；抑制", "羞到想死", "Errors should mortify ego, not hide.", "錯誤應讓自我羞愧，而非隱藏。"),
      card("moribund", "瀕死的；即將廢止的", "快死掉", "A moribund journal still holds archives.", "瀕死期刊仍有檔案。"),
      card("mortgage", "抵押；按揭", "押未來", "Do not mortgage rigor for speed.", "不要為速度抵押嚴謹。"),
      card("postmortem", "屍檢；事後檢討", "死後檢討", "Run a blameless postmortem on the failed launch.", "對失敗上線做無責事後檢討。"),
      card("mortuary", "停屍間；殯儀相關", "死後存放", "Treat retracted papers like a methods mortuary—learn, don't gossip.", "把撤稿當方法停屍間：學習勿八卦。"),
      card("immortality", "不朽", "不死狀態", "Seek immortality of methods, not of egos.", "追求方法不朽而非自我不朽。", "story"),
      card("mortician", "殯葬業者", "處理終點的人", "An editor can play mortician for dead claims.", "編輯可為死主張扮演殯葬者。", "story"),
      card("deathblow", "致命一擊", "打死一擊", "A failed replication can be a deathblow to hype.", "失敗複現可成炒作致命一擊。", "story"),
      card("rigor mortis", "屍僵", "死後僵硬", "Avoid rigor mortis in outdated protocols.", "避免過時規程像屍僵。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Near death; nearly obsolete:", promptZh: "瀕死／即將廢止：", choices: ["moribund", "mortal", "forte", "levity"], answer: "moribund" },
      { id: "q2", type: "sense", promptEn: "After-the-fact review:", promptZh: "事後檢討：", choices: ["postmortem", "mortgage", "mortuary", "immortal"], answer: "postmortem" },
      { id: "q3", type: "sense", promptEn: "Humiliate; shame deeply:", promptZh: "使羞愧：", choices: ["mortify", "mortality", "aggregate", "infuse"], answer: "mortify" },
    ],
  },
  {
    id: "root-nov-01", type: "root", elementLemma: "nov", priority: "B",
    titleZh: "nov｜新品發表會", titleEn: "Nov Novelty Launch",
    hook: "字根 nov＝新——發表會專管新東西與新手。",
    script: "novel／novelty 新奇。innovate／innovation 創新。renovate 翻新；novice 新手。innovative 創新的；nova 新星。",
    reviewHooks: ["nov＝新：novel/novelty/innovate/renovate/novice", "novelty 嗜好可能排擠複現"],
    pitfalls: ["novel 可作形容詞「新的」或名詞「小說」", "novice＝新手"],
    members: [
      card("novel", "新的；小說", "新玩意", "A novel measure needs validation.", "新測量需要驗證。"),
      card("novelty", "新奇", "新奇感", "Novelty bias crowds out replication.", "新奇偏差排擠複現。"),
      card("innovate", "創新", "做出新", "Innovate on sharing tools, not on hiding exclusions.", "在共享工具上創新，而非隱藏排除。"),
      card("innovation", "創新", "新成果", "Process innovation can cut error rates.", "流程創新能降低錯誤率。"),
      card("renovate", "翻新；修復", "把舊變新", "Renovate legacy code before scaling.", "擴張前先翻新舊程式碼。"),
      card("novice", "新手", "新人", "Novice analysts need checklists.", "新手分析者需要檢核表。"),
      card("innovative", "創新的", "有新意的", "Innovative visualization still needs axes labeled.", "創新視覺化仍需標軸。"),
      card("nova", "新星", "突然亮", "A media nova faded after critique.", "媒體新星在批評後黯淡。", "story"),
      card("novitiate", "見習期", "新手期", "Treat the first year as a novitiate in ethics.", "把第一年當倫理見習期。", "story"),
      card("nouveau", "新近的；暴發的", "新派", "Nouveau metrics need skeptical adoption.", "新派指標需懷疑地採用。", "story"),
      card("renew", "更新；恢復", "再變新", "Renew consent when protocols change.", "規程變更時更新同意。", "story"),
      card("renewal", "更新", "再新一輪", "License renewal triggered an audit.", "授權更新觸發稽核。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Beginner:", promptZh: "新手：", choices: ["novice", "nova", "novelty", "renovate"], answer: "novice" },
      { id: "q2", type: "sense", promptEn: "Restore to good condition; modernize:", promptZh: "翻新：", choices: ["renovate", "mortify", "segregate", "levy"], answer: "renovate" },
      { id: "q3", type: "sense", promptEn: "Newness; something new:", promptZh: "新奇：", choices: ["novelty", "mortality", "juncture", "adjunct"], answer: "novelty" },
    ],
  },
  {
    id: "root-pot-01", type: "root", elementLemma: "pot", priority: "B",
    titleZh: "pot｜能量電位室", titleEn: "Pot Power Chamber",
    hook: "字根 pot＝能、力——電位室量誰有力、誰無力。",
    script: "potent 有力；impotent 無力。potential／potency 潛力與效力。omnipotent 全能；potentate 掌權者。plenipotentiary 全權代表。",
    reviewHooks: ["pot＝能：potent/impotent/potential/potency/omnipotent/potentate", "potent＝強效"],
    pitfalls: ["impotent＝無力／無效，語境可敏感但 GRE 常指無力", "potentate＝統治者"],
    members: [
      card("potent", "強有力的；強效的", "有力", "A potent design still needs honest reporting.", "強效設計仍需誠實報告。"),
      card("impotent", "無力的；無效的", "沒力", "Unenforced policies are impotent.", "不執行的政策無力。"),
      card("potential", "潛力；潛在的", "還沒爆發的力", "State the potential for harm explicitly.", "明確陳述潛在傷害。"),
      card("potency", "效力；能力", "力道", "Estimate the potency of the intervention.", "估計介入效力。"),
      card("omnipotent", "全能的", "什麼都能", "No statistician is omnipotent across designs.", "沒有統計學家跨設計全能。"),
      card("potentate", "統治者；掌權者", "握力的人", "Do not let a single potentate gatekeep methods.", "別讓單一掌權者把關方法。"),
      card("plenipotentiary", "全權代表", "帶滿權力", "A plenipotentiary negotiator still needs counsel.", "全權談判者仍需顧問。"),
      card("potentiality", "潛能", "可能之力", "Map potentiality before claiming inevitability.", "宣稱必然前先畫潛能。", "story"),
      card("empower", "賦權", "給力", "Empower juniors to halt unsafe protocols.", "賦權資淺者叫停不安全規程。", "story"),
      card("powerful", "強大的", "力大", "Powerful computers do not excuse weak theory.", "強大電腦不恕弱理論。", "story"),
      card("powerless", "無力的", "沒權力", "Whistleblowers can feel powerless without policy.", "無政策時吹哨者可感無力。", "story"),
      card("omnipotence", "全能", "全能狀態", "Reject fantasies of methodological omnipotence.", "拒絕方法全能幻想。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Powerful; effective:", promptZh: "強有力：", choices: ["potent", "novice", "levity", "diffuse"], answer: "potent" },
      { id: "q2", type: "sense", promptEn: "Ruler; powerful person:", promptZh: "掌權者：", choices: ["potentate", "potency", "adjunct", "forte"], answer: "potentate" },
      { id: "q3", type: "sense", promptEn: "All-powerful:", promptZh: "全能：", choices: ["omnipotent", "impotent", "renovate", "gregarious"], answer: "omnipotent" },
    ],
  },
  {
    id: "root-punct-01", type: "root", elementLemma: "punct", priority: "B",
    titleZh: "punct｜刺點禮儀所", titleEn: "Punct Point Studio",
    hook: "字根 punct＝點、刺——禮儀所專管準點與刺痛良心。",
    script: "punctual 準點；puncture 刺破。punctilious 對細節一絲不苟；compunction 良心刺痛。punctuate 加標點／強調；punctuation 標點。acupuncture 針刺。",
    reviewHooks: ["punct＝點刺：punctual/puncture/punctilious/compunction/punctuate", "compunction＝內疚"],
    pitfalls: ["punctilious＝拘泥細節禮數", "compunction＝良心不安"],
    members: [
      card("punctual", "準時的", "對準點", "Be punctual with correction notices.", "勘誤通知要準時。"),
      card("puncture", "刺穿；刺破", "刺一個洞", "One leak can puncture a privacy plan.", "一次洩漏可刺破隱私計畫。"),
      card("punctilious", "一絲不苟的", "對點超認真", "Punctilious citation prevents ghost references.", "一絲不苟引用防止幽靈文獻。"),
      card("compunction", "內疚；良心不安", "良心被刺", "Feel compunction about quiet exclusions.", "對沉默排除感到內疚。"),
      card("punctuate", "加標點；強調", "點一下強調", "Punctuate limitations clearly.", "清楚強調限制。"),
      card("punctuation", "標點符號", "點的系統", "Bad punctuation can scramble claims.", "糟糕標點會打亂主張。"),
      card("acupuncture", "針灸", "針刺療法", "Think of audits as methodological acupuncture—precise, not theatrical.", "把稽核當方法針灸：精準不作秀。", "story"),
      card("pointed", "尖銳的；指向的", "有尖點", "Ask pointed questions about missingness.", "對缺失問尖銳問題。", "story"),
      card("pointless", "無意義的", "沒點", "Pointless metrics waste cohorts.", "無意義指標浪費世代。", "story"),
      card("appoint", "任命；約定", "指定一個點", "Appoint an independent data steward.", "任命獨立資料管家。", "story"),
      card("disappoint", "使失望", "點期待落空", "Overclaiming will disappoint readers later.", "過度宣稱稍後令讀者失望。", "story"),
      card("counterpoint", "對位；對比觀點", "對點", "Offer a counterpoint in the discussion.", "在討論提供對位觀點。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Guilt; twinge of conscience:", promptZh: "內疚：", choices: ["compunction", "puncture", "forte", "novice"], answer: "compunction" },
      { id: "q2", type: "sense", promptEn: "Attentive to fine points of etiquette/detail:", promptZh: "一絲不苟：", choices: ["punctilious", "punctual", "potent", "moribund"], answer: "punctilious" },
      { id: "q3", type: "sense", promptEn: "Pierce; deflate:", promptZh: "刺破：", choices: ["puncture", "punctuate", "alleviate", "segregate"], answer: "puncture" },
    ],
  },
  {
    id: "prefix-de-01", type: "prefix", elementLemma: "de-", priority: "A",
    titleZh: "de-｜向下拆除隊", titleEn: "De- Demolition Crew",
    hook: "字首 de-＝向下／去除——拆除隊專管往下拆、貶、耗。",
    script: "debase 貶低品質；deplete 耗盡。deride 嘲笑；desecrate 褻瀆。deflect 偏轉；despondent 消沉。debunk 拆穿；defame 誹謗。denounce 公開譴責。",
    reviewHooks: ["de-＝向下：debase/deplete/deride/desecrate/deflect/debunk", "despondent＝沮喪"],
    pitfalls: ["debase＝貶低價值／品質", "debunk＝揭穿謬誤"],
    members: [
      card("debase", "貶低；使變劣", "往下貶質", "Do not debase peer review into scoreboard theater.", "別把同儕審查貶成計分秀。"),
      card("deplete", "耗盡；用盡", "抽光", "Underpowered designs deplete trust.", "低檢定力設計耗盡信任。"),
      card("deride", "嘲笑；嘲弄", "往下笑人", "Deride ideas, not people—then still check the math.", "嘲弄想法而非人身——但仍核對數學。"),
      card("desecrate", "褻瀆", "玷污神聖", "Desecrate open science by gaming badges.", "用刷徽章褻瀆開放科學。"),
      card("deflect", "偏轉；轉移", "打歪", "Do not deflect critique with credentials.", "不要用資歷轉移批評。"),
      card("despondent", "沮喪的", "情緒向下", "A despondent team still owes accurate logs.", "沮喪團隊仍欠準確日誌。"),
      card("debunk", "揭穿；拆穿", "拆假", "Debunk myths with registered replications.", "用註冊複現揭穿迷思。"),
      card("defame", "誹謗", "往下抹名", "Do not defame whistleblowers.", "不要誹謗吹哨者。"),
      card("denounce", "譴責；告發", "公開往下批", "Denounce fabricated figures publicly.", "公開譴責偽造圖。", "story"),
      card("depress", "壓低；使沮喪", "往下壓", "Missing data can depress estimated effects.", "缺失資料可能壓低估計效應。", "story"),
      card("devalue", "貶值", "降低價值", "Hidden exclusions devalue a dataset.", "隱藏排除貶低資料集。", "story"),
      card("demote", "降級", "往下調職", "Demote flashy claims lacking checks.", "把缺檢查的炫目主張降級。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Use up; exhaust:", promptZh: "耗盡：", choices: ["deplete", "deride", "deflect", "forte"], answer: "deplete" },
      { id: "q2", type: "sense", promptEn: "Expose as false:", promptZh: "揭穿：", choices: ["debunk", "debase", "despondent", "levy"], answer: "debunk" },
      { id: "q3", type: "sense", promptEn: "Ridicule; mock:", promptZh: "嘲笑：", choices: ["deride", "adhere", "infuse", "renovate"], answer: "deride" },
    ],
  },
  {
    id: "prefix-ex-01", type: "prefix", elementLemma: "ex-/e-", priority: "A",
    titleZh: "ex-｜向外排放閘", titleEn: "Ex- Outflow Gate",
    hook: "字首 ex-/e-＝向外——排放閘專管放出、加重、洗清。",
    script: "exacerbate 向外加重惡化；exonerate／exculpate 向外洗清罪責。excerpt 摘出；exorbitant 軌道外＝過分。extol 向外讚揚；exude 滲出。excise 切除；exalt 抬高颂揚。",
    reviewHooks: ["ex-＝外：exacerbate/exonerate/exculpate/excerpt/exorbitant/extol", "exacerbate＝惡化"],
    pitfalls: ["exonerate≈exculpate＝免罪", "exorbitant＝過分昂貴／過度"],
    members: [
      card("exacerbate", "加重；惡化", "往外弄更糟", "Hype can exacerbate mistrust.", "炒作會加重不信任。"),
      card("exonerate", "免罪；證明無罪", "洗清放出", "New data can exonerate a dismissed hypothesis.", "新資料可為被棄假說免罪。"),
      card("exculpate", "開脫；證明無罪", "卸責放出", "A checklist does not exculpate fraud.", "檢核表不開脫造假。"),
      card("excerpt", "摘錄", "抽出一段", "Quote the excerpt in context.", "摘錄要帶語境。"),
      card("exorbitant", "過分的；昂貴過頭", "軌道外", "Exorbitant APC fees block equity.", "過分高的開放費阻礙公平。"),
      card("extol", "讚揚", "向外歌頌", "Extol rigor more than brand names.", "讚揚嚴謹勝過品牌名。"),
      card("exude", "滲出；散發", "往外滲", "Confidence should not exude from thin evidence.", "信心不該從薄弱證據滲出。"),
      card("excise", "切除；刪除", "割掉取出", "Excise speculative claims from the abstract.", "從摘要切除臆測主張。"),
      card("exalt", "提升；頌揚", "抬高向外", "Do not exalt p<.05 as truth.", "不要把 p<.05 頌揚成真理。", "story"),
      card("expunge", "刪除；抹去", "擦掉放出", "Expunge identifiers before sharing.", "共享前抹去識別資訊。", "story"),
      card("expel", "驅逐；排出", "趕出去", "Expel duplicates from the analytic sample carefully.", "小心從分析樣本驅逐重複。", "story"),
      card("externalize", "外化", "推到外面", "Do not externalize blame for sloppy logs.", "不要把草率日誌的責任外化。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Make worse:", promptZh: "加重惡化：", choices: ["exacerbate", "exonerate", "excerpt", "extol"], answer: "exacerbate" },
      { id: "q2", type: "sense", promptEn: "Clear from blame:", promptZh: "免罪：", choices: ["exonerate", "exorbitant", "exude", "excise"], answer: "exonerate" },
      { id: "q3", type: "sense", promptEn: "Unreasonably high:", promptZh: "過分：", choices: ["exorbitant", "pellucid", "gregarious", "novice"], answer: "exorbitant" },
    ],
  },
  {
    id: "prefix-in-01", type: "prefix", elementLemma: "in-/im-", priority: "A",
    titleZh: "in-｜進入／否定雙門", titleEn: "In- Double Door",
    hook: "字首 in-/im-＝進入或否定——同一門兩種用法，靠詞義裁定。",
    script: "進入向：infiltrate 滲入，innate 天生內在，insurgent 起事攻入，inhibit 抑制住。否定向：insipid 無味，inane 空洞，indigent 貧乏，inert 惰性，infamy 惡名。incisive 切入銳利。",
    reviewHooks: ["in- 可＝進入或否定：innate/infiltrate vs insipid/inane/inert", "incisive＝鋭利深刻"],
    pitfalls: ["同一字首兩義，不可死記單一中文", "indigent＝貧窮"],
    members: [
      card("infiltrate", "滲透；滲入", "溜進去", "Bias can infiltrate convenience samples.", "偏差可滲入便利樣本。"),
      card("innate", "天生的；固有的", "內建進入", "Do not treat preference as innate destiny.", "不要把偏好當天生命運。"),
      card("insipid", "無味的；無聊的", "否定味道", "Insipid summaries omit effect sizes.", "無味摘要省略效應量。"),
      card("insurgent", "叛亂者；起義的", "攻入體制", "Insurgent methods groups pushed open data.", "起義方法團體推動開放資料。"),
      card("inane", "空洞的；愚蠢的", "否定內容", "Inane slogans are not theories.", "空洞口號不是理論。"),
      card("incisive", "鋭利的；深刻的", "切入", "Incisive critique improves designs.", "鋭利批評改進設計。"),
      card("indigent", "貧窮的", "否定財富", "Waive fees for indigent authors.", "為貧窮作者減免費用。"),
      card("inert", "惰性的；不活動的", "動不起來", "Inert repositories collect dust.", "惰性儲庫積灰。"),
      card("infamy", "惡名；醜聞", "否定名聲", "Fabrication brings lasting infamy.", "捏造帶來長久惡名。"),
      card("inhibit", "抑制；阻止", "壓住進入", "Fear can inhibit error reporting.", "恐懼會抑制錯誤回報。"),
      card("ingress", "進入", "入口", "Control physical ingress to the server room.", "控制機房實體進入。", "story"),
      card("inclusive", "包容的", "納入", "Use inclusive language in consent forms.", "知情同意用包容語言。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Dull; lacking flavor or interest:", promptZh: "無味：", choices: ["insipid", "innate", "incisive", "potent"], answer: "insipid" },
      { id: "q2", type: "sense", promptEn: "Poor; needy:", promptZh: "貧窮：", choices: ["indigent", "inert", "infamy", "forte"], answer: "indigent" },
      { id: "q3", type: "sense", promptEn: "Sharp; penetrating:", promptZh: "鋭利深刻：", choices: ["incisive", "inane", "infiltrate", "levy"], answer: "incisive" },
    ],
  },
  {
    id: "prefix-ob-01", type: "prefix", elementLemma: "ob-", priority: "A",
    titleZh: "ob-｜迎面阻礙閘", titleEn: "Ob- Obstacle Gate",
    hook: "字首 ob-＝迎向／反對——阻礙閘專管擋路與消除。",
    script: "obtrusive 礙眼突出；obliterate 抹掉。obligatory 義務擋路必做；oblique 斜迎不直說。obstinate 固執擋；obviate 預先排除障礙。obnoxious 討人厭擋臉；obstinate 再擋一次。",
    reviewHooks: ["ob-＝迎／阻：obtrusive/obliterate/obligatory/oblique/obstinate/obviate", "obviate＝使不必要"],
    pitfalls: ["obviate＝排除需要／使不必做", "oblique＝間接／斜的"],
    members: [
      card("obtrusive", "突出礙眼的；強加的", "擋在眼前", "Watermarks should not be obtrusive on figures.", "浮水印不該在圖上礙眼。"),
      card("obliterate", "塗抹；消滅", "迎面抹掉", "Do not obliterate raw logs after analysis.", "分析後不要抹掉原始日誌。"),
      card("obligatory", "義務的；必須的", "擋路必過", "Conflict disclosure is obligatory.", "利益衝突揭露是義務。"),
      card("oblique", "斜的；間接的", "斜著迎", "Oblique criticism still needs examples.", "間接批評仍需例子。"),
      card("obstinate", "固執的", "硬擋不讓", "Obstinate refusal to share code blocks audit.", "固執拒共享程式碼阻擋稽核。"),
      card("obviate", "排除；使不必要", "先把障礙搬走", "Checklists obviate some recurring errors.", "檢核表排除部分反覆錯誤。"),
      card("obnoxious", "討厭的；可憎的", "擋臉惹人厭", "Obnoxious tone sinks valid critique.", "討厭語氣毁掉有效批評。"),
      card("obstacle", "障礙", "擋路物", "Paywalls remain an access obstacle.", "付費牆仍是近用障礙。", "story"),
      card("obstruct", "阻礙", "堵住", "Do not obstruct independent reanalysis.", "不要阻礙獨立再分析。", "story"),
      card("obscure", "模糊；晦澀", "擋光看不清", "Obscure prose hides weak claims.", "晦澀文風掩蓋弱主張。", "story"),
      card("obsess", "使著迷", "擋心不放", "Do not obsess over a single cutoff.", "不要執迷單一門檻。", "story"),
      card("obligation", "義務", "必須扛", "Sharing is an obligation, not a favor.", "共享是義務不是人情。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Make unnecessary; remove a need:", promptZh: "使不必要／排除：", choices: ["obviate", "obtrusive", "obnoxious", "novice"], answer: "obviate" },
      { id: "q2", type: "sense", promptEn: "Stubborn:", promptZh: "固執：", choices: ["obstinate", "obligatory", "excerpt", "pellucid"], answer: "obstinate" },
      { id: "q3", type: "sense", promptEn: "Wipe out; destroy completely:", promptZh: "消滅／抹掉：", choices: ["obliterate", "oblique", "fortuitous", "gregarious"], answer: "obliterate" },
    ],
  },
  {
    id: "sem-brief-01", type: "semantic", elementLemma: "brief-vs-verbose", priority: "B",
    titleZh: "簡潔↔冗長｜對打擂台", titleEn: "Brief vs Verbose Duel",
    hook: "語義對打：短而準 vs 又長又散——寫作語氣高頻考。",
    script: "簡潔隊：succinct／terse／pithy／curt／compact／brevity／concise。冗長隊：prolix／wordy／voluble／rambling／diffuse（冗散）。口令：能短則短，短要保義。",
    reviewHooks: ["簡潔：succinct/terse/pithy/curt/brevity", "冗長：prolix/wordy/voluble/rambling"],
    pitfalls: ["terse 可能偏「簡到冷」", "prolix＝冗長乏味"],
    members: [
      card("succinct", "簡潔的", "短而準", "Write a succinct limitations list.", "寫簡潔限制清單。", "contrast"),
      card("terse", "簡短的；簡慢的", "短到俐落", "A terse rebuttal can still be fair.", "簡短反駁仍可公平。", "contrast"),
      card("pithy", "精煉的；簡潔有力的", "有髓短句", "A pithy takeaway beats a paragraph of haze.", "精煉重點勝過一段霧。", "contrast"),
      card("curt", "簡慢的；簡短的", "短到冷", "Curt emails escalate conflict.", "簡慢郵件升級衝突。", "contrast"),
      card("compact", "緊密的；簡潔的", "壓實", "Keep the model statement compact.", "模型陳述保持緊密。", "contrast"),
      card("brevity", "簡潔；短暫", "短本身", "Brevity is a courtesy to reviewers.", "簡潔是對審稿人的禮貌。", "contrast"),
      card("concise", "簡明的", "不囉唆", "Be concise without deleting assumptions.", "簡明但不要刪假設。", "contrast"),
      card("prolix", "冗長的", "又長又散", "Prolix methods hide the actual procedure.", "冗長方法掩蓋實際程序。", "contrast"),
      card("wordy", "囉唆的", "字太多", "Wordy intros delay the research question.", "囉唆導論拖延研究問題。", "contrast"),
      card("voluble", "健談的；喋喋不休的", "話流不停", "Voluble presenters still need a slide of limits.", "健談講者仍需一頁限制。", "contrast"),
      card("rambling", "漫談的；東拉西扯的", "跑題長聊", "Cut rambling digressions before submission.", "投稿前刪掉東拉西扯。", "contrast"),
      card("long-winded", "冗長的", "風很長", "Long-winded justifications signal weak design.", "冗長辯解暗示弱設計。", "contrast"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Brief and clearly expressed:", promptZh: "簡潔：", choices: ["succinct", "prolix", "rambling", "wordy"], answer: "succinct" },
      { id: "q2", type: "sense", promptEn: "Tediously long:", promptZh: "冗長：", choices: ["prolix", "pithy", "curt", "compact"], answer: "prolix" },
      { id: "q3", type: "sense", promptEn: "Shortness of expression:", promptZh: "簡潔（名詞）：", choices: ["brevity", "infamy", "potency", "juncture"], answer: "brevity" },
    ],
  },
  {
    id: "sem-rigid-01", type: "semantic", elementLemma: "rigid-vs-flexible", priority: "B",
    titleZh: "僵固↔彈性｜對打擂台", titleEn: "Rigid vs Flexible Duel",
    hook: "語義對打：僵硬不彎 vs 可塑可彎——人格與制度語氣都考。",
    script: "僵固隊：rigid／inflexible／adamant／obdurate／intransigent。彈性隊：pliable／malleable／supple／yielding／elastic／flexible。記：協議要「剛夠清楚」，方法要「柔能修正」。",
    reviewHooks: ["僵：rigid/adamant/obdurate/intransigent", "柔：pliable/malleable/supple/yielding"],
    pitfalls: ["obdurate／intransigent＝頑固難勸", "malleable＝可塑"],
    members: [
      card("rigid", "僵硬的；嚴格的", "不彎", "Rigid prereg is good; rigid denial of error is not.", "僵硬預註冊好；僵硬否認錯誤不好。", "contrast"),
      card("inflexible", "不知變通的", "彎不了", "Inflexible journals delay corrections.", "不知變通的期刊拖延勘誤。", "contrast"),
      card("adamant", "堅決的；固執的", "硬如鑽石", "Stay adamant about data integrity.", "對資料誠信要堅決。", "contrast"),
      card("obdurate", "執迷不悟的", "硬心腸", "Obdurate refusal to share blocks science.", "執迷拒共享阻擋科學。", "contrast"),
      card("intransigent", "不妥協的", "談不攏", "Intransigent positions stall consortia.", "不妥協立場拖延聯盟。", "contrast"),
      card("pliable", "柔韌的；易受影響的", "可彎", "Pliable criteria invite p-hacking.", "柔韌到亂的標準誘發 p 操弄。", "contrast"),
      card("malleable", "可塑的", "可锤打成形", "Constructs are malleable—define them.", "構念可塑——請定義。", "contrast"),
      card("supple", "柔軟的；靈活的", "柔而有力", "Supple designs adapt without cheating.", "靈活設計能適應而不作弊。", "contrast"),
      card("yielding", "屈服的；柔軟的", "讓得動", "Yielding to evidence is a virtue.", "向證據屈服是美德。", "contrast"),
      card("elastic", "有彈性的", "拉得回", "Keep timelines elastic for audits.", "為稽核保留彈性時程。", "contrast"),
      card("flexible", "靈活的", "可調整", "Flexible analysis plans must be declared.", "靈活分析計畫必須事先聲明。", "contrast"),
      card("adaptable", "能適應的", "調得動", "Adaptable teams version their protocols.", "能適應的團隊為規程做版本。", "contrast"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Refusing to change/compromise:", promptZh: "不妥協：", choices: ["intransigent", "pliable", "supple", "elastic"], answer: "intransigent" },
      { id: "q2", type: "sense", promptEn: "Capable of being shaped:", promptZh: "可塑：", choices: ["malleable", "obdurate", "adamant", "rigid"], answer: "malleable" },
      { id: "q3", type: "sense", promptEn: "Stubbornly persistent in wrong:", promptZh: "執迷不悟：", choices: ["obdurate", "yielding", "flexible", "pithy"], answer: "obdurate" },
    ],
  },
  {
    id: "rhyme-ude-01", type: "rhyme", elementLemma: "-ude", priority: "B",
    titleZh: "ude｜質地抽象館", titleEn: "The -ude Quality Hall",
    hook: "押韻／字尾族 -ude：抽象「質地／程度」名詞館。",
    script: "latitude 緯度／自由度；magnitude 量級。multitude 大量；solitude 獨處。platitude 陳腔；exactitude 精確。aptitude 資質；gratitude 感激。altitude 高度；attitude 態度。",
    reviewHooks: ["-ude：latitude/magnitude/platitude/exactitude/solitude", "platitude＝陳詞濫調"],
    pitfalls: ["latitude 可指地理緯度或行動餘地", "platitude≠ gratitude"],
    members: [
      card("latitude", "緯度；自由餘地", "活動空間", "Give analysts latitude within a prereg envelope.", "在預註冊信封內給分析者餘地。", "phonetic"),
      card("magnitude", "量級；重大", "有多大", "Report effect magnitude, not stars alone.", "報告效應量級，不只星號。", "phonetic"),
      card("multitude", "大量；群眾", "很多", "A multitude of tests needs correction.", "大量檢定需要校正。", "phonetic"),
      card("solitude", "獨處；孤獨", "一個人", "Protect solitude for careful writing.", "保護獨處以仔細寫作。", "phonetic"),
      card("platitude", "陳腔濫調", "空話質地", "Replace platitudes with operational definitions.", "用操作型定義取代陳腔。", "phonetic"),
      card("exactitude", "精確", "準到點", "Exactitude in timestamps prevents disputes.", "時間戳精確避免爭議。", "phonetic"),
      card("aptitude", "資質；才能", "適合度", "Aptitude tests still need fairness audits.", "性向測驗仍需公平稽核。", "phonetic"),
      card("gratitude", "感激", "感謝質地", "Gratitude notes belong in acknowledgments, not methods.", "感謝放誌謝不放方法。", "phonetic"),
      card("altitude", "海拔；高度", "多高", "At this altitude of claim, demand stronger ID.", "主張到這高度，要求更強識別。", "phonetic"),
      card("attitude", "態度", "心態質地", "An open attitude to critique speeds repair.", "對批評的開放態度加速修復。", "phonetic"),
      card("fortitude", "堅忍", "剛毅質地", "Fortitude sustains multi-year replications.", "剛毅支撐多年複現。", "story"),
      card("decrepitude", "衰老；老舊殘破", "破舊質地", "Software decrepitude is a security risk.", "軟體老舊殘破是資安風險。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Trite remark; cliché:", promptZh: "陳腔濫調：", choices: ["platitude", "magnitude", "solitude", "aptitude"], answer: "platitude" },
      { id: "q2", type: "sense", promptEn: "Size; extent; importance:", promptZh: "量級：", choices: ["magnitude", "latitude", "gratitude", "curt"], answer: "magnitude" },
      { id: "q3", type: "sense", promptEn: "Freedom of action; leeway:", promptZh: "餘地／自由度：", choices: ["latitude", "multitude", "altitude", "prolix"], answer: "latitude" },
    ],
  },
  {
    id: "rhyme-spir-01", type: "rhyme", elementLemma: "-spir", priority: "B",
    titleZh: "spir｜呼吸志向館", titleEn: "The -spir Breath Hall",
    hook: "字根／押韻 spir＝呼吸——志向與密謀都在換氣。",
    script: "aspire 向上吸氣立志；inspire 注入靈感氣息。conspire 一起暗中換氣密謀；transpire 透露／發生。perspire 出汗；respire 呼吸。spirited 有勁；dispirited 洩氣；aspiration 志向。",
    reviewHooks: ["spir＝呼吸：aspire/inspire/conspire/transpire/perspire", "conspire＝密謀"],
    pitfalls: ["transpire 可＝發生或透露", "aspire to＝渴望達成"],
    members: [
      card("aspire", "渴望；立志", "向上吸氣", "Aspire to cumulative science, not one-hit wonders.", "立志累積科學，非一次性奇蹟。", "phonetic"),
      card("inspire", "啟發；鼓舞", "把氣注入", "Open tools inspire better habits.", "開放工具啟發更好習慣。", "phonetic"),
      card("conspire", "密謀；共同導致", "一起暗中換氣", "Incentives can conspire against sharing.", "誘因可能共同不利共享。", "phonetic"),
      card("transpire", "發生；透露", "氣透出來", "What transpired in the lab meeting must be logged.", "實驗室會議發生何事必須記錄。", "phonetic"),
      card("perspire", "出汗", "汗氣出來", "Presenters perspire when asked for raw data.", "被要求原始資料時講者流汗。", "phonetic"),
      card("respire", "呼吸", "換氣", "Teams need time to respire between grant cycles.", "團隊在補助週期間需要換氣。", "phonetic"),
      card("spirited", "活躍的；勇敢的", "有氣勁", "A spirited debate clarified constructs.", "活躍辯論釐清構念。", "phonetic"),
      card("dispirited", "沮喪的；洩氣的", "沒氣了", "Dispirited students still deserve honest mentorship.", "洩氣學生仍值得誠實指導。", "phonetic"),
      card("aspiration", "志向；抽吸", "想吸到的高度", "State career aspirations without overclaiming papers.", "談職涯志向但不過度宣稱論文。", "phonetic"),
      card("conspiracy", "陰謀", "密謀團", "There was no conspiracy—only missing docs.", "沒有陰謀——只有缺文件。", "story"),
      card("inspiration", "靈感", "吸進的氣", "Inspiration is not a methods section.", "靈感不是方法段。", "story"),
      card("respiratory", "呼吸的", "呼吸系統", "Treat lab burnout like a respiratory hazard—ventilate culture.", "把過勞當呼吸危害：通風文化。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Aim high; seek to attain:", promptZh: "立志／渴望：", choices: ["aspire", "perspire", "respire", "curt"], answer: "aspire" },
      { id: "q2", type: "sense", promptEn: "Plot together; jointly cause:", promptZh: "密謀／共同導致：", choices: ["conspire", "inspire", "spirited", "succinct"], answer: "conspire" },
      { id: "q3", type: "sense", promptEn: "Become known; happen:", promptZh: "透露／發生：", choices: ["transpire", "puncture", "deplete", "novice"], answer: "transpire" },
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
  `${JSON.stringify({ version: "v0.6-p1b02", total: lessonIndex.length, lessons: lessonIndex }, null, 2)}\n`,
);

const unique = new Set();
for (const c of allClusters) for (const m of c.members || []) unique.add(m.headword);

fs.writeFileSync(
  path.join(humorDir, "index.json"),
  `${JSON.stringify(
    {
      version: "v0.6-p1b02",
      status: "p1-batch02",
      uniqueWords: unique.size,
      clusters: allClusters.map((c) => ({
        id: c.id,
        type: c.type,
        titleZh: c.titleZh,
        priority: c.priority || "B",
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
  const first = needle.split("/")[0].replace(/^-/, "");
  const el2 = elementsDoc.elements.find((e) => {
    const lem = String(e.lemma || "").toLowerCase();
    return lem.includes(first) || first.includes(lem.replace(/^-/, "").split("/")[0]);
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
  stage: STAGE,
  written: written.length,
  writtenDetail: written,
  blocked,
  totalClusters: allClusters.length,
  uniqueWords: unique.size,
  gapTo1000: Math.max(0, 1000 - unique.size),
  gapTo4000: Math.max(0, 4000 - unique.size),
  p1TargetMet: unique.size >= 1000,
};
fs.writeFileSync(
  path.join(humorDir, "P1-BATCH02-REPORT.md"),
  `# P1-batch02 完成報告

| 指標 | 數值 |
|------|------|
| 本批寫入家族 | ${written.length} |
| 總家族 | ${allClusters.length} |
| 獨特幽默詞 | ${unique.size} |
| P1 目標 1,000 | ${report.p1TargetMet ? "✅ 達成" : `距 ${report.gapTo1000}`} |
| 距總目標 4,000 | ${report.gapTo4000} |

## 本批家族
${written.map((w) => `- \`${w.id}\`（${w.n} 詞）`).join("\n")}

${blocked.length ? `## 未寫入\n${blocked.map((b) => `- ${b.id}: ${b.issues.join(", ")} (members=${b.members})`).join("\n")}` : ""}
`,
);

console.log(JSON.stringify(report, null, 2));
