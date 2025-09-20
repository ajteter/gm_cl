# MagSrv Iframe 广告更新

## 更新概述
将 /game2/random 页面的 MagSrv 广告从脚本方式改为 iframe 方式，以提高稳定性和兼容性。

## 更改内容

### 1. 新建 MagSrvIframeAd 组件
**文件**: `src/components/MagSrvIframeAd.jsx`

- 使用 iframe 方式加载 MagSrv 广告
- 支持自定义尺寸 (width, height)
- 包含加载状态和错误处理
- 更简单、更稳定的实现

**Iframe URL 格式**:
```
//a.magsrv.com/iframe.php?idzone=5728338&size=300x50
```

### 2. 更新 GameClientUI2 组件
**文件**: `src/components/GameClientUI2.jsx`

- 导入新的 `MagSrvIframeAd` 组件
- 更新广告渲染逻辑，支持 width 和 height 配置
- 保持向后兼容性

### 3. 更新 RandomGame2Page 配置
**文件**: `src/pages/RandomGame2Page.jsx`

- 在 adConfig 中添加 width: 300, height: 50 配置
- 确保使用正确的广告尺寸

### 4. 更新测试页面
**文件**: `src/pages/MagSrvTestPage.jsx`

- 添加 iframe 版本的广告测试
- 同时保留脚本版本用于对比
- 清楚标识哪个版本用于 /game2/random

## 技术优势

### Iframe 方式的优点:
1. **更好的隔离性**: 广告内容在独立的 iframe 中运行
2. **避免 DOM 冲突**: 不会与 React 的 DOM 管理产生冲突
3. **更简单的实现**: 不需要复杂的脚本加载和 DOM 操作
4. **更好的错误处理**: iframe 加载失败不会影响主页面
5. **更好的安全性**: 广告代码与主页面隔离

### 脚本方式的问题:
1. **DOM 操作冲突**: 可能与 React 的虚拟 DOM 产生冲突
2. **removeChild 错误**: 在某些情况下会出现 DOM 节点移除错误
3. **复杂的生命周期管理**: 需要处理脚本加载、初始化等多个步骤

## 配置参数

### MagSrvIframeAd 组件参数:
- `zoneId`: 广告区域 ID (默认: '5728338')
- `width`: 广告宽度 (默认: 300)
- `height`: 广告高度 (默认: 50)
- `className`: CSS 类名

### 当前 /game2/random 配置:
```javascript
adConfig={{ 
  type: 'magsrv', 
  zoneId: '5728338',
  width: 300,
  height: 50
}}
```

## 测试方法

1. **访问测试页面**: https://gm-cl.pages.dev/magsrv-test
   - 查看两种广告实现的对比
   - 检查 iframe 版本是否正常加载

2. **访问实际页面**: https://gm-cl.pages.dev/game2/random
   - 确认广告正常显示
   - 检查浏览器控制台无错误

3. **检查项目**:
   - 广告尺寸正确 (300x50)
   - 加载状态正常
   - 错误处理正常

## 部署状态
✅ 代码已更新并构建成功
✅ 新的 iframe 广告组件已创建
✅ /game2/random 页面已更新使用 iframe 方式
✅ 测试页面已更新包含两种方式的对比

现在 /game2/random 页面使用更稳定的 iframe 方式显示 MagSrv 广告，应该不会再出现 DOM 操作相关的错误。