# Floppy Bird 更新日志

---

## 2026-03-24：Floppybird 底部广告替换为原生广告

本次更新将 Floppy Bird 页面底部的 Adsterra 300x250 大横幅广告替换为 Monetag 原生广告，以测试原生广告的收益表现。原有的大横幅广告代码完整保留，未删除。

### 1. GameClientUI.jsx：新增 `nativeAdConfig` prop

为通用游戏组件增加了原生广告的支持能力，通过条件渲染实现广告类型切换。

*   **新增 prop**: `nativeAdConfig`，包含 `scriptSrc`（广告脚本地址）和 `containerId`（广告容器 ID）。
*   **条件渲染逻辑**:
    *   当传入 `nativeAdConfig` 时：底部广告位渲染原生广告脚本和容器。
    *   当未传入时（默认）：继续渲染原有的 Adsterra 300x250 大横幅广告。
*   **影响范围**: 仅 Floppy Bird 页面传入了该 prop，其他所有游戏页面不受影响。

### 2. HomePage.jsx：传入原生广告配置

在 Floppy Bird 的专属页面组件中，配置并传入原生广告参数。

*   **广告脚本**: `https://pl28930965.profitablecpmratenetwork.com/94dce533c4905a36ce0e031ab154baca/invoke.js`
*   **容器 ID**: `container-94dce533c4905a36ce0e031ab154baca`
*   **传入方式**: 通过 `nativeAdConfig` prop 传递给 `GameClientUI` 组件。

### 涉及文件

| 文件 | 改动类型 |
|------|----------|
| `src/components/GameClientUI.jsx` | 新增 `nativeAdConfig` prop，条件渲染广告 |
| `src/pages/HomePage.jsx` | 传入原生广告配置 |

---

## 2026-03-11：游戏复活体验优化

本次更新专注于优化 Floppy Bird 的 "Watch Ad to Revive" (看广告复活) 的核心交互流程，解决了复活后游戏突然开始导致玩家猝死的问题，并增强了无敌时间的体验。

### 1. GameClientUI.jsx：广告加载兜底策略优化

针对用户点击 "Watch Ad" 后，可能由于网络或填充率原因导致 Monetag 广告未弹出的情况，我们优化了"免费复活"的兜底时间。

*   **修改内容**: 将"短定时器"（用于检测浏览器是否失去焦点，以此判断全屏广告是否出现）的超时时间从 **3000ms (3秒)** 延长到了 **6000ms (6秒)**。
*   **优化目的**:
    *   给广告 SDK 更多的网络请求和加载缓冲时间，防止因弱网导致的误判和过早免费复活。
    *   在 6 秒内如果没有广告弹出，系统依然会执行 `executeRevive()` 给予玩家免费复活的机会，避免游戏死锁。

### 2. main.js：复活交互时序与状态优化

解决了玩家在复活后（无论是看完广告还是免费复活），游戏主循环立刻启动，导致玩家反应不及再次死亡的核心痛点。

#### 2.1 引入 `ReviveScreen` 待命状态
*   **修改前**: 收到 `EXECUTE_REVIVE` `postMessage` 指令后，直接调用 `setInterval(gameloop, ...)` 启动游戏，小鸟瞬间下坠。
*   **修改后**: 收到 `EXECUTE_REVIVE` 指令后：
    1.  重置小鸟位置、速度和角度。
    2.  移除前方的两根管子（给予缓冲空间）。
    3.  **核心变化**：将游戏状态切换为 `states.ReviveScreen`，并且重新显示 `#splash` 提示图 (即最初的 "Tap to start" 画面)。
    4.  **游戏主循环此时不会启动**，整个画面保持静止，等待玩家准备就绪。

#### 2.2 强化 5 秒无敌时间 (Invincibility)
*   **触发时机**: 只有当玩家在 `ReviveScreen` 状态下**主动点击屏幕**触发 `resumeGame()` 时，游戏主循环才真正启动。
*   **时间调整**: 在 `resumeGame()` 启动时，同时开启无敌状态 (`isInvincible = true` 并添加 CSS class `invincible`)，并将无敌持续时间设定为 **5000ms (5秒)**。
*   **优化目的**: 5 秒的无敌时间加上"点击才开始"的机制，给了玩家充分的时间重新找回节奏，极大地提升了复活后的留存体验。
