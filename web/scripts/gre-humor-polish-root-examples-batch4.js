/** Last lab-jargon leftovers. node web/scripts/gre-humor-polish-root-examples-batch4.js */
const fs = require("fs");
const path = require("path");
const clusterDir = path.join(__dirname, "../../gre-humor/clusters");
const lessonDir = path.join(__dirname, "../../gre-humor/lessons");

const CURATED = {
  conjunction: {
    en: "Use “and” as a conjunction to join two independent clauses.",
    zh: "用 and 當連詞，連接兩個獨立子句。",
  },
  submarine: {
    en: "The documentary followed a research submarine under Arctic ice.",
    zh: "紀錄片跟著一艘研究潛艇駛入北極冰下。",
  },
  negligible: {
    en: "The difference in scores was negligible after rounding.",
    zh: "四捨五入後，分數差距幾乎可忽略。",
  },
  holy: {
    en: "Pilgrims gathered at the holy site before sunrise.",
    zh: "朝聖者在日出前聚集於聖地。",
  },
  taboo: {
    en: "In that culture, speaking the king’s name was long a taboo.",
    zh: "在那個文化裡，直呼國王之名長期是禁忌。",
  },
  perturb: {
    en: "Loud construction will perturb residents during exam week.",
    zh: "嘈雜施工會在考試週擾亂居民。",
  },
  invalid: {
    en: "An expired ticket is invalid for boarding the train.",
    zh: "過期車票無法搭乘火車，屬無效票。",
  },
};

let fixed = 0;
for (const f of fs.readdirSync(clusterDir).filter((x) => x.startsWith("root-") && x.endsWith(".json"))) {
  const fp = path.join(clusterDir, f);
  const c = JSON.parse(fs.readFileSync(fp, "utf8"));
  let touched = false;
  for (const m of c.members || []) {
    const next = CURATED[m.headword];
    if (!next) continue;
    if (m.speakLineEn === next.en && m.speakLineZh === next.zh) continue;
    m.speakLineEn = next.en;
    m.speakLineZh = next.zh;
    touched = true;
    fixed += 1;
  }
  if (touched) {
    c.qualityGate = {
      ...(c.qualityGate || {}),
      rootPolishAt: new Date().toISOString().slice(0, 10),
      rootPolishStage: "root-careful-polish-batch4",
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
console.log(JSON.stringify({ fixed }, null, 2));
