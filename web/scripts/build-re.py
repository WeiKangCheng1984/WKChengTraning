# -*- coding: utf-8 -*-
"""Build real-estate.json from real estate glossary.md."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "real estate glossary.md"
OUT = ROOT / "web" / "src" / "data" / "real-estate.json"


def slugify(text: str) -> str:
    s = text.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")[:48] or "term"


def main() -> None:
    text = SRC.read_text(encoding="utf-8")
    sections: list[dict] = []
    phrases: list[dict] = []

    for m in re.finditer(
        r"^## (\d+)\.\s+(.+?)\s*$",
        text,
        re.M,
    ):
        num = int(m.group(1))
        title = m.group(2).strip()
        if num == 0 or num >= 8:
            continue
        start = m.end()
        nxt = re.search(r"^## \d+\.", text[start:], re.M)
        block = text[start : start + nxt.start()] if nxt else text[start:]

        terms = []
        for line in block.splitlines():
            line = line.strip()
            if not line.startswith("|"):
                continue
            cells = [c.strip() for c in line.strip("|").split("|")]
            if len(cells) < 2:
                continue
            if cells[0] in ("EN", "") or re.match(r"^-+$", cells[0].replace(" ", "")):
                continue
            en, zh = cells[0], cells[1]
            note = cells[2] if len(cells) > 2 else ""
            terms.append(
                {
                    "id": f"re-{num:02d}-{slugify(en.split('/')[0])}",
                    "en": en,
                    "zh": zh,
                    "note": note,
                }
            )
        if terms:
            sections.append(
                {
                    "id": num,
                    "slug": f"re-{num:02d}-{slugify(title)}",
                    "titleZh": title,
                    "terms": terms,
                }
            )

    # phrases from section 8
    ph = re.search(r"## 8\.\s+高頻句子.*?\n+(.*?)(?=\n## |\Z)", text, re.S)
    if ph:
        for pm in re.finditer(
            r"\d+\.\s+\*\*(.+?)\*\*\s*\n\s*(.+)",
            ph.group(1),
        ):
            phrases.append(
                {
                    "id": f"re-phrase-{len(phrases) + 1}",
                    "en": pm.group(1).strip(),
                    "zh": pm.group(2).strip(),
                }
            )

    total = sum(len(s["terms"]) for s in sections)
    data = {
        "source": "real estate glossary.md",
        "total": total,
        "audio": "tts",
        "sections": sections,
        "phrases": phrases,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT} ({total} terms, {len(phrases)} phrases, {len(sections)} sections)")


if __name__ == "__main__":
    main()
