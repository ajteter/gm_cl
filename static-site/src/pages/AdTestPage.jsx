import AdcashAd from '../components/AdcashAd'

export default function AdTestPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Adcash Ad Test Page</h1>
      <p>This page is for testing Adcash ads outside of iframe.</p>
      
      <div style={{ 
        border: '2px solid #ddd', 
        padding: '20px', 
        margin: '20px 0',
        borderRadius: '8px'
      }}>
        <h3>Adcash Ad Zone 10422246:</h3>
        <AdcashAd zoneId="10422246" />
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h3>Debug Information:</h3>
        <p>Zone ID: 10422246</p>
        <p>Script URL: //acscdn.com/script/aclib.js</p>
        <p>Current URL: {window.location.href}</p>
        <p>User Agent: {navigator.userAgent}</p>
      </div>
    </div>
  )
}