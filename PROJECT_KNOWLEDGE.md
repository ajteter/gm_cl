# 项目核心知识库 (Project Knowledge Base)

本文档记录了 **gm_cl (H5 Games Portal)** 项目的核心架构、关键配置、业务逻辑及日常运维指令，用于快速同步项目状态。

---

## 1. 项目概览

*   **定位**: 针对 Cloudflare Pages 优化的静态 H5 游戏门户。
*   **目标**: 极致加载速度 (TTFB)、零成本运行 (完全静态化)、高性能 SEO。
*   **部署**: Cloudflare Pages。

## 2. 技术栈架构

| 维度 | 技术选型 | 关键说明 |
| :--- | :--- | :--- |
| **框架** | React 19 | Client Component 模式 |
| **构建** | Vite 5 | 快速 H5 静态资源打包 |
| **路由** | React Router 7 | 支持代码分割的 SPA 路由 |
| **数据源** | Static JSON | 存储于 `public/games.json` |
| **监控** | 自研 Utils | FP, FCP, LCP 等 Web Vitals 数据采集 |

## 3. 核心目录结构

```text
.
├── static-site/            # 前端项目主目录
│   ├── public/             # 静态资源 (games.json, robots.txt)
│   ├── src/
│   │   ├── components/     # UI 组件 (广告、列表、游戏卡片)
│   │   ├── pages/          # 路由页面 (Home, Game, Random, Play)
│   │   ├── utils/          # SEO、性能监控工具
│   │   └── App.jsx         # 路由配置入口
│   └── scripts/            # 部署与验证脚本
├── GEMINI.md               # 详细优化与调试纪录
└── PROJECT_KNOWLEDGE.md    # [当前文档]
```

## 4. 路由与重定向逻辑 (`App.jsx`)

*   **`/`**: 首页。
*   **`/game`**: 列表页。
*   **`/game/random`**: 随机跳转。
*   **`/game/play`**: 游戏播放容器。
*   **`/privacy-policy`**: 隐私政策。
*   **`/ad-test` / `/magsrv-test`**: 调试页面。
*   **重定向**: 
    - `/source/:sourceName` → `/game`
    - `/game2/*`, `/game3/*` → `/game`

## 5. 流量归因 (UTM)

`GameClientUI.js` 会捕获当前 URL 参数并透传给游戏 Iframe 的 `src` URL，确保广告与流量归因在不同层级依然能被准确拦截。

## 6. App 内 WebView 特殊交互适配

由于这是一个主要运行在 App 内的 WebView 项目，项目中有几处专门针对由于 WebView 原生环境受限而做的交互适配：

*   **防止返回栈死锁 (History Stack 保护)**：
    *   在 `DirectGpvRedirect.jsx` 这样的跳转路由中，必须使用 `window.location.replace()` 而非 `pushState` 或 `href`。这样可以避免产生无效的历史堆栈。如果用户在跳转后的页面点击物理/手势“返回”，会直接退回到进入前的 App 页面，而不是一直在重定向。
    *   在游戏内点击“More Games”或“Back”等按钮时，通常使用绝对路径路由 `navigate('/game')` 回到列表，而不是使用 `window.history.back()`。这能防止因为历史栈混乱导致意外退出 WebView。
*   **消除 `target="_blank"` 行为**：
    *   WebView 对新窗口或多窗口的支持通常很差（需要客户端特定代码捕获）。所以，项目中的所有游戏内容均通过内嵌 `iframe` 的方式（如 `GameClientUI.jsx`）原地加载，确保用户体验保持在单一 WebView 进程内平滑流转。
*   **白屏与加载状态抹平**：
    *   使用了 React `Suspense` 以及 `isIframeLoading` 状态管理，通过 `LoadingSpinner` 或骨架屏占位。这在 WebView 加载大型 H5 资源时，可以避免原生的纯白屏闪烁，给予用户可靠的视觉缓冲。

## 7. 运维指令

执行路径：`static-site/`

| 指令 | 说明 |
| :--- | :--- |
| `npm run dev` | 本地开发 |
| `npm run build` | 构建生产资源 (`dist/`) |
| `npm run deploy:production` | 部署至 Cloudflare Pages |
| `npm run preview` | 本地预览 |

---

## 7. 核心原则

1.  **静态驱动**: 数据变更必须修改 `games.json` 并重新发布。
2.  **SEO 优先**: 每个页面需调用 `seoUtils.js` 注入头部信息。
3.  **极简主义**: 保持代码体积最小化，精简冗余组件。
