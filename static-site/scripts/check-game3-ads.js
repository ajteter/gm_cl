#!/usr/bin/env node

/**
 * Game3 Ad Configuration Checker
 * 检查 Game3 系统的广告配置是否正确
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🔍 检查 Game3 系统广告配置...\n')

// 检查 Game3 相关文件
const game3Files = {
  'GameClientUI3': 'src/components/GameClientUI3.jsx',
  'HdbkomeAd': 'src/components/HdbkomeAd.jsx',
  'RandomGame3Page': 'src/pages/RandomGame3Page.jsx'
}

console.log('📁 Game3 系统文件检查:')
let filesOk = true

for (const [name, file] of Object.entries(game3Files)) {
  const filePath = join(projectRoot, file)
  const exists = existsSync(filePath)
  
  if (exists) {
    console.log(`  ✅ ${name}: ${file}`)
  } else {
    console.log(`  ❌ ${name}: ${file} - 文件不存在`)
    filesOk = false
  }
}

console.log()

// 检查广告配置
console.log('📺 广告配置检查:')

try {
  // 检查 HdbkomeAd 配置
  const hdbkomeAdContent = readFileSync(join(projectRoot, 'src/components/HdbkomeAd.jsx'), 'utf8')
  
  console.log('  HdbkomeAd 组件:')
  
  // 检查广告 ID
  if (hdbkomeAdContent.includes('TefDYH390644')) {
    console.log('    ✅ 广告 ID: TefDYH390644')
  } else {
    console.log('    ❌ 广告 ID 未找到')
  }
  
  // 检查广告脚本 URL
  if (hdbkomeAdContent.includes('https://hdbkome.com/12q00btt.js')) {
    console.log('    ✅ 广告脚本: https://hdbkome.com/12q00btt.js')
  } else {
    console.log('    ❌ 广告脚本 URL 未找到')
  }
  
  // 检查广告配置
  if (hdbkomeAdContent.includes('domain: \'hdbkome.com\'')) {
    console.log('    ✅ 广告域名: hdbkome.com')
  } else {
    console.log('    ❌ 广告域名配置未找到')
  }
  
  // 检查 GameClientUI3 中的广告集成
  const gameUI3Content = readFileSync(join(projectRoot, 'src/components/GameClientUI3.jsx'), 'utf8')
  
  console.log('  GameClientUI3 广告集成:')
  
  if (gameUI3Content.includes('import HdbkomeAd from \'./HdbkomeAd\'')) {
    console.log('    ✅ HdbkomeAd 组件已导入')
  } else {
    console.log('    ❌ HdbkomeAd 组件未导入')
  }
  
  if (gameUI3Content.includes('<HdbkomeAd />')) {
    console.log('    ✅ HdbkomeAd 组件已使用')
  } else {
    console.log('    ❌ HdbkomeAd 组件未使用')
  }
  
  if (gameUI3Content.includes('adContainer')) {
    console.log('    ✅ 广告容器已配置')
  } else {
    console.log('    ❌ 广告容器未配置')
  }
  
} catch (error) {
  console.log('  ❌ 无法读取广告配置文件')
  console.error('  错误:', error.message)
}

console.log()

// 检查路由配置
console.log('🛣️ 路由配置检查:')

try {
  const appContent = readFileSync(join(projectRoot, 'src/App.jsx'), 'utf8')
  
  const game3Routes = [
    '/game3',
    '/game3/random', 
    '/game3/play'
  ]
  
  for (const route of game3Routes) {
    if (appContent.includes(`path="${route}"`)) {
      console.log(`  ✅ ${route}`)
    } else {
      console.log(`  ❌ ${route} - 路由未找到`)
    }
  }
  
  // 检查 RandomGame3Page 导入
  if (appContent.includes('RandomGame3Page')) {
    console.log('  ✅ RandomGame3Page 已导入')
  } else {
    console.log('  ❌ RandomGame3Page 未导入')
  }
  
} catch (error) {
  console.log('  ❌ 无法读取路由配置')
}

console.log()

// 广告网络信息
console.log('📊 广告网络信息:')
console.log('  网络: Hdbkome')
console.log('  域名: hdbkome.com')
console.log('  广告 ID: TefDYH390644')
console.log('  脚本: https://hdbkome.com/12q00btt.js')
console.log('  类型: Banner 广告')

console.log()

// 测试建议
console.log('🧪 测试建议:')
console.log('  1. 访问 https://yingbo.site/game3/random')
console.log('  2. 检查页面底部是否显示广告')
console.log('  3. 打开浏览器开发者工具检查:')
console.log('     - Network 标签页查看是否加载了 hdbkome.com 脚本')
console.log('     - Console 标签页查看是否有广告相关错误')
console.log('     - Elements 标签页查看是否有 TefDYH390644 类名的元素')
console.log('  4. 检查广告容器是否有内容加载')

console.log()
console.log('✅ Game3 广告配置检查完成')