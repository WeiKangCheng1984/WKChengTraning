# 141 全方位｜Omni Ledger

個人學習網站（CFA Level 1＋英語）。規則見 `rules.md`。

## Phase 1 網站

應用程式位於 [`web/`](./web/)。

```bash
cd web
npm install
npm run content   # 可選：從 Vnotes.md / english\ V.md 重建資料
npm run dev
```

部署：Vercel 專案 **Root Directory = `web`**。詳見 [`web/README.md`](./web/README.md)。

## 內容檔

| 檔案 | 用途 |
|------|------|
| `Vnotes.md` | CFA 專有名詞 |
| `english V.md` | 英語句型／片語 |
| `rules.md` | 產品與開發規則 |
