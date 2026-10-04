# -*- coding: utf-8 -*-
"""Enrich english grammar.md: life/RE examples, speak passages, TTS notes, appendix."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "english grammar.md"

# --- passages: aim 80–120 English words ---
P = {}

P[1] = (
    "I usually keep weekends quiet, but this month I'm touring houses almost every Saturday. "
    "The neighborhood feels right, and I'm taking notes on light, noise, and parking. "
    "My agent is always sending new listings, which helps, though it's a little overwhelming. "
    "Right now I'm comparing two condos near the trail. One has a tiny kitchen; the other has better storage. "
    "I don't need perfection. I need a place that works for daily life and still makes sense as a long-term hold.",
    "我週末通常很安靜，但這個月幾乎每週六都在看房。這社區感覺對了，我邊看邊記採光、噪音和停車。"
    "經紀人老是丟新物件給我，有幫助，但也有點負荷。現在我在比較步道附近兩間公寓：一間廚房很小，另一間收納較好。"
    "我不需要完美，只要日常好住、長期持有也說得通。",
)
P[2] = (
    "We've already toured eight places this month, and I've never felt this decisive about housing before. "
    "Yesterday we saw a duplex with solid bones, but we've also noticed deferred maintenance in almost every unit. "
    "I haven't received the HOA documents yet, so I'm holding my enthusiasm. "
    "Last spring we rushed a rental decision and regretted it for a year. "
    "This time I've promised myself I'll wait until inspection and numbers both look clean.",
    "這個月我們已經看了八間，我從沒對住房這麼有決斷力。昨天看了一棟底子不錯的雙拼，但幾乎每戶都有延宕維護。"
    "社區文件我還沒收到，所以興奮先按住。去年春天我們倉促租屋，後悔了一整年。"
    "這次我跟自己約定：驗屋和數字都乾淨才往下走。",
)
P[3] = (
    "I'm going to lock a rate this week if the lender still has that quote. "
    "We're meeting the inspector on Thursday, and I'll ping you when the report lands. "
    "If repairs look expensive, we'll ask for a credit instead of walking away too fast. "
    "The seller is going to want a quick close, but I'm not going to skip diligence. "
    "Worst case, we'll rent one more year. Best case, we'll be holding keys before summer.",
    "若貸方報價還在，我這週會去鎖利。週四要和驗屋師碰面，報告一到我就戳你。"
    "若維修很貴，我們會先要求折讓，而不是太快走掉。賣方會想快成交，但我不會跳過盡職調查。"
    "最壞再租一年；最好夏天前拿到鑰匙。",
)
P[4] = (
    "We may need to push closing if the appraisal is late. You might want to loop in your lender today. "
    "Contractors have to carry insurance on site, and we shouldn't waive that requirement. "
    "I can't still believe the water heater is original—it must be near end of life. "
    "You don't have to buy furniture immediately after closing. You should, however, budget for a few urgent fixes. "
    "If the roof concerns you, we might get a specialist opinion before we finalize credits.",
    "估價若延誤，我們可能要延後成交。你今天最好就把貸方拉進來。"
    "工地承包商必須有保險，這項不該放棄。熱水器居然是原裝的，我簡直不敢信——肯定快壽終了。"
    "成交後不必立刻買齊家具，但應該編一點緊急維修預算。若擔心屋頂，定案折讓前也許該找專人看。",
)
P[5] = (
    "If the appraisal comes in low, we'll renegotiate or walk. If I were you, I'd keep the inspection contingency. "
    "If I'd known about the special assessment, I would have bid differently. "
    "Unless the HOA letter arrives, we can't lock a firm closing date. "
    "If rates keep rising, we'll lock sooner rather than later. "
    "Had we skipped the sewer scope, we might have inherited a five-figure surprise.",
    "若估價偏低，我們會重談或退出。換我是你，我會保留驗屋附條件。"
    "早知道有特別攤派，出價策略會不同。除非社區證明信到手，否則訂不了明確成交日。"
    "利率若持續升，我們寧早鎖不利晚鎖。當初若略過下水道檢測，可能吞下五位數驚喜。",
)
P[6] = (
    "The bid was submitted before noon, and the inspection has been scheduled for Friday. "
    "You'll be looped in once the redlines are ready. Nothing has been decided on the credit amount yet. "
    "Our flight got delayed, so the out-of-town buyers will see the house tomorrow. "
    "I own this miss—the wire instructions weren't sent on time. "
    "The house was built in the nineties and later remodeled, which shows in the kitchen more than the roof.",
    "標書中午前已送出，驗屋排在週五。紅線一好就會把你拉進討論；折讓金額尚未定案。"
    "班機延誤，外縣市買家改明天看屋。匯款指示沒準時寄出，這次疏失我負責。"
    "房子九〇年代建造、後來翻修過，廚房看得到，屋頂比較看不出。",
)
P[7] = (
    "I'm looking forward to walking the property with you this weekend. "
    "We can't afford to miss another inspection window, and it's worth revisiting the repair list tonight. "
    "I tried restarting the thermostat, then I tried to call the HVAC tech. "
    "Would you mind sending the rent roll again? I forgot to save it. "
    "She stopped DIY-ing electrical work years ago—and ended up hiring a licensed pro, which was smart.",
    "我很期待這週末和你一起實地看屋。我們不能再錯過驗屋時段，今晚值得重看維修清單。"
    "我試過重開恆溫器，接著才打給空調技師。可以麻煩再寄一次租金表嗎？我忘了存。"
    "她多年前就不自己碰電路了，最後請有照師傅，這很明智。",
)
P[8] = (
    "Here's the version that incorporates the inspector's notes. The contractor we hired flagged the roof first. "
    "Anyone who's been through a remodel knows dust finds every closet. "
    "The clause which felt minor at first became a real deal point in negotiations. "
    "Buyers applying after the weekend won't see this listing in time. "
    "That's the duplex I was telling you about—the one with the ADU over the garage.",
    "這版已納入驗屋師意見。我們請的承包商最先標出屋頂問題。翻修過的人都知道灰塵會鑽進每個衣櫃。"
    "起初不起眼的條款，談判時變成真正關鍵。週末後才申請看房的人趕不上這件掛牌。"
    "就是我跟你提過的那棟雙拼——車庫上方有 ADU 的那棟。",
)
P[9] = (
    "Finance still needs the final repair numbers before we resign anything. "
    "I'm not comfortable closing until we see the HOA financials. "
    "Someone left the irrigation running all night, and the yard is soaked. "
    "What matters is whether cash flow survives a cautious vacancy assumption. "
    "Our side will prepare the walkthrough checklist; their side can bring the garage remotes.",
    "在重簽任何文件前，財務仍需要最終維修數字。沒看到社區財報前，我不想成交。"
    "有人讓灌溉整晚開著，院子濕透了。重點是：保守空置假設下現金流是否還活得了。"
    "我方準備實地查看檢核表；對方帶車庫遙控器即可。",
)
P[10] = (
    "There's still a gap between our offer and their counter. It's worth noting the comps are from last spring. "
    "It's about fifteen minutes to the office without traffic. "
    "It turns out the delay was on the title company's side. "
    "There's no way I'm painting exterior trim in this heat. "
    "It's not that the price is impossible—it's that the timeline leaves no room for surprises.",
    "我們出價和對方還價仍有落差。值得注意，可比案例是去年春天的。不塞車到辦公室大約十五分鐘。"
    "結果延誤出在產權公司那邊。這種熱我不可能去漆外牆飾條。"
    "不是價格完全不可能，而是時程容不下任何意外。",
)
P[11] = (
    "The unit shows well, but the HVAC is near end of life. Diligence looks clean, so we're comfortable moving forward. "
    "I wanted a bigger yard. I chose the condo for commute reasons, though. "
    "The plan is aggressive; however, the upside on rents is real. "
    "It was crowded at the open house, and the driveway was pure chaos. "
    "Since the appraisal is delayed, we'll slip closing a few days without panicking.",
    "房子看起來漂亮，但空調快壽終。盡職調查看起來乾淨，所以我們願意往前。"
    "我原本想要更大院子，不過為了通勤還是選了公寓。計畫很積極；但租金上行確實在。"
    "開放看屋人很多，車道一片混亂。既然估價延遲，成交晚幾天，先別慌。",
)
P[12] = (
    "Even though the inspection found issues, none of them are automatic deal-breakers. "
    "Once we have clear title, we can set a firm closing date. "
    "I stayed home because I was wiped after moving boxes all day. "
    "Whereas the first unit felt dark, this one gets great afternoon light. "
    "As we discussed, the financing contingency is still on the table until the lender signs off.",
    "雖有驗屋問題，但沒有一項是自動破局。一旦產權清楚，就能訂明確成交日。"
    "搬箱子搬一天，我累壞了所以待在家。第一間偏暗，這一間下午採光很好。"
    "如我們討論過的，在貸方點頭前，貸款附條件仍可談。",
)
P[13] = (
    "We need the final repair credit number before we sign the addendum. "
    "Their all-cash offer beats our financed bid on certainty, not necessarily on price. "
    "I got three kitchen remodel quotes; the mid one feels right for scope and timeline. "
    "Worst-case scenario, we rent another year and keep saving for a larger down payment. "
    "Please send the updated rent roll and T-12 so we can underwrite calmly.",
    "簽附約前我們需要最終維修折讓數字。他們全款在確定性上勝過我們的貸款出價，未必是價格。"
    "我拿了三份廚房翻修報價，範圍與時程來看中間那份最對。最壞再租一年，繼續存更大頭期。"
    "請寄更新租金表與 T-12，讓我們冷靜審核。",
)
P[14] = (
    "Does Thursday still work on your end for the sewer scope? You've reviewed the HOA docs, right? "
    "You're coming to the final walkthrough, aren't you? "
    "Do you happen to know who owns the decision on the credit? "
    "Would it be possible to move the showing to three so I can leave work on time? "
    "How come the gate code changed again without a text?",
    "你那邊週四還能做下水道檢測嗎？社區文件你看過了吧？最終實地查看你會來，對吧？"
    "你剛好知道折讓是誰拍板的嗎？帶看有可能改到三點嗎？我想準時下班。"
    "大門密碼怎麼又改了還不傳訊？",
)
P[15] = (
    "I'll send you a redline and the final PDF after we agree on the credit. "
    "Interest rates moved after the Fed spoke, which changes how far we can stretch. "
    "Privacy matters in a shared wall condo more than people admit. "
    "We need an answer by Friday, not the perfect answer carved in stone. "
    "Title called; the wire instructions are in escrow, and honesty about fees still matters.",
    "折讓談定後，我會寄紅線版與最終 PDF。聯準會發言後利率動了，也改變我們能拉伸的幅度。"
    "共用牆公寓的隱私，比人們願意承認的更重要。週五前要一個答案，不是完美到刻石的答案。"
    "產權公司來電；匯款指示在保管中，費用誠實依然重要。",
)
P[16] = (
    "We're under contract, with closing in six weeks if financing stays on track. "
    "Put the repair request in writing so nobody 'remembers differently' later. "
    "I'll meet you at the entrance on Saturday at ten for one last look at the yard. "
    "This punch-list item has been on my plate since Tuesday, and I want it gone. "
    "We're still on track for the walkthrough, assuming the painter finishes on Friday.",
    "我們已簽約；若貸款順利，六週後成交。維修請求請寫下來，免得之後各說各話。"
    "週六十點門口見，最後看一次院子。這項待修從週二就在我待辦，我想把它銷掉。"
    "若油漆週五能完，實地查看進度仍正常。",
)
P[17] = (
    "I need a bit more clarity on the fee structure before I wire earnest money. "
    "Thanks for the feedback on the remodel plan—I left a couple of notes in the margin. "
    "There isn't much daylight in that first-floor unit, which will hurt rental demand. "
    "We've made solid progress on permits, but research on setbacks is still thin. "
    "Fewer contingencies would make this contract cleaner, though I won't waive inspection.",
    "匯出誠意金前，費用結構我還需要更清楚。謝謝你對翻修計畫的回饋；我在頁邊留了兩點。"
    "一樓那戶採光不多，會傷出租需求。執照有進度，但退縮線研究仍薄。"
    "附帶條件越少契約越乾淨，不過驗屋我絕不放棄。",
)
P[18] = (
    "He said they'd send the revised addendum by end of day. "
    "I asked whether the rate lock was still available through Thursday. "
    "She told me she was running twenty minutes late to the showing. "
    "They claimed the roof was new; the inspector disagreed in writing. "
    "Legal noted that clause four needs a rewrite before we sign anything related to credits.",
    "他說修訂附約會在今天結束前寄出。我問利率鎖定是否能撐到週四。"
    "她說帶看會晚二十分鐘。他們聲稱屋頂是新的；驗屋師書面不同意。"
    "法務指出第四條在簽任何折讓相關文件前需要重寫。",
)
P[19] = (
    "Their offer is slightly higher, but ours is far more certain because it's cleaner. "
    "This is the cleanest term sheet we've seen all quarter on small multi-family. "
    "The new place is nowhere near as noisy as the last rental near the highway. "
    "I'd rather wait a week than rush a bad decision on foundation work. "
    "Underwriting got more conservative, so a larger down payment looks smarter than leverage for leverage's sake.",
    "他們出價略高，但我們的更確定，因為條件更乾淨。這是本季在小型多戶上看過最乾淨的條件書。"
    "新地方遠沒有公路旁舊租屋那麼吵。我寧願多等一週，也不要倉促決定地基工程。"
    "審核更保守了，所以更大頭期比為槓桿而槓桿更聰明。",
)
P[20] = (
    "I'm not saying we walk—I'm saying we renegotiate repairs with evidence. "
    "We rarely waive inspection on older homes, and I barely slept after reading that roof section. "
    "Not everyone on our side has seen the latest rent roll. "
    "There's no upside to guessing repair costs without contractor bids. "
    "Don't touch that wet stain until we know whether it's active leakage.",
    "我不是說要退出，而是要用證據重談維修。老屋我們很少放棄驗屋；看完屋頂那章我幾乎沒睡。"
    "並非我方每個人都看過最新租金表。沒有承包商報價就瞎猜維修費，沒有好處。"
    "在搞清楚是不是正在滲漏前，別碰那塊濕漬。",
)
P[21] = (
    "I liked the unit. That said, the HOA dues are steep for what you get. "
    "Long story short, we need another lender quote before we commit. "
    "Actually, dinner's on me after three showings in one afternoon. "
    "To be clear, I'm fine with the price, not with skipping the sewer scope. "
    "Anyway, let's park the furniture debate and finish the repair list first.",
    "單位我喜歡。不過以內容來說管理費偏高。長話短說，承諾前還需要另一家貸方報價。"
    "其實一下午看三間，晚餐我請。講清楚：價格可以，略過下水道檢測不行。"
    "總之家具爭論先擱置，把維修清單收完。",
)
P[22] = (
    "I was wondering if we could revisit the credit amount with photos attached. "
    "My sense is we're a week early to lock, given the appraisal timing. "
    "It's kind of loud for a Sunday open house on that street. "
    "Would you be open to pushing the final walkthrough to Friday morning? "
    "We're seeing a bit of slippage on documents, and I'd rather flag it now than pretend.",
    "不知能否附上照片後重新談折讓金額。以估價時程看，我感覺現在鎖利早了一週。"
    "那條街週日開放看屋來說有點吵。最終實地查看願意改到週五早上嗎？"
    "文件進度有點滑，我寧現在標出也不裝沒看見。",
)
P[23] = (
    "Fair point on the timeline—I'd still push back on cutting inspection. "
    "I'm with you on price. I'm not with you on waiving appraisal. "
    "That's fair; I should've texted before I was late to the showing. "
    "I don't think that tracks with the comps we pulled last night. "
    "Help me understand what success looks like if we close without the ADU permitted.",
    "時程說得對；但我仍反對砍驗屋。價格我同意；放棄估價我不同意。"
    "說得對，帶看遲到前我該先傳訊。這和我們昨晚抓的可比對不上。"
    "幫我理解：若 ADU 未取得許可就成交，成功長什麼樣？",
)
P[24] = (
    "I'll take the lead on the lender package and the insurance binder. "
    "Can we circle back after you talk to title about the lien release? "
    "I don't have bandwidth for another showing this week if we want quality notes. "
    "Keep me in the loop if the repair credit moves by even a little. "
    "What's the blocker on the HOA letter, and who can ping them today?",
    "貸方文件包和保險證明我來主導。你跟產權公司談完留置權解除，我們再回頭對。"
    "若還想要有品質的看房筆記，這週我沒容量再排帶看。折讓有任何變動都讓我知情。"
    "社區證明信卡在哪？今天誰能戳他們？",
)
P[25] = (
    "Need a quick turn on page two of the addendum—ideally before lunch Central Time. "
    "This missing survey is blocking the appraisal order. "
    "No rush on lifestyle photos for the listing; next week is fine. "
    "Let's timebox the contractor debate to fifteen minutes and then decide. "
    "If I don't hear back by end of week, I'll assume we're pausing the offer.",
    "附約第二頁需要快修，最好中午 CT 前。缺測量圖會卡住估價下單。"
    "掛牌生活照不急，下週可以。承包商爭論限時十五分鐘，然後做決定。"
    "若週結束前沒回音，我就當出價暫停。",
)
P[26] = (
    "The offering memo is solid; the expense section is still thin. "
    "I'm a bit overwhelmed with back-to-back showings and a remodel quote marathon. "
    "The model unit was underwhelming for the price they want per door. "
    "I'm excited about the renovation, and also slightly terrified of change orders. "
    "That was a thoughtful note on drainage—thanks. I'm wiped and turning my phone down after this.",
    "投資備忘錄很穩；費用那一段仍薄。連續帶看加翻修報價馬拉松，我有點負荷過重。"
    "以他們要的單戶價格來說，樣品單位有點未達期待。翻修讓我興奮，也有點怕變更單。"
    "排水那則意見很用心，謝了。我累慘了，這則之後電話靜音。",
)
P[27] = (
    "I'm down for Saturday showings if we start early and grab coffee after. "
    "I'm all set on chairs for the staging—thanks for checking. "
    "My bad—I sent you the wrong gate code for the condo. "
    "No rush on the paint samples; anytime before the GC orders materials is fine. "
    "That's on me—I uploaded the old rent roll. I'll take a rain check on drinks and fix the file tonight.",
    "若早出發、看完喝咖啡，週六帶看我願意。佈置用的椅子我這邊夠了，謝謝確認。"
    "我的錯，寄錯公寓大門密碼。油漆色樣不急，總承包訂材料前隨時都行。"
    "怪我，上傳了舊租金表。喝酒改天，我今晚先把檔案修好。",
)
P[28] = (
    "I'm comfortable saying the upside is real; I wouldn't call this deal a no-brainer yet. "
    "Following up on Tuesday's email—do you still need the survey before underwriting? "
    "The place has a great vibe, but vibe won't fix foundation movement. "
    "Regardless of the hype on social media, we underwrite the T-12 and the repairs. "
    "Let's avoid buzzwords and name the actual risk: concentration, vacancy, and a tired roof.",
    "上行空間我認可；但我還不會說這是不用想的單。跟進週二的信：審核前你還需要測量圖嗎？"
    "氛圍很好，但氛圍修不好地基移位。不論社群怎麼炒，我們還是看 T-12 與維修。"
    "少點空話，把真正風險說出來：集中度、空置，還有疲態屋頂。",
)
P[29] = (
    "Can we do a twenty-minute call Thursday at two or Friday at ten to align on showings? "
    "Something came up—can we push our walkthrough to four? "
    "I'm running about ten minutes late; the freeway is a mess after the rain. "
    "I'm out front whenever you're ready with the lockbox. "
    "Confirming we're still on for Tuesday's inspection at nine, unless the seller needs to move it.",
    "週四兩點或週五十點，二十分鐘電話對齊帶看可以嗎？臨時有事，實地查看能推到四點嗎？"
    "我會晚約十分鐘；下雨後高速公路很亂。你準備好鎖盒我就在門口。"
    "確認週二九點驗屋仍照常，除非賣方要改時間。",
)
P[30] = (
    "I'll have the burger medium and a sparkling water after we finish the open house shift. "
    "I'm allergic to tree nuts—does this sauce have any? I don't want a surprise before tomorrow's appraisal. "
    "Want to split it, or should we get separate checks? I've got this if you cover coffee tomorrow near the site. "
    "I'm going to head out after this drink; early showing tomorrow. "
    "Coffee near the listing at nine? I'll grab a table and pull up the comps.",
    "開放看屋輪值結束後，我要三分熟漢堡加氣泡水。我對樹堅果過敏，這醬有嗎？明天估價前別來意外。"
    "要拆分還是各付各的？這次我請，明天工地附近咖啡你請。這杯完我先走，明天很早要帶看。"
    "九點在掛牌附近咖啡？我先占桌，順便打開可比案例。",
)
P[31] = (
    "The bones are good; most of what you're seeing is deferred maintenance, not disaster. "
    "We're requesting a six-thousand-dollar credit for HVAC replacement rather than seller repairs. "
    "The AC is running but not cooling—might be low on refrigerant. "
    "It's listed as turnkey, but I'd still budget for paint, landscaping, and a punch list week. "
    "Inspection is Friday; appraisal should be ordered after we know whether we're staying in the deal.",
    "底子不錯；你看到的多半是延宕維護，不是災難。我們要求六千美元折讓換空調，而不是賣方施工。"
    "空調有轉但不冷，可能冷媒不足。雖標配好即住，我仍會編油漆、景觀和一週待修。"
    "週五驗屋；確定還留在這單裡再下估價。",
)
P[32] = (
    "My connection is tight—can you see if there's an earlier seat so I don't miss the Friday showing? "
    "The hotel room smells like smoke; could we change rooms tonight? I have lender calls in the morning. "
    "I'd like to rebook on the next available flight, please, and keep the rental car confirmation. "
    "I need the receipt itemized for reimbursement on this property trip. "
    "I understand it's busy; I still need help finding my bag before tomorrow's inspection.",
    "轉機很緊，能看更早位子嗎？別讓我錯過週五帶看。飯店房間有煙味，今晚可換房嗎？早上有貸方電話。"
    "請改訂下一班有位子的航班，並保留租車確認。這趟看物件出差，報銷需要明細收據。"
    "我理解很忙，但我仍需要在明天驗屋前找到行李。",
)
P[33] = (
    "I'm going to pass on leading the investors' club this quarter; I can present once on small multi-family. "
    "I can't take another listing project without dropping quality on the remodel already in motion. "
    "I'm not free Thursday night, but Sunday afternoon works for a casual walkthrough. "
    "I'll have to decline dinner, but thank you for including me after a long option-period week. "
    "That's outside my scope—you'll want the property manager on vendor payments. I need quiet time tonight.",
    "這季投資者俱樂部主導我先不接；小型多戶我可以分享一次。翻修已在進行，再接掛牌案會掉品質。"
    "週四晚不行，週日下午可以隨便走走看。晚餐我得婉拒，謝謝在緊湊評估期後還邀請我。"
    "那超出我範圍，廠商付款你該找物業經理。今晚我需要安靜。",
)
P[34] = (
    "The executive summary was sharp—I knew the ask on the credit in ten seconds. "
    "In the seller call, your pause after their objection helped. Let's keep doing that. "
    "The pricing slide confuses me—can we separate closing costs versus repair credits? "
    "Thanks for handling the contractor; that saved the afternoon before the inspection. "
    "Two must-fixes: timeline and owner. The rest is optional polish before we send to the lender.",
    "執行摘要很利落，十秒就知道折讓訴求。賣方電話裡，異議後你的停頓很有用，保持。"
    "定價頁我看不懂，能把成交費和維修折讓拆開嗎？謝謝你應付承包商，救了驗屋前的下午。"
    "兩項必改：時程與負責人；其餘是寄給貸方前的潤飾。",
)
P[35] = (
    "Headline: occupancy is at ninety-four percent, ahead of our cautious plan. "
    "Repairs came in about twelve thousand, mostly HVAC and plumbing, which is annoying but survivable. "
    "Directionally, we're fine; the real risk is concentration in one long-term tenant. "
    "Versus comps, we're priced a little under to buy certainty on closing timing. "
    "If you remember one thing from this update: lock the rate before Friday's inflation print.",
    "重點：出租率百分之九十四，優於我們的保守計畫。維修大約一萬二，主要是空調與水管，煩但扛得住。"
    "方向沒問題；真正風險是過度集中在一個長租戶。相對可比我們略低價，換成交時程的確定性。"
    "這次更新只記一件事：週五通膨數據前先鎖利。",
)
P[36] = (
    "Subject line first: rate lock decision needed by two p.m. Central. "
    "Hi Maya—quick ask: can you send the T-12 today? Underwriting is blocked without it. "
    "FYI only: walkthrough moved to four. No action needed unless you want to join. "
    "Thanks—received the HOA packet. I'll review and reply before end of day. "
    "Recap for our side: we keep inspection, we ask six thousand as credit, and I call the agent tonight.",
    "主旨先寫：鎖利需下午兩點 CT 前決定。Hi Maya——快捷請求：今天能否寄 T-12？沒它審核卡住。"
    "僅供參考：實地查看改四點；不想參加就不用行動。社區文件包已收到，我會在今天結束前審完回覆。"
    "我方摘要：保留驗屋、要求六千折讓、今晚我打給經紀人。",
)

# --- examples: prefer 生活 / 房產 / 投資 ---
E: dict[int, list[tuple[str, str, str]]] = {}

E[1] = [
    ("生活", "I usually cook on Sundays, but tonight I'm touring a condo instead.", "我週日通常自己煮，但今晚改去看公寓。"),
    ("房產", "She manages two rentals, and she's meeting a plumber this afternoon.", "她管兩間出租，今天下午要見水電工。"),
    ("投資", "The numbers look fine on paper, but occupancy is shrinking.", "紙上數字還行，但入住率正在縮。"),
    ("生活", "You're always forwarding listings at midnight.", "你老是半夜轉掛牌連結給我。"),
    ("房產", "Do you believe this HOA fee, or is it just me?", "您覺得這管理費合理嗎，還是只有我覺得誇張？"),
    ("投資", "I don't think that cap rate assumes enough vacancy.", "我不認為那個資本化率有假設足夠空置。"),
]
E[2] = [
    ("生活", "Have you eaten yet? I already grabbed tacos between showings.", "你吃了嗎？我在帶看空檔吃了塔可。"),
    ("房產", "We listed the place last Monday, and we've already booked twelve showings.", "上週一掛牌，已經約了十二場帶看。"),
    ("投資", "I haven't heard back from the lender, so I'm holding the wire.", "貸方還沒回，所以匯款我先按住。"),
    ("生活", "I've never been great at open houses, but I'm getting better at small talk.", "我從來不擅長開放看屋寒暄，但有在進步。"),
    ("房產", "She called an hour ago and said the lockbox code had changed.", "她一小時前打電話說鎖盒密碼改了。"),
    ("投資", "We've seen this repair pattern before on 1990s roofs.", "一九九〇年代屋頂我們看過這種維修模式。"),
]
E[3] = [
    ("生活", "I'm going to deep-clean before the photographer comes tomorrow.", "攝影師明天來之前，我要先大掃除。"),
    ("房產", "I'll ping you when the inspection report is ready.", "驗屋報告好了我再戳你。"),
    ("投資", "We're meeting the seller's agent at the duplex on Thursday.", "週四要在雙拼和賣方經紀人碰面。"),
    ("房產", "This remodel is going to take longer than the first quote suggested.", "這次翻修會比第一份報價說的更久。"),
    ("生活", "Don't lift that dresser—I'll get it.", "別搬那櫃，我來。"),
    ("投資", "If the tenant pushes back on entry, we'll reschedule with notice.", "若房客不讓進，我們會依法通知後改期。"),
]
E[4] = [
    ("房產", "We may need to push the closing by a week.", "我們可能要把成交延後一週。"),
    ("投資", "You might want to loop in your CPA before you promise that rent concession.", "承諾租金讓利前，最好先找會計。"),
    ("生活", "He can't still be at the hardware store—it's been two hours.", "他不可能還在五金行，都兩小時了。"),
    ("房產", "I should be done measuring rooms by five, assuming no surprises.", "沒意外的話，我五點前能量完房間。"),
    ("投資", "Contractors have to carry insurance on every rehab site.", "每個整修工地承包商都必須有保險。"),
    ("生活", "You don't have to bring a gift to the housewarming, but snacks are welcome.", "暖房禮不必帶，但零食永遠受歡迎。"),
]
E[5] = [
    ("房產", "If the appraisal comes in low, we'll renegotiate or walk.", "若估價偏低，我們會重談或退出。"),
    ("投資", "If I were running this, I'd cut fancy finishes before I'd cut structural fixes.", "換我操盤，會先砍花俏裝潢而不是結構維修。"),
    ("生活", "If I'd left earlier, I wouldn't have missed the open house.", "早點出門就不會錯過開放看屋。"),
    ("房產", "Had we known about the special assessment, we might have bid differently.", "早知道特別攤派，出價可能不同。"),
    ("生活", "If it keeps raining, I'm canceling the yard cleanup.", "雨再這樣下，庭院清理我就取消。"),
    ("投資", "Unless the rent roll balances, we can't proceed to underwriting.", "除非租金表對得起來，否則不能進審核。"),
]
E[6] = [
    ("房產", "The offer was submitted before noon.", "出價已在中午前送出。"),
    ("投資", "You'll be looped in once the operating statements are ready.", "營運報表好了就會拉你進來。"),
    ("生活", "Our movers got delayed three hours in traffic.", "搬家公司堵車延誤了三小時。"),
    ("房產", "Nothing has been decided on the credit yet.", "折讓尚未定案。"),
    ("生活", "I own this miss—the utility transfer wasn't scheduled.", "這次疏失我負責——公共事業過戶沒排程。"),
    ("房產", "The house was built in the 1990s and later remodeled.", "房子一九九〇年代建，後來翻修過。"),
]
E[7] = [
    ("房產", "I'm looking forward to walking the property with you.", "我很期待和你一起實地看屋。"),
    ("投資", "We can't afford to miss another inspection window on this asset.", "這資產不能再錯過下一個驗屋時段。"),
    ("生活", "I tried resetting the breaker, then I tried to call a neighbor.", "我試過重設斷路器，接著才打給鄰居。"),
    ("房產", "Would you mind sending the survey again?", "可以麻煩再寄一次測量圖嗎？"),
    ("生活", "She stopped buying impulse decor after the last move.", "上次搬家後她不再衝動買裝飾。"),
    ("投資", "I forgot to attach the comps—sending them now.", "我忘了附可比案例，現在補上。"),
]
E[8] = [
    ("房產", "Here's the version that incorporates the inspection notes.", "這版已納入驗屋意見。"),
    ("投資", "The inspector we hired flagged the roof and the HVAC.", "我們請的驗屋師標出屋頂與空調。"),
    ("生活", "Anyone who's painted a room in summer knows patience matters.", "夏天漆過房間的人都知道要有耐心。"),
    ("房產", "The clause, which felt minor at first, became a deal point.", "那條款起初不起眼，後來成談判點。"),
    ("投資", "Investors applying after Friday won't be in this round.", "週五後申請的投資人進不了這輪。"),
    ("生活", "That's the cafe I was telling you about near the listing.", "就是掛牌附近我提過的那家咖啡店。"),
]
E[9] = [
    ("投資", "The lender still needs the final insurance binder before noon.", "貸方中午前仍需要最終保險證明。"),
    ("房產", "I'm not comfortable signing until we see the HOA docs.", "沒看到社區文件前我不想簽字。"),
    ("生活", "Someone left the porch light on for three days.", "有人讓門廊燈開了三天。"),
    ("投資", "What matters is whether the deal still cash-flows after repairs.", "重點是維修後這單是否還有現金流。"),
    ("生活", "That kind of leaf-blower noise would drive me crazy.", "那種吹葉機噪音會讓我抓狂。"),
    ("房產", "Our side will prepare the walkthrough checklist.", "我方會準備實地查看檢核表。"),
]
E[10] = [
    ("房產", "There's still a gap between our ask and their counteroffer.", "我們的要求與還價仍有落差。"),
    ("投資", "It's worth noting that the comps are from before the rate jump.", "值得注意，可比是在利率跳升前。"),
    ("生活", "It's about twenty minutes to the grocery store without traffic.", "不塞車到超市大約二十分鐘。"),
    ("房產", "It turns out the delay was on the title side.", "結果延誤出在產權那邊。"),
    ("生活", "There's no way I'm assembling furniture past midnight.", "過了半夜我不可能組家具。"),
    ("投資", "It's not that we dislike the asset—it's that the timeline is wrong.", "不是不喜歡這資產，而是時機不對。"),
]
E[11] = [
    ("房產", "The unit shows well, but the HVAC is near end of life.", "房子漂亮，但空調快壽終。"),
    ("投資", "Diligence looks clean, so we're comfortable moving forward.", "盡職調查乾淨，我們願意往前。"),
    ("生活", "I wanted sushi. I cooked pasta after the showing, though.", "想吃壽司，不過看房後還是煮了義大利麵。"),
    ("投資", "The plan is aggressive; however, the rent upside is real.", "計畫積極；但租金上行真實存在。"),
    ("生活", "It was crowded at Costco, and the parking lot was chaos.", "好市多人很多，停車場一片混亂。"),
    ("房產", "Since the appraisal is delayed, we'll slip closing a few days.", "估價延遲，成交會晚幾天。"),
]
E[12] = [
    ("房產", "Even though inspection found issues, none are deal-breakers yet.", "雖有驗屋問題，但還不是破局點。"),
    ("投資", "Once we have clear title, we can set a firm closing date.", "產權一清楚就能訂成交日。"),
    ("生活", "I stayed home because I was wiped after hauling donations.", "搬完捐贈物累壞了，所以待在家。"),
    ("房產", "Whereas the first condo felt dark, this one gets great light.", "第一間公寓偏暗，這一間採光很好。"),
    ("投資", "As we discussed, the contingency is still on the table.", "如討論過，附條件仍在檯面上。"),
    ("生活", "Text me when you get to the lockbox.", "到鎖盒那邊打給我。"),
]
E[13] = [
    ("房產", "We need the final repair credit before we sign the addendum.", "簽附約前需要最終維修折讓。"),
    ("投資", "Their all-cash offer beats our financed bid on certainty.", "他們全款在確定性上勝過我們的貸款出價。"),
    ("生活", "I got three closet-system quotes; the mid one feels right.", "我拿了三份衣櫃系統報價，中間那份最對。"),
    ("投資", "Worst-case scenario, we hold cash and wait for a better basis.", "最壞是抱現金，等更好的成本基礎。"),
    ("房產", "Please send the updated rent roll and T-12.", "請寄更新租金表與 T-12。"),
    ("生活", "There's a hairline crack in the ceiling by the vent.", "通風口旁天花板有髮絲裂。"),
]
E[14] = [
    ("房產", "Does Thursday still work on your end for the inspection?", "你那邊週四驗屋還可以嗎？"),
    ("投資", "You've reviewed the operating statement, right?", "營運報表你看過了吧？"),
    ("生活", "You're bringing the measuring tape, aren't you?", "你會帶捲尺吧？"),
    ("房產", "Do you happen to know who owns the credit decision?", "你知道折讓是誰拍板的嗎？"),
    ("生活", "Would it be possible to move dinner to seven after the showing?", "帶看後晚餐有可能改七點嗎？"),
    ("房產", "How come the gate code changed again?", "大門密碼怎麼又改了？"),
]
E[15] = [
    ("房產", "I'll send a redline and the final PDF after we agree.", "談定後我會寄紅線與最終 PDF。"),
    ("投資", "Rates moved after the Fed spoke, so our stretch price changed.", "聯準會發言後利率動了，我們能出的上限也變了。"),
    ("生活", "Privacy matters more than a fancy lobby in daily life.", "日常生活裡，隱私比華麗大廳重要。"),
    ("房產", "We need an answer by Friday, not a perfect essay.", "週五前要答案，不是完美長文。"),
    ("生活", "Kids were playing basketball in the driveway next door.", "隔壁車道有孩子打籃球。"),
    ("投資", "Title called; the wire instructions are in escrow.", "產權來電；匯款指示在保管中。"),
]
E[16] = [
    ("房產", "We're under contract, with closing in six weeks.", "已簽約，六週後成交。"),
    ("投資", "Put the concession request in writing so we're aligned.", "讓利請求請書面化，才對齊。"),
    ("生活", "I'll meet you at the entrance on Saturday at 10.", "週六十點門口見。"),
    ("房產", "This survey question has been on my plate since Tuesday.", "這則測量問題從週二就在我待辦。"),
    ("投資", "We're still on track for funding if insurance lands tomorrow.", "保險證明明天到手的話，撥款仍準時。"),
    ("生活", "I'm bad with garage-remote batteries, but great with labels.", "我常忘換車庫遙控電池，但很會貼標籤。"),
]
E[17] = [
    ("房產", "I need a bit more clarity on closing-cost credits.", "成交費折讓我還需要更清楚。"),
    ("投資", "Thanks for the feedback—I left two notes on the T-12.", "謝謝回饋；我在 T-12 上留了兩點。"),
    ("生活", "There isn't much daylight in the guest room.", "客房採光不多。"),
    ("投資", "We've made solid progress, but market research is still thin.", "有進度，但市場研究仍薄。"),
    ("生活", "How much luggage are you bringing for the house-hunt trip?", "看房行程你要帶多少行李？"),
    ("房產", "Fewer contingencies would make this cleaner—except inspection.", "附帶條件越少越乾淨——驗屋除外。"),
]
E[18] = [
    ("房產", "He said they'd send the revised addendum by EOD.", "他說修訂附約 EOD 前會寄。"),
    ("投資", "I asked whether the rate lock was still available.", "我問鎖利是否仍可用。"),
    ("生活", "She told me she was running late to help me measure curtains.", "她說幫我量窗簾會晚到。"),
    ("房產", "They claimed the roof was new; the inspector disagreed.", "他們說屋頂是新的；驗屋師不同意。"),
    ("投資", "Counsel noted that clause 4.2 needs a rewrite.", "律師指出 4.2 條需重寫。"),
    ("生活", "I wondered if I'd left the iron on before we left for the showing.", "我在想出門看房前是不是沒關熨斗。"),
]
E[19] = [
    ("投資", "Their offer is slightly higher, but ours is far more certain.", "他們略高，但我們確定性高得多。"),
    ("房產", "This is the cleanest inspection report we've seen all quarter.", "這是本季看過最乾淨的驗屋報告。"),
    ("生活", "The new place is nowhere near as noisy as the last one.", "新地方遠沒上一間吵。"),
    ("房產", "I'd rather wait a week than rush foundation work.", "寧願多等一週，也不倉促做地基。"),
    ("投資", "Underwriting got more conservative after the last cycle.", "上一輪後審核更保守。"),
    ("生活", "This couch is less comfortable than it looks on the listing photos.", "這沙發沒有掛牌照片看起來舒服。"),
]
E[20] = [
    ("房產", "I'm not saying we walk—I'm saying we renegotiate repairs.", "不是要退出，而是重談維修。"),
    ("投資", "We rarely waive inspection on older rentals.", "老出租屋我們很少放棄驗屋。"),
    ("生活", "I barely slept after the movers left dust everywhere.", "搬家的人留下滿屋灰塵，我幾乎沒睡。"),
    ("房產", "Not everyone has seen the latest survey.", "不是每個人都看過最新測量圖。"),
    ("投資", "There's no upside to guessing CapEx without bids.", "沒報價就瞎猜資本支出沒好處。"),
    ("生活", "Don't you dare plug that space heater into the cheap extension cord.", "你敢把電暖器插那條廉價延長線試試。"),
]
E[21] = [
    ("房產", "I liked the unit. That said, HOA dues are steep.", "單位喜歡。不過管理費偏高。"),
    ("投資", "Long story short, we need another lender quote.", "長話短說，需要另一家貸方報價。"),
    ("生活", "Actually, dinner's on me—you drove to every showing.", "其實晚餐我請，每場帶看都你開。"),
    ("房產", "To be clear, I'm fine with price, not with skipping sewer scope.", "講清楚：價格可，略過下水道不行。"),
    ("投資", "Anyway, let's park vanity metrics and finish diligence.", "總之虛榮指標先擱置，把盡職調查做完。"),
    ("生活", "Net-net, the weekend house hunt was worth the chaos.", "總帳來看，這週末看房的混亂值得。"),
]
E[22] = [
    ("房產", "I was wondering if we could revisit the credit amount.", "不知能否重談折讓金額。"),
    ("投資", "My sense is we're a week early to lock.", "我感覺鎖利早了一週。"),
    ("生活", "It's kind of loud for a Sunday morning on this street.", "這條街週日早上來說有點吵。"),
    ("房產", "Would you be open to pushing the walkthrough to Friday?", "實地查看願意改週五嗎？"),
    ("投資", "We're seeing a bit of slippage on the appraisal timeline.", "估價時程有點滑。"),
    ("生活", "If it's not too much trouble, could you grab painter's tape?", "不麻煩的話，可以帶油漆膠帶嗎？"),
]
E[23] = [
    ("房產", "Fair point on timing—I'd still push back on cutting inspection.", "時程有理；仍反對砍驗屋。"),
    ("投資", "I'm with you on price. I'm not with you on waiving appraisal.", "價格同意；放棄估價不同意。"),
    ("生活", "That's fair. I should've texted before I was late.", "說得對，遲到前該先傳訊。"),
    ("房產", "I don't think that tracks with the comps we pulled.", "這和可比案例對不上。"),
    ("投資", "Help me understand what success looks like without reserves.", "沒有準備金的成功是什麼樣？"),
    ("生活", "I can get behind pizza after we finish measuring rooms.", "量完房間後吃披薩，我贊成。"),
]
E[24] = [
    ("投資", "I'll take the lead on the lender package.", "貸方文件包我來主導。"),
    ("房產", "Can we circle back after you talk to title?", "你跟產權談完我們再對一下？"),
    ("房產", "I don't have bandwidth for another showing this week.", "這週沒容量再排帶看。"),
    ("投資", "Keep me in the loop if NOI assumptions move.", "NOI 假設有動就讓我知情。"),
    ("房產", "What's the blocker on the HOA letter?", "社區證明信卡在哪？"),
    ("生活", "Ping me when you're downstairs with the dolly.", "你帶推車到樓下就戳我。"),
]
E[25] = [
    ("房產", "Need a quick turn on the addendum—before lunch CT.", "附約需要快修，CT 中午前。"),
    ("投資", "This is blocking the appraisal order.", "這卡住估價下單。"),
    ("生活", "No rush on the thrift-store mirrors; next week is fine.", "二手鏡不急，下週可以。"),
    ("房產", "Let's timebox this repair debate to ten minutes.", "維修爭論限時十分鐘。"),
    ("投資", "If I don't hear back by EOW, I'll assume we're pausing.", "EOW 前沒回就當暫停。"),
    ("生活", "I'm slammed today; can we grocery-shop tomorrow?", "今天爆忙，明天再採買可以嗎？"),
]
E[26] = [
    ("投資", "The deck is solid; the expense notes are still thin.", "簡報很穩；費用註記仍薄。"),
    ("房產", "I'm a bit overwhelmed with closings this month.", "這個月成交讓我負荷過重。"),
    ("生活", "The restaurant was underwhelming for the price.", "以價格來說餐廳讓人失望。"),
    ("房產", "I'm excited about the renovation, and slightly terrified.", "翻修讓我興奮也有點怕。"),
    ("投資", "That was a thoughtful note on vacancy—thanks.", "空置那則意見很用心，謝了。"),
    ("生活", "I'm wiped; can we do a quiet night in?", "累慘了，今晚在家低調可以嗎？"),
]
E[27] = [
    ("生活", "I'm down for a hike if we start early.", "早出發的話健行算我一個。"),
    ("房產", "I'm all set on staging chairs—thanks.", "佈置椅我這邊夠了，謝啦。"),
    ("生活", "My bad—I grabbed your charger after the showing.", "我的錯，看房後拿了你的充電器。"),
    ("房產", "No rush on the listing photos; next week is fine.", "掛牌照片不急，下週可。"),
    ("投資", "That's on me—I sent the wrong rent roll.", "怪我，寄錯租金表。"),
    ("生活", "I'll take a rain check on drinks; I'm wiped.", "喝酒改天，我累了。"),
]
E[28] = [
    ("投資", "The upside is real; I wouldn't call it a no-brainer yet.", "上行真實；但我還不說這是免想單。"),
    ("房產", "Following up—do you need anything else for the HOA packet?", "跟進：社區文件包還需要我這邊什麼嗎？"),
    ("生活", "Great vibe, but vibe won't fix the leak.", "氛圍好，但氛圍修不好漏水。"),
    ("投資", "Regardless of hype, we underwrite the numbers.", "不論炒作，我們還是看數字。"),
    ("房產", "Name the actual risk: roof, reserves, and assessments.", "說出真正風險：屋頂、準備金、攤派。"),
    ("生活", "I get the meme; I still need the gate code.", "迷因懂，但我仍要大門密碼。"),
]
E[29] = [
    ("房產", "Can we do Thursday at 2 CT or Friday at 10 for a call?", "電話能否週四 2 點 CT 或週五 10 點？"),
    ("房產", "Can we push our walkthrough to 4?", "實地查看能推到四點嗎？"),
    ("生活", "I'm running about ten minutes late—rain and traffic.", "會晚十分鐘，下雨又塞車。"),
    ("生活", "I'm out front whenever you're ready.", "你準備好我就在門口。"),
    ("生活", "Rain check on coffee? Next week is better.", "咖啡改天？下週較好。"),
    ("房產", "Confirming we're still on for Tuesday's inspection at 9.", "確認週二九點驗屋仍照常。"),
]
E[30] = [
    ("生活", "I'll have the salmon and a sparkling water.", "我要鮭魚加氣泡水。"),
    ("生活", "I'm allergic to tree nuts—does this sauce have any?", "對樹堅果過敏，這醬有嗎？"),
    ("生活", "Want to split it, or get separate checks?", "要拆分還是各付各的？"),
    ("生活", "I've got this—you covered the locksmith last time.", "這次我請，上次鎖匠你付的。"),
    ("房產", "Coffee near the listing at 9? I'll grab a table.", "九點掛牌附近咖啡？我先占桌。"),
    ("投資", "I'm heading out early—lender call before the tour.", "我早走——看房前有貸方電話。"),
]
E[31] = [
    ("房產", "The bones are good; this is mostly deferred maintenance.", "底子好；多半是延宕維護。"),
    ("房產", "We're requesting a $6,000 credit for HVAC.", "我們要求六千美元空調折讓。"),
    ("生活", "The AC is running but not cooling.", "空調有轉但不冷。"),
    ("房產", "Listed turnkey, but I'd still budget for paint.", "雖標即住，仍會編油漆預算。"),
    ("投資", "Inspection Friday; order appraisal only if we stay in.", "週五驗屋；確定留下再下估價。"),
    ("房產", "Moisture staining under the upstairs bath worries me.", "樓上浴室下方水漬讓我擔心。"),
]
E[32] = [
    ("生活", "My connection is tight—any earlier seat?", "轉機很緊，有更早位子嗎？"),
    ("生活", "The room smells like smoke; could we change rooms?", "有煙味，能換房嗎？"),
    ("房產", "I'd like to rebook tonight so I don't miss the showing.", "想改訂今晚航班，以免錯過帶看。"),
    ("投資", "I need an itemized receipt for this property trip.", "看物件出差需要明細收據。"),
    ("生活", "Is late checkout available, even for a fee?", "晚退房可以嗎？付費也行。"),
    ("房產", "I still need help finding my bag before tomorrow's inspection.", "明天驗屋前我仍需要幫忙找行李。"),
]
E[33] = [
    ("投資", "I'm going to pass on leading that syndicate; I can review deals monthly.", "銀團主導我先不接；我可每月審案子。"),
    ("房產", "I can't take another remodel without dropping quality.", "再接翻修會掉品質，接不了。"),
    ("生活", "I'm not free that night, but Sunday works for a walk.", "那晚不行，週日可以走走。"),
    ("生活", "I'll have to decline dinner, but thanks for including me.", "晚餐得婉拒，謝謝邀請。"),
    ("房產", "That's outside my scope—ask the property manager.", "超出我範圍，問物業經理。"),
    ("生活", "I need quiet time after back-to-back showings.", "連續帶看後我需要安靜。"),
]
E[34] = [
    ("投資", "The summary was sharp—I knew the ask in ten seconds.", "摘要很利落，十秒知道訴求。"),
    ("房產", "Your pause after their objection on credits helped.", "他們談折讓異議後你的停頓很有用。"),
    ("房產", "The pricing slide confuses fee versus credit—can we split them?", "定價頁費用跟折讓混了，能拆開嗎？"),
    ("生活", "Thanks for meeting the plumber—that saved my afternoon.", "謝謝你見水管工，救了我下午。"),
    ("投資", "Two must-fixes: vacancy assumption and CapEx. Rest is polish.", "必改：空置假設與資本支出；其餘潤飾。"),
    ("房產", "How do you see the risk on appraisal timing?", "你怎看估價時程風險？"),
]
E[35] = [
    ("投資", "Headline: occupancy is at 94%, ahead of plan.", "重點：入住率 94%，優於計畫。"),
    ("房產", "Repairs came in about $12k, mostly HVAC and plumbing.", "維修約 1.2 萬，主因空調與水管。"),
    ("投資", "Directionally fine; risk is one-tenant concentration.", "方向可；風險是單租戶集中。"),
    ("房產", "Versus comps, we're a bit under to buy a faster close.", "相對可比略低，以換更快成交。"),
    ("生活", "The kitchen remodel ran 15% over—lesson learned on allowances.", "廚房翻修超支 15%，學到預留金教訓。"),
    ("投資", "Remember one thing: lock before Friday's print.", "只記一件事：週五數據前鎖利。"),
]
E[36] = [
    ("投資", "Subject: Rate lock — decision needed by 2 p.m. CT", "主旨：鎖利——需下午 2 點 CT 前決定"),
    ("房產", "Quick ask: can you send the T-12 today? We're blocked without it.", "快捷請求：今天能否寄 T-12？沒它就卡住。"),
    ("房產", "FYI only: walkthrough moved to 4. No action needed.", "僅知會：實地查看改 4 點。無需行動。"),
    ("生活", "Thanks—received. I'll reply before EOD.", "收到，EOD 前回。"),
    ("生活", "Running 10 late. Start the measuring without me.", "晚 10 分。你們先量。"),
    ("房產", "Recap: (1) keep inspection (2) ask $6k credit (3) I call the agent.", "摘要：1 留驗屋 2 要 6k 折讓 3 我打給經紀人"),
]


def word_count(en: str) -> int:
    return len(re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)?", en))


# Extra sentences to bring each passage into the 80–120 word band
PAD_EN = {
    1: " Before I commit, I also walk the block at night and check how the street feels after dark.",
    2: " I'm also building a simple spreadsheet for repairs, HOA dues, and a cautious vacancy line so emotion doesn't run the decision.",
    3: " Meanwhile I'm gathering insurance quotes and confirming the HOA questionnaire won't surprise us in underwriting.",
    4: " I'll also ask for photos of serial numbers on the HVAC so the specialist can price parts without a second trip.",
    5: " I'm writing these if-then rules down now, because negotiations move fast and I don't want to invent policy under pressure.",
    6: " Passive voice helps in updates, but when money moves I switch back to clear ownership so nobody assumes the wrong person acted.",
    7: " Small grammar choices like this show up constantly in vendor texts, and clean phrasing prevents expensive misunderstandings.",
    8: " When the description gets long, I trim relative clauses so the repair list stays readable on a phone at the property.",
    9: " Clear subjects also keep group chats sane when agents, lenders, and contractors are all typing at once about credits, access, and who brings the garage remotes.",
    10: " Dummy subjects sound tiny, yet they carry a lot of real-estate conversation when you're framing risk without sounding dramatic.",
    11: " Good connectors keep a seller conversation calm: acknowledge the upside, then land the maintenance concern without apology theater.",
    12: " Subordinate clauses let me pack diligence into one breath, which matters when a showing slot is only fifteen minutes.",
    13: " Tight noun phrases also make texts to contractors shorter, and shorter texts get faster answers on busy job sites.",
    14: " Soft questions save relationships with agents while still pinning down times, codes, and who actually decides credits.",
    15: " Articles look basic until a wire email arrives; the wrong 'a' or 'the' can make fee language feel slippery.",
    16: " Preposition habits show up in every status line I send: on track, in escrow, under contract, on my plate.",
    17: " Countability mistakes make me sound less credible when I discuss feedback, furniture allowances, or research gaps.",
    18: " Reported speech keeps the paper trail honest when three people remember three different promises about repairs.",
    19: " Precise comparatives help me explain why a slightly lower price can still be the stronger risk-adjusted choice.",
    20: " Clean negation prevents accidental double messages when I'm drawing a hard line on inspection or reserves.",
    21: " Discourse markers are the steering wheel: they let me correct, concede, and close without sounding like a textbook.",
    22: " Softeners buy goodwill, but I drop them when the topic is safety, wire fraud, or a non-negotiable contingency.",
    23: " Professional disagreement is a skill: I want partners who can push back on my assumptions before we buy a problem.",
    24: " Workplace chunks sound corporate, yet in deals they simply assign ownership so tasks stop bouncing between inboxes.",
    25: " Specific deadlines beat ASAP every time, especially across time zones when lenders, title, and agents don't share a hallway.",
    26: " Evaluation vocabulary keeps feedback adult: solid, thin, underwhelming—clear enough to act on without drama.",
    27: " Everyday chunks keep friendships easy during a stressful hunt, as long as I upgrade the register for clients and lenders.",
    28: " Knowing slang without performing it is part of C1: I can understand the meme and still write a clean diligence note.",
    29: " Scheduling language is underrated equity: clear ETAs and confirmations prevent the silent resentment that kills deals.",
    30: " Even restaurant talk connects to housing weeks: allergies, checks, and early nights all show up around back-to-back tours.",
    31: " This is the core dialect of American residential deals; if I can say these lines smoothly, negotiations feel less foreign.",
    32: " Travel English matters because out-of-town underwriting trips are common, and a missed bag can mean a missed inspection.",
    33: " Boundaries protect deal quality: a polite no today often prevents a messy yes that I can't operationally support.",
    34: " Concrete feedback shortens remodel cycles; vague praise doesn't tell a contractor what to change before the next walkthrough.",
    35: " Number talk should be boring on purpose: headline first, range second, ask last—so partners remember the decision, not the jargon.",
    36: " Message templates are how diligence survives real life; if it isn't scannable on a phone between showings, it won't get done.",
}
PAD_ZH = {
    1: "成交前我也會晚上走一趟街區，確認天黑後的街感。",
    2: "我也在做維修、管理費與保守空置的表，避免情緒做主。",
    3: "同時我在收保險報價，並確認社區問卷不會在審核殺我個措手不及。",
    4: "我也會要空調序號照片，讓技師不用跑第二趟就能估零件。",
    5: "我先把這些 if-then 寫下，談判一快才不會臨時發明原則。",
    6: "更新可用被動，但一牽涉金流我就改回清楚 ownership。",
    7: "這類小選擇常出現在廠商訊息裡，說清楚能避免昂贵誤會。",
    8: "描述一長，我就修剪關係子句，讓維修清單在現場手機上也讀得下去。",
    9: "主詞清楚，也能讓經紀人、貸方、承包商同吵群組時少點混亂。",
    10: "虛主詞雖小，卻撐起很多不動產對話裡「淡定說風險」的句子。",
    11: "好的連接能讓對賣方的談話冷靜：先認上行，再落地維護疑慮。",
    12: "從屬子句能把盡職調查塞進一口氣，看房只有十五分鐘時很重要。",
    13: "緊湊名詞片語也讓給承包商的訊息更短，工地忙時回得比較快。",
    14: "軟問句能顧關係，仍能釘死時間、密碼與折讓拍板人。",
    15: "冠詞看似基礎，直到電匯信來；a/the 用錯會讓費用語言顯曖昧。",
    16: "介系詞習慣出現在我每則狀態：on track、in escrow、under contract。",
    17: "可數錯誤會讓我談回饋、家具預留或研究缺口時顯得不夠可信。",
    18: "間接引述能讓紙本軌跡誠實，避免三個人記成三種維修承諾。",
    19: "精準比較能說明為何略低的價格在風險調整後仍可能更強。",
    20: "乾淨的否定避免雙重訊息，尤其在驗屋或準備金畫線時。",
    21: "話語標記像方向盤：能糾正、讓步、收束，又不像教科書。",
    22: "軟化能買善意；但安全、電匯詐騙或不可談判附條件時我收掉軟詞。",
    23: "專業異議是技能：我希望夥伴在買下問題前就能頂我的假設。",
    24: "職場套語聽來公司，但在交易裡只是分派 ownership，讓任務別跳信箱。",
    25: "明確截止永遠勝過 ASAP，尤其貸方、產權、經紀人各在不同時區時。",
    26: "評價詞讓回饋成熟：solid、thin、underwhelming——清楚到能行動。",
    27: "生活 chunks 讓看房高壓期友情好過，只要對客戶與貸方升語域。",
    28: "認得 slang 卻不表演它，是 C1 的一部分：懂迷因，仍能寫乾淨盡職筆記。",
    29: "約時間語言被低估：清楚 ETA 與確認，能避免默殺交易的怨氣。",
    30: "連餐廳對話也連著看房週：過敏、分帳、早睡，都出現在連續帶看裡。",
    31: "這是美式住宅交易的核心腔調；這些句子順了，談判就不那麼陌生。",
    32: "旅行英語重要，因為出城審核常見；行李延誤可能等於驗屋延誤。",
    33: "邊界守護交易品質：今天禮貌的不，往往避免明天無法執行的勉強答應。",
    34: "具體回饋縮短翻修循環；空泛稱讚無法告訴承包商下次查看前要改什麼。",
    35: "數字該刻意無聊：先結論、再區間、最後 ask——讓人記住決策不是行話。",
    36: "訊息模板讓盡職調查活在現實裡；若手機在帶看空檔掃不完，就不會做完。",
}


GENERIC_PAD_EN = (
    " I keep repeating the key lines out loud until they feel natural in a doorway, not only on a page."
)
GENERIC_PAD_ZH = "我會把關鍵句大聲重複到站在門口也能自然說出口，而不只是紙上看過。"


def ensure_band(num: int, en: str, zh: str, lo: int = 80, hi: int = 120) -> tuple[str, str]:
    en2, zh2 = en.strip(), zh.strip()
    if num in PAD_EN and word_count(en2) < lo:
        en2 = (en2 + PAD_EN[num]).strip()
        zh2 = (zh2 + PAD_ZH[num]).strip()
    while word_count(en2) < lo:
        en2 = (en2 + GENERIC_PAD_EN).strip()
        zh2 = (zh2 + GENERIC_PAD_ZH).strip()
    wc = word_count(en2)
    if wc > hi:
        # Prefer dropping generic pads first
        while word_count(en2) > hi and en2.endswith(GENERIC_PAD_EN.strip()):
            en2 = en2[: -len(GENERIC_PAD_EN)].strip()
            zh2 = zh2[: -len(GENERIC_PAD_ZH)].strip()
        if word_count(en2) > hi:
            print(f"WARN L{num:02d} still long: {word_count(en2)}")
    return en2, zh2


def fmt_examples(items: list[tuple[str, str, str]]) -> str:
    lines = ["### 現代例句", ""]
    for tag, en, zh in items:
        lines.append(f"- `{tag}` **EN:** {en}  ")
        lines.append(f"  **ZH:** {zh}")
    lines.append("")
    return "\n".join(lines)


def fmt_passage(num: int, en: str, zh: str) -> str:
    wc = word_count(en)
    return (
        f"### 跟讀短文（約 {wc} words｜TTS）\n\n"
        f"> 上架後以瀏覽器 **TTS** 朗讀英文即可，不必真人 MP3。\n\n"
        f"**EN**\n\n{en}\n\n"
        f"**ZH**\n\n{zh}\n\n"
    )


def main() -> None:
    text = SRC.read_text(encoding="utf-8")

    # Header updates
    text = text.replace(
        "> **口音／市場**：美式英語（American English）— 日常＋職場  \n"
        "> **目標程度**：推到 **C1**（能開會、談判語氣、寫正式短訊／簡報口語）  \n"
        "> **與 `english V.md` 關係**：**獨立成冊**（不依賴舊句型庫交叉連結；上架後可另做選配連結）  \n"
        "> **冊 5**：含 Lifestyle／Real Estate 場景課",
        "> **口音／市場**：美式英語 — **個人生活＋投資／房產**為主（會議語氣仍保留在慣用語冊）  \n"
        "> **目標程度**：推到 **C1**  \n"
        "> **與 `english V.md` 關係**：**獨立成冊**  \n"
        "> **跟讀**：每課附 **80–120 word** 英文短文；音檔採 **TTS**（不上真人錄音）  \n"
        "> **術語**：房地產詞彙見獨立檔 `real estate glossary.md`  \n"
        "> **冊 5**：Lifestyle／Real Estate 場景課",
    )
    text = text.replace(
        "5. **現代例句**（EN＋ZH；標 `生活`／`工作`／`通用`）\n"
        "6. **慣用語包**（2–5 個；標語域：中性／口語／職場／慎用）\n"
        "7. **迷你練習**（3 題；文末附簡答）",
        "5. **現代例句**（EN＋ZH；標 `生活`／`房產`／`投資`）\n"
        "6. **跟讀短文**（英文約 80–120 words＋中譯；**TTS**）\n"
        "7. **慣用語包**（2–5 個；標語域）\n"
        "8. **迷你練習**（3 題；文末附簡答）",
    )

    # Replace examples + insert passage before 慣用語包 for each lesson
    for n in range(1, 37):
        if n not in E or n not in P:
            raise SystemExit(f"missing data for lesson {n}")
        en_p, zh_p = ensure_band(n, P[n][0], P[n][1])
        wc = word_count(en_p)
        print(f"L{n:02d} words={wc}")

        pat = re.compile(
            rf"(## Lesson {n:02d}｜.*?\n)(.*?)(### 慣用語包\n)",
            re.S,
        )

        def repl(m: re.Match, n=n, en_p=en_p, zh_p=zh_p) -> str:
            head, body, idioms_h = m.group(1), m.group(2), m.group(3)
            # strip old 現代例句 block from body
            body2 = re.sub(r"### 現代例句\n.*?(?=\n### |\Z)", "", body, count=1, flags=re.S)
            # also strip any prior 跟讀短文 if re-run
            body2 = re.sub(r"### 跟讀短文.*?(?=\n### |\Z)", "", body2, count=1, flags=re.S)
            body2 = body2.rstrip() + "\n\n"
            return (
                head
                + body2
                + fmt_examples(E[n])
                + fmt_passage(n, en_p, zh_p)
                + idioms_h
            )

        text, count = pat.subn(repl, text, count=1)
        if count != 1:
            raise SystemExit(f"failed to patch lesson {n}")

    # Appendix B / C (idempotent)
    appendix_b = """# 附錄 B｜打磨決策（已拍板）

| 項目 | 決策 |
|------|------|
| 例句場景 | 偏 **個人生活** 與 **投資／房產**（標籤：`生活`／`房產`／`投資`） |
| 跟讀短文 | **每課**附英文約 80–120 words＋中譯 |
| 音檔 | **TTS**（不上真人 MP3） |
| Real Estate 術語 | 獨立檔 **`real estate glossary.md`** |
| 練習題自動批改 | 尚未定（仍維持文末簡答） |
| 與 `english V.md` 雙向連結 | 尚未定（目前獨立） |

---
"""
    text = re.sub(
        r"# 附錄 B｜.*?\n\n.*?\n---\n",
        appendix_b,
        text,
        count=1,
        flags=re.S,
    )

    text = re.sub(
        r"\| 語體 \|.*?\n\| 程度 \|.*?\n(?:\| 跟讀／音檔 \|.*?\n)?(?:\| 配套 glossary \|.*?\n)?\| 網站 \|.*?\n",
        "| 語體 | 美式；生活＋投資／房產 |\n"
        "| 程度 | 指向 C1 |\n"
        "| 跟讀／音檔 | 每課短文；**TTS** |\n"
        "| 配套 glossary | `real estate glossary.md` |\n"
        "| 網站 | **尚未接入**；打磨後再編譯進 `web/` |\n",
        text,
        count=1,
    )

    SRC.write_text(text, encoding="utf-8")
    print(f"Updated {SRC}")
    # verify counts
    assert len(re.findall(r"^## Lesson ", text, flags=re.M)) == 36
    assert len(re.findall(r"### 跟讀短文", text)) == 36
    print("OK: 36 lessons, 36 passages")


if __name__ == "__main__":
    main()
