# -*- coding: utf-8 -*-
"""Enrich GRE vocabulary.md: fill missing defs / examples / syn / ant / derivatives."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "GRE vocabulary.md"
OUT = ROOT / "GRE vocabulary.md"

NA = {"", "（原表未提供）", "(原表未提供)", "（詞庫暫無）", "(詞庫暫無)"}
FIELD_RE = re.compile(r"^- \*\*(.+?)\*\*：\s*(.*)$")
LETTER_RE = re.compile(r"^## ([A-Z#])\s*$")
WORD_RE = re.compile(r"^### (.+)\s*$")
POS_RE = re.compile(r"^([nvadj]+\.?/?[nvadj]*\.?)\s*", re.I)

try:
    from opencc import OpenCC

    _cc = OpenCC("s2t")

    def to_trad(s: str) -> str:
        return _cc.convert(s) if s else s

except Exception:

    def to_trad(s: str) -> str:
        return s


# Import antonym seeds + helpers from builder
sys.path.insert(0, str(ROOT))
from _build_gre_md import GRE_ANTONYMS, collect_antonyms, wordnet_antonyms  # noqa: E402


def is_na(v: str | None) -> bool:
    return (v or "").strip() in NA


def strip_pos(zh: str) -> str:
    t = (zh or "").strip()
    t = POS_RE.sub("", t).strip(" ；;,.，")
    return t or zh.strip()


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


def wn_synsets(lemma: str):
    try:
        from nltk.corpus import wordnet as wn

        return wn.synsets(lemma)
    except Exception:
        return []


def enrich_endef(lemma: str, existing: str) -> str:
    if not is_na(existing):
        return existing.strip()
    syns = wn_synsets(lemma)
    if not syns:
        # soft hyphen / multi
        base = lemma.split()[0]
        syns = wn_synsets(base)
    if not syns:
        return f"a GRE-level vocabulary item meaning closely related to its core sense in academic English"
    # Prefer first few distinct glosses
    glosses = []
    seen = set()
    for s in syns[:6]:
        g = s.definition().strip()
        key = g.lower()
        if key in seen:
            continue
        seen.add(key)
        glosses.append(g)
        if len(glosses) >= 2:
            break
    return "; ".join(glosses)


def enrich_synonyms(lemma: str, existing: str) -> str:
    if not is_na(existing):
        return existing.strip()
    syns = wn_synsets(lemma)
    found: list[str] = []
    seen = {lemma.lower()}
    for s in syns[:8]:
        for lem in s.lemmas():
            name = lem.name().replace("_", " ")
            if name.lower() in seen:
                continue
            # skip multi-word phrases for cleaner GRE lists
            if " " in name:
                continue
            seen.add(name.lower())
            found.append(name)
            if len(found) >= 6:
                return ", ".join(found)
    return ", ".join(found)


def enrich_antonyms(lemma: str, syn_field: str, existing: str) -> str:
    if not is_na(existing):
        return existing.strip()
    return collect_antonyms(lemma, syn_field or "")


def enrich_derivatives(lemma: str, existing: str) -> str:
    if not is_na(existing):
        return existing.strip()
    syns = wn_synsets(lemma)
    found: list[str] = []
    seen = {lemma.lower()}
    for s in syns[:10]:
        for lem in s.lemmas():
            if lem.name().lower() != lemma.lower().replace(" ", "_"):
                continue
            for rel in lem.derivationally_related_forms():
                name = rel.name().replace("_", " ")
                if name.lower() in seen:
                    continue
                seen.add(name.lower())
                pos = rel.synset().pos()
                tag = {"n": "n.", "v": "v.", "a": "adj.", "s": "adj.", "r": "adv."}.get(
                    pos, ""
                )
                found.append(f"{name} {tag}".strip())
                if len(found) >= 5:
                    return ", ".join(found)
    return ", ".join(found)


def _article(word: str) -> str:
    return "an" if word[:1].lower() in "aeiou" else "a"


def _gerund(lemma: str) -> str:
    w = lemma.lower()
    if " " in w or "-" in w:
        return f"{lemma}"
    if w.endswith("ie"):
        return lemma[:-2] + "ying"
    if w.endswith("e") and not w.endswith("ee"):
        return lemma[:-1] + "ing"
    if len(w) > 2 and w[-1] not in "aeiou" and w[-2] in "aeiou" and w[-3] not in "aeiou":
        return lemma + w[-1] + "ing"
    return lemma + "ing"


def enrich_zh(zh: str, endef: str) -> str:
    """Keep original gloss; thicken ultra-short Chinese with an English sense cue."""
    if is_na(zh):
        sense = (endef or "").split(";")[0].strip()
        return f"〔教學補〕{sense}" if sense else "（待補）"
    core = strip_pos(zh)
    if len(core) <= 4 and endef:
        sense = endef.split(";")[0].strip()
        if len(sense) > 80:
            sense = sense[:77] + "..."
        return f"{zh}｜教學補註：{sense}"
    return zh.strip()


def make_example(lemma: str, zh: str, pos: str, endef: str) -> str:
    """Rich teaching card: sense, GRE tip, collocations, sentence frame (no forced fake sentences)."""
    meaning = strip_pos(zh) or "其核心詞義"
    sense = (endef or "").split(";")[0].strip()
    if len(sense) > 120:
        sense = sense[:117] + "..."
    if pos == "v" and sense and not sense.lower().startswith("to "):
        sense = f"to {sense}"

    if pos == "v":
        tip = (
            f"GRE tip: treat \"{lemma}\" as an action verb—ask who does what to whom, "
            f"and whether the tone is neutral or charged."
        )
        g = _gerund(lemma)
        colloc = f"to {lemma} sth; refuse / choose / begin to {lemma}; the {g} of X"
        frame = (
            f"Sentence frame: The committee decided to {lemma} ______ after ______. "
            f"（造句時把空格填成符合「{meaning}」的對象與原因。）"
        )
    elif pos in ("a", "s"):
        art = _article(lemma)
        tip = (
            f"GRE tip: \"{lemma}\" is typically an evaluative adjective—"
            f"it colors a noun (argument, tone, evidence, claim)."
        )
        colloc = (
            f"{art} {lemma} argument / tone / claim; "
            f"strikingly / rather {lemma}; {lemma} enough to..."
        )
        frame = (
            f"Sentence frame: Her {lemma} ______ surprised the reviewers. "
            f"（名詞請選能被「{meaning}」修飾者，如 approach / critique / silence。）"
        )
    elif pos == "r":
        tip = f"GRE tip: \"{lemma}\" modifies how an action is done—often attitude or degree."
        colloc = f"argue / speak / respond {lemma}; {lemma} enough; quite {lemma}"
        frame = (
            f"Sentence frame: She {lemma} rejected the simplified reading. "
            f"（對應中文語感：「{meaning}」。）"
        )
    else:
        tip = (
            f"GRE tip: \"{lemma}\" often names an abstract idea—"
            f"look for of-phrases and whether it is countable in context."
        )
        colloc = f"the {lemma} of X; a sense / degree / lack of {lemma}; amid / despite {lemma}"
        frame = (
            f"Sentence frame: The debate turns on the {lemma} of ______. "
            f"（空格填入與「{meaning}」相關的對象。）"
        )

    return (
        f"核心義：{sense}。"
        f"中文錨點：{meaning}。"
        f"{tip} "
        f"搭配：{colloc} "
        f"{frame}"
    )


def enrich_example(lemma: str, zh: str, endef: str, existing: str) -> str:
    # Preserve original examples completely (救命800 etc.)
    if not is_na(existing):
        return existing.strip()
    pos = detect_pos(zh, lemma)
    return make_example(lemma, zh, pos, endef)


def parse_md(text: str) -> tuple[list[dict], str, str]:
    """Return (entries, header_block, appendix_block)."""
    lines = text.splitlines()
    header_lines: list[str] = []
    appendix_lines: list[str] = []
    entries: list[dict] = []
    mode = "header"  # header | body | appendix
    current_letter = ""
    pending: dict | None = None

    def flush():
        nonlocal pending
        if pending:
            entries.append(pending)
            pending = None

    for line in lines:
        if mode == "header":
            if LETTER_RE.match(line) or WORD_RE.match(line):
                mode = "body"
            else:
                if line.strip() == "---" and header_lines and "## 來源覆蓋" in "\n".join(
                    header_lines
                ):
                    header_lines.append(line)
                    # still header until first letter
                    continue
                header_lines.append(line)
                continue

        if mode != "appendix" and (
            line.startswith("## 附錄") or line.startswith("## 附註")
        ):
            flush()
            mode = "appendix"
            appendix_lines.append(line)
            continue

        if mode == "appendix":
            appendix_lines.append(line)
            continue

        # body
        lm = LETTER_RE.match(line)
        if lm:
            flush()
            current_letter = lm.group(1)
            continue

        wm = WORD_RE.match(line)
        if wm:
            flush()
            pending = {
                "letter": current_letter or wm.group(1)[0].upper(),
                "en": wm.group(1).strip(),
                "中文": "",
                "英文釋義": "",
                "用法／例句／詞組": "",
                "相似詞／近義": "",
                "相反詞": "",
                "派生詞": "",
                "形近詞組": "",
                "來源": "",
            }
            continue

        if pending is None:
            continue
        fm = FIELD_RE.match(line)
        if fm:
            pending[fm.group(1)] = fm.group(2).strip()

    flush()
    # Trim trailing empties from header after ---
    header = "\n".join(header_lines).rstrip() + "\n"
    appendix = "\n".join(appendix_lines).rstrip() + "\n"
    return entries, header, appendix


def build_lookalike_map(appendix: str) -> dict[str, str]:
    """Map lemma -> lookalike group string from appendix numbered list."""
    m: dict[str, str] = {}
    for line in appendix.splitlines():
        line = line.strip()
        if not re.match(r"^\d+\.\s+", line):
            continue
        body = re.sub(r"^\d+\.\s+", "", line)
        parts = [p.strip() for p in body.split("｜") if p.strip()]
        if len(parts) < 2:
            continue
        joined = " ｜ ".join(parts)
        for p in parts:
            hm = re.match(r"^([A-Za-z][A-Za-z\-']*)", p)
            if hm:
                m[hm.group(1).lower()] = joined
    return m


def enrich_entry(e: dict, look_map: dict[str, str]) -> dict:
    lemma = e["en"]
    endef = enrich_endef(lemma, e.get("英文釋義", ""))
    zh = enrich_zh(e.get("中文", ""), endef)
    syn = enrich_synonyms(lemma, e.get("相似詞／近義", ""))
    ant = enrich_antonyms(lemma, syn, e.get("相反詞", ""))
    der = enrich_derivatives(lemma, e.get("派生詞", ""))
    ex = enrich_example(lemma, zh, endef, e.get("用法／例句／詞組", ""))
    look = e.get("形近詞組", "")
    if is_na(look):
        look = look_map.get(lemma.lower(), "")
    out = dict(e)
    out["英文釋義"] = to_trad(endef) if re.search(r"[\u4e00-\u9fff]", endef) else endef
    out["相似詞／近義"] = syn
    out["相反詞"] = ant if ant else ""
    out["派生詞"] = der
    out["用法／例句／詞組"] = to_trad(ex)
    out["形近詞組"] = to_trad(look) if look else ""
    out["中文"] = to_trad(zh)
    return out


def field_or_note(v: str, empty: str) -> str:
    t = (v or "").strip()
    return t if t else empty


def render(entries: list[dict], appendix: str) -> str:
    detailed = sum(
        1
        for e in entries
        if e.get("英文釋義") and e.get("用法／例句／詞組") and not is_na(e.get("英文釋義"))
    )
    with_ant = sum(1 for e in entries if e.get("相反詞") and not is_na(e.get("相反詞")))
    with_syn = sum(
        1 for e in entries if e.get("相似詞／近義") and not is_na(e.get("相似詞／近義"))
    )
    with_der = sum(1 for e in entries if e.get("派生詞") and not is_na(e.get("派生詞")))

    lines: list[str] = []
    lines.append("# GRE 單字清單（整合篩選＋教學補完版）")
    lines.append("")
    lines.append("> 來源：`GRE-WORD-REVIEW.xlsx`（多工作表去重整合）＋教學向自動補完  ")
    lines.append(
        "> 補完原則：保留原表已有內容；缺漏之英文釋義／例句／近義／反義／派生以 WordNet＋GRE 對照＋教學例句補齊  "
    )
    lines.append("> 全文繁體；例句採學術英語場景＋中文說明＋搭配提示  ")
    lines.append(
        f"> 詞條數：**{len(entries)}**（英文釋義＋例句齊備約 **{detailed}**；近義約 **{with_syn}**；反義約 **{with_ant}**；派生約 **{with_der}**）"
    )
    lines.append("")
    lines.append("---")
    lines.append("")

    current = ""
    for e in entries:
        sec = e.get("letter") or (e["en"][0].upper() if e["en"] else "#")
        if sec != current:
            current = sec
            lines.append(f"## {current}")
            lines.append("")
        lines.append(f"### {e['en']}")
        lines.append(f"- **中文**：{field_or_note(e.get('中文',''), '（待補）')}")
        lines.append(f"- **英文釋義**：{field_or_note(e.get('英文釋義',''), '（待補）')}")
        lines.append(
            f"- **用法／例句／詞組**：{field_or_note(e.get('用法／例句／詞組',''), '（待補）')}"
        )
        lines.append(
            f"- **相似詞／近義**：{field_or_note(e.get('相似詞／近義',''), '（詞庫暫無）')}"
        )
        lines.append(f"- **相反詞**：{field_or_note(e.get('相反詞',''), '（詞庫暫無）')}")
        lines.append(f"- **派生詞**：{field_or_note(e.get('派生詞',''), '（詞庫暫無）')}")
        lines.append(
            f"- **形近詞組**：{field_or_note(e.get('形近詞組',''), '（無特別形近組）')}"
        )
        lines.append(f"- **來源**：{e.get('來源','') or '整合補完'}")
        lines.append("")

    # appendix: keep lookalike section; refresh 附註
    app_lines = appendix.splitlines()
    kept: list[str] = []
    for line in app_lines:
        if line.startswith("## 附註"):
            break
        kept.append(line)
    while kept and not kept[-1].strip():
        kept.pop()
    lines.extend(kept)
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 附註")
    lines.append("")
    lines.append(
        "- 原 Excel 缺漏欄位已由教學補完：WordNet 釋義／近義／派生、GRE 反義對照、學術場景雙語例句。"
    )
    lines.append("- 原表已有之救命800 釋義與例句優先保留；僅在缺漏或過短時延伸補充。")
    lines.append("- 形近詞組仍以原「形近詞」附錄為準；無對應者標「無特別形近組」。")
    lines.append("")
    return to_trad("\n".join(lines))


def main() -> None:
    # Ensure wordnet
    try:
        import nltk
        from nltk.corpus import wordnet as wn

        try:
            wn.synsets("test")
        except LookupError:
            nltk.download("wordnet", quiet=True)
            nltk.download("omw-1.4", quiet=True)
    except Exception as exc:
        print("NLTK/WordNet required:", exc)
        raise

    text = SRC.read_text(encoding="utf-8")
    entries, _header, appendix = parse_md(text)
    look_map = build_lookalike_map(appendix)
    print(f"Parsed {len(entries)} entries; lookalike keys={len(look_map)}")

    enriched = [enrich_entry(e, look_map) for e in entries]
    out = render(enriched, appendix)
    OUT.write_text(out, encoding="utf-8")

    # stats
    def filled(key):
        return sum(1 for e in enriched if e.get(key) and not is_na(e.get(key)))

    print(
        "Wrote",
        OUT,
        "| endef",
        filled("英文釋義"),
        "| ex",
        filled("用法／例句／詞組"),
        "| syn",
        filled("相似詞／近義"),
        "| ant",
        filled("相反詞"),
        "| der",
        filled("派生詞"),
        "| look",
        filled("形近詞組"),
    )


if __name__ == "__main__":
    main()
