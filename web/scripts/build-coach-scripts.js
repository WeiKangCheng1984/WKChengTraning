/**
 * Build coach-lessons.json from AI-coach-60-scripts.md theme plan + live DB sampling.
 */
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../src/data");
const cfa = JSON.parse(fs.readFileSync(path.join(dataDir, "cfa.json"), "utf8"));
const re = JSON.parse(fs.readFileSync(path.join(dataDir, "real-estate.json"), "utf8"));
const vocab = JSON.parse(fs.readFileSync(path.join(dataDir, "vocabulary.json"), "utf8"));
const speak = JSON.parse(fs.readFileSync(path.join(dataDir, "speak.json"), "utf8"));
const style = JSON.parse(fs.readFileSync(path.join(dataDir, "style-phrases.json"), "utf8"));
const conv = JSON.parse(fs.readFileSync(path.join(dataDir, "conversation-four.json"), "utf8"));
const english = JSON.parse(fs.readFileSync(path.join(dataDir, "english.json"), "utf8"));

function pad(n) {
  return String(n).padStart(2, "0");
}

function speakBySlug(slug) {
  return speak.articles.find((a) => a.slug === slug);
}

function speakCommon(i) {
  return speak.articles.filter((a) => a.series === "common")[i];
}

function f1Article(i) {
  return speak.articles.filter((a) => a.series === "f1")[i];
}

function vocabTable(slug) {
  return vocab.tables.find((t) => t.slug === slug);
}

function vocabWords(slug, n = 4) {
  const t = vocabTable(slug);
  if (!t) return [];
  return (t.words || []).slice(0, n).map((w) => w.en);
}

function vocabSents(slug, n = 2) {
  const t = vocabTable(slug);
  if (!t) return [];
  const out = [];
  for (const w of t.words || []) {
    const ex = w.examples?.[0]?.en || w.exampleEn;
    if (ex) out.push(ex);
    if (out.length >= n) break;
  }
  return out;
}

function reTerms(sectionIdx, n = 4) {
  const sec = re.sections[sectionIdx];
  if (!sec) return [];
  return sec.terms.slice(0, n).map((t) => t.en.split("/")[0].trim());
}

function reSents(n = 2, offset = 0) {
  return (re.phrases || []).slice(offset, offset + n).map((p) => p.en);
}

function cfaTerms(code, n = 4) {
  const s = cfa.subjects.find((x) => x.code === code);
  if (!s) return [];
  return s.terms
    .slice(0, n)
    .map((t) => t.termEn || t.en || t.term)
    .filter(Boolean);
}

function styleTitles(stageId, sectionIdx, n = 3) {
  const st = style.stages.find((s) => s.id === stageId);
  return (st?.sections[sectionIdx]?.groups || []).slice(0, n).map((g) => g.titleZh);
}

function styleSents(stageId, sectionIdx, n = 2) {
  const st = style.stages.find((s) => s.id === stageId);
  const groups = st?.sections[sectionIdx]?.groups || [];
  const out = [];
  for (const g of groups) {
    if (g.items?.[0]?.en) out.push(g.items[0].en);
    if (out.length >= n) break;
  }
  return out;
}

function convEn(typeSlug, blockIdx, n = 3) {
  const t = conv.types.find((x) => x.slug === typeSlug);
  return (t?.blocks[blockIdx]?.formulas || []).slice(0, n).map((f) => f.en);
}

function enPat(slug, n = 4) {
  const c = english.categories.find((x) => x.slug === slug);
  return (c?.items || []).slice(0, n).map((i) => i.en);
}

function segs(article, n = 4) {
  if (!article) return [];
  return article.segments.slice(0, n).map((s) => s.en);
}

function segsZh(article, n = 2) {
  if (!article) return [];
  return article.segments.slice(0, n).map((s) => s.en);
}

function defaultFive(topic) {
  return [
    `How would a native speaker briefly explain "${topic}"?`,
    "What’s a common mistake learners make with today’s words?",
    "Can you give a shorter, more spoken version of the key sentence?",
    "How would you use one target word in a work or daily situation?",
    "What’s one extra collocation or phrase I should learn today?",
  ];
}

function lesson( partial ) {
  const id = partial.id;
  const season =
    id <= 10 ? 1 : id <= 20 ? 2 : id <= 28 ? 3 : id <= 38 ? 4 : id <= 48 ? 5 : 6;
  const seasonMeta = {
    1: ["生活與美食", "Life & Food"],
    2: ["職場與商務", "Workplace"],
    3: ["不動產", "Real Estate"],
    4: ["CFA 財金對話", "CFA Talk"],
    5: ["表達力與會話力", "Speaking Skills"],
    6: ["F1 與總整", "F1 & Capstone"],
  }[season];
  return {
    id,
    slug: `lesson-${pad(id)}`,
    season,
    seasonTitleZh: seasonMeta[0],
    seasonTitleEn: seasonMeta[1],
    domain: partial.domain,
    topicEn: partial.topicEn,
    topicZh: partial.topicZh,
    scenario: partial.scenario,
    aiRole: partial.aiRole,
    sourceHref: partial.sourceHref,
    sourceLabel: partial.sourceLabel,
    targets: partial.targets.slice(0, 5),
    targetSentences: (partial.targetSentences || []).slice(0, 3),
    myFiveQuestions: (partial.myFiveQuestions || defaultFive(partial.topicEn)).slice(0, 5),
    minutes: "15–20",
  };
}

const a01 = speakCommon(0);
const a02 = speakCommon(1);
const a03 = speakCommon(2);
const a04 = speakCommon(3);
const a05 = speakCommon(4);
const a06 = speakCommon(5);

const defs = [
  lesson({
    id: 1,
    domain: "life",
    topicEn: "A new day & morning rhythm",
    topicZh: "新的一天／早晨節奏",
    scenario:
      "Casual café chat about mornings. Practice daily rhythm phrases, then run the full A–G session arc.",
    aiRole: "一起喝咖啡的美式朋友",
    sourceHref: a01 ? `/speak/${a01.slug}` : "/speak",
    sourceLabel: a01 ? `跟讀 · ${a01.titleZh}` : "跟讀",
    targets: ["hit snooze", "pouring rain", "iced latte", "wrap up", "food coma"],
    targetSentences: segsZh(a01, 2),
    myFiveQuestions: [
      "How do you usually start a tough morning?",
      "What’s your go-to coffee order on a busy day?",
      "Do you prefer clearing emails first or deep work first?",
      "What ruins your morning rhythm the most?",
      "Give me one tip for not rushing out the door.",
    ],
  }),
  lesson({
    id: 2,
    domain: "life",
    topicEn: "Goal setting & motivation",
    topicZh: "目標設定與動力",
    scenario: "Talk goals with an accountability buddy. Use spoken goal language.",
    aiRole: "健身／學習搭子",
    sourceHref: a02 ? `/speak/${a02.slug}` : "/speak",
    sourceLabel: a02 ? `跟讀 · ${a02.titleZh}` : "跟讀",
    targets: ["set a goal", "stay consistent", "milestone", "accountability", "burnout"],
    targetSentences: segs(a02, 2),
    myFiveQuestions: defaultFive("goal setting"),
  }),
  lesson({
    id: 3,
    domain: "food",
    topicEn: "Cooking steps in the kitchen",
    topicZh: "料理步驟與廚房指令",
    scenario: "Cook together at home. Give and follow short kitchen instructions.",
    aiRole: "一起做菜的室友",
    sourceHref: a03 ? `/speak/${a03.slug}` : "/speak",
    sourceLabel: a03 ? `跟讀 · ${a03.titleZh}` : "跟讀",
    targets: ["chop", "simmer", "season", "plate", "leftovers"],
    targetSentences: segs(a03, 2),
    myFiveQuestions: [
      "How do you season without oversalting?",
      "What’s a foolproof weeknight dish?",
      "Oil or butter for a quick sauté — why?",
      "How should I store leftovers safely?",
      "One plating tip that looks restaurant-level?",
    ],
  }),
  lesson({
    id: 4,
    domain: "life",
    topicEn: "Travel & exploring abroad",
    topicZh: "海外旅遊與探索",
    scenario: "Plan a flexible trip day with a travel buddy.",
    aiRole: "旅行同伴",
    sourceHref: a04 ? `/speak/${a04.slug}` : "/speak",
    sourceLabel: a04 ? `跟讀 · ${a04.titleZh}` : "跟讀",
    targets: ["itinerary", "jet lag", "local spot", "day trip", "travel light"],
    targetSentences: segs(a04, 2),
    myFiveQuestions: defaultFive("travel"),
  }),
  lesson({
    id: 5,
    domain: "food",
    topicEn: "Food sensory language",
    topicZh: "餐飲感官：味道與口感",
    scenario: "Review a meal like food friends — aroma, texture, aftertaste.",
    aiRole: "愛聊美食的朋友",
    sourceHref: "/english/vocab/food-sensory",
    sourceLabel: "詞彙 · 餐飲感官",
    targets: vocabWords("food-sensory", 5),
    targetSentences: vocabSents("food-sensory", 2),
    myFiveQuestions: [
      "How do I describe bitterness politely?",
      "What words fit different spicy levels?",
      "How do natives talk about umami?",
      "What does a ‘well-balanced’ dish mean to you?",
      "Help me describe my favorite dessert.",
    ],
  }),
  lesson({
    id: 6,
    domain: "food",
    topicEn: "Ordering food & soft feedback",
    topicZh: "點餐、外帶與評價",
    scenario: "Restaurant ordering and polite comments about the meal.",
    aiRole: "飯友（可切換成服務員口吻）",
    sourceHref: "/english/vocab/food-sensory",
    sourceLabel: "詞彙 · 餐飲",
    targets: ["takeout", "side dish", "allergy", "portion", "recommend"],
    targetSentences: [
      "Can I get that to go, please?",
      "Do you have a milder option for the spice?",
    ],
    myFiveQuestions: [
      "How do I mention allergies clearly?",
      "How do I ask for a recommendation without sounding unsure?",
      "Phrases for splitting the check?",
      "How to complain politely?",
      "What should I know about tipping basics?",
    ],
  }),
  lesson({
    id: 7,
    domain: "life",
    topicEn: "Making social plans",
    topicZh: "日常社交約出門",
    scenario: "Text-like spoken chat to set up a low-key hangout.",
    aiRole: "想約週末的朋友",
    sourceHref: "/english/daily-life-socializing-9",
    sourceLabel: "句型 · 生活社交",
    targets: enPat("daily-life-socializing-9", 4),
    targetSentences: [
      "I’m down if we keep it low-key.",
      "Can I take a rain check this time?",
    ],
    myFiveQuestions: defaultFive("making plans"),
  }),
  lesson({
    id: 8,
    domain: "life",
    topicEn: "Emotions & adaptability",
    topicZh: "情緒與適應力",
    scenario: "A supportive friend checks in while you talk about stress and adapting.",
    aiRole: "關心你的朋友",
    sourceHref: "/english/emotions-adaptability-11",
    sourceLabel: "句型 · 情緒適應",
    targets: enPat("emotions-adaptability-11", 4),
    targetSentences: [
      "I’ve been feeling a bit overwhelmed lately.",
      "I need a moment to adapt to the change.",
    ],
    myFiveQuestions: defaultFive("emotions at work and life"),
  }),
  lesson({
    id: 9,
    domain: "life",
    topicEn: "Home renovation chat",
    topicZh: "老屋翻新與居家改造",
    scenario: "Chat about reno priorities and smart-home ideas.",
    aiRole: "看屋／裝潢顧問朋友",
    sourceHref: a06 ? `/speak/${a06.slug}` : "/speak",
    sourceLabel: a06 ? `跟讀 · ${a06.titleZh}` : "跟讀",
    targets: ["renovation", "bones", "deferred maintenance", "smart home", "contractor"],
    targetSentences: segs(a06, 2).length
      ? segs(a06, 2)
      : [
          "The bones are good; most of this is deferred maintenance.",
          "We’re thinking about a smart-home upgrade.",
        ],
    myFiveQuestions: defaultFive("renovation"),
  }),
  lesson({
    id: 10,
    domain: "life",
    topicEn: "Life season wrap — weekend plans",
    topicZh: "生活季複盤：週末計畫",
    scenario: "Mix Season 1 language while planning a realistic weekend.",
    aiRole: "教練型朋友",
    sourceHref: "/speak",
    sourceLabel: "跟讀 · 生活複盤",
    targets: ["low-key", "intentional", "rain check", "milestone", "balance"],
    targetSentences: [
      "Let’s keep this weekend low-key but intentional.",
      "I might take a rain check on the late night plans.",
    ],
    myFiveQuestions: defaultFive("weekend planning"),
  }),
  // Workplace 11-20
  lesson({
    id: 11,
    domain: "work",
    topicEn: "Office bandwidth & priorities",
    topicZh: "辦公室運作與優先順序",
    scenario: "Quick desk-side sync about priorities and blockers.",
    aiRole: "同組同事",
    sourceHref: "/english/vocab/office-ops",
    sourceLabel: "詞彙 · 辦公室運作",
    targets: vocabWords("office-ops", 5),
    targetSentences: vocabSents("office-ops", 2),
    myFiveQuestions: defaultFive("priorities at work"),
  }),
  lesson({
    id: 12,
    domain: "work",
    topicEn: "Project update in a 1:1",
    topicZh: "專案進度一對一回報",
    scenario: "Give a crisp status to your lead: done / doing / risk / next.",
    aiRole: "一對一主管",
    sourceHref: "/english/work-project-management-8",
    sourceLabel: "句型 · 專案管理",
    targets: enPat("work-project-management-8", 4),
    targetSentences: [
      "Here’s the status in one line.",
      "The main risk is timing on QA.",
    ],
    myFiveQuestions: defaultFive("project updates"),
  }),
  lesson({
    id: 13,
    domain: "work",
    topicEn: "Polite requests & networking",
    topicZh: "禮貌請求與人脈場合",
    scenario: "Ask for help and make soft networking asks.",
    aiRole: "需要互相幫忙的同事／活動對象",
    sourceHref: "/english/polite-requests-networking-3",
    sourceLabel: "句型 · 禮貌請求",
    targets: enPat("polite-requests-networking-3", 4),
    targetSentences: enPat("polite-requests-networking-3", 2),
    myFiveQuestions: defaultFive("polite requests"),
  }),
  lesson({
    id: 14,
    domain: "work",
    topicEn: "Deadlines, tradeoffs, efficiency",
    topicZh: "期限、效率與取捨",
    scenario: "Standup tradeoff talk: ship date vs scope vs quality.",
    aiRole: "Scrum 隊友",
    sourceHref: "/english/time-efficiency-deadline-4",
    sourceLabel: "句型 · 期限效率",
    targets: enPat("time-efficiency-deadline-4", 4),
    targetSentences: enPat("time-efficiency-deadline-4", 2),
    myFiveQuestions: defaultFive("deadlines"),
  }),
  lesson({
    id: 15,
    domain: "work",
    topicEn: "Negotiation stance",
    topicZh: "商務談判與立場",
    scenario: "Practice calm negotiation language and walk-away clarity.",
    aiRole: "談判對手（理性）",
    sourceHref: "/english/vocab/negotiation",
    sourceLabel: "詞彙 · 談判",
    targets: vocabWords("negotiation", 5),
    targetSentences: vocabSents("negotiation", 2),
    myFiveQuestions: defaultFive("negotiation"),
  }),
  lesson({
    id: 16,
    domain: "work",
    topicEn: "Service & CRM conversations",
    topicZh: "服務接待與客戶關係",
    scenario: "Handle a customer concern and recover trust.",
    aiRole: "不滿意但願意溝通的客戶",
    sourceHref: "/english/vocab/service-crm",
    sourceLabel: "詞彙 · 客服 CRM",
    targets: vocabWords("service-crm", 5),
    targetSentences: vocabSents("service-crm", 2),
    myFiveQuestions: defaultFive("customer service"),
  }),
  lesson({
    id: 17,
    domain: "work",
    topicEn: "Expressing views softly",
    topicZh: "溫和表達觀點",
    scenario: "Disagree in a product discussion without escalating.",
    aiRole: "意見不同的隊友",
    sourceHref: "/english/conversation/express-views",
    sourceLabel: "會話 · 表達觀點",
    targets: convEn("express-views", 0, 3),
    targetSentences: convEn("express-views", 0, 2),
    myFiveQuestions: defaultFive("expressing opinions"),
  }),
  lesson({
    id: 18,
    domain: "work",
    topicEn: "Challenges & solutions",
    topicZh: "挑戰評估與解法",
    scenario: "Frame a problem and propose a practical path forward.",
    aiRole: "檢討會議夥伴",
    sourceHref: "/english/challenges-assessment-solutions-6",
    sourceLabel: "句型 · 挑戰解法",
    targets: enPat("challenges-assessment-solutions-6", 4),
    targetSentences: enPat("challenges-assessment-solutions-6", 2),
    myFiveQuestions: defaultFive("problem solving"),
  }),
  lesson({
    id: 19,
    domain: "work",
    topicEn: "Cross-team product launch talk",
    topicZh: "跨部門產品發佈溝通",
    scenario: "Align messaging and dry-run before a launch.",
    aiRole: "跨部門利害關係人",
    sourceHref: a05 ? `/speak/${a05.slug}` : "/speak",
    sourceLabel: a05 ? `跟讀 · ${a05.titleZh}` : "跟讀",
    targets: ["launch", "stakeholder", "messaging", "dry run", "handoff"],
    targetSentences: segs(a05, 2),
    myFiveQuestions: defaultFive("product launch"),
  }),
  lesson({
    id: 20,
    domain: "work",
    topicEn: "Workplace wrap — hard alignment meeting",
    topicZh: "職場季複盤：難搞對齊會",
    scenario: "High-friction alignment. Mix Season 2 language under light pressure.",
    aiRole: "立場強硬的對齊對象",
    sourceHref: "/english/style/connectors",
    sourceLabel: "風格 · 連接器",
    targets: ["bandwidth", "bottom line", "that being said", "tradeoff", "align"],
    targetSentences: [
      "The bottom line is we need alignment today.",
      "That being said, I can flex on the timeline.",
    ],
    myFiveQuestions: defaultFive("alignment meetings"),
  }),
];

// RE 21-28
for (let i = 0; i < 7; i += 1) {
  const sec = re.sections[i];
  defs.push(
    lesson({
      id: 21 + i,
      domain: "re",
      topicEn: sec?.titleEn || sec?.titleZh || `Real estate ${i + 1}`,
      topicZh: sec?.titleZh || `不動產 ${i + 1}`,
      scenario: `Real-estate conversation focused on「${sec?.titleZh}」. Use accurate terms, then full A–G arc.`,
      aiRole: i < 3 ? "看房的買家朋友" : i < 5 ? "仲介／貸款顧問口吻" : "投資／裝修顧問",
      sourceHref: "/real-estate",
      sourceLabel: `不動產 · ${sec?.titleZh || ""}`,
      targets: reTerms(i, 4),
      targetSentences: reSents(2, i * 2),
      myFiveQuestions: [
        `What does ${reTerms(i, 1)[0] || "this term"} mean in a showing?`,
        "How would you say that more naturally to a client?",
        "What’s a common learner mistake with today’s terms?",
        "Give me a short dialogue line I can reuse.",
        "How does this step connect to the next stage of a deal?",
      ],
    }),
  );
}
defs.push(
  lesson({
    id: 28,
    domain: "re",
    topicEn: "High-frequency real-estate phrases",
    topicZh: "不動產高頻句實戰",
    scenario: "Practice listing/offer phrases in a realistic deal chat.",
    aiRole: "成交過程中的仲介",
    sourceHref: "/real-estate",
    sourceLabel: "不動產 · 高頻句",
    targets: reSents(4, 0).map((s) => s.slice(0, 48)),
    targetSentences: reSents(3, 0),
    myFiveQuestions: defaultFive("real estate deals"),
  }),
);

// CFA 29-38
cfa.subjects.forEach((subj, idx) => {
  defs.push(
    lesson({
      id: 29 + idx,
      domain: "cfa",
      topicEn: subj.nameEn || `CFA ${subj.code}`,
      topicZh: `${subj.nameZh}（口語解釋）`,
      scenario: `Explain「${subj.nameZh}」ideas in plain spoken English to a smart non-expert friend.`,
      aiRole: "想聽懂財金概念的朋友",
      sourceHref: `/vault/${subj.code}`,
      sourceLabel: `CFA · ${subj.nameZh}`,
      targets: cfaTerms(subj.code, 4),
      targetSentences: [
        `In plain English, ${cfaTerms(subj.code, 1)[0] || "this idea"} means…`,
        "A simple example would be…",
      ],
      myFiveQuestions: [
        `Can you explain ${cfaTerms(subj.code, 1)[0] || "the key term"} in one plain sentence?`,
        "Give a real-world example a beginner would get.",
        "What do people often confuse this with?",
        "How might this come up at work or in investing talk?",
        "What’s a good follow-up question I should ask next?",
      ],
    }),
  );
});

// Soft skills 39-48
const soft = [
  {
    id: 39,
    topicEn: "Openers: Actually / Basically",
    topicZh: "發語詞：Actually／Basically",
    href: "/english/style/openers",
    label: "風格 · 發語詞",
    targets: styleTitles(1, 0, 3),
    sents: styleSents(1, 0, 2),
    role: "產品會議同事",
  },
  {
    id: 40,
    topicEn: "Connectors: bottom line / that being said",
    topicZh: "連接器：重點與轉折",
    href: "/english/style/connectors",
    label: "風格 · 連接器",
    targets: styleTitles(2, 0, 2).concat(styleTitles(2, 1, 1)),
    sents: styleSents(2, 0, 2),
    role: "忙碌主管",
  },
  {
    id: 41,
    topicEn: "Ask & extend",
    topicZh: "提問與對話延展",
    href: "/english/conversation/ask-extend",
    label: "會話 · 提問延展",
    targets: convEn("ask-extend", 0, 3),
    sents: convEn("ask-extend", 0, 2),
    role: "社交場合新人",
  },
  {
    id: 42,
    topicEn: "Storytelling beats",
    topicZh: "講故事四拍",
    href: "/english/conversation/storytelling",
    label: "會話 · 講故事",
    targets: convEn("storytelling", 0, 3),
    sents: convEn("storytelling", 0, 2),
    role: "愛聽故事的朋友",
  },
  {
    id: 43,
    topicEn: "Listen & empathy",
    topicZh: "傾聽與共情",
    href: "/english/conversation/listen-empathy",
    label: "會話 · 傾聽共情",
    targets: convEn("listen-empathy", 0, 3),
    sents: convEn("listen-empathy", 0, 2),
    role: "心情不好的朋友",
  },
  {
    id: 44,
    topicEn: "Signature: big-picture lines",
    topicZh: "Signature：拉高視角",
    href: "/english/style/signature",
    label: "風格 · Signature",
    targets: styleTitles(3, 0, 3),
    sents: styleSents(3, 0, 2),
    role: "策略工作坊夥伴",
  },
  {
    id: 45,
    topicEn: "Pressure: buy thinking time",
    topicZh: "壓力緩衝：爭取思考時間",
    href: "/english/style/pressure-relief",
    label: "風格 · 壓力緩衝",
    targets: styleTitles(4, 0, 3),
    sents: styleSents(4, 0, 2),
    role: "突襲提問的客戶",
  },
  {
    id: 46,
    topicEn: "Respectful disagreement & redirect",
    topicZh: "有禮異議與轉向",
    href: "/english/style/pressure-relief",
    label: "風格 · 異議／轉向",
    targets: styleTitles(4, 2, 2).concat(styleTitles(4, 3, 1)),
    sents: styleSents(4, 3, 2),
    role: "意見衝突的同事",
  },
  {
    id: 47,
    topicEn: "Hypothesis & possibility",
    topicZh: "假設與可能性",
    href: "/english/hypothesis-conditions-possibility-5",
    label: "句型 · 假設條件",
    targets: enPat("hypothesis-conditions-possibility-5", 4),
    sents: enPat("hypothesis-conditions-possibility-5", 2),
    role: "腦力激盪夥伴",
  },
  {
    id: 48,
    topicEn: "Native transitions & formal tone",
    topicZh: "道地轉折與正式語氣",
    href: "/english/native-transitions-idiomatic-express-7",
    label: "句型 · 道地轉折",
    targets: enPat("native-transitions-idiomatic-express-7", 4),
    sents: enPat("native-transitions-idiomatic-express-7", 2),
    role: "對外簡報聽眾",
  },
];
for (const s of soft) {
  defs.push(
    lesson({
      id: s.id,
      domain: "soft",
      topicEn: s.topicEn,
      topicZh: s.topicZh,
      scenario: `Skill-focused conversation on「${s.topicZh}」with live polish and the full A–G arc.`,
      aiRole: s.role,
      sourceHref: s.href,
      sourceLabel: s.label,
      targets: s.targets,
      targetSentences: s.sents,
      myFiveQuestions: defaultFive(s.topicEn),
    }),
  );
}

// F1 49-55
const f1Meta = [
  { i: 0, topicZh: "維修區與輪班／變速箱", topicEn: "Garage talk: stints & gearbox" },
  { i: 2, topicZh: "空力、側箱與操控感", topicEn: "Aero, side pods & feel" },
  { i: 9, topicZh: "輪胎策略與衰退", topicEn: "Tire strategy & degradation" },
  { i: 12, topicZh: "賽道搏殺與節奏", topicEn: "Wheel-to-wheel race craft" },
  { i: 15, topicZh: "紅旗、殘骸與安全", topicEn: "Red flags, debris & safety" },
  { i: 20, topicZh: "媒體與壓力回應", topicEn: "Media & pressure answers" },
  { i: 28, topicZh: "收官之戰敘事", topicEn: "Season finale narrative" },
];
f1Meta.forEach((m, idx) => {
  const art = f1Article(m.i) || f1Article(0);
  defs.push(
    lesson({
      id: 49 + idx,
      domain: "f1",
      topicEn: m.topicEn,
      topicZh: m.topicZh,
      scenario: `F1 paddock-style English. Use movie-based terms from「${m.topicZh}」.`,
      aiRole: idx === 5 ? "記者會提問者" : "車隊工程師／策略師",
      sourceHref: art ? `/speak/${art.slug}` : "/speak#series-f1",
      sourceLabel: art ? `F1 · ${art.titleZh}` : "F1 跟讀",
      targets: segs(art, 4).map((s) => {
        const w = s.split(/\s+/).slice(0, 6).join(" ");
        return w.length > 42 ? `${w.slice(0, 40)}…` : w;
      }),
      targetSentences: segs(art, 2),
      myFiveQuestions: [
        "What does the key term mean on track?",
        "How would you say it briefly on team radio?",
        "Give a workplace analogy for this idea.",
        "What’s a more natural short version?",
        "One extra phrase fans or engineers actually use?",
      ],
    }),
  );
});

// Capstones 56-60
const caps = [
  {
    id: 56,
    topicEn: "Capstone: life × food weekend",
    topicZh: "總整：生活×美食",
    domain: "mix",
    href: "/speak",
    label: "總整 · 生活美食",
    role: "週末計畫＋吃飯的朋友",
    targets: ["low-key", "recommend", "texture", "rain check", "well-balanced"],
  },
  {
    id: 57,
    topicEn: "Capstone: workplace crisis meeting",
    topicZh: "總整：職場危機會",
    domain: "mix",
    href: "/english/challenges-assessment-solutions-6",
    label: "總整 · 職場",
    role: "危機會議對手／主持",
    targets: ["bottom line", "bandwidth", "risk", "workaround", "align"],
  },
  {
    id: 58,
    topicEn: "Capstone: home-buying week",
    topicZh: "總整：看房成交週",
    domain: "mix",
    href: "/real-estate",
    label: "總整 · 不動產",
    role: "仲介＋買家雙角色切換",
    targets: ["under contract", "inspection", "repair credit", "closing", "comps"],
  },
  {
    id: 59,
    topicEn: "Capstone: CFA oral explainer",
    topicZh: "總整：CFA 口試感對談",
    domain: "mix",
    href: "/vault",
    label: "總整 · CFA",
    role: "口試官式提問朋友",
    targets: cfaTerms("06", 2).concat(cfaTerms("02", 2)),
  },
  {
    id: 60,
    topicEn: "Capstone: F1 + story + pressure",
    topicZh: "總整：F1＋敘事＋壓力",
    domain: "mix",
    href: "/speak#series-f1",
    label: "總整 · F1",
    role: "紀錄片訪談者",
    targets: ["season finale", "keep composure", "that being said", "honestly", "take a gamble"],
  },
];
for (const c of caps) {
  defs.push(
    lesson({
      id: c.id,
      domain: c.domain,
      topicEn: c.topicEn,
      topicZh: c.topicZh,
      scenario: `Capstone session mixing prior seasons. Run the full A–G arc carefully.`,
      aiRole: c.role,
      sourceHref: c.href,
      sourceLabel: c.label,
      targets: c.targets,
      targetSentences: [
        `Let’s open with today’s theme: ${c.topicEn}.`,
        "I’ll try to use the target words naturally as we go.",
      ],
      myFiveQuestions: defaultFive(c.topicEn),
    }),
  );
}

defs.sort((a, b) => a.id - b.id);

const seasons = [
  { id: 1, titleZh: "生活與美食", titleEn: "Life & Food", lessons: [1, 10] },
  { id: 2, titleZh: "職場與商務", titleEn: "Workplace", lessons: [11, 20] },
  { id: 3, titleZh: "不動產", titleEn: "Real Estate", lessons: [21, 28] },
  { id: 4, titleZh: "CFA 財金對話", titleEn: "CFA Talk", lessons: [29, 38] },
  { id: 5, titleZh: "表達力與會話力", titleEn: "Speaking Skills", lessons: [39, 48] },
  { id: 6, titleZh: "F1 與總整", titleEn: "F1 & Capstone", lessons: [49, 60] },
];

const out = {
  source: "AI-coach-60-scripts.md",
  version: "scripts-v2",
  total: defs.length,
  seasons,
  lessons: defs,
};

fs.writeFileSync(
  path.join(dataDir, "coach-lessons.json"),
  `${JSON.stringify(out, null, 2)}\n`,
);
console.log("lessons", defs.length);
console.log("L01", defs[0].topicZh, defs[0].targets.slice(0, 3));
console.log("L29", defs[28].topicZh, defs[28].sourceHref);
console.log("L60", defs[59].topicZh);
