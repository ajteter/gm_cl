import { useEffect, useState } from 'react'

export default function MagSrvAd({ zoneId = '5728338', className = '' }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')
  const [adHtml, setAdHtml] = useState('')

  useEffect(() => {
    let mounted = true

    const initializeAd = async () => {
      if (!mounted) return

      try {
        console.log(`[MagSrvAd] Initializing ad for zone ${zoneId}`)
        setDebugInfo(`Initializing ad for zone ${zoneId}...`)

        // Add preconnect for performance
        if (!document.querySelector('link[href*="magsrv.com"]')) {
          const preconnect = document.createElement('link')
          preconnect.rel = 'preconnect'
          preconnect.href = 'https://a.magsrv.com'
          document.head.appendChild(preconnect)
          setDebugInfo(prev => prev + '\nPreconnect added')
        }

        // Load script if not already loaded
        if (!document.querySelector('script[src*="magsrv.com/ad-provider.js"]')) {
          const scriptElement = document.createElement('script')
          scriptElement.async = true
          scriptElement.type = 'application/javascript'
          scriptElement.src = 'https://a.magsrv.com/ad-provider.js'
          
          // Wait for script to load
          await new Promise((resolve, reject) => {
            scriptElement.onload = () => {
              console.log('[MagSrvAd] Script loaded successfully')
              setDebugInfo(prev => prev + '\nScript loaded successfully')
              resolve()
            }
            scriptElement.onerror = (err) => {
              console.error('[MagSrvAd] Script load error:', err)
              setDebugInfo(prev => prev + '\nScript load error: ' + err.message)
              reject(err)
            }
            document.head.appendChild(scriptElement)
          })
        } else {
          setDebugInfo(prev => prev + '\nScript already loaded')
        }

        // Wait a bit for AdProvider to be ready
        await new Promise(resolve => setTimeout(resolve, 500))

        if (!mounted) return

        // Create the ad HTML structure
        const adStructure = `<ins class="eas6a97888e10" data-zoneid="${zoneId}"></ins>`
        setAdHtml(adStructure)
        setDebugInfo(prev => prev + '\nINS element HTML created')
        
        // Initialize AdProvider after a short delay to ensure DOM is ready
        setTimeout(() => {
          if (mounted) {
            try {
              window.AdProvider = window.AdProvider || []
              window.AdProvider.push({"serve": {}})
              console.log(`[MagSrvAd] Ad initialized for zone ${zoneId}`)
              setDebugInfo(prev => prev + '\nAdProvider initialized')
              setIsLoading(false)
              setError(false)
            } catch (providerError) {
              console.error('[MagSrvAd] AdProvider error:', providerError)
              setDebugInfo(prev => prev + '\nAdProvider error: ' + providerError.message)
              setError(true)
              setIsLoading(false)
            }
          }
        }, 100)

      } catch (err) {
        console.error('[MagSrvAd] Error:', err)
        setDebugInfo(prev => prev + '\nError: ' + err.message)
        if (mounted) {
          setError(true)
          setIsLoading(false)
        }
      }
    }

    // Start initialization
    initializeAd()

    // Cleanup
    return () => {
      mounted = false
    }
  }, [zoneId])

  if (error) {
    return (
      <div 
        className={className}
        style={{
          width: '100%',
          minHeight: '100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '12px',
          backgroundColor: '#ffe6e6',
          border: '1px solid #ffcccc',
          padding: '10px'
        }}
      >
        <div>Advertisement (Error)</div>
        {process.env.NODE_ENV === 'development' && (
          <details style={{ marginTop: '10px', fontSize: '10px' }}>
            <summary>Debug Info</summary>
            <pre style={{ whiteSpace: 'pre-wrap', maxHeight: '100px', overflow: 'auto' }}>
              {debugInfo}
            </pre>
          </details>
        )}
      </div>
    )
  }

  return (
    <div 
      className={className}
      style={{
        width: '100%',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isLoading ? '#f5f5f5' : 'transparent',
        border: process.env.NODE_ENV === 'development' ? '1px dashed #ccc' : 'none'
      }}
    >
      {isLoading && (
        <div style={{ color: '#666', fontSize: '14px' }}>
          Loading MagSrv advertisement...
        </div>
      )}
      
      {!isLoading && !error && adHtml && (
        <div 
          dangerouslySetInnerHTML={{ __html: adHtml }}
          style={{ width: '100%', textAlign: 'center' }}
        />
      )}
      
      {process.env.NODE_ENV === 'development' && (
        <details style={{ marginTop: '10px', fontSize: '10px', width: '100%' }}>
          <summary>Debug Info (Zone: {zoneId})</summary>
          <pre style={{ whiteSpace: 'pre-wrap', maxHeight: '100px', overflow: 'auto', fontSize: '9px' }}>
            {debugInfo}
          </pre>
        </details>
      )}
    </div>
  )
}