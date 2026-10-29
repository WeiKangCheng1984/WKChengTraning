/**
 * Build Part 4 (15 swappable sentence templates) for every speak article.
 * Run: node web/scripts/speak-topics/build-speak-part4.js
 *
 * Strategy:
 * 1) Prefer replacing a lesson phrase inside a Part 1 line; options = peer phrases.
 * 2) Else carve a short content chunk (2–4 words) and supply theme-aware alternatives.
 */
const fs = require("fs");
const path = require("path");

const outPath = path.join(__dirname, "../../src/data/speak.json");
const data = JSON.parse(fs.readFileSync(outPath, "utf8"));

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function wordCount(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function uniqOptions(list) {
  const seen = new Set();
  const out = [];
  for (const o of list) {
    const k = o.en.trim().toLowerCase();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push({ en: o.en.trim(), zh: o.zh.trim() });
  }
  return out;
}

const FALLBACK_ALTS = {
  time: [
    { en: "an hour", zh: "一小時" },
    { en: "thirty minutes", zh: "三十分鐘" },
    { en: "a few minutes", zh: "幾分鐘" },
    { en: "ten minutes", zh: "十分鐘" },
  ],
  place: [
    { en: "on the floor", zh: "在現場" },
    { en: "at the desk", zh: "在服務臺" },
    { en: "by the entrance", zh: "在入口旁" },
    { en: "in the main hall", zh: "在主館" },
  ],
  action: [
    { en: "double-check", zh: "再核對" },
    { en: "wrap up", zh: "收尾" },
    { en: "follow up", zh: "跟進" },
    { en: "reach out", zh: "聯繫" },
  ],
  thing: [
    { en: "this plan", zh: "這個計畫" },
    { en: "the next step", zh: "下一步" },
    { en: "our timeline", zh: "我們的時程" },
    { en: "the main issue", zh: "主要問題" },
  ],
};

function pickPart1Sentences(article) {
  const part1 = article.segments.filter(
    (s) => typeof s.group === "string" && s.group.startsWith("Part 1"),
  );
  const singles = article.segments.filter((s) => !String(s.en).includes("\n"));
  const pool =
    part1.length >= 15 ? part1 : singles.length >= 15 ? singles : article.segments;
  if (pool.length <= 15) return pool.slice(0, 15);
  const step = pool.length / 15;
  return Array.from({ length: 15 }, (_, i) => pool[Math.min(pool.length - 1, Math.floor(i * step))]);
}

function phrasesByBlock(article) {
  /** @type {Map<string, {en:string,zh:string}[]>} */
  const map = new Map();
  for (const b of article.lesson?.blocks || []) {
    map.set(b.titleZh, b.phrases || []);
  }
  return map;
}

function allPhrases(article) {
  return (article.lesson?.blocks || []).flatMap((b) => b.phrases || []);
}

function blockTitleFromGroup(group) {
  if (!group) return "";
  const m = String(group).match(/^Part 1 · (.+)$/);
  return m ? m[1] : "";
}

function findBestPhrase(en, phrases) {
  const sorted = [...phrases].sort((a, b) => b.en.length - a.en.length);
  for (const p of sorted) {
    if (!p?.en || wordCount(p.en) < 1 || p.en.length < 3) continue;
    // Prefer phrases that are a proper substring, not the whole sentence
    if (p.en.length > en.length * 0.7) continue;
    const re = new RegExp(`\\b${escapeRegExp(p.en)}\\b`, "i");
    if (re.test(en)) return p;
    // also allow non-word-boundary for multiword with punctuation
    if (en.toLowerCase().includes(p.en.toLowerCase())) return p;
  }
  return null;
}

function shapeKey(en) {
  const w = en.trim().toLowerCase();
  if (/^(before|after|during|ahead)\b/.test(w)) return "prep-time";
  if (/^(on|at|in|by|near)\b/.test(w)) return "prep-place";
  if (/^(the|a|an|my|our|this|that|every)\b/.test(w)) return "np";
  if (/ing\b/.test(w.split(/\s+/).pop() || "")) return "gerund";
  return "other";
}

function parallelAlts(seed) {
  const sk = shapeKey(seed.en);
  if (sk === "prep-time") {
    return [
      seed,
      { en: "before the rush", zh: "人潮到來前" },
      { en: "before we start", zh: "開始之前" },
      { en: "ahead of opening", zh: "開幕前" },
      { en: "after the briefing", zh: "簡報之後" },
    ];
  }
  if (sk === "prep-place") {
    return [
      seed,
      { en: "on the floor", zh: "在現場" },
      { en: "at the desk", zh: "在服務臺" },
      { en: "by the entrance", zh: "在入口旁" },
      { en: "in the main hall", zh: "在主館" },
    ];
  }
  if (sk === "np") {
    return [
      seed,
      { en: "the next step", zh: "下一步" },
      { en: "the main issue", zh: "主要問題" },
      { en: "our timeline", zh: "我們的時程" },
      { en: "this plan", zh: "這個計畫" },
    ];
  }
  return [seed, ...guessBank(seed.en)];
}

function peerOptions(seed, peers, globalPhrases) {
  const sk = shapeKey(seed.en);
  const shaped = [...peers, ...globalPhrases].filter(
    (p) =>
      p.en.toLowerCase() !== seed.en.toLowerCase() &&
      shapeKey(p.en) === sk &&
      Math.abs(wordCount(p.en) - wordCount(seed.en)) <= 2,
  );
  return uniqOptions([...parallelAlts(seed), ...shaped]).slice(0, 5);
}

function carveShortChunk(en) {
  // Prefer trailing content (object/complement), not sentence subject
  const cleaned = en.replace(/[?.!,]+$/g, "");
  const words = cleaned.split(/\s+/);

  const vp = cleaned.match(
    /\b((?:hit snooze|call it a day|wrap up|double-check|knock out|grab|book|check|scan|push|pack up|follow up)(?:\s+[a-z][\w'-]*){0,3})\b/i,
  );
  if (vp && wordCount(vp[1]) <= 4) return vp[1];

  const time = cleaned.match(
    /\b((?:an hour|thirty minutes|a few minutes|this morning|tonight|today|every morning|before lunchtime))\b/i,
  );
  if (time) return time[1];

  const dets = [
    ...cleaned.matchAll(
      /\b((?:the|a|an|my|our|this|that|every)\s+[a-z][\w'-]*(?:\s+[a-z][\w'-]*)?)\b/gi,
    ),
  ].map((m) => m[1]);
  // Prefer later determiner phrases (objects)
  for (let i = dets.length - 1; i >= 0; i--) {
    const d = dets[i];
    if (wordCount(d) >= 2 && d.length <= 28 && !cleaned.toLowerCase().startsWith(d.toLowerCase())) {
      return d;
    }
  }

  if (words.length >= 4) {
    const chunk = words.slice(-2).join(" ");
    if (chunk.length >= 4) return chunk;
  }
  return words[words.length - 1] || "it";
}

function guessBank(chunk) {
  const c = chunk.toLowerCase();
  if (
    /\b(minute|hour|noon|morning|night|today|tonight|week|time|lunchtime)\b/.test(
      c,
    ) ||
    /^(before|after|during)\b/.test(c)
  ) {
    return FALLBACK_ALTS.time;
  }
  if (/\b(floor|desk|hall|entrance|stage|room|booth)\b/.test(c)) {
    return FALLBACK_ALTS.place;
  }
  if (
    /^(hit |grab |wrap |check |call |book |push |pack |knock |scan |double|follow)/i.test(
      chunk,
    )
  ) {
    return FALLBACK_ALTS.action;
  }
  if (/ing\b/.test(c) && wordCount(c) <= 3) {
    return [
      { en: chunk, zh: "原文" },
      { en: "warming up", zh: "預熱中" },
      { en: "cooling down", zh: "降溫中" },
      { en: "coming online", zh: "上線中" },
      { en: "running late", zh: "延誤中" },
    ];
  }
  if (/^for\b/.test(c)) {
    return [
      { en: chunk, zh: "原文" },
      { en: "for photos", zh: "拍照用" },
      { en: "for guests", zh: "給來賓" },
      { en: "for the demo", zh: "給示範用" },
      { en: "for tonight", zh: "今晚用" },
    ];
  }
  if (/^(not|less|more)\b/.test(c) || /ly\b/.test(c)) {
    return [
      { en: chunk, zh: "原文" },
      { en: "not stuck", zh: "不卡住" },
      { en: "more smoothly", zh: "更順暢" },
      { en: "less stressful", zh: "壓力較小" },
      { en: "way easier", zh: "輕鬆多了" },
    ];
  }
  // Short noun-like chunks
  if (wordCount(c) <= 3) {
    return [
      { en: chunk, zh: "原文關鍵" },
      { en: "side route", zh: "側線通道" },
      { en: "backup plan", zh: "備案" },
      { en: "quick fix", zh: "快速解法" },
      { en: "safe option", zh: "穩妥選項" },
    ];
  }
  return FALLBACK_ALTS.thing;
}

function buildFromPhrase(en, zh, phrase, peers, globalPhrases, index) {
  const pattern = en.replace(
    new RegExp(escapeRegExp(phrase.en), "i"),
    "[SWAP]",
  );
  if (!pattern.includes("[SWAP]") || pattern.trim() === "[SWAP].") return null;
  // Subject-only swaps read poorly; fall back to carve
  if (/^\[SWAP\](?:\s|$|[.!?])/.test(pattern.trim())) return null;
  const options = peerOptions(phrase, peers, globalPhrases);
  if (options.length < 3) {
    const bank = guessBank(phrase.en);
    for (const b of bank) options.push(b);
  }
  return {
    id: `p4-${String(index + 1).padStart(2, "0")}`,
    pattern,
    zhName: `精粹 ${index + 1}`,
    noteZh: "固定骨架，只換 [SWAP] 關鍵詞。",
    slotLabelZh: "抽換詞",
    baseEn: en,
    baseZh: zh,
    options: uniqOptions(options).slice(0, 5),
  };
}

function buildFromCarve(en, zh, index) {
  let chunk = carveShortChunk(en);
  // Avoid carving almost the whole sentence or leading subjects
  if (chunk.length > en.length * 0.55) {
    const words = en.replace(/[?.!,]+$/g, "").split(/\s+/);
    chunk = words.slice(-2).join(" ");
  }
  let pattern = en.replace(new RegExp(escapeRegExp(chunk), "i"), "[SWAP]");
  if (!pattern.includes("[SWAP]")) {
    pattern = en.replace(/\s*[?.!]*\s*$/, "") + " [SWAP].";
    chunk = "today";
  }
  // Prefer mid/end slots; avoid subject-leading "[SWAP] hits..."
  if (/^\[SWAP\](?:\s|$|[.!?])/.test(pattern.trim())) {
    const words = en.replace(/[?.!,]+$/g, "").split(/\s+/);
    const candidates = [
      words.slice(-2).join(" "),
      words.slice(-3).join(" "),
      words[words.length - 1],
    ].filter(Boolean);
    for (const endChunk of candidates) {
      if (endChunk.toLowerCase() === chunk.toLowerCase()) continue;
      if (en.toLowerCase().startsWith(endChunk.toLowerCase())) continue;
      const next = en.replace(new RegExp(escapeRegExp(endChunk), "i"), "[SWAP]");
      if (next.includes("[SWAP]") && !/^\[SWAP\](?:\s|$|[.!?])/.test(next.trim())) {
        chunk = endChunk;
        pattern = next;
        break;
      }
    }
  }
  const bank = guessBank(chunk);
  const options = uniqOptions([
    { en: chunk, zh: "原文關鍵" },
    ...bank,
  ]).slice(0, 5);
  return {
    id: `p4-${String(index + 1).padStart(2, "0")}`,
    pattern,
    zhName: `精粹 ${index + 1}`,
    noteZh: "固定骨架，只換 [SWAP] 關鍵詞。",
    slotLabelZh: "抽換詞",
    baseEn: en,
    baseZh: zh,
    options,
  };
}

function shortenLongEn(en) {
  // F1 lines are long — keep a usable clause around the first comma / 14 words
  if (wordCount(en) <= 16) return en;
  const first = en.split(/[,;]/)[0].trim();
  if (wordCount(first) >= 6 && wordCount(first) <= 16) {
    return /[.!?]$/.test(first) ? first : `${first}.`;
  }
  const words = en.replace(/[?.!,]+$/g, "").split(/\s+/).slice(0, 14);
  return `${words.join(" ")}.`;
}

function buildPart4(article) {
  const byBlock = phrasesByBlock(article);
  const global = allPhrases(article);
  const seeds = pickPart1Sentences(article);
  const items = [];

  for (let i = 0; i < 15; i++) {
    const seg = seeds[i] || article.segments[i % article.segments.length];
    let en = String(seg.en).split("\n")[0].trim();
    const zh = String(seg.zh).split("\n")[0].trim();
    en = shortenLongEn(en);

    const blockTitle = blockTitleFromGroup(seg.group);
    const peers = byBlock.get(blockTitle) || global;
    const hit = findBestPhrase(en, peers.length ? peers : global);

    let item = null;
    if (hit) {
      item = buildFromPhrase(en, zh, hit, peers, global, i);
    }
    if (!item) item = buildFromCarve(en, zh, i);
    item.id = `${article.slug}-p4-${String(i + 1).padStart(2, "0")}`;
    items.push(item);
  }

  return {
    introZh:
      "Part 4｜內容精粹：從本篇抽出 15 句可抽換骨架。句型固定，只換 [SWAP] 關鍵詞，練替換反應與口說流暢度。",
    items,
  };
}

let updated = 0;
for (const article of data.articles) {
  article.part4 = buildPart4(article);
  if (article.lesson?.introZh && !/Part 4/.test(article.lesson.introZh)) {
    article.lesson.introZh = article.lesson.introZh.replace(
      /。\s*$/,
      "；Part 4 再練 15 句抽換模板。",
    );
  }
  // Normalize intro for themed lessons
  if (article.lesson?.introZh?.includes("三部分")) {
    article.lesson.introZh = article.lesson.introZh.replace("三部分", "四部分");
  }
  updated += 1;
}

const commonSeries = data.series.find((s) => s.id === "common");
if (commonSeries) {
  commonSeries.description =
    "生活、職場與主題口說練習。第 7 篇起含四部分教學：心得、簡短回應、附和補充、句型抽換（每篇 15 句）。可連續 TTS 跟讀英文；有 MP3 時可整段播放。";
}

if (!String(data.source).includes("part4")) {
  data.source = `${data.source} + part4 templates`;
}

fs.writeFileSync(outPath, JSON.stringify(data, null, 2), "utf8");

let issues = 0;
for (const a of data.articles) {
  if (!a.part4 || a.part4.items.length !== 15) {
    console.log("count", a.slug, a.part4?.items?.length);
    issues++;
  }
  for (const it of a.part4.items) {
    if (!it.pattern.includes("[SWAP]")) {
      console.log("noswap", a.slug, it.id, it.pattern);
      issues++;
    }
    if (it.options.length < 3) {
      console.log("opts", a.slug, it.id, it.options.length);
      issues++;
    }
  }
}

console.log(
  `part4 rebuilt for ${updated} articles; issues=${issues}; sample07=${JSON.stringify(data.articles.find((a) => a.slug === "common-07-exhibition-venue").part4.items.slice(0, 3).map((x) => ({ p: x.pattern, o: x.options.map((z) => z.en) })), null, 2)}`,
);
if (issues) process.exit(1);
