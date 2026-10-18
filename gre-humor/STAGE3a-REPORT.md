# 階段 S3a 完成報告｜pending-add 雙軌處理

> 日期：2026-10-18

## 做了什麼

1. 盤點幽默庫 pending-add（詞庫無的 headword）。
2. **高價值 GRE 向** → 寫入 `web/src/data/gre-vocabulary.json`，並產出鏡像 `GRE vocabulary-humor-supplement.md`。
3. **基礎／特規教學詞** → 不進主庫，成員標 `vocabStatus: deferred-basic-or-specialty`。
4. 重跑覆蓋率。

## 數字

| 項目 | 數值 |
|------|------|
| 處理前 pending | 129 |
| 補進主詞庫 JSON | **94** |
| 暫緩（幽默專用） | **35** |
| 主詞庫總詞數（後） | **3938** |

詳見 `pending-triage.json`。

## 暫緩原則（摘要）

- 過基礎、易稀釋 GRE 難詞密度：如 access / process / credit / reject…
- 特規／通俗／純字源教學：homeopathy / sociopath / telepathy
- 這些詞仍留在家族卡，可上課，但不計「主庫缺字」壓力。

## 下一步建議（S3b）

- 再擴 15～20 張 A/B 級家族，衝獨特詞 ≥ 500。
- 審讀 `GRE vocabulary-humor-supplement.md`，有誤再回修 JSON。

