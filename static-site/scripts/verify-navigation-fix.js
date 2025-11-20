#!/usr/bin/env node

/**
 * 验证导航修复
 * 检查所有 Random Game 页面的 More Games 按钮导航是否正确
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🔍 验证导航修复...\n')

const filesToCheck = [
  {
    name: 'RandomGamePage',
    path: 'src/pages/RandomGamePage.jsx',
    expectedNav: "navigate('/')",
    description: 'Game1 Random Page -> HomePage'
  },
  {
    name: 'RandomGame2Page',
    path: 'src/pages/RandomGame2Page.jsx',
    expectedNav: "navigate('/game2')",
    description: 'Game2 Random Page -> HomePage2'
  },
  {
    name: 'RandomGame3Page',
    path: 'src/pages/RandomGame3Page.jsx',
    expectedNav: "navigate('/game3')",
    description: 'Game3 Random Page -> HomePage3'
  },
  {
    name: 'GameClientUI',
    path: 'src/components/GameClientUI.jsx',
    expectedNav: "navigate('/')",
    description: 'GameClientUI default -> HomePage'
  }
]

let allCorrect = true

for (const file of filesToCheck) {
  console.log(`📄 检查 ${file.name}:`)
  
  try {
    const content = readFileSync(join(projectRoot, file.path), 'utf8')
    
    // 检查 handleMoreGames 函数
    const handleMoreGamesMatch = content.match(/const handleMoreGames = \(\) => \{[\s\S]*?\}/m)
    
    if (!handleMoreGamesMatch) {
      console.log(`  ❌ 未找到 handleMoreGames 函数`)
      allCorrect = false
      continue
    }
    
    const functionBody = handleMoreGamesMatch[0]
    
    if (functionBody.includes(file.expectedNav)) {
      console.log(`  ✅ 导航正确: ${file.description}`)
      console.log(`     ${file.expectedNav}`)
    } else {
      console.log(`  ❌ 导航不正确`)
      console.log(`     期望: ${file.expectedNav}`)
      console.log(`     实际: ${functionBody}`)
      allCorrect = false
    }
    
  } catch (error) {
    console.log(`  ❌ 读取文件失败: ${error.message}`)
    allCorrect = false
  }
  
  console.log()
}

// 检查路由配置
console.log('🛣️  检查路由配置:')

try {
  const appContent = readFileSync(join(projectRoot, 'src/App.jsx'), 'utf8')
  
  const routes = [
    { path: '/', component: 'HomePage', description: '主页 - 游戏列表' },
    { path: '/game', component: 'GamePage', description: '单个游戏页面 (需要 id 参数)' },
    { path: '/game/random', component: 'RandomGamePage', description: '每日随机游戏' },
    { path: '/game2', component: 'HomePage2', description: 'Game2 主页 - 游戏列表' },
    { path: '/game3', component: 'HomePage3', description: 'Game3 主页 - 游戏列表' }
  ]
  
  for (const route of routes) {
    if (appContent.includes(`path="${route.path}"`) && appContent.includes(route.component)) {
      console.log(`  ✅ ${route.path} -> ${route.component}`)
      console.log(`     ${route.description}`)
    } else {
      console.log(`  ❌ ${route.path} 路由配置不正确`)
      allCorrect = false
    }
  }
  
} catch (error) {
  console.log(`  ❌ 读取路由配置失败: ${error.message}`)
  allCorrect = false
}

console.log()

if (allCorrect) {
  console.log('✅ 所有导航配置正确！')
  console.log()
  console.log('📋 导航流程:')
  console.log('  1. /game/random (每日游戏) -> 点击 More Games -> / (游戏列表)')
  console.log('  2. /game2/random (每日游戏) -> 点击 More Games -> /game2 (游戏列表)')
  console.log('  3. /game3/random (每日游戏) -> 点击 More Games -> /game3 (游戏列表)')
  console.log('  4. /game?id=xxx (单个游戏) -> 点击 More Games -> / (游戏列表)')
  process.exit(0)
} else {
  console.log('⚠️  发现导航配置问题，请检查上述错误')
  process.exit(1)
}
