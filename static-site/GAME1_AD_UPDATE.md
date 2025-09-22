# Game1 系统广告更新

## 更新概述
根据要求更新 Game1 系统（/game 路径）的所有广告配置，使用新的广告代码和尺寸。

## 更改详情

### 1. /game/random 和 /game/play 页面广告更新

**更新的文件**:
- `src/components/GameClientUI.jsx` - 默认广告配置
- `src/pages/PlayPage.jsx` - 直接广告配置

**新广告配置**:
```javascript
{
  key: '268fd9be7cb5acbc21f157c5611ba04f',
  format: 'iframe',
  height: 250,
  width: 300,
  script: '//www.highperformanceformat.com/268fd9be7cb5acbc21f157c5611ba04f/invoke.js'
}
```

**页面路径**:
- `/game/random` - 每日随机游戏页面
- `/game/play` - 直接游戏播放页面

### 2. /game 游戏列表页面广告更新

**更新的文件**:
- `src/components/GameList.jsx` - 游戏列表中的广告
- `src/pages/GamePage.jsx` - 游戏详情页面的广告配置

**新广告配置**:
```javascript
{
  key: '9adddfc2b9f962e7595071bcbd5cc4e5',
  format: 'iframe',
  height: 50,
  width: 320,
  script: '//www.highperformanceformat.com/9adddfc2b9f962e7595071bcbd5cc4e5/invoke.js'
}
```

**页面路径**:
- `/` - 主页游戏列表
- `/game` - 游戏详情页面

## 技术实现

### 广告加载方式
所有广告都使用 iframe + srcDoc 的方式加载，具有以下优势：
- **安全隔离**: 广告代码在独立的 iframe 环境中运行
- **防止冲突**: 不会与主页面的 JavaScript 产生冲突
- **沙盒保护**: 使用 sandbox 属性限制广告行为
- **样式控制**: 通过 CSS 限制广告尺寸

### 广告配置对比

| 页面类型 | 旧配置 | 新配置 |
|---------|--------|--------|
| /game/random | key: e689411a7eabfbe7f506351f1a7fc234<br>尺寸: 320x50 | key: 268fd9be7cb5acbc21f157c5611ba04f<br>尺寸: 300x250 |
| /game/play | 旧的 9adddfc2b9f962e7595071bcbd5cc4e5<br>尺寸: 728x90 | key: 268fd9be7cb5acbc21f157c5611ba04f<br>尺寸: 300x250 |
| /game 列表 | key: 268fd9be7cb5acbc21f157c5611ba04f<br>尺寸: 300x250 | key: 9adddfc2b9f962e7595071bcbd5cc4e5<br>尺寸: 320x50 |
| /game 详情 | key: 9adddfc2b9f962e7595071bcbd5cc4e5<br>尺寸: 728x90 | key: 9adddfc2b9f962e7595071bcbd5cc4e5<br>尺寸: 320x50 |

## 广告代码模板

### 300x250 广告 (用于 /game/random 和 /game/play)
```html
<script type="text/javascript">
  atOptions = {
    'key': '268fd9be7cb5acbc21f157c5611ba04f',
    'format': 'iframe',
    'height': 250,
    'width': 300,
    'params': {}
  };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/268fd9be7cb5acbc21f157c5611ba04f/invoke.js"></script>
```

### 320x50 广告 (用于 /game 列表页面)
```html
<script type="text/javascript">
  atOptions = {
    'key': '9adddfc2b9f962e7595071bcbd5cc4e5',
    'format': 'iframe',
    'height': 50,
    'width': 320,
    'params': {}
  };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/9adddfc2b9f962e7595071bcbd5cc4e5/invoke.js"></script>
```

## 测试页面

可以通过以下页面测试广告是否正常显示：

1. **主页游戏列表**: https://gm-cl.pages.dev/
   - 应显示 320x50 广告

2. **每日随机游戏**: https://gm-cl.pages.dev/game/random
   - 应显示 300x250 广告

3. **游戏播放页面**: https://gm-cl.pages.dev/game/play?url=...
   - 应显示 300x250 广告

4. **游戏详情页面**: https://gm-cl.pages.dev/game?id=...
   - 应显示 320x50 广告

## 部署状态

✅ **已完成的更新**:
- GameClientUI.jsx - 默认广告配置更新
- PlayPage.jsx - 播放页面广告更新
- GamePage.jsx - 游戏详情页面广告更新
- GameList.jsx - 游戏列表广告更新

✅ **构建状态**: 成功构建，无错误

✅ **兼容性**: 保持与现有系统的完全兼容

现在 Game1 系统的所有广告位都已更新为新的配置，可以部署到生产环境。