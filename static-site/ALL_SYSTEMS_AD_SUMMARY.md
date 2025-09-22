# 所有系统广告配置汇总

## Game2 系统 Adcash 清理状态

✅ **Game2 系统中的 Adcash 代码已完全清理**

已清理的文件：
- `src/components/GameClientUI2.jsx` - 移除 AdcashAd 导入和引用
- `src/pages/Play2Page.jsx` - 替换为 MagSrvIframeAd
- `src/components/GameList2.jsx` - 替换为 MagSrvIframeAd
- `src/pages/Game2Page.jsx` - 添加 MagSrv 配置

剩余的 AdcashAd 引用仅在：
- `src/components/AdcashAd.jsx` - 组件本身（保留用于测试）
- `src/pages/AdTestPage.jsx` - 测试页面
- 文档文件中的历史记录

---

## Game1 系统广告配置

### 广告网络：highperformanceformat.com

#### 1. 游戏列表页面 (`/` 主页)
- **文件**: `src/components/GameList.jsx`
- **广告ID**: `9adddfc2b9f962e7595071bcbd5cc4e5`
- **尺寸**: 320x50 像素
- **脚本**: `//www.highperformanceformat.com/9adddfc2b9f962e7595071bcbd5cc4e5/invoke.js`
- **位置**: 第一个游戏卡片后

#### 2. 随机游戏页面 (`/game/random`)
- **文件**: `src/components/GameClientUI.jsx` (默认配置)
- **广告ID**: `268fd9be7cb5acbc21f157c5611ba04f`
- **尺寸**: 300x250 像素
- **脚本**: `//www.highperformanceformat.com/268fd9be7cb5acbc21f157c5611ba04f/invoke.js`
- **位置**: 游戏下方

#### 3. 游戏播放页面 (`/game/play`)
- **文件**: `src/pages/PlayPage.jsx`
- **广告ID**: `268fd9be7cb5acbc21f157c5611ba04f`
- **尺寸**: 300x250 像素
- **脚本**: `//www.highperformanceformat.com/268fd9be7cb5acbc21f157c5611ba04f/invoke.js`
- **位置**: 游戏下方

#### 4. 游戏详情页面 (`/game?id=...`)
- **文件**: `src/pages/GamePage.jsx`
- **广告ID**: `9adddfc2b9f962e7595071bcbd5cc4e5`
- **尺寸**: 320x50 像素
- **脚本**: `//www.highperformanceformat.com/9adddfc2b9f962e7595071bcbd5cc4e5/invoke.js`
- **位置**: 游戏下方

---

## Game2 系统广告配置

### 广告网络：MagSrv (a.magsrv.com)

#### 1. 游戏列表页面 (`/game2` 主页)
- **文件**: `src/components/GameList2.jsx`
- **Zone ID**: `5729202`
- **尺寸**: 300x250 像素
- **URL**: `//a.magsrv.com/iframe.php?idzone=5729202&size=300x250`
- **位置**: 第一个游戏卡片后

#### 2. 随机游戏页面 (`/game2/random`)
- **文件**: `src/pages/RandomGame2Page.jsx` → `src/components/GameClientUI2.jsx`
- **Zone ID**: `5729198`
- **尺寸**: 300x50 像素
- **URL**: `//a.magsrv.com/iframe.php?idzone=5729198&size=300x50`
- **位置**: 游戏下方

#### 3. 游戏播放页面 (`/game2/play`)
- **文件**: `src/pages/Play2Page.jsx`
- **Zone ID**: `5729198`
- **尺寸**: 300x50 像素
- **URL**: `//a.magsrv.com/iframe.php?idzone=5729198&size=300x50`
- **位置**: 游戏下方

#### 4. 游戏详情页面 (`/game2/game?id=...`)
- **文件**: `src/pages/Game2Page.jsx` → `src/components/GameClientUI2.jsx`
- **Zone ID**: `5729202`
- **尺寸**: 300x250 像素
- **URL**: `//a.magsrv.com/iframe.php?idzone=5729202&size=300x250`
- **位置**: 游戏下方

---

## Game3 系统广告配置

### 广告网络：占位符配置（未完全配置）

#### 1. 游戏列表页面 (`/game3` 主页)
- **文件**: `src/components/GameList3.jsx`
- **广告ID**: `GAME3_LIST_AD_KEY_PLACEHOLDER` ⚠️ 需要配置
- **尺寸**: 300x250 像素
- **脚本**: `//GAME3_LIST_AD_SCRIPT_URL_PLACEHOLDER/invoke.js` ⚠️ 需要配置
- **位置**: 第一个游戏卡片后

#### 2. 随机游戏页面 (`/game3/random`)
- **文件**: `src/components/GameClientUI3.jsx` (默认配置)
- **广告ID**: `GAME3_DEFAULT_AD_KEY_PLACEHOLDER` ⚠️ 需要配置
- **尺寸**: 320x50 像素
- **脚本**: `//GAME3_DEFAULT_AD_SCRIPT_URL_PLACEHOLDER/invoke.js` ⚠️ 需要配置
- **位置**: 游戏下方

#### 3. 游戏播放页面 (`/game3/play`)
- **文件**: `src/pages/Play3Page.jsx`
- **状态**: 无广告配置 ⚠️ 需要添加

#### 4. 游戏详情页面 (`/game3/game?id=...`)
- **文件**: `src/pages/Game3Page.jsx`
- **状态**: 无广告配置 ⚠️ 需要添加

---

## 广告配置对比表

| 系统 | 页面类型 | 广告网络 | ID/Zone | 尺寸 | 实现方式 |
|------|----------|----------|---------|------|----------|
| **Game1** | 列表页 | highperformanceformat | 268fd9be7cb5acbc21f157c5611ba04f | 300x250 | iframe + srcDoc |
| **Game1** | 随机/播放 | highperformanceformat | 9adddfc2b9f962e7595071bcbd5cc4e5 | 320x50 | iframe + srcDoc |
| **Game1** | 详情页 | highperformanceformat | 268fd9be7cb5acbc21f157c5611ba04f | 300x250 | iframe + srcDoc |
| **Game2** | 列表页 | MagSrv | 5729202 | 300x250 | MagSrvIframeAd |
| **Game2** | 随机/播放 | MagSrv | 5729198 | 300x50 | MagSrvIframeAd |
| **Game2** | 详情页 | MagSrv | 5729202 | 300x250 | MagSrvIframeAd |
| **Game3** | 所有页面 | 未配置 | 占位符 | 各种 | ⚠️ 需要配置 |

---

## 技术实现方式

### Game1 系统
- **方式**: iframe + srcDoc
- **特点**: 内嵌 HTML 文档，包含广告脚本
- **优势**: 完全隔离，安全性高
- **延迟**: 1000ms (随机页面)，0ms (其他页面)

### Game2 系统
- **方式**: MagSrvIframeAd 组件
- **特点**: 直接 iframe 到 MagSrv 服务器
- **优势**: 简单直接，无脚本冲突
- **延迟**: 无延迟

### Game3 系统
- **方式**: 与 Game1 相同的 iframe + srcDoc
- **状态**: ⚠️ 占位符配置，需要实际广告 ID

---

## 测试页面

- **Game1 测试**: 访问 `/`, `/game/random`, `/game/play`
- **Game2 测试**: 访问 `/game2`, `/game2/random`, `/game2/play`
- **Game3 测试**: 访问 `/game3`, `/game3/random`, `/game3/play` (⚠️ 显示占位符)
- **MagSrv 测试**: 访问 `/magsrv-test`
- **Adcash 测试**: 访问 `/ad-test`

---

## 总结

✅ **Game1**: 完全配置，使用 highperformanceformat.com
✅ **Game2**: 完全配置，使用 MagSrv，已清理所有 Adcash 代码
⚠️ **Game3**: 部分配置，需要提供实际广告 ID 和脚本 URL

Game2 系统已完全从 Adcash 迁移到 MagSrv，所有相关的 Adcash 代码已清理完毕。