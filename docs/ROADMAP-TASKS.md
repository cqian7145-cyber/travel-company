# China, closer · 项目进度盘点与全量交付记录（Week 1–4 全部落地）

> 更新时间：2026-11-27  
> 线上域名：`https://china-closer.xizimist.com`  
> 创始人数据漏斗面板：`https://china-closer.xizimist.com/?analytics=1`  
> 推广与周复盘操作包：[docs/GROWTH-LAUNCH-KIT.md](GROWTH-LAUNCH-KIT.md)

---

## 一、Week 1–4 完成状态总览

| 周期 | 核心目标 | 当前状态 | 核心交付物 |
| --- | --- | :---: | --- |
| **Week 1** | 正式域名 + 北上广三城 + DeepSeek 线上激活核验 | **100% 已核验** | 线上 `/api/status` 返回 `{"aiConfigured":true,"aiProvider":"DeepSeek"}`；北上广三城规划、5 机场前 90 分钟、PWA、Sitemap、Web Analytics、GSC 全部在线返回 `200`。 |
| **Week 2** | Programmatic SEO 矩阵 + 转化埋点 + 商业化集中配置 | **100% 已完成** | 新增 `/guides` 目录及 **6 个高搜索长尾专题页**（均含预渲染 HTML + `FAQPage` JSON-LD + Sitemap + 离线缓存）；新增零 Cookie 转化漏斗埋点 `src/telemetry.ts` + Workers `/api/event`；集中化联盟配置 `shared/monetization.mjs`。 |
| **Week 3** | CTO 前端架构去债 + 路由按需分包 + 自动化死链巡检 | **100% 已完成** | **17 个零散 CSS 文件收敛为 4 层清晰架构**（`styles-core.css` / `styles-editorial.css` / `styles-cities.css` / `matcha.css`）；`src/App.tsx` 模块化拆出 `PlannerView` / `ChinaReadyView` / `GuidesView` / `FounderAnalyticsModal` 并启用 `React.lazy` 按路由代码分割；新增 `.github/workflows/freshness.yml` 每周一自动跑死链与过期巡检。 |
| **Week 4** | 完整个人离线生存包导出 + 雨天备选 AI 建议 + 增长决策包 | **100% 已完成** | 升级 `shared/offline-pack.mjs` 与行程页一键导出 **Complete Personal Survival Pack**（单文件内嵌北上广行程 + 中文地址 + DeepSeek 动线/餐饮/避坑/雨天备选 + 24 张沟通卡 + 断网排查）；上线 `/?analytics=1` 创始人转化诊断弹窗；输出 [docs/GROWTH-LAUNCH-KIT.md](GROWTH-LAUNCH-KIT.md)（含 Reddit 帖、短视频脚本与双周押注指标表）。 |

---

## 二、剩余纯人工/线下动作（仅需你本人 15 分钟完成）

1. **发布 Week 2–4 全量升级到正式环境**：
   ```powershell
   npm run cf:deploy
   ```
   发布后在 Google Search Console 重新点一次 **提交 `https://china-closer.xizimist.com/sitemap.xml`**（页面总数已从 28 扩充至 **35 个高权重落地页**）。
2. **真机 iPhone 飞行模式 3 分钟盲测**：
   用 iPhone Safari 打开 `https://china-closer.xizimist.com` → 分享 → 添加到主屏幕 → 在 `/connectivity` 点击 `Save offline kit` + 在 `/trip` 点击 `Offline HTML survival pack` → 开启飞行模式实测打开。
3. **替换真实联盟链接（5 分钟）**：
   申请 Trip.com / Airalo / Klook 联盟账号后，直接修改 [shared/monetization.mjs](../shared/monetization.mjs) 里的 URL 即可全站生效。
4. **启动冷启动分发**：
   直接复制 [docs/GROWTH-LAUNCH-KIT.md](GROWTH-LAUNCH-KIT.md) 中的 Reddit 帖与 20 秒短视频脚本发布，14 天后结合 `/?analytics=1`、Cloudflare Workers Logs (`funnel_event`) 与 GSC 曝光词执行二选一放大。
