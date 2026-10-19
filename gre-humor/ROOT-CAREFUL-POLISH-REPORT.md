# 字根劇場例句仔細打磨報告

| 指標 | 結果 |
|------|------|
| 成員總數 | 1779 |
| 品質稽核問題 | **0** |
| 實驗室黑話殘留 | **0** |
| 胡謅／考試模板 | **0** |
| 缺頭詞 | **0** |
| 已 rebuild | `web/src/data/gre-humor.json`（321 clusters／4025 words） |

## 本輪做了什麼

1. **高優先**：清掉 prereg／estimand／codebook／unblinded 等實驗室口號句  
2. **短句**：把過短、口號式英文擴成可進課堂的完整例句  
3. **亂句／釋義複讀**：如 *reclusive* 樹蔭亂句、*condescending*「Consider this case」、中文只有「牽引。」等，全部改成義準對譯  
4. **複驗**：`gre-humor-audit-root-quality.js` + `gre-humor-scan-root-leftover.js` 皆通過  

## 原則

- 義準、語法正確、場景自然  
- 中文是完整對譯，不是 gloss 複讀  
- 不塞方法論文黑話進單字劇場  

## 腳本

- `web/scripts/gre-humor-polish-root-examples.js`（batch1）  
- `web/scripts/gre-humor-polish-root-examples-batch2.js`  
- `web/scripts/gre-humor-polish-root-examples-batch3.js`  
- `web/scripts/gre-humor-polish-root-examples-batch4.js`  
