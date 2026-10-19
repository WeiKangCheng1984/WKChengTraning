/**
 * Batch 3: remaining root speakLines — natural classroom EN+ZH only.
 * node web/scripts/gre-humor-polish-root-examples-batch3.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const lessonDir = path.join(humorDir, "lessons");

const CURATED = {
  relucent: {
    en: "The lake looked relucent under the late afternoon sun.",
    zh: "午後陽光下，湖面顯得反光發亮。",
  },
  luminescence: {
    en: "Fireflies produce a soft luminescence on warm summer nights.",
    zh: "螢火蟲在溫暖夏夜發出柔和的螢光。",
  },
  manipulation: {
    en: "The scandal involved clear manipulation of financial records.",
    zh: "這樁醜聞涉及明顯操弄財務紀錄。",
  },
  handmade: {
    en: "She sold handmade pottery at the weekend market.",
    zh: "她在週末市集販售手工陶器。",
  },
  demanding: {
    en: "The course is demanding, but students learn a great deal.",
    zh: "這門課要求很高，但學生能學到很多。",
  },
  intermediate: {
    en: "This textbook is designed for intermediate Spanish learners.",
    zh: "這本教科書專為中級西班牙語學習者設計。",
  },
  metric: {
    en: "The metric system uses meters, liters, and kilograms.",
    zh: "公制使用公尺、公升與公斤。",
  },
  mercy: {
    en: "The judge showed mercy and reduced the sentence slightly.",
    zh: "法官展現慈悲，略為減輕刑期。",
  },
  miracle: {
    en: "Surviving the crash without injury seemed like a miracle.",
    zh: "車禍中毫髮無傷，簡直像奇蹟。",
  },
  wonder: {
    en: "Children often wonder why the sky changes color at dusk.",
    zh: "孩子常好奇為何黃昏時天空會變色。",
  },
  reflect: {
    en: "Quiet walks help her reflect on difficult decisions.",
    zh: "安靜散步幫助她反思困難的決定。",
  },
  monitor: {
    en: "Nurses monitor the patient’s heart rate through the night.",
    zh: "護理師整夜監測病患的心率。",
  },
  summon: {
    en: "The king will summon the council at dawn tomorrow.",
    zh: "國王明天黎明將召喚議事會。",
  },
  mutual: {
    en: "Their mutual respect made the collaboration pleasant.",
    zh: "彼此的相互尊重讓合作很愉快。",
  },
  compass: {
    en: "Hikers checked the compass before entering the fog.",
    zh: "登山者進入濃霧前先檢查羅盤。",
  },
  novel: {
    en: "She published her first novel before she turned thirty.",
    zh: "她未滿三十就出版了第一本小說。",
  },
  renewal: {
    en: "Library card renewal takes only a few minutes online.",
    zh: "線上辦理借書證續期只要幾分鐘。",
  },
  enumeration: {
    en: "The census forms require careful enumeration of household members.",
    zh: "普查表格要求仔細清點家戶成員。",
  },
  numerator: {
    en: "In the fraction 3/8, three is the numerator.",
    zh: "在分數三分之八裡，三是分子。",
  },
  supernumerary: {
    en: "Two supernumerary actors stood ready in case of illness.",
    zh: "兩名額外備角演員待命，以防有人生病。",
  },
  synonym: {
    en: "“Begin” and “start” are near synonyms in everyday English.",
    zh: "日常英語裡，begin 與 start 幾乎是同義詞。",
  },
  coordinate: {
    en: "Volunteers will coordinate donations at the shelter.",
    zh: "志工將在收容所協調捐贈物資。",
  },
  ordinance: {
    en: "A city ordinance bans loud music after ten at night.",
    zh: "市政條例禁止晚上十點後大聲播放音樂。",
  },
  armistice: {
    en: "The armistice ended active fighting on the front.",
    zh: "停戰協議結束了前線的交戰。",
  },
  propel: {
    en: "Strong winds can propel a sailboat across the bay.",
    zh: "強風能推動帆船橫渡海灣。",
  },
  pending: {
    en: "Her application is still pending final review.",
    zh: "她的申請仍在等待最終審核。",
  },
  competition: {
    en: "The piano competition attracted students from five countries.",
    zh: "鋼琴比賽吸引了五個國家的學生。",
  },
  petitionary: {
    en: "His petitionary letter asked the council for a hearing.",
    zh: "他的請願信請求議會舉行聽證會。",
  },
  placid: {
    en: "The placid lake mirrored the surrounding pines.",
    zh: "平靜的湖面映出四周的松樹。",
  },
  plea: {
    en: "The lawyer entered a guilty plea on behalf of the client.",
    zh: "律師代表當事人認罪。",
  },
  popular: {
    en: "The museum’s popular exhibit drew long weekend lines.",
    zh: "博物館的熱門特展讓週末大排長龍。",
  },
  impotent: {
    en: "Without funding, the committee felt impotent to help.",
    zh: "沒有經費，委員會覺得無力幫忙。",
  },
  enterprise: {
    en: "The family enterprise grew from one shop into a chain.",
    zh: "這家家族企業從一間店擴成連鎖。",
  },
  express: {
    en: "Please express your concerns clearly before the vote.",
    zh: "表決前請清楚表達你的疑慮。",
  },
  expression: {
    en: "Her expression changed when she heard the news.",
    zh: "聽到消息時，她的表情變了。",
  },
  probe: {
    en: "Scientists will probe the ocean floor with remote sensors.",
    zh: "科學家將用遙測感測器探查海床。",
  },
  probability: {
    en: "The forecast gave a high probability of afternoon rain.",
    zh: "天氣預報顯示午後有高機率降雨。",
  },
  punctual: {
    en: "Punctual guests make dinner parties easier to host.",
    zh: "準時的客人讓晚宴更好辦。",
  },
  reputation: {
    en: "The bakery built a reputation for honest weights and prices.",
    zh: "這間麵包店因秤重與定價誠實而建立名聲。",
  },
  putative: {
    en: "The putative heir suddenly appeared with old documents.",
    zh: "據稱的繼承人突然帶著舊文件現身。",
  },
  tranquility: {
    en: "She valued the tranquility of early morning walks.",
    zh: "她珍惜清晨散步時的平靜。",
  },
  acquiesce: {
    en: "He would not acquiesce to a plan that ignored safety.",
    zh: "他不會默許一個忽略安全的計畫。",
  },
  hush: {
    en: "A sudden hush fell over the crowd before the speech.",
    zh: "演講開始前，人群突然安靜下來。",
  },
  deracinate: {
    en: "War can deracinate families from their ancestral villages.",
    zh: "戰爭可能把家庭從祖居村莊連根拔起。",
  },
  rectitude: {
    en: "Colleagues trusted her because of her known rectitude.",
    zh: "同事因她素來正直而信任她。",
  },
  direct: {
    en: "Please give a direct answer instead of changing the subject.",
    zh: "請直接回答，不要轉移話題。",
  },
  correction: {
    en: "The magazine printed a correction on the next page.",
    zh: "雜誌在下一頁刊出更正。",
  },
  straighten: {
    en: "He paused to straighten the picture on the wall.",
    zh: "他停下腳步，把牆上的畫扶正。",
  },
  upright: {
    en: "Keep the fragile vase upright during the move.",
    zh: "搬運時請把易碎花瓶保持直立。",
  },
  regular: {
    en: "Regular practice improved her piano technique steadily.",
    zh: "規律練習讓她的鋼琴技巧穩步進步。",
  },
  corrupt: {
    en: "Corrupt officials siphoned money from public contracts.",
    zh: "腐敗官員從公共標案中掏空金錢。",
  },
  erupt: {
    en: "Laughter erupted in the hall after the witty remark.",
    zh: "那句俏皮話後，大廳爆發出笑聲。",
  },
  escalate: {
    en: "Diplomats tried hard not to escalate the border dispute.",
    zh: "外交官竭力避免讓邊境爭端升級。",
  },
  outlook: {
    en: "The economic outlook for next year looks cautiously hopeful.",
    zh: "明年的經濟展望顯得審慎樂觀。",
  },
  proscribe: {
    en: "Campus rules proscribe plagiarism in every assignment.",
    zh: "校園規定禁止任何作業抄襲。",
  },
  cutaway: {
    en: "The museum display shows a cutaway of a steam engine.",
    zh: "博物館展示蒸汽引擎的剖面模型。",
  },
  resentment: {
    en: "Years of unfair praise bred quiet resentment in the team.",
    zh: "多年不公的稱讚在團隊裡滋生沉默的怨恨。",
  },
  persecute: {
    en: "No society should persecute people for peaceful speech.",
    zh: "任何社會都不該因和平言論而迫害人。",
  },
  observation: {
    en: "Careful observation revealed a small crack in the glass.",
    zh: "仔細觀察發現玻璃上有一道小裂縫。",
  },
  subservient: {
    en: "He refused to be subservient to every passing fashion.",
    zh: "他拒絕屈從每一波短暫潮流。",
  },
  service: {
    en: "Excellent service kept customers returning to the café.",
    zh: "優質服務讓顧客一再回到這間咖啡廳。",
  },
  designate: {
    en: "The mayor will designate a new park near the river.",
    zh: "市長將指定河岸附近一塊地作為新公園。",
  },
  semblance: {
    en: "After the storm, only a semblance of the pier remained.",
    zh: "暴風雨後，碼頭只剩一點殘餘的模樣。",
  },
  solo: {
    en: "She performed a violin solo in the middle of the concert.",
    zh: "她在音樂會中段演奏了一段小提琴獨奏。",
  },
  somnambulist: {
    en: "The somnambulist wandered into the kitchen while still asleep.",
    zh: "那位夢遊者還在睡夢中就走進了廚房。",
  },
  assonant: {
    en: "The poet chose assonant vowels to soften the closing lines.",
    zh: "詩人選用諧音母音，柔化結尾詩行。",
  },
  clever: {
    en: "A clever title cannot hide a thin argument.",
    zh: "再聰明的標題也掩蓋不了薄弱論證。",
  },
  rhetoric: {
    en: "Empty rhetoric cannot replace careful reasoning.",
    zh: "空洞修辭取代不了謹慎推論。",
  },
  desist: {
    en: "The court ordered the company to desist from false ads.",
    zh: "法院命令該公司停止不實廣告。",
  },
  standard: {
    en: "Safety standard checks are required before every flight.",
    zh: "每次起飛前都須通過安全標準檢查。",
  },
  stricture: {
    en: "The reviewer’s stricture forced a clearer rewrite of chapter two.",
    zh: "審稿人的嚴厲批評迫使第二章改寫得更清楚。",
  },
  astringent: {
    en: "An astringent lotion can tighten oily skin temporarily.",
    zh: "收斂化妝水能暫時緊緻油性肌膚。",
  },
  summary: {
    en: "Write a one-page summary of the chapter for class.",
    zh: "為上課寫一頁該章的摘要。",
  },
  resume: {
    en: "Classes will resume after the winter break ends.",
    zh: "寒假結束後課程將繼續進行。",
  },
  upsurge: {
    en: "An upsurge in tourism filled every hotel downtown.",
    zh: "觀光急升讓市區每家旅館都客滿。",
  },
  rise: {
    en: "A sharp rise in tuition worried many families.",
    zh: "學費驟升讓許多家庭憂心。",
  },
  tactful: {
    en: "A tactful reminder helped without embarrassing anyone.",
    zh: "一句圓通的提醒既幫了忙，又不讓人難堪。",
  },
  technique: {
    en: "Her watercolor technique improved after summer workshops.",
    zh: "經過暑期工作坊，她的水彩技法進步了。",
  },
  tooling: {
    en: "The factory invested in new tooling for the metal parts.",
    zh: "工廠為金屬零件投資了新的工模具。",
  },
  temporary: {
    en: "The bridge closure is temporary and should end next week.",
    zh: "橋梁封閉是暫時的，預計下週結束。",
  },
  contend: {
    en: "Historians contend that trade, not chance, drove the boom.",
    zh: "歷史學家主張是貿易而非偶然推動了那次繁榮。",
  },
  attend: {
    en: "Please attend the meeting on Friday afternoon.",
    zh: "請出席週五下午的會議。",
  },
  terminal: {
    en: "Passengers waited in the crowded airport terminal.",
    zh: "旅客在擁擠的機場航廈等候。",
  },
  terminology: {
    en: "Legal terminology can confuse first-year students.",
    zh: "法律術語常讓一年級學生困惑。",
  },
  terminus: {
    en: "The bus reaches its terminus at the central station.",
    zh: "公車在中央車站抵達終點站。",
  },
  deadline: {
    en: "The scholarship deadline is the last Friday of March.",
    zh: "獎學金截止日期是三月最後一個週五。",
  },
  attestation: {
    en: "An attestation from the registrar confirmed her enrollment.",
    zh: "註冊組出具的證明確認了她的在籍身分。",
  },
  protestation: {
    en: "Despite his protestation of innocence, doubts remained.",
    zh: "儘管他堅稱清白，疑慮仍在。",
  },
  witness: {
    en: "A passerby became a witness to the quiet accident.",
    zh: "一位路人成了這起安靜車禍的證人。",
  },
  antithesis: {
    en: "Chaos is the antithesis of careful planning.",
    zh: "混亂是謹慎規劃的對立面。",
  },
  hypothetical: {
    en: "Consider a hypothetical case before applying the rule.",
    zh: "套用規則前，先想一個假設情境。",
  },
  anatomy: {
    en: "Medical students study anatomy with detailed charts.",
    zh: "醫學生用詳圖學習解剖學。",
  },
  contribute: {
    en: "Many neighbors contribute food to the annual charity drive.",
    zh: "許多鄰居為年度慈善募捐貢獻食物。",
  },
  contribution: {
    en: "Her contribution to the project was the research design.",
    zh: "她對專案的貢獻是研究設計。",
  },
  thrust: {
    en: "The main thrust of the essay is a call for fairness.",
    zh: "這篇文章的主要要旨是呼籲公平。",
  },
  adumbrate: {
    en: "The preface briefly adumbrates the book’s central theme.",
    zh: "序言簡要勾勒全書的中心主題。",
  },
  invade: {
    en: "Weeds began to invade the neglected garden beds.",
    zh: "雜草開始侵入被忽略的花圃。",
  },
  pervasive: {
    en: "A pervasive smell of smoke filled the hallway.",
    zh: "走廊裡瀰漫著刺鼻的煙味。",
  },
  evaluation: {
    en: "Course evaluation forms are collected on the last day.",
    zh: "課程評鑑表在最後一天收回。",
  },
  valiant: {
    en: "Firefighters made a valiant effort to save the old barn.",
    zh: "消防隊員勇敢奮力搶救那座舊穀倉。",
  },
  prevail: {
    en: "In the end, patience and evidence will prevail.",
    zh: "最終，耐心與證據會佔上風。",
  },
  verbiage: {
    en: "Cut the marketing verbiage and state the facts plainly.",
    zh: "刪掉行銷冗詞，把事實說清楚。",
  },
  silence: {
    en: "A respectful silence followed the memorial reading.",
    zh: "紀念朗讀後，現場一片肅穆的沉默。",
  },
  deviate: {
    en: "Do not deviate from the marked trail in heavy fog.",
    zh: "濃霧中不要偏離標示的步道。",
  },
  revive: {
    en: "Volunteers hope to revive the abandoned community garden.",
    zh: "志工希望重振被廢棄的社區菜園。",
  },
  vital: {
    en: "Clean drinking water is vital to public health.",
    zh: "乾淨飲用水對公共衛生至關重要。",
  },
  vortex: {
    en: "Leaves spun in a small vortex near the storm drain.",
    zh: "落葉在排水口附近形成小小漩渦旋轉。",
  },

  // formerly "ok EN" but still lab-sloganish / short ZH
  mediocre: {
    en: "A mediocre draft can still become strong after revision.",
    zh: "平庸的初稿經過修改仍能變得扎實。",
  },
  memorable: {
    en: "The opening scene was so memorable that students quoted it for weeks.",
    zh: "開場戲太令人難忘，學生們連續幾週都在引用。",
  },
  commensurate: {
    en: "Pay should be commensurate with experience and responsibility.",
    zh: "薪酬應與經驗及職責相稱。",
  },
  premonition: {
    en: "She had a strange premonition that the trip would go wrong.",
    zh: "她有種怪異的預感：這趟旅程會出問題。",
  },
  moribund: {
    en: "The once-busy factory now looked moribund and half empty.",
    zh: "那座曾繁忙的工廠如今看起來半死不活、半空著。",
  },
  remote: {
    en: "They spent summer in a remote village without cell service.",
    zh: "他們在一個沒有手機訊號的偏遠村莊度過夏天。",
  },
  natural: {
    en: "It felt natural to switch to Chinese with her grandparents.",
    zh: "跟祖父母改說中文，感覺很自然。",
  },
  census: {
    en: "The national census counts every household once a decade.",
    zh: "全國普查每十年清點一次每一戶。",
  },
  renown: {
    en: "The chef gained renown for simple, precise flavors.",
    zh: "這位主廚因味道簡單精準而享有聲名。",
  },
  impediment: {
    en: "Poor lighting was an impediment to careful reading.",
    zh: "燈光不足是細讀的障礙。",
  },
  repulsion: {
    en: "She felt an instant repulsion toward the spoiled food.",
    zh: "她對腐壞食物立刻感到強烈排斥。",
  },
  compulsion: {
    en: "Under compulsion, he signed a contract he later regretted.",
    zh: "在強迫之下，他簽下後來後悔的合約。",
  },
  depend: {
    en: "Young plants depend on steady watering in dry weeks.",
    zh: "幼苗在乾旱週需要穩定澆水才能存活。",
  },
  impending: {
    en: "Dark clouds signaled an impending thunderstorm.",
    zh: "烏雲預示雷雨即將來臨。",
  },
  phonetic: {
    en: "A phonetic guide helps beginners pronounce the headword.",
    zh: "語音指引幫助初學者念出頭詞。",
  },
  repository: {
    en: "The library is a quiet repository of rare maps.",
    zh: "這座圖書館是珍稀地圖的安靜典藏庫。",
  },
  proposition: {
    en: "State your main proposition in one clear sentence.",
    zh: "用一句清楚的話陳述你的主要命題。",
  },
  potential: {
    en: "The vacant lot has potential as a community garden.",
    zh: "這塊空地有潛力變成社區菜園。",
  },
  omnipotence: {
    en: "No tool grants writers methodological omnipotence.",
    zh: "沒有任何工具能賦予寫作者方法上的全能。",
  },
  primarily: {
    en: "This course is primarily about close reading of poetry.",
    zh: "這門課首要在於細讀詩歌。",
  },
  priority: {
    en: "Safety remains the first priority on the construction site.",
    zh: "工地安全仍是第一優先事項。",
  },
  proprietor: {
    en: "The shop’s proprietor greeted every regular by name.",
    zh: "店主能叫出每位熟客的名字打招呼。",
  },
  pointed: {
    en: "Her pointed question exposed a gap in the argument.",
    zh: "她尖銳的問題揭露了論證的缺口。",
  },
  secant: {
    en: "In geometry, a secant line cuts a circle at two points.",
    zh: "在幾何裡，割線與圓相交於兩點。",
  },
  verisimilitude: {
    en: "Historical detail gave the novel convincing verisimilitude.",
    zh: "歷史細節讓這本小說有令人信服的逼真感。",
  },
  lonely: {
    en: "The lonely lighthouse stood miles from the nearest town.",
    zh: "那座孤單的燈塔離最近市鎮有數英里遠。",
  },
  constrain: {
    en: "A tight budget will constrain what the festival can offer.",
    zh: "緊縮預算會限制音樂節能提供什麼。",
  },
  antenna: {
    en: "They adjusted the antenna until the radio signal cleared.",
    zh: "他們調整天線，直到廣播訊號變清楚。",
  },
  meantime: {
    en: "In the meantime, finish the reading for next week.",
    zh: "在此期間，先把下週的閱讀做完。",
  },
  tenacious: {
    en: "Her tenacious questions finally produced a clear answer.",
    zh: "她頑強追問，終於得到清楚答覆。",
  },
  abstain: {
    en: "Several members abstained from the final vote.",
    zh: "數名成員在最終表決中棄權。",
  },
  counterthesis: {
    en: "Present a fair counterthesis before you reject it.",
    zh: "在駁斥前，先公平陳述反論題。",
  },
  "anatomy of error": {
    en: "After the mistake, they wrote a calm anatomy of error.",
    zh: "出錯後，他們寫下一份冷靜的錯誤解剖。",
  },
  detraction: {
    en: "Honest criticism is not the same as petty detraction.",
    zh: "誠實批評並不等於瑣碎貶損。",
  },
  tributary: {
    en: "A small tributary joins the river just below the bridge.",
    zh: "一條小支流在橋下匯入大河。",
  },
  disturbance: {
    en: "A loud disturbance in the hallway interrupted the lecture.",
    zh: "走廊一陣喧鬧打擾打斷了講座。",
  },
  umbrella: {
    en: "Bring an umbrella; the forecast calls for afternoon showers.",
    zh: "帶把傘；預報說午後有陣雨。",
  },
  silhouette: {
    en: "At dusk, the bridge became a dark silhouette against the sky.",
    zh: "黃昏時，橋樑在天空襯托下成了一道深色剪影。",
  },
  divagate: {
    en: "Do not divagate into side stories during the oral exam.",
    zh: "口試時不要離題講到旁支故事。",
  },
  contravene: {
    en: "Hidden side deals contravene the spirit of the agreement.",
    zh: "暗中另訂協議抵觸契約精神。",
  },
  pathway: {
    en: "A stone pathway leads from the gate to the old chapel.",
    zh: "一條石徑從大門通向古老小教堂。",
  },
};

function pick(m) {
  return CURATED[m.headword] || CURATED[String(m.headword || "").toLowerCase()] || null;
}

const stats = { fixed: 0, clusters: new Set(), samples: [] };

for (const f of fs.readdirSync(clusterDir).filter((x) => x.startsWith("root-") && x.endsWith(".json"))) {
  const fp = path.join(clusterDir, f);
  const c = JSON.parse(fs.readFileSync(fp, "utf8"));
  let touched = false;
  for (const m of c.members || []) {
    const next = pick(m);
    if (!next) continue;
    if (m.speakLineEn === next.en && m.speakLineZh === next.zh) continue;
    const before = m.speakLineEn;
    m.speakLineEn = next.en;
    m.speakLineZh = next.zh;
    touched = true;
    stats.fixed += 1;
    stats.clusters.add(c.id);
    if (stats.samples.length < 12) {
      stats.samples.push({ hw: m.headword, before: String(before || "").slice(0, 55), after: next.en });
    }
  }
  if (touched) {
    c.qualityGate = {
      ...(c.qualityGate || {}),
      rootPolishAt: new Date().toISOString().slice(0, 10),
      rootPolishStage: "root-careful-polish-batch3",
    };
    fs.writeFileSync(fp, `${JSON.stringify(c, null, 2)}\n`);
    const lp = path.join(lessonDir, `lesson-${c.id}.json`);
    if (fs.existsSync(lp)) {
      const lesson = JSON.parse(fs.readFileSync(lp, "utf8"));
      lesson.qualityGate = {
        ...(lesson.qualityGate || {}),
        rootPolishAt: new Date().toISOString().slice(0, 10),
      };
      fs.writeFileSync(lp, `${JSON.stringify(lesson, null, 2)}\n`);
    }
  }
}

console.log(JSON.stringify({ fixed: stats.fixed, clusters: stats.clusters.size, samples: stats.samples }, null, 2));
