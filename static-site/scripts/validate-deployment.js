#!/usr/bin/env node

/**
 * Comprehensive deployment validation script
 * Runs all validation checks for deployment readiness
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

/**
 * Execute command and return result
 */
function exec(command, options = {}) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      ...options 
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout };
  }
}

/**
 * Validate build requirements
 */
function validateBuildRequirements() {
  console.log('🔍 Validating build requirements...\n');
  
  const checks = [
    {
      name: 'package.json exists',
      test: () => existsSync('package.json')
    },
    {
      name: 'node_modules exists',
      test: () => existsSync('node_modules')
    },
    {
      name: 'vite.config.js exists',
      test: () => existsSync('vite.config.js')
    },
    {
      name: 'src directory exists',
      test: () => existsSync('src')
    },
    {
      name: 'public directory exists',
      test: () => existsSync('public')
    }
  ];
  
  let passed = 0;
  
  for (const check of checks) {
    const result = check.test();
    console.log(`${result ? '✅' : '❌'} ${check.name}`);
    if (result) passed++;
  }
  
  console.log(`\n📊 Build requirements: ${passed}/${checks.length} passed\n`);
  return passed === checks.length;
}

/**
 * Validate build output
 */
function validateBuildOutput() {
  console.log('🏗️  Validating build output...\n');
  
  // First, ensure we have a fresh build
  console.log('Building project...');
  const buildResult = exec('npm run build');
  
  if (!buildResult.success) {
    console.error('❌ Build failed:', buildResult.error);
    return false;
  }
  
  const checks = [
    {
      name: 'dist directory exists',
      test: () => existsSync('dist')
    },
    {
      name: 'index.html exists',
      test: () => existsSync('dist/index.html')
    },
    {
      name: '_redirects exists',
      test: () => existsSync('dist/_redirects')
    },
    {
      name: '_headers exists',
      test: () => existsSync('dist/_headers')
    },
    {
      name: 'games.json exists',
      test: () => existsSync('dist/games.json')
    },
    {
      name: 'assets directory exists',
      test: () => existsSync('dist/assets')
    },
    {
      name: 'CSS files exist',
      test: () => existsSync('dist/assets/css')
    },
    {
      name: 'JS files exist',
      test: () => existsSync('dist/assets/js')
    }
  ];
  
  let passed = 0;
  
  for (const check of checks) {
    const result = check.test();
    console.log(`${result ? '✅' : '❌'} ${check.name}`);
    if (result) passed++;
  }
  
  console.log(`\n📊 Build output: ${passed}/${checks.length} passed\n`);
  return passed === checks.length;
}

/**
 * Validate configuration files
 */
function validateConfiguration() {
  console.log('⚙️  Validating configuration...\n');
  
  const checks = [
    {
      name: 'wrangler.toml exists',
      test: () => existsSync('wrangler.toml')
    },
    {
      name: 'wrangler.staging.toml exists',
      test: () => existsSync('wrangler.staging.toml')
    },
    {
      name: 'deployment scripts exist',
      test: () => existsSync('scripts/deploy.js') && existsSync('scripts/verify-deployment.js')
    }
  ];
  
  let passed = 0;
  
  for (const check of checks) {
    const result = check.test();
    console.log(`${result ? '✅' : '❌'} ${check.name}`);
    if (result) passed++;
  }
  
  // Validate wrangler.toml content
  if (existsSync('wrangler.toml')) {
    try {
      const wranglerConfig = readFileSync('wrangler.toml', 'utf8');
      const hasCorrectBuildCommand = wranglerConfig.includes('npm run deploy:prepare');
      const hasCorrectPublishDir = wranglerConfig.includes('publish = "dist"');
      
      console.log(`${hasCorrectBuildCommand ? '✅' : '❌'} wrangler.toml has correct build command`);
      console.log(`${hasCorrectPublishDir ? '✅' : '❌'} wrangler.toml has correct publish directory`);
      
      if (hasCorrectBuildCommand) passed++;
      if (hasCorrectPublishDir) passed++;
    } catch (error) {
      console.log('❌ Error reading wrangler.toml');
    }
  }
  
  console.log(`\n📊 Configuration: ${passed}/${checks.length + 2} passed\n`);
  return passed >= checks.length;
}

/**
 * Run build verification
 */
function runBuildVerification() {
  console.log('🔍 Running build verification...\n');
  
  const result = exec('npm run verify:build');
  
  if (result.success) {
    console.log('✅ Build verification passed\n');
    return true;
  } else {
    console.error('❌ Build verification failed:', result.error);
    return false;
  }
}

/**
 * Check deployment readiness
 */
function checkDeploymentReadiness() {
  console.log('🚀 Checking deployment readiness...\n');
  
  const checks = [
    {
      name: 'No server-side code in build',
      test: () => {
        // Check that there are no .server.js files or API routes
        const result = exec('find dist -name "*.server.*" -o -name "api" -type d');
        return result.output.trim() === '';
      }
    },
    {
      name: 'All files are static',
      test: () => {
        // Check that all files in dist are static files
        const result = exec('find dist -type f -not \\( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.json" -o -name "*.txt" -o -name "*.xml" -o -name "*.ico" -o -name "*.png" -o -name "*.jpg" -o -name "*.gif" -o -name "*.svg" -o -name "_*" \\)');
        return result.output.trim() === '';
      }
    },
    {
      name: 'SPA routing configured',
      test: () => {
        if (!existsSync('dist/_redirects')) return false;
        const redirects = readFileSync('dist/_redirects', 'utf8');
        return redirects.includes('/*    /index.html   200');
      }
    }
  ];
  
  let passed = 0;
  
  for (const check of checks) {
    const result = check.test();
    console.log(`${result ? '✅' : '❌'} ${check.name}`);
    if (result) passed++;
  }
  
  console.log(`\n📊 Deployment readiness: ${passed}/${checks.length} passed\n`);
  return passed === checks.length;
}

/**
 * Generate validation report
 */
function generateReport(results) {
  console.log('📋 Validation Report\n');
  console.log('='.repeat(50));
  
  const categories = [
    { name: 'Build Requirements', result: results.buildRequirements },
    { name: 'Build Output', result: results.buildOutput },
    { name: 'Configuration', result: results.configuration },
    { name: 'Build Verification', result: results.buildVerification },
    { name: 'Deployment Readiness', result: results.deploymentReadiness }
  ];
  
  let overallPassed = 0;
  
  for (const category of categories) {
    const status = category.result ? 'PASSED' : 'FAILED';
    const icon = category.result ? '✅' : '❌';
    console.log(`${icon} ${category.name}: ${status}`);
    if (category.result) overallPassed++;
  }
  
  console.log('='.repeat(50));
  
  const overallSuccess = overallPassed === categories.length;
  const overallStatus = overallSuccess ? 'READY FOR DEPLOYMENT' : 'NOT READY';
  const overallIcon = overallSuccess ? '🎉' : '⚠️';
  
  console.log(`${overallIcon} Overall Status: ${overallStatus}`);
  console.log(`📊 Categories Passed: ${overallPassed}/${categories.length}`);
  
  if (!overallSuccess) {
    console.log('\n💡 Next Steps:');
    console.log('1. Fix the failing validation checks above');
    console.log('2. Re-run this validation script');
    console.log('3. Once all checks pass, proceed with deployment');
  } else {
    console.log('\n🚀 Ready to deploy! Use these commands:');
    console.log('   npm run deploy:staging    # Deploy to staging');
    console.log('   npm run deploy:production # Deploy to production');
  }
  
  return overallSuccess;
}

/**
 * Main validation function
 */
async function validateDeployment() {
  console.log('🧪 Comprehensive Deployment Validation\n');
  console.log('='.repeat(50));
  
  const results = {
    buildRequirements: validateBuildRequirements(),
    buildOutput: validateBuildOutput(),
    configuration: validateConfiguration(),
    buildVerification: runBuildVerification(),
    deploymentReadiness: checkDeploymentReadiness()
  };
  
  const success = generateReport(results);
  
  if (!success) {
    process.exit(1);
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateDeployment();
}

export default validateDeployment;