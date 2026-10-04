# -*- coding: utf-8 -*-
"""Build grammar.json from english grammar.md."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "english grammar.md"
OUT = ROOT / "web" / "src" / "data" / "grammar.json"


def slugify(text: str) -> str:
    s = text.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")[:60] or "lesson"


def parse_table(block: str) -> list[dict]:
    rows = []
    for line in block.splitlines():
        line = line.strip()
        if not line.startswith("|") or re.match(r"\|?\s*-+", line):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) < 3:
            continue
        if cells[0] in ("較不自然／易錯", "較不自然/易錯"):
            continue
        rows.append({"bad": cells[0], "good": cells[1], "note": cells[2]})
    return rows


def parse_lesson(chunk: str, book_id: int, book_title: str) -> dict | None:
    m = re.match(
        r"## Lesson\s+(\d+)\｜(.+?)\n\*\*(.+?)\*\*\s*\n",
        chunk,
        re.S,
    )
    if not m:
        return None
    num = int(m.group(1))
    title_zh = m.group(2).strip()
    title_en = m.group(3).strip()

    focus_m = re.search(r">\s*\*\*一句話重點\*\*：(.+)", chunk)
    focus = focus_m.group(1).strip() if focus_m else ""

    contrast_m = re.search(
        r"### 對比\s*\n+(.*?)(?=\n### |\Z)",
        chunk,
        re.S,
    )
    contrasts = parse_table(contrast_m.group(1)) if contrast_m else []

    rules_m = re.search(
        r"### 規則／用法\s*\n+(.*?)(?=\n### |\Z)",
        chunk,
        re.S,
    )
    rules = []
    if rules_m:
        for line in rules_m.group(1).splitlines():
            line = line.strip()
            rm = re.match(r"\d+\.\s*(.+)", line)
            if rm:
                rules.append(rm.group(1).strip())

    examples = []
    for em in re.finditer(
        r"-\s*`([^`]+)`\s*\*\*EN:\*\*\s*(.+?)\s*\n\s*\*\*ZH:\*\*\s*(.+)",
        chunk,
    ):
        examples.append(
            {
                "tag": em.group(1).strip(),
                "en": em.group(2).strip(),
                "zh": em.group(3).strip(),
            }
        )

    passage_en = ""
    passage_zh = ""
    words = 0
    pm = re.search(
        r"### 跟讀短文（約\s*(\d+)\s*words｜TTS）\s*\n+"
        r"(?:>.*?\n+)*"
        r"\*\*EN\*\*\s*\n+(.+?)\n+\*\*ZH\*\*\s*\n+(.+?)(?=\n### |\Z)",
        chunk,
        re.S,
    )
    if pm:
        words = int(pm.group(1))
        passage_en = re.sub(r"\s+", " ", pm.group(2).strip())
        passage_zh = re.sub(r"\s+", " ", pm.group(3).strip())

    idioms = []
    im = re.search(r"### 慣用語包\s*\n+(.*?)(?=\n### |\Z)", chunk, re.S)
    if im:
        for line in im.group(1).splitlines():
            line = line.strip()
            mm = re.match(
                r"-\s*\*\*(.+?)\*\*\s*—\s*(.+?)\s*〔(.+?)〕",
                line,
            )
            if mm:
                idioms.append(
                    {
                        "phrase": mm.group(1).strip(),
                        "gloss": mm.group(2).strip(),
                        "domain": mm.group(3).strip(),
                    }
                )

    practices = []
    answers = []
    prac_m = re.search(
        r"### 迷你練習\s*\n+(.*?)(?=<details>|\Z)",
        chunk,
        re.S,
    )
    if prac_m:
        for line in prac_m.group(1).splitlines():
            line = line.strip()
            rm = re.match(r"\d+\.\s*(.+)", line)
            if rm:
                practices.append(rm.group(1).strip())

    ans_m = re.search(
        r"<details>.*?<summary>簡答</summary>\s*\n+(.*?)</details>",
        chunk,
        re.S,
    )
    if ans_m:
        for line in ans_m.group(1).splitlines():
            line = line.strip()
            rm = re.match(r"\d+\.\s*(.+)", line)
            if rm:
                answers.append(rm.group(1).strip())

    slug = f"grammar-{num:02d}-{slugify(title_en)}"
    return {
        "id": f"grammar-{num:02d}",
        "num": num,
        "slug": slug,
        "bookId": book_id,
        "bookTitle": book_title,
        "titleZh": title_zh,
        "titleEn": title_en,
        "focus": focus,
        "contrasts": contrasts,
        "rules": rules,
        "examples": examples,
        "passage": {
            "en": passage_en,
            "zh": passage_zh,
            "words": words or len(passage_en.split()),
        },
        "idioms": idioms,
        "practices": practices,
        "answers": answers,
    }


def main() -> None:
    text = SRC.read_text(encoding="utf-8")
    # Drop appendices
    text = re.split(r"\n# 附錄", text, maxsplit=1)[0]

    books: list[dict] = []
    lessons: list[dict] = []

    book_chunks = re.split(r"\n(?=# 冊 )", text)
    for bc in book_chunks:
        bm = re.match(
            r"# 冊\s*(\d+)\｜(.+?)\n+(.*?)(?=\n---|\n## Lesson|\Z)",
            bc,
            re.S,
        )
        if not bm:
            continue
        book_id = int(bm.group(1))
        book_title = bm.group(2).strip()
        # strip （Lessons…） for cleaner title
        book_title_clean = re.sub(r"（Lessons.*?）", "", book_title).strip()
        book_blurb = bm.group(3).strip().split("\n---")[0].strip()
        books.append(
            {
                "id": book_id,
                "title": book_title_clean,
                "blurb": book_blurb,
            }
        )

        for lm in re.finditer(r"(## Lesson \d+\｜.*?)(?=\n## Lesson |\Z)", bc, re.S):
            lesson = parse_lesson(lm.group(1), book_id, book_title_clean)
            if lesson:
                lessons.append(lesson)

    lessons.sort(key=lambda x: x["num"])
    if len(lessons) != 36:
        raise SystemExit(f"expected 36 lessons, got {len(lessons)}")

    for L in lessons:
        if not L["passage"]["en"]:
            raise SystemExit(f"missing passage for lesson {L['num']}")
        if len(L["examples"]) < 3:
            raise SystemExit(f"few examples for lesson {L['num']}")

    data = {
        "source": "english grammar.md",
        "total": len(lessons),
        "audio": "tts",
        "books": books,
        "lessons": lessons,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT} ({len(lessons)} lessons, {len(books)} books)")


if __name__ == "__main__":
    main()
