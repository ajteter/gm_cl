# Deployment Validation Checklist

This checklist ensures that the static site deployment meets all requirements for zero function invocations on Cloudflare Pages.

## Pre-Deployment Validation

### ✅ Build Requirements
- [ ] All source files are present and valid
- [ ] Dependencies are installed (`npm install`)
- [ ] Build completes successfully (`npm run build`)
- [ ] Build output contains only static files
- [ ] No server-side code in build output

### ✅ Static File Structure
- [ ] `dist/index.html` exists and is valid HTML
- [ ] `dist/_redirects` exists with SPA fallback rule
- [ ] `dist/_headers` exists with security headers
- [ ] `dist/games.json` exists and contains game data
- [ ] `dist/assets/` directory contains CSS and JS files
- [ ] All asset files have proper cache-busting hashes

### ✅ Configuration Files
- [ ] `wrangler.toml` configured for production
- [ ] `wrangler.staging.toml` configured for staging
- [ ] Build command set to `npm run deploy:prepare`
- [ ] Publish directory set to `dist`
- [ ] Environment variables configured if needed

## Local Testing

### ✅ Preview Server Testing
- [ ] Preview server starts successfully (`npm run preview`)
- [ ] Home page loads correctly (`/`)
- [ ] Random game page works (`/game/random`)
- [ ] Play page accessible (`/play`)
- [ ] Privacy policy page loads (`/privacy-policy`)
- [ ] Games data API responds (`/games.json`)
- [ ] 404 handling works for invalid routes
- [ ] Client-side routing functions properly

### ✅ Functionality Testing
- [ ] Game list displays correctly
- [ ] Game cards render with proper data
- [ ] Random game selection works
- [ ] Game embedding functions
- [ ] URL parameters preserved for ad attribution
- [ ] Loading states display properly
- [ ] Error handling works correctly

### ✅ Performance Testing
- [ ] Page load times are acceptable (< 3s)
- [ ] Assets load efficiently
- [ ] Code splitting works correctly
- [ ] Bundle sizes are optimized
- [ ] Lighthouse performance score > 90

## Deployment Testing

### ✅ Staging Deployment
- [ ] Deploy to staging environment
- [ ] Staging URL accessible
- [ ] All routes work on staging
- [ ] Games data loads correctly
- [ ] No server-side functions invoked
- [ ] Performance metrics acceptable

### ✅ Production Deployment
- [ ] Deploy to production environment
- [ ] Production URL accessible
- [ ] All routes work on production
- [ ] Games data loads correctly
- [ ] No server-side functions invoked
- [ ] Performance metrics acceptable

## Post-Deployment Validation

### ✅ Cloudflare Analytics
- [ ] Zero function invocations recorded
- [ ] Static requests only in analytics
- [ ] Bandwidth usage as expected
- [ ] Cache hit rates optimized

### ✅ SEO and Metadata
- [ ] Page titles display correctly
- [ ] Meta descriptions present
- [ ] Open Graph tags working
- [ ] Structured data valid
- [ ] Sitemap accessible

### ✅ Security Headers
- [ ] CSP headers present and functional
- [ ] X-Frame-Options configured
- [ ] X-Content-Type-Options set
- [ ] Referrer-Policy configured
- [ ] HTTPS redirect working

### ✅ Caching Strategy
- [ ] Static assets cached for 1 year
- [ ] HTML files have proper cache control
- [ ] Games.json cached appropriately
- [ ] Service worker functioning (if applicable)

## Browser Compatibility

### ✅ Desktop Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### ✅ Mobile Testing
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Samsung Internet
- [ ] Firefox Mobile

## Accessibility Testing

### ✅ WCAG Compliance
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Color contrast meets standards
- [ ] Alt text for images
- [ ] Proper heading structure

## Performance Benchmarks

### ✅ Core Web Vitals
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] First Input Delay < 100ms
- [ ] Time to Interactive < 3.5s

### ✅ Lighthouse Scores
- [ ] Performance > 90
- [ ] Accessibility > 95
- [ ] Best Practices > 90
- [ ] SEO > 90

## Rollback Plan

### ✅ Emergency Procedures
- [ ] Previous deployment can be restored
- [ ] DNS changes can be reverted
- [ ] Monitoring alerts configured
- [ ] Support team notified

## Sign-off

- [ ] **Technical Lead**: Deployment meets technical requirements
- [ ] **QA Team**: All functionality tested and approved
- [ ] **Performance Team**: Performance benchmarks met
- [ ] **Security Team**: Security requirements satisfied
- [ ] **Product Owner**: Feature requirements fulfilled

---

## Automated Validation Commands

```bash
# Pre-deployment validation
npm run deploy:prepare

# Local testing
npm run test:local

# Build verification
npm run verify:build

# Deployment status check
npm run deploy:status

# Performance audit
npm run perf:audit
```

## Manual Testing URLs

### Staging Environment
- Home: https://h5-games-static-staging.pages.dev/
- Random Game: https://h5-games-static-staging.pages.dev/game/random
- Play: https://h5-games-static-staging.pages.dev/play
- Privacy: https://h5-games-static-staging.pages.dev/privacy-policy
- Games API: https://h5-games-static-staging.pages.dev/games.json

### Production Environment
- Home: https://h5-games-static.pages.dev/
- Random Game: https://h5-games-static.pages.dev/game/random
- Play: https://h5-games-static.pages.dev/play
- Privacy: https://h5-games-static.pages.dev/privacy-policy
- Games API: https://h5-games-static.pages.dev/games.json