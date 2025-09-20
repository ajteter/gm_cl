import { useEffect, useRef, useState } from 'react'

export default function MagSrvAd({ zoneId = '5728338', className = '' }) {
  const adRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    let timeoutId
    let retryCount = 0
    const maxRetries = 3

    const addDebugInfo = (info) => {
      console.log(`[MagSrvAd] ${info}`)
      setDebugInfo(prev => prev + `\n${new Date().toLocaleTimeString()}: ${info}`)
    }

    const loadMagSrvScript = () => {
      addDebugInfo(`Loading MagSrv script for zone ${zoneId}`)
      
      // Add preconnect for MagSrv if not already present
      if (!document.querySelector('link[href*="magsrv.com"]')) {
        const preconnect = document.createElement('link')
        preconnect.rel = 'preconnect'
        preconnect.href = 'https://a.magsrv.com'
        document.head.appendChild(preconnect)
        addDebugInfo('Added preconnect for magsrv.com')
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="magsrv.com/ad-provider.js"]')
      if (existingScript) {
        addDebugInfo('MagSrv script already exists, initializing ad')
        // Wait a bit for script to be ready
        timeoutId = setTimeout(() => {
          initializeAd()
        }, 500)
        return
      }

      // Create and load script
      const script = document.createElement('script')
      script.async = true
      script.type = 'application/javascript'
      script.src = 'https://a.magsrv.com/ad-provider.js'
      
      script.onload = () => {
        addDebugInfo('MagSrv script loaded successfully')
        // Wait a bit for AdProvider to be ready
        timeoutId = setTimeout(() => {
          initializeAd()
        }, 1000)
      }
      
      script.onerror = () => {
        addDebugInfo('Failed to load MagSrv script')
        if (retryCount < maxRetries) {
          retryCount++
          addDebugInfo(`Retrying... (${retryCount}/${maxRetries})`)
          timeoutId = setTimeout(loadMagSrvScript, 2000)
        } else {
          setError(true)
          setIsLoading(false)
        }
      }
      
      document.head.appendChild(script)
      addDebugInfo('MagSrv script element added to head')
    }

    const initializeAd = () => {
      if (!adRef.current) {
        addDebugInfo('Ad container ref not available')
        return
      }

      try {
        addDebugInfo('Initializing MagSrv ad')
        
        // Create the ins element for the ad
        const insElement = document.createElement('ins')
        insElement.className = 'eas6a97888e10'
        insElement.setAttribute('data-zoneid', zoneId)
        
        // Clear any existing content and add the ins element
        adRef.current.innerHTML = ''
        adRef.current.appendChild(insElement)
        
        addDebugInfo(`Created ins element with zone ID: ${zoneId}`)
        
        // Initialize AdProvider
        window.AdProvider = window.AdProvider || []
        
        // Push the serve command
        window.AdProvider.push({"serve": {}})
        
        addDebugInfo(`AdProvider initialized. Queue length: ${window.AdProvider.length}`)
        
        setIsLoading(false)
        setError(false)
        
        // Check if ad loaded after a delay
        timeoutId = setTimeout(() => {
          const hasAdContent = adRef.current && adRef.current.children.length > 1
          addDebugInfo(`Ad content check: ${hasAdContent ? 'Content found' : 'No content yet'}`)
        }, 3000)
        
      } catch (err) {
        addDebugInfo(`Error initializing MagSrv ad: ${err.message}`)
        setError(true)
        setIsLoading(false)
      }
    }

    // Start loading process
    addDebugInfo('Starting MagSrv ad loading process')
    loadMagSrvScript()

    // Cleanup timeout on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
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
      ref={adRef} 
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