# -*- coding: utf-8 -*-
"""Build quiz-bank.json: 40 cloze quizzes (3-choice) from GRE + workplace vocab."""
from __future__ import annotations

import json
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GRE = ROOT / "web" / "src" / "data" / "gre-vocabulary.json"
VOCAB = ROOT / "web" / "src" / "data" / "vocabulary.json"
OUT = ROOT / "web" / "src" / "data" / "quiz-bank.json"

QUESTIONS_PER = 25
RNG = random.Random(20261008)

# lemma(lower) -> {en, zh, endef} for choice explanations
LEMMA_INDEX: dict[str, dict] = {}

PLAN: list[dict] = [
    # Series A — GRE path 01-26 (letter slices handled dynamically)
    *[{"num": i, "series": "A", "kind": "gre_slice", "slice_i": i - 1} for i in range(1, 27)],
    {"num": 27, "series": "A", "kind": "gre_detailed", "half": 0},
    {"num": 28, "series": "A", "kind": "gre_detailed", "half": 1},
    # Series B — workplace
    {"num": 29, "series": "B", "kind": "work", "table": "office-ops", "titleZh": "職場詞彙｜營運與策略", "titleEn": "Office Ops"},
    {"num": 30, "series": "B", "kind": "work", "table": "negotiation", "titleZh": "職場詞彙｜談判與對齊", "titleEn": "Negotiation"},
    {"num": 31, "series": "B", "kind": "work", "table": "service-crm", "titleZh": "職場詞彙｜服務與客戶", "titleEn": "Service & CRM"},
    {"num": 32, "series": "B", "kind": "work", "table": "food-sensory", "titleZh": "職場詞彙｜飲食與感官", "titleEn": "Food & Sensory"},
    {"num": 33, "series": "B", "kind": "work", "table": "precise-adj", "titleZh": "職場詞彙｜精準形容與評價", "titleEn": "Precise Adjectives"},
    # Series C — mixed / review
    {"num": 34, "series": "C", "kind": "mix", "titleZh": "綜合｜GRE × 職場（易）", "titleEn": "GRE × Work Easy"},
    {"num": 35, "series": "C", "kind": "mix", "titleZh": "綜合｜GRE × 職場（中）", "titleEn": "GRE × Work Mid"},
    {"num": 36, "series": "C", "kind": "gre_lookalike", "titleZh": "複習｜GRE 易混形近", "titleEn": "GRE Lookalikes"},
    {"num": 37, "series": "C", "kind": "gre_antonym", "titleZh": "複習｜GRE 反義對照", "titleEn": "GRE Antonyms Cue"},
    {"num": 38, "series": "C", "kind": "work_mix", "titleZh": "複習｜職場高頻", "titleEn": "Workplace Review"},
    {"num": 39, "series": "C", "kind": "finale", "half": 0, "titleZh": "總複習｜上半", "titleEn": "Finale I"},
    {"num": 40, "series": "C", "kind": "finale", "half": 1, "titleZh": "總複習｜下半", "titleEn": "Finale II"},
]

GRE_PATH_TITLES = [
    (1, "gre-path-01", "GRE 路徑 01｜開端 A", "GRE Path 01"),
    (2, "gre-path-02", "GRE 路徑 02｜A 續", "GRE Path 02"),
    (3, "gre-path-03", "GRE 路徑 03｜B", "GRE Path 03"),
    (4, "gre-path-04", "GRE 路徑 04｜C 上", "GRE Path 04"),
    (5, "gre-path-05", "GRE 路徑 05｜C 下", "GRE Path 05"),
    (6, "gre-path-06", "GRE 路徑 06｜D", "GRE Path 06"),
    (7, "gre-path-07", "GRE 路徑 07｜E 上", "GRE Path 07"),
    (8, "gre-path-08", "GRE 路徑 08｜E 下", "GRE Path 08"),
    (9, "gre-path-09", "GRE 路徑 09｜F", "GRE Path 09"),
    (10, "gre-path-10", "GRE 路徑 10｜G", "GRE Path 10"),
    (11, "gre-path-11", "GRE 路徑 11｜H–I", "GRE Path 11"),
    (12, "gre-path-12", "GRE 路徑 12｜I–J", "GRE Path 12"),
    (13, "gre-path-13", "GRE 路徑 13｜L", "GRE Path 13"),
    (14, "gre-path-14", "GRE 路徑 14｜M 上", "GRE Path 14"),
    (15, "gre-path-15", "GRE 路徑 15｜M 下", "GRE Path 15"),
    (16, "gre-path-16", "GRE 路徑 16｜N–O", "GRE Path 16"),
    (17, "gre-path-17", "GRE 路徑 17｜P 上", "GRE Path 17"),
    (18, "gre-path-18", "GRE 路徑 18｜P 下", "GRE Path 18"),
    (19, "gre-path-19", "GRE 路徑 19｜Q–R", "GRE Path 19"),
    (20, "gre-path-20", "GRE 路徑 20｜R", "GRE Path 20"),
    (21, "gre-path-21", "GRE 路徑 21｜S 上", "GRE Path 21"),
    (22, "gre-path-22", "GRE 路徑 22｜S 中", "GRE Path 22"),
    (23, "gre-path-23", "GRE 路徑 23｜S 下", "GRE Path 23"),
    (24, "gre-path-24", "GRE 路徑 24｜T", "GRE Path 24"),
    (25, "gre-path-25", "GRE 路徑 25｜U–V", "GRE Path 25"),
    (26, "gre-path-26", "GRE 路徑 26｜W–Z", "GRE Path 26"),
]


def inflected_forms(lemma: str) -> list[str]:
    w = lemma.lower()
    forms = {w, w + "s", w + "es", w + "ed", w + "ing"}
    if w.endswith("e"):
        forms.add(w + "d")
        forms.add(w[:-1] + "ing")
        forms.add(w[:-1] + "ed")
    if w.endswith("y") and len(w) > 2 and w[-2] not in "aeiou":
        forms.add(w[:-1] + "ies")
        forms.add(w[:-1] + "ied")
    if w.endswith("ie"):
        forms.add(w[:-2] + "ying")
    return sorted(forms, key=len, reverse=True)


def blank_stem(example: str, lemma: str) -> tuple[str, str] | None:
    """Return (stem_with_blank, surface_form) or None."""
    if not example or not lemma:
        return None
    for form in inflected_forms(lemma):
        pat = re.compile(rf"\b({re.escape(form)})\b", re.I)
        m = pat.search(example)
        if m:
            surface = m.group(1)
            stem = pat.sub("______", example, count=1)
            # strip trailing chinese if any leaked
            stem = re.split(r"[\u4e00-\u9fff]", stem, maxsplit=1)[0].strip()
            if "______" not in stem:
                return None
            return stem, surface
    return None


def fallback_stem(lemma: str) -> tuple[str, str]:
    return (
        f"In this GRE-style context, the best word to complete the idea is ______.",
        lemma,
    )


def pick_distractors(
    answer: str,
    lemma: str,
    pool: list[dict],
    prefer_lookalike: bool = False,
) -> list[str]:
    ans_l = answer.lower()
    lemma_l = lemma.lower()
    cands: list[str] = []

    def add(word: str):
        w = word.strip()
        if not w:
            return
        if w.lower() in {ans_l, lemma_l}:
            return
        if w.lower() in {c.lower() for c in cands}:
            return
        # similar length preference later
        cands.append(w)

    # From lookalikes / synonyms fields on nearby items
    for item in pool:
        en = item.get("en") or item.get("wordEn") or ""
        if prefer_lookalike and item.get("lookalikes"):
            for part in re.split(r"[｜|/]", item["lookalikes"]):
                m = re.match(r"^\s*([A-Za-z][A-Za-z\-']*)", part)
                if m:
                    add(m.group(1))
        syn = item.get("synonyms") or ""
        for part in re.split(r"[,;/]", syn):
            m = re.match(r"^\s*([A-Za-z][A-Za-z\-']*)", part)
            if m:
                add(m.group(1))
        if en and en[0].lower() == lemma_l[:1]:
            add(en)

    # Score by length closeness
    cands.sort(key=lambda x: abs(len(x) - len(answer)))
    out: list[str] = []
    for c in cands:
        if c.lower() == ans_l:
            continue
        out.append(c)
        if len(out) >= 2:
            break

    # Fill from random pool
    others = [p.get("en") or p.get("wordEn") for p in pool]
    RNG.shuffle(others)
    for en in others:
        if not en:
            continue
        if en.lower() in {ans_l, lemma_l} or en.lower() in {o.lower() for o in out}:
            continue
        out.append(en)
        if len(out) >= 2:
            break

    # Last resort placeholders
    while len(out) < 2:
        out.append(f"option{len(out)+1}")
    return out[:2]


def lookup_gloss(token: str) -> tuple[str, str]:
    """Return (zh, short_endef) for a choice token / lemma."""
    key = token.lower()
    hit = LEMMA_INDEX.get(key)
    if not hit:
        # try stripping common inflection to lemma in index
        for form in inflected_forms(token):
            hit = LEMMA_INDEX.get(form.lower())
            if hit:
                break
        if not hit and key.endswith("ed") and key[:-2] in LEMMA_INDEX:
            hit = LEMMA_INDEX[key[:-2]]
        if not hit and key.endswith("ing") and key[:-3] in LEMMA_INDEX:
            hit = LEMMA_INDEX[key[:-3]]
        if not hit and key.endswith("s") and key[:-1] in LEMMA_INDEX:
            hit = LEMMA_INDEX[key[:-1]]
    if not hit:
        return "（詞庫無詳註）", ""
    zh = (hit.get("zh") or "").split("｜")[0].strip() or "—"
    tip = (hit.get("endef") or "").split(";")[0].strip()
    if len(tip) > 80:
        tip = tip[:77] + "..."
    return zh, tip


def format_choice_note(token: str, is_answer: bool) -> str:
    zh, tip = lookup_gloss(token)
    tag = "正解" if is_answer else "干擾項"
    base = f"【{tag}】{token}：{zh}"
    if tip:
        base += f"。{tip}"
    if not is_answer:
        base += "（此處不合題意）"
    return base


def make_question(
    qid: str,
    lemma: str,
    zh: str,
    endef: str,
    example: str,
    pool: list[dict],
    prefer_lookalike: bool = False,
) -> dict | None:
    blanked = blank_stem(example, lemma)
    if blanked:
        stem, surface = blanked
    else:
        stem, surface = fallback_stem(lemma)

    distractors = pick_distractors(surface, lemma, pool, prefer_lookalike=prefer_lookalike)
    choices = [surface, distractors[0], distractors[1]]
    RNG.shuffle(choices)

    tip = (endef or "").split(";")[0].strip()
    if len(tip) > 100:
        tip = tip[:97] + "..."
    zh_short = (zh or "").split("｜")[0].strip()

    choice_explains = [
        format_choice_note(c, c.lower() == surface.lower()) for c in choices
    ]
    explain = (
        f"正解是「{surface}」。中文：{zh_short or '—'}。"
        + (f" 提示：{tip}" if tip else "")
        + "\n"
        + "\n".join(choice_explains)
    )

    return {
        "id": qid,
        "stem": stem,
        "answer": surface,
        "choices": choices,
        "explainZh": explain,
        "choiceExplains": choice_explains,
        "wordEn": lemma,
        "wordZh": zh_short,
    }


def index_word(item: dict) -> None:
    en = (item.get("en") or "").strip()
    if not en:
        return
    LEMMA_INDEX[en.lower()] = {
        "en": en,
        "zh": item.get("zh") or "",
        "endef": item.get("endef") or "",
    }


def load_gre_words() -> list[dict]:
    data = json.loads(GRE.read_text(encoding="utf-8"))
    words = []
    for letter in data["letters"]:
        for w in letter["words"]:
            if not w.get("en"):
                continue
            item = {
                "en": w["en"],
                "zh": w.get("zh") or "",
                "endef": w.get("endef") or "",
                "exampleEn": w.get("exampleEn") or "",
                "synonyms": w.get("synonyms") or "",
                "antonyms": w.get("antonyms") or "",
                "lookalikes": w.get("lookalikes") or "",
                "detailed": bool(w.get("detailed")),
                "letter": letter["letter"],
            }
            words.append(item)
            index_word(item)
    return words


def load_work_words() -> dict[str, list[dict]]:
    data = json.loads(VOCAB.read_text(encoding="utf-8"))
    out: dict[str, list[dict]] = {}
    for t in data["tables"]:
        items = []
        for p in t["parts"]:
            for w in p["words"]:
                ex = w.get("exampleEn") or ""
                item = {
                    "en": w["en"],
                    "zh": w.get("zh") or "",
                    "endef": w.get("zh") or "",
                    "exampleEn": ex,
                    "synonyms": "",
                    "antonyms": "",
                    "lookalikes": "",
                    "table": t["slug"],
                }
                items.append(item)
                index_word(item)
        out[t["slug"]] = items
    return out


def chunk_list(items: list, n: int) -> list[list]:
    if n <= 0:
        return [items]
    size = max(1, (len(items) + n - 1) // n)
    return [items[i : i + size] for i in range(0, len(items), size)][:n]


def sample_questions(
    pool: list[dict],
    quiz_id: str,
    count: int,
    prefer_lookalike: bool = False,
    require_example: bool = True,
) -> list[dict]:
    # Precompute blankability once (faster than filtering with blank_stem repeatedly)
    usable: list[dict] = []
    fallback: list[dict] = []
    for w in pool:
        if not w.get("en"):
            continue
        fallback.append(w)
        if not require_example:
            usable.append(w)
            continue
        ex = w.get("exampleEn") or ""
        if ex and blank_stem(ex, w["en"]):
            usable.append(w)
    if len(usable) < count:
        usable = fallback

    RNG.shuffle(usable)
    questions: list[dict] = []
    used: set[str] = set()
    for w in usable:
        key = w["en"].lower()
        if key in used:
            continue
        q = make_question(
            f"{quiz_id}-{len(questions)+1:02d}",
            w["en"],
            w.get("zh", ""),
            w.get("endef", ""),
            w.get("exampleEn", ""),
            pool,
            prefer_lookalike=prefer_lookalike,
        )
        if not q:
            continue
        used.add(key)
        questions.append(q)
        if len(questions) >= count:
            break
    return questions[:count]


def build() -> dict:
    gre = load_gre_words()
    work = load_work_words()
    gre_with_ex = [w for w in gre if w.get("exampleEn")]
    gre_detailed = [w for w in gre if w.get("detailed") and w.get("exampleEn")]
    gre_look = [w for w in gre if w.get("lookalikes") and w.get("exampleEn")]
    gre_ant = [w for w in gre if w.get("antonyms") and w.get("exampleEn")]

    # 26 slices for path quizzes
    slices = chunk_list(gre_with_ex, 26)
    detailed_chunks = chunk_list(gre_detailed or gre_with_ex, 2)

    quizzes = []
    for meta in PLAN:
        num = meta["num"]
        qid = f"q{num:02d}"
        kind = meta["kind"]
        prefer_la = False

        if kind == "gre_slice":
            num_t, slug, title_zh, title_en = GRE_PATH_TITLES[meta["slice_i"]]
            assert num_t == num
            pool = slices[meta["slice_i"]] if meta["slice_i"] < len(slices) else gre_with_ex
            source = "gre"
            blurb = f"GRE 單字路徑第 {num} 篇：填空三選一，共 {QUESTIONS_PER} 題；解析含三選項說明。"
            questions = sample_questions(pool, qid, QUESTIONS_PER)
        elif kind == "gre_detailed":
            slug = f"gre-mix-{num}"
            title_zh = "GRE 綜合 27｜詳情詞複習上" if meta["half"] == 0 else "GRE 綜合 28｜詳情詞複習下"
            title_en = "GRE Detailed Review I" if meta["half"] == 0 else "GRE Detailed Review II"
            pool = detailed_chunks[meta["half"]] if meta["half"] < len(detailed_chunks) else gre_detailed
            source = "gre"
            blurb = "聚焦含較完整英文釋義／例句的 GRE 詞。"
            questions = sample_questions(pool, qid, QUESTIONS_PER)
        elif kind == "work":
            slug = {
                "office-ops": "work-office-29",
                "negotiation": "work-negotiate-30",
                "service-crm": "work-service-31",
                "food-sensory": "work-food-32",
                "precise-adj": "work-adj-33",
            }[meta["table"]]
            title_zh = meta["titleZh"]
            title_en = meta["titleEn"]
            pool = work[meta["table"]]
            source = f"vocab:{meta['table']}"
            blurb = f"進階詞彙表「{meta['table']}」挖空練習。"
            questions = sample_questions(pool, qid, QUESTIONS_PER, require_example=False)
        elif kind == "mix":
            slug = f"mix-gre-work-{num}"
            title_zh = meta["titleZh"]
            title_en = meta["titleEn"]
            pool = gre_with_ex[:800] + [w for ws in work.values() for w in ws]
            source = "gre+vocab"
            blurb = "GRE 與職場詞彙混合填空。"
            # offset pool for 34 vs 35
            if num == 35:
                pool = gre_with_ex[800:1600] + [w for ws in work.values() for w in ws]
            questions = sample_questions(pool, qid, QUESTIONS_PER, require_example=False)
        elif kind == "gre_lookalike":
            slug = "review-gre-36"
            title_zh = meta["titleZh"]
            title_en = meta["titleEn"]
            pool = gre_look or gre_with_ex
            source = "gre"
            blurb = "優先選有形近詞組的 GRE 詞，干擾項偏形近。"
            prefer_la = True
            questions = sample_questions(pool, qid, QUESTIONS_PER, prefer_lookalike=True)
        elif kind == "gre_antonym":
            slug = "review-gre-37"
            title_zh = meta["titleZh"]
            title_en = meta["titleEn"]
            pool = gre_ant or gre_with_ex
            source = "gre"
            blurb = "題目來自具反義標註的 GRE 詞。"
            questions = sample_questions(pool, qid, QUESTIONS_PER)
        elif kind == "work_mix":
            slug = "review-work-38"
            title_zh = meta["titleZh"]
            title_en = meta["titleEn"]
            pool = [w for ws in work.values() for w in ws]
            source = "vocab"
            blurb = "五表職場詞彙綜合複習。"
            questions = sample_questions(pool, qid, QUESTIONS_PER, require_example=False)
        elif kind == "finale":
            slug = f"finale-{num}"
            title_zh = meta["titleZh"]
            title_en = meta["titleEn"]
            if meta["half"] == 0:
                pool = slices[0] + slices[min(9, len(slices) - 1)] + slices[min(19, len(slices) - 1)]
            else:
                pool = (
                    (detailed_chunks[0] if detailed_chunks else gre_with_ex[:200])
                    + [w for ws in work.values() for w in ws][:200]
                    + gre_look[:200]
                )
            source = "mixed"
            blurb = "總複習卷：混合先前範圍再測一次。"
            questions = sample_questions(pool, qid, QUESTIONS_PER, require_example=False)
        else:
            raise ValueError(kind)

        quizzes.append(
            {
                "id": qid,
                "num": num,
                "slug": slug,
                "series": meta["series"],
                "titleZh": title_zh,
                "titleEn": title_en,
                "blurb": blurb,
                "source": source,
                "questionCount": len(questions),
                "questions": questions,
            }
        )

    return {
        "version": 1,
        "sourcePlan": "quiz-bank-plan.md",
        "totalQuizzes": len(quizzes),
        "defaultQuestionCount": QUESTIONS_PER,
        "itemType": "cloze-3choice",
        "quizzes": quizzes,
    }


def main() -> None:
    data = build()
    # validate
    assert data["totalQuizzes"] == 40, data["totalQuizzes"]
    for qz in data["quizzes"]:
        assert qz["questionCount"] == QUESTIONS_PER, (qz["slug"], qz["questionCount"])
        for q in qz["questions"]:
            assert "______" in q["stem"], q["id"]
            assert len(q["choices"]) == 3, q["id"]
            assert q["answer"] in q["choices"], q["id"]
            assert q["explainZh"], q["id"]
            assert len(q.get("choiceExplains") or []) == 3, q["id"]

    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} ({data['totalQuizzes']} quizzes)")
    for qz in data["quizzes"]:
        print(f"  {qz['num']:02d} {qz['slug']}: {qz['questionCount']} qs")


if __name__ == "__main__":
    main()
