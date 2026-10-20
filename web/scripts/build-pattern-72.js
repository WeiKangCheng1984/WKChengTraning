/**
 * Build 句型模板-72x12.md from curated templates + slot swaps.
 * node web/scripts/build-pattern-72.js
 */
const fs = require("fs");
const path = require("path");

function item(meta, pairs, expected = 12) {
  if (pairs.length !== expected) {
    throw new Error(`${meta.id} has ${pairs.length} rows, expected ${expected}`);
  }
  return { ...meta, rows: pairs };
}

/** @type {Array<{id:string,title:string,blurb:string,items:any[]}>} */
const LEVELS = [];

function level(id, title, blurb, items) {
  if (items.length !== 12) throw new Error(`${id} count ${items.length}`);
  LEVELS.push({ id, title, blurb, items });
}

level(
  "L1",
  "入門 · 意願與日常動作",
  "單句、現在或過去習慣。抽換的是動詞與對象，不疊條件子句。",
  [
    item(
      {
        id: "L1-01",
        source: "en-1",
        pattern: "I'm planning to...",
        zhName: "我計劃要…",
        note: "後接原形動詞。可再加時間或地點。",
        swap: "動詞片語、時間",
      },
      [
        ["I'm planning to review my notes after dinner.", "我計劃晚餐後複習筆記。"],
        ["I'm planning to call my parents this weekend.", "我計劃這週末打電話給父母。"],
        ["I'm planning to finish the report before Friday.", "我計劃週五前寫完報告。"],
        ["I'm planning to walk to the office tomorrow.", "我計劃明天走路去辦公室。"],
        ["I'm planning to cook a simple soup tonight.", "我計劃今晚煮一鍋簡單的湯。"],
        ["I'm planning to visit the museum on Sunday.", "我計劃週日去博物館。"],
        ["I'm planning to start a new notebook this month.", "我計劃這個月開始一本新筆記。"],
        ["I'm planning to ask my manager for feedback.", "我計劃向主管要回饋。"],
        ["I'm planning to water the plants before I leave.", "我計劃出門前先澆花。"],
        ["I'm planning to read one chapter before bed.", "我計劃睡前讀一章。"],
        ["I'm planning to book the train ticket tonight.", "我計劃今晚訂火車票。"],
        ["I'm planning to practice speaking for ten minutes.", "我計劃練十分鐘口說。"],
      ],
    ),
    item(
      {
        id: "L1-02",
        source: "en-3",
        pattern: "I feel like...",
        zhName: "我想／我有心情…",
        note: "後接 V-ing 或名詞。",
        swap: "活動、食物、地點",
      },
      [
        ["I feel like taking a short walk.", "我想出去走一小段。"],
        ["I feel like having tea instead of coffee.", "我想喝茶，不想喝咖啡。"],
        ["I feel like staying in tonight.", "我今晚想待在家。"],
        ["I feel like listening to quiet music.", "我想聽安靜的音樂。"],
        ["I feel like writing in my journal.", "我想寫日記。"],
        ["I feel like ordering noodles for lunch.", "午餐我想叫麵。"],
        ["I feel like sitting by the window.", "我想坐在窗邊。"],
        ["I feel like calling an old friend.", "我想打給一位老朋友。"],
        ["I feel like a break after this meeting.", "這場會後我想休息一下。"],
        ["I feel like reading something light.", "我想讀輕鬆一點的東西。"],
        ["I feel like cooking rice and eggs.", "我想煮白飯配蛋。"],
        ["I feel like leaving the office early today.", "我今天想早點離開辦公室。"],
      ],
    ),
    item(
      {
        id: "L1-03",
        source: "en-7",
        pattern: "I'm about to...",
        zhName: "我正要…",
        note: "後接原形動詞，表示即將發生。",
        swap: "即將做的動作",
      },
      [
        ["I'm about to leave the house.", "我正要出門。"],
        ["I'm about to start the meeting.", "我正要開始開會。"],
        ["I'm about to send the email.", "我正要寄出這封信。"],
        ["I'm about to turn off the lights.", "我正要關燈。"],
        ["I'm about to boil the water.", "我正要燒開水。"],
        ["I'm about to lock the door.", "我正要鎖門。"],
        ["I'm about to print the slides.", "我正要列印投影片。"],
        ["I'm about to call the client.", "我正要打給客戶。"],
        ["I'm about to catch the bus.", "我正要去趕公車。"],
        ["I'm about to close the shop.", "我正要打烊。"],
        ["I'm about to save the file.", "我正要存檔。"],
        ["I'm about to step into the classroom.", "我正要走進教室。"],
      ],
    ),
    item(
      {
        id: "L1-04",
        source: "en-8",
        pattern: "I used to...",
        zhName: "我以前常常…",
        note: "後接原形動詞。指過去習慣，現在已不這樣。",
        swap: "過去習慣",
      },
      [
        ["I used to walk to school every morning.", "我以前每天早上走路去學校。"],
        ["I used to drink milk before bed.", "我以前睡前喝牛奶。"],
        ["I used to keep a paper diary.", "我以前用紙本寫日記。"],
        ["I used to take the night bus home.", "我以前搭夜車回家。"],
        ["I used to play basketball after class.", "我以前下課後打籃球。"],
        ["I used to live near the river.", "我以前住在河邊。"],
        ["I used to skip breakfast on weekdays.", "我以前平日不吃早餐。"],
        ["I used to study in the library until ten.", "我以前在圖書館讀到十點。"],
        ["I used to call my grandmother on Sundays.", "我以前週日打電話給祖母。"],
        ["I used to carry a heavy backpack.", "我以前背很重的書包。"],
        ["I used to write letters by hand.", "我以前用手寫信。"],
        ["I used to wake up before sunrise.", "我以前日出前就起床。"],
      ],
    ),
    item(
      {
        id: "L1-05",
        source: "en-2",
        pattern: "I'm looking forward to...",
        zhName: "我很期待…",
        note: "to 後接名詞或 V-ing，不接原形動詞。",
        swap: "期待的事",
      },
      [
        ["I'm looking forward to the weekend.", "我很期待週末。"],
        ["I'm looking forward to seeing my sister.", "我很期待見到妹妹。"],
        ["I'm looking forward to the concert.", "我很期待那場演唱會。"],
        ["I'm looking forward to trying the new cafe.", "我很期待去那間新咖啡店。"],
        ["I'm looking forward to a quiet evening.", "我很期待一個安靜的晚上。"],
        ["I'm looking forward to the team dinner.", "我很期待團隊聚餐。"],
        ["I'm looking forward to reading your draft.", "我很期待讀你的草稿。"],
        ["I'm looking forward to the spring break.", "我很期待春假。"],
        ["I'm looking forward to meeting the new colleague.", "我很期待認識新同事。"],
        ["I'm looking forward to a long walk.", "我很期待走一段長路。"],
        ["I'm looking forward to the holiday market.", "我很期待假日市集。"],
        ["I'm looking forward to finishing this course.", "我很期待把這門課修完。"],
      ],
    ),
    item(
      {
        id: "L1-06",
        source: "en-19",
        pattern: "I intend to...",
        zhName: "我打算…",
        note: "比 I'm planning to 稍正式。後接原形動詞。",
        swap: "打算做的事",
      },
      [
        ["I intend to submit the form today.", "我打算今天交表。"],
        ["I intend to speak more slowly.", "我打算把話講慢一點。"],
        ["I intend to save part of my salary.", "我打算存下一筆薪水。"],
        ["I intend to ask a clear question.", "我打算問一個清楚的問題。"],
        ["I intend to leave at six.", "我打算六點離開。"],
        ["I intend to rewrite the opening.", "我打算重寫開頭。"],
        ["I intend to learn twenty new words.", "我打算學二十個新單字。"],
        ["I intend to keep the promise.", "我打算遵守這個承諾。"],
        ["I intend to take the earlier train.", "我打算搭早一班火車。"],
        ["I intend to check the numbers twice.", "我打算把數字核對兩次。"],
        ["I intend to rest this afternoon.", "我打算今天下午休息。"],
        ["I intend to join the study group.", "我打算加入讀書會。"],
      ],
    ),
    item(
      {
        id: "L1-07",
        source: "en-20",
        pattern: "I've been meaning to...",
        zhName: "我一直想…（卻還沒做）",
        note: "後接原形動詞。",
        swap: "拖延已久的事",
      },
      [
        ["I've been meaning to thank you.", "我一直想謝謝你。"],
        ["I've been meaning to clean my desk.", "我一直想整理桌子。"],
        ["I've been meaning to reply to that email.", "我一直想回那封信。"],
        ["I've been meaning to visit the dentist.", "我一直想去看牙醫。"],
        ["I've been meaning to organize my photos.", "我一直想整理照片。"],
        ["I've been meaning to return the book.", "我一直想還書。"],
        ["I've been meaning to fix the lamp.", "我一直想修那盞燈。"],
        ["I've been meaning to call the landlord.", "我一直想打給房東。"],
        ["I've been meaning to update my resume.", "我一直想更新履歷。"],
        ["I've been meaning to water the herbs.", "我一直想給香草澆水。"],
        ["I've been meaning to ask you a favor.", "我一直想請你幫個忙。"],
        ["I've been meaning to start that novel.", "我一直想開始讀那本小說。"],
      ],
    ),
    item(
      {
        id: "L1-08",
        source: "en-12",
        pattern: "I happen to...",
        zhName: "我剛好…",
        note: "後接原形動詞。",
        swap: "碰巧擁有的資訊或物品",
      },
      [
        ["I happen to know the address.", "我剛好知道地址。"],
        ["I happen to have an extra pen.", "我剛好多一枝筆。"],
        ["I happen to live nearby.", "我剛好住在附近。"],
        ["I happen to remember the date.", "我剛好記得日期。"],
        ["I happen to speak a little Japanese.", "我剛好會一點日文。"],
        ["I happen to have the receipt.", "我剛好有收據。"],
        ["I happen to know her brother.", "我剛好認識她哥哥。"],
        ["I happen to be free after three.", "我剛好三點後有空。"],
        ["I happen to have read that article.", "我剛好讀過那篇文章。"],
        ["I happen to sit next to the window.", "我剛好坐在窗邊。"],
        ["I happen to have the spare key.", "我剛好有備用鑰匙。"],
        ["I happen to know a quiet cafe.", "我剛好知道一間安靜的咖啡店。"],
      ],
    ),
    item(
      {
        id: "L1-09",
        source: "en-9",
        pattern: "I'm getting used to...",
        zhName: "我漸漸習慣…",
        note: "後接名詞或 V-ing。",
        swap: "正在適應的新情況",
      },
      [
        ["I'm getting used to the new schedule.", "我漸漸習慣新的作息。"],
        ["I'm getting used to waking up early.", "我漸漸習慣早起。"],
        ["I'm getting used to the city noise.", "我漸漸習慣城市的噪音。"],
        ["I'm getting used to speaking in meetings.", "我漸漸習慣在會議裡發言。"],
        ["I'm getting used to the cold mornings.", "我漸漸習慣寒冷的早晨。"],
        ["I'm getting used to working from home.", "我漸漸習慣在家工作。"],
        ["I'm getting used to the smaller kitchen.", "我漸漸習慣這間較小的廚房。"],
        ["I'm getting used to reading on a screen.", "我漸漸習慣在螢幕上閱讀。"],
        ["I'm getting used to the long commute.", "我漸漸習慣漫長的通勤。"],
        ["I'm getting used to spicy food.", "我漸漸習慣辣的食物。"],
        ["I'm getting used to the new software.", "我漸漸習慣新的軟體。"],
        ["I'm getting used to living alone.", "我漸漸習慣一個人住。"],
      ],
    ),
    item(
      {
        id: "L1-10",
        source: "en-18",
        pattern: "I'm passionate about...",
        zhName: "我對…很有熱情",
        note: "後接名詞或 V-ing。",
        swap: "興趣領域",
      },
      [
        ["I'm passionate about teaching.", "我對教學很有熱情。"],
        ["I'm passionate about local history.", "我對地方史很有熱情。"],
        ["I'm passionate about cooking for friends.", "我很喜歡為朋友下廚。"],
        ["I'm passionate about clear writing.", "我對清楚的寫作很有熱情。"],
        ["I'm passionate about city parks.", "我很在意城市公園。"],
        ["I'm passionate about learning languages.", "我對學語言很有熱情。"],
        ["I'm passionate about handmade pottery.", "我對手工陶器很有熱情。"],
        ["I'm passionate about public libraries.", "我很在乎公共圖書館。"],
        ["I'm passionate about street photography.", "我對街頭攝影很有熱情。"],
        ["I'm passionate about helping new students.", "我很樂意幫助新生。"],
        ["I'm passionate about seasonal food.", "我很在意當季食材。"],
        ["I'm passionate about quiet design.", "我對安靜、不花俏的設計很有熱情。"],
      ],
    ),
    item(
      {
        id: "L1-11",
        source: "en-64",
        pattern: "At the moment...",
        zhName: "目前…",
        note: "放句首或句中，說明現在的狀態。",
        swap: "當下狀態",
      },
      [
        ["At the moment, I'm in the library.", "目前我在圖書館。"],
        ["At the moment, the shop is closed.", "目前店是關的。"],
        ["At the moment, she is on a call.", "她目前正在通話。"],
        ["At the moment, we have no extra chairs.", "目前我們沒有多餘的椅子。"],
        ["At the moment, the train is delayed.", "目前火車延誤。"],
        ["At the moment, I'm learning this pattern.", "我目前正在學這個句型。"],
        ["At the moment, the kitchen is busy.", "目前廚房很忙。"],
        ["At the moment, he is out of the office.", "他目前不在辦公室。"],
        ["At the moment, the price is lower.", "目前價格比較低。"],
        ["At the moment, I can't take new work.", "目前我無法再接新工作。"],
        ["At the moment, the street is quiet.", "目前街上很安靜。"],
        ["At the moment, the file is still open.", "目前檔案還開著。"],
      ],
    ),
    item(
      {
        id: "L1-12",
        source: "en-62",
        pattern: "Every now and then...",
        zhName: "偶爾…",
        note: "頻率副詞片語，後接完整句。",
        swap: "偶爾做的事",
      },
      [
        ["Every now and then, I bake bread.", "我偶爾會烤麵包。"],
        ["Every now and then, she visits the old bookstore.", "她偶爾會去那間舊書店。"],
        ["Every now and then, we eat out.", "我們偶爾外食。"],
        ["Every now and then, he writes a long letter.", "他偶爾會寫一封長信。"],
        ["Every now and then, the bus is late.", "公車偶爾會晚到。"],
        ["Every now and then, I reread my notes.", "我偶爾會重讀筆記。"],
        ["Every now and then, they play cards.", "他們偶爾打牌。"],
        ["Every now and then, I take a day off.", "我偶爾放一天假。"],
        ["Every now and then, the wifi drops.", "網路偶爾會斷。"],
        ["Every now and then, she sings in the kitchen.", "她偶爾在廚房唱歌。"],
        ["Every now and then, we lose a pen.", "我們偶爾會弄丟筆。"],
        ["Every now and then, I miss my hometown.", "我偶爾會想念家鄉。"],
      ],
    ),
  ],
);

function render() {
  const lines = [];
  lines.push("# 句型模板教材 · L0–L6");
  lines.push("");
  lines.push("> L0 是中小學口語：100 個最常用模板，每個 **8** 句。");
  lines.push("> L1–L6 來自站內英語句型庫 `web/src/data/english.json`（類別一至七）：72 個模板，每個 **12** 句。");
  lines.push("> 骨架不動，只抽換名詞、動詞片語或子句。");
  lines.push("");
  lines.push("## 各級怎麼分");
  lines.push("");
  lines.push("| 級 | 名稱 | 你要練的能力 | 模板 | 每條變形 |");
  lines.push("|----|------|----------------|------|----------|");
  lines.push("| L0 | 口語入門 | 中小學：打招呼、課堂、日常、過去與比較 | 100 | 8 |");
  lines.push("| L1 | 入門 | 單句：計劃、感受、習慣、當下 | 12 | 12 |");
  lines.push("| L2 | 基礎 | 委婉請求、目的、簡單時間 | 12 | 12 |");
  lines.push("| L3 | 進階 | 觀點、轉折、因果、對比 | 12 | 12 |");
  lines.push("| L4 | 職場 | 商務請求、進度、同步、期限 | 12 | 12 |");
  lines.push("| L5 | 高階 | 條件、假設、可能性、倒裝 | 12 | 12 |");
  lines.push("| L6 | 精通 | 道地轉折、評估、強調、言外之意 | 12 | 12 |");
  lines.push("");
  lines.push("## 怎麼用");
  lines.push("");
  lines.push("1. 先從 L0 開始。大聲讀骨架，再讀變形，找出哪幾個詞被換掉。");
  lines.push("2. 蓋住英文，只看中文，自己把槽位填回去。");
  lines.push("3. L0 每次練 8 句裡的 3 句；L1 以上不要一次把 12 句念完就停。");
  lines.push("");
  lines.push(`模板數：**${LEVELS.reduce((n, l) => n + l.items.length, 0)}**　變形數：**${LEVELS.reduce((n, l) => n + l.items.reduce((m, it) => m + it.rows.length, 0), 0)}**`);
  lines.push("");

  for (const lv of LEVELS) {
    lines.push(`## ${lv.id}　${lv.title}`);
    lines.push("");
    lines.push(lv.blurb);
    lines.push("");
    for (const it of lv.items) {
      lines.push(`### ${it.id}　${it.pattern}`);
      lines.push("");
      lines.push(`- 中文骨架：${it.zhName}`);
      lines.push(`- 來源編號：\`${it.source}\``);
      lines.push(`- 用法：${it.note}`);
      lines.push(`- 本組抽換：${it.swap}`);
      lines.push("");
      lines.push("| # | English | 中文 |");
      lines.push("|---|---------|------|");
      it.rows.forEach((row, i) => {
        const en = row[0].replace(/\|/g, "\\|");
        const zh = row[1].replace(/\|/g, "\\|");
        lines.push(`| ${i + 1} | ${en} | ${zh} |`);
      });
      lines.push("");
    }
  }

  const out = path.join(__dirname, "../../句型模板-72x12.md");
  fs.writeFileSync(out, `${lines.join("\n")}\n`);
  const jsonPath = path.join(__dirname, "../src/data/pattern-templates.json");
  const payload = {
    levels: LEVELS.map((lv) => ({
      id: lv.id,
      title: lv.title,
      blurb: lv.blurb,
      items: lv.items.map((it) => ({
        id: it.id,
        pattern: it.pattern,
        zhName: it.zhName,
        note: it.note,
        swap: it.swap,
        rows: it.rows.map(([en, zh]) => ({ en, zh })),
      })),
    })),
  };
  fs.writeFileSync(jsonPath, `${JSON.stringify(payload)}\n`);
  console.log(
    "levels",
    LEVELS.length,
    "items",
    LEVELS.reduce((n, l) => n + l.items.length, 0),
    "json",
    jsonPath,
  );
}

module.exports = { LEVELS, level, item, render };

if (require.main === module) {
  require("./build-pattern-72-l0");
  require("./build-pattern-72-l2l3");
  require("./build-pattern-72-l4l6");
  render();
}
