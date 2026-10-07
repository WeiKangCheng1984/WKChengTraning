# -*- coding: utf-8 -*-
"""Ensure every GRE entry has a TTS-friendly English example sentence."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "GRE vocabulary.md"
OUT = ROOT / "GRE vocabulary.md"

FIELD_RE = re.compile(r"^- \*\*(.+?)\*\*：\s*(.*)$")
LETTER_RE = re.compile(r"^## ([A-Z#])\s*$")
WORD_RE = re.compile(r"^### (.+)\s*$")
POS_RE = re.compile(r"^([nvadj]+\.?/?[nvadj]*\.?)\s*", re.I)
HAS_HAN = re.compile(r"[\u4e00-\u9fff]")
NA = {
    "",
    "（原表未提供）",
    "（詞庫暫無）",
    "（無特別形近組）",
    "（待補）",
}

try:
    from opencc import OpenCC

    _cc = OpenCC("s2t")

    def to_trad(s: str) -> str:
        return _cc.convert(s) if s else s

except Exception:

    def to_trad(s: str) -> str:
        return s


def strip_pos(zh: str) -> str:
    t = POS_RE.sub("", (zh or "").strip())
    # drop teaching appendix
    t = t.split("｜")[0].strip(" ；;,.，")
    t = re.sub(r"^教學補註：.*$", "", t)
    return t or "該詞義"


def detect_pos(zh: str, lemma: str) -> str:
    z = (zh or "").lower()
    if re.match(r"^v\.?", z) or "vt." in z or "vi." in z:
        return "v"
    if re.match(r"^n\.?", z):
        return "n"
    if re.match(r"^adj\.?", z) or re.match(r"^a\.", z):
        return "a"
    if re.match(r"^adv\.?", z):
        return "r"
    try:
        from nltk.corpus import wordnet as wn

        syns = wn.synsets(lemma)
        if syns:
            return syns[0].pos()
    except Exception:
        pass
    return "n"


def lemma_in_text(text: str, lemma: str) -> bool:
    t = text.lower()
    w = lemma.lower()
    if re.search(rf"\b{re.escape(w)}\b", t):
        return True
    # light inflection
    stems = {w}
    if w.endswith("e"):
        stems.add(w + "d")
        stems.add(w[:-1] + "ing")
        stems.add(w[:-1] + "ed")
    else:
        stems.add(w + "ed")
        stems.add(w + "ing")
        stems.add(w + "s")
        stems.add(w + "es")
    if w.endswith("y") and len(w) > 2:
        stems.add(w[:-1] + "ies")
        stems.add(w[:-1] + "ied")
    for s in stems:
        if re.search(rf"\b{re.escape(s)}\b", t):
            return True
    return False


def capitalize_sent(s: str) -> str:
    s = s.strip().strip('"').strip("'")
    if not s:
        return s
    return s[0].upper() + s[1:]


def ensure_period(s: str) -> str:
    s = s.strip()
    if not s:
        return s
    if s[-1] not in ".!?":
        s += "."
    return s


def wordnet_example(lemma: str) -> str:
    try:
        from nltk.corpus import wordnet as wn
    except Exception:
        return ""
    candidates: list[str] = []
    for syn in wn.synsets(lemma):
        for ex in syn.examples():
            ex = ex.strip()
            if not ex:
                continue
            if lemma_in_text(ex, lemma):
                candidates.append(ex)
    if not candidates:
        return ""
    # Prefer longer, sentence-like
    candidates.sort(key=lambda x: (bool(re.search(r"[.!?]", x)), len(x)), reverse=True)
    sent = capitalize_sent(candidates[0])
    return ensure_period(sent)


def extract_english_phrase(usage: str, lemma: str) -> str:
    if not usage or usage.startswith("核心義"):
        return ""
    # keep first segment before teaching markers
    part = usage.split("｜")[0].split("延伸")[0].strip()
    part = HAS_HAN.split(part, maxsplit=1)[0].strip(" ；;,.，-")
    part = re.sub(r"\s+", " ", part)
    if not part or not lemma_in_text(part, lemma):
        return ""
    return part


def phrase_to_sentence(phrase: str, lemma: str, pos: str) -> str:
    p = phrase.strip().strip(".")
    if re.search(r"[.!?]$", phrase) and len(p.split()) >= 4:
        return ensure_period(capitalize_sent(p))
    # already a short clause with verb
    if pos == "v":
        if p.lower().startswith("to "):
            return ensure_period(f"They decided {p}")
        if p.lower().startswith(lemma.lower()):
            return ensure_period(f"In that case, they had to {p}")
        return ensure_period(f"They had to {p}")
    if pos in ("a", "s"):
        if p.lower().startswith(("a ", "an ", "the ")):
            return ensure_period(f"It was {p}")
        return ensure_period(f"It was a strikingly {p} moment" if " " not in p else f"Consider this case: {p}")
    if pos == "r":
        return ensure_period(f"She answered {p}")
    # noun / other
    if p.lower().startswith(("a ", "an ", "the ")):
        return ensure_period(f"The debate focused on {p}")
    if lemma_in_text(p, lemma) and len(p.split()) >= 2:
        # Keep the original collocation inside a natural frame
        target = p if p.lower().startswith(("a ", "an ", "the ")) else f"the {p}"
        return ensure_period(
            f"In academic English, writers may refer to {target}"
        )
    return ensure_period(f"A clear understanding of {lemma} is essential here")


def fallback_sentence(lemma: str, pos: str, endef: str) -> str:
    gloss = (endef or "").lower()
    w = lemma
    if pos == "v":
        if any(k in gloss for k in ("less", "decrease", "diminish", "reduce", "weaken")):
            return f"After midnight, the noise began to {w}."
        if any(k in gloss for k in ("increase", "intensify", "strengthen", "grow")):
            return f"Pressure continued to {w} as the deadline approached."
        if any(k in gloss for k in ("praise", "approve", "support")):
            return f"Several critics chose to {w} the daring new policy."
        if any(k in gloss for k in ("criticize", "blame", "condemn", "attack")):
            return f"Opponents continued to {w} the proposal in public."
        if any(k in gloss for k in ("give up", "abandon", "renounce", "reject")):
            return f"Under pressure, the board decided to {w} the plan."
        if any(k in gloss for k in ("shame", "humiliate", "embarrass")):
            return f"He did not mean to {w} his colleague in the meeting."
        return f"In the end, they chose to {w} what they had once defended."
    if pos in ("a", "s"):
        if any(k in gloss for k in ("negative", "harmful", "offensive", "bad", "hostile")):
            return f"Her {w} remarks unsettled everyone in the room."
        if any(k in gloss for k in ("positive", "good", "kind", "helpful", "clear")):
            return f"His {w} explanation made the complex idea easier to follow."
        return f"The critic noted her {w} approach to the evidence."
    if pos == "r":
        return f"She spoke {w} about the risks of the policy."
    # noun
    if any(k in gloss for k in ("person", "someone", "one who")):
        return f"No one wanted to be labeled a {w} in that debate."
    return f"A clear sense of {w} is crucial to understanding the argument."


def make_speakable(lemma: str, zh: str, endef: str, usage: str) -> tuple[str, str]:
    """Return (english_sentence, display_line with ZH cue)."""
    pos = detect_pos(zh, lemma)
    meaning = strip_pos(zh)

    en = wordnet_example(lemma)
    if not en:
        phrase = extract_english_phrase(usage, lemma)
        if phrase:
            en = phrase_to_sentence(phrase, lemma, pos)
    if not en:
        en = fallback_sentence(lemma, pos, endef)

    en = ensure_period(capitalize_sent(en))
    # Guarantee lemma appears; if not, force fallback
    if not lemma_in_text(en, lemma):
        en = fallback_sentence(lemma, pos, endef)
        en = ensure_period(capitalize_sent(en))

    display = f"{en} （{meaning}）"
    return en, to_trad(display)


def parse_entries(text: str) -> tuple[list[dict], list[str], str]:
    lines = text.splitlines()
    preamble: list[str] = []
    appendix = ""
    entries: list[dict] = []
    mode = "pre"
    letter = ""
    pending: dict | None = None

    def flush():
        nonlocal pending
        if pending:
            entries.append(pending)
            pending = None

    for i, line in enumerate(lines):
        if mode == "pre":
            if LETTER_RE.match(line) or WORD_RE.match(line):
                mode = "body"
            else:
                preamble.append(line)
                continue

        if mode != "appendix" and (line.startswith("## 附錄") or line.startswith("## 附註")):
            flush()
            mode = "appendix"
            appendix = "\n".join(lines[i:])
            break

        lm = LETTER_RE.match(line)
        if lm:
            flush()
            letter = lm.group(1)
            continue
        wm = WORD_RE.match(line)
        if wm:
            flush()
            pending = {
                "letter": letter or wm.group(1)[0].upper(),
                "en": wm.group(1).strip(),
                "fields": {},
                "order": [],
            }
            continue
        if pending is None:
            continue
        fm = FIELD_RE.match(line)
        if fm:
            label, val = fm.group(1), fm.group(2)
            if label not in pending["fields"]:
                pending["order"].append(label)
            pending["fields"][label] = val

    flush()
    return entries, preamble, appendix


def render(entries: list[dict], preamble: list[str], appendix: str) -> str:
    # Update header blurb lightly
    pre = "\n".join(preamble)
    pre = re.sub(
        r"> 詞條數：.*",
        f"> 詞條數：**{len(entries)}**（每詞含可語音播放英文例句）  ",
        pre,
        count=1,
    )
    if "可語音播放" not in pre:
        # insert after first quote block line about 補完
        lines = pre.splitlines()
        inserted = False
        out_pre = []
        for ln in lines:
            out_pre.append(ln)
            if (not inserted) and ln.startswith(">") and "補完" in ln:
                out_pre.append("> 每詞另附 **例句** 欄（純英文，可供 TTS 朗讀）  ")
                inserted = True
        pre = "\n".join(out_pre)

    body: list[str] = []
    cur = ""
    for e in entries:
        sec = e["letter"]
        if sec != cur:
            cur = sec
            body.append(f"## {cur}")
            body.append("")
        body.append(f"### {e['en']}")
        fields = e["fields"]
        # Preferred order
        order = [
            "中文",
            "英文釋義",
            "例句",
            "用法／例句／詞組",
            "相似詞／近義",
            "相反詞",
            "派生詞",
            "形近詞組",
            "來源",
        ]
        seen = set()
        for label in order:
            if label in fields:
                body.append(f"- **{label}**：{fields[label]}")
                seen.add(label)
        for label in e["order"]:
            if label not in seen and label in fields:
                body.append(f"- **{label}**：{fields[label]}")
        body.append("")

    text = pre.rstrip() + "\n\n" + "\n".join(body).rstrip() + "\n\n"
    if appendix:
        text += appendix.rstrip() + "\n"
    return to_trad(text)


def main() -> None:
    try:
        import nltk
        from nltk.corpus import wordnet as wn

        try:
            wn.synsets("test")
        except LookupError:
            nltk.download("wordnet", quiet=True)
            nltk.download("omw-1.4", quiet=True)
    except Exception as exc:
        raise SystemExit(f"WordNet required: {exc}") from exc

    text = SRC.read_text(encoding="utf-8")
    entries, preamble, appendix = parse_entries(text)
    print(f"Parsed {len(entries)} entries")

    ok = 0
    for e in entries:
        f = e["fields"]
        zh = f.get("中文", "")
        endef = f.get("英文釋義", "")
        usage = f.get("用法／例句／詞組", "")
        # Always (re)build a clean speakable sentence for TTS
        en, display = make_speakable(e["en"], zh, endef, usage)
        f["例句"] = display
        if "例句" not in e["order"]:
            e["order"].insert(2, "例句")
        ok += 1
        _ = en  # en validated inside make_speakable

    OUT.write_text(render(entries, preamble, appendix), encoding="utf-8")
    print(f"Wrote {OUT} with speakable examples for {ok}/{len(entries)}")


if __name__ == "__main__":
    main()
