# Navigation Fix - More Games Button

## 问题描述

在 `/game/random` 页面点击右上角的 "More Games" 按钮时，会跳转到 `/game` 路由，但该路由期望一个 `id` 查询参数来显示单个游戏。当没有 `id` 参数时，页面显示错误信息 "No game ID provided"。

## 根本原因

路由配置和导航逻辑不匹配：

- **路由配置**:
  - `/` → `HomePage` (游戏列表)
  - `/game` → `GamePage` (单个游戏页面，需要 `?id=xxx` 参数)
  - `/game/random` → `RandomGamePage` (每日随机游戏)

- **问题**: `RandomGamePage` 中的 `handleMoreGames` 函数导航到 `/game`，但该路由需要 `id` 参数

## 解决方案

修改导航目标，使 "More Games" 按钮跳转到游戏列表页面而不是单个游戏页面。

### 修改的文件

#### 1. `src/pages/RandomGamePage.jsx`

```javascript
// 修改前
const handleMoreGames = () => {
  navigate('/game')
}

// 修改后
const handleMoreGames = () => {
  navigate('/')
}
```

#### 2. `src/components/GameClientUI.jsx`

```javascript
// 修改前
const handleMoreGames = () => {
  if (onMoreGames) {
    onMoreGames()
  } else {
    navigate('/game')
  }
}

// 修改后
const handleMoreGames = () => {
  if (onMoreGames) {
    onMoreGames()
  } else {
    navigate('/')
  }
}
```

## 验证

### Game1 系统
- ✅ `/game/random` → 点击 "More Games" → `/` (游戏列表)
- ✅ `/game?id=xxx` → 点击 "More Games" → `/` (游戏列表)

### Game2 系统
- ✅ `/game2/random` → 点击 "More Games" → `/game2` (游戏列表)
- ✅ `/game2/game?id=xxx` → 点击 "More Games" → `/game2` (游戏列表)

### Game3 系统
- ✅ `/game3/random` → 点击 "More Games" → `/game3` (游戏列表)
- ✅ `/game3/game?id=xxx` → 点击 "More Games" → `/game3` (游戏列表)

## 路由架构说明

### Game1 系统
- `/` - 游戏列表 (HomePage)
- `/game?id=xxx` - 单个游戏页面 (GamePage)
- `/game/random` - 每日随机游戏 (RandomGamePage)
- `/game/play?id=xxx` - 游戏播放页面 (PlayPage)

### Game2 系统
- `/game2` - 游戏列表 (HomePage2)
- `/game2/game?id=xxx` - 单个游戏页面 (Game2Page)
- `/game2/random` - 每日随机游戏 (RandomGame2Page)
- `/game2/play?id=xxx` - 游戏播放页面 (Play2Page)

### Game3 系统
- `/game3` - 游戏列表 (HomePage3)
- `/game3/game?id=xxx` - 单个游戏页面 (Game3Page)
- `/game3/random` - 每日随机游戏 (RandomGame3Page)
- `/game3/play?id=xxx` - 游戏播放页面 (Play3Page)

## 影响范围

- ✅ 不影响现有功能
- ✅ 改善用户体验
- ✅ 修复导航错误
- ✅ 保持三个游戏系统的独立性

## 测试建议

1. 访问 `/game/random`，点击 "More Games"，应该跳转到 `/` 并显示游戏列表
2. 访问 `/game?id=xxx`，点击 "More Games"，应该跳转到 `/` 并显示游戏列表
3. 访问 `/game2/random`，点击 "More Games"，应该跳转到 `/game2` 并显示游戏列表
4. 访问 `/game3/random`，点击 "More Games"，应该跳转到 `/game3` 并显示游戏列表
