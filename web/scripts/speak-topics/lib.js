/** @typedef {{ en: string; zh: string }} Line */
/** @typedef {{ titleZh: string; sentences: Line[]; phrases: Line[] }} MonologueBlock */
/** @typedef {{ en: string; zh: string; contextZh: string }} ShortReply */
/** @typedef {{ visitorEn: string; visitorZh: string; shortEn: string; shortZh: string; fullEn: string; fullZh: string }} Expansion */

/**
 * @param {object} spec
 * @param {string} spec.slug
 * @param {string} spec.titleZh
 * @param {string} spec.titleEn
 * @param {string} spec.summaryZh
 * @param {MonologueBlock[]} spec.part1
 * @param {ShortReply[]} spec.part2
 * @param {Expansion[]} spec.part3
 */
function compileTopic(spec) {
  const slug = spec.slug;
  const id = slug;
  const audioFile = `${slug}.mp3`;
  /** @type {import('../../src/lib/types').SpeakSegment[]} */
  const segments = [];
  let idx = 0;

  for (const block of spec.part1) {
    for (const s of block.sentences) {
      idx += 1;
      segments.push({
        id: `${slug}-${String(idx).padStart(3, "0")}`,
        group: `Part 1 · ${block.titleZh}`,
        en: s.en,
        zh: s.zh,
      });
    }
  }
  for (const s of spec.part2) {
    idx += 1;
    segments.push({
      id: `${slug}-${String(idx).padStart(3, "0")}`,
      group: "Part 2 · 簡短回應",
      en: s.en,
      zh: s.zh,
      contextZh: s.contextZh,
    });
  }
  for (const s of spec.part3) {
    idx += 1;
    segments.push({
      id: `${slug}-${String(idx).padStart(3, "0")}`,
      group: "Part 3 · 附和＋補充",
      en: `${s.visitorEn}\n→ ${s.shortEn} ${s.fullEn}`,
      zh: `${s.visitorZh}\n→ ${s.shortZh} ${s.fullZh}`,
    });
  }

  const sentenceCount = spec.part1.reduce((n, b) => n + b.sentences.length, 0);
  const mins = Math.max(3, Math.round((sentenceCount + spec.part2.length) / 12));

  return {
    id,
    slug,
    series: "common",
    seriesZh: "常用口語",
    seriesEn: "Common Oral Scripts",
    titleZh: spec.titleZh,
    titleEn: spec.titleEn,
    summaryZh: spec.summaryZh,
    durationHint: `約 ${mins}–${mins + 2} 分鐘 · ${segments.length} 句`,
    audioPath: `/audio/speak/common/${audioFile}`,
    audioFile,
    status: "draft",
    segmentCount: segments.length,
    segments,
    lesson: {
      introZh:
        "三部分：五段心得口說、十二句參訪回應、十二組「附和＋完整補充」。先讀 Part 1 片語，再逐句跟讀。",
      blocks: spec.part1.map((b) => ({
        titleZh: b.titleZh,
        phrases: b.phrases,
      })),
    },
  };
}

module.exports = { compileTopic };
