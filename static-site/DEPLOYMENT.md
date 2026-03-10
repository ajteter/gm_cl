# Deployment Guide (Cloudflare Pages)

This project is optimized for **Cloudflare Pages**, featuring a purely static architecture that eliminates Worker CPU limits and request costs.

## 📋 Prerequisites

1. **Cloudflare Account**: [Sign up here](https://cloudflare.com)
2. **Wrangler CLI**: `npm install -g wrangler`
3. **Node.js**: Version 18+

## 🚀 Deployment Workflow

### 1. Build and Prepare
```bash
npm run build
```
The build output will be generated in the `dist/` directory.

### 2. Manual Deployment
```bash
# Production
npm run deploy:production

# Staging
npm run deploy:staging
```

### 3. CI/CD (GitHub Integration)
1. Connect repository to Cloudflare Pages.
2. Build settings:
   - **Framework preset**: None
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `static-site`

## ⚙️ Configuration

### Routing & Headers
- **`public/_redirects`**: Handles SPA routing (`/* /index.html 200`).
- **`wrangler.toml`**: Configures custom security headers, CSP, and caching strategies.

### Optimization Highlights
- **Asset Caching**: Static assets in `/assets/` are cached for 1 year (`immutable`).
- **Data Caching**: `games.json` is cached for 1 hour with `stale-while-revalidate`.
- **Security**: Strict CSP headers prevent unauthorized frame embedding and script execution.

## 🔍 Verification

After deployment, verify the following routes:
- **Homepage**: `/` (Should load Floppy Bird featured game)
- **Random Game**: `/game/random`
- **Game List**: `/game`
- **Play Interface**: `/game/play?url=...`

## 🛠️ Troubleshooting

- **404 on Refresh**: Check if `public/_redirects` is correctly deployed to the root.
- **Old Content**: Ensure the `Cache-Control` in `wrangler.toml` hasn't been cached too aggressively on your browser.
- **Build Errors**: Run `npm run clean` and `npm install` to reset the environment.