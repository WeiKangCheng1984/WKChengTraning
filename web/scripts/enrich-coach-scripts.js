/**
 * Enrich coach lessons with bilingual practice banks:
 * ≥30 practice sentences + 6–8 long sentences, each with en + zh.
 * Writes coach-lessons.json + AI-coach-60-scripts.md
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const root = path.join(__dirname, "../..");
const dataDir = path.join(__dirname, "../src/data");
const coachPath = path.join(dataDir, "coach-lessons.json");
const cachePath = path.join(__dirname, "zh-cache.json");
const coach = JSON.parse(fs.readFileSync(coachPath, "utf8"));

const cfa = JSON.parse(fs.readFileSync(path.join(dataDir, "cfa.json"), "utf8"));
const re = JSON.parse(fs.readFileSync(path.join(dataDir, "real-estate.json"), "utf8"));
const vocab = JSON.parse(fs.readFileSync(path.join(dataDir, "vocabulary.json"), "utf8"));
const speak = JSON.parse(fs.readFileSync(path.join(dataDir, "speak.json"), "utf8"));
const style = JSON.parse(fs.readFileSync(path.join(dataDir, "style-phrases.json"), "utf8"));
const conv = JSON.parse(fs.readFileSync(path.join(dataDir, "conversation-four.json"), "utf8"));
const english = JSON.parse(fs.readFileSync(path.join(dataDir, "english.json"), "utf8"));

const LONG_MIN = 90;
const zhCache = fs.existsSync(cachePath)
  ? JSON.parse(fs.readFileSync(cachePath, "utf8"))
  : {};

const ROLE_EN = {
  "一起喝咖啡的美式朋友": "a casual American friend at a café",
  "健身／學習搭子": "a gym and study buddy",
  "一起做菜的室友": "a roommate cooking with you",
  "旅行同伴": "a travel buddy",
  "愛聊美食的朋友": "a food-loving friend",
  "飯友（可切換成服務員口吻）": "a dining buddy (or a server)",
  "想約週末的朋友": "a friend planning the weekend",
  "關心你的朋友": "a caring friend",
  "看屋／裝潢顧問朋友": "a home-tour and renovation advisor friend",
  "教練型朋友": "a coach-style friend",
  "同組同事": "a teammate on the same project",
  "一對一主管": "your one-on-one manager",
  "需要互相幫忙的同事／活動對象": "a colleague who needs a favor",
  "Scrum 隊友": "a Scrum teammate",
  "談判對手（理性）": "a rational negotiation counterpart",
  "不滿意但願意溝通的客戶": "an unhappy but open-minded client",
  "意見不同的隊友": "a teammate who disagrees with you",
  "檢討會議夥伴": "a retrospective meeting partner",
  "跨部門利害關係人": "a cross-team stakeholder",
  "立場強硬的對齊對象": "a tough alignment counterpart",
  "看房的買家朋友": "a friend shopping for a home",
  "仲介／貸款顧問口吻": "an agent or mortgage advisor",
  "投資／裝修顧問": "an investing and renovation advisor",
  "成交過程中的仲介": "an agent during the deal process",
  "想聽懂財金概念的朋友": "a friend who wants finance explained simply",
  "產品會議同事": "a product-meeting colleague",
  "忙碌主管": "a busy manager",
  "社交場合新人": "someone new at a social event",
  "愛聽故事的朋友": "a friend who loves stories",
  "心情不好的朋友": "a friend having a rough day",
  "策略工作坊夥伴": "a strategy workshop partner",
  "突襲提問的客戶": "a client who asks hard questions",
  "意見衝突的同事": "a colleague in a disagreement",
  "腦力激盪夥伴": "a brainstorming partner",
  "對外簡報聽眾": "an external presentation audience",
  "車隊工程師／策略師": "a team engineer or strategist",
  "記者會提問者": "a press-conference questioner",
  "週末計畫＋吃飯的朋友": "a friend planning weekend food plans",
  "危機會議對手／主持": "a crisis-meeting counterpart or host",
  "仲介＋買家雙角色切換": "an agent and a buyer (switching roles)",
  "口試官式提問朋友": "a friend who quizzes you like an examiner",
  "紀錄片訪談者": "a documentary-style interviewer",
};

function roleEn(lesson) {
  return ROLE_EN[lesson.aiRole] || "your conversation partner";
}

function roleZh(lesson) {
  return lesson.aiRole || "對話夥伴";
}

function pair(en, zh) {
  const e = String(en || "").replace(/\s+/g, " ").trim();
  const z = String(zh || "").replace(/\s+/g, " ").trim();
  if (!e || e.length < 8) return null;
  return { en: e, zh: z || "" };
}

function endsSentence(s) {
  return /[.!?…"']$/.test(s) ? s : `${s}.`;
}

function uniqPairs(arr) {
  const seen = new Set();
  const out = [];
  for (const p of arr) {
    if (!p || !p.en) continue;
    const key = p.en.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

function isLong(p) {
  return (p?.en || "").length >= LONG_MIN;
}

/** Build en→zh lexicon from bilingual site DBs */
function buildLexicon() {
  const map = new Map();
  const add = (en, zh) => {
    const e = String(en || "").replace(/\s+/g, " ").trim();
    const z = String(zh || "").replace(/\s+/g, " ").trim();
    if (!e || !z) return;
    map.set(e.toLowerCase(), z);
  };
  for (const a of speak.articles) {
    for (const s of a.segments || []) add(s.en, s.zh);
  }
  for (const p of re.phrases || []) add(p.en, p.zh);
  for (const c of english.categories || []) {
    for (const it of c.items || []) {
      add(it.en, it.zh);
      for (const ex of it.examples || []) add(ex.en, ex.zh);
    }
  }
  for (const t of vocab.tables || []) {
    for (const part of t.parts || []) {
      for (const w of part.words || []) {
        if (w.exampleEn && w.zh) {
          add(w.exampleEn, `（${w.en}／${w.zh.split("、")[0]}）${w.exampleEn}`);
        }
        for (const col of w.collocations || []) add(col.en, col.zh);
      }
    }
  }
  for (const t of conv.types || []) {
    for (const b of t.blocks || []) {
      for (const f of b.formulas || []) {
        if (f.en && f.scenarioZh) add(f.en, f.scenarioZh);
      }
    }
  }
  return map;
}

const lexicon = buildLexicon();

function lookupZh(en) {
  const e = String(en || "").replace(/\s+/g, " ").trim();
  if (!e) return "";
  if (zhCache[e]) return zhCache[e];
  const hit = lexicon.get(e.toLowerCase());
  if (hit) return hit;
  return "";
}

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "coach-enrich/1.0" } }, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", reject);
  });
}

async function translateMissing(texts) {
  const need = [...new Set(texts.map((t) => String(t || "").trim()).filter(Boolean))].filter(
    (t) => !lookupZh(t) && !zhCache[t],
  );
  console.log("translate missing", need.length);
  let i = 0;
  for (const text of need) {
    i += 1;
    const q = encodeURIComponent(text.slice(0, 450));
    const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=en|zh-TW`;
    try {
      const json = await httpGetJson(url);
      const zh = json?.responseData?.translatedText;
      if (zh && !/^MYMEMORY WARNING/i.test(zh)) {
        zhCache[text] = zh;
      } else {
        zhCache[text] = `（練習）${text}`;
      }
    } catch {
      zhCache[text] = `（練習）${text}`;
    }
    if (i % 20 === 0) {
      fs.writeFileSync(cachePath, `${JSON.stringify(zhCache, null, 2)}\n`);
      console.log("translated", i, "/", need.length);
    }
    await new Promise((r) => setTimeout(r, 120));
  }
  fs.writeFileSync(cachePath, `${JSON.stringify(zhCache, null, 2)}\n`);
}

function withZh(en, zhHint) {
  const e = endsSentence(String(en || "").replace(/\s+/g, " ").trim());
  const zh = (zhHint && String(zhHint).trim()) || lookupZh(en) || lookupZh(e) || "";
  return pair(e, zh);
}

function greetLines() {
  return [
    pair("Hey, good to see you — how’s your day going so far?", "嘿，見到你真好——你今天過得怎麼樣？"),
    pair("Hi there! Thanks for making time for this chat.", "嗨！謝謝你抽空來這段對話。"),
    pair("Morning! I grabbed a coffee and I’m ready when you are.", "早！我拿了杯咖啡，你準備好我們就開始。"),
    pair("Hey — before we dive in, how are you feeling energy-wise?", "嘿——開始前先問一下，你現在精力怎麼樣？"),
  ].filter(Boolean);
}

function closeLines(topic, topicZh) {
  return [
    pair(
      "That helped a lot — I’m going to reuse two of those lines this week.",
      "這很有幫助——這週我會把其中兩句再拿出來用。",
    ),
    pair(
      `Thanks for the polish; I feel clearer talking about ${topic}.`,
      `謝謝你的修潤；聊「${topicZh}」時我感覺清楚多了。`,
    ),
    pair(
      "Great session. I’ll practice the long sentences out loud once more tonight.",
      "很棒的一堂。今晚我會再把長句大聲練習一次。",
    ),
    pair(
      "Let’s wrap here — I’ll review the targets and come back for a replay later.",
      "先到這裡——我會複習目標詞，之後再來重練一輪。",
    ),
  ].filter(Boolean);
}

function viewLines(topic, topicZh) {
  return [
    pair(
      `From my side, ${topic} feels practical; from your side it sounds more strategic.`,
      `我這邊覺得「${topicZh}」很務實；你那邊聽起來更偏策略。`,
    ),
    pair(
      "We mostly agree on the goal, but we differ on how direct the wording should be.",
      "我們大致同意目標，但用詞要多直接，看法不太一樣。",
    ),
    pair(
      "Your version sounds more native; mine was clearer on facts but a bit stiff.",
      "你的版本更道地；我的比較講清楚事實，但有點生硬。",
    ),
    pair(
      "Comparing notes, I need shorter turns and one stronger closing line.",
      "對照之後，我需要更短的話輪，以及一句更有力的收尾。",
    ),
  ].filter(Boolean);
}

function poolFromSpeak(href) {
  const raw = (href || "").replace(/^\/speak\//, "").replace(/#.*$/, "");
  let articles = speak.articles;
  if (raw && raw !== "/speak" && !(href || "").includes("#")) {
    const a = speak.articles.find((x) => x.slug === raw);
    articles = a ? [a] : speak.articles;
  }
  return articles.flatMap((a) =>
    (a.segments || []).map((s) => pair(s.en, s.zh)).filter(Boolean),
  );
}

function poolFromCfa(href) {
  const m = (href || "").match(/\/vault\/(\d+)/);
  const subjects = m ? cfa.subjects.filter((s) => s.code === m[1]) : cfa.subjects;
  const out = [];
  for (const s of subjects) {
    for (const t of s.terms || []) {
      if (t.example) {
        out.push(
          pair(
            t.example,
            `（${t.termZh}）${t.definition || t.usage || `練習使用「${t.termEn}」。`}`,
          ),
        );
      }
      if (t.termEn && t.definition) {
        out.push(
          pair(
            `${t.termEn}: ${t.definition}`,
            `${t.termZh}：${t.definition}`,
          ),
        );
      }
    }
  }
  return out.filter(Boolean);
}

function poolFromRe() {
  return (re.phrases || []).map((p) => pair(p.en, p.zh)).filter(Boolean);
}

function poolFromVocab(href) {
  const m = (href || "").match(/\/english\/vocab\/([^/#]+)/);
  const tables = m ? vocab.tables.filter((t) => t.slug === m[1]) : vocab.tables;
  const out = [];
  for (const t of tables) {
    for (const part of t.parts || []) {
      for (const w of part.words || []) {
        if (w.exampleEn) {
          out.push(
            pair(
              w.exampleEn,
              `（${w.en}）${w.zh || "練習把這個詞放進完整句子。"}`,
            ),
          );
        }
        for (const col of w.collocations || []) {
          if (col.en) out.push(pair(`Let’s practice: ${col.en}.`, col.zh || w.zh || ""));
        }
      }
    }
  }
  return out.filter(Boolean);
}

function poolFromStyle(href) {
  let stages = style.stages;
  if ((href || "").includes("openers")) stages = style.stages.filter((s) => s.id === 1);
  else if ((href || "").includes("connectors")) stages = style.stages.filter((s) => s.id === 2);
  else if ((href || "").includes("signature")) stages = style.stages.filter((s) => s.id === 3);
  else if ((href || "").includes("pressure")) stages = style.stages.filter((s) => s.id === 4);
  const out = [];
  for (const st of stages) {
    for (const sec of st.sections || []) {
      for (const g of sec.groups || []) {
        for (const it of g.items || []) {
          if (!it.en) continue;
          out.push(pair(it.en, it.noteZh || it.zh || lookupZh(it.en) || ""));
        }
      }
    }
  }
  return out.filter(Boolean);
}

function poolFromConv(href) {
  let types = conv.types;
  if ((href || "").includes("ask-extend")) types = types.filter((t) => t.slug === "ask-extend");
  if ((href || "").includes("express-views")) types = types.filter((t) => t.slug === "express-views");
  if ((href || "").includes("storytelling")) types = types.filter((t) => t.slug === "storytelling");
  if ((href || "").includes("listen-empathy")) types = types.filter((t) => t.slug === "listen-empathy");
  const out = [];
  for (const t of types) {
    for (const b of t.blocks || []) {
      for (const f of b.formulas || []) {
        if (f.en) out.push(pair(f.en, f.scenarioZh || ""));
      }
    }
  }
  return out.filter(Boolean);
}

function poolFromEnglish(href) {
  const m = (href || "").match(/\/english\/([^/#]+)/);
  const slug = m?.[1];
  const skip = new Set(["style", "conversation", "vocab", "coach", "rewards"]);
  const cats =
    slug && !skip.has(slug)
      ? english.categories.filter((c) => c.slug === slug)
      : english.categories;
  const out = [];
  for (const c of cats) {
    for (const it of c.items || []) {
      if (it.en) out.push(pair(it.en, it.zh));
      for (const ex of it.examples || []) {
        if (ex?.en) out.push(pair(ex.en, ex.zh));
      }
    }
  }
  return out.filter(Boolean);
}

function domainPool(lesson) {
  const href = lesson.sourceHref || "";
  let pool = [];
  if (lesson.domain === "cfa" || href.includes("/vault")) pool = pool.concat(poolFromCfa(href));
  if (lesson.domain === "re" || href.includes("real-estate")) pool = pool.concat(poolFromRe());
  if (href.includes("/vocab") || lesson.domain === "food") pool = pool.concat(poolFromVocab(href));
  if (href.includes("/speak") || lesson.domain === "f1" || lesson.domain === "life")
    pool = pool.concat(poolFromSpeak(href));
  if (href.includes("/style") || lesson.domain === "soft") pool = pool.concat(poolFromStyle(href));
  if (href.includes("/conversation")) pool = pool.concat(poolFromConv(href));
  if (
    href.includes("/english/") &&
    !href.includes("/style") &&
    !href.includes("/conversation") &&
    !href.includes("/vocab") &&
    !href.includes("/coach")
  ) {
    pool = pool.concat(poolFromEnglish(href));
  }
  if (lesson.domain === "work") {
    pool = pool.concat(poolFromVocab("/english/vocab/office-ops"));
    pool = pool.concat(poolFromEnglish(href));
  }
  if (lesson.domain === "mix") {
    pool = pool.concat(
      poolFromSpeak("/speak"),
      poolFromRe().slice(0, 30),
      poolFromStyle("/english/style/connectors"),
    );
  }
  pool = pool.concat(poolFromSpeak("/speak/common-01-new-day").slice(0, 25));
  return uniqPairs(pool);
}

function targetContentLines(lesson) {
  const topic = lesson.topicEn;
  const topicZh = lesson.topicZh;
  const out = [];
  for (const raw of lesson.targets || []) {
    const t = raw.replace(/[.…]+$/g, "");
    out.push(
      pair(
        endsSentence(`I’ve been trying to use “${t}” more when I talk about ${topic}`),
        `聊到「${topicZh}」時，我一直想多用「${t}」這個說法。`,
      ),
      pair(
        endsSentence(`Honestly, “${t}” is the phrase I always forget under pressure`),
        `說實話，一緊張我就會忘掉「${t}」這句。`,
      ),
    );
  }
  return out.filter(Boolean);
}

function openTopicLines(lesson) {
  const topic = lesson.topicEn;
  const topicZh = lesson.topicZh;
  const rEn = roleEn(lesson);
  const rZh = roleZh(lesson);
  return [
    pair(
      endsSentence(`So today I wanted to talk about ${topic}`),
      `所以今天我想聊聊「${topicZh}」。`,
    ),
    pair(
      endsSentence(`I’ve been dealing with ${topic} this week and could use a sounding board`),
      `這週我一直在處理「${topicZh}」相關的事，想找人一起討論。`,
    ),
    pair(
      `If you were ${rEn}, how would you open a chat about ${topic}?`,
      `如果你是${rZh}，你會怎麼開啟「${topicZh}」這個話題？`,
    ),
    pair(
      endsSentence(`Let’s set the scene around ${topic} and keep it spoken, not textbook`),
      `我們圍繞「${topicZh}」設定情境，保持口語，不要像教科書。`,
    ),
    pair(
      `Can we start with a real situation connected to ${topic}?`,
      `我們可以先從一個跟「${topicZh}」有關的真實情境開始嗎？`,
    ),
  ].filter(Boolean);
}

function phaseESampleAnswers(lesson) {
  const topic = lesson.topicEn;
  const topicZh = lesson.topicZh;
  const t0 = (lesson.targets[0] || topic).replace(/[.…]+$/g, "");
  const t1 = (lesson.targets[1] || t0).replace(/[.…]+$/g, "");
  return [
    pair(
      endsSentence(`I’d say the biggest challenge with ${topic} is staying clear without sounding stiff`),
      `我覺得「${topicZh}」最大的挑戰，是要講清楚又不顯得生硬。`,
    ),
    pair(
      endsSentence(`In my experience, “${t0}” comes up first, then I need “${t1}” to finish the thought`),
      `依我的經驗，會先用到「${t0}」，接著需要「${t1}」把意思說完。`,
    ),
    pair(
      endsSentence(`If I had to explain ${topic} to a friend, I’d keep it short and give one real example`),
      `如果要跟朋友解釋「${topicZh}」，我會講短一點，再給一個真實例子。`,
    ),
    pair(
      endsSentence(`What usually trips me up is choosing between a safe sentence and a more native one`),
      `常讓我卡住的是：要選安全的句子，還是更道地的說法。`,
    ),
  ].filter(Boolean);
}

function longContentLines(lesson) {
  const topic = lesson.topicEn;
  const topicZh = lesson.topicZh;
  const rEn = roleEn(lesson);
  const rZh = roleZh(lesson);
  const ts = (lesson.targets || []).map((t) => t.replace(/[.…]+$/g, ""));
  const [a, b, c, d, e] = [
    ts[0] || topic,
    ts[1] || topic,
    ts[2] || "the key detail",
    ts[3] || "the next step",
    ts[4] || "the takeaway",
  ];
  return [
    pair(
      `When I talk with ${rEn} about ${topic}, I want to start light, then use “${a}” once the chat feels comfortable enough to go one level deeper.`,
      `當我和${rZh}聊「${topicZh}」時，我想先輕鬆開場，等對話夠自在後，再用「${a}」往下深一層。`,
    ),
    pair(
      `What I’m aiming for is a spoken line that uses “${b}” the way Americans say it when they’re thinking out loud, not like I’m reading from a textbook.`,
      `我要的是一句真正能說出口的話，用美國人邊想邊說的方式帶出「${b}」，而不是像在讀教科書。`,
    ),
    pair(
      `Could you help me rephrase this so it sounds calm and confident: I’ve been trying to handle ${topic} better, especially when “${c}” becomes the real pressure point.`,
      `可以幫我改得更沉穩有自信嗎：我一直想把「${topicZh}」處理得更好，尤其當「${c}」變成真正壓力點的時候。`,
    ),
    pair(
      `Here’s my longer attempt — please polish it but keep my meaning: around ${topic}, I usually mention “${a}” first, then connect it to “${d}” so the listener knows what I need next.`,
      `這是我的長一點版本——請修潤但保留原意：談到「${topicZh}」，我通常先提「${a}」，再接到「${d}」，讓對方知道我下一步需要什麼。`,
    ),
    pair(
      `After we finish the five questions, I’d like one comparison: how a beginner might explain ${topic} versus how you’d say it in a real conversation with ${rEn}.`,
      `五題問完後，我想要一個對照：初學者會怎麼解釋「${topicZh}」，以及你跟${rZh}真實對話時會怎麼說。`,
    ),
    pair(
      `For the wrap-up, summarize what I did well with “${a}” and “${b}”, then give me one upgrade sentence with “${e}” that I should memorize tonight.`,
      `收尾時，請總結我在「${a}」和「${b}」用得好的地方，再給我一句帶「${e}」的升級句，今晚要背起來。`,
    ),
    pair(
      `If this conversation went sideways, show me how to recover politely, reset the topic of ${topic}, and still land on a clear next step without sounding defensive.`,
      `如果對話偏掉了，請示範怎麼禮貌挽回、把話題拉回「${topicZh}」，並落到清楚的下一步，又不顯得防衛。`,
    ),
    pair(
      `Please end with a short conclusion I can say myself: what I practiced on ${topic}, which phrases I’ll reuse tomorrow, and why speaking this out loud matters more than silent review.`,
      `請用一段我能自己說的短結論收尾：我練了「${topicZh}」的什麼、明天會重用哪些片語，以及為什麼大聲說出口比默念複習更重要。`,
    ),
  ].filter(Boolean);
}

function asQuestionPair(q, zh) {
  const t = String(q || "").replace(/\s+/g, " ").trim().replace(/[.?!…]+$/g, "");
  if (!t) return null;
  return pair(`${t}?`, zh || lookupZh(`${t}?`) || lookupZh(t) || "");
}

/** Common question translations (fallback patterns). */
function translateQuestionHeuristic(q) {
  const t = String(q || "").trim();
  const cached = lookupZh(t) || lookupZh(t.replace(/[.?!]+$/g, "?"));
  if (cached) return cached;
  return "";
}

function targetSentencePairs(lesson) {
  return (lesson.targetSentences || [])
    .map((en) => {
      if (typeof en === "object" && en.en) return pair(en.en, en.zh || lookupZh(en.en));
      return withZh(en, lookupZh(en));
    })
    .filter(Boolean);
}

function questionPairs(lesson) {
  return (lesson.myFiveQuestions || [])
    .map((q) => {
      if (typeof q === "object" && q.en) {
        return asQuestionPair(q.en, q.zh);
      }
      return asQuestionPair(q, translateQuestionHeuristic(q));
    })
    .filter(Boolean);
}

function buildSentenceBank(lesson) {
  const topic = lesson.topicEn;
  const topicZh = lesson.topicZh;
  const fromDb = domainPool(lesson);

  const blockA = greetLines();
  const blockB = openTopicLines(lesson);
  const blockCcore = uniqPairs([...targetSentencePairs(lesson), ...fromDb]);
  const blockCdrill = targetContentLines(lesson).slice(0, 6);
  const blockD = questionPairs(lesson);
  const blockE = phaseESampleAnswers(lesson);
  const blockF = viewLines(topic, topicZh);
  const blockG = closeLines(topic, topicZh);

  const assemble = (contentN, drillN) =>
    uniqPairs([
      ...blockA.slice(0, 4),
      ...blockB.slice(0, 5),
      ...blockCcore.slice(0, contentN),
      ...blockCdrill.slice(0, drillN),
      ...blockD.slice(0, 5),
      ...blockE.slice(0, 4),
      ...blockF.slice(0, 3),
      ...blockG.slice(0, 3),
    ]);

  let practiceSentences = assemble(12, 4);
  let contentN = 12;
  while (practiceSentences.length < 30 && contentN < blockCcore.length) {
    contentN += 1;
    practiceSentences = assemble(contentN, 4);
  }
  while (practiceSentences.length < 30) {
    const t = lesson.targets[practiceSentences.length % (lesson.targets.length || 1)] || topic;
    practiceSentences.push(
      pair(
        endsSentence(`Another spoken angle on ${topic}: I’d mention “${t}” and then ask for your take`),
        `關於「${topicZh}」的另一個口語角度：我會先提「${t}」，再請你給看法。`,
      ),
    );
    practiceSentences = uniqPairs(practiceSentences);
  }
  if (practiceSentences.length > 40) {
    const tailNeed = 15;
    const head = practiceSentences.slice(0, 40 - tailNeed);
    const tail = practiceSentences.slice(-tailNeed);
    practiceSentences = uniqPairs([...head, ...tail]).slice(0, 40);
  }

  let longSentences = uniqPairs([
    ...fromDb.filter(isLong).slice(0, 3),
    ...targetSentencePairs(lesson).filter(isLong).slice(0, 2),
    ...longContentLines(lesson),
  ])
    .filter(isLong)
    .slice(0, 8);

  while (longSentences.length < 6) {
    const t = lesson.targets[longSentences.length % (lesson.targets.length || 1)] || topic;
    longSentences.push(
      pair(
        `When I speak about ${topic} with ${roleEn(lesson)}, I want a longer turn that still feels natural, uses “${t}”, and leaves room for a follow-up without sounding like I memorized a script.`,
        `當我和${roleZh(lesson)}談「${topicZh}」時，我想要一段較長但仍自然的話輪，用到「${t}」，也留下對方接話的空間，聽起來不像背稿。`,
      ),
    );
    longSentences = uniqPairs(longSentences.filter(isLong));
  }

  return {
    practiceSentences,
    longSentences: longSentences.slice(0, 8),
    myFiveQuestions: blockD.slice(0, 5),
    targetSentences: targetSentencePairs(lesson).slice(0, 8),
  };
}

function collectNeedZh(lessons) {
  const need = [];
  for (const l of lessons) {
    for (const p of [...(l.practiceSentences || []), ...(l.longSentences || []), ...(l.myFiveQuestions || []), ...(l.targetSentences || [])]) {
      if (p?.en && !p.zh) need.push(p.en);
    }
  }
  return need;
}

function fillZh(lessons) {
  for (const l of lessons) {
    for (const key of ["practiceSentences", "longSentences", "myFiveQuestions", "targetSentences"]) {
      l[key] = (l[key] || []).map((p) => {
        if (!p?.en) return p;
        if (p.zh) return p;
        return { en: p.en, zh: lookupZh(p.en) || zhCache[p.en] || `（練習）${p.en}` };
      });
    }
  }
}

async function main() {
  const enriched = coach.lessons.map((lesson) => {
    const base = { ...lesson };
    delete base.practiceSentences;
    delete base.longSentences;
    // normalize prior string arrays
    if (Array.isArray(base.myFiveQuestions) && typeof base.myFiveQuestions[0] === "string") {
      // keep raw for questionPairs
    }
    if (Array.isArray(base.targetSentences) && typeof base.targetSentences[0] === "string") {
      // keep raw
    }
    const built = buildSentenceBank(base);
    return {
      ...base,
      targetSentences: built.targetSentences,
      myFiveQuestions: built.myFiveQuestions,
      practiceSentences: built.practiceSentences,
      longSentences: built.longSentences,
    };
  });

  const need = collectNeedZh(enriched);
  if (need.length) {
    await translateMissing(need);
    fillZh(enriched);
  } else {
    fillZh(enriched);
  }

  let fail = 0;
  for (const l of enriched) {
    const noZh = [...l.practiceSentences, ...l.longSentences].filter((p) => !p.zh).length;
    if (l.practiceSentences.length < 30 || l.longSentences.length < 6 || noZh > 0) {
      console.error("FAIL", l.id, l.practiceSentences.length, l.longSentences.length, "noZh", noZh);
      fail += 1;
    }
  }

  coach.lessons = enriched;
  coach.version = "scripts-v4-bilingual";
  fs.writeFileSync(coachPath, `${JSON.stringify(coach, null, 2)}\n`);

  const lines = [];
  lines.push("# AI 口語陪練 · 60 堂對話模擬文稿（英中雙語句庫版）");
  lines.push("");
  lines.push("> 每堂含 **至少 30 句**口語練習英語（附中文翻譯）＋**6–8 句長句**（附中文），涵蓋 A–G。");
  lines.push("> 資料同步：`web/src/data/coach-lessons.json`（`scripts-v4-bilingual`）。");
  lines.push("> 生成腳本：`web/scripts/enrich-coach-scripts.js`。");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 一、單堂標準流程（A–G）");
  lines.push("");
  lines.push("| 階段 | 內容 | 句庫用途 |");
  lines.push("|------|------|----------|");
  lines.push("| A 開場問候 | 打招呼、狀態 | Practice 前段問候句 |");
  lines.push("| B 開啟話題 | 進入今日主題 | Topic openers |");
  lines.push("| C 句詞練習＋即時修潤 | 目標詞／句＋長句 | Targets、Practice、Long |");
  lines.push("| D 我問你五題 | 學員問 5 題 | My 5 Questions |");
  lines.push("| E 你問我三題 | AI 問 3 題；學員回答 | Sample answer 句 |");
  lines.push("| F 觀點彙整與比較 | 雙方觀點 | Viewpoint 句 |");
  lines.push("| G 結論收尾 | 今日收穫 | Closing 句 |");
  lines.push("");
  lines.push("指令：`NEXT` 下一階段；`WRAP` 跳到 F→G。");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 二、系統提示");
  lines.push("");
  lines.push("見網站「複製系統提示」或 `web/src/lib/coachPrompt.ts`。");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 三、六十堂完整句庫（英／中）");
  lines.push("");

  const fmt = (p, i) => `${i + 1}. ${p.en}\n   - ${p.zh}`;

  for (const l of enriched) {
    lines.push(`### L${String(l.id).padStart(2, "0")} ${l.topicZh}`);
    lines.push("");
    lines.push(`- **Topic:** ${l.topicEn}`);
    lines.push(`- **Domain:** ${l.domain}`);
    lines.push(`- **AI Role:** ${l.aiRole}`);
    lines.push(`- **Source:** ${l.sourceLabel} (${l.sourceHref})`);
    lines.push(`- **Targets:** ${l.targets.join(" · ")}`);
    lines.push("");
    lines.push("#### My 5 Questions");
    (l.myFiveQuestions || []).forEach((q, i) => lines.push(fmt(q, i)));
    lines.push("");
    lines.push(`#### Practice Sentences (${l.practiceSentences.length})`);
    l.practiceSentences.forEach((s, i) => lines.push(fmt(s, i)));
    lines.push("");
    lines.push(`#### Long Sentences (${l.longSentences.length})`);
    l.longSentences.forEach((s, i) => lines.push(fmt(s, i)));
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  const mdPath = path.join(root, "AI-coach-60-scripts.md");
  fs.writeFileSync(mdPath, `${lines.join("\n")}\n`);

  console.log(
    JSON.stringify(
      {
        lessons: enriched.length,
        fail,
        avgPractice: +(
          enriched.reduce((a, l) => a + l.practiceSentences.length, 0) / enriched.length
        ).toFixed(1),
        avgLong: +(
          enriched.reduce((a, l) => a + l.longSentences.length, 0) / enriched.length
        ).toFixed(1),
        mdBytes: fs.statSync(mdPath).size,
        sample: enriched[0].practiceSentences[0],
        sampleLong: enriched[0].longSentences[0],
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
