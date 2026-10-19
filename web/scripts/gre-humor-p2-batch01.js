/**
 * P2-batch01: ~20 B-level clusters with humor-first scripts.
 * Run AFTER gre-humor-p2-pending.js
 * node web/scripts/gre-humor-p2-batch01.js
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
const STAGE = "P2-batch01";

const NEW = [
  {
    id: "root-phil-01", type: "root", elementLemma: "phil", priority: "B",
    titleZh: "phil｜愛心粉絲後援會", titleEn: "Phil Fan Club",
    hook: "字根 phil＝愛——後援會專管「愛到 dedic ate」的各種粉絲。",
    script:
      "哲學系社長 philosophy 愛智慧愛到睡不著；philately 郵迷把郵票當戀人。bibliophile 抱著書睡，cinephile 抱著片子哭，technophile 抱著新gadget笑。philanthropy／philanthropist 愛人類到願意掏腰包；anglophile 英倫迷連雨都覺得浪漫；philharmonic 愛和諧所以組樂團——場外還有 philology 語言考古粉在挖字根。",
    reviewHooks: ["phil＝愛：philosophy/philately/bibliophile/philanthropy", "philharmonic＝愛和聲的樂團"],
    pitfalls: ["philanthropy＝慈善博愛，不是 philately（集郵）", "anglophile＝親英／英倫迷"],
    members: [
      card("philosophy", "哲學", "愛智慧社長", "State your philosophy of evidence before the claim.", "先講你的證據哲學再出主張。"),
      card("philately", "集郵", "郵票戀人粉", "His philately collection funded open-data prizes.", "他的集郵收藏資助了開放資料獎。"),
      card("bibliophile", "藏書家；愛書人", "抱書睡的粉", "A bibliophile still needs digital backups.", "愛書人仍需數位備份。"),
      card("cinephile", "影迷", "抱片哭的粉", "Cinephile taste is not a methods validation.", "影迷品味不是方法驗證。"),
      card("technophile", "科技迷", "抱gadget笑的粉", "Technophiles over-trust shiny dashboards.", "科技迷過度信任閃亮儀表板。"),
      card("philanthropy", "慈善；博愛", "愛人類到掏腰包", "Philanthropy without transparency can distort agendas.", "不透明的慈善可能扭曲議程。"),
      card("philanthropist", "慈善家", "金援粉絲王", "Name the philanthropist and the strings attached.", "具名慈善家與附帶條件。"),
      card("anglophile", "親英者；英倫迷", "連雨都浪漫的粉", "Anglophile framing is not cross-cultural proof.", "親英框架不是跨文化證明。"),
      card("philharmonic", "愛樂的；交響樂團", "愛和聲組團", "The philharmonic metaphor: many instruments, one score.", "愛樂隱喻：多樂器共一總譜。"),
      card("philology", "語文學；文獻學", "挖字根考古粉", "Philology reminds us words drift in meaning.", "語文學提醒詞義會漂。"),
      card("audiophile", "音響迷", "耳機信徒", "Audiophile gear cannot fix a noisy design.", "音響迷裝備修不好嘈雜設計。", "story"),
      card("xenophile", "喜好異文化者", "愛外來的粉", "A xenophile lab invites outsider critique.", "喜好異文化的實驗室歡迎外人批評。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Stamp collecting:", promptZh: "集郵：", choices: ["philately", "philosophy", "philharmonic", "philology"], answer: "philately" },
      { id: "q2", type: "sense", promptEn: "Love of humankind; charity:", promptZh: "慈善博愛：", choices: ["philanthropy", "cinephile", "technophile", "anglophile"], answer: "philanthropy" },
      { id: "q3", type: "sense", promptEn: "Book lover:", promptZh: "愛書人：", choices: ["bibliophile", "xenophile", "audiophile", "philately"], answer: "bibliophile" },
    ],
  },
  {
    id: "root-phob-01", type: "root", elementLemma: "phob", priority: "B",
    titleZh: "phob｜恐懼症遊樂園", titleEn: "Phobia Theme Park",
    hook: "字根 phob＝怕——遊樂園每扇門都寫著「我不要進去」。",
    script:
      "門口掛 phobia 總招牌。claustrophobia 怕密閉電梯；agoraphobia 怕廣場人潮；acrophobia 怕高空旋轉杯；xenophobia 怕「外人」進場。hydrophobia 怕水（也聯狂犬病典故）；technophobia 怕新按鈕；phobic 形容整個人都在抖——記得：怕≠恨，但 xenophobia 常變成歧視劇本。",
    reviewHooks: ["phob＝怕：phobia/claustrophobia/agoraphobia/xenophobia/acrophobia", "xenophobia 常帶歧視義"],
    pitfalls: ["xenophobia≠ xenophile（愛異文化）", "hydrophobia 醫學典故＝恐水／狂犬病相關"],
    members: [
      card("phobia", "恐懼症", "總招牌", "Call it a phobia only with clinical care, not as insult.", "稱恐懼症要謹慎，勿當侮辱。"),
      card("agoraphobia", "廣場恐懼症", "怕大場面", "Agoraphobia metaphors misuse public fear casually.", "廣場恐懼隱喻常被隨便用。"),
      card("acrophobia", "懼高症", "怕高空杯", "Acrophobia is not an excuse to skip remote sites.", "懼高不是跳過遠端站點的藉口。"),
      card("xenophobia", "仇外；排外恐懼", "怕外人進場", "Xenophobia poisons collaborative science.", "排外恐懼毒害合作科學。"),
      card("hydrophobia", "恐水；狂犬病相關", "怕水門", "Historical 'hydrophobia' labels need careful glossing.", "歷史「恐水」標籤需謹慎釋義。"),
      card("technophobia", "科技恐懼", "怕新按鈕", "Technophobia can slow useful tooling adoption.", "科技恐懼會拖慢有用工具採用。"),
      card("phobic", "恐懼的；恐懼症的", "整個人在抖", "Phobic reactions to critique block learning.", "對批評的恐懼反應阻擋學習。"),
      card("homophobia", "對同性戀的恐懼／歧視", "社會恐懼門", "Homophobia has no place in research ethics.", "恐同歧視在研究倫理中沒有位置。", "story"),
      card("arachnophobia", "蜘蛛恐懼症", "八腳怪門", "Arachnophobia jokes still need consent in class.", "蜘蛛恐懼玩笑課堂仍需同意。", "story"),
      card("photophobia", "畏光", "怕光門", "Photophobia can be a medical symptom, not a metaphor toy.", "畏光可以是醫學症狀，不是隱喻玩具。", "story"),
      card("phobe", "恐懼者（後綴用法）", "怕字招牌人", "Drop casual '-phobe' labels in scholarly tone.", "學術語氣少用隨便的 -phobe 標籤。", "story"),
      card("phobic response", "恐懼反應", "樂園警報", "A phobic response to null results wastes cohorts.", "對虛無結果的恐懼反應浪費世代。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Fear/hatred of foreigners or outsiders:", promptZh: "排外恐懼：", choices: ["xenophobia", "philately", "euphony", "rectitude"], answer: "xenophobia" },
      { id: "q2", type: "sense", promptEn: "Fear of heights:", promptZh: "懼高：", choices: ["acrophobia", "agoraphobia", "technophobia", "bibliophile"], answer: "acrophobia" },
      { id: "q3", type: "sense", promptEn: "Fear of open/public spaces:", promptZh: "廣場恐懼：", choices: ["agoraphobia", "hydrophobia", "philanthropy", "impetus"], answer: "agoraphobia" },
    ],
  },
  {
    id: "root-liber-01", type: "root", elementLemma: "liber", priority: "B",
    titleZh: "liber｜解放檢查哨", titleEn: "Liber Checkpoint",
    hook: "字根 liber＝自由——檢查哨問：你是真自由，還是浪子自由？",
    script:
      "liberate 放人出關；liberty 自由通行證。liberal 寬鬆放行，illiberal 關到更緊。libertine 把自由用成放蕩通行證；libertarian 理論上最小干預。liberalize 法規鬆綁；deliverance 被救出關的劇情——哨兵提醒：自由≠零責任。",
    reviewHooks: ["liber＝自由：liberate/liberty/liberal/illiberal/libertine", "libertine＝放蕩者"],
    pitfalls: ["liberal 政治義 vs 慷慨／寬鬆義看語境", "libertine 偏道德放縱"],
    members: [
      card("liberate", "解放；使自由", "放人出關", "Open data can liberate secondary analysis.", "開放資料能解放二次分析。"),
      card("liberty", "自由", "通行證", "Academic liberty still needs replication norms.", "學術自由仍需複現規範。"),
      card("liberal", "開明的；慷慨的；自由派的", "寬鬆放行", "A liberal interpretation still cites the text.", "寬鬆解讀仍要引用文本。"),
      card("illiberal", "狹隘的；反自由的", "關更緊", "Illiberal gatekeeping blocks critique.", "狹隘把關阻擋批評。"),
      card("libertine", "放蕩者", "浪子通行證", "A libertine citation style ignores primary sources.", "放蕩引用風格忽略一手來源。"),
      card("libertarian", "自由意志主義者", "最小干預派", "Libertarian rhetoric can clash with public-good data.", "自由意志修辭可能與公共財資料衝突。"),
      card("liberalize", "使自由化；放寬", "鬆綁按鈕", "Liberalize access without abandoning ethics review.", "放寬近用但不放棄倫理審查。"),
      card("deliverance", "解救；解脫", "被救出關", "Correction can feel like deliverance after years of doubt.", "勘誤在多年懷疑後像解脫。"),
      card("liberation", "解放", "出關運動", "Method liberation is not method anarchy.", "方法解放不是方法無政府。", "story"),
      card("freely", "自由地", "暢行", "Share code freely with clear licenses.", "以清楚授權自由分享程式碼。", "story"),
      card("unliberated", "未解放的", "還關著", "Unliberated datasets hide in private drives.", "未解放資料集藏在私人硬碟。", "story"),
      card("liberalism", "自由主義", "自由派思潮", "Debate liberalism without turning methods into slogans.", "辯論自由主義，勿把方法變口號。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Morally unrestrained person:", promptZh: "放蕩者：", choices: ["libertine", "liberal", "regent", "probe"], answer: "libertine" },
      { id: "q2", type: "sense", promptEn: "Not liberal; narrow/authoritarian:", promptZh: "狹隘／反自由：", choices: ["illiberal", "liberate", "philately", "euphony"], answer: "illiberal" },
      { id: "q3", type: "sense", promptEn: "Set free:", promptZh: "解放：", choices: ["liberate", "impugn", "deride", "submerge"], answer: "liberate" },
    ],
  },
  {
    id: "root-medi-01", type: "root", elementLemma: "medi", priority: "B",
    titleZh: "medi｜中庸調解茶室", titleEn: "Medi Tea House",
    hook: "字根 medi＝中——茶室專管站中間：調解、平庸、中世紀長桌。",
    script:
      "mediate／mediation／mediator 勸两边坐下喝茶。mediocre 茶泡得平庸卻硬說是特調。medieval 長桌還在中世紀模式；intermediate／medium 中間档。immediate 沒有中間人——立刻到。remedial 補救課像把人拉回中線重學。",
    reviewHooks: ["medi＝中：mediate/mediocre/medieval/intermediate/immediate", "mediocre＝平庸"],
    pitfalls: ["mediate＝調停；immediate＝立即／直接", "remedial＝補救性的"],
    members: [
      card("mediate", "調停；仲介", "勸兩邊喝茶", "A neutral body can mediate data disputes.", "中立單位可調停資料爭議。"),
      card("mediation", "調解", "喝茶過程", "Try mediation before litigation metaphors.", "打官司隱喻前先試調解。"),
      card("mediator", "調解人", "倒茶的人", "The editor acted as mediator, not advocate.", "編輯當調解人而非辯護人。"),
      card("mediocre", "平庸的", "特調其實普通", "Mediocre abstracts bury the contribution.", "平庸摘要埋掉貢獻。"),
      card("medieval", "中世紀的；極舊的", "長桌復古模式", "Medieval paywalls block modern collaboration.", "中世紀式付費牆阻擋現代合作。"),
      card("intermediate", "中級的；中間的", "中档座位", "Report intermediate outcomes transparently.", "透明報告中間結果。"),
      card("medium", "媒介；中等", "傳茶托盤", "Choose the right medium for preregistration.", "為預註冊選對媒介。"),
      card("immediate", "立即的；直接的", "沒中間人", "Immediate corrections beat delayed rumors.", "立即勘誤勝過延遲謠言。"),
      card("remedial", "補救的", "拉回中線重學", "Offer remedial stats workshops without stigma.", "提供無汙名的補救統計工作坊。"),
      card("intermediary", "中間人", "傳話茶僮", "Avoid opaque intermediaries for raw files.", "原始檔避免不透明中間人。", "story"),
      card("median", "中位數", "正中間那杯", "Prefer the median when outliers shout.", "極端值喊叫時偏好中位數。", "story"),
      card("mediterranean", "地中海的", "中間之海（詞源彩蛋）", "Etymology jokes: Mediterranean as 'middle sea'.", "詞源玩笑：地中海＝中間的海。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Ordinary; not very good:", promptZh: "平庸：", choices: ["mediocre", "mediate", "regal", "pugnacious"], answer: "mediocre" },
      { id: "q2", type: "sense", promptEn: "Act as go-between:", promptZh: "調停：", choices: ["mediate", "impugn", "submerge", "derive"], answer: "mediate" },
      { id: "q3", type: "sense", promptEn: "Instant; without delay/middleman:", promptZh: "立即／直接：", choices: ["immediate", "medieval", "intermediate", "philately"], answer: "immediate" },
    ],
  },
  {
    id: "root-mem-01", type: "root", elementLemma: "mem", priority: "B",
    titleZh: "mem｜記憶紀念品櫃", titleEn: "Mem Souvenir Locker",
    hook: "字根 mem＝記——櫃門一開：回憶、紀念、備忘錄全掉出來。",
    script:
      "memoir 寫自己的記憶影集；memorable 值得放進櫃。commemorate 公開紀念；memento 小紀念品。immemorial 久到記不起起點；memorabilia 粉絲週邊山。memorandum 辦公室備忘；memorial 紀念碑；mnemonic 記憶口訣貼紙——櫃員說：記得住≠記得對。",
    reviewHooks: ["mem＝記：memoir/memorable/commemorate/memento/immemorial/mnemonic", "immemorial＝遠古難記"],
    pitfalls: ["memento＝紀念品；momentum＝動量（別混）", "mnemonic＝助記的"],
    members: [
      card("memoir", "回憶錄", "記憶影集", "A methods memoir should admit dead ends.", "方法回憶錄應承認死路。"),
      card("memorable", "難忘的", "值得入櫃", "A memorable figure still needs a caption.", "難忘的圖仍需圖說。"),
      card("commemorate", "紀念", "公開紀念儀式", "Commemorate failed trials that taught design.", "紀念教會設計的失敗試驗。"),
      card("memento", "紀念品", "小吊飾", "Keep a memento of the first successful audit.", "留一件首次成功稽核的小紀念。"),
      card("immemorial", "遠古的；無法追憶的", "久到沒起點", "From time immemorial, labs hoarded notebooks—stop.", "自古以來實驗室囤筆記本——該停。"),
      card("memorabilia", "紀念收藏品", "週邊山", "Conference memorabilia is not a CV method.", "會議週邊不是履歷上的方法。"),
      card("memorandum", "備忘錄", "辦公室紙條", "File a memorandum of every protocol change.", "每次規程變更都備忘。"),
      card("memorial", "紀念碑；追悼的", "石頭記憶", "A digital memorial of retracted claims educates.", "撤稿主張的數位紀念碑能教育。"),
      card("mnemonic", "助記的；口訣", "貼紙口訣", "A mnemonic helps; a checklist verifies.", "口訣幫忙；檢核表驗證。"),
      card("remember", "記得", "從櫃取出", "Remember to report exclusions.", "記得報告排除。", "story"),
      card("memory", "記憶", "櫃的容量", "Institutional memory needs version control.", "機構記憶需要版本控管。", "story"),
      card("memo", "便條；備忘", "短訊記憶", "A one-line memo cannot replace prereg.", "一行便條不能取代預註冊。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Souvenir; reminder object:", promptZh: "紀念品：", choices: ["memento", "memoir", "regime", "probe"], answer: "memento" },
      { id: "q2", type: "sense", promptEn: "Extending beyond memory; ancient:", promptZh: "遠古難記：", choices: ["immemorial", "memorable", "mediate", "liberal"], answer: "immemorial" },
      { id: "q3", type: "sense", promptEn: "Memory aid:", promptZh: "助記：", choices: ["mnemonic", "memorabilia", "philharmonic", "impugn"], answer: "mnemonic" },
    ],
  },
  {
    id: "root-morph-01", type: "root", elementLemma: "morph", priority: "B",
    titleZh: "morph｜變形變裝秀", titleEn: "Morph Costume Show",
    hook: "字根 morph＝形——舞台燈光一轉，形狀整容直播。",
    script:
      "amorphous 還沒定妝，一團糊。metamorphosis 整隻蝴蝶級變身；morph 動詞瞬變。anthropomorphic 把資料擬人成會說話的角色；polymorphous／isomorphic 多形或同形對照。morphology 專管字形／形態學——主持人警告：變裝可以，偷換結局變項不行。",
    reviewHooks: ["morph＝形：amorphous/metamorphosis/anthropomorphic/morphology", "amorphous＝無定形"],
    pitfalls: ["anthropomorphic＝擬人的", "metamorphosis＝徹底變形"],
    members: [
      card("amorphous", "無定形的", "還沒定妝", "An amorphous hypothesis cannot be tested.", "無定形假說無法檢驗。"),
      card("metamorphosis", "蛻變；變形", "蝴蝶級變身", "The field's metamorphosis toward open methods is slow.", "領域朝開放方法的蛻變很慢。"),
      card("morph", "變形；形態", "瞬變按鈕", "Do not morph outcomes after seeing results.", "看到結果後不要瞬變結局變項。"),
      card("anthropomorphic", "擬人的", "資料會說話角色", "Avoid anthropomorphic claims about algorithms' 'intent'.", "避免說演算法有「意圖」的擬人主張。"),
      card("polymorphous", "多形的", "多套戲服", "Polymorphous constructs need clear operationalization.", "多形構念需要清楚操作化。"),
      card("isomorphic", "同構的；同形的", "同款剪裁", "Isomorphic models still differ in assumptions.", "同構模型假設仍可能不同。"),
      card("morphology", "形態學；構詞學", "形狀規則本", "Morphology of words aids humor mnemonics.", "構詞形態學幫助幽默記憶。"),
      card("metamorphic", "變質的；變形的", "搖滾變質（地質梗）", "Metamorphic change in norms needs leadership.", "規範的變質式改變需要領導。", "story"),
      card("morphing", "變形中", "直播變臉", "Silent morphing of code is misconduct-adjacent.", "沉默變臉改碼近乎不端。", "story"),
      card("shapeless", "無形的", "沒輪廓", "Shapeless aims produce shapeless papers.", "無形目標產出無形論文。", "story"),
      card("formless", "無形式的", "空殼舞台", "Formless 'innovation' talk skips measurement.", "無形式「創新」空談跳過測量。", "story"),
      card("transformer", "變形金剛／轉換器", "玩具梗彩蛋", "Be a transformer of habits, not of p-values.", "做習慣變形者，不是 p 值變形者。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Without clear shape/structure:", promptZh: "無定形：", choices: ["amorphous", "regal", "pugnacious", "laud"], answer: "amorphous" },
      { id: "q2", type: "sense", promptEn: "Attributing human traits to nonhumans:", promptZh: "擬人：", choices: ["anthropomorphic", "immemorial", "illiberal", "centripetal"], answer: "anthropomorphic" },
      { id: "q3", type: "sense", promptEn: "Complete change of form:", promptZh: "蛻變：", choices: ["metamorphosis", "philately", "memento", "probation"], answer: "metamorphosis" },
    ],
  },
  {
    id: "root-mut-01", type: "root", elementLemma: "mut", priority: "B",
    titleZh: "mut｜突變交換所", titleEn: "Mut Exchange Desk",
    hook: "字根 mut＝變——交換所專管突變、互換、互相。",
    script:
      "mutate／mutation 基因櫃突然變樣；mutable 還改得動，對面是 immutable（他族已登場）。commute 上下班交換路線；mutual 互相交換好處。transmute 煉金式質變；permutation 排列交換秀——櫃員章：先登記再突變。",
    reviewHooks: ["mut＝變：mutate/mutation/mutable/commute/mutual/transmute/permutation", "mutable↔immutable"],
    pitfalls: ["commute 可＝通勤或減刑／互換", "transmute＝質變式轉變"],
    members: [
      card("mutate", "突變；變化", "突然變樣", "Estimates mutate when you silent-swap covariates.", "沉默替換共變項時估計會突變。"),
      card("mutation", "突變；變異", "變樣紀錄", "Treat protocol mutation as a logged event.", "把規程突變當需記錄事件。"),
      card("mutable", "可變的", "還改得動", "Keep inclusion rules mutable only before lock.", "納入規則僅鎖定前可改。"),
      card("commute", "通勤；減刑；互換", "交換路線", "Do not commute a strong claim into a weak one quietly.", "不要悄悄把強主張換成弱主張。"),
      card("mutual", "相互的", "互相交換", "Mutual transparency builds consortia.", "相互透明建立聯盟。"),
      card("transmute", "使質變；煉成", "煉金變質", "Hype cannot transmute correlation into causation.", "炒作不能把相關煉成因果。"),
      card("permutation", "排列；置換", "交換秀", "Multiple testing across permutations needs correction.", "跨排列的多重檢定需要校正。"),
      card("mutability", "可變性", "可變程度", "Declare mutability of analysis plans up front.", "事先聲明分析計畫可變性。", "story"),
      card("commutativity", "交換律", "誰先誰後一樣", "Order commutativity fails for some filters.", "某些濾波不滿足交換律。", "story"),
      card("mutant", "突變體", "變種角色", "A mutant metric needs a new validation.", "突變指標需要新驗證。", "story"),
      card("exchange", "交換", "櫃台動作", "Exchange drafts before public claims.", "公開主張前先交換草稿。", "story"),
      card("interchange", "互換", "對調", "Interchange train/test only with leakage checks.", "對調訓練／測試須防洩漏。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Change in form/nature drastically:", promptZh: "質變／煉成：", choices: ["transmute", "mediate", "laud", "submerge"], answer: "transmute" },
      { id: "q2", type: "sense", promptEn: "Shared by each; reciprocal:", promptZh: "相互的：", choices: ["mutual", "regal", "mediocre", "phobic"], answer: "mutual" },
      { id: "q3", type: "sense", promptEn: "Capable of change:", promptZh: "可變的：", choices: ["mutable", "immemorial", "rectitude", "encomium"], answer: "mutable" },
    ],
  },
  {
    id: "root-phon-01", type: "root", elementLemma: "phon", priority: "B",
    titleZh: "phon｜聲響控制室", titleEn: "Phon Sound Booth",
    hook: "字根 phon＝聲——控制室推桿：好聽、難聽、假聲、真聲。",
    script:
      "euphony 調成悅耳；cacophony 調成災難演唱會。symphony 多聲部合奏；phonetic 按發音標記。homophone 同音撞名事故；megaphone／microphone／telephone 把聲音放大、接收、遠傳。phonology 管語音規則——工程師說：寫作要 euphony，會議別 cacophony。",
    reviewHooks: ["phon＝聲：euphony/cacophony/symphony/phonetic/homophone", "cacophony＝刺耳嘈雜"],
    pitfalls: ["euphony↔cacophony 成對記", "homophone＝同音異義"],
    members: [
      card("euphony", "悅耳；諧音美", "好聽推桿", "Aim for euphony without sacrificing precision.", "追求悅耳但不犧牲精確。"),
      card("cacophony", "刺耳嘈雜", "災難演唱會", "A cacophony of metrics confuses readers.", "指標刺耳嘈雜迷惑讀者。"),
      card("symphony", "交響曲；和諧", "多聲部合奏", "Team science should sound like a symphony, not solos only.", "團隊科學應像交響而非只有獨奏。"),
      card("phonetic", "語音的；語音學的", "按發音標記", "Provide phonetic guides for hard headwords.", "難詞提供語音指引。"),
      card("homophone", "同音異義詞", "撞名事故", "Homophones cause TTS and quiz traps.", "同音異義造成 TTS 與測驗陷阱。"),
      card("phonology", "音韻學", "語音規則本", "Phonology is optional; sense accuracy is not.", "音韻學可選；義準不可選。"),
      card("megaphone", "擴音器", "放大喊", "Do not use press megaphones for tiny pilots.", "小試點別用記者會擴音器。", "story"),
      card("microphone", "麥克風", "接收聲", "A quiet microphone still records admissions.", "安靜麥克風仍錄得到承認。", "story"),
      card("telephone", "電話", "遠傳聲", "Telephone interviews need consent scripts.", "電話訪談需要同意腳本。", "story"),
      card("symphony of errors", "錯誤交響", "糟合奏", "A symphony of errors starts with one silent fork.", "錯誤交響常始於一次沉默分叉。", "story"),
      card("phonic", "聲音的", "聲線開關", "Phonic clarity helps oral drills.", "聲音清晰幫助口語操練。", "story"),
      card("cacophonous", "刺耳的", "吵到爆", "Cacophonous debates still need minutes.", "刺耳辯論仍需會議紀錄。", "story"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Pleasant sound vs harsh noise:", promptZh: "悅耳 vs 刺耳：", choices: ["euphony / cacophony", "cacophony / euphony", "symphony / phonetic", "homophone / megaphone"], answer: "euphony / cacophony" },
      { id: "q2", type: "sense", promptEn: "Words that sound alike:", promptZh: "同音異義：", choices: ["homophone", "rectitude", "impetus", "memento"], answer: "homophone" },
      { id: "q3", type: "sense", promptEn: "Related to speech sounds:", promptZh: "語音的：", choices: ["phonetic", "mediocre", "liberal", "amorphous"], answer: "phonetic" },
    ],
  },
  {
    id: "root-pugn-01", type: "root", elementLemma: "pugn", priority: "B",
    titleZh: "pugn｜拳頭爭論擂台", titleEn: "Pugn Fight Ring",
    hook: "字根 pugn＝打——擂台專管用拳與用嘴打架。",
    script:
      "pugnacious 一上台就想打。impugn 出拳打對方名譽；oppugn 對打質疑。repugnant 讓人反感到想離場。pugilist 職業拳手；inexpugnable 要塞打不穿——裁判舉手：學術擂台打論點，別打人。",
    reviewHooks: ["pugn＝打：pugnacious/impugn/repugnant/pugilist", "impugn＝質疑／抨擊誠實"],
    pitfalls: ["impugn someone's integrity＝抨擊其正直", "repugnant＝令人厭惡的"],
    members: [
      card("pugnacious", "好鬥的", "一上台就想打", "Pugnacious tone sinks valid critique.", "好鬥語氣毁掉有效批評。"),
      card("impugn", "質疑；抨擊", "出拳打名譽", "Do not impugn motives without evidence.", "沒證據不要抨擊動機。"),
      card("repugnant", "令人厭惡的；牴觸的", "反感到離場", "Fraud is ethically repugnant.", "造假在倫理上令人厭惡。"),
      card("pugilist", "拳擊手", "職業拳手", "Be a pugilist for methods, not for egos.", "為方法當拳手，不為自我。"),
      card("oppugn", "反對；質疑", "對打質疑", "Oppugn the identification, politely.", "禮貌地質疑識別策略。"),
      card("inexpugnable", "難攻克的；堅不可摧的", "要塞打不穿", "No claim is inexpugnable to new data.", "沒有主張能對新資料堅不可摧。"),
      card("pugnacity", "好鬥性", "想打的氣質", "Pugnacity without rigor is noise.", "沒有嚴謹的好鬥是噪音。", "story"),
      card("fight", "戰鬥", "擂台動作", "Fight bias with design, not vibes.", "用設計打偏差，不是感覺。", "story"),
      card("combat", "對抗", "對打", "Combat p-hacking with registration.", "用註冊對抗 p 操弄。", "story"),
      card("belligerent", "好戰的", "好鬥鄰居", "Belligerent emails escalate nothing useful.", "好戰郵件升級不出有用東西。", "story"),
      card("antagonize", "激怒；對抗", "把人打成敵", "Do not antagonize reviewers with sarcasm.", "不要用諷刺激怒審稿人。", "story"),
      card("unassailable", "無可指摘的", "打不穿近親", "Unassailable claims are rare—show your work.", "無可指摘的主張很稀有——展示過程。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Attack as false; challenge integrity:", promptZh: "抨擊／質疑：", choices: ["impugn", "mediate", "liberate", "commemorate"], answer: "impugn" },
      { id: "q2", type: "sense", promptEn: "Eager to fight; combative:", promptZh: "好鬥：", choices: ["pugnacious", "mediocre", "euphony", "mnemonic"], answer: "pugnacious" },
      { id: "q3", type: "sense", promptEn: "Disgusting; offensive:", promptZh: "令人厭惡：", choices: ["repugnant", "philharmonic", "mutable", "synopsis"], answer: "repugnant" },
    ],
  },
  {
    id: "root-rid-01", type: "root", elementLemma: "rid/ris", priority: "B",
    titleZh: "rid／ris｜嘲笑露天劇場", titleEn: "Ridicule Open Theater",
    hook: "字根 rid/ris＝笑——露天劇場專管好笑、可笑、被笑。",
    script:
      "ridicule／derision 把人笑下場。ridiculous 荒謬到全場笑；risible 可笑的劇本。absurd 荒誕到笑不出；mockery 嘲弄加演——主持人喊卡：可以 ridicule 爛設計，不要 ridicule 人。",
    reviewHooks: ["rid＝笑：ridicule/ridiculous/risible/derision", "deride（他族）同根嘲弄"],
    pitfalls: ["ridicule 可作名詞或動詞", "risible＝可笑的（較文）"],
    members: [
      card("ridicule", "嘲笑；嘲弄", "笑人下場", "Ridicule bad incentives, not junior mistakes made in good faith.", "嘲笑壞誘因，而非善意資淺錯誤。"),
      card("ridiculous", "荒謬的；可笑的", "全場笑點", "A ridiculous sample size claim needs pushback.", "荒謬樣本宣稱需要反推。"),
      card("risible", "可笑的", "文雅笑點", "The excuse was risible under audit.", "稽核下那個藉口可笑。"),
      card("derision", "嘲弄；笑柄", "嘲弄氣氛", "Public derision is not peer review.", "公開嘲弄不是同儕審查。"),
      card("absurd", "荒謬的", "笑不出的荒誕", "It is absurd to equate p<.05 with truth.", "把 p<.05 當真理很荒謬。"),
      card("mockery", "嘲弄；拙劣模仿", "加演嘲諷", "A mockery of preregistration is worse than none.", "拙劣模仿預註冊比沒有更糟。"),
      card("laughable", "可笑的", "笑得出來", "Laughable robustness checks fool no one.", "可笑的穩健檢查騙不了人。", "story"),
      card("comic", "喜劇的", "喜劇線", "Keep comic relief out of the limitations section.", "限制段別放喜劇調劑。", "story"),
      card("irony", "諷刺", "反差笑", "Irony about open science still needs open code.", "諷刺開放科學仍需開放程式碼。", "story"),
      card("satire", "諷刺文學", "諷刺專場", "Satire can teach norms; data still decide.", "諷刺能教規範；資料仍裁決。", "story"),
      card("jeer", "嘲罵", "起哄笑", "Jeers at null results chill honesty.", "對虛無結果起哄寒蟬誠實。", "story"),
      card("scoff", "嗤笑", "嗤之以鼻", "Scoff less; specify more.", "少嗤笑；多具體。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Make fun of; mock:", promptZh: "嘲笑：", choices: ["ridicule", "liberate", "immerse", "rectify"], answer: "ridicule" },
      { id: "q2", type: "sense", promptEn: "Worthy of laughter; absurdly funny:", promptZh: "可笑的：", choices: ["risible", "regal", "impetuous", "privy"], answer: "risible" },
      { id: "q3", type: "sense", promptEn: "Contemptuous laughter/mockery:", promptZh: "嘲弄：", choices: ["derision", "euphony", "memento", "mediate"], answer: "derision" },
    ],
  },
  {
    id: "root-merge-01", type: "root", elementLemma: "merge/mers", priority: "B",
    titleZh: "merge｜沉浮游泳池", titleEn: "Merge Pool",
    hook: "字根 merge/mers＝沉——泳池專管沉下去、浮出來、泡進去。",
    script:
      "submerge 整個人沉下去；emerge 冒出頭喘气。immerse 泡進水裡學仰式。emergency 緊急出水警報；merger 兩池併成一池——救生員：資料可以 immerse，結論別 submerge 不利結果。",
    reviewHooks: ["mers＝沉：submerge/emerge/immerse/emergency/merger", "emerge↔submerge"],
    pitfalls: ["immerse＝沉浸；emerge＝出現", "emergency＝緊急情況"],
    members: [
      card("submerge", "淹沒；沉入", "沉下去", "Do not submerge adverse findings in appendices.", "不要把不良發現沉進附錄。"),
      card("emerge", "浮現；出現", "冒出頭", "Patterns emerge only after cleaning logs.", "清理日誌後模式才浮現。"),
      card("immerse", "沉浸；浸泡", "泡進去", "Immerse students in real messy datasets.", "讓學生沉浸真實凌亂資料。"),
      card("emergency", "緊急情況", "出水警報", "Have an emergency plan for data leaks.", "為資料洩漏準備緊急計畫。"),
      card("merger", "合併", "兩池併一", "A journal merger should not erase archives.", "期刊合併不該抹掉檔案。"),
      card("emergence", "出現；興起", "冒出過程", "The emergence of open norms took a decade.", "開放規範的興起花了十年。", "story"),
      card("submergence", "沉沒", "沉沒狀態", "Submergence of dissent harms labs.", "異議沉沒傷害實驗室。", "story"),
      card("immersive", "沉浸式的", "整池體驗", "Immersive training beats slide-only ethics.", "沉浸式訓練勝過只放投影片的倫理課。", "story"),
      card("reemerge", "再次出現", "又冒出來", "Old bugs reemerge without tests.", "沒有測試舊錯誤會再冒出。", "story"),
      card("demerge", "分拆", "一池拆兩", "Demerge entangled hypotheses before testing.", "檢驗前先拆開糾纏假說。", "story"),
      card("sink", "下沉", "往下掉", "Weak identification will sink causal talk.", "弱識別會讓因果空談下沉。", "story"),
      card("afloat", "漂浮的", "還浮著", "Keep the project afloat with honest timelines.", "用誠實時程讓專案漂浮。", "story"),
    ],
    quiz: [
      { id: "q1", type: "lookalike", promptEn: "Go under vs come out:", promptZh: "沉下 vs 浮出：", choices: ["submerge / emerge", "emerge / submerge", "immerse / merger", "emergency / emerge"], answer: "submerge / emerge" },
      { id: "q2", type: "sense", promptEn: "Plunge into; involve deeply:", promptZh: "沉浸：", choices: ["immerse", "impugn", "ridicule", "liberate"], answer: "immerse" },
      { id: "q3", type: "sense", promptEn: "Urgent crisis:", promptZh: "緊急：", choices: ["emergency", "euphony", "mediocre", "philately"], answer: "emergency" },
    ],
  },
  {
    id: "root-mon-01", type: "root", elementLemma: "mon/monit", priority: "B",
    titleZh: "mon｜警告廣播站", titleEn: "Mon Warning Station",
    hook: "字根 mon/monit＝警告、提醒——廣播站專管提前提醒與召喚。",
    script:
      "admonish／admonition 廣播訓誡。monitor 螢幕監看；monitory 警告語氣。premonition 不祥預告片；summon 召喚到站。monument 用石頭警告後人「別重蹈」——DJ 說：premonition 不是證據，admonish 要對事。",
    reviewHooks: ["mon＝警告：admonish/admonition/monitor/premonition/summon", "premonition＝預感"],
    pitfalls: ["admonish＝告誡", "monument＝紀念碑（警示後人）"],
    members: [
      card("admonish", "告誡；警告", "廣播訓誡", "Admonish silent exclusions in review.", "在審查中告誡沉默排除。"),
      card("admonition", "訓誡；警告", "廣播內容", "Take the admonition about power seriously.", "認真對待關於檢定力的訓誡。"),
      card("monitor", "監視；監控器", "螢幕監看", "Monitor drift in coding reliability.", "監視編碼信度漂移。"),
      card("monitory", "警告的；訓誡的", "警告語氣", "A monitory footnote is kinder than a scandal.", "警告腳註比醜聞仁慈。"),
      card("premonition", "預感；預兆", "不祥預告片", "A premonition of bias still needs a test.", "偏差預感仍需檢驗。"),
      card("summon", "召喚；傳喚", "叫到站", "Summon an independent auditor early.", "及早召喚獨立稽核。"),
      card("monument", "紀念碑", "石頭警告", "Make the correction a monument, not a whisper.", "讓勘誤成紀念碑而非耳語。"),
      card("monumental", "巨大的；紀念碑式的", "超大警告", "A monumental error needs a monumental fix.", "巨大錯誤需要巨大修復。", "story"),
      card("summons", "傳票；召喚", "正式叫人", "Ethics boards can issue a figurative summons.", "倫理委員會可發比喻式傳喚。", "story"),
      card("warning", "警告", "廣播詞", "Early warnings beat late retractions.", "早期警告勝過晚期撤稿。", "story"),
      card("reminder", "提醒", "小廣播", "Calendar reminders for registry updates help.", "登錄更新的日曆提醒有幫助。", "story"),
      card("watchdog", "監察者", "站外狗", "Fund independent watchdogs for data integrity.", "資助獨立監察者守護資料誠信。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Warn or reprimand firmly:", promptZh: "告誡：", choices: ["admonish", "immerse", "morph", "laud"], answer: "admonish" },
      { id: "q2", type: "sense", promptEn: "Foreboding; advance feeling:", promptZh: "預感：", choices: ["premonition", "philately", "cacophony", "libertine"], answer: "premonition" },
      { id: "q3", type: "sense", promptEn: "Call forth; send for:", promptZh: "召喚：", choices: ["summon", "submerge", "mutate", "mediate"], answer: "summon" },
    ],
  },
  {
    id: "root-rect-01", type: "root", elementLemma: "rect", priority: "B",
    titleZh: "rect｜矯正直尺局", titleEn: "Rect Straightener Bureau",
    hook: "字根 rect＝直、正——直尺局專管弄直、弄對、品德正直。",
    script:
      "correct／rectify 用尺把錯線拉直。rectitude 品德也要直。erect 豎直立起；direct／indirect／directive 指路或轉彎指示。rectangle 直角邊框——局長章：先 rectify 方法，再 erect 結論大廈。",
    reviewHooks: ["rect＝直：correct/rectify/rectitude/erect/direct", "rectitude＝正直"],
    pitfalls: ["rectify＝改正；rectitude＝正直品德", "erect＝豎立"],
    members: [
      card("correct", "正確的；改正", "拉直線", "Correct the record publicly.", "公開改正紀錄。"),
      card("rectify", "矯正；改正", "用尺弄直", "Rectify the codebook before round two.", "第二輪前矯正碼本。"),
      card("rectitude", "正直；廉正", "品德直線", "Rectitude matters more than cleverness.", "正直比聰明重要。"),
      card("erect", "豎立；直立的", "立起來", "Do not erect causal towers on sand.", "不要在沙上豎因果塔。"),
      card("direct", "直接的；指導", "直線指路", "Give direct answers about missingness.", "對缺失給直接答案。"),
      card("indirect", "間接的", "轉彎指路", "Indirect effects need mediation assumptions.", "間接效應需要中介假設。"),
      card("directive", "指示；指令", "官方指路條", "Follow the registry directive on outcomes.", "遵循登錄庫對結局的指令。"),
      card("rectangle", "矩形", "直角邊框", "Put uncertainty in the rectangle of the figure.", "把不確定放進圖的矩形裡。", "story"),
      card("correction", "勘誤；改正", "拉直結果", "A timely correction is scholarship.", "及時勘誤是學術。", "story"),
      card("incorrect", "不正確的", "歪線", "Mark incorrect claims without humiliation.", "標記不正確主張但不羞辱。", "story"),
      card("straighten", "弄直", "直尺動作", "Straighten authorship order early.", "及早弄直作者序。", "story"),
      card("upright", "正直的；直立的", "站直", "Stay upright when incentives bend.", "誘因彎曲時仍站直。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Moral integrity; uprightness:", promptZh: "正直：", choices: ["rectitude", "ridicule", "cacophony", "memento"], answer: "rectitude" },
      { id: "q2", type: "sense", promptEn: "Put right; correct:", promptZh: "矯正：", choices: ["rectify", "impugn", "submerge", "morph"], answer: "rectify" },
      { id: "q3", type: "sense", promptEn: "Build upright; raise:", promptZh: "豎立：", choices: ["erect", "immerse", "derision", "philately"], answer: "erect" },
    ],
  },
  {
    id: "root-pet-01", type: "root", elementLemma: "pet", priority: "B",
    titleZh: "pet｜衝求競技場", titleEn: "Pet Rush Arena",
    hook: "字根 pet＝求、衝——競技場專管往前衝與請求。",
    script:
      "impetuous 腦袋還沒到腳先衝；impetus 衝量本身。petition 正式呈請；compete 互相衝第一。centripetal 往中心衝；appetite 慾望也在衝。perpetual 衝個不停；petulant 衝完還耍脾氣——教練：先想再衝。",
    reviewHooks: ["pet＝衝求：impetuous/impetus/petition/compete/centripetal/petulant", "impetuous＝衝動"],
    pitfalls: ["impetuous＝衝動的；impetus＝動力／契機", "petulant＝暴躁任性"],
    members: [
      card("impetuous", "衝動的", "腳比腦快", "Impetuous claims skip robustness.", "衝動主張跳過穩健檢查。"),
      card("impetus", "動力；契機；動量", "衝量", "A scandal gave impetus to open-data rules.", "醜聞給了開放資料規則動力。"),
      card("petition", "請願；正式請求", "呈請書", "Petition journals for data policies.", "向期刊請願要資料政策。"),
      card("compete", "競爭", "互相衝第一", "Labs compete on speed; science needs care.", "實驗室比速度；科學需要謹慎。"),
      card("centripetal", "向心的", "往中心衝", "Centripetal incentives can unify standards.", "向心力誘因可統一標準。"),
      card("appetite", "食慾；慾望", "慾望衝鋒", "An appetite for novelty crowds replication.", "嗜新慾望排擠複現。"),
      card("perpetual", "永久的；不斷的", "衝個不停", "Perpetual revision without release helps no one.", "永不發布的永久修改幫不了人。"),
      card("petulant", "暴躁任性的", "衝完耍脾氣", "Petulant replies to reviewers backfire.", "對審稿人暴躁回覆會反噬。"),
      card("competition", "競爭", "衝刺賽", "Healthy competition shares tools.", "健康競爭分享工具。", "story"),
      card("repeat", "重複", "一再衝", "Do not repeat the same silent fork.", "不要重複同一沉默分叉。", "story"),
      card("petitionary", "請願的", "呈請語氣", "Keep petitionary emails specific.", "請願郵件要具體。", "story"),
      card("impetus check", "動力檢查", "衝前煞車", "Run an impetus check: why rush?", "做動力檢查：為何急？", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Acting suddenly without thought:", promptZh: "衝動：", choices: ["impetuous", "rectitude", "euphony", "mediate"], answer: "impetuous" },
      { id: "q2", type: "sense", promptEn: "Driving force; stimulus:", promptZh: "動力／契機：", choices: ["impetus", "philately", "memento", "derision"], answer: "impetus" },
      { id: "q3", type: "sense", promptEn: "Childishly sulky; peevish:", promptZh: "暴躁任性：", choices: ["petulant", "amorphous", "liberal", "immerse"], answer: "petulant" },
    ],
  },
  {
    id: "root-priv-01", type: "root", elementLemma: "priv", priority: "B",
    titleZh: "priv｜隱私金庫", titleEn: "Priv Vault",
    hook: "字根 priv＝私——金庫專管私人、剝奪、特權鑰匙。",
    script:
      "private／privacy 鎖進金庫。deprive 把鑰匙拿走；privation 被剝到空。privilege 特殊鑰匙；privy 知情的自己人——守衛：privilege 要揭露，privacy 要保護識別資訊。",
    reviewHooks: ["priv＝私：private/privacy/deprive/privation/privilege/privy", "deprive＝剝奪"],
    pitfalls: ["privy to＝知情參與", "privation＝匱乏／剝奪狀態"],
    members: [
      card("private", "私人的", "鎖進金庫", "Keep private keys off shared slides.", "私鑰別放共享投影片。"),
      card("privacy", "隱私", "金庫門禁", "Privacy requires more than anonymized names.", "隱私不只是匿名姓名。"),
      card("deprive", "剝奪", "拿走鑰匙", "Do not deprive reviewers of code access.", "不要剝奪審稿人程式碼近用。"),
      card("privation", "匱乏；剝奪", "被剝到空", "Privation of tooling hits poorer labs hardest.", "工具匱乏最傷較窮實驗室。"),
      card("privilege", "特權", "特殊鑰匙", "Disclose privilege and funding ties.", "揭露特權與資助關係。"),
      card("privy", "知情的；私下的", "自己人", "Only those privy to raw IDs need clearance.", "只有知情原始 ID 者需通關。"),
      card("privatization", "私有化", "公變私", "Privatization of essential data harms equity.", "必要資料私有化傷害公平。", "story"),
      card("underprivileged", "弱勢的", "少鑰匙的人", "Waive fees for underprivileged authors.", "為弱勢作者減免費用。", "story"),
      card("privately", "私下地", "金庫內談", "Resolve disputes privately, correct publicly.", "私下解決爭議，公開勘誤。", "story"),
      card("secrecy", "機密", "金庫氣氛", "Secrecy about exclusions is misconduct-adjacent.", "對排除保密近乎不端。", "story"),
      card("confidential", "機密的", "密封袋", "Mark confidential fields before sharing.", "共享前標記機密欄位。", "story"),
      card("exclusive", "排外的；專有的", "只有自己人", "Exclusive clubs slow cumulative science.", "排外俱樂部拖慢累積科學。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Take away; strip of:", promptZh: "剝奪：", choices: ["deprive", "laud", "emerge", "morph"], answer: "deprive" },
      { id: "q2", type: "sense", promptEn: "Special right/advantage:", promptZh: "特權：", choices: ["privilege", "cacophony", "impetuous", "philately"], answer: "privilege" },
      { id: "q3", type: "sense", promptEn: "Informed; sharing secret knowledge:", promptZh: "知情的：", choices: ["privy", "ridiculous", "submerge", "rectify"], answer: "privy" },
    ],
  },
  {
    id: "root-prob-01", type: "root", elementLemma: "prob", priority: "B",
    titleZh: "prob｜試探與正直法庭", titleEn: "Prob Courtroom",
    hook: "字根 prob＝試、好——法庭專管試探、核准、正直與敗類。",
    script:
      "probe 探針進場。probity 正直法官。approbation 核准掌聲；reprobate 敗類被告。probation 觀察期；improbable 機率低到法庭皺眉——書記官：probe 要有協議，probity 不能只靠自我介紹。",
    reviewHooks: ["prob＝試／好：probe/probity/approbation/reprobate/probation", "reprobate＝敗類／譴責"],
    pitfalls: ["approbation＝讚許核准", "probity＝正直誠實"],
    members: [
      card("probe", "探查；探針", "探針進場", "Probe the missingness mechanism.", "探查缺失機制。"),
      card("probity", "正直；廉潔", "正直法官", "Hire for probity, not only h-index.", "聘人看正直，不只 h 指數。"),
      card("approbation", "讚許；核准", "核准掌聲", "Seek approbation via registered reports.", "用註冊報告尋求核准。"),
      card("reprobate", "敗類；譴責", "敗類被告", "Reprobate fraud without theatrical cruelty.", "譴責造假但不作秀殘忍。"),
      card("probation", "緩刑；試用期", "觀察期", "New metrics stay on probation until validated.", "新指標驗證前留在觀察期。"),
      card("improbable", "不太可能的", "機率皺眉", "An improbable effect size needs skepticism.", "不太可能的效應量需要懷疑。"),
      card("probability", "機率", "法庭機率板", "State probability models explicitly.", "明確陳述機率模型。", "story"),
      card("probative", "可作證據的", "有證明力", "Only probative logs enter the record.", "只有可作證據的日誌進紀錄。", "story"),
      card("approval", "批准", "核准近親", "Ethics approval is not scientific proof.", "倫理批准不是科學證明。", "story"),
      card("disapprove", "不贊成", "反對票", "Disapprove hype in cover letters.", "反對投稿信炒作。", "story"),
      card("test", "試驗", "試探動作", "Test preregistered hypotheses first.", "先檢驗預註冊假說。", "story"),
      card("trial period", "試用期", "觀察鄰居", "Keep a trial period for new dashboards.", "新儀表板保留試用期。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Integrity; honesty:", promptZh: "正直：", choices: ["probity", "ridicule", "cacophony", "morph"], answer: "probity" },
      { id: "q2", type: "sense", promptEn: "Approval; praise:", promptZh: "讚許核准：", choices: ["approbation", "repugnant", "impetuous", "submerge"], answer: "approbation" },
      { id: "q3", type: "sense", promptEn: "Morally unprincipled person; condemn:", promptZh: "敗類／譴責：", choices: ["reprobate", "memento", "euphony", "mediate"], answer: "reprobate" },
    ],
  },
  {
    id: "root-reg-01", type: "root", elementLemma: "reg/rex", priority: "B",
    titleZh: "reg｜王權調度室", titleEn: "Reg Throne Room",
    hook: "字根 reg/rex＝統治——調度室專管國王、攝政、體制與規則。",
    script:
      "regal 王者氣場；regent 攝政代班。regime 統治體制；regicide 弒君大戲。regulate／regular 用規則排班；interregnum 王位空窗期——大臣諫言：科學要 regulate，不要 regicide 式互砍。",
    reviewHooks: ["reg＝統治：regal/regent/regime/regulate/regicide/interregnum", "interregnum＝空位期"],
    pitfalls: ["regime 可指政權或制度／養生制度", "regicide＝弒君"],
    members: [
      card("regal", "帝王的；莊嚴的", "王者氣場", "Regal prose cannot hide weak n.", "帝王文風藏不住弱樣本。"),
      card("regent", "攝政；董事", "代班統治", "An interim regent should not rewrite norms alone.", "臨時攝政不該獨改規範。"),
      card("regime", "政權；體制；養生制", "統治體制", "A data-sharing regime needs enforcement.", "資料共享體制需要執行。"),
      card("regicide", "弒君；弒君者", "砍王位", "Methodological 'regicide' of sacred cows needs evidence.", "對聖牛的方法弒君需要證據。"),
      card("regulate", "管制；調節", "用規則排班", "Regulate access to identifiable data.", "管制可識別資料近用。"),
      card("regular", "規則的；定期的", "排班正常", "Run regular audits of repositories.", "定期稽核儲庫。"),
      card("interregnum", "空位期；過渡期", "王位空窗", "During an interregnum, freeze risky protocol changes.", "空位期凍結高風險規程變更。"),
      card("regulation", "法規；調節", "規則文本", "Follow human-subjects regulation closely.", "嚴格遵守人體研究法規。", "story"),
      card("ruler", "統治者；尺", "拿尺的王", "Be a ruler of processes, not of people by fear.", "用流程統治，不用恐懼統治人。", "story"),
      card("reign", "統治時期", "在位期間", "During her reign as editor, open data rose.", "她任編輯期間開放資料上升。", "story"),
      card("sovereign", "主權的；君主", "最高統治", "No lab is sovereign over ethics boards.", "沒有實驗室對倫理委員會擁有主權。", "story"),
      card("govern", "治理", "治理動作", "Govern incentives, not only individuals.", "治理誘因，不只治理個人。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Killing of a king:", promptZh: "弒君：", choices: ["regicide", "ridicule", "immerse", "philately"], answer: "regicide" },
      { id: "q2", type: "sense", promptEn: "Gap between reigns; interim:", promptZh: "空位期：", choices: ["interregnum", "impetus", "euphony", "memento"], answer: "interregnum" },
      { id: "q3", type: "sense", promptEn: "Royal; majestic:", promptZh: "帝王的：", choices: ["regal", "repugnant", "mutable", "mediocre"], answer: "regal" },
    ],
  },
  {
    id: "prefix-mis-01", type: "prefix", elementLemma: "mis-", priority: "B",
    titleZh: "mis-｜搞錯工廠", titleEn: "Mis- Mistake Factory",
    hook: "字首 mis-＝錯——工廠專產誤會、看錯、厭世錯覺。",
    script:
      "misconstrue 理解線路接反。misapprehension 整廠誤會。misgivings 心裡咯噔的錯感。misfortune 倒霉流水線。mischief 小惡作劇；misanthrope 厭世品管員——廠長：mis- 開頭先假設『可能搞錯』再發火。",
    reviewHooks: ["mis-＝錯：misconstrue/misapprehension/misgivings/misfortune/misanthrope", "misconstrue＝誤解"],
    pitfalls: ["misanthrope＝厭世者／厭惡人類者", "misgivings＝疑慮"],
    members: [
      card("misconstrue", "誤解；曲解", "線路接反", "Do not misconstrue caution as hostility.", "不要把謹慎曲解成敵意。"),
      card("misapprehension", "誤會；誤解", "整廠誤會", "Clear the misapprehension that p equals truth.", "澄清 p 等於真理的誤會。"),
      card("misgivings", "疑慮；不安", "心裡咯噔", "Share misgivings about underpowered designs.", "分享對低檢定力設計的疑慮。"),
      card("misfortune", "不幸；厄運", "倒霉流水線", "Misfortune is not a methods section.", "不幸不是方法段。"),
      card("mischief", "惡作劇；損害", "小惡作劇", "Statistical mischief hides in silent forks.", "統計惡作劇藏在沉默分叉。"),
      card("misanthrope", "厭世者", "厭世品管", "A misanthrope can still write fair reviews.", "厭世者仍可寫公平審查。"),
      card("mismanage", "管理不善", "工廠管爆", "Mismanage incentives and fraud follows.", "誘因管理不善，造假隨之。", "story"),
      card("mislead", "誤導", "指標路牌錯", "Pretty graphs can mislead.", "漂亮圖可能誤導。", "story"),
      card("mistake", "錯誤", "工廠出品", "Admit mistakes faster than rumors spread.", "認錯要比謠言快。", "story"),
      card("misread", "誤讀", "看錯儀表", "Misread confidence intervals carefully—then reread.", "小心誤讀信賴區間——然後重讀。", "story"),
      card("miscount", "數錯", "計數翻車", "A miscount of exclusions sank the paper.", "排除數錯讓論文翻車。", "story"),
      card("mislabel", "貼錯標籤", "標籤印錯", "Mislabeled files destroy trust.", "貼錯標籤的檔案摧毀信任。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Interpret wrongly:", promptZh: "誤解曲解：", choices: ["misconstrue", "liberate", "rectify", "immerse"], answer: "misconstrue" },
      { id: "q2", type: "sense", promptEn: "Doubts; feelings of doubt:", promptZh: "疑慮：", choices: ["misgivings", "euphony", "regal", "morph"], answer: "misgivings" },
      { id: "q3", type: "sense", promptEn: "Hater of humankind:", promptZh: "厭世者：", choices: ["misanthrope", "bibliophile", "pugilist", "regent"], answer: "misanthrope" },
    ],
  },
  {
    id: "rhyme-ceive-01", type: "rhyme", elementLemma: "-ceive/-ceit", priority: "B",
    titleZh: "ceive｜拿騙感官館", titleEn: "Ceive Sense Museum",
    hook: "ceive＝拿——感官館專管拿到真相、拿到假象、自負展覽。",
    script:
      "perceive 接收到感知；conceive 腦中構思拿到想法。deceive 讓人拿到假貨；deceptive 假貨包裝。conceit 自負展覽品；conceivable／receipt 可設想與收據——導覽：conceive≠ deceive；conceit 很臭。",
    reviewHooks: ["ceive＝拿：perceive/conceive/deceive/conceit/conceivable", "deceive＝欺騙"],
    pitfalls: ["conceive＝構想／懷孕（多義）", "conceit＝自負"],
    members: [
      card("perceive", "感知；察覺", "收到感知", "Perceive uncertainty as information.", "把不確定當資訊察覺。", "phonetic"),
      card("conceive", "構想；懷孕", "腦中拿到想法", "Conceive the analysis before collection.", "收集前先構想分析。", "phonetic"),
      card("deceive", "欺騙", "讓人拿到假貨", "Do not deceive with truncated axes.", "不要用截斷軸欺騙。", "phonetic"),
      card("deceptive", "欺騙性的", "假貨包裝", "Deceptive visualizations deserve rejection.", "欺騙性視覺化該被拒。", "phonetic"),
      card("conceit", "自負；幻想", "自負展覽", "Intellectual conceit blocks correction.", "智識自負阻擋勘誤。", "phonetic"),
      card("conceivable", "可想像的", "拿得到想像", "Every conceivable robustness check need not run—but justify skips.", "不必跑遍可想像的穩健檢查——但要說明跳過。", "phonetic"),
      card("receipt", "收據；收到", "拿到證明", "Keep receipt of ethics approval.", "保留倫理批准收據。", "phonetic"),
      card("perception", "知覺；看法", "感知成品", "Perception of rigor rises with open code.", "開放程式碼提升嚴謹知覺。", "story"),
      card("misconceive", "誤解構想", "拿到錯想法", "Misconceive the estimand and all fails.", "誤解目標量則全盤失敗。", "story"),
      card("receive", "接收", "拿到手上", "Receive critique without theater.", "接收批評不作秀。", "story"),
      card("concept", "概念", "構想鄰居", "Define the concept before measuring it.", "測量前先定義概念。", "story"),
      card("deceitful", "欺詐的", "假貨人格", "Deceitful reporting ends careers.", "欺詐報告終結職涯。", "story"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Mislead; trick:", promptZh: "欺騙：", choices: ["deceive", "rectify", "summon", "liberate"], answer: "deceive" },
      { id: "q2", type: "sense", promptEn: "Excessive pride in oneself:", promptZh: "自負：", choices: ["conceit", "impetus", "euphony", "memento"], answer: "conceit" },
      { id: "q3", type: "sense", promptEn: "Form an idea; imagine:", promptZh: "構想：", choices: ["conceive", "submerge", "impugn", "philately"], answer: "conceive" },
    ],
  },
  {
    id: "sem-praise-01", type: "semantic", elementLemma: "praise-vs-blame", priority: "B",
    titleZh: "讚美↔責罵｜對打擂台", titleEn: "Praise vs Blame Duel",
    hook: "語義對打：誇到天上 vs 罵到落地——GRE 語氣超愛這組。",
    script:
      "讚美隊：laud／acclaim／commend／applaud／eulogize／panegyric／encomium——頒獎典禮模式。責罵隊：condemn／reprove／rebuke／castigate／upbraid／lambaste——法庭咆哮模式。口令：讚要具體，罵要對事。",
    reviewHooks: ["讚：laud/acclaim/commend/eulogize/panegyric", "罵：condemn/rebuke/castigate/lambaste"],
    pitfalls: ["eulogize 常＝頌揚（可含悼詞義）", "castigate／lambaste＝嚴厲譴責"],
    members: [
      card("laud", "讚美", "頒獎話筒", "Laud the replication, not only the novelty.", "讚美複現，不只新奇。", "contrast"),
      card("acclaim", "歡呼；稱讚", "全場鼓掌", "Critical acclaim is not validation.", "批評界歡呼不是驗證。", "contrast"),
      card("commend", "推薦；稱讚", "正式表揚", "Commend transparent limitation sections.", "表揚透明的限制段。", "contrast"),
      card("applaud", "鼓掌讚許", "拍巴掌", "Applaud corrections as courage.", "把勘誤當勇氣鼓掌。", "contrast"),
      card("eulogize", "頌揚", "悼詞式誇", "Do not eulogize a living theory past its data.", "不要把活理論頌揚超過資料。", "contrast"),
      card("panegyric", "頌詞", "長篇誇文", "A panegyric abstract oversells.", "頌詞式摘要過度銷售。", "contrast"),
      card("encomium", "讚辭", "正式誇文", "Save encomiums for after audit.", "稽核後再寫讚辭。", "contrast"),
      card("condemn", "譴責", "判有罪語氣", "Condemn fabrication unequivocally.", "毫不含糊譴責捏造。", "contrast"),
      card("reprove", "責備", "溫和罵", "Reprove sloppy logs early.", "及早責備草率日誌。", "contrast"),
      card("rebuke", "斥責", "較重罵", "A public rebuke needs due process.", "公開斥責需要正當程序。", "contrast"),
      card("castigate", "嚴厲譴責", "重訓", "Castigate incentives, then fix them.", "嚴厲譴責誘因，然後修好。", "contrast"),
      card("lambaste", "痛罵", "暴風罵", "Lambaste hype in methods clubs.", "在方法讀書會痛罵炒作。", "contrast"),
    ],
    quiz: [
      { id: "q1", type: "sense", promptEn: "Praise highly:", promptZh: "讚美：", choices: ["laud", "impugn", "submerge", "misconstrue"], answer: "laud" },
      { id: "q2", type: "sense", promptEn: "Harshly criticize; scold severely:", promptZh: "嚴厲譴責：", choices: ["castigate", "commend", "acclaim", "euphony"], answer: "castigate" },
      { id: "q3", type: "sense", promptEn: "Formal expression of praise:", promptZh: "頌詞／讚辭：", choices: ["encomium", "repugnant", "impetuous", "rectify"], answer: "encomium" },
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
  `${JSON.stringify({ version: "v0.7-p2b01", total: lessonIndex.length, lessons: lessonIndex }, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(humorDir, "index.json"),
  `${JSON.stringify(
    {
      version: "v0.7-p2b01",
      status: "p2-batch01",
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
  path.join(humorDir, "P2-BATCH01-REPORT.md"),
  `# P2-batch01 完成報告（幽默優先）

| 指標 | 數值 |
|------|------|
| 本批寫入 | ${written.length} |
| 總家族 | ${allClusters.length} |
| 獨特幽默詞 | ${unique.size} |
| 距 P2(2500) | ${report.gapTo2500} |
| 距 4000 | ${report.gapTo4000} |

## 本批家族（人設向）
${written.map((w) => `- \`${w.id}\`（${w.n} 詞）`).join("\n")}

${blocked.length ? `## 未寫入\n${blocked.map((b) => `- ${b.id}: ${b.issues.join(", ")}`).join("\n")}` : ""}
`,
);

console.log(JSON.stringify(report, null, 2));
