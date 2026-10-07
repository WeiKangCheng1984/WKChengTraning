# 141 全方位｜學習

個人學習站：CFA · English · Real Estate · Lifestyle（Lifestyle 僅標籤預留）。  
規則與**現況凍結說明**見 [`rules.md`](./rules.md)。

## Phase 1 網站（已凍結可用）

應用程式位於 [`web/`](./web/)。

```bash
cd web
npm install
npm run content   # 可選：從各 Markdown 重建 JSON
npm run dev
```

部署：Vercel 專案 **Root Directory = `web`**。詳見 [`web/README.md`](./web/README.md)。

## 內容檔（已接上網站）

| 檔案 | 用途 |
|------|------|
| `Vnotes.md` | CFA 專有名詞 → `/vault` |
| `english V.md` | 英語句型／片語 → `/english` |
| `english grammar.md` | 文法 36 課 → `/english/grammar` |
| `6r.md` | 跟讀腳本 → `/speak` |
| `real estate glossary.md` | 房產術語 → `/real-estate` |
| `4big.md` | 會話公式 → `/english/conversation` |
| `style.md` | 美式風格句型 → `/english/style` |
| `vocabulary.md` | 進階詞彙（約 1500）→ `/english/vocab` |
| `rules.md` | 產品與開發規則 |
