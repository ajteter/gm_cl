import { useState } from 'react'

export default function MagSrvIframeAd({ 
  zoneId = '5728338', 
  width = 300, 
  height = 50, 
  className = '' 
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    console.log(`[MagSrvIframeAd] Iframe loaded for zone ${zoneId}`)
    setIsLoading(false)
    setError(false)
  }

  const handleError = () => {
    console.error(`[MagSrvIframeAd] Iframe failed to load for zone ${zoneId}`)
    setIsLoading(false)
    setError(true)
  }

  if (error) {
    return (
      <div 
        className={className}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '12px',
          backgroundColor: '#ffe6e6',
          border: '1px solid #ffcccc',
          borderRadius: '4px'
        }}
      >
        Advertisement (Error)
      </div>
    )
  }

  return (
    <div 
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        backgroundColor: isLoading ? '#f5f5f5' : 'transparent',
        border: process.env.NODE_ENV === 'development' ? '1px dashed #ccc' : 'none',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    >
      {isLoading && (
        <div style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#666', 
          fontSize: '12px',
          zIndex: 1
        }}>
          Loading ad...
        </div>
      )}
      
      <iframe 
        src={`//a.magsrv.com/iframe.php?idzone=${zoneId}&size=${width}x${height}`}
        width={width}
        height={height}
        scrolling="no"
        marginWidth="0"
        marginHeight="0"
        frameBorder="0"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          border: 'none',
          display: 'block',
          width: '100%',
          height: '100%'
        }}
        title={`MagSrv Advertisement Zone ${zoneId}`}
      />
      
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          marginTop: '5px', 
          fontSize: '10px', 
          color: '#666',
          textAlign: 'center'
        }}>
          MagSrv Iframe - Zone: {zoneId} ({width}x{height})
        </div>
      )}
    </div>
  )
}