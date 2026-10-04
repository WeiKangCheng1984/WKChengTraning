# 學習 — Phase 1

內容：CFA · English（Real Estate／Lifestyle 之後補）。  
技術範圍：**GitHub + Vercel**（無 Supabase／Sanity／Gemini／Telegram）。

## 內容來源

專案根目錄：

- `Vnotes.md` → CFA
- `english V.md` → English 句型
- `english grammar.md` → `/english/grammar` 文法 36 課（TTS）
- `real estate glossary.md` → `/real-estate`

建置前可跑 `npm run content` 編譯成 `web/src/data/*.json`。

## 本地開發

```bash
cd web
npm run content   # 從 Markdown 重新產生 JSON
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## 功能

- **CFA Vault**：十科目瀏覽、搜尋、發音、掌握度、閃卡
- **English**：今日套餐 `/english/today`、文法 36 課、句型組句、到期複習 `/english/review`
- **Real Estate**：術語＋高頻句 `/real-estate`（TTS）
- 進度存於瀏覽器 `localStorage`（標掌握度會進入 SRS 複習）


## 部署到 Vercel

1. 將整個 repo 推上 GitHub
2. 在 Vercel Import 專案
3. **Root Directory** 設為 `web`
4. Build Command：`npm run build`（已含 content 編譯）
5. 部署

或於 `web` 目錄使用 Vercel CLI：

```bash
cd web
npx vercel
```

## 更新內容

1. 編輯根目錄 `Vnotes.md` 或 `english V.md`
2. 在 `web` 執行 `npm run content`（或直接 `npm run build`）
3. 推送 GitHub → Vercel 自動部署
