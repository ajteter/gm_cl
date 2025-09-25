import { useEffect, useRef } from 'react'

export default function HdbkomeAd({ className = '' }) {
  const containerRef = useRef(null)
  const adId = 'TefDYH390644'

  useEffect(() => {
    if (!containerRef.current) return

    // 创建广告容器
    const adDiv = document.createElement('div')
    adDiv.className = adId
    containerRef.current.appendChild(adDiv)

    // 初始化广告配置
    window.k_init = window.k_init || []
    window.k_init.push({
      id: adId,
      type: 'bn',
      domain: 'hdbkome.com',
      refresh: false,
      next: 0
    })

    // 加载广告脚本
    const script = document.createElement('script')
    script.async = true
    script.charset = 'utf-8'
    script.setAttribute('data-cfasync', 'false')
    script.src = 'https://hdbkome.com/12q00btt.js'
    document.head.appendChild(script)

    return () => {
      // 清理
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ minHeight: '100px', textAlign: 'center' }}
    />
  )
}