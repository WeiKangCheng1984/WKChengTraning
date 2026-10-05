# -*- coding: utf-8 -*-
"""Parse style.md into web/src/data/style-phrases.json"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "style.md"
OUT = ROOT / "web" / "src" / "data" / "style-phrases.json"

STAGE_INTRO_RE = re.compile(r"^第([一二三四])階段")
SECTION_RE = re.compile(r"^(\d+)\.\s*(.+)$")
SUBSECTION_RE = re.compile(r"^(.+?)的(?:變體與)?用法(?:與變體)?：(.*)$")
EXAMPLE_INLINE = re.compile(r"例句：")

STAGE_META = [
    {"id": 1, "slug": "openers", "titleZh": "發語詞與緩衝", "titleEn": "Openers & Buffers"},
    {"id": 2, "slug": "connectors", "titleZh": "邏輯連接器", "titleEn": "Logic Connectors"},
    {"id": 3, "slug": "signature", "titleZh": "個人特色慣用句", "titleEn": "Signature Phrases"},
    {"id": 4, "slug": "pressure-relief", "titleZh": "壓力緩衝與優雅應對", "titleEn": "Pressure Relievers"},
]


def slugify(text: str) -> str:
    base = text.split("：")[0].split("系列")[0].strip()
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", base).strip("-").lower()
    return slug[:48] or "section"


def split_examples(blob: str) -> tuple[str, list[dict]]:
    """Split intro text and inline 例句： segments."""
    if "例句：" not in blob:
        return blob.strip(), []
    intro, rest = blob.split("例句：", 1)
    parts = ["例句：" + p for p in rest.split("例句：") if p.strip()]
    items: list[dict] = []
    for part in parts:
        en = part.replace("例句：", "", 1).strip()
        if en:
            items.append({"en": en, "noteZh": ""})
    return intro.strip(), items


def parse_stage3_item(line: str) -> dict | None:
    """English sentence + Chinese note on one line."""
    if not re.match(r"^[A-Za-z\"']", line):
        return None
    if line.startswith("例句："):
        return {"en": line.replace("例句：", "", 1).strip(), "noteZh": ""}
    # Split on first Chinese char run after English sentence
    m = re.match(r"^(.+?[.!?])\s+([\u4e00-\u9fff].+)$", line)
    if m:
        return {"en": m.group(1).strip(), "noteZh": m.group(2).strip()}
    m2 = re.match(r"^(.+?[.!?？！。])\s*(.+)$", line)
    if m2 and re.search(r"[\u4e00-\u9fff]", m2.group(2)):
        return {"en": m2.group(1).strip(), "noteZh": m2.group(2).strip()}
    return None


def parse() -> dict:
    lines = [ln.strip() for ln in SRC.read_text(encoding="utf-8").splitlines()]

    stages: list[dict] = []
    stage_idx = 0
    current_stage: dict | None = None
    current_section: dict | None = None
    pending_intro: list[str] = []

    def flush_group(group: dict | None):
        if group and current_section and group.get("items"):
            current_section["groups"].append(group)

    def flush_section():
        nonlocal current_section
        if current_section and current_stage:
            current_stage["sections"].append(current_section)
            current_section = None

    def flush_stage():
        nonlocal current_stage, pending_intro
        flush_section()
        if current_stage:
            if pending_intro and not current_stage.get("intro"):
                current_stage["intro"] = " ".join(pending_intro).strip()
            stages.append(current_stage)
            current_stage = None
            pending_intro = []

    def start_stage(intro_line: str = ""):
        nonlocal current_stage, stage_idx, pending_intro
        meta = STAGE_META[stage_idx]
        stage_idx += 1
        current_stage = {**meta, "intro": intro_line, "sections": []}
        pending_intro = []

    start_stage()

    current_group: dict | None = None

    for line in lines:
        if not line or line == "–":
            continue

        if STAGE_INTRO_RE.search(line) and stage_idx < len(STAGE_META):
            flush_group(current_group)
            current_group = None
            flush_stage()
            start_stage(line.split("。", 1)[0] + "。" if "。" in line else line)
            continue

        sm = SECTION_RE.match(line)
        if sm and not line.startswith("例句"):
            flush_group(current_group)
            current_group = None
            flush_section()
            title = sm.group(2).strip()
            current_section = {
                "num": int(sm.group(1)),
                "slug": slugify(title),
                "titleZh": title.split("：")[0].strip(),
                "subtitle": title.split("：", 1)[1].strip() if "：" in title else "",
                "groups": [],
            }
            continue

        subm = SUBSECTION_RE.match(line)
        if subm and current_section:
            flush_group(current_group)
            intro, items = split_examples(subm.group(2))
            current_group = {
                "titleZh": subm.group(1).strip(),
                "intro": intro,
                "items": items,
            }
            continue

        if line.startswith("例句：") and current_group:
            current_group["items"].append(
                {"en": line.replace("例句：", "", 1).strip(), "noteZh": ""}
            )
            continue

        item = parse_stage3_item(line)
        if item and current_section:
            if not current_group:
                current_group = {
                    "titleZh": current_section["titleZh"],
                    "intro": "",
                    "items": [],
                }
            current_group["items"].append(item)
            continue

        if current_stage and not current_section:
            pending_intro.append(line)

    flush_group(current_group)
    flush_stage()

    total = sum(
        len(g["items"])
        for s in stages
        for sec in s["sections"]
        for g in sec["groups"]
    )
    return {"source": "style.md", "total": total, "stages": stages}


def main() -> None:
    data = parse()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        f"Wrote {OUT} ({data['total']} items, {len(data['stages'])} stages)"
    )


if __name__ == "__main__":
    main()
