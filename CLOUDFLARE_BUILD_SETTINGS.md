# Cloudflare Pages 构建设置

## 🚀 Cloudflare Pages 控制台设置

### 基本设置

| 设置项 | 值 |
|--------|-----|
| **Framework preset** | None (或 Vite) |
| **Build command** | `cd static-site && npm ci && npm run build` |
| **Build output directory** | `static-site/dist` |
| **Root directory** | `/` (项目根目录) |

### 详细配置

#### 1. 构建命令 (Build command)
```bash
cd static-site && npm ci && npm run build
```

**说明**：
- `cd static-site`: 进入静态站点目录
- `npm ci`: 使用 npm ci 进行快速、可靠的依赖安装
- `npm run build`: 执行 Vite 构建

#### 2. 输出目录 (Build output directory)
```
static-site/dist
```

**说明**：
- Vite 默认将构建输出到 `dist` 目录
- 由于我们在 `static-site` 子目录中构建，完整路径是 `static-site/dist`

#### 3. 环境变量 (Environment variables)
```
NODE_VERSION=18
NPM_VERSION=latest
```

## 🔧 替代构建命令选项

### 选项1: 使用根目录的 npm scripts (推荐)
```bash
npm run build
```

这会执行根目录 `package.json` 中的脚本：
```json
{
  "scripts": {
    "build": "cd static-site && npm run build"
  }
}
```

### 选项2: 完整的构建命令
```bash
cd static-site && npm install && npm run build
```

### 选项3: 使用 yarn (如果偏好)
```bash
cd static-site && yarn install && yarn build
```

## 📁 项目结构确认

确保你的项目结构如下：
```
/
├── static-site/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   ├── public/
│   └── dist/ (构建后生成)
├── package.json (根目录)
└── README.md
```

## 🌐 域名和路由设置

### 自定义域名设置
1. 在 Cloudflare Pages 控制台中添加自定义域名
2. 确保 DNS 记录指向 Cloudflare Pages

### SPA 路由支持
项目已包含 `static-site/public/_redirects` 文件：
```
/*    /index.html   200
```

这确保所有路由都正确指向 React 应用。

## 🔒 安全和性能设置

### HTTP Headers
项目已包含 `static-site/public/_headers` 文件，包含：
- 安全头设置 (CSP, X-Frame-Options 等)
- 缓存策略
- 预连接设置

### 缓存策略
- 静态资源 (JS/CSS): 1年缓存
- HTML 文件: 5分钟缓存
- games.json: 1小时缓存

## 🚀 部署流程

### 自动部署
1. 连接 GitHub/GitLab 仓库到 Cloudflare Pages
2. 设置上述构建配置
3. 每次推送到主分支自动触发部署

### 手动部署
```bash
# 本地构建
npm run build

# 使用 Wrangler CLI 部署
npx wrangler pages deploy static-site/dist --project-name=your-project-name
```

## 🧪 预览部署

Cloudflare Pages 会为每个 PR 创建预览部署：
- 预览 URL: `https://branch-name.your-project.pages.dev`
- 可以在合并前测试更改

## 📊 构建优化

### 构建时间优化
- 使用 `npm ci` 而不是 `npm install`
- 启用 Cloudflare Pages 的构建缓存
- 考虑使用 `pnpm` 或 `yarn` 以获得更快的安装速度

### 构建输出优化
项目已配置：
- 代码分割 (Code splitting)
- 资源压缩 (Gzip/Brotli)
- 树摇优化 (Tree shaking)
- 资源哈希命名

## 🔍 故障排除

### 常见问题

1. **构建失败 - 找不到 package.json**
   - 确保构建命令包含 `cd static-site`
   - 检查根目录设置

2. **路由 404 错误**
   - 确保 `_redirects` 文件存在于 `static-site/public/` 目录
   - 检查输出目录设置

3. **静态资源加载失败**
   - 检查 `_headers` 文件配置
   - 确保资源路径正确

### 调试构建
在 Cloudflare Pages 控制台中查看：
- 构建日志
- 部署历史
- 错误信息

## 📝 完整的 Cloudflare Pages 设置清单

- [ ] Framework preset: None 或 Vite
- [ ] Build command: `cd static-site && npm ci && npm run build`
- [ ] Build output directory: `static-site/dist`
- [ ] Root directory: `/`
- [ ] Environment variables: `NODE_VERSION=18`
- [ ] 自定义域名配置 (如需要)
- [ ] 预览部署设置
- [ ] 构建缓存启用

## 🎯 推荐的最终设置

```yaml
# Cloudflare Pages 设置
Framework preset: None
Build command: cd static-site && npm ci && npm run build
Build output directory: static-site/dist
Root directory: /
Node.js version: 18
```

这个配置已经过测试，可以确保：
- ✅ 快速可靠的构建
- ✅ 正确的 SPA 路由
- ✅ 优化的缓存策略
- ✅ 安全的 HTTP 头设置
- ✅ WebView 兼容性