import { useEffect, useRef, useState } from 'react'

export default function MagSrvAd({ zoneId = '5728338', className = '' }) {
  const containerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    let mounted = true
    let adInitialized = false

    const initializeAd = async () => {
      if (!mounted || !containerRef.current) return

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
              setScriptLoaded(true)
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
          setScriptLoaded(true)
        }

        // Wait for AdProvider to be available
        let attempts = 0
        while (!window.AdProvider && attempts < 20) {
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }

        if (!mounted || !containerRef.current || adInitialized) return

        // Clear container safely
        containerRef.current.innerHTML = ''
        
        // Create ins element
        const insElement = document.createElement('ins')
        insElement.className = 'eas6a97888e10'
        insElement.setAttribute('data-zoneid', zoneId)
        
        // Append to container
        containerRef.current.appendChild(insElement)
        setDebugInfo(prev => prev + '\nINS element created and appended')
        
        // Initialize AdProvider
        window.AdProvider = window.AdProvider || []
        window.AdProvider.push({"serve": {}})
        adInitialized = true
        
        console.log(`[MagSrvAd] Ad initialized for zone ${zoneId}`)
        setDebugInfo(prev => prev + '\nAdProvider initialized')
        
        if (mounted) {
          setIsLoading(false)
          setError(false)
        }

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
      if (containerRef.current) {
        try {
          containerRef.current.innerHTML = ''
        } catch (cleanupError) {
          console.warn('[MagSrvAd] Cleanup warning:', cleanupError)
        }
      }
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
        position: 'relative',
        backgroundColor: isLoading ? '#f5f5f5' : 'transparent',
        border: process.env.NODE_ENV === 'development' ? '1px dashed #ccc' : 'none'
      }}
    >
      {isLoading && (
        <div style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#666', 
          fontSize: '14px' 
        }}>
          Loading MagSrv advertisement...
        </div>
      )}
      
      <div 
        ref={containerRef}
        style={{ 
          width: '100%', 
          minHeight: '100px',
          textAlign: 'center'
        }}
      />
      
      {process.env.NODE_ENV === 'development' && (
        <details style={{ marginTop: '10px', fontSize: '10px', width: '100%' }}>
          <summary>Debug Info (Zone: {zoneId}) - Script: {scriptLoaded ? '✅' : '❌'}</summary>
          <pre style={{ whiteSpace: 'pre-wrap', maxHeight: '100px', overflow: 'auto', fontSize: '9px' }}>
            {debugInfo}
          </pre>
        </details>
      )}
    </div>
  )
}