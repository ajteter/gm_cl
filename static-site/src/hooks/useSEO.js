import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  setupPageSEO, 
  cleanupSEO, 
  generateGameSEO, 
  generateCollectionSEO,
  generateRandomGameSEO, 
  generateCategorySEO,
  generateWebPageStructuredData,
  generateBreadcrumbStructuredData,
  generateCollectionStructuredData,
  generateGameStructuredData,
  DEFAULT_SEO 
} from '../utils/seoUtils'

/**
 * Custom hook for managing SEO metadata and structured data
 * @param {Object} seoConfig - SEO configuration object
 * @param {Object} structuredData - Optional structured data object
 */
export default function useSEO(seoConfig = {}, structuredData = null, options = {}) {
  const location = useLocation()
  const enabled = options.enabled ?? true
  const seoSignature = useMemo(() => JSON.stringify({
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    canonical: seoConfig.canonical,
    image: seoConfig.image,
    type: seoConfig.type,
    robots: seoConfig.robots
  }), [seoConfig])
  const structuredDataSignature = useMemo(
    () => (structuredData ? JSON.stringify(structuredData) : ''),
    [structuredData]
  )

  useEffect(() => {
    if (!enabled) return undefined

    // Clean up previous SEO data
    cleanupSEO()

    // Set up new SEO data
    const finalSeoConfig = {
      ...DEFAULT_SEO,
      ...seoConfig,
      canonical: seoConfig.canonical || `${DEFAULT_SEO.baseUrl}${location.pathname}${location.search}`
    }

    setupPageSEO(finalSeoConfig, structuredData)

    // Cleanup function for when component unmounts or location changes
    return () => {
      cleanupSEO()
    }
  }, [enabled, location.pathname, location.search, seoSignature, structuredDataSignature])
}

/**
 * Hook specifically for game pages
 * @param {Object} game - Game object
 */
export function useGameSEO(game, options = {}) {
  const fallbackCanonical = options.gameId
    ? `${DEFAULT_SEO.baseUrl}/game?id=${encodeURIComponent(options.gameId)}`
    : `${DEFAULT_SEO.baseUrl}/game`
  const seoConfig = game ? generateGameSEO(game) : {
    title: 'Game | flybird.site',
    description: 'Play free HTML5 games on flybird.site. Open a game to start playing in a mobile-friendly view.',
    keywords: 'play game, free online games, HTML5 games, mobile games',
    canonical: fallbackCanonical,
    type: 'website',
    robots: options.notFound ? 'noindex, follow' : 'index, follow'
  }
  const pageName = game ? game.title : 'Game'
  const pageSchema = generateWebPageStructuredData({
    name: seoConfig.title,
    description: seoConfig.description,
    url: seoConfig.canonical
  })
  const breadcrumbSchema = generateBreadcrumbStructuredData([
    { name: 'Home', url: DEFAULT_SEO.baseUrl },
    { name: 'Games', url: `${DEFAULT_SEO.baseUrl}/game` },
    { name: pageName, url: seoConfig.canonical }
  ])
  const structuredData = [
    game ? generateGameStructuredData(game, {
      url: seoConfig.canonical,
      image: seoConfig.image
    }) : null,
    pageSchema,
    breadcrumbSchema
  ].filter(Boolean)
  
  useSEO(seoConfig, structuredData, options)
}

/**
 * Hook specifically for collection/list pages
 * @param {Array} games - List of game objects
 * @param {number} currentPage - Current pagination page
 */
export function useCollectionSEO(games = [], currentPage = 1, options = {}) {
  const seoConfig = generateCollectionSEO(currentPage)
  const structuredData = [
    generateCollectionStructuredData(games, seoConfig.canonical),
    generateWebPageStructuredData({
      name: seoConfig.title,
      description: seoConfig.description,
      url: seoConfig.canonical
    }),
    generateBreadcrumbStructuredData([
      { name: 'Home', url: DEFAULT_SEO.baseUrl },
      { name: 'Games', url: seoConfig.canonical }
    ])
  ].filter(Boolean)

  useSEO(seoConfig, structuredData, options)
}

/**
 * Hook specifically for random game pages
 * @param {Object} game - Current random game object
 */
export function useRandomGameSEO(game) {
  const seoConfig = generateRandomGameSEO(game)
  const structuredData = [
    game ? generateGameStructuredData(game, {
      url: seoConfig.canonical,
      image: seoConfig.image
    }) : null,
    generateWebPageStructuredData({
      name: seoConfig.title,
      description: seoConfig.description,
      url: seoConfig.canonical
    }),
    generateBreadcrumbStructuredData([
      { name: 'Home', url: DEFAULT_SEO.baseUrl },
      { name: 'Random Game', url: seoConfig.canonical }
    ])
  ].filter(Boolean)
  
  useSEO(seoConfig, structuredData)
}

/**
 * Hook specifically for category/source pages
 * @param {string} category - Category or source name
 * @param {number} gameCount - Number of games in category
 */
export function useCategorySEO(category, gameCount = 0) {
  const seoConfig = generateCategorySEO(category, gameCount)
  
  useSEO(seoConfig)
}

/**
 * Hook for home page SEO
 * @param {number} totalGames - Total number of games
 * @param {number} currentPage - Current page number
 */
export function useHomeSEO(_totalGames = 0, currentPage = 1) {
  const title = currentPage > 1 
    ? `Floppy Bird - Page ${currentPage} | flybird.site`
    : 'Floppy Bird | flybird.site'
  
  const description = currentPage > 1
    ? `Play Floppy Bird on flybird.site and explore page ${currentPage} of our mobile-friendly free online games.`
    : 'Play Floppy Bird on flybird.site and challenge the global leaderboard. Fast mobile-friendly gameplay with quick restart.'

  const seoConfig = {
    title,
    description,
    keywords: 'Floppy Bird, floppy bird game, free online games, HTML5 games, mobile games',
    type: 'website',
    canonical: `${DEFAULT_SEO.baseUrl}/floppybird`,
    image: '/games/floppybird/assets/splash.png'
  }
  const structuredData = [
    generateWebPageStructuredData({
      name: seoConfig.title,
      description: seoConfig.description,
      url: seoConfig.canonical
    }),
    generateBreadcrumbStructuredData([
      { name: 'Home', url: seoConfig.canonical }
    ])
  ]

  useSEO(seoConfig, structuredData)
}

/**
 * Hook for play page SEO
 * @param {string} gameUrl - Game URL being played
 */
export function usePlaySEO(_gameUrl) {
  const seoConfig = {
    title: 'Play Game | flybird.site',
    description: 'Play free HTML5 game on flybird.site. This player page opens the selected game in a focused mobile-friendly view.',
    keywords: 'play game, HTML5 games, mobile games, free games',
    type: 'website',
    canonical: `${DEFAULT_SEO.baseUrl}/game/play`,
    robots: 'noindex, follow'
  }
  const structuredData = generateWebPageStructuredData({
    name: seoConfig.title,
    description: seoConfig.description,
    url: seoConfig.canonical
  })

  useSEO(seoConfig, structuredData)
}

/**
 * Hook for privacy page SEO
 */
export function usePrivacySEO() {
  const seoConfig = {
    title: 'Privacy Policy & Disclaimer | flybird.site',
    description: 'Privacy policy and disclaimer for flybird.site. Information about data collection and third-party content.',
    keywords: 'privacy policy, disclaimer, terms of service',
    type: 'website',
    canonical: `${DEFAULT_SEO.baseUrl}/privacy-policy`
  }
  const structuredData = [
    generateWebPageStructuredData({
      name: seoConfig.title,
      description: seoConfig.description,
      url: seoConfig.canonical
    }),
    generateBreadcrumbStructuredData([
      { name: 'Home', url: DEFAULT_SEO.baseUrl },
      { name: 'Privacy Policy', url: seoConfig.canonical }
    ])
  ]

  useSEO(seoConfig, structuredData)
}

/**
 * Hook for 404 not found page SEO
 */
export function useNotFoundSEO() {
  const seoConfig = {
    title: 'Page Not Found | flybird.site',
    description: 'The page you are looking for could not be found. Browse our collection of free HTML5 games.',
    keywords: 'page not found, 404, HTML5 games, mobile games',
    type: 'website',
    robots: 'noindex, follow'
  }

  useSEO(seoConfig)
}
