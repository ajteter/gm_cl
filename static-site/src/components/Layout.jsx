import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://yourdomain.com' // This should be configured for production

function Layout({ children }) {
  const location = useLocation()

  // Update document title and meta tags based on route
  useEffect(() => {
    // Set default title
    let title = 'H5 Games - Free Mobile Games'
    let description = 'Play free HTML5 games on mobile. Fast loading games optimized for mobile webview.'
    
    // Customize based on route
    switch (location.pathname) {
      case '/game':
        title = 'All Games | H5 Games'
        description = 'Browse our collection of free HTML5 games for mobile.'
        break
      case '/game/random':
        title = 'Daily Game | H5 Games'
        description = 'Play today\'s featured HTML5 game on mobile.'
        break
      case '/game/play':
        title = 'Play Game | H5 Games'
        description = 'Playing HTML5 game on mobile.'
        break
      case '/game2':
        title = 'All Games | H5 Games'
        description = 'Browse our collection of free HTML5 games for mobile.'
        break
      case '/game2/random':
        title = 'Daily Game | H5 Games'
        description = 'Play today\'s featured HTML5 game on mobile.'
        break
      case '/game2/play':
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
    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    } else {
      metaDescription = document.createElement('meta')
      metaDescription.name = 'description'
      metaDescription.content = description
      document.head.appendChild(metaDescription)
    }

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', title)
    } else {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      ogTitle.setAttribute('content', title)
      document.head.appendChild(ogTitle)
    }

    let ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', description)
    } else {
      ogDescription = document.createElement('meta')
      ogDescription.setAttribute('property', 'og:description')
      ogDescription.setAttribute('content', description)
      document.head.appendChild(ogDescription)
    }

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

  // Set up initial meta tags and structured data on mount
  useEffect(() => {
    // Add viewport meta tag
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta')
      viewport.name = 'viewport'
      viewport.content = 'width=device-width, initial-scale=1.0'
      document.head.appendChild(viewport)
    }

    // Add referrer policy
    if (!document.querySelector('meta[name="referrer"]')) {
      const referrer = document.createElement('meta')
      referrer.name = 'referrer'
      referrer.content = 'no-referrer-when-downgrade'
      document.head.appendChild(referrer)
    }

    // Add CSP meta tag
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const csp = document.createElement('meta')
      csp.setAttribute('http-equiv', 'Content-Security-Policy')
      csp.content = 'frame-ancestors \'self\'; frame-src https: data:;'
      document.head.appendChild(csp)
    }

    // Add preconnect links
    const preconnectUrls = [
      'https://gamemonetize.com',
      'https://html5.gamemonetize.com',
      'https://api.gamemonetize.com',
      'https://ads.gamemonetize.com',
      'https://cdn.gamemonetize.com',
      'https://pl27551037.revenuecpmgate.com',
      'https://pl27523592.revenuecpmgate.com'
    ]

    preconnectUrls.forEach(url => {
      if (!document.querySelector(`link[href="${url}"]`)) {
        const link = document.createElement('link')
        link.rel = 'preconnect'
        link.href = url
        document.head.appendChild(link)
      }
    })

    // Add DNS prefetch links
    const dnsPrefetchUrls = [
      '//gamemonetize.com',
      '//html5.gamemonetize.com',
      '//pl27551037.revenuecpmgate.com',
      '//pl27523592.revenuecpmgate.com'
    ]

    dnsPrefetchUrls.forEach(url => {
      if (!document.querySelector(`link[href="${url}"]`)) {
        const link = document.createElement('link')
        link.rel = 'dns-prefetch'
        link.href = url
        document.head.appendChild(link)
      }
    })

    // Add structured data
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

    // Add other meta tags
    const metaTags = [
      { name: 'keywords', content: 'HTML5 games, mobile games, free games, browser games, webview games' },
      { name: 'author', content: 'H5 Games' },
      { name: 'creator', content: 'H5 Games' },
      { name: 'publisher', content: 'H5 Games' },
      { name: 'format-detection', content: 'telephone=no, email=no, address=no' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'en_US' }
    ]

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`
      if (!document.querySelector(selector)) {
        const meta = document.createElement('meta')
        if (name) meta.name = name
        if (property) meta.setAttribute('property', property)
        meta.content = content
        document.head.appendChild(meta)
      }
    })
  }, [])

  return children
}

export default Layout