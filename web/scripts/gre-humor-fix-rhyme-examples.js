/**
 * Fix fabricated speakLines in 押韻派對 (rhyme) clusters — stage by stage.
 *
 * node web/scripts/gre-humor-fix-rhyme-examples.js --stage 1
 * node web/scripts/gre-humor-fix-rhyme-examples.js --stage 2
 * node web/scripts/gre-humor-fix-rhyme-examples.js --stage all
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
  for (const w of letter.words || []) {
    vocabMap.set(String(w.en || "").toLowerCase(), w);
  }
}

const FAB =
  /Cue the |gag sticks|walks on|On the exam,|most nearly means|Critics argued that the policy would|In the passage,|Picture the |Hold the meaning steady|A careful reader links|signals a shift toward|記住考意|出場|梗就黏住|標示語氣轉向|想像「/i;

const STAGE1_IDS = [
  "rhyme-our-01",
  "rhyme-edge-01",
  "rhyme-eak-01",
  "rhyme-ant-01",
  "rhyme-vise-01",
  "rhyme-sist-01",
  "rhyme-oid-01",
  "rhyme-ire-01",
];

const STAGE2_IDS = null; // all remaining rhyme-* not in stage1

/** Curated classroom examples: headword -> {en, zh} */
const CURATED = {
  // --- our ---
  flour: {
    en: "The baker sifted the flour before mixing the dough.",
    zh: "麵包師在和麵前先篩過麵粉。",
  },
  contour: {
    en: "The map’s contour lines mark changes in elevation.",
    zh: "地圖上的等高線標示海拔變化。",
  },
  vapour: {
    en: "Water vapour rose from the hot springs into the cold air.",
    zh: "水蒸氣從溫泉升入冷空氣中。",
  },
  harbor: {
    en: "Ships waited in the harbor until the storm passed.",
    zh: "船隻在港口等候，直到暴風雨過去。",
  },
  harbour: {
    en: "Ships waited in the harbour until the storm passed.",
    zh: "船隻在港口等候，直到暴風雨過去。",
  },
  // --- edge ---
  wedge: {
    en: "She used a wooden wedge to keep the door open.",
    zh: "她用木楔把門撐開。",
  },
  dredge: {
    en: "Workers dredged the canal to keep it navigable.",
    zh: "工人疏浚運河以維持通航。",
  },
  acknowledge: {
    en: "The author acknowledged several helpful reviewers in the preface.",
    zh: "作者在序言中感謝多位有幫助的審稿人。",
  },
  knowledge: {
    en: "Background knowledge of the period helps explain the satire.",
    zh: "對該時代的背景知識有助理解這則諷刺。",
  },
  // --- eak ---
  creak: {
    en: "The old stairs creaked under every careful step.",
    zh: "舊樓梯在每一步小心踩踏下嘎吱作響。",
  },
  speak: {
    en: "Few witnesses were willing to speak openly about the incident.",
    zh: "很少證人願意公開談論這起事件。",
  },
  tweak: {
    en: "The editor asked her to tweak the opening paragraph for clarity.",
    zh: "編輯請她微調開頭段落以更清楚。",
  },
  bespoke: {
    en: "He wore a bespoke suit tailored for the ceremony.",
    zh: "他穿著為典禮訂製的西裝。",
  },
  awoke: {
    en: "She awoke before dawn and reviewed her notes.",
    zh: "她黎明前醒來，複習筆記。",
  },
  smoke: {
    en: "Smoke drifted across the valley after the controlled burn.",
    zh: "計畫燒除後，煙霧飄過山谷。",
  },
  // --- ant ---
  buoyant: {
    en: "Despite setbacks, the team remained buoyant about the project.",
    zh: "儘管受挫，團隊對專案仍保持樂觀輕快。",
  },
  constant: {
    en: "The only constant in the data was the high missing rate.",
    zh: "資料裡唯一不變的是高缺失率。",
  },
  vibrant: {
    en: "The city has a vibrant arts scene that draws young writers.",
    zh: "這座城市有充滿活力的藝術圈，吸引年輕寫作者。",
  },
  // --- vise (tighten lab jargon into general GRE tone) ---
  advise: {
    en: "Counselors advise students to read the prompt carefully.",
    zh: "輔導老師建議學生仔細閱讀題幹。",
  },
  advice: {
    en: "She ignored the advice and submitted an incomplete draft.",
    zh: "她忽略建議，交了不完整的草稿。",
  },
  advisor: {
    en: "His thesis advisor insisted on clearer definitions.",
    zh: "他的論文指導教授堅持要更清楚的定義。",
  },
  revision: {
    en: "The second revision fixed several factual errors.",
    zh: "第二版修訂改正了數處事實錯誤。",
  },
  supervisor: {
    en: "The lab supervisor reviewed the safety checklist twice.",
    zh: "實驗室督導把安全清單檢查了兩次。",
  },
  vice: {
    en: "Procrastination became a vice that delayed every deadline.",
    zh: "拖延成了惡習，每一個期限都被延誤。",
  },
  vicious: {
    en: "A vicious rumor spread faster than the official statement.",
    zh: "惡毒謠言傳得比官方聲明還快。",
  },
  "vice versa": {
    en: "If A implies B, it does not follow that B implies A, and vice versa must be checked.",
    zh: "若 A 蘊含 B，並不表示 B 蘊含 A，反之亦然仍須檢查。",
  },
  envision: {
    en: "Planners envision a quieter downtown with fewer cars.",
    zh: "規劃者設想一個車輛更少、更安靜的市中心。",
  },
  // --- sist ---
  insist: {
    en: "The editors insist on transparent methodology sections.",
    zh: "編輯堅持方法段必須透明。",
  },
  persistence: {
    en: "Her persistence finally produced a complete codebook.",
    zh: "她的堅持終於產出完整編碼簿。",
  },
  assist: {
    en: "Volunteers assist visitors in finding the archives.",
    zh: "志工協助訪客尋找檔案。",
  },
  assistance: {
    en: "Financial assistance made the field season possible.",
    zh: "財務協助使田野季得以進行。",
  },
  consist: {
    en: "A strong essay should consist of claims backed by evidence.",
    zh: "好文章應由有證據支撐的主張組成。",
  },
  consistent: {
    en: "Keep the notation consistent throughout the paper.",
    zh: "全文符號用法保持一致。",
  },
  exist: {
    en: "Null results exist and deserve publication.",
    zh: "虛無結果存在，也值得發表。",
  },
  existence: {
    en: "Scholars still debate the existence of that lost manuscript.",
    zh: "學者仍在辯論那份失落手稿是否存在。",
  },
  resistance: {
    en: "There was strong resistance to changing the curriculum.",
    zh: "更改課綱遭遇強烈阻力。",
  },
  subsist: {
    en: "The family could barely subsist on seasonal wages alone.",
    zh: "這家人幾乎無法僅靠季節性工資維生。",
  },
  // --- oid ---
  android: {
    en: "The film’s android raises questions about what counts as human.",
    zh: "電影中的機器人引發「何謂人類」的問題。",
  },
  asteroid: {
    en: "Astronomers tracked an asteroid passing near Earth.",
    zh: "天文學家追蹤一顆近地掠過的小行星。",
  },
  humanoid: {
    en: "The statue has a roughly humanoid outline.",
    zh: "雕像大致呈類人輪廓。",
  },
  tabloid: {
    en: "Tabloid headlines exaggerated a minor dispute into a scandal.",
    zh: "小報標題把小爭執誇大成醜聞。",
  },
  factoid: {
    en: "The article repeated a popular factoid that has never been verified.",
    zh: "文章重複了一則從未被證實的似是而非「事實」。",
  },
  spheroid: {
    en: "The planet is better described as an oblate spheroid than a perfect sphere.",
    zh: "這顆行星較像扁球體，而不是完美圓球。",
  },
  ovoid: {
    en: "The pottery fragment has an ovoid shape.",
    zh: "陶片呈卵形。",
  },
  typhoid: {
    en: "Poor sanitation once made typhoid a seasonal threat in the city.",
    zh: "衛生條件差時，傷寒曾是城市的季節性威脅。",
  },
  celluloid: {
    en: "Early filmmakers stored celluloid reels in fireproof vaults.",
    zh: "早期電影人把賽璐珞膠卷存放在防火庫。",
  },
  alkaloid: {
    en: "Caffeine is a well-known plant alkaloid.",
    zh: "咖啡因是眾所周知的植物生物鹼。",
  },
  cabinet: {
    en: "Rare specimens were locked in a glass cabinet.",
    zh: "稀有標本鎖在玻璃標本櫃裡。",
  },
  labelgun: {
    en: "Staff used a label gun to mark each box before shipping.",
    zh: "出貨前工作人員用標籤槍標示每一箱。",
  },
  meteor: {
    en: "A bright meteor streaked across the night sky.",
    zh: "一顆明亮流星劃過夜空。",
  },
  headline: {
    en: "The headline promised drama the article never delivered.",
    zh: "標題承諾的戲劇性，正文並未兌現。",
  },
  egg: {
    en: "The recipe begins with one beaten egg.",
    zh: "食譜從一顆打散的蛋開始。",
  },
  robot: {
    en: "The warehouse uses a robot to move heavy crates.",
    zh: "倉庫用機器人搬運沉重貨箱。",
  },
  // --- ire ---
  umpire: {
    en: "The umpire called the runner out at second base.",
    zh: "裁判裁定跑者在二壘出局。",
  },
  spire: {
    en: "The cathedral’s spire dominates the skyline.",
    zh: "大教堂尖塔主宰天際線。",
  },
  mire: {
    en: "The project sank into a bureaucratic mire of overlapping permits.",
    zh: "專案陷入重疊許可的官僚泥沼。",
  },
  quagmire: {
    en: "Negotiations became a quagmire of conflicting demands.",
    zh: "談判變成相互衝突要求的泥潭。",
  },
  enquire: {
    en: "Visitors may enquire at the desk about guided tours.",
    zh: "訪客可向櫃檯詢問導覽行程。",
  },
  entire: {
    en: "She spent the entire afternoon revising one paragraph.",
    zh: "她整個下午都在修訂同一段。",
  },
  attire: {
    en: "Formal attire is required for the evening reception.",
    zh: "晚間酒會要求正式服裝。",
  },
  whistle: {
    en: "The referee blew the whistle to stop play.",
    zh: "裁判吹哨暫停比賽。",
  },
  boots: {
    en: "She pulled on muddy boots before entering the field site.",
    zh: "進入田野地點前，她穿上沾泥的靴子。",
  },
  tower: {
    en: "A clock tower stands at the center of the old campus.",
    zh: "舊校區中央矗立一座鐘樓。",
  },
  mudsplash: {
    en: "A passing truck left a mudsplash across the sidewalk.",
    zh: "駛過的卡車在人行道濺起泥漿。",
  },
  tux: {
    en: "He rented a tux for the awards dinner.",
    zh: "他為頒獎晚宴租了一套燕尾服。",
  },
  stopwatch: {
    en: "The coach timed each sprint with a stopwatch.",
    zh: "教練用秒錶為每次衝刺計時。",
  },
  flag: {
    en: "Energy began to flag after the third consecutive night shift.",
    zh: "連續第三個夜班後，精力開始衰退。",
  },
  puddle: {
    en: "Children jumped over every puddle after the rain.",
    zh: "雨後孩子們跳過每一個水坑。",
  },
};

// Stage 2 curated additions (remaining rhyme families)
Object.assign(CURATED, {
  // ancy
  buoyancy: {
    en: "The buoyancy of the raft surprised even experienced sailors.",
    zh: "木筏的浮力連老練水手都感到意外。",
  },
  deficiency: {
    en: "A vitamin deficiency can cause fatigue and poor concentration.",
    zh: "維生素缺乏可能造成疲勞與注意力下降。",
  },
  proficiency: {
    en: "Language proficiency improves with daily deliberate practice.",
    zh: "語言熟練度靠每日刻意練習提升。",
  },
  efficiency: {
    en: "The new schedule improved the efficiency of lab rotations.",
    zh: "新班表提升了實驗室輪值效率。",
  },
  sufficiency: {
    en: "Judges questioned the sufficiency of the evidence presented.",
    zh: "法官質疑所提證據是否充分。",
  },
  emergency: {
    en: "In an emergency, exit through the marked stairwells.",
    zh: "緊急情況下請由標示的樓梯間離開。",
  },
  agency: {
    en: "A federal agency issued new guidelines on disclosure.",
    zh: "聯邦機構發布新的揭露指引。",
  },
  vacancy: {
    en: "There is one vacancy left in the seminar.",
    zh: "研討班還剩一個名額空缺。",
  },
  infancy: {
    en: "The technology is still in its infancy.",
    zh: "這項技術仍處於起步階段。",
  },
  discrepancy: {
    en: "A discrepancy between the two reports raised suspicion.",
    zh: "兩份報告之間的出入引起懷疑。",
  },
  constancy: {
    en: "Her constancy under pressure impressed the committee.",
    zh: "她在壓力下的恆心讓委員會印象深刻。",
  },
  hesitancy: {
    en: "Hesitancy in the answer suggested uncertainty.",
    zh: "回答時的猶豫顯示不確定。",
  },
  // ule
  molecule: {
    en: "Each water molecule contains two hydrogen atoms.",
    zh: "每個水分子含有兩個氫原子。",
  },
  globule: {
    en: "Oil formed tiny globules on the surface of the soup.",
    zh: "湯面浮起細小油珠。",
  },
  granule: {
    en: "Sugar granules stuck to the damp spoon.",
    zh: "糖粒黏在潮濕的湯匙上。",
  },
  capsule: {
    en: "The medicine is sold in easy-to-swallow capsules.",
    zh: "藥品做成易吞服的膠囊。",
  },
  schedule: {
    en: "Please post the exam schedule on the door.",
    zh: "請把考試時間表貼在門上。",
  },
  ridicule: {
    en: "Harsh ridicule can silence useful dissent.",
    zh: "刻薄嘲弄可能讓有用的異議沉默。",
  },
  minuscule: {
    en: "Only a minuscule fraction of the samples failed the test.",
    zh: "只有極小比例的樣本未通過測試。",
  },
  animalcule: {
    en: "Early microscopists called tiny organisms animalcules.",
    zh: "早期顯微鏡學者稱微小生物為微動物。",
  },
  module: {
    en: "Complete the ethics module before fieldwork begins.",
    zh: "田野開始前先完成倫理模組。",
  },
  rule: {
    en: "The first rule of the workshop is to cite every claim.",
    zh: "工作坊第一條規則是每項主張都要引用。",
  },
  school: {
    en: "The school closed early because of the storm.",
    zh: "因暴風雨學校提早放學。",
  },
  tool: {
    en: "A checklist is a simple but powerful tool.",
    zh: "清單是簡單卻有力的工具。",
  },
  // acious
  fallacious: {
    en: "The fallacious leap from correlation to causation weakened the essay.",
    zh: "從相關跳到因果的謬誤削弱了這篇文章。",
  },
  namebadge: {
    en: "Please wear your name badge during the conference.",
    zh: "會議期間請佩戴胸牌。",
  },
  // eous
  ligneous: {
    en: "The fossil preserved ligneous structures from an ancient tree.",
    zh: "化石保存了古樹的木質結構。",
  },
  osseous: {
    en: "Osseous tissue appeared clearly on the X-ray.",
    zh: "X 光上清楚可見骨組織。",
  },
  // uous
  deciduous: {
    en: "Deciduous trees lose their leaves each autumn.",
    zh: "落葉樹每年秋天落葉。",
  },
  arduous: {
    en: "Climbing the ridge in deep snow was an arduous task.",
    zh: "在深雪中攀登山脊是艱巨任務。",
  },
  // ment / sion leftovers
  salary: {
    en: "Starting salary depends on experience and location.",
    zh: "起薪取決於經驗與地點。",
  },
  parade: {
    en: "Crowds lined the street for the holiday parade.",
    zh: "人群沿街等候假日遊行。",
  },
  bell: {
    en: "The school bell rang at exactly three o’clock.",
    zh: "學校鈴聲在三點整響起。",
  },
  // --- stage2 remaining fabs ---
  dancefloor: {
    en: "Couples filled the dance floor as soon as the band began.",
    zh: "樂隊一開場，舞伴就佔滿舞池。",
  },
  speaker: {
    en: "Please adjust the speaker volume before the lecture starts.",
    zh: "講座開始前請先調整音箱音量。",
  },
  truthserum2: {
    en: "The comic imagined a truth serum that made every character confess.",
    zh: "這部喜劇想像一種吐實藥，讓每個角色都坦白。",
  },
  liarhat: {
    en: "In the skit, the liar’s hat lit up whenever he exaggerated.",
    zh: "短劇裡，騙子一誇大帽子就會亮起。",
  },
  wiseowl: {
    en: "Children called the librarian their wise owl for hard questions.",
    zh: "孩子們把圖書館員叫作解難題的智慧貓頭鷹。",
  },
  bigpocket: {
    en: "The coat’s big pocket held an entire field notebook.",
    zh: "外套的大口袋裝得下一整本田野筆記。",
  },
  sharpeye: {
    en: "A sharp eye for detail caught the mismatched footnote.",
    zh: "對細節的銳眼抓到了對不上的腳註。",
  },
  partyhat: {
    en: "Each guest received a paper party hat at the door.",
    zh: "每位賓客進門都拿到一頂紙派對帽。",
  },
  playlist: {
    en: "She shared a playlist of quiet study songs.",
    zh: "她分享了一份安靜念書用的歌單。",
  },
  clemency: {
    en: "The governor granted clemency after new evidence emerged.",
    zh: "新證據出現後，州長予以寬赦。",
  },
  transparency: {
    en: "Budget transparency helps the public track spending.",
    zh: "預算透明有助公眾追蹤支出。",
  },
  resiliency: {
    en: "Community resiliency showed in how quickly shops reopened.",
    zh: "店舖多快重新開門，顯示出社區韌性。",
  },
  insufficiency: {
    en: "The insufficiency of funding delayed the survey.",
    zh: "資金不足拖延了調查。",
  },
  fluency: {
    en: "Fluency in a second language takes years of practice.",
    zh: "第二語言流利需要多年練習。",
  },
  consistency: {
    en: "Consistency across chapters makes the book easier to follow.",
    zh: "各章一致性讓書更好讀。",
  },
  urgency: {
    en: "The urgency of the deadline left little time for revision.",
    zh: "截止日期的急迫性讓修訂時間所剩無幾。",
  },
  frequency: {
    en: "They measured the frequency of errors in each draft.",
    zh: "他們測量每一稿的錯誤頻率。",
  },
  lamp: {
    en: "A desk lamp provided the only light in the archive room.",
    zh: "檔案室裡只靠一盞檯燈照明。",
  },
  mayor: {
    en: "The mayor announced a new public-library budget.",
    zh: "市長宣布新的公共圖書館預算。",
  },
  righteous: {
    en: "His righteous tone made compromise difficult.",
    zh: "他那自以為正義的語氣讓妥協很難。",
  },
  hall: {
    en: "Exhibits filled the main hall of the museum.",
    zh: "展品擺滿博物館主展廳。",
  },
  rock: {
    en: "Geologists classified the rock by mineral content.",
    zh: "地質學家依礦物含量為岩石分類。",
  },
  wood: {
    en: "The bench was carved from a single piece of wood.",
    zh: "長椅由整塊木頭雕成。",
  },
  bone: {
    en: "The fossilized bone was carefully cleaned in the lab.",
    zh: "化石骨頭在實驗室被仔細清理。",
  },
  hat: {
    en: "He tipped his hat as a polite greeting.",
    zh: "他輕觸帽沿以示禮貌問候。",
  },
  guide: {
    en: "A local guide explained the history of each mural.",
    zh: "當地導覽解說每幅壁畫的歷史。",
  },
  door: {
    en: "Please keep the door closed during the recording.",
    zh: "錄音期間請把門關上。",
  },
  nodule: {
    en: "The scan showed a small nodule that required follow-up.",
    zh: "掃描顯示一個需追蹤的小結節。",
  },
  majuscule: {
    en: "Medieval manuscripts often begin chapters with a decorated majuscule.",
    zh: "中世紀手稿常用華麗大寫字母開啟章節。",
  },
  vestibule: {
    en: "Guests waited in the vestibule before entering the hall.",
    zh: "賓客在進入大廳前於前廳等候。",
  },
  tinyshop: {
    en: "A tiny shop on the corner sells used paperbacks.",
    zh: "轉角小店賣二手平裝書。",
  },
  magnifier: {
    en: "She examined the watermark with a pocket magnifier.",
    zh: "她用袖珍放大鏡檢查浮水印。",
  },
  pill: {
    en: "The doctor prescribed one pill each morning.",
    zh: "醫生開立每天早上一顆藥丸。",
  },
  letterblock: {
    en: "Children arranged wooden letter blocks to spell their names.",
    zh: "孩子用木製字母積木拼自己的名字。",
  },
  stall: {
    en: "The market stall sold herbs and dried fruit.",
    zh: "市集攤位賣香草與乾果。",
  },
  djbooth: {
    en: "The DJ booth overlooked the crowded dance floor.",
    zh: "DJ 台俯瞰擁擠的舞池。",
  },
  tail: {
    en: "The dog wagged its tail when the door opened.",
    zh: "門一開，狗就搖尾巴。",
  },
  party: {
    en: "They hosted a quiet reading party instead of a loud celebration.",
    zh: "他們辦安靜的讀書派對，而不是喧鬧慶祝。",
  },
  oil: {
    en: "A thin film of oil covered the surface of the puddle.",
    zh: "水坑表面覆著一層薄油。",
  },
});

function isFab(en, zh) {
  return FAB.test(String(en || "")) || FAB.test(String(zh || ""));
}

function stripExampleNoise(s) {
  return String(s || "")
    .replace(/（[^）]*）/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function vocabExample(hw) {
  const v = vocabMap.get(hw.toLowerCase());
  if (!v) return null;
  const candidates = [v.exampleEn, v.example].filter(Boolean);
  for (const raw of candidates) {
    const en = stripExampleNoise(String(raw).split(/（|\(/)[0]);
    if (en.length >= 22 && !isFab(en, "") && new RegExp(`\\b${hw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(en)) {
      let zh = "";
      const m = String(v.example || "").match(/（([^）]+)）/);
      if (m) zh = m[1].trim();
      if (!zh || isFab("", zh) || zh.length < 4) {
        zh = `（對齊詞義）${v.zh ? String(v.zh).split(/｜/)[0].replace(/^(adj|v|n)\.\s*/i, "") : hw}`;
      }
      // Reject meta exam lines even if long
      if (/On the exam,/i.test(en)) continue;
      return { en, zh };
    }
  }
  return null;
}

function fallbackExample(hw, zhGloss) {
  const zh = String(zhGloss || "").split(/；|;/)[0].trim() || hw;
  // Adjective-like
  if (/的$/.test(zh) || /ous$|ic$|ive$|al$|ant$|ent$|oid$/i.test(hw)) {
    return {
      en: `Reviewers called the proposal ${hw}, citing thin evidence.`,
      zh: `審稿人認為該提案「${zh}」，並指出證據薄弱。`,
    };
  }
  // -tion / abstract noun
  if (/tion$|sion$|ance$|ence$|ity$|ment$|ure$/i.test(hw)) {
    return {
      en: `The ${hw} of the argument became the focus of debate.`,
      zh: `爭論的焦點落在該論點的「${zh}」上。`,
    };
  }
  // verb-ish
  if (/ate$|ize$|ise$|ify$|ect$|ude$/i.test(hw)) {
    return {
      en: `Good writers ${hw} carefully rather than rush to conclusions.`,
      zh: `好的寫作者會謹慎地「${zh}」，而不是倉促下結論。`,
    };
  }
  // default noun
  return {
    en: `Students noted every ${hw} that appeared in the sample passage.`,
    zh: `學生記下範例段落中出現的每一處「${zh}」（${hw}）。`,
  };
}

// Soften remaining weak fallbacks — prefer curated + vocab only when fixing fabs
function pickExample(m, force) {
  const hw = String(m.headword || "").toLowerCase();
  if (CURATED[hw]) return CURATED[hw];
  if (CURATED[m.headword]) return CURATED[m.headword];
  if (!force && !isFab(m.speakLineEn, m.speakLineZh)) return null;
  const fromVocab = vocabExample(hw);
  if (fromVocab) return fromVocab;
  // Only invent fallback for clearly fabricated lines
  if (force || isFab(m.speakLineEn, m.speakLineZh)) {
    return fallbackExample(hw, m.zhGloss);
  }
  return null;
}

function syncLesson(cluster) {
  const lessonPath = path.join(lessonDir, `lesson-${cluster.id}.json`);
  if (!fs.existsSync(lessonPath)) return;
  const lesson = JSON.parse(fs.readFileSync(lessonPath, "utf8"));
  lesson.qualityGate = {
    ...(lesson.qualityGate || {}),
    rhymeExamplesFixedAt: new Date().toISOString().slice(0, 10),
  };
  fs.writeFileSync(lessonPath, `${JSON.stringify(lesson, null, 2)}\n`);
}

function stageIds(stage) {
  const all = fs
    .readdirSync(clusterDir)
    .filter((f) => f.startsWith("rhyme-") && f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
  if (stage === 1) return STAGE1_IDS.filter((id) => all.includes(id));
  if (stage === 2) return all.filter((id) => !STAGE1_IDS.includes(id));
  return all;
}

const stageArg = (() => {
  const i = process.argv.indexOf("--stage");
  return i >= 0 ? String(process.argv[i + 1] || "1") : "1";
})();

const ids = stageIds(stageArg === "all" ? "all" : Number(stageArg) === 2 ? 2 : 1);
const report = { stage: stageArg, clusters: [], fixedMembers: 0, skippedOk: 0 };

for (const id of ids) {
  const fp = path.join(clusterDir, `${id}.json`);
  const c = JSON.parse(fs.readFileSync(fp, "utf8"));
  let fixed = 0;
  for (const m of c.members || []) {
    const wasFab = isFab(m.speakLineEn, m.speakLineZh);
    const next = pickExample(m, wasFab);
    if (!next) {
      report.skippedOk += 1;
      continue;
    }
    if (m.speakLineEn === next.en && m.speakLineZh === next.zh) {
      report.skippedOk += 1;
      continue;
    }
    m.speakLineEn = next.en;
    m.speakLineZh = next.zh;
    fixed += 1;
    report.fixedMembers += 1;
  }
  c.qualityGate = {
    ...(c.qualityGate || {}),
    rhymeExamplesStage: `rhyme-fix-${stageArg}`,
    rhymeExamplesFixedAt: new Date().toISOString().slice(0, 10),
  };
  fs.writeFileSync(fp, `${JSON.stringify(c, null, 2)}\n`);
  syncLesson(c);
  report.clusters.push({ id, fixed, n: (c.members || []).length });
}

fs.writeFileSync(
  path.join(humorDir, `RHYME-EXAMPLES-STAGE${stageArg === "all" ? "ALL" : stageArg}-REPORT.md`),
  `# 押韻派對例句修正 · Stage ${stageArg}

| 指標 | 數值 |
|------|------|
| 家族 | ${report.clusters.length} |
| 修正成員 | **${report.fixedMembers}** |

## 各族

${report.clusters.map((r) => `- \`${r.id}\`：修 ${r.fixed}/${r.n}`).join("\n")}

## 原則

1. 優先使用手工潤飾例句（語法正確、義準）  
2. 其次採用主庫乾淨 example（排除 On the exam／Cue 污染）  
3. 僅對仍胡謅者使用保守後備句  
`,
);

console.log(JSON.stringify(report, null, 2));
