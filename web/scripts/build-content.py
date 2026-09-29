# -*- coding: utf-8 -*-
"""Parse Vnotes.md and english V.md into web/src/data/*.json"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "web" / "src" / "data"
OUT.mkdir(parents=True, exist_ok=True)


def parse_cfa(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    subjects: list[dict] = []
    current = None
    pending = None

    subject_re = re.compile(r"^## (\d+)\. (.+)（(.+)）\s*$")
    term_re = re.compile(r"^### (\d+)\. (.+)｜(.+)\s*$")

    for line in text.splitlines():
        sm = subject_re.match(line)
        if sm:
            if pending and current:
                current["terms"].append(pending)
                pending = None
            current = {
                "code": sm.group(1),
                "nameZh": sm.group(2),
                "nameEn": sm.group(3),
                "terms": [],
            }
            subjects.append(current)
            continue

        if current is None:
            continue

        tm = term_re.match(line)
        if tm:
            if pending:
                current["terms"].append(pending)
            pending = {
                "id": int(tm.group(1)),
                "termEn": tm.group(2).strip(),
                "termZh": tm.group(3).strip(),
                "definition": "",
                "usage": "",
                "example": "",
            }
            continue

        if pending is None:
            continue

        if line.startswith("- **定義**："):
            pending["definition"] = line.split("：", 1)[1].strip()
        elif line.startswith("- **用法**："):
            pending["usage"] = line.split("：", 1)[1].strip()
        elif line.startswith("- **英語會話例句**："):
            ex = line.split("：", 1)[1].strip()
            if len(ex) >= 2 and ex[0] == '"' and ex[-1] == '"':
                ex = ex[1:-1]
            pending["example"] = ex
            current["terms"].append(pending)
            pending = None

    if pending and current:
        current["terms"].append(pending)

    total = sum(len(s["terms"]) for s in subjects)
    return {"source": "Vnotes.md", "total": total, "subjects": subjects}


def slugify(text: str) -> str:
    m = re.search(r"\(([^)]+)\)", text)
    base = m.group(1) if m else text
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", base).strip("-").lower()
    return slug or "section"


def parse_english(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    categories: list[dict] = []
    current = None
    pending = None
    item_counter = 0

    cat_re = re.compile(r"^(類別[一二三四五六七八九十]+|階段[一二三四])：(.+)$")
    # Pattern style: 1. I'm planning to...（我計劃要...）
    pattern_re = re.compile(
        r"^(\d+)\.\s+(.+?)（([^）]+)）(?:\s*※\s*(.+))?\s*$"
    )
    # Phrasal: 54. Tap into
    phrasal_re = re.compile(r"^(\d+)\.\s+([A-Za-z][^*\d].*?)\s*$")
    example_re = re.compile(
        r"^例句\s*\d+\s*[（(]([^）)]+)[）)]\s*：\s*(.+?)\s*[（(](.+)[）)]\s*$"
    )
    example_loose = re.compile(
        r"^例句\s*\d+\s*[（(]([^）)]+)[）)]\s*：\s*(.+)\s*$"
    )
    work_ex = re.compile(
        r"^工作範例(?:\s*\d+|\s*[（(][^）)]+[）)])?\s*：\s*(.+?)\s*[（(](.+)[）)]\s*$"
    )
    life_ex = re.compile(
        r"^生活範例(?:\s*\d+|\s*[（(][^）)]+[）)])?\s*：\s*(.+?)\s*[（(](.+)[）)]\s*$"
    )
    work_loose = re.compile(r"^工作範例(?:\s*\d+|\s*[（(][^）)]+[）)])?\s*：\s*(.+)\s*$")
    life_loose = re.compile(r"^生活範例(?:\s*\d+|\s*[（(][^）)]+[）)])?\s*：\s*(.+)\s*$")

    def flush_pending():
        nonlocal pending
        if pending and current:
            current["items"].append(pending)
            pending = None

    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        cm = cat_re.match(line)
        if cm:
            flush_pending()
            title = f"{cm.group(1)}：{cm.group(2)}"
            current = {
                "id": cm.group(1),
                "slug": slugify(cm.group(2)) + "-" + str(len(categories) + 1),
                "title": title,
                "titleEn": (re.search(r"\(([^)]+)\)", cm.group(2)) or [None, cm.group(2)])[1],
                "description": "",
                "items": [],
            }
            categories.append(current)
            # peek description lines until next numbered item
            j = i + 1
            desc_parts = []
            while j < len(lines):
                peek = lines[j].strip()
                if not peek:
                    j += 1
                    continue
                if cat_re.match(peek) or pattern_re.match(peek) or (
                    phrasal_re.match(peek) and not peek.startswith("例句")
                ):
                    # numbered item starting
                    if re.match(r"^\d+\.\s+", peek):
                        break
                    if cat_re.match(peek):
                        break
                if re.match(r"^\d+\.\s+", peek):
                    break
                # skip meta intro that looks like stage headers inside
                if peek.startswith("現在進入") or peek.startswith("這些句型"):
                    desc_parts.append(peek)
                    j += 1
                    continue
                if not re.match(r"^\d+\.\s+", peek) and not peek.startswith("對應") and not peek.startswith("道地") and not peek.startswith("工作") and not peek.startswith("生活") and not peek.startswith("例句"):
                    desc_parts.append(peek)
                    j += 1
                    continue
                break
            current["description"] = " ".join(desc_parts[:3])
            i = j if j > i + 1 else i + 1
            continue

        if current is None:
            i += 1
            continue

        pm = pattern_re.match(line)
        if pm:
            flush_pending()
            item_counter += 1
            note = ""
            # check inline note on same conceptual block - next line may be ※
            pending = {
                "id": f"en-{pm.group(1)}",
                "num": int(pm.group(1)),
                "kind": "pattern",
                "en": pm.group(2).strip(),
                "zh": pm.group(3).strip(),
                "note": (pm.group(4) or note or "").strip(),
                "examples": [],
            }
            i += 1
            if i < len(lines) and lines[i].strip().startswith("※"):
                extra = lines[i].strip().lstrip("※").strip()
                pending["note"] = f"{pending['note']} {extra}".strip()
                i += 1
            continue

        # Phrasal verb headers: number + English without fullwidth parens translation on same line
        ph = phrasal_re.match(line)
        if ph and "（" not in line and not line.startswith("例句"):
            # avoid matching random lines
            if re.match(r"^\d+\.\s+[A-Za-z]", line):
                flush_pending()
                item_counter += 1
                pending = {
                    "id": f"en-{ph.group(1)}",
                    "num": int(ph.group(1)),
                    "kind": "phrasal",
                    "en": ph.group(2).strip(),
                    "zh": "",
                    "note": "",
                    "formal": "",
                    "examples": [],
                }
                i += 1
                continue

        if pending is None:
            i += 1
            continue

        if line.startswith("※"):
            pending["note"] = (pending.get("note") or "") + " " + line.lstrip("※").strip()
            pending["note"] = pending["note"].strip()
            i += 1
            continue

        if line.startswith("對應書面大字："):
            pending["formal"] = line.split("：", 1)[1].strip()
            i += 1
            continue

        if line.startswith("道地中文解釋："):
            pending["zh"] = line.split("：", 1)[1].strip()
            i += 1
            continue

        em = example_re.match(line) or example_loose.match(line)
        if em:
            en_part = em.group(2).strip()
            zh_part = em.group(3).strip() if em.lastindex and em.lastindex >= 3 else ""
            if not zh_part:
                # try split last paren
                m2 = re.match(r"^(.+?)\s*\((.+)\)\s*$", en_part)
                if m2:
                    en_part, zh_part = m2.group(1).strip(), m2.group(2).strip()
            pending["examples"].append(
                {"tag": em.group(1).strip(), "en": en_part, "zh": zh_part}
            )
            i += 1
            continue

        for rx, tag in (
            (work_ex, "工作"),
            (life_ex, "生活"),
            (work_loose, "工作"),
            (life_loose, "生活"),
        ):
            xm = rx.match(line)
            if xm:
                if xm.lastindex >= 2:
                    en_part, zh_part = xm.group(1).strip(), xm.group(2).strip()
                else:
                    en_part = xm.group(1).strip()
                    zh_part = ""
                    m2 = re.match(r"^(.+?)\s*\((.+)\)\s*$", en_part)
                    if m2:
                        en_part, zh_part = m2.group(1).strip(), m2.group(2).strip()
                pending["examples"].append({"tag": tag, "en": en_part, "zh": zh_part})
                break
        else:
            # unmatched continuation - ignore
            pass

        i += 1

    flush_pending()
    total = sum(len(c["items"]) for c in categories)
    return {"source": "english V.md", "total": total, "categories": categories}


def main() -> None:
    cfa_path = ROOT / "Vnotes.md"
    en_path = ROOT / "english V.md"
    # fallback to backup if short
    if cfa_path.stat().st_size < 50000:
        alt = ROOT / "glossary_build" / "_vnotes_out.md"
        if alt.exists():
            cfa_path = alt

    cfa = parse_cfa(cfa_path)
    eng = parse_english(en_path)

    (OUT / "cfa.json").write_text(
        json.dumps(cfa, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (OUT / "english.json").write_text(
        json.dumps(eng, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"CFA terms: {cfa['total']} subjects: {len(cfa['subjects'])}")
    print(f"English items: {eng['total']} categories: {len(eng['categories'])}")
    for c in eng["categories"]:
        print(f"  - {c['slug']}: {len(c['items'])} ({c['title'][:40]})")


if __name__ == "__main__":
    main()
