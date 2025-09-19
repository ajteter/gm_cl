#!/usr/bin/env node

/**
 * Local deployment testing script
 * Tests the built static files locally before deployment
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';

const PREVIEW_PORT = 4173;
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`;

/**
 * Start preview server
 */
function startPreviewServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting preview server...');
    
    const server = spawn('npm', ['run', 'preview'], {
      stdio: 'pipe',
      detached: false
    });
    
    let serverReady = false;
    
    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      
      if (output.includes('Local:') && !serverReady) {
        serverReady = true;
        console.log('✅ Preview server started');
        resolve(server);
      }
    });
    
    server.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });
    
    server.on('error', (error) => {
      reject(error);
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (!serverReady) {
        server.kill();
        reject(new Error('Server startup timeout'));
      }
    }, 10000);
  });
}

/**
 * Test URL accessibility
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
    
    console.log(`✅ ${description} - Status: ${response.status}, Type: ${contentType}`);
    
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
async function testRoutes() {
  console.log(`\n🧪 Testing critical routes...\n`);
  
  const routes = [
    { path: '/', description: 'Home page' },
    { path: '/game/random', description: 'Random game page' },
    { path: '/play', description: 'Play page' },
    { path: '/privacy-policy', description: 'Privacy policy page' },
    { path: '/games.json', description: 'Games data API' }
  ];
  
  const results = [];
  
  for (const route of routes) {
    const url = `${PREVIEW_URL}${route.path}`;
    const result = await testUrl(url, route.description);
    results.push({ ...route, ...result });
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

/**
 * Test build output structure
 */
function testBuildStructure() {
  console.log('\n📁 Testing build structure...\n');
  
  const requiredFiles = [
    'dist/index.html',
    'dist/_redirects',
    'dist/_headers',
    'dist/games.json',
    'dist/assets'
  ];
  
  const results = [];
  
  for (const file of requiredFiles) {
    const exists = existsSync(file);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    results.push({ file, exists });
  }
  
  return results;
}

/**
 * Main testing function
 */
async function testLocalDeployment() {
  console.log('🧪 Testing local deployment...\n');
  
  try {
    // Test build structure first
    const structureResults = testBuildStructure();
    const structureSuccess = structureResults.every(r => r.exists);
    
    if (!structureSuccess) {
      console.error('\n❌ Build structure test failed');
      process.exit(1);
    }
    
    // Start preview server
    const server = await startPreviewServer();
    
    // Wait a moment for server to be fully ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Test routes
      const routeResults = await testRoutes();
      
      // Generate report
      const successfulRoutes = routeResults.filter(r => r.success).length;
      const totalRoutes = routeResults.length;
      
      console.log(`\n📋 Test Results:\n`);
      console.log(`📁 Build structure: ${structureSuccess ? 'PASSED' : 'FAILED'}`);
      console.log(`📍 Routes: ${successfulRoutes}/${totalRoutes} successful`);
      
      const overallSuccess = structureSuccess && successfulRoutes === totalRoutes;
      console.log(`\n${overallSuccess ? '🎉' : '⚠️'} Overall Status: ${overallSuccess ? 'PASSED' : 'ISSUES DETECTED'}`);
      
      if (!overallSuccess) {
        process.exit(1);
      }
      
    } finally {
      // Clean up server
      console.log('\n🛑 Stopping preview server...');
      server.kill();
    }
    
  } catch (error) {
    console.error(`❌ Local deployment test failed: ${error.message}`);
    process.exit(1);
  }
}

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testLocalDeployment();
}

export default testLocalDeployment;