/**
 * Strip Cue-template contamination from gre-vocabulary example fields.
 * node web/scripts/gre-humor-q-clean-vocab-examples.js
 */
const fs = require("fs");
const path = require("path");

const grePath = path.join(__dirname, "../src/data/gre-vocabulary.json");
const gre = JSON.parse(fs.readFileSync(grePath, "utf8"));
const TEMPLATE_RE = /Cue the |gag sticks|walks on|出場|梗就黏住/i;

let cleaned = 0;
for (const letter of gre.letters || []) {
  for (const w of letter.words || []) {
    let hit = false;
    for (const key of ["exampleEn", "example", "exampleUsage"]) {
      if (w[key] && TEMPLATE_RE.test(String(w[key]))) {
        w[key] = "";
        hit = true;
      }
    }
    if (hit) {
      cleaned += 1;
      // Leave a minimal classroom seed from endef/zh if both examples empty
      if (!w.exampleEn && w.endef) {
        const gloss = String(w.zh || w.endef).split(/[｜|]/)[0].trim();
        w.exampleEn = `On the exam, ${w.en} most nearly means a sense of "${gloss}".`;
        w.example = `${w.exampleEn} （${gloss}）`;
        w.exampleUsage = `考意錨點：${gloss}`;
      }
    }
  }
}

fs.writeFileSync(grePath, `${JSON.stringify(gre, null, 2)}\n`);
console.log(JSON.stringify({ cleanedWords: cleaned }, null, 2));
