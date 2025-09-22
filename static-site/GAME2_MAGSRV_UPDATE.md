# Game2 系统 MagSrv 广告更新

## 更新概述
将 Game2 系统的所有广告从 Adcash 更换为 MagSrv iframe 广告，使用新的 zone ID 和指定尺寸。

## 更改详情

### 1. /game2/random 和 /game2/play 页面广告更新

**更新的文件**:
- `src/pages/RandomGame2Page.jsx` - 随机游戏页面
- `src/pages/Play2Page.jsx` - 游戏播放页面

**新广告配置**:
```html
<iframe src="//a.magsrv.com/iframe.php?idzone=5729198&size=300x50" 
        width="300" height="50" scrolling="no" marginwidth="0" 
        marginheight="0" frameborder="0"></iframe>
```

**配置参数**:
- Zone ID: `5729198`
- 尺寸: 300x50 像素
- 类型: MagSrv iframe

### 2. /game2 游戏列表页面广告更新

**更新的文件**:
- `src/components/GameList2.jsx` - 游戏列表组件
- `src/pages/Game2Page.jsx` - 游戏详情页面

**新广告配置**:
```html
<iframe src="//a.magsrv.com/iframe.php?idzone=5729202&size=300x250" 
        width="300" height="250" scrolling="no" marginwidth="0" 
        marginheight="0" frameborder="0"></iframe>
```

**配置参数**:
- Zone ID: `5729202`
- 尺寸: 300x250 像素
- 类型: MagSrv iframe

## 技术实现

### 广告组件使用
所有 Game2 系统页面现在使用 `MagSrvIframeAd` 组件，该组件：
- 使用安全的 iframe 方式加载广告
- 支持自定义 zone ID 和尺寸
- 包含加载状态和错误处理
- 提供开发模式下的调试信息

### 替换对比

| 页面 | 旧配置 (Adcash) | 新配置 (MagSrv) |
|------|----------------|-----------------|
| /game2/random | AdcashAd zoneId="10422246" | MagSrvIframeAd zoneId="5729198" (300x50) |
| /game2/play | AdcashAd zoneId="10422246" | MagSrvIframeAd zoneId="5729198" (300x50) |
| /game2 列表 | AdcashAd zoneId="10422246" | MagSrvIframeAd zoneId="5729202" (300x250) |
| /game2/game | 无广告配置 | MagSrvIframeAd zoneId="5729202" (300x250) |

## 代码更改详情

### RandomGame2Page.jsx
```javascript
// 更新广告配置
adConfig={{ 
  type: 'magsrv', 
  zoneId: '5729198',  // 从 '5728338' 更新
  width: 300,
  height: 50
}}
```

### Play2Page.jsx
```javascript
// 替换导入
import MagSrvIframeAd from '../components/MagSrvIframeAd'

// 替换广告组件
<MagSrvIframeAd zoneId="5729198" width={300} height={50} />
```

### GameList2.jsx
```javascript
// 替换导入
import MagSrvIframeAd from './MagSrvIframeAd'

// 替换广告组件
<MagSrvIframeAd zoneId="5729202" width={300} height={250} />
```

### Game2Page.jsx
```javascript
// 添加广告配置
adConfig={{ 
  type: 'magsrv', 
  zoneId: '5729202',
  width: 300,
  height: 250
}}
```

## 测试页面

### 生产环境测试
1. **游戏列表页**: https://gm-cl.pages.dev/game2
   - 应显示 300x250 MagSrv 广告 (Zone: 5729202)

2. **随机游戏页**: https://gm-cl.pages.dev/game2/random
   - 应显示 300x50 MagSrv 广告 (Zone: 5729198)

3. **游戏播放页**: https://gm-cl.pages.dev/game2/play?url=...
   - 应显示 300x50 MagSrv 广告 (Zone: 5729198)

4. **游戏详情页**: https://gm-cl.pages.dev/game2/game?id=...
   - 应显示 300x250 MagSrv 广告 (Zone: 5729202)

### 测试页面
访问 https://gm-cl.pages.dev/magsrv-test 查看新的 zone ID 测试

## 优势

### MagSrv iframe 广告的优点:
1. **更好的兼容性**: iframe 方式避免了脚本冲突
2. **统一的广告网络**: 整个 Game2 系统使用同一广告网络
3. **更好的控制**: 可以精确控制广告尺寸和位置
4. **更好的性能**: iframe 加载不会阻塞主页面渲染

### 从 Adcash 迁移的好处:
1. **统一管理**: 所有 Game2 广告使用同一平台管理
2. **更好的收益**: 可能获得更好的广告收益
3. **更稳定**: MagSrv 提供更稳定的广告服务

## 部署状态

✅ **已完成的更新**:
- RandomGame2Page.jsx - 随机游戏页面广告更新
- Play2Page.jsx - 游戏播放页面广告更新  
- GameList2.jsx - 游戏列表广告更新
- Game2Page.jsx - 游戏详情页面广告添加
- MagSrvTestPage.jsx - 测试页面更新

✅ **构建状态**: 成功构建，无错误

✅ **兼容性**: 保持与现有系统的完全兼容

现在 Game2 系统已完全迁移到 MagSrv 广告网络，使用指定的 zone ID 和尺寸配置。