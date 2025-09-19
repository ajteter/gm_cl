#!/usr/bin/env node

/**
 * Performance reporting script
 * Generates comprehensive performance reports including bundle analysis and Lighthouse audits
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIST_DIR = 'dist';
const REPORTS_DIR = 'reports';

/**
 * Execute command and return output
 */
function exec(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      ...options 
    });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    return null;
  }
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!existsSync(dir)) {
    exec(`mkdir -p ${dir}`);
  }
}

/**
 * Get bundle size information
 */
function getBundleInfo() {
  if (!existsSync(DIST_DIR)) {
    console.error('Build directory not found. Run npm run build first.');
    return null;
  }

  const bundleInfo = {
    timestamp: new Date().toISOString(),
    totalSize: 0,
    assets: {
      js: [],
      css: [],
      other: []
    }
  };

  try {
    // Get file sizes
    const jsFiles = exec(`find ${DIST_DIR}/assets/js -name "*.js" -exec ls -la {} \\;`);
    const cssFiles = exec(`find ${DIST_DIR}/assets/css -name "*.css" -exec ls -la {} \\;`);

    if (jsFiles) {
      jsFiles.split('\n').filter(line => line.trim()).forEach(line => {
        const parts = line.split(/\s+/);
        if (parts.length >= 9) {
          const size = parseInt(parts[4]);
          const name = parts[8].split('/').pop();
          bundleInfo.assets.js.push({ name, size });
          bundleInfo.totalSize += size;
        }
      });
    }

    if (cssFiles) {
      cssFiles.split('\n').filter(line => line.trim()).forEach(line => {
        const parts = line.split(/\s+/);
        if (parts.length >= 9) {
          const size = parseInt(parts[4]);
          const name = parts[8].split('/').pop();
          bundleInfo.assets.css.push({ name, size });
          bundleInfo.totalSize += size;
        }
      });
    }

    return bundleInfo;
  } catch (error) {
    console.error('Error getting bundle info:', error.message);
    return null;
  }
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate performance report
 */
function generateReport() {
  console.log('🚀 Generating Performance Report...\n');

  ensureDir(REPORTS_DIR);

  // 1. Build the project
  console.log('📦 Building project...');
  const buildResult = exec('npm run build');
  if (!buildResult) {
    console.error('❌ Build failed');
    process.exit(1);
  }
  console.log('✅ Build completed\n');

  // 2. Get bundle information
  console.log('📊 Analyzing bundle sizes...');
  const bundleInfo = getBundleInfo();
  if (bundleInfo) {
    console.log(`Total bundle size: ${formatBytes(bundleInfo.totalSize)}`);
    console.log(`JavaScript files: ${bundleInfo.assets.js.length}`);
    console.log(`CSS files: ${bundleInfo.assets.css.length}`);
    
    // Save bundle report
    writeFileSync(
      join(REPORTS_DIR, 'bundle-report.json'),
      JSON.stringify(bundleInfo, null, 2)
    );
    console.log('✅ Bundle analysis completed\n');
  }

  // 3. Generate bundle visualization
  console.log('📈 Generating bundle visualization...');
  const analyzeResult = exec('npm run build:analyze');
  if (analyzeResult) {
    console.log('✅ Bundle visualization generated\n');
  }

  // 4. Run Lighthouse audits
  console.log('🔍 Running Lighthouse audits...');
  const lighthouseResult = exec('npm run lighthouse');
  if (lighthouseResult) {
    console.log('✅ Lighthouse audits completed\n');
  }

  // 5. Generate summary report
  const report = {
    timestamp: new Date().toISOString(),
    bundle: bundleInfo,
    recommendations: generateRecommendations(bundleInfo)
  };

  writeFileSync(
    join(REPORTS_DIR, 'performance-summary.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('📋 Performance Report Summary:');
  console.log('================================');
  console.log(`Total Bundle Size: ${formatBytes(bundleInfo?.totalSize || 0)}`);
  console.log(`JavaScript Chunks: ${bundleInfo?.assets.js.length || 0}`);
  console.log(`CSS Chunks: ${bundleInfo?.assets.css.length || 0}`);
  console.log('\n📁 Reports saved to:');
  console.log(`  - ${REPORTS_DIR}/bundle-report.json`);
  console.log(`  - ${REPORTS_DIR}/performance-summary.json`);
  console.log(`  - ${DIST_DIR}/bundle-analysis.html`);
  console.log('\n🎉 Performance report generation completed!');
}

/**
 * Generate performance recommendations
 */
function generateRecommendations(bundleInfo) {
  const recommendations = [];

  if (!bundleInfo) return recommendations;

  // Check for large JavaScript files
  const largeJsFiles = bundleInfo.assets.js.filter(file => file.size > 100000); // > 100KB
  if (largeJsFiles.length > 0) {
    recommendations.push({
      type: 'warning',
      category: 'bundle-size',
      message: `Large JavaScript files detected: ${largeJsFiles.map(f => f.name).join(', ')}`,
      suggestion: 'Consider further code splitting or lazy loading'
    });
  }

  // Check total bundle size
  if (bundleInfo.totalSize > 500000) { // > 500KB
    recommendations.push({
      type: 'warning',
      category: 'bundle-size',
      message: `Total bundle size is ${formatBytes(bundleInfo.totalSize)}`,
      suggestion: 'Consider optimizing assets and implementing more aggressive code splitting'
    });
  }

  // Check number of chunks
  if (bundleInfo.assets.js.length > 10) {
    recommendations.push({
      type: 'info',
      category: 'chunks',
      message: `High number of JavaScript chunks (${bundleInfo.assets.js.length})`,
      suggestion: 'Monitor HTTP/2 performance impact of many small chunks'
    });
  }

  return recommendations;
}

// Run the report generation
generateReport();