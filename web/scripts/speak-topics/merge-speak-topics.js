/**
 * Merge speak-topics 07–24 into web/src/data/speak.json (keeps F1 + common 01–06).
 * Run from repo root: node web/scripts/speak-topics/merge-speak-topics.js
 */
const fs = require("fs");
const path = require("path");
const { compileTopic } = require("./lib");

const root = path.join(__dirname, "../../..");
const outPath = path.join(root, "web/src/data/speak.json");
const topics = require("./topics-index");

const compiled = topics.map(compileTopic);

let data = JSON.parse(fs.readFileSync(outPath, "utf8"));
const keep = data.articles.filter(
  (a) => a.series !== "common" || /^common-0[1-6]-/.test(a.slug),
);
const commonSeries = data.series.find((s) => s.id === "common");
if (commonSeries) {
  commonSeries.titleZh = "常用口語 24 篇";
  commonSeries.description =
    "生活、職場與 18 個主題口說練習（第 7 篇起含四部分教學：心得、簡短回應、附和補充、句型抽換）。可連續 TTS 跟讀英文；放入 MP3 後可整段播放。";
}

data.articles = [...keep, ...compiled];
data.total = data.articles.length;
data.source = "6r.md + F1.md + speak-topics 07–24";

fs.writeFileSync(outPath, JSON.stringify(data, null, 2), "utf8");
console.log(
  `speak.json: ${data.total} articles (+${compiled.length} topics), segments=${compiled.reduce((n, a) => n + a.segmentCount, 0)}`,
);
