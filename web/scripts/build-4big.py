# -*- coding: utf-8 -*-
"""Parse 4big.md into web/src/data/conversation-four.json"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "4big.md"
OUT = ROOT / "web" / "src" / "data" / "conversation-four.json"

TYPE_META = [
    {
        "id": 1,
        "slug": "ask-extend",
        "titleZh": "提問與對話延展",
        "titleEn": "Ask & Extend",
        "summaryZh": "破冰開場、深度觀點、迴旋追問、反向創意提問。",
    },
    {
        "id": 2,
        "slug": "express-views",
        "titleZh": "表達觀點",
        "titleEn": "Express Views",
        "summaryZh": "溫和墊句、立體鋪陳、高 EQ 反駁、強烈肯定。",
    },
    {
        "id": 3,
        "slug": "storytelling",
        "titleZh": "講故事",
        "titleEn": "Storytelling",
        "summaryZh": "懸念開頭、情境鋪陳、高潮轉折、共鳴收尾。",
    },
    {
        "id": 4,
        "slug": "listen-empathy",
        "titleZh": "傾聽與共情",
        "titleEn": "Listen & Empathy",
        "summaryZh": "情緒同頻、換句話說、積極賦能、引導宣洩。",
    },
]

BLOCK_RE = re.compile(
    r"^區塊\s*([ABCD])：【([^】]+)】(.+?)（公式\s*(\d+)\s*-\s*(\d+)）\s*$"
)
FORMULA_RE = re.compile(r"^公式\s*(\d+)：(.+)$")
TYPE_RE = re.compile(r"^第([一二三四])類\s*$")
SUB_RE = re.compile(r"^替換：(.+)$")
SCENE_RE = re.compile(r"^場景：(.+)$")


def parse() -> dict:
    text = SRC.read_text(encoding="utf-8")
    lines = text.splitlines()

    types: list[dict] = []
    current_type: dict | None = None
    current_block: dict | None = None
    type_idx = 0

    def flush_block():
        nonlocal current_block
        if current_block and current_type:
            current_type["blocks"].append(current_block)
            current_block = None

    def flush_type():
        nonlocal current_type, type_idx
        flush_block()
        if current_type:
            types.append(current_type)
            current_type = None

    def start_type():
        nonlocal current_type, type_idx
        meta = TYPE_META[type_idx]
        type_idx += 1
        current_type = {
            **meta,
            "blocks": [],
        }

    start_type()

    for raw in lines:
        line = raw.strip()
        if not line:
            continue

        tm = TYPE_RE.match(line)
        if tm:
            flush_type()
            start_type()
            continue

        bm = BLOCK_RE.match(line)
        if bm:
            flush_block()
            if not current_type:
                start_type()
            current_block = {
                "id": bm.group(1),
                "titleZh": bm.group(2).strip(),
                "subtitle": bm.group(3).strip(),
                "scenario": "",
                "formulaFrom": int(bm.group(4)),
                "formulaTo": int(bm.group(5)),
                "formulas": [],
            }
            continue

        if current_block is None:
            continue

        if not current_block["scenario"] and line.startswith("適用場景："):
            current_block["scenario"] = line.split("：", 1)[1].strip()
            continue

        fm = FORMULA_RE.match(line)
        if fm:
            num = int(fm.group(1))
            current_block["formulas"].append(
                {
                    "num": num,
                    "id": f"{current_type['id']}-{current_block['id']}-{num:02d}",
                    "en": fm.group(2).strip(),
                    "substitutions": "",
                    "scenarioZh": "",
                }
            )
            continue

        sm = SUB_RE.match(line)
        if sm and current_block["formulas"]:
            current_block["formulas"][-1]["substitutions"] = sm.group(1).strip()
            continue

        scm = SCENE_RE.match(line)
        if scm and current_block["formulas"]:
            current_block["formulas"][-1]["scenarioZh"] = scm.group(1).strip()
            continue

    flush_type()

    total = sum(len(b["formulas"]) for t in types for b in t["blocks"])
    return {
        "source": "4big.md",
        "total": total,
        "types": types,
    }


def main() -> None:
    data = parse()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT} ({data['total']} formulas, {len(data['types'])} types)")


if __name__ == "__main__":
    main()
