/**
 * Careful polish of root-theater speakLines (no fab / no lab mush / no nonsense).
 * node web/scripts/gre-humor-polish-root-examples.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const lessonDir = path.join(humorDir, "lessons");

/** Careful classroom examples only. */
const CURATED = {
  luminary: {
    en: "She became a luminary in early modern history.",
    zh: "她成為早期現代史領域的傑出人物。",
  },
  first: {
    en: "First, define your terms; then present the evidence.",
    zh: "首先界定術語，再提出證據。",
  },
  observe: {
    en: "Biologists observe migration patterns each spring.",
    zh: "生物學家每年春天觀察遷徙模式。",
  },
  adhere: {
    en: "Students must adhere to the citation rules in the handbook.",
    zh: "學生必須遵守手冊中的引用規則。",
  },
  intermediary: {
    en: "The broker acted as an intermediary between buyer and seller.",
    zh: "經紀人擔任買方與賣方之間的中間人。",
  },
  "mirror image": {
    en: "The twin buildings form a near mirror image across the plaza.",
    zh: "兩棟孿生建築在廣場兩側幾乎形成鏡像。",
  },
  telepathy: {
    en: "Claims of telepathy remain unsupported by rigorous tests.",
    zh: "關於心靈感應的主張仍缺乏嚴謹檢測支持。",
  },
  test: {
    en: "The chemist will test each sample for purity.",
    zh: "化學家將檢測每份樣本的純度。",
  },
  rectify: {
    en: "The printer agreed to rectify the error in the next edition.",
    zh: "印刷廠同意在下一版改正錯誤。",
  },
  microscope: {
    en: "Students examined the tissue under a microscope.",
    zh: "學生在顯微鏡下檢視組織。",
  },
  "philosophy club": {
    en: "The philosophy club meets weekly to debate free will.",
    zh: "哲學社每週聚會辯論自由意志。",
  },
  determine: {
    en: "Lab results will determine whether treatment should continue.",
    zh: "實驗結果將決定是否繼續治療。",
  },
  dichotomy: {
    en: "The essay rejects a false dichotomy between art and science.",
    zh: "文章拒絕藝術與科學的錯誤二分法。",
  },
  "out-of-sync": {
    en: "Their watches were out-of-sync after the long flight.",
    zh: "長途飛行後，他們的手錶不同步了。",
  },
  final: {
    en: "The final chapter summarizes the main findings.",
    zh: "最後一章總結主要發現。",
  },
  refine: {
    en: "Editors asked her to refine the opening argument.",
    zh: "編輯請她精煉開頭論點。",
  },
  congregate: {
    en: "Tourists congregate near the fountain at dusk.",
    zh: "黃昏時遊客聚集在噴泉附近。",
  },
  relate: {
    en: "Can you relate this episode to the novel’s theme?",
    zh: "你能把這段情節與小說主題連結起來嗎？",
  },
  collate: {
    en: "Please collate the pages before binding the report.",
    zh: "裝訂報告前請先整理頁次。",
  },
  eligible: {
    en: "Only juniors and seniors are eligible for the internship.",
    zh: "只有大三與大四學生有資格申請實習。",
  },
  mandate: {
    en: "The new law will mandate seat belts for all passengers.",
    zh: "新法將強制所有乘客繫安全帶。",
  },
  matron: {
    en: "The hospital matron supervised the night nursing staff.",
    zh: "醫院護理長督導夜間護理人員。",
  },
  nature: {
    en: "The nature of the dispute was financial, not personal.",
    zh: "爭議的本質是財務問題，而非私人恩怨。",
  },
  international: {
    en: "An international conference will open in Geneva next month.",
    zh: "一場國際會議下月將在日內瓦揭幕。",
  },
  nausea: {
    en: "Motion sickness often begins with mild nausea.",
    zh: "暈動症常由輕微噁心開始。",
  },
  cooperate: {
    en: "Neighboring towns agreed to cooperate on flood control.",
    zh: "鄰近城鎮同意在防洪上合作。",
  },
  option: {
    en: "Students have the option to take the exam orally.",
    zh: "學生可選擇以口試方式應考。",
  },
  originally: {
    en: "The building was originally designed as a warehouse.",
    zh: "這棟建築原本設計為倉庫。",
  },
  reconcile: {
    en: "They tried to reconcile the two conflicting accounts.",
    zh: "他們試圖調和兩種互相衝突的說法。",
  },
  append: {
    en: "Please append the table of raw data to the report.",
    zh: "請把原始資料表附加到報告後面。",
  },
  expenditure: {
    en: "Public expenditure on libraries rose slightly this year.",
    zh: "今年公共圖書館支出略有上升。",
  },
  complacency: {
    en: "Early success can breed dangerous complacency.",
    zh: "早期成功可能滋生危險的自滿。",
  },
  populate: {
    en: "Settlers began to populate the valley in the 1840s.",
    zh: "拓墾者在一八四〇年代開始在山谷定居繁衍。",
  },
  propose: {
    en: "The committee will propose three reforms tomorrow.",
    zh: "委員會明天將提出三項改革。",
  },
  primordial: {
    en: "Myths often describe a primordial chaos before creation.",
    zh: "神話常描寫創世前的原始混沌。",
  },
  combat: {
    en: "The city launched a campaign to combat littering.",
    zh: "市府發起行動打擊亂丟垃圾。",
  },
  radix: {
    en: "In mathematics, the radix of a number system is its base.",
    zh: "在數學裡，記數系統的基數即其進位底。",
  },
  assault: {
    en: "Witnesses described a verbal assault during the debate.",
    zh: "證人描述辯論中發生言語攻擊。",
  },
  satisfaction: {
    en: "Customer satisfaction improved after the refund policy changed.",
    zh: "退費政策改變後，顧客滿意度提升。",
  },
  conscience: {
    en: "His conscience would not allow him to stay silent.",
    zh: "他的良心不允許他保持沉默。",
  },
  narrow: {
    en: "Please narrow the topic before you start drafting.",
    zh: "動筆前請先把題目範圍縮小。",
  },
  scribble: {
    en: "She left a quick scribble in the margin of the page.",
    zh: "她在頁邊匆匆塗了一筆。",
  },
  session: {
    en: "The morning session ended with three short presentations.",
    zh: "上午場次以三場短報告作結。",
  },
  execute: {
    en: "The team will execute the plan in three careful stages.",
    zh: "團隊將分三個謹慎階段執行計畫。",
  },
  somniferous: {
    en: "The lecture’s somniferous tone put half the room to sleep.",
    zh: "講座催人欲睡的語氣讓半個教室睡著了。",
  },
  sophistry: {
    en: "Elegant sophistry cannot hide a missing premise.",
    zh: "華麗詭辯無法掩蓋缺失的前提。",
  },
  surge: {
    en: "A sudden surge in demand emptied the shelves.",
    zh: "需求突然激增，貨架被清空。",
  },
  tangible: {
    en: "The reforms produced tangible improvements in air quality.",
    zh: "改革帶來空氣品質的具體改善。",
  },
  hypothesis: {
    en: "The hypothesis predicted a sharp drop in error rates.",
    zh: "該假說預測錯誤率會大幅下降。",
  },
  dissertation: {
    en: "She defended her dissertation after five years of research.",
    zh: "經過五年研究，她通過了博士論文答辯。",
  },
  vacancy: {
    en: "There is one vacancy left in the seminar.",
    zh: "研討班還剩一個名額空缺。",
  },
  ramble: {
    en: "Do not ramble; keep each paragraph on one claim.",
    zh: "不要東拉西扯；每段只談一個主張。",
  },
  valid: {
    en: "A valid passport is required for international travel.",
    zh: "國際旅行需要有效護照。",
  },
  "conviction rate": {
    en: "The city’s conviction rate rose after new evidence rules.",
    zh: "新的證據規則實施後，該市定罪率上升。",
  },
  "revive debate": {
    en: "The discovery will revive debate about the author’s sources.",
    zh: "這項發現將重新引發關於作者史料來源的辯論。",
  },
  noxiousness: {
    en: "Researchers measured the noxiousness of the chemical fumes.",
    zh: "研究人員測量化學煙霧的有害程度。",
  },
  transfer: {
    en: "Please transfer the files to the shared archive tonight.",
    zh: "請今晚把檔案轉移到共用典藏區。",
  },
  project: {
    en: "Do not project your fears onto every quiet critic.",
    zh: "不要把恐懼投射到每一位安靜的批評者身上。",
  },
  commandment: {
    en: "The first commandment of the workshop is to cite sources.",
    zh: "工作坊第一誡是引用出處。",
  },
  opera: {
    en: "They attended the opera for the first time last winter.",
    zh: "去年冬天他們第一次去看歌劇。",
  },
  ordain: {
    en: "The council will not ordain a new rule without public comment.",
    zh: "沒有公開意見前，議會不會制定新規則。",
  },
  impugn: {
    en: "Lawyers may impugn a witness’s memory, not invent motives.",
    zh: "律師可以質疑證人記憶，而非捏造動機。",
  },
  rapture: {
    en: "Fans watched in rapture as the final goal was scored.",
    zh: "終場進球時，球迷如痴如狂地觀看。",
  },
  ascribe: {
    en: "Historians ascribe the decline to trade disruption, not chance.",
    zh: "歷史學家把衰落歸因於貿易中斷，而非偶然。",
  },
  exterminate: {
    en: "The farmers tried to exterminate the invasive beetles.",
    zh: "農民試圖消滅入侵的甲蟲。",
  },
};

const LAB =
  /preregister|p-hack|estimand|codebook|open materials|silent outcome|unblinded|replication package|paywalled|sensitivity checks/i;
const FAB =
  /Cue the |On the exam,|Critics argued that the policy would|Picture the |A careful reader links|Hold the meaning steady|In the passage,/i;

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
    if (stats.samples.length < 20) {
      stats.samples.push({ id: c.id, hw: m.headword, before: String(before || "").slice(0, 70), after: next.en });
    }
  }
  if (touched) {
    c.qualityGate = {
      ...(c.qualityGate || {}),
      rootPolishAt: new Date().toISOString().slice(0, 10),
      rootPolishStage: "root-careful-polish",
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

fs.writeFileSync(
  path.join(humorDir, "ROOT-CAREFUL-POLISH-REPORT.md"),
  `# 字根劇場例句仔細打磨報告

| 指標 | 數值 |
|------|------|
| 修正成員 | **${stats.fixed}** |
| 涉及家族 | **${stats.clusters.size}** |

## 抽樣 before → after

${stats.samples.map((s) => `- **${s.hw}**（\`${s.id}\`）\n  - 前：${s.before}\n  - 後：${s.after}`).join("\n")}

## 原則

1. 義準、語法正確、可進課堂  
2. 去掉實驗室黑話模板（prereg／estimand／codebook 亂入）  
3. 去掉胡謅句；中文必須是完整對譯，不是釋義複讀  
`,
);

console.log(JSON.stringify({ fixed: stats.fixed, clusters: stats.clusters.size, samples: stats.samples }, null, 2));
