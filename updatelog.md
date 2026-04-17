# Update Log

## 2026-04-17

### 今日完成

- 整理并落地了项目的轻量版 SEO / GEO 优化方向，新增中文文档 [SEO_GEO_OPTIMIZATION_PLAN.md](/Users/huxiao/Public/GitHub/gm_cl/SEO_GEO_OPTIMIZATION_PLAN.md)，明确本轮优化以“不改路由、不破坏交互、不增加明显运行时负担”为前提。
- 将 `skills/` 加入根目录 `.gitignore`，避免本地 skill 目录进入版本控制。见 [.gitignore](/Users/huxiao/Public/GitHub/gm_cl/.gitignore)。

### Floppy Bird 与排行榜体验

- 在游戏结束后的排行榜弹层中，将“您的分数”和“全球前十”两行上下顺序调换，优先展示玩家分数。见 [LeaderboardSystem.jsx](/Users/huxiao/Public/GitHub/gm_cl/static-site/src/components/LeaderboardSystem.jsx)。
- 在“再玩一次”按钮上方新增了邀请分享按钮，点击后可复制邀请文案，引导好友一起挑战全球排行榜。见 [LeaderboardSystem.jsx](/Users/huxiao/Public/GitHub/gm_cl/static-site/src/components/LeaderboardSystem.jsx)。
- 分享按钮与复制成功 / 失败提示已接入 i18n，并补齐到所有 locale 文件。
- 当前英文复制文案为：

```text
I scored {score} in Floppy Bird! 🐦
Only Top 10 make the global leaderboard. Can you beat me?
👉 flybird.site
```

### LCP 与首屏资源优化

- 为 Floppy Bird 首屏和分数面板相关图片增加了预加载，覆盖：
  - `assets/sky.png`
  - `assets/bird.png`
  - `assets/splash.png`
  - `assets/scoreboard.png`
  - `assets/font_big_0.png`
  见 [static-site/public/games/floppybird/index.html](/Users/huxiao/Public/GitHub/gm_cl/static-site/public/games/floppybird/index.html)。
- 缩短了 Floppy Bird 的开场 splash 和结算 scoreboard / replay 动画时间，以减少用户感知等待并帮助 LCP 更早稳定。见 [static-site/public/games/floppybird/js/main.js](/Users/huxiao/Public/GitHub/gm_cl/static-site/public/games/floppybird/js/main.js)。

### SEO / GEO P0 与 P1

- 将 [static-site/src/components/Layout.jsx](/Users/huxiao/Public/GitHub/gm_cl/static-site/src/components/Layout.jsx) 中分散的 SEO 逻辑清空为纯包装组件，避免与 hook 层重复写入 head。
- 在 [static-site/src/utils/seoUtils.js](/Users/huxiao/Public/GitHub/gm_cl/static-site/src/utils/seoUtils.js) 中完成以下修正：
  - 统一生产域名为 `https://flybird.site`
  - 支持 `robots` 写入
  - 统一 canonical 生成逻辑
  - 修正游戏页 canonical 为真实存在的 `/game?id=...`
  - 修正 `Game` JSON-LD 的 URL，不再指向不存在的 `/game/{namespace}`
  - 移除无效的 `SearchAction`
  - 新增 `CollectionPage`、`ItemList`、`WebPage`、`BreadcrumbList` 相关 schema 生成逻辑
  - 处理 `og:image` / `twitter:image` 在 SPA 路由切换时的残留问题
- 在 [static-site/src/hooks/useSEO.js](/Users/huxiao/Public/GitHub/gm_cl/static-site/src/hooks/useSEO.js) 中完成以下改动：
  - 增加可启停的单页 SEO hook 能力
  - 新增列表页 `useCollectionSEO`
  - 为首页、列表页、随机页、隐私页、404 页补充更准确的 metadata 和结构化数据
  - 将 `/game/play` 标记为 `noindex, follow`
  - 将首页 canonical 收敛到 `/floppybird`
- 修复了 [static-site/src/pages/GamePage.jsx](/Users/huxiao/Public/GitHub/gm_cl/static-site/src/pages/GamePage.jsx) 中详情页 SEO 与列表页 SEO 同时生效、互相覆盖的问题。
- 在 [static-site/src/components/GameCard.jsx](/Users/huxiao/Public/GitHub/gm_cl/static-site/src/components/GameCard.jsx) 中把游戏标题改为可点击内链，指向 `/game?id=...`，增强可抓取的内部链接，同时保留原有“开始游戏”行为不变。
- 调整了首页默认 SEO 头信息，补齐 canonical、`og:url`、`og:site_name`、Twitter Card，并将 `author` 改为 `flybird.site`。见 [static-site/index.html](/Users/huxiao/Public/GitHub/gm_cl/static-site/index.html)。
- 修复了 [static-site/public/robots.txt](/Users/huxiao/Public/GitHub/gm_cl/static-site/public/robots.txt) 与 [static-site/public/sitemap.xml](/Users/huxiao/Public/GitHub/gm_cl/static-site/public/sitemap.xml) 中的占位域名问题，并补充 `Disallow: /api/`。
- `sitemap.xml` 已按当前稳定路由更新为：
  - `/`
  - `/floppybird`
  - `/game`
  - `/game/random`
  - `/privacy-policy`
  同时将首页发现入口 `/` 与主 canonical 入口 `/floppybird` 的优先级做了区分。

### 其他顺手清理

- 删除了 [static-site/src/pages/HomePage.jsx](/Users/huxiao/Public/GitHub/gm_cl/static-site/src/pages/HomePage.jsx) 和 [static-site/src/pages/GamePage.jsx](/Users/huxiao/Public/GitHub/gm_cl/static-site/src/pages/GamePage.jsx) 中未使用的广告配置常量，避免无效代码残留。

### 验证情况

- 已执行 `npm run build`，位于 `static-site/`，构建通过。
- 全仓 `npm run lint` 未完全通过，但当前失败项主要来自既有脚本、第三方文件和旧组件问题，不是今天这批改动新增的阻塞项。

### 备注

- 今日工作区内还存在用户或历史改动，例如各语言 locale 文件、LCP 优化文件、`.DS_Store` 等；本日志只记录今天确认完成并保留的功能性改动。
