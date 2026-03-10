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
 * Initialize performance optimizations
 */
export const initializePerformanceOptimizations = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      preloadCriticalResources();
    });
  } else {
    preloadCriticalResources();
  }
};