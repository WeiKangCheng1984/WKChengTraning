/**
 * Stage 1 quality pass: promote all seed clusters to reviewed
 * + emit one lesson file each (tract already exists; will refresh).
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const humorDir = path.join(root, "gre-humor");
const clusterDir = path.join(humorDir, "clusters");
const lessonDir = path.join(humorDir, "lessons");

const SEASON = {
  rhyme: { id: 1, titleZh: "押韻派對", titleEn: "Rhyme Party" },
  root: { id: 2, titleZh: "字根劇場", titleEn: "Root Theater" },
  semantic: { id: 3, titleZh: "語氣對打", titleEn: "Tone Duels" },
  lookalike: { id: 3, titleZh: "語氣對打", titleEn: "Tone Duels" },
};

/** Hand-crafted quizzes — sense accuracy over cleverness */
const QUIZZES = {
  "rhyme-our-01": [
    {
      id: "q1",
      type: "sense",
      promptEn: "Which word means harsh, stern, and gloomy in manner?",
      promptZh: "哪一個詞表示態度嚴厲、冷酷、陰鬱？",
      choices: ["pour", "sour", "dour", "mourn"],
      answer: "dour",
    },
    {
      id: "q2",
      type: "sense",
      promptEn: "To search or clean something very thoroughly is to:",
      promptZh: "非常徹底地搜查或刷洗，是：",
      choices: ["pour", "scour", "mourn", "lour"],
      answer: "scour",
    },
    {
      id: "q3",
      type: "lookalike",
      promptEn: "pour is most easily confused in sound with:",
      promptZh: "pour 在發音上最容易和哪個混淆？",
      choices: ["poor", "pore only", "power", "peer"],
      answer: "poor",
    },
  ],
  "rhyme-edge-01": [
    {
      id: "q1",
      type: "sense",
      promptEn: "To claim something without proof is to:",
      promptZh: "在未證實的情況下宣稱／指控，是：",
      choices: ["pledge", "hedge", "allege", "fledge"],
      answer: "allege",
    },
    {
      id: "q2",
      type: "sense",
      promptEn: "In finance, to protect against risk is often to:",
      promptZh: "在金融語境中，為防風險而採取保護，常說：",
      choices: ["pledge", "hedge", "badger", "allege"],
      answer: "hedge",
    },
    {
      id: "q3",
      type: "sense",
      promptEn: "To pester someone repeatedly is to:",
      promptZh: "一再纠缠、煩擾某人，是：",
      choices: ["fledge", "pledge", "badger", "hedge"],
      answer: "badger",
    },
  ],
  "rhyme-eak-01": [
    {
      id: "q1",
      type: "sense",
      promptEn: "To cause severe damage or havoc is to:",
      promptZh: "造成嚴重破壞／浩劫，是：",
      choices: ["sneak", "wreak", "evoke", "revoke"],
      answer: "wreak",
    },
    {
      id: "q2",
      type: "sense",
      promptEn: "evoke : bring to mind :: revoke :",
      promptZh: "evoke 是喚起，revoke 最接近：",
      choices: ["renew", "cancel / withdraw", "echo", "remind"],
      answer: "cancel / withdraw",
    },
    {
      id: "q3",
      type: "sense",
      promptEn: "A future that looks cold and hopeless is:",
      promptZh: "看起來冰冷無望的前景是：",
      choices: ["bleak", "streak", "sneak", "wreak"],
      answer: "bleak",
    },
  ],
  "rhyme-ant-01": [
    {
      id: "q1",
      type: "sense",
      promptEn: "A cruel absolute ruler is a:",
      promptZh: "殘酷的絕對統治者是：",
      choices: ["gallant", "tyrant", "slant", "rant"],
      answer: "tyrant",
    },
    {
      id: "q2",
      type: "sense",
      promptEn: "A biased angle in reporting is a:",
      promptZh: "報導中帶偏見的角度，是：",
      choices: ["slant", "repent", "gallant", "tyrant"],
      answer: "slant",
    },
    {
      id: "q3",
      type: "sense",
      promptEn: "An angry, noisy tirade is a:",
      promptZh: "憤怒喧鬧的長篇大論／咆哮，是：",
      choices: ["repent", "rant", "slant", "gallant"],
      answer: "rant",
    },
  ],
  "root-tract-01": [
    {
      id: "q1",
      type: "sense",
      promptEn: "Which word best means “to make something seem less valuable”?",
      promptZh: "哪一個詞最接近「使某事顯得較不有價值／貶低」？",
      choices: ["attract", "detract", "protract", "tractable"],
      answer: "detract",
    },
    {
      id: "q2",
      type: "sense",
      promptEn: "A problem that is hard to manage is:",
      promptZh: "一個很難處理／駕馭的問題是：",
      choices: ["tractable", "attractive", "intractable", "retracted"],
      answer: "intractable",
    },
    {
      id: "q3",
      type: "lookalike",
      promptEn: "protract is closest in idea to:",
      promptZh: "protract 在概念上最接近：",
      choices: ["protect", "prolong", "protest", "portray"],
      answer: "prolong",
    },
  ],
  "root-tort-01": [
    {
      id: "q1",
      type: "sense",
      promptEn: "To twist the truth is to:",
      promptZh: "扭曲真相，是：",
      choices: ["extort", "distort", "retort", "torment"],
      answer: "distort",
    },
    {
      id: "q2",
      type: "lookalike",
      promptEn: "tortuous (winding) is often confused with:",
      promptZh: "tortuous（曲折的）常和哪個混淆？",
      choices: ["torturous", "tortoise", "torrent", "torque only"],
      answer: "torturous",
    },
    {
      id: "q3",
      type: "sense",
      promptEn: "To obtain money by threats is to:",
      promptZh: "以威脅取得金錢，是：",
      choices: ["retort", "extort", "contort", "distort"],
      answer: "extort",
    },
  ],
  "root-scend-01": [
    {
      id: "q1",
      type: "sense",
      promptEn: "To talk down to someone as if superior is to:",
      promptZh: "以高人一等的態度對人說話，是：",
      choices: ["ascend", "transcend", "condescend", "crescendo"],
      answer: "condescend",
    },
    {
      id: "q2",
      type: "sense",
      promptEn: "To go beyond ordinary limits is to:",
      promptZh: "超越平常界限，是：",
      choices: ["descend", "transcend", "crescendo", "condescend"],
      answer: "transcend",
    },
    {
      id: "q3",
      type: "sense",
      promptEn: "A gradual increase in intensity is a:",
      promptZh: "強度逐漸升高，是：",
      choices: ["descend", "ascend", "crescendo", "condescend"],
      answer: "crescendo",
    },
  ],
  "root-clud-01": [
    {
      id: "q1",
      type: "sense",
      promptEn: "To make something impossible in advance is to:",
      promptZh: "預先使某事不可能發生，是：",
      choices: ["include", "preclude", "seclude", "conclude"],
      answer: "preclude",
    },
    {
      id: "q2",
      type: "sense",
      promptEn: "To shut oneself away from others is to:",
      promptZh: "使自己與他人隔絕，是：",
      choices: ["exclude", "seclude", "occlude", "conclude"],
      answer: "seclude",
    },
    {
      id: "q3",
      type: "lookalike",
      promptEn: "preclude is NOT the same as:",
      promptZh: "preclude 不等于：",
      choices: ["prevent by ruling out", "make impossible", "include beforehand", "forestall"],
      answer: "include beforehand",
    },
  ],
  "sem-flattery-01": [
    {
      id: "q1",
      type: "sense",
      promptEn: "A person who flatters the powerful for gain is a:",
      promptZh: "為利益奉承權貴的人，是：",
      choices: ["sycophant", "imperious", "supercilious", "arrogant"],
      answer: "sycophant",
    },
    {
      id: "q2",
      type: "sense",
      promptEn: "A haughty, looking-down-the-nose attitude is:",
      promptZh: "目空一切、用鼻孔看人的態度，是：",
      choices: ["fawn", "toady", "supercilious", "amiable"],
      answer: "supercilious",
    },
    {
      id: "q3",
      type: "contrast",
      promptEn: "fawn (curry favor) sits on which side of the pair?",
      promptZh: "fawn（巴結）屬於對照的哪一邊？",
      choices: ["flatterer side", "arrogant side", "neutral scholar", "neither"],
      answer: "flatterer side",
    },
  ],
  "sem-talk-01": [
    {
      id: "q1",
      type: "sense",
      promptEn: "Using very few words, in a Spartan style, is:",
      promptZh: "用極少的字、斯巴達式簡潔，是：",
      choices: ["verbose", "garrulous", "laconic", "loquacious"],
      answer: "laconic",
    },
    {
      id: "q2",
      type: "sense",
      promptEn: "Tediously talkative is closest to:",
      promptZh: "令人厭煩地話多，最接近：",
      choices: ["taciturn", "reticent", "garrulous", "laconic"],
      answer: "garrulous",
    },
    {
      id: "q3",
      type: "contrast",
      promptEn: "reticent emphasizes:",
      promptZh: "reticent 更強調：",
      choices: [
        "unwillingness to reveal",
        "love of long speeches",
        "musical talent",
        "physical silence only",
      ],
      answer: "unwillingness to reveal",
    },
  ],
  "sem-temper-01": [
    {
      id: "q1",
      type: "sense",
      promptEn: "Quick to anger; hot-tempered:",
      promptZh: "一點就燃、脾氣火爆：",
      choices: ["affable", "genial", "irascible", "amiable"],
      answer: "irascible",
    },
    {
      id: "q2",
      type: "lookalike",
      promptEn: "amiable (friendly person) is often confused with:",
      promptZh: "amiable（和善的人）常和哪個混淆？",
      choices: ["amicable", "amiably only", "amenable", "amorous"],
      answer: "amicable",
    },
    {
      id: "q3",
      type: "contrast",
      promptEn: "choleric belongs with:",
      promptZh: "choleric 屬於：",
      choices: ["hot-temper group", "warm-friendly group", "silent group", "flattery group"],
      answer: "hot-temper group",
    },
  ],
  "look-a-01": [
    {
      id: "q1",
      type: "lookalike",
      promptEn: "assent : agree :: dissent :",
      promptZh: "assent 是同意，dissent 是：",
      choices: ["descend", "disagree", "ascent", "consent"],
      answer: "disagree",
    },
    {
      id: "q2",
      type: "lookalike",
      promptEn: "aesthetic concerns beauty; ascetic concerns:",
      promptZh: "aesthetic 關乎美；ascetic 關乎：",
      choices: ["athletics", "self-denial / austerity", "anesthetics", "aesthetics too"],
      answer: "self-denial / austerity",
    },
    {
      id: "q3",
      type: "lookalike",
      promptEn: "abate (lessen) vs abet (help wrongdoing) — which aids a crime?",
      promptZh: "abate（減輕）vs abet（協助壞事）——哪個是協助犯罪？",
      choices: ["abate", "abet", "both", "neither"],
      answer: "abet",
    },
  ],
};

/** Optional speak-line polish overrides (only when we want a sharper academic line) */
const SPEAK_POLISH = {
  pour: {
    speakLineEn: "Critics should not pour scorn on a draft before reading it carefully.",
    speakLineZh: "批評者不該在細讀前就對草稿大潑冷水／嘲弄。",
  },
  sour: {
    speakLineEn: "The partnership soured when incentives were misaligned.",
    speakLineZh: "誘因錯位後，這段合作關係變質了。",
  },
  lour: {
    speakLineEn: "Dark clouds seemed to lour over the unfinished bargain.",
    speakLineZh: "烏雲彷彿對未完成的交易陰沉皺眉。",
  },
};

function qualityCheck(cluster) {
  const issues = [];
  if (!cluster.hook || cluster.hook.length < 8) issues.push("hook too short");
  if (!cluster.script || cluster.script.length < 40) issues.push("script too short");
  if (!Array.isArray(cluster.members) || cluster.members.length < 4) {
    issues.push("members < 4");
  }
  if (!Array.isArray(cluster.reviewHooks) || cluster.reviewHooks.length < 2) {
    issues.push("need ≥2 reviewHooks");
  }
  if (!Array.isArray(cluster.pitfalls) || cluster.pitfalls.length < 1) {
    issues.push("need ≥1 pitfall");
  }
  for (const m of cluster.members || []) {
    if (!m.zhGloss) issues.push(`${m.headword}: missing zhGloss`);
    if (!m.roleInScript) issues.push(`${m.headword}: missing roleInScript`);
    if (!m.speakLineEn || m.speakLineEn.length < 20) {
      issues.push(`${m.headword}: weak speakLineEn`);
    }
    if (!m.speakLineZh) issues.push(`${m.headword}: missing speakLineZh`);
    // reject template junk
    if (/The committee decided to/i.test(m.speakLineEn || "")) {
      issues.push(`${m.headword}: template speak line`);
    }
  }
  if (!QUIZZES[cluster.id] || QUIZZES[cluster.id].length < 3) {
    issues.push("missing 3-item quiz");
  }
  return issues;
}

function buildLesson(cluster) {
  const season = SEASON[cluster.type] || SEASON.root;
  return {
    id: `lesson-${cluster.id}`,
    slug: cluster.id,
    season: season.id,
    seasonTitleZh: season.titleZh,
    seasonTitleEn: season.titleEn,
    type: cluster.type === "lookalike" || cluster.type === "semantic" ? "duel" : "family",
    minutes: "12-15",
    clusterId: cluster.id,
    titleZh: cluster.titleZh,
    titleEn: cluster.titleEn,
    flow: [
      { step: 1, name: "鉤子", minutes: 0.5, content: cluster.hook },
      { step: 2, name: "串記劇本", minutes: 2, content: cluster.script },
      {
        step: 3,
        name: "詞卡 round",
        minutes: 7,
        content: "依 members 逐詞：義錨 → 劇本角色 → 跟讀 speakLineEn／對照 speakLineZh",
      },
      { step: 4, name: "快測", minutes: 2, content: "見 quiz（3 題）" },
      { step: 5, name: "口令帶走", minutes: 0.5, content: cluster.reviewHooks },
    ],
    quiz: QUIZZES[cluster.id],
    pitfalls: cluster.pitfalls,
    status: "reviewed",
    qualityGate: {
      reviewedAt: new Date().toISOString().slice(0, 10),
      checklist: [
        "hook+script present",
        "members ≥4 with bilingual speak lines",
        "reviewHooks ≥2",
        "pitfalls ≥1",
        "quiz ×3 sense-accurate",
      ],
    },
  };
}

const files = fs.readdirSync(clusterDir).filter((f) => f.endsWith(".json")).sort();
const results = [];
const lessonIndex = [];

for (const file of files) {
  const fp = path.join(clusterDir, file);
  const cluster = JSON.parse(fs.readFileSync(fp, "utf8"));

  // polish speak lines if override exists
  for (const m of cluster.members || []) {
    const polish = SPEAK_POLISH[m.headword];
    if (polish) {
      m.speakLineEn = polish.speakLineEn;
      m.speakLineZh = polish.speakLineZh;
    }
    // ensure senseAnchor not empty
    if (!m.senseAnchor) m.senseAnchor = m.zhGloss || "";
  }

  const issues = qualityCheck(cluster);
  if (issues.length) {
    results.push({ id: cluster.id, status: "blocked", issues });
    continue;
  }

  cluster.status = "reviewed";
  cluster.qualityGate = {
    reviewedAt: new Date().toISOString().slice(0, 10),
    note: "Stage-1 promote: aligned with tract lesson template",
  };
  fs.writeFileSync(fp, `${JSON.stringify(cluster, null, 2)}\n`);

  const lesson = buildLesson(cluster);
  fs.writeFileSync(
    path.join(lessonDir, `${lesson.id}.json`),
    `${JSON.stringify(lesson, null, 2)}\n`,
  );
  lessonIndex.push({
    id: lesson.id,
    slug: lesson.slug,
    season: lesson.season,
    seasonTitleZh: lesson.seasonTitleZh,
    titleZh: lesson.titleZh,
    clusterId: lesson.clusterId,
    type: lesson.type,
    status: lesson.status,
    memberCount: cluster.members.length,
  });
  results.push({ id: cluster.id, status: "reviewed", members: cluster.members.length });
}

lessonIndex.sort((a, b) => a.season - b.season || a.slug.localeCompare(b.slug));
fs.writeFileSync(
  path.join(lessonDir, "index.json"),
  `${JSON.stringify({ version: "v0.1-reviewed-seeds", total: lessonIndex.length, lessons: lessonIndex }, null, 2)}\n`,
);

// refresh gre-humor/index.json
const gre = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/gre-vocabulary.json"), "utf8"),
);
const vocab = new Set(
  gre.letters.flatMap((l) => (l.words || []).map((w) => String(w.en || "").toLowerCase())),
);
const indexClusters = files.map((file) => {
  const c = JSON.parse(fs.readFileSync(path.join(clusterDir, file), "utf8"));
  return {
    id: c.id,
    type: c.type,
    titleZh: c.titleZh,
    priority: c.priority || "A",
    status: c.status,
    memberCount: (c.members || []).length,
    inVocab: (c.members || []).filter((m) => vocab.has(m.headword)).length,
    pendingAdd: (c.members || []).filter((m) => !vocab.has(m.headword)).map((m) => m.headword),
  };
});
fs.writeFileSync(
  path.join(humorDir, "index.json"),
  `${JSON.stringify(
    {
      version: "v0.1-reviewed-seeds",
      status: "stage1-complete",
      clusters: indexClusters,
      lessons: lessonIndex,
    },
    null,
    2,
  )}\n`,
);

const blocked = results.filter((r) => r.status === "blocked");
console.log(
  JSON.stringify(
    {
      reviewed: results.filter((r) => r.status === "reviewed").length,
      blocked: blocked.length,
      blockedDetail: blocked,
      lessons: lessonIndex.length,
    },
    null,
    2,
  ),
);
