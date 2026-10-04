# 學習 — Phase 1

內容：CFA · English（Real Estate／Lifestyle 之後補）。  
技術範圍：**GitHub + Vercel**（無 Supabase／Sanity／Gemini／Telegram）。

## 內容來源

專案根目錄：

- `Vnotes.md` → CFA
- `english V.md` → English

建置前會編譯成 `web/src/data/*.json`。

## 本地開發

```bash
cd web
npm run content   # 從 Markdown 重新產生 JSON
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## 功能

- **CFA Vault**：十科目瀏覽、搜尋、發音、掌握度、閃卡
- **English Drill**：類別瀏覽、發音、看中文想英文、掌握度
- 進度存於瀏覽器 `localStorage`

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
