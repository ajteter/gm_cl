# Deployment Guide

This document provides comprehensive instructions for deploying the H5 Games Static site to Cloudflare Pages.

## Overview

The site is configured for deployment to Cloudflare Pages as a purely static site with zero function invocations. This ensures unlimited free requests and optimal performance.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Install globally with `npm install -g wrangler`
3. **Node.js**: Version 18 or higher
4. **Git**: For version control and GitHub integration

## Quick Start

### 1. Prepare for Deployment

```bash
# Install dependencies
npm install

# Run full deployment preparation
npm run deploy:prepare
```

This command will:
- Validate build requirements
- Run linting and tests
- Build the project
- Verify build output
- Generate build information
- Run performance audits

### 2. Deploy to Staging

```bash
# Deploy to staging environment
npm run deploy:staging
```

### 3. Deploy to Production

```bash
# Deploy to production environment
npm run deploy:production
```

### 4. Verify Deployment

After deployment, verify both game systems are working correctly:

#### Game1 System Testing
```bash
# Test Game1 system routes
curl -I https://your-domain.com/game
curl -I https://your-domain.com/game/random  
curl -I https://your-domain.com/game/play
```

#### Game2 System Testing
```bash
# Test Game2 system routes
curl -I https://your-domain.com/game2
curl -I https://your-domain.com/game2/random
curl -I https://your-domain.com/game2/play
```

#### Automated Verification

```bash
# Verify staging deployment
npm run verify:deployment staging

# Verify production deployment
npm run verify:deployment production

# Verify custom URL
npm run verify:deployment staging https://your-custom-url.pages.dev
```

## Configuration Files

### Wrangler Configuration

- **`wrangler.toml`**: Production configuration
- **`wrangler.staging.toml`**: Staging configuration

Key settings:
- Build command: `npm run build`
- Publish directory: `dist`
- Custom headers for security and caching
- CSP headers for iframe security

### Build Configuration

The `vite.config.js` includes optimizations for:
- Code splitting and lazy loading
- Asset optimization and caching
- Bundle size optimization
- Modern browser targeting

## Environment Setup

### Local Development

```bash
# Start development server
npm run dev

# Preview production build locally
npm run preview
```

### Environment Variables

Set these in your Cloudflare Pages dashboard:

- `NODE_ENV`: Set to "production" for production builds
- `ENVIRONMENT`: Set to "staging" or "production"

## Deployment Methods

### Method 1: Direct Deployment (Recommended)

Using Wrangler CLI for direct deployment:

```bash
# Login to Cloudflare
wrangler login

# Deploy to staging
wrangler pages deploy dist --project-name=h5-games-static-staging

# Deploy to production
wrangler pages deploy dist --project-name=h5-games-static
```

### Method 2: GitHub Integration

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - **Build command**: `cd static-site && npm run build`
   - **Build output directory**: `static-site/dist`
   - **Root directory**: `/` (or `static-site` if using subdirectory)

3. Set up branch deployments:
   - **Production branch**: `main`
   - **Preview branches**: `develop`, feature branches

### Method 3: GitHub Actions (Automated)

The included `.github/workflows/deploy.yml` provides automated deployment:

1. Set up repository secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `LHCI_GITHUB_APP_TOKEN` (optional, for Lighthouse)

2. Push to configured branches:
   - `main` → Production deployment
   - `develop` → Staging deployment

## Build Verification

The deployment process includes comprehensive verification:

### Automated Checks

- **Linting**: ESLint validation
- **Testing**: Unit and integration tests
- **Build verification**: Output validation
- **Performance audit**: Lighthouse scoring
- **Route testing**: All critical routes
- **Asset validation**: CSS/JS asset loading

### Manual Verification

After deployment, verify:

1. **All routes work correctly**:
   - Home page (`/`)
   - Random game page (`/game/random`)
   - Play page (`/play`)
   - Privacy policy (`/privacy-policy`)

2. **Game functionality**:
   - Game list loads correctly
   - Random game selection works
   - Game embedding functions properly
   - URL parameters preserved for ad attribution

3. **Performance metrics**:
   - Fast loading times
   - Proper caching headers
   - Zero function invocations in Cloudflare analytics

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clean and rebuild
npm run clean
npm run build

# Check for missing dependencies
npm install

# Verify Node.js version
node --version  # Should be 18+
```

#### Deployment Failures

```bash
# Check Wrangler authentication
wrangler whoami

# Re-authenticate if needed
wrangler login

# Check project configuration
wrangler pages project list
```

#### Route Issues

- Ensure `_redirects` file is in `public/` directory
- Verify SPA fallback rule: `/*    /index.html   200`
- Check React Router configuration

#### Performance Issues

```bash
# Analyze bundle size
npm run build:analyze

# Run performance audit
npm run perf:audit

# Check build optimization
npm run build:size
```

### Debug Mode

Enable verbose logging:

```bash
# Wrangler debug mode
wrangler pages deploy dist --project-name=your-project --debug

# Vite debug mode
DEBUG=vite:* npm run build
```

## Monitoring and Analytics

### Cloudflare Analytics

Monitor your deployment through Cloudflare dashboard:

1. **Pages Analytics**: Traffic, performance, errors
2. **Web Analytics**: User behavior, page views
3. **Speed Insights**: Core Web Vitals, loading performance

### Performance Monitoring

The site includes built-in performance monitoring:

- **Core Web Vitals tracking**
- **Error boundary reporting**
- **Loading time metrics**
- **User interaction tracking**

Access performance data via the Performance Dashboard component.

## Security Considerations

### Content Security Policy

The deployment includes CSP headers for:
- Frame security for game iframes
- XSS protection
- Content type validation

### Headers Configuration

Security headers are configured in `wrangler.toml`:
- `X-Frame-Options`: Clickjacking protection
- `X-Content-Type-Options`: MIME type sniffing protection
- `Referrer-Policy`: Referrer information control

## Optimization Features

### Caching Strategy

- **Static assets**: 1 year cache with immutable flag
- **Games data**: 1 hour cache for updates
- **HTML pages**: Browser cache with validation

### Code Splitting

- **Vendor chunks**: React libraries separated
- **Page chunks**: Lazy-loaded route components
- **Utility chunks**: Shared utilities bundled

### Asset Optimization

- **Image optimization**: Automatic format selection
- **CSS optimization**: Minification and purging
- **JavaScript optimization**: Tree shaking and minification

## Support

For deployment issues:

1. Check the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/)
2. Review build logs in Cloudflare dashboard
3. Run local verification: `npm run verify:build`
4. Test deployment verification: `npm run verify:deployment`

## Rollback Procedure

If deployment issues occur:

1. **Immediate rollback**: Use Cloudflare Pages dashboard to rollback to previous deployment
2. **Fix and redeploy**: Address issues locally and redeploy
3. **Branch protection**: Use staging environment for testing before production

## Performance Targets

Target metrics for successful deployment:

- **Lighthouse Performance**: > 90
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s