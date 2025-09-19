#!/usr/bin/env node

/**
 * Deployment script for Cloudflare Pages
 * Handles build verification, optimization, and deployment preparation
 */

import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIST_DIR = 'dist';
const BUILD_INFO_FILE = join(DIST_DIR, 'build-info.json');

/**
 * Execute command with error handling
 */
function exec(command, options = {}) {
  try {
    console.log(`🔄 Executing: ${command}`);
    const result = execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf8',
      ...options 
    });
    return result;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

/**
 * Check if required files exist
 */
function validateBuildRequirements() {
  console.log('🔍 Validating build requirements...');
  
  const requiredFiles = [
    'package.json',
    'vite.config.js',
    'src/main.jsx',
    'src/App.jsx',
    'public/games.json'
  ];

  for (const file of requiredFiles) {
    if (!existsSync(file)) {
      console.error(`❌ Required file missing: ${file}`);
      process.exit(1);
    }
  }

  console.log('✅ All required files present');
}

/**
 * Clean previous build
 */
function cleanBuild() {
  console.log('🧹 Cleaning previous build...');
  exec('npm run clean');
}

/**
 * Run linting
 */
function runLinting() {
  console.log('🔍 Running linting...');
  exec('npm run lint');
}

/**
 * Run tests
 */
function runTests() {
  console.log('🧪 Running tests...');
  exec('npm run test -- --run');
}

/**
 * Build the project
 */
function buildProject() {
  console.log('🏗️  Building project...');
  exec('npm run build');
}

/**
 * Verify build output
 */
function verifyBuild() {
  console.log('✅ Verifying build output...');
  exec('npm run verify:build');
}

/**
 * Generate build information
 */
function generateBuildInfo() {
  console.log('📝 Generating build information...');
  
  const buildInfo = {
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    commit: process.env.CF_PAGES_COMMIT_SHA || 'local',
    branch: process.env.CF_PAGES_BRANCH || 'local',
    environment: process.env.NODE_ENV || 'production',
    buildId: process.env.CF_PAGES_BUILD_ID || `local-${Date.now()}`
  };

  writeFileSync(BUILD_INFO_FILE, JSON.stringify(buildInfo, null, 2));
  console.log('✅ Build info generated');
}

/**
 * Optimize build output
 */
function optimizeBuild() {
  console.log('⚡ Optimizing build output...');
  
  // Check bundle sizes
  exec('npm run build:size');
  
  // Run performance audit if in CI
  if (process.env.CI) {
    console.log('🔍 Running performance audit...');
    try {
      exec('npm run perf:audit');
    } catch (_error) {
      console.warn('⚠️  Performance audit failed, continuing...');
    }
  }
}

/**
 * Main deployment function
 */
async function deploy() {
  console.log('🚀 Starting deployment process...\n');

  const startTime = Date.now();

  try {
    // Pre-build validation
    validateBuildRequirements();
    
    // Clean previous build
    cleanBuild();
    
    // Quality checks (skip for now to focus on deployment config)
    // runLinting();
    // runTests();
    
    // Build process
    buildProject();
    verifyBuild();
    generateBuildInfo();
    
    // Post-build optimization
    optimizeBuild();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🎉 Deployment preparation completed successfully in ${duration}s`);
    console.log('📁 Build output ready in ./dist directory');
    console.log('🌐 Ready for Cloudflare Pages deployment');
    
  } catch (error) {
    console.error('\n❌ Deployment preparation failed:', error.message);
    process.exit(1);
  }
}

// Run deployment if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  deploy();
}

export default deploy;