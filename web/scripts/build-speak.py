# -*- coding: utf-8 -*-
"""Build speak.json from 6r.md with Chinese translations."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "6r.md"
OUT = ROOT / "web" / "src" / "data" / "speak.json"

# Exact English line -> Traditional Chinese (aligned with Omni Ledger tone)
ZH: dict[str, str] = {
    "I'll hit snooze just one more time.": "我再貪睡一下就好。",
    "I feel like staying in bed forever today.": "我今天好想賴在床上一輩子。",
    "Looks like it's pouring rain outside.": "外頭看起來在下大雨。",
    "I don't know if I can catch the 8:30 bus.": "我不知道還趕不趕得上八點半那班公車。",
    "I'm gonna grab an iced latte on my way to work.": "我上班路上會去買杯冰拿鐵。",
    "Let me quickly scan through my unread emails first.": "我先快速掃過未讀郵件。",
    "I wanna knock out this report before lunchtime.": "我想在午飯前把這份報告搞定。",
    "I have to wrap up this phone call with the client.": "我得先結束跟客戶的這通電話。",
    "Can I get a chicken salad to go, please?": "麻煩給我一份雞肉沙拉外帶，謝謝。",
    "Do you wanna take a quick walk to fight the food coma?": "要不要走走消食，趕走飯後昏睡？",
    "Could you double-check these numbers for me real quick?": "可以幫我再快速核對一下這些數字嗎？",
    "What do you say we pack up and call it a day?": "我們收拾一下收工，好不好？",
    "How do you usually unwind after such a stressful day?": "這麼高壓的一天後，你通常怎麼放鬆？",
    "I've been binge-watching this new show all evening.": "我整晚都在狂追這部新劇。",
    "I keep dozing off, so it's time for bed.": "我一直打瞌睡，該上床睡了。",
    "Let me walk you through the goals of this new project.": "我來帶你過一遍這個新專案的目標。",
    "I'll take the lead on drafting the project scope.": "專案範圍草案我來主導。",
    "Do you wanna handle the vendor communication part?": "廠商溝通這塊你要不要負責？",
    "Make sure you set clear deadlines for each milestone.": "記得替每個里程碑訂清楚的截止日期。",
    "I have to double-check our available budget before we spend.": "花錢前我得再確認可用預算。",
    "I wanna keep everyone in the loop as we build this.": "推進過程中我想讓大家都掌握進度。",
    "Could you send over the technical specs by noon?": "中午前可以把技術規格寄過來嗎？",
    "Looks like we just hit a bottleneck with the database.": "看起來我們在資料庫這邊卡關了。",
    "I don't know why this server keeps throwing errors.": "我不懂為什麼這台伺服器一直報錯。",
    "Why don't we test an alternative workaround first?": "不如我們先試試替代的變通方案？",
    "How do you feel about shifting the deadline back by two days?": "你覺得把截止日期延後兩天怎麼樣？",
    "I feel like that would give us enough breathing room.": "我覺得那樣會讓我們有足夠喘息空間。",
    "Are you sure the revised mockups are ready for presentation?": "修訂後的稿真的準備好簡報了嗎？",
    "What do you think management will say about these numbers?": "你覺得管理層會怎麼看這些數字？",
    "Can I get your final approval on this slide deck?": "這份簡報可以請你做最終核准嗎？",
    "I'm gonna push the code to production tonight.": "我今晚會把程式推上正式環境。",
    "I keep refreshing the analytics dashboard to check user feedback.": "我一直在重新整理分析儀表板看使用者回饋。",
    "I've been compiling all the bugs that users reported.": "我一直在彙整使用者回報的所有錯誤。",
    "How about running a quick retrospective on Friday afternoon?": "週五下午做個快速檢討會如何？",
    "It's time to archive the files and celebrate our win.": "是時候封存檔案、慶祝這次勝利了。",
    "I wanna try making authentic garlic butter steak tonight.": "今晚我想試試做道地的蒜香奶油牛排。",
    "Can I get two thick-cut ribeye steaks from the butcher?": "可以跟肉販買兩塊厚切肋眼牛排嗎？",
    "Don't forget to pat the beef completely dry with paper towels.": "別忘了用紙巾把牛肉徹底拍乾。",
    "Make sure you season both sides generously with coarse sea salt.": "記得兩面都要慷慨地撒上粗海鹽。",
    "I'll chop up some fresh rosemary and smash a few garlic cloves.": "我會剁一點新鮮迷迭香，再拍碎幾瓣蒜。",
    "I have to get this cast-iron skillet ripping hot first.": "我得先把這口鑄鐵鍋燒到超熱。",
    "All you need to do is sear the meat for two minutes without touching it.": "你只要把肉煎兩分鐘、中間別去動它。",
    "Looks like we've got a gorgeous golden-brown crust forming.": "看起來漂亮的金棕色外皮正在成形。",
    "Let me toss in a generous slab of butter for basting.": "我加一大塊奶油進去做澆淋。",
    "I'm gonna let the steak rest for five minutes before slicing.": "切片前我會讓牛排靜置五分鐘。",
    "It's time to dig in while everything is piping hot!": "趁一切滾燙熱騰騰，開動吧！",
    "There's no way home cooking can smell this incredible.": "家常料理怎麼可能香成這樣。",
    "Do you wanna take the first slice and try it?": "要不要先切第一片試試看？",
    "How do you like the doneness of this cut?": "你覺得這塊的熟度怎麼樣？",
    "It tastes like something served in a high-end steakhouse.": "吃起來像高級牛排館端出來的。",
    "You should definitely try it with this creamy peppercorn sauce.": "你一定要配這個奶油胡椒醬試試。",
    "I don't know how you got the meat so unbelievably tender.": "我不懂你怎麼把肉弄得這麼不可思議地嫩。",
    "Is it just me, or is the rosemary aroma coming through so cleanly?": "是只有我這樣覺得，還是迷迭香香氣真的很乾淨清楚？",
    "I feel like the garlic butter creates such a velvety mouthfeel.": "我覺得蒜香奶油帶來一種絲滑的口感。",
    "What do you think about pairing this with that dry red wine?": "你覺得搭配那瓶乾紅怎麼樣？",
    "How about a squeeze of lemon to cut through the richness?": "擠點檸檬來解膩如何？",
    "Why don't we mop up the leftover pan juices with that sourdough bread?": "不如用那塊酸種麵包把鍋汁沾光？",
    "Are you sure this is your first time nailing a medium-rare like this?": "你確定這是你第一次把五分熟抓得這麼準？",
    "I can't get over how crispy the edges are while the inside stays juicy.": "外緣這麼脆、裡面又多汁，我真的好驚豔。",
    "I've been craving a meal like this for the longest time.": "我渴望這樣一餐好久了。",
    "I keep reaching for more of these roasted potatoes on the side.": "我一直伸手去夾旁邊的烤馬鈴薯。",
    "If you ask me, this entire dinner is an absolute ten out of ten.": "要問我的話，這頓晚餐絕對一百分。",
    "Could you share your secret marinade recipe with me?": "可以把你的祕密醃料配方分享給我嗎？",
    "I'm so glad we decided to cook at home instead of eating out.": "好慶幸我們決定在家煮，而不是外食。",
    "Next time, let's make a bigger batch so we can have leftovers!": "下次我們做多一點，好留剩菜！",
    "I wanna book the early flight to avoid morning turbulence.": "我想訂早班機，避開早上的亂流。",
    "Let me double-check all passport expiration dates first.": "我先再確認所有護照效期。",
    "Make sure you pack an international power adapter in your carry-on.": "記得在隨身行李放一個國際轉接頭。",
    "Don't forget to notify the credit card company about overseas transactions.": "別忘了通知信用卡公司有海外消費。",
    "I'll take care of the airport transfer reservation.": "機場接送預約交給我。",
    "Can I get a window seat closer to the front, please?": "可以給我靠前一點的靠窗座位嗎？",
    "Looks like our connecting flight has been delayed by two hours.": "看起來我們的轉機班機延誤了兩小時。",
    "I don't know if our checked luggage will make the tight transfer.": "不知道託運行李趕不趕得上這趟緊湊轉機。",
    "Could you check with the gate agent about hotel vouchers?": "可以跟閘口地勤問一下飯店住宿券嗎？",
    "I'm gonna grab a bottle of water before the stores close.": "商店打烊前我先去買瓶水。",
    "Do you wanna split a cab to the hotel instead of taking the train?": "要不要分攤計程車去飯店，別搭火車？",
    "What do you think about grabbing a bite at that 24-hour diner?": "去那間二十四小時小餐館吃一口，你覺得呢？",
    "How do you pronounce the name of this local street food?": "這個在地小吃的名字怎麼念？",
    "I feel like a good night's rest will cure this jet lag completely.": "我覺得好好睡一晚就能徹底治好時差。",
    "I keep checking my watch because my internal clock is totally off.": "我一直看錶，因為生理時鐘完全亂掉了。",
    "Why don't we hire a local guide for the historic quarter tomorrow?": "明天何不請個在地導遊逛歷史街區？",
    "How about renting electric scooters to explore the coastline?": "租電動滑板車去海岸線探險如何？",
    "Are you sure the temple is still open to visitors this late?": "你確定寺廟這麼晚還開放參觀嗎？",
    "It's time to exchange some local currency for the street stalls.": "該換點當地貨幣好逛街頭攤販了。",
    "I've been dying to try this Michelin-recommended pastry shop.": "我超想去這家米其林推薦的糕點店。",
    "All you need to do is scan this QR code to download the subway map.": "你只要掃這個 QR code 下載地鐵圖就行。",
    "There's no way we can hit all three museums in a single afternoon.": "一個下午不可能逛完三間博物館。",
    "You should definitely wear comfortable walking shoes on this cobblestone road.": "走這條石板路一定要穿舒服的走路鞋。",
    "Is it just me, or is the temperature dropping really fast tonight?": "是只有我覺得，還是今晚氣溫降得好快？",
    "It tastes like lemongrass and coconut milk blended together.": "吃起來像香茅和椰奶混在一起。",
    "I can't get over how well-preserved these ancient fortress walls are.": "這些古城牆保存得這麼好，我真的好驚豔。",
    "If you ask me, the view from the rooftop beats the crowded observatory.": "要問我的話，屋頂景觀比擁擠的觀景台好多了。",
    "I'm so glad we packed rain ponchos just in case.": "好慶幸我們以防萬一帶了雨衣。",
    "To be honest, the famous tourist trap wasn't worth the hype at all.": "老實說，那個有名的觀光陷阱完全不值得炒作。",
    "No wonder all the locals lined up outside this tiny alley bakery.": "難怪當地人都在這間小巷麵包店外排隊。",
    "I'm afraid that the ferry service might be suspended due to rough seas.": "恐怕渡輪會因為海況不佳而停駛。",
    "Chances are we can catch the sunset if we take the bypass route now.": "如果現在走便道，很有機會趕上日落。",
    "Assuming that the traffic clears up, we'll reach the station by five.": "假設交通疏通，我們五點前可以到車站。",
    "Even if it starts drizzling, the market still has an indoor pavilion.": "就算下起毛毛雨，市場也還有室內亭區。",
    "What if we take the scenic mountain train back instead of flying?": "萬一我們改搭景觀山列車回去、不搭飛機呢？",
    "It turns out that the landmark was closed for renovation on Tuesdays.": "原來這個地標星期二會因整修關閉。",
    "I couldn't help but take hundreds of photos of that incredible sunset.": "那個驚人的日落，我忍不住拍了上百張。",
    "I'm looking forward to soaking in the hotel hot tub after all this hiking.": "走了這麼多路，我很期待泡飯店的熱水浴缸。",
    "Next time, we should definitely spend at least three nights in this quaint town.": "下次我們一定要在這個古雅小鎮至少住三晚。",
    "Looking back on it, that missed train turned out to be our best adventure.": "回想起來，錯過那班火車反而是我們最棒的冒險。",
    "Let me outline the strategic roadmap for this Q4 product launch.": "我來概述這次第四季產品發布的策略路線圖。",
    "First off, we must establish clear performance indicators for the rollout.": "首先，我們必須為上線訂出清楚的績效指標。",
    "Make sure you finalize the press release before forwarding it to legal.": "轉給法務前，請先把新聞稿定稿。",
    "Don't forget to loop in the customer support team for crisis training.": "別忘了把客服團隊拉進來做危機訓練。",
    "I'll oversee the coordination between engineering and marketing.": "工程與行銷之間的協調我來督導。",
    "I wanna clarify the user onboarding flow during the live demo.": "現場示範時我想把使用者導覽流程講清楚。",
    "Could you pull the latest analytics on user sign-ups from beta?": "可以拉一下測試版最新的註冊分析嗎？",
    "I have to stress the importance of server stability under high traffic.": "我必須強調高流量下伺服器穩定的重要性。",
    "Can I get a status report on the API gateway integration by noon?": "中午前可以給我 API 閘道整合的進度報告嗎？",
    "Looks like the design department revised the brand assets again.": "看來設計部門又改了品牌素材。",
    "I don't know whether the current bandwidth can handle ten thousand users.": "我不確定目前頻寬能不能撐一萬名使用者。",
    "Why don't we set up a backup server cluster to prevent sudden crashes?": "何不建置備援伺服器叢集，預防突然當機？",
    "Do you wanna rehearse the keynote slides on the main stage tomorrow?": "明天要不要在主舞台彩排主題簡報？",
    "What do you say about inviting tech journalists for an exclusive early look?": "邀請科技記者搶先獨家體驗，你覺得呢？",
    "How do you plan to handle negative press if the feature receives backlash?": "如果功能引發反彈，你打算怎麼處理負面報導？",
    "I feel like the pricing tier might be slightly confusing to casual users.": "我覺得收費方案對一般使用者可能有點難懂。",
    "Are you sure all data privacy compliance standards have been satisfied?": "你確定所有資料隱私合規標準都達標了嗎？",
    "How about streamlining the registration process to just two simple clicks?": "把註冊流程精簡成兩次點擊如何？",
    "All you need to do is approve the budget reallocation for targeted paid ads.": "你只要核准定向付費廣告的預算重分配就行。",
    "There's no way we can delay the release date with media invites already out.": "媒體邀請都已發出，發布日不可能再延。",
    "You should definitely dry-run the payment gateway with international cards.": "你一定要用國際卡對支付閘道做一次彩排測試。",
    "Is it just me, or does this dashboard look slightly cluttered on mobile?": "是只有我覺得，還是這個儀表板在手機上看有點雜？",
    "I can't get over how responsive the interface feels after the optimization.": "優化後介面這麼跟手，我真的好驚豔。",
    "If you ask me, this killer feature alone will disrupt the entire market.": "要問我的話，光這個殺手鐧功能就會顛覆整個市場。",
    "I'm gonna trigger the deployment script as soon as you give the word.": "你一點頭，我就會啟動部署腳本。",
    "It's time to open the registration portal to the public waiting list.": "是時候對公開候補名單開放註冊入口了。",
    "I keep watching the error logs to make sure nothing unexpected spikes.": "我一直盯著錯誤日誌，確保沒有異常暴衝。",
    "I've been tracking the real-time conversion rates every ten minutes.": "我每十分鐘都在追即時轉換率。",
    "To be honest, the initial server load was heavier than we anticipated.": "老實說，初期伺服器負載比我們預期更重。",
    "No wonder our social media mentions skyrocketed after the live stream.": "難怪直播後社群提及量暴衝。",
    "I'm afraid that the free tier users are hitting the system capacity limit.": "恐怕免費用戶正在撞上系統容量上限。",
    "Chances are enterprise clients will ask for customized API solutions.": "企業客戶很有可能要求客製化 API 方案。",
    "Assuming that the current retention rate holds, we will hit our target.": "假設目前留存率維持得住，我們會達標。",
    "Even if competitors copy the concept, our ecosystem lock-in is stronger.": "就算對手抄概念，我們的生態系黏著度更強。",
    "What if we offer a launch discount to convert trial users to yearly plans?": "若提供上市優惠，把試用者轉成年繳方案呢？",
    "It turns out that the micro-influencer campaign generated the best ROI.": "原來微型網紅活動帶來了最佳投資報酬率。",
    "I'm so glad the dev team patched that critical security leak overnight.": "好慶幸開發團隊連夜修了那個關鍵資安漏洞。",
    "Correct me if I'm wrong, but didn't we promise dark mode by next week?": "若我說錯請糾正，但我們不是承諾下週有深色模式嗎？",
    "I see your point, but scaling back features now would hurt our credibility.": "我懂你的意思，但現在砍功能會傷害可信度。",
    "As far as I know, the board members are thrilled with the first-day results.": "就我所知，董事會對首日成果相當興奮。",
    "As long as you keep the uptime above ninety-nine percent, clients stay happy.": "只要你把可用率維持在百分之九十九以上，客戶就會開心。",
    "Unless we optimize the database queries, operational costs will balloon.": "除非我們優化資料庫查詢，否則營運成本會膨脹。",
    "Just to make sure, did everyone update their documentation on GitHub?": "只是再確認一下，大家都在 GitHub 更新文件了嗎？",
    "Speaking of which, has the marketing team scheduled the follow-up emails?": "說到這，行銷團隊排好後續郵件了嗎？",
    "At this rate, we are projected to double our daily active users by Friday.": "照這個速度，預估週五前日活躍用戶會翻倍。",
    "There is no doubt that this rollout set a new benchmark for the company.": "毫無疑問，這次上線為公司立下新標竿。",
    "The bottom line is user retention matters far more than vanity metrics.": "重點是：使用者留存遠比虛榮指標重要。",
    "In retrospect, conducting those two extra dry runs saved us from disaster.": "事後看來，多做那兩次彩排讓我們免於災難。",
    "It goes without saying that the entire team deserves a huge bonus for this.": "不用說，整個團隊都該為這次拿豐厚獎金。",
    "Next time, we should automate the regression testing pipeline even earlier.": "下次我們該更早把回歸測試管線自動化。",
    "I feel like this 40-year-old townhouse has incredible potential.": "我覺得這棟四十年連棟透天潛力驚人。",
    "First off, we need a structural engineer to inspect the load-bearing walls.": "首先，我們需要結構工程師檢查承重牆。",
    "Make sure you obtain all the necessary renovation permits from city hall.": "記得向市政廳取得所有必要的翻修許可。",
    "Don't forget to turn off the main water and gas valves before demolition.": "拆除前別忘了關閉總水閥與瓦斯閥。",
    "I'll negotiate the scope and terms with the general contractor.": "工程範圍與條款我會跟總承包商談。",
    "I wanna knock down this dividing partition to create an open kitchen.": "我想打掉這道隔間牆，做成開放式廚房。",
    "Let me review the electrical blueprint for all the smart switches.": "我來檢視所有智慧開關的電氣藍圖。",
    "Could you ensure every socket in the kitchen has proper grounding?": "可以確認廚房每個插座都有妥善接地嗎？",
    "I have to stick to our budget limits, or we'll run out of cash.": "我得守住預算上限，否則會手頭吃緊。",
    "Can I get an itemized estimate for replacing the corroded galvanized pipes?": "更換腐蝕鍍鋅管可以給我明細報價嗎？",
    "Looks like the roof has a chronic seepage problem around the corners.": "看起來屋頂角落有長期滲水問題。",
    "I don't know if these vintage floor tiles can be salvaged intact.": "不知道這些復古地磚能不能完整搶救下來。",
    "Why don't we run neutral wires into every gang box for smart relays?": "何不把中性線拉進每個接線盒，方便智慧繼電器？",
    "Do you wanna install a centralized water filtration unit in the basement?": "要不要在地下室裝中央淨水設備？",
    "What do you think of using soundproof double-glazed windows facing the avenue?": "臨大街那側用隔音雙層玻璃窗，你覺得呢？",
    "How do you want to configure the automated lighting scenes in the living room?": "客廳自動化燈光情境你想怎麼設定？",
    "Are you sure the current circuit breaker can handle a high-power induction cooktop?": "你確定現有斷路器撐得住高功率IH爐嗎？",
    "How about concealing all the ethernet cabling inside the skirting boards?": "把所有網路線藏進踢腳板裡如何？",
    "All you need to do is pick out the paint swatch for the master bedroom.": "你只要挑好主臥的油漆色卡就行。",
    "There's no way we can live on site while they are jackhammering the floors.": "他們用破碎機打地板時，我們不可能住現場。",
    "You should definitely pressure-test the new plumbing before closing up the drywall.": "封石膏板前一定要對新水管做壓力測試。",
    "Is it just me, or does this custom cabinetry seem two inches too shallow?": "是只有我覺得，還是這組訂製櫃體淺了兩吋？",
    "I can't get over how much brighter the interior feels with skylights installed.": "裝了天窗後室內亮這麼多，我真的好驚豔。",
    "If you ask me, matte black hardware looks way classier than polished chrome.": "要問我的話，霧黑五金比拋光鉻雅緻多了。",
    "I'm gonna set up the Zigbee smart hub right in the middle of the hallway.": "我會把 Zigbee 智慧中樞裝在走廊正中央。",
    "It's time to pair all the motorized shades with the voice assistant.": "是時候把所有電動窗簾跟語音助理配對了。",
    "I keep finding fine drywall dust settling on newly delivered furniture.": "我一直發現石膏粉塵落在剛送來的家具上。",
    "I've been vacuuming the air filters every single day during sanding.": "打磨期間我每天都在吸空氣濾網。",
    "To be honest, the marble countertop price quote gave me sticker shock.": "老實說，大理石檯面報價讓我價格休克。",
    "No wonder the renovation took two weeks longer than originally scheduled.": "難怪翻修比原訂時程多花了兩週。",
    "I'm afraid that the tiles in the guest bath weren't leveled properly.": "恐怕客房浴室的磁磚沒有整平好。",
    "Chances are the contractor will have to rip out those three uneven slabs.": "承包商很有可能得拆掉那三片不平的板。",
    "Assuming that the silicone sealant dries by tomorrow, we can test the shower.": "假設矽利康明天乾了，我們就能測淋浴。",
    "Even if the power cuts out, the smart lock has an emergency USB-C terminal.": "就算停電，智慧鎖也有緊急 USB-C 接孔。",
    "What if we automate the exhaust fans to turn on when humidity exceeds 70%?": "若濕度超過百分之七十就自動開抽風機呢？",
    "It turns out that the original subfloor was completely infested with dry rot.": "原來原本的底層地板整個被乾腐菌侵蝕。",
    "I'm so glad we replaced all the aging wiring with flame-retardant cables.": "好慶幸我們把老化線路全換成耐燃電纜。",
    "Correct me if I'm wrong, but didn't we agree that dimmers were included in the price?": "若我說錯請糾正，但我們不是說好調光器含在報價裡嗎？",
    "I see your point, but safety always trumps aesthetics when it comes to electricity.": "我懂你的意思，但談到電力，安全永遠優先於美觀。",
    "As far as I know, the warranty covers any roof leaks for the next five years.": "就我所知，保固涵蓋未來五年任何屋頂漏水。",
    "As long as you maintain the HVAC filters quarterly, the efficiency stays peak.": "只要你每季保養空調濾網，效率就能維持巔峰。",
    "Unless we seal the grout, stains will permanently ruin the kitchen backsplash.": "除非我們封好填縫劑，否則汙漬會永久毀了廚房背牆。",
    "Just to make sure, did the carpenter leave access panels for the air conditioning?": "只是再確認，木工有留空調維修口嗎？",
    "Speaking of which, the customized solid wood dining table arrives on Thursday.": "說到這，訂製實木餐桌星期四會到。",
    "At this rate, we will finally be able to sleep in our own bed by the weekend.": "照這個速度，週末我們終於能睡自己的床了。",
    "There is no doubt that surviving a major renovation tests any relationship.": "毫無疑問，熬過大翻修是對任何關係的考驗。",
    "The bottom line is the structural integrity of the home has been completely restored.": "重點是：房子的結構完整性已徹底恢復。",
    "In retrospect, choosing waterproof vinyl planks over real hardwood was brilliant.": "事後看來，選防水塑膠地板而非實木地板太明智了。",
    "It goes without saying that hosting the housewarming party is going to be a blast.": "不用說，辦喬遷派對一定會超好玩。",
    "It's about time we peeled off the protective plastic films and enjoyed the space.": "是時候撕掉保護膠膜、好好享受這個空間了。",
    "The thing is, smart home automation is only as good as your home network.": "重點是：智慧家居再強，也取決於你家的網路。",
    "I'd rather invest upfront in commercial-grade routers than suffer spotty Wi-Fi.": "我寧願一開始投資商用級路由器，也不要忍受不穩的 Wi-Fi。",
    "Believe it or not, the automated routines already cut down our utility bills.": "信不信由你，自動化情境已經降低我們的公用事業費。",
    "There's no point in buying fancy gadgets if they can't integrate into one app.": "若不能整合進同一個 App，買炫砲裝置就沒意義。",
    "Except for the fact that the doorbell camera is overly sensitive, everything works great.": "除了門鈴攝影機過度敏感之外，一切都很順利。",
    "For the time being, let's leave the guest room empty until we decide on the furniture.": "暫時先讓客房空著，等我們決定家具再說。",
    "In the meantime, we can set up the entertainment center and mount the TV.": "同時我們可以架娛樂中心、把電視掛上牆。",
    "Hardly had we unpacked the last moving box when the neighbors knocked with cookies.": "我們幾乎還沒拆完最後一個紙箱，鄰居就帶著餅乾來敲門。",
    "No matter how exhausting the messy demolition phase was, the outcome is stunning.": "無論凌亂的拆除階段多累人，成果都令人驚豔。",
    "Next time, whenever we tackle a home project, we'll know exactly how to manage it.": "下次再做居家專案，我們就會完全知道怎麼管理。",
}

META = [
    {
        "slug": "common-01-new-day",
        "titleZh": "新的一天",
        "titleEn": "A New Day",
        "summaryZh": "從賴床、通勤、午間到收工入睡——日常節奏口語。",
        "audioFile": "common-01-new-day.mp3",
        "heading": "篇章一：新的一天",
    },
    {
        "slug": "common-02-goal-setting",
        "titleZh": "目標設定",
        "titleEn": "Goal Setting",
        "summaryZh": "專案目標、分工、延期與收尾——職場推進常用句。",
        "audioFile": "common-02-goal-setting.mp3",
        "heading": "篇章二：目標設定",
    },
    {
        "slug": "common-03-cooking",
        "titleZh": "料理步驟",
        "titleEn": "Cooking Steps",
        "summaryZh": "煎牛排與品嚐回饋——廚房場景口語與感官描述。",
        "audioFile": "common-03-cooking.mp3",
        "heading": "篇章三：料理步驟",
    },
    {
        "slug": "common-04-travel",
        "titleZh": "海外旅遊與探索",
        "titleEn": "Travel & Exploration",
        "summaryZh": "訂票、轉機、在地探索與旅途轉折——旅行全程口語。",
        "audioFile": "common-04-travel.mp3",
        "heading": "篇章四：海外旅遊與探索",
    },
    {
        "slug": "common-05-product-launch",
        "titleZh": "跨部門新產品發佈",
        "titleEn": "Cross-Team Product Launch",
        "summaryZh": "從路線圖、彩排到上線檢討——發佈會全週期職場口語。",
        "audioFile": "common-05-product-launch.mp3",
        "heading": "篇章五：跨部門新產品發佈會全週期",
    },
    {
        "slug": "common-06-renovation",
        "titleZh": "老屋翻新與智慧家居",
        "titleEn": "Renovation & Smart Home",
        "summaryZh": "拆除、水電、智慧設備到入住——居家改造現場口語。",
        "audioFile": "common-06-renovation.mp3",
        "heading": "篇章六：老屋翻新與智慧家居改造大工程",
    },
]


def parse_chapters(text: str) -> list[tuple[str, list[str]]]:
    chapters: list[tuple[str, list[str]]] = []
    current_title = None
    lines: list[str] = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith("篇章"):
            if current_title is not None:
                chapters.append((current_title, lines))
            current_title = line
            lines = []
            continue
        if current_title is not None:
            lines.append(line)
    if current_title is not None:
        chapters.append((current_title, lines))
    return chapters


def main() -> None:
    text = SRC.read_text(encoding="utf-8")
    chapters = parse_chapters(text)
    if len(chapters) != 6:
        raise SystemExit(f"Expected 6 chapters, got {len(chapters)}")

    missing: list[str] = []
    articles = []
    for meta, (heading, en_lines) in zip(META, chapters):
        if meta["heading"] != heading:
            # tolerate minor whitespace
            pass
        segments = []
        for i, en in enumerate(en_lines, start=1):
            zh = ZH.get(en)
            if not zh:
                missing.append(en)
                zh = "（待補中文）"
            segments.append({"id": f"{meta['slug']}-{i:02d}", "en": en, "zh": zh})
        articles.append(
            {
                "id": meta["slug"],
                "slug": meta["slug"],
                "series": "common",
                "seriesZh": "常用口語",
                "seriesEn": "Common Oral Scripts",
                "titleZh": meta["titleZh"],
                "titleEn": meta["titleEn"],
                "summaryZh": meta["summaryZh"],
                "durationHint": "約 40–80 秒",
                "audioPath": f"/audio/speak/common/{meta['audioFile']}",
                "audioFile": meta["audioFile"],
                "status": "draft",  # flip to ready when mp3 is placed
                "segmentCount": len(segments),
                "segments": segments,
            }
        )

    if missing:
        print("MISSING ZH:", len(missing))
        for m in missing:
            print(repr(m))
        raise SystemExit(1)

    payload = {
        "source": "6r.md",
        "series": [
            {
                "id": "common",
                "slug": "common",
                "titleZh": "常用口語 6 篇",
                "titleEn": "Common Oral Scripts",
                "description": "日常生活、職場、料理、旅遊、產品發佈與居家改造的跟讀短文。放入對應 MP3 後即可真人跟讀。",
                "audioDir": "/audio/speak/common/",
            }
        ],
        "total": len(articles),
        "articles": articles,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT} articles={len(articles)} lines={sum(a['segmentCount'] for a in articles)}")


if __name__ == "__main__":
    main()
