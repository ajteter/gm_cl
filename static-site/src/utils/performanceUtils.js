/**
 * Performance optimization utilities
 */

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  // Preload games.json as it's needed on most pages
  const gamesJsonLink = document.createElement('link');
  gamesJsonLink.rel = 'preload';
  gamesJsonLink.href = '/games.json';
  gamesJsonLink.as = 'fetch';
  gamesJsonLink.crossOrigin = 'anonymous';
  document.head.appendChild(gamesJsonLink);
};

/**
 * Add resource hints for external domains
 */
export const addResourceHints = () => {
  const domains = [
    'https://gamemonetize.com',
    'https://html5.gamemonetize.com',
    'https://api.gamemonetize.com',
    'https://ads.gamemonetize.com',
    'https://cdn.gamemonetize.com'
  ];

  domains.forEach(domain => {
    // DNS prefetch
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = domain;
    document.head.appendChild(dnsPrefetch);

    // Preconnect for critical domains
    if (domain.includes('html5.gamemonetize.com') || domain.includes('api.gamemonetize.com')) {
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = domain;
      preconnect.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect);
    }
  });
};

/**
 * Lazy load images with intersection observer
 */
export const createLazyImageObserver = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    return imageObserver;
  }
  return null;
};

/**
 * Prefetch route chunks when hovering over links
 */
export const setupRoutePrefetching = () => {
  const prefetchedRoutes = new Set();

  const prefetchRoute = (path) => {
    if (prefetchedRoutes.has(path)) return;
    
    // This would work with dynamic imports in a more complex setup
    // For now, we rely on Vite's automatic code splitting
    prefetchedRoutes.add(path);
  };

  // Add hover listeners to navigation links
  document.addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'A' && e.target.href) {
      const url = new URL(e.target.href);
      if (url.origin === window.location.origin) {
        prefetchRoute(url.pathname);
      }
    }
  });
};

/**
 * Optimize third-party script loading
 */
export const loadThirdPartyScripts = () => {
  // Load non-critical scripts after page load
  window.addEventListener('load', () => {
    // Example: Load analytics or other non-critical scripts
    // This can be extended based on specific third-party requirements
  });
};

/**
 * Initialize all performance optimizations
 */
export const initializePerformanceOptimizations = () => {
  // Run immediately
  addResourceHints();
  
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      preloadCriticalResources();
      setupRoutePrefetching();
      loadThirdPartyScripts();
    });
  } else {
    preloadCriticalResources();
    setupRoutePrefetching();
    loadThirdPartyScripts();
  }
};