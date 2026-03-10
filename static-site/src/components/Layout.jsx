import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://h5-games-static.pages.dev'

function Layout({ children }) {
  const location = useLocation()

  // Update document title and meta tags based on route
  useEffect(() => {
    let title = 'H5 Games - Free Mobile Games'
    let description = 'Play free HTML5 games on mobile. Fast loading games optimized for mobile webview.'

    switch (location.pathname) {
      case '/game':
        title = 'All Games | H5 Games'
        description = 'Browse our collection of free HTML5 games for mobile.'
        break
      case '/game/random':
        title = 'Daily Game | H5 Games'
        description = "Play today's featured HTML5 game on mobile."
        break
      case '/game/play':
        title = 'Play Game | H5 Games'
        description = 'Playing HTML5 game on mobile.'
        break
      case '/privacy-policy':
        title = 'Privacy Policy | H5 Games'
        description = 'Privacy policy for H5 Games website.'
        break
    }

    // Update document title
    document.title = title

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', title)

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) ogDescription.setAttribute('content', description)

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', `${SITE_URL}${location.pathname}`)
    } else {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      canonical.href = `${SITE_URL}${location.pathname}`
      document.head.appendChild(canonical)
    }
  }, [location])

  // Add structured data on mount (once)
  useEffect(() => {
    if (!document.querySelector('script[type="application/ld+json"]')) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "H5 Games",
        "description": "Free HTML5 games for mobile",
        "url": SITE_URL,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${SITE_URL}/game?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }

      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }
  }, [])

  return children
}

export default Layout