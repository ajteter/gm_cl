/**
 * SEO utilities for dynamic meta tag management and structured data generation
 */

// Default SEO configuration
const DEFAULT_SEO = {
  title: 'flybird.site - Free Online Games',
  description: 'Play free HTML5 games on mobile. Fast loading games optimized for mobile webview.',
  keywords: 'HTML5 games, mobile games, free games, browser games, webview games',
  author: 'flybird.site',
  type: 'website',
  locale: 'en_US',
  siteName: 'flybird.site',
  baseUrl: 'https://flybird.site',
  robots: 'index, follow'
};

const resolveAbsoluteUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${DEFAULT_SEO.baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
};

/**
 * Updates the document title
 * @param {string} title - The page title
 */
export const updateTitle = (title) => {
  if (typeof document !== 'undefined') {
    document.title = title;
  }
};

/**
 * Updates or creates a meta tag
 * @param {string} name - The meta tag name or property
 * @param {string} content - The meta tag content
 * @param {string} type - The type of meta tag ('name' or 'property')
 */
export const updateMetaTag = (name, content, type = 'name') => {
  if (typeof document === 'undefined') return;

  const selector = type === 'property' ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let metaTag = document.querySelector(selector);
  
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(type, name);
    document.head.appendChild(metaTag);
  }
  
  metaTag.setAttribute('content', content);
};

export const removeMetaTag = (name, type = 'name') => {
  if (typeof document === 'undefined') return;

  const selector = type === 'property' ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  const metaTag = document.querySelector(selector);

  if (metaTag) {
    metaTag.remove();
  }
};

/**
 * Updates multiple meta tags at once
 * @param {Object} metaTags - Object with meta tag names as keys and content as values
 * @param {string} type - The type of meta tags ('name' or 'property')
 */
export const updateMetaTags = (metaTags, type = 'name') => {
  Object.entries(metaTags).forEach(([name, content]) => {
    updateMetaTag(name, content, type);
  });
};

/**
 * Sets up basic page SEO metadata
 * @param {Object} seoData - SEO configuration object
 * @param {string} seoData.title - Page title
 * @param {string} seoData.description - Page description
 * @param {string} seoData.keywords - Page keywords
 * @param {string} seoData.canonical - Canonical URL
 * @param {string} seoData.image - Page image URL
 */
export const setPageSEO = (seoData = {}) => {
  const {
    title = DEFAULT_SEO.title,
    description = DEFAULT_SEO.description,
    keywords = DEFAULT_SEO.keywords,
    canonical,
    image,
    type = DEFAULT_SEO.type,
    robots = DEFAULT_SEO.robots
  } = seoData;
  const absoluteImage = resolveAbsoluteUrl(image);

  // Update document title
  updateTitle(title);

  // Update basic meta tags
  updateMetaTags({
    description,
    keywords,
    author: DEFAULT_SEO.author,
    robots
  });

  // Update Open Graph meta tags
  updateMetaTags({
    'og:type': type,
    'og:title': title,
    'og:description': description,
    'og:locale': DEFAULT_SEO.locale,
    'og:site_name': DEFAULT_SEO.siteName
  }, 'property');

  // Add image if provided
  if (absoluteImage) {
    updateMetaTag('og:image', absoluteImage, 'property');
    updateMetaTag('twitter:image', absoluteImage);
  } else {
    removeMetaTag('og:image', 'property');
    removeMetaTag('twitter:image');
  }

  // Add canonical URL if provided
  if (canonical) {
    updateMetaTag('og:url', canonical, 'property');
    updateCanonicalLink(canonical);
  }

  // Twitter Card meta tags
  updateMetaTags({
    'twitter:card': absoluteImage ? 'summary_large_image' : 'summary',
    'twitter:title': title,
    'twitter:description': description
  });
};

export const generateCollectionSEO = (currentPage = 1) => {
  const title = currentPage > 1
    ? `All Games - Page ${currentPage} | flybird.site`
    : 'All Games | flybird.site';

  const description = currentPage > 1
    ? `Browse page ${currentPage} of our free HTML5 games collection on flybird.site.`
    : 'Browse our collection of free HTML5 games for mobile on flybird.site.';

  const canonical = currentPage > 1
    ? `${DEFAULT_SEO.baseUrl}/game?page=${currentPage}`
    : `${DEFAULT_SEO.baseUrl}/game`;

  return {
    title,
    description,
    keywords: 'free online games, HTML5 games, mobile games, browser games, game list',
    canonical,
    type: 'website'
  };
};

/**

 * Updates or creates a canonical link tag
 * @param {string} url - The canonical URL
 */
export const updateCanonicalLink = (url) => {
  if (typeof document === 'undefined') return;

  let canonicalLink = document.querySelector('link[rel="canonical"]');
  
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  
  canonicalLink.setAttribute('href', url);
};

/**
 * Generates SEO data for a game page
 * @param {Object} game - Game object
 * @returns {Object} SEO configuration for the game
 */
export const generateGameSEO = (game) => {
  if (!game) return DEFAULT_SEO;

  const title = `${game.title} - Play Free Game | flybird.site`;
  const description = game.description || `Play ${game.title}, a fun ${game.category} game. Free HTML5 game optimized for mobile.`;
  const keywords = `${game.title}, ${game.category} games, HTML5 games, mobile games, free games`;
  const canonical = game.id
    ? `${DEFAULT_SEO.baseUrl}/game?id=${encodeURIComponent(game.id)}`
    : `${DEFAULT_SEO.baseUrl}/game`;
  const image = game.thumb || game.image;

  return {
    title,
    description,
    keywords,
    canonical,
    image,
    type: 'article'
  };
};

/**
 * Generates SEO data for the random game page
 * @param {Object} game - Current random game object
 * @returns {Object} SEO configuration for random game page
 */
export const generateRandomGameSEO = (game) => {
  const baseTitle = 'Random Game - Daily Free Game | flybird.site';
  const baseDescription = 'Play a new random HTML5 game every day. Discover exciting games selected daily from our collection.';
  
  if (!game) {
    return {
      title: baseTitle,
      description: baseDescription,
      keywords: 'random games, daily games, HTML5 games, mobile games, free games',
      canonical: `${DEFAULT_SEO.baseUrl}/game/random`,
      type: 'website'
    };
  }

  const title = `${game.title} - Today's Random Game | flybird.site`;
  const description = `Today's random game: ${game.title}. ${game.description || baseDescription}`;
  const keywords = `random games, ${game.title}, ${game.category} games, daily games, HTML5 games`;
  const canonical = `${DEFAULT_SEO.baseUrl}/game/random`;
  const image = game.thumb || game.image;

  return {
    title,
    description,
    keywords,
    canonical,
    image,
    type: 'article'
  };
};

/**
 * Generates SEO data for category/source pages
 * @param {string} category - Category or source name
 * @param {number} gameCount - Number of games in category
 * @returns {Object} SEO configuration for category page
 */
export const generateCategorySEO = (category, gameCount = 0) => {
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  const title = `${formattedCategory} Games - Free Games | flybird.site`;
  const description = `Play ${gameCount} free ${formattedCategory.toLowerCase()} HTML5 games. Mobile-optimized games that load fast and play smooth.`;
  const keywords = `${formattedCategory.toLowerCase()} games, HTML5 games, mobile games, free games, browser games`;
  const canonical = `${DEFAULT_SEO.baseUrl}/source/${category}`;

  return {
    title,
    description,
    keywords,
    canonical,
    type: 'website'
  };
};

/**
 * Generates structured data (JSON-LD) for a game
 * @param {Object} game - Game object
 * @returns {Object} JSON-LD structured data
 */
export const generateGameStructuredData = (game, options = {}) => {
  if (!game) return null;
  const url = options.url || (
    game.id
      ? `${DEFAULT_SEO.baseUrl}/game?id=${encodeURIComponent(game.id)}`
      : `${DEFAULT_SEO.baseUrl}/game`
  );
  const image = resolveAbsoluteUrl(options.image || game.thumb || game.image);

  return {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: game.title,
    description: game.description,
    genre: game.category,
    url,
    image,
    datePublished: game.date_published,
    dateModified: game.date_modified,
    publisher: {
      '@type': 'Organization',
      name: 'flybird.site',
      url: DEFAULT_SEO.baseUrl
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    applicationCategory: 'Game',
    operatingSystem: 'Web Browser',
    gamePlatform: 'Web Browser',
    isAccessibleForFree: true
  };
};

/**
 * Generates structured data for the website
 * @returns {Object} JSON-LD structured data for the website
 */
export const generateWebsiteStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'flybird.site',
    description: DEFAULT_SEO.description,
    url: DEFAULT_SEO.baseUrl,
    publisher: {
      '@type': 'Organization',
      name: 'flybird.site',
      url: DEFAULT_SEO.baseUrl
    }
  };
};

export const generateWebPageStructuredData = ({
  name,
  description,
  url
}) => {
  if (!name || !url) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: DEFAULT_SEO.siteName,
      url: DEFAULT_SEO.baseUrl
    }
  };
};

export const generateBreadcrumbStructuredData = (items = []) => {
  if (!items.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

export const generateCollectionStructuredData = (items = [], collectionUrl = `${DEFAULT_SEO.baseUrl}/game`) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: collectionUrl,
    name: 'All Games | flybird.site',
    description: 'Browse free HTML5 games optimized for mobile on flybird.site.',
    isPartOf: {
      '@type': 'WebSite',
      name: DEFAULT_SEO.siteName,
      url: DEFAULT_SEO.baseUrl
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((game, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: game.id
          ? `${DEFAULT_SEO.baseUrl}/game?id=${encodeURIComponent(game.id)}`
          : collectionUrl,
        name: game.title
      }))
    }
  }
}

/**
 * Injects structured data into the page
 * @param {Object} structuredData - JSON-LD structured data object
 * @param {string} id - Optional ID for the script tag
 */
export const injectStructuredData = (structuredData, id = 'structured-data') => {
  if (typeof document === 'undefined' || !structuredData) return;

  // Remove existing structured data with the same ID
  const existingScript = document.getElementById(id);
  if (existingScript) {
    existingScript.remove();
  }

  // Create and inject new structured data
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};

/**
 * Sets up complete SEO for a page including structured data
 * @param {Object} seoData - SEO configuration
 * @param {Object} structuredData - Optional structured data
 */
export const setupPageSEO = (seoData, structuredData = null) => {
  setPageSEO(seoData);
  
  if (structuredData) {
    injectStructuredData(structuredData);
  }
  
  // Always inject website structured data
  injectStructuredData(generateWebsiteStructuredData(), 'website-structured-data');
};

/**
 * Cleans up SEO meta tags (useful for SPA navigation)
 */
export const cleanupSEO = () => {
  if (typeof document === 'undefined') return;

  // Remove dynamic structured data scripts
  const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]:not([id="website-structured-data"])');
  structuredDataScripts.forEach(script => script.remove());
};

// Export default SEO configuration for external use
export { DEFAULT_SEO };
