# Local validation — 2026-11-07

## Automated 这四点其实可以整合成一套完整的产品机制。我建议不要把它们理解成四个独立模块，而是让它们共同解决一个问题：

外国游客发现了一个有意思的中国文化体验之后，怎样从“感兴趣”，走到“敢尝试”，最后“真的完成”？

四家竞品分别给了你不同的答案：

- Culture Detour：让用户知道什么值得探索，以及下一步去哪。
- Arcade：让用户在现场主动观察和参与，而不是被动听讲。
- UnTour：让用户在出发前理解自己将获得什么，以及可能遇到什么限制。
- VDC：这是你现有的能力，可以把体验承诺建立在可核实的旅行信息上。

我会把它们整合成 China, Closer 的一个核心产品单位：Experience Journey（文化体验旅程）。

## 一、先看看理想的产品体验

以石库门为例，我会把当前文化故事页改造成下面这样的体验页面。

CHINA, CLOSER / SHANGHAI EXPERIENCES

[Best of Shanghai Half Day Tour (Xintiandi Shikumen + Jade Buddha Temple + M50 + Tea Ceremony) - Klook](https://images.openai.com/static-rsc-4/acKlHP8xpI35A1CRshCN7OCnx6aq5tLHcrtQ4gUiQKOXR8cpYkdfs5XbwZ5tpstFbxOGz07cNJ-rzbrvGmftLPT9kOsd5okB0GB0YhPdzS0ll8O9tDCfML6sZValnYRvaDDQG9bKT4HTPcq3Q7wT1MamohQbCH0fij7lsdsuWgc?purpose=inline)

[klook.com](https://www.klook.com/en-NZ/activity/150131-shanghai-highlight-half-day-city-tour/?utm_source=chatgpt.com)

# Why do these Shanghai doorways look so different?

Discover the story of Shanghai's stone-gate houses through the details you can see with your own eyes.

&#x20;15–20 min

&#x20;Self-guided

&#x20;No purchase required

Your first discovery

Look at the stone doorway. Notice its shape, decorative details and the narrow lane behind it.

What might this entrance tell us about how people lived here?

Public access and route details must be checked for your chosen location. Private residential entrances are not part of this experience.

Explore this experience 概念原型：时长属于编辑估计；开放范围和现场通行条件不是实时确认信息。

这个页面同时完成了四件事：激发好奇、给出第一步、降低不确定性、提供可靠的行动条件。

下面具体拆解。

## 二、第一点：学习 Culture Detour——把内容标题改成需求入口

### 1. 不要让游客觉得自己在阅读百科

现在的内容组织可能是：

Stories Behind Places → Shanghai Shikumen → Historical Background → Architectural Features

这属于知识分类。

但游客的决策路径往往是：

“这是什么？” → “为什么有意思？” → “我能亲自看到什么？”

所以我建议采用两层标题。

| 层级  | 展示内容                                                | 用途          |
| --- | --------------------------------------------------- | ----------- |
| 发现层 | Why do these Shanghai doorways look so different?   | 激发用户点击      |
| 内容层 | A Doorway Between Two Worlds: The Story of Shikumen | 建立文化深度与搜索关联 |

不是把所有历史标题都改成夸张的疑问句。搜索页面仍然需要清晰的主题词，故事页面则用问题激发探索。

### 2. 每一篇故事首屏都给一个动作

我建议每篇故事增加一个 `First thing to notice`，不能超过两句话。

例如：

[Shanghai Shikumen old building](https://images.openai.com/static-rsc-4/KS4lvXuwky_LCR0bjuGdE49a8biKDpjq8MIk3NnQq4WTdgDtupkUyBAJQZB7KkbLw-uh2t81yHO2XHOQto-IKf8YFUF7iAGQRAQ-Wvuov5w4LnJzQQqJB13MxgXMAbAvm3Ee8DFaBEc4CHGdN8_Wfb0Ct_xDQKm4g5OBKhW7kPTDH7bWOaSviLUs8xJ07mEi?purpose=inline)

石库门

Find a stone-framed doorway. Look at the entrance and the lane behind it.

观察门框与弄堂之间的关系。

[Shanghai Soy Milk and Youtiao Guide - Doujiang Breakfast](https://images.openai.com/static-rsc-4/qfGt4cMUCSpkiaCQ7yzD_rBfM5KdinPieqrZiPfWg3AxSAcse-3YNY-5E1g8bL1isFl8tDQx1zOYDPFfoUrzmCPDuukq9MiHVpq0-WyENuMtC8G48cx2b8Qo3DqVvEI5JX7e93U7ilbgVvx_P22cArpv1NNXZ6AaWFmshwjIsSU?purpose=inline)

上海早餐

Find one breakfast food you haven't tried before.

从一种不熟悉的早餐开始了解当地生活，先确认食材。

[Review of Fuxing Park | Shanghai, China, Asia -  AFAR](https://images.openai.com/static-rsc-4/7_nrTv4jKekzlIRrcWS305uyay7FsWTvUTFCjjvkuI0ltRb6oSolfAzhI0B0V9Xw9pUTEsJ-WES-3cbc6xsOfYFTvhn5c2GzRNH21Riz3mrIQdNR0xHwy0N5MbcAotiUAqGgL0Gk2LGLn4gytAnHYrSCMuu1n6jAsssSoT9y9_o?purpose=inline)

复兴公园

Notice how people use different parts of the park.

从公共空间的使用方式理解城市生活，避免打扰或拍摄陌生人。

这一改动最重要的价值是：即使游客没看完整篇文章，他也已经知道可以做什么。

### 3. 具体应该怎么改代码？

保留你已经写好的 3 篇 271–273 词英文故事，不用重写。

只给现有 Story 数据增加以下字段：

| 字段                     | 作用          |
| ---------------------- | ----------- |
| `discoveryQuestion`    | 发现页的疑问标题    |
| `shortPromise`         | 用户能获得什么     |
| `firstObservation`     | 首屏可以执行的观察动作 |
| `relatedExperienceId`  | 关联现有文化体验    |
| `estimatedReadMinutes` | 预计阅读时间      |

然后改故事卡片、首页推荐卡和故事页首屏。

不要开发新的 CMS，也不用增加 AI 生成标题。

## 三、第二点：学习 Arcade——让游客主动探索，而不是打卡

Arcade 值得研究的不是游戏化，而是让游客在现场产生自己的发现。

一个关键区别：

普通讲解告诉游客：“石库门建筑融合了不同文化元素。”

而参与式体验让游客产生问题：“为什么这条街的入口长这样？里面的生活空间又是什么样？”

前者传递信息，后者激发观察。

### 我建议每项体验只有两个观察点

以石库门为例：

SELF-GUIDED DISCOVERY

## Look closer at Shikumen

01 · The doorway

Look at the stone frame, decoration and relationship between the entrance and the lane.

What does the entrance seem designed to separate or connect?

Next observation 无需积分、GPS 打卡或上传照片；观察活动应在允许公众通行的区域完成。

### 三种可以轮换的参与设计

| 机制          | 举例              | 价值             |
| ----------- | --------------- | -------------- |
| Notice 发现细节 | 观察石库门门框         | 帮助用户注意原本会忽略的东西 |
| Compare 对比  | 比较老式街区与商业更新后的空间 | 激发思考           |
| Try 亲身尝试    | 了解早餐食材后自己点一次餐   | 真实参与           |

这三种足够支撑当前产品，不需要开发游戏引擎。

尤其不建议：

- 打卡积分、排行榜和勋章；
- 强制上传照片证明到过；
- 要求游客找当地人完成社交挑战；
- 为了完成任务进入非开放区域。

这些反而容易破坏你想建立的真实文化体验。

### 真正值得增加的功能

我会增加一个很小的 Reflection Prompt：

What did you notice that you might have missed before?

用户可以自己保存一句话，但不需要公开，也不需要登录。

这与你已经实现的 private reflection 正好吻合。

## 四、第三点：学习 UnTour——减少游客的决策焦虑

这是四点中，我认为最直接影响游客会不会真正出发的部分。

付费导览网站通常特别重视预期管理，因为消费者付款前需要知道服务范围。而你的自助文化体验虽然免费，也存在类似问题。

游客打开体验页，可能会担心：

“需要花多少钱？会不会走很远？是不是必须预约？有没有导游带我？我不会中文怎么办？”

如果这些问题没有被回答，故事再精彩，也可能没人愿意行动。

### 我建议每个 Experience 页固定展示六个关键信息

| 信息          | 用户需要知道什么   | 产品表达                              |
| ----------- | ---------- | --------------------------------- |
| Duration    | 大概要多久      | `About 30–45 minutes`             |
| Cost        | 免费还是需要消费   | `Food purchases are optional`     |
| Format      | 有没有真人向导    | `Self-guided · No guide included` |
| Access      | 是否需要预约或门票  | 根据 VDC 记录明确说明                     |
| Language    | 不会中文能否体验   | `Chinese phrase card available`   |
| Limitations | 什么情况下不适合参加 | 例如食材过敏、通行限制、天气等                   |

其中最重要的是区分三种完全不同的状态：

Confirmed

有充分证据支持当前展示的运营信息。

Needs recheck

曾核实，但已达到复核日期。

Unknown

没有足够证据，不能承诺开放或免预约。

这里千万不能把 Booking not required 和 Booking requirement unknown 混为一谈。

### 用上海早餐体验举例

当前你没有核实具体早餐店，这不是严重问题。你可以把它设计成自主选择店铺的文化体验，而不是假装推荐某一家已验证商户。

首屏承诺：

A Morning Like a Shanghainese

Discover local breakfast traditions at a place you choose.

页面显示：

- 约 30–45 分钟，属于编辑估计。
- 店铺实际价格由商家决定。
- 不包含导游、餐食或预约服务。
- 用户自己选择营业中的早餐店。
- 提供中文点餐和询问食材的短语。
- 没有核实某家商店，就不显示“Verified Shop”。

这样既可使用，也不会虚构事实。

### 为什么这比继续增加故事重要？

因为它直接降低参与门槛。

同样是 100 个游客打开页面，我们要测量的不是多少人觉得设计漂亮，而是多少人愿意点击 Start Experience，以及最后实际尝试的人数。

## 五、第四点：Culture Detour + VDC——从“信息可信”走到“行动可靠”

这部分你已经有基础，但还差一点产品化。

你现在的 VDC 主要是一个场馆事实核实系统。它回答：

“关于这个地点，我们确认了哪些信息？”

而用户真正关心的是：

“我现在根据这些信息出发，会不会白跑？”

这两个问题不是一回事。

### 建议从地点数据转换为体验出发条件

例如一项石库门街区体验，用户需要的不一定是完整的 11 个场馆字段。

可能只需要：

- 公开可到达的导航位置；
- 可合法观察的空间范围；
- 是否有临时封闭风险；
- 建议探索时长；
- 无法进入时的替代活动。

相反，如果是收费园林或博物馆体验，就必须特别关注门票、停止入园时间、预约和身份证明要求。

所以建议把 VDC V1.1 改成按体验风险决定核实优先级。

| 体验类型    | 最重要的可靠性信息                  |
| ------- | -------------------------- |
| 公共街区探索  | 导航位置、公共通行、私人空间边界           |
| 公园观察    | 出入口、开放时段、临时限制              |
| 餐饮自助体验  | 若推荐具体店铺，则核实地址、营业和费用；另需过敏提示 |
| 收费文化场馆  | 票价、预约、证件、营业与停止入园规则         |
| 预约制文化活动 | 活动日期、名额、收费、取消规则、实际承办方      |

### 体验卡底部应该出现什么？

不是一个笼统的绿色勾号：

“Everything Verified”。

而是分项说明：

Before you go

Starting point

Use the linked navigation point; confirm the accessible entrance.

Opening & access

Check the latest venue-specific evidence before departure.

What we haven't confirmed

Any information without current evidence remains explicitly unknown.

Alternative

A different observation or experience that does not depend on the unavailable location.

这是信息结构示意，不代表特定上海地点已经完成新一轮核实。

### 我还建议增加一个重要机制：Plan B

这一点可能比“实时开放”更实用。

例如游客准备体验某个场馆，但预约要求尚未确认，产品可以建议：

“先查看官方预约信息；如果无法进入，改为周边允许公众通行的街区观察。”

注意，替代体验也需要自身可靠的信息依据，不能未经核实地承诺替代地点一定开放。

你的竞争力不应是声称所有信息永远正确，而是清楚表达我们知道什么、不知道什么，以及用户下一步可以怎么做。

## 六、四项设计应该怎样连接起来？

它们应该形成一个简单的单向主流程，但允许用户随时跳转和退出。

DISCOVER · Culture Detour

一个问题激发好奇

Why does this doorway look different?

DECIDE · UnTour

一眼知道怎么参与

Duration · Cost · Access · Language

PREPARE · VDC

确认出发条件

Navigation · Evidence · Alternatives

EXPLORE · Arcade

进行一两项现场观察

Notice · Compare · Try

REMEMBER · China, Closer

带走自己的体验

Reflect · Save · Optional Share

Local Voices 可以出现在其中任何一个合适的环节。例如在完成石库门观察后，推荐一段经过授权的居民回忆，而不是强制用户继续听。

这才是你自己的产品，而不是拼接四家竞品的功能。

## 七、对现有 Discover China V0.1，我会怎样安排开发？

你已经完成了三篇故事、三项自助体验、VDC 接入、中文卡和私人反思。所以这一轮实际上可以非常轻量。

| 开发优先级 | 具体改动                             | 复杂度 |
| ----- | -------------------------------- | --- |
| P0    | 故事卡加入疑问标题、简短承诺和第一观察动作            | 低   |
| P0    | Experience 首屏固定展示时长、费用性质、形式与访问限制 | 低   |
| P0    | 出发前信息连接 VDC 的单字段状态，而非整体 Verified | 中   |
| P1    | 每项体验增加 1–2 个可选观察点                | 低   |
| P1    | 提供相关中文卡和一个合适的 Plan B             | 低至中 |
| P1    | 将私人反思与体验结束状态连接                   | 低   |
| P2    | 记录匿名的发现、开始与体验反馈                  | 中   |
| 暂不做   | 实时 GPS、游戏积分、智能预测开放、陌生人匹配         | 不开发 |

我建议先用现有三项体验改造，而不是新增十个体验来展示数量。

## 八、怎么证明这些设计有价值？

我会设立四个指标，而且分别对应用户旅程的一个环节。

| 指标                       | 具体衡量                | 需要验证的问题         |
| ------------------------ | ------------------- | --------------- |
| Discovery CTR            | 体验卡点击数 / 体验卡曝光数     | 疑问标题是否真的吸引人？    |
| Start Rate               | 点击开始体验人数 / 体验详情访问人数 | 预期管理是否降低犹豫？     |
| Action Readiness         | 能独立找到出发信息的测试用户比例    | VDC 信息是否足够容易理解？ |
| Reported Experience Rate | 自愿反馈实际尝试人数 / 开始体验人数 | 用户是否真的行动？       |

别把用户点击“完成”按钮等同于真实线下体验。

我建议找 5–10 位目标外国游客做小规模可用性测试。如果条件允许，再让到过上海的游客进行现场测试。

测试时不要告诉他们入口在哪，只给一个任务：

“你今天有 45 分钟，想体验一点不那么游客化的上海生活。用这个产品找一项你愿意尝试的活动。”

观察他们是否能独立找到内容、理解参与条件、识别不确定信息并决定下一步。

## 我的最终建议

这四项里，我会优先做 UnTour 式预期管理和 Culture Detour 式行动决策，然后才加强 Arcade 式现场参与。

因为游客首先需要知道能不能去、值不值得去、会不会遇到麻烦。只有解决这些问题，现场观察和故事深度才有机会被真正体验。

对 China, Closer 来说，最小的、有竞争力的产品不是再增加一个文化栏目，而是：

一张体验卡能够同时提供好奇心、明确承诺、可执行步骤、可信旅行信息和一段值得记住的文化发现。

把这张卡做到真实游客愿意使用、能够完成，再复制到其他街区、早餐、园林和文化活动。checks: PASS

- `npm run check`: 10 Node tests passed, TypeScript check passed, Vite production build passed.
- Tests cover input boundaries, trip duration/pace, unique catalog stops, museum Tuesday closure, explicit free time when the catalog is exhausted, interest/budget/AI-order effects, budget arithmetic, catalog-constrained AI IDs, no-key behavior, mocked provider output, and HTTP origin/content-type/input/body-size handling.
- `npm audit --omit=dev`: 0 known vulnerabilities reported at retrieval time.
- `git diff --check`: passed. Repository contains only new local files; no commit/push/deployment performed.

## Real browser checks: PASS for the checks below

Playwright used the actual local development server and separately the built application served by Node on port 5174.

- Home and preparation layouts: 375, 390 and 1440 px; no horizontal document overflow observed.
- Mobile itinerary: three days, six stops; no horizontal overflow at 390 px.
- Curated trip generation succeeded. A personal note remained after reload.
- Save a place, navigate to saved places, and see that place.
- Open place details, inspect map handoff, dismiss with Escape.
- Search with no results and clear filters.
- Preparation nationality and completed-check state survived reload. Test nationality/check completion was subsequently cleared.
- Payment guide expansion showed setup steps.
- Reduced-motion preference emulated; media query matched. Styles explicitly disable animation/transitions under that preference. No vestibular user study performed.
- Dialog Tab focus remained inside the native modal, and Escape closed it. This is a targeted keyboard check, not a complete accessibility audit.
- Export triggered a download named `shanghai-itinerary.txt`.
- Home hero and all three initial card images successfully decoded.
- Built app loaded bundled assets and `/api/status` returned `aiConfigured: false`. Fresh built-app console had no errors or warnings.
- Built-app planner displayed a simulated 503 error, then successfully generated through the explicit curated fallback. A ¥100 trip budget produced an over-budget warning.

Screenshots (local, git-ignored): `output/playwright/desktop-final.png`, `output/playwright/mobile-planner.png`.

## NOT VERIFIED / remaining release work

- Live OpenAI call, account permissions, provider costs and model availability: not exercised; no API key configured. Provider contract is covered with mocks only.
- Staging/production deployment, public endpoint hardening and real network/device coverage: not performed. Serving the production build locally is not production verification.
- Every venue’s address, opening hours, live admission price, booking availability and exact transfer route: not fully verified. Museum operator hours were directly reviewed; other cards show explicit recheck prompts.
- Entry eligibility is deliberately not determined. Source review dates do not guarantee policy validity for a future trip.
- Full accessibility audit, screen reader testing and measured performance budget: not performed.
- Full image provenance/public-release rights review: not complete; see PHOTO-CREDITS.md.
