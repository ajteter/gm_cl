# WebView 中 Leaderboard Session Error 问题分析与修复方案

## 1. 问题现象
用户在移动端 WebView（例如微信内置浏览器、App 内嵌 WebView 或第三方浏览器）中游玩游戏。当游玩结束，在排行榜输入框中输入姓名并点击“保存”时，前端页面弹出 `leaderboard.sessionError` 的错误提示，分数提交失败。

## 2. 问题根本原因分析
根据后端 `/api/leaderboard` 的报错定义，这个错误对应 403 状态码。发生该错误的根本原因是：**前端在组件挂载时通过 GET 请求获取的 `game-token` 过期了，或者未能随时长随新时间戳一起更新**。
具体可以分为以下几个关键的机制冲突：

### 2.1 WebView 强缓存了 Token GET 请求（最主要的原因）
在移动端的 WebView 中，为了节省流量和加快页面加载速度，默认对不携带强防缓存 Header 的普通 HTTP GET 请求进行激进的缓存。
- **现象**：当玩家第一次打开游戏页面时，执行了 `fetch('/api/game-token')`，后端返回了签名 Token 和当时的时间戳 `ts`。当玩家刷新页面、离开页面重进时，WebView **没有重新向服务器请求**，而是直接从本地缓存拿到了很久以前的 `ts`。
- **后果**：后端在验证时，判断 `Date.now() - ts` > 最大限制，直接判定为 Token 已过期（Game session expired）。

### 2.2 最大有效时间 (MAX_TOKEN_AGE_MS) 设定过短
目前后端的代码中定义了：`const MAX_TOKEN_AGE_MS = 600000; // 10分钟`
- **现象**：如果玩家保持页面一直打开，越挫越勇玩了 15 分钟才打破最高记录并提交。此时距离他刚刚打开页面（即前端获取 Token 的时刻）已经过去了 15 分钟。
- **后果**：即便他没有刷新页面，由于这局总时长超过了 10 分钟，提交依然会被拦截。对于容易无限重开的 Flappy Bird 来说，这是极不合理的设计。

### 2.3 最小存活时间 (MIN_PLAY_TIME_MS) 设定误杀
目前后端防刷代码中设置了：`const MIN_PLAY_TIME_MS = 3000; // 3秒`
- **现象**：Flappy Bird 是极易“秒死”的游戏。如果在排行榜极为空旷时，玩家 1～2 秒内就撞柱子得了低分，这时候依然有资格进前十。
- **后果**：因为后端要求 `Date.now() - ts` 必须 >= 3秒，秒死玩家如果立即提交，会由于存活时间过短触发 `Game session too short`，这同样映射成了 session 异常的错误提示，造成误伤。

---

## 3. 修复方案 (实施计划)

我们要打出一套“组合拳”，同时修改前后端逻辑，以兼容真实的玩家行为模式：

### 3.1 方案 A：切断 WebView 缓存链（前端 + 服务端设定）
必须让浏览器和 CDN 明白，该接口返回的 Token 具有强时效性，一律不准缓存。

**修改文件 1**：`static-site/functions/api/game-token.js`
- 目的：下发强防缓存的 Header。
- 代码变更：
```javascript
export async function onRequestGet(context) {
  // ... 其他逻辑 ...
  return new Response(JSON.stringify({ ts, token }), {
    headers: {
      ...CORS,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
    },
  })
}
```

**修改文件 2**：`static-site/src/components/GameClientUI.jsx`
- 目的：前端 Fetch 明确拒绝接受 cache 响应。
- 代码变更：
```javascript
  useEffect(() => {
    fetch('/api/game-token', { cache: 'no-store' }) // <-- 新增 cache: no-store
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setGameToken(data) })
      // ...
  }, [])
```

### 3.2 方案 B：拉长游戏窗口，放宽时长死锁
由于系统已经引入了**核心防刷机制**（IP 每分钟限速 5 次 + 每个 IP 只记录一次最高分进行去重），因此不需要对 Token 这个前置校验执行如此严苛的 10 分钟死亡倒计时。Token 现在唯一需要证明的就是：“我是借由页面加载生成的合法游玩客户端请求”。

**修改文件 3**：`static-site/functions/api/leaderboard.js`
- 目的：修改门槛限制。
- 代码变更：
```javascript
// 修改前
const MIN_PLAY_TIME_MS = 3000;      // 3 秒
const MAX_TOKEN_AGE_MS = 600000;     // 10 分钟

// 修改后
const MIN_PLAY_TIME_MS = 1000;       // 更宽容的 1 秒，防极端全机器发包行为即可
const MAX_TOKEN_AGE_MS = 86400000;   // 24 小时 (允许玩家将页面挂手机后台，好几个小时后再回来玩也能正常提交)
```

## 4. 预期修复收益
执行上述三处修改并重新部署后将实现：
1. 完美解决各种安卓、iOS 设备，微信、Safari 等各类 WebView 中诡异的 Token 过期错误。
2. 玩家连续游玩超过 10 分钟、甚至几小时后的高分终于可以顺利入库。
3. 不再误拒刚开启游戏由于失误“一秒挂掉”进入榜单的早鸟玩家。
