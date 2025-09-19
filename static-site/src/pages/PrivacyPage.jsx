import { usePrivacySEO } from '../hooks/useSEO'

export default function PrivacyPage() {
  // Set up SEO for privacy page
  usePrivacySEO()
  return (
    <div className="container" style={{ padding: '2rem', color: '#333', backgroundColor: 'white' }}>
      <h1>Privacy Policy & Disclaimer</h1>
      <p>Last updated: August 28, 2025</p>

      <h2>Privacy Policy</h2>
      <p>
        This website is a free-to-use service. We and our advertising partners use cookies and other tracking technologies to display personalized ads and to analyze our traffic.
      </p>
      
      <p>
        By using our website, you hereby consent to our Privacy Policy and agree to its terms.
      </p>

      <h2>Disclaimer</h2>
      <p>
        The games provided on this website are sourced from third-party sites, including but not limited to gamemonetize.com. We do not host this content on our own servers.
      </p>
      <p>
        The advertisements displayed on this website are served by third-party advertising networks, including but not limited to gamemonetize.com.
      </p>
      <p>
        This website acts as an aggregator and does not assume responsibility for the content of the external sites, the games they provide, or the advertisements they display.
      </p>
    </div>
  )
}