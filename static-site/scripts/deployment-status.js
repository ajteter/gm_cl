#!/usr/bin/env node

/**
 * Deployment status checker
 * Monitors deployment status and provides quick health checks
 */

const STAGING_URL = 'https://h5-games-static-staging.pages.dev';
const PRODUCTION_URL = 'https://h5-games-static.pages.dev';

/**
 * Check deployment status
 */
async function checkStatus(url, environment) {
  console.log(`🔍 Checking ${environment} status: ${url}`);
  
  try {
    const startTime = Date.now();
    const response = await fetch(url);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const status = response.status;
    const statusText = response.statusText;
    
    if (response.ok) {
      console.log(`✅ ${environment} is UP - ${status} ${statusText} (${responseTime}ms)`);
      
      // Check for build info
      try {
        const buildInfoResponse = await fetch(`${url}/build-info.json`);
        if (buildInfoResponse.ok) {
          const buildInfo = await buildInfoResponse.json();
          console.log(`   📝 Build: ${buildInfo.buildId} (${buildInfo.timestamp})`);
          console.log(`   🌿 Branch: ${buildInfo.branch} | Commit: ${buildInfo.commit.substring(0, 8)}`);
        }
      } catch (_e) {
        // Build info not available, that's okay
      }
      
      return { success: true, responseTime, status };
    } else {
      console.log(`❌ ${environment} is DOWN - ${status} ${statusText}`);
      return { success: false, responseTime, status, error: statusText };
    }
    
  } catch (error) {
    console.log(`❌ ${environment} is UNREACHABLE - ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Check games data availability
 */
async function checkGamesData(url, _environment) {
  try {
    const response = await fetch(`${url}/games.json`);
    if (response.ok) {
      const games = await response.json();
      console.log(`   🎮 Games data: ${games.length} games available`);
      return games.length;
    } else {
      console.log(`   ❌ Games data unavailable: ${response.status}`);
      return 0;
    }
  } catch (error) {
    console.log(`   ❌ Games data error: ${error.message}`);
    return 0;
  }
}

/**
 * Main status check function
 */
async function checkDeploymentStatus() {
  console.log('🚀 Checking deployment status...\n');
  
  const environments = [
    { url: STAGING_URL, name: 'STAGING' },
    { url: PRODUCTION_URL, name: 'PRODUCTION' }
  ];
  
  const results = [];
  
  for (const env of environments) {
    const result = await checkStatus(env.url, env.name);
    
    if (result.success) {
      const gamesCount = await checkGamesData(env.url, env.name);
      result.gamesCount = gamesCount;
    }
    
    results.push({ ...env, ...result });
    console.log(''); // Empty line between environments
  }
  
  // Summary
  console.log('📊 Summary:');
  const upCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`   ${upCount}/${totalCount} environments are operational`);
  
  if (upCount === totalCount) {
    console.log('🎉 All systems operational!');
  } else {
    console.log('⚠️  Some systems have issues');
    process.exit(1);
  }
}

// Run status check if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkDeploymentStatus();
}

export default checkDeploymentStatus;