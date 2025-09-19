import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  setupPageSEO, 
  cleanupSEO, 
  generateGameSEO, 
  generateRandomGameSEO, 
  generateCategorySEO,
  generateGameStructuredData,
  DEFAULT_SEO 
} from '../utils/seoUtils'

/**
 * Custom hook for managing SEO metadata and structured data
 * @param {Object} seoConfig - SEO configuration object
 * @param {Object} structuredData - Optional structured data object
 */
export default function useSEO(seoConfig = {}, structuredData = null) {
  const location = useLocation()

  useEffect(() => {
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
  }, [location.pathname, location.search, seoConfig.title, seoConfig.description, structuredData])
}

/**
 * Hook specifically for game pages
 * @param {Object} game - Game object
 */
export function useGameSEO(game) {
  const seoConfig = game ? generateGameSEO(game) : {}
  const structuredData = game ? generateGameStructuredData(game) : null
  
  useSEO(seoConfig, structuredData)
}

/**
 * Hook specifically for random game pages
 * @param {Object} game - Current random game object
 */
export function useRandomGameSEO(game) {
  const seoConfig = generateRandomGameSEO(game)
  const structuredData = game ? generateGameStructuredData(game) : null
  
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
export function useHomeSEO(totalGames = 0, currentPage = 1) {
  const title = currentPage > 1 
    ? `H5 Games - Page ${currentPage} | Free Mobile Games`
    : 'H5 Games - Free Mobile Games'
  
  const description = currentPage > 1
    ? `Browse page ${currentPage} of ${totalGames} free HTML5 games. Mobile-optimized games that load fast and play smooth.`
    : `Play ${totalGames} free HTML5 games on mobile. Fast loading games optimized for mobile webview.`

  const seoConfig = {
    title,
    description,
    keywords: 'HTML5 games, mobile games, free games, browser games, webview games',
    type: 'website'
  }
  
  useSEO(seoConfig)
}

/**
 * Hook for play page SEO
 * @param {string} gameUrl - Game URL being played
 */
export function usePlaySEO(gameUrl) {
  const seoConfig = {
    title: 'Play Game - H5 Games',
    description: 'Play free HTML5 game. Mobile-optimized gaming experience.',
    keywords: 'play game, HTML5 games, mobile games, free games',
    type: 'website'
  }
  
  useSEO(seoConfig)
}

/**
 * Hook for privacy page SEO
 */
export function usePrivacySEO() {
  const seoConfig = {
    title: 'Privacy Policy & Disclaimer - H5 Games',
    description: 'Privacy policy and disclaimer for H5 Games. Information about data collection and third-party content.',
    keywords: 'privacy policy, disclaimer, terms of service',
    type: 'website'
  }
  
  useSEO(seoConfig)
}

/**
 * Hook for 404 not found page SEO
 */
export function useNotFoundSEO() {
  const seoConfig = {
    title: 'Page Not Found - H5 Games',
    description: 'The page you are looking for could not be found. Browse our collection of free HTML5 games.',
    keywords: 'page not found, 404, HTML5 games, mobile games',
    type: 'website'
  }
  
  useSEO(seoConfig)
}