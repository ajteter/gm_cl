# Cloudflare Pages 部署错误修复

## 🚨 错误分析

错误信息：`/bin/sh: 1: cd: can't cd to static-site`

**原因**：GitHub 仓库中缺少 `static-site` 目录，可能的原因：
1. 目录没有推送到 GitHub
2. 目录被 .gitignore 忽略
3. 目录为空（Git 不跟踪空目录）

## 🔍 诊断步骤

### 1. 检查本地 Git 状态
```bash
git status
git ls-files | grep static-site
```

### 2. 检查 GitHub 仓库
访问 GitHub 仓库页面，确认 `static-site` 目录是否存在。

## 🛠️ 解决方案

### 方案1: 推送 static-site 目录到 GitHub

```bash
# 确保所有文件都已添加
git add .
git add static-site/

# 提交更改
git commit -m "Add static-site directory with all files"

# 推送到 GitHub
git push origin main
```

### 方案2: 强制添加 static-site 目录

如果目录被忽略，强制添加：
```bash
git add -f static-site/
git commit -m "Force add static-site directory"
git push origin main
```

### 方案3: 修改 Cloudflare Pages 构建设置

如果 `static-site` 目录确实不在 GitHub 上，修改构建设置：

#### 选项A: 设置 Root Directory
- **Root directory**: `static-site`
- **Build command**: `npm ci && npm run build`
- **Build output directory**: `dist`

#### 选项B: 使用根目录构建
- **Root directory**: `/`
- **Build command**: `npm run build`
- **Build output directory**: `static-site/dist`

确保根目录的 `package.json` 包含：
```json
{
  "scripts": {
    "build": "cd static-site && npm ci && npm run build"
  }
}
```

### 方案4: 创建 Cloudflare Pages 配置文件

在项目根目录创建 `_build.yml`：
```yaml
version: 1
build:
  commands:
    - cd static-site
    - npm ci
    - npm run build
  publish: static-site/dist
```

## 🎯 推荐的立即修复步骤

### 步骤1: 确认文件推送
```bash
# 检查当前状态
git status

# 添加所有文件
git add .

# 提交
git commit -m "Ensure all static-site files are committed"

# 推送
git push origin main
```

### 步骤2: 修改 Cloudflare Pages 设置

如果步骤1不解决问题，使用以下设置：

| 设置项 | 值 |
|--------|-----|
| **Framework preset** | None |
| **Build command** | `npm run build` |
| **Build output directory** | `static-site/dist` |
| **Root directory** | `/` |

### 步骤3: 验证根目录 package.json

确保根目录的 `package.json` 包含正确的构建脚本：
```json
{
  "name": "h5-games-portal",
  "scripts": {
    "build": "cd static-site && npm ci && npm run build",
    "dev": "cd static-site && npm run dev",
    "install": "cd static-site && npm install"
  },
  "workspaces": [
    "static-site"
  ]
}
```

## 🔄 替代构建命令

如果仍有问题，尝试这些构建命令：

### 命令1: 检查目录存在
```bash
ls -la && cd static-site && npm ci && npm run build
```

### 命令2: 创建目录（如果不存在）
```bash
mkdir -p static-site && cd static-site && npm ci && npm run build
```

### 命令3: 使用绝对路径
```bash
npm --prefix ./static-site ci && npm --prefix ./static-site run build
```

## 🧪 测试构建

在推送前，本地测试构建：
```bash
# 模拟 Cloudflare Pages 构建
rm -rf static-site/node_modules static-site/dist
cd static-site && npm ci && npm run build
```

## 📋 检查清单

- [ ] `static-site` 目录存在于 GitHub 仓库
- [ ] `static-site/package.json` 存在
- [ ] `static-site/vite.config.js` 存在
- [ ] 根目录 `package.json` 包含构建脚本
- [ ] 所有文件都已推送到 GitHub
- [ ] Cloudflare Pages 设置正确

## 🚀 最终推荐设置

基于当前项目结构，推荐使用：

```yaml
Framework preset: None
Build command: npm run build
Build output directory: static-site/dist
Root directory: /
Node.js version: 18
```

这样可以避免路径问题，并使用根目录的 npm scripts 来处理构建。