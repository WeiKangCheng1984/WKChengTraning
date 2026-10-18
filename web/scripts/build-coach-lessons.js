/**
 * Build coach-lessons.json (60 AI conversation modules) from site data + plan metadata.
 */
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../src/data");
const style = JSON.parse(fs.readFileSync(path.join(dataDir, "style-phrases.json"), "utf8"));
const conv = JSON.parse(fs.readFileSync(path.join(dataDir, "conversation-four.json"), "utf8"));
const speak = JSON.parse(fs.readFileSync(path.join(dataDir, "speak.json"), "utf8"));
const english = JSON.parse(fs.readFileSync(path.join(dataDir, "english.json"), "utf8"));

function styleGroupTitles(stageId, sectionIdx, n = 3) {
  const st = style.stages.find((s) => s.id === stageId);
  const sec = st?.sections[sectionIdx];
  if (!sec) return [];
  return sec.groups.slice(0, n).map((g) => g.titleZh);
}

function styleExample(stageId, sectionIdx, groupIdx = 0) {
  const st = style.stages.find((s) => s.id === stageId);
  const g = st?.sections[sectionIdx]?.groups[groupIdx];
  return g?.items?.[0]?.en || g?.titleZh || "";
}

function convFormulas(typeSlug, blockIdx, n = 3) {
  const t = conv.types.find((x) => x.slug === typeSlug);
  const block = t?.blocks[blockIdx];
  if (!block) return [];
  return block.formulas.slice(0, n).map((f) => f.en);
}

function enPatterns(catSlug, n = 3) {
  const c = english.categories.find((x) => x.slug === catSlug);
  if (!c) return [];
  return c.items.slice(0, n).map((it) => it.en);
}

function f1Segments(articleOffset, n = 3) {
  const arts = speak.articles.filter((a) => a.series === "f1");
  const a = arts[articleOffset];
  if (!a) return [];
  return a.segments.slice(0, n).map((s) => s.en);
}

function speakCommon(articleIdx, n = 3) {
  const arts = speak.articles.filter((a) => a.series === "common");
  const a = arts[articleIdx];
  if (!a) return [];
  return a.segments.slice(0, n).map((s) => s.en);
}

function pad(n) {
  return String(n).padStart(2, "0");
}

const seasons = [
  { id: 1, titleZh: "開場與節奏", titleEn: "Openers & Rhythm", lessons: [1, 10] },
  { id: 2, titleZh: "職場輸出", titleEn: "Workplace Output", lessons: [11, 20] },
  { id: 3, titleZh: "敘事與共情", titleEn: "Story & Empathy", lessons: [21, 30] },
  { id: 4, titleZh: "個人風格", titleEn: "Signature Style", lessons: [31, 40] },
  { id: 5, titleZh: "壓力對話", titleEn: "Pressure Talk", lessons: [41, 50] },
  { id: 6, titleZh: "領域與總整", titleEn: "Domain & Capstone", lessons: [51, 60] },
];

/** @type {Array<object>} */
const defs = [
  {
    id: 1,
    topicEn: "Warm start & small talk",
    topicZh: "開場熱身寒暄",
    scenario:
      "AI is a friendly American acquaintance you bump into at a café. Chat casually about your morning and plans. You try to sound natural, not textbook.",
    aiRole: "咖啡廳巧遇的美式朋友",
    sourceHref: "/speak/common-01-new-day",
    sourceLabel: "跟讀 · 新的一天",
    targets: speakCommon(0, 3),
    pattern: {
      pattern: "I’ve been meaning to [verb]…",
      example: "I’ve been meaning to ask — how’s your week going?",
    },
  },
  {
    id: 2,
    topicEn: "Soften with buffers",
    topicZh: "用緩衝軟化語氣",
    scenario:
      "AI is a mild-mannered coworker. Soften direct requests with natural buffers while staying clear.",
    aiRole: "溫和同事",
    sourceHref: "/english/style/openers",
    sourceLabel: "風格 · 發語詞與緩衝",
    targets: [
      "I’m just trying to get a better sense of the big picture.",
      "I was just wondering if you had any thoughts on this.",
      "It’s just that I want to make sure we don’t miss any small details.",
    ],
    pattern: {
      pattern: "I was just wondering if…",
      example: "I was just wondering if we could push the review to tomorrow.",
    },
  },
  {
    id: 3,
    topicEn: "Actually / Basically clarity",
    topicZh: "精準開場：Actually／Basically",
    scenario:
      "AI is a product teammate in a quick sync. Use Actually/Basically to clarify without sounding rude.",
    aiRole: "產品同事",
    sourceHref: "/english/style/openers",
    sourceLabel: "風格 · Actually／Basically",
    targets: styleGroupTitles(1, 0, 2).concat([
      styleExample(1, 0, 0),
    ]).slice(0, 3),
    pattern: {
      pattern: "Actually, … / Basically, …",
      example: styleExample(1, 0, 0),
    },
  },
  {
    id: 4,
    topicEn: "I mean / You know connection",
    topicZh: "社交共鳴：I mean／You know",
    scenario:
      "AI chats like a Slack voice-note friend. Keep it warm and connected using I mean / You know.",
    aiRole: "非正式對話的朋友",
    sourceHref: "/english/style/openers",
    sourceLabel: "風格 · I mean／You know",
    targets: styleGroupTitles(1, 1, 2).concat([styleExample(1, 1, 0)]).slice(0, 3),
    pattern: {
      pattern: "I mean, …",
      example: styleExample(1, 1, 0),
    },
  },
  {
    id: 5,
    topicEn: "Fair enough / Right",
    topicZh: "消化對方訊息再接話",
    scenario:
      "AI is a logical discussion partner. Acknowledge their point, pause, then steer with your view.",
    aiRole: "理性討論夥伴",
    sourceHref: "/english/style/openers",
    sourceLabel: "風格 · Fair enough／Right",
    targets: styleGroupTitles(1, 2, 2).concat([styleExample(1, 2, 0)]).slice(0, 3),
    pattern: {
      pattern: "Fair enough, but…",
      example: styleExample(1, 2, 0),
    },
  },
  {
    id: 6,
    topicEn: "Honestly / Realistically",
    topicZh: "直率但專業",
    scenario:
      "Weekly team standup. Be direct with Honestly/Realistically without sounding harsh.",
    aiRole: "週會隊友",
    sourceHref: "/english/style/openers",
    sourceLabel: "風格 · Honestly／Realistically",
    targets: styleGroupTitles(1, 3, 2).concat([styleExample(1, 3, 0)]).slice(0, 3),
    pattern: {
      pattern: "Honestly, I think…",
      example: styleExample(1, 3, 0),
    },
  },
  {
    id: 7,
    topicEn: "Ask & extend · icebreak",
    topicZh: "破冰式觸探",
    scenario:
      "Networking mixer. AI is someone new. Practice icebreaker asks and extend the chat.",
    aiRole: "社交聚會新人",
    sourceHref: "/english/conversation/ask-extend",
    sourceLabel: "會話 · 提問延展",
    targets: convFormulas("ask-extend", 0, 3),
    pattern: {
      pattern: "I’ve been meaning to ask someone who knows about [X]…",
      example: convFormulas("ask-extend", 0, 1)[0] || "",
    },
  },
  {
    id: 8,
    topicEn: "Ask & extend · dig deeper",
    topicZh: "深度追問",
    scenario:
      "AI is a curious interviewer. Dig deeper with follow-up questions without sounding like an interrogation.",
    aiRole: "好奇的訪談者",
    sourceHref: "/english/conversation/ask-extend",
    sourceLabel: "會話 · 深度觀點",
    targets: convFormulas("ask-extend", 1, 3),
    pattern: {
      pattern: "What made you decide to…?",
      example: convFormulas("ask-extend", 1, 1)[0] || "",
    },
  },
  {
    id: 9,
    topicEn: "Daily rhythm spoken",
    topicZh: "日常節奏口語",
    scenario:
      "AI is a roommate/family member. Talk through a normal day using spoken rhythm lines.",
    aiRole: "室友／家人",
    sourceHref: "/speak",
    sourceLabel: "跟讀 · 常用口語",
    targets: speakCommon(1, 3).length ? speakCommon(1, 3) : speakCommon(0, 3),
    pattern: {
      pattern: "I’m gonna [verb]…",
      example: speakCommon(0, 5)[4] || speakCommon(0, 1)[0] || "",
    },
  },
  {
    id: 10,
    topicEn: "Week-1 mix replay",
    topicZh: "第一季小複盤",
    scenario:
      "AI is your coach doing a rapid oral quiz. Reuse openers and icebreakers from Lessons 1–9 in one fluid chat.",
    aiRole: "教練複習官",
    sourceHref: "/english/style/openers",
    sourceLabel: "風格 · 開場複盤",
    targets: [
      "Actually,",
      "Fair enough,",
      "I’ve been meaning to ask…",
    ],
    pattern: {
      pattern: "Mix: Actually / Fair enough / I’ve been meaning to…",
      example: "Actually, fair enough — I’ve been meaning to ask about that.",
    },
  },
  // Season 2
  {
    id: 11,
    topicEn: "Polite requests",
    topicZh: "禮貌請求",
    scenario:
      "AI needs a favor at work. Make polite requests and negotiate gently.",
    aiRole: "需要幫忙的同事",
    sourceHref: "/english/polite-requests-networking-3",
    sourceLabel: "句型 · 禮貌請求",
    targets: enPatterns("polite-requests-networking-3", 3),
    pattern: {
      pattern: "Would you mind if…?",
      example: enPatterns("polite-requests-networking-3", 1)[0] || "",
    },
  },
  {
    id: 12,
    topicEn: "Networking soft asks",
    topicZh: "人脈場合請求",
    scenario:
      "Industry mixer. AI is a stranger in your field. Soft-ask for intros or advice.",
    aiRole: "產業活動陌生人",
    sourceHref: "/english/polite-requests-networking-3",
    sourceLabel: "句型 · 人脈請求",
    targets: enPatterns("polite-requests-networking-3", 6).slice(3, 6),
    pattern: {
      pattern: "If it’s not too much trouble…",
      example: "If it’s not too much trouble, could I grab your email?",
    },
  },
  {
    id: 13,
    topicEn: "Opinion with soft landing",
    topicZh: "溫和表達觀點",
    scenario:
      "AI disagrees with you on a product call. Soft-land your opinion, then hold your ground.",
    aiRole: "意見不合的隊友",
    sourceHref: "/english/conversation/express-views",
    sourceLabel: "會話 · 表達觀點",
    targets: convFormulas("express-views", 0, 3),
    pattern: {
      pattern: "I see it a bit differently…",
      example: convFormulas("express-views", 0, 1)[0] || "",
    },
  },
  {
    id: 14,
    topicEn: "Transitions & logic",
    topicZh: "轉折邏輯",
    scenario:
      "Project alignment meeting. Use connectors to move from observation to recommendation.",
    aiRole: "專案對齊會議主持",
    sourceHref: "/english/style/connectors",
    sourceLabel: "風格 · 邏輯連接",
    targets: styleGroupTitles(2, 0, 2).concat(styleGroupTitles(2, 1, 1)).slice(0, 3),
    pattern: {
      pattern: "That being said, …",
      example: styleExample(2, 1, 0),
    },
  },
  {
    id: 15,
    topicEn: "Bottom line / The thing is",
    topicZh: "直切重點",
    scenario:
      "Busy manager has two minutes. Get to the bottom line fast.",
    aiRole: "忙碌主管",
    sourceHref: "/english/style/connectors",
    sourceLabel: "風格 · Bottom line",
    targets: styleGroupTitles(2, 0, 2).concat([styleExample(2, 0, 0)]).slice(0, 3),
    pattern: {
      pattern: "The bottom line is…",
      example: styleExample(2, 0, 0),
    },
  },
  {
    id: 16,
    topicEn: "That being said",
    topicZh: "多面觀察後轉折",
    scenario:
      "Strategy chat. Acknowledge a good point, then pivot with That being said / Having said that.",
    aiRole: "策略討論對象",
    sourceHref: "/english/style/connectors",
    sourceLabel: "風格 · That being said",
    targets: styleGroupTitles(2, 1, 2).concat([styleExample(2, 1, 0)]).slice(0, 3),
    pattern: {
      pattern: "That being said, …",
      example: styleExample(2, 1, 0),
    },
  },
  {
    id: 17,
    topicEn: "Deadlines & efficiency",
    topicZh: "期限與效率",
    scenario:
      "Standup. Talk deadlines, tradeoffs, and what’s blocking you.",
    aiRole: "Scrum 隊友",
    sourceHref: "/english/time-efficiency-deadline-4",
    sourceLabel: "句型 · 期限效率",
    targets: enPatterns("time-efficiency-deadline-4", 3),
    pattern: {
      pattern: "If we want to hit [deadline], we need to…",
      example: enPatterns("time-efficiency-deadline-4", 1)[0] || "",
    },
  },
  {
    id: 18,
    topicEn: "Challenges & solutions",
    topicZh: "挑戰與解法",
    scenario:
      "Post-mortem. Name the challenge, then propose a practical fix.",
    aiRole: "故障檢討會議",
    sourceHref: "/english/challenges-assessment-solutions-6",
    sourceLabel: "句型 · 挑戰解法",
    targets: enPatterns("challenges-assessment-solutions-6", 3),
    pattern: {
      pattern: "The main challenge is… One way forward is…",
      example: enPatterns("challenges-assessment-solutions-6", 1)[0] || "",
    },
  },
  {
    id: 19,
    topicEn: "Work / project updates",
    topicZh: "專案進度口述",
    scenario:
      "1:1 with your lead. Give a crisp status: done / doing / blocked.",
    aiRole: "一對一主管",
    sourceHref: "/english/work-project-management-8",
    sourceLabel: "句型 · 專案管理",
    targets: enPatterns("work-project-management-8", 3),
    pattern: {
      pattern: "Here’s where we are… Next I’ll…",
      example: enPatterns("work-project-management-8", 1)[0] || "",
    },
  },
  {
    id: 20,
    topicEn: "Season-2 mix",
    topicZh: "職場季複盤",
    scenario:
      "Mock interview. Mix polite asks, opinions, and deadline talk from Season 2.",
    aiRole: "模擬面試官",
    sourceHref: "/english/conversation/express-views",
    sourceLabel: "會話 · 觀點複盤",
    targets: [
      "Would you mind if…",
      "The bottom line is…",
      "That being said…",
    ],
    pattern: {
      pattern: "The bottom line is… That being said…",
      example: "The bottom line is we need help — that being said, I can cover Friday.",
    },
  },
  // Season 3
  {
    id: 21,
    topicEn: "Story hook opening",
    topicZh: "懸念式開頭",
    scenario:
      "AI is a friend who loves stories. Open with a hook, then invite questions.",
    aiRole: "聽故事的朋友",
    sourceHref: "/english/conversation/storytelling",
    sourceLabel: "會話 · 講故事",
    targets: convFormulas("storytelling", 0, 3),
    pattern: {
      pattern: "You’re not gonna believe what happened…",
      example: convFormulas("storytelling", 0, 1)[0] || "",
    },
  },
  {
    id: 22,
    topicEn: "Scene-setting",
    topicZh: "情境帶入",
    scenario:
      "Podcast-style chat. Set the scene with sensory/time details.",
    aiRole: "podcast 對談來賓",
    sourceHref: "/english/conversation/storytelling",
    sourceLabel: "會話 · 情境帶入",
    targets: convFormulas("storytelling", 1, 3),
    pattern: {
      pattern: "So picture this…",
      example: convFormulas("storytelling", 1, 1)[0] || "",
    },
  },
  {
    id: 23,
    topicEn: "Turning point",
    topicZh: "高潮轉折",
    scenario:
      "Continue a story; hit the turning point clearly.",
    aiRole: "想聽細節的同事",
    sourceHref: "/english/conversation/storytelling",
    sourceLabel: "會話 · 高潮轉折",
    targets: convFormulas("storytelling", 2, 3),
    pattern: {
      pattern: "And that’s when everything changed…",
      example: convFormulas("storytelling", 2, 1)[0] || "",
    },
  },
  {
    id: 24,
    topicEn: "Story landing",
    topicZh: "畫龍點睛收束",
    scenario:
      "Land the story with a clear takeaway or punchline.",
    aiRole: "聽故事的朋友",
    sourceHref: "/english/conversation/storytelling",
    sourceLabel: "會話 · 收束",
    targets: convFormulas("storytelling", 3, 3),
    pattern: {
      pattern: "Looking back, the point is…",
      example: convFormulas("storytelling", 3, 1)[0] || "",
    },
  },
  {
    id: 25,
    topicEn: "Emotional mirroring",
    topicZh: "情緒同頻",
    scenario:
      "AI is a friend having a rough day. Mirror feelings before advice.",
    aiRole: "心情不好的朋友",
    sourceHref: "/english/conversation/listen-empathy",
    sourceLabel: "會話 · 傾聽共情",
    targets: convFormulas("listen-empathy", 0, 3),
    pattern: {
      pattern: "That sounds really [emotion]…",
      example: convFormulas("listen-empathy", 0, 1)[0] || "",
    },
  },
  {
    id: 26,
    topicEn: "Paraphrase empathy",
    topicZh: "換句話說",
    scenario:
      "Practice reflecting back what you heard before responding.",
    aiRole: "需要被理解的朋友",
    sourceHref: "/english/conversation/listen-empathy",
    sourceLabel: "會話 · 換句話說",
    targets: convFormulas("listen-empathy", 1, 3),
    pattern: {
      pattern: "So what I’m hearing is…",
      example: convFormulas("listen-empathy", 1, 1)[0] || "",
    },
  },
  {
    id: 27,
    topicEn: "Empower & support",
    topicZh: "積極賦能",
    scenario:
      "AI is a junior teammate who feels stuck. Support without taking over.",
    aiRole: "受挫的後輩",
    sourceHref: "/english/conversation/listen-empathy",
    sourceLabel: "會話 · 積極賦能",
    targets: convFormulas("listen-empathy", 2, 3),
    pattern: {
      pattern: "You’ve already handled [X] — what’s one next step?",
      example: convFormulas("listen-empathy", 2, 1)[0] || "",
    },
  },
  {
    id: 28,
    topicEn: "Moving on / On that note",
    topicZh: "推進話題",
    scenario:
      "You lightly facilitate a tour/meeting. Keep momentum with Moving on / On that note.",
    aiRole: "會議／導覽聽眾",
    sourceHref: "/english/style/connectors",
    sourceLabel: "風格 · Moving on",
    targets: styleGroupTitles(2, 2, 2).concat([styleExample(2, 2, 0)]).slice(0, 3),
    pattern: {
      pattern: "Moving on to… / On that note…",
      example: styleExample(2, 2, 0),
    },
  },
  {
    id: 29,
    topicEn: "To be fair / For what it's worth",
    topicZh: "同理＋建議",
    scenario:
      "Gentle debate with a friend. Balance fairness and your suggestion.",
    aiRole: "溫和諍友",
    sourceHref: "/english/style/connectors",
    sourceLabel: "風格 · To be fair",
    targets: styleGroupTitles(2, 3, 2).concat([styleExample(2, 3, 0)]).slice(0, 3),
    pattern: {
      pattern: "To be fair… For what it’s worth…",
      example: styleExample(2, 3, 0),
    },
  },
  {
    id: 30,
    topicEn: "Season-3 mix",
    topicZh: "敘事共情複盤",
    scenario:
      "Coach mixes storytelling + empathy prompts from Season 3.",
    aiRole: "教練複盤",
    sourceHref: "/english/conversation/storytelling",
    sourceLabel: "會話 · 敘事複盤",
    targets: [
      "So picture this…",
      "So what I’m hearing is…",
      "To be fair…",
    ],
    pattern: {
      pattern: "So picture this… / So what I’m hearing is…",
      example: "So picture this — and so what I’m hearing is you felt stuck.",
    },
  },
  // Season 4 Signature
  {
    id: 31,
    topicEn: "Bird’s-eye / big picture",
    topicZh: "拉高視角",
    scenario:
      "Strategy workshop. Zoom out before diving into details.",
    aiRole: "工作坊夥伴",
    sourceHref: "/english/style/signature",
    sourceLabel: "風格 · Signature 視野",
    targets: styleGroupTitles(3, 0, 3),
    pattern: {
      pattern: "Let’s look at this from a bird’s eye view…",
      example: styleExample(3, 0, 0),
    },
  },
  {
    id: 32,
    topicEn: "Frame of mind / angle",
    topicZh: "心態與角度",
    scenario:
      "Casual museum/open-house chat. Talk about perspective and framing.",
    aiRole: "展覽／看房同伴",
    sourceHref: "/english/style/signature",
    sourceLabel: "風格 · frame of mind",
    targets: [
      styleGroupTitles(3, 0, 5)[1],
      styleGroupTitles(3, 0, 5)[4],
      styleExample(3, 0, 1),
    ].filter(Boolean).slice(0, 3),
    pattern: {
      pattern: "It depends on the angle you’re taking…",
      example: styleExample(3, 0, 4),
    },
  },
  {
    id: 33,
    topicEn: "Sweet spot / calibrate",
    topicZh: "平衡與校準",
    scenario:
      "Plan a trip/weekend. Negotiate expectations and find the sweet spot.",
    aiRole: "一起排行程的朋友",
    sourceHref: "/english/style/signature",
    sourceLabel: "風格 · sweet spot",
    targets: [
      styleGroupTitles(3, 0, 5)[2],
      styleGroupTitles(3, 1, 5)[4],
      styleExample(3, 1, 4),
    ].filter(Boolean).slice(0, 3),
    pattern: {
      pattern: "I’m looking for that sweet spot between X and Y…",
      example: styleExample(3, 0, 2),
    },
  },
  {
    id: 34,
    topicEn: "Break it down / sequence",
    topicZh: "拆解與流程",
    scenario:
      "Onboarding a newbie. Break a complex task into a clear sequence.",
    aiRole: "新進同事",
    sourceHref: "/english/style/signature",
    sourceLabel: "風格 · break it down",
    targets: styleGroupTitles(3, 1, 3),
    pattern: {
      pattern: "Let’s break this down into smaller pieces…",
      example: styleExample(3, 1, 1),
    },
  },
  {
    id: 35,
    topicEn: "Develop / nurture / stages",
    topicZh: "成長過程用語",
    scenario:
      "Side-project chat. Talk progress without rushing the process.",
    aiRole: "副業夥伴",
    sourceHref: "/english/style/signature",
    sourceLabel: "風格 · 成長過程",
    targets: styleGroupTitles(3, 2, 3),
    pattern: {
      pattern: "Let’s see how this develops over time…",
      example: styleExample(3, 2, 0),
    },
  },
  {
    id: 36,
    topicEn: "Root cause not symptoms",
    topicZh: "找根因",
    scenario:
      "Troubleshooting call. Push past symptoms toward root cause.",
    aiRole: "一起排查的工程師",
    sourceHref: "/english/style/signature",
    sourceLabel: "風格 · root cause",
    targets: [
      styleGroupTitles(3, 2, 5)[4],
      styleExample(3, 2, 4),
      "Let’s not just patch the symptoms.",
    ].filter(Boolean).slice(0, 3),
    pattern: {
      pattern: "It’s about finding the root cause, not just the symptoms…",
      example: styleExample(3, 2, 4),
    },
  },
  {
    id: 37,
    topicEn: "West-coast vibe lines",
    topicZh: "西岸隨性用語",
    scenario:
      "Weekend plans with an LA friend. Keep it chill and natural.",
    aiRole: "西岸風格朋友",
    sourceHref: "/english/style/signature",
    sourceLabel: "風格 · 社交氛圍",
    targets: styleGroupTitles(3, 3, 3),
    pattern: {
      pattern: "What’s the move for the rest of the day?",
      example: styleExample(3, 3, 0),
    },
  },
  {
    id: 38,
    topicEn: "Clear the air / hit the mark",
    topicZh: "澄清與對準",
    scenario:
      "Client walkthrough. Clear confusion and check you’re hitting the mark.",
    aiRole: "客戶／聽眾",
    sourceHref: "/english/style/signature",
    sourceLabel: "風格 · 引導澄清",
    targets: styleGroupTitles(3, 4, 3),
    pattern: {
      pattern: "Just to clear the air… I want to make sure I’m hitting the mark…",
      example: styleExample(3, 4, 0),
    },
  },
  {
    id: 39,
    topicEn: "Put a pin / walk through",
    topicZh: "控場與導覽",
    scenario:
      "Facility tour. Park side topics and walk people through the story.",
    aiRole: "導覽聽眾",
    sourceHref: "/english/style/signature",
    sourceLabel: "風格 · put a pin",
    targets: [
      styleGroupTitles(3, 4, 5)[3],
      styleGroupTitles(3, 4, 5)[4],
      styleExample(3, 4, 3),
    ].filter(Boolean).slice(0, 3),
    pattern: {
      pattern: "Let’s put a pin in that for now…",
      example: styleExample(3, 4, 3),
    },
  },
  {
    id: 40,
    topicEn: "Season-4 mix",
    topicZh: "風格季複盤",
    scenario:
      "Coach samples signature lines from Season 4 in one conversation.",
    aiRole: "教練抽樣",
    sourceHref: "/english/style/signature",
    sourceLabel: "風格 · Signature 複盤",
    targets: [
      "Let’s zoom out for a second…",
      "Let’s break this down…",
      "What’s the move…?",
    ],
    pattern: {
      pattern: "Let’s zoom out… then break it down…",
      example: "Let’s zoom out for a second, then break this down into two steps.",
    },
  },
  // Season 5 Pressure
  {
    id: 41,
    topicEn: "Buy thinking time",
    topicZh: "爭取思考時間",
    scenario:
      "Surprise Q&A. Buy a few seconds without sounding lost.",
    aiRole: "突襲提問的客戶",
    sourceHref: "/english/style/pressure-relief",
    sourceLabel: "風格 · 思考緩衝",
    targets: styleGroupTitles(4, 0, 3),
    pattern: {
      pattern: "Let me just process that for a second…",
      example: styleExample(4, 0, 0),
    },
  },
  {
    id: 42,
    topicEn: "Honest “I don’t know yet”",
    topicZh: "優雅承認未知",
    scenario:
      "Tricky questions. Admit limits and offer a clean follow-up path.",
    aiRole: "刁鑽 Q&A",
    sourceHref: "/english/style/pressure-relief",
    sourceLabel: "風格 · 未知應對",
    targets: styleGroupTitles(4, 1, 3),
    pattern: {
      pattern: "I don’t have the exact data on me, but I can find out…",
      example: styleExample(4, 1, 1),
    },
  },
  {
    id: 43,
    topicEn: "Redirect & stay on track",
    topicZh: "轉向與節奏",
    scenario:
      "Meeting goes off-topic. Redirect politely and keep the schedule.",
    aiRole: "會議跑題的人",
    sourceHref: "/english/style/pressure-relief",
    sourceLabel: "風格 · 轉向控場",
    targets: styleGroupTitles(4, 2, 3),
    pattern: {
      pattern: "In the interest of time, let’s focus on…",
      example: styleExample(4, 2, 0),
    },
  },
  {
    id: 44,
    topicEn: "Disagree with respect",
    topicZh: "有禮異議",
    scenario:
      "Colleague pushes a weak plan. Disagree without escalating.",
    aiRole: "意見衝突的同事",
    sourceHref: "/english/style/pressure-relief",
    sourceLabel: "風格 · 有禮異議",
    targets: styleGroupTitles(4, 3, 3),
    pattern: {
      pattern: "I see your point, though my observation suggests…",
      example: styleExample(4, 3, 0),
    },
  },
  {
    id: 45,
    topicEn: "Elegant exit",
    topicZh: "優雅收尾撤退",
    scenario:
      "You need to leave a conversation cleanly without awkwardness.",
    aiRole: "想結束對話的場合",
    sourceHref: "/english/style/pressure-relief",
    sourceLabel: "風格 · 優雅撤退",
    targets: styleGroupTitles(4, 4, 3),
    pattern: {
      pattern: "I’ll let you get back to what you were doing…",
      example: styleExample(4, 4, 0),
    },
  },
  {
    id: 46,
    topicEn: "High-EQ disagreement",
    topicZh: "高 EQ 太極",
    scenario:
      "Sensitive topic. Stay high-EQ while holding a different view.",
    aiRole: "敏感話題對話者",
    sourceHref: "/english/conversation/express-views",
    sourceLabel: "會話 · 高EQ",
    targets: convFormulas("express-views", 2, 3),
    pattern: {
      pattern: "I get where you’re coming from… At the same time…",
      example: convFormulas("express-views", 2, 1)[0] || "",
    },
  },
  {
    id: 47,
    topicEn: "Under pressure updates",
    topicZh: "壓力下回報",
    scenario:
      "Manager pushes for status now. Stay calm, clear, and honest.",
    aiRole: "催進度的主管",
    sourceHref: "/english/work-project-management-8",
    sourceLabel: "句型 · 專案壓力",
    targets: enPatterns("work-project-management-8", 3),
    pattern: {
      pattern: "Here’s the status in one line… Risk is… Next step is…",
      example: "Here’s the status: design’s done; risk is QA; next step is a dry run today.",
    },
  },
  {
    id: 48,
    topicEn: "Hypothesis & possibility",
    topicZh: "假設與可能",
    scenario:
      "Brainstorm. Explore if/then possibilities without overcommitting.",
    aiRole: "腦力激盪夥伴",
    sourceHref: "/english/hypothesis-conditions-possibility-5",
    sourceLabel: "句型 · 假設條件",
    targets: enPatterns("hypothesis-conditions-possibility-5", 3),
    pattern: {
      pattern: "If we…, we might…",
      example: enPatterns("hypothesis-conditions-possibility-5", 1)[0] || "",
    },
  },
  {
    id: 49,
    topicEn: "Emotions & adaptability",
    topicZh: "情緒與適應",
    scenario:
      "Team is in change mode. Name emotions and show adaptability.",
    aiRole: "變動期隊友",
    sourceHref: "/english/emotions-adaptability-11",
    sourceLabel: "句型 · 情緒適應",
    targets: enPatterns("emotions-adaptability-11", 3),
    pattern: {
      pattern: "I’m adapting to… What’s helping me is…",
      example: enPatterns("emotions-adaptability-11", 1)[0] || "",
    },
  },
  {
    id: 50,
    topicEn: "Season-5 mix",
    topicZh: "壓力季複盤",
    scenario:
      "Tough client / board-style pressure. Mix thinking time, redirect, and respectful disagreement.",
    aiRole: "難搞客戶／董事會",
    sourceHref: "/english/style/pressure-relief",
    sourceLabel: "風格 · 壓力複盤",
    targets: [
      "Let me process that for a second…",
      "In the interest of time…",
      "I see your point, though…",
    ],
    pattern: {
      pattern: "Process → Redirect → Disagree politely",
      example:
        "Let me process that — in the interest of time, I see your point, though I’d frame it differently.",
    },
  },
  // Season 6
  {
    id: 51,
    topicEn: "F1 garage talk · basics",
    topicZh: "維修區基礎用語",
    scenario:
      "AI is a race engineer. Talk garage basics using F1 movie vocabulary in natural speech.",
    aiRole: "車隊工程師",
    sourceHref: "/speak#series-f1",
    sourceLabel: "跟讀 · F1 第1–5課",
    targets: f1Segments(0, 3),
    pattern: {
      pattern: "Can we check the [part] before the next stint?",
      example: f1Segments(0, 1)[0] || "",
    },
  },
  {
    id: 52,
    topicEn: "F1 race craft",
    topicZh: "賽道技術對話",
    scenario:
      "Radio-style chat about race craft: lines, confidence, dirty air.",
    aiRole: "車手／工程師對講",
    sourceHref: "/speak/f1-06-inferno",
    sourceLabel: "跟讀 · F1 中段",
    targets: f1Segments(5, 3).length ? f1Segments(5, 3) : f1Segments(2, 3),
    pattern: {
      pattern: "If I [action], can we still [result]?",
      example: "If I push now, can we still save the tires for the last ten?",
    },
  },
  {
    id: 53,
    topicEn: "F1 strategy & tires",
    topicZh: "戰術與輪胎",
    scenario:
      "Strategy wall discussion: compounds, deg, one-stop vs two-stop.",
    aiRole: "策略師",
    sourceHref: "/speak#series-f1",
    sourceLabel: "跟讀 · F1 戰術相關",
    targets: f1Segments(9, 3).length ? f1Segments(9, 3) : f1Segments(8, 3),
    pattern: {
      pattern: "Realistically, if tire deg spikes, we should…",
      example: "Realistically, if tire deg spikes, we should box early.",
    },
  },
  {
    id: 54,
    topicEn: "F1 pressure & media",
    topicZh: "壓力與媒體",
    scenario:
      "Press-style questions after a tough session. Stay composed.",
    aiRole: "記者會提問",
    sourceHref: "/speak#series-f1",
    sourceLabel: "跟讀 · F1 後段",
    targets: f1Segments(20, 3).length ? f1Segments(20, 3) : f1Segments(15, 3),
    pattern: {
      pattern: "Honestly… That being said…",
      example: "Honestly it was messy — that being said, the car still has pace.",
    },
  },
  {
    id: 55,
    topicEn: "Tech systems speaking",
    topicZh: "系統／技術口述",
    scenario:
      "Support call. Explain a system issue and next steps clearly.",
    aiRole: "技術支援對談",
    sourceHref: "/english/tech-systems-operations-10",
    sourceLabel: "句型 · 技術系統",
    targets: enPatterns("tech-systems-operations-10", 3),
    pattern: {
      pattern: "The system is… The workaround is…",
      example: enPatterns("tech-systems-operations-10", 1)[0] || "",
    },
  },
  {
    id: 56,
    topicEn: "Daily life & socializing",
    topicZh: "生活社交場景",
    scenario:
      "Social plans and daily-life chat using site pattern language.",
    aiRole: "約出門的朋友",
    sourceHref: "/english/daily-life-socializing-9",
    sourceLabel: "句型 · 生活社交",
    targets: enPatterns("daily-life-socializing-9", 3),
    pattern: {
      pattern: "Want to…? I’m down if…",
      example: enPatterns("daily-life-socializing-9", 1)[0] || "",
    },
  },
  {
    id: 57,
    topicEn: "Formal tone stretch",
    topicZh: "正式語氣拉伸",
    scenario:
      "External presentation Q&A. Keep tone polished but spoken.",
    aiRole: "對外簡報聽眾",
    sourceHref: "/english/style/connectors",
    sourceLabel: "風格 · 正式連接",
    targets: [
      "That being said…",
      "In the interest of time…",
      "I want to make sure I’m hitting the mark…",
    ],
    pattern: {
      pattern: "In the interest of time… That being said…",
      example:
        "In the interest of time, I’ll keep this brief — that being said, I’m happy to go deeper.",
    },
  },
  {
    id: 58,
    topicEn: "Native transitions",
    topicZh: "道地轉折",
    scenario:
      "Long chat. Practice native transitions to keep control of flow.",
    aiRole: "長聊控場對象",
    sourceHref: "/english/native-transitions-idiomatic-express-7",
    sourceLabel: "句型 · 道地轉折",
    targets: enPatterns("native-transitions-idiomatic-express-7", 3),
    pattern: {
      pattern: "Long story short… / In any case…",
      example: enPatterns("native-transitions-idiomatic-express-7", 1)[0] || "",
    },
  },
  {
    id: 59,
    topicEn: "Capstone A · project crisis",
    topicZh: "綜合情境 A：專案危機",
    scenario:
      "Crisis meeting. Mix workplace + pressure language from earlier seasons.",
    aiRole: "危機會議成員",
    sourceHref: "/english/challenges-assessment-solutions-6",
    sourceLabel: "綜合 · 專案危機",
    targets: [
      "The bottom line is…",
      "Let me process that…",
      "One way forward is…",
    ],
    pattern: {
      pattern: "Bottom line → Process → Path forward",
      example:
        "The bottom line is we’re slipping — let me process the options — one way forward is a scope cut.",
    },
  },
  {
    id: 60,
    topicEn: "Capstone B · season finale narrative",
    topicZh: "綜合情境 B：賽季收官敘事",
    scenario:
      "Documentary-style interview about a hard season. Blend F1 color, story craft, and composure.",
    aiRole: "紀錄片訪談者",
    sourceHref: "/speak#series-f1",
    sourceLabel: "綜合 · F1＋敘事",
    targets: [
      ...(f1Segments(29, 2).length ? f1Segments(29, 2) : f1Segments(28, 2)),
      "Looking back, the point is…",
    ].slice(0, 3),
    pattern: {
      pattern: "Looking back… the point is…",
      example:
        "Looking back, it was a gamble — the point is we showed up when it counted.",
    },
  },
];

function seasonOf(id) {
  return seasons.find((s) => id >= s.lessons[0] && id <= s.lessons[1]);
}

function ensureThree(arr, fallbacks) {
  const out = [...arr].filter(Boolean);
  for (const f of fallbacks) {
    if (out.length >= 3) break;
    if (f && !out.includes(f)) out.push(f);
  }
  while (out.length < 3) out.push(`Target phrase ${out.length + 1}`);
  return out.slice(0, 3);
}

const lessons = defs.map((d) => {
  const season = seasonOf(d.id);
  const targets = ensureThree(d.targets, [
    d.pattern?.example,
    d.topicEn,
    "Let’s keep it natural.",
  ]);
  return {
    id: d.id,
    slug: `lesson-${pad(d.id)}`,
    season: season.id,
    seasonTitleZh: season.titleZh,
    seasonTitleEn: season.titleEn,
    topicEn: d.topicEn,
    topicZh: d.topicZh,
    scenario: d.scenario,
    aiRole: d.aiRole,
    sourceHref: d.sourceHref,
    sourceLabel: d.sourceLabel,
    targets,
    pattern: {
      pattern: d.pattern.pattern || "",
      example: d.pattern.example || targets[0],
    },
    minutes: "15–20",
  };
});

const out = {
  source: "AI-conversation-60-plan.md",
  total: lessons.length,
  seasons,
  systemPromptPath: "embedded",
  lessons,
};

const outPath = path.join(dataDir, "coach-lessons.json");
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log("wrote", lessons.length, "lessons →", outPath);
console.log(
  "sample L01 targets",
  lessons[0].targets,
  "L51",
  lessons[50].targets.slice(0, 1),
);
