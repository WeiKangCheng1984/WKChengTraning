# 階段 S3c＋網站接入 完成報告

> 日期：2026-10-19

## S3c pending 分流

| 項目 | 數值 |
|------|------|
| 處理前 pending | 259 |
| 補進主詞庫 JSON | **224** |
| 暫緩（幽默專用） | **35** |
| 主詞庫總數 | **4,162** |
| 幽默→主庫命中 | **468／503** |

## 網站幽默模式

- 索引：`/english/gre/humor`
- 家族課：`/english/gre/humor/[slug]`（44 堂）
- 資料：`web/src/data/gre-humor.json`（`node web/scripts/build-gre-humor.js`）
- 入口：English 首頁、GRE 單字頁

### 課頁內容

鉤子、串記劇本、全詞卡（義錨／角色／英中例句）、3 題互動快測、口令、易混點；**headword／例句／選項／口令**皆可 TTS（標準＋慢速）。
