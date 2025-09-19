/**
 * Performance monitoring utilities for Core Web Vitals
 */

/**
 * Performance metrics collector
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
    this.isSupported = this.checkSupport();
  }

  checkSupport() {
    return (
      'PerformanceObserver' in window &&
      'performance' in window &&
      'getEntriesByType' in performance
    );
  }

  /**
   * Initialize all performance monitoring
   */
  init() {
    if (!this.isSupported) {
      console.warn('Performance monitoring not supported in this browser');
      return;
    }

    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();
    this.observeNavigationTiming();
    this.observeResourceTiming();
  }

  /**
   * Observe Largest Contentful Paint (LCP)
   */
  observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = Math.round(lastEntry.startTime);
        this.reportMetric('LCP', this.metrics.lcp);
      });
      
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('LCP observation failed:', error);
    }
  }

  /**
   * Observe First Input Delay (FID)
   */
  observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.fid = Math.round(entry.processingStart - entry.startTime);
          this.reportMetric('FID', this.metrics.fid);
        });
      });
      
      observer.observe({ type: 'first-input', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FID observation failed:', error);
    }
  }

  /**
   * Observe Cumulative Layout Shift (CLS)
   */
  observeCLS() {
    try {
      let clsValue = 0;
      let sessionValue = 0;
      let sessionEntries = [];

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            if (sessionValue &&
                entry.startTime - lastSessionEntry.startTime < 1000 &&
                entry.startTime - firstSessionEntry.startTime < 5000) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }

            if (sessionValue > clsValue) {
              clsValue = sessionValue;
              this.metrics.cls = Math.round(clsValue * 1000) / 1000;
              this.reportMetric('CLS', this.metrics.cls);
            }
          }
        });
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('CLS observation failed:', error);
    }
  }

  /**
   * Observe First Contentful Paint (FCP)
   */
  observeFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = Math.round(entry.startTime);
            this.reportMetric('FCP', this.metrics.fcp);
          }
        });
      });
      
      observer.observe({ type: 'paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FCP observation failed:', error);
    }
  }

  /**
   * Observe Time to First Byte (TTFB)
   */
  observeTTFB() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.metrics.ttfb = Math.round(entry.responseStart - entry.requestStart);
            this.reportMetric('TTFB', this.metrics.ttfb);
          }
        });
      });
      
      observer.observe({ type: 'navigation', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('TTFB observation failed:', error);
    }
  }

  /**
   * Observe navigation timing
   */
  observeNavigationTiming() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        this.metrics.domContentLoaded = Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart);
        this.metrics.loadComplete = Math.round(navigation.loadEventEnd - navigation.navigationStart);
        
        this.reportMetric('DOM Content Loaded', this.metrics.domContentLoaded);
        this.reportMetric('Load Complete', this.metrics.loadComplete);
      }
    });
  }

  /**
   * Observe resource timing
   */
  observeResourceTiming() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.initiatorType === 'fetch' && entry.name.includes('games.json')) {
          this.metrics.gamesJsonLoadTime = Math.round(entry.responseEnd - entry.requestStart);
          this.reportMetric('Games JSON Load Time', this.metrics.gamesJsonLoadTime);
        }
      });
    });
    
    observer.observe({ type: 'resource', buffered: true });
    this.observers.push(observer);
  }

  /**
   * Report metric (in development, log to console; in production, could send to analytics)
   */
  reportMetric(name, value) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}: ${value}${this.getUnit(name)}`);
    }
    
    // In production, you could send to analytics service
    // Example: analytics.track('performance_metric', { name, value });
  }

  /**
   * Get appropriate unit for metric
   */
  getUnit(metricName) {
    const timeMetrics = ['LCP', 'FID', 'FCP', 'TTFB', 'DOM Content Loaded', 'Load Complete', 'Games JSON Load Time'];
    return timeMetrics.includes(metricName) ? 'ms' : '';
  }

  /**
   * Get all collected metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Get performance score based on Core Web Vitals thresholds
   */
  getPerformanceScore() {
    const scores = {};
    
    // LCP scoring (Good: <2.5s, Needs Improvement: 2.5s-4s, Poor: >4s)
    if (this.metrics.lcp) {
      if (this.metrics.lcp <= 2500) scores.lcp = 'good';
      else if (this.metrics.lcp <= 4000) scores.lcp = 'needs-improvement';
      else scores.lcp = 'poor';
    }

    // FID scoring (Good: <100ms, Needs Improvement: 100ms-300ms, Poor: >300ms)
    if (this.metrics.fid) {
      if (this.metrics.fid <= 100) scores.fid = 'good';
      else if (this.metrics.fid <= 300) scores.fid = 'needs-improvement';
      else scores.fid = 'poor';
    }

    // CLS scoring (Good: <0.1, Needs Improvement: 0.1-0.25, Poor: >0.25)
    if (this.metrics.cls !== undefined) {
      if (this.metrics.cls <= 0.1) scores.cls = 'good';
      else if (this.metrics.cls <= 0.25) scores.cls = 'needs-improvement';
      else scores.cls = 'poor';
    }

    return scores;
  }

  /**
   * Clean up observers
   */
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;