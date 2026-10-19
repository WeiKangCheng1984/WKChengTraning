/**
 * Batch 2: expand short EN, rewrite lab-slogans/nonsense, fix gloss-only ZH.
 * node web/scripts/gre-humor-polish-root-examples-batch2.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const lessonDir = path.join(humorDir, "lessons");

/** Full EN+ZH rewrites (classroom-natural). */
const CURATED = {
  // --- en_short ---
  occlude: {
    en: "Thick plaque can occlude a coronary artery over time.",
    zh: "厚重斑塊長期下來可能堵塞冠狀動脈。",
  },
  coherent: {
    en: "Keep your causal story coherent from claim to evidence.",
    zh: "從主張到證據，都要讓因果敘事前後連貫。",
  },
  relevant: {
    en: "Cite only the sources that are relevant to your thesis.",
    zh: "只引用與你論題真正相關的資料。",
  },
  pellucid: {
    en: "Her pellucid prose made the dense theory readable.",
    zh: "她清澈的文筆讓艱深理論變得可讀。",
  },
  lucidity: {
    en: "Lucidity in the abstract matters more than clever jargon.",
    zh: "摘要的清晰度比花俏術語更重要。",
  },
  remember: {
    en: "Please remember to cite every quotation in the footnotes.",
    zh: "請記得在註腳中標明每一處引文。",
  },
  measure: {
    en: "We measure rainfall with gauges placed across the valley.",
    zh: "我們用山谷各處的雨量計來測量降雨。",
  },
  measurable: {
    en: "Set measurable goals before you begin the semester project.",
    zh: "開始學期專題前，先訂下可測量的目標。",
  },
  marvel: {
    en: "Tourists stop to marvel at the cathedral’s stained glass.",
    zh: "遊客停下腳步，驚嘆大教堂的彩繪玻璃。",
  },
  source: {
    en: "Always name the primary source of each statistic you quote.",
    zh: "引用統計數字時，務必標明原始來源。",
  },
  appendix: {
    en: "Put the long raw-data tables in an appendix, not the main text.",
    zh: "把冗長的原始資料表放在附錄，不要塞進正文。",
  },
  soothe: {
    en: "Soft music can soothe anxious patients before surgery.",
    zh: "輕柔音樂能在手術前安撫焦慮的病患。",
  },
  premier: {
    en: "She performed at the city’s premier concert hall last night.",
    zh: "她昨晚在本市首屈一指的音樂廳演出。",
  },
  primer: {
    en: "This short primer helps beginners start reading Latin poetry.",
    zh: "這本短篇入門書幫助初學者開始讀拉丁詩。",
  },
  foremost: {
    en: "Honesty is the foremost rule of academic writing.",
    zh: "誠實是學術寫作最首要的規則。",
  },
  punctuate: {
    en: "Please punctuate the dialogue so readers can follow who speaks.",
    zh: "請把對話標點清楚，好讓讀者跟上誰在說話。",
  },
  dispute: {
    en: "Historians still dispute the true cause of the uprising.",
    zh: "歷史學家至今仍爭論那場起義的真正原因。",
  },
  deputy: {
    en: "The mayor left the deputy in charge during the summit.",
    zh: "市長在高峰會期間把職權交給副手。",
  },
  repute: {
    en: "The clinic earned a strong repute for careful diagnosis.",
    zh: "這間診所因診斷謹慎而贏得良好名聲。",
  },
  mute: {
    en: "Please mute your microphone when you are not speaking.",
    zh: "不發言時請把麥克風靜音。",
  },
  correct: {
    en: "The newspaper issued a note to correct yesterday’s error.",
    zh: "報紙刊出更正啟事，改正昨日錯誤。",
  },
  scoff: {
    en: "Critics used to scoff at the idea of electric flight.",
    zh: "批評者曾嘲笑電動飛行的構想。",
  },
  question: {
    en: "Students should question weak evidence, not attack the author.",
    zh: "學生應質疑薄弱證據，而不是人身攻擊作者。",
  },
  deserve: {
    en: "Careful editors deserve credit for catching the error early.",
    zh: "細心的編輯值得因及早抓出錯處而受肯定。",
  },
  sign: {
    en: "Please sign the consent form before the interview begins.",
    zh: "訪談開始前請先簽署同意書。",
  },
  resign: {
    en: "The minister chose to resign after the budget scandal.",
    zh: "部長在預算醜聞後選擇辭職。",
  },
  signpost: {
    en: "Clear headings signpost each turn in the argument.",
    zh: "清楚的小標題為論證的每個轉折樹立路標。",
  },
  cosign: {
    en: "A parent must cosign the loan for the student applicant.",
    zh: "學生申請人的貸款須由家長連署。",
  },
  asleep: {
    en: "Half the audience was already asleep by the third act.",
    zh: "演到第三幕時，半數觀眾已經睡著了。",
  },
  nap: {
    en: "A short nap after lunch helped her finish the draft.",
    zh: "午餐後小睡一會兒，幫她把草稿寫完。",
  },
  sum: {
    en: "Add the three columns and report the sum at the bottom.",
    zh: "把三欄加總，並在底部報告總和。",
  },
  termination: {
    en: "The contract allows early termination with thirty days’ notice.",
    zh: "合約允許提前三十天通知即可終止。",
  },
  hypothesize: {
    en: "Before collecting data, hypothesize what pattern you expect.",
    zh: "蒐集資料前，先提出你預期會看到的模式假說。",
  },
  distribute: {
    en: "Volunteers will distribute flyers outside the library.",
    zh: "志工將在圖書館外分發傳單。",
  },
  attribution: {
    en: "Correct attribution of sources is required in every essay.",
    zh: "每篇論文都必須正確標示資料來源的歸屬。",
  },
  unobtrusive: {
    en: "The camera stayed unobtrusive so guests could speak freely.",
    zh: "攝影機保持不顯眼，好讓賓客暢所欲言。",
  },
  pushy: {
    en: "The salesperson was pushy and ignored polite refusals.",
    zh: "那位銷售員很硬推，對禮貌拒絕視而不見。",
  },
  cloud: {
    en: "A sudden cloud of dust rose behind the fleeing horses.",
    zh: "逃竄的馬群後方突然揚起一團塵雲。",
  },
  hollow: {
    en: "The old tree was hollow inside after decades of rot.",
    zh: "這棵老樹因長年腐朽而內部中空。",
  },
  proverb: {
    en: "The proverb warns that haste often wastes more time later.",
    zh: "這句諺語警告：倉促往往日後更浪費時間。",
  },
  evidence: {
    en: "Solid evidence outweighs eloquent but empty rhetoric.",
    zh: "扎實證據勝過再華麗卻空洞的修辭。",
  },
  volume: {
    en: "Please lower the volume so the neighbors can sleep.",
    zh: "請把音量調低，好讓鄰居能睡覺。",
  },
  willing: {
    en: "She was willing to revise the essay one more time.",
    zh: "她願意再改一次論文。",
  },
  devour: {
    en: "He would devour detective novels on every long train ride.",
    zh: "每次長途火車上，他都會狼吞虎嚥地讀推理小說。",
  },
  definitive: {
    en: "No single study offers a definitive answer to the question.",
    zh: "沒有單一研究能對這個問題給出決定性答案。",
  },
  anchor: {
    en: "The documentary tries to anchor each claim in archival film.",
    zh: "紀錄片試圖把每項主張都錨定在檔案影像上。",
  },
  admire: {
    en: "I admire her patience with difficult questions in class.",
    zh: "我欽佩她在課堂上面對難題時的耐心。",
  },
  orderly: {
    en: "Keep an orderly stack of drafts so revisions stay clear.",
    zh: "把草稿整齊疊放，修訂才一目了然。",
  },
  expedite: {
    en: "The clerk promised to expedite the passport renewal.",
    zh: "辦事員答應加速辦理護照換發。",
  },
  "impetus check": {
    en: "Pause for an impetus check before you rush the submission.",
    zh: "倉促投稿前，先停下來做一次動力檢查。",
  },
  complacent: {
    en: "Complacent winners often stop practicing after early success.",
    zh: "自滿的贏家常在早期成功後就停止練習。",
  },
  repugnant: {
    en: "Many readers found the villain’s cruelty morally repugnant.",
    zh: "許多讀者覺得反派的殘忍在道德上令人厭惡。",
  },
  regal: {
    en: "The queen entered with a calm, almost regal dignity.",
    zh: "女王入場時帶著平靜、近乎帝王般的尊嚴。",
  },
  asset: {
    en: "Fluency in three languages is a valuable career asset.",
    zh: "精通三種語言是職涯上的寶貴資產。",
  },
  preserve: {
    en: "Museums work hard to preserve fragile manuscripts.",
    zh: "博物館竭力保存脆弱的手稿。",
  },
  somnolent: {
    en: "The somnolent heat of afternoon made everyone drowsy.",
    zh: "午後令人昏昏欲睡的熱氣讓大家都打瞌睡。",
  },
  wise: {
    en: "A wise editor asks for evidence before praising a claim.",
    zh: "有智慧的編輯會在讚美主張前先要證據。",
  },
  gadget: {
    en: "A clever kitchen gadget cannot replace basic cooking skill.",
    zh: "再巧的廚房小裝置也取代不了基本烹飪功夫。",
  },
  contest: {
    en: "Lawyers will contest the will in probate court next month.",
    zh: "律師下月將在遺囑認證法庭爭辯這份遺囑。",
  },
  detest: {
    en: "She came to detest gossip that ruined innocent reputations.",
    zh: "她逐漸厭惡那種毀人清白名聲的閒話。",
  },
  atomic: {
    en: "Each atomic claim in the brief should stand on its own.",
    zh: "訴狀裡每一個不可再拆的主張都應能獨立成立。",
  },
  share: {
    en: "Please share your notes with classmates who missed class.",
    zh: "請把筆記分享給缺課的同學。",
  },
  disturb: {
    en: "Do not disturb the sleeping patient unless it is urgent.",
    zh: "除非緊急，否則不要打擾正在休息的病患。",
  },
  calm: {
    en: "Keep a calm tone even when the debate grows heated.",
    zh: "即使辯論升溫，也請保持平靜語氣。",
  },
  shade: {
    en: "We sat in the shade of the oak while waiting for the bus.",
    zh: "等公車時，我們坐在橡樹的樹蔭下。",
  },
  evaluate: {
    en: "Teachers evaluate essays on clarity, evidence, and structure.",
    zh: "老師依清晰度、證據與結構來評估作文。",
  },

  // --- nonsense / lab slogans / gloss-only ---
  foreclose: {
    en: "Rising rates may foreclose any chance of refinancing this year.",
    zh: "利率上升可能使今年再融資的機會完全被堵住。",
  },
  condescending: {
    en: "His condescending tone made the younger staff reluctant to speak.",
    zh: "他居高臨下的語氣讓年輕同事不敢發言。",
  },
  traction: {
    en: "His leg was in traction for several days after the accident.",
    zh: "意外後，他的腿接受了好幾天的牽引治療。",
  },
  except: {
    en: "Everyone finished the quiz except two students who arrived late.",
    zh: "除了兩位遲到的學生外，大家都做完了小考。",
  },
  reclusive: {
    en: "The reclusive novelist rarely left her mountain cottage.",
    zh: "那位隱居的小說家很少離開山上的小屋。",
  },
  seclusion: {
    en: "She sought seclusion in a quiet cabin to finish the novel.",
    zh: "她到安靜小屋隱居，專心把小說寫完。",
  },
  dedicate: {
    en: "They will dedicate the new wing of the library next spring.",
    zh: "他們將在明年春天為圖書館新翼舉行落成典禮。",
  },
  confine: {
    en: "Please confine your comments to the topic on the agenda.",
    zh: "請把發言限制在議程上的主題範圍內。",
  },
  fragile: {
    en: "Handle the fragile porcelain with both hands.",
    zh: "請用雙手輕拿這些易碎的瓷器。",
  },
  confusion: {
    en: "Similar names caused confusion among the new students.",
    zh: "名字相似讓新生之間產生混淆。",
  },
  graph: {
    en: "The bar graph shows enrollment rising over five years.",
    zh: "長條圖顯示五年來註冊人數持續上升。",
  },
  adhesive: {
    en: "Use adhesive tape to seal the package before mailing it.",
    zh: "寄出前請用膠帶把包裹封好。",
  },
  adherence: {
    en: "Strict adherence to the schedule kept the festival on time.",
    zh: "嚴格遵守時程，讓音樂節準時進行。",
  },
  perjury: {
    en: "The witness was charged with perjury after changing her story.",
    zh: "證人改口後，被控偽證罪。",
  },
  juncture: {
    en: "At this critical juncture, the board postponed the vote.",
    zh: "在這個關鍵時刻，董事會決定延後表決。",
  },
  lackluster: {
    en: "The team’s lackluster performance disappointed the home crowd.",
    zh: "球隊平庸的表現讓主場觀眾失望。",
  },
  medium: {
    en: "Oil paint is a slow-drying medium favored by many portraitists.",
    zh: "油畫顏料是許多肖像畫家喜愛的慢乾媒材。",
  },
  novelty: {
    en: "The novelty of the gadget wore off after a week of use.",
    zh: "用了一週後，這件小裝置的新鮮感就消退了。",
  },
  patriarch: {
    en: "The family patriarch still hosted Sunday dinner at eighty.",
    zh: "這位家族族長八十歲仍主持週日聚餐。",
  },
  appetite: {
    en: "Hiking in cold air gave everyone a fierce appetite.",
    zh: "冷空氣裡健行後，大家都胃口大開。",
  },
  potency: {
    en: "Pharmacists checked the potency of the expired medicine.",
    zh: "藥劑師檢查了過期藥品的效力。",
  },
  disapprove: {
    en: "Parents may disapprove of late-night parties during finals week.",
    zh: "家長可能不贊成期末週開深夜派對。",
  },
  appoint: {
    en: "The board will appoint a new director next month.",
    zh: "董事會下月將任命新的院長。",
  },
  rootedness: {
    en: "Her rootedness in local history shaped every chapter.",
    zh: "她對地方史的扎根感塑造了每一章。",
  },
  obsession: {
    en: "His obsession with punctuality amused and annoyed colleagues.",
    zh: "他對守時的執念既讓同事覺得好笑，也覺得煩。",
  },
  subsequent: {
    en: "Subsequent chapters explain how the treaty was enforced.",
    zh: "後續章節說明條約如何被執行。",
  },
  simultaneous: {
    en: "Two simultaneous alarms made the evacuation confusing.",
    zh: "兩道同時響起的警報讓疏散變得混亂。",
  },
  presumptuous: {
    en: "It felt presumptuous to correct the professor in mid-lecture.",
    zh: "在講座中途糾正教授，讓人覺得有點僭越。",
  },
  deter: {
    en: "Visible security cameras can deter casual shoplifting.",
    zh: "顯眼的監視器能嚇阻隨興的順手牽羊。",
  },
  intrude: {
    en: "Please do not intrude on private conversations in the hallway.",
    zh: "請不要在走廊上打擾別人的私人談話。",
  },
  blank: {
    en: "Leave the last page blank for the instructor’s comments.",
    zh: "最後一頁請留白，給老師寫評語。",
  },
  wayward: {
    en: "A wayward spark from the campfire nearly started a brush fire.",
    zh: "營火飛出的一顆任性火花，幾乎引發草木火。",
  },
};

/**
 * ZH-only polish for members whose EN is already classroom-OK but ZH is too short.
 * Keyed by headword; applied only when current zh is short / gloss-like.
 */
const ZH_EXPAND = {
  conclude: "我們斷定目前的證據仍然不足。",
  dictum: "一句名言並不能取代正式引用。",
  affect: "誘因會影響人們實際去測量什麼。",
  proficient: "即使寫碼熟練，仍需要他人審查。",
  facilitate: "範本能促進報告格式前後一致。",
  circumference: "請停留在已界定構念的圓周範圍內。",
  finality: "請把編輯的「定局」仍視為暫定結論。",
  refinement: "每一次精煉都應寫進修改紀錄。",
  confluence: "一連串錯誤匯流，終使主張站不住腳。",
  fortuitous: "偶然抽到的樣本並不等於研究設計。",
  fracture: "規程上的裂縫必須立刻記錄下來。",
  frail: "虛弱的識別策略一碰就會崩塌。",
  infuse: "請把謙遜注入討論段落的語氣裡。",
  refusal: "調查中請詳細記錄拒絕受訪的比率。",
  epigram: "一句警句並不能當成因果主張。",
  egregiously: "那張圖被過分到離譜地裁切過。",
  hesitant: "猶豫不決的領導會拖延必要勘誤。",
  coherence: "請檢查各章節之間的連貫性。",
  trajectory: "職涯軌跡並不注定最後的命運。",
  predilection: "對新奇的偏愛會扭曲發表決策。",
  illiberal: "狹隘的把關會擋下有益的批評。",
  loquacity: "話多並不等於把道理講清楚。",
  illuminate: "具體例子能照亮抽象的主張。",
  illumination: "我們追求啟發，而不是掌聲。",
};

function pick(m) {
  return CURATED[m.headword] || CURATED[String(m.headword || "").toLowerCase()] || null;
}

function needsZhExpand(m) {
  const zh = String(m.speakLineZh || "");
  const gloss = String(m.zhGloss || "").split(/；|;/)[0].trim();
  if (zh.length >= 12 && !(gloss && (zh === gloss || zh === `${gloss}。`))) return false;
  return Boolean(ZH_EXPAND[m.headword] || ZH_EXPAND[String(m.headword || "").toLowerCase()]);
}

const stats = { curated: 0, zhOnly: 0, clusters: new Set(), samples: [] };

for (const f of fs.readdirSync(clusterDir).filter((x) => x.startsWith("root-") && x.endsWith(".json"))) {
  const fp = path.join(clusterDir, f);
  const c = JSON.parse(fs.readFileSync(fp, "utf8"));
  let touched = false;
  for (const m of c.members || []) {
    const next = pick(m);
    if (next && (m.speakLineEn !== next.en || m.speakLineZh !== next.zh)) {
      const before = m.speakLineEn;
      m.speakLineEn = next.en;
      m.speakLineZh = next.zh;
      touched = true;
      stats.curated += 1;
      stats.clusters.add(c.id);
      if (stats.samples.length < 15) {
        stats.samples.push({ kind: "full", hw: m.headword, before: String(before || "").slice(0, 60), after: next.en });
      }
      continue;
    }
    if (needsZhExpand(m)) {
      const zh = ZH_EXPAND[m.headword] || ZH_EXPAND[String(m.headword || "").toLowerCase()];
      if (zh && m.speakLineZh !== zh) {
        m.speakLineZh = zh;
        touched = true;
        stats.zhOnly += 1;
        stats.clusters.add(c.id);
      }
    }
  }
  if (touched) {
    c.qualityGate = {
      ...(c.qualityGate || {}),
      rootPolishAt: new Date().toISOString().slice(0, 10),
      rootPolishStage: "root-careful-polish-batch2",
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

console.log(JSON.stringify({ curated: stats.curated, zhOnly: stats.zhOnly, clusters: stats.clusters.size, samples: stats.samples }, null, 2));
