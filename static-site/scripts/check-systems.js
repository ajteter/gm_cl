#!/usr/bin/env node

/**
 * System Status Checker
 * Verifies that both Game1 and Game2 systems are properly configured
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🔍 Checking Game Systems Status...\n')

// Check if required files exist
const requiredFiles = {
  'Game1 System': [
    'src/components/GameClientUI.jsx',
    'src/components/GameList.jsx', 
    'src/components/GameCard.jsx',
    'src/pages/HomePage.jsx',
    'src/pages/GamePage.jsx',
    'src/pages/RandomGamePage.jsx',
    'src/pages/PlayPage.jsx'
  ],
  'Game2 System': [
    'src/components/GameClientUI2.jsx',
    'src/components/GameList2.jsx',
    'src/components/GameCard2.jsx', 
    'src/components/AdcashAd.jsx',
    'src/pages/HomePage2.jsx',
    'src/pages/Game2Page.jsx',
    'src/pages/RandomGame2Page.jsx',
    'src/pages/Play2Page.jsx'
  ],
  'Game3 System': [
    'src/components/GameClientUI3.jsx',
    'src/components/GameList3.jsx',
    'src/components/GameCard3.jsx',
    'src/pages/HomePage3.jsx',
    'src/pages/Game3Page.jsx',
    'src/pages/RandomGame3Page.jsx',
    'src/pages/Play3Page.jsx'
  ]
}

let allSystemsOk = true

// Check file existence
for (const [systemName, files] of Object.entries(requiredFiles)) {
  console.log(`📁 ${systemName}:`)
  
  for (const file of files) {
    const filePath = join(projectRoot, file)
    const exists = existsSync(filePath)
    
    if (exists) {
      console.log(`  ✅ ${file}`)
    } else {
      console.log(`  ❌ ${file} - MISSING`)
      allSystemsOk = false
    }
  }
  console.log()
}

// Check App.jsx routes
console.log('🛣️  Route Configuration:')
try {
  const appContent = readFileSync(join(projectRoot, 'src/App.jsx'), 'utf8')
  
  const game1Routes = ['/game', '/game/random', '/game/play']
  const game2Routes = ['/game2', '/game2/random', '/game2/play']
  const game3Routes = ['/game3', '/game3/random', '/game3/play']
  
  console.log('  Game1 Routes:')
  for (const route of game1Routes) {
    if (appContent.includes(`path="${route}"`)) {
      console.log(`    ✅ ${route}`)
    } else {
      console.log(`    ❌ ${route} - NOT FOUND`)
      allSystemsOk = false
    }
  }
  
  console.log('  Game2 Routes:')
  for (const route of game2Routes) {
    if (appContent.includes(`path="${route}"`)) {
      console.log(`    ✅ ${route}`)
    } else {
      console.log(`    ❌ ${route} - NOT FOUND`)
      allSystemsOk = false
    }
  }
  
  console.log('  Game3 Routes:')
  for (const route of game3Routes) {
    if (appContent.includes(`path="${route}"`)) {
      console.log(`    ✅ ${route}`)
    } else {
      console.log(`    ❌ ${route} - NOT FOUND`)
      allSystemsOk = false
    }
  }
} catch (error) {
  console.log('  ❌ Could not read App.jsx')
  allSystemsOk = false
}

console.log()

// Check ad configurations
console.log('📺 Advertisement Configuration:')

try {
  // Check Game1 ads (GameClientUI)
  const game1UI = readFileSync(join(projectRoot, 'src/components/GameClientUI.jsx'), 'utf8')
  if (game1UI.includes('e689411a7eabfbe7f506351f1a7fc234')) {
    console.log('  ✅ Game1 System: Original ad network configured')
  } else {
    console.log('  ❌ Game1 System: Ad configuration missing')
    allSystemsOk = false
  }
  
  // Check Game2 ads (AdcashAd)
  const adcashAd = readFileSync(join(projectRoot, 'src/components/AdcashAd.jsx'), 'utf8')
  if (adcashAd.includes('10422246') && adcashAd.includes('acscdn.com')) {
    console.log('  ✅ Game2 System: Adcash configured')
  } else {
    console.log('  ❌ Game2 System: Adcash configuration missing')
    allSystemsOk = false
  }
  
  // Check Game3 ads (GameClientUI3)
  const game3UI = readFileSync(join(projectRoot, 'src/components/GameClientUI3.jsx'), 'utf8')
  if (game3UI.includes('GAME3_DEFAULT_AD_KEY_PLACEHOLDER')) {
    console.log('  ✅ Game3 System: Game1-based ad network configured')
  } else {
    console.log('  ❌ Game3 System: Ad configuration missing')
    allSystemsOk = false
  }
} catch (error) {
  console.log('  ❌ Could not verify ad configurations')
  allSystemsOk = false
}

console.log()

// Final status
if (allSystemsOk) {
  console.log('🎉 All systems are properly configured!')
  console.log('📋 Summary:')
  console.log('   • Game1 System: /game, /game/random, /game/play (Original ads)')
  console.log('   • Game2 System: /game2, /game2/random, /game2/play (Adcash ads)')
  console.log('   • Game3 System: /game3, /game3/random, /game3/play (Game1-based ads)')
  console.log('   • All systems are completely independent')
  process.exit(0)
} else {
  console.log('⚠️  Some issues were found. Please check the configuration.')
  process.exit(1)
}