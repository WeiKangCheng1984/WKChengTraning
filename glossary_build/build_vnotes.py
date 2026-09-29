# -*- coding: utf-8 -*-
"""Build Vnotes.md glossary from subject modules."""
from __future__ import annotations

import importlib
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

SUBJECTS = [
    ("ethics", "01", "Ethics", "道德與專業準則", "重視法律、法規定義與行為邊界"),
    ("fsa", "02", "Financial Statement Analysis (FSA)", "財務報表分析", "會計科目、財務比率、IFRS vs. US GAAP 差異"),
    ("fixed_income", "03", "Fixed Income", "固定收益", "債券結構、殖利率曲線、利率風險指標"),
    ("derivatives", "04", "Derivatives", "衍生性工具", "合約類型、結算機制、定價與評價要素"),
    ("equity", "05", "Equity Investments", "權益投資", "市場架構、委託單指令、各類估值倍數"),
    ("portfolio", "06", "Portfolio Management", "投資組合管理", "投資者分類、IPS 限制、行為偏差與風險指標"),
    ("quant", "07", "Quantitative Methods", "量化方法", "統計量、機率分佈、假設檢定、機器學習"),
    ("corporate", "08", "Corporate Issuers", "公司金融", "資本結構、資金成本、公司治理架構"),
    ("economics", "09", "Economics", "經濟學", "宏觀經濟指標、貨幣政策、外匯市場"),
    ("alternatives", "10", "Alternative Investments", "另類投資", "私募基金結構、避險基金策略、實物資產"),
]


def load_terms(module_name: str):
    mod = importlib.import_module(module_name)
    terms = list(mod.TERMS)
    cleaned = []
    seen = set()
    for t in terms:
        if len(t) != 5:
            raise ValueError(f"{module_name}: bad tuple length {len(t)} for {t[:2]}")
        en, zh, definition, usage, example = t
        key = en.strip().lower()
        if key in seen:
            continue
        seen.add(key)
        ex = example.strip()
        if not (ex.startswith('"') and ex.endswith('"')):
            ex = f'"{ex.strip(chr(34))}"'
        cleaned.append((en.strip(), zh.strip(), definition.strip(), usage.strip(), ex))
    return cleaned


def render_term(idx: int, en: str, zh: str, definition: str, usage: str, example: str) -> str:
    return "\n".join(
        [
            f"### {idx}. {en}｜{zh}",
            f"- **定義**：{definition}",
            f"- **用法**：{usage}",
            f"- **英語會話例句**：{example}",
            "",
        ]
    )


def main() -> None:
    out_path = ROOT.parent / "Vnotes.md"
    sections = []
    summary_rows = []
    grand_total = 0
    global_id = 0

    for module_name, code, en_name, zh_name, focus in SUBJECTS:
        terms = load_terms(module_name)
        n = len(terms)
        grand_total += n
        summary_rows.append((code, zh_name, en_name, n, focus))
        block = [
            f"## {code}. {zh_name}（{en_name}）",
            "",
            f"> 本科目詞條數：**{n}**｜焦點：{focus}",
            "",
        ]
        for en, zh, definition, usage, example in terms:
            global_id += 1
            block.append(render_term(global_id, en, zh, definition, usage, example))
        sections.append("\n".join(block))

    header = f"""# CFA Level 1 專有名詞詞庫（學習網站用）

> 以 CFA Level 1 約 **1,500** 個核心名詞為主軸整理。  
> 本檔目前收錄：**{grand_total}** 筆。  
> 每筆含：**英文術語、中文譯名、定義、用法、英語會話例句**，便於之後匯入學習網站（閃卡、科目瀏覽、會話練習）。

---

## 使用說明（給網站開發）

建議解析規則（Markdown）：

1. 以 `## NN.` 開頭的標題為**科目**分節。
2. 以 `###` 開頭的標題為**詞條**；格式為 `{{全域編號}}. {{英文}}｜{{中文}}`。
3. 詞條下三個清單項：
   - `**定義**`：中文定義
   - `**用法**`：使用情境
   - `**英語會話例句**`：英文例句（含引號）
4. 若改為 JSON／資料庫，欄位建議：`id, subject_code, subject_zh, subject_en, term_en, term_zh, definition_zh, usage_zh, example_en`。

---

## 科目總覽

| 代碼 | 科目（中） | 科目（英） | 詞條數 | 學習焦點 |
|------|------------|------------|--------|----------|
"""
    for code, zh_name, en_name, n, focus in summary_rows:
        header += f"| {code} | {zh_name} | {en_name} | {n} | {focus} |\n"

    header += f"""
**合計：{grand_total} 筆**

---

## 原始分布參考（整理前綱要）

| 科目 | 約略目標量 | 代表性詞彙 |
|------|------------|------------|
| 道德與專業準則 (Ethics) | ~100 | Mosaic Theory, Material Nonpublic Information, Loyalty/Prudence/Care, Diligence and Reasonable Basis |
| 財務報表分析 (FSA) | ~300 | Goodwill, Carrying amount, Impairment, Capitalization, DSO, FIFO/LIFO |
| 固定收益 (Fixed Income) | ~250 | Indenture, Covenants, Spot/Forward curve, Effective Duration, Convexity, CDO |
| 衍生性工具 (Derivatives) | ~150 | Underlying, Forward commitment, Contingent claim, Mark-to-market, Moneyness |
| 權益投資 (Equity) | ~200 | Limit/Market/Stop order, Free Float, P/E, Multi-factor model, Enterprise Value |
| 投資組合管理 (Portfolio) | ~180 | IPS, Risk tolerance, Availability bias, Overconfidence bias, CAL |
| 量化方法 (Quant) | ~150 | CLT, Skewness, Kurtosis, Type I/II Error, p-value, Supervised learning |
| 公司金融 (Corporate Issuers) | ~120 | WACC, MM propositions, Operating/Financial leverage, NWC, Stakeholders |
| 經濟學 (Economics) | ~120 | PPP, Business Cycle, Leading/Lagging indicators, Real exchange rate, OMO |
| 另類投資 (Alternative Inv.) | ~80 | GP/LP, Carried interest, Hurdle rate, Real assets, DLT/Blockchain |

---

"""
    text = header + "\n".join(sections)
    out_path.write_text(text, encoding="utf-8")
    print(f"Wrote {out_path}")
    print(f"Total terms: {grand_total}")
    for code, zh_name, en_name, n, focus in summary_rows:
        print(f"  {code} {zh_name}: {n}")


if __name__ == "__main__":
    main()
