import { useEffect, useRef, useState } from 'react'

export default function MagSrvAd({ zoneId = '5728338', className = '' }) {
  const adRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let timeoutId

    const loadMagSrvScript = () => {
      // Add preconnect for MagSrv if not already present
      if (!document.querySelector('link[href*="magsrv.com"]')) {
        const preconnect = document.createElement('link')
        preconnect.rel = 'preconnect'
        preconnect.href = 'https://a.magsrv.com'
        document.head.appendChild(preconnect)
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="magsrv.com/ad-provider.js"]')
      if (existingScript) {
        // Script exists, initialize ad
        initializeAd()
        return
      }

      // Create and load script
      const script = document.createElement('script')
      script.async = true
      script.type = 'application/javascript'
      script.src = 'https://a.magsrv.com/ad-provider.js'
      
      script.onload = () => {
        initializeAd()
      }
      
      script.onerror = () => {
        console.error('Failed to load MagSrv script')
        setError(true)
        setIsLoading(false)
      }
      
      document.head.appendChild(script)
    }

    const initializeAd = () => {
      if (adRef.current) {
        try {
          // Create the ins element for the ad
          const insElement = document.createElement('ins')
          insElement.className = 'eas6a97888e10'
          insElement.setAttribute('data-zoneid', zoneId)
          
          // Clear any existing content and add the ins element
          adRef.current.innerHTML = ''
          adRef.current.appendChild(insElement)
          
          // Initialize AdProvider
          if (window.AdProvider) {
            window.AdProvider.push({"serve": {}})
          } else {
            // If AdProvider is not ready, initialize it
            window.AdProvider = window.AdProvider || []
            window.AdProvider.push({"serve": {}})
          }
          
          setIsLoading(false)
          setError(false)
        } catch (err) {
          console.error('Error initializing MagSrv ad:', err)
          setError(true)
          setIsLoading(false)
        }
      }
    }

    // Start loading process
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
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '14px'
        }}
      >
        Advertisement
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isLoading ? '#f5f5f5' : 'transparent'
      }}
    >
      {isLoading && (
        <div style={{ color: '#666', fontSize: '14px' }}>
          Loading advertisement...
        </div>
      )}
    </div>
  )
}