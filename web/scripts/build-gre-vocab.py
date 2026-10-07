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


def english_only(text: str) -> str:
    en = re.split(r"[\u4e00-\u9fff]", text or "", maxsplit=1)[0]
    return en.strip().strip(" （()）")


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
        # Fallback: derive TTS sentence from usage if 例句 missing
        if not pending.get("exampleEn"):
            usage = pending.get("exampleUsage") or ""
            if usage and not usage.startswith("核心義"):
                en = english_only(usage.split("｜")[0])
                if len(en.split()) >= 3:
                    pending["exampleEn"] = en
                    if not pending.get("example"):
                        pending["example"] = usage
        word = {
            "id": pending["id"],
            "en": pending["en"],
            "zh": pending["zh"],
            "endef": pending["endef"],
            "exampleEn": pending.get("exampleEn", ""),
            "example": pending.get("example", ""),
            "exampleUsage": pending.get("exampleUsage", ""),
            "synonyms": pending["synonyms"],
            "antonyms": pending["antonyms"],
            "derivatives": pending["derivatives"],
            "lookalikes": pending["lookalikes"],
            "sources": pending["sources"],
            "detailed": bool(
                pending["endef"]
                or pending.get("exampleEn")
                or pending.get("exampleUsage")
                or pending["synonyms"]
            ),
        }
        letters.setdefault(current_letter, []).append(word)
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
                "exampleEn": "",
                "example": "",
                "exampleUsage": "",
                "synonyms": "",
                "antonyms": "",
                "derivatives": "",
                "lookalikes": "",
                "sources": "",
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
        elif label == "例句":
            pending["example"] = value
            pending["exampleEn"] = english_only(value)
        elif label.startswith("用法"):
            pending["exampleUsage"] = value
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

    flush()

    out_letters = []
    total = 0
    detailed = 0
    with_ant = 0
    with_speak = 0
    for letter in sorted(letters.keys(), key=lambda x: (x == "#", x)):
        words = letters[letter]
        total += len(words)
        detailed += sum(1 for w in words if w["detailed"])
        with_ant += sum(1 for w in words if w["antonyms"])
        with_speak += sum(1 for w in words if w["exampleEn"])
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
        "withSpeakableExamples": with_speak,
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
        f"speakable={data['withSpeakableExamples']}, antonyms={data['withAntonyms']})"
    )


if __name__ == "__main__":
    main()
