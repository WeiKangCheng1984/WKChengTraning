/**
 * Create unique classroom sentences for remaining shape-dupe members.
 * Writes gre-humor/_curated-sem-unique.json then can be applied by polish script.
 *
 * node web/scripts/gre-humor-unique-semlook-rewrite.js
 */
const fs = require("fs");
const path = require("path");

const humorDir = path.join(__dirname, "../../gre-humor");
const batch = JSON.parse(fs.readFileSync(path.join(humorDir, "_batch-remain-dupes.json"), "utf8"));

function glossCore(g) {
  return String(g || "")
    .split(/；|;|／|\//)[0]
    .replace(/^(adj|v|n|adv|vt|vi)\.\s*/i, "")
    .replace(/的$/, "")
    .trim();
}

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const WHO = [
  "The mayor",
  "Her coach",
  "The jury",
  "Our editor",
  "The curator",
  "His mentor",
  "The captain",
  "Their lawyer",
  "The librarian",
  "My neighbor",
  "The diplomat",
  "Her cousin",
  "The referee",
  "Our principal",
  "The novelist",
  "His roommate",
  "The chemist",
  "Their guide",
  "The senator",
  "Her advisor",
  "The detective",
  "Our landlord",
  "The pianist",
  "His teammate",
  "The botanist",
  "Their sponsor",
  "The archivist",
  "Her classmate",
  "The surgeon",
  "Our translator",
  "The carpenter",
  "His accountant",
  "The ranger",
  "Their host",
  "The warden",
  "Her editor",
  "The geologist",
  "Our curator",
  "The violinist",
  "His partner",
];

const WHAT = [
  "the proposal",
  "the rumor",
  "the contract",
  "the timeline",
  "the evidence",
  "the budget",
  "the invitation",
  "the warning",
  "the amendment",
  "the headline",
  "the complaint",
  "the donation",
  "the schedule",
  "the apology",
  "the forecast",
  "the petition",
  "the manuscript",
  "the verdict",
  "the checklist",
  "the memo",
  "the portrait",
  "the shipment",
  "the syllabus",
  "the brochure",
  "the archive",
  "the playlist",
  "the blueprint",
  "the survey",
  "the ledger",
  "the rehearsal",
  "the footnote",
  "the ordinance",
  "the shipment list",
  "the guest list",
  "the rough draft",
  "the final cut",
  "the safety rule",
  "the travel plan",
  "the seating chart",
  "the weather alert",
];

const WHERE = [
  "before dawn",
  "after the vote",
  "during the recess",
  "on the first floor",
  "outside the hall",
  "near the river",
  "in the archive room",
  "at the morning briefing",
  "before the deadline",
  "after the storm",
  "during office hours",
  "on the night train",
  "beside the fountain",
  "in the quiet lobby",
  "at the back entrance",
  "before opening night",
  "after lunch",
  "during the blackout",
  "on the ferry deck",
  "in the side chapel",
  "at the county fair",
  "before sunrise practice",
  "after the final bell",
  "during the rain delay",
  "on the museum steps",
  "in the greenhouse",
  "at the border checkpoint",
  "before the town parade",
  "after the power cut",
  "during the soft opening",
  "on the library roof",
  "in the rehearsal loft",
  "at the old pier",
  "before the first frost",
  "after the census count",
  "during the shift change",
  "on the garden path",
  "in the print shop",
  "at the highland trailhead",
  "before the evening news",
];

const ADJ_NOUNS = [
  "reply",
  "title",
  "ending",
  "gesture",
  "warning",
  "smile",
  "critique",
  "summary",
  "tone",
  "choice",
  "pause",
  "glance",
  "remark",
  "decision",
  "posture",
  "headline",
  "entrance",
  "closing",
  "question",
  "promise",
];

function classify(hw, gloss) {
  const g0 = String(gloss || "").split(/；|;/)[0];
  const g = glossCore(gloss);
  if (/者$|師$|人$|員$/.test(g0) || /er$|or$|ist$|ian$|ee$/i.test(hw)) return "person";
  if (/地$/.test(g0) || (/ly$/i.test(hw) && !/的/.test(g0))) return "adv";
  if (/的$/.test(g0) || /ous$|ic$|ive$|al$|ant$|ent$|ary$|ful$|less$|ible$|able$/i.test(hw)) return "adj";
  if (/ed$/i.test(hw) && /獲|被|已|過/.test(g0)) return "adj_ed";
  if (/tion$|sion$|ance$|ence$|ity$|ment$|ure$|ism$|ness$|ship$/i.test(hw)) return "noun";
  if (/ate$|ize$|ise$|ify$|ect$|ude$|en$|ish$/i.test(hw)) return "verb";
  if (!/的/.test(g0) && g.length <= 4) return "verb";
  return "noun";
}

function make(hw, gloss) {
  const h = hash(hw);
  const g = glossCore(gloss) || hw;
  const who = WHO[h % WHO.length];
  const what = WHAT[(h >>> 5) % WHAT.length];
  const where = WHERE[(h >>> 11) % WHERE.length];
  const adjn = ADJ_NOUNS[(h >>> 17) % ADJ_NOUNS.length];
  const kind = classify(hw, gloss);
  const t = h % 6;

  if (kind === "person") {
    const frames = [
      {
        en: `${who} asked an independent ${hw} to review ${what} ${where}.`,
        zh: `${who.replace(/^The |^Her |^His |^Our |^Their |^My /, "")}請獨立的${g}在${where}審視${what}。`.replace(/^(mayor|coach)/, "對方"),
      },
    ];
    // simpler reliable ZH
    return {
      en: `${who} asked an independent ${hw} to review ${what} ${where}.`,
      zh: `有人請獨立的${g}，在「${where}」審視「${what}」。`,
    };
  }

  if (kind === "adj_ed") {
    return {
      en: `Once ${hw} of ${what}, ${who.toLowerCase()} acted quickly ${where}.`,
      zh: `一${g}「${what}」的消息，相關人士就在「${where}」迅速行動。`,
    };
  }

  if (kind === "adj") {
    const frames = [
      {
        en: `${who} found the ${adjn} strangely ${hw} ${where}.`,
        zh: `有人覺得那個「${adjn}」在「${where}」顯得異常${g}。`,
      },
      {
        en: `Even ${where}, her ${adjn} stayed stubbornly ${hw}.`,
        zh: `即使在「${where}」，她的「${adjn}」仍固執地${g}。`,
      },
      {
        en: `Critics called ${what} unnecessarily ${hw} ${where}.`,
        zh: `批評者認為「${what}」在「${where}」過分${g}。`,
      },
      {
        en: `A ${hw} ${adjn} can still hide a careful plan.`,
        zh: `一個${g}的「${adjn}」仍可能藏著周密計畫。`,
      },
      {
        en: `${who} preferred a more ${hw} ${adjn} than flashy slogans.`,
        zh: `比起花俏口號，對方更偏好${g}的「${adjn}」。`,
      },
      {
        en: `Nothing felt as ${hw} as that ${adjn} ${where}.`,
        zh: `在「${where}」，沒有什麼比那個「${adjn}」更顯得${g}。`,
      },
    ];
    return frames[t];
  }

  if (kind === "adv") {
    const frames = [
      {
        en: `${who} answered ${hw} when asked about ${what} ${where}.`,
        zh: `被問到「${what}」時，對方在「${where}」${g}地回答。`,
      },
      {
        en: `They finished ${hw}, then locked ${what} ${where}.`,
        zh: `他們${g}地做完，然後在「${where}」鎖好「${what}」。`,
      },
      {
        en: `She spoke ${hw} about ${what} ${where}.`,
        zh: `她在「${where}」${g}地談及「${what}」。`,
      },
      {
        en: `${who} moved ${hw} through the crowd toward ${what}.`,
        zh: `對方${g}地穿過人群，朝「${what}」走去。`,
      },
      {
        en: `He nodded ${hw} and accepted ${what} ${where}.`,
        zh: `他${g}地點頭，並在「${where}」接受了「${what}」。`,
      },
      {
        en: `The team worked ${hw} to repair ${what} ${where}.`,
        zh: `團隊${g}地在「${where}」搶修「${what}」。`,
      },
    ];
    return frames[t];
  }

  if (kind === "verb") {
    const frames = [
      {
        en: `${who} refused to ${hw} ${what} ${where}.`,
        zh: `對方在「${where}」拒絕${g}「${what}」。`,
      },
      {
        en: `Please do not ${hw} ${what} just to look clever ${where}.`,
        zh: `請別只為在「${where}」顯得聰明就去${g}「${what}」。`,
      },
      {
        en: `${who} tried to ${hw} ${what} before anyone noticed.`,
        zh: `對方試圖在別人發現前${g}「${what}」。`,
      },
      {
        en: `Good editors ${hw} ${what} ${where}, not after the fact.`,
        zh: `好編輯會在「${where}」就${g}「${what}」，而不是事後才做。`,
      },
      {
        en: `Witnesses would not ${hw} ${what} without clearer proof.`,
        zh: `沒有更清楚的證據，證人不會${g}「${what}」。`,
      },
      {
        en: `${who} had to ${hw} ${what} ${where} or lose the grant.`,
        zh: `對方必須在「${where}」${g}「${what}」，否則會失去補助。`,
      },
    ];
    return frames[t];
  }

  // noun
  const frames = [
    {
      en: `${who} treated the ${hw} of ${what} as a serious clue ${where}.`,
      zh: `對方在「${where}」把「${what}」的「${g}」當成重要線索。`,
    },
    {
      en: `Without honest ${hw}, ${what} collapsed ${where}.`,
      zh: `沒有誠實的「${g}」，「${what}」在「${where}」就垮了。`,
    },
    {
      en: `The chapter uses a short story to explain ${hw} beside ${what}.`,
      zh: `這一章用短篇故事，在「${what}」旁解釋「${g}」。`,
    },
    {
      en: `Her quiet ${hw} mattered more than applause for ${what}.`,
      zh: `她安靜的「${g}」比對「${what}」的掌聲更重要。`,
    },
    {
      en: `Students debated the ${hw} behind ${what} ${where}.`,
      zh: `學生在「${where}」辯論「${what}」背後的「${g}」。`,
    },
    {
      en: `A single ${hw} cannot settle ${what} by itself.`,
      zh: `單靠一次「${g}」無法自行了結「${what}」。`,
    },
  ];
  return frames[t];
}

const out = {};
const shapes = {};
let collisions = 0;
for (const row of batch) {
  const hw = row.hw;
  const next = make(hw, row.gloss);
  const shape = next.en
    .toLowerCase()
    .replace(new RegExp(`\\b${hw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"), "HW")
    .replace(/[^a-zHW\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  shapes[shape] = (shapes[shape] || 0) + 1;
  if (shapes[shape] > 1) collisions += 1;
  out[hw] = next;
}

const heavy = Object.entries(shapes)
  .filter(([, n]) => n >= 4)
  .sort((a, b) => b[1] - a[1]);

fs.writeFileSync(path.join(humorDir, "_curated-sem-unique.json"), `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ written: Object.keys(out).length, heavyShapes: heavy.slice(0, 8), collisionPairs: collisions }, null, 2));
