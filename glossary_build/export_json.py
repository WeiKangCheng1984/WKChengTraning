# -*- coding: utf-8 -*-
"""Export glossary JSON and force-sync Vnotes.md."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "_vnotes_out.md"
DST = ROOT.parent / "Vnotes.md"

text = SRC.read_text(encoding="utf-8")
DST.write_text(text, encoding="utf-8")

subjects = []
current = None
term_re = re.compile(r"^### (\d+)\. (.+)｜(.+)$")

for line in text.splitlines():
    if line.startswith("## ") and len(line) > 5 and line[3:5].isdigit():
        m = re.match(r"^## (\d+)\. (.+)（(.+)）", line)
        if m:
            current = {
                "code": m.group(1),
                "name_zh": m.group(2),
                "name_en": m.group(3),
                "terms": [],
            }
            subjects.append(current)
            continue
    if current is None:
        continue
    if line.startswith("### "):
        m = term_re.match(line)
        if m:
            current["_pending"] = {
                "id": int(m.group(1)),
                "term_en": m.group(2),
                "term_zh": m.group(3),
                "definition_zh": "",
                "usage_zh": "",
                "example_en": "",
            }
    elif "_pending" in current:
        if line.startswith("- **定義**："):
            current["_pending"]["definition_zh"] = line.split("：", 1)[1]
        elif line.startswith("- **用法**："):
            current["_pending"]["usage_zh"] = line.split("：", 1)[1]
        elif line.startswith("- **英語會話例句**："):
            ex = line.split("：", 1)[1].strip()
            if len(ex) >= 2 and ex[0] == '"' and ex[-1] == '"':
                ex = ex[1:-1]
            current["_pending"]["example_en"] = ex
            current["terms"].append(current.pop("_pending"))

for s in subjects:
    s.pop("_pending", None)

payload = {
    "title": "CFA Level 1 Glossary",
    "total": sum(len(s["terms"]) for s in subjects),
    "subjects": subjects,
}
json_path = ROOT / "cfa_l1_glossary.json"
json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
print("synced", DST)
print("json", json_path, "terms", payload["total"])
