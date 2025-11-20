#!/usr/bin/env node

/**
 * 检查部署内容是否包含 Game3 系统
 */

import fetch from 'node-fetch'

console.log('🔍 检查部署内容...\n')

async function checkDeployedContent() {
  try {
    // 获取主页面内容
    const response = await fetch('https://yingbo.site/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      console.log('❌ 无法访问主页面')
      return
    }
    
    const html = await response.text()
    
    console.log('📄 主页面分析:')
    
    // 检查是否包含 Game3 相关的 JavaScript 文件
    const game3JSRegex = /page-game3page-[a-zA-Z0-9]+\.js/g
    const game3Matches = html.match(game3JSRegex)
    
    if (game3Matches) {
      console.log(`  ✅ 找到 Game3 页面 JS: ${game3Matches.join(', ')}`)
    } else {
      console.log('  ❌ 未找到 Game3 页面 JS 文件')
    }
    
    // 检查 RandomGame3Page
    const randomGame3JSRegex = /page-randomgame3page-[a-zA-Z0-9]+\.js/g
    const randomGame3Matches = html.match(randomGame3JSRegex)
    
    if (randomGame3Matches) {
      console.log(`  ✅ 找到 RandomGame3Page JS: ${randomGame3Matches.join(', ')}`)
    } else {
      console.log('  ❌ 未找到 RandomGame3Page JS 文件')
    }
    
    // 检查 HomePage3
    const homepage3JSRegex = /page-homepage3-[a-zA-Z0-9]+\.js/g
    const homepage3Matches = html.match(homepage3JSRegex)
    
    if (homepage3Matches) {
      console.log(`  ✅ 找到 HomePage3 JS: ${homepage3Matches.join(', ')}`)
    } else {
      console.log('  ❌ 未找到 HomePage3 JS 文件')
    }
    
    console.log()
    
    // 直接测试 Game3 路由
    console.log('🛣️ 测试 Game3 路由:')
    
    const routes = [
      '/game3',
      '/game3/random',
      '/game3/play'
    ]
    
    for (const route of routes) {
      try {
        const routeResponse = await fetch(`https://yingbo.site${route}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        })
        
        if (routeResponse.ok) {
          const routeHtml = await routeResponse.text()
          
          // 检查是否返回了正确的 SPA 页面
          if (routeHtml.includes('<!DOCTYPE html>') && routeHtml.includes('root')) {
            console.log(`  ✅ ${route} - 返回 SPA 页面`)
            
            // 检查是否包含 Game3 相关内容
            if (routeHtml.includes('game3') || routeHtml.includes('Game3')) {
              console.log(`    ✅ 包含 Game3 相关内容`)
            } else {
              console.log(`    ⚠️  未明确包含 Game3 内容（可能是 SPA 动态加载）`)
            }
          } else {
            console.log(`  ❌ ${route} - 返回内容异常`)
          }
        } else {
          console.log(`  ❌ ${route} - 状态码: ${routeResponse.status}`)
        }
      } catch (error) {
        console.log(`  ❌ ${route} - 错误: ${error.message}`)
      }
    }
    
  } catch (error) {
    console.log(`❌ 检查失败: ${error.message}`)
  }
}

// 检查 _redirects 文件配置
async function checkRedirects() {
  console.log()
  console.log('🔄 检查重定向配置:')
  
  try {
    const response = await fetch('https://yingbo.site/_redirects', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (response.ok) {
      const redirects = await response.text()
      console.log('  ✅ _redirects 文件可访问')
      
      if (redirects.includes('/game3/*')) {
        console.log('  ✅ Game3 路由重定向已配置')
      } else {
        console.log('  ❌ Game3 路由重定向未配置')
      }
    } else {
      console.log('  ❌ _redirects 文件不可访问')
    }
  } catch (error) {
    console.log(`  ❌ 检查重定向配置失败: ${error.message}`)
  }
}

async function main() {
  await checkDeployedContent()
  await checkRedirects()
  
  console.log()
  console.log('📋 总结:')
  console.log('  如果 Game3 路由返回 SPA 页面但内容不正确，可能需要:')
  console.log('  1. 重新部署最新代码')
  console.log('  2. 清除 Cloudflare 缓存')
  console.log('  3. 检查路由配置是否正确')
}

main().catch(console.error)