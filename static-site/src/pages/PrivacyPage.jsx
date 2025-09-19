import { usePrivacySEO } from '../hooks/useSEO'

export default function PrivacyPage() {
  // Set up SEO for privacy page
  usePrivacySEO()
  return (
    <div className="container" style={{ padding: '2rem', color: '#333', backgroundColor: 'white' }}>
      <h1>Privacy Policy & Disclaimer</h1>
      <p>Last updated: December 19, 2024</p>

      <h2>About This Website</h2>
      <p>
        This website is primarily designed for use within mobile application webviews and provides access to HTML5 games and related content.
      </p>

      <h2>Privacy Policy</h2>
      <p>
        This website is a free-to-use service. We and our advertising partners use cookies and other tracking technologies to display personalized advertisements and to analyze our traffic.
      </p>

      <p>
        By using our website, you hereby consent to our Privacy Policy and agree to its terms.
      </p>

      <h2>Content Disclaimer</h2>
      <p>
        The games provided on this website are sourced from various third-party content providers. We do not host this content on our own servers and act solely as an aggregator service.
      </p>

      <p>
        All games are provided "as is" without any warranties or guarantees regarding their functionality, content, or availability.
      </p>

      <h2>Advertising Disclaimer</h2>
      <p>
        The advertisements displayed on this website are served by third-party advertising networks. We do not control the content of these advertisements.
      </p>

      <p>
        Advertisement content and targeting are managed by external advertising services, and we are not responsible for the accuracy or appropriateness of advertised content.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        This website acts as an aggregator and does not assume responsibility for:
      </p>
      <ul>
        <li>The content, functionality, or availability of external games</li>
        <li>The content or targeting of third-party advertisements</li>
        <li>Any damages or issues arising from the use of external content</li>
        <li>The privacy practices of third-party content or advertising providers</li>
      </ul>

      <h2>Webview Usage</h2>
      <p>
        This website is optimized for use within mobile application webviews. Some features may not function as expected when accessed through standard web browsers.
      </p>

      <p>
        Users accessing this content through webviews should be aware that their interaction data may be subject to the privacy policies of both this website and the host application.
      </p>

      <h2>Contact</h2>
      <p>
        If you have any questions about this Privacy Policy or Disclaimer, please contact us through the appropriate channels provided by the host application.
      </p>
    </div>
  )
}