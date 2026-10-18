/**
 * Parse F1.md (vocab + 2 example sentences each) into speak.json F1 series.
 * Dedupes repeated entry numbers (file contains 1–100 twice).
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "../..");
const MD = path.join(ROOT, "F1.md");
const SPEAK = path.join(__dirname, "../src/data/speak.json");
const TERMS_PER_ARTICLE = 10;

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function parseF1(text) {
  const lines = text.split(/\r?\n/);
  /** @type {Map<number, { num: number, term: string, gloss: string, sentences: {en:string,zh:string}[] }>} */
  const byNum = new Map();
  let cur = null;
  let pendingEn = null;

  function flushPending() {
    pendingEn = null;
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const head = line.match(/^(\d+)\.\s+(.+?)\s+\((.+)\)\s*$/);
    if (head) {
      flushPending();
      const num = Number(head[1]);
      if (byNum.has(num)) {
        cur = null; // skip duplicate block
        continue;
      }
      cur = {
        num,
        term: head[2].trim(),
        gloss: head[3].trim(),
        sentences: [],
      };
      byNum.set(num, cur);
      continue;
    }

    if (!cur) continue;

    const sent = line.match(/^Sentence\s+\d+\s*:\s*(.+)$/i);
    if (sent) {
      pendingEn = sent[1].trim();
      continue;
    }

    const zh = line.match(/^解析[：:]\s*(.+)$/);
    if (zh && pendingEn) {
      cur.sentences.push({ en: pendingEn, zh: zh[1].trim() });
      pendingEn = null;
    }
  }

  return [...byNum.values()].sort((a, b) => a.num - b.num);
}

function buildArticles(entries) {
  const articles = [];
  for (let i = 0; i < entries.length; i += TERMS_PER_ARTICLE) {
    const chunk = entries.slice(i, i + TERMS_PER_ARTICLE);
    const idx = Math.floor(i / TERMS_PER_ARTICLE) + 1;
    const first = chunk[0];
    const last = chunk[chunk.length - 1];
    const pad = String(idx).padStart(2, "0");
    const slug = `f1-${pad}-${slugify(first.term)}`;
    const segments = [];
    for (const e of chunk) {
      e.sentences.forEach((s, si) => {
        segments.push({
          id: `${slug}-${e.num}-${si + 1}`,
          en: s.en,
          zh: s.zh,
        });
      });
    }
    articles.push({
      id: slug,
      slug,
      series: "f1",
      seriesZh: "F1 賽車電影",
      seriesEn: "F1 Movie English",
      titleZh: `第 ${idx} 課 · ${first.term}–${last.term}`,
      titleEn: `F1 Vocab Unit ${idx}`,
      summaryZh: `詞彙 ${first.num}–${last.num}：${chunk.map((c) => c.term).join("、")}。每詞兩句電影場景例句，可 TTS 跟讀與標熟練度。`,
      durationHint: "約 3–6 分",
      audioPath: `/audio/speak/f1/${slug}.mp3`,
      audioFile: `${slug}.mp3`,
      status: "draft",
      segmentCount: segments.length,
      segments,
    });
  }
  return articles;
}

const text = fs.readFileSync(MD, "utf8");
if (!text.trim()) {
  console.error("F1.md is empty");
  process.exit(1);
}

const entries = parseF1(text);
console.log("unique terms", entries.length);
const withSents = entries.filter((e) => e.sentences.length > 0);
console.log(
  "with sentences",
  withSents.length,
  "total sentences",
  withSents.reduce((a, e) => a + e.sentences.length, 0),
);

const f1Articles = buildArticles(withSents);
const speak = JSON.parse(fs.readFileSync(SPEAK, "utf8"));

speak.series = (speak.series || []).filter((s) => s.id !== "f1");
speak.series.push({
  id: "f1",
  slug: "f1",
  titleZh: "F1 賽車電影英語",
  titleEn: "F1 Movie English",
  description:
    "依電影場景例句跟讀：賽車術語、車隊對話與賽道壓力用語。單句可用 TTS；放入 MP3 後可整段跟讀。",
  audioDir: "/audio/speak/f1/",
});

speak.articles = [
  ...(speak.articles || []).filter((a) => a.series !== "f1"),
  ...f1Articles,
];
speak.total = speak.articles.length;
speak.source = `${speak.source || "6r.md"} + F1.md`;

fs.writeFileSync(SPEAK, `${JSON.stringify(speak, null, 2)}\n`);
console.log(
  "wrote",
  f1Articles.length,
  "F1 articles; total speak articles",
  speak.total,
);
