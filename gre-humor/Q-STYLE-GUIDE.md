# Q 寫作樣板指南（幽默描述細膩化）

> 凍結：成員 `headword`、族 `id`／系列結構。  
> 打磨：`hook`／`script`／`roleInScript`／`speakLine*`／`reviewHooks`／`pitfalls`。

## 六條品質尺（必過）

1. **世界觀**：hook ≤60 字，含場景＋人設＋元素義  
2. **短劇**：script 80～220 字；成員以動作／道具入戲，少「詞＝定義」清單  
3. **角色**：`roleInScript` 是畫面名詞，且出現在 script 同場  
4. **跟讀**：可進課堂的例句；禁止 `Cue the…`／`gag sticks`／「出場梗就黏住」  
5. **易混**：pitfalls ≥1，點名鄰居或語意軸  
6. **口令**：reviewHooks 2～4 句

## Gold 樣板族（12）

| 角色 | id | 學什麼 |
|------|-----|--------|
| 字根金標 | `root-tract-01` | 字根動作貫穿每個成員 |
| 字根金標 | `root-tort-01` | 短、準、畫面清楚 |
| 押韻金標 | `rhyme-our-01` | 單一場景串完全族 |
| 押韻金標 | `rhyme-edge-01` | 押韻仍回扣詞義 |
| 語義金標 | `sem-flattery-01` | 對打兩邊同框 |
| 形近金標（薄→厚） | `look-abolish-01` | 先定語意軸：法／感／樓 |
| 形近對照 | `look-brandish-01` | Wave1 起打磨 |
| 字首 | `prefix-syn-01` | 字首調味仍要畫面 |
| 中期字根 | `root-noc-01` | 人設在，避免口吻單一 |
| 押韻 | `rhyme-vise-01` | 雙門世界觀要分線 |
| 語義 | `sem-talk-01` | 對打軸要寫進 hook |
| 字根 | `root-graph-01` | 道具位清楚 |

## 薄 → 厚（跟讀句）

**薄（禁止）**

```text
Cue the 廢法鈕: abolish walks on and the gag sticks.
請「廢法鈕」出場：abolish 一上場梗就黏住——廢除。
```

**厚（允許）**

```text
Slavery was abolished in the mid-19th century in America and in Russia.
美國與俄國於十九世紀中葉廢除了奴隸制。
```

優先順序：主庫 `exampleEn`／`example` → 自寫 GRE 閱讀語氣短句（必須含該 headword、對齊考意）。

## 形近族特別規則

- script 必須寫清**語意軸**（對象／意圖／結果差在哪）。  
- 不要只輪播「詞＝定義」。  
- 跟讀句用來「考場選邊」，不是報幕。

## Agent SOP（每族）

1. 讀 `senseAnchor`／主庫義  
2. 重寫 hook → script（成員入戲）→ 對齊 role  
3. 重寫每詞 speakLine（清模板）  
4. 補強 pitfalls／reviewHooks  
5. 同步 `lesson-*.json` 的鉤子／劇本／口令  
6. 標記 `qualityGate.polishStage`／`polishedAt`  
7. **不增刪 headword；不改 quiz answer**

## 工具

```bash
node web/scripts/gre-humor-q-lint.js
node web/scripts/gre-humor-q-polish-speak.js --top 25 --stage Q-wave1
node web/scripts/gre-humor-q-polish-speak.js --all-templates --stage Q-wave2
node web/scripts/build-gre-humor.js
```
