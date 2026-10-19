/**
 * Fix fabricated / heavily repeated speakLines in 字根劇場 (root) clusters.
 *
 * node web/scripts/gre-humor-fix-root-examples.js --stage 1
 * node web/scripts/gre-humor-fix-root-examples.js --stage 2
 * node web/scripts/gre-humor-fix-root-examples.js --stage all
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const lessonDir = path.join(humorDir, "lessons");

const FAB =
  /Cue the |gag sticks|walks on|On the exam,|most nearly means|Critics argued that the policy would|In the passage,|Picture the |Hold the meaning steady|A careful reader links|signals a shift toward|記住考意|出場|標示語氣轉向|想像「/i;

const REPEAT_BAD =
  /claims need .+ evidence|silent outcome switching|the identification assumptions/i;

const STAGE1_IDS = ["root-tract-01", "root-tort-01", "root-scend-01", "root-clud-01"];

/** headword -> {en, zh} */
const CURATED = {
  // tract
  extract: {
    en: "Chemists extract dye from the plant roots.",
    zh: "化學家從植物根部提取染料。",
  },
  contract: {
    en: "Both parties signed the contract after the final revision.",
    zh: "雙方在最終修訂後簽署契約。",
  },
  subtract: {
    en: "Subtract the blank reading before you report the result.",
    zh: "報告結果前先減去空白讀值。",
  },
  traction: {
    en: "His leg was in traction for several days after the fracture.",
    zh: "骨折後他的腿接受了數日牽引治療。",
  },
  detraction: {
    en: "Let it be no detraction from his merits to say he is plainspoken.",
    zh: "說他直言不諱，並非減損他的優點。",
  },
  // tort
  torture: {
    en: "The novel depicts psychological torture without sensational detail.",
    zh: "小說描寫心理折磨，卻不流於煽情細節。",
  },
  torsion: {
    en: "Engineers measured the torsion in the twisted metal rod.",
    zh: "工程師測量扭曲金屬棒的扭轉力。",
  },
  extortion: {
    en: "The prosecutor charged the officials with extortion.",
    zh: "檢察官以勒索罪起訴那些官員。",
  },
  nasturtium: {
    en: "Orange nasturtium flowers lined the garden path.",
    zh: "橙紅色旱金蓮沿著花園小徑開放。",
  },
  torch: {
    en: "Guides carried a torch through the dark cave passage.",
    zh: "導遊持火炬穿過黑暗洞穴通道。",
  },
  // scend
  ascent: {
    en: "The ascent to the summit took six hours in deep snow.",
    zh: "在深雪中登頂花了六小時。",
  },
  descent: {
    en: "The plane began its descent toward the coastal airport.",
    zh: "飛機開始向海岸機場下降。",
  },
  descendant: {
    en: "She is a descendant of the town’s first schoolteachers.",
    zh: "她是鎮上最早一批教師的後代。",
  },
  ascension: {
    en: "The team’s sudden ascension in the rankings surprised fans.",
    zh: "球隊排名突然上升，球迷都感意外。",
  },
  // clud
  closure: {
    en: "The bridge closure forced drivers onto local roads.",
    zh: "橋樑封閉迫使駕駛改走地方道路。",
  },
  enclosure: {
    en: "Sheep were kept in a wooden enclosure overnight.",
    zh: "羊群夜間關在木製圍場裡。",
  },
  // repeated nonsense / lab templates
  forceful: {
    en: "A forceful closing paragraph restated the main claim.",
    zh: "有力的結尾段重申了主要主張。",
  },
  ultramarine: {
    en: "The painter mixed ultramarine for the deep sky.",
    zh: "畫家調出群青來畫深邃天空。",
  },
  immense: {
    en: "The library’s collection is of immense historical value.",
    zh: "這座圖書館的館藏具有巨大歷史價值。",
  },
  extraordinary: {
    en: "She showed extraordinary patience with struggling students.",
    zh: "她對學習困難的學生展現非凡耐心。",
  },
  metropolitan: {
    en: "Metropolitan traffic often delays morning deliveries.",
    zh: "大都市交通常延誤早上配送。",
  },
  extravagant: {
    en: "The budget rejected extravagant decorations for the ceremony.",
    zh: "預算否決了典禮上過於奢華的裝飾。",
  },
  extrasensory: {
    en: "The essay treats extrasensory claims with scientific skepticism.",
    zh: "文章以科學懷疑態度看待超感官主張。",
  },
  "long-range": {
    en: "Long-range forecasts remain uncertain beyond two weeks.",
    zh: "超過兩週的長期預報仍不確定。",
  },
  disruptive: {
    en: "A disruptive innovation can displace older tools overnight.",
    zh: "顛覆性創新可能一夜之間取代舊工具。",
  },
  extraterrestrial: {
    en: "No confirmed extraterrestrial signal has been detected.",
    zh: "尚未偵測到經確認的地外訊號。",
  },
  prevention: {
    en: "Prevention of infection starts with clean water and hygiene.",
    zh: "預防感染從乾淨飲水與衛生習慣開始。",
  },
  refuse: {
    en: "Editors may refuse manuscripts that lack clear methods.",
    zh: "編輯可能拒收缺乏清楚方法的稿件。",
  },
  reprehend: {
    en: "Teachers reprehend plagiarism without humiliating students.",
    zh: "教師譴責抄襲，但不羞辱學生。",
  },
  eradicate: {
    en: "The campaign aims to eradicate measles through vaccination.",
    zh: "該行動希望透過疫苗接種根除麻疹。",
  },
  elucidate: {
    en: "The footnote helps elucidate an otherwise obscure reference.",
    zh: "腳註有助闡明原本晦澀的出處。",
  },
  interrogate: {
    en: "Historians interrogate sources before trusting a single account.",
    zh: "歷史學家在採信單一敘事前會詰問史料。",
  },
  dissect: {
    en: "In class we dissect the poem line by line.",
    zh: "課堂上我們逐行剖析這首詩。",
  },
  poison: {
    en: "Lead paint can poison children if it flakes into dust.",
    zh: "鉛漆若剝落成粉塵，可能毒害孩童。",
  },
};

function needsFix(m) {
  const en = String(m.speakLineEn || "");
  const zh = String(m.speakLineZh || "");
  if (FAB.test(en) || FAB.test(zh)) return true;
  if (REPEAT_BAD.test(en)) return true;
  if (CURATED[String(m.headword || "").toLowerCase()] || CURATED[m.headword]) {
    // only rewrite curated if current looks weak
    if (FAB.test(en) || REPEAT_BAD.test(en) || en.length < 28) return true;
    // nonsense X claims need X
    if (/^(\w[\w-]*) claims need \1 /i.test(en)) return true;
  }
  return false;
}

function pick(m) {
  const hw = String(m.headword || "");
  return CURATED[hw.toLowerCase()] || CURATED[hw] || null;
}

function syncLesson(cluster) {
  const lp = path.join(lessonDir, `lesson-${cluster.id}.json`);
  if (!fs.existsSync(lp)) return;
  const lesson = JSON.parse(fs.readFileSync(lp, "utf8"));
  lesson.qualityGate = {
    ...(lesson.qualityGate || {}),
    rootExamplesFixedAt: new Date().toISOString().slice(0, 10),
  };
  fs.writeFileSync(lp, `${JSON.stringify(lesson, null, 2)}\n`);
}

function stageIds(stage) {
  const all = fs
    .readdirSync(clusterDir)
    .filter((f) => f.startsWith("root-") && f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
  if (stage === 1) return STAGE1_IDS.filter((id) => all.includes(id));
  if (stage === 2) {
    // all roots that still need any fix
    return all.filter((id) => {
      const c = JSON.parse(fs.readFileSync(path.join(clusterDir, `${id}.json`), "utf8"));
      return (c.members || []).some(needsFix);
    });
  }
  return all;
}

const stageArg = (() => {
  const i = process.argv.indexOf("--stage");
  return i >= 0 ? String(process.argv[i + 1] || "1") : "1";
})();

const ids =
  stageArg === "all"
    ? stageIds("all")
    : Number(stageArg) === 2
      ? stageIds(2)
      : stageIds(1);

const report = { stage: stageArg, clusters: [], fixedMembers: 0 };

for (const id of ids) {
  const fp = path.join(clusterDir, `${id}.json`);
  if (!fs.existsSync(fp)) continue;
  const c = JSON.parse(fs.readFileSync(fp, "utf8"));
  let fixed = 0;
  for (const m of c.members || []) {
    if (!needsFix(m)) continue;
    const next = pick(m);
    if (!next) continue;
    if (m.speakLineEn === next.en && m.speakLineZh === next.zh) continue;
    m.speakLineEn = next.en;
    m.speakLineZh = next.zh;
    fixed += 1;
    report.fixedMembers += 1;
  }
  if (fixed) {
    c.qualityGate = {
      ...(c.qualityGate || {}),
      rootExamplesStage: `root-fix-${stageArg}`,
      rootExamplesFixedAt: new Date().toISOString().slice(0, 10),
    };
    fs.writeFileSync(fp, `${JSON.stringify(c, null, 2)}\n`);
    syncLesson(c);
  }
  report.clusters.push({ id, fixed, n: (c.members || []).length });
}

fs.writeFileSync(
  path.join(humorDir, `ROOT-EXAMPLES-STAGE${stageArg === "all" ? "ALL" : stageArg}-REPORT.md`),
  `# 字根劇場例句修正 · Stage ${stageArg}

| 指標 | 數值 |
|------|------|
| 處理家族 | ${report.clusters.length} |
| 修正成員 | **${report.fixedMembers}** |

## 各族

${report.clusters
  .filter((r) => r.fixed)
  .map((r) => `- \`${r.id}\`：修 ${r.fixed}/${r.n}`)
  .join("\n")}

## 修正對象

1. 胡謅模板（Picture／Critics argued／On the exam…）  
2. 無義重複句型（\`X claims need X evidence\`、silent outcome switching 等）  
`,
);

console.log(JSON.stringify(report, null, 2));
