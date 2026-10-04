# 待補內容規劃｜慎重路線圖

> **狀態**：規劃文檔（討論用；尚未等於開工）  
> **目的**：盤點「已上線／僅有文檔／尚未開始」，並對 **Real Estate、Lifestyle** 等缺口提出可執行、可分期的補齊順序  
> **約束**：遵守 `rules.md` 三階段——**Phase 1 不加 Supabase／Sanity／Gemini／Telegram**；長圖文 Channel 預設 Phase 2  
> **更新日期**：2026-10-04

---

## 0. 先對齊：品牌標籤 ≠ 技術 Channel

站上標題常用：

`CFA · English · Real Estate · Lifestyle`

`rules.md` 長期 Channel 則是：

| rules 代號 | 名稱 | 與站上標籤的關係 |
|------------|------|------------------|
| `vault` | CFA | ＝ **CFA**（已上線） |
| `english` + `speak` | 英語／跟讀 | ＝ **English**（已上線；含文法） |
| `invest` | Investments & Tech | 部分重疊 **Real Estate**＋投資硬核（多數未做） |
| `culinary` | Culinary & Life | 接近 **Lifestyle**（未做） |
| `dispatch` | Global Dispatch | 旅遊／足跡（未做；可掛在 Lifestyle 或獨立） |

**建議定調（供討論）**

1. **對外標籤**維持四塊：`CFA` / `English` / `Real Estate` / `Lifestyle`（好懂）。  
2. **對內實作**仍可對應 rules 的 Channel，但 Real Estate **不要等 Phase 2 CMS**——它已是學習素材（glossary、文法場景），可先以 Phase 1 靜態方式上架。  
3. **Lifestyle** 若是「長圖文＋影像」，優先 Phase 2＋Sanity；若是「生活英語／跟讀腳本」，可留在 Phase 1 擴充 Speak／文法場景。

---

## 1. 現況盤點（截至目前）

### 1.1 已上線（可學）

| 模組 | 路徑／來源 | 成熟度 |
|------|------------|--------|
| CFA 詞庫＋三模式練習 | `/vault` · `Vnotes.md` | 高 |
| 英語句型庫＋組句 | `/english` · `english V.md` | 高 |
| 文法＋現代慣用語 36 課 | `/english/grammar` · `english grammar.md` | 高（初上架） |
| 跟讀常用口語 6 篇＋MP3 | `/speak` · `6r.md` | 中高（系列可擴） |
| 20 天計畫 | `/plan` | 中（內容固定，可再洗） |
| 今日儀表板＋底部導覽 | `/` | 高 |
| 搜尋／收藏／本機 SRS | `/search` `/saved` | 中 |

### 1.2 已有文檔、尚未上架

| 資產 | 檔案 | 建議 |
|------|------|------|
| 房地產術語表 | `real estate glossary.md` | **Phase 1 下一優先**：編譯上架為 `/real-estate` 或掛在 English／更多 |
| 文法打磨未決項 | `english grammar.md` 附錄 B | 練習自動批改、與句型庫雙向連結——可選，非阻塞 |

### 1.3 站上已預告、內容幾乎空白

| 標籤 | 現況 | 風險 |
|------|------|------|
| **Real Estate** | 「更多」頁虛位；文法課已大量使用房產英語；glossary 未掛站 | 使用者以為有專區卻點不到 |
| **Lifestyle** | 「更多」頁虛位；Speak／文法有生活場景，但無獨立頻道 | 名稱過大，易變成無底洞 |

### 1.4 rules 寫明、刻意未做（勿搶做）

| 項目 | 階段 | 說明 |
|------|------|------|
| Investments & Tech 長文 | Phase 2 | Sanity |
| Global Dispatch | Phase 2 | Sanity |
| Culinary & Life 長文 | Phase 2 | Sanity |
| 雲端進度／登入 | Phase 2 | Supabase |
| AI 助教／Telegram | Phase 3 | Gemini＋Bot |

---

## 2. 規劃原則（慎重）

1. **先補「已承諾的缺口」**：Real Estate glossary 已寫好卻未上架——這是信用問題，優先於開新坑。  
2. **一個模組一個真相來源**：延續 Markdown → build → JSON；不上 CMS 前不開雙重維護。  
3. **Real Estate ≠ 整站改成房仲 App**：先做「可學的詞＋句＋跟讀」，不做成交 CRM、估價計算器、地圖爬蟲。  
4. **Lifestyle 要窄定義**：第一版只做「生活英語／日常腳本／可跟讀」，不做完整生活風格雜誌。  
5. **不提前引入 Phase 2 技術**來「順便」做 Channel。  
6. **每期交付必須可獨立上線**，且不破壞 CFA／English 主路徑。  
7. **與現有資產交叉复用**：文法冊 5、glossary、Speak 結構一律重用，避免平行發明第三套句型格式。

---

## 3. 建議分期（內容優先，非整站重寫）

### 波次 A｜Phase 1 補洞（建議下一波，1–2 週量級）

**目標**：讓「Real Estate」從虛位變成可點、可學；信用對齊站名。

| 序 | 交付物 | 做法 | 完成定義 |
|----|--------|------|----------|
| A1 | **Real Estate Glossary 上架** | `real estate glossary.md` → `build-re.py` → `/real-estate`（或 `/english/real-estate`） | 可瀏覽分類、TTS 讀英文詞／例句、搜尋可找到、掌握度可標 |
| A2 | **導覽接線** | 更多頁虛位改成真連結；今日／English 可放次要入口 | 不再顯示「之後補」卻無路徑 |
| A3 | **Speak：不動產短篇（選做 2–3 篇）** | 新建 `speak-re.md` 或擴 `6r` 系列；音檔可用 **TTS**（與文法一致）或之後再補真人 | 列表出現「看房／驗屋／成交」系列 |
| A4 | **文法 ↔ glossary 輕連結** | 課文頁或 glossary 互相 `相關` 連過去（靜態） | 至少冊 5／高頻詞有連 |

**本波不做**

- 投資組合追蹤、租金試算、真實 MLS 資料  
- Lifestyle 雜誌版型  
- Sanity／帳號雲端  

---

### 波次 B｜Phase 1 加深 English／Speak（A 穩定後）

**目標**：Lifestyle 以「生活英語」落地，而非空泛品牌。

| 序 | 交付物 | 窄範圍建議 | 完成定義 |
|----|--------|------------|----------|
| B1 | **Lifestyle Speak 系列** | 6–8 篇：咖啡／聚餐／健身／旅行服務／居家維修預約等（可從文法 L29–32 擴寫） | `/speak` 可見 Lifestyle 系列＋TTS |
| B2 | **Lifestyle 詞塊小庫（可選）** | 80–120 個生活 chunks（不是長文）；格式近 glossary | `/lifestyle` 或掛 English 下第二 tab |
| B3 | **文法練習強化（可選）** | 36 課練習改選擇題／對錯可點選（仍本機） | 不必一次全改，可先冊 1 |
| B4 | **句型 ↔ 文法雙向連結（可選）** | `english V.md` 類別頁連到相關 grammar lesson | 附錄 B 未決項收斂 |

**Lifestyle 明確排除（本波）**

- 餐廳評鑑長文、食譜 CMS、旅遊相簿、無人機影片庫  

---

### 波次 C｜Phase 1 收斂體驗（內容夠用後）

| 序 | 項目 | 說明 |
|----|------|------|
| C1 | 今日儀表板加入「文法續讀／RE 詞複習」 | 與跟讀、計畫並列 |
| C2 | 20 天計畫是否納入文法課 | 慎重：避免計畫過重；可「每週 2 課文法」選配 |
| C3 | Real Estate 術語 vs CFA 投資詞去重說明 | 例如 appraisal／lien 在兩邊語境不同，加短註 |
| C4 | 文案與 rules Channel 表對齊 | 更新 `rules.md` §2：對外四標籤、對內模組表 |

---

### 波次 D｜Phase 2（技術升級後才做的「真 Channel」）

僅在 Phase 1 學習流穩定、你明確要長圖文時啟動。

| Channel（rules） | 對外可顯示為 | 內容型態 | 備註 |
|------------------|--------------|----------|------|
| `invest` | Real Estate／Invest 深度 | 產業筆記、交易復盤、硬核長文 | 與 Phase 1 glossary **分開**：詞庫留 MD；長文進 Sanity |
| `culinary` | Lifestyle · Food | 料理、餐廳、廚藝實驗 | |
| `dispatch` | Lifestyle · Travel 或獨立 | 足跡、飛行／無人機視角 | 影像資產要先有來源規範 |
| — | 雲端進度 | Supabase Auth＋mastery 同步 | 遷移本機資料需遷移計畫 |

**Phase 2 開工前檢查清單**

- [ ] Phase 1 Real Estate glossary 已上架且你有在用  
- [ ] Lifestyle 至少有 Speak 系列或小詞庫，名稱不再是空殼  
- [ ] 決定 Sanity 第一個 Channel（建議 **Culinary** 或 **Dispatch**，擇一）  
- [ ] 資料邊界寫進 rules：結構化學習 → Supabase；敘事圖文 → Sanity  

---

### 波次 E｜Phase 3（更後面）

- Gemini：文法／CFA 解析、造句批改  
- Telegram：每日一詞／一課推播、語音inbox  
- **不**用 Phase 3 技術填補 Phase 1 內容空洞  

---

## 4. Real Estate｜專章規劃

### 4.1 產品定位（建議一句話）

> 美式住宅／小型投資的**英語學習模組**：會讀文件、會看房談判、會跟讀情境——不是房仲後台。

### 4.2 內容層（由薄到厚）

| 層 | 內容 | 來源狀態 | 波次 |
|----|------|----------|------|
| L0 術語 | 分類 glossary＋例句＋TTS | `real estate glossary.md` 已有 | **A** |
| L1 情境跟讀 | 看房、驗屋、還價、成交、報修（2–6 篇） | 需新寫；可抽文法短文改寫 | A 選做／B |
| L2 談判句型 | 與 `english V.md` 不重複的 RE chunks | 需新寫或從文法慣用語包彙整 | B |
| L3 長文筆記 | 市場觀察、交易復盤 | Phase 2 Sanity（`invest`） | D |

### 4.3 資訊架構建議

```
/real-estate                 ← 總覽（詞庫入口＋跟讀系列入口）
/real-estate/glossary        ← 或直接總覽＝glossary
/speak?series=real-estate    ← 或 /speak 內第二系列
```

若擔心底部導覽過擠：**不要**新增第六個 tab；放在「更多」＋ English 次入口即可。

### 4.4 完成標準（Real Estate Phase 1）

- [ ] glossary 全站可開、可搜、可 TTS、可標記掌握  
- [ ] 「更多」不再顯示 Real Estate 為空虛位  
- [ ] 至少與文法課互相可發現（連結或搜尋）  
- [ ] 不引入後端  

---

## 5. Lifestyle｜專章規劃

### 5.1 產品定位（建議一句話）

> **生活英語與日常節奏**的練習場；長篇生活誌留到 Phase 2。

### 5.2 務必先選的「窄切口」（三選一作第一槍）

| 方案 | 切口 | 優點 | 風險 |
|------|------|------|------|
| **L-A（建議）** | Speak 生活系列 6–8 篇 | 與現有 Speak 同模組，成本低 | 不像「頻道」 |
| L-B | 生活 chunks 小詞庫 | 像 Real Estate glossary 對稱 | 又一個列表要維護 |
| L-C | 直接 Culinary 長文 | 品牌感強 | **違反 Phase 1**／需 Sanity |

**建議採 L-A**，對外仍可在「更多」顯示 Lifestyle → 連到 Speak 系列頁。

### 5.3 與 Real Estate 的邊界

| | Real Estate | Lifestyle |
|--|-------------|-----------|
| 場景 | 看房、契約、裝修、出租 | 餐飲、社交、旅行服務、居家日常 |
| 術語密度 | 高（專有名詞） | 低（chunks／口語） |
| 與 CFA | 弱相關（投資房可橋） | 幾乎無關 |
| 與文法 | 強（已大量出現） | 中（冊 5、生活例句） |

重疊（如「約時間」「遲到」）**只維護一份**（建議留在文法／Speak），兩邊用連結，不複製貼上。

### 5.4 完成標準（Lifestyle Phase 1 最小）

- [ ] 使用者從「更多 → Lifestyle」能進入真實內容（不是虛線框）  
- [ ] 至少 6 篇可跟讀（TTS 即可）  
- [ ] 不承諾「生活雜誌／食譜庫」直到 Phase 2  

---

## 6. 其他待補（次優先，避免失焦）

| 項目 | 優先 | 說明 |
|------|------|------|
| 文法練習自動批改 | 低 | 體驗加分；內容已可用 |
| english V ↔ grammar 雙向連結 | 低 | 便利；非新內容 |
| Speak 不動產系列真人 MP3 | 低 | TTS 已夠用；真人另排錄音檔期 |
| 20 天計畫改版納入文法／RE | 中低 | 易變重；先觀察使用再改 |
| CFA↔English 雙向連結 | 低 | rules 舊願景；有餘力再做 |
| Investments 非房產硬核（股票／科技產業） | Phase 2 | 勿與 RE glossary 混成一鍋 |
| Global Dispatch／Culinary 長文 | Phase 2 | |
| 雲端同步／AI／Telegram | Phase 2–3 | |

---

## 7. 建議決策題（討論後再寫進 rules／開工）

請你拍板這 6 題；答案會決定波次 A/B 的工單切法：

1. **Real Estate 路徑**：獨立 `/real-estate`，還是掛 `/english/real-estate`？  
2. **Lifestyle 第一槍**：是否同意 **Speak 生活系列（L-A）**，暫不做雜誌？  
3. **Glossary 上架範圍**：一次上現有全文，還是先上「看房＋成交」兩章？（建議一次上全文，成本已沉沒）  
4. **Speak 新系列音檔**：預設 TTS，還是堅持真人 MP3？  
5. **底部導覽**：維持 5 tab，RE／Lifestyle 只進「更多」？  
6. **Phase 2 第一個長文 Channel**：Culinary、Dispatch、還是 Invest？

---

## 8. 建議執行順序（結論）

```
現在（討論）
  → 拍板 §7
波次 A（Phase 1）
  → Real Estate glossary 上架＋導覽接線
  → （選）RE Speak 2–3 篇
波次 B（Phase 1）
  → Lifestyle = Speak 生活系列
  → （選）連結與練習強化
波次 C（Phase 1 收斂）
  → 今日儀表板／文案／rules 對齊
波次 D（Phase 2）
  → Sanity 長文 Channel＋Supabase 進度
波次 E（Phase 3）
  → Gemini＋Telegram
```

**一句話優先級**

> 先讓 **Real Estate 名實相符**（glossary 上架），再用 **Lifestyle Speak** 填生活口，長圖文與雲端一律後移。

---

## 9. 與本倉庫檔案的對應

| 檔案 | 角色 |
|------|------|
| `rules.md` | 階段與技術紅線（權威） |
| `pending content.md` | **本檔**：內容缺口與波次（討論用） |
| `real estate glossary.md` | RE L0 素材（待上架） |
| `english grammar.md` | 已上架；含 RE／生活場景 |
| `6r.md` | Speak 常用口語；未來可平行加系列檔 |
| `english V.md` / `Vnotes.md` | 已上架主庫 |

討論定案後：先改 `rules.md` §2／§4.2 對齊對外標籤，再開波次 A 實作。

*— End of planning draft —*
