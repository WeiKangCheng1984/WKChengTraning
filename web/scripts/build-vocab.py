# -*- coding: utf-8 -*-
"""Parse vocabulary.md into web/src/data/vocabulary.json"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "vocabulary.md"
OUT = ROOT / "web" / "src" / "data" / "vocabulary.json"

TABLE_RE = re.compile(
    r"^表\s*(\d+)：(.+?)（Part\s*(\d+)\s*/\s*(\d+)）\s*$"
)
ENTRY_RE = re.compile(
    r"^(\d+)\.\s+(.+?)\s+/(.+?)/\s+\(([^)]+)\)\s*$"
)
LABEL_DEF = re.compile(r"^精準定義：(.+)$")
LABEL_COLLOC = re.compile(r"^黃金搭配詞：\s*$")
LABEL_EX = re.compile(r"^(?:職場)?實戰例句：\s*$")
COLLOC_LINE = re.compile(r"^(.+?)（(.+?)）\s*$")

TABLE_META = {
    1: {
        "slug": "office-ops",
        "titleEn": "Office Ops & Business Strategy",
        "level": "B2–C1",
    },
    2: {
        "slug": "negotiation",
        "titleEn": "Negotiation & Tactical Alignment",
        "level": "B2–C1",
    },
    3: {
        "slug": "service-crm",
        "titleEn": "Service & Client Relations",
        "level": "B2–C1",
    },
    4: {
        "slug": "food-sensory",
        "titleEn": "Food & Sensory Structure",
        "level": "B2–C1",
    },
    5: {
        "slug": "precise-adj",
        "titleEn": "Precise Adjectives & Evaluation",
        "level": "B2–C1",
    },
}


def slugify(text: str) -> str:
    s = text.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")[:56] or "term"


def parse() -> dict:
    lines = SRC.read_text(encoding="utf-8").splitlines()
    tables: dict[int, dict] = {}
    current_table: int | None = None
    current_part: int | None = None
    current_blurb = ""
    pending: dict | None = None
    mode: str | None = None  # "colloc" | "example" | None

    def flush_pending():
        nonlocal pending
        if not pending or current_table is None or current_part is None:
            pending = None
            return
        t = tables.setdefault(
            current_table,
            {
                "id": current_table,
                **TABLE_META.get(
                    current_table,
                    {
                        "slug": f"table-{current_table}",
                        "titleEn": f"Table {current_table}",
                        "level": "B2–C1",
                    },
                ),
                "titleZh": pending.get("_tableTitleZh", f"表 {current_table}"),
                "parts": {},
            },
        )
        if "_tableTitleZh" in pending:
            t["titleZh"] = pending.pop("_tableTitleZh")
        part = t["parts"].setdefault(
            current_part,
            {
                "num": current_part,
                "blurb": current_blurb,
                "words": [],
            },
        )
        if current_blurb and not part["blurb"]:
            part["blurb"] = current_blurb
        word = {
            "id": pending["id"],
            "num": pending["num"],
            "en": pending["en"],
            "ipa": pending["ipa"],
            "pos": pending["pos"],
            "zh": pending["zh"],
            "collocations": pending["collocations"],
            "exampleEn": pending["exampleEn"],
        }
        part["words"].append(word)
        pending = None

    for raw in lines:
        line = raw.strip()
        if not line:
            continue

        tm = TABLE_RE.match(line)
        if tm:
            flush_pending()
            mode = None
            current_table = int(tm.group(1))
            title_zh = tm.group(2).strip()
            current_part = int(tm.group(3))
            current_blurb = ""
            # stash title on first part of table
            tables.setdefault(
                current_table,
                {
                    "id": current_table,
                    **TABLE_META.get(
                        current_table,
                        {
                            "slug": f"table-{current_table}",
                            "titleEn": f"Table {current_table}",
                            "level": "B2–C1",
                        },
                    ),
                    "titleZh": title_zh,
                    "parts": {},
                },
            )
            tables[current_table]["titleZh"] = title_zh
            tables[current_table]["parts"].setdefault(
                current_part,
                {"num": current_part, "blurb": "", "words": []},
            )
            continue

        if current_table is None:
            continue

        # Skip Anki / bridge notes between tables
        if line.startswith("你可以將") or line.startswith("準備好時"):
            continue

        em = ENTRY_RE.match(line)
        if em:
            flush_pending()
            mode = None
            num = int(em.group(1))
            en = em.group(2).strip()
            ipa = em.group(3).strip()
            pos = em.group(4).strip()
            pending = {
                "id": f"v{current_table}-p{current_part:02d}-{num:03d}-{slugify(en)}",
                "num": num,
                "en": en,
                "ipa": ipa,
                "pos": pos,
                "zh": "",
                "collocations": [],
                "exampleEn": "",
            }
            continue

        if pending is None:
            # blurb under table header (before first entry)
            part = tables[current_table]["parts"].get(current_part)
            if part is not None and not part["words"] and not ENTRY_RE.match(line):
                if line.startswith("核心主題：") or line.startswith("本組"):
                    current_blurb = line
                    part["blurb"] = line
            continue

        dm = LABEL_DEF.match(line)
        if dm:
            pending["zh"] = dm.group(1).strip()
            mode = None
            continue

        if LABEL_COLLOC.match(line):
            mode = "colloc"
            continue

        if LABEL_EX.match(line):
            mode = "example"
            continue

        if mode == "colloc":
            cm = COLLOC_LINE.match(line)
            if cm:
                pending["collocations"].append(
                    {"en": cm.group(1).strip(), "zh": cm.group(2).strip()}
                )
            elif "（" in line and "）" in line:
                # fallback split
                en_part, zh_part = line.rsplit("（", 1)
                pending["collocations"].append(
                    {"en": en_part.strip(), "zh": zh_part.rstrip("）").strip()}
                )
            continue

        if mode == "example":
            ex = line.strip().strip('"').strip('"').strip('"')
            if ex:
                pending["exampleEn"] = ex
            mode = None
            continue

    flush_pending()

    out_tables = []
    total = 0
    for tid in sorted(tables.keys()):
        t = tables[tid]
        parts = []
        for pnum in sorted(t["parts"].keys()):
            p = t["parts"][pnum]
            total += len(p["words"])
            parts.append(p)
        out_tables.append(
            {
                "id": t["id"],
                "slug": t["slug"],
                "titleZh": t["titleZh"],
                "titleEn": t["titleEn"],
                "level": t["level"],
                "wordCount": sum(len(p["words"]) for p in parts),
                "parts": parts,
            }
        )

    return {
        "source": "vocabulary.md",
        "total": total,
        "audio": "tts",
        "level": "B2–C1",
        "tables": out_tables,
    }


def main() -> None:
    data = parse()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        f"Wrote {OUT} ({data['total']} words, {len(data['tables'])} tables)"
    )
    for t in data["tables"]:
        print(f"  表 {t['id']} {t['titleZh']}: {t['wordCount']} · {len(t['parts'])} parts")


if __name__ == "__main__":
    main()
