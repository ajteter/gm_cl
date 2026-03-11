# Monetag Vignette 广告时序重构方案

## 1. 背景与问题描述

在当前的 Floppy Bird "Watch Ad to Revive" (看广告复活) 功能实现中，我们观察到了一个严重的**时序错位**现象：

**现象描述：**
1. 用户在游戏中死亡，弹出我们自定义的 React 复活弹窗 (`ReviveAdModal`)。
2. 用户点击 "Watch Ad to Revive"。
3. **错误结果**：小鸟立刻在游戏中复活，但**并没有立刻显示广告**。
4. **后续异常**：当小鸟再次死亡，或者用户在复活后点击屏幕时，Monetag 的白色全屏/插屏广告（Vignette）才突然弹出来。

## 2. 根本原因分析 (Root Cause)

这个问题源于 Monetag Vignette 广告 SDK 的设计机制以及我们错误的调用时机。

### 2.1 Monetag Vignette 的工作原理
Vignette（插屏/前贴片）广告的初衷是**“拦截用户的下一次物理交互（如点击或页面跳转）”**。
它不是一个可以通过 `showAd()` 这样的直接 API 调用的弹窗。它的工作流程是：
1.  加载 `vignette.min.js` 脚本。
2.  脚本初始化并在全局或特定元素上注册事件监听器（劫持点击）。
3.  等待用户的**第一次物理点击**。一旦捕获到点击，它会阻止默认行为（如果可能的话），并弹出一个全屏的 iframe 广告层。

### 2.2 我们当前实现的错误时序
目前 `GameClientUI.jsx` 中的 `handleWatchAd` 逻辑是并行的，导致了完美的错过：

```javascript
// 现有的错误逻辑
const handleWatchAd = () => {
  setIsReviveModalOpen(false);

  // 1. 动态注入脚本（此时才开始下载和初始化）
  if (!document.querySelector('script[src="https://gizokraijaw.net/vignette.min.js"]')) {
    // ... 插入 script 标签 ...
  }

  // 2. 几乎在同一毫秒，向游戏发送复活指令
  iframeRef.current.contentWindow.postMessage({ type: 'EXECUTE_REVIVE' }, '*');
};
```

**发生了什么？**
当用户点击 "Watch Ad" 时，这正是 Monetag 需要的那个“物理点击”。但是！在这一瞬间，Monetag 的脚本**根本还没加载完，也没有初始化监听器**。
所以这次点击“白白浪费”了。
同时，代码立刻执行了 `EXECUTE_REVIVE`，游戏复活了。
等几百毫秒后，脚本加载完毕，它开始潜伏等待下一次点击。这就解释了为什么只有在复活后再次死亡（产生点击）时，广告才会弹出来。

## 3. 解决方案：基于焦点探测的延迟复活架构

既然我们无法改变 Monetag 的“被动拦截”特性，也没有官方的回调 API 告诉我们广告何时关闭，我们需要转换思路，采用**“预加载 + 焦点探测 (Focus Detection)”**的策略。

### 3.1 预加载广告脚本
我们不能等死亡了才加载。必须在 `GameClientUI` 组件挂载时尽早加载 `vignette.min.js`。这样当用户点击 "Watch Ad" 时，脚本已经处于监听状态。

### 3.2 分离“触发点击”与“执行复活”
用户的点击动作，其唯一目的是**触发 Monetag 的拦截器**，而不是立刻复活游戏。
我们需要引入一个状态机（例如 `isWaitingForAdToClose`）。

当点击 "Watch Ad" 时：
1.  React 弹窗关闭。
2.  标记状态：`isWaitingForAdToClose = true`。
3.  **绝对不发送 `EXECUTE_REVIVE` 指令。**

由于预加载了脚本，这次真实的物理点击大概率会被 Monetag 拦截，从而弹出一个覆盖全屏的 iframe 广告（这通常会导致我们的主窗口/React应用**失去焦点 `blur`**）。

### 3.3 焦点恢复 (Focus) 作为“广告结束”的回调
如果 Monetag 弹出了全屏广告，当用户看完并点击右上角的 "X" 关闭它时，由于那个广告层的 DOM 被移除，浏览器的**焦点 (Focus) 会自动回到我们的主窗口 (`window`) 上**。

这是我们唯一的突破口：
1.  在 `GameClientUI` 中全局监听 `window.addEventListener('focus', ...)`。
2.  当 `focus` 事件触发时，检查状态：如果 `isWaitingForAdToClose === true`，说明我们刚刚经历了一次广告展示并成功关闭了它！
3.  **此时才是真正发送复活指令的正确时机。** 发送指令后，重置该状态。

## 4. 实施步骤

我们将修改 `static-site/src/components/GameClientUI.jsx`：

1.  **添加状态变量**：`const [isWaitingForAdToClose, setIsWaitingForAdToClose] = useState(false)` 和对应的 `useRef` 用于在事件监听器中获取最新值。
2.  **修改 `useEffect` 进行预加载**：在组件初始挂载时（如果页面不需要其他逻辑阻挡），提前注入 `vignette.min.js`，而不是在 `handleWatchAd` 中注入。
3.  **重写 `handleWatchAd`**：移除 `postMessage` 复活逻辑，只保留关闭弹窗和设置等待标志。
4.  **添加全局 Focus/Blur 监听器**：
    *   当 `blur` 发生时（广告可能弹出了），我们可以记录一下。
    *   当 `focus` 发生时，如果处于等待状态，执行真正的 `postMessage` 并清理状态。

通过这种架构重构，我们将原本并行的冲突过程，串行化为：
**预置陷阱 -> 用户点击触发拦截 -> 页面失焦展示广告 -> 页面重获焦点 -> 执行复活。**
这能彻底解决复活时序错位的问题。