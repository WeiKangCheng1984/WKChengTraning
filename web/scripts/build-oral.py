# -*- coding: utf-8 -*-
"""Build oral-practice.json: 100 units × 10 speakable sentences (Phase A)."""
from __future__ import annotations

import json
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "web" / "src" / "data"
OUT = DATA / "oral-practice.json"
RNG = random.Random(20261010)

UNITS = 100
PER = 10
TARGET = UNITS * PER  # 1000


def wc(text: str) -> int:
    return len(re.findall(r"[A-Za-z']+", text or ""))


def clean_en(s: str) -> str:
    s = (s or "").strip()
    s = re.split(r"[\u4e00-\u9fff]", s, maxsplit=1)[0].strip()
    s = re.sub(r"\s+", " ", s)
    return s.strip(" \"'")


def ok_len(en: str, lo: int = 4, hi: int = 16) -> bool:
    n = wc(en)
    return lo <= n <= hi


def split_passage(en: str, zh: str) -> list[tuple[str, str]]:
    en_parts = [p.strip() for p in re.split(r"(?<=[.!?])\s+", en) if p.strip()]
    zh_parts = [p.strip() for p in re.split(r"(?<=[。！？])\s*", zh) if p.strip()]
    out = []
    for i, e in enumerate(en_parts):
        if not e.endswith((".", "!", "?")):
            e = e + "."
        z = zh_parts[i] if i < len(zh_parts) else (zh_parts[-1] if zh_parts else "")
        if ok_len(e, 5, 18):
            out.append((e, z))
    return out


def collect_pool() -> dict[str, list[dict]]:
    pools: dict[str, list[dict]] = {
        "pattern": [],
        "gre": [],
        "grammar": [],
        "re": [],
        "cfa": [],
    }
    seen: set[str] = set()

    def add(kind: str, en: str, zh: str, source: str, tip: str = ""):
        en = clean_en(en)
        if not en or not ok_len(en):
            return
        key = en.lower()
        if key in seen:
            return
        seen.add(key)
        pools[kind].append(
            {
                "en": en,
                "zh": (zh or "").strip() or "（練習這句口語表達）",
                "source": source,
                "tip": tip,
            }
        )

    # 1) Short patterns — english.json examples
    en_data = json.loads((DATA / "english.json").read_text(encoding="utf-8"))
    for cat in en_data["categories"]:
        for item in cat["items"]:
            tip = item.get("en") or ""
            for ex in item.get("examples") or []:
                add(
                    "pattern",
                    ex.get("en", ""),
                    ex.get("zh", ""),
                    f"pattern:{cat['slug']}",
                    tip=f"句型：{tip}" if tip else "",
                )

    # 2) GRE exampleEn
    gre = json.loads((DATA / "gre-vocabulary.json").read_text(encoding="utf-8"))
    for letter in gre["letters"]:
        for w in letter["words"]:
            ex = w.get("exampleEn") or ""
            zh = w.get("zh") or ""
            add(
                "gre",
                ex,
                f"{w['en']}：{zh}" if zh else w["en"],
                "gre",
                tip=(w.get("endef") or "").split(";")[0][:90],
            )

    # 3) Grammar examples + passage segments
    grammar = json.loads((DATA / "grammar.json").read_text(encoding="utf-8"))
    for lesson in grammar["lessons"]:
        for ex in lesson.get("examples") or []:
            add(
                "grammar",
                ex.get("en", ""),
                ex.get("zh", ""),
                f"grammar:{lesson['slug']}",
                tip=lesson.get("titleZh", ""),
            )
        passage = lesson.get("passage") or {}
        for e, z in split_passage(passage.get("en", ""), passage.get("zh", "")):
            add(
                "grammar",
                e,
                z,
                f"grammar-passage:{lesson['slug']}",
                tip=f"文法短文｜{lesson.get('titleZh', '')}",
            )

    # 4) Real estate phrases (+ term as short cue sentences)
    re_data = json.loads((DATA / "real-estate.json").read_text(encoding="utf-8"))
    for ph in re_data.get("phrases") or []:
        add("re", ph.get("en", ""), ph.get("zh", ""), "real-estate", tip="不動產用語")
    for sec in re_data.get("sections") or []:
        for t in sec.get("terms") or []:
            en_term = (t.get("en") or "").split("/")[0].strip()
            if not en_term or " " not in en_term:
                # wrap single terms into speakable sentence
                if en_term and len(en_term) > 2:
                    add(
                        "re",
                        f"This property is a {en_term}.",
                        f"這個物件是{t.get('zh') or en_term}。",
                        f"re-term:{sec.get('slug', '')}",
                        tip=t.get("note") or "不動產詞彙",
                    )
            else:
                add(
                    "re",
                    f"We're looking at a {en_term}.",
                    f"我們在看{t.get('zh') or en_term}。",
                    f"re-term:{sec.get('slug', '')}",
                    tip=t.get("note") or "不動產詞彙",
                )

    # 5) CFA examples (short)
    cfa = json.loads((DATA / "cfa.json").read_text(encoding="utf-8"))
    for sub in cfa["subjects"]:
        for term in sub["terms"]:
            ex = term.get("example") or ""
            zh = f"{term.get('termEn')}：{term.get('termZh')}"
            tip = (term.get("definition") or "")[:80]
            add("cfa", ex, zh, f"cfa:{sub['code']}", tip=tip)

    for k, v in pools.items():
        print(f"  pool {k}: {len(v)}")
    return pools


def take(pool: list[dict], n: int, used: set[str]) -> list[dict]:
    RNG.shuffle(pool)
    out = []
    for item in pool:
        key = item["en"].lower()
        if key in used:
            continue
        used.add(key)
        out.append(item)
        if len(out) >= n:
            break
    return out


def unit_meta(num: int) -> dict:
    if num <= 30:
        series, focus, title = "A", "pattern", f"口語單元 {num:02d}｜短句型優先"
    elif num <= 60:
        series, focus, title = "B", "gre", f"口語單元 {num:02d}｜GRE 例句"
    elif num <= 80:
        series, focus, title = "C", "grammar", f"口語單元 {num:02d}｜文法短句"
    elif num <= 90:
        series, focus, title = "D", "re", f"口語單元 {num:02d}｜不動產場景"
    else:
        series, focus, title = "E", "cfa", f"口語單元 {num:02d}｜CFA／綜合"
    return {
        "series": series,
        "focus": focus,
        "titleZh": title,
        "titleEn": f"Oral Unit {num:02d}",
    }


def recipe(focus: str) -> list[tuple[str, int]]:
    """How many items from each pool for a unit."""
    if focus == "pattern":
        return [("pattern", 5), ("gre", 2), ("grammar", 2), ("re", 1)]
    if focus == "gre":
        return [("gre", 5), ("pattern", 2), ("grammar", 2), ("cfa", 1)]
    if focus == "grammar":
        return [("grammar", 5), ("pattern", 2), ("gre", 2), ("re", 1)]
    if focus == "re":
        return [("re", 5), ("pattern", 2), ("grammar", 2), ("gre", 1)]
    # cfa / mix
    return [("cfa", 4), ("gre", 2), ("pattern", 2), ("grammar", 1), ("re", 1)]


def build() -> dict:
    pools = collect_pool()
    used: set[str] = set()
    units = []

    for num in range(1, UNITS + 1):
        meta = unit_meta(num)
        items: list[dict] = []
        for kind, n in recipe(meta["focus"]):
            picked = take(pools[kind], n, used)
            items.extend(picked)
            # top-up from same kind leftovers via other pools if short
            if len(picked) < n:
                need = n - len(picked)
                for alt in ("pattern", "gre", "grammar", "re", "cfa"):
                    if need <= 0:
                        break
                    more = take(pools[alt], need, used)
                    items.extend(more)
                    need -= len(more)

        # ensure exactly PER
        if len(items) < PER:
            for alt in ("gre", "pattern", "grammar", "re", "cfa"):
                if len(items) >= PER:
                    break
                items.extend(take(pools[alt], PER - len(items), used))
        items = items[:PER]
        RNG.shuffle(items)

        sentences = []
        for i, it in enumerate(items, 1):
            sentences.append(
                {
                    "id": f"oral-{num:03d}-{i:02d}",
                    "en": it["en"],
                    "zh": it["zh"],
                    "tip": it.get("tip") or "",
                    "source": it["source"],
                }
            )

        units.append(
            {
                "id": f"oral-{num:03d}",
                "num": num,
                "slug": f"oral-{num:03d}",
                "series": meta["series"],
                "focus": meta["focus"],
                "titleZh": meta["titleZh"],
                "titleEn": meta["titleEn"],
                "blurb": f"每日 10 句跟讀評分（Phase A｜瀏覽器語音辨識）。主軸：{meta['focus']}。",
                "sentenceCount": len(sentences),
                "sentences": sentences,
            }
        )

    return {
        "version": 1,
        "totalUnits": len(units),
        "sentencesPerUnit": PER,
        "totalSentences": sum(u["sentenceCount"] for u in units),
        "engine": "web-speech-recognition",
        "audio": "tts",
        "units": units,
    }


def main() -> None:
    print("Collecting pools…")
    data = build()
    assert data["totalUnits"] == UNITS
    assert data["totalSentences"] == TARGET, data["totalSentences"]
    for u in data["units"]:
        assert u["sentenceCount"] == PER, u["slug"]
        for s in u["sentences"]:
            assert s["en"] and s["zh"]
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} ({data['totalUnits']} units, {data['totalSentences']} sentences)")


if __name__ == "__main__":
    main()
