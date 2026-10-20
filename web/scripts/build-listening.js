/**
 * 把 listening-zh 寫回《聽力練習-30.md》，並產出 web/src/data/listening.json。
 * 在倉庫根目錄執行：node web/scripts/build-listening.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const mdPath = path.join(root, "聽力練習-30.md");
const jsonPath = path.join(__dirname, "../src/data/listening.json");

const zhAll = {
  ...require("./listening-zh/01-10"),
  ...require("./listening-zh/11-20"),
  ...require("./listening-zh/21-30"),
};

function splitSpeaker(block) {
  const m = block.match(/^\*\*([^*]+?)[：:]\*\*\s*/);
  if (!m) return { speaker: null, text: block.trim() };
  return { speaker: m[1].trim(), text: block.slice(m[0].length).trim() };
}

function field(text, name) {
  const m = text.match(new RegExp(`^- ${name}：(.+)$`, "m"));
  if (!m) throw new Error(`缺少欄位 ${name}`);
  return m[1].trim();
}

function levelId(levelZh) {
  if (levelZh === "簡單") return "easy";
  if (levelZh === "中等") return "mid";
  if (levelZh === "強化") return "hard";
  throw new Error(`未知難度 ${levelZh}`);
}

let md = fs.readFileSync(mdPath, "utf8").replace(/\r\n/g, "\n");
md = md.replace(/\n### 中文翻譯\n[\s\S]*?(?=\n### )/g, "\n");
md = md.replace(/\n## 真人語音檔名[\s\S]*?(?=\n---\n)/, "\n");

const chunks = md.split(/\n(?=## \d\d　)/);
let head = chunks[0];
if (!head.includes("對過之後再看「中文翻譯」")) {
  head = head.replace(
    "3. 再用下面三題檢查。簡單篇先對細節；中等篇對立場；強化篇對取捨。",
    "3. 再用下面三題檢查。簡單篇先對細節；中等篇對立場；強化篇對取捨。\n4. 對過之後再看「中文翻譯」。",
  );
}

const articles = [];

for (const chunk of chunks.slice(1)) {
  const titleMatch = chunk.match(/^## (\d\d)　(.+)\n/);
  if (!titleMatch) throw new Error("篇名無法解析");
  const id = titleMatch[1];
  const titleEn = titleMatch[2].trim();
  const pack = zhAll[id];
  if (!pack) throw new Error(`缺少中文 ${id}`);

  const scriptSplit = chunk.split("\n### 聽力稿\n");
  if (scriptSplit.length !== 2) throw new Error(`${id} 缺少聽力稿`);
  const meta = scriptSplit[0];
  const rest = scriptSplit[1].split("\n### 聽完再問\n");
  if (rest.length !== 2) throw new Error(`${id} 缺少聽完再問`);
  const enBlocks = rest[0].trim().split(/\n\n+/);
  const qLines = rest[1]
    .replace(/\n---\s*$/, "")
    .trim()
    .split("\n")
    .map((line) => line.match(/^\d+\.\s+(.*)$/))
    .filter(Boolean)
    .map((m) => m[1].trim());

  if (enBlocks.length !== pack.blocks.length) {
    throw new Error(
      `${id} 段落數不符：英文 ${enBlocks.length}，中文 ${pack.blocks.length}`,
    );
  }
  if (qLines.length !== pack.questions.length) {
    throw new Error(
      `${id} 題數不符：英文 ${qLines.length}，中文 ${pack.questions.length}`,
    );
  }

  const blocks = enBlocks.map((enRaw, i) => {
    const en = splitSpeaker(enRaw);
    const zh = splitSpeaker(pack.blocks[i]);
    if (en.speaker !== zh.speaker) {
      throw new Error(
        `${id} 第 ${i + 1} 段說話者不符：${en.speaker} / ${zh.speaker}`,
      );
    }
    return { speaker: en.speaker, en: en.text, zh: zh.text };
  });

  const levelZh = field(meta, "難度");
  const article = {
    id,
    level: levelId(levelZh),
    levelZh,
    words: Number(field(meta, "詞數")),
    titleEn,
    titleZh: pack.titleZh,
    theme: field(meta, "主題"),
    focus: field(meta, "聽力焦點"),
    brief: field(meta, "題旨"),
    blocks,
    questions: qLines.map((en, i) => ({ en, zh: pack.questions[i] })),
    voices: [
      { id: "a", label: "真人 A", file: `${id}-a.mp3` },
      { id: "b", label: "真人 B", file: `${id}-b.mp3` },
    ],
  };
  articles.push(article);
}

if (articles.length !== 30) throw new Error(`篇數 ${articles.length}`);

const voiceTable = [
  "## 真人語音檔名",
  "",
  "電腦語音由網站上的瀏覽器朗讀，不必另放檔案。真人兩軌請放到 `web/public/audio/listen/`，檔名要完全一致。放上之後重新整理頁面即可播放。",
  "",
  "| 篇 | 真人 A | 真人 B |",
  "|---|---|---|",
  ...articles.map(
    (a) => `| ${a.id} ${a.titleZh} | \`${a.id}-a.mp3\` | \`${a.id}-b.mp3\` |`,
  ),
  "",
].join("\n");

head = head.replace(/\n---\n\s*$/, `\n${voiceTable}\n---\n\n`);

function renderScript(blocks, lang) {
  return blocks
    .map((b) =>
      b.speaker ? `**${b.speaker}${lang === "zh" ? "：" : ":"}** ${b[lang]}` : b[lang],
    )
    .join("\n\n");
}

const body = articles
  .map((a) => {
    const questions = a.questions
      .map((q, i) => `${i + 1}. ${q.en}\n   ${q.zh}`)
      .join("\n");
    return [
      `## ${a.id}　${a.titleEn}`,
      "",
      `- 難度：${a.levelZh}`,
      `- 詞數：${a.words}`,
      `- 主題：${a.theme}`,
      `- 聽力焦點：${a.focus}`,
      `- 題旨：${a.brief}`,
      "",
      "### 聽力稿",
      "",
      renderScript(a.blocks, "en"),
      "",
      "### 中文翻譯",
      "",
      renderScript(a.blocks, "zh"),
      "",
      "### 聽完再問",
      "",
      questions,
      "",
    ].join("\n");
  })
  .join("\n---\n\n");

fs.writeFileSync(mdPath, `${head}${body}---\n`);
fs.writeFileSync(jsonPath, `${JSON.stringify({ articles }, null, 2)}\n`);
console.log(`listening: ${articles.length} articles → ${jsonPath}`);
