#!/usr/bin/env node

/**
 * Deployment verification script
 * Tests deployed site functionality and performance
 */

// Deployment verification script - no execSync needed currently

const DEFAULT_STAGING_URL = 'https://h5-games-static-staging.pages.dev';
const DEFAULT_PRODUCTION_URL = 'https://h5-games-static.pages.dev';

/**
 * Test URL accessibility and response
 */
async function testUrl(url, description) {
  console.log(`🔍 Testing ${description}: ${url}`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    console.log(`✅ ${description} - Status: ${response.status}, Type: ${contentType}, Size: ${contentLength} bytes`);
    
    return {
      success: true,
      status: response.status,
      contentType,
      contentLength: parseInt(contentLength) || 0
    };
    
  } catch (error) {
    console.error(`❌ ${description} failed: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test critical routes
 */
async function testRoutes(baseUrl) {
  console.log(`\n🧪 Testing critical routes for ${baseUrl}...\n`);
  
  const routes = [
    { path: '/', description: 'Home page' },
    { path: '/game/random', description: 'Random game page' },
    { path: '/play', description: 'Play page' },
    { path: '/privacy-policy', description: 'Privacy policy page' },
    { path: '/games.json', description: 'Games data API' }
  ];
  
  const results = [];
  
  for (const route of routes) {
    const url = `${baseUrl}${route.path}`;
    const result = await testUrl(url, route.description);
    results.push({ ...route, ...result });
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

/**
 * Test static assets
 */
async function testAssets(baseUrl) {
  console.log(`\n📦 Testing static assets for ${baseUrl}...\n`);
  
  // First get the home page to extract asset URLs
  try {
    const homeResponse = await fetch(baseUrl);
    const homeHtml = await homeResponse.text();
    
    // Extract CSS and JS asset URLs from HTML
    const cssMatches = homeHtml.match(/href="([^"]*\.css[^"]*)"/g) || [];
    const jsMatches = homeHtml.match(/src="([^"]*\.js[^"]*)"/g) || [];
    
    const cssUrls = cssMatches.map(match => match.match(/href="([^"]*)"/)[1]);
    const jsUrls = jsMatches.map(match => match.match(/src="([^"]*)"/)[1]);
    
    const assetResults = [];
    
    // Test CSS files
    for (const cssUrl of cssUrls.slice(0, 3)) { // Test first 3 CSS files
      const fullUrl = cssUrl.startsWith('http') ? cssUrl : `${baseUrl}${cssUrl}`;
      const result = await testUrl(fullUrl, `CSS asset: ${cssUrl}`);
      assetResults.push(result);
    }
    
    // Test JS files
    for (const jsUrl of jsUrls.slice(0, 3)) { // Test first 3 JS files
      const fullUrl = jsUrl.startsWith('http') ? jsUrl : `${baseUrl}${jsUrl}`;
      const result = await testUrl(fullUrl, `JS asset: ${jsUrl}`);
      assetResults.push(result);
    }
    
    return assetResults;
    
  } catch (error) {
    console.error(`❌ Failed to test assets: ${error.message}`);
    return [];
  }
}

/**
 * Test performance metrics
 */
async function testPerformance(baseUrl) {
  console.log(`\n⚡ Testing performance for ${baseUrl}...\n`);
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(baseUrl);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const html = await response.text();
    const htmlSize = new Blob([html]).size;
    
    console.log(`📊 Performance metrics:`);
    console.log(`   Response time: ${responseTime}ms`);
    console.log(`   HTML size: ${(htmlSize / 1024).toFixed(2)} KB`);
    console.log(`   Status: ${response.status}`);
    
    // Check for performance indicators
    const hasServiceWorker = html.includes('serviceWorker') || html.includes('sw.js');
    const hasPreload = html.includes('rel="preload"');
    const hasModulePreload = html.includes('rel="modulepreload"');
    
    console.log(`   Service Worker: ${hasServiceWorker ? '✅' : '❌'}`);
    console.log(`   Resource Preloading: ${hasPreload ? '✅' : '❌'}`);
    console.log(`   Module Preloading: ${hasModulePreload ? '✅' : '❌'}`);
    
    return {
      responseTime,
      htmlSize,
      hasServiceWorker,
      hasPreload,
      hasModulePreload
    };
    
  } catch (error) {
    console.error(`❌ Performance test failed: ${error.message}`);
    return null;
  }
}

/**
 * Generate deployment report
 */
function generateReport(environment, baseUrl, routeResults, assetResults, performanceResults) {
  console.log(`\n📋 Deployment Report for ${environment.toUpperCase()}\n`);
  console.log(`🌐 Base URL: ${baseUrl}`);
  console.log(`📅 Test Date: ${new Date().toISOString()}\n`);
  
  // Route results summary
  const successfulRoutes = routeResults.filter(r => r.success).length;
  const totalRoutes = routeResults.length;
  console.log(`📍 Routes: ${successfulRoutes}/${totalRoutes} successful`);
  
  // Asset results summary
  const successfulAssets = assetResults.filter(r => r.success).length;
  const totalAssets = assetResults.length;
  console.log(`📦 Assets: ${successfulAssets}/${totalAssets} successful`);
  
  // Performance summary
  if (performanceResults) {
    console.log(`⚡ Performance: ${performanceResults.responseTime}ms response time`);
  }
  
  // Overall status
  const overallSuccess = successfulRoutes === totalRoutes && successfulAssets === totalAssets;
  console.log(`\n${overallSuccess ? '🎉' : '⚠️'} Overall Status: ${overallSuccess ? 'PASSED' : 'ISSUES DETECTED'}`);
  
  return overallSuccess;
}

/**
 * Main verification function
 */
async function verifyDeployment() {
  const environment = process.argv[2] || 'staging';
  const customUrl = process.argv[3];
  
  let baseUrl;
  if (customUrl) {
    baseUrl = customUrl;
  } else if (environment === 'production') {
    baseUrl = DEFAULT_PRODUCTION_URL;
  } else {
    baseUrl = DEFAULT_STAGING_URL;
  }
  
  console.log(`🚀 Verifying ${environment} deployment...\n`);
  
  try {
    // Test all routes
    const routeResults = await testRoutes(baseUrl);
    
    // Test static assets
    const assetResults = await testAssets(baseUrl);
    
    // Test performance
    const performanceResults = await testPerformance(baseUrl);
    
    // Generate report
    const success = generateReport(environment, baseUrl, routeResults, assetResults, performanceResults);
    
    if (!success) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error(`❌ Verification failed: ${error.message}`);
    process.exit(1);
  }
}

// Run verification if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyDeployment();
}

export default verifyDeployment;