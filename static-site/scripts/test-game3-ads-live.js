#!/usr/bin/env node

/**
 * Game3 Live Ad Test
 * 测试 Game3 系统的广告是否在线上环境正常工作
 */

import fetch from 'node-fetch'

console.log('🔍 测试 Game3 系统在线广告状态...\n')

// 测试页面是否可访问
async function testPageAccess() {
  console.log('📡 测试页面访问:')
  
  try {
    const response = await fetch('https://yingbo.site/game3/random', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (response.ok) {
      console.log(`  ✅ 页面访问成功 (状态码: ${response.status})`)
      
      const html = await response.text()
      
      // 检查页面内容
      if (html.includes('1 DAY 1 GAME')) {
        console.log('  ✅ 页面标题正确')
      } else {
        console.log('  ❌ 页面标题未找到')
      }
      
      // 检查是否包含广告相关代码
      if (html.includes('TefDYH390644')) {
        console.log('  ✅ 广告 ID 存在于页面中')
      } else {
        console.log('  ❌ 广告 ID 未在页面中找到')
      }
      
      return html
    } else {
      console.log(`  ❌ 页面访问失败 (状态码: ${response.status})`)
      return null
    }
  } catch (error) {
    console.log(`  ❌ 页面访问错误: ${error.message}`)
    return null
  }
}

// 测试广告脚本是否可访问
async function testAdScript() {
  console.log('📺 测试广告脚本:')
  
  try {
    const response = await fetch('https://hdbkome.com/12q00btt.js', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (response.ok) {
      console.log(`  ✅ 广告脚本可访问 (状态码: ${response.status})`)
      
      const script = await response.text()
      
      // 检查脚本内容
      if (script.length > 100) {
        console.log(`  ✅ 脚本内容正常 (大小: ${script.length} 字符)`)
      } else {
        console.log(`  ⚠️  脚本内容较短 (大小: ${script.length} 字符)`)
      }
      
      // 检查是否包含广告相关代码
      if (script.includes('hdbkome') || script.includes('ad')) {
        console.log('  ✅ 脚本包含广告相关代码')
      } else {
        console.log('  ❌ 脚本不包含明显的广告代码')
      }
      
    } else {
      console.log(`  ❌ 广告脚本访问失败 (状态码: ${response.status})`)
    }
  } catch (error) {
    console.log(`  ❌ 广告脚本访问错误: ${error.message}`)
  }
}

// 测试广告域名
async function testAdDomain() {
  console.log('🌐 测试广告域名:')
  
  try {
    const response = await fetch('https://hdbkome.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (response.ok) {
      console.log(`  ✅ 广告域名可访问 (状态码: ${response.status})`)
    } else {
      console.log(`  ❌ 广告域名访问失败 (状态码: ${response.status})`)
    }
  } catch (error) {
    console.log(`  ❌ 广告域名访问错误: ${error.message}`)
  }
}

// 主测试函数
async function runTests() {
  await testPageAccess()
  console.log()
  
  await testAdScript()
  console.log()
  
  await testAdDomain()
  console.log()
  
  console.log('📋 测试总结:')
  console.log('  • Game3 系统使用 Hdbkome 广告网络')
  console.log('  • 广告 ID: TefDYH390644')
  console.log('  • 广告位置: 页面底部')
  console.log('  • 广告类型: Banner 广告')
  console.log()
  
  console.log('🔧 如果广告未显示，请检查:')
  console.log('  1. 浏览器是否启用了广告拦截器')
  console.log('  2. 网络连接是否正常')
  console.log('  3. 广告脚本是否被防火墙拦截')
  console.log('  4. 页面是否完全加载完成')
  console.log()
  
  console.log('🧪 手动测试步骤:')
  console.log('  1. 打开 https://yingbo.site/game3/random')
  console.log('  2. 等待页面完全加载')
  console.log('  3. 滚动到页面底部查看广告')
  console.log('  4. 打开开发者工具检查网络请求')
  console.log('  5. 查看是否有 hdbkome.com 的请求')
}

// 运行测试
runTests().catch(console.error)