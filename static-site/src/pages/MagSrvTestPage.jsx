import { useEffect, useState } from 'react'
import MagSrvAd from '../components/MagSrvAd'

export default function MagSrvTestPage() {
  const [debugInfo, setDebugInfo] = useState({
    scriptLoaded: false,
    adProviderExists: false,
    insElementExists: false,
    errors: []
  })

  useEffect(() => {
    const checkAdStatus = () => {
      const info = {
        scriptLoaded: !!document.querySelector('script[src*="magsrv.com/ad-provider.js"]'),
        adProviderExists: !!window.AdProvider,
        insElementExists: !!document.querySelector('ins.eas6a97888e10'),
        errors: []
      }

      // Check for console errors
      const originalError = console.error
      console.error = (...args) => {
        if (args.some(arg => typeof arg === 'string' && arg.includes('magsrv'))) {
          info.errors.push(args.join(' '))
        }
        originalError.apply(console, args)
      }

      setDebugInfo(info)
    }

    // Check status every 2 seconds
    const interval = setInterval(checkAdStatus, 2000)
    checkAdStatus() // Initial check

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>MagSrv Ad Test Page</h1>
      <p>This page tests the MagSrv advertisement implementation for /game2/random</p>
      
      <div style={{ 
        border: '2px solid #ddd', 
        padding: '20px', 
        margin: '20px 0',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>MagSrv Ad Zone 5728338:</h3>
        <div style={{ 
          border: '1px dashed #999', 
          minHeight: '120px',
          backgroundColor: 'white',
          position: 'relative'
        }}>
          <MagSrvAd zoneId="5728338" />
        </div>
      </div>

      <div style={{ 
        border: '2px solid #007acc', 
        padding: '20px', 
        margin: '20px 0',
        borderRadius: '8px',
        backgroundColor: '#f0f8ff'
      }}>
        <h3>Debug Information:</h3>
        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          <p><strong>Zone ID:</strong> 5728338</p>
          <p><strong>Script URL:</strong> https://a.magsrv.com/ad-provider.js</p>
          <p><strong>Current URL:</strong> {window.location.href}</p>
          <p><strong>User Agent:</strong> {navigator.userAgent}</p>
          
          <h4>Ad Loading Status:</h4>
          <ul>
            <li>Script Loaded: {debugInfo.scriptLoaded ? '✅ Yes' : '❌ No'}</li>
            <li>AdProvider Exists: {debugInfo.adProviderExists ? '✅ Yes' : '❌ No'}</li>
            <li>INS Element Exists: {debugInfo.insElementExists ? '✅ Yes' : '❌ No'}</li>
          </ul>

          {debugInfo.errors.length > 0 && (
            <div>
              <h4>Errors:</h4>
              <ul style={{ color: 'red' }}>
                {debugInfo.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div style={{ 
        border: '2px solid #28a745', 
        padding: '20px', 
        margin: '20px 0',
        borderRadius: '8px',
        backgroundColor: '#f8fff8'
      }}>
        <h3>Expected HTML Structure:</h3>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '12px',
          overflow: 'auto'
        }}>
{`<script async type="application/javascript" src="https://a.magsrv.com/ad-provider.js"></script>
<ins class="eas6a97888e10" data-zoneid="5728338"></ins>
<script>(AdProvider = window.AdProvider || []).push({"serve": {}});</script>`}
        </pre>
      </div>

      <div style={{ 
        border: '2px solid #ffc107', 
        padding: '20px', 
        margin: '20px 0',
        borderRadius: '8px',
        backgroundColor: '#fffdf0'
      }}>
        <h3>Browser Console Check:</h3>
        <p>Open browser developer tools (F12) and check:</p>
        <ol>
          <li>Network tab: Look for requests to magsrv.com</li>
          <li>Console tab: Check for any JavaScript errors</li>
          <li>Elements tab: Look for &lt;ins class="eas6a97888e10"&gt; element</li>
          <li>Check if window.AdProvider exists in console</li>
        </ol>
      </div>

      <div style={{ marginTop: '40px' }}>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
        
        <button 
          onClick={() => {
            console.log('AdProvider:', window.AdProvider)
            console.log('Script element:', document.querySelector('script[src*="magsrv.com"]'))
            console.log('INS element:', document.querySelector('ins.eas6a97888e10'))
          }} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '10px'
          }}
        >
          Log Debug Info
        </button>
      </div>
    </div>
  )
}