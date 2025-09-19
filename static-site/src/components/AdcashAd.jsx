import { useEffect, useRef, useState } from 'react'

export default function AdcashAd({ zoneId = '10422246', className = '' }) {
  const adRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let timeoutId

    const loadAdcashScript = () => {
      // Add preconnect for Adcash if not already present
      if (!document.querySelector('link[href*="acscdn.com"]')) {
        const preconnect = document.createElement('link')
        preconnect.rel = 'preconnect'
        preconnect.href = 'https://acscdn.com'
        document.head.appendChild(preconnect)
      }

      // Check if script already exists
      const existingScript = document.getElementById('aclib')
      if (existingScript) {
        // Script exists, check if aclib is available
        if (window.aclib) {
          runBanner()
        } else {
          // Wait for script to load
          existingScript.onload = runBanner
        }
        return
      }

      // Create and load script
      const script = document.createElement('script')
      script.id = 'aclib'
      script.type = 'text/javascript'
      script.src = '//acscdn.com/script/aclib.js'
      script.async = true
      
      script.onload = () => {
        runBanner()
      }
      
      script.onerror = () => {
        console.error('Failed to load Adcash script')
        setError(true)
        setIsLoading(false)
      }
      
      document.head.appendChild(script)
    }

    const runBanner = () => {
      if (window.aclib && adRef.current) {
        try {
          window.aclib.runBanner({
            zoneId: zoneId
          })
          setIsLoading(false)
          setError(false)
        } catch (err) {
          console.error('Error running Adcash banner:', err)
          setError(true)
          setIsLoading(false)
        }
      } else {
        // Retry after a short delay
        timeoutId = setTimeout(runBanner, 100)
      }
    }

    // Start loading process
    loadAdcashScript()

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