# SEO / GEO 优化结论

## 范围说明

本文档用于总结 `gm_cl` 项目当前的 SEO 与 GEO 状态，并记录一份分阶段优化计划。

这是一份规划性文档，不代表相关代码已经完成改造。

本次评估主要参考了本地 `skills/seo-geo` 技能库的方法论，重点对应以下几个能力模块：

- `technical-seo-checker`
- `meta-tags-optimizer`
- `schema-markup-generator`
- `internal-linking-optimizer`
- `geo-content-optimizer`
- `content-quality-auditor`

## 当前项目的真实状态

当前主应用是位于 `static-site/` 下的 SPA，技术栈为 React + Vite，部署在 Cloudflare Pages，并使用了 Pages Functions。

虽然项目里已经存在一些 metadata 和 JSON-LD 相关能力，但从真实状态看，当前站点还不能算“SEO-ready”。

几个关键现实判断如下：

- 站点当前更像一个面向 WebView 的游戏容器，而不是一个搜索优先的内容站。
- 已有部分 SEO 基础设施，但存在明显不一致和错误配置。
- 当前的运行时 i18n 不能等同于国际 SEO。
- 现有文档对项目 SEO 成熟度有一定高估。

## 主要发现

### 1. 抓取与索引入口不一致

当前相关文件：

- `static-site/public/robots.txt`
- `static-site/public/sitemap.xml`

问题：

- `robots.txt` 和 `sitemap.xml` 仍然使用 `https://yourdomain.com` 占位域名。
- 搜索引擎可能会收到无效的 sitemap 和域名信号。
- 这是一个 P0 级别的技术 SEO 问题。

### 2. Canonical 逻辑没有统一

相关文件：

- `static-site/src/components/Layout.jsx`
- `static-site/src/utils/seoUtils.js`

问题：

- 应用的不同部分假设了不同的 canonical 基础域名。
- canonical 生成逻辑分散在多个层级中。
- 这会增加搜索引擎接收到冲突信号的风险。

### 3. 游戏页 canonical 与真实路由不匹配

相关文件：

- `static-site/src/utils/seoUtils.js`

问题：

- 当前游戏 SEO 生成的 canonical URL 形如 `/game/{namespace}`。
- 但真实路由结构是 `/game?id=...` 和 `/game/play`。
- 搜索引擎可能会看到一些 canonical 指向并不存在的可索引页面。

### 4. 站点架构对 SEO 不够友好

相关文件：

- `static-site/src/App.jsx`
- `static-site/src/components/GameCard.jsx`
- `static-site/src/pages/HomePage.jsx`
- `static-site/src/pages/GamePage.jsx`

问题：

- 大部分导航依赖按钮点击和客户端 `navigate()`。
- 站点缺少对爬虫友好的语义化内链结构。
- 每个游戏都还没有稳定、可索引的详情页。
- 当前结构不利于主题权重积累和长尾词排名。

### 5. 页面内容深度不足，不利于 SEO 与 GEO

相关页面：

- `static-site/src/pages/HomePage.jsx`
- `static-site/src/pages/GamePage.jsx`
- `static-site/src/pages/RandomGamePage.jsx`

问题：

- 首页本质上仍然是一个全屏游戏容器。
- 大多数路由提供的文本上下文非常有限。
- 页面还没有足够多可抽取、可引用、可回答问题的内容块，不利于 AI 系统引用。

### 6. 已有结构化数据，但没有与真实页面类型完全对齐

相关文件：

- `static-site/src/utils/seoUtils.js`

问题：

- 当前已经有基础的 `WebSite` 和 `Game` JSON-LD。
- 但 `SearchAction` 指向了不存在的 `/search`。
- 结构化数据尚未与真实页面模板建立清晰映射，例如集合页、游戏详情页、FAQ 内容块等。

### 7. 当前 404 行为存在 soft-404 风险

相关文件：

- `static-site/public/_redirects`
- `static-site/src/pages/NotFoundPage.jsx`

问题：

- 未知 URL 会先回退到 `index.html`，再由前端渲染 404。
- 如果不谨慎处理，容易让爬虫对真实 404 语义产生歧义。

### 8. 当前国际化不等于国际 SEO

相关文件：

- `static-site/src/i18n/index.jsx`

问题：

- locale 内容是运行时加载的。
- 没有 locale 专属 URL。
- 没有 `hreflang` 体系。
- 没有按语言维度拆分 sitemap 的策略。

## 性能与运行时影响评估

SEO 改造并不一定会伤害运行时性能。

### 几乎没有运行时成本的低风险改动

- 修复 `robots.txt`
- 修复 `sitemap.xml`
- 清理 canonical
- 清理 meta 标签
- 明确索引策略与路由策略
- 改善内链结构

### 会带来轻微影响的改动

- 增加 JSON-LD
- 增加摘要、FAQ、表格、说明性内容
- 增加可索引的游戏详情页模板

这些改动可能会让 HTML 稍微变大，但通常成本很低，相比广告脚本和游戏 iframe 本身影响更小。

### 如果实现方式不当，可能有明显性能代价的改动

- 在运行时频繁做 DOM metadata 改写
- 引入较重的第三方营销脚本
- 在首页堆入过多动态内容
- 通过过大的前端 bundle 去做国际 SEO

结论：

如果以静态输出为主、运行时逻辑尽量少，这套 SEO 计划对性能的负面影响应该很有限，甚至可能提升抓取效率。

## 约束前提

本轮 SEO 优化以以下约束为前提：

- 不改变现有网站路由结构
- 不破坏现有页面交互与跳转逻辑
- 不引入明显额外的运行时负担
- 尽量不增加前端复杂度，不改变当前主体验路径

因此，本计划调整为“轻量 SEO 优化版”。

这意味着以下方向暂不纳入当前执行范围：

- 不新增游戏详情页路由
- 不重构现有信息架构
- 不为了 SEO 强行改成多层内容站
- 不新增依赖较重的运行时 SEO 逻辑
- 不在当前阶段推进国际 SEO 路由化

## 推荐优化策略

### P0：修复技术真相与抓取信号

目标：

在不改变现有路由和交互的前提下，先把搜索引擎看到的基础信号修正确保一致。

任务：

- 统一唯一生产域名
- 修复 `robots.txt`
- 修复 `sitemap.xml`
- 统一 canonical 生成逻辑
- 去掉指向不存在真实路由的 canonical
- 明确当前各页面的索引策略
- 处理 soft-404 策略
- 删除或修正无效的 `SearchAction`

说明：

这一层几乎都属于静态信号修复，对运行时性能影响很小，是最适合先做的一层。

### P1：在现有页面上增强 Metadata 与结构化数据

目标：

不增加新路由、不重构页面结构，只增强当前已有页面的 metadata 与 schema 表达能力。

任务：

- 按当前已有页面类型定义 metadata 规则
- 优化首页、列表页、随机页、隐私页、404 页的标题与描述
- 统一 OG 和 Twitter card 行为
- 补齐并修正适用于现有页面的结构化数据：
  - `WebSite`
  - `Organization`
  - `CollectionPage`
  - `ItemList`
  - `BreadcrumbList`
  - `Game`（仅在当前页面结构能合理承载时）

说明：

这部分主要修改头信息和 JSON-LD，不改变页面交互，对代码效率影响可控。

### P1：在现有页面中加入轻量 GEO 内容块

目标：

不改变主交互结构，只在现有页面中加入少量、静态、低成本的说明性内容，提高页面被 AI 系统理解和引用的机会。

任务：

- 在首页或列表页顶部增加简短直接回答型文案
- 增加简短摘要或站点说明
- 为重要页面补少量 FAQ
- 增加简洁的游戏说明或玩法介绍
- 增加少量结构化字段或短表格

说明：

这部分内容应控制体量，避免破坏当前页面视觉和性能模型。

### P2：保守处理国际 SEO

目标：

在不改变当前运行时 i18n 结构的前提下，避免国际 SEO 产生额外复杂度。

策略：

- 当前阶段不推进 locale 路由化
- 不引入 `hreflang` 路由体系
- 不拆分多语言 sitemap
- 默认以一个主 SEO 语言为核心进行优化
- 其他语言继续作为 UI 翻译能力保留

说明：

这样可以避免在当前阶段引入额外的路由、索引和维护成本。

### P2：增加轻量监控与验证

目标：

用最小成本验证这些 SEO 改动是否有效。

建议持续跟踪：

- sitemap 有效性
- canonical 一致性
- 结构化数据覆盖率
- 首页、列表页、随机页的收录情况
- soft-404 预警
- metadata 覆盖率

说明：

当前阶段不以复杂报表系统为目标，而是先确认基础信号是否稳定。

## 建议实施顺序

1. P0：域名、canonical、sitemap、robots、索引策略
2. 在现有页面上统一 metadata 和 schema
3. 在首页、列表页等页面加入少量 GEO 说明内容
4. 保守验证收录与结构化数据效果

## 建议在编码前先产出的规划物

在正式实施前，建议先整理以下轻量规划物：

1. 当前可索引 URL 清单
2. 现有页面类型到 metadata 的映射表
3. 现有页面类型到 schema 的映射表
4. 首页 / 列表页 / 随机页可补充的 GEO 内容清单
5. P0 / P1 / P2 执行清单

## 最终结论

这个项目已经具备承接 SEO 和 GEO 改造的基础，但目前还没有形成真正适合搜索和 AI 引用的结构。

真正的瓶颈不只是“少几个 meta 标签”，而是以下这些更底层的问题：

- 技术真相不一致
- 缺少稳定的可索引 URL 架构
- 缺少可抓取的语义化内链
- 缺少足够的内容表面供搜索引擎和 AI 系统理解与引用

在“不能影响现有路由、交互和代码效率”的前提下，正确的下一步不是重做站点结构，而是先做一版轻量、稳妥、低成本的 SEO 增强：

- 先修技术真相
- 再统一 metadata 和 schema
- 最后补少量 AI 可读内容块

这样可以在尽量不打扰现有产品结构的情况下，提升基础搜索信号和 AI 可理解性。
