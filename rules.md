# 專案規則｜全方位學習網站

> 本檔是產品方向、範圍與開發約束的單一來源。  
> **分三階段推進**；未到的階段預設不做。變更範圍時先更新本檔再動手。  
> **內容缺口與補齊波次**見 `pending content.md`（討論用；定案後再改本檔對齊）。

---

## 1. 產品願景

打造個人向的「學習 × 生活」網站，長期涵蓋：

- **CFA Level 1**：專有名詞、考點理解、背誦與掌握度追蹤
- **英語學習**：句型／片語／會話（日常＋職場）與發音練習
- **料理、餐廳與廚藝／旅遊足跡／產業觀察**（第二階段起再擴）

**設計原則**

- 先能用、再擴資料層、最後才上 AI 與 Bot
- 每一階段結束都必須有**可獨立上線**的版本
- 學習流程專注：瀏覽 → 聽發音 → 背誦／測驗 → 標記掌握度
- 介面文案預設**繁體中文**；英文術語與例句保留英文

---

## 2. 內容五大塊（長期 Channels）

名稱可作導覽；**第一階段只實作 Vault＋English**，其餘先留入口或隱藏。

| 代號 | 名稱 | 定位 | 何時啟動 |
|------|------|------|----------|
| `vault` | **CFA Vault** | CFA 備考旗艦庫（單字／名詞） | **Phase 1** |
| `english` | **English Drill** | 個人英語學習（句型、片語、會話） | **Phase 1** |
| `invest` | **Investments & Tech** | 硬核產業與實盤投資 | Phase 2 |
| `dispatch` | **Global Dispatch** | 全球足跡與無人機視角 | Phase 2 |
| `culinary` | **Culinary & Life** | 風味實驗與生活風格 | Phase 2 |
| `speak` | **Speak Track（跟讀軌）** | 短文＋真人錄音跟讀 | **Phase 1（常用口語 6 篇）** |

**Phase 1 跨區塊關係**

- CFA 詞條的英語例句 ↔ English Drill 可互相參考（有餘力再做雙向連結）
- 兩個模組共用同一套「發音／掌握度／背誦」互動模式，降低學習成本
- `speak` 以跟讀為主：整段真人 MP3＋逐句 TTS 預練；之後可再加不動產系列

---

## 3. 三階段總覽（必讀）

| 階段 | 技術 | 產品重點 |
|------|------|----------|
| **Phase 1** | **GitHub + Vercel 而已** | CFA 單字庫＋個人英語學習站（靜態／前端為主） |
| **Phase 2** | ＋**Supabase**＋**Sanity** | 雲端進度、題庫擴充、長圖文 Channel、大量改良 |
| **Phase 3** | ＋**Gemini API**＋**Telegram Bot** | AI 助教、每日推播、靈感捕捉、發文廣播等花樣 |

---

## 4. Phase 1｜CFA 單字庫＋個人英語學習站

### 4.1 技術範圍（嚴格限制）

**只用：**

- **GitHub**：版控、原始碼、內容檔案
- **Vercel**：建置與託管網站（建議 Next.js 或同等靜態／SSR 框架）

**本階段禁止引入：** Supabase、Sanity、Gemini API、Telegram Bot、自架後端資料庫。  
需要「記住進度」時，優先用 **瀏覽器 localStorage**（或同等前端儲存）；接受換瀏覽器／清快取會遺失，留待 Phase 2 上雲。

### 4.2 內容來源（唯二主資料）

| 檔案 | 用途 | 網站模組 |
|------|------|----------|
| `Vnotes.md` | CFA Level 1 專有名詞（定義、用法、英語例句） | **CFA Vault** |
| `english V.md` | 英語句型／片語／情境例句（生活＋工作） | **English Drill** |
| `6r.md` | 常用口語 6 篇英文腳本（建置時補中文） | **Speak Track** |
| `web/public/audio/speak/common/*.mp3` | 常用口語真人錄音（自行放置） | **Speak Track** |
| `english grammar.md` | 文法＋現代慣用語 36 課（生活／房產例句＋每課跟讀短文；TTS） | **English → 文法** `/english/grammar` |
| `real estate glossary.md` | 美式房地產術語獨立表（中英） | **Real Estate** `/real-estate` |

輔助（可選，不取代上述兩檔）：

- `glossary_build/cfa_l1_glossary.json`：若解析 Markdown 不便，可作為 CFA 匯入中介格式
- 建置時把 Markdown／JSON **編譯進網站資料**（靜態 JSON、或建置腳本產出），部署後不依賴執行期讀本機檔

內容更新流程：改 Markdown → 重新建置／部署 → 網站更新。

### 4.3 必做功能

#### A. CFA Vault（來自 `Vnotes.md`）

- 依科目瀏覽（Ethics、FSA、Fixed Income…）
- 詞條詳情：英文、中文、定義、用法、英語會話例句
- 搜尋（英文／中文）
- **點選圖示播放英語發音**（術語與／或例句；可用瀏覽器 Web Speech API 或免費 TTS，不需自架語音服務）
- **背誦模式**：例如閃卡（正面英文／背面中文＋定義）、顯示／隱藏答案
- **知識掌握標記**：至少三態（例如：未學／學習中／已掌握），存前端；可篩選「只背未掌握」

#### B. English Drill（來自 `english V.md`）

- 依類別／階段瀏覽（檔內既有分類結構）
- 句型或片語詳情：說明、注意點、生活例句、工作例句
- **點選圖示播放英語發音**（句型本體與例句）
- **背誦／練習**：遮句練習、看中文回想英文、或聽音複誦提示
- **知識掌握標記**：同上，可依類別看進度

#### C. 全站（Phase 1）

- **平板優先（方案一）**：底部導覽（今日／跟讀／CFA／英語／更多）；首頁＝「今日學習」儀表板（一鍵進今日計畫、繼續跟讀、到期複習）
- 觸控目標 ≥ 44px；平板／桌面加大字級；列表多用兩欄減少捲動
- 響應式：手機與桌面可用
- 簡單進度總覽（本機）：已掌握數量、學習中數量即可
- README：如何 `dev`、如何 deploy 到 Vercel、內容檔如何更新

### 4.4 Phase 1 完成標準

- [x] 網站專案已建立於 `web/`（GitHub 推送後，Vercel Root Directory 設 `web` 即可部署）
- [x] 能完整瀏覽並學習 `Vnotes.md` 與 `english V.md` 的內容
- [x] 發音按鈕可點、背誦流程可走完、掌握度可標記並在重新整理後仍在（同一瀏覽器）
- [x] **沒有**依賴 Supabase／Sanity／Gemini／Telegram
- [x] 借鏡 Cadence：20 天計畫、CFA 三模式、英語組句、跨層說明、搜尋／收藏、輕量間隔評分
- [x] 平板方案一：底部導覽＋今日學習首頁
- [x] P0 英語體驗：今日英語套餐、文法／跟讀進到期複習、`/real-estate` glossary
- [x] 每日一小時獎勵：自動計時、連續達標、徽章（`/rewards`）

### 4.6 Cadence 借鏡（已納入 Phase 1）

| Cadence 優勢 | Omni Ledger 對應 |
|--------------|------------------|
| 日計畫打包多層素材 | `/plan` 20 天：每日 CFA 一科＋英語一類＋跨層說明 |
| 單字三模式 | `/vault/practice` 聽詞想義／看義選詞／例句填空 |
| 組句與跟讀 | English Assemble：情境 → 骨架 → 組裝句發音 |
| 間隔複習評分 | 再練／記得／很熟 → 本機 SRS |
| 搜尋／收藏 | `/search`、`/saved` |
| 跟讀短文（方案 A） | `/speak`：常用口語 6 篇；MP3 放 `public/audio/speak/common/` |

### 4.5 Phase 1 非目標

- 雲端帳號登入、多裝置同步
- 錯題雲端統計、完整商用級 SRS（本機已有輕量間隔評分）
- 五大 Channel 的長圖文／CMS
- AI 解析、Telegram 推播

---

## 5. Phase 2｜Supabase＋Sanity，擴張與大量改良

在 Phase 1 穩定後才開始。

### 5.1 新增技術

| 技術 | 用途 |
|------|------|
| **Supabase** | 詞庫／單字結構化儲存、掌握度與答題雲端同步、（可選）Auth |
| **Sanity** | 長篇圖文：Investments & Tech、Global Dispatch、Culinary & Life |

### 5.2 預期工作（方向，細節開做時再拆）

- 將 Phase 1 的靜態詞庫與本機進度**遷移／同步**到 Supabase
- 開啟其餘 Channels 的內容模型與列表／內文頁
- 搜尋、篩選、儀表板、錯題本等體驗大改
- CFA ↔ English、Culinary 詞彙 ↔ English 等跨連結強化
- 資料邊界：結構化學習資料 → Supabase；敘事圖文 → Sanity；避免雙重真相來源

### 5.3 Phase 2 完成標準（草案）

- 進度可跨裝置（登入後）
- 至少一個 Sanity Channel（建議 Culinary 或 Dispatch）可發布並在網站閱讀
- Phase 1 既有學習流不退步

---

## 6. Phase 3｜Gemini API＋Telegram Bot，變出更多花樣

在 Phase 2 資料層就緒後才開始。

### 6.1 新增技術

| 技術 | 用途 |
|------|------|
| **Gemini API** | 考點／句型解析、靈感格式化、站內 AI 助教 |
| **Telegram Bot** | 每日抽題、語音／文字捕捉、稍後複習、發文推播 |

### 6.2 目標聯動場景

1. **雙向做題**：排程抽題 → Telegram 作答 → 寫回 Supabase → 網站進度更新；Gemini 給短解析  
2. **隨手捕捉**：Telegram 文字／語音 → Gemini 整理成單字卡或草稿 → Supabase／Sanity  
3. **站內助教**：做題／看詞條時詢問 AI；可「送到 Telegram 稍後複習」  
4. **發文廣播**：Sanity 發布 → Webhook → Telegram 通知  

### 6.3 安全

- API Key、Bot Token、DB URL 只放環境變數，禁止進 repo  
- Webhook 須驗證來源  
- AI 內容標示為輔助；CFA 避免「保證考過」表述；投資文需「非投資建議」免責  

---

## 7. UX／UI 約束

- **Phase 1 首屏／標題**：用內容名（CFA · English · Real Estate · Lifestyle），勿用 Omni Ledger／Cadence 等無意義品牌詞  


- 學習頁強調專注：詞條／卡片、發音按鈕、掌握標記；少裝飾干擾  
- 發音控制必須一眼可點（圖示按鈕），並有播放中狀態  
- 必須桌面與手機可用  
- 避免泛用紫白漸層與空洞儀表板風；生活／圖文頁到 Phase 2 再加強視覺  

---

## 8. 工程與協作規則

- **對齊階段**：commit／PR／任務說明須標明 `Phase 1` / `Phase 2` / `Phase 3`
- **小步提交**：一次只做當前階段內的一個切片
- **不要擅自引入下階段技術**（例如 Phase 1 就接 Supabase）— 除非使用者明確要求並先改本檔
- **內容可重建**：保留 Markdown → 網站資料的轉換腳本，可重跑
- 階段結束更新 README
- 規則與臨時指令衝突時：**臨時明確指令優先**，並提醒是否回寫本檔

### 給 AI／協作者的執行順序

1. 確認任務屬於哪一 **Phase**、哪個模組（`vault` / `english` / …）  
2. 讀本檔對應章節；Phase 1 再讀 `Vnotes.md`、`english V.md`  
3. 只實作範圍內項目；完成後說明：做了什麼、如何驗證、下一步建議（一項）  

---

## 9. 非目標（全專案目前不做，除非另開需求）

- 商業訂閱金流、多租戶 SaaS  
- 原生 iOS／Android App（網站＋之後 Telegram 即可）  
- 完整商用 CFA 模擬考題庫  
- 一次做完三階段所有功能  

---

## 10. 版本紀錄

| 日期 | 說明 |
|------|------|
| 2026-09-29 | 初版：多 Phase 細切＋五大 Channel＋完整技術聯動構想 |
| 2026-09-29 | **改寫為三階段**：① GitHub+Vercel 做 CFA／英語學習（發音、掌握、背誦；資料源 `Vnotes.md`＋`english V.md`）② Supabase+Sanity 擴張 ③ Gemini+Telegram 花樣 |
