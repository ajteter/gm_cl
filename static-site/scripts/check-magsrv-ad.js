#!/usr/bin/env node

/**
 * MagSrv Ad Verification Script
 * Checks if MagSrv ads are properly implemented
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🔍 Checking MagSrv Ad Implementation...\n')

let allChecksPass = true

// Check if MagSrvAd component exists
console.log('📁 Component Files:')
try {
  const magSrvAdPath = join(projectRoot, 'src/components/MagSrvAd.jsx')
  const magSrvAdContent = readFileSync(magSrvAdPath, 'utf8')
  
  if (magSrvAdContent.includes('5728338')) {
    console.log('  ✅ MagSrvAd.jsx exists with zone ID 5728338')
  } else {
    console.log('  ❌ MagSrvAd.jsx missing zone ID 5728338')
    allChecksPass = false
  }
  
  if (magSrvAdContent.includes('magsrv.com/ad-provider.js')) {
    console.log('  ✅ MagSrvAd.jsx includes correct script URL')
  } else {
    console.log('  ❌ MagSrvAd.jsx missing script URL')
    allChecksPass = false
  }
  
  if (magSrvAdContent.includes('eas6a97888e10')) {
    console.log('  ✅ MagSrvAd.jsx includes correct class name')
  } else {
    console.log('  ❌ MagSrvAd.jsx missing class name')
    allChecksPass = false
  }
  
} catch (error) {
  console.log('  ❌ MagSrvAd.jsx not found')
  allChecksPass = false
}

console.log()

// Check RandomGame2Page configuration
console.log('🎮 RandomGame2Page Configuration:')
try {
  const randomGame2Path = join(projectRoot, 'src/pages/RandomGame2Page.jsx')
  const randomGame2Content = readFileSync(randomGame2Path, 'utf8')
  
  if (randomGame2Content.includes("type: 'magsrv'")) {
    console.log('  ✅ RandomGame2Page configured to use MagSrv')
  } else {
    console.log('  ❌ RandomGame2Page not configured for MagSrv')
    allChecksPass = false
  }
  
  if (randomGame2Content.includes("zoneId: '5728338'")) {
    console.log('  ✅ RandomGame2Page has correct zone ID')
  } else {
    console.log('  ❌ RandomGame2Page missing zone ID')
    allChecksPass = false
  }
  
} catch (error) {
  console.log('  ❌ RandomGame2Page.jsx not found')
  allChecksPass = false
}

console.log()

// Check GameClientUI2 configuration
console.log('🎨 GameClientUI2 Configuration:')
try {
  const gameClientUI2Path = join(projectRoot, 'src/components/GameClientUI2.jsx')
  const gameClientUI2Content = readFileSync(gameClientUI2Path, 'utf8')
  
  if (gameClientUI2Content.includes('import MagSrvAd')) {
    console.log('  ✅ GameClientUI2 imports MagSrvAd')
  } else {
    console.log('  ❌ GameClientUI2 missing MagSrvAd import')
    allChecksPass = false
  }
  
  if (gameClientUI2Content.includes("adType === 'magsrv'")) {
    console.log('  ✅ GameClientUI2 supports MagSrv ad type')
  } else {
    console.log('  ❌ GameClientUI2 missing MagSrv support')
    allChecksPass = false
  }
  
} catch (error) {
  console.log('  ❌ GameClientUI2.jsx not found')
  allChecksPass = false
}

console.log()

// Check test page
console.log('🧪 Test Page:')
try {
  const testPagePath = join(projectRoot, 'src/pages/MagSrvTestPage.jsx')
  const testPageContent = readFileSync(testPagePath, 'utf8')
  
  if (testPageContent.includes('MagSrvAd')) {
    console.log('  ✅ MagSrvTestPage exists')
  } else {
    console.log('  ❌ MagSrvTestPage missing MagSrvAd')
    allChecksPass = false
  }
  
} catch (error) {
  console.log('  ❌ MagSrvTestPage.jsx not found')
  allChecksPass = false
}

console.log()

// Final status
if (allChecksPass) {
  console.log('🎉 All MagSrv ad checks passed!')
  console.log('📋 Next Steps:')
  console.log('   1. Deploy the updated code')
  console.log('   2. Visit /magsrv-test to debug the ad loading')
  console.log('   3. Check /game2/random for the actual implementation')
  console.log('   4. Monitor browser console for any errors')
  console.log('   5. Verify network requests to magsrv.com in browser dev tools')
  process.exit(0)
} else {
  console.log('⚠️  Some MagSrv ad checks failed. Please review the configuration.')
  process.exit(1)
}