# -*- coding: utf-8 -*-
"""Parse GRE vocabulary.md into web/src/data/gre-vocabulary.json"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "GRE vocabulary.md"
OUT = ROOT / "web" / "src" / "data" / "gre-vocabulary.json"

FIELD_RE = re.compile(r"^- \*\*(.+?)\*\*：\s*(.*)$")
LETTER_RE = re.compile(r"^## ([A-Z#])\s*$")
WORD_RE = re.compile(r"^### (.+)\s*$")
NA_MARKERS = {
    "（原表未提供）",
    "(原表未提供)",
    "（詞庫暫無）",
    "(詞庫暫無)",
    "（無特別形近組）",
    "(無特別形近組)",
    "（待補）",
    "(待補)",
}


def slugify(text: str) -> str:
    s = text.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")[:56] or "term"


def clean_field(v: str) -> str:
    t = (v or "").strip()
    if t in NA_MARKERS:
        return ""
    return t


def parse() -> dict:
    lines = SRC.read_text(encoding="utf-8").splitlines()
    letters: dict[str, list[dict]] = {}
    current_letter: str | None = None
    pending: dict | None = None
    in_appendix = False

    def flush():
        nonlocal pending
        if not pending or not current_letter:
            pending = None
            return
        letters.setdefault(current_letter, []).append(pending)
        pending = None

    for raw in lines:
        line = raw.rstrip()
        if line.startswith("## 附錄") or line.startswith("## 附註"):
            flush()
            in_appendix = True
            continue
        if in_appendix:
            continue

        lm = LETTER_RE.match(line)
        if lm:
            flush()
            current_letter = lm.group(1)
            continue

        wm = WORD_RE.match(line)
        if wm:
            flush()
            en = wm.group(1).strip()
            pending = {
                "id": f"gre-{slugify(en)}",
                "en": en,
                "zh": "",
                "endef": "",
                "example": "",
                "synonyms": "",
                "antonyms": "",
                "derivatives": "",
                "lookalikes": "",
                "sources": "",
                "detailed": False,
            }
            continue

        if pending is None:
            continue

        fm = FIELD_RE.match(line)
        if not fm:
            continue
        label, value = fm.group(1), clean_field(fm.group(2))
        if label == "中文":
            pending["zh"] = value
        elif label == "英文釋義":
            pending["endef"] = value
        elif label.startswith("用法"):
            pending["example"] = value
        elif label.startswith("相似詞"):
            pending["synonyms"] = value
        elif label == "相反詞":
            pending["antonyms"] = value
        elif label == "派生詞":
            pending["derivatives"] = value
        elif label == "形近詞組":
            pending["lookalikes"] = value
        elif label == "來源":
            pending["sources"] = value

        pending["detailed"] = bool(
            pending["endef"] or pending["example"] or pending["synonyms"]
        )

    flush()

    out_letters = []
    total = 0
    detailed = 0
    with_ant = 0
    for letter in sorted(letters.keys(), key=lambda x: (x == "#", x)):
        words = letters[letter]
        total += len(words)
        detailed += sum(1 for w in words if w["detailed"])
        with_ant += sum(1 for w in words if w["antonyms"])
        out_letters.append(
            {
                "letter": letter,
                "slug": letter.lower() if letter != "#" else "other",
                "wordCount": len(words),
                "words": words,
            }
        )

    return {
        "source": "GRE vocabulary.md",
        "total": total,
        "detailed": detailed,
        "withAntonyms": with_ant,
        "audio": "tts",
        "level": "GRE",
        "letters": out_letters,
    }


def main() -> None:
    data = parse()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        f"Wrote {OUT} ({data['total']} words, {len(data['letters'])} letters, "
        f"detailed={data['detailed']}, antonyms={data['withAntonyms']})"
    )


if __name__ == "__main__":
    main()
