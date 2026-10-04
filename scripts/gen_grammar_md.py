# -*- coding: utf-8 -*-
"""Generate english grammar.md — 36 C1 AmE lessons."""
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "english grammar.md"

HEADER = r'''# English Grammar & Modern Usage｜文法與現代慣用語

> **狀態**：文檔草稿（尚未上架網站）  
> **口音／市場**：美式英語（American English）— 日常＋職場  
> **目標程度**：推到 **C1**（能開會、談判語氣、寫正式短訊／簡報口語）  
> **與 `english V.md` 關係**：**獨立成冊**（不依賴舊句型庫交叉連結；上架後可另做選配連結）  
> **冊 5**：含 Lifestyle／Real Estate 場景課

---

## 0. 怎麼用這份文檔

### 0.1 兩大軸

| 軸 | 內容 | 冊次 |
|----|------|------|
| A. 文法 | 規則、對比、華語母語者易錯點 | 冊 1–3、部分冊 6 |
| B. 現代慣用語 | discourse markers、chunks、語域標註 | 冊 4–6 |

### 0.2 單課固定骨架

1. **標題**（中＋英）
2. **一句話重點**
3. **對比表**（怪／中式直譯 vs 自然美式）
4. **規則／用法**（白話，3–6 條）
5. **現代例句**（EN＋ZH；標 `生活`／`工作`／`通用`）
6. **慣用語包**（2–5 個；標語域：中性／口語／職場／慎用）
7. **迷你練習**（3 題；文末附簡答）

### 0.3 語域標籤

- **中性**：到處可用  
- **口語**：朋友、輕鬆同事  
- **職場**：會議、Email、客戶  
- **慎用**：過時、過潮、或易冒犯—C1 要會「認得但不亂用」

### 0.4 總目錄

| 冊 | 主題 | 課號 |
|----|------|------|
| 1 | 基礎骨架 | 01–08 |
| 2 | 句子怎麼長得自然 | 09–14 |
| 3 | 易錯點專治 | 15–20 |
| 4 | 現代慣用語與口語潤滑 | 21–28 |
| 5 | 場景包（Lifestyle／Real Estate） | 29–32 |
| 6 | 進階表達 | 33–36 |

---

'''

def lesson(num, title_zh, title_en, focus, contrasts, rules, examples, idioms, practices, answers):
    lines = []
    lines.append(f"## Lesson {num:02d}｜{title_zh}")
    lines.append(f"**{title_en}**")
    lines.append("")
    lines.append(f"> **一句話重點**：{focus}")
    lines.append("")
    lines.append("### 對比")
    lines.append("")
    lines.append("| 較不自然／易錯 | 更自然的美式 | 說明 |")
    lines.append("|---------------|-------------|------|")
    for a, b, c in contrasts:
        lines.append(f"| {a} | {b} | {c} |")
    lines.append("")
    lines.append("### 規則／用法")
    lines.append("")
    for i, r in enumerate(rules, 1):
        lines.append(f"{i}. {r}")
    lines.append("")
    lines.append("### 現代例句")
    lines.append("")
    for tag, en, zh in examples:
        lines.append(f"- `{tag}` **EN:** {en}  ")
        lines.append(f"  **ZH:** {zh}")
    lines.append("")
    lines.append("### 慣用語包")
    lines.append("")
    for phrase, gloss, domain in idioms:
        lines.append(f"- **{phrase}** — {gloss} 〔{domain}〕")
    lines.append("")
    lines.append("### 迷你練習")
    lines.append("")
    for i, p in enumerate(practices, 1):
        lines.append(f"{i}. {p}")
    lines.append("")
    lines.append("<details><summary>簡答</summary>")
    lines.append("")
    for i, a in enumerate(answers, 1):
        lines.append(f"{i}. {a}")
    lines.append("")
    lines.append("</details>")
    lines.append("")
    lines.append("---")
    lines.append("")
    return "\n".join(lines)


LESSONS = []

# ========== BOOK 1 ==========
LESSONS.append(("冊 1｜基礎骨架（Lessons 01–08）",
"時態與情態是 C1 的底盤：重點不是「背公式」，而是**在會議與日常裡選對時間視角與語氣強度**。"))

LESSONS.append(lesson(
    1, "現在簡單 vs 現在進行", "Present Simple vs Present Continuous",
    "習慣／事實用簡單式；此刻、暫時、或帶情緒的「老是這樣」用進行式。",
    [
        ("I am living in Austin.（若已定居）", "I live in Austin.", "長期狀態用簡單式"),
        ("He always complains.（平淡）", "He's always complaining.", "進行式＋always＝不耐煩／吐槽"),
        ("I work on the deck right now.", "I'm working on the deck right now.", "當下動作用進行式"),
        ("The train is leaving at 6 every day.", "The train leaves at 6 every day.", "時刻表用簡單式"),
    ],
    [
        "現在簡單：習慣、真理、長期工作／居住、時刻表。",
        "現在進行：說話當下、暫時安排、發展中的趨勢（*The market is cooling.*）。",
        "狀態動詞（know, want, own, seem）通常不用進行式；C1 例外：*I'm loving this*（口語強調體驗）。",
        "職場：進度更新常用進行式（*We're finalizing…*）；職責描述用簡單式（*I own the vendor relationship.*）。",
    ],
    [
        ("生活", "I usually cook on Sundays, but tonight I'm ordering Thai.", "我週日通常自己煮，但今晚我要點泰式外送。"),
        ("工作", "She runs our Midwest accounts, and she's flying to Chicago this week.", "她負責中西部客戶，這週要飛芝加哥。"),
        ("工作", "The numbers look fine on paper, but the pipeline is shrinking.", "紙上數字還行，但業務管線正在縮。"),
        ("通用", "You're always interrupting me in stand-ups.", "你在站會裡老是插話。"),
        ("生活", "Do you believe this weather, or is it just me?", "這天氣也太誇張了吧，還是只有我這麼覺得？"),
        ("工作", "I don't think the client understands the trade-off yet.", "我不認為客戶已經搞懂取捨。"),
    ],
    [
        ("as a rule", "一般來說、通常", "中性"),
        ("for the time being", "暫時、眼下先這樣", "職場／中性"),
        ("in the middle of something", "正忙著某事", "口語／職場"),
        ("these days", "近來（帶變化感）", "中性"),
    ],
    [
        "改寫：I work late this week.（若指本週暫時加班）",
        "選較自然： (a) I am knowing the answer. (b) I know the answer.",
        "用一句進行式吐槽同事「開會老滑手機」。",
    ],
    [
        "I'm working late this week.",
        "(b)",
        "例：He's always scrolling through his phone in meetings.",
    ],
))

LESSONS.append(lesson(
    2, "過去簡單 vs 現在完成", "Past Simple vs Present Perfect",
    "有明確過去時間錨 → 過去簡單；連到「現在仍相關／經驗／未竟」→ 現在完成。",
    [
        ("I have seen him yesterday.", "I saw him yesterday.", "有 yesterday 就用過去簡單"),
        ("Did you ever try matcha?", "Have you ever tried matcha?", "人生經驗用現在完成"),
        ("I already sent it yesterday… wait.", "I already sent it. / I sent it yesterday.", "already 多配完成；有明確日則過去"),
        ("I lost my keys.（若還在找）", "I've lost my keys.", "結果影響現在用完成"),
    ],
    [
        "過去簡單：finished time（yesterday, last quarter, in 2019, when I was…）。",
        "現在完成：unfinished time（today, this week, so far）、經驗、剛發生、對現在有結果。",
        "美式口語常把 just/already 配過去簡單（*I already ate.*）；正式職場寫作仍多用完成式。",
        "C1：*I've been meaning to…*（一直想做還沒做完）比 *I meant to* 更有「拖延到現在」的味道。",
    ],
    [
        ("生活", "Have you eaten yet? I already had a late lunch.", "你吃了嗎？我已經吃過晚午餐了。"),
        ("工作", "We launched the pilot last Monday, and we've already collected fifty responses.", "我們上週一上線試點，已經收到五十份回覆。"),
        ("工作", "I haven't heard back from legal, so I'm holding the send.", "法務還沒回，所以我先不寄。"),
        ("通用", "I've never been great at small talk, but I'm getting better.", "我從來不擅長閒聊，但有在進步。"),
        ("生活", "She called an hour ago and said she'd be late.", "她一小時前打電話說會晚到。"),
        ("工作", "We've seen this pattern before in Q4 churn.", "我們在第四季流失裡看過這種模式。"),
    ],
    [
        ("so far / to date", "到目前為止", "職場／中性"),
        ("as of now", "截至目前", "職場"),
        ("It's been a while", "有陣子沒…", "口語"),
        ("I've been meaning to…", "我一直想…（還沒做）", "口語／職場"),
    ],
    [
        "填時態：I ___ (finish) the deck ___ (already)，但 boss ___ (ask) for changes yesterday.",
        "哪句較佳談「經驗」：Did you visit Japan? / Have you been to Japan?",
        "用現在完成說：法務回覆還沒來，所以合約還不能簽。",
    ],
    [
        "have already finished；asked",
        "Have you been to Japan?",
        "例：Legal hasn't gotten back to us, so we haven't signed the contract yet.",
    ],
))

LESSONS.append(lesson(
    3, "未來：will / be going to / 進行式", "Future: will, be going to, Present Continuous",
    "臨時決定與預測用 will；計畫／跡象用 going to；已敲定行程常用進行式。",
    [
        ("I will visit my parents this weekend.（若早已排定）", "I'm visiting / I'm going to visit my parents this weekend.", "已計畫偏 going to／進行式"),
        ("Look at those clouds. It will rain.", "It's going to rain.", "眼前跡象用 going to"),
        ("I'm going to help you with that.（剛開口答應）", "I'll help you with that.", "當下承諾／自願用 will"),
        ("The meeting will starting at 3.", "The meeting starts / is starting at 3.", "安排好的會議時刻"),
    ],
    [
        "will：自願、承諾、當場決定、較虛的預測（*I think it'll be fine.*）。",
        "be going to：意圖、已決定計畫、有證據的預測。",
        "現在進行表未來：日曆上已定（航班、會議、約會）。",
        "職場軟承諾：*I'll take a look*（會看）≠ *I'm going to rewrite it tonight*（已打算重寫）。C1 要分力度。",
    ],
    [
        ("生活", "I'm going to deep-clean the kitchen tomorrow—it's out of control.", "我明天要把廚房大掃除，已經失控了。"),
        ("工作", "I'll ping you when the file is ready.", "檔案好了我再戳你一下。"),
        ("工作", "We're meeting the GC at the site on Thursday.", "週四我們要和總承包在工地碰面。"),
        ("通用", "This is going to take longer than we budgeted.", "這會比預算的時間更久。"),
        ("生活", "Don't lift that—I'll get it.", "別搬那個，我來。"),
        ("工作", "If the client pushes back, we'll walk them through the comps again.", "若客戶有意見，我們再帶他們看一次可比案例。"),
    ],
    [
        ("I'll take a look", "我看一下（輕承諾）", "職場"),
        ("I'll keep you posted", "有進度會同步你", "職場"),
        ("It's going to be tight", "時間會很緊", "中性／職場"),
        ("rain check", "改天再約", "口語"),
    ],
    [
        "情境：同事搬箱子，你當場要幫忙 → 用哪種未來？",
        "改寫得像已排進日曆：I will have lunch with Sara on Friday.",
        "用 going to 說：看這流量，伺服器要掛了。",
    ],
    [
        "I'll help you with that.",
        "I'm having lunch with Sara on Friday.",
        "例：Look at this traffic—the server is going to crash.",
    ],
))

LESSONS.append(lesson(
    4, "情態動詞：能力、義務、推測", "Modals: Ability, Obligation, Deduction",
    "情態動詞先選「力度」再選「禮貌」；C1 要會用推測語氣（must / might / can't）。",
    [
        ("You must to sign here.", "You must / have to / need to sign here.", "情態後接原形"),
        ("You must come if free?（邀約）", "You should come if you're free. / You might want to…", "must 太硬，像命令"),
        ("He can be in a meeting.（推測）", "He might / could be in a meeting.", "can 少用於肯定推測"),
        ("You don't must go.", "You don't have to go. / You mustn't go.", "不必 vs 禁止 完全不同"),
    ],
    [
        "能力：can / be able to；過去能力 could / was able to（單一成功事件美式常用 managed to / was able to）。",
        "義務：must（說話者強勢）、have to（外在規定）、need to（務實必要）、should / ought to（建議）。",
        "禁止：mustn't / can't；不必：don't have to / don't need to。",
        "推測強度：must（幾乎肯定）> should（合理期待）> might/could（可能）> can't（幾乎不可能）。",
        "職場軟化：*You might want to…* / *We may need to…* 比 *You must…* 更 C1。",
    ],
    [
        ("工作", "We may need to push the closing by a week.", "我們可能要把成交延後一週。"),
        ("工作", "You might want to loop in finance before you promise that discount.", "在承諾那個折扣前，你最好把財務拉進來。"),
        ("生活", "He can't still be asleep—it's noon.", "他不可能還在睡，都中午了。"),
        ("通用", "I should be done by five, assuming no surprises.", "沒意外的話，我五點前應該能好。"),
        ("工作", "Contractors have to carry insurance on site.", "承包商在工地必須有保險。"),
        ("生活", "You don't have to bring anything, but wine is always welcome.", "你不必帶東西，但酒永遠受歡迎。"),
    ],
    [
        ("might want to…", "建議你…（軟）", "職場"),
        ("have to / need to", "必須／需要", "中性"),
        ("shouldn't be an issue", "照理不該有問題", "職場"),
        ("can't be right", "這不可能對", "口語／職場"),
    ],
    [
        "分辨：You mustn't tell anyone. vs You don't have to tell anyone.",
        "用推測：燈亮著但沒人應門 → 他們一定出去了／可能在院子。",
        "把命令軟化：You must revise the deck today. → 職場版。",
    ],
    [
        "前者＝禁止說；後者＝不必說。",
        "例：They must have gone out. / They might be in the backyard.",
        "例：You might want to revise the deck today. / We'll need the deck revised today.",
    ],
))

LESSONS.append(lesson(
    5, "條件句：真實、假設、後悔", "Conditionals: Real, Unreal, Past Regret",
    "先分「可能發生」還是「假想／後悔」，動詞形式跟著世界真假走。",
    [
        ("If I will see her, I tell her.", "If I see her, I'll tell her.", "真實條件：現在簡單＋will"),
        ("If I am you, I would…", "If I were you, I would…", "假想用 were（C1 仍常用）"),
        ("If I would have known…", "If I had known… / Had I known…", "過去假設不用 would have 在 if 子句"),
        ("If we hired him, we have more capacity.", "If we hired him, we'd have more capacity.", "假想結果用 would"),
    ],
    [
        "零／第一條件：真實、習慣、可能→ If + 現在，will / can / imperative。",
        "第二條件：現在／未來假想→ If + 過去式，would / could / might + 原形。",
        "第三條件：過去後悔→ If + had + PP，would have + PP。",
        "混合：*If I had taken that role, I'd be in New York now.*（過去假想→現在結果）",
        "職場：*If we miss this window, we risk the rate lock.*（真實威脅用第一條件更有力）",
    ],
    [
        ("工作", "If the appraisal comes in low, we'll renegotiate or walk.", "若估價偏低，我們會重談或退出。"),
        ("工作", "If I were running this, I'd cut scope before I'd cut quality.", "若換我主導，我會先砍範圍而不是砍品質。"),
        ("生活", "If I'd left ten minutes earlier, I wouldn't have missed the train.", "要是早十分鐘出門，就不會誤點。"),
        ("通用", "Had we known about the HOA fees, we might have bid differently.", "早知道社區管理費，出價策略可能不同。"),
        ("生活", "If it keeps raining, I'm canceling the hike.", "雨再這樣下，健行我就取消。"),
        ("工作", "Unless legal signs off, we can't send the LOI.", "除非法務點頭，否則不能寄意向書。"),
    ],
    [
        ("unless", "除非（= if not）", "中性"),
        ("in case", "以防萬一（預備）", "中性"),
        ("worst case", "最壞情況", "職場／口語"),
        ("if need be", "必要的話", "職場"),
    ],
    [
        "改錯：If I would be free, I would join.",
        "用第三條件：昨天沒備份，結果檔案毀了。",
        "用第一條件：利率若再升，我們就鎖利。",
    ],
    [
        "If I were free, I would join. / If I'm free, I'll join.",
        "例：If I had backed up yesterday, the file wouldn't have been ruined.",
        "例：If rates rise again, we'll lock.",
    ],
))

LESSONS.append(lesson(
    6, "被動語態：何時該用", "Passives: When They Help (and When They Don't)",
    "被動用來藏執行者、強調結果或顯得客觀；濫用會像在推責或官腔。",
    [
        ("Mistakes were made by me.", "I made mistakes. / Mistakes were made.（刻意模糊）", "推責感 vs 負責"),
        ("The email was sent by me yesterday.", "I sent the email yesterday.", "執行者重要就用主動"),
        ("We are completed the walkthrough.", "The walkthrough has been completed. / We completed…", "形式要正確"),
        ("It is appreciated your help.", "Your help is appreciated. / We appreciate your help.", "美式職場兩者皆可，後者更暖"),
    ],
    [
        "結構：be + past participle；（完成）has been + PP；（情態）should be + PP。",
        "適合被動：流程、規定、未知執行者、科學／報告客觀口吻、不想指責個人。",
        "不適合：行動號召、承認錯誤、需要清楚 ownership 時。",
        "C1：*get*-passive（*got promoted, got delayed*）偏口語；正式文件用 *be*-passive。",
    ],
    [
        ("工作", "The bid was submitted before noon.", "標書已在中午前送出。"),
        ("工作", "You'll be looped in once the redlines are ready.", "紅線稿好了就會把你拉進討論。"),
        ("生活", "Our flight got delayed three hours.", "班機延誤了三小時。"),
        ("通用", "Nothing has been decided yet.", "還沒有任何決定。"),
        ("工作", "I own this miss—the update wasn't sent.", "這次疏失我負責——更新沒寄出。"),
        ("生活", "The house was built in the 1990s and later remodeled.", "房子 1990 年代建造，後來翻修過。"),
    ],
    [
        ("get delayed / get pushed", "被延誤／被往後推", "口語／職場"),
        ("to be looped in", "被納入知情／討論", "職場"),
        ("the ball is in your court", "下一動輪到你", "職場"),
        ("ownership", "誰負責（名詞用法）", "職場"),
    ],
    [
        "改成更負責的主動：The deadline was missed.",
        "何時用被動較佳：公告「電梯本週維修」。",
        "把口語 get-passive 改正式：We got rejected by the lender.",
    ],
    [
        "例：I missed the deadline. / We missed the deadline.",
        "例：The elevator will be serviced this week.",
        "例：We were rejected by the lender. / Our application was declined…",
    ],
))

LESSONS.append(lesson(
    7, "不定詞 vs 動名詞", "Infinitives vs Gerunds",
    "有些動詞接 to-V，有些接 V-ing；改了不只是文法錯，語氣也會變。",
    [
        ("I look forward to meet you.", "I look forward to meeting you.", "to 是介系詞→ V-ing"),
        ("I suggest to leave early.", "I suggest leaving early. / I suggest that we leave…", "suggest 不接 to-V"),
        ("Don't forget locking the door.（若還未做）", "Don't forget to lock the door.", "forget to = 忘了要做"),
        ("I stopped to smoke for years.（若指戒菸）", "I stopped smoking years ago.", "stop V-ing＝停止該行為"),
    ],
    [
        "常接 to-V：want, need, plan, hope, decide, agree, refuse, learn, afford。",
        "常接 V-ing：enjoy, avoid, consider, finish, mind, risk, keep, suggest, recommend。",
        "介系詞後一律 V-ing（含 *look forward to, be used to, end up*）。",
        "意思會變：remember/forget/stop/try + to-V vs V-ing——C1 必分。",
        "職場高頻：*We can't afford to slip.* / *It's worth revisiting.* / *I don't mind owning this.*",
    ],
    [
        ("工作", "I'm looking forward to walking the property with you.", "我很期待和你一起實地看屋。"),
        ("工作", "We can't afford to miss another inspection window.", "我們不能再錯過下一個驗屋時段。"),
        ("生活", "I tried restarting the router, then I tried to call support.", "我試過重開路由器，接著才試著打客服。"),
        ("通用", "Would you mind sending the link again?", "可以麻煩再傳一次連結嗎？"),
        ("生活", "She stopped drinking caffeine in the afternoon.", "她下午已不再咖啡因。"),
        ("工作", "I forgot to attach the comps—sending them now.", "我忘了附可比案例，現在補上。"),
    ],
    [
        ("look forward to + V-ing", "期待做某事", "職場／中性"),
        ("can't afford to", "承擔不起（後果）", "中性／職場"),
        ("worth + V-ing", "值得…", "中性"),
        ("end up + V-ing", "結果卻…", "口語／中性"),
    ],
    [
        "改錯：I suggest to revisit the budget.",
        "選：I remember ___ (meet) her in Dallas.（記得見過）",
        "用 look forward to 寫一句會前信。",
    ],
    [
        "I suggest revisiting the budget. / I suggest that we revisit…",
        "meeting",
        "例：I'm looking forward to discussing next steps on Friday.",
    ],
))

LESSONS.append(lesson(
    8, "關係子句精簡", "Relative Clauses (and Reducing Them)",
    "用 who/which/that 補資訊；C1 還要會省略與分詞精簡，讓句子緊。",
    [
        ("The guy which called…", "The guy who / that called…", "人用 who/that"),
        ("The report, that we sent, …（非限定卻用 that）", "The report, which we sent, …", "非限定用 which，有逗號"),
        ("The person I talked to her was helpful.", "The person I talked to was helpful.", "勿重複受詞"),
        ("People live nearby are friendly.（缺關係詞／分詞）", "People who live nearby… / People living nearby…", "要連接裝置"),
    ],
    [
        "限定關係子句：必要資訊，可用 that；美式口語常用 that。",
        "非限定：額外資訊，用逗號＋which/who，不用 that。",
        "受格關係詞可省：*the deck (that) I sent*。",
        "精簡：*the team working on escrow*；*issues raised in diligence*。",
        "介系詞：正式 *to whom*；自然美式 *who I spoke with* / *the lender I spoke with*。",
    ],
    [
        ("工作", "Here's the version that incorporates legal's redlines.", "這版已納入法務紅線意見。"),
        ("工作", "The inspector we hired flagged the roof.", "我們請的驗屋師標出了屋頂問題。"),
        ("生活", "Anyone who's been through a remodel knows the dust never ends.", "翻修過的人都知道灰塵沒完没了。"),
        ("通用", "The clause, which felt minor at first, became a deal point.", "那條款起初不起眼，後來變成談判點。"),
        ("工作", "Candidates applying after Friday won't be reviewed.", "週五後申請者不進入審核。"),
        ("生活", "That's the cafe I was telling you about.", "就是我跟你提過的那家咖啡店。"),
    ],
    [
        ("deal point", "成交／談判關鍵點", "職場"),
        ("flag (an issue)", "標出問題", "職場"),
        ("incorporate feedback", "把意見納進稿", "職場"),
        ("the one I was telling you about", "我提過的那個", "口語"),
    ],
    [
        "合併：I spoke with a lender. The lender is based in Austin.",
        "精簡：People who work remotely need better async habits. → 分詞版",
        "改錯：The house, that we toured, needs work.",
    ],
    [
        "例：I spoke with a lender who is based in Austin. / …a lender based in Austin.",
        "People working remotely need better async habits.",
        "The house, which we toured, needs work. 或限定：The house that we toured needs work.",
    ],
))

# ========== BOOK 2 ==========
LESSONS.append(("冊 2｜句子怎麼長得自然（Lessons 09–14）",
"C1 的差異常在「主詞是否清楚、連接是否像美國人思考順序」，不是單字量。"))

LESSONS.append(lesson(
    9, "主詞要清楚", "Clear Subjects (Fixing Chinese-style Openers)",
    "英語句子要有明確主詞；少用「有人／就是／對於…來說」開場的直譯。",
    [
        ("Has people say that…", "People say… / I've heard…", "主詞＋動詞一致"),
        ("Regarding the budget is tight.", "The budget is tight. / Regarding the budget, it's tight.", "Regarding 是介系詞片語"),
        ("Is very important to confirm.", "It's very important to confirm. / Confirming is essential.", "要有主詞 It／動名詞"),
        ("With the weather so bad, so we canceled.", "The weather was so bad that we canceled. / With the weather so bad, we canceled.", "不要 so 重複"),
    ],
    [
        "每個陳述句要有主詞；祈使句主詞 you 省略。",
        "用具體人／團隊當主詞，比 *It is needed that…* 更有力。",
        "假主詞 it／there 是合法工具（見 Lesson 10），但別每句都用。",
        "職場：主詞＝ownership。*Marketing will own the launch copy.*",
    ],
    [
        ("工作", "Finance still needs the final numbers before noon.", "財務中午前仍需要最終數字。"),
        ("工作", "I'm not comfortable signing until we see the HOA docs.", "沒看到社區文件前，我不想簽字。"),
        ("生活", "Someone left the gate open again.", "又有人沒關大門。"),
        ("通用", "What matters is whether we can close on time.", "重點是我們能不能準時成交。"),
        ("生活", "That kind of noise would drive me crazy.", "那種噪音會讓我抓狂。"),
        ("工作", "Our side will prepare the walkthrough checklist.", "我方會準備實地查看檢核表。"),
    ],
    [
        ("what matters is…", "重點是…", "中性／職場"),
        ("I'm not comfortable + V-ing", "我對…感到不妥", "職場"),
        ("on our end / on our side", "在我們這邊", "職場"),
        ("drive someone crazy", "讓人受不了", "口語"),
    ],
    [
        "改寫：Is necessary to update the client.",
        "給清楚主詞：關於屋頂，需要換。",
        "避免空泛：It is suggested that the meeting be moved.（改成人負責）",
    ],
    [
        "It's necessary to update the client. / We need to update the client.",
        "例：The roof needs to be replaced. / We need to replace the roof.",
        "例：I suggest we move the meeting. / Alex suggested moving the meeting.",
    ],
))

LESSONS.append(lesson(
    10, "There is / It is / 虛主詞", "There is, It is, and Dummy Subjects",
    "there 用來引出存在；it 用來談時間、天氣、距離、或延後真正主詞。",
    [
        ("It has a lot of traffic today.", "There's a lot of traffic today.", "存在用 there"),
        ("There is difficult to park.", "It's difficult to park. / Parking is difficult.", "形容詞補語用 it"),
        ("Is a problem with the sink.", "There's a problem with the sink.", "要有 there/it"),
        ("There have many options.", "There are many options.", "be 動詞單複數"),
    ],
    [
        "There + be + 名詞：引出新資訊（*There's an issue with…*）。",
        "It + be + adj + to-V：評價行為（*It's tough to say no.*）。",
        "It 當形式主詞：*It seems that…* / *It turns out…* / *It's worth noting…*。",
        "C1：*There's no way…* / *It's not that…* 用來談判與澄清。",
    ],
    [
        ("工作", "There's still a gap between our ask and their offer.", "我們的要求與對方出價仍有落差。"),
        ("工作", "It's worth noting that the comps are from last spring.", "值得注意的是，可比案例是去年春天的。"),
        ("生活", "It's about twenty minutes without traffic.", "不塞車大約二十分鐘。"),
        ("通用", "It turns out the delay was on the lender's side.", "結果延誤出在貸方那邊。"),
        ("生活", "There's no way I'm painting in this heat.", "這種熱我不可能去油漆。"),
        ("工作", "It's not that we disagree—it's that the timing is wrong.", "不是我們不同意，而是時機不對。"),
    ],
    [
        ("there's a gap", "有落差／缺口", "職場"),
        ("it's worth noting", "值得一提", "職場"),
        ("it turns out", "結果是、原來", "中性"),
        ("there's no way", "不可能", "口語"),
    ],
    [
        "選：___ a few open items on the punch list.",
        "改錯：It has three bedrooms upstairs.",
        "用 It's not that… 澄清：不是嫌貴，是擔心維修。",
    ],
    [
        "There are…",
        "There are three bedrooms upstairs. / The house has three…",
        "例：It's not that it's too expensive—it's that I'm worried about repairs.",
    ],
))

LESSONS.append(lesson(
    11, "連接與節奏", "Connectors & Rhythm: and / but / so / though / however",
    "美國人說話節奏靠連接詞分工：but 轉、so 推結果、though 句尾軟轉、however 偏書面。",
    [
        ("I like it, but however it's pricey.", "I like it, but it's pricey. / …; however, it's pricey.", "不要疊用"),
        ("Although it rained, but we went.", "Although it rained, we went. / It rained, but we went.", "although 不與 but 並用"),
        ("I was tired. So that I left.", "I was tired, so I left.", "so that 表目的，不是所以"),
        ("The idea is good. But.", "The idea is good, but… / …good. That said, …", "別把 But 孤成一句（寫作）"),
    ],
    [
        "and 加資訊；but/yet 轉折；so 結果；because/since 原因。",
        "though / although：讓步；口語常把 *though* 放句尾（*It was rough, though.*）。",
        "however / nevertheless：較正式，常句首＋逗號或分號連接。",
        "C1 口語潤滑見冊 4（Actually, That said…）；本課先打穩邏輯連接。",
    ],
    [
        ("工作", "The unit shows well, but the HVAC is near end of life.", "房子看起來漂亮，但空調快壽終。"),
        ("工作", "Diligence looks clean, so we're comfortable moving forward.", "盡職調查看起來乾淨，所以我們願意往前。"),
        ("生活", "I wanted sushi. I cooked pasta instead, though.", "我想吃壽司，不過最後還是煮了義大利麵。"),
        ("通用", "The plan is aggressive; however, the upside is real.", "計畫很積極；不過上行空間確實存在。"),
        ("生活", "It was crowded, and the music was too loud.", "人很多，音樂也太吵。"),
        ("工作", "Since the appraisal is delayed, we'll slip closing a few days.", "既然估價延遲，成交會晚幾天。"),
    ],
    [
        ("that said", "話雖如此", "職場／中性"),
        ("even so", "即便如此", "中性"),
        ("so… that…", "如此…以致…", "中性"),
        ("end of life (EOL)", "壽命將盡（設備）", "職場"),
    ],
    [
        "合併兩句（轉折）：The price is fair. The timeline is unrealistic.",
        "句尾加 though：I liked the neighborhood.",
        "改錯：Although the offer is solid, but I'm hesitating.",
    ],
    [
        "例：The price is fair, but the timeline is unrealistic.",
        "例：I liked the neighborhood, though.",
        "Although the offer is solid, I'm hesitating.",
    ],
))

LESSONS.append(lesson(
    12, "從屬子句", "Subordinate Clauses: because / since / although / while",
    "從屬子句把原因、讓步、對比嵌進主句，讓論點一次說完。",
    [
        ("Because I was late, so I missed it.", "Because I was late, I missed it.", "不要 because…so"),
        ("Since I don't know.（當「因為」卻不完整）", "Since I don't know, I'll ask. / I don't know.", "since 子句不能當整句甩那裡"),
        ("While I agree the design…（口語易歧義）", "While I agree with the design, … / I agree…", "while＝雖然／當…時，要夠清楚"),
        ("He left while I have been talking.", "He left while I was talking.", "時態配合"),
    ],
    [
        "because 直接原因；since / as 較已知背景（語氣較柔）。",
        "although / even though：讓步，比 but 更「整句包裝」。",
        "while / whereas：對比兩邊；while 也可表時間重疊。",
        "when / after / before / as soon as：時間從屬；美式口語 *once* 很常用（*Once we have keys…*）。",
    ],
    [
        ("工作", "Even though the inspection found issues, none of them are deal-breakers.", "雖有驗屋問題，但都不是破局點。"),
        ("工作", "Once we have clear title, we can set a firm closing date.", "一旦產權清楚，就能訂明確成交日。"),
        ("生活", "I stayed home because I was wiped after the move.", "搬家後累壞了，所以待在家。"),
        ("通用", "Whereas the first unit felt dark, this one gets great light.", "第一間偏暗，這一間採光很好。"),
        ("工作", "As we discussed, contingency is still on the table.", "如我們討論過的，附條件條款仍在討論。"),
        ("生活", "Call me when you get there.", "到了打給我。"),
    ],
    [
        ("deal-breaker", "破局條件", "職場／口語"),
        ("on the table", "仍可談／擺在檯面", "職場"),
        ("wiped", "累慘了", "口語"),
        ("firm date", "確定日期", "職場"),
    ],
    [
        "用 even though 改寫：The house is small. We still love it.",
        "用 once 寫：拿到鑰匙就拍照記錄屋況。",
        "改錯：Because the rate is good, so we should lock.",
    ],
    [
        "Even though the house is small, we still love it.",
        "例：Once we get the keys, we'll photo-document the condition.",
        "Because the rate is good, we should lock.",
    ],
))

LESSONS.append(lesson(
    13, "名詞片語堆疊", "Noun Phrases That Sound Native",
    "美式職場愛用緊湊名詞片語；堆疊要可讀，避免無止境的 of of of。",
    [
        ("the report of inspection of the house", "the home inspection report", "名詞修飾名詞"),
        ("a meeting of follow-up", "a follow-up meeting", "複合名詞順序"),
        ("the strategy of exit of investment", "the investment exit strategy", "常見金融／投資堆疊"),
        ("very unique opportunity of investment", "a rare investment opportunity", "unique 少被 very 修；措辭更準"),
    ],
    [
        "順序概念：意見／大小／年齡／形狀／顏色／來源／材質＋名詞（不必背死，求通順）。",
        "名詞當形容詞：*kitchen remodel quote, interest rate lock, punch list item*。",
        "過長就拆：*the lender's conditions for clearing title* → 兩句或用關係子句。",
        "C1：會讀也會寫 *year-over-year growth, best-case scenario, all-cash offer*。",
    ],
    [
        ("工作", "We need the final repair credit number before we resign the addendum.", "在重簽附約前，我們需要最終維修折讓數字。"),
        ("工作", "Their all-cash offer beats our financed bid on certainty.", "他們的全款在確定性上勝過我們的貸款出價。"),
        ("生活", "I got three kitchen remodel quotes; the mid one feels right.", "我拿了三份廚房翻修報價，中間那份感覺對。"),
        ("通用", "Worst-case scenario, we rent for another year.", "最壞就是再租一年。"),
        ("工作", "Please send the updated rent roll and T-12.", "請寄更新的租金表與近十二個月財報。"),
        ("生活", "There's a hairline crack in the bathroom ceiling.", "浴室天花板有一道髮絲裂縫。"),
    ],
    [
        ("all-cash offer", "全款出價", "職場／房地產"),
        ("worst-case scenario", "最壞情況", "職場"),
        ("punch list", "完工待修清單", "職場／裝修"),
        ("year-over-year (YoY)", "同比", "職場"),
    ],
    [
        "壓成名詞片語：a report that inspects the roof → ?",
        "改得更美式：the meeting for kickoff of the project",
        "用 worst-case scenario 造一句關於成交延誤。",
    ],
    [
        "a roof inspection report",
        "the project kickoff meeting",
        "例：Worst-case scenario, closing slips two weeks.",
    ],
))

LESSONS.append(lesson(
    14, "問句與附加問句", "Questions & Tag Questions (Softening)",
    "問句不只求資訊，也用來軟化請求；附加問句用來求確認或拉對方進對話。",
    [
        ("You are free tomorrow, aren't you?（語氣粗看場景）", "You're free tomorrow, right? / …aren't you?", "right? 更口語常見"),
        ("Why you didn't call?", "Why didn't you call?", "疑問倒裝"),
        ("You can send it, can you?", "You can send it, can't you?", "附加問句正負相反"),
        ("Tell me your availability.（偏硬）", "What's your availability? / When works for you?", "問句較合作"),
    ],
    [
        "Yes/No：助動詞提前；Wh-：疑問詞＋助動詞＋主詞。",
        "間接問句不倒裝：*Do you know when it starts?*（不是 when does it start 嵌套錯位時要小心）。",
        "附加問句：主句肯定→附加否定；用來確認（falling tone）或真正詢問（rising）。",
        "職場軟提問：*Would it be possible to…? Any chance we could…? Does Thursday still work?*",
    ],
    [
        ("工作", "Does Thursday still work on your end?", "你那邊週四還可以嗎？"),
        ("工作", "You've reviewed the HOA docs, right?", "社區文件你看過了吧？"),
        ("生活", "You're coming through, aren't you?", "你會過來的，對吧？"),
        ("通用", "Do you happen to know who owns that decision?", "你剛好知道那決定是誰拍板的嗎？"),
        ("工作", "Would it be possible to move the walkthrough to 3?", "實地查看有可能改到三點嗎？"),
        ("生活", "How come the gate's unlocked?", "大門怎麼沒鎖？（口語）"),
    ],
    [
        ("on your end", "你那邊", "職場"),
        ("any chance…?", "有沒有可能…？", "口語／職場"),
        ("how come…?", "為什麼…？（口語）", "口語"),
        ("does…still work?", "…還可以嗎？", "職場"),
    ],
    [
        "改成軟問：Send the file today.",
        "加附加問句：We should lock the rate.",
        "改錯：Do you know what time does it start?",
    ],
    [
        "例：Could you send the file today? / Any chance you can send…?",
        "例：We should lock the rate, shouldn't we? / …right?",
        "Do you know what time it starts?",
    ],
))

# ========== BOOK 3 ==========
LESSONS.append(("冊 3｜易錯點專治（Lessons 15–20）",
"這冊針對華語母語者高頻「聽得懂但說出來別扭」的點；C1 要的是穩定、不是偶爾說對。"))

LESSONS.append(lesson(
    15, "冠詞 a / an / the / 零冠詞", "Articles: a, an, the, Zero Article",
    "冠詞標的是「聽者能不能辨識所指」；C1 還要掌握抽象名詞與專有場景的零冠詞。",
    [
        ("I bought the car yesterday.（首次提及且對方不知哪輛）", "I bought a car yesterday.", "新資訊用 a"),
        ("She is in the hospital.（美式住院）", "She is in the hospital.", "美式住院用 the；英式常 in hospital——本教材從美式"),
        ("The life is hard.", "Life is hard.", "泛指抽象用零冠詞"),
        ("I go to school by the bus.", "I go to school by bus.", "交通方式 by＋零冠詞"),
    ],
    [
        "a/an：可數單數、聽者不可辨識的任一分子。",
        "the：雙方可辨識（上文提過、世上唯一、限定後置修飾）。",
        "零冠詞：複數／不可數泛指、多數專有名詞、by bus/in bed/at work 等固定。",
        "職場：*send me the file*（特定檔）vs *send me a file*（任一示例檔）。",
        "C1：機構名詞美式常加 the（*the Fed, the HOA*）；球類 *play basketball* 零冠詞。",
    ],
    [
        ("工作", "I'll send you a redline and the final PDF after legal reviews it.", "我先寄一版紅線；法務審完再寄最終 PDF。"),
        ("工作", "Interest rates moved after the Fed spoke.", "聯準會發言後利率動了。"),
        ("生活", "Privacy matters more than convenience here.", "在這件事上，隱私比方便重要。"),
        ("通用", "We need an answer by Friday, not the perfect answer.", "週五前要一個答案，不是完美答案。"),
        ("生活", "Kids were playing basketball in the driveway.", "孩子在車道打籃球。"),
        ("工作", "Title called; the wire instructions are in escrow.", "產權公司來電；匯款指示在履約保證中。"),
    ],
    [
        ("in escrow", "在履約／價金保管中", "職場／房地產"),
        ("the Fed", "聯準會（口語）", "職場"),
        ("by Friday", "在週五前", "中性"),
        ("for now", "眼下先這樣", "中性"),
    ],
    [
        "填冠詞：___ honesty is ___ best policy—but bring ___ data.",
        "美式：他住院了。",
        "分辨：Open a window. vs Open the window.",
    ],
    [
        "Ø honesty; the best; Ø data（或 the data 若特定）",
        "He's in the hospital.",
        "前者任一窗；後者雙方知道的那扇窗。",
    ],
))

LESSONS.append(lesson(
    16, "介系詞高頻", "High-Frequency Prepositions: in / on / at / for / to / with",
    "介系詞多半是搭配而非邏輯；先掌握時間、地點、然後職場固定片語。",
    [
        ("in Monday morning", "on Monday morning", "日子用 on"),
        ("discuss about the price", "discuss the price / talk about the price", "discuss 不接 about"),
        ("arrive to the site", "arrive at the site", "arrive at/in"),
        ("married with him", "married to him", "固定搭配"),
    ],
    [
        "時間粗分：at 鐘點／夜間 at night；on 日／日期；in 月季年／一段時間 in two weeks。",
        "地點粗分：at 點、on 表面／層樓 on the second floor、in 封閉／城市。",
        "for＋一段時間；since＋起點；in＋未來多久之後。",
        "高頻職場：*on track, on my plate, in writing, under contract, at risk, to my point*。",
    ],
    [
        ("工作", "We're under contract, with closing in six weeks.", "我們已簽契約，六週後成交。"),
        ("工作", "Put that request in writing so we're aligned.", "把需求寫下來，我們才對齊。"),
        ("生活", "I'll meet you at the entrance on Saturday at 10.", "週六十點門口見。"),
        ("通用", "This has been on my plate since Tuesday.", "這事從週二就在我待辦上。"),
        ("工作", "We're still on track for the walkthrough.", "實地查看進度仍正常。"),
        ("生活", "I'm bad with names, but great with faces.", "我記名字很差，但記臉很行。"),
    ],
    [
        ("under contract", "已簽約（成交流程中）", "房地產／職場"),
        ("on my plate", "在我的待辦裡", "職場"),
        ("in writing", "以書面", "職場"),
        ("on track", "進度正常", "職場"),
    ],
    [
        "改錯：We discussed about financing options.",
        "填：See you ___ Friday ___ the cafe ___ 3.",
        "用 under contract 造句。",
    ],
    [
        "We discussed financing options.",
        "on Friday; at the cafe; at 3",
        "例：The house went under contract last night.",
    ],
))

LESSONS.append(lesson(
    17, "可數／不可數與量詞", "Countability & Quantifiers",
    "advice、information、feedback 等不可數；量詞選對才像 C1。",
    [
        ("an advice / many informations", "a piece of advice / a lot of information", "不可數"),
        ("less cars（正式偏好）", "fewer cars；less traffic", "可數用 fewer；不可數 less（口語常混）"),
        ("a news", "a news story / some news", "news 不可數"),
        ("furnitures are…", "The furniture is…", "furniture 不可數"),
    ],
    [
        "不可數高頻：advice, information, feedback, furniture, equipment, luggage, research, progress, homework。",
        "量詞：a piece of advice, two pieces of furniture, a bit of feedback, an item of equipment。",
        "some/any/much/many/a lot of/plenty of——肯定句美式超常用 a lot of。",
        "職場：*feedback* 當不可數集合；要具體可說 *two comments / a couple of notes*。",
    ],
    [
        ("工作", "I need a bit more clarity on the fee structure.", "費用結構我還需要再清楚一點。"),
        ("工作", "Thanks for the feedback—I left two notes in the margin.", "謝謝回饋；我在頁邊留了兩點意見。"),
        ("生活", "There isn't much daylight in that unit.", "那間採光不多。"),
        ("通用", "We've made solid progress, but research is still thin.", "進度不錯，但研究仍偏薄。"),
        ("生活", "How much luggage are you bringing?", "你要帶多少行李？"),
        ("工作", "Fewer contingencies would make this cleaner.", "附帶條件越少，這單越乾淨。"),
    ],
    [
        ("a bit of / a little", "一點點（不可數）", "中性"),
        ("a couple of", "一兩個", "口語／中性"),
        ("thin（資訊／研究）", "不足、薄弱", "職場"),
        ("cleaner（交易）", "條件更乾淨、少糾結", "職場"),
    ],
    [
        "改錯：She gave me many useful advices.",
        "選：less / fewer  ——  ___ open items on the list.",
        "用 feedback 造一句會議後訊息。",
    ],
    [
        "many useful pieces of advice / a lot of useful advice",
        "fewer",
        "例：Thanks for your feedback after the meeting—I'll revise tonight.",
    ],
))

LESSONS.append(lesson(
    18, "時態一致與間接引述", "Sequence of Tenses & Reported Speech",
    "轉述時，時間視角常往後退一格；但「現在仍真」可保持現在式。",
    [
        ("He said he will come.（若轉述過去承諾且已過）", "He said he would come.", "will→would"),
        ("She asked me what was my name.", "She asked me what my name was.", "間接問句不倒裝"),
        ("He told that he was busy.", "He told me that… / He said that…", "tell 要有受詞"),
        ("I asked should we wait.", "I asked whether / if we should wait.", "要用 whether/if"),
    ],
    [
        "直述→間接：am/is→was、will→would、can→could、have→had（常規後退）。",
        "若轉述內容仍成立：*She said the office is on Congress Ave.* 可維持現在式。",
        "間接問句：疑問詞＋陳述語序；Yes/No 用 if/whether。",
        "職場：書面會議紀錄常用 *X noted that… / X asked whether…*。",
    ],
    [
        ("工作", "He said they'd send the revised addendum by EOD.", "他說他們會在今天結束前寄修訂附約。"),
        ("工作", "I asked whether the rate lock was still available.", "我問利率鎖定是否仍可用。"),
        ("生活", "She told me she was running twenty minutes late.", "她跟我說會晚二十分鐘。"),
        ("通用", "They claimed the roof was new; the inspector disagreed.", "他們說屋頂是新的；驗屋師不同意。"),
        ("工作", "Legal noted that clause 4.2 needs a rewrite.", "法務指出 4.2 條需重寫。"),
        ("生活", "I wondered if I'd left the stove on.", "我在想是不是沒關爐火。"),
    ],
    [
        ("by EOD", "今天營業／工作結束前", "職場"),
        ("noted that…", "指出／記錄到…", "職場"),
        ("claimed that…", "聲稱（帶保留）", "中性／職場"),
        ("running late", "會晚到", "口語／中性"),
    ],
    [
        "轉成間接：\"We'll revise it tomorrow,\" she said.",
        "改錯：He asked where was the binder.",
        "轉述：客戶問成交能否提前。",
    ],
    [
        "She said they would revise it the next day. / …tomorrow（視時間點）",
        "He asked where the binder was.",
        "例：The client asked whether we could move closing up.",
    ],
))

LESSONS.append(lesson(
    19, "比較級與修飾", "Comparatives, Superlatives & Modifiers",
    "比較要可比；C1 用 far / slightly / nowhere near 精確調力度。",
    [
        ("more better / more cheaper", "better / cheaper", "不要雙重比較"),
        ("The most unique design", "a unique / a highly distinctive design", "unique 少用最高級"),
        ("This is expensive than that.", "This is more expensive than that.", "缺 more/-er"),
        ("I prefer coffee than tea.", "I prefer coffee to tea.", "prefer A to B"),
    ],
    [
        "短形容詞 -er/-est；長形容詞 more/most；不规则 better, worse, farther/further。",
        "修飾比較：far / way / much / a lot（強）；slightly / a bit / marginally（弱）。",
        "否定比較：*not as…as*；口語 *nowhere near as…as*。",
        "職場：*a cleaner structure, a tighter timeline, a more conservative underwriting*。",
    ],
    [
        ("工作", "Their offer is slightly higher, but ours is far more certain.", "他們出價略高，但我們的確定性高得多。"),
        ("工作", "This is the cleanest term sheet we've seen all quarter.", "這是本季看過最乾淨的條件書。"),
        ("生活", "The new place is nowhere near as noisy as the last one.", "新地方遠沒有上一間那麼吵。"),
        ("通用", "I'd rather wait a week than rush a bad decision.", "我寧願多等一週，也不要倉促做錯決定。"),
        ("工作", "Underwriting got more conservative after the last cycle.", "上一輪之後，審核更保守了。"),
        ("生活", "This couch is less comfortable than it looks.", "這沙發沒看起來那麼舒服。"),
    ],
    [
        ("far more / way more", "遠更…", "口語／中性"),
        ("nowhere near as…as", "遠不如…", "口語"),
        ("I'd rather A than B", "寧可 A 也不 B", "中性"),
        ("tighter / cleaner", "更緊／更乾淨（比喻）", "職場"),
    ],
    [
        "加力度：This bid is stronger.（改成「強得多」）",
        "改錯：This option is more riskier.",
        "用 prefer…to… 說：我比較想全款而非高槓桿。",
    ],
    [
        "This bid is far / way stronger.",
        "This option is riskier. / more risky.",
        "例：I prefer all-cash to heavy leverage.",
    ],
))

LESSONS.append(lesson(
    20, "否定與限制詞", "Negation & Restrictive Adverbs",
    "否定位置影響意思；seldom/hardly/rarely 已是否定，勿再疊 don't。",
    [
        ("I don't hardly ever go.", "I hardly ever go.", "hardly 已否定"),
        ("I think he isn't coming.（轉述保留）", "I don't think he's coming.", "美式更常否定移前"),
        ("Nobody don't know.", "Nobody knows.", "雙重否定錯誤（非刻意方言）"),
        ("He can't never win.（非強調俚語時）", "He can never win. / He can't ever win.", "標準語避免 can't never"),
    ],
    [
        "一般否定：助動詞＋not；no＋名詞（*no contingency*）。",
        "限制副詞：hardly, barely, scarcely, rarely, seldom——句中已含否定意味。",
        "部分否定：*Not everyone agrees.* ≠ *Everyone doesn't agree.*（後者常不自然）",
        "C1 談判：*I'm not saying no—I'm saying not yet.*",
    ],
    [
        ("工作", "I'm not saying we walk—I'm saying we renegotiate repairs.", "我不是說要退出，而是要重談維修。"),
        ("工作", "We rarely waive inspection on older homes.", "老屋我們很少放棄驗屋。"),
        ("生活", "I barely slept after the movers left.", "搬家的人走後我幾乎沒睡。"),
        ("通用", "Not everyone on the team saw the latest deck.", "不是每個團隊成員都看過最新簡報。"),
        ("工作", "There's no upside to guessing the numbers.", "瞎猜數字沒有好處。"),
        ("生活", "Don't you dare touch that wet paint.", "你敢碰那未乾油漆試試。（口語強調）"),
    ],
    [
        ("not yet", "還不行／尚未", "中性"),
        ("I'm not saying…—I'm saying…", "澄清立場句式", "職場"),
        ("barely / hardly", "幾乎不", "中性"),
        ("no upside", "沒有好處／上行", "職場"),
    ],
    [
        "改錯：I don't rarely eat out.",
        "改成美式更自然：I think we shouldn't rush.",
        "用 I'm not saying… 澄清：不是嫌屋況，是嫌時程。",
    ],
    [
        "I rarely eat out.",
        "I don't think we should rush.",
        "例：I'm not saying the house is bad—I'm saying the timeline is.",
    ],
))

# ========== BOOK 4 ==========
LESSONS.append(("冊 4｜現代慣用語與口語潤滑（Lessons 21–28）",
"這冊是 C1「聽起來像會開會的人」的核心：語域意識＋高頻 chunks。與文法冊獨立，可單獨刷。"))

LESSONS.append(lesson(
    21, "Discourse markers", "Discourse Markers: Actually / That said / Long story short",
    "話語標記不增資訊，但管理節奏：糾正、讓步、收束、換軌。",
    [
        ("Actually, I totally agree.（若真同意）", "Exactly. / Right. — Actually 常用於輕微糾正", "Actually≠「事實上我超同意」"),
        ("Long story short, so basically…（冗餘）", "Long story short, …", "擇一收束"),
        ("However 每句都用", "口語多用 but / that said", "語域匹配"),
        ("I mean, like, you know…（過度填充）", "適度；C1 要能拿掉填充詞仍清楚", "填充≠流利"),
    ],
    [
        "糾正／精準化：actually, in fact, to be clear。",
        "讓步：that said, still, even so, all the same。",
        "收束：long story short, bottom line, net-net（偏職場）。",
        "換軌：anyway, in any case, moving on。",
    ],
    [
        ("工作", "I liked the unit. That said, the HOA dues are steep.", "單位我喜歡。不過管理費偏高。"),
        ("工作", "Long story short, we need another lender quote.", "長話短說，我們需要另一家貸方報價。"),
        ("生活", "Actually, dinner's on me—you drove.", "其實晚餐我請，你開的車。"),
        ("通用", "To be clear, I'm fine with the price, not the timeline.", "講清楚：價格可以，時程不行。"),
        ("工作", "Anyway, let's park that and finish the punch list.", "總之先擱置，把待修清單收完。"),
        ("生活", "Net-net, the weekend was worth the chaos.", "總帳來看，這週末的混亂值得。"),
    ],
    [
        ("that said", "話雖如此", "職場／中性"),
        ("long story short", "長話短說", "口語／中性"),
        ("to be clear", "先講清楚", "職場"),
        ("park that", "先擱置議題", "職場"),
    ],
    [
        "用 that said 連接：喜歡這間。停車位太小。",
        "何時不該用 Actually？",
        "用 to be clear 寫一句對齊範圍。",
    ],
    [
        "例：I like the place. That said, the parking space is tiny.",
        "當你完全同意、無需糾正時，改用 Right/Exactly。",
        "例：To be clear, we're approving phase one only.",
    ],
))

LESSONS.append(lesson(
    22, "軟化語氣", "Softening: kind of / a bit / I was wondering if…",
    "美式職場靠軟化保持關係；C1 要會軟，也要會在該清楚時收掉軟詞。",
    [
        ("You are wrong.", "I might be missing something, but… / I'm not sure that tracks.", "異議軟化"),
        ("I want you to send it.", "Could you send it when you get a chance?", "請求軟化"),
        ("This is kind of a disaster.（對客戶）", "We've hit a snag. / This needs a rethink.", "對客戶少用過輕浮詞"),
        ("I was wondering if you can…（語氣不穩）", "I was wondering if you could…", "假想過去更軟"),
    ],
    [
        "程度軟詞：a bit, kind of/kinda, somewhat, pretty（美式）。",
        "認識軟化：I was wondering if…, Would you be open to…, If it's not too much trouble…。",
        "立場軟化：It seems…, My sense is…, From where I sit…。",
        "警告：對安全、法律、錢的底線不要過度 soft——C1＝會切換語域。",
    ],
    [
        ("工作", "I was wondering if we could revisit the credit amount.", "不知能否重新談一下折讓金額。"),
        ("工作", "My sense is we're a week early to lock.", "我感覺現在鎖利早了一週。"),
        ("生活", "It's kind of loud for a Sunday morning.", "週日早上來說有點吵。"),
        ("通用", "Would you be open to pushing this to Friday?", "你願意改到週五嗎？"),
        ("工作", "We're seeing a bit of slippage on the appraisal.", "估價進度有點滑落。"),
        ("生活", "If it's not too much trouble, could you grab milk?", "不麻煩的話，可以順便帶牛奶嗎？"),
    ],
    [
        ("I was wondering if…", "不知可否…（很軟）", "職場"),
        ("my sense is…", "我的感覺是…", "職場"),
        ("would you be open to…", "你願不願意考慮…", "職場"),
        ("hit a snag", "遇到阻礙", "中性／職場"),
    ],
    [
        "軟化：Your estimate is too high.",
        "把過度軟的底線改清楚：We kind of maybe can't close without insurance.",
        "用 I was wondering if 請求改期。",
    ],
    [
        "例：I'm concerned the estimate may be high. / That estimate feels rich to me.",
        "例：We can't close without insurance.",
        "例：I was wondering if we could move our meeting to Thursday.",
    ],
))

LESSONS.append(lesson(
    23, "同意與異議", "Agreeing & Disagreeing Professionally",
    "同意要具體；異議先對齊再 push back——這是美式會議的預設禮儀。",
    [
        ("You're wrong, and here's why.", "I see it differently. Here's why.", "先換視角"),
        ("I disagree.（過於乾）", "I'm not sure I follow. / I have a different read on…", "加一點互動"),
        ("Whatever you say.", "I can get behind that. / Let's go with your call.", "Whatever 易顯消極"),
        ("No.", "I'd push back on that. / That doesn't work for me.", "給出可執行的否"),
    ],
    [
        "同意：Exactly, Fair point, That's fair, I'm with you on…, 100%（口語）。",
        "部分同意：True, but… / I agree up to a point. / Fair, though…",
        "異議：I'd push back on… / I don't think that tracks. / Can we reality-check that?",
        "升級澄清：Help me understand… / What are we optimizing for?",
    ],
    [
        ("工作", "Fair point on the timeline—I'd still push back on cutting inspection.", "時程說得對；但我仍反對砍驗屋。"),
        ("工作", "I'm with you on price. I'm not with you on waiving appraisal.", "價格我同意；放棄估價我不同意。"),
        ("生活", "That's fair. I should've texted before I was late.", "說得對，我晚到前該先傳訊。"),
        ("通用", "I don't think that tracks with the comps we pulled.", "這和我們抓的可比案例對不上。"),
        ("工作", "Help me understand what success looks like on Friday.", "幫我理解週五的成功長什麼樣。"),
        ("生活", "I can get behind pizza tonight.", "今晚披薩我贊成。"),
    ],
    [
        ("fair point", "說得有理", "職場／口語"),
        ("push back (on)", "提出反對／頂回去", "職場"),
        ("that tracks / doesn't track", "說得通／對不上", "口語／職場"),
        ("I'm with you on…", "在…上我站你這邊", "口語／職場"),
    ],
    [
        "部分同意：同意預算，不同意砍品管。",
        "用 push back 反對「免驗屋」。",
        "把粗暴句改寫：That idea is stupid.",
    ],
    [
        "例：I'm with you on the budget. I'd push back on cutting QA.",
        "例：I'd push back on waiving inspection.",
        "例：I see it differently—here's my concern…",
    ],
))

LESSONS.append(lesson(
    24, "工作高頻 chunks", "Workplace Chunks: circle back / take the lead / on my plate",
    "這些套語是美式辦公室的「作業系統」；C1 要會用也要會聽出負荷與責任。",
    [
        ("I will circle back you.", "I'll circle back with you. / I'll circle back on this.", "介系詞"),
        ("Please do the needful.（南亞英文殘留，美式少用）", "Please take care of this. / Please advise.", "語域"),
        ("I will revert back soon.（冗餘）", "I'll get back to you soon.", "美式更自然"),
        ("Let's touch base going forward prospectively…", "Let's touch base next week.", "別堆疊廢話"),
    ],
    [
        "同步：circle back, touch base, keep you in the loop, ping me。",
        "責任：take the lead, own it, on my plate, bandwidth。",
        "決策：call the shot, align on, sign off, greenlight。",
        "進度：moving pieces, blocker, pending, action item。",
    ],
    [
        ("工作", "I'll take the lead on the lender package.", "貸方文件包我來主導。"),
        ("工作", "Can we circle back after you talk to title?", "你跟產權公司談完我們再回頭對一下？"),
        ("工作", "I don't have bandwidth for another walkthrough this week.", "這週我沒容量再排實地查看。"),
        ("通用", "Keep me in the loop if the numbers move.", "數字有動就讓我知情。"),
        ("工作", "What's the blocker on the HOA letter?", "社區證明信卡在哪？"),
        ("生活", "Ping me when you're downstairs.", "你到樓下戳我一下。"),
    ],
    [
        ("circle back", "稍後再談／再聯絡", "職場"),
        ("bandwidth", "可用時間／精力", "職場"),
        ("in the loop", "在知情圈內", "職場"),
        ("blocker", "卡點", "職場"),
    ],
    [
        "用 on my plate 說明你這週為何不能接新案。",
        "改錯：I'll revert back to you after lunch.",
        "用 take the lead 主動承接驗屋協調。",
    ],
    [
        "例：That's already on my plate this week.",
        "I'll get back to you after lunch.",
        "例：I'll take the lead on coordinating the inspection.",
    ],
))

LESSONS.append(lesson(
    25, "時間與優先", "Time & Priority: ASAP, by EOD, in the loop",
    "時間套語有文化：ASAP 常變噪音；C1 改給明確截止與優先級。",
    [
        ("ASAP!!!", "Needed by 3 p.m. today. / Blocking others—need today.", "給原因＋時間"),
        ("Do it when you can.（太飄）", "Anytime before Thursday works.", "給窗格"),
        ("EOD 不說時區", "EOD CT / by 5 p.m. your time", "遠距必備"),
        ("It's urgent.（每件事）", "P1 vs P2；這次真的擋路", "優先級紀律"),
    ],
    [
        "明確優於模糊：by Tuesday 3 p.m. CT > ASAP。",
        "常用：by EOD, COB（close of business）, EOW, close of play（較英式，美式少）。",
        "優先：blocking / non-blocking；need eyes on；quick turn。",
        "禮貌窗：when you get a chance（真的不急）；若急不要用這句。",
    ],
    [
        ("工作", "Need a quick turn on page two—ideally before lunch CT.", "第二頁需要快修，最好中午 CT 前。"),
        ("工作", "This is blocking the appraisal order.", "這卡住估價下單。"),
        ("生活", "No rush—anytime this weekend is fine.", "不急，週末隨時都可以。"),
        ("通用", "Let's timebox this discussion to ten minutes.", "這段討論限時十分鐘。"),
        ("工作", "If I don't hear back by EOW, I'll assume we're pausing.", "若週末前沒回音，我就當暫停。"),
        ("生活", "I'm slammed today; can we do tomorrow morning?", "我今天爆忙，明天早上可以嗎？"),
    ],
    [
        ("by EOD / EOW", "今日／本週結束前", "職場"),
        ("no rush", "不急", "口語／中性"),
        ("slammed", "忙到爆", "口語"),
        ("timebox", "限時討論／作業", "職場"),
    ],
    [
        "把 ASAP 改成可執行截止。",
        "用 blocking 說明為何要優先。",
        "寫一句：不急，但最好週三前。",
    ],
    [
        "例：Please send by 2 p.m. CT today.",
        "例：This is blocking the lender submission.",
        "例：No rush, but ideally before Wednesday.",
    ],
))

LESSONS.append(lesson(
    26, "情緒與評價", "Emotions & Evaluations: overwhelmed / solid / underwhelming",
    "評價詞要準：solid 是職場誇讚高頻；underwhelming 是客氣的失望。",
    [
        ("I'm very fine.", "I'm good. / I'm fine. / Doing well.", "very fine 不自然"),
        ("The presentation was satisfying.（偏中式）", "The presentation was solid / strong / clear.", "選美式評價詞"),
        ("I am exciting about…", "I'm excited about…", "exciting vs excited"),
        ("It was so so.", "It was okay / meh / underwhelming.", "給出清楚梯度"),
    ],
    [
        "正面：solid, strong, clean, sharp, helpful, thoughtful。",
        "中性／保留：fine, okay, decent, mixed。",
        "負面客氣：underwhelming, rough, messy, thin, concerning。",
        "狀態：overwhelmed, stretched, burned out, wired, wiped。",
    ],
    [
        ("工作", "The deck is solid; the appendix is still thin.", "主簡報很穩；附錄仍偏薄。"),
        ("工作", "I'm a bit overwhelmed with closings this month.", "這個月成交件數讓我有點負荷過重。"),
        ("生活", "The restaurant was underwhelming for the price.", "以價格來說那餐廳讓人失望。"),
        ("通用", "I'm excited about the renovation, and also slightly terrified.", "翻修讓我興奮，也有點害怕。"),
        ("工作", "That was a thoughtful redline—thanks.", "紅線意見很用心，謝了。"),
        ("生活", "I'm wiped; can we do a quiet night?", "我累慘了，今晚低調可以嗎？"),
    ],
    [
        ("solid", "紮實、可靠（誇）", "職場／口語"),
        ("underwhelming", "未達期待", "中性／客氣"),
        ("overwhelmed", "負荷過重", "中性"),
        ("thoughtful", "想得周到", "中性／職場"),
    ],
    [
        "用 solid / thin 評價一份報告。",
        "改錯：I am boring in meetings.（若指自己覺得無聊）",
        "客氣批評一頓過鹹的晚餐。",
    ],
    [
        "例：The executive summary is solid; the data section is thin.",
        "I'm bored in meetings. / Meetings bore me.",
        "例：Dinner was a bit underwhelming—way too salty.",
    ],
))

LESSONS.append(lesson(
    27, "生活慣用", "Everyday Chunks: I'm down / I'm all set / No rush / My bad",
    "日常 chunks 讓你聽起來不像教科書；語域仍要分朋友 vs 客戶。",
    [
        ("I am downfall…", "I'm down (to…).", "down＝願意參加"),
        ("I all set.", "I'm all set.", "要完整"),
        ("My evil.（誤）", "My bad.", "道歉口語"),
        ("對客戶說 You guys suck, my bad.", "對客戶用 Sorry about that. / That's on me.", "語域"),
    ],
    [
        "邀約：I'm down, Count me in, I'll take a rain check, I'm out。",
        "狀態：I'm all set, I'm good, I'm set on…（已決定）。",
        "道歉：My bad（熟）, That's on me（更負責）, Sorry about that。",
        "節奏：No rush, Take your time, Whenever works。",
    ],
    [
        ("生活", "I'm down for a hike if we start early.", "若早出發，我願意去健行。"),
        ("生活", "I'm all set on drinks—thanks.", "飲料我這邊夠了，謝啦。"),
        ("生活", "My bad—I grabbed your charger.", "我的錯，拿了你的充電器。"),
        ("通用", "No rush on the photos; next week is fine.", "照片不急，下週可以。"),
        ("工作", "That's on me—I sent the wrong link.", "怪我，寄錯連結。"),
        ("生活", "I'll take a rain check on drinks; I'm wiped.", "喝酒改天，我累了。"),
    ],
    [
        ("I'm down", "我願意／算我一個", "口語"),
        ("I'm all set", "我好了／不需要了", "口語"),
        ("my bad", "我的錯", "口語"),
        ("rain check", "改天再約", "口語"),
    ],
    [
        "用 I'm down 回覆週末看房邀請。",
        "把 My bad 改成對客戶可用的負責句。",
        "用 rain check 婉拒今晚聚餐。",
    ],
    [
        "例：I'm down to tour places this weekend.",
        "例：That's on me—I sent the wrong version. Apologies.",
        "例：I'll take a rain check on dinner tonight.",
    ],
))

LESSONS.append(lesson(
    28, "慎用區：slang 與過時語", "Handle with Care: Slang, Hype & Dated Phrases",
    "C1 包含「認得、能理解、卻知道何時不說」；潮流語有保存期限。",
    [
        ("對貸方說 This deal is lit.", "This deal looks strong.", "語域錯誤"),
        ("Please do the needful. / Per my last email（攻擊性）", "改具體請求；少用武器化套話", "職場地雷"),
        ("Irregardless", "Regardless", "非標準"),
        ("ASAP 當個性", "明確截止", "見 L25"),
    ],
    [
        "可理解但慎用：lit, adulting, vibe check, no cap, bet（世代／場合敏感）。",
        "過時或空洞：synergy（滥用）, think outside the box（陳腔）, circle back 每句都用。",
        "易冒犯：guys（視聽眾）、bossy、某些年齡／身體評論。",
        "策略：會議聽得懂 slang；自己產出以中性＋精準為主。",
    ],
    [
        ("工作", "I'm comfortable saying the upside is real; I wouldn't call it 'a no-brainer' yet.", "上行空間我認可；但我還不會說這是「不用想」的單。"),
        ("工作", "Following up on my email from Tuesday—do you need anything else from me?", "跟進週二的信：你還需要我這邊什麼嗎？"),
        ("生活", "The place has a great vibe, but vibe won't fix the foundation.", "氛圍很好，但氛圍修不好地基。"),
        ("通用", "Regardless of the hype, we underwrite the numbers.", "不論炒作如何，我們還是看數字。"),
        ("工作", "Let's avoid buzzwords and name the actual risk.", "少點術語空話，把真正風險說出來。"),
        ("生活", "I get the meme; I still need the address.", "迷因我懂，但我還是需要地址。"),
    ],
    [
        ("no-brainer", "顯而易見的決定（口語）", "口語／慎用於嚴肅場合"),
        ("underwrite", "審核風險／評估可行性", "職場"),
        ("hype", "炒作、過熱宣傳", "中性／口語"),
        ("buzzword", "流行空話", "職場"),
    ],
    [
        "把 lit 句改成職場可用。",
        "改寫攻擊性：Per my last email, you still haven't replied.",
        "舉一例：你會說但不會寫進給客戶的信的詞。",
    ],
    [
        "例：This opportunity looks strong / compelling.",
        "例：Just following up on my previous email—wanted to check if you need anything else from me.",
        "例：vibe / lit / no cap 等（合理即可）。",
    ],
))

# ========== BOOK 5 ==========
LESSONS.append(("冊 5｜場景包 Lifestyle／Real Estate（Lessons 29–32）",
"把文法與慣用語丟進真實場景；本冊現在就寫進文檔，供後續 Real Estate／Lifestyle 模組重用。"))

LESSONS.append(lesson(
    29, "約時間、改期、遲到", "Scheduling, Rescheduling & Running Late",
    "美式約時間重「給選項＋確認時區／地點」；遲到要早通知＋ETA。",
    [
        ("Are you free?" , "Do you have 30 minutes Thursday? / What times work for you?", "給框架"),
        ("I will late.", "I'm running late. / I'm going to be about 15 minutes late.", "固定說法"),
        ("Maybe we change time.", "Could we move it to 3? / Can we push it an hour?", "明確動作"),
        ("Waiting you.", "I'll be there. / See you soon. / I'm out front.", "狀態清楚"),
    ],
    [
        "邀約結構：目的＋長度＋兩三個時段＋地點／連結。",
        "改期：move / push / pull forward；附新選項。",
        "遲到：提前傳訊＋原因短句＋ETA；到了說 I'm here / I'm out front。",
        "取消：I need to cancel（清楚）＋propose a new time。",
    ],
    [
        ("工作", "Can we do a 20-minute call Thursday at 2 CT or Friday at 10?", "週四下午兩點 CT 或週五十點，二十分鐘電話可以嗎？"),
        ("工作", "Something came up—can we push our walkthrough to 4?", "臨時有事，實地查看能推到四點嗎？"),
        ("生活", "I'm running about ten minutes late; traffic on 35 is a mess.", "我會晚約十分鐘；35 號公路塞爆。"),
        ("通用", "I'm out front whenever you're ready.", "我在門口，你準備好就行。"),
        ("生活", "Rain check on coffee? Next week is better on my end.", "咖啡改天？我這邊下週比較好。"),
        ("工作", "Confirming we're still on for Tuesday's inspection at 9.", "確認週二九點驗屋仍照常。"),
    ],
    [
        ("running late", "會晚到", "中性"),
        ("push / move (a meeting)", "改晚／改期", "職場"),
        ("still on for…", "仍預定…", "中性"),
        ("out front", "在門口／前方", "口語"),
    ],
    [
        "寫一則改期簡訊：驗屋改到隔天下午 3 點。",
        "遲到 15 分鐘給貸方的得體訊息。",
        "用 still on for 確認看房。",
    ],
    [
        "例：Can we move the inspection to tomorrow at 3?",
        "例：I'm running about 15 minutes late—apologies. ETA 2:15.",
        "例：Confirming we're still on for the showing at 5.",
    ],
))

LESSONS.append(lesson(
    30, "餐敘、咖啡、小型聚會", "Dining Out, Coffee & Small Gatherings",
    "點餐、分帳、過敏與離開場合的套語；偏美式日常生活。",
    [
        ("I eat this.", "I'll have the salmon. / Can I get the…?", "點餐句式"),
        ("Let's AA.", "Want to split it? / Can we get separate checks?", "美式分帳說法"),
        ("I am inconvenient.", "It's a bit inconvenient. / That doesn't work for me.", "用詞"),
        ("Please eat more.（勸菜）", "Please help yourself. / Don't be shy.", "美式較不勉強夾菜"),
    ],
    [
        "點餐：I'll have… / Can I get… / I'd like…；改單 *Actually, make that…*。",
        "飲食限制：I'm allergic to… / I don't drink / I'm trying to avoid…。",
        "結帳：split the check, separate checks, I've got this（我請）。",
        "離席：I'm going to head out / I should get going。",
    ],
    [
        ("生活", "I'll have the burger, medium, and a sparkling water.", "我要漢堡三分熟，加氣泡水。"),
        ("生活", "I'm allergic to tree nuts—does this sauce have any?", "我對樹堅果過敏，這醬有嗎？"),
        ("生活", "Want to split it, or should we get separate checks?", "要拆分還是各付各的？"),
        ("通用", "I've got this—you got dinner last time.", "這次我請，上次你請的晚餐。"),
        ("生活", "I'm going to head out after this drink.", "這杯完我先走。"),
        ("工作", "Coffee near the office at 9? I'll grab a table.", "九點辦公室附近咖啡？我先占桌。"),
    ],
    [
        ("Can I get…?", "我要…（點餐）", "口語"),
        ("I've got this", "我來付", "口語"),
        ("head out", "離開", "口語"),
        ("grab a table", "先占桌", "口語"),
    ],
    [
        "點餐：中稀牛排＋冰茶。",
        "得體詢問花生過敏。",
        "用 I've got this 請同事咖啡。",
    ],
    [
        "例：I'll have the steak medium-rare, and an iced tea.",
        "例：I'm allergic to peanuts—could you check whether this has any?",
        "例：I've got this—coffee's on me.",
    ],
))

LESSONS.append(lesson(
    31, "看房、裝修、報修", "Real Estate: Showings, Remodels & Repairs",
    "看房與裝修是高頻實戰英語：狀況描述、條件談判、工人協調。",
    [
        ("The house is very old but good.", "It's dated, but the bones are good.", "行內常用比喻"),
        ("Price too high, lower please.", "Would you consider a credit for roof work? / We're at X.", "談判完整"),
        ("Toilet has problem.", "The toilet is running / leaking / won't flush.", "具體故障"),
        ("Decoration is beautiful.", "The finishes are high-end / The updates are cosmetic.", "分清結構vs表面"),
    ],
    [
        "看房：showing, open house, listing, comps, days on market, under contract。",
        "屋況：bones, deferred maintenance, cosmetic updates, turnkey, as-is。",
        "流程：inspection, appraisal, contingency, escrow, closing, punch list。",
        "報修：running toilet, tripped breaker, not cooling, moisture intrusion。",
    ],
    [
        ("工作", "The bones are good; most of what you're seeing is deferred maintenance.", "主體結構不錯；你看到的多半是延宕維護。"),
        ("工作", "We're requesting a $6,000 credit for HVAC replacement.", "我們要求六千美元折讓以更換空調。"),
        ("生活", "The AC is running but not cooling—might be low on refrigerant.", "空調有運轉但不冷，可能冷媒不足。"),
        ("通用", "It's listed as turnkey, but I'd still budget for paint and landscaping.", "雖標配好即住，我仍會編油漆與景觀預算。"),
        ("工作", "Inspection is Friday; appraisal should be ordered after that.", "週五驗屋；之後再下估價單。"),
        ("生活", "There's moisture staining on the ceiling under the upstairs bath.", "樓上浴室下方天花板有水漬。"),
    ],
    [
        ("the bones are good", "屋體／結構底子好", "房地產"),
        ("deferred maintenance", "延宕未修的維護", "房地產"),
        ("repair credit", "以折讓代替卖方施工", "房地產"),
        ("turnkey", "可直接入住／營運", "房地產"),
    ],
    [
        "用 bones / deferred maintenance 描述一間 90 年代屋。",
        "寫一句要求屋頂維修折讓。",
        "具體描述：馬桶一直流水。",
    ],
    [
        "例：The bones are good, but there's deferred maintenance throughout.",
        "例：We're asking for a credit to address the roof.",
        "例：The toilet is running.",
    ],
))

LESSONS.append(lesson(
    32, "旅行與服務業交涉", "Travel & Service Situations",
    "延誤、升級、投诉要短、清楚、有請求；情緒穩定比單字華麗重要。",
    [
        ("I want compensate.", "I'd like a refund / voucher / rebooking. What are my options?", "要具體救濟"),
        ("This is too bad service.", "The wait has been over an hour—can you help escalate?", "事實＋請求"),
        ("I lose my bag.", "My bag didn't show up. Here's my tag.", "現在完成／具體"),
        ("Upgrade me.", "Is there any complimentary upgrade available tonight?", "禮貌＋現實"),
    ],
    [
        "結構：狀況一句＋已嘗試＋明確請求＋感謝。",
        "旅遊詞：connection, gate change, standby, rebook, voucher, incidentals。",
        "住宿：late checkout, comp, smoke smell, room change, folio。",
        "保持 C1：堅定但不動怒；*I understand it's busy—still, I need…*",
    ],
    [
        ("生活", "My connection is tight—can you see if there's an earlier seat?", "轉機很緊，能看有沒有更早的位子嗎？"),
        ("生活", "The room smells like smoke; could we change rooms tonight?", "房間有煙味，今晚可以換房嗎？"),
        ("通用", "I'd like to rebook on the next available flight, please.", "請幫我改訂下一班有位子的航班。"),
        ("工作", "I need the receipt itemized for reimbursement.", "報銷需要明細收據。"),
        ("生活", "Is late checkout available, even for a fee?", "晚退房可以嗎？付費也行。"),
        ("通用", "I understand it's busy; I still need help finding my bag.", "我理解現在很忙，但我仍需要協助找行李。"),
    ],
    [
        ("rebook", "改訂", "中性"),
        ("voucher", "抵用券", "中性"),
        ("escalate", "向上呈報／升級處理", "職場／服務"),
        ("itemized receipt", "明細收據", "職場"),
    ],
    [
        "航班取消：用三句（狀況／請求／選項）。",
        "飯店煙味：請求換房。",
        "用 escalate 禮貌升級。",
    ],
    [
        "例：My flight was canceled. I'd like to rebook tonight. What are my options?",
        "例：The room smells like smoke—could we change rooms?",
        "例：Could you escalate this to a supervisor, please?",
    ],
))

# ========== BOOK 6 ==========
LESSONS.append(("冊 6｜進階表達（Lessons 33–36）",
"把語氣、回饋、簡報與寫作收成可上戰場的 C1 技能；仍與 `english V.md` 獨立。"))

LESSONS.append(lesson(
    33, "委婉拒絕與邊界", "Polite No & Boundaries",
    "拒絕要短、穩、給替代或時間盒；C1 的「不」不需過度道歉。",
    [
        ("Maybe later…（永遠 later）", "I can't take that on this month. I can revisit in June.", "可驗證的边界"),
        ("No problem!（其實有問題）", "That won't work for me. / I have to say no.", "別假同意"),
        ("I'll try…（當你做不到）", "I won't be able to. / I can do X instead.", "承諾管理"),
        ("You never help me!（控訴）", "I need help with X by Y.", "要請求非指責"),
    ],
    [
        "公式：感謝／認可＋清晰拒絕＋理由（可選短）＋替代方案。",
        "邊界句：I don't have bandwidth. / I'm not available for that. / That's outside my scope.",
        "軟拒絕仍清楚：I'm going to pass. / I'll have to decline.",
        "對重複施壓：I've already said no on that—happy to help with Z instead.",
    ],
    [
        ("工作", "I'm going to pass on leading that committee; I can contribute once a month.", "委員會主導我先不接；我可以每月貢獻一次。"),
        ("工作", "I can't take another listing this quarter without dropping quality.", "這季再接案會犧牲品質，我接不了。"),
        ("生活", "I'm not free that night, but Sunday works.", "那晚不行，週日可以。"),
        ("通用", "I'll have to decline dinner, but thank you for including me.", "晚餐我得婉拒，謝謝邀請。"),
        ("工作", "That's outside my scope—you'll want compliance on that one.", "那超出我範圍，你該找合規。"),
        ("生活", "I need some quiet time after work tonight.", "今晚下班後我需要安靜時間。"),
    ],
    [
        ("I'm going to pass", "我放棄／不參與", "口語／職場"),
        ("outside my scope", "超出職責範圍", "職場"),
        ("I won't be able to…", "我無法…", "中性"),
        ("happy to help with…", "…可以幫忙（設邊界後）", "職場"),
    ],
    [
        "拒絕額外專案但提出替代。",
        "把 Maybe later 改成可驗證句。",
        "對朋友勸酒：清楚邊界一句。",
    ],
    [
        "例：I can't own that project; I can review the deck on Friday.",
        "例：I can't do June; let's revisit in July.",
        "例：I'm not drinking tonight—thanks though.",
    ],
))

LESSONS.append(lesson(
    34, "給回饋：讚美與建設性", "Feedback: Praise & Constructive Notes",
    "回饋要具體行為＋影響＋請求；讚美也要可複現，不是空喊 great。",
    [
        ("This is bad.", "The intro loses me—can we lead with the ask?", "可行動"),
        ("Good job.", "The comps table was clear and saved us time.", "具體讚美"),
        ("You always…", "In yesterday's call, when X happened…", "指事件非人格"),
        ("Don't take this personally, but…（常更傷）", "直接進行為與影響", "少用免責前言"),
    ],
    [
        "讚美：具體行為＋效果。",
        "改進：觀察＋影響＋建議／問題（SBI 思維可）。",
        "語氣：I-statements；問句邀請共創（*How do you see it?*）。",
        "書面：條列 notes；分 must-fix vs nice-to-have。",
    ],
    [
        ("工作", "The executive summary was sharp—I knew the ask in ten seconds.", "執行摘要很利落，十秒就知道訴求。"),
        ("工作", "In the client call, the pause after their objection helped. Let's do more of that.", "客戶異議後你的停頓很有用，以後多保留。"),
        ("工作", "The pricing slide confuses me—can we separate fee vs credit?", "定價頁我看不懂，能把費用跟折讓拆開嗎？"),
        ("生活", "Thanks for handling the contractor—that saved my afternoon.", "謝謝你應付承包商，救了我一下午。"),
        ("通用", "Two must-fixes: timeline and owner. The rest is optional polish.", "兩項必改：時程與負責人；其餘是潤飾。"),
        ("工作", "How do you see the risk on appraisal timing?", "你怎看估價時程的風險？"),
    ],
    [
        ("must-fix", "必改項", "職場"),
        ("nice-to-have", "有更好、非必須", "職場"),
        ("the ask", "明確訴求", "職場"),
        ("sharp", "俐落、精準（誇）", "職場／口語"),
    ],
    [
        "讚美同事清楚的會議紀錄（具體）。",
        "建設性回饋：簡報太長。",
        "把 You always interrupt 改成事件型回饋。",
    ],
    [
        "例：Your notes captured decisions and owners—that made follow-up easy.",
        "例：The deck loses energy after slide 8—can we cut two case studies?",
        "例：In stand-up today, I got cut off twice—can we use a hand-raise?",
    ],
))

LESSONS.append(lesson(
    35, "簡報與數據說明", "Presenting Numbers & Narratives",
    "講數字先給結論，再給證據；用對比與範圍，避免假精確。",
    [
        ("Maybe increase a little.", "Up about 8% year-over-year, mostly from renewals.", "量級＋原因"),
        ("The data says everything.", "Two takeaways: …", "幫聽眾摘要"),
        ("It's increased 8.3721%.", "Up roughly 8%.", "口語適當取整"),
        ("As you can see…（填詞過多）", "直述重點；圖自己會說話時少廢話", "節奏"),
    ],
    [
        "順序：headline → 2–3 supports → implication / ask。",
        "比較：vs last year, vs plan, vs comps；用 *in line with / ahead of / behind*。",
        "不確定：roughly, about, on the order of, directionally。",
        "問答：*Great question—here's the short version…*",
    ],
    [
        ("工作", "Headline: occupancy is at 94%, ahead of plan.", "重點：出租率 94%，優於計畫。"),
        ("工作", "Repairs came in about $12k, mostly HVAC and plumbing.", "維修大約 1.2 萬，主要是空調與水管。"),
        ("通用", "Directionally, we're fine; the risk is concentration in one tenant.", "方向沒問題；風險是租戶過度集中。"),
        ("工作", "Versus comps, we're priced 3% under for a faster close.", "相對可比，我們低價約 3% 以換更快成交。"),
        ("生活", "The remodel ran 15% over budget—lesson learned on allowances.", "翻修超支 15%，關於預留金我學到了。"),
        ("工作", "If you remember one thing: lock the rate before Friday's print.", "只記一件事：週五數據前先鎖利。"),
    ],
    [
        ("headline", "一句話結論", "職場"),
        ("directionally", "方向上（不求假精確）", "職場"),
        ("ahead of / behind plan", "優於／落後計畫", "職場"),
        ("versus comps", "相對可比對象", "職場／房地產"),
    ],
    [
        "用 Headline: 說出租率與計畫比較。",
        "把 8.3721% 改成口語簡報句。",
        "用 directionally 談屋況風險。",
    ],
    [
        "例：Headline: occupancy is ahead of plan at 94%.",
        "例：We're up roughly 8% year-over-year.",
        "例：Directionally fine, but the roof is the swing factor.",
    ],
))

LESSONS.append(lesson(
    36, "Email／訊息短句模板", "Email & Message Templates (Spoken vs Written)",
    "寫作比口語更短、更可掃讀；主旨明確，行動與截止放在前面。",
    [
        ("Just circling back…（無資訊）", "Circling back on the HOA docs—need them by Wed to keep closing.", "加內容"),
        ("Please kindly do the needful.", "Please send the signed addendum by 3 p.m. CT.", "具體"),
        ("Sorry for the long email.", "（直接寫短的）三點條列", "別預先道歉太長"),
        ("FYI.（卻要人做事）", "Action needed: … / FYI only—no action.", "分清 FYI vs Action"),
    ],
    [
        "主旨：主題＋行動／日期（*Inspection confirm — Fri 9am*）。",
        "開頭一句情境；中間條列；結尾 ask＋謝謝。",
        "訊息（SMS/Slack）可更短：情境→請求→截止。",
        "口語會議 vs 書面：口語可用 kind of；書面改清晰動詞。",
    ],
    [
        ("工作", "Subject: Rate lock — decision needed by 2 p.m. CT", "主旨：鎖利——需下午 2 點 CT 前決定"),
        ("工作", "Hi Maya — Quick ask: can you send the T-12 today? We're blocked on underwriting without it.", "快捷請求：今天能否寄 T-12？沒它審核卡住。"),
        ("工作", "FYI only: walkthrough moved to 4. No action needed.", "僅供參考：實地查看改四點。無需行動。"),
        ("通用", "Thanks—received. I'll review and reply before EOD.", "收到，謝謝。我 EOD 前審完回覆。"),
        ("生活", "Running 10 late. Start without me.", "晚十分鐘。你們先開始。"),
        ("工作", "Recap: (1) we keep inspection (2) ask $6k credit (3) I call the agent.", "摘要：1 保留驗屋 2 要求 6k 折讓 3 我打給經紀人"),
    ],
    [
        ("quick ask", "簡短請求", "職場"),
        ("FYI only", "僅知會", "職場"),
        ("action needed", "需要行動", "職場"),
        ("recap", "摘要複述", "職場"),
    ],
    [
        "寫主旨：週五驗屋確認。",
        "把空洞 follow-up 改成含截止的一句。",
        "用 recap 三點條列會議結論。",
    ],
    [
        "例：Subject: Inspection confirmation — Friday 9:00",
        "例：Following up on the HOA letter—need it by Wednesday to keep closing.",
        "例：Recap: (1)… (2)… (3)…",
    ],
))

FOOTER = r'''
# 附錄 A｜建議學習節奏

| 週次 | 內容 | 目標 |
|------|------|------|
| 1–2 | 冊 1（L01–08） | 時態／情態／條件穩定 |
| 3 | 冊 2（L09–14） | 句子結構自然 |
| 4 | 冊 3（L15–20） | 消滅高頻錯誤 |
| 5–6 | 冊 4（L21–28） | 會議口語潤滑 |
| 7 | 冊 5（L29–32） | 場景實戰 |
| 8 | 冊 6（L33–36） | 回饋／簡報／寫作 |
| 之後 | 錯題回鍋＋自造句 | 推向穩定 C1 |

---

# 附錄 B｜上架網站前的打磨清單（討論用）

- [ ] 每課例句是否要再偏「個人生活」或「投資／房產」更多？
- [ ] 練習題要不要改成可自動批改的選擇題結構？
- [ ] 是否為每課加 80–120 字跟讀短文（接 Speak）？
- [ ] 音檔要 TTS 還是真人？
- [ ] 與 `english V.md` 是否做「選配雙向連結」（目前獨立）？
- [ ] Real Estate 術語是否拆成獨立 glossary？

---

# 附錄 C｜檔案與版本

| 項目 | 說明 |
|------|------|
| 檔名 | `english grammar.md` |
| 課數 | 36（6 冊） |
| 語體 | 美式；日常＋職場 |
| 程度 | 指向 C1 |
| 網站 | **尚未接入**；打磨後再編譯進 `web/` |

*— End of draft —*
'''

text = [HEADER]
for item in LESSONS:
    if isinstance(item, tuple) and len(item) == 2 and str(item[0]).startswith("冊"):
        text.append(f"# {item[0]}\n\n{item[1]}\n\n---\n\n")
    else:
        text.append(item)
text.append(FOOTER)

OUT.write_text("".join(text), encoding="utf-8")
print(f"Wrote {OUT}")
print(f"Bytes: {OUT.stat().st_size}")
