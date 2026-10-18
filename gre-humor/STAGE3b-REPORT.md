# 階段 S3b 完成報告｜擴編至 ≥500 獨特詞

> 日期：2026-10-19  
> 狀態：**完成（獨特詞 503）**

## 成果對照

| 指標 | S3a 結束 | S3b 結束 |
|------|----------|----------|
| 家族數 | 24 | **44** |
| 課檔數 | 24 | **44** |
| 獨特幽默詞 | 203 | **503** |
| 詞庫命中 | 168 | 244 |
| pending-add（幽默有主庫無／含暫緩） | 35+ | **259** |
| 距離 4,000 | ~3,797 | **3,497** |

## 本階段新增 20 族（皆 reviewed＋3 微題）

**字根劇場：** fer／port／pos／fac／cap／ten／scrib／struct／pend／pel／sent／sta／ven／vid／fin／dict／jud  

**其他：** rhyme-ain-01、sem-clear-01（清晰↔晦澀）、look-pair-01（形近對決包）

腳本：`web/scripts/gre-humor-stage3b-expand.js`

## 品質

- 延續 reviewed 閘門：劇本、雙語跟讀、口令、易混點、人工 3 題  
- 與既有家族 headword **去重**後寫入（例如 maintain 不重複主掛）

## 已知落差

- pending-add 回升至 259：S3b 新詞尚未跑一輪「S3a 式補庫」；建議下階段可再跑精簡補錄或接受暫緩分流。  
- 網站幽默 UI 仍未接線。
